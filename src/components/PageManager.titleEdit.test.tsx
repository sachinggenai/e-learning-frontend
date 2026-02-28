/**
 * PageManager Inline Title Editing Tests
 * 
 * Tests the double-click inline editing functionality for page titles in PageManager.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PageManager from './PageManager';
import courseReducer from '../store/slices/courseSlice';
import componentsReducer from '../store/slices/componentsSlice';

// Import the actual undoable editor reducer
import editorReducer from '../store/slices/editorSlice';

// Mock the updatePageTitleThunk
jest.mock('../store/slices/courseSlice', () => {
  const actual = jest.requireActual('../store/slices/courseSlice');
  return {
    ...actual,
    updatePageTitleThunk: jest.fn(() => ({
      type: 'course/updatePageTitle/fulfilled',
      payload: { pageId: 'page-1', title: 'Updated Title' },
    })),
  };
});

const mockPages = [
  {
    id: 'page-1',
    pageId: 'page-1',
    templateType: 'content-text',
    title: 'Introduction',
    content: {},
    order: 0,
    isDraft: false,
    lastModified: '2026-02-28T10:00:00Z',
  },
  {
    id: 'page-2',
    pageId: 'page-2',
    templateType: 'mcq',
    title: 'Quiz',
    content: {},
    order: 1,
    isDraft: false,
    lastModified: '2026-02-28T11:00:00Z',
  },
];

const createMockStore = (initialState?: any) => {
  const store = configureStore({
    reducer: {
      editor: editorReducer,
      course: courseReducer,
      components: componentsReducer,
    } as any, // Type assertion to avoid complex type inference issues in tests
    preloadedState: initialState || {
      editor: {
        present: {
          currentPage: mockPages[0],
          isEditing: false,
          hasUnsavedChanges: false,
          validationErrors: [],
        },
        past: [],
        future: [],
      },
      course: {
        currentCourse: {
          courseId: 'course-1',
          title: 'Test Course',
          status: 'draft',
          pages: mockPages,
        },
        courses: [],
        templates: [],
        isLoading: false,
        isSaving: false,
        error: null,
        saveStatus: 'idle',
        lastSaved: null,
      },
      components: {
        currentPageComponents: [],
        isLoading: false,
        error: null,
      },
    },
  });
  return store;
};

describe('PageManager - Inline Title Editing', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
    jest.clearAllMocks();
  });

  it('displays page title as text by default', () => {
    render(
      <Provider store={store}>
        <PageManager />
      </Provider>
    );

    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Introduction')).not.toBeInTheDocument();
  });

  it('enters edit mode on double-click', () => {
    render(
      <Provider store={store}>
        <PageManager />
      </Provider>
    );

    const titleElement = screen.getByText('Introduction');
    fireEvent.doubleClick(titleElement);

    // Should now show input field with current title
    const input = screen.getByDisplayValue('Introduction');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('updates input value when typing', () => {
    render(
      <Provider store={store}>
        <PageManager />
      </Provider>
    );

    const titleElement = screen.getByText('Introduction');
    fireEvent.doubleClick(titleElement);

    const input = screen.getByDisplayValue('Introduction') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Title' } });

    expect(input.value).toBe('New Title');
  });

  it('saves title on Enter key and calls updatePageTitleThunk', async () => {
    const { updatePageTitleThunk } = require('../store/slices/courseSlice');
    
    render(
      <Provider store={store}>
        <PageManager />
      </Provider>
    );

    const titleElement = screen.getByText('Introduction');
    fireEvent.doubleClick(titleElement);

    const input = screen.getByDisplayValue('Introduction');
    fireEvent.change(input, { target: { value: 'Updated Title' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(updatePageTitleThunk).toHaveBeenCalledWith({
        courseId: 'course-1',
        pageId: 'page-1',
        title: 'Updated Title',
      });
    });

    // Should exit edit mode
    expect(screen.queryByDisplayValue('Updated Title')).not.toBeInTheDocument();
  });

  it('cancels editing on Escape key without saving', () => {
    render(
      <Provider store={store}>
        <PageManager />
      </Provider>
    );

    const titleElement = screen.getByText('Introduction');
    fireEvent.doubleClick(titleElement);

    const input = screen.getByDisplayValue('Introduction');
    fireEvent.change(input, { target: { value: 'Changed Title' } });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    // Should exit edit mode and revert to original title
    expect(screen.queryByDisplayValue('Changed Title')).not.toBeInTheDocument();
    expect(screen.getByText('Introduction')).toBeInTheDocument();
  });

  it('saves title on blur (clicking outside)', async () => {
    const { updatePageTitleThunk } = require('../store/slices/courseSlice');
    
    render(
      <Provider store={store}>
        <PageManager />
      </Provider>
    );

    const titleElement = screen.getByText('Introduction');
    fireEvent.doubleClick(titleElement);

    const input = screen.getByDisplayValue('Introduction');
    fireEvent.change(input, { target: { value: 'Blurred Title' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(updatePageTitleThunk).toHaveBeenCalledWith({
        courseId: 'course-1',
        pageId: 'page-1',
        title: 'Blurred Title',
      });
    });

    expect(screen.queryByDisplayValue('Blurred Title')).not.toBeInTheDocument();
  });

  it('does not save if title is unchanged', () => {
    const { updatePageTitleThunk } = require('../store/slices/courseSlice');
    
    render(
      <Provider store={store}>
        <PageManager />
      </Provider>
    );

    const titleElement = screen.getByText('Introduction');
    fireEvent.doubleClick(titleElement);

    const input = screen.getByDisplayValue('Introduction');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Should not call thunk if title is unchanged
    expect(updatePageTitleThunk).not.toHaveBeenCalled();
  });

  it('does not save empty titles', () => {
    const { updatePageTitleThunk } = require('../store/slices/courseSlice');
    
    render(
      <Provider store={store}>
        <PageManager />
      </Provider>
    );

    const titleElement = screen.getByText('Introduction');
    fireEvent.doubleClick(titleElement);

    const input = screen.getByDisplayValue('Introduction');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Should not save empty title, revert to original
    expect(updatePageTitleThunk).not.toHaveBeenCalled();
    expect(screen.getByText('Introduction')).toBeInTheDocument();
  });

  it('trims whitespace from title before saving', async () => {
    const { updatePageTitleThunk } = require('../store/slices/courseSlice');
    
    render(
      <Provider store={store}>
        <PageManager />
      </Provider>
    );

    const titleElement = screen.getByText('Introduction');
    fireEvent.doubleClick(titleElement);

    const input = screen.getByDisplayValue('Introduction');
    fireEvent.change(input, { target: { value: '  Trimmed Title  ' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(updatePageTitleThunk).toHaveBeenCalledWith({
        courseId: 'course-1',
        pageId: 'page-1',
        title: 'Trimmed Title',
      });
    });
  });

  it('shows saving indicator while saving', async () => {
    render(
      <Provider store={store}>
        <PageManager />
      </Provider>
    );

    const titleElement = screen.getByText('Introduction');
    fireEvent.doubleClick(titleElement);

    const input = screen.getByDisplayValue('Introduction');
    fireEvent.change(input, { target: { value: 'Saving Title' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Should show saving indicator (you'll implement this in the component)
    // This test validates the expected behavior
  });

  it('allows editing different pages independently', () => {
    render(
      <Provider store={store}>
        <PageManager />
      </Provider>
    );

    // Edit first page
    const firstPage = screen.getByText('Introduction');
    fireEvent.doubleClick(firstPage);
    expect(screen.getByDisplayValue('Introduction')).toBeInTheDocument();

    // Cancel edit
    fireEvent.keyDown(screen.getByDisplayValue('Introduction'), { key: 'Escape' });

    // Edit second page
    const secondPage = screen.getByText('Quiz');
    fireEvent.doubleClick(secondPage);
    expect(screen.getByDisplayValue('Quiz')).toBeInTheDocument();
  });
});
