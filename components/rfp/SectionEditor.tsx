'use client';

import { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Sparkles,
  Send,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import type { RFPSectionContent } from '@/types/rfp';

interface SectionEditorProps {
  section: RFPSectionContent;
  onUpdateContent: (content: string) => void;
  onSaveSection: () => void;
  isUnsaved: boolean;
}

export function SectionEditor({
  section,
  onUpdateContent,
  onSaveSection,
  isUnsaved,
}: SectionEditorProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing or use the AI prompt below to generate content...',
      }),
    ],
    content: section.content || '',
    onUpdate: ({ editor }) => {
      onUpdateContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  // Update editor content when section changes
  useEffect(() => {
    if (editor && section.content !== editor.getHTML()) {
      editor.commands.setContent(section.content || '');
    }
  }, [section.id]);

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim() || !editor) return;

    setIsGenerating(true);

    // Simulate AI generation - in production, this would call an API
    setTimeout(() => {
      const generatedContent = generateMockContent(section.title, aiPrompt);
      
      // Insert at cursor or append to content
      editor.commands.insertContent(generatedContent);
      
      setIsGenerating(false);
      setAiPrompt('');
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      // Insert image as HTML since we're not using the Image extension
      editor.chain().focus().insertContent(`<img src="${base64}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`).run();
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAIGenerate();
    }
  };

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {section.title}
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Section {section.number}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isUnsaved && (
            <span className="text-xs text-warning">Unsaved changes</span>
          )}
          <Button
            onClick={onSaveSection}
            disabled={!isUnsaved}
            className={cn(
              'gap-2',
              isUnsaved
                ? 'bg-brand-green hover:bg-brand-green/90 text-white'
                : 'bg-surface text-text-muted'
            )}
          >
            Save Section
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-surface">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('bold') && 'bg-surface-hover'
          )}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('italic') && 'bg-surface-hover'
          )}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('heading', { level: 2 }) && 'bg-surface-hover'
          )}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('heading', { level: 3 }) && 'bg-surface-hover'
          )}
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('bulletList') && 'bg-surface-hover'
          )}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('orderedList') && 'bg-surface-hover'
          )}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 w-8 p-0"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Content — A4 page margins: 25mm ≈ 96px horizontal, 20mm ≈ 76px vertical */}
      <div 
        className={cn(
          'flex-1 overflow-y-auto bg-white transition-colors duration-300',
          isUnsaved
            ? '[&_.ProseMirror]:text-text-secondary'
            : '[&_.ProseMirror]:text-text-primary'
        )}
      >
        <EditorContent 
          editor={editor} 
          className="min-h-full [&_.ProseMirror]:px-[96px] [&_.ProseMirror]:py-[76px] [&_.ProseMirror]:min-h-[500px]"
        />
      </div>

      {/* AI Prompt Section */}
      <div className="border-t border-border bg-surface p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-green-light flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-green" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-muted mb-2">
              AI Section Assistant - Give instructions to update this section
            </p>
            <div className="flex gap-2">
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`e.g., "Add more detail about compliance requirements" or "Rewrite this in a more formal tone"`}
                className="min-h-[60px] resize-none text-sm"
                disabled={isGenerating}
              />
              <Button
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim() || isGenerating}
                className="bg-brand-green hover:bg-brand-green/90 text-white self-end"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock content generator - in production, this would call an AI API
function generateMockContent(sectionTitle: string, prompt: string): string {
  const responses: Record<string, string> = {
    default: `<p>Based on your request to "${prompt}", here is additional content for this section:</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  };

  return responses.default;
}
