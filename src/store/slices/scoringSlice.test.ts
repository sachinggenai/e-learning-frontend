import { configureStore } from '@reduxjs/toolkit';
import scoringReducer, { calculateScore, fetchScoringConfig } from './scoringSlice';
import { scoringService } from '../../services/ScoringService';

jest.mock('../../services/ScoringService', () => ({
  scoringService: {
    getScoringConfig: jest.fn(),
    updateScoringConfig: jest.fn(),
    calculateScore: jest.fn(),
    validateScoringConfig: jest.fn(),
  },
}));

describe('scoringSlice async error mapping', () => {
  const mockedService = scoringService as jest.Mocked<typeof scoringService>;

  const makeStore = () =>
    configureStore({
      reducer: {
        scoring: scoringReducer,
      },
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores normalized error message when fetching config fails', async () => {
    mockedService.getScoringConfig.mockRejectedValueOnce({
      status: 404,
      code: 'NOT_FOUND',
      message: 'Course not found',
    } as any);

    const store = makeStore();
    await store.dispatch(fetchScoringConfig('course-missing') as any);

    expect(store.getState().scoring.error).toBe('Course not found');
  });

  it('stores score result on successful calculation', async () => {
    mockedService.calculateScore.mockResolvedValueOnce({
      totalScore: 80,
      maxScore: 100,
      percentage: 80,
      passed: true,
      passingScore: 70,
      componentResults: [],
      attemptNumber: 1,
      remainingAttempts: null,
    } as any);

    const store = makeStore();
    await store.dispatch(
      calculateScore({
        courseId: 'course-1',
        answers: [
          {
            componentId: 'cmp-1',
            componentType: 'mcq',
            responses: [{ questionId: 'q-1', selectedOptionIds: ['opt-1'] }],
          },
        ],
      }) as any
    );

    expect(store.getState().scoring.currentResult?.percentage).toBe(80);
    expect(store.getState().scoring.error).toBeNull();
  });
});
