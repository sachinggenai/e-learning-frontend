import { scoringService } from "./ScoringService";
import { completionService } from "./CompletionService";
import { exportService } from "./ExportService";
import { httpClient } from "./httpClient";

jest.mock("./httpClient", () => ({
  httpClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

describe("service contract smoke tests", () => {
  const mockedHttp = httpClient as jest.Mocked<typeof httpClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls canonical scoring calculate endpoint", async () => {
    mockedHttp.post.mockResolvedValueOnce({
      data: { totalScore: 80, componentResults: [] },
    } as any);

    await scoringService.calculateScore("course-1", {
      answers: [
        {
          componentId: "cmp-1",
          componentType: "mcq",
          responses: [{ questionId: "q1", selectedOptionIds: ["o1"] }],
        },
      ],
      attemptNumber: 1,
    });

    expect(mockedHttp.post).toHaveBeenCalledWith(
      "/courses/course-1/scoring/calculate",
      {
        answers: [
          {
            componentId: "cmp-1",
            componentType: "mcq",
            responses: [{ questionId: "q1", selectedOptionIds: ["o1"] }],
          },
        ],
        attemptNumber: 1,
      },
    );
  });

  it("calls canonical page completion endpoint", async () => {
    mockedHttp.post.mockResolvedValueOnce({ data: { completed: true } } as any);

    await completionService.submitPageCompletion("course-1", "page-1", {
      componentStates: [
        {
          componentId: "cmp-1",
          completed: true,
          interactionsCompleted: ["tab-1"],
          audiosCompleted: [],
          score: 100,
        },
      ],
    });

    expect(mockedHttp.post).toHaveBeenCalledWith(
      "/courses/course-1/pages/page-1/completion",
      {
        componentStates: [
          {
            componentId: "cmp-1",
            completed: true,
            interactionsCompleted: ["tab-1"],
            audiosCompleted: [],
            score: 100,
          },
        ],
      },
    );
  });

  it("allows open interactionType values in interaction logging", async () => {
    mockedHttp.post.mockResolvedValueOnce({ data: { id: "evt-1" } } as any);

    await completionService.recordInteraction("course-1", {
      pageId: "page-1",
      componentId: "cmp-1",
      interactionType: "reveal",
      learnerId: "learner-1",
      data: { interactionId: "tab-1", value: "expanded" },
    });

    expect(mockedHttp.post).toHaveBeenCalledWith(
      "/courses/course-1/interactions",
      {
        pageId: "page-1",
        componentId: "cmp-1",
        interactionType: "reveal",
        learnerId: "learner-1",
        data: { interactionId: "tab-1", value: "expanded" },
      },
    );
  });

  it("falls back to query-param export call when body contract fails", async () => {
    const blob = new Blob(["zip-content"], { type: "application/zip" });

    mockedHttp.post
      .mockRejectedValueOnce({ status: 400, message: "Bad Request" })
      .mockResolvedValueOnce({
        data: blob,
        headers: {
          "content-type": "application/zip",
          "content-disposition":
            'attachment; filename="course-1_scorm_1_2.zip"',
        },
      } as any);

    const createObjectUrlSpy = jest
      .spyOn(window.URL, "createObjectURL")
      .mockReturnValue("blob:mock-url");

    const result = await exportService.exportScorm("course-1", "scorm_1_2");

    expect(mockedHttp.post).toHaveBeenNthCalledWith(
      1,
      "/export/scorm/course-1",
      { format: "scorm_1_2" },
      expect.any(Object),
    );

    expect(mockedHttp.post).toHaveBeenNthCalledWith(
      2,
      "/export/scorm/course-1",
      undefined,
      expect.objectContaining({ params: { format: "scorm_1_2" } }),
    );

    expect(result.success).toBe(true);
    expect(result.downloadUrl).toBe("blob:mock-url");

    createObjectUrlSpy.mockRestore();
  });
});
