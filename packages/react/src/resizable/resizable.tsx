import { GripVerticalIcon } from "@ktjn/designed-icons";
import {
  Children,
  createContext,
  Fragment,
  type HTMLAttributes,
  isValidElement,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./resizable.module.css";

export type ResizableOrientation = "horizontal" | "vertical";

export interface ResizableRootProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  orientation?: ResizableOrientation;
  onLayout?: (sizes: number[]) => void;
  children?: ReactNode;
}

export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  onCollapse?: (collapsed: boolean) => void;
  children?: ReactNode;
}

export interface ResizableHandleProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  disabled?: boolean;
  withHandle?: boolean;
  step?: number;
  children?: ReactNode;
}

interface PanelConfig {
  defaultSize: number | undefined;
  minSize: number;
  maxSize: number;
  collapsible: boolean;
  collapsedSize: number;
  onCollapse: ((collapsed: boolean) => void) | undefined;
}

interface HandlePair {
  prevIndex: number;
  nextIndex: number;
}

interface FlattenedChild {
  key: string;
  node: ReactNode;
}

interface DragState {
  pointerId: number;
  startPos: number;
  startSizes: number[];
  isRtl: boolean;
}

interface ResizableContextValue {
  orientation: ResizableOrientation;
  sizes: number[];
  panelConfigs: PanelConfig[];
  containerRef: RefObject<HTMLDivElement | null>;
  getLatestSizes: () => number[];
  resizePairFromDrag: (
    prevIndex: number,
    nextIndex: number,
    startSizes: number[],
    deltaPercent: number,
  ) => void;
  stepPair: (prevIndex: number, nextIndex: number, delta: number) => void;
  resizePairToMin: (prevIndex: number, nextIndex: number) => void;
  resizePairToMax: (prevIndex: number, nextIndex: number) => void;
  toggleCollapsePair: (prevIndex: number, nextIndex: number) => boolean;
}

const EPSILON = 0.001;

const ResizableContext = createContext<ResizableContextValue | null>(null);
const PanelIndexContext = createContext<number | null>(null);
const HandlePairContext = createContext<HandlePair | null>(null);

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function clampValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundPercent(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function isPanelCollapsed(config: PanelConfig, size: number): boolean {
  return config.collapsible && size <= config.collapsedSize + EPSILON;
}

function canCollapse(
  targetCfg: PanelConfig,
  siblingCfg: PanelConfig,
  pairTotal: number,
): boolean {
  return (
    targetCfg.collapsible &&
    targetCfg.collapsedSize <= targetCfg.maxSize + EPSILON &&
    targetCfg.collapsedSize <= pairTotal + EPSILON &&
    pairTotal - targetCfg.collapsedSize <= siblingCfg.maxSize + EPSILON
  );
}

function computeAriaBounds(
  prevCfg: PanelConfig | undefined,
  nextCfg: PanelConfig | undefined,
  prevSize: number,
  nextSize: number,
): { min: number; max: number } {
  if (!prevCfg || !nextCfg) {
    return { min: 0, max: 100 };
  }

  const pairTotal = prevSize + nextSize;
  const normalLow = Math.max(prevCfg.minSize, pairTotal - nextCfg.maxSize);
  const normalHigh = Math.min(prevCfg.maxSize, pairTotal - nextCfg.minSize);
  const prevCanCollapse = canCollapse(prevCfg, nextCfg, pairTotal);
  const nextCanCollapse = canCollapse(nextCfg, prevCfg, pairTotal);

  let rawMin: number;
  let rawMax: number;
  if (normalLow <= normalHigh + EPSILON) {
    rawMin = prevCanCollapse ? prevCfg.collapsedSize : normalLow;
    rawMax = nextCanCollapse ? pairTotal - nextCfg.collapsedSize : normalHigh;
  } else {
    const candidates = [prevSize];
    if (prevCanCollapse) candidates.push(prevCfg.collapsedSize);
    if (nextCanCollapse) candidates.push(pairTotal - nextCfg.collapsedSize);
    rawMin = Math.min(...candidates);
    rawMax = Math.max(...candidates);
  }

  const currentRounded = Math.round(prevSize);
  const min = Math.max(0, Math.min(Math.round(rawMin), currentRounded));
  const max = Math.min(100, Math.max(Math.round(rawMax), currentRounded, min));
  return { min, max };
}

function isContainerRtl(container: HTMLElement | null): boolean {
  if (!container) return false;
  const direction = getComputedStyle(container).direction;
  if (direction === "rtl") return true;
  if (direction === "ltr") return false;
  return container.closest("[dir]")?.getAttribute("dir") === "rtl";
}

function computeInitialSizes(configs: PanelConfig[]): number[] {
  const count = configs.length;
  if (count === 0) return [];

  let specifiedSum = 0;
  let unsizedCount = 0;
  for (const config of configs) {
    if (
      config.defaultSize !== undefined &&
      Number.isFinite(config.defaultSize)
    ) {
      specifiedSum += clampPercent(config.defaultSize);
    } else {
      unsizedCount += 1;
    }
  }

  const hasRemaining = specifiedSum < 100 - EPSILON;
  const remaining = hasRemaining ? 100 - specifiedSum : 0;
  const raw = configs.map((config) => {
    if (
      config.defaultSize !== undefined &&
      Number.isFinite(config.defaultSize)
    ) {
      return clampPercent(config.defaultSize);
    }
    if (hasRemaining && unsizedCount > 0) {
      return remaining / unsizedCount;
    }
    return config.minSize > 0 ? config.minSize : 100 / count;
  });

  const total = raw.reduce((sum, value) => sum + value, 0);
  if (total <= EPSILON) {
    const even = roundPercent(100 / count);
    return raw.map((_, index) =>
      index === count - 1 ? roundPercent(100 - even * (count - 1)) : even,
    );
  }

  if (Math.abs(total - 100) <= EPSILON) {
    return raw.map(roundPercent);
  }

  const normalized = raw.map((value) => roundPercent((value / total) * 100));
  const normalizedSum = normalized.reduce((sum, value) => sum + value, 0);
  const lastIndex = count - 1;
  normalized[lastIndex] = roundPercent(
    (normalized[lastIndex] ?? 0) + (100 - normalizedSum),
  );
  return normalized;
}

function flattenChildren(children: ReactNode, prefix = ""): FlattenedChild[] {
  const result: FlattenedChild[] = [];
  const items = Children.toArray(children);
  for (let index = 0; index < items.length; index += 1) {
    const child = items[index];
    const segment =
      isValidElement(child) && child.key !== null
        ? String(child.key)
        : String(index);
    const key = prefix ? `${prefix}/${segment}` : segment;
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === Fragment
    ) {
      result.push(...flattenChildren(child.props.children, key));
    } else {
      result.push({ key, node: child });
    }
  }
  return result;
}

function resolveDragPair(
  prevCfg: PanelConfig,
  nextCfg: PanelConfig,
  currentPrev: number,
  currentNext: number,
  targetPrev: number,
): [number, number] {
  const pairTotal = currentPrev + currentNext;
  const normalLow = Math.max(prevCfg.minSize, pairTotal - nextCfg.maxSize);
  const normalHigh = Math.min(prevCfg.maxSize, pairTotal - nextCfg.minSize);

  if (canCollapse(prevCfg, nextCfg, pairTotal)) {
    const threshold = (prevCfg.minSize + prevCfg.collapsedSize) / 2;
    if (targetPrev < threshold) {
      return [
        roundPercent(prevCfg.collapsedSize),
        roundPercent(pairTotal - prevCfg.collapsedSize),
      ];
    }
  }

  if (canCollapse(nextCfg, prevCfg, pairTotal)) {
    const targetNext = pairTotal - targetPrev;
    const threshold = (nextCfg.minSize + nextCfg.collapsedSize) / 2;
    if (targetNext < threshold) {
      return [
        roundPercent(pairTotal - nextCfg.collapsedSize),
        roundPercent(nextCfg.collapsedSize),
      ];
    }
  }

  if (normalLow > normalHigh + EPSILON) {
    return [currentPrev, currentNext];
  }

  const clampedPrev = roundPercent(
    clampValue(targetPrev, normalLow, normalHigh),
  );
  return [clampedPrev, roundPercent(pairTotal - clampedPrev)];
}

function resolveStepPair(
  prevCfg: PanelConfig,
  nextCfg: PanelConfig,
  currentPrev: number,
  currentNext: number,
  delta: number,
): [number, number] {
  const pairTotal = currentPrev + currentNext;
  const normalLow = Math.max(prevCfg.minSize, pairTotal - nextCfg.maxSize);
  const normalHigh = Math.min(prevCfg.maxSize, pairTotal - nextCfg.minSize);
  const hasNormalRange = normalLow <= normalHigh + EPSILON;
  const prevCollapsed = isPanelCollapsed(prevCfg, currentPrev);
  const nextCollapsed = isPanelCollapsed(nextCfg, currentNext);

  if (delta > 0) {
    if (prevCollapsed) {
      if (!hasNormalRange) {
        return [currentPrev, currentNext];
      }
      const expandedPrev = roundPercent(
        clampValue(
          Math.max(prevCfg.minSize, currentPrev + delta),
          normalLow,
          normalHigh,
        ),
      );
      return [expandedPrev, roundPercent(pairTotal - expandedPrev)];
    }

    if (canCollapse(nextCfg, prevCfg, pairTotal)) {
      const targetNext = currentNext - delta;
      const threshold = (nextCfg.minSize + nextCfg.collapsedSize) / 2;
      if (currentNext <= nextCfg.minSize + EPSILON || targetNext < threshold) {
        return [
          roundPercent(pairTotal - nextCfg.collapsedSize),
          roundPercent(nextCfg.collapsedSize),
        ];
      }
    }

    if (!hasNormalRange) {
      return [currentPrev, currentNext];
    }

    const nextPrev = roundPercent(
      clampValue(currentPrev + delta, normalLow, normalHigh),
    );
    return [nextPrev, roundPercent(pairTotal - nextPrev)];
  }

  if (nextCollapsed) {
    if (!hasNormalRange) {
      return [currentPrev, currentNext];
    }
    const expandedNext = Math.max(nextCfg.minSize, currentNext - delta);
    const nextPrev = roundPercent(
      clampValue(pairTotal - expandedNext, normalLow, normalHigh),
    );
    return [nextPrev, roundPercent(pairTotal - nextPrev)];
  }

  if (canCollapse(prevCfg, nextCfg, pairTotal)) {
    const targetPrev = currentPrev + delta;
    const threshold = (prevCfg.minSize + prevCfg.collapsedSize) / 2;
    if (currentPrev <= prevCfg.minSize + EPSILON || targetPrev < threshold) {
      return [
        roundPercent(prevCfg.collapsedSize),
        roundPercent(pairTotal - prevCfg.collapsedSize),
      ];
    }
  }

  if (!hasNormalRange) {
    return [currentPrev, currentNext];
  }

  const nextPrev = roundPercent(
    clampValue(currentPrev + delta, normalLow, normalHigh),
  );
  return [nextPrev, roundPercent(pairTotal - nextPrev)];
}

function ResizablePanel({
  ref,
  defaultSize: _defaultSize,
  minSize: _minSize,
  maxSize: _maxSize,
  collapsible: _collapsible,
  collapsedSize: _collapsedSize,
  onCollapse: _onCollapse,
  className,
  style,
  children,
  ...rest
}: ResizablePanelProps) {
  const ctx = useContext(ResizableContext);
  const panelIndex = useContext(PanelIndexContext);

  if (!ctx || panelIndex === null) {
    throw new Error("Resizable.Panel must be used as a child of Resizable");
  }

  const size = ctx.sizes[panelIndex] ?? 0;
  const config = ctx.panelConfigs[panelIndex];
  const collapsed = config ? isPanelCollapsed(config, size) : false;
  const classes = [styles.panel, className].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      data-slot="resizable-panel"
      data-collapsed={collapsed ? "" : undefined}
      className={classes}
      style={{ ...style, flexBasis: `${size}%` }}
      {...rest}
    >
      {children}
    </div>
  );
}

function ResizableHandle({
  ref,
  disabled = false,
  withHandle = false,
  step = 5,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  children,
  ...rest
}: ResizableHandleProps) {
  const ctx = useContext(ResizableContext);
  const pair = useContext(HandlePairContext);
  const [dragging, setDragging] = useState(false);
  const dragStateRef = useRef<DragState | null>(null);

  useEffect(() => {
    if (disabled) {
      dragStateRef.current = null;
      setDragging(false);
    }
  }, [disabled]);

  if (!ctx || !pair) {
    throw new Error(
      "Resizable.Handle must be used between Resizable.Panel elements",
    );
  }

  const { prevIndex, nextIndex } = pair;
  const prevCfg = ctx.panelConfigs[prevIndex];
  const nextCfg = ctx.panelConfigs[nextIndex];
  const prevSize = ctx.sizes[prevIndex] ?? 0;
  const nextSize = ctx.sizes[nextIndex] ?? 0;
  const { min: ariaMin, max: ariaMax } = computeAriaBounds(
    prevCfg,
    nextCfg,
    prevSize,
    nextSize,
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;

    const deltaMagnitude = step * (event.shiftKey ? 2 : 1);
    const isHorizontal = ctx.orientation === "horizontal";

    if (
      isHorizontal &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight")
    ) {
      event.preventDefault();
      const rtl = isContainerRtl(ctx.containerRef.current);
      const rawDirection = event.key === "ArrowRight" ? 1 : -1;
      const direction = rtl ? -rawDirection : rawDirection;
      ctx.stepPair(prevIndex, nextIndex, direction * deltaMagnitude);
      return;
    }

    if (
      !isHorizontal &&
      (event.key === "ArrowUp" || event.key === "ArrowDown")
    ) {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      ctx.stepPair(prevIndex, nextIndex, direction * deltaMagnitude);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      ctx.resizePairToMin(prevIndex, nextIndex);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      ctx.resizePairToMax(prevIndex, nextIndex);
      return;
    }

    if (event.key === "Enter") {
      if (ctx.toggleCollapsePair(prevIndex, nextIndex)) {
        event.preventDefault();
      }
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (event.defaultPrevented || disabled) return;
    if (event.button !== undefined && event.button !== 0) return;

    event.preventDefault();

    if (typeof event.currentTarget.setPointerCapture === "function") {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        undefined;
      }
    }

    const isHorizontal = ctx.orientation === "horizontal";
    dragStateRef.current = {
      pointerId: event.pointerId,
      startPos: isHorizontal ? event.clientX : event.clientY,
      startSizes: [...ctx.getLatestSizes()],
      isRtl: isHorizontal && isContainerRtl(ctx.containerRef.current),
    };
    setDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== event.pointerId || disabled) return;

    const container = ctx.containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const isHorizontal = ctx.orientation === "horizontal";
    const containerSize = isHorizontal ? rect.width : rect.height;
    if (containerSize <= 0) return;

    const currentPos = isHorizontal ? event.clientX : event.clientY;
    const rawDeltaPx = currentPos - drag.startPos;
    const signedDeltaPx = drag.isRtl ? -rawDeltaPx : rawDeltaPx;
    const deltaPercent = (signedDeltaPx / containerSize) * 100;

    ctx.resizePairFromDrag(prevIndex, nextIndex, drag.startSizes, deltaPercent);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag) return;
    if (event.pointerId !== undefined && drag.pointerId !== event.pointerId) {
      return;
    }

    if (
      typeof event.currentTarget.releasePointerCapture === "function" &&
      typeof event.currentTarget.hasPointerCapture === "function" &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = null;
    setDragging(false);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);
    endDrag(event);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    onPointerCancel?.(event);
    endDrag(event);
  };

  const handleLostPointerCapture = (event: PointerEvent<HTMLDivElement>) => {
    onLostPointerCapture?.(event);
    endDrag(event);
  };

  const classes = [styles.handle, className].filter(Boolean).join(" ");

  return (
    // biome-ignore lint/a11y/useSemanticElements: interactive window splitter requires focusable container with optional grip children, which void <hr> cannot hold
    <div
      ref={ref}
      role="separator"
      data-slot="resizable-handle"
      data-orientation={ctx.orientation}
      data-dragging={dragging && !disabled ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      tabIndex={disabled ? undefined : 0}
      aria-orientation={
        ctx.orientation === "horizontal" ? "vertical" : "horizontal"
      }
      aria-valuenow={Math.round(prevSize)}
      aria-valuemin={ariaMin}
      aria-valuemax={ariaMax}
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : "Resize panel")}
      aria-labelledby={ariaLabelledBy}
      aria-disabled={disabled || undefined}
      className={classes}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
      {...rest}
    >
      {children ??
        (withHandle ? (
          <span className={styles.grip} aria-hidden="true">
            <GripVerticalIcon aria-hidden="true" />
          </span>
        ) : null)}
    </div>
  );
}

function ResizableRoot({
  ref,
  orientation = "horizontal",
  onLayout,
  className,
  children,
  ...rest
}: ResizableRootProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const preCollapseSizesRef = useRef<Map<number, number>>(new Map());

  const flatChildren = flattenChildren(children);
  const panelConfigs: PanelConfig[] = [];
  const entries: Array<
    | {
        kind: "panel";
        key: string;
        panelIndex: number;
        node: ReactElement;
      }
    | {
        kind: "handle";
        key: string;
        prevIndex: number;
        node: ReactElement;
      }
    | { kind: "other"; node: ReactNode }
  > = [];

  for (const item of flatChildren) {
    const child = item.node;
    if (
      isValidElement<ResizablePanelProps>(child) &&
      child.type === ResizablePanel
    ) {
      const minSize = clampPercent(child.props.minSize ?? 10);
      const maxSize = Math.max(
        minSize,
        clampPercent(child.props.maxSize ?? 100),
      );
      const collapsedSize = Math.min(
        minSize,
        clampPercent(child.props.collapsedSize ?? 0),
      );
      const panelIndex = panelConfigs.length;
      panelConfigs.push({
        defaultSize: child.props.defaultSize,
        minSize,
        maxSize,
        collapsible: child.props.collapsible ?? false,
        collapsedSize,
        onCollapse: child.props.onCollapse,
      });
      entries.push({
        kind: "panel",
        key: item.key,
        panelIndex,
        node: child,
      });
    } else if (
      isValidElement<ResizableHandleProps>(child) &&
      child.type === ResizableHandle
    ) {
      entries.push({
        kind: "handle",
        key: item.key,
        prevIndex: panelConfigs.length - 1,
        node: child,
      });
    } else {
      entries.push({ kind: "other", node: child });
    }
  }

  const [sizesState, setSizesState] = useState<number[]>(() =>
    computeInitialSizes(panelConfigs),
  );
  const sizes =
    sizesState.length === panelConfigs.length
      ? sizesState
      : computeInitialSizes(panelConfigs);

  const sizesRef = useRef<number[]>(sizes);
  if (sizesRef.current.length !== panelConfigs.length) {
    sizesRef.current = sizes;
  }

  const assignContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") {
        const cleanup = ref(node);
        if (typeof cleanup === "function") {
          return () => {
            containerRef.current = null;
            cleanup();
          };
        }
        return undefined;
      }
      if (ref) {
        ref.current = node;
      }
      return undefined;
    },
    [ref],
  );

  const commitPairSizes = (
    current: number[],
    prevIndex: number,
    nextIndex: number,
    nextPrev: number,
    nextNext: number,
    preCollapseSource?: number[],
  ) => {
    const prevBefore = current[prevIndex] ?? 0;
    const nextBefore = current[nextIndex] ?? 0;
    if (
      Math.abs(nextPrev - prevBefore) < EPSILON &&
      Math.abs(nextNext - nextBefore) < EPSILON
    ) {
      return;
    }

    const nextSizes = [...current];
    nextSizes[prevIndex] = nextPrev;
    nextSizes[nextIndex] = nextNext;

    const prevCfg = panelConfigs[prevIndex];
    const nextCfg = panelConfigs[nextIndex];
    const source = preCollapseSource ?? current;

    if (prevCfg?.collapsible) {
      const wasCollapsed = isPanelCollapsed(prevCfg, prevBefore);
      const nowCollapsed = isPanelCollapsed(prevCfg, nextPrev);
      if (!wasCollapsed && nowCollapsed) {
        const saved = source[prevIndex] ?? prevBefore;
        if (!isPanelCollapsed(prevCfg, saved)) {
          preCollapseSizesRef.current.set(prevIndex, saved);
        }
      }
      if (wasCollapsed !== nowCollapsed) {
        prevCfg.onCollapse?.(nowCollapsed);
      }
    }

    if (nextCfg?.collapsible) {
      const wasCollapsed = isPanelCollapsed(nextCfg, nextBefore);
      const nowCollapsed = isPanelCollapsed(nextCfg, nextNext);
      if (!wasCollapsed && nowCollapsed) {
        const saved = source[nextIndex] ?? nextBefore;
        if (!isPanelCollapsed(nextCfg, saved)) {
          preCollapseSizesRef.current.set(nextIndex, saved);
        }
      }
      if (wasCollapsed !== nowCollapsed) {
        nextCfg.onCollapse?.(nowCollapsed);
      }
    }

    sizesRef.current = nextSizes;
    setSizesState(nextSizes);
    onLayout?.(nextSizes);
  };

  const getLatestSizes = () => sizesRef.current;

  const resizePairFromDrag = (
    prevIndex: number,
    nextIndex: number,
    startSizes: number[],
    deltaPercent: number,
  ) => {
    const prevCfg = panelConfigs[prevIndex];
    const nextCfg = panelConfigs[nextIndex];
    if (!prevCfg || !nextCfg) return;

    const current = sizesRef.current;
    const startPrev = startSizes[prevIndex] ?? 0;
    const currentPrev = current[prevIndex] ?? 0;
    const currentNext = current[nextIndex] ?? 0;
    const [nextPrev, nextNext] = resolveDragPair(
      prevCfg,
      nextCfg,
      currentPrev,
      currentNext,
      startPrev + deltaPercent,
    );

    commitPairSizes(
      current,
      prevIndex,
      nextIndex,
      nextPrev,
      nextNext,
      startSizes,
    );
  };

  const stepPair = (prevIndex: number, nextIndex: number, delta: number) => {
    const prevCfg = panelConfigs[prevIndex];
    const nextCfg = panelConfigs[nextIndex];
    if (!prevCfg || !nextCfg) return;

    const current = sizesRef.current;
    const currentPrev = current[prevIndex] ?? 0;
    const currentNext = current[nextIndex] ?? 0;
    const [nextPrev, nextNext] = resolveStepPair(
      prevCfg,
      nextCfg,
      currentPrev,
      currentNext,
      delta,
    );

    commitPairSizes(current, prevIndex, nextIndex, nextPrev, nextNext);
  };

  const resizePairToMin = (prevIndex: number, nextIndex: number) => {
    const prevCfg = panelConfigs[prevIndex];
    const nextCfg = panelConfigs[nextIndex];
    if (!prevCfg || !nextCfg) return;

    const current = sizesRef.current;
    const currentPrev = current[prevIndex] ?? 0;
    const currentNext = current[nextIndex] ?? 0;
    const pairTotal = currentPrev + currentNext;

    if (canCollapse(prevCfg, nextCfg, pairTotal)) {
      const minPrev = roundPercent(prevCfg.collapsedSize);
      commitPairSizes(
        current,
        prevIndex,
        nextIndex,
        minPrev,
        roundPercent(pairTotal - minPrev),
      );
      return;
    }

    if (isPanelCollapsed(prevCfg, currentPrev)) {
      return;
    }

    const normalLow = Math.max(prevCfg.minSize, pairTotal - nextCfg.maxSize);
    const normalHigh = Math.min(prevCfg.maxSize, pairTotal - nextCfg.minSize);
    if (normalLow > normalHigh + EPSILON) {
      return;
    }

    const minPrev = roundPercent(normalLow);
    commitPairSizes(
      current,
      prevIndex,
      nextIndex,
      minPrev,
      roundPercent(pairTotal - minPrev),
    );
  };

  const resizePairToMax = (prevIndex: number, nextIndex: number) => {
    const prevCfg = panelConfigs[prevIndex];
    const nextCfg = panelConfigs[nextIndex];
    if (!prevCfg || !nextCfg) return;

    const current = sizesRef.current;
    const currentPrev = current[prevIndex] ?? 0;
    const currentNext = current[nextIndex] ?? 0;
    const pairTotal = currentPrev + currentNext;

    if (canCollapse(nextCfg, prevCfg, pairTotal)) {
      const nextCollapsed = roundPercent(nextCfg.collapsedSize);
      commitPairSizes(
        current,
        prevIndex,
        nextIndex,
        roundPercent(pairTotal - nextCollapsed),
        nextCollapsed,
      );
      return;
    }

    if (isPanelCollapsed(nextCfg, currentNext)) {
      return;
    }

    const normalLow = Math.max(prevCfg.minSize, pairTotal - nextCfg.maxSize);
    const normalHigh = Math.min(prevCfg.maxSize, pairTotal - nextCfg.minSize);
    if (normalLow > normalHigh + EPSILON) {
      return;
    }

    const maxPrev = roundPercent(normalHigh);
    commitPairSizes(
      current,
      prevIndex,
      nextIndex,
      maxPrev,
      roundPercent(pairTotal - maxPrev),
    );
  };

  const toggleCollapsePair = (
    prevIndex: number,
    nextIndex: number,
  ): boolean => {
    const prevCfg = panelConfigs[prevIndex];
    const nextCfg = panelConfigs[nextIndex];
    if (!prevCfg || !nextCfg) return false;

    const current = sizesRef.current;
    const currentPrev = current[prevIndex] ?? 0;
    const currentNext = current[nextIndex] ?? 0;
    const pairTotal = currentPrev + currentNext;
    const prevCollapsed = isPanelCollapsed(prevCfg, currentPrev);
    const nextCollapsed = isPanelCollapsed(nextCfg, currentNext);

    let targetIsPrev: boolean | null = null;
    if (prevCollapsed) {
      targetIsPrev = true;
    } else if (nextCollapsed) {
      targetIsPrev = false;
    } else if (canCollapse(prevCfg, nextCfg, pairTotal)) {
      targetIsPrev = true;
    } else if (canCollapse(nextCfg, prevCfg, pairTotal)) {
      targetIsPrev = false;
    }

    if (targetIsPrev === null) return false;

    const targetIndex = targetIsPrev ? prevIndex : nextIndex;
    const targetCfg = targetIsPrev ? prevCfg : nextCfg;
    const siblingCfg = targetIsPrev ? nextCfg : prevCfg;
    const currentTarget = targetIsPrev ? currentPrev : currentNext;

    let nextTarget: number;
    if (isPanelCollapsed(targetCfg, currentTarget)) {
      const normalLow = Math.max(
        targetCfg.minSize,
        pairTotal - siblingCfg.maxSize,
      );
      const normalHigh = Math.min(
        targetCfg.maxSize,
        pairTotal - siblingCfg.minSize,
      );
      if (normalLow > normalHigh + EPSILON) {
        return false;
      }
      const saved = preCollapseSizesRef.current.get(targetIndex);
      const desired =
        saved !== undefined && saved >= targetCfg.minSize
          ? saved
          : targetCfg.minSize;
      nextTarget = roundPercent(clampValue(desired, normalLow, normalHigh));
    } else {
      if (!canCollapse(targetCfg, siblingCfg, pairTotal)) {
        return false;
      }
      preCollapseSizesRef.current.set(targetIndex, currentTarget);
      nextTarget = roundPercent(targetCfg.collapsedSize);
    }

    const nextSibling = roundPercent(pairTotal - nextTarget);
    const nextPrev = targetIsPrev ? nextTarget : nextSibling;
    const nextNext = targetIsPrev ? nextSibling : nextTarget;

    commitPairSizes(current, prevIndex, nextIndex, nextPrev, nextNext);
    return true;
  };

  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <ResizableContext.Provider
      value={{
        orientation,
        sizes,
        panelConfigs,
        containerRef,
        getLatestSizes,
        resizePairFromDrag,
        stepPair,
        resizePairToMin,
        resizePairToMax,
        toggleCollapsePair,
      }}
    >
      <div
        ref={assignContainerRef}
        data-slot="resizable"
        data-orientation={orientation}
        className={classes}
        {...rest}
      >
        {entries.map((entry) => {
          if (entry.kind === "panel") {
            return (
              <PanelIndexContext.Provider
                key={entry.key}
                value={entry.panelIndex}
              >
                {entry.node}
              </PanelIndexContext.Provider>
            );
          }
          if (entry.kind === "handle") {
            const nextIndex = entry.prevIndex + 1;
            const pair =
              entry.prevIndex >= 0 && nextIndex < panelConfigs.length
                ? { prevIndex: entry.prevIndex, nextIndex }
                : null;
            return (
              <HandlePairContext.Provider key={entry.key} value={pair}>
                {entry.node}
              </HandlePairContext.Provider>
            );
          }
          return entry.node;
        })}
      </div>
    </ResizableContext.Provider>
  );
}

export const Resizable = Object.assign(ResizableRoot, {
  Panel: ResizablePanel,
  Handle: ResizableHandle,
});
