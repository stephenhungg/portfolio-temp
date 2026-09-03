"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * LoaderState - tiny global flag for whether the intro Loader has finished.
 *
 * Components like Appear / MaskedLine read `useLoaderReady()` and defer their
 * gsap tween until `ready === true`, so hero entrance animations don't fire
 * silently behind the loader.
 *
 * The flag is true by default on subsequent navigations (loader only shows on
 * first session load; the gate hydrates `ready=true` from sessionStorage later.
 */

type Ctx = {
  ready: boolean;
  setReady: (b: boolean) => void;
};

const LoaderContext = createContext<Ctx>({ ready: true, setReady: () => {} });

export function useLoaderReady(): boolean {
  return useContext(LoaderContext).ready;
}

export function useSetLoaderReady() {
  return useContext(LoaderContext).setReady;
}

export function LoaderProvider({ children }: { children: ReactNode }) {
  // start as NOT ready - hero animations wait for loader to call setReady(true)
  const [ready, setReady] = useState(false);

  // safety: if loader is gated off (sessionStorage etc.) and never fires, mark ready
  // after the full loader window so animations don't fire behind the overlay
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const set = useCallback((b: boolean) => setReady(b), []);

  return (
    <LoaderContext.Provider value={{ ready, setReady: set }}>
      {children}
    </LoaderContext.Provider>
  );
}
