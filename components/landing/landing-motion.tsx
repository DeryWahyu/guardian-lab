"use client";

import { domAnimation, LazyMotion, MotionConfig, m } from "motion/react";
import { createContext, type ReactNode, useContext, useSyncExternalStore } from "react";

const ReducedMotionContext = createContext(true);
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToPreference(onChange: () => void) {
  const preference = window.matchMedia(reducedMotionQuery);
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

function getPreference() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getServerPreference() {
  return true;
}

export function useLandingReducedMotion() {
  return useContext(ReducedMotionContext);
}

export function LandingMotion({ children }: { children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(
    subscribeToPreference,
    getPreference,
    getServerPreference,
  );
  return (
    <ReducedMotionContext value={reducedMotion}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </MotionConfig>
      </LazyMotion>
    </ReducedMotionContext>
  );
}

export function SceneReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useLandingReducedMotion();
  return (
    <m.div
      className={className}
      data-landing-reveal
      initial={false}
      whileInView={reducedMotion ? { opacity: 1 } : { y: [12, 0], opacity: [0.75, 1] }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </m.div>
  );
}
