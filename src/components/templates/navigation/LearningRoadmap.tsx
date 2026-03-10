import React from 'react';
import { CheckCircle, BookOpen, Lock, Clock } from 'lucide-react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './LearningRoadmap.css';

// ============================================================
// DATA INTERFACES
// ============================================================

interface Milestone {
  id: string;
  title: string;
  description?: string;
  pageId?: string;
  status: 'completed' | 'current' | 'locked';
  icon?: string;
  estimatedDuration?: number;
}

export interface LearningRoadmapData {
  title?: string;
  description?: string;
  milestones: Milestone[];
  showConnectors?: boolean;
  layout?: 'vertical' | 'horizontal';
}

// ============================================================
// PREVIEW COMPONENT
// ============================================================

export const LearningRoadmapPreview: React.FC<ComponentPreviewProps> = ({
  data: rawData,
  onInteraction,
  componentId,
}) => {
  const data = rawData as LearningRoadmapData;
  const {
    title,
    description,
    milestones = [],
    showConnectors = true,
  } = data;

  /**
   * Get icon component based on milestone status
   */
  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="tpl-learning-roadmap__icon" />;
      case 'current':
        return <BookOpen className="tpl-learning-roadmap__icon" />;
      case 'locked':
        return <Lock className="tpl-learning-roadmap__icon" />;
      default:
        return <BookOpen className="tpl-learning-roadmap__icon" />;
    }
  };

  /**
   * Handle milestone click
   */
  const handleMilestoneClick = (milestone: Milestone) => {
    if ((milestone.status === 'completed' || milestone.status === 'current') && milestone.pageId) {
      onInteraction?.({
        componentId,
        interactionType: 'milestone_click',
        interactionId: milestone.id,
        value: milestone.pageId,
      });
    }
  };

  // Empty state
  if (!milestones || milestones.length === 0) {
    return (
      <div className="tpl-learning-roadmap tpl-learning-roadmap--empty">
        <div className="tpl-learning-roadmap__empty">
          <BookOpen className="tpl-learning-roadmap__empty-icon" />
          <p className="tpl-learning-roadmap__empty-text">No milestones configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tpl-learning-roadmap">
      {/* Header */}
      {(title || description) && (
        <div className="tpl-learning-roadmap__header">
          {title && <h2 className="tpl-learning-roadmap__title">{title}</h2>}
          {description && <p className="tpl-learning-roadmap__description">{description}</p>}
        </div>
      )}

      {/* Learning Path */}
      <div className="tpl-learning-roadmap__path">
        {milestones.map((milestone: Milestone, index: number) => {
          const isClickable =
            (milestone.status === 'completed' || milestone.status === 'current') &&
            Boolean(milestone.pageId);
          const isLastMilestone = index === milestones.length - 1;

          return (
            <div key={milestone.id} className="tpl-learning-roadmap__milestone-wrapper">
              {/* Milestone Card */}
              <div
                className={`tpl-learning-roadmap__milestone tpl-learning-roadmap__milestone--${milestone.status} ${
                  isClickable ? 'tpl-learning-roadmap__milestone--clickable' : ''
                }`}
                onClick={() => isClickable && handleMilestoneClick(milestone)}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleMilestoneClick(milestone);
                  }
                }}
                aria-label={
                  isClickable
                    ? `${milestone.title} - ${milestone.status} milestone`
                    : `${milestone.title} - locked milestone`
                }
              >
                {/* Status Badge */}
                <div
                  className={`tpl-learning-roadmap__milestone-badge tpl-learning-roadmap__milestone-badge--${milestone.status}`}
                >
                  {getStatusIcon(milestone.status)}
                </div>

                {/* Content */}
                <div className="tpl-learning-roadmap__milestone-content">
                  <h3 className="tpl-learning-roadmap__milestone-title">{milestone.title}</h3>
                  {milestone.description && (
                    <p className="tpl-learning-roadmap__milestone-description">
                      {milestone.description}
                    </p>
                  )}
                  {milestone.estimatedDuration && (
                    <div className="tpl-learning-roadmap__milestone-duration">
                      <Clock size={14} />
                      <span>{milestone.estimatedDuration} min</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {showConnectors && !isLastMilestone && (
                <div
                  className={`tpl-learning-roadmap__connector ${
                    milestone.status === 'completed'
                      ? 'tpl-learning-roadmap__connector--completed'
                      : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// EDITOR COMPONENT
// ============================================================

export const LearningRoadmapEditor: React.FC<ComponentEditorProps> = ({
  data: rawData,
  onChange,
}) => {
  const data = rawData as LearningRoadmapData;
  const {
    title = '',
    description = '',
    milestones = [],
    showConnectors = true,
  } = data;

  /**
   * Update roadmap field
   */
  const updateField = (field: keyof LearningRoadmapData, value: any) => {
    onChange({ data: { ...data, [field]: value } });
  };

  /**
   * Update milestone field
   */
  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };

    // Enforce single 'current' status
    if (field === 'status' && value === 'current') {
      updatedMilestones.forEach((m, i) => {
        if (i !== index && m.status === 'current') {
          m.status = 'locked';
        }
      });
    }

    onChange({ data: { ...data, milestones: updatedMilestones } });
  };

  /**
   * Add new milestone
   */
  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `ms-${Date.now()}`,
      title: 'New Milestone',
      description: '',
      status: 'locked',
    };
    onChange({ data: { ...data, milestones: [...milestones, newMilestone] } });
  };

  /**
   * Remove milestone
   */
  const removeMilestone = (index: number) => {
    const updatedMilestones = milestones.filter((_: Milestone, i: number) => i !== index);
    onChange({ data: { ...data, milestones: updatedMilestones } });
  };

  return (
    <div className="tpl-learning-roadmap-editor">
      {/* Roadmap Settings */}
      <div className="tpl-learning-roadmap-editor__header">
        <div className="tpl-learning-roadmap-editor__field">
          <label className="tpl-learning-roadmap-editor__label" htmlFor="roadmap-title">
            Roadmap Title
          </label>
          <input
            id="roadmap-title"
            type="text"
            className="tpl-learning-roadmap-editor__input"
            value={title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Learning Roadmap"
          />
        </div>

        <div className="tpl-learning-roadmap-editor__field">
          <label className="tpl-learning-roadmap-editor__label" htmlFor="roadmap-description">
            Description
          </label>
          <textarea
            id="roadmap-description"
            className="tpl-learning-roadmap-editor__textarea"
            value={description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Track your progress through the course"
            rows={2}
          />
        </div>

        <div className="tpl-learning-roadmap-editor__field">
          <label className="tpl-learning-roadmap-editor__checkbox-label">
            <input
              type="checkbox"
              className="tpl-learning-roadmap-editor__checkbox"
              checked={showConnectors}
              onChange={(e) => updateField('showConnectors', e.target.checked)}
            />
            <span>Show connector lines</span>
          </label>
        </div>
      </div>

      {/* Milestone List */}
      <div className="tpl-learning-roadmap-editor__milestones">
        <h3 className="tpl-learning-roadmap-editor__section-title">Milestones</h3>

        {milestones.map((milestone: Milestone, index: number) => (
          <div key={milestone.id} className="tpl-learning-roadmap-editor__milestone-card">
            <div className="tpl-learning-roadmap-editor__milestone-header">
              <span className="tpl-learning-roadmap-editor__milestone-number">
                Milestone {index + 1}
              </span>
              <button
                type="button"
                className="tpl-learning-roadmap-editor__remove-btn"
                onClick={() => removeMilestone(index)}
                aria-label={`Remove milestone ${index + 1}`}
              >
                Remove
              </button>
            </div>

            <div className="tpl-learning-roadmap-editor__milestone-fields">
              <div className="tpl-learning-roadmap-editor__field">
                <label
                  className="tpl-learning-roadmap-editor__label"
                  htmlFor={`milestone-title-${index}`}
                >
                  Title *
                </label>
                <input
                  id={`milestone-title-${index}`}
                  type="text"
                  className="tpl-learning-roadmap-editor__input"
                  value={milestone.title}
                  onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                  placeholder="Milestone title"
                  required
                />
              </div>

              <div className="tpl-learning-roadmap-editor__field">
                <label
                  className="tpl-learning-roadmap-editor__label"
                  htmlFor={`milestone-description-${index}`}
                >
                  Description
                </label>
                <textarea
                  id={`milestone-description-${index}`}
                  className="tpl-learning-roadmap-editor__textarea"
                  value={milestone.description || ''}
                  onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                  placeholder="Milestone description (optional)"
                  rows={2}
                />
              </div>

              <div className="tpl-learning-roadmap-editor__field-row">
                <div className="tpl-learning-roadmap-editor__field tpl-learning-roadmap-editor__field--half">
                  <label
                    className="tpl-learning-roadmap-editor__label"
                    htmlFor={`milestone-status-${index}`}
                  >
                    Status *
                  </label>
                  <select
                    id={`milestone-status-${index}`}
                    className="tpl-learning-roadmap-editor__status-selector"
                    value={milestone.status}
                    onChange={(e) =>
                      updateMilestone(index, 'status', e.target.value as Milestone['status'])
                    }
                  >
                    <option value="completed">Completed</option>
                    <option value="current">Current</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>

                <div className="tpl-learning-roadmap-editor__field tpl-learning-roadmap-editor__field--half">
                  <label
                    className="tpl-learning-roadmap-editor__label"
                    htmlFor={`milestone-duration-${index}`}
                  >
                    Duration (min)
                  </label>
                  <input
                    id={`milestone-duration-${index}`}
                    type="number"
                    className="tpl-learning-roadmap-editor__input"
                    value={milestone.estimatedDuration || ''}
                    onChange={(e) =>
                      updateMilestone(
                        index,
                        'estimatedDuration',
                        e.target.value ? parseInt(e.target.value, 10) : undefined
                      )
                    }
                    placeholder="30"
                    min="1"
                  />
                </div>
              </div>

              <div className="tpl-learning-roadmap-editor__field">
                <label
                  className="tpl-learning-roadmap-editor__label"
                  htmlFor={`milestone-page-id-${index}`}
                >
                  Page ID (for navigation)
                </label>
                <input
                  id={`milestone-page-id-${index}`}
                  type="text"
                  className="tpl-learning-roadmap-editor__input"
                  value={milestone.pageId || ''}
                  onChange={(e) => updateMilestone(index, 'pageId', e.target.value)}
                  placeholder="page-1"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="tpl-learning-roadmap-editor__add-btn"
          onClick={addMilestone}
        >
          + Add Milestone
        </button>
      </div>
    </div>
  );
};
