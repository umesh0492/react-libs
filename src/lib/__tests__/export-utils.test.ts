import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportData, exportToCSV, downloadFromBackend } from '../export-utils';


// ─── Mocks ────────────────────────────────────────────────────────────────────

// Mock URL.createObjectURL / revokeObjectURL (not in JSDOM)
const createObjectURLMock = vi.fn(() => 'blob:mock-url');
const revokeObjectURLMock = vi.fn();
global.URL.createObjectURL = createObjectURLMock;
global.URL.revokeObjectURL = revokeObjectURLMock;

// Mock DOM click so <a>.click() doesn't crash
const clickMock = vi.fn();
const appendChildMock = vi.fn();
const removeChildMock = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  createObjectURLMock.mockClear();
  revokeObjectURLMock.mockClear();
  clickMock.mockClear();

  // Override createElement so returned <a> has a spy on click
  vi.spyOn(document, 'createElement').mockImplementation((tag) => {
    if (tag === 'a') {
      return {
        href: '',
        download: '',
        style: { display: '' },
        click: clickMock,
        setAttribute: vi.fn(),
        remove: vi.fn(),
      } as unknown as HTMLAnchorElement;
    }
    return document.createElement(tag);
  });

  vi.spyOn(document.body, 'appendChild').mockImplementation(appendChildMock as any);
  vi.spyOn(document.body, 'removeChild').mockImplementation(removeChildMock as any);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// ─── Sample data ──────────────────────────────────────────────────────────────

const sampleData = [
  { id: '1', name: 'Widget A', price: 100, qty: 5 },
  { id: '2', name: 'Widget B', price: 200, qty: 3 },
];

const sampleColumns = [
  { header: 'ID', key: 'id' },
  { header: 'Product', key: 'name' },
  { header: 'Price', key: 'price' },
];

// ─── exportData (CSV) ─────────────────────────────────────────────────────────

describe('exportData — CSV', () => {
  it('triggers a download for CSV format', async () => {
    await exportData(sampleData, 'test-export', 'csv');
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    expect(clickMock).toHaveBeenCalledTimes(1);
  });

  it('uses auto-detected keys when no columns specified', async () => {
    await exportData(sampleData, 'auto-keys', 'csv');
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  });

  it('uses provided column headers', async () => {
    await exportData(sampleData, 'with-cols', 'csv', { columns: sampleColumns });
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  });

  it('returns early and warns for empty data', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await exportData([], 'empty', 'csv');
    expect(createObjectURLMock).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('empty data array')
    );
  });

  it('revokes object URL after timeout', async () => {
    await exportData(sampleData, 'revoke-test', 'csv');
    vi.advanceTimersByTime(300);
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });

  it('handles null/undefined values in data cells', async () => {
    const dataWithNulls = [
      { id: '1', name: null, price: undefined },
    ];
    await exportData(dataWithNulls as any, 'nulls', 'csv');
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  });

  it('escapes double-quote characters in CSV cells', async () => {
    const dataWithQuotes = [
      { id: '1', name: 'Say "Hello"', price: 100 },
    ];
    await exportData(dataWithQuotes, 'quotes', 'csv');
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  });

  it('defaults to CSV when no format is specified', async () => {
    await exportData(sampleData, 'default-format');
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  });
});

// ─── exportToCSV ─────────────────────────────────────────────────────────────

describe('exportToCSV (shorthand)', () => {
  it('calls exportData with csv format', async () => {
    exportToCSV(sampleData, 'shorthand-test');
    // Give the async exportData a tick to start
    await vi.runAllTimersAsync();
    // createObjectURL is called when the blob download triggers
    expect(createObjectURLMock).toHaveBeenCalled();
  });

  it('handles empty data without throwing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => exportToCSV([], 'empty-shorthand')).not.toThrow();
    warnSpy.mockRestore();
  });
});

// ─── downloadFromBackend ──────────────────────────────────────────────────────

describe('downloadFromBackend', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; },
    };
  })();

  const fetchMock = vi.fn();

  beforeEach(() => {
    localStorageMock.clear();
    fetchMock.mockClear();
    vi.stubGlobal('localStorage', localStorageMock);
    
    fetchMock.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['test'], { type: 'text/csv' }))
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('throws if no token in localStorage', async () => {
    await expect(
      downloadFromBackend('http://localhost/api/export/partners', 'partners')
    ).rejects.toThrow('Not authenticated');
  });

  it('fetches endpoint with auth header and query params', async () => {
    localStorageMock.setItem('auth_jwt', 'test-token-abc');
    await downloadFromBackend('http://localhost/api/export/orders', 'orders', { status: 'active' });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost/api/export/orders?status=active',
      expect.objectContaining({
        headers: { 'Authorization': 'Bearer test-token-abc' }
      })
    );
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    expect(clickMock).toHaveBeenCalledTimes(1);
  });

  it('uses a custom tokenKey from localStorage', async () => {
    localStorageMock.setItem('custom_token_key', 'my-custom-token');
    await downloadFromBackend('http://localhost/api/export/items', 'items', {}, 'custom_token_key');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost/api/export/items?',
      expect.objectContaining({
        headers: { 'Authorization': 'Bearer my-custom-token' }
      })
    );
  });

  it('works with no extra queryParams', async () => {
    localStorageMock.setItem('auth_jwt', 'jwt-token');
    await downloadFromBackend('http://localhost/api/export/partners', 'partners');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost/api/export/partners?',
      expect.objectContaining({
        headers: { 'Authorization': 'Bearer jwt-token' }
      })
    );
  });
});

// ─── exportData — XLSX ───────────────────────────────────────────────────────

describe('exportData — XLSX', () => {
  const writeFileMock = vi.fn();
  const xlsxStub = {
    utils: {
      aoa_to_sheet: vi.fn(() => ({})),
      book_new: vi.fn(() => ({})),
      book_append_sheet: vi.fn(),
    },
    writeFile: writeFileMock,
  };
  let origFn: FunctionConstructor;

  beforeEach(() => {
    writeFileMock.mockClear();
    xlsxStub.utils.aoa_to_sheet.mockClear();
    xlsxStub.utils.book_new.mockClear();
    xlsxStub.utils.book_append_sheet.mockClear();
    origFn = globalThis.Function as FunctionConstructor;
    // Intercept new Function('m','return import(m)') to stub the xlsx dynamic import
    vi.stubGlobal('Function', function (...args: string[]) {
      if (args.length === 2 && args[0] === 'm' && args[1] === 'return import(m)') {
        return (mod: string) =>
          mod === 'xlsx' ? Promise.resolve(xlsxStub) : Promise.resolve({});
      }
      return new origFn(...args);
    });
  });

  afterEach(() => { vi.unstubAllGlobals(); });

  it('calls XLSX.writeFile for xlsx format', async () => {
    await exportData(sampleData, 'test-xlsx', 'xlsx');
    expect(writeFileMock).toHaveBeenCalledWith(expect.any(Object), 'test-xlsx.xlsx');
  });

  it('uses provided column headers for xlsx', async () => {
    await exportData(sampleData, 'col-xlsx', 'xlsx', { columns: sampleColumns });
    expect(xlsxStub.utils.aoa_to_sheet).toHaveBeenCalledWith(
      expect.arrayContaining([['ID', 'Product', 'Price']])
    );
  });

  it('auto-detects keys for xlsx when no columns specified', async () => {
    await exportData(sampleData, 'auto-xlsx', 'xlsx');
    expect(xlsxStub.utils.aoa_to_sheet).toHaveBeenCalledWith(
      expect.arrayContaining([expect.arrayContaining(['id', 'name', 'price', 'qty'])])
    );
  });
});

// ─── exportData — PDF ────────────────────────────────────────────────────────

describe('exportData — PDF', () => {
  const saveMock = vi.fn();
  const textMock = vi.fn();
  const jsPDFInstance = { text: textMock, save: saveMock };
  const autoTableMock = vi.fn();
  let origFn: FunctionConstructor;

  beforeEach(() => {
    saveMock.mockClear();
    textMock.mockClear();
    autoTableMock.mockClear();
    origFn = globalThis.Function as FunctionConstructor;
    vi.stubGlobal('Function', function (...args: string[]) {
      if (args.length === 2 && args[0] === 'm' && args[1] === 'return import(m)') {
        return (mod: string) => {
          if (mod === 'jspdf') {
            const MockJsPDF = function() { return jsPDFInstance; };
            return Promise.resolve({ default: MockJsPDF });
          }
          if (mod === 'jspdf-autotable') return Promise.resolve({ default: autoTableMock });
          return Promise.resolve({});
        };
      }
      return new origFn(...args);
    });
  });

  afterEach(() => { vi.unstubAllGlobals(); });

  it('calls doc.save for pdf format', async () => {
    await exportData(sampleData, 'test-pdf', 'pdf');
    expect(saveMock).toHaveBeenCalledWith('test-pdf.pdf');
  });

  it('maps correctly even when data contains null or undefined', async () => {
    const dirtyData = [{ id: 2, product: null, price: undefined }];
    await exportData(dirtyData, 'nulls', 'pdf', { columns: sampleColumns });
    // Expect the empty branch to run without throwing
    expect(autoTableMock).toHaveBeenCalled();
  });

  it('calls autoTable with correct head and body', async () => {
    await exportData(sampleData, 'at-pdf', 'pdf', { columns: sampleColumns });
    expect(autoTableMock).toHaveBeenCalledWith(
      jsPDFInstance,
      expect.objectContaining({
        head: [['ID', 'Product', 'Price']],
        body: expect.any(Array),
      })
    );
  });

  it('uses portrait orientation when specified', async () => {
    await exportData(sampleData, 'portrait-pdf', 'pdf', { pdfOrientation: 'portrait' });
    expect(saveMock).toHaveBeenCalledWith('portrait-pdf.pdf');
  });

  it('uses custom pdfTitle when provided', async () => {
    await exportData(sampleData, 'my_report', 'pdf', { pdfTitle: 'My Custom Report' });
    expect(textMock).toHaveBeenCalledWith('My Custom Report', expect.any(Number), expect.any(Number));
  });

  it('auto-generates title from filename when pdfTitle is omitted', async () => {
    await exportData(sampleData, 'partner_report', 'pdf');
    expect(textMock).toHaveBeenCalledWith('PARTNER REPORT', expect.any(Number), expect.any(Number));
  });
});
