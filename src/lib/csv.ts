// A small RFC 4180 CSV reader and writer, enough for the site's data files:
// quoted fields may hold commas, quotes ("" inside quotes), tabs and line
// breaks, and rows end in LF or CRLF. Plain Node, no dependencies.

/** Parses CSV text into rows of fields. A trailing newline does not add an empty row. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let i = 0;
  // Skip a UTF-8 byte order mark.
  if (text.charCodeAt(0) === 0xfeff) i = 1;

  for (; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"' && field === '') {
      quoted = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (quoted) throw new Error('CSV: unterminated quoted field');
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * Parses CSV text with a header row into one object per row, keyed by column
 * name. Throws if any of `columns` is missing from the header, or if a row has
 * a different number of fields than the header.
 */
export function parseCsvRecords<K extends string>(
  text: string,
  columns: readonly K[],
  source = 'CSV',
): Record<K, string>[] {
  const [header, ...rows] = parseCsv(text);
  if (!header) throw new Error(`${source}: no header row`);
  const missing = columns.filter((c) => !header.includes(c));
  if (missing.length > 0) throw new Error(`${source}: missing columns ${missing.join(', ')}`);
  return rows.map((fields, n) => {
    if (fields.length !== header.length) {
      throw new Error(`${source}: row ${n + 2} has ${fields.length} fields, expected ${header.length}`);
    }
    const record = {} as Record<K, string>;
    header.forEach((name, j) => {
      // Later duplicate column names do not overwrite earlier ones.
      if (!(name in record)) (record as Record<string, string>)[name] = fields[j] ?? '';
    });
    return record;
  });
}

/**
 * Formats one CSV line like Ruby's CSV.generate_line: a field is quoted only
 * if it holds a comma, a quote or a line break; an empty string is written as
 * "" and null as nothing. Ends with "\n".
 */
export function csvLine(fields: readonly (string | null)[]): string {
  return (
    fields
      .map((f) => {
        if (f === null) return '';
        if (f === '' || /[",\r\n]/.test(f)) return `"${f.replaceAll('"', '""')}"`;
        return f;
      })
      .join(',') + '\n'
  );
}
