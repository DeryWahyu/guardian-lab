import type { ForensicRecord, Prisma } from "@prisma/client";
import { sanitizeEvidence } from "@/lib/investigations/privacy";
import { serializeInvestigation } from "@/lib/investigations/serialize";
import {
  createInvestigation,
  MODEL_UNAVAILABLE_MESSAGE,
  transitionInvestigation,
} from "@/lib/investigations/service";
import { prisma } from "@/lib/prisma";
import { extractApk } from "./extract";
import { ApkExtractionError } from "./limits";

export async function receiveApk(
  input: { userId: string; target: string; inputMetadata: Prisma.InputJsonObject },
  bytes: Buffer,
  signal?: AbortSignal,
  reservedRecord?: ForensicRecord,
) {
  const record = reservedRecord ?? (await createInvestigation({ ...input, type: "APK" }));
  if (record.userId !== input.userId || record.type !== "APK" || record.status !== "RECEIVED")
    throw new Error("Invalid reserved investigation");
  await transitionInvestigation({ id: record.id, userId: input.userId, status: "PROCESSING" });
  try {
    const report = await extractApk(bytes, signal);
    const result = await prisma.$transaction(async (tx) => {
      await tx.forensicRecord.update({
        where: { id: record.id },
        data: {
          inputMetadata: sanitizeEvidence({
            ...input.inputMetadata,
            staticExtractionPerformed: true,
            apkStatic: report,
          }),
        },
      });
      return transitionInvestigation(
        {
          id: record.id,
          userId: input.userId,
          status: "UNAVAILABLE",
          errorCode: "MODEL_NOT_CONFIGURED",
          errorMessage: `Ekstraksi statis APK tersimpan. ${MODEL_UNAVAILABLE_MESSAGE}`,
        },
        tx,
      );
    });
    return { record: serializeInvestigation(result), status: 201 };
  } catch (error) {
    const failure =
      error instanceof ApkExtractionError
        ? error
        : new ApkExtractionError(
            "APK_EXTRACTION_FAILED",
            "Ekstraksi statis APK belum berhasil. Berkas perlu diperiksa atau diunggah kembali.",
          );
    const failed = await transitionInvestigation({
      id: record.id,
      userId: input.userId,
      status: "FAILED",
      errorCode: failure.code,
      errorMessage: failure.message,
    });
    return { record: serializeInvestigation(failed), status: 422 };
  }
}

const globalApk = globalThis as typeof globalThis & { guardianApkBusy?: boolean };
export function acquireApkSlot() {
  if (globalApk.guardianApkBusy) return null;
  globalApk.guardianApkBusy = true;
  return () => {
    globalApk.guardianApkBusy = false;
  };
}
