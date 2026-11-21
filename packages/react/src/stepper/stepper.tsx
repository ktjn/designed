import { CheckIcon } from "@ktjn/design-icons";
import type { OlHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./stepper.module.css";

export type StepperOrientation = "horizontal" | "vertical";

export interface StepperStep {
  id: string;
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps extends OlHTMLAttributes<HTMLOListElement> {
  ref?: Ref<HTMLOListElement>;
  steps: readonly StepperStep[];
  currentStep: number;
  orientation?: StepperOrientation;
}

export function Stepper({
  ref,
  steps,
  currentStep,
  orientation = "horizontal",
  className,
  ...rest
}: StepperProps) {
  const classes = [
    styles.root,
    orientation === "vertical" ? styles.vertical : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ol ref={ref} data-slot="stepper" className={classes} {...rest}>
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
            data-slot="stepper-step"
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
