'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GripVertical,
  Check,
  Circle,
  Pencil,
  X,
  Plus,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import type { RFPSectionContent } from '@/types/rfp';

interface SectionItemProps {
  section: RFPSectionContent;
  isActive: boolean;
  isEditing: boolean;
  editValue: string;
  onSelect: () => void;
  onStartEdit: () => void;
  onEditChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

function SortableSectionItem({
  section,
  isActive,
  isEditing,
  editValue,
  onSelect,
  onStartEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
}: SectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasContent = section.content && section.content.length > 50;
  const isSaved = section.aiTextStatus === 'accepted' || section.lastEditedBy === 'user';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition-colors',
        isActive
          ? 'bg-brand-green-light border border-brand-green'
          : 'hover:bg-surface-hover border border-transparent',
        isDragging && 'opacity-50 bg-surface-hover'
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 p-1 text-text-muted hover:text-text-secondary cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Status Indicator */}
      <div className="flex-shrink-0">
        {isSaved ? (
          <Check className="w-4 h-4 text-brand-green" />
        ) : hasContent ? (
          <Circle className="w-4 h-4 text-warning fill-warning" />
        ) : (
          <Circle className="w-4 h-4 text-text-muted" />
        )}
      </div>

      {/* Section Title */}
      {isEditing ? (
        <div className="flex-1 flex items-center gap-1">
          <Input
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit();
              if (e.key === 'Escape') onCancelEdit();
            }}
            className="h-7 text-sm py-0 px-2"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onSaveEdit}
            className="h-6 w-6 p-0"
          >
            <Check className="w-3 h-3 text-brand-green" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelEdit}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3 text-text-muted" />
          </Button>
        </div>
      ) : (
        <button
          onClick={onSelect}
          className="flex-1 text-left"
        >
          <span
            className={cn(
              'text-sm truncate block',
              isActive ? 'text-brand-green font-medium' : 'text-text-primary',
              !isSaved && hasContent && 'text-text-secondary'
            )}
          >
            {section.title}
          </span>
        </button>
      )}

      {/* Edit Button */}
      {!isEditing && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onStartEdit();
          }}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="w-3 h-3 text-text-muted" />
        </Button>
      )}
    </div>
  );
}

interface SectionNavigatorProps {
  sections: RFPSectionContent[];
  activeSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  onReorderSections: (sections: RFPSectionContent[]) => void;
  onUpdateSectionTitle: (sectionId: string, newTitle: string) => void;
  onAddSection: (type: 'text' | 'image') => void;
}

export function SectionNavigator({
  sections,
  activeSectionId,
  onSelectSection,
  onReorderSections,
  onUpdateSectionTitle,
  onAddSection,
}: SectionNavigatorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);
      onReorderSections(newSections);
    }
  };

  const handleStartEdit = (section: RFPSectionContent) => {
    setEditingId(section.id);
    setEditValue(section.title);
  };

  const handleSaveEdit = (sectionId: string) => {
    if (editValue.trim()) {
      onUpdateSectionTitle(sectionId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Sections</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Drag to reorder
        </p>
      </div>

      {/* Section List */}
      <div className="flex-1 overflow-y-auto p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {sections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  isActive={activeSectionId === section.id}
                  isEditing={editingId === section.id}
                  editValue={editValue}
                  onSelect={() => onSelectSection(section.id)}
                  onStartEdit={() => handleStartEdit(section)}
                  onEditChange={setEditValue}
                  onSaveEdit={() => handleSaveEdit(section.id)}
                  onCancelEdit={handleCancelEdit}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Section Buttons */}
      <div className="p-3 border-t border-border space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddSection('text')}
          className="w-full justify-start gap-2 text-text-secondary"
        >
          <Plus className="w-4 h-4" />
          <FileText className="w-4 h-4" />
          Add Text Section
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddSection('image')}
          className="w-full justify-start gap-2 text-text-secondary"
        >
          <Plus className="w-4 h-4" />
          <ImageIcon className="w-4 h-4" />
          Add Image Block
        </Button>
      </div>

      {/* Legend */}
      <div className="px-3 py-2 border-t border-border bg-surface">
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <Check className="w-3 h-3 text-brand-green" />
            <span>Saved</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-3 h-3 text-warning fill-warning" />
            <span>Draft</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-3 h-3 text-text-muted" />
            <span>Empty</span>
          </div>
        </div>
      </div>
    </div>
  );
}
