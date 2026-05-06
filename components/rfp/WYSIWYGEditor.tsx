'use client';

import { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
  Type,
} from 'lucide-react';

interface WYSIWYGEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function WYSIWYGEditor({
  content,
  onChange,
  placeholder = 'Type "/" for commands, or start writing...',
  className,
}: WYSIWYGEditorProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[500px]',
      },
      handleKeyDown: (view, event) => {
        if (event.key === '/') {
          setShowSlashMenu(true);
        } else if (event.key === 'Escape') {
          setShowSlashMenu(false);
        }
        return false;
      },
    },
  });

  const handleSlashCommand = useCallback((command: string) => {
    if (!editor) return;
    setShowSlashMenu(false);

    switch (command) {
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'bullet':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'numbered':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'quote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'code':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'divider':
        editor.chain().focus().setHorizontalRule().run();
        break;
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('relative', className)}>
      {/* Floating Toolbar - appears when text is selected */}
      {editor.isActive('textSelection') && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-white rounded-lg shadow-lg border border-border p-1 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-surface-hover')}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn('h-8 w-8 p-0', editor.isActive('italic') && 'bg-surface-hover')}
          >
            <Italic className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Slash Command Menu */}
      {showSlashMenu && (
        <div className="absolute z-50 bg-white rounded-lg shadow-lg border border-border p-2 w-64">
          <p className="text-xs text-text-muted px-2 py-1 mb-1">Basic blocks</p>
          <button
            onClick={() => handleSlashCommand('h1')}
            className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-surface-hover text-left"
          >
            <Heading1 className="w-4 h-4 text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Heading 1</p>
              <p className="text-xs text-text-muted">Large section heading</p>
            </div>
          </button>
          <button
            onClick={() => handleSlashCommand('h2')}
            className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-surface-hover text-left"
          >
            <Heading2 className="w-4 h-4 text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Heading 2</p>
              <p className="text-xs text-text-muted">Medium section heading</p>
            </div>
          </button>
          <button
            onClick={() => handleSlashCommand('h3')}
            className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-surface-hover text-left"
          >
            <Heading3 className="w-4 h-4 text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Heading 3</p>
              <p className="text-xs text-text-muted">Small section heading</p>
            </div>
          </button>
          <button
            onClick={() => handleSlashCommand('bullet')}
            className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-surface-hover text-left"
          >
            <List className="w-4 h-4 text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Bullet List</p>
              <p className="text-xs text-text-muted">Create a bulleted list</p>
            </div>
          </button>
          <button
            onClick={() => handleSlashCommand('numbered')}
            className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-surface-hover text-left"
          >
            <ListOrdered className="w-4 h-4 text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Numbered List</p>
              <p className="text-xs text-text-muted">Create a numbered list</p>
            </div>
          </button>
          <button
            onClick={() => handleSlashCommand('quote')}
            className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-surface-hover text-left"
          >
            <Quote className="w-4 h-4 text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Quote</p>
              <p className="text-xs text-text-muted">Capture a quote</p>
            </div>
          </button>
          <button
            onClick={() => handleSlashCommand('divider')}
            className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-surface-hover text-left"
          >
            <Minus className="w-4 h-4 text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Divider</p>
              <p className="text-xs text-text-muted">Visual divider line</p>
            </div>
          </button>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7 prose-li:text-base"
      />

      {/* Bottom Toolbar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-border px-2 py-1.5 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn('h-8 w-8 p-0 rounded-full', editor.isActive('paragraph') && 'bg-surface-hover')}
          title="Paragraph"
        >
          <Type className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn('h-8 w-8 p-0 rounded-full', editor.isActive('heading', { level: 1 }) && 'bg-surface-hover')}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn('h-8 w-8 p-0 rounded-full', editor.isActive('heading', { level: 2 }) && 'bg-surface-hover')}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn('h-8 w-8 p-0 rounded-full', editor.isActive('bold') && 'bg-surface-hover')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn('h-8 w-8 p-0 rounded-full', editor.isActive('italic') && 'bg-surface-hover')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn('h-8 w-8 p-0 rounded-full', editor.isActive('bulletList') && 'bg-surface-hover')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn('h-8 w-8 p-0 rounded-full', editor.isActive('orderedList') && 'bg-surface-hover')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0 rounded-full"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0 rounded-full"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
