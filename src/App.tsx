/**
 * Main App Component
 * Implements the root component with Redux state management and menu bar for the eLearning authoring tool
 */

import React, { useEffect, useState } from "react";
import "./App.css";
import { apiService } from "./services/api";
import { useAppSelector } from "./store";

// Component imports
import Editor from "./components/Editor";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import MenuBar from "./components/MenuBar";
import Preview from "./components/Preview";
import { CourseProvider } from "./context/CourseContext";

interface AppState {
  isBackendConnected: boolean;
  currentView: "editor" | "preview";
  loading: boolean;
}

const AppContent: React.FC = () => {
  // Redux state with safe access
  const courseState = useAppSelector((state) => (state as any).course) || {};
  const editorState = useAppSelector((state) => (state as any).editor) || {};

  const currentCourse = courseState?.currentCourse || null;
  const editorPresent = editorState?.present || editorState || {};

  // Hooks
  const [appState, setAppState] = useState<AppState>({
    isBackendConnected: false,
    currentView: "editor",
    loading: true,
  });

  // Check backend connectivity on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await apiService.healthCheck();
        setAppState((prev) => ({ ...prev, isBackendConnected: true }));
        console.log("Backend connected successfully");
      } catch (error) {
        console.warn("Backend not available:", error);
        setAppState((prev) => ({ ...prev, isBackendConnected: false }));
      } finally {
        setAppState((prev) => ({ ...prev, loading: false }));
      }
    };

    checkBackend();
  }, []);

  // Handle view switching
  const handleViewChange = (view: "editor" | "preview") => {
    setAppState((prev) => ({ ...prev, currentView: view }));
  };

  // Set up keyboard shortcuts
  useEffect(() => {
    // Keyboard shortcuts are handled in MenuBar.tsx now
  }, []);

  // Loading state
  if (appState.loading || courseState.isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading eLearning Authoring Tool...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <a href="#main" className="skip-link" tabIndex={0}>
        Skip to content
      </a>
      <MenuBar />
      <Header
        currentView={appState.currentView}
        onViewChange={handleViewChange}
        isBackendConnected={appState.isBackendConnected}
      />

      <main id="main" className="app-main" tabIndex={-1}>
        {appState.currentView === "editor" ? <Editor /> : <Preview />}
      </main>

      {/* Backend connection indicator */}
      <div
        className={`connection-status ${appState.isBackendConnected ? "connected" : "disconnected"}`}
      >
        <span className="status-indicator"></span>
        {appState.isBackendConnected ? "Backend Connected" : "Backend Offline"}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <CourseProvider>
        <AppContent />
      </CourseProvider>
    </ErrorBoundary>
  );
};

export default App;
