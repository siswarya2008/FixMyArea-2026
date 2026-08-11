/// <reference lib="dom" />

interface Deno {
  readonly env: {
    get(key: string): string | undefined
  }
}

declare const Deno: Deno
