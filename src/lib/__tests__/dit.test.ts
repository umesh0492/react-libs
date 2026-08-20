import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  setDITApiBase,
  fetchDITConfig,
  clearDITConfig,
  uploadFileToDIT,
  downloadFileFromDIT,
} from "../dit";

describe("DIT Azure Storage Utilities", () => {
  beforeEach(() => {
    clearDITConfig();
    vi.restoreAllMocks();
  });

  it("fetches and caches DIT configuration from /api/config", async () => {
    setDITApiBase("https://backend.example.com");

    const mockConfig = {
      dit_base_url: "https://dit.example.com",
      dit_secret_key: "mock-secret-key",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockConfig,
    } as any);

    const config1 = await fetchDITConfig();
    expect(config1.ditBaseUrl).toBe("https://dit.example.com");
    expect(config1.ditSecretKey).toBe("mock-secret-key");

    // Subsequent call should use memory cache without calling fetch again
    const config2 = await fetchDITConfig();
    expect(config2).toEqual(config1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("throws error when config endpoint returns non-200", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as any);

    await expect(fetchDITConfig()).rejects.toThrow("fetchDITConfig: /api/config returned 500");
  });

  it("uploads file to DIT and parses result", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          dit_base_url: "https://dit.example.com",
          dit_secret_key: "mock-key",
        }),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              url: "https://azure.blob/test.pdf",
              fileName: "uuid-1234.pdf",
              originalName: "test.pdf",
            },
          ],
        }),
      } as any);

    const file = new File(["dummy content"], "test.pdf", { type: "application/pdf" });
    const result = await uploadFileToDIT(file, "invoices");

    expect(result.url).toBe("https://azure.blob/test.pdf");
    expect(result.fileName).toBe("uuid-1234.pdf");
    expect(result.originalName).toBe("test.pdf");
  });

  it("downloads file and creates virtual anchor element", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          dit_base_url: "https://dit.example.com",
          dit_secret_key: "mock-key",
        }),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(["data"]),
      } as any);

    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:http://localhost/dummy");
    global.URL.revokeObjectURL = vi.fn();

    await downloadFileFromDIT("uuid-1234.pdf", "invoices", "invoice-2026.pdf");

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
});
