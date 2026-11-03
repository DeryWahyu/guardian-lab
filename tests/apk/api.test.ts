import { describe, expect, it } from "bun:test";
import { GET as historyDetail } from "@/app/api/history/[id]/route";
import { getApkStaticReport } from "@/lib/apk/presentation";
import { acquireApkSlot } from "@/lib/apk/receive";
import { getInvestigationResult } from "@/lib/investigations/presentation";
import { API_ROUTES } from "@/lib/routes";
import { buildShareCard } from "@/lib/share-card/content";
import { investigationSchema } from "@/lib/validations/investigation";
import { executeRoute } from "../e2e/helpers/test-harness";
import { getStandardSessionCookies } from "../helpers/auth-fixtures";
import { apkUpload } from "../helpers/investigation-fixtures";

describe("APK static investigation API", () => {
  it("persists static facts and reloads the identical report without fabricating an AI verdict", async () => {
    const response = await executeRoute(API_ROUTES.analyzeApk, "POST", apkUpload("plain-name.apk"));
    expect(response.status).toBe(201);
    const record = investigationSchema.parse(response.body),
      report = getApkStaticReport(record);
    expect(record.status).toBe("UNAVAILABLE");
    expect(record.riskLevel).toBeNull();
    expect(record.riskScore).toBeNull();
    expect(record.startedAt).not.toBeNull();
    expect(record.inputMetadata.staticExtractionPerformed).toBe(true);
    expect(record.inputMetadata.binaryStored).toBe(false);
    expect(report?.manifest.label).toBe("HelloApp");
    expect(report?.archive.dexCount).toBe(0);
    expect(report?.status).toBe("PARTIAL");
    expect(getInvestigationResult(record)).toBeNull();
    expect(buildShareCard(record)).toBeNull();
    const cookies = await getStandardSessionCookies();
    const request = new Request(`http://localhost:3000${API_ROUTES.historyDetail(record.id)}`, {
      headers: {
        cookie: Object.entries(cookies)
          .map(([k, v]) => `${k}=${v}`)
          .join("; "),
      },
    });
    const stored = investigationSchema.parse(
      await (await historyDetail(request, { params: Promise.resolve({ id: record.id }) })).json(),
    );
    expect(stored.inputMetadata).toEqual(record.inputMetadata);
  }, 15000);
  it("saves a failed investigation for a fake APK instead of accepting its extension", async () => {
    const response = await executeRoute(
      API_ROUTES.analyzeApk,
      "POST",
      apkUpload("fake.apk", "MZ-not-an-APK"),
    );
    expect(response.status).toBe(422);
    const record = investigationSchema.parse(response.body);
    expect(record.status).toBe("FAILED");
    expect(record.errorCode).toBe("APK_INVALID_ARCHIVE");
    expect(record.riskScore).toBeNull();
    expect(getApkStaticReport(record)).toBeNull();
  });
  it("returns a visible busy response without accepting a duplicate job", async () => {
    const release = acquireApkSlot();
    expect(release).not.toBeNull();
    try {
      const response = await executeRoute(API_ROUTES.analyzeApk, "POST", apkUpload());
      expect(response.status).toBe(429);
      expect(response.body).not.toHaveProperty("id");
    } finally {
      release?.();
    }
    const finalRelease = acquireApkSlot();
    expect(finalRelease).not.toBeNull();
    finalRelease?.();
  });
});
