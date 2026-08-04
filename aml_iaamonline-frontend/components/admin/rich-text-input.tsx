'use client';

import { useRef, useEffect, useCallback } from 'react';

export interface RichTextInputProps {
  value: string;
  onChange: (html: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}

/** Formatting buttons — order defines left-to-right display. */
const TOOLBAR_BUTTONS: { label: string; cmd: string; title: string; style?: string }[] = [
  { label: 'B',  cmd: 'bold',        title: 'Bold',        style: 'font-bold' },
  { label: 'I',  cmd: 'italic',      title: 'Italic',      style: 'italic' },
  { label: 'x²', cmd: 'superscript', title: 'Superscript' },
  { label: 'x₂', cmd: 'subscript',   title: 'Subscript' },
];

/** Symbol palette inserted at caret position. */
const SYMBOLS = [
  '°', 'µ', 'α', 'β', 'γ', 'δ', 'Δ', 'ε', 'θ', 'λ', 'π', 'σ', 'φ', 'Ω',
  '·', '–', '—', '±', '×', '÷', '≈', '≤', '≥', '∞', '⁻', '⁺', '‑',
];

/**
 * Contenteditable-based rich text editor for admin forms.
 * Supports bold, italic, superscript, subscript, and a symbol palette.
 * No external dependencies.
 *
 * In single-line mode (multiline={false}) Enter is blocked.
 * The onChange callback receives the raw innerHTML (limited HTML).
 */
export function RichTextInput({
  value,
  onChange,
  multiline = true,
  placeholder,
  className = '',
}: RichTextInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtml = useRef<string>(value);

  // Initialise editor content on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
      lastHtml.current = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value change (e.g. load from API) into the DOM,
  // but skip if the change originated from the editor itself.
  useEffect(() => {
    if (editorRef.current && value !== lastHtml.current) {
      lastHtml.current = value;
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? '';
    lastHtml.current = html;
    onChange(html);
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!multiline && e.key === 'Enter') {
        e.preventDefault();
      }
    },
    [multiline],
  );

  /** Execute a formatting command while keeping editor focus. */
  const execCmd = (cmd: string) => {
    editorRef.current?.focus();
    // execCommand is deprecated but still widely supported for simple editing.
    document.execCommand(cmd, false);
    handleInput();
  };

  /** Insert a literal symbol at the current caret position. */
  const insertSymbol = (sym: string) => {
    editorRef.current?.focus();
    document.execCommand('insertText', false, sym);
    handleInput();
  };

  return (
    <div
      className={`rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-[#0f2d6b]/20 focus-within:border-[#0f2d6b] overflow-hidden bg-white ${className}`}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200 select-none">
        {/* Formatting buttons */}
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.cmd}
            type="button"
            title={btn.title}
            // preventDefault stops the editor from losing focus
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd(btn.cmd);
            }}
            className={`px-2 py-0.5 text-sm rounded hover:bg-gray-200 active:bg-gray-300 text-gray-700 leading-none ${btn.style ?? ''}`}
          >
            {btn.label}
          </button>
        ))}

        <span className="w-px h-4 bg-gray-300 mx-1 shrink-0" />

        {/* Symbol palette */}
        {SYMBOLS.map((sym) => (
          <button
            key={sym}
            type="button"
            title={`Insert "${sym}"`}
            onMouseDown={(e) => {
              e.preventDefault();
              insertSymbol(sym);
            }}
            className="px-1.5 py-0.5 text-sm rounded hover:bg-gray-200 active:bg-gray-300 text-gray-600 font-mono leading-none"
          >
            {sym}
          </button>
        ))}
      </div>

      {/* ── Editor area ─────────────────────────────────────────────────── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline={multiline}
        aria-label={placeholder}
        data-placeholder={placeholder}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={[
          'px-3 py-2 text-sm text-gray-900 outline-none',
          multiline
            ? 'min-h-[6rem] overflow-y-auto'
            : 'min-h-[2.5rem] whitespace-nowrap overflow-x-auto',
          // CSS :empty pseudo-class shows placeholder via data attribute
          'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none',
        ].join(' ')}
      />
    </div>
  );
}
