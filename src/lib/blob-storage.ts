/**
 * Cloud Blob Storage utilities — agnostic file storage client for web applications.
 *
 * Flow:
 *   1. After login, the app calls fetchBlobStorageConfig() once.
 *   2. fetchBlobStorageConfig() hits the backend's authenticated GET /api/config endpoint.
 *   3. The backend returns storage credentials securely from environment configuration.
 *   4. Credentials are cached in memory for the active browser session.
 *   5. uploadFileToStorage / downloadFileFromStorage use the cached config to manage files.
 */

/** Shape returned by the backend GET /api/config endpoint for storage. */
export interface BlobStorageConfig {
  storageBaseUrl: string;
  storageSecretKey: string;
}

// Module-level cache — lasts for the browser session (wiped on page reload / logout).
let _config: BlobStorageConfig | null = null;

// Module-level backend base URL. Set once at app startup via setBlobStorageApiBase().
let _apiBase = "";

/**
 * Set the backend base URL for storage config/upload/download calls.
 * Call this once at app startup before any upload/download occurs.
 */
export function setBlobStorageApiBase(base: string): void {
  _apiBase = base.replace(/\/$/, ""); // strip trailing slash
}

/**
 * Fetch storage config from the backend's authenticated /api/config endpoint.
 * Caches the result in memory so subsequent calls are instant.
 *
 * @param apiBase  - Override base URL (defaults to the value set via setBlobStorageApiBase)
 * @param token    - Optional JWT; falls back to localStorage "auth_jwt"
 */
export async function fetchBlobStorageConfig(
  apiBase?: string,
  token?: string
): Promise<BlobStorageConfig> {
  if (_config) return _config;

  const base = apiBase ?? _apiBase;
  const jwt =
    token ??
    (typeof window !== "undefined"
      ? localStorage.getItem("auth_jwt") ?? localStorage.getItem("jwt") ?? ""
      : "");

  const res = await fetch(`${base}/api/config`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  if (!res.ok) {
    throw new Error(
      `fetchBlobStorageConfig: /api/config returned ${res.status} (base: "${base}")`
    );
  }

  const json = (await res.json()) as {
    storage_base_url?: string;
    storage_secret_key?: string;
  };

  _config = {
    storageBaseUrl: json.storage_base_url || "",
    storageSecretKey: json.storage_secret_key || "",
  };
  return _config;
}

/** Call this on logout to wipe the cached secret from memory. */
export function clearBlobStorageConfig(): void {
  _config = null;
}

/** Result shape returned after a successful upload. */
export interface BlobUploadResult {
  /** Publicly accessible Blob URL */
  url: string;
  /** UUID filename as stored by storage backend */
  fileName: string;
  /** Original filename provided at upload time */
  originalName: string;
}

/**
 * Upload a file to Blob Storage directly from the browser.
 *
 * The secret key is retrieved from the backend via /api/config (authenticated) and
 * cached in memory — it is never hardcoded in the frontend bundle.
 *
 * @param file       - File to upload
 * @param folderPath - Destination folder / bucket (e.g. "documents", "attachments")
 * @param apiBase    - Optional backend base URL (defaults to relative path)
 */
export async function uploadFileToStorage(
  file: File,
  folderPath: string,
  apiBase?: string
): Promise<BlobUploadResult> {
  const { storageBaseUrl, storageSecretKey } = await fetchBlobStorageConfig(apiBase);

  const form = new FormData();
  form.append("folderPath", folderPath);
  form.append("file", file);

  const res = await fetch(`${storageBaseUrl}/api/admin/upload_file`, {
    method: "POST",
    headers: { secretkey: storageSecretKey },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Storage upload failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  if (!json?.data?.length) {
    throw new Error("Storage upload succeeded but no file data in response");
  }
  const item = json.data[0];
  return {
    url: item.url || item.file_url,
    fileName: item.fileName || item.file_name,
    originalName: item.originalName || item.original_name,
  };
}

/**
 * Download a file from Blob Storage directly in the browser.
 *
 * @param fileName    - UUID filename stored in DB
 * @param folder      - Bucket folder
 * @param displayName - Filename shown in the browser's Save As dialog
 * @param apiBase     - Optional backend base URL
 */
export async function downloadFileFromStorage(
  fileName: string,
  folder: string,
  displayName?: string,
  apiBase?: string
): Promise<void> {
  const { storageBaseUrl, storageSecretKey } = await fetchBlobStorageConfig(apiBase);

  const filePath = `${folder}/${fileName}`;
  const qs = new URLSearchParams({ filePath, fileName });

  const res = await fetch(`${storageBaseUrl}/api/admin/download_file?${qs}`, {
    headers: { secretkey: storageSecretKey },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Storage download failed (${res.status}): ${text}`);
  }

  const blob = await res.blob();
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = displayName || fileName;
    document.body.appendChild(a);
    a.click();
    if (a.parentNode) {
      a.parentNode.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }
}
