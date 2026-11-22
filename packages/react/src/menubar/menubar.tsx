import { Menubar as BaseMenubar } from "@base-ui/react/menubar";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./menubar.module.css";

export type MenubarOrientation = "horizontal" | "vertical";

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  modal?: boolean;
  disabled?: boolean;
  orientation?: MenubarOrientation;
  loopFocus?: boolean;
  children?: ReactNode;
}

export function Menubar({ className, ...rest }: MenubarProps) {
  return (
    <BaseMenubar
      data-slot="menubar"
      className={className ? `${styles.root} ${className}` : styles.root}
      {...rest}
    />
  );
}
