import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * jsdom 27 does not ship a localStorage implementation, so provide a
 * spec-shaped in-memory Storage for tests (projects, stats, settings).
 */
class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store = new Map();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    const next = new Map(this.store);
    next.delete(key);
    this.store = next;
  }

  setItem(key: string, value: string): void {
    const next = new Map(this.store);
    next.set(key, String(value));
    this.store = next;
  }
}

if (typeof globalThis.localStorage === 'undefined' || globalThis.localStorage === null) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    configurable: true,
    writable: true,
  });
}

afterEach(() => cleanup());
