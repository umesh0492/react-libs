/**
 * DIT Azure File Storage utilities — shared across all portal apps.
 *
 * Flow:
 *   1. After login, the app calls fetchDITConfig() once.
 *   2. fetchDITConfig() hits the backend's authenticated GET /api/config endpoint.
 *   3. The backend reads DIT_SECRET_KEY from env (injected via GitHub Secrets).
 *   4. The secretkey is cached in memory for the session.
 *   5. uploadFileToDIT / downloadFileFromDIT use the cached key to call DIT directly.
 *
 * CORS: The DIT API Gateway must allow the portal origins — configure in Azure Portal:
 *   App Service → dit-api-gateway-* → CORS → Add allowed origins
 */

/** Shape returned by the backend GET /api/config endpoint. */
export interface DITConfig {
  ditBaseUrl: string;
  ditSecretKey: string;
}

// Module-level cache — lasts for the browser session (wiped on page reload / logout).
let _config: DITConfig | null = null;

// Module-level backend base URL. Set once at app startup via setDITApiBase().
// Defaults to "" (relative) which only works in dev (Vite proxy) — MUST be set in prod.
let _apiBase = "";

/**
 * Set the backend base URL for DIT config/upload/download calls.
 * Call this once at app startup (e.g. in AuthProvider or main.tsx) BEFORE
 * any upload/download occurs so that /api/config hits the real backend,
 * not the SWA origin (which returns HTML).
 *
 * Example — client-web:
 *   setDITApiBase(import.meta.env.VITE_API_URL || "");
 *
 * Example — admin-web:
 *   setDITApiBase(import.meta.env.VITE_API_URL || "http://localhost:8081");
 */
export function setDITApiBase(base: string): void {
  _apiBase = base.replace(/\/$/, ""); // strip trailing slash
}

/**
 * Fetch DIT config from the backend's authenticated /api/config endpoint.
 * Caches the result in memory so subsequent calls are instant.
 *
 * @param apiBase  - Override base URL (defaults to the value set via setDITApiBase)
 * @param token    - Optional JWT; falls back to localStorage "auth_jwt"
 */
export async function fetchDITConfig(apiBase?: string, token?: string): Promise<DITConfig> {
  if (_config) return _config;

  const base = apiBase ?? _apiBase;
  const jwt = token ?? localStorage.getItem("auth_jwt") ?? localStorage.getItem("jwt") ?? "";
  const res = await fetch(`${base}/api/config`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  if (!res.ok) {
    throw new Error(`fetchDITConfig: /api/config returned ${res.status} (base: "${base}")`);
  }

  const json = await res.json() as { dit_base_url: string; dit_secret_key: string };
  _config = {
    ditBaseUrl: json.dit_base_url,
    ditSecretKey: json.dit_secret_key,
  };
  return _config;
}

/** Call this on logout to wipe the cached secret from memory. */
export function clearDITConfig(): void {
  _config = null;
}

/** Result shape returned after a successful upload. Save `fileName` to the DB. */
export interface DITUploadResult {
  /** Publicly accessible Azure Blob URL */
  url: string;
  /** UUID filename as stored by DIT — save this to the DB, not the original name */
  fileName: string;
  /** Original filename provided at upload time */
  originalName: string;
}

/**
 * Upload a file to DIT Azure Blob Storage directly from the browser.
 *
 * The secretkey is retrieved from the backend via /api/config (authenticated) and
 * cached in memory — it is never hardcoded in the frontend bundle.
 *
 * @param file       - File to upload
 * @param folderPath - Destination folder / bucket (e.g. "partner", "catalog", "invoices")
 *                     Folder-level access control is enforced by the backend permissions table.
 * @param apiBase    - Optional backend base URL (defaults to relative path)
 */
export async function uploadFileToDIT(
  file: File,
  folderPath: string,
  apiBase?: string,   // uses setDITApiBase() value if not provided
): Promise<DITUploadResult> {
  const { ditBaseUrl, ditSecretKey } = await fetchDITConfig(apiBase);

  const form = new FormData();
  form.append("folderPath", folderPath);
  form.append("file", file);

  const res = await fetch(`${ditBaseUrl}/api/admin/upload_file`, {
    method: "POST",
    headers: { secretkey: ditSecretKey },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DIT upload failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  // DIT response: { status_code, message, data: [{ originalName, fileName, filePath, url }] }
  if (!json?.data?.length) {
    throw new Error("DIT upload succeeded but no file data in response");
  }
  const item = json.data[0];
  return {
    url: item.url || item.file_url,
    fileName: item.fileName || item.file_name,   // UUID — store in DB
    originalName: item.originalName || item.original_name,
  };
}

/**
 * Download a file from DIT Azure Blob Storage directly in the browser.
 *
 * The secretkey is retrieved from the backend via /api/config (authenticated) and
 * cached in memory — never hardcoded in the frontend bundle.
 *
 * @param fileName    - UUID filename stored in DB (e.g. "9d0c6167-....csv")
 * @param folder      - Bucket folder (e.g. "partner", "catalog")
 * @param displayName - Filename shown in the browser's Save As dialog
 * @param apiBase     - Optional backend base URL
 */
export async function downloadFileFromDIT(
  fileName: string,
  folder: string,
  displayName?: string,
  apiBase?: string,   // uses setDITApiBase() value if not provided
): Promise<void> {
  const { ditBaseUrl, ditSecretKey } = await fetchDITConfig(apiBase);

  const filePath = `${folder}/${fileName}`;
  const qs = new URLSearchParams({ filePath, fileName });

  const res = await fetch(`${ditBaseUrl}/api/admin/download_file?${qs}`, {
    headers: { secretkey: ditSecretKey },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DIT download failed (${res.status}): ${text}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = displayName || fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
