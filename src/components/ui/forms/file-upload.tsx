import * as React from "react";
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/formatters";

export interface FileItem {
  id: string;
  file: File;
  previewUrl?: string;
  progress?: number;
  error?: string;
}

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: FileItem[];
  onChange?: (files: FileItem[]) => void;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      value = [],
      onChange,
      accept,
      maxSize = 10 * 1024 * 1024, // 10MB default
      maxFiles = 5,
      multiple = true,
      disabled = false,
      label = "Click or drag files to upload",
      description = "SVG, PNG, JPG, or PDF up to 10MB",
      error: externalError,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const activeError = externalError || errorMessage;

    const processFiles = React.useCallback(
      (newRawFiles: FileList | File[]) => {
        setErrorMessage(null);
        const incoming = Array.from(newRawFiles);

        if (!multiple && incoming.length > 1) {
          setErrorMessage("Only single file upload is allowed");
          return;
        }

        if (value.length + incoming.length > maxFiles) {
          setErrorMessage(`You can only upload up to ${maxFiles} files`);
          return;
        }

        const validFiles: FileItem[] = [];

        for (const file of incoming) {
          if (maxSize && file.size > maxSize) {
            setErrorMessage(`File "${file.name}" exceeds max allowed size of ${formatBytes(maxSize)}`);
            return;
          }

          const isImage = file.type.startsWith("image/");
          const previewUrl = isImage ? URL.createObjectURL(file) : undefined;

          validFiles.push({
            id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${file.name}-${file.lastModified}-${file.size}`,
            file,
            previewUrl,
            progress: 100,
          });
        }

        const updated = multiple ? [...value, ...validFiles] : validFiles;
        onChange?.(updated);
      },
      [value, onChange, maxSize, maxFiles, multiple]
    );

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        e.target.value = ""; // Reset to allow re-uploading same file
      }
    };

    const handleRemove = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const updated = value.filter((f) => f.id !== id);
      onChange?.(updated);
    };

    return (
      <div ref={ref} className={cn("w-full space-y-3", className)} {...props}>
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer text-center",
            "bg-muted/20 hover:bg-muted/40 border-border hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isDragging && "border-primary bg-primary/5 ring-2 ring-primary/20",
            disabled && "opacity-50 cursor-not-allowed hover:bg-muted/20 hover:border-border",
            activeError && "border-destructive/50 hover:border-destructive"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleFileInputChange}
            className="sr-only"
            tabIndex={-1}
            data-testid="file-upload-input"
          />

          <div className="p-3 bg-muted rounded-full mb-3 text-muted-foreground">
            <UploadCloud className="h-6 w-6" />
          </div>

          <p className="text-sm font-medium text-foreground">{label}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>

        {activeError && (
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{activeError}</span>
          </div>
        )}

        {value.length > 0 && (
          <ul className="space-y-2 pt-1" aria-label="Uploaded files">
            {value.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-md border border-border bg-card text-card-foreground shadow-xs text-sm"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="h-9 w-9 rounded object-cover border border-border shrink-0"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{item.file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(item.file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <button
                    type="button"
                    onClick={(e) => handleRemove(item.id, e)}
                    disabled={disabled}
                    aria-label={`Remove ${item.file.name}`}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
