/**
 * App Component Tests
 * Comprehensive testing for the main App component
 */

import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// Declare mock fn first so factory can reference it safely
const mockHealthCheck = jest.fn();
// Mock the API service
jest.mock("./services/api", () => {
  return {
    apiService: {
      healthCheck: (...args: any[]) => mockHealthCheck(...args),
      validateCourse: jest.fn(),
      exportCourse: jest.fn(),
      getExportFormats: jest.fn(),
      uploadAsset: jest.fn(),
      deleteAsset: jest.fn(),
    },
  };
});

// Mock store hooks to avoid needing real Provider
jest.mock("./store", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector: any) => {
    const mockState = {
      course: { currentCourse: null, templates: [], isLoading: false },
      editor: { currentPageId: null },
    } as any;
    try {
      return selector ? selector(mockState) : undefined;
    } catch {
      return undefined;
    }
  },
}));

import App from "./App";

// Mock child components to isolate App component testing
jest.mock("./components/Editor", () => {
  return function MockEditor() {
    return <div data-testid="editor">Editor Component</div>;
  };
});

jest.mock("./components/Preview", () => {
  return function MockPreview() {
    return <div data-testid="preview">Preview Component</div>;
  };
});

jest.mock("./components/Header", () => {
  return function MockHeader({
    onViewChange,
    currentView,
    isBackendConnected,
  }: any) {
    return (
      <div data-testid="header">
        <button onClick={() => onViewChange("editor")}>Editor</button>
        <button onClick={() => onViewChange("preview")}>Preview</button>
        <span data-testid="connection-status">
          {isBackendConnected ? "Connected" : "Disconnected"}
        </span>
        <span data-testid="current-view">{currentView}</span>
      </div>
    );
  };
});

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Backend Connectivity", () => {
    test("should show connected status when backend is available", async () => {
      // Mock successful health check
      mockHealthCheck.mockResolvedValue({ status: "ok" });

      render(<App />);

      // Wait for health check to complete
      await waitFor(() => {
        expect(screen.getByTestId("connection-status")).toHaveTextContent(
          "Connected"
        );
      });

      expect(mockHealthCheck).toHaveBeenCalledTimes(1);
    });

    test("should show disconnected status when backend is unavailable", async () => {
      // Mock failed health check
      mockHealthCheck.mockRejectedValue(new Error("Connection failed"));

      // Spy on console.warn to avoid noise in test output
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      render(<App />);

      // Wait for health check to fail
      await waitFor(() => {
        expect(screen.getByTestId("connection-status")).toHaveTextContent(
          "Disconnected"
        );
      });

      expect(mockHealthCheck).toHaveBeenCalledTimes(1);
      consoleSpy.mockRestore();
    });
  });

  describe("View Navigation", () => {
    test("should default to editor view", async () => {
      mockHealthCheck.mockResolvedValue({ status: "ok" });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("current-view")).toHaveTextContent("editor");
        expect(screen.getByTestId("editor")).toBeInTheDocument();
      });
    });

    test("should switch to preview view when requested", async () => {
      mockHealthCheck.mockResolvedValue({ status: "ok" });

      render(<App />);

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId("editor")).toBeInTheDocument();
      });

      // Click preview button
      fireEvent.click(screen.getByText("Preview"));

      await waitFor(() => {
        expect(screen.getByTestId("current-view")).toHaveTextContent("preview");
        expect(screen.getByTestId("preview")).toBeInTheDocument();
      });
    });

    test("should switch back to editor view", async () => {
      mockHealthCheck.mockResolvedValue({ status: "ok" });

      render(<App />);

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId("editor")).toBeInTheDocument();
      });

      // Switch to preview
      fireEvent.click(screen.getByText("Preview"));

      await waitFor(() => {
        expect(screen.getByTestId("preview")).toBeInTheDocument();
      });

      // Switch back to editor
      fireEvent.click(screen.getByText("Editor"));

      await waitFor(() => {
        expect(screen.getByTestId("current-view")).toHaveTextContent("editor");
        expect(screen.getByTestId("editor")).toBeInTheDocument();
      });
    });
  });

  describe("Loading States", () => {
    test("should show loading state initially", () => {
      mockHealthCheck.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<App />);

      // Expect loading spinner present
      expect(document.querySelector(".app-loading")).toBeInTheDocument();
      expect(document.querySelector(".spinner")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    test("should handle health check errors gracefully", async () => {
      mockHealthCheck.mockRejectedValue(new Error("Network error"));

      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("connection-status")).toHaveTextContent(
          "Disconnected"
        );
      });

      // Should not crash the app
      expect(screen.getByTestId("header")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe("Course Context Integration", () => {
    test("should provide CourseContext to child components", async () => {
      mockHealthCheck.mockResolvedValue({ status: "ok" });

      render(<App />);

      await waitFor(() => {
        // The app should render without context errors
        expect(screen.getByTestId("editor")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    test("should have accessible navigation", async () => {
      mockHealthCheck.mockResolvedValue({ status: "ok" });

      render(<App />);

      await waitFor(() => {
        const editorButton = screen.getByText("Editor");
        const previewButton = screen.getByText("Preview");

        expect(editorButton).toBeInTheDocument();
        expect(previewButton).toBeInTheDocument();
      });
    });
  });

  describe("Performance", () => {
    test("should not make excessive API calls", async () => {
      mockHealthCheck.mockResolvedValue({ status: "ok" });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("connection-status")).toHaveTextContent(
          "Connected"
        );
      });

      // Should only call health check once on mount
      expect(mockHealthCheck).toHaveBeenCalledTimes(1);
    });
  });
});
