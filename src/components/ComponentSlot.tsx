/**
 * ComponentSlot
 *
 * Wrapper around each component in the page editor.
 * Provides:
 *  - Selection highlight
 *  - Inline toolbar (edit mode)
 *  - Drop target indicator (for future drag-and-drop)
 *  - Keyboard selection (Enter/Space)
 */

import React, { useCallback } from 'react';
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { ComponentToolbar } from './ComponentToolbar';
import './ComponentSlot.css';

interface ComponentSlotProps {
  componentId: string;
  typeLabel: string;
  index: number;
  total: number;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSettings?: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  children: React.ReactNode;
}

export const ComponentSlot: React.FC<ComponentSlotProps> = React.memo(({
  componentId,
  typeLabel,
  index,
  total,
  isSelected,
  isEditing,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onSettings,
  dragHandleProps,
  children,
}) => {
  const handleClick = useCallback(() => {
    onSelect(componentId);
  }, [componentId, onSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(componentId);
    }
  }, [componentId, onSelect]);

  const className = [
    'comp-slot',
    isSelected && 'comp-slot--selected',
    isEditing && 'comp-slot--editing',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="listitem"
      aria-label={`${typeLabel} component, position ${index + 1} of ${total}`}
      aria-selected={isSelected}
      data-component-id={componentId}
    >
      {isEditing && dragHandleProps && (
        <div className="comp-slot__drag-handle" {...dragHandleProps} title="Drag to reorder">
          ⠿
        </div>
      )}
      {isEditing && isSelected && (
        <ComponentToolbar
          componentId={componentId}
          label={typeLabel}
          index={index}
          total={total}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onSettings={onSettings}
        />
      )}
      <div className="comp-slot__content">
        {children}
      </div>
    </div>
  );
});

ComponentSlot.displayName = 'ComponentSlot';
