import * as React from "react"
import { Loader2, ZoomIn, ZoomOut, RotateCw, Maximize, Download, Image as ImageIcon } from "lucide-react"

import { Button } from "../forms/button"
import { Card } from "../layout/card"
import { cn } from "../../../lib/utils"

export interface ImageViewerProps {
  /** The URL or File object of the image to render */
  file: string | File
  /** Optional class for the outer container */
  className?: string
  /** Text description of the image for accessibility */
  alt?: string
  /** Initial scale of the Image */
  scale?: number
  /** Whether to show a transparent internal download button */
  showDownload?: boolean
  /** Callback when loading succeeds */
  onLoadSuccess?: () => void
  /** Callback when loading fails */
  onLoadError?: (error: string | Event) => void
}

export function ImageViewer({
  file,
  className,
  alt = "Image preview",
  scale = 1.0,
  showDownload = false,
  onLoadSuccess,
  onLoadError,
}: ImageViewerProps) {
  const [error, setError] = React.useState<string | null>(null)
  const [currentScale, setCurrentScale] = React.useState(scale)
  const [rotation, setRotation] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [imageSrc, setImageSrc] = React.useState<string>("")

  React.useEffect(() => {
    setIsLoading(true)
    setError(null)
    
    if (typeof file === "string") {
      setImageSrc(file)
    } else if (file instanceof File) {
      if (!file.type.startsWith("image/")) {
        setError("Provided file is not an image.")
        setIsLoading(false)
        return
      }
      const url = URL.createObjectURL(file)
      setImageSrc(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setError("Invalid file format.")
      setIsLoading(false)
    }
  }, [file])

  function handleImageLoad() {
    setIsLoading(false)
    onLoadSuccess?.()
  }

  function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    setIsLoading(false)
    setError("Failed to load image.")
    onLoadError?.(e.nativeEvent)
  }

  function handleDownload() {
    const a = document.createElement("a")
    a.href = imageSrc
    if (typeof file === "string") {
      a.download = file.split('/').pop() || "image.png"
    } else {
      a.download = file.name || "image.png"
    }
    a.click()
  }

  return (
    <Card className={cn("relative flex flex-col items-center overflow-hidden bg-muted/20", className)}>
      {/* Top Controls Bar */}
      {!error && !isLoading && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-md p-1 rounded-md border shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setCurrentScale(s => Math.max(s - 0.2, 0.2))} className="h-7 w-7" aria-label="Zoom Out" title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentScale(1.0)} className="h-7 w-7" aria-label="Reset Zoom" title="Fit Page">
            <Maximize className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentScale(s => Math.min(s + 0.5, 5.0))} className="h-7 w-7" aria-label="Zoom In" title="Zoom In">
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
        </div>
      )}

      {/* Image Viewport */}
      <div className="w-full h-full flex justify-center items-center p-4 overflow-auto shrink-0 min-h-[300px] max-h-[70vh]">
        {error ? (
          <div className="h-48 w-full max-w-sm flex flex-col items-center justify-center text-center p-6 space-y-3">
            <ImageIcon className="w-10 h-10 text-destructive/50" />
            <div>
              <p className="font-semibold text-foreground">Failed to load Image</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading Image...</p>
              </div>
            )}
            {imageSrc && (
              <div
                style={{
                  transform: `scale(${currentScale}) rotate(${rotation}deg)`,
                  transition: "transform 0.2s ease-in-out",
                }}
                className="flex justify-center items-center origin-center"
              >
                <img
                  src={imageSrc}
                  alt={alt}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={cn(
                    "max-w-full max-h-full object-contain pointer-events-none shadow-sm border border-border"
                  )}
                  style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.2s" }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
