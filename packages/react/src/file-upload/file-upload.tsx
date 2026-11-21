import { CloseIcon, UploadIcon } from "@ktjn/design-icons";
import type {
  ChangeEvent,
  DragEvent,
  ForwardedRef,
  InputHTMLAttributes,
} from "react";
import { forwardRef, useState } from "react";
import { useFieldContext } from "../field/field-context.js";
import styles from "./file-upload.module.css";

export interface FileUploadProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange"
  > {
  files?: File[];
  defaultFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  invalid?: boolean;
  prompt?: string;
  hint?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileUploadImpl(
  {
    files,
    defaultFiles = [],
    onFilesChange,
    invalid,
    disabled,
    multiple,
    accept,
    prompt = "Choose files or drag and drop",
    hint,
    id,
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  }: FileUploadProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const field = useFieldContext();
  const [internalFiles, setInternalFiles] = useState<File[]>(defaultFiles);
  const [dragging, setDragging] = useState(false);

  const currentFiles = files ?? internalFiles;
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const classes = [styles.root, className].filter(Boolean).join(" ");

  function updateFiles(next: File[]) {
    if (files === undefined) {
      setInternalFiles(next);
    }
    onFilesChange?.(next);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length === 0) return;
    updateFiles(
      multiple ? [...currentFiles, ...selected] : selected.slice(0, 1),
    );
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (disabled) return;
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    if (disabled) return;
    event.preventDefault();
    setDragging(false);
    const dropped = Array.from(event.dataTransfer.files ?? []);
    if (dropped.length === 0) return;
    updateFiles(multiple ? [...currentFiles, ...dropped] : dropped.slice(0, 1));
  }

  function removeFile(targetIndex: number) {
    updateFiles(currentFiles.filter((_, index) => index !== targetIndex));
  }

  return (
    <div data-slot="file-upload" className={classes}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: dropzone wraps a native file input for drag-and-drop convenience */}
      <div
        data-slot="file-upload-dropzone"
        className={styles.dropzone}
        data-dragging={dragging ? "" : undefined}
        data-invalid={resolvedInvalid ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={ref}
          type="file"
          id={id ?? field?.controlId}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={ariaDescribedBy ?? field?.describedBy}
          aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
          onChange={handleChange}
          className={styles.input}
          {...rest}
        />
        <UploadIcon aria-hidden className={styles.uploadIcon} />
        <p className={styles.prompt}>{prompt}</p>
        {hint ? <p className={styles.hint}>{hint}</p> : null}
      </div>
      {currentFiles.length > 0 ? (
        <ul className={styles.list}>
          {currentFiles.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className={styles.item}
            >
              <span className={styles.meta}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>
                  {formatBytes(file.size)}
                </span>
              </span>
              <button
                type="button"
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
                onClick={() => removeFile(index)}
                className={styles.remove}
              >
                <CloseIcon aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export const FileUpload = forwardRef(FileUploadImpl);
FileUpload.displayName = "FileUpload";
