import { Bricolage_Grotesque } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import type { UserSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import styles from "./workspace.module.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-workspace-display",
  display: "swap",
});

export function WorkspaceShell({
  children,
  user,
  reading = false,
}: {
  children: ReactNode;
  user?: UserSession;
  reading?: boolean;
}) {
  return (
    <div className={cn(display.variable, styles.shell)}>
      <Header initialUser={user} />
      <main className={cn(styles.main, reading && styles.reading)}>{children}</main>
      <Footer />
    </div>
  );
}
