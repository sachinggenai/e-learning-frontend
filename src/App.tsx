/**
 * Main App Component
 * Implements the root component with Redux state management and menu bar for the eLearning authoring tool
 *
 * V2 architecture: Component Registry + DynamicComponentRenderer + ThemeProvider
 */

import React, { useEffect, useState } from "react";
import "./App.css";
import { httpClient } from "./services/httpClient";
import { registryService } from "./services/RegistryService";
import { useAppSelector } from "./store";

// Component imports
import Editor from "./components/Editor";
import EditorV2 from "./components/EditorV2";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import MenuBar from "./components/MenuBar";
import Preview from "./components/Preview";
import PreviewV2 from "./components/PreviewV2";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/Toast";

// Initialize component registry (self-registering side-effect import)
import "./components/registry/registrations";
import { registry } from "./components/registry";
// Import template styles
import "./components/templates/TemplateStyles.css";

import { featureFlags } from "./utils/featureFlags";

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

  // Custom Template Editor state
  const [showCustomTemplateEditor, setShowCustomTemplateEditor] = useState(false);

  // Check backend connectivity on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await httpClient.get("/health");
        setAppState((prev) => ({ ...prev, isBackendConnected: true }));
      } catch (error) {
        console.warn("Backend not available:", error);
        setAppState((prev) => ({ ...prev, isBackendConnected: false }));
      } finally {
        setAppState((prev) => ({ ...prev, loading: false }));
      }
    };

    checkBackend();
  }, []);

  // Validate backend registry metadata against local self-registered components.
  useEffect(() => {
    let disposed = false;

    const syncRegistryContracts = async () => {
      try {
        const [typesResponse, categoriesResponse] = await Promise.all([
          registryService.listTypes({ page: 1, limit: 200 }),
          registryService.listCategories(),
        ]);

        if (disposed) return;

        const backendTypeIds = new Set(typesResponse.items.map((item) => item.typeId));
        const localTypeIds = new Set(registry.getAll().map((item) => item.typeId));
        const backendCategoryIds = new Set(
          categoriesResponse.categories.map((item) => item.categoryId)
        );
        const localCategoryIds = new Set(
          registry.getCategories().map((item) => item.categoryId)
        );

        const missingInFrontend = Array.from(backendTypeIds).filter((id) => !localTypeIds.has(id));
        const missingInBackend = Array.from(localTypeIds).filter((id) => !backendTypeIds.has(id));
        const categoryOnlyInFrontend = Array.from(localCategoryIds).filter(
          (id) => !backendCategoryIds.has(id)
        );
        const categoryOnlyInBackend = Array.from(backendCategoryIds).filter(
          (id) => !localCategoryIds.has(id)
        );

        if (
          missingInFrontend.length ||
          missingInBackend.length ||
          categoryOnlyInFrontend.length ||
          categoryOnlyInBackend.length
        ) {
          console.warn("[Registry Sync] Metadata drift detected", {
            backendTypes: backendTypeIds.size,
            frontendTypes: localTypeIds.size,
            missingInFrontend,
            missingInBackend,
            categoryOnlyInFrontend,
            categoryOnlyInBackend,
          });
          return;
        }

        console.info("[Registry Sync] Frontend and backend registry metadata are aligned", {
          components: localTypeIds.size,
          categories: localCategoryIds.size,
        });
      } catch (error) {
        console.warn("[Registry Sync] Unable to verify registry metadata", error);
      }
    };

    syncRegistryContracts();
    return () => {
      disposed = true;
    };
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
        onOpenTemplateEditor={() => setShowCustomTemplateEditor(true)}
      />

      <main id="main" className="app-main" tabIndex={-1}>
        {appState.currentView === "editor"
          ? (featureFlags.isEnabled("v2-editor") ? <EditorV2 showCustomTemplateEditor={showCustomTemplateEditor} onCloseTemplateEditor={() => setShowCustomTemplateEditor(false)} /> : <Editor showCustomTemplateEditor={showCustomTemplateEditor} onCloseTemplateEditor={() => setShowCustomTemplateEditor(false)} />)
          : (featureFlags.isEnabled("v2-preview") ? <PreviewV2 /> : <Preview />)}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
