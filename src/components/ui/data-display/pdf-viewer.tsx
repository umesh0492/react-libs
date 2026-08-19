import * as React from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Loader2, ChevronLeft, ChevronRight, Download, FileWarning, ZoomIn, ZoomOut, RotateCw, Maximize, Printer } from "lucide-react"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

import { Button } from "../forms/button"
import { Card } from "../layout/card"
import { cn } from "../../../lib/utils"

// Explicit worker setup for modern bundlers (Vite/Webpack 5)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export interface PdfViewerProps {
  /** The URL or File object of the PDF to render */
  file: string | File
  /** Optional class for the outer container */
  className?: string
  /** Maximum width of the rendered PDF page */
  maxWidth?: number
  /** Initial scale of the PDF */
  scale?: number
  /** Whether to show a transparent internal download button */
  showDownload?: boolean
  /** Whether to show a print button */
  showPrint?: boolean
  /** Callback when loading succeeds */
  onLoadSuccess?: (numPages: number) => void
  /** Callback when loading fails */
  onLoadError?: (error: Error) => void
}

export function PdfViewer({
  file,
  className,
  maxWidth = 800,
  scale = 1.0,
  showDownload = false,
  showPrint = false,
  onLoadSuccess,
  onLoadError,
}: PdfViewerProps) {
  const [numPages, setNumPages] = React.useState<number | null>(null)
  const [pageNumber, setPageNumber] = React.useState<number>(1)
  const [error, setError] = React.useState<Error | null>(null)
  const [currentScale, setCurrentScale] = React.useState(scale)
  const [rotation, setRotation] = React.useState(0)

  function handleDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
    setError(null)
    onLoadSuccess?.(numPages)
  }

  function handleDocumentLoadError(err: Error) {
    setError(err)
    onLoadError?.(err)
  }

  function handleDownload() {
    if (typeof file === "string") {
      const a = document.createElement("a")
      a.href = file
      a.download = file.split('/').pop() || "document.pdf"
      a.click()
    } else {
      const url = URL.createObjectURL(file)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }

  function handlePrint() {
    const iframe = document.createElement("iframe")
    iframe.style.display = "none"
    
    if (typeof file === "string") {
      iframe.src = file
    } else {
      iframe.src = URL.createObjectURL(file)
    }
    
    document.body.appendChild(iframe)
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print()
      }, 100)
    }
  }

  return (
    <Card className={cn("relative flex flex-col items-center overflow-hidden bg-muted/20", className)}>
      
      {/* Top Controls Bar */}
      {!error && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-md p-1 rounded-md border shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setCurrentScale(s => Math.max(s - 0.2, 0.5))} className="h-7 w-7" aria-label="Zoom Out" title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentScale(1.0)} className="h-7 w-7" aria-label="Reset Zoom" title="Fit Page">
            <Maximize className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentScale(s => Math.min(s + 0.2, 3.0))} className="h-7 w-7" aria-label="Zoom In" title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="icon" onClick={() => setRotation(r => (r + 90) % 360)} className="h-7 w-7" aria-label="Rotate" title="Rotate">
            <RotateCw className="h-4 w-4" />
          </Button>
          
          {showDownload && (
            <>
              <div className="w-px h-4 bg-border mx-1" />
              <Button variant="ghost" size="icon" onClick={handleDownload} className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10" aria-label="Download" title="Download">
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}

          {showPrint && (
            <>
              {!showDownload && <div className="w-px h-4 bg-border mx-1" />}
              <Button variant="ghost" size="icon" onClick={handlePrint} className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10" aria-label="Print" title="Print">
                <Printer className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* PDF Viewport */}
      <div className="w-full flex justify-center p-4 overflow-auto shrink-0 max-h-[70vh]">
        {error ? (
          <div className="h-48 w-full max-w-sm flex flex-col items-center justify-center text-center p-6 space-y-3">
            <FileWarning className="w-10 h-10 text-destructive" />
            <div>
              <p className="font-semibold text-foreground">Failed to load PDF</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
        ) : (
          <Document
            file={file}
            onLoadSuccess={handleDocumentLoadSuccess}
            onLoadError={handleDocumentLoadError}
            loading={
              <div className="h-64 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading Document...</p>
              </div>
            }
            error={null}
            className="shadow-sm border border-border"
          >
            <Page
              pageNumber={pageNumber}
              scale={currentScale}
              rotate={rotation}
              width={maxWidth}
              renderAnnotationLayer={true}
              renderTextLayer={true}
              loading={<div className="h-[500px] w-[400px] bg-muted animate-pulse" />}
            />
          </Document>
        )}
      </div>

      {/* Bottom Pagination Controls */}
      {numPages && numPages > 1 && !error && (
        <div className="w-full border-t bg-background p-3 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <p className="text-sm text-muted-foreground font-medium">
            Page {pageNumber} of {numPages}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(p => Math.min(p + 1, numPages))}
            disabled={pageNumber >= numPages}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </Card>
  )
}
