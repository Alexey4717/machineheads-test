import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import type { Plugin } from 'vite';

interface EstreeNode {
  type: string;
  start?: number;
  end?: number;
  span?: { start: number; end: number };
  key?: EstreeNode;
  name?: EstreeNode | string;
  value?: unknown;
  properties?: EstreeNode[];
}

function loc(node: EstreeNode): { start: number; end: number } | null {
  if (node.start != null && node.end != null) {
    return { start: node.start, end: node.end };
  }

  if (node.span) {
    return node.span;
  }

  return null;
}

function isDataTestIdKey(node: EstreeNode | string | undefined): boolean {
  if (!node) {
    return false;
  }

  if (typeof node === 'string') {
    return node === 'data-testid';
  }

  if (node.type === 'Literal' || node.type === 'StringLiteral') {
    return node.value === 'data-testid';
  }

  if (node.type === 'Identifier' || node.type === 'JSXIdentifier') {
    return node.name === 'data-testid';
  }

  return false;
}

function walk(
  node: EstreeNode | undefined,
  parent: EstreeNode | undefined,
  visit: (node: EstreeNode, parent: EstreeNode | undefined) => void,
): void {
  if (!node || typeof node !== 'object') {
    return;
  }

  visit(node, parent);

  for (const [key, child] of Object.entries(node)) {
    if (
      key === 'start' ||
      key === 'end' ||
      key === 'loc' ||
      key === 'range' ||
      key === 'span' ||
      key === 'type'
    ) {
      continue;
    }

    if (Array.isArray(child)) {
      for (const item of child) {
        if (item && typeof item === 'object' && 'type' in item) {
          walk(item as EstreeNode, node, visit);
        }
      }
    } else if (child && typeof child === 'object' && 'type' in child) {
      walk(child as EstreeNode, node, visit);
    }
  }
}

function propertyRange(
  node: EstreeNode,
  parent: EstreeNode | undefined,
): { start: number; end: number } | null {
  const nodeLoc = loc(node);
  if (!nodeLoc) {
    return null;
  }

  const properties = parent?.properties;
  if (!properties) {
    return nodeLoc;
  }

  const index = properties.indexOf(node);
  if (index === -1) {
    return nodeLoc;
  }

  if (index < properties.length - 1) {
    const nextLoc = properties[index + 1] ? loc(properties[index + 1]!) : null;
    if (nextLoc) {
      return { start: nodeLoc.start, end: nextLoc.start };
    }
  }

  if (index > 0) {
    const prevLoc = properties[index - 1] ? loc(properties[index - 1]!) : null;
    if (prevLoc) {
      return { start: prevLoc.end, end: nodeLoc.end };
    }
  }

  return nodeLoc;
}

function applyRanges(
  code: string,
  ranges: { start: number; end: number }[],
): string {
  const sorted = [...ranges].sort((a, b) => b.start - a.start);
  let next = code;

  for (const range of sorted) {
    next = `${next.slice(0, range.start)}${next.slice(range.end)}`;
  }

  return next
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/{\s*,/g, '{')
    .replace(/\[\s*,/g, '[');
}

function stripDataTestIdByRegex(code: string): string {
  return code
    .replace(
      /['"]data-testid['"]\s*:\s*(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|[A-Za-z_$][\w$]*)\s*,?/g,
      '',
    )
    .replace(/\s*data-testid\s*=\s*(?:{[^}]*}|"[^"]*"|'[^']*')/g, '')
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/{\s*,/g, '{')
    .replace(/\[\s*,/g, '[');
}

function collectJsFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectJsFiles(fullPath));
      continue;
    }

    if (extname(entry.name) === '.js') {
      files.push(fullPath);
    }
  }

  return files;
}

function isSrcFile(id: string): boolean {
  const normalized = id.replace(/\\/g, '/');
  const withoutQuery = normalized.split('?')[0] ?? normalized;

  return (
    withoutQuery.includes('/src/') &&
    !withoutQuery.includes('/node_modules/') &&
    /\.(?:[cm]?[jt]sx?)$/.test(withoutQuery)
  );
}

export function stripDataTestId(): Plugin {
  return {
    name: 'strip-data-testid',
    apply: 'build',
    enforce: 'post',
    transform(code, id) {
      if (!isSrcFile(id) || !code.includes('data-testid')) {
        return null;
      }

      const ranges: { start: number; end: number }[] = [];

      try {
        const ast = this.parse(code) as EstreeNode;
        walk(ast, undefined, (node, parent) => {
          if (node.type === 'JSXAttribute' && isDataTestIdKey(node.name)) {
            const nodeLoc = loc(node);
            if (nodeLoc) {
              ranges.push(nodeLoc);
            }
            return;
          }

          if (
            (node.type === 'Property' ||
              node.type === 'ObjectProperty' ||
              node.type === 'PropertyDefinition') &&
            isDataTestIdKey(node.key)
          ) {
            const range = propertyRange(node, parent);
            if (range) {
              ranges.push(range);
            }
          }
        });
      } catch {
        return { code: stripDataTestIdByRegex(code), map: null };
      }

      if (ranges.length === 0) {
        if (code.includes('data-testid')) {
          return { code: stripDataTestIdByRegex(code), map: null };
        }

        return null;
      }

      return { code: applyRanges(code, ranges), map: null };
    },
    writeBundle() {
      const outDir = join(process.cwd(), 'build');
      const leaked = collectJsFiles(outDir).filter((filePath) =>
        readFileSync(filePath, 'utf8').includes('data-testid'),
      );

      if (leaked.length > 0) {
        const list = leaked
          .map((filePath) => filePath.replace(/\\/g, '/'))
          .join('\n');
        throw new Error(`data-testid остался в production-сборке:\n${list}`);
      }
    },
  };
}
