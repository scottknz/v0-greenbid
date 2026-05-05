'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Highlighter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface RFPEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  isAITyping?: boolean;
  highlightedSectionId?: string | null;
}

export function RFPEditor({ 
  content, 
  onContentChange, 
  isAITyping = false,
  highlightedSectionId 
}: RFPEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your RFP content...',
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6',
      },
    },
  });

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-text-muted">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border border-border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-surface flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('bold') && 'bg-surface-hover text-brand-green'
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('italic') && 'bg-surface-hover text-brand-green'
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('underline') && 'bg-surface-hover text-brand-green'
          )}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('highlight') && 'bg-surface-hover text-brand-green'
          )}
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('heading', { level: 1 }) && 'bg-surface-hover text-brand-green'
          )}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('heading', { level: 2 }) && 'bg-surface-hover text-brand-green'
          )}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('heading', { level: 3 }) && 'bg-surface-hover text-brand-green'
          )}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('bulletList') && 'bg-surface-hover text-brand-green'
          )}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('orderedList') && 'bg-surface-hover text-brand-green'
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('blockquote') && 'bg-surface-hover text-brand-green'
          )}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>

        {isAITyping && (
          <>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-brand-green-light text-brand-green text-xs font-medium">
              <div className="flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
              </div>
              AI is writing
            </div>
          </>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-surface text-xs text-text-muted">
        <div className="flex items-center gap-4">
          <span>{editor.storage.characterCount?.characters?.() || 0} characters</span>
          <span>{editor.storage.characterCount?.words?.() || 0} words</span>
        </div>
        <div>
          {highlightedSectionId && (
            <span className="text-brand-green">Editing: {highlightedSectionId}</span>
          )}
        </div>
      </div>
    </div>
  );
}
