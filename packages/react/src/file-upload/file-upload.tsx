import { CloseIcon, UploadIcon } from "@ktjn/designed-icons";
import type {
  ChangeEvent,
  DragEvent,
  InputHTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import { useEffect, useRef, useState } from "react";
import { useI18nMessages } from "../designed-provider/i18n-provider.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
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
  onFilesRejected?: (files: File[]) => void;
  invalid?: boolean;
  prompt?: ReactNode;
  hint?: ReactNode;
  getRemoveLabel?: (file: File) => string;
  renderItem?: (file: File, index: number) => ReactNode;
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
  onFilesRejected,
  invalid,
  disabled,
  multiple,
  accept,
  prompt = "Choose files or drag and drop",
  hint,
  getRemoveLabel,
  renderItem,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: FileUploadProps) {
  const UploadZoneIcon = useIconOverride("upload", UploadIcon);
  const RemoveIcon = useIconOverride("close", CloseIcon);
  const messages = useI18nMessages();
  const dictGetRemoveLabel = messages.getRemoveLabel;
  const resolvedGetRemoveLabel =
    getRemoveLabel ??
    (dictGetRemoveLabel
      ? (file: File) => dictGetRemoveLabel(file.name)
      : (file: File) => `Remove ${file.name}`);
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
    const allDropped = Array.from(event.dataTransfer.files ?? []);
    const dropped = allDropped.filter((file) => matchesAccept(file, accept));
    const rejected = allDropped.filter((file) => !matchesAccept(file, accept));
    if (rejected.length > 0) {
      onFilesRejected?.(rejected);
    }
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
        <UploadZoneIcon aria-hidden className={styles.uploadIcon} />
        <p data-slot="file-upload-prompt" className={styles.prompt}>
          {prompt}
        </p>
        {hint ? (
          <p data-slot="file-upload-hint" className={styles.hint}>
            {hint}
          </p>
        ) : null}
      </div>
      {currentFiles.length > 0 ? (
        <ul data-slot="file-upload-list" className={styles.list}>
          {currentFiles.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              data-slot="file-upload-item"
              className={styles.item}
            >
              <span data-slot="file-upload-item-meta" className={styles.meta}>
                {renderItem ? (
                  renderItem(file, index)
                ) : (
                  <>
                    <span
                      data-slot="file-upload-item-name"
                      className={styles.fileName}
                    >
                      {file.name}
                    </span>
                    <span
                      data-slot="file-upload-item-size"
                      className={styles.fileSize}
                    >
                      {formatBytes(file.size)}
                    </span>
                  </>
                )}
              </span>
              <button
                type="button"
                data-slot="file-upload-item-remove"
                disabled={resolvedDisabled}
                aria-label={resolvedGetRemoveLabel(file)}
                onClick={() => removeFile(index)}
                className={styles.remove}
              >
                <RemoveIcon aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
