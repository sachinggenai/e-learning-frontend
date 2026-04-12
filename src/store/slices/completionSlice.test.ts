import { configureStore } from '@reduxjs/toolkit';
import completionReducer, { recordInteraction, submitPageComplete } from './completionSlice';
import { completionService } from '../../services/CompletionService';

jest.mock('../../services/CompletionService', () => ({
  completionService: {
    getCourseCompletion: jest.fn(),
    getPageCompletion: jest.fn(),
    recordInteraction: jest.fn(),
    submitPageCompletion: jest.fn(),
    listInteractions: jest.fn(),
  },
}));

describe('completionSlice integration updates', () => {
  const mockedService = completionService as jest.Mocked<typeof completionService>;

  const makeStore = () =>
    configureStore({
      reducer: {
        completion: completionReducer,
      },
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates page completion state when submit succeeds', async () => {
    mockedService.submitPageCompletion.mockResolvedValueOnce({
      pageId: 'page-1',
      title: 'Page 1',
      completed: true,
      strategy: 'all',
      components: [
        {
          componentId: 'cmp-1',
          completed: true,
          completionType: 'interaction',
          threshold: 0,
        },
      ],
    } as any);

    const store = makeStore();
    await store.dispatch(
      submitPageComplete({
        courseId: 'course-1',
        pageId: 'page-1',
        componentStates: [{ componentId: 'cmp-1', completed: true }],
      }) as any
    );

    expect(store.getState().completion.pages['page-1']?.completed).toBe(true);
    expect(store.getState().completion.error).toBeNull();
  });

  it('stores normalized error message when interaction logging fails', async () => {
    mockedService.recordInteraction.mockRejectedValueOnce({
      status: 429,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests',
    } as any);

    const store = makeStore();
    await store.dispatch(
      recordInteraction({
        courseId: 'course-1',
        event: {
          pageId: 'page-1',
          componentId: 'cmp-1',
          interactionType: 'click',
        },
      }) as any
    );

    expect(store.getState().completion.error).toBe('Too many requests');
  });
});
