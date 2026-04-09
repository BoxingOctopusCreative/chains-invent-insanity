/** Umami tracker injected by /script.js — see https://umami.is/docs/tracker-functions */
declare global {
  interface Window {
    umami?: {
      track: (payload?: object | ((props: Record<string, unknown>) => Record<string, unknown>)) => void;
      identify?: (...args: unknown[]) => void;
    };
  }
}

export {};
