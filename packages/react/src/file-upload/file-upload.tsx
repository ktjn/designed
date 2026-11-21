import { CloseIcon, UploadIcon } from "@ktjn/design-icons";
import type { ChangeEvent, DragEvent, InputHTMLAttributes, Ref } from "react";
import { useEffect, useRef, useState } from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./file-upload.module.css";

export interface FileUploadProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange"
  > {
  ref?: Ref<HTMLInputElement>;
  files?: File[];
  defaultFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  invalid?: boolean;
  prompt?: string;
  hint?: string;
  getRemoveLabel?: (file: File) => string;
}

function matchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept) return true;
  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token === "*/*") return true;
    if (token.startsWith(".")) return fileName.endsWith(token);
    if (token.endsWith("/*")) {
      return mimeType.startsWith(token.slice(0, -1));
    }
    return mimeType === token;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function syncInputFiles(
  input: HTMLInputElement | null,
  files: readonly File[],
) {
  if (!input) return;
  if (typeof DataTransfer !== "undefined") {
    const dataTransfer = new DataTransfer();
    for (const file of files) {
      dataTransfer.items.add(file);
    }
    const ownDescriptor = Object.getOwnPropertyDescriptor(input, "files");
    if (!ownDescriptor || ownDescriptor.writable || ownDescriptor.set) {
      input.files = dataTransfer.files;
    }
  } else if (files.length === 0) {
    input.value = "";
  }
}

export function FileUpload({
  ref,
  files,
  defaultFiles = [],
  onFilesChange,
  invalid,
  disabled,
  multiple,
  accept,
  prompt = "Choose files or drag and drop",
  hint,
  getRemoveLabel = (file) => `Remove ${file.name}`,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: FileUploadProps) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const [internalFiles, setInternalFiles] = useState<File[]>(defaultFiles);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentFiles = files ?? internalFiles;
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const classes = [styles.root, className].filter(Boolean).join(" ");

  useEffect(() => {
    syncInputFiles(inputRef.current, currentFiles);
  }, [currentFiles]);

  function assignRefs(node: HTMLInputElement | null) {
    inputRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }

  function updateFiles(next: File[]) {
    syncInputFiles(inputRef.current, next);
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
    if (resolvedDisabled) return;
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    if (resolvedDisabled) return;
    event.preventDefault();
    setDragging(false);
    const dropped = Array.from(event.dataTransfer.files ?? []).filter((file) =>
      matchesAccept(file, accept),
    );
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
        data-disabled={resolvedDisabled ? "" : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={assignRefs}
          type="file"
          id={resolvedId}
          accept={accept}
          multiple={multiple}
          disabled={resolvedDisabled}
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
                disabled={resolvedDisabled}
                aria-label={getRemoveLabel(file)}
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
