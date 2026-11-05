"use client";
import { useRef } from "react";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import type { UserSession } from "@/lib/auth/session";
import { CtaBanner } from "./cta-banner";
import { JourneySection } from "./journey-section";
import styles from "./landing.module.css";
import { LandingInvestigation } from "./landing-investigation";
import { LandingMotion } from "./landing-motion";
import { LandingScrollControls } from "./landing-scroll-controls";
import { PillarsSection } from "./pillars-section";
import { SocialProofSection } from "./social-proof-section";
export interface LandingPageViewProps {
  initialUser?: UserSession | null;
}
export function LandingPageView({ initialUser }: LandingPageViewProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  return (
    <LandingMotion>
      <div ref={pageRef} className={styles.page}>
        <Header initialUser={initialUser} variant="landing" />
        <main>
          <LandingInvestigation initialUser={initialUser} />
          <PillarsSection />
          <JourneySection />
          <SocialProofSection />
          <CtaBanner />
        </main>
        <Footer variant="landing" />
        <LandingScrollControls pageRef={pageRef} />
      </div>
    </LandingMotion>
  );
}
