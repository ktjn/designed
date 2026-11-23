import { AlertTriangleIcon, type IconProps } from "@ktjn/designed-icons";
import { Component, type ComponentType, type ReactNode } from "react";
import { Button } from "../button/button.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import styles from "./error-boundary.module.css";

export interface ErrorBoundaryClassNames {
  icon?: string;
  title?: string;
  description?: string;
  action?: string;
}

export type ErrorBoundaryFallback =
  | ReactNode
  | ((props: { error: Error; reset: () => void }) => ReactNode);

export interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ErrorBoundaryFallback;
  onError?: (error: Error, info: { componentStack?: string | null }) => void;
  resetKeys?: readonly unknown[];
  classNames?: ErrorBoundaryClassNames;
}

interface ErrorBoundaryRootProps extends ErrorBoundaryProps {
  fallbackIcon: ComponentType<IconProps>;
}

interface ErrorBoundaryState {
  error: Error | null;
}

function resetKeysChanged(
  previous: readonly unknown[] | undefined,
  next: readonly unknown[] | undefined,
): boolean {
  if (previous === next) return false;
  if (!previous || !next) return previous !== next;
  if (previous.length !== next.length) return true;
  return previous.some((value, index) => value !== next[index]);
}

class ErrorBoundaryRoot extends Component<
  ErrorBoundaryRootProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prevProps: ErrorBoundaryRootProps) {
    if (
      this.state.error &&
      resetKeysChanged(prevProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const {
      children,
      fallback,
      classNames,
      fallbackIcon: FallbackIcon,
    } = this.props;

    if (!error) {
      return children;
    }

    if (fallback !== undefined) {
      return typeof fallback === "function"
        ? fallback({ error, reset: this.reset })
        : fallback;
    }

    const iconClasses = [styles.icon, classNames?.icon]
      .filter(Boolean)
      .join(" ");
    const titleClasses = [styles.title, classNames?.title]
      .filter(Boolean)
      .join(" ");
    const descriptionClasses = [styles.description, classNames?.description]
      .filter(Boolean)
      .join(" ");
    const actionClasses = [styles.action, classNames?.action]
      .filter(Boolean)
      .join(" ");

    return (
      <div data-slot="error-boundary-fallback" className={styles.root}>
        <div data-slot="error-boundary-fallback-icon" className={iconClasses}>
          <FallbackIcon aria-hidden="true" />
        </div>
        <h2 data-slot="error-boundary-fallback-title" className={titleClasses}>
          Something went wrong
        </h2>
        <p
          data-slot="error-boundary-fallback-description"
          className={descriptionClasses}
        >
          {error.message}
        </p>
        <div
          data-slot="error-boundary-fallback-action"
          className={actionClasses}
        >
          <Button type="button" onClick={this.reset}>
            Try again
          </Button>
        </div>
      </div>
    );
  }
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  const FallbackIcon = useIconOverride("alertTriangle", AlertTriangleIcon);
  return <ErrorBoundaryRoot {...props} fallbackIcon={FallbackIcon} />;
}
