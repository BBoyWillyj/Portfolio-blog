'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  LucideBold,
  LucideItalic,
  LucideHeading1,
  LucideHeading2,
  LucideList,
  LucideListOrdered,
  LucideQuote,
  LucideCode,
  LucideUndo,
  LucideRedo
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({ content, onChange, placeholder = 'Tell your story...' }: TipTapEditorProps) {
  
  // Initialize TipTap Core Engine Instance Hook
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-accent underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[350px] max-h-[600px] overflow-y-auto font-sans text-zinc-200 prose prose-invert max-w-none text-sm leading-relaxed p-4',
      },
    },
    onUpdate: ({ editor }) => {
      // Broadcast compiled rich semantic HTML string up to parent state handlers
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  // Custom Toolbar Button Mapping Helper Function
  const ToolbarButton = ({ onClick, isActive, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
        isActive 
          ? 'bg-zinc-800 text-brand-accent border border-zinc-700/60 shadow-inner' 
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full border border-zinc-800 rounded-xl bg-zinc-950/20 backdrop-blur-md overflow-hidden focus-within:border-zinc-700 transition-all duration-200">
      
      {/* Master Top Core Control Menu Toolbar Row */}
      <div className="flex flex-wrap items-center gap-1 bg-zinc-950/60 border-b border-zinc-800 p-2">
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold text"
        >
          <LucideBold size={15} />
        </ToolbarButton>

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic text"
        >
          <LucideItalic size={15} />
        </ToolbarButton>

        <div className="w-[1px] h-5 bg-zinc-800 mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <LucideHeading1 size={15} />
        </ToolbarButton>

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <LucideHeading2 size={15} />
        </ToolbarButton>

        <div className="w-[1px] h-5 bg-zinc-800 mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <LucideList size={15} />
        </ToolbarButton>

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <LucideListOrdered size={15} />
        </ToolbarButton>

        <div className="w-[1px] h-5 bg-zinc-800 mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <LucideQuote size={15} />
        </ToolbarButton>

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <LucideCode size={15} />
        </ToolbarButton>

        <div className="flex-grow" />

        {/* History Action Controller Cluster */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo changes"
        >
          <LucideUndo size={15} />
        </ToolbarButton>

        <ToolbarButton 
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo changes"
        >
          <LucideRedo size={15} />
        </ToolbarButton>
      </div>

      {/* Dynamic Native Selection Bubble Floating Action Box Menu */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl overflow-hidden p-1 gap-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-xs font-sans rounded ${editor.isActive('bold') ? 'text-brand-accent bg-zinc-800' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-xs font-sans rounded ${editor.isActive('italic') ? 'text-brand-accent bg-zinc-800' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Italic
        </button>
      </BubbleMenu>

      {/* Main Framework Editable Target Viewport Block Injection Area */}
      <EditorContent editor={editor} />
      
    </div>
  );
}