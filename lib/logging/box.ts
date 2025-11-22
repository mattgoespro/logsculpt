// miniBox.ts
export type BorderStyle = "single" | "double" | "round";

const borderChars: Record<
  BorderStyle,
  {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
    horizontal: string;
    vertical: string;
  }
> = {
  single: {
    topLeft: "┌",
    topRight: "┐",
    bottomLeft: "└",
    bottomRight: "┘",
    horizontal: "─",
    vertical: "│"
  },
  double: {
    topLeft: "╔",
    topRight: "╗",
    bottomLeft: "╚",
    bottomRight: "╝",
    horizontal: "═",
    vertical: "║"
  },
  round: {
    topLeft: "╭",
    topRight: "╮",
    bottomLeft: "╰",
    bottomRight: "╯",
    horizontal: "─",
    vertical: "│"
  }
};

export interface MiniBoxOptions {
  padding?: number; // spaces inside the box on left/right
  margin?: number; // blank lines before/after
  borderStyle?: BorderStyle;
  // browser-only coloring (CSS). If omitted, 'inherit' is used.
  borderCSS?: string; // e.g. "color: orange; font-weight: bold; font-family: monospace;"
  innerCSS?: string; // e.g. "color: black; font-family: monospace;"
}

/**
 * Escape `%` so console.formatting placeholders don't get confused.
 */
function escapeForConsole(s: string) {
  return s.replace(/%/g, "%%");
}

/**
 * Return a plain-string representation of the box (useful for Node/file output).
 */
export function miniBoxString(message: string, opts: MiniBoxOptions = {}) {
  const { padding = 0, margin = 0, borderStyle = "single" } = opts;
  const chars = borderChars[borderStyle];

  const lines = message.split(/\r?\n/);
  const contentWidth = lines.length === 0 ? 0 : Math.max(...lines.map((l) => l.length));

  // width of inner (text + padding on both sides)
  const innerWidth = contentWidth + padding * 2;

  // horizontal run must match inner width + 2 (because we add one space before and after inner when rendering)
  const horizontal = chars.horizontal.repeat(innerWidth + 2);

  const top = chars.topLeft + horizontal + chars.topRight;
  const bottom = chars.bottomLeft + horizontal + chars.bottomRight;

  const content = lines.map((line) => {
    const padded = " ".repeat(padding) + line.padEnd(contentWidth) + " ".repeat(padding);
    // we add an extra single space on each side so that horizontal length == padded length + 2
    return chars.vertical + " " + padded + " " + chars.vertical;
  });

  const marginLines = "\n".repeat(Math.max(0, margin));
  return marginLines + [top, ...content, bottom].join("\n") + marginLines;
}

/**
 * Log to console. In Node it falls back to plain string; in browser it uses `%c` CSS styling.
 */
export function boxLog(message: string, opts: MiniBoxOptions = {}) {
  // Detect browser console vs Node (simple heuristic)
  const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

  // If not in browser, just print the plain string (useful for terminals)
  if (!isBrowser) {
    console.log(miniBoxString(message, opts));
    return;
  }

  // Browser path: build a format string with %c and a parallel styles array
  const {
    padding = 0,
    margin = 0,
    borderStyle = "single",
    borderCSS = "font-family: monospace;",
    innerCSS = "font-family: monospace;"
  } = opts;

  const chars = borderChars[borderStyle];
  const lines = message.split(/\r?\n/);
  const contentWidth = lines.length === 0 ? 0 : Math.max(...lines.map((l) => l.length));
  const innerWidth = contentWidth + padding * 2;
  const horizontal = chars.horizontal.repeat(innerWidth + 2);
  const top = chars.topLeft + horizontal + chars.topRight;
  const bottom = chars.bottomLeft + horizontal + chars.bottomRight;

  const parts: string[] = [];
  const styles: string[] = [];

  // margin before
  if (margin > 0) parts.push("\n".repeat(margin));

  // top (whole line styled as border)
  parts.push("%c" + escapeForConsole(top) + "\n");
  styles.push(borderCSS);

  // content: three-style segments per line (left border, inner, right border)
  for (const rawLine of lines) {
    const padded = " ".repeat(padding) + rawLine.padEnd(contentWidth) + " ".repeat(padding);
    const left = chars.vertical;
    const right = chars.vertical;
    const inner = " " + padded + " ";

    parts.push("%c" + escapeForConsole(left));
    styles.push(borderCSS);

    parts.push("%c" + escapeForConsole(inner));
    styles.push(innerCSS);

    parts.push("%c" + escapeForConsole(right) + "\n");
    styles.push(borderCSS);
  }

  // bottom
  parts.push("%c" + escapeForConsole(bottom));
  styles.push(borderCSS);

  // margin after
  if (margin > 0) parts.push("\n".repeat(margin));

  const format = parts.join("");
  // call console.log with format + styles
  // Note: number of styles must match number of %c occurrences (we ensured that).
  // eslint-disable-next-line no-console
  console.log(format, ...styles);
}
