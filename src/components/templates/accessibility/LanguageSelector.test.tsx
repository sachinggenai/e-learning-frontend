import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  LanguageSelectorData,
  LanguageSelectorPreview,
  LanguageSelectorEditor,
} from './LanguageSelector';

const mockData: LanguageSelectorData = {
  title: 'Select Language',
  options: [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية', rtl: true },
  ],
  defaultCode: 'en',
  fallbackCode: 'en',
  persistPreference: false,
};

describe('LanguageSelectorPreview', () => {
  const mockOnInteraction = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
    mockOnComplete.mockClear();
    localStorage.clear();
  });

  test('renders title and all language options', () => {
    render(<LanguageSelectorPreview data={mockData} />);
    expect(screen.getByText('Select Language')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('العربية')).toBeInTheDocument();
  });

  test('renders language code badges', () => {
    render(<LanguageSelectorPreview data={mockData} />);
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('FR')).toBeInTheDocument();
  });

  test('fires language_changed and onComplete when option is selected', () => {
    render(
      <LanguageSelectorPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );
    fireEvent.click(screen.getByText('Français'));
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'language_changed',
      value: 'fr',
    }));
    expect(mockOnComplete).toHaveBeenCalled();
  });

  test('marks selected option with is-selected class', () => {
    const { container } = render(<LanguageSelectorPreview data={mockData} />);
    const enOption = container.querySelector('.tpl-language-selector__option.is-selected');
    expect(enOption).toBeInTheDocument();
  });

  test('persists selection to localStorage when persistPreference is true', () => {
    const storage = new Map<string, string>();
    const originalLocalStorage = window.localStorage;
    const localStorageMock = {
      getItem: jest.fn((key: string) => storage.get(key) ?? null),
      setItem: jest.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      removeItem: jest.fn((key: string) => {
        storage.delete(key);
      }),
      clear: jest.fn(() => {
        storage.clear();
      }),
      key: jest.fn(),
      length: 0,
    } as unknown as Storage;
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });
    render(
      <LanguageSelectorPreview
        data={{ ...mockData, persistPreference: true }}
        onInteraction={mockOnInteraction}
      />
    );
    fireEvent.click(screen.getByRole('option', { name: /Français/i }));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('tpl-language-selector-pref', 'fr');
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
    });
  });

  test('fires language_fallback_used when selected code is unavailable', () => {
    render(
      <LanguageSelectorPreview
        data={{ ...mockData, defaultCode: 'de', fallbackCode: 'en' }}
        onInteraction={mockOnInteraction}
      />
    );
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'language_fallback_used',
    }));
  });

  test('renders RTL badge for RTL languages', () => {
    render(<LanguageSelectorPreview data={mockData} />);
    expect(screen.getByText(/rtl/i)).toBeInTheDocument();
  });
});

describe('LanguageSelectorEditor', () => {
  test('renders title field', () => {
    const onChange = jest.fn();
    render(<LanguageSelectorEditor data={mockData} onChange={onChange} />);
    expect(screen.getByDisplayValue('Select Language')).toBeInTheDocument();
  });

  test('calls onChange when title is updated', () => {
    const onChange = jest.fn();
    render(<LanguageSelectorEditor data={mockData} onChange={onChange} />);
    const titleInput = screen.getByDisplayValue('Select Language');
    fireEvent.change(titleInput, { target: { value: 'Choose Language' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ title: 'Choose Language' }),
    }));
  });

  test('renders Add Language button', () => {
    const onChange = jest.fn();
    render(<LanguageSelectorEditor data={mockData} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Add Language/i })).toBeInTheDocument();
  });

  test('calls onChange when Add Language is clicked', () => {
    const onChange = jest.fn();
    render(<LanguageSelectorEditor data={mockData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Language/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
