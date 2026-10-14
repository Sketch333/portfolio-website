import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { chunkContent } from '@/lib/ai/chunking';

const source = { type: 'project' as const, slug: 'demo', title: 'Demo', href: '/projects/demo', text: 'First paragraph.\n\nSecond paragraph.' };

describe('chunkContent', () => {
  it('packs whole paragraphs when they fit and preserves source metadata', () => {
    const chunks = chunkContent(source, 32);
    expect(chunks.map(chunk => chunk.text)).toEqual(['First paragraph.', 'Second paragraph.']);
    expect(chunks.map(({ type, slug, title, href, index }) => ({ type, slug, title, href, index }))).toEqual([
      { type: 'project', slug: 'demo', title: 'Demo', href: '/projects/demo', index: 0 },
      { type: 'project', slug: 'demo', title: 'Demo', href: '/projects/demo', index: 1 },
    ]);
    expect(chunkContent(source, 100)[0].text).toBe(source.text);
  });
  it('uses stable SHA-256 identities and changes identity when content changes', () => {
    const chunks = chunkContent(source);
    expect(chunks).toEqual(chunkContent(source));
    expect(chunks[0].id).toBe(createHash('sha256').update('project:demo:0:First paragraph.\n\nSecond paragraph.').digest('hex'));
    expect(chunkContent({ ...source, text: 'Changed.' })[0].id).not.toBe(chunks[0].id);
    expect(chunkContent({ ...source, slug: 'other' })[0].id).not.toBe(chunks[0].id);
  });
  it('splits oversized paragraphs at sentence boundaries', () => {
    expect(chunkContent({ ...source, text: 'First sentence. Second sentence! Third sentence?' }, 32).map(chunk => chunk.text))
      .toEqual(['First sentence. Second sentence!', 'Third sentence?']);
  });
  it('bounds oversized sentences without dropping text', () => {
    const text = 'x'.repeat(3800);
    const chunks = chunkContent({ ...source, text });
    expect(chunks.every(chunk => chunk.text.length <= 1800)).toBe(true);
    expect(chunks.map(chunk => chunk.text).join('')).toBe(text);
    expect(chunkContent({ ...source, text: 'word '.repeat(20).trim() }, 17).every(chunk => chunk.text.length <= 17)).toBe(true);
  });
  it('never splits a Unicode surrogate pair across chunks', () => {
    const text = `${'x'.repeat(1799)}😀z`;
    const chunks = chunkContent({ ...source, text });
    expect(chunks.map(chunk => chunk.text).join('')).toBe(text);
    expect(chunks.every(chunk => chunk.text.length <= 1800)).toBe(true);
    expect(chunks.every(chunk => !/[\uD800-\uDBFF]$/.test(chunk.text) && !/^[\uDC00-\uDFFF]/.test(chunk.text))).toBe(true);
    expect(() => chunkContent({ ...source, text: '😀' }, 1)).toThrow(/maxChars/);
  });
  it('preserves leading punctuation in oversized paragraphs', () => {
    const text = '!!! Keep this evidence. Next sentence.';
    expect(chunkContent({ ...source, text }, 25).map(chunk => chunk.text).join(' ')).toBe(text);
  });
  it('normalizes line endings and skips blank content', () => {
    expect(chunkContent({ ...source, text: source.text.replaceAll('\n', '\r\n') })).toEqual(chunkContent(source));
    expect(chunkContent({ ...source, text: ' \n\n ' })).toEqual([]);
  });
  it.each([0, -1, 1.5, Infinity, NaN])('rejects invalid limits %s', maxChars => {
    expect(() => chunkContent(source, maxChars)).toThrow('maxChars');
  });
});

describe('ingestion command', () => {
  it('runs dry-run without credentials or any network connection and prints source counts', () => {
    const directory = mkdtempSync(path.join(tmpdir(), 'portfolio-network-guard-'));
    const guard = path.join(directory, 'guard.cjs');
    writeFileSync(guard, `const deny = () => { throw new Error('Network forbidden during dry-run'); };
      globalThis.fetch = deny;
      for (const name of ['http', 'https']) { const api = require(name); api.request = deny; api.get = deny; }
      const net = require('net'); net.connect = deny; net.createConnection = deny; net.Socket.prototype.connect = deny;
      require('tls').connect = deny;`);
    try {
      const output = execFileSync(process.execPath, ['--require', guard, '--import', 'tsx', 'scripts/ingest-portfolio.ts', '--dry-run'], {
        cwd: process.cwd(), encoding: 'utf8', env: { ...process.env, MONGODB_URI: '', AI_GATEWAY_API_KEY: '' },
      });
      expect(output).toMatch(/project: [1-9]\d* sources, [1-9]\d* chunks/);
      expect(output).toMatch(/blog: [1-9]\d* sources, [1-9]\d* chunks/);
      expect(output).toMatch(/experience: [1-9]\d* sources, [1-9]\d* chunks/);
      expect(output).toContain('Dry run');
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
  it('fails closed when live ingestion is requested before provider integration', () => {
    expect(() => execFileSync(process.execPath, ['--import', 'tsx', 'scripts/ingest-portfolio.ts'], { stdio: 'pipe' })).toThrow();
  });
});

