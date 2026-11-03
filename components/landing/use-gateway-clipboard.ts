"use client";
import { useEffect, useRef, useState } from "react";

export function useGatewayClipboard(
  onText: (value: string) => void,
  onError: (message: string) => void,
) {
  const [pasting, setPasting] = useState(false);
  const active = useRef<symbol | null>(null);
  useEffect(
    () => () => {
      active.current = null;
    },
    [],
  );
  async function paste() {
    if (active.current) return;
    const operation = Symbol();
    active.current = operation;
    setPasting(true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!navigator.clipboard?.readText) throw new Error("Clipboard unavailable");
      const value = (
        await Promise.race([
          navigator.clipboard.readText(),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error("Clipboard timeout")), 5000);
          }),
        ])
      ).trim();
      if (active.current !== operation) return;
      if (!value) onError("Papan klip kosong. Salin tautan terlebih dahulu.");
      else onText(value);
    } catch {
      if (active.current === operation)
        onError("Papan klip tidak dapat dibaca. Tempel tautan secara manual di kolom.");
    } finally {
      clearTimeout(timer);
      if (active.current === operation) {
        active.current = null;
        setPasting(false);
      }
    }
  }
  return { paste, pasting };
}
