'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, GripVertical } from 'lucide-react';
import type { PageLayoutDef, LayoutField, PageContentData } from '@/lib/page-layouts';

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]';

type ListItem = Record<string, string>;

/**
 * WordPress-metabox-style form editor for designed-layout pages: every page
 * section is a collapsible panel with a prominent heading, so editors can
 * see at a glance which part of the page each group of fields controls.
 * Empty fields fall back to the text built into the page design.
 */
export function StructuredContentEditor({
  layout,
  value,
  onChange,
}: {
  layout: PageLayoutDef;
  value: PageContentData;
  onChange: (data: PageContentData) => void;
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const setField = (key: string, v: unknown) => onChange({ ...value, [key]: v });

  const getList = (field: LayoutField): ListItem[] => {
    const raw = value[field.key];
    const list = Array.isArray(raw) ? (raw as ListItem[]) : [];
    if (field.fixedCount) {
      return Array.from({ length: field.fixedCount }, (_, i) => list[i] ?? {});
    }
    return list;
  };

  const setListItem = (field: LayoutField, index: number, itemKey: string, v: string) => {
    const list = [...getList(field)];
    list[index] = { ...list[index], [itemKey]: v };
    setField(field.key, list);
  };

  const addListItem = (field: LayoutField) => {
    setField(field.key, [...getList(field), {}]);
  };

  const removeListItem = (field: LayoutField, index: number) => {
    setField(
      field.key,
      getList(field).filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      {layout.fields.map((field) => {
        const isCollapsed = collapsed.has(field.key);
        return (
          <section
            key={field.key}
            className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            {/* Metabox header */}
            <button
              type="button"
              onClick={() => toggle(field.key)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-[#f7f9fd] to-white border-b border-gray-100 text-left hover:from-[#f0f4fb] transition-colors"
              aria-expanded={!isCollapsed}
            >
              <span
                className="text-lg font-bold text-[#0f2d6b] tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {field.label}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                  isCollapsed ? '-rotate-90' : ''
                }`}
              />
            </button>

            {!isCollapsed && (
              <div className="p-5">
                {field.help && (
                  <p className="text-xs text-gray-500 mb-4 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                    {field.help}
                  </p>
                )}

                {field.type === 'text' && (
                  <input
                    value={typeof value[field.key] === 'string' ? (value[field.key] as string) : ''}
                    onChange={(e) => setField(field.key, e.target.value)}
                    className={inputCls}
                    placeholder="Leave empty to keep the built-in text"
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    value={typeof value[field.key] === 'string' ? (value[field.key] as string) : ''}
                    onChange={(e) => setField(field.key, e.target.value)}
                    className={inputCls + ' min-h-[90px] resize-y'}
                    placeholder="Leave empty to keep the built-in text"
                  />
                )}

                {field.type === 'list' && (
                  <div className="space-y-3">
                    {getList(field).map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 bg-gray-50/70 overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-100/80 border-b border-gray-200">
                          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#0f2d6b] uppercase tracking-wider">
                            <GripVertical className="w-3.5 h-3.5 text-gray-400" />
                            {field.label.replace(/s$/, '')} {index + 1}
                          </span>
                          {!field.fixedCount && (
                            <button
                              type="button"
                              onClick={() => removeListItem(field, index)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              aria-label={`Remove item ${index + 1}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="p-4 space-y-3">
                          {(field.itemFields ?? []).map((itemField) => (
                            <div key={itemField.key}>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">
                                {itemField.label}
                              </label>
                              {itemField.type === 'textarea' ? (
                                <textarea
                                  value={item[itemField.key] ?? ''}
                                  onChange={(e) =>
                                    setListItem(field, index, itemField.key, e.target.value)
                                  }
                                  className={inputCls + ' min-h-[60px] resize-y'}
                                  placeholder="Leave empty to keep the built-in text"
                                />
                              ) : (
                                <input
                                  value={item[itemField.key] ?? ''}
                                  onChange={(e) =>
                                    setListItem(field, index, itemField.key, e.target.value)
                                  }
                                  className={inputCls}
                                  placeholder="Leave empty to keep the built-in text"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {!field.fixedCount && (
                      <button
                        type="button"
                        onClick={() => addListItem(field)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-sm font-medium text-gray-500 hover:border-[#0f2d6b] hover:text-[#0f2d6b] transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add {field.label.replace(/s$/, '').toLowerCase()}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
