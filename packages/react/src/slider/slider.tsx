import { Slider as BaseSlider } from "@base-ui/react/slider";
import { type HTMLAttributes, type Ref, useCallback } from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./slider.module.css";

export type SliderValue = number | readonly number[];

export interface SliderProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange" | "children"
  > {
  ref?: Ref<HTMLDivElement>;
  value?: SliderValue;
  defaultValue?: SliderValue;
  onValueChange?: (value: SliderValue) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  name?: string;
}

export function Slider({
  ref,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: SliderProps) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const resolvedInvalid = ariaInvalid ?? (field?.invalid || undefined);
  const setThumbInvalid = useCallback(
    (input: HTMLInputElement | null) => {
      if (!input) return;
      if (resolvedInvalid === undefined) {
        input.removeAttribute("aria-invalid");
      } else {
        input.setAttribute("aria-invalid", String(resolvedInvalid));
      }
    },
    [resolvedInvalid],
  );
  const initialValues = value ?? defaultValue;
  const thumbCount = Array.isArray(initialValues) ? initialValues.length : 1;
  const thumbIndices = Array.from({ length: thumbCount }, (_, i) => i);
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <BaseSlider.Root
      ref={ref}
      data-slot="slider"
      id={resolvedId}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (next) => onValueChange(next) : undefined}
      min={min}
      max={max}
      step={step}
      disabled={resolvedDisabled}
      name={name}
      aria-labelledby={ariaLabelledBy}
      aria-invalid={resolvedInvalid}
      className={classes}
      {...rest}
    >
      <BaseSlider.Control className={styles.control}>
        <BaseSlider.Track data-slot="slider-track" className={styles.track}>
          <BaseSlider.Indicator className={styles.indicator} />
          {thumbIndices.map((thumbIndex) => (
            <BaseSlider.Thumb
              key={`thumb-${thumbIndex}`}
              data-slot="slider-thumb"
              index={thumbIndex}
              inputRef={setThumbInvalid}
              aria-label={
                ariaLabel
                  ? thumbCount > 1
                    ? `${ariaLabel} ${thumbIndex + 1}`
                    : ariaLabel
                  : undefined
              }
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy ?? field?.describedBy}
              className={styles.thumb}
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
