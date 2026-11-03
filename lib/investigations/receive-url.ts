import type { Prisma } from "@prisma/client";
import { scanUrlSchema } from "@/lib/validations/analysis-input";
import { receiveUnavailableInvestigation } from "./service";

/** One intake pipeline for typed URLs and QR-derived URLs; provenance remains distinct. */
export function receiveUrlInvestigation(input: {
  userId: string;
  url: string;
  type: "URL" | "QR";
  inputMetadata?: Prisma.InputJsonObject;
}) {
  return receiveUnavailableInvestigation({
    userId: input.userId,
    target: scanUrlSchema.parse(input.url),
    type: input.type,
    inputMetadata: { ...input.inputMetadata, submittedAs: input.type === "QR" ? "qr" : "url" },
  });
}
