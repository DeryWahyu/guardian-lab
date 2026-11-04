"use client";

import Image from "next/image";
import { type RefObject, useEffect, useRef, useState } from "react";
import { LANDING_LOCATION_CHANGE_EVENT, LANDING_SECTION_CHANGE_EVENT } from "@/lib/navigation";
import { LANDING_SECTIONS } from "@/lib/routes";
import mascot from "@/public/landing/guardian-back-to-top.webp";
import styles from "./scroll-controls.module.css";

export function LandingScrollControls({ pageRef }: { pageRef: RefObject<HTMLDivElement | null> }) {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const page = pageRef.current;

    let frame = 0;
    let lastVisible = false;
    function update() {
      frame = 0;
      const maxScroll = Math.max(
        0,
        Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) -
          window.innerHeight,
      );
      const scroll = Math.min(maxScroll, Math.max(0, window.scrollY));
      const progress = maxScroll === 0 ? 0 : scroll / maxScroll;
      page.style.setProperty("--landing-scroll-remaining", `${(1 - progress) * 100}%`);
      page
        .querySelector("[data-landing-progress]")
        ?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));

      let activeSection: string = LANDING_SECTIONS.home;
      for (const sectionId of Object.values(LANDING_SECTIONS)) {
        const section = document.getElementById(sectionId);
        if (section && section.getBoundingClientRect().top <= 100) activeSection = sectionId;
      }
      const lastSection = document.getElementById(LANDING_SECTIONS.start);
      if (
        maxScroll > 0 &&
        scroll >= maxScroll - 2 &&
        lastSection &&
        lastSection.getBoundingClientRect().top < window.innerHeight
      ) {
        activeSection = LANDING_SECTIONS.start;
      }
      if (page.dataset.landingActiveSection !== activeSection) {
        page.dataset.landingActiveSection = activeSection;
        window.dispatchEvent(new Event(LANDING_SECTION_CHANGE_EVENT));
      }

      const showButton = scroll > 240;
      if (!showButton && document.activeElement === buttonRef.current) {
        page.querySelector<HTMLElement>("[data-landing-home]")?.focus({ preventScroll: true });
      }
      if (showButton !== lastVisible) {
        lastVisible = showButton;
        setVisible(showButton);
      }
    }
    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleUpdate);
    observer?.observe(page);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pageRef]);

  function scrollToTop() {
    const hash = `#${LANDING_SECTIONS.home}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
      window.dispatchEvent(new Event(LANDING_LOCATION_CHANGE_EVENT));
    }
    pageRef.current?.querySelector<HTMLElement>("[data-landing-home]")?.focus({ preventScroll: true });
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <button
      ref={buttonRef}
      className={styles.button}
      type="button"
      onClick={scrollToTop}
      aria-label="Kembali ke atas"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-visible={visible}
    >
      <Image className={styles.mascot} src={mascot} alt="" sizes="100px" />
    </button>
  );
}
