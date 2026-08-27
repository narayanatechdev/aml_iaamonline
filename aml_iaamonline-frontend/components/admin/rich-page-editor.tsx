'use client';

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {
  Bold,
  Italic,
  Subscript as SubIcon,
  Superscript as SupIcon,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Table as TableIcon,
  Trash2,
  Undo2,
  Redo2,
} from 'lucide-react';

/**
 * WYSIWYG editor for prose CMS pages. Produces HTML limited to what
 * lib/rich-text.ts sanitizePageHtml allows (headings, paragraphs, lists,
 * links, blockquote, hr, sub/sup, tables), so what admins see here is what
 * the public page renders.
 */
export function RichPageEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  // Tracks the last HTML we emitted, so external value changes (e.g. loading
  // a page) update the editor without caret jumps on every keystroke.
  const lastEmitted = useRef<string>(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        code: false,
        codeBlock: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener' },
      }),
      Subscript,
      Superscript,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML();
      lastEmitted.current = html;
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== lastEmitted.current) {
      lastEmitted.current = value;
      editor.commands.setContent(value || '<p></p>', false);
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 min-h-[300px] flex items-center justify-center text-sm text-gray-400">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <Toolbar editor={editor} />
      <style>{`
        .rich-page-editor .ProseMirror { min-height: 300px; padding: 1rem 1.25rem; outline: none; }
        .rich-page-editor .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; color: #0f2d6b; margin: 1.5rem 0 0.75rem; }
        .rich-page-editor .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; color: #0f2d6b; margin: 1.25rem 0 0.5rem; }
        .rich-page-editor .ProseMirror h4 { font-size: 1.1rem; font-weight: 600; color: #3a4a6a; margin: 1rem 0 0.5rem; }
        .rich-page-editor .ProseMirror p { color: #3a4a6a; line-height: 1.75; margin: 0.75rem 0; }
        .rich-page-editor .ProseMirror ul { list-style-type: disc; }
        .rich-page-editor .ProseMirror ol { list-style-type: decimal; }
        .rich-page-editor .ProseMirror ul, .rich-page-editor .ProseMirror ol { color: #3a4a6a; padding-left: 1.5rem; margin: 0.75rem 0; }
        .rich-page-editor .ProseMirror li { margin: 0.25rem 0; line-height: 1.7; }
        .rich-page-editor .ProseMirror a { color: #0f2d6b; text-decoration: underline; }
        .rich-page-editor .ProseMirror blockquote { border-left: 4px solid #c9a227; padding-left: 1rem; margin: 1rem 0; color: #5a6a8a; font-style: italic; }
        .rich-page-editor .ProseMirror hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0; }
        .rich-page-editor .ProseMirror table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
        .rich-page-editor .ProseMirror th, .rich-page-editor .ProseMirror td { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; color: #3a4a6a; }
        .rich-page-editor .ProseMirror th { background: #f9fafb; font-weight: 600; color: #0f2d6b; }
        .rich-page-editor .ProseMirror .selectedCell { background: #f0f4fb; }
      `}</style>
      <div className="rich-page-editor bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean) =>
    `p-1.5 rounded-md transition-colors ${
      active ? 'bg-[#0f2d6b] text-white' : 'text-gray-600 hover:bg-gray-200'
    }`;

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL (https://…, /page, mailto:…)', previous ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const headingValue = [2, 3, 4].find((level) => editor.isActive('heading', { level })) ?? 0;

  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
      <select
        value={headingValue}
        onChange={(e) => {
          const level = parseInt(e.target.value, 10);
          if (level === 0) editor.chain().focus().setParagraph().run();
          else editor.chain().focus().setHeading({ level: level as 2 | 3 | 4 }).run();
        }}
        className="text-xs border border-gray-200 rounded-md px-1.5 py-1 bg-white text-gray-700 mr-1"
        aria-label="Text style"
      >
        <option value={0}>Paragraph</option>
        <option value={2}>Heading 2</option>
        <option value={3}>Heading 3</option>
        <option value={4}>Heading 4</option>
      </select>

      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Bold">
        <Bold className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Italic">
        <Italic className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleSubscript().run()} className={btn(editor.isActive('subscript'))} title="Subscript">
        <SubIcon className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={btn(editor.isActive('superscript'))} title="Superscript">
        <SupIcon className="w-4 h-4" />
      </button>

      <span className="w-px h-5 bg-gray-200 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))} title="Bullet list">
        <List className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))} title="Numbered list">
        <ListOrdered className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))} title="Quote">
        <Quote className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)} title="Divider">
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-px h-5 bg-gray-200 mx-1" />

      <button type="button" onClick={setLink} className={btn(editor.isActive('link'))} title="Add/edit link">
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className={btn(false) + ' disabled:opacity-30'}
        title="Remove link"
      >
        <Unlink className="w-4 h-4" />
      </button>

      <span className="w-px h-5 bg-gray-200 mx-1" />

      {editor.isActive('table') ? (
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          className={btn(false) + ' text-red-500'}
          title="Delete table"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className={btn(false)}
          title="Insert table"
        >
          <TableIcon className="w-4 h-4" />
        </button>
      )}

      <span className="flex-1" />

      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btn(false) + ' disabled:opacity-30'} title="Undo">
        <Undo2 className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btn(false) + ' disabled:opacity-30'} title="Redo">
        <Redo2 className="w-4 h-4" />
      </button>
    </div>
  );
}
