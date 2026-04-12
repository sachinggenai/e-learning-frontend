import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockDispatch = jest.fn();

const mockState = {
  course: {
    currentCourse: {
      courseId: 'course-1',
      title: 'Course Preview',
      pages: [
        {
          pageId: 'page-1',
          title: 'Page 1',
          order: 0,
          components: [],
        },
      ],
    },
  },
  theme: {
    courseTheme: {
      overrides: undefined,
    },
  },
  components: {
    byPage: {
      'page-1': [
        {
          componentId: 'cmp-1',
          componentType: 'mcq',
          data: {},
        },
        {
          componentId: 'cmp-2',
          componentType: 'multiple-select',
          data: {},
        },
        {
          componentId: 'cmp-3',
          componentType: 'true-false',
          data: {},
        },
        {
          componentId: 'cmp-4',
          componentType: 'fill-blanks',
          data: {},
        },
        {
          componentId: 'cmp-5',
          componentType: 'knowledge-check',
          data: {},
        },
      ],
    },
  },
};

jest.mock('../store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => selector(mockState),
}));

const mockFetchComponents = jest.fn((payload) => ({ type: 'components/fetch', payload }));
const mockRecordInteraction = jest.fn((payload) => ({ type: 'completion/recordInteraction', payload }));
const mockSubmitPageComplete = jest.fn((payload) => ({ type: 'completion/submitPageComplete', payload }));
const mockCalculateScore = jest.fn((payload) => ({ type: 'scoring/calculate', payload }));

jest.mock('../store/slices/componentsSlice', () => ({
  fetchComponents: (payload: any) => mockFetchComponents(payload),
}));

jest.mock('../store/slices/completionSlice', () => ({
  recordInteraction: (payload: any) => mockRecordInteraction(payload),
  submitPageComplete: (payload: any) => mockSubmitPageComplete(payload),
}));

jest.mock('../store/slices/scoringSlice', () => ({
  calculateScore: (payload: any) => mockCalculateScore(payload),
}));

jest.mock('../components/PageWrapper', () => ({
  PageWrapper: ({ onInteraction, onPageComplete }: any) => (
    <div>
      <button
        onClick={() =>
          onInteraction({
            componentId: 'cmp-1',
            interactionType: 'submit',
            interactionId: 'q-1',
            value: 'opt-1',
            score: 1,
            maxScore: 1,
            isCorrect: true,
            completed: true,
          })
        }
      >
        Trigger Interaction
      </button>
      <button
        onClick={() =>
          onInteraction({
            componentId: 'cmp-2',
            interactionType: 'submit',
            interactionId: 'multiple-select',
            value: ['opt-a', 'opt-b'],
            score: 2,
            maxScore: 2,
            isCorrect: true,
            completed: true,
          })
        }
      >
        Trigger Multi Select
      </button>
      <button
        onClick={() =>
          onInteraction({
            componentId: 'cmp-3',
            interactionType: 'submit',
            value: true,
            score: 1,
            maxScore: 1,
            isCorrect: true,
            completed: true,
          })
        }
      >
        Trigger True False
      </button>
      <button
        onClick={() =>
          onInteraction({
            componentId: 'cmp-4',
            interactionType: 'submit',
            value: { blankA: 'alpha', blankB: 'beta' },
            score: 2,
            maxScore: 2,
            isCorrect: true,
            completed: true,
          })
        }
      >
        Trigger Fill Blanks
      </button>
      <button
        onClick={() =>
          onInteraction({
            componentId: 'cmp-5',
            interactionType: 'submit',
            interactionId: 'knowledge-check',
            value: { q1: 'opt-1', q2: 'opt-2' },
            score: 2,
            maxScore: 2,
            isCorrect: true,
            completed: true,
          })
        }
      >
        Trigger Knowledge Check
      </button>
      <button onClick={() => onPageComplete('page-1')}>Trigger Page Complete</button>
    </div>
  ),
}));

jest.mock('../components/ScoringUI', () => ({
  ScoreSummary: () => <div data-testid="score-summary">Score Summary</div>,
}));

import PreviewV2 from './PreviewV2';

describe('PreviewV2 integration dispatches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockImplementation(() => ({
      unwrap: () => Promise.resolve({}),
    }));
  });

  it('dispatches canonical interaction, scoring, and completion actions from preview events', async () => {
    render(<PreviewV2 />);

    fireEvent.click(screen.getByText('Trigger Interaction'));

    await waitFor(() => {
      expect(mockRecordInteraction).toHaveBeenCalledWith({
        courseId: 'course-1',
        event: {
          pageId: 'page-1',
          componentId: 'cmp-1',
          interactionType: 'submit',
          learnerId: null,
          data: {
            interactionId: 'q-1',
            value: 'opt-1',
            score: 1,
            maxScore: 1,
            isCorrect: true,
          },
          completed: true,
        },
      });

      expect(mockCalculateScore).toHaveBeenCalledWith({
        courseId: 'course-1',
        answers: [
          {
            componentId: 'cmp-1',
            componentType: 'mcq',
            responses: [
              {
                questionId: 'q-1',
                selectedOptionIds: ['opt-1'],
                textAnswer: null,
              },
            ],
          },
        ],
      });

      expect(mockSubmitPageComplete).toHaveBeenCalledWith({
        courseId: 'course-1',
        pageId: 'page-1',
        componentStates: [
          {
            componentId: 'cmp-1',
            completed: true,
            interactionsCompleted: ['q-1'],
            audiosCompleted: [],
            score: 1,
          },
        ],
      });
    });
  });

  it('dispatches page completion with all page components when page completes', async () => {
    render(<PreviewV2 />);

    fireEvent.click(screen.getByText('Trigger Page Complete'));

    await waitFor(() => {
      expect(mockSubmitPageComplete).toHaveBeenCalledWith({
        courseId: 'course-1',
        pageId: 'page-1',
        componentStates: [
          {
            componentId: 'cmp-1',
            completed: true,
            interactionsCompleted: [],
            audiosCompleted: [],
            score: null,
          },
          {
            componentId: 'cmp-2',
            completed: true,
            interactionsCompleted: [],
            audiosCompleted: [],
            score: null,
          },
          {
            componentId: 'cmp-3',
            completed: true,
            interactionsCompleted: [],
            audiosCompleted: [],
            score: null,
          },
          {
            componentId: 'cmp-4',
            completed: true,
            interactionsCompleted: [],
            audiosCompleted: [],
            score: null,
          },
          {
            componentId: 'cmp-5',
            completed: true,
            interactionsCompleted: [],
            audiosCompleted: [],
            score: null,
          },
        ],
      });
    });
  });

  it('normalizes multiple-select answers as selected option arrays', async () => {
    render(<PreviewV2 />);

    fireEvent.click(screen.getByText('Trigger Multi Select'));

    await waitFor(() => {
      expect(mockCalculateScore).toHaveBeenCalledWith({
        courseId: 'course-1',
        answers: [
          {
            componentId: 'cmp-2',
            componentType: 'multiple-select',
            responses: [
              {
                questionId: 'multiple-select',
                selectedOptionIds: ['opt-a', 'opt-b'],
                textAnswer: null,
              },
            ],
          },
        ],
      });
    });
  });

  it('normalizes true-false answers as a boolean-backed selected option', async () => {
    render(<PreviewV2 />);

    fireEvent.click(screen.getByText('Trigger True False'));

    await waitFor(() => {
      expect(mockCalculateScore).toHaveBeenCalledWith({
        courseId: 'course-1',
        answers: [
          {
            componentId: 'cmp-3',
            componentType: 'true-false',
            responses: [
              {
                questionId: 'cmp-3-question',
                selectedOptionIds: ['true'],
                textAnswer: null,
              },
            ],
          },
        ],
      });
    });
  });

  it('normalizes fill-blanks answers as text responses', async () => {
    render(<PreviewV2 />);

    fireEvent.click(screen.getByText('Trigger Fill Blanks'));

    await waitFor(() => {
      expect(mockCalculateScore).toHaveBeenCalledWith({
        courseId: 'course-1',
        answers: [
          {
            componentId: 'cmp-4',
            componentType: 'fill-blanks',
            responses: [
              {
                questionId: 'blankA',
                selectedOptionIds: [],
                textAnswer: 'alpha',
              },
              {
                questionId: 'blankB',
                selectedOptionIds: [],
                textAnswer: 'beta',
              },
            ],
          },
        ],
      });
    });
  });

  it('normalizes knowledge-check answers into per-question selected options', async () => {
    render(<PreviewV2 />);

    fireEvent.click(screen.getByText('Trigger Knowledge Check'));

    await waitFor(() => {
      expect(mockCalculateScore).toHaveBeenCalledWith({
        courseId: 'course-1',
        answers: [
          {
            componentId: 'cmp-5',
            componentType: 'knowledge-check',
            responses: [
              {
                questionId: 'q1',
                selectedOptionIds: ['opt-1'],
                textAnswer: null,
              },
              {
                questionId: 'q2',
                selectedOptionIds: ['opt-2'],
                textAnswer: null,
              },
            ],
          },
        ],
      });
    });
  });
});
