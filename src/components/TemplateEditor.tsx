/**
 * TemplateEditor Component
 * Comprehensive template editor for all template types with validation
 */

import React, { useCallback, useMemo, useState } from "react";
import {
  ContentData,
  MCQData,
  MCQOption,
  SummaryData,
  Template,
  WelcomeData,
} from "../types/course";
import { validateTemplate } from "../utils/fieldValidation";
import "./TemplateEditor.css";

interface TemplateEditorProps {
  template: Template;
  onTemplateUpdate: (template: Template) => void;
  errors: any[];
}

interface WelcomeEditorProps {
  data: WelcomeData;
  onChange: (data: WelcomeData) => void;
  errors: any[];
}

interface ContentEditorProps {
  data: ContentData;
  onChange: (data: ContentData) => void;
  errors: any[];
  isVideo?: boolean;
}

interface MCQEditorProps {
  data: MCQData;
  onChange: (data: MCQData) => void;
  errors: any[];
}

interface SummaryEditorProps {
  data: SummaryData;
  onChange: (data: SummaryData) => void;
  errors: any[];
}

const WelcomeEditor: React.FC<WelcomeEditorProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleChange = useCallback(
    (field: keyof WelcomeData, value: string) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange],
  );

  const getFieldError = (fieldName: string) => {
    return errors.find((error) => error.field?.includes(fieldName));
  };

  return (
    <div className="welcome-editor">
      <div className="field-group">
        <label htmlFor="welcome-title">Title</label>
        <input
          id="welcome-title"
          type="text"
          value={data.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          className={getFieldError("title") ? "error" : ""}
          placeholder="Welcome to your course1"
        />
        {getFieldError("title") && (
          <span className="error-message">
            {getFieldError("title")?.message}
          </span>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="welcome-subtitle">Subtitle</label>
        <input
          id="welcome-subtitle"
          type="text"
          value={data.subtitle || ""}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          className={getFieldError("subtitle") ? "error" : ""}
          placeholder="Get started with your learning journey"
        />
        {getFieldError("subtitle") && (
          <span className="error-message">
            {getFieldError("subtitle")?.message}
          </span>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="welcome-description">Description</label>
        <textarea
          id="welcome-description"
          value={data.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className={getFieldError("description") ? "error" : ""}
          placeholder="Introduce your learners to what they can expect..."
          rows={4}
        />
        {getFieldError("description") && (
          <span className="error-message">
            {getFieldError("description")?.message}
          </span>
        )}
      </div>
    </div>
  );
};

const ContentEditor: React.FC<ContentEditorProps> = ({
  data,
  onChange,
  errors,
  isVideo = false,
}) => {
  const handleChange = useCallback(
    (field: keyof ContentData, value: string) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange],
  );

  const getFieldError = (fieldName: string) => {
    return errors.find((error) => error.field?.includes(fieldName));
  };

  return (
    <div className="content-editor">
      <div className="field-group">
        <label htmlFor="content-title">Title</label>
        <input
          id="content-title"
          type="text"
          value={data.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          className={getFieldError("title") ? "error" : ""}
          placeholder="Content section title"
        />
        {getFieldError("title") && (
          <span className="error-message">
            {getFieldError("title")?.message}
          </span>
        )}
      </div>

      {isVideo && (
        <div className="field-group">
          <label htmlFor="content-video">Video URL</label>
          <input
            id="content-video"
            type="url"
            value={data.videoUrl || ""}
            onChange={(e) => handleChange("videoUrl", e.target.value)}
            className={getFieldError("videoUrl") ? "error" : ""}
            placeholder="https://example.com/video.mp4"
          />
          {getFieldError("videoUrl") && (
            <span className="error-message">
              {getFieldError("videoUrl")?.message}
            </span>
          )}
        </div>
      )}

      <div className="field-group">
        <label htmlFor="content-body">
          {isVideo ? "Video Description" : "Content Body"}
        </label>
        <textarea
          id="content-body"
          value={data.body || ""}
          onChange={(e) => handleChange("body", e.target.value)}
          className={getFieldError("body") ? "error" : ""}
          placeholder={
            isVideo
              ? "Describe what learners will see in this video..."
              : "Enter your content here..."
          }
          rows={8}
        />
        {getFieldError("body") && (
          <span className="error-message">
            {getFieldError("body")?.message}
          </span>
        )}
      </div>
    </div>
  );
};

const MCQEditor: React.FC<MCQEditorProps> = ({ data, onChange, errors }) => {
  const handleQuestionChange = useCallback(
    (question: string) => {
      onChange({ ...data, question });
    },
    [data, onChange],
  );

  const handleOptionChange = useCallback(
    (index: number, field: keyof MCQOption, value: string | boolean) => {
      const newOptions = [...data.options];
      newOptions[index] = { ...newOptions[index], [field]: value };

      // If setting this option as correct, make sure others are not correct
      if (field === "isCorrect" && value === true) {
        newOptions.forEach((option, i) => {
          if (i !== index) {
            option.isCorrect = false;
          }
        });
      }

      onChange({ ...data, options: newOptions });
    },
    [data, onChange],
  );

  const addOption = useCallback(() => {
    const newOption: MCQOption = {
      id: `opt_${Date.now()}`,
      text: "",
      isCorrect: false,
    };
    onChange({ ...data, options: [...data.options, newOption] });
  }, [data, onChange]);

  const removeOption = useCallback(
    (index: number) => {
      if (data.options.length > 2) {
        const newOptions = data.options.filter((_, i) => i !== index);
        onChange({ ...data, options: newOptions });
      }
    },
    [data, onChange],
  );

  const getFieldError = (fieldName: string) => {
    return errors.find((error) => error.field?.includes(fieldName));
  };

  return (
    <div className="mcq-editor">
      <div className="field-group">
        <label htmlFor="mcq-question">Question</label>
        <textarea
          id="mcq-question"
          value={data.question || ""}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className={getFieldError("question") ? "error" : ""}
          placeholder="Enter your question here..."
          rows={3}
        />
        {getFieldError("question") && (
          <span className="error-message">
            {getFieldError("question")?.message}
          </span>
        )}
      </div>

      <div className="options-section">
        <div className="options-header">
          <label>Answer Options</label>
          <button
            type="button"
            onClick={addOption}
            className="add-option-btn"
            disabled={data.options.length >= 6}
          >
            + Add Option
          </button>
        </div>

        {data.options.map((option, index) => (
          <div key={option.id} className="option-item">
            <div className="option-controls">
              <input
                type="radio"
                name="correct-answer"
                checked={option.isCorrect}
                onChange={(e) =>
                  handleOptionChange(index, "isCorrect", e.target.checked)
                }
                title="Mark as correct answer"
              />
              <input
                type="text"
                value={option.text}
                onChange={(e) =>
                  handleOptionChange(index, "text", e.target.value)
                }
                placeholder={`Option ${index + 1}`}
                className="option-text"
              />
              {data.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="remove-option-btn"
                  title="Remove option"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="mcq-help">
          <p>
            💡 Select the radio button next to the correct answer. At least 2
            options required, maximum 6.
          </p>
        </div>
      </div>
    </div>
  );
};

const SummaryEditor: React.FC<SummaryEditorProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleTitleChange = useCallback(
    (title: string) => {
      onChange({ ...data, title });
    },
    [data, onChange],
  );

  const handleKeyPointChange = useCallback(
    (index: number, value: string) => {
      const newKeyPoints = [...data.keyPoints];
      newKeyPoints[index] = value;
      onChange({ ...data, keyPoints: newKeyPoints });
    },
    [data, onChange],
  );

  const addKeyPoint = useCallback(() => {
    onChange({ ...data, keyPoints: [...data.keyPoints, ""] });
  }, [data, onChange]);

  const removeKeyPoint = useCallback(
    (index: number) => {
      if (data.keyPoints.length > 1) {
        const newKeyPoints = data.keyPoints.filter((_, i) => i !== index);
        onChange({ ...data, keyPoints: newKeyPoints });
      }
    },
    [data, onChange],
  );

  const getFieldError = (fieldName: string) => {
    return errors.find((error) => error.field?.includes(fieldName));
  };

  return (
    <div className="summary-editor">
      <div className="field-group">
        <label htmlFor="summary-title">Summary Title</label>
        <input
          id="summary-title"
          type="text"
          value={data.title || ""}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={getFieldError("title") ? "error" : ""}
          placeholder="Course Summary"
        />
        {getFieldError("title") && (
          <span className="error-message">
            {getFieldError("title")?.message}
          </span>
        )}
      </div>

      <div className="key-points-section">
        <div className="key-points-header">
          <label>Key Learning Points</label>
          <button type="button" onClick={addKeyPoint} className="add-point-btn">
            + Add Point
          </button>
        </div>

        {data.keyPoints.map((point, index) => (
          <div key={index} className="key-point-item">
            <div className="key-point-controls">
              <span className="point-number">{index + 1}.</span>
              <input
                type="text"
                value={point}
                onChange={(e) => handleKeyPointChange(index, e.target.value)}
                placeholder={`Key learning point ${index + 1}`}
                className="key-point-text"
              />
              {data.keyPoints.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeKeyPoint(index)}
                  className="remove-point-btn"
                  title="Remove point"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="summary-help">
          <p>
            💡 Add key points that summarize the main learning objectives of
            your course.
          </p>
        </div>
      </div>
    </div>
  );
};

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onTemplateUpdate,
  errors,
}) => {
  const [localTemplate, setLocalTemplate] = useState<Template>(template);

  const localIssues = useMemo(
    () => validateTemplate(localTemplate),
    [localTemplate],
  );

  const handleTitleChange = useCallback(
    (title: string) => {
      const updatedTemplate = { ...localTemplate, title };
      setLocalTemplate(updatedTemplate);
      onTemplateUpdate(updatedTemplate);
    },
    [localTemplate, onTemplateUpdate],
  );

  const handleDataChange = useCallback(
    (data: WelcomeData | ContentData | MCQData | SummaryData) => {
      const updatedTemplate = { ...localTemplate, data };
      setLocalTemplate(updatedTemplate);
      onTemplateUpdate(updatedTemplate);
    },
    [localTemplate, onTemplateUpdate],
  );

  const renderEditor = () => {
    switch (template.type) {
      case "welcome":
        return (
          <WelcomeEditor
            data={template.data as WelcomeData}
            onChange={handleDataChange}
            errors={errors}
          />
        );
      case "content-text":
        return (
          <ContentEditor
            data={template.data as ContentData}
            onChange={handleDataChange}
            errors={errors}
            isVideo={false}
          />
        );
      case "content-video":
        return (
          <ContentEditor
            data={template.data as ContentData}
            onChange={handleDataChange}
            errors={errors}
            isVideo={true}
          />
        );
      case "mcq":
        return (
          <MCQEditor
            data={template.data as MCQData}
            onChange={handleDataChange}
            errors={errors}
          />
        );
      case "summary":
        return (
          <SummaryEditor
            data={template.data as SummaryData}
            onChange={handleDataChange}
            errors={errors}
          />
        );
      default:
        return (
          <div className="unsupported-template">
            <p>Template type "{template.type}" is not yet supported.</p>
          </div>
        );
    }
  };

  return (
    <div className="template-editor">
      <div className="template-editor-header">
        <div className="field-group">
          <label htmlFor="template-title">Template Title</label>
          <input
            id="template-title"
            type="text"
            value={localTemplate.title || ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Template title"
            className={`template-title-input ${localIssues.find((i) => i.field.endsWith(".title")) ? "error" : ""}`}
          />
          {localIssues
            .filter((i) => i.field.endsWith(".title"))
            .map((i, idx) => (
              <span key={idx} className="error-message">
                {i.message}
              </span>
            ))}
        </div>
      </div>

      <div className="template-editor-content">{renderEditor()}</div>

      {errors.length > 0 && (
        <div className="validation-errors">
          <h4>Validation Issues:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index} className="error-item">
                <span className="error-field">{error.field}:</span>
                <span className="error-message">{error.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TemplateEditor;
