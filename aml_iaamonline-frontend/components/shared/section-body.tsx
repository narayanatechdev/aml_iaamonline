/**
 * Renders the body text of an admin-created "Additional section" using a
 * lightweight syntax (documented in the page editor):
 *
 *   Plain text                → paragraph (blank line starts a new one)
 *   - item                    → bullet list item
 *   ## Column title           → starts a side-by-side column; content after
 *                               it belongs to the column. Sections with
 *                               columns render them in tinted boxes, cycling
 *                               red/green/blue like the Publication Ethics
 *                               design. Text before the first ## is an intro.
 */

type Block = { type: 'p'; text: string } | { type: 'ul'; items: string[] };

interface Column {
  title: string;
  blocks: Block[];
}

interface ParsedBody {
  intro: Block[];
  columns: Column[];
}

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let bullets: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join('\n') });
      paragraph = [];
    }
  };
  const flushBullets = () => {
    if (bullets.length) {
      blocks.push({ type: 'ul', items: bullets });
      bullets = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      flushParagraph();
      flushBullets();
    } else if (trimmed.startsWith('- ')) {
      flushParagraph();
      bullets.push(trimmed.slice(2));
    } else {
      flushBullets();
      paragraph.push(trimmed);
    }
  }
  flushParagraph();
  flushBullets();
  return blocks;
}

export function parseSectionBody(body: string): ParsedBody {
  const lines = (body ?? '').split('\n');
  const intro: string[] = [];
  const columns: { title: string; lines: string[] }[] = [];

  for (const line of lines) {
    const heading = line.trim().match(/^##\s+(.*)$/);
    if (heading) {
      columns.push({ title: heading[1], lines: [] });
    } else if (columns.length) {
      columns[columns.length - 1].lines.push(line);
    } else {
      intro.push(line);
    }
  }

  return {
    intro: parseBlocks(intro),
    columns: columns.map((c) => ({ title: c.title, blocks: parseBlocks(c.lines) })),
  };
}

/** Tint cycle matching the Publication Ethics design (red / green / blue). */
const COLUMN_TINTS = [
  { bg: 'bg-red-50', heading: 'text-red-800', text: 'text-red-700' },
  { bg: 'bg-emerald-50', heading: 'text-emerald-800', text: 'text-emerald-700' },
  { bg: 'bg-blue-50', heading: 'text-blue-800', text: 'text-blue-700' },
];

function Blocks({ blocks, textClass }: { blocks: Block[]; textClass: string }) {
  return (
    <>
      {blocks.map((block, i) =>
        block.type === 'p' ? (
          <p key={i} className={`${textClass} text-sm leading-relaxed mb-3 last:mb-0 whitespace-pre-line`}>
            {block.text}
          </p>
        ) : (
          <ul key={i} className="space-y-1.5 mb-3 last:mb-0">
            {block.items.map((item, j) => (
              <li key={j} className={`${textClass} text-sm leading-relaxed flex items-start gap-2`}>
                <span className="mt-2 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )
      )}
    </>
  );
}

export function SectionBody({ body }: { body: string }) {
  const parsed = parseSectionBody(body);
  const columnCount = parsed.columns.length;
  const gridClass =
    columnCount >= 3 ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid md:grid-cols-2 gap-6';

  return (
    <div>
      <Blocks
        blocks={parsed.intro.map((b) => (b.type === 'p' ? { ...b } : b))}
        textClass="text-gray-700 !text-base"
      />
      {columnCount > 0 && (
        <div className={`${gridClass} mt-5`}>
          {parsed.columns.map((column, i) => {
            const tint = COLUMN_TINTS[i % COLUMN_TINTS.length];
            return (
              <div key={i} className={`${tint.bg} rounded-lg p-5`}>
                <h3 className={`${tint.heading} text-lg font-bold mb-3`}>{column.title}</h3>
                <Blocks blocks={column.blocks} textClass={tint.text} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
