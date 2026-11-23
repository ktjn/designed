import { CloseIcon, SearchIcon } from "@ktjn/designed-icons";
import type { InputHTMLAttributes, KeyboardEvent, Ref } from "react";
import { useState } from "react";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import { InputGroup } from "../input-group/input-group.js";
import styles from "./search-input.module.css";

export interface SearchInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange"
  > {
  ref?: Ref<HTMLInputElement>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  clearLabel?: string;
  invalid?: boolean;
}

export function SearchInput({
  ref,
  value,
  defaultValue = "",
  onValueChange,
  onClear,
  clearLabel = "Clear search",
  invalid,
  onKeyDown,
  className,
  ...rest
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const SearchFieldIcon = useIconOverride("search", SearchIcon);
  const ClearIcon = useIconOverride("close", CloseIcon);

  function setValue(next: string) {
    if (value === undefined) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  }

  function clear() {
    setValue("");
    onClear?.();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" && currentValue) {
      event.preventDefault();
      clear();
    }
    onKeyDown?.(event);
  }

  return (
    <InputGroup invalid={invalid} className={className}>
      <InputGroup.Addon>
        <SearchFieldIcon aria-hidden />
      </InputGroup.Addon>
      <InputGroup.Input
        ref={ref}
        data-slot="search-input"
        type="search"
        invalid={invalid}
        value={currentValue}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      {currentValue ? (
        <InputGroup.Addon align="end">
          <button
            type="button"
            data-slot="search-input-clear"
            aria-label={clearLabel}
            onClick={clear}
            className={styles.clear}
          >
            <ClearIcon aria-hidden />
          </button>
        </InputGroup.Addon>
      ) : null}
    </InputGroup>
  );
}
