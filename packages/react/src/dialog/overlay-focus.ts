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
    ) => // biome-ignore lint/suspicious/noConfusingVoidType: matches Base UI popup focus callback return contract
    boolean | HTMLElement | null | void);
