import { EyeIcon, EyeOffIcon } from "@ktjn/designed-icons";
import type { InputHTMLAttributes, Ref } from "react";
import { useState } from "react";
import { InputGroup } from "../input-group/input-group.js";
import styles from "./password-input.module.css";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  ref?: Ref<HTMLInputElement>;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  showLabel?: string;
  hideLabel?: string;
  invalid?: boolean;
}

export function PasswordInput({
  ref,
  visible,
  defaultVisible = false,
  onVisibleChange,
  showLabel = "Show password",
  hideLabel = "Hide password",
  invalid,
  className,
  ...rest
}: PasswordInputProps) {
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const currentVisible = visible ?? internalVisible;

  function toggleVisible() {
    const next = !currentVisible;
    if (visible === undefined) {
      setInternalVisible(next);
    }
    onVisibleChange?.(next);
  }

  return (
    <InputGroup invalid={invalid} className={className}>
      <InputGroup.Input
        ref={ref}
        data-slot="password-input"
        type={currentVisible ? "text" : "password"}
        invalid={invalid}
        {...rest}
      />
      <InputGroup.Addon align="end">
        <button
          type="button"
          data-slot="password-input-toggle"
          aria-label={currentVisible ? hideLabel : showLabel}
          aria-pressed={currentVisible}
          onClick={toggleVisible}
          className={styles.toggle}
        >
          {currentVisible ? (
            <EyeOffIcon aria-hidden />
          ) : (
            <EyeIcon aria-hidden />
          )}
        </button>
      </InputGroup.Addon>
    </InputGroup>
  );
}
