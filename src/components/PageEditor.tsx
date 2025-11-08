import React, { useEffect, useState } from "react";
import { normalizeTemplateType } from "../constants/templateTypes";
import { t } from "../i18n/strings";
import { useAppDispatch } from "../store";
import { updatePage } from "../store/slices/courseSlice";
import { Page, setCurrentPage } from "../store/slices/editorSlice";
import logger from "../utils/logger";
import "./PageEditor.css";

interface PageEditorProps {
  page: Page;
}

const PageEditor: React.FC<PageEditorProps> = ({ page }) => {
  const dispatch = useAppDispatch();

  // STATE MANAGEMENT
  const [localPage, setLocalPage] = useState<Page>(page);
  const [committedPage, setCommittedPage] = useState<Page>(page);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Track render count and prop changes for debugging
  const renderCountRef = React.useRef(0);
  const lastPageIdRef = React.useRef(page.id);

  React.useEffect(() => {
    renderCountRef.current += 1;
    const idChanged = lastPageIdRef.current !== page.id;

    console.log(`\n🎨 PageEditor RENDER #${renderCountRef.current}`);
    console.log("   Page prop ID:", page.id);
    console.log("   Page prop title:", page.title);
    console.log(
      "   Page prop content keys:",
      Object.keys(page.content || {}).join(", ")
    );
    console.log(
      "   Page prop content sample:",
      JSON.stringify(page.content).substring(0, 100)
    );
    console.log(
      "   ID changed from last render?",
      idChanged,
      `(${lastPageIdRef.current} → ${page.id})`
    );
    console.log("   LocalPage ID:", localPage.id);
    console.log(
      "   LocalPage content keys:",
      Object.keys(localPage.content || {}).join(", ")
    );

    lastPageIdRef.current = page.id;
  });

  // --- EFFECTS ---

  /**
   * EFFECT 1: Sync on Navigation (Page ID Change Only)
   * Fixed: Only triggers when navigating to a DIFFERENT page, not on save echoes
   */
  useEffect(() => {
    console.log("═══════════════════════════════════════════════════");
    console.log("📥 PageEditor useEffect TRIGGERED");
    console.log("═══════════════════════════════════════════════════");
    console.log("📌 Incoming page.id:", page.id);
    console.log("📌 Incoming page.title:", page.title);
    console.log(
      "📌 Incoming page.content:",
      JSON.stringify(page.content, null, 2)
    );
    console.log("📌 Current localPage.id:", localPage.id);
    console.log(
      "📌 Current localPage.content:",
      JSON.stringify(localPage.content, null, 2)
    );
    console.log("📌 ID changed?", page.id !== localPage.id);

    // Only sync if we've navigated to a different page
    if (page.id !== localPage.id) {
      console.log("✅ Page ID changed - syncing new page");

      // Warn if there are unsaved changes
      if (localPage !== committedPage) {
        console.log("⚠️ User has unsaved changes - showing confirmation");
        const shouldDiscard = window.confirm(
          t("You have unsaved changes. Discard them and switch pages?")
        );
        if (!shouldDiscard) {
          console.log("❌ User cancelled navigation");
          logger.info({
            event: "PageEditor.navigation.cancelled",
            message: "User cancelled navigation to preserve unsaved changes.",
          });
          return;
        }
        console.log("✅ User confirmed - discarding changes");
      }

      logger.info({
        event: "PageEditor.sync.navigation",
        message: "Page navigation detected. Loading new page.",
        context: {
          previousPageId: localPage.id,
          newPageId: page.id,
        },
      });

      console.log(
        "💾 Setting localPage to:",
        JSON.stringify(page.content, null, 2)
      );
      setLocalPage(page);
      setCommittedPage(page);
      setSaveError(null);
      console.log("✅ PageEditor state updated");
    } else {
      console.log("⏭️ Same page ID - skipping sync");
    }
    console.log("═══════════════════════════════════════════════════\n");
  }, [page.id, localPage.id, localPage, committedPage]);

  /**
   * EFFECT 2: Browser Warning on Close/Refresh
   * Prevents accidental data loss when closing tab or refreshing
   */
  useEffect(() => {
    const hasUnsavedChanges = localPage !== committedPage;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "You have unsaved changes";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [localPage, committedPage]);

  // --- HANDLERS ---

  const handleTitleChange = (newTitle: string) => {
    setLocalPage((prev) => ({ ...prev, title: newTitle }));
    setSaveError(null); // Clear any previous save errors
  };

  const handleContentChange = (field: string, value: any) => {
    setLocalPage((prev) => ({
      ...prev,
      content: { ...prev.content, [field]: value },
    }));
    setSaveError(null);
  };

  /**
   * MANUAL SAVE HANDLER
   * Fixed: Now async with proper error handling and data cleanup
   */
  const handleSave = async () => {
    console.log("═══════════════════════════════════════════════════");
    console.log("💾 PageEditor.handleSave INITIATED");
    console.log("═══════════════════════════════════════════════════");
    console.log("📌 Saving page ID:", localPage.id);
    console.log("📌 Saving page title:", localPage.title);
    console.log(
      "📌 Saving page content:",
      JSON.stringify(localPage.content, null, 2)
    );

    setIsSaving(true);
    setSaveError(null);

    try {
      // Clean up MCQ data before saving
      let cleanedPage = { ...localPage };

      if (normalizeTemplateType(localPage.templateType) === "mcq") {
        console.log("🧹 Cleaning MCQ options...");
        // Remove empty options and trim existing ones
        const cleanedOptions =
          localPage.content?.options
            ?.filter((opt: string) => opt && opt.trim() !== "")
            .map((opt: string) => opt.trim()) || [];

        cleanedPage = {
          ...localPage,
          content: {
            ...localPage.content,
            options: cleanedOptions,
          },
        };

        // Validate and trim correctAnswer
        if (localPage.content?.correctAnswer) {
          const trimmedCorrectAnswer = localPage.content.correctAnswer.trim();
          if (cleanedOptions.includes(trimmedCorrectAnswer)) {
            cleanedPage.content.correctAnswer = trimmedCorrectAnswer;
          } else {
            // Check if the untrimmed correctAnswer matches any cleaned option
            const matchingOption = cleanedOptions.find(
              (opt: string) => opt === localPage.content.correctAnswer
            );
            if (matchingOption) {
              cleanedPage.content.correctAnswer = matchingOption;
            } else {
              cleanedPage.content.correctAnswer = "";
            }
          }
        }
        console.log(
          "✅ MCQ cleaned:",
          JSON.stringify(cleanedPage.content, null, 2)
        );
      }

      const updatedPage = {
        ...cleanedPage,
        lastModified: new Date().toISOString(),
      };

      console.log("📤 Dispatching updatePage to Redux...");
      console.log(
        "   Page content being dispatched:",
        JSON.stringify(updatedPage.content).substring(0, 100)
      );

      logger.info({
        event: "PageEditor.save.manual",
        message: "Manual save triggered. Dispatching update to Redux.",
        context: { pageId: updatedPage.id },
      });

      // CRITICAL FIX: Update BOTH courseSlice AND editorSlice
      // This ensures editorSlice.currentPage has the latest content
      // so when we switch pages, it saves the correct data
      dispatch(updatePage(updatedPage)); // Update courseSlice
      dispatch(setCurrentPage(updatedPage)); // Update editorSlice ✅ NEW!

      // Only update committedPage after successful save
      setCommittedPage(updatedPage);
      setLocalPage(updatedPage); // Also update localPage to reflect any backend changes

      console.log("✅ PageEditor local state updated");
      console.log(
        "✅ BOTH courseSlice AND editorSlice updated with saved content"
      );
      console.log("\n🔬 VERIFICATION: Content saved to Redux?");
      console.log(
        "   We dispatched updatePage with content:",
        JSON.stringify(updatedPage.content).substring(0, 100)
      );
      console.log(
        "   Redux should now have this content in courseSlice.currentCourse.pages[]"
      );
      console.log(
        "   To verify: Check the courseSlice.updatePage reducer logs above"
      );
      console.log("═══════════════════════════════════════════════════\n");

      logger.info({
        event: "PageEditor.save.success",
        message: "Save completed successfully.",
        context: { pageId: updatedPage.id },
      });
    } catch (error: any) {
      console.log("❌ Save failed:", error);
      logger.error({
        event: "PageEditor.save.error",
        message: "Failed to save page.",
        context: {
          pageId: localPage.id,
          error: error.message || String(error),
        },
      });
      setSaveError(t("Failed to save changes. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  // Determine if there are unsaved changes to enable/disable the save button.
  const hasUnsavedChanges = localPage !== committedPage;

  // --- RENDER LOGIC ---

  const renderContent = () => {
    if (!page) {
      return (
        <div className="page-editor-placeholder">
          {t("Select a page to edit")}
        </div>
      );
    }

    const type = normalizeTemplateType(page.templateType);

    switch (type) {
      case "welcome":
        return (
          <div className="content-fields">
            <div className="form-group">
              <label htmlFor="objectives">{t("Learning Objectives")}</label>
              <textarea
                id="objectives"
                value={localPage.content?.objectives || ""}
                onChange={(e) =>
                  handleContentChange("objectives", e.target.value)
                }
                placeholder={t("Enter learning objectives for this course...")}
                rows={4}
              />
            </div>
            <div className="form-group">
              <label htmlFor="introduction">{t("Introduction")}</label>
              <textarea
                id="introduction"
                value={localPage.content?.introduction || ""}
                onChange={(e) =>
                  handleContentChange("introduction", e.target.value)
                }
                placeholder={t("Enter a brief introduction...")}
                rows={3}
              />
            </div>
          </div>
        );

      case "summary":
      case "content-text":
        return (
          <div className="content-fields">
            <div className="form-group">
              <label htmlFor="text-content">{t("Content")}</label>
              <textarea
                id="text-content"
                value={localPage.content?.content || ""}
                onChange={(e) => handleContentChange("content", e.target.value)}
                placeholder={t("Enter your content here...")}
                rows={8}
              />
            </div>
          </div>
        );

      case "content-video":
        return (
          <div className="content-fields">
            <div className="form-group">
              <label htmlFor="video-url">{t("Video URL")}</label>
              <input
                type="url"
                id="video-url"
                value={localPage.content?.videoUrl || ""}
                onChange={(e) =>
                  handleContentChange("videoUrl", e.target.value)
                }
                placeholder={t("https://example.com/video.mp4")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="video-description">{t("Description")}</label>
              <textarea
                id="video-description"
                value={localPage.content?.description || ""}
                onChange={(e) =>
                  handleContentChange("description", e.target.value)
                }
                placeholder={t(
                  "Describe what learners will see in this video..."
                )}
                rows={4}
              />
            </div>
          </div>
        );

      case "content-image":
        return (
          <div className="content-fields">
            <div className="form-group">
              <label htmlFor="image-url">{t("Image URL")}</label>
              <input
                type="url"
                id="image-url"
                value={localPage.content?.imageUrl || ""}
                onChange={(e) =>
                  handleContentChange("imageUrl", e.target.value)
                }
                placeholder={t("https://example.com/image.jpg")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="image-alt">{t("Alt Text")}</label>
              <input
                type="text"
                id="image-alt"
                value={localPage.content?.altText || ""}
                onChange={(e) => handleContentChange("altText", e.target.value)}
                placeholder={t("Describe the image for accessibility...")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="image-caption">{t("Caption")}</label>
              <textarea
                id="image-caption"
                value={localPage.content?.caption || ""}
                onChange={(e) => handleContentChange("caption", e.target.value)}
                placeholder={t("Optional caption or description...")}
                rows={3}
              />
            </div>
          </div>
        );

      case "mcq":
        // Reverted to the original, simpler MCQ editor layout
        const options = localPage.content?.options || ["", "", "", ""];
        return (
          <div>
            <div className="form-group">
              <label htmlFor="mcq-question">{t("Question")}</label>
              <textarea
                id="mcq-question"
                value={localPage.content?.question || ""}
                onChange={(e) =>
                  handleContentChange("question", e.target.value)
                }
                className="form-control"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>{t("Answer Options")}</label>
              {["A", "B", "C", "D"].map((optLabel, index) => (
                <div
                  key={`option-${page.id}-${index}`}
                  className="answer-option"
                >
                  <label htmlFor={`option-${optLabel}`}>
                    {t("Option")} {optLabel}:
                  </label>
                  <input
                    type="text"
                    id={`option-${optLabel}`}
                    value={options[index] || ""}
                    onChange={(e) => {
                      const newOptions = [...options];
                      const oldValue = newOptions[index];
                      const newValue = e.target.value;
                      newOptions[index] = newValue;

                      // If user is editing the currently selected correct answer,
                      // update correctAnswer to match the new text
                      if (
                        localPage.content?.correctAnswer === oldValue &&
                        oldValue !== ""
                      ) {
                        handleContentChange("correctAnswer", newValue);
                      }

                      handleContentChange("options", newOptions);
                    }}
                    placeholder={`${t("Enter option")} ${optLabel}...`}
                  />
                </div>
              ))}
            </div>
            <div className="form-group">
              <label htmlFor="correct-answer">{t("Correct Answer")}</label>
              <select
                id="correct-answer"
                value={localPage.content?.correctAnswer || ""}
                onChange={(e) =>
                  handleContentChange("correctAnswer", e.target.value)
                }
                className="form-control"
              >
                <option value="">{t("Select correct answer...")}</option>
                {options
                  .map((opt: string, index: number) => ({
                    label: `Option ${String.fromCharCode(65 + index)}`,
                    value: opt,
                  }))
                  .filter(
                    (opt: { value: string }) =>
                      opt.value && opt.value.trim() !== ""
                  ) // Only show options that have text
                  .map((opt: { label: string; value: string }) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}: {opt.value}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="page-editor-placeholder">
            {t("Unknown template type:")} {page.templateType}
          </div>
        );
    }
  };

  if (!page) {
    return (
      <div className="page-editor-container page-editor-placeholder">
        {t("Select an item from the course outline to begin editing.")}
      </div>
    );
  }

  return (
    <div className="page-editor-container">
      <div className="page-editor-header">
        <input
          type="text"
          value={localPage.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="form-control form-control-lg page-title-input"
          placeholder={t("Page Title")}
        />
        <div className="save-controls">
          {hasUnsavedChanges && !isSaving && (
            <span
              className="unsaved-indicator"
              title={t("You have unsaved changes")}
            >
              ● {t("Unsaved")}
            </span>
          )}
          {saveError && <span className="save-error">{saveError}</span>}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="btn btn-primary"
          >
            {isSaving ? t("Saving...") : t("Save")}
          </button>
        </div>
      </div>
      <div className="page-editor-content">{renderContent()}</div>
    </div>
  );
};

export default PageEditor;
