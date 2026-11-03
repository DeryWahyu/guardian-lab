"use client";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import type { UserSession } from "@/lib/auth/session";
import { CaseStudiesSection } from "./case-studies-section";
import { CtaBanner } from "./cta-banner";
import { LandingInvestigation } from "./landing-investigation";
import { MilestoneFlowSection } from "./milestone-flow";
import { PillarsSection } from "./pillars-section";
import { SocialProofSection } from "./social-proof-section";
export interface LandingPageViewProps {
  initialUser?: UserSession | null;
}
export function LandingPageView({ initialUser }: LandingPageViewProps) {
  return (
    <div className="bg-background selection:bg-brand-100 selection:text-brand-900 flex min-h-screen flex-col text-slate-800 antialiased">
      {/* Global Sticky Header */}
      <Header initialUser={initialUser} />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Gateway hero and investigation results */}
        <LandingInvestigation initialUser={initialUser} />

        {/* 4. 4-Card Highlight Pillars */}
        <PillarsSection />

        {/* 5. 4-Step Interactive Milestone Flow */}
        <MilestoneFlowSection />

        {/* 6. Social Proof & Community Leaderboard */}
        <SocialProofSection />

        {/* 7. Real-World Case Studies */}
        <CaseStudiesSection />

        {/* 8. Bottom CTA Banner */}
        <CtaBanner />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
