/**
 * ComponentSettings — Side panel for per-component settings.
 *
 * Allows editing:
 *  - Completion criteria (type, threshold, required interactions)
 *  - Audio configuration (enable/disable, add audio items)
 *  - Styling overrides (theme colors, layout position)
 *
 * Opens when a component is selected in the editor; dispatches
 * updateComponent thunk from componentsSlice on change.
 */

import React, { useCallback, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { updateComponent } from "../store/slices/componentsSlice";
import {
  Component,
  CompletionCriteria,
  CompletionType,
  AudioConfig,
  AudioItem,
  ComponentStyling,
} from "../types/course";
import { registry } from "./registry";
import "./ComponentSettings.css";

interface ComponentSettingsProps {
  component: Component;
  courseId: string;
  pageId: string;
  onClose: () => void;
}

const COMPLETION_TYPES: {
  value: CompletionType;
  label: string;
  description: string;
}[] = [
  { value: "view", label: "View", description: "Complete when viewed" },
  {
    value: "interact",
    label: "Interact",
    description: "Require user interaction",
  },
  { value: "audio", label: "Audio", description: "Must listen to audio" },
  { value: "score", label: "Score", description: "Must achieve minimum score" },
  { value: "custom", label: "Custom", description: "Custom completion logic" },
];

export const ComponentSettings: React.FC<ComponentSettingsProps> = ({
  component,
  courseId,
  pageId,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const definition = registry.get(component.componentType);

  // Local state for edits
  const [completion, setCompletion] = useState<CompletionCriteria>(
    component.completionCriteria ?? { type: "view" },
  );
  const [audio, setAudio] = useState<AudioConfig>(
    component.audioConfig ?? { enabled: false, audioItems: [] },
  );
  const [styling, setStyling] = useState<ComponentStyling>(
    component.styling ?? {},
  );
  const [activeTab, setActiveTab] = useState<
    "completion" | "audio" | "styling"
  >("completion");

  const supportedCompletionTypes = useMemo(() => {
    const caps: string[] = definition?.completionCapabilities ?? ["view"];
    return COMPLETION_TYPES.filter((t) => caps.includes(t.value));
  }, [definition]);

  const audioSupport = definition?.audioSupport;

  const handleSave = useCallback(() => {
    dispatch(
      updateComponent({
        courseId,
        pageId,
        componentId: component.componentId,
        request: {
          data: component.data,
          completionCriteria: completion,
          audioConfig: audio,
          styling,
        },
      }),
    );
    onClose();
  }, [
    dispatch,
    courseId,
    pageId,
    component.componentId,
    component.data,
    completion,
    audio,
    styling,
    onClose,
  ]);

  // ─── Completion Tab ──────────────────────────────────────────────
  const renderCompletionTab = () => (
    <div className="cs-section">
      <h4>Completion Criteria</h4>
      <div className="cs-field">
        <label>Type</label>
        <select
          value={completion.type}
          onChange={(e) =>
            setCompletion({
              ...completion,
              type: e.target.value as CompletionType,
            })
          }
        >
          {supportedCompletionTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <small>
          {
            supportedCompletionTypes.find((t) => t.value === completion.type)
              ?.description
          }
        </small>
      </div>

      {(completion.type === "audio" || completion.type === "score") && (
        <div className="cs-field">
          <label>Threshold (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={completion.threshold ?? 90}
            onChange={(e) =>
              setCompletion({
                ...completion,
                threshold: Number(e.target.value),
              })
            }
          />
        </div>
      )}

      {completion.type === "interact" && (
        <div className="cs-field">
          <label>Required Interaction IDs</label>
          <input
            type="text"
            placeholder="Comma-separated IDs"
            value={(completion.requiredInteractions ?? []).join(", ")}
            onChange={(e) =>
              setCompletion({
                ...completion,
                requiredInteractions: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>
      )}
    </div>
  );

  // ─── Audio Tab ───────────────────────────────────────────────────
  const renderAudioTab = () => (
    <div className="cs-section">
      <h4>Audio Configuration</h4>
      {!audioSupport?.perComponent && !audioSupport?.perInteraction ? (
        <p className="cs-info">
          Audio is not supported for this component type.
        </p>
      ) : (
        <>
          <div className="cs-field cs-toggle">
            <label>
              <input
                type="checkbox"
                checked={audio.enabled}
                onChange={(e) =>
                  setAudio({ ...audio, enabled: e.target.checked })
                }
              />
              Enable Audio
            </label>
          </div>
          {audio.enabled && (
            <div className="cs-audio-items">
              {audio.audioItems.map((item, idx) => (
                <AudioItemEditor
                  key={idx}
                  item={item}
                  index={idx}
                  onChange={(updated) => {
                    const items = [...audio.audioItems];
                    items[idx] = updated;
                    setAudio({ ...audio, audioItems: items });
                  }}
                  onRemove={() => {
                    setAudio({
                      ...audio,
                      audioItems: audio.audioItems.filter((_, i) => i !== idx),
                    });
                  }}
                />
              ))}
              <button
                className="cs-btn cs-btn-secondary"
                onClick={() =>
                  setAudio({
                    ...audio,
                    audioItems: [
                      ...audio.audioItems,
                      {
                        audioUrl: "",
                        triggerOn: "load",
                        autoplay: false,
                        requiredForCompletion: false,
                      },
                    ],
                  })
                }
              >
                + Add Audio Item
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ─── Styling Tab ─────────────────────────────────────────────────
  const renderStylingTab = () => (
    <div className="cs-section">
      <h4>Styling Overrides</h4>
      <div className="cs-field">
        <label>Layout Position</label>
        <input
          type="text"
          placeholder="e.g., slot-1, auto"
          value={styling.layoutPosition ?? ""}
          onChange={(e) =>
            setStyling({ ...styling, layoutPosition: e.target.value || null })
          }
        />
      </div>
      <div className="cs-field">
        <label>Background Color</label>
        <input
          type="color"
          value={styling.themeOverrides?.colors?.background ?? "#ffffff"}
          onChange={(e) =>
            setStyling({
              ...styling,
              themeOverrides: {
                ...styling.themeOverrides,
                colors: {
                  ...styling.themeOverrides?.colors,
                  background: e.target.value,
                },
              },
            })
          }
        />
      </div>
      <div className="cs-field">
        <label>Text Color</label>
        <input
          type="color"
          value={styling.themeOverrides?.colors?.text ?? "#333333"}
          onChange={(e) =>
            setStyling({
              ...styling,
              themeOverrides: {
                ...styling.themeOverrides,
                colors: {
                  ...styling.themeOverrides?.colors,
                  text: e.target.value,
                },
              },
            })
          }
        />
      </div>
    </div>
  );

  return (
    <aside
      className="component-settings"
      role="complementary"
      aria-label="Component Settings"
    >
      <div className="cs-header">
        <h3>{definition?.displayName ?? component.componentType} Settings</h3>
        <button
          className="cs-close"
          onClick={onClose}
          aria-label="Close settings"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <nav className="cs-tabs" role="tablist">
        {(["completion", "audio", "styling"] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`cs-tab ${activeTab === tab ? "cs-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="cs-body">
        {activeTab === "completion" && renderCompletionTab()}
        {activeTab === "audio" && renderAudioTab()}
        {activeTab === "styling" && renderStylingTab()}
      </div>

      {/* Actions */}
      <div className="cs-footer">
        <button className="cs-btn cs-btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="cs-btn cs-btn-primary" onClick={handleSave}>
          Apply
        </button>
      </div>
    </aside>
  );
};

// ─── Audio Item Editor Sub-component ──────────────────────────────
interface AudioItemEditorProps {
  item: AudioItem;
  index: number;
  onChange: (item: AudioItem) => void;
  onRemove: () => void;
}

const AudioItemEditor: React.FC<AudioItemEditorProps> = ({
  item,
  index,
  onChange,
  onRemove,
}) => (
  <div className="cs-audio-item">
    <div className="cs-audio-item-header">
      <span>Audio {index + 1}</span>
      <button
        className="cs-remove"
        onClick={onRemove}
        aria-label="Remove audio item"
      >
        ×
      </button>
    </div>
    <div className="cs-field">
      <label>URL</label>
      <input
        type="text"
        value={item.audioUrl}
        placeholder="https://..."
        onChange={(e) => onChange({ ...item, audioUrl: e.target.value })}
      />
    </div>
    <div className="cs-field">
      <label>Trigger</label>
      <select
        value={item.triggerOn}
        onChange={(e) =>
          onChange({
            ...item,
            triggerOn: e.target.value as AudioItem["triggerOn"],
          })
        }
      >
        <option value="load">On Load</option>
        <option value="click">On Click</option>
        <option value="interaction">On Interaction</option>
      </select>
    </div>
    <div className="cs-field cs-toggle">
      <label>
        <input
          type="checkbox"
          checked={item.autoplay}
          onChange={(e) => onChange({ ...item, autoplay: e.target.checked })}
        />
        Autoplay
      </label>
    </div>
    <div className="cs-field cs-toggle">
      <label>
        <input
          type="checkbox"
          checked={item.requiredForCompletion}
          onChange={(e) =>
            onChange({ ...item, requiredForCompletion: e.target.checked })
          }
        />
        Required for Completion
      </label>
    </div>
  </div>
);

export default ComponentSettings;
