import type { SearchRecord } from '@/types/search';

function normalize(value: string) {
  return value.normalize('NFKC').toLowerCase().trim().replace(/\s+/g, ' ');
}

export function searchPortfolio(query: string, records: readonly SearchRecord[]): SearchRecord[] {
  const normalized = normalize(query);
  if (!normalized) return [];
  const tokens = [...new Set(normalized.split(' '))];
  return records.map((record, index) => {
    const fields = [normalize(record.title), normalize(record.description), normalize(record.keywords.join(' '))];
    if (!tokens.every(token => fields.some(field => field.includes(token)))) return { record, index, score: 0 };
    const score = tokens.reduce((sum, token) => sum +
      (fields[0].includes(token) ? 6 : 0) +
      (fields[1].includes(token) ? 2 : 0) +
      (fields[2].includes(token) ? 1 : 0), 0) +
      (fields[0].includes(normalized) ? 8 : 0);
    return { record, index, score };
  }).filter(result => result.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(result => result.record);
}
