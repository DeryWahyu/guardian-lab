import type { Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandIdentity } from "@/components/shared/brand-identity";
import { PUBLIC_ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { AuthArtwork } from "./_components/auth-artwork";
import styles from "./auth.module.css";

const authDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-auth-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={cn(authDisplay.variable, styles.shell)}>
      <div className={styles.formColumn}>
        <div className={styles.formStack}>
          <header className={styles.brand}>
            <Link href={PUBLIC_ROUTES.home} aria-label="Guardian Lab — beranda">
              <BrandIdentity subtitle={null} markClassName="size-8" wordmarkClassName="text-lg" />
            </Link>
          </header>
          <main>{children}</main>
        </div>
      </div>
      <AuthArtwork />
    </div>
  );
}
