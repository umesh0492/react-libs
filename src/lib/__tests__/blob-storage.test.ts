import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  setBlobStorageApiBase,
  fetchBlobStorageConfig,
  clearBlobStorageConfig,
  uploadFileToStorage,
  downloadFileFromStorage,
} from "../blob-storage";

describe("Blob Storage Utilities", () => {
  beforeEach(() => {
    clearBlobStorageConfig();
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("fetches and caches storage configuration from /api/config", async () => {
    setBlobStorageApiBase("https://backend.example.com");
    window.localStorage.setItem("auth_jwt", "mock-token-xyz");

    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        storage_base_url: "https://storage.example.com",
        storage_secret_key: "test-secret-key",
      }),
    } as Response);

    const config1 = await fetchBlobStorageConfig();
    expect(config1.storageBaseUrl).toBe("https://storage.example.com");
    expect(config1.storageSecretKey).toBe("test-secret-key");
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Second call should hit the in-memory cache
    const config2 = await fetchBlobStorageConfig();
    expect(config2).toBe(config1);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("throws descriptive error when config fetch fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(fetchBlobStorageConfig("https://api.test")).rejects.toThrow(
      "fetchBlobStorageConfig: /api/config returned 500"
    );
  });

  it("uploads file to storage and parses result", async () => {
    // 1. Config call
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          storage_base_url: "https://storage.example.com",
          storage_secret_key: "secret",
        }),
      } as Response)
      // 2. Upload call
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status_code: 200,
          data: [
            {
              url: "https://storage.example.com/docs/uuid-1234.pdf",
              fileName: "uuid-1234.pdf",
              originalName: "report.pdf",
            },
          ],
        }),
      } as Response);

    const file = new File(["dummy content"], "report.pdf", {
      type: "application/pdf",
    });
    const result = await uploadFileToStorage(file, "documents");

    expect(result.url).toBe("https://storage.example.com/docs/uuid-1234.pdf");
    expect(result.fileName).toBe("uuid-1234.pdf");
    expect(result.originalName).toBe("report.pdf");
  });

  it("downloads file and creates object URL anchor trigger", async () => {
    const mockBlob = new Blob(["test-data"], { type: "application/pdf" });

    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          storage_base_url: "https://storage.example.com",
          storage_secret_key: "secret",
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      } as Response);

    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:http://localhost/test-uuid");
    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    await downloadFileFromStorage(
      "uuid-1234.pdf",
      "documents",
      "report-2026.pdf"
    );

    expect(createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(revokeObjectURL).toHaveBeenCalledWith(
      "blob:http://localhost/test-uuid"
    );
  });
});
