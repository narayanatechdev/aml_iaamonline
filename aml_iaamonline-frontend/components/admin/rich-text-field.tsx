'use client';

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import {
  Bold,
  Italic,
  Subscript as SubIcon,
  Superscript as SupIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
} from 'lucide-react';

/**
 * Compact TipTap editor for a single rich-text field inside the structured
 * page editor (fields marked rich: true in lib/page-layouts.ts). Produces a
 * small HTML subset (paragraphs, bold/italic, sub/sup, links, lists) that
 * the public components render through lib/rich-text.ts sanitizePageHtml.
 */
export function RichTextField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const lastEmitted = useRef<string>(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener' },
      }),
      Subscript,
      Superscript,
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => {
      const html = e.isEmpty ? '' : e.getHTML();
      lastEmitted.current = html;
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'rich-field-editor focus:outline-none',
        ...(placeholder ? { 'data-placeholder': placeholder } : {}),
      },
    },
  });

  useEffect(() => {
    if (editor && value !== lastEmitted.current) {
      lastEmitted.current = value;
      editor.commands.setContent(value || '', false);
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="min-h-[90px] rounded-lg border border-gray-200 bg-gray-50" />;
  }

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const Btn = ({
    onClick,
    active,
    disabled,
    label,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`p-1.5 rounded transition-colors disabled:opacity-40 ${
        active ? 'bg-[#0f2d6b] text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-[#0f2d6b]/20 focus-within:border-[#0f2d6b] overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1 border-b border-gray-100 bg-gray-50/70">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label="Bold"><Bold className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label="Italic"><Italic className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')} label="Subscript"><SubIcon className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')} label="Superscript"><SupIcon className="w-3.5 h-3.5" /></Btn>
        <span className="w-px h-4 bg-gray-200 mx-1" />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} label="Bullet list"><List className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} label="Numbered list"><ListOrdered className="w-3.5 h-3.5" /></Btn>
        <span className="w-px h-4 bg-gray-200 mx-1" />
        <Btn onClick={setLink} active={editor.isActive('link')} label="Link"><LinkIcon className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} label="Remove link"><Unlink className="w-3.5 h-3.5" /></Btn>
        <span className="flex-1" />
        <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} label="Undo"><Undo2 className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} label="Redo"><Redo2 className="w-3.5 h-3.5" /></Btn>
      </div>
      <EditorContent editor={editor} />
      <style>{`
        .rich-field-editor {
          min-height: 90px;
          padding: 10px 12px;
          font-size: 0.875rem;
          color: #26324b;
          line-height: 1.6;
        }
        .rich-field-editor p { margin: 0 0 0.6rem; }
        .rich-field-editor p:last-child { margin-bottom: 0; }
        .rich-field-editor ul, .rich-field-editor ol { padding-left: 1.25rem; margin: 0 0 0.6rem; }
        .rich-field-editor ul { list-style-type: disc; }
        .rich-field-editor ol { list-style-type: decimal; }
        .rich-field-editor a { color: #0f2d6b; text-decoration: underline; }
        .rich-field-editor:empty::before,
        .rich-field-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          height: 0;
          float: left;
        }
      `}</style>
    </div>
  );
}
