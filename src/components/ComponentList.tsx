/**
 * ComponentList
 *
 * Orchestrates the ordered list of components on a page.
 * Connects each component to:
 *  - DynamicComponentRenderer for rendering
 *  - ComponentSlot for selection, toolbar, and layout
 *  - Redux store for component CRUD
 *
 * Handles:
 *  - Component reordering (move up/down)
 *  - Duplicate / Delete with confirmation
 *  - "Add component" button that opens ComponentPicker
 *  - Empty state
 */

import React, { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import type { AppDispatch, RootState } from "../store";
import type { Component } from "../types/course";
import type {
  ComponentDefinition,
  ComponentDataUpdate,
  ComponentInteractionEvent,
} from "../types/registry";
import {
  selectComponent,
  updateComponentLocal,
  updateComponent,
  duplicateComponentLocal,
  removeComponent,
  reorderComponents,
  addComponent,
  debounceStarted,
  debounceSettled,
} from "../store/slices/componentsSlice";
import { DynamicComponentRenderer } from "./DynamicComponentRenderer";
import { ComponentSlot } from "./ComponentSlot";
import ComponentPicker from "./ComponentPicker";
import { registry } from "./registry";
import { resolveComponentType } from "./registry/registrations";
import "./ComponentList.css";

/** Get the component's ID (handles both `id` and `componentId` from API) */
function getCompId(c: Component & Record<string, any>): string {
  return (c as any).id ?? c.componentId;
}

/** Get the component's type (handles both `typeId` and `componentType`) */
function getCompType(c: Component & Record<string, any>): string {
  return (c as any).typeId ?? c.componentType;
}

interface ComponentListProps {
  /** The page whose components to render */
  pageId: string;
  /** Course ID for API calls */
  courseId: string;
  /** 'edit' shows toolbars and editable fields, 'preview' shows read-only */
  mode: "edit" | "preview";
  /** Preview-mode callback for interactions */
  onInteraction?: (event: ComponentInteractionEvent) => void;
  /** Preview-mode callback for component completion */
  onComponentComplete?: (componentId: string) => void;
  /** Edit-mode callback when a component is selected/clicked */
  onComponentSelect?: (componentId: string) => void;
}

export const ComponentList: React.FC<ComponentListProps> = React.memo(
  ({
    pageId,
    courseId,
    mode,
    onInteraction,
    onComponentComplete,
    onComponentSelect,
  }) => {
    const dispatch = useDispatch<AppDispatch>();
    const components: Component[] = useSelector(
      (state: RootState) => state.components.byPage[pageId] ?? [],
    );
    const selectedId = useSelector(
      (state: RootState) => state.components.selectedComponentId,
    );

    const [showPicker, setShowPicker] = useState(false);

    /** Debounce timers for API persist per component */
    const debounceTimers = useRef<
      Record<string, ReturnType<typeof setTimeout>>
    >({});

    /* ── Selection ─────────────────────────────────────────────── */
    const handleSelect = useCallback(
      (id: string) => {
        dispatch(selectComponent(id));
        onComponentSelect?.(id);
      },
      [dispatch, onComponentSelect],
    );

    /* ── Data changes (editor mode) — optimistic local + debounced API ── */
    const handleChange = useCallback(
      (componentId: string, update: Partial<ComponentDataUpdate>) => {
        const dataUpdate = update.data ?? {};
        // Optimistic local update for instant feedback
        dispatch(
          updateComponentLocal({
            pageId,
            componentId,
            updates: { data: dataUpdate },
          }),
        );

        // Debounced API persist (800ms after last keystroke)
        if (debounceTimers.current[componentId]) {
          clearTimeout(debounceTimers.current[componentId]);
          // Cancel the old timer's pending debounce slot
          dispatch(debounceSettled());
        }
        // Register a new pending debounce slot so flush logic can wait for it
        dispatch(debounceStarted());
        debounceTimers.current[componentId] = setTimeout(() => {
          dispatch(debounceSettled());
          dispatch(
            updateComponent({
              courseId,
              pageId,
              componentId,
              request: { data: dataUpdate },
            }),
          );
          delete debounceTimers.current[componentId];
        }, 800);
      },
      [dispatch, pageId, courseId],
    );

    /* ── Reorder ───────────────────────────────────────────────── */
    const handleMoveUp = useCallback(
      (idx: number) => {
        if (idx <= 0) return;
        const ids = components.map((c) => getCompId(c));
        [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
        dispatch(reorderComponents({ courseId, pageId, orderedIds: ids }));
      },
      [components, courseId, pageId, dispatch],
    );

    const handleMoveDown = useCallback(
      (idx: number) => {
        if (idx >= components.length - 1) return;
        const ids = components.map((c) => getCompId(c));
        [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
        dispatch(reorderComponents({ courseId, pageId, orderedIds: ids }));
      },
      [components, courseId, pageId, dispatch],
    );

    /* ── Duplicate — optimistic local + API persist ─────────── */
    const handleDuplicate = useCallback(
      (componentId: string) => {
        const newId = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // Optimistic local duplicate for instant feedback
        dispatch(
          duplicateComponentLocal({
            pageId,
            componentId,
            newComponentId: newId,
          }),
        );
        // Also persist to API: find source component and create a copy
        const source = components.find((c) => getCompId(c) === componentId);
        if (source && courseId && pageId) {
          dispatch(
            addComponent({
              courseId,
              pageId,
              request: {
                componentType: getCompType(source),
                data: (source as any).data ?? {},
              },
            }),
          );
        }
      },
      [dispatch, pageId, courseId, components],
    );

    /* ── Delete with confirmation ──────────────────────────────── */
    const handleDelete = useCallback(
      (componentId: string) => {
        const comp = components.find((c) => getCompId(c) === componentId);
        const label = comp ? getCompType(comp) : "component";
        if (window.confirm(`Delete ${label}? This cannot be undone.`)) {
          dispatch(removeComponent({ courseId, pageId, componentId }));
        }
      },
      [components, courseId, pageId, dispatch],
    );

    /* ── ComponentPicker ───────────────────────────────────────── */
    const handlePickerSelect = useCallback(
      (definition: ComponentDefinition) => {
        if (courseId && pageId) {
          dispatch(
            addComponent({
              courseId,
              pageId,
              request: {
                componentType: definition.typeId,
                data: definition.defaultData ?? {},
              },
            }) as any,
          );
        }
        setShowPicker(false);
      },
      [courseId, pageId, dispatch],
    );

    /* ── Label helper ──────────────────────────────────────────── */
    const getTypeLabel = (typeId: string): string => {
      const resolved = resolveComponentType(typeId);
      const def = registry.get(resolved);
      return def?.displayName ?? typeId;
    };

    /* ── DnD handler ───────────────────────────────────────────── */
    const handleDragEnd = useCallback(
      (result: DropResult) => {
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;
        const ids = components.map((c) => getCompId(c));
        const [moved] = ids.splice(result.source.index, 1);
        ids.splice(result.destination.index, 0, moved);
        dispatch(reorderComponents({ courseId, pageId, orderedIds: ids }));
      },
      [components, courseId, pageId, dispatch],
    );

    /* ── Render ────────────────────────────────────────────────── */
    if (mode === "preview") {
      return (
        <div className="component-list component-list--preview" role="list">
          {components.map((comp) => {
            const cid = getCompId(comp);
            return (
              <div key={cid} className="component-list__item" role="listitem">
                <DynamicComponentRenderer
                  component={comp}
                  mode="preview"
                  onInteraction={onInteraction}
                  onComplete={onComponentComplete}
                />
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="component-list component-list--edit">
        {components.length === 0 ? (
          <div className="component-list__empty">
            <p>No components on this page yet.</p>
            <button
              className="component-list__add-btn"
              onClick={() => setShowPicker(true)}
            >
              + Add First Component
            </button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={`page-${pageId}`}>
              {(droppableProvided) => (
                <div
                  className="component-list__items"
                  role="list"
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                >
                  {components.map((comp, idx) => {
                    const cid = getCompId(comp);
                    return (
                      <Draggable key={cid} draggableId={cid} index={idx}>
                        {(draggableProvided, snapshot) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            className={`component-list__draggable ${snapshot.isDragging ? "component-list__draggable--dragging" : ""}`}
                          >
                            <ComponentSlot
                              componentId={cid}
                              typeLabel={getTypeLabel(getCompType(comp))}
                              index={idx}
                              total={components.length}
                              isSelected={selectedId === cid}
                              isEditing={mode === "edit"}
                              onSelect={handleSelect}
                              onMoveUp={() => handleMoveUp(idx)}
                              onMoveDown={() => handleMoveDown(idx)}
                              onDuplicate={() => handleDuplicate(cid)}
                              onDelete={() => handleDelete(cid)}
                              dragHandleProps={
                                draggableProvided.dragHandleProps
                              }
                            >
                              <DynamicComponentRenderer
                                component={comp}
                                mode="edit"
                                onChange={(update) => handleChange(cid, update)}
                              />
                            </ComponentSlot>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        <button
          className="component-list__add-btn component-list__add-btn--bottom"
          onClick={() => setShowPicker(true)}
          aria-label="Add component"
        >
          + Add Component
        </button>

        {showPicker && (
          <ComponentPicker
            isOpen={showPicker}
            onSelect={handlePickerSelect}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>
    );
  },
);

ComponentList.displayName = "ComponentList";
