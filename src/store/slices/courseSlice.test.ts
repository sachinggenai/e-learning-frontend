/**
 * Test for MCQ data flow from PageEditor to course export
 */

import { transformCourseForExport } from "../../utils/transform";

// Mock the API service
jest.mock("../../services/api", () => ({
  apiService: {
    saveCourse: jest.fn().mockResolvedValue({
      success: true,
      course: {
        id: 1,
        courseId: "test-course",
        title: "Test Course",
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      isNew: false,
    }),
  },
}));

describe("MCQ Data Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should include user-entered MCQ data in export payload", () => {
    // Create a course with an MCQ page containing user data
    const courseWithMCQ = {
      courseId: "test-course",
      title: "Test Course",
      pages: [
        {
          id: "mcq-page-1",
          templateType: "mcq",
          title: "Sample MCQ Page",
          order: 0,
          content: {
            question: "What is the capital of France?",
            options: ["London", "Paris", "Berlin", "Madrid"],
            correctAnswer: "B", // Paris is the correct answer (index 1)
          },
          isDraft: true,
          lastModified: new Date().toISOString(),
        },
      ],
    };

    // Transform the course for export
    const transformed = transformCourseForExport(courseWithMCQ as any);

    // Verify the MCQ data is correctly transformed
    const mcqTemplate = transformed.templates.find(
      (t: any) => t.type === "mcq"
    );
    expect(mcqTemplate).toBeDefined();
    expect(mcqTemplate.data.questions[0].question).toBe(
      "What is the capital of France?"
    );
    expect(mcqTemplate.data.questions[0].options).toEqual([
      { id: "opt_0", text: "London", isCorrect: false },
      { id: "opt_1", text: "Paris", isCorrect: true },
      { id: "opt_2", text: "Berlin", isCorrect: false },
      { id: "opt_3", text: "Madrid", isCorrect: false },
    ]);
  });
});

it("should not use default values when user data is present", () => {
  // Create a course with MCQ page with actual user data
  const courseWithMCQ = {
    courseId: "test-course-2",
    title: "Test Course 2",
    pages: [
      {
        id: "mcq-page-2",
        templateType: "mcq",
        title: "User MCQ Page",
        order: 0,
        content: {
          question: "e", // User's actual input
          options: ["Option 1", "Option 2", "Option 3", "Option 4"], // User's options
          correctAnswer: "A", // User's correct answer
        },
        isDraft: true,
        lastModified: new Date().toISOString(),
      },
    ],
  };

  // Transform the course for export
  const transformed = transformCourseForExport(courseWithMCQ as any);

  const mcqTemplate = transformed.templates.find((t: any) => t.type === "mcq");
  expect(mcqTemplate.data.questions[0].question).toBe("e"); // Should be user's input
  expect(mcqTemplate.data.questions[0].options).toEqual([
    { id: "opt_0", text: "Option 1", isCorrect: true },
    { id: "opt_1", text: "Option 2", isCorrect: false },
    { id: "opt_2", text: "Option 3", isCorrect: false },
    { id: "opt_3", text: "Option 4", isCorrect: false },
  ]);
  expect(mcqTemplate.data.questions[0].question).not.toBe("Sample Question"); // Should not be default
});

it("should apply correct answer to existing questions array", () => {
  // Test the case from the user's payload where questions exist but correctAnswer needs to be applied
  const courseWithMCQ = {
    courseId: "test-course-3",
    title: "Test Course 3",
    pages: [
      {
        id: "page_1761500563413_3",
        templateType: "mcq",
        title: "Quiz Assessment",
        order: 2,
        content: {
          content: "Quiz",
          correctAnswer: "B", // User selected B
          questions: [
            {
              id: "q_page_1761500563413_3",
              question: "f",
              options: [
                { id: "opt_0", text: "f", isCorrect: false },
                { id: "opt_1", text: "f", isCorrect: false },
                { id: "opt_2", text: "f", isCorrect: false },
                { id: "opt_3", text: "f", isCorrect: false },
              ],
            },
          ],
        },
        isDraft: true,
        lastModified: new Date().toISOString(),
      },
    ],
  };

  // Transform the course for export
  const transformed = transformCourseForExport(courseWithMCQ as any);

  const mcqTemplate = transformed.templates.find((t: any) => t.type === "mcq");
  expect(mcqTemplate.data.questions[0].question).toBe("f"); // Should be user's question
  expect(mcqTemplate.data.questions[0].options).toEqual([
    { id: "opt_0", text: "f", isCorrect: false }, // A
    { id: "opt_1", text: "f", isCorrect: true }, // B - correct
    { id: "opt_2", text: "f", isCorrect: false }, // C
    { id: "opt_3", text: "f", isCorrect: false }, // D
  ]);
});
