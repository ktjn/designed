import type { RefObject } from "react";

export type OverlayInteractionType =
  | "mouse"
  | "touch"
  | "pen"
  | "keyboard"
  | "";

export type OverlayFocusTarget =
  | boolean
  | RefObject<HTMLElement | null>
  | ((
      interactionType: OverlayInteractionType,
    ) => boolean | HTMLElement | null | undefined);
