import type { UserSession } from "@/lib/auth/session";
import type { Investigation } from "@/lib/validations/investigation";

export interface AnalysisGatewayProps {
  currentUser?: UserSession | null;
  defaultTab?: "url" | "qr" | "apk";
  onAnalysisStart?: () => void;
  onAnalysisSuccess?: (result: Investigation) => void;
  onAnalysisError?: (error: string) => void;
  onInputChange?: () => void;
  className?: string;
}
