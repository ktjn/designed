import { Slider as BaseSlider } from "@base-ui/react/slider";
import type { ForwardedRef, HTMLAttributes } from "react";
import { forwardRef } from "react";
import { useFieldContext } from "../field/field-context.js";
import styles from "./slider.module.css";

export type SliderValue = number | readonly number[];

export interface SliderProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange" | "children"
  > {
  value?: SliderValue;
  defaultValue?: SliderValue;
  onValueChange?: (value: SliderValue) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  name?: string;
}

function SliderImpl(
  {
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
    ...rest
  }: SliderProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const field = useFieldContext();
  const initialValues = value ?? defaultValue;
  const thumbCount = Array.isArray(initialValues) ? initialValues.length : 1;
  const thumbIndices = Array.from({ length: thumbCount }, (_, i) => i);
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <BaseSlider.Root
      ref={ref}
      id={id ?? field?.controlId}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (next) => onValueChange(next) : undefined}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      name={name}
      aria-labelledby={ariaLabelledBy}
      className={classes}
      {...rest}
    >
      <BaseSlider.Control className={styles.control}>
        <BaseSlider.Track className={styles.track}>
          <BaseSlider.Indicator className={styles.indicator} />
          {thumbIndices.map((thumbIndex) => (
            <BaseSlider.Thumb
              key={`thumb-${thumbIndex}`}
              index={thumbIndex}
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

export const Slider = forwardRef(SliderImpl);
Slider.displayName = "Slider";
