import { ChevronDownIcon } from "@ktjn/designed-icons";
import type { ReactNode } from "react";
import { Button, type ButtonProps } from "../button/button.js";
import { ButtonGroup } from "../button-group/button-group.js";
import { Menu } from "../menu/menu.js";

export interface SplitButtonProps
  extends Omit<ButtonProps, "render" | "children"> {
  menuLabel?: string;
  menu: ReactNode;
  children?: ReactNode;
}

export function SplitButton({
  menuLabel = "More actions",
  variant = "primary",
  size = "medium",
  menu,
  children,
  className,
  ...rest
}: SplitButtonProps) {
  return (
    <ButtonGroup data-slot="split-button" className={className}>
      <Button variant={variant} size={size} {...rest}>
        {children}
      </Button>
      <Menu>
        <Menu.Trigger
          render={
            <Button variant={variant} size="icon" aria-label={menuLabel} />
          }
        >
          <ChevronDownIcon aria-hidden />
        </Menu.Trigger>
        <Menu.Content>{menu}</Menu.Content>
      </Menu>
    </ButtonGroup>
  );
}
