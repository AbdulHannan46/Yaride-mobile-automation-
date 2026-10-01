import fs from 'node:fs';

/**
 * Replaces characters that are illegal in file names with underscores.
 */
export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 100);
}

/**
 * Formats a Date object into an ISO-like safe string for file naming.
 * Example: 2026-09-26T14-30-00-123Z
 */
export function formatDateForFilename(date: Date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, '-');
}

/**
 * Ensures a directory exists on disk, creating it recursively if needed.
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
