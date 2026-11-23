import { CloseIcon } from "@ktjn/designed-icons";
import {
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useI18nMessage } from "../designed-provider/i18n-provider.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./tag-input.module.css";

export type TagInputRejectReason = "duplicate" | "invalid" | "max";

export interface TagInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange"
  > {
  ref?: Ref<HTMLInputElement>;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (inputValue: string) => void;
  suggestions?: readonly string[];
  delimiters?: readonly string[];
  allowDuplicates?: boolean;
  maxTags?: number;
  validate?: (tag: string) => boolean;
  onReject?: (tag: string, reason: TagInputRejectReason) => void;
  invalid?: boolean;
  getRemoveLabel?: (tag: string) => string;
  wrapperClassName?: string;
}

const DEFAULT_DELIMITERS: readonly string[] = [","];

function defaultGetRemoveLabel(tag: string): string {
  return `Remove ${tag}`;
}

function attachRef<T>(ref: Ref<T> | undefined, node: T): () => void {
  if (!ref) return () => {};
  if (typeof ref === "function") {
    const cleanup = ref(node);
    return typeof cleanup === "function" ? cleanup : () => ref(null);
  }
  ref.current = node;
  return () => {
    ref.current = null;
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createDelimiterRegExp(delimiters: readonly string[]): RegExp | null {
  const nonEmpty = delimiters.filter((d) => d.length > 0);
  if (nonEmpty.length === 0) return null;
  const sorted = [...nonEmpty].sort((a, b) => b.length - a.length);
  return new RegExp(sorted.map(escapeRegExp).join("|"), "g");
}

export function TagInput({
  ref,
  value,
  defaultValue,
  onValueChange,
  inputValue,
  defaultInputValue = "",
  onInputValueChange,
  suggestions,
  delimiters = DEFAULT_DELIMITERS,
  allowDuplicates = false,
  maxTags,
  validate,
  onReject,
  invalid,
  disabled,
  readOnly,
  id,
  className,
  wrapperClassName,
  getRemoveLabel,
  onKeyDown,
  onPaste,
  onFocus,
  onBlur,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: TagInputProps) {
  const Icon = useIconOverride("close", CloseIcon);
  const resolvedGetRemoveLabel = useI18nMessage(
    "getRemoveLabel",
    getRemoveLabel,
    defaultGetRemoveLabel,
  );
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const isReadOnly = Boolean(readOnly);
  const isEditable = !resolvedDisabled && !isReadOnly;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = useId();

  const isTagsControlled = value !== undefined;
  const [internalTags, setInternalTags] = useState<string[]>(() =>
    defaultValue ? Array.from(defaultValue) : [],
  );
  const tags = isTagsControlled ? value : internalTags;

  const isInputControlled = inputValue !== undefined;
  const [internalInputValue, setInternalInputValue] =
    useState<string>(defaultInputValue);
  const currentInputValue = isInputControlled ? inputValue : internalInputValue;

  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const delimiterRegex = useMemo(
    () => createDelimiterRegExp(delimiters),
    [delimiters],
  );

  const commitTags = useCallback(
    (nextTags: string[]) => {
      if (!isTagsControlled) {
        setInternalTags(nextTags);
      }
      onValueChange?.(nextTags);
    },
    [isTagsControlled, onValueChange],
  );

  const commitInputValue = useCallback(
    (next: string) => {
      if (!isInputControlled) {
        setInternalInputValue(next);
      }
      onInputValueChange?.(next);
    },
    [isInputControlled, onInputValueChange],
  );

  const addCandidates = useCallback(
    (rawCandidates: readonly string[]): boolean => {
      if (!isEditable) return false;
      const nextTags = [...tags];
      let addedAny = false;

      for (const raw of rawCandidates) {
        const candidate = raw.trim();
        if (candidate === "") continue;

        if (!allowDuplicates && nextTags.includes(candidate)) {
          onReject?.(candidate, "duplicate");
          continue;
        }
        if (validate && !validate(candidate)) {
          onReject?.(candidate, "invalid");
          continue;
        }
        if (maxTags !== undefined && nextTags.length >= maxTags) {
          onReject?.(candidate, "max");
          continue;
        }

        nextTags.push(candidate);
        addedAny = true;
      }

      if (addedAny) {
        commitTags(nextTags);
      }
      return addedAny;
    },
    [
      allowDuplicates,
      commitTags,
      isEditable,
      maxTags,
      onReject,
      tags,
      validate,
    ],
  );

  const removeTagAt = useCallback(
    (index: number) => {
      if (!isEditable) return;
      const nextTags = tags.filter((_, i) => i !== index);
      commitTags(nextTags);
      inputRef.current?.focus();
    },
    [commitTags, isEditable, tags],
  );

  const hasSuggestions = suggestions !== undefined;

  const filteredSuggestions = useMemo(() => {
    if (!suggestions) return [];
    const query = currentInputValue.trim().toLowerCase();
    return suggestions.filter((item) => {
      if (!allowDuplicates && tags.includes(item)) return false;
      if (query === "") return true;
      return item.toLowerCase().includes(query);
    });
  }, [allowDuplicates, currentInputValue, suggestions, tags]);

  const showSuggestions =
    hasSuggestions &&
    isEditable &&
    isSuggestionsOpen &&
    filteredSuggestions.length > 0;

  const resolvedActiveIndex =
    showSuggestions &&
    activeSuggestionIndex >= 0 &&
    activeSuggestionIndex < filteredSuggestions.length
      ? activeSuggestionIndex
      : -1;

  const activeOptionId =
    resolvedActiveIndex >= 0
      ? `${listboxId}-option-${resolvedActiveIndex}`
      : undefined;

  const selectSuggestion = useCallback(
    (suggestion: string) => {
      if (addCandidates([suggestion])) {
        commitInputValue("");
        setActiveSuggestionIndex(-1);
      }
      inputRef.current?.focus();
    },
    [addCandidates, commitInputValue],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isEditable) return;
    const nextValue = event.target.value;

    if (delimiterRegex?.test(nextValue)) {
      delimiterRegex.lastIndex = 0;
      const parts = nextValue.split(delimiterRegex);
      const remainder = parts.pop() ?? "";
      addCandidates(parts);
      commitInputValue(remainder);
      setActiveSuggestionIndex(-1);
      return;
    }

    commitInputValue(nextValue);
    if (hasSuggestions) {
      setIsSuggestionsOpen(true);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (showSuggestions) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < 0 ? 0 : (prev + 1) % filteredSuggestions.length,
        );
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev <= 0 ? filteredSuggestions.length - 1 : prev - 1,
        );
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setIsSuggestionsOpen(false);
        setActiveSuggestionIndex(-1);
        return;
      }
    }

    if (!isEditable) return;

    if (event.key === "Enter") {
      if (showSuggestions && resolvedActiveIndex >= 0) {
        const chosen = filteredSuggestions[resolvedActiveIndex];
        if (chosen !== undefined) {
          event.preventDefault();
          selectSuggestion(chosen);
          return;
        }
      }

      if (currentInputValue.trim() !== "") {
        event.preventDefault();
        if (addCandidates([currentInputValue])) {
          commitInputValue("");
          setActiveSuggestionIndex(-1);
        }
      }
      return;
    }

    if (delimiters.includes(event.key)) {
      event.preventDefault();
      if (currentInputValue.trim() === "") {
        if (currentInputValue !== "") {
          commitInputValue("");
        }
        return;
      }
      if (addCandidates([currentInputValue])) {
        commitInputValue("");
        setActiveSuggestionIndex(-1);
      }
      return;
    }

    if (
      event.key === "Backspace" &&
      currentInputValue === "" &&
      tags.length > 0
    ) {
      event.preventDefault();
      commitTags(tags.slice(0, -1));
    }
  };

  const handleInputPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(event);
    if (event.defaultPrevented || !isEditable || !delimiterRegex) return;

    const pastedText = event.clipboardData.getData("text");
    delimiterRegex.lastIndex = 0;
    if (!delimiterRegex.test(pastedText)) return;

    event.preventDefault();
    delimiterRegex.lastIndex = 0;
    const input = event.currentTarget;
    const start = input.selectionStart ?? currentInputValue.length;
    const end = input.selectionEnd ?? currentInputValue.length;
    const combined =
      currentInputValue.slice(0, start) +
      pastedText +
      currentInputValue.slice(end);
    const parts = combined.split(delimiterRegex);
    addCandidates(parts);
    commitInputValue("");
    setActiveSuggestionIndex(-1);
  };

  const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
    onFocus?.(event);
    if (hasSuggestions && isEditable) {
      setIsSuggestionsOpen(true);
    }
  };

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
    const related = event.relatedTarget as Node | null;
    if (!containerRef.current?.contains(related)) {
      setIsSuggestionsOpen(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleWrapperClick = (event: MouseEvent<HTMLDivElement>) => {
    if (resolvedDisabled) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, [role='option'], input")) return;
    inputRef.current?.focus();
  };

  const mergedInputRef = useMemo(() => {
    return (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (!node) return;
      const clearExternal = attachRef(ref, node);
      return () => {
        clearExternal();
        inputRef.current = null;
      };
    };
  }, [ref]);

  const rootClasses = [
    styles.root,
    resolvedInvalid ? styles.invalid : "",
    wrapperClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const inputClasses = [styles.input, className].filter(Boolean).join(" ");

  const tagCounts = new Map<string, number>();

  return (
    <div ref={containerRef} className={styles.container}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Clicking the visual input wrapper forwards focus to the native input inside */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard users interact directly with the focusable input and tag remove buttons inside */}
      <div
        data-slot="tag-input"
        data-disabled={resolvedDisabled ? "" : undefined}
        data-invalid={resolvedInvalid ? "" : undefined}
        data-readonly={isReadOnly ? "" : undefined}
        className={rootClasses}
        onClick={handleWrapperClick}
      >
        {tags.map((tag, index) => {
          const occurrence = tagCounts.get(tag) ?? 0;
          tagCounts.set(tag, occurrence + 1);
          const tagKey = `${tag}-${occurrence}`;

          return (
            <span key={tagKey} data-slot="tag-input-tag" className={styles.tag}>
              <span data-slot="tag-input-tag-label">{tag}</span>
              {isEditable ? (
                <button
                  type="button"
                  data-slot="tag-input-tag-remove"
                  className={styles.tagRemove}
                  aria-label={resolvedGetRemoveLabel(tag)}
                  onClick={() => removeTagAt(index)}
                >
                  <Icon aria-hidden />
                </button>
              ) : null}
            </span>
          );
        })}
        {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: role is set dynamically to "combobox" when suggestions are enabled, which supports aria-expanded */}
        <input
          {...rest}
          ref={mergedInputRef}
          id={resolvedId}
          type="text"
          data-slot="tag-input-input"
          className={inputClasses}
          value={currentInputValue}
          disabled={resolvedDisabled}
          readOnly={readOnly}
          role={hasSuggestions ? "combobox" : undefined}
          aria-autocomplete={hasSuggestions ? "list" : undefined}
          aria-expanded={hasSuggestions ? showSuggestions : undefined}
          aria-controls={showSuggestions ? listboxId : undefined}
          aria-activedescendant={activeOptionId}
          aria-describedby={ariaDescribedBy ?? field?.describedBy}
          aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onPaste={handleInputPaste}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
      {showSuggestions ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Suggestions"
          data-slot="tag-input-listbox"
          className={styles.listbox}
        >
          {filteredSuggestions.map((suggestion, index) => {
            const isHighlighted = index === resolvedActiveIndex;
            return (
              // biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard navigation is handled on the combobox input via aria-activedescendant
              // biome-ignore lint/a11y/useFocusableInteractive: Options stay unfocusable by design; the combobox input owns focus and drives selection via aria-activedescendant
              <div
                key={suggestion}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isHighlighted}
                data-slot="tag-input-option"
                data-highlighted={isHighlighted ? "" : undefined}
                className={styles.option}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
