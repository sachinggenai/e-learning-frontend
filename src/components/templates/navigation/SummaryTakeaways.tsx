import React from 'react';
import { CheckCircle, Star, ArrowRight, Award } from 'lucide-react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './SummaryTakeaways.css';

// ============================================================
// DATA INTERFACES
// ============================================================

interface KeyPoint {
  id: string;
  text: string;
  icon?: string;
  emphasis?: 'normal' | 'high';
}

export interface SummaryTakeawaysData {
  title: string;
  introText?: string;
  keyPoints: KeyPoint[];
  closingRemarks?: string;
  nextSteps?: string;
  showNextStepsSection?: boolean;
  displayStyle?: 'list' | 'cards';
  showCompleteButton?: boolean;
  showContinueButton?: boolean;
  continueButtonText?: string;
}

// ============================================================
// PREVIEW COMPONENT
// ============================================================

export const SummaryTakeawaysPreview: React.FC<ComponentPreviewProps> = ({
  data: rawData,
  onInteraction,
  onComplete,
  componentId,
}) => {
  const data = rawData as SummaryTakeawaysData;
  const {
    title = 'Key Takeaways',
    introText,
    keyPoints = [],
    closingRemarks,
    nextSteps,
    showNextStepsSection = false,
    displayStyle = 'cards',
    showCompleteButton = false,
    showContinueButton = false,
    continueButtonText = 'Continue to Next Module',
  } = data;

  /**
   * Get icon component based on key point emphasis
   */
  const getKeyPointIcon = (emphasis?: string) => {
    if (emphasis === 'high') {
      return <Star className="tpl-summary-takeaways__key-point-icon tpl-summary-takeaways__key-point-icon--high-emphasis" />;
    }
    return <CheckCircle className="tpl-summary-takeaways__key-point-icon" />;
  };

  /**
   * Handle complete button click
   */
  const handleCompleteClick = () => {
    onComplete?.('');
    onInteraction?.({
      componentId,
      interactionType: 'mark-complete',
      interactionId: 'complete',
      value: true,
    });
  };

  /**
   * Handle continue button click
   */
  const handleContinueClick = () => {
    onInteraction?.({
      componentId,
      interactionType: 'continue-clicked',
      interactionId: 'continue',
      value: true,
    });
  };

  // Empty state
  if (!keyPoints || keyPoints.length === 0) {
    return (
      <div className="tpl-summary-takeaways tpl-summary-takeaways--empty">
        <div className="tpl-summary-takeaways__empty">
          <Award className="tpl-summary-takeaways__empty-icon" />
          <p className="tpl-summary-takeaways__empty-text">No takeaways configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tpl-summary-takeaways">
      {/* Header */}
      <div className="tpl-summary-takeaways__header">
        <h2 className="tpl-summary-takeaways__title">{title}</h2>
        {introText && (
          <p className="tpl-summary-takeaways__intro-text">{introText}</p>
        )}
      </div>

      {/* Key Points */}
      <div
        className={`tpl-summary-takeaways__key-points tpl-summary-takeaways__key-points--${displayStyle}`}
      >
        {keyPoints.map((point) => (
          <div
            key={point.id}
            className={`tpl-summary-takeaways__key-point ${
              point.emphasis === 'high' ? 'tpl-summary-takeaways__key-point--emphasis-high' : ''
            }`}
          >
            {getKeyPointIcon(point.emphasis)}
            <span className="tpl-summary-takeaways__key-point-text">{point.text}</span>
          </div>
        ))}
      </div>

      {/* Closing Remarks */}
      {closingRemarks && (
        <div className="tpl-summary-takeaways__closing">
          <Award className="tpl-summary-takeaways__closing-icon" size={20} />
          <p className="tpl-summary-takeaways__closing-text">{closingRemarks}</p>
        </div>
      )}

      {/* Next Steps Section */}
      {showNextStepsSection && nextSteps && (
        <div className="tpl-summary-takeaways__next-steps">
          <div className="tpl-summary-takeaways__next-steps-header">
            <ArrowRight className="tpl-summary-takeaways__next-steps-icon" size={20} />
            <h3 className="tpl-summary-takeaways__next-steps-title">What's Next</h3>
          </div>
          <p className="tpl-summary-takeaways__next-steps-text">{nextSteps}</p>
        </div>
      )}

      {/* Action Buttons */}
      {(showCompleteButton || showContinueButton) && (
        <div className="tpl-summary-takeaways__actions">
          {showCompleteButton && (
            <button
              type="button"
              className="tpl-summary-takeaways__complete-btn"
              onClick={handleCompleteClick}
            >
              Mark as Complete
            </button>
          )}
          {showContinueButton && (
            <button
              type="button"
              className="tpl-summary-takeaways__continue-btn"
              onClick={handleContinueClick}
            >
              {continueButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// EDITOR COMPONENT
// ============================================================

export const SummaryTakeawaysEditor: React.FC<ComponentEditorProps> = ({
  data: rawData,
  onChange,
}) => {
  const data = rawData as SummaryTakeawaysData;
  const {
    title = 'Key Takeaways',
    introText = '',
    keyPoints = [],
    closingRemarks = '',
    nextSteps = '',
    showNextStepsSection = false,
    displayStyle = 'cards',
    showCompleteButton = false,
    showContinueButton = false,
    continueButtonText = 'Continue to Next Module',
  } = data;

  /**
   * Update field
   */
  const updateField = (field: keyof SummaryTakeawaysData, value: any) => {
    onChange({ data: { ...data, [field]: value } });
  };

  /**
   * Update key point field
   */
  const updateKeyPoint = (index: number, field: keyof KeyPoint, value: any) => {
    const updatedKeyPoints = [...keyPoints];
    updatedKeyPoints[index] = { ...updatedKeyPoints[index], [field]: value };
    onChange({ data: { ...data, keyPoints: updatedKeyPoints } });
  };

  /**
   * Add new key point
   */
  const addKeyPoint = () => {
    const newKeyPoint: KeyPoint = {
      id: `kp-${Date.now()}`,
      text: '',
      icon: 'CheckCircle',
      emphasis: 'normal',
    };
    onChange({ data: { ...data, keyPoints: [...keyPoints, newKeyPoint] } });
  };

  /**
   * Remove key point
   */
  const removeKeyPoint = (index: number) => {
    const updatedKeyPoints = keyPoints.filter((_: KeyPoint, i: number) => i !== index);
    onChange({ data: { ...data, keyPoints: updatedKeyPoints } });
  };

  return (
    <div className="tpl-summary-takeaways-editor">
      {/* Basic Information */}
      <div className="tpl-summary-takeaways-editor__section">
        <h3 className="tpl-summary-takeaways-editor__section-title">Basic Information</h3>

        <div className="tpl-summary-takeaways-editor__field">
          <label className="tpl-summary-takeaways-editor__label" htmlFor="summary-title">
            Title *
          </label>
          <input
            id="summary-title"
            type="text"
            className="tpl-summary-takeaways-editor__input"
            value={title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Key Takeaways"
            required
          />
        </div>

        <div className="tpl-summary-takeaways-editor__field">
          <label className="tpl-summary-takeaways-editor__label" htmlFor="summary-intro">
            Intro Text
          </label>
          <textarea
            id="summary-intro"
            className="tpl-summary-takeaways-editor__textarea"
            value={introText}
            onChange={(e) => updateField('introText', e.target.value)}
            placeholder="Here are the most important points from this module..."
            rows={2}
          />
        </div>

        <div className="tpl-summary-takeaways-editor__field">
          <label className="tpl-summary-takeaways-editor__label">Display Style</label>
          <div className="tpl-summary-takeaways-editor__radio-group">
            <label className="tpl-summary-takeaways-editor__radio-label">
              <input
                type="radio"
                name="displayStyle"
                value="cards"
                checked={displayStyle === 'cards'}
                onChange={(e) => updateField('displayStyle', e.target.value)}
              />
              <span>Cards</span>
            </label>
            <label className="tpl-summary-takeaways-editor__radio-label">
              <input
                type="radio"
                name="displayStyle"
                value="list"
                checked={displayStyle === 'list'}
                onChange={(e) => updateField('displayStyle', e.target.value)}
              />
              <span>List</span>
            </label>
          </div>
        </div>
      </div>

      {/* Key Points */}
      <div className="tpl-summary-takeaways-editor__section">
        <h3 className="tpl-summary-takeaways-editor__section-title">Key Points *</h3>

        <div className="tpl-summary-takeaways-editor__key-points">
          {keyPoints.map((point, index) => (
            <div key={point.id} className="tpl-summary-takeaways-editor__key-point-card">
              <div className="tpl-summary-takeaways-editor__key-point-header">
                <span className="tpl-summary-takeaways-editor__key-point-number">
                  Point {index + 1}
                </span>
                <button
                  type="button"
                  className="tpl-summary-takeaways-editor__remove-btn"
                  onClick={() => removeKeyPoint(index)}
                  aria-label={`Remove key point ${index + 1}`}
                >
                  Remove
                </button>
              </div>

              <div className="tpl-summary-takeaways-editor__key-point-fields">
                <div className="tpl-summary-takeaways-editor__field">
                  <label
                    className="tpl-summary-takeaways-editor__label"
                    htmlFor={`keypoint-text-${index}`}
                  >
                    Text *
                  </label>
                  <textarea
                    id={`keypoint-text-${index}`}
                    className="tpl-summary-takeaways-editor__textarea"
                    value={point.text}
                    onChange={(e) => updateKeyPoint(index, 'text', e.target.value)}
                    placeholder="Enter key takeaway..."
                    rows={2}
                    required
                  />
                </div>

                <div className="tpl-summary-takeaways-editor__field">
                  <label className="tpl-summary-takeaways-editor__label">Emphasis</label>
                  <div className="tpl-summary-takeaways-editor__emphasis-selector">
                    <label className="tpl-summary-takeaways-editor__radio-label">
                      <input
                        type="radio"
                        name={`emphasis-${index}`}
                        value="normal"
                        checked={point.emphasis !== 'high'}
                        onChange={(e) => updateKeyPoint(index, 'emphasis', 'normal')}
                      />
                      <span>Normal</span>
                    </label>
                    <label className="tpl-summary-takeaways-editor__radio-label">
                      <input
                        type="radio"
                        name={`emphasis-${index}`}
                        value="high"
                        checked={point.emphasis === 'high'}
                        onChange={(e) => updateKeyPoint(index, 'emphasis', 'high')}
                      />
                      <span>High Emphasis</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="tpl-summary-takeaways-editor__add-btn"
            onClick={addKeyPoint}
          >
            + Add Key Point
          </button>
        </div>
      </div>

      {/* Closing Remarks */}
      <div className="tpl-summary-takeaways-editor__section">
        <h3 className="tpl-summary-takeaways-editor__section-title">Closing Remarks</h3>
        <div className="tpl-summary-takeaways-editor__field">
          <label className="tpl-summary-takeaways-editor__label" htmlFor="closing-remarks">
            Closing Text
          </label>
          <textarea
            id="closing-remarks"
            className="tpl-summary-takeaways-editor__textarea"
            value={closingRemarks}
            onChange={(e) => updateField('closingRemarks', e.target.value)}
            placeholder="Great work completing this module!"
            rows={2}
          />
        </div>
      </div>

      {/* Next Steps */}
      <div className="tpl-summary-takeaways-editor__section">
        <h3 className="tpl-summary-takeaways-editor__section-title">Next Steps</h3>

        <div className="tpl-summary-takeaways-editor__field">
          <label className="tpl-summary-takeaways-editor__checkbox-label">
            <input
              type="checkbox"
              className="tpl-summary-takeaways-editor__checkbox"
              checked={showNextStepsSection}
              onChange={(e) => updateField('showNextStepsSection', e.target.checked)}
            />
            <span>Show Next Steps section</span>
          </label>
        </div>

        {showNextStepsSection && (
          <div className="tpl-summary-takeaways-editor__field">
            <label className="tpl-summary-takeaways-editor__label" htmlFor="next-steps">
              Next Steps Text
            </label>
            <textarea
              id="next-steps"
              className="tpl-summary-takeaways-editor__textarea"
              value={nextSteps}
              onChange={(e) => updateField('nextSteps', e.target.value)}
              placeholder="Continue to the next module to explore advanced topics..."
              rows={3}
            />
          </div>
        )}
      </div>

      {/* Action Buttons Settings */}
      <div className="tpl-summary-takeaways-editor__section">
        <h3 className="tpl-summary-takeaways-editor__section-title">Action Buttons</h3>

        <div className="tpl-summary-takeaways-editor__field">
          <label className="tpl-summary-takeaways-editor__checkbox-label">
            <input
              type="checkbox"
              className="tpl-summary-takeaways-editor__checkbox"
              checked={showCompleteButton}
              onChange={(e) => updateField('showCompleteButton', e.target.checked)}
            />
            <span>Show "Mark as Complete" button</span>
          </label>
        </div>

        <div className="tpl-summary-takeaways-editor__field">
          <label className="tpl-summary-takeaways-editor__checkbox-label">
            <input
              type="checkbox"
              className="tpl-summary-takeaways-editor__checkbox"
              checked={showContinueButton}
              onChange={(e) => updateField('showContinueButton', e.target.checked)}
            />
            <span>Show "Continue" button</span>
          </label>
        </div>

        {showContinueButton && (
          <div className="tpl-summary-takeaways-editor__field">
            <label className="tpl-summary-takeaways-editor__label" htmlFor="continue-button-text">
              Continue Button Text
            </label>
            <input
              id="continue-button-text"
              type="text"
              className="tpl-summary-takeaways-editor__input"
              value={continueButtonText}
              onChange={(e) => updateField('continueButtonText', e.target.value)}
              placeholder="Continue to Next Module"
            />
          </div>
        )}
      </div>
    </div>
  );
};
