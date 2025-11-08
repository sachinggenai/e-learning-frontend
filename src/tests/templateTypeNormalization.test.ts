import { render, screen } from "@testing-library/react";
import React from "react";
import Preview from "../components/Preview";
// Mock api service (axios dependency) to prevent ESM import issues under Jest env
jest.mock("../services/api", () => ({
  apiService: {
    validateCourse: jest.fn(),
    exportCourse: jest.fn(),
    getExportFormats: jest.fn(),
    uploadAsset: jest.fn(),
    deleteAsset: jest.fn(),
  },
}));

// Mock useCourse hook to supply controlled course state
jest.mock("../context/CourseContext", () => {
  const actual = jest.requireActual("../context/CourseContext");
  return {
    ...actual,
    useCourse: () => ({
      course: {
        title: "Normalization Test",
        author: "Tester",
        navigation: {
          showProgress: true,
          lockProgression: false,
          allowSkip: true,
        },
        templates: [
          {
            id: "t1",
            type: "video",
            title: "Legacy Video",
            data: {
              title: "Legacy Video",
              videoUrl: "https://example.com/v.mp4",
              body: "",
            },
          },
          {
            id: "t2",
            type: "quiz",
            title: "Legacy Quiz",
            data: {
              question: "Q?",
              options: [
                { id: "a", text: "A", isCorrect: true },
                { id: "b", text: "B", isCorrect: false },
              ],
            },
          },
          {
            id: "t3",
            type: "text",
            title: "Legacy Text",
            data: { title: "Legacy Text", body: "Line1\nLine2" },
          },
        ],
      },
    }),
  };
});

describe("Template type normalization", () => {
  test("legacy types render via normalization mapping", () => {
    render(React.createElement(Preview));
    const videoTitles = screen.getAllByText("Legacy Video");
    expect(videoTitles.length).toBeGreaterThan(0);
    const progressIndicators = screen.getAllByText(/1\s*of\s*3/);
    expect(progressIndicators.length).toBeGreaterThan(0);
  });
});
