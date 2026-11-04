"use client";

import { m } from "motion/react";
import Image from "next/image";
import guardian from "@/public/landing/guardian-hero-01.webp";
import styles from "./hero.module.css";
import { useHeroMotion } from "./use-hero-motion";

const sizes = "(min-width: 1100px) 506px, (min-width: 768px) 364px, 260px";

export function HeroScene() {
  const motion = useHeroMotion();
  return (
    <>
      <div ref={motion.scene} className={styles.visual}>
        <m.div
          className={styles.scenery}
          aria-hidden="true"
          style={
            motion.reducedMotion
              ? undefined
              : { x: motion.x, y: motion.y, rotate: motion.rotate }
          }
        >
          <m.div
            className={styles.scenery}
            style={motion.reducedMotion ? undefined : { y: motion.scrollY }}
          >
            <div className={styles.halo} />
          </m.div>
        </m.div>
        <Image
          className={styles.fox}
          src={guardian}
          alt="Guardian dengan kaca pembesar dan ekor besar, bertumpu pada tepi bar pemeriksaan."
          loading="eager"
          fetchPriority="high"
          sizes={sizes}
          draggable={false}
        />
      </div>
      <div className={styles.hand} aria-hidden="true">
        <Image src={guardian} alt="" sizes={sizes} draggable={false} />
      </div>
    </>
  );
}
