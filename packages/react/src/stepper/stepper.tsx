import { CheckIcon } from "@ktjn/design-icons";
import type { ForwardedRef, OlHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./stepper.module.css";

export type StepperOrientation = "horizontal" | "vertical";

export interface StepperStep {
  id: string;
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps extends OlHTMLAttributes<HTMLOListElement> {
  steps: readonly StepperStep[];
  currentStep: number;
  orientation?: StepperOrientation;
}

function StepperImpl(
  {
    steps,
    currentStep,
    orientation = "horizontal",
    className,
    ...rest
  }: StepperProps,
  ref: ForwardedRef<HTMLOListElement>,
) {
  const classes = [
    styles.root,
    orientation === "vertical" ? styles.vertical : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ol ref={ref} className={classes} {...rest}>
      {steps.map((step, index) => {
        const status =
          index < currentStep
            ? "complete"
            : index === currentStep
              ? "current"
              : "upcoming";
        return (
          <li
            key={step.id}
            className={styles.step}
            data-status={status}
            aria-current={status === "current" ? "step" : undefined}
          >
            <span className={styles.indicator} aria-hidden="true">
              {status === "complete" ? <CheckIcon aria-hidden /> : index + 1}
            </span>
            <div className={styles.content}>
              <span className={styles.label}>{step.label}</span>
              {step.description ? (
                <span className={styles.description}>{step.description}</span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export const Stepper = forwardRef(StepperImpl);
Stepper.displayName = "Stepper";
