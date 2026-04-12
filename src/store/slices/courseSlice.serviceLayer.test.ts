import {
  saveCourse,
  fetchTemplates,
  createPageFromTemplate,
} from "./courseSlice";

jest.mock("../../services/CourseService", () => ({
  courseService: {
    saveCourse: jest.fn(),
    listAvailableTemplates: jest.fn(),
    getCourse: jest.fn(),
    createCourse: jest.fn(),
  },
}));

jest.mock("../../services/PageService", () => ({
  pageService: {
    createPage: jest.fn(),
    updatePage: jest.fn(),
    deletePage: jest.fn(),
  },
}));

jest.mock("../../utils/logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

import { courseService } from "../../services/CourseService";
import { pageService } from "../../services/PageService";

describe("courseSlice service-layer thunks", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saveCourse delegates to courseService.saveCourse", async () => {
    (courseService.saveCourse as jest.Mock).mockResolvedValue({
      id: 10,
      courseId: "course_1",
      title: "Course 1",
      author: "Author",
      description: "Desc",
      status: "draft",
      createdAt: "2026-04-11T00:00:00.000Z",
      updatedAt: "2026-04-11T00:00:00.000Z",
    });

    const thunk = saveCourse({
      courseId: "course_1",
      title: "Course 1",
      status: "draft",
      pages: [],
    } as any);

    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe("course/saveCourse/fulfilled");
    expect(courseService.saveCourse).toHaveBeenCalledTimes(1);
    expect(courseService.saveCourse).toHaveBeenCalledWith(
      expect.objectContaining({
        courseId: "course_1",
        title: "Course 1",
        status: "draft",
      })
    );
  });

  it("fetchTemplates uses courseService.listAvailableTemplates", async () => {
    (courseService.listAvailableTemplates as jest.Mock).mockResolvedValue([
      {
        id: "tpl-1",
        name: "Intro Template",
        description: "Intro",
        category: "introduction",
        fields: [{ name: "title" }],
      },
    ]);

    const thunk = fetchTemplates(undefined as any);
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe("course/fetchTemplates/fulfilled");
    expect(courseService.listAvailableTemplates).toHaveBeenCalledTimes(1);
    expect((result as any).payload.raw).toHaveLength(1);
    expect((result as any).payload.legacy[0]).toMatchObject({
      templateId: "tpl-1",
      type: "content-text",
      title: "Intro Template",
    });
  });

  it("createPageFromTemplate uses pageService.createPage when course exists", async () => {
    (courseService.getCourse as jest.Mock).mockResolvedValue({
      courseId: "course_1",
      title: "Course 1",
    });

    (pageService.createPage as jest.Mock).mockResolvedValue({
      pageId: "page_1",
      title: "Page 1",
      order: 0,
      components: [],
    });

    const thunk = createPageFromTemplate({
      courseId: "course_1",
      templateId: "content-text",
      pageTitle: "Page 1",
      customizations: { body: "Hello" },
    });

    const result = await thunk(
      dispatch,
      () => ({
        course: {
          currentCourse: {
            title: "Course 1",
            author: "Author",
            description: "Desc",
            status: "draft",
          },
        },
      }),
      undefined
    );

    expect(result.type).toBe("course/createPageFromTemplate/fulfilled");
    expect(courseService.getCourse).toHaveBeenCalledWith("course_1");
    expect(courseService.createCourse).not.toHaveBeenCalled();
    expect(pageService.createPage).toHaveBeenCalledWith("course_1", {
      title: "Page 1",
      components: [
        {
          componentType: "content-text",
          data: { body: "Hello" },
        },
      ],
    });
  });
});
