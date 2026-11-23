// ---- accordion/accordion.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export type AccordionOrientation = "horizontal" | "vertical";
export interface AccordionRootProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
    ref?: Ref<HTMLDivElement>;
    value?: unknown[];
    defaultValue?: unknown[];
    onValueChange?: (value: unknown[], eventDetails?: ChangeEventDetails) => void;
    disabled?: boolean;
    multiple?: boolean;
    orientation?: AccordionOrientation;
    children?: ReactNode;
}
declare function AccordionRoot({ onValueChange, className, ...rest }: AccordionRootProps): import("react").JSX.Element;
export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    value: unknown;
    disabled?: boolean;
    children?: ReactNode;
}
declare function AccordionItem({ className, children, ...rest }: AccordionItemProps): import("react").JSX.Element;
export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    nativeButton?: boolean;
    children?: ReactNode;
}
declare function AccordionTrigger({ className, children, ...rest }: AccordionTriggerProps): import("react").JSX.Element;
export interface AccordionPanelProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    keepMounted?: boolean;
    children?: ReactNode;
}
declare function AccordionPanel({ className, children, ...rest }: AccordionPanelProps): import("react").JSX.Element;
export declare const Accordion: typeof AccordionRoot & {
    Item: typeof AccordionItem;
    Trigger: typeof AccordionTrigger;
    Panel: typeof AccordionPanel;
};
export {};


// ---- alert-dialog/alert-dialog.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export interface AlertDialogRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
    children?: ReactNode;
}
declare function AlertDialogRoot({ open, defaultOpen, onOpenChange, ...rest }: AlertDialogRootProps): import("react").JSX.Element;
export interface AlertDialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    children?: ReactNode;
}
declare function AlertDialogTrigger({ render, className, ...rest }: AlertDialogTriggerProps): import("react").JSX.Element;
export interface AlertDialogContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
    initialFocus?: OverlayFocusTarget;
    finalFocus?: OverlayFocusTarget;
}
declare function AlertDialogContent({ className, children, ...rest }: AlertDialogContentProps): import("react").JSX.Element;
export interface AlertDialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    ref?: Ref<HTMLHeadingElement>;
    children?: ReactNode;
}
declare function AlertDialogTitle({ className, ...rest }: AlertDialogTitleProps): import("react").JSX.Element;
export interface AlertDialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: Ref<HTMLParagraphElement>;
    children?: ReactNode;
}
declare function AlertDialogDescription({ className, ...rest }: AlertDialogDescriptionProps): import("react").JSX.Element;
export interface AlertDialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    children?: ReactNode;
}
declare function AlertDialogClose({ render, className, ...rest }: AlertDialogCloseProps): import("react").JSX.Element;
export declare const AlertDialog: typeof AlertDialogRoot & {
    Trigger: typeof AlertDialogTrigger;
    Content: typeof AlertDialogContent;
    Title: typeof AlertDialogTitle;
    Description: typeof AlertDialogDescription;
    Close: typeof AlertDialogClose;
};
export {};


// ---- alert/alert.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type AlertVariant = "info" | "success" | "warning" | "danger";
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    ref?: Ref<HTMLDivElement>;
    variant?: AlertVariant;
    title?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    children?: ReactNode;
}
export declare function Alert({ ref, variant, title, icon, action, children, role, className, ...rest }: AlertProps): import("react").JSX.Element;


// ---- anchor-nav/anchor-nav.d.ts ----
import { type AnchorHTMLAttributes, type HTMLAttributes, type LiHTMLAttributes, type OlHTMLAttributes, type ReactElement } from "react";
export interface AnchorNavRootProps extends HTMLAttributes<HTMLElement> {
    ref?: React.Ref<HTMLElement>;
    smoothScroll?: boolean;
}
export interface AnchorNavListProps extends OlHTMLAttributes<HTMLOListElement> {
    ref?: React.Ref<HTMLOListElement>;
}
export interface AnchorNavItemProps extends LiHTMLAttributes<HTMLLIElement> {
    ref?: React.Ref<HTMLLIElement>;
}
export interface AnchorNavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    ref?: React.Ref<HTMLAnchorElement>;
    render?: ReactElement;
    href: string;
}
declare function AnchorNavRoot({ ref, "aria-label": ariaLabel, smoothScroll, className, ...rest }: AnchorNavRootProps): import("react").JSX.Element;
declare function AnchorNavList({ className, ...rest }: AnchorNavListProps): import("react").JSX.Element;
declare function AnchorNavItem({ className, ...rest }: AnchorNavItemProps): import("react").JSX.Element;
declare function AnchorNavLink({ ref, render, href, className, onClick, "aria-current": ariaCurrentProp, ...rest }: AnchorNavLinkProps): import("react").JSX.Element | null;
export declare const AnchorNav: typeof AnchorNavRoot & {
    List: typeof AnchorNavList;
    Item: typeof AnchorNavItem;
    Link: typeof AnchorNavLink;
};
export {};


// ---- aspect-ratio/aspect-ratio.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    ratio?: number;
    children?: ReactNode;
}
export declare function AspectRatio({ ref, ratio, className, style, ...rest }: AspectRatioProps): import("react").JSX.Element;


// ---- autocomplete/autocomplete.d.ts ----
import type { InputHTMLAttributes, ReactNode, Ref } from "react";
export type AutocompleteSide = "top" | "right" | "bottom" | "left";
export type AutocompleteAlign = "start" | "center" | "end";
export type AutocompleteSize = "small" | "medium" | "large";
export interface AutocompleteProps<Value = string> extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size"> {
    ref?: Ref<HTMLInputElement>;
    items: readonly Value[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    emptyMessage?: ReactNode;
    invalid?: boolean;
    size?: AutocompleteSize;
    filter?: ((item: Value, query: string) => boolean) | null;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    itemToStringValue?: (item: Value) => string;
    renderItem?: (item: Value) => ReactNode;
    popupClassName?: string;
    side?: AutocompleteSide;
    sideOffset?: number;
    align?: AutocompleteAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<AutocompleteSide, number>>;
}
export declare function Autocomplete<Value = string>({ items, value, defaultValue, onValueChange, emptyMessage, invalid, size, disabled, name, placeholder, id, className, filter, open, defaultOpen, onOpenChange, itemToStringValue, renderItem, popupClassName, side, sideOffset, align, alignOffset, collisionPadding, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: AutocompleteProps<Value>): import("react").JSX.Element;


// ---- avatar-group/avatar-group.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { type AvatarSize } from "../avatar/avatar.js";
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    max?: number;
    size?: AvatarSize;
    renderOverflow?: (count: number) => ReactNode;
    overflowLabel?: (count: number) => string;
    children?: ReactNode;
}
export declare function AvatarGroup({ ref, max, size, renderOverflow, overflowLabel, className, children, ...rest }: AvatarGroupProps): import("react").JSX.Element;


// ---- avatar/avatar.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type AvatarSize = "small" | "medium" | "large";
export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    ref?: Ref<HTMLSpanElement>;
    src?: string;
    alt: string;
    fallback?: ReactNode;
    size?: AvatarSize;
}
export declare function Avatar({ ref, src, alt, fallback, size, className, ...rest }: AvatarProps): import("react").JSX.Element;


// ---- badge/badge.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";
export type BadgeSize = "small" | "medium" | "large";
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    variant?: BadgeVariant;
    size?: BadgeSize;
    children?: ReactNode;
}
export declare function Badge({ ref, variant, size, className, ...rest }: BadgeProps): import("react").JSX.Element;


// ---- banner/banner.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type BannerVariant = "info" | "success" | "warning" | "danger";
export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    ref?: Ref<HTMLDivElement>;
    variant?: BannerVariant;
    title?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    onDismiss?: () => void;
    dismissLabel?: string;
    children?: ReactNode;
}
export declare function Banner({ ref, variant, title, icon, action, onDismiss, dismissLabel, children, role, className, ...rest }: BannerProps): import("react").JSX.Element;


// ---- breadcrumb/breadcrumb.d.ts ----
import type { AnchorHTMLAttributes, HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes, ReactElement, ReactNode, Ref } from "react";
export interface BreadcrumbRootProps extends HTMLAttributes<HTMLElement> {
    ref?: Ref<HTMLElement>;
}
export interface BreadcrumbListProps extends OlHTMLAttributes<HTMLOListElement> {
    ref?: Ref<HTMLOListElement>;
}
export interface BreadcrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {
    ref?: Ref<HTMLLIElement>;
}
export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    ref?: Ref<HTMLAnchorElement>;
    render?: ReactElement;
}
export interface BreadcrumbPageProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
}
export interface BreadcrumbSeparatorProps extends LiHTMLAttributes<HTMLLIElement> {
    ref?: Ref<HTMLLIElement>;
    children?: ReactNode;
}
declare function BreadcrumbRoot({ ref, "aria-label": ariaLabel, className, ...rest }: BreadcrumbRootProps): import("react").JSX.Element;
declare function BreadcrumbList({ className, ...rest }: BreadcrumbListProps): import("react").JSX.Element;
declare function BreadcrumbItem({ className, ...rest }: BreadcrumbItemProps): import("react").JSX.Element;
declare function BreadcrumbLink({ ref, render, className, ...rest }: BreadcrumbLinkProps): import("react").JSX.Element | null;
declare function BreadcrumbPage({ className, ...rest }: BreadcrumbPageProps): import("react").JSX.Element;
declare function BreadcrumbSeparator({ children, className, ...rest }: BreadcrumbSeparatorProps): import("react").JSX.Element;
export declare const Breadcrumb: typeof BreadcrumbRoot & {
    List: typeof BreadcrumbList;
    Item: typeof BreadcrumbItem;
    Link: typeof BreadcrumbLink;
    Page: typeof BreadcrumbPage;
    Separator: typeof BreadcrumbSeparator;
};
export {};


// ---- button-group/button-group.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type ButtonGroupOrientation = "horizontal" | "vertical";
export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    orientation?: ButtonGroupOrientation;
    children?: ReactNode;
}
export declare function ButtonGroup({ ref, orientation, className, ...rest }: ButtonGroupProps): import("react").JSX.Element;


// ---- button/button.d.ts ----
import { type ButtonHTMLAttributes, type ReactElement, type ReactNode, type Ref } from "react";
export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "small" | "medium" | "large" | "icon";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    nativeButton?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children?: ReactNode;
}
export declare function Button({ ref, render, nativeButton, variant, size, loading, disabled, type, className, onClick, "aria-disabled": ariaDisabled, children, ...rest }: ButtonProps): import("react").JSX.Element;


// ---- calendar/calendar.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CalendarMode = "single" | "range";
export interface CalendarRangeValue {
    start: string;
    end?: string;
}
export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> {
    ref?: Ref<HTMLDivElement>;
    mode?: CalendarMode;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    rangeValue?: CalendarRangeValue | null;
    defaultRangeValue?: CalendarRangeValue;
    onRangeValueChange?: (value: CalendarRangeValue) => void;
    min?: string;
    max?: string;
    isDateDisabled?: (isoDate: string) => boolean;
    locale?: string;
    weekStartsOn?: WeekdayIndex;
    disabled?: boolean;
    previousMonthLabel?: string;
    nextMonthLabel?: string;
    month?: string;
    defaultMonth?: string;
    onMonthChange?: (month: string) => void;
}
export declare function parseIsoDate(iso: string | undefined): Date | null;
export declare function Calendar({ ref, mode, value, defaultValue, onValueChange, rangeValue, defaultRangeValue, onRangeValueChange, min, max, isDateDisabled, locale, weekStartsOn, disabled, previousMonthLabel, nextMonthLabel, month, defaultMonth, onMonthChange, className, ...rest }: CalendarProps): import("react").JSX.Element;


// ---- card/card.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
    as?: "div";
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
export interface CardSectionProps extends HTMLAttributes<HTMLElement> {
    as: "section" | "article";
    ref?: Ref<HTMLElement>;
    children?: ReactNode;
}
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    ref?: Ref<HTMLHeadingElement>;
    children?: ReactNode;
}
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: Ref<HTMLParagraphElement>;
    children?: ReactNode;
}
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function CardRoot({ className, ...props }: CardRootProps | CardSectionProps): import("react").JSX.Element;
declare function CardHeader({ className, ...rest }: CardHeaderProps): import("react").JSX.Element;
declare function CardTitle({ as: Heading, className, ...rest }: CardTitleProps): import("react").JSX.Element;
declare function CardDescription({ className, ...rest }: CardDescriptionProps): import("react").JSX.Element;
declare function CardContent({ className, ...rest }: CardContentProps): import("react").JSX.Element;
declare function CardFooter({ className, ...rest }: CardFooterProps): import("react").JSX.Element;
export declare const Card: typeof CardRoot & {
    Header: typeof CardHeader;
    Title: typeof CardTitle;
    Description: typeof CardDescription;
    Content: typeof CardContent;
    Footer: typeof CardFooter;
};
export {};


// ---- checkbox-card/checkbox-card.d.ts ----
import type { LabelHTMLAttributes, ReactNode, Ref } from "react";
import { type CheckboxProps } from "../checkbox/checkbox.js";
export interface CheckboxCardProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
    ref?: Ref<HTMLLabelElement>;
    label: ReactNode;
    description?: ReactNode;
    checked?: CheckboxProps["checked"];
    defaultChecked?: CheckboxProps["defaultChecked"];
    onCheckedChange?: CheckboxProps["onCheckedChange"];
    disabled?: boolean;
    name?: string;
    value?: string;
    children?: ReactNode;
}
export declare function CheckboxCard({ label, description, checked, defaultChecked, onCheckedChange, disabled, name, value, className, children, ...rest }: CheckboxCardProps): import("react").JSX.Element;


// ---- checkbox-group/checkbox-group.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export type CheckboxGroupOrientation = "horizontal" | "vertical";
export interface CheckboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
    ref?: Ref<HTMLDivElement>;
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[], eventDetails?: ChangeEventDetails) => void;
    allValues?: string[];
    disabled?: boolean;
    orientation?: CheckboxGroupOrientation;
    children?: ReactNode;
}
export declare function CheckboxGroup({ disabled, orientation, onValueChange, className, ...rest }: CheckboxGroupProps): import("react").JSX.Element;


// ---- checkbox/checkbox.d.ts ----
import type { HTMLAttributes, Ref } from "react";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export type CheckboxSize = "small" | "medium" | "large";
export interface CheckboxProps extends Omit<HTMLAttributes<HTMLElement>, "defaultChecked" | "onChange"> {
    ref?: Ref<HTMLElement>;
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean, eventDetails?: ChangeEventDetails) => void;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    indeterminate?: boolean;
    name?: string;
    value?: string;
    parent?: boolean;
    size?: CheckboxSize;
}
export declare function Checkbox({ ref, onCheckedChange, disabled, size, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: CheckboxProps): import("react").JSX.Element;


// ---- code-snippet/code-snippet.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type CodeSnippetVariant = "inline" | "block";
export interface CodeSnippetProps extends HTMLAttributes<HTMLElement> {
    ref?: Ref<HTMLElement>;
    variant?: CodeSnippetVariant;
    showCopyButton?: boolean;
    copyLabel?: string;
    copiedLabel?: string;
    children?: ReactNode;
}
export declare function CodeSnippet({ ref, variant, showCopyButton, copyLabel, copiedLabel, className, children, ...rest }: CodeSnippetProps): import("react").JSX.Element;


// ---- collapsible/collapsible.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
export interface CollapsibleRootProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
    ref?: Ref<HTMLDivElement>;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function CollapsibleRoot({ onOpenChange, className, ...rest }: CollapsibleRootProps): import("react").JSX.Element;
export interface CollapsibleTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    nativeButton?: boolean;
    children?: ReactNode;
}
declare function CollapsibleTrigger({ className, children, ...rest }: CollapsibleTriggerProps): import("react").JSX.Element;
export interface CollapsiblePanelProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    keepMounted?: boolean;
    children?: ReactNode;
}
declare function CollapsiblePanel({ className, children, ...rest }: CollapsiblePanelProps): import("react").JSX.Element;
export declare const Collapsible: typeof CollapsibleRoot & {
    Trigger: typeof CollapsibleTrigger;
    Panel: typeof CollapsiblePanel;
};
export {};


// ---- color-picker/color-picker.d.ts ----
import { type HTMLAttributes, type Ref } from "react";
import { type PopoverAlign, type PopoverSide } from "../popover/popover.js";
export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
    ref?: Ref<HTMLDivElement>;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    presets?: readonly string[];
    label?: string;
    invalid?: boolean;
    disabled?: boolean;
    id?: string;
    side?: PopoverSide;
    sideOffset?: number;
    align?: PopoverAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<PopoverSide, number>>;
}
export declare function ColorPicker({ ref, value, defaultValue, onValueChange, presets, label, invalid, disabled, id, side, sideOffset, align, alignOffset, collisionPadding, className, "aria-describedby": ariaDescribedBy, "aria-label": ariaLabel, ...rest }: ColorPickerProps): import("react").JSX.Element;


// ---- color-picker/color-utils.d.ts ----
export declare function isValidColor(value: string): boolean;
export declare function normalizeToHex(value: string): string | null;


// ---- color-swatch/color-swatch.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export type ColorSwatchSize = "small" | "medium" | "large";
export interface ColorSwatchProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    value: string;
    size?: ColorSwatchSize;
    label?: string;
}
export declare function ColorSwatch({ ref, value, size, label, className, style, ...rest }: ColorSwatchProps): import("react").JSX.Element;


// ---- combobox/combobox.d.ts ----
import type { HTMLAttributes, InputHTMLAttributes, ReactNode, Ref } from "react";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export interface ComboboxItem<Value> {
    label: string;
    value: Value;
    disabled?: boolean;
}
type ComboboxValue<Value, Multiple extends boolean | undefined> = Multiple extends true ? Value[] : Value;
export interface ComboboxRootProps<Value = unknown, Multiple extends boolean | undefined = false> {
    value?: ComboboxValue<Value, Multiple> | null;
    defaultValue?: ComboboxValue<Value, Multiple>;
    onValueChange?: (value: ComboboxValue<Value, Multiple> | (Multiple extends true ? never : null), eventDetails?: ChangeEventDetails) => void;
    multiple?: Multiple;
    inputValue?: string;
    defaultInputValue?: string;
    onInputValueChange?: (inputValue: string) => void;
    disabled?: boolean;
    readOnly?: boolean;
    name?: string;
    items: ReadonlyArray<ComboboxItem<Value>>;
    filter?: ((item: ComboboxItem<Value>, query: string) => boolean) | null;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
    children?: ReactNode;
}
declare function ComboboxRoot<Value = unknown, Multiple extends boolean | undefined = false>({ value, defaultValue, onValueChange, onInputValueChange, disabled, items, multiple, filter, open, defaultOpen, onOpenChange, ...rest }: ComboboxRootProps<Value, Multiple>): import("react").JSX.Element;
export type ComboboxSize = "small" | "medium" | "large";
export interface ComboboxInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    ref?: Ref<HTMLInputElement>;
    size?: ComboboxSize;
}
declare function ComboboxInput({ id, className, size, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: ComboboxInputProps): import("react").JSX.Element;
export type ComboboxSide = "top" | "right" | "bottom" | "left";
export type ComboboxAlign = "start" | "center" | "end";
export interface ComboboxContentProps<Value = unknown> extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    emptyMessage?: ReactNode;
    initialFocus?: OverlayFocusTarget;
    finalFocus?: OverlayFocusTarget;
    side?: ComboboxSide;
    sideOffset?: number;
    align?: ComboboxAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<ComboboxSide, number>>;
    renderItem?: (item: ComboboxItem<Value>) => ReactNode;
}
declare function ComboboxContent<Value = unknown>({ className, emptyMessage, initialFocus, finalFocus, side, sideOffset, align, alignOffset, collisionPadding, renderItem, ...rest }: ComboboxContentProps<Value>): import("react").JSX.Element;
export declare const Combobox: typeof ComboboxRoot & {
    Input: typeof ComboboxInput;
    Content: typeof ComboboxContent;
};
export {};


// ---- command-palette/command-palette.d.ts ----
import { type HTMLAttributes, type ReactNode, type Ref } from "react";
export interface CommandPaletteItem {
    id: string;
    label: string;
    group?: string;
    keywords?: readonly string[];
    shortcut?: string;
    disabled?: boolean;
}
export interface CommandPaletteProps<Item extends CommandPaletteItem = CommandPaletteItem> extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onSelect" | "children"> {
    ref?: Ref<HTMLDivElement>;
    items: readonly Item[];
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    query?: string;
    onQueryChange?: (query: string) => void;
    filter?: ((item: Item, query: string) => boolean) | null;
    renderItem?: (item: Item) => ReactNode;
    onSelect?: (item: Item) => void;
    title?: string;
    placeholder?: string;
    searchLabel?: string;
    emptyMessage?: string;
    status?: {
        kind: "loading" | "error";
        message: string;
    };
    getResultsAnnouncement?: (count: number) => string;
    closeLabel?: string;
    enableGlobalShortcut?: boolean;
}
export declare function CommandPalette<Item extends CommandPaletteItem = CommandPaletteItem>({ items, open, defaultOpen, onOpenChange, query: controlledQuery, onQueryChange, filter, renderItem, onSelect, title, placeholder, searchLabel, emptyMessage, status, getResultsAnnouncement, closeLabel, enableGlobalShortcut, className, ...rest }: CommandPaletteProps<Item>): import("react").JSX.Element;


// ---- container/container.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type ContainerSize = "sm" | "md" | "lg" | "full";
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    size?: ContainerSize;
    padded?: boolean;
    children?: ReactNode;
}
export declare function Container({ ref, size, padded, className, ...rest }: ContainerProps): import("react").JSX.Element;


// ---- context-menu/context-menu.d.ts ----
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export interface ContextMenuRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuRoot({ open, defaultOpen, onOpenChange, ...rest }: ContextMenuRootProps): import("react").JSX.Element;
export interface ContextMenuTriggerProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    render?: ReactElement;
    children?: ReactNode;
}
declare function ContextMenuTrigger({ className, ...rest }: ContextMenuTriggerProps): import("react").JSX.Element;
export interface ContextMenuContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    finalFocus?: OverlayFocusTarget;
    children?: ReactNode;
}
declare function ContextMenuContent({ className, children, ...rest }: ContextMenuContentProps): import("react").JSX.Element;
export interface ContextMenuGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function ContextMenuGroup(props: ContextMenuGroupProps): import("react").JSX.Element;
export interface ContextMenuGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function ContextMenuGroupLabel({ className, ...rest }: ContextMenuGroupLabelProps): import("react").JSX.Element;
export interface ContextMenuItemProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    render?: ReactElement;
    nativeButton?: boolean;
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuItem({ className, ...rest }: ContextMenuItemProps): import("react").JSX.Element;
export interface ContextMenuCheckboxItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    ref?: Ref<HTMLDivElement>;
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuCheckboxItem({ checked, defaultChecked, onCheckedChange, disabled, className, children, ...rest }: ContextMenuCheckboxItemProps): import("react").JSX.Element;
export interface ContextMenuRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    ref?: Ref<HTMLDivElement>;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuRadioGroup({ value, defaultValue, onValueChange, disabled, ...rest }: ContextMenuRadioGroupProps): import("react").JSX.Element;
export interface ContextMenuRadioItemProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    value: string;
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuRadioItem({ value, disabled, className, children, ...rest }: ContextMenuRadioItemProps): import("react").JSX.Element;
export interface ContextMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
}
declare function ContextMenuSeparator({ className, ...rest }: ContextMenuSeparatorProps): import("react").JSX.Element;
export interface ContextMenuShortcutProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    children?: ReactNode;
}
declare function ContextMenuShortcut({ className, ...rest }: ContextMenuShortcutProps): import("react").JSX.Element;
export interface ContextMenuSubmenuProps {
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuSubmenu(props: ContextMenuSubmenuProps): import("react").JSX.Element;
export interface ContextMenuSubmenuTriggerProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    render?: ReactElement;
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuSubmenuTrigger({ className, ...rest }: ContextMenuSubmenuTriggerProps): import("react").JSX.Element;
export interface ContextMenuLinkItemProps extends Omit<HTMLAttributes<HTMLAnchorElement>, "href"> {
    ref?: Ref<HTMLAnchorElement>;
    href?: string;
    closeOnClick?: boolean;
    children?: ReactNode;
}
declare function ContextMenuLinkItem({ className, ...rest }: ContextMenuLinkItemProps): import("react").JSX.Element;
export declare const ContextMenu: typeof ContextMenuRoot & {
    Trigger: typeof ContextMenuTrigger;
    Content: typeof ContextMenuContent;
    Group: typeof ContextMenuGroup;
    GroupLabel: typeof ContextMenuGroupLabel;
    Item: typeof ContextMenuItem;
    LinkItem: typeof ContextMenuLinkItem;
    CheckboxItem: typeof ContextMenuCheckboxItem;
    RadioGroup: typeof ContextMenuRadioGroup;
    RadioItem: typeof ContextMenuRadioItem;
    Separator: typeof ContextMenuSeparator;
    Shortcut: typeof ContextMenuShortcut;
    Submenu: typeof ContextMenuSubmenu;
    SubmenuTrigger: typeof ContextMenuSubmenuTrigger;
};
export {};


// ---- contextual-help/contextual-help.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { type PopoverAlign, type PopoverSide } from "../popover/popover.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export type ContextualHelpVariant = "info" | "help";
export interface ContextualHelpProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    ref?: Ref<HTMLDivElement>;
    heading: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    variant?: ContextualHelpVariant;
    label?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
    side?: PopoverSide;
    sideOffset?: number;
    align?: PopoverAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<PopoverSide, number>>;
}
export declare function ContextualHelp({ ref, heading, children, footer, variant, label, open, defaultOpen, onOpenChange, side, sideOffset, align, alignOffset, collisionPadding, className, ...rest }: ContextualHelpProps): import("react").JSX.Element;


// ---- copy-button/copy-button.d.ts ----
import { type ButtonProps, type ButtonSize } from "../button/button.js";
export type CopyButtonSize = ButtonSize | "xs" | "sm";
type CopyButtonOverrides = "onClick" | "onCopy" | "value" | "children" | "size";
export interface CopyButtonProps extends Omit<ButtonProps, CopyButtonOverrides> {
    value: string | (() => string);
    label?: string;
    copiedLabel?: string;
    errorLabel?: string;
    copiedDuration?: number;
    size?: CopyButtonSize;
    onCopy?: (value: string) => void;
    onError?: (error: unknown) => void;
}
export declare function CopyButton({ value, label, copiedLabel, errorLabel, copiedDuration, size, onCopy, onError, variant, className, "aria-label": ariaLabel, ...rest }: CopyButtonProps): import("react").JSX.Element;
export {};


// ---- copy-button/use-copy-to-clipboard.d.ts ----
export type CopyToClipboardState = "idle" | "copied" | "error";
export type CopyToClipboardResult = {
    ok: true;
    value: string;
} | {
    ok: false;
    error: unknown;
};
export declare function useCopyToClipboard(resetMs?: number): {
    copy: (value: string | (() => string)) => Promise<CopyToClipboardResult>;
    state: CopyToClipboardState;
};


// ---- date-picker/date-picker.d.ts ----
import type { InputHTMLAttributes, Ref } from "react";
import { type CalendarMode, type CalendarRangeValue, type WeekdayIndex } from "../calendar/calendar.js";
export type DatePickerSide = "top" | "right" | "bottom" | "left";
export type DatePickerAlign = "start" | "center" | "end";
export type DatePickerSize = "small" | "medium" | "large";
export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange" | "size"> {
    ref?: Ref<HTMLInputElement>;
    mode?: CalendarMode;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    rangeValue?: CalendarRangeValue | null;
    defaultRangeValue?: CalendarRangeValue;
    onRangeValueChange?: (value: CalendarRangeValue) => void;
    min?: string;
    max?: string;
    locale?: string;
    weekStartsOn?: WeekdayIndex;
    invalid?: boolean;
    size?: DatePickerSize;
    openCalendarLabel?: string;
    previousMonthLabel?: string;
    nextMonthLabel?: string;
    isDateDisabled?: (isoDate: string) => boolean;
    formatValidationMessage?: (kind: "invalid" | "min" | "max", context: {
        min?: string;
        max?: string;
    }) => string;
    side?: DatePickerSide;
    sideOffset?: number;
    align?: DatePickerAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<DatePickerSide, number>>;
}
export declare function DatePicker({ ref, mode, value, defaultValue, onValueChange, rangeValue, defaultRangeValue, onRangeValueChange, min, max, locale, weekStartsOn, invalid, size, disabled, readOnly, placeholder, openCalendarLabel, previousMonthLabel, nextMonthLabel, isDateDisabled, formatValidationMessage, side, sideOffset, align, alignOffset, collisionPadding, id, className, onBlur, onKeyDown, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: DatePickerProps): import("react").JSX.Element;


// ---- description-list/description-list.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface DescriptionListRootProps extends HTMLAttributes<HTMLDListElement> {
    ref?: Ref<HTMLDListElement>;
    children?: ReactNode;
}
declare function DescriptionListRoot({ className, ...rest }: DescriptionListRootProps): import("react").JSX.Element;
export interface DescriptionListItemProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    term: ReactNode;
    children?: ReactNode;
}
declare function DescriptionListItem({ term, className, children, ...rest }: DescriptionListItemProps): import("react").JSX.Element;
export declare const DescriptionList: typeof DescriptionListRoot & {
    Item: typeof DescriptionListItem;
};
export {};


// ---- designed-provider/csp-provider.d.ts ----
export type { CSPProviderProps } from "@base-ui/react/csp-provider";
export { CSPProvider } from "@base-ui/react/csp-provider";


// ---- designed-provider/designed-provider.d.ts ----
import type { ReactNode } from "react";
import { type I18nMessages } from "./i18n-provider.js";
import { type IconOverrides } from "./icon-provider.js";
export interface DesignedProviderProps {
    icons?: IconOverrides;
    messages?: I18nMessages;
    locale?: string;
    cspNonce?: string;
    disableCspStyleElements?: boolean;
    children?: ReactNode;
}
export declare function DesignedProvider({ icons, messages, locale, cspNonce, disableCspStyleElements, children, }: DesignedProviderProps): import("react").JSX.Element;


// ---- designed-provider/i18n-provider.d.ts ----
import { type ReactNode } from "react";
export interface I18nMessages {
    close?: string;
    dismiss?: string;
    previousMonth?: string;
    nextMonth?: string;
    openCalendar?: string;
    empty?: string;
    remove?: string;
    getRemoveLabel?: (label: string) => string;
    locale?: string;
}
export declare function useI18nMessages(): I18nMessages;
export declare function I18nProvider({ messages, children, }: {
    messages: I18nMessages;
    children?: ReactNode;
}): import("react").JSX.Element;
export declare function useI18nMessage<K extends keyof Omit<I18nMessages, "locale">>(key: K, explicitValue: I18nMessages[K] | undefined, builtInDefault: NonNullable<I18nMessages[K]>): NonNullable<I18nMessages[K]>;
export declare function useLocale(): string | undefined;


// ---- designed-provider/icon-provider.d.ts ----
import type { IconProps } from "@ktjn/designed-icons";
import { type ComponentType, type ReactNode } from "react";
export type IconKey = "close" | "search" | "chevronLeft" | "chevronRight" | "chevronDown" | "check" | "calendar" | "copy" | "upload" | "eye" | "eyeOff" | "minus" | "plus" | "gripVertical" | "arrowUp" | "arrowDown" | "info" | "sort" | "alertCircle" | "alertTriangle";
export type IconOverrides = Partial<Record<IconKey, ComponentType<IconProps>>>;
export declare function useIconOverrides(): IconOverrides;
export declare function IconProvider({ overrides, children, }: {
    overrides: IconOverrides;
    children?: ReactNode;
}): import("react").JSX.Element;
export declare function useIconOverride<K extends IconKey>(key: K, defaultIcon: NonNullable<IconOverrides[K]>): NonNullable<IconOverrides[K]>;


// ---- dialog/dialog.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
import type { OverlayFocusTarget } from "./overlay-focus.js";
export interface DialogRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
    onOpenChangeComplete?: (open: boolean) => void;
    modal?: boolean | "trap-focus";
    disablePointerDismissal?: boolean;
    children?: ReactNode;
}
declare function DialogRoot({ open, defaultOpen, onOpenChange, onOpenChangeComplete, ...rest }: DialogRootProps): import("react").JSX.Element;
export interface DialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    children?: ReactNode;
}
declare function DialogTrigger({ render, className, ...rest }: DialogTriggerProps): import("react").JSX.Element;
export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
    closeLabel?: string;
    showCloseButton?: boolean;
    backdropClassName?: string;
    initialFocus?: OverlayFocusTarget;
    finalFocus?: OverlayFocusTarget;
}
declare function DialogContent({ children, closeLabel, showCloseButton, backdropClassName, className, ...rest }: DialogContentProps): import("react").JSX.Element;
export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    ref?: Ref<HTMLHeadingElement>;
    children?: ReactNode;
}
declare function DialogTitle({ className, ...rest }: DialogTitleProps): import("react").JSX.Element;
export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: Ref<HTMLParagraphElement>;
    children?: ReactNode;
}
declare function DialogDescription({ className, ...rest }: DialogDescriptionProps): import("react").JSX.Element;
export interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    children?: ReactNode;
}
declare function DialogCloseButton({ render, className, ...rest }: DialogCloseProps): import("react").JSX.Element;
export declare const Dialog: typeof DialogRoot & {
    Trigger: typeof DialogTrigger;
    Content: typeof DialogContent;
    Title: typeof DialogTitle;
    Description: typeof DialogDescription;
    Close: typeof DialogCloseButton;
};
export {};


// ---- dialog/overlay-focus.d.ts ----
import type { RefObject } from "react";
export type OverlayInteractionType = "mouse" | "touch" | "pen" | "keyboard" | "";
export type OverlayFocusTarget = boolean | RefObject<HTMLElement | null> | ((interactionType: OverlayInteractionType) => // biome-ignore lint/suspicious/noConfusingVoidType: matches Base UI popup focus callback return contract
boolean | HTMLElement | null | void);


// ---- dialog/use-dialog-portal-container.d.ts ----
export declare const PortalActivityContext: import("react").Context<boolean | undefined>;
export declare function usePortalActivity(open?: boolean, defaultOpen?: boolean): {
    active: boolean;
    onOpenChange: (next: boolean) => void;
    onOpenChangeComplete: (next: boolean) => void;
};
export declare function useDialogPortalContainer(enabled?: boolean): {
    container: HTMLElement | null | undefined;
    scopeRef: (node: HTMLSpanElement | null) => void;
};


// ---- dialog/use-portal-container.d.ts ----
export declare function usePortalContainer(enabled?: boolean): {
    container: HTMLElement | null;
    scopeRef: (node: HTMLSpanElement | null) => void;
};


// ---- direction-provider/direction-provider.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export interface DirectionProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, "dir"> {
    ref?: Ref<HTMLDivElement>;
    direction?: "ltr" | "rtl";
}
export declare function DirectionProvider({ direction, children, ...rest }: DirectionProviderProps): import("react").JSX.Element;


// ---- drawer/drawer.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export type DrawerSide = "right" | "left" | "bottom";
export interface DrawerRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
    onOpenChangeComplete?: (open: boolean) => void;
    modal?: boolean | "trap-focus";
    disablePointerDismissal?: boolean;
    side?: DrawerSide;
    children: ReactNode;
}
export interface DrawerTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    children?: ReactNode;
}
export interface DrawerContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    side?: DrawerSide;
    closeLabel?: string;
    showCloseButton?: boolean;
    backdropClassName?: string;
    initialFocus?: OverlayFocusTarget;
    finalFocus?: OverlayFocusTarget;
    children: ReactNode;
}
export interface DrawerTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    ref?: Ref<HTMLHeadingElement>;
    children: ReactNode;
}
export interface DrawerDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: Ref<HTMLParagraphElement>;
    children: ReactNode;
}
export interface DrawerCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    children?: ReactNode;
}
declare function DrawerRoot({ open, defaultOpen, onOpenChange, onOpenChangeComplete, side, children, ...rest }: DrawerRootProps): import("react").JSX.Element;
declare function DrawerTrigger({ render, className, children, ...rest }: DrawerTriggerProps): import("react").JSX.Element;
declare function DrawerContent({ side, closeLabel, showCloseButton, backdropClassName, className, children, ...rest }: DrawerContentProps): import("react").JSX.Element;
declare function DrawerTitle({ className, children, ...rest }: DrawerTitleProps): import("react").JSX.Element;
declare function DrawerDescription({ className, children, ...rest }: DrawerDescriptionProps): import("react").JSX.Element;
declare function DrawerClose({ render, className, children, ...rest }: DrawerCloseProps): import("react").JSX.Element;
export declare const Drawer: typeof DrawerRoot & {
    Trigger: typeof DrawerTrigger;
    Content: typeof DrawerContent;
    Title: typeof DrawerTitle;
    Description: typeof DrawerDescription;
    Close: typeof DrawerClose;
};
export {};


// ---- empty-state/empty-state.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface EmptyStateClassNames {
    icon?: string;
    title?: string;
    description?: string;
    action?: string;
}
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    ref?: Ref<HTMLDivElement>;
    icon?: ReactNode;
    title: ReactNode;
    titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    description?: ReactNode;
    action?: ReactNode;
    classNames?: EmptyStateClassNames;
    children?: ReactNode;
}
export declare function EmptyState({ ref, icon, title, titleAs: Heading, description, action, classNames, className, children, ...rest }: EmptyStateProps): import("react").JSX.Element;


// ---- error-boundary/error-boundary.d.ts ----
import { type ReactNode } from "react";
export interface ErrorBoundaryClassNames {
    icon?: string;
    title?: string;
    description?: string;
    action?: string;
}
export type ErrorBoundaryFallback = ReactNode | ((props: {
    error: Error;
    reset: () => void;
}) => ReactNode);
export interface ErrorBoundaryProps {
    children?: ReactNode;
    fallback?: ErrorBoundaryFallback;
    onError?: (error: Error, info: {
        componentStack?: string | null;
    }) => void;
    resetKeys?: readonly unknown[];
    classNames?: ErrorBoundaryClassNames;
}
export declare function ErrorBoundary(props: ErrorBoundaryProps): import("react").JSX.Element;


// ---- field/field-context.d.ts ----
export interface FieldContextValue {
    controlId: string;
    descriptionId: string;
    errorId: string;
    describedBy: string | undefined;
    invalid: boolean;
    disabled: boolean;
    registerControlId: (id: string | undefined) => void;
    registerDescription: (mounted: boolean) => void;
    registerError: (mounted: boolean) => void;
}
export declare const FieldContext: import("react").Context<FieldContextValue | null>;
export declare function useFieldContext(): FieldContextValue | null;
export declare function useFieldControlId(explicitId: string | undefined): string | undefined;


// ---- field/field-description.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface FieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: Ref<HTMLParagraphElement>;
    children?: ReactNode;
}
export declare function FieldDescription({ ref, id, className, children, ...rest }: FieldDescriptionProps): import("react").JSX.Element;


// ---- field/field-error.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: Ref<HTMLParagraphElement>;
    children?: ReactNode;
}
export declare function FieldError({ ref, id, className, children, ...rest }: FieldErrorProps): import("react").JSX.Element | null;


// ---- field/field-label.d.ts ----
import type { LabelHTMLAttributes, ReactNode, Ref } from "react";
export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    ref?: Ref<HTMLLabelElement>;
    children?: ReactNode;
}
export declare function FieldLabel({ htmlFor, children, className, ...rest }: FieldLabelProps): import("react").JSX.Element;


// ---- field/field.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { FieldDescription } from "./field-description.js";
import { FieldError } from "./field-error.js";
import { FieldLabel } from "./field-label.js";
export interface FieldRootProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    controlId?: string;
    invalid?: boolean;
    disabled?: boolean;
    children?: ReactNode;
}
declare function FieldRoot({ controlId: explicitControlId, invalid, disabled, className, children, ...rest }: FieldRootProps): import("react").JSX.Element;
export declare const Field: typeof FieldRoot & {
    Label: typeof FieldLabel;
    Description: typeof FieldDescription;
    Error: typeof FieldError;
};
export {};


// ---- fieldset/fieldset.d.ts ----
import type { FieldsetHTMLAttributes, HTMLAttributes, ReactNode, Ref } from "react";
export interface FieldsetRootProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
    ref?: Ref<HTMLFieldSetElement>;
    children?: ReactNode;
}
export interface FieldsetLegendProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function FieldsetRoot({ disabled, className, children, ...rest }: FieldsetRootProps): import("react").JSX.Element;
declare function FieldsetLegend({ className, children, ...rest }: FieldsetLegendProps): import("react").JSX.Element;
export declare const Fieldset: typeof FieldsetRoot & {
    Legend: typeof FieldsetLegend;
};
export {};


// ---- file-upload/file-upload.d.ts ----
import type { InputHTMLAttributes, ReactNode, Ref } from "react";
export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
    ref?: Ref<HTMLInputElement>;
    files?: File[];
    defaultFiles?: File[];
    onFilesChange?: (files: File[]) => void;
    onFilesRejected?: (files: File[]) => void;
    invalid?: boolean;
    prompt?: ReactNode;
    hint?: ReactNode;
    getRemoveLabel?: (file: File) => string;
    renderItem?: (file: File, index: number) => ReactNode;
}
export declare function FileUpload({ ref, files, defaultFiles, onFilesChange, onFilesRejected, invalid, disabled, multiple, accept, prompt, hint, getRemoveLabel, renderItem, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: FileUploadProps): import("react").JSX.Element;


// ---- grid/grid.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type GridColumns = 1 | 2 | 3 | 4 | "auto";
export type GridGap = "none" | "sm" | "md" | "lg";
export type GridAlign = "start" | "center" | "end" | "stretch";
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    columns?: GridColumns;
    minItemWidth?: string;
    gap?: GridGap;
    align?: GridAlign;
    children?: ReactNode;
}
export declare function Grid({ ref, columns, minItemWidth, gap, align, className, style, ...rest }: GridProps): import("react").JSX.Element;


// ---- heading/heading.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export interface HeadingSectionProps {
    children?: ReactNode;
}
export declare function HeadingSection({ children }: HeadingSectionProps): import("react").JSX.Element;
export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    ref?: Ref<HTMLHeadingElement>;
    as?: HeadingTag;
    children?: ReactNode;
}
export declare function Heading({ as, className, ...rest }: HeadingProps): import("react").JSX.Element;


// ---- index.d.ts ----
export type { AccordionItemProps, AccordionPanelProps, AccordionRootProps, AccordionTriggerProps, } from "./accordion/accordion.js";
export { Accordion } from "./accordion/accordion.js";
export type { AlertProps, AlertVariant } from "./alert/alert.js";
export { Alert } from "./alert/alert.js";
export type { AlertDialogCloseProps, AlertDialogContentProps, AlertDialogDescriptionProps, AlertDialogRootProps, AlertDialogTitleProps, AlertDialogTriggerProps, } from "./alert-dialog/alert-dialog.js";
export { AlertDialog } from "./alert-dialog/alert-dialog.js";
export type { AnchorNavItemProps, AnchorNavLinkProps, AnchorNavListProps, AnchorNavRootProps, } from "./anchor-nav/anchor-nav.js";
export { AnchorNav } from "./anchor-nav/anchor-nav.js";
export type { AspectRatioProps } from "./aspect-ratio/aspect-ratio.js";
export { AspectRatio } from "./aspect-ratio/aspect-ratio.js";
export type { AutocompleteProps, AutocompleteSize, } from "./autocomplete/autocomplete.js";
export { Autocomplete } from "./autocomplete/autocomplete.js";
export type { AvatarProps, AvatarSize } from "./avatar/avatar.js";
export { Avatar } from "./avatar/avatar.js";
export type { AvatarGroupProps } from "./avatar-group/avatar-group.js";
export { AvatarGroup } from "./avatar-group/avatar-group.js";
export type { BadgeProps, BadgeSize, BadgeVariant, } from "./badge/badge.js";
export { Badge } from "./badge/badge.js";
export type { BannerProps, BannerVariant } from "./banner/banner.js";
export { Banner } from "./banner/banner.js";
export type { BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbListProps, BreadcrumbPageProps, BreadcrumbRootProps, BreadcrumbSeparatorProps, } from "./breadcrumb/breadcrumb.js";
export { Breadcrumb } from "./breadcrumb/breadcrumb.js";
export type { ButtonProps, ButtonSize, ButtonVariant, } from "./button/button.js";
export { Button } from "./button/button.js";
export type { ButtonGroupOrientation, ButtonGroupProps, } from "./button-group/button-group.js";
export { ButtonGroup } from "./button-group/button-group.js";
export type { CalendarMode, CalendarProps, CalendarRangeValue, WeekdayIndex, } from "./calendar/calendar.js";
export { Calendar } from "./calendar/calendar.js";
export type { CardContentProps, CardDescriptionProps, CardFooterProps, CardHeaderProps, CardRootProps, CardSectionProps, CardTitleProps, } from "./card/card.js";
export { Card } from "./card/card.js";
export type { CheckboxProps, CheckboxSize, } from "./checkbox/checkbox.js";
export { Checkbox } from "./checkbox/checkbox.js";
export type { CheckboxCardProps } from "./checkbox-card/checkbox-card.js";
export { CheckboxCard } from "./checkbox-card/checkbox-card.js";
export type { CheckboxGroupOrientation, CheckboxGroupProps, } from "./checkbox-group/checkbox-group.js";
export { CheckboxGroup } from "./checkbox-group/checkbox-group.js";
export type { CodeSnippetProps, CodeSnippetVariant, } from "./code-snippet/code-snippet.js";
export { CodeSnippet } from "./code-snippet/code-snippet.js";
export type { CollapsiblePanelProps, CollapsibleRootProps, CollapsibleTriggerProps, } from "./collapsible/collapsible.js";
export { Collapsible } from "./collapsible/collapsible.js";
export type { ColorPickerProps } from "./color-picker/color-picker.js";
export { ColorPicker } from "./color-picker/color-picker.js";
export type { ColorSwatchProps, ColorSwatchSize, } from "./color-swatch/color-swatch.js";
export { ColorSwatch } from "./color-swatch/color-swatch.js";
export type { ComboboxContentProps, ComboboxInputProps, ComboboxItem, ComboboxRootProps, ComboboxSize, } from "./combobox/combobox.js";
export { Combobox } from "./combobox/combobox.js";
export type { CommandPaletteItem, CommandPaletteProps, } from "./command-palette/command-palette.js";
export { CommandPalette } from "./command-palette/command-palette.js";
export type { ContainerProps, ContainerSize } from "./container/container.js";
export { Container } from "./container/container.js";
export type { ContextMenuCheckboxItemProps, ContextMenuContentProps, ContextMenuGroupLabelProps, ContextMenuGroupProps, ContextMenuItemProps, ContextMenuLinkItemProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuRootProps, ContextMenuSeparatorProps, ContextMenuShortcutProps, ContextMenuSubmenuProps, ContextMenuSubmenuTriggerProps, ContextMenuTriggerProps, } from "./context-menu/context-menu.js";
export { ContextMenu } from "./context-menu/context-menu.js";
export type { ContextualHelpProps, ContextualHelpVariant, } from "./contextual-help/contextual-help.js";
export { ContextualHelp } from "./contextual-help/contextual-help.js";
export type { CopyButtonProps, CopyButtonSize, } from "./copy-button/copy-button.js";
export { CopyButton } from "./copy-button/copy-button.js";
export type { CopyToClipboardResult, CopyToClipboardState, } from "./copy-button/use-copy-to-clipboard.js";
export { useCopyToClipboard } from "./copy-button/use-copy-to-clipboard.js";
export type { DatePickerProps, DatePickerSize, } from "./date-picker/date-picker.js";
export { DatePicker } from "./date-picker/date-picker.js";
export type { DescriptionListItemProps, DescriptionListRootProps, } from "./description-list/description-list.js";
export { DescriptionList } from "./description-list/description-list.js";
export type { CSPProviderProps } from "./designed-provider/csp-provider.js";
export { CSPProvider } from "./designed-provider/csp-provider.js";
export type { DesignedProviderProps } from "./designed-provider/designed-provider.js";
export { DesignedProvider } from "./designed-provider/designed-provider.js";
export type { I18nMessages } from "./designed-provider/i18n-provider.js";
export { I18nProvider, useI18nMessage, useI18nMessages, useLocale, } from "./designed-provider/i18n-provider.js";
export type { IconKey, IconOverrides, } from "./designed-provider/icon-provider.js";
export { IconProvider, useIconOverride, useIconOverrides, } from "./designed-provider/icon-provider.js";
export type { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogRootProps, DialogTitleProps, DialogTriggerProps, } from "./dialog/dialog.js";
export { Dialog } from "./dialog/dialog.js";
export type { OverlayFocusTarget, OverlayInteractionType, } from "./dialog/overlay-focus.js";
export { usePortalContainer } from "./dialog/use-portal-container.js";
export type { DirectionProviderProps } from "./direction-provider/direction-provider.js";
export { DirectionProvider } from "./direction-provider/direction-provider.js";
export type { DrawerCloseProps, DrawerContentProps, DrawerDescriptionProps, DrawerRootProps, DrawerSide, DrawerTitleProps, DrawerTriggerProps, } from "./drawer/drawer.js";
export { Drawer } from "./drawer/drawer.js";
export type { EmptyStateClassNames, EmptyStateProps, } from "./empty-state/empty-state.js";
export { EmptyState } from "./empty-state/empty-state.js";
export type { ErrorBoundaryClassNames, ErrorBoundaryFallback, ErrorBoundaryProps, } from "./error-boundary/error-boundary.js";
export { ErrorBoundary } from "./error-boundary/error-boundary.js";
export type { FieldRootProps } from "./field/field.js";
export { Field } from "./field/field.js";
export type { FieldContextValue } from "./field/field-context.js";
export { useFieldContext, useFieldControlId, } from "./field/field-context.js";
export type { FieldDescriptionProps } from "./field/field-description.js";
export type { FieldErrorProps } from "./field/field-error.js";
export type { FieldLabelProps } from "./field/field-label.js";
export type { FieldsetLegendProps, FieldsetRootProps, } from "./fieldset/fieldset.js";
export { Fieldset } from "./fieldset/fieldset.js";
export type { FileUploadProps } from "./file-upload/file-upload.js";
export { FileUpload } from "./file-upload/file-upload.js";
export type { GridAlign, GridColumns, GridGap, GridProps, } from "./grid/grid.js";
export { Grid } from "./grid/grid.js";
export type { HeadingProps, HeadingSectionProps, HeadingTag, } from "./heading/heading.js";
export { Heading, HeadingSection } from "./heading/heading.js";
export type { InputProps, InputSize } from "./input/input.js";
export { Input } from "./input/input.js";
export type { InputGroupAddonAlign, InputGroupAddonProps, InputGroupInputProps, InputGroupRootProps, } from "./input-group/input-group.js";
export { InputGroup } from "./input-group/input-group.js";
export type { KbdProps, KbdSize } from "./kbd/kbd.js";
export { Kbd } from "./kbd/kbd.js";
export type { LinkProps } from "./link/link.js";
export { Link } from "./link/link.js";
export type { ListItemProps, ListRootProps, ListVariant } from "./list/list.js";
export { List } from "./list/list.js";
export type { LiveRegionProps } from "./live-region/live-region.js";
export { LiveRegion } from "./live-region/live-region.js";
export type { MenuCheckboxItemProps, MenuContentProps, MenuGroupLabelProps, MenuGroupProps, MenuItemProps, MenuLinkItemProps, MenuRadioGroupProps, MenuRadioItemProps, MenuRootProps, MenuSeparatorProps, MenuShortcutProps, MenuSubmenuProps, MenuSubmenuTriggerProps, MenuTriggerProps, } from "./menu/menu.js";
export { Menu } from "./menu/menu.js";
export type { MenubarOrientation, MenubarProps, } from "./menubar/menubar.js";
export { Menubar } from "./menubar/menubar.js";
export type { MeterProps, MeterVariant } from "./meter/meter.js";
export { Meter } from "./meter/meter.js";
export type { NavigationMenuAlign, NavigationMenuContentProps, NavigationMenuItemProps, NavigationMenuLinkProps, NavigationMenuListProps, NavigationMenuRootProps, NavigationMenuSide, NavigationMenuTriggerProps, NavigationMenuViewportProps, } from "./navigation-menu/navigation-menu.js";
export { NavigationMenu } from "./navigation-menu/navigation-menu.js";
export type { NumberFieldProps, NumberFieldSize, } from "./number-field/number-field.js";
export { NumberField } from "./number-field/number-field.js";
export type { OTPFieldProps } from "./otp-field/otp-field.js";
export { OTPField } from "./otp-field/otp-field.js";
export type { PageHeaderActionsProps, PageHeaderBreadcrumbProps, PageHeaderDescriptionProps, PageHeaderRootProps, PageHeaderTabsProps, PageHeaderTitleProps, } from "./page-header/page-header.js";
export { PageHeader } from "./page-header/page-header.js";
export type { PaginationProps } from "./pagination/pagination.js";
export { Pagination } from "./pagination/pagination.js";
export type { PasswordInputProps } from "./password-input/password-input.js";
export { PasswordInput } from "./password-input/password-input.js";
export type { PopconfirmConfirmVariant, PopconfirmProps, } from "./popconfirm/popconfirm.js";
export { Popconfirm } from "./popconfirm/popconfirm.js";
export type { PopoverCloseProps, PopoverContentProps, PopoverDescriptionProps, PopoverRootProps, PopoverSide, PopoverTitleProps, PopoverTriggerProps, } from "./popover/popover.js";
export { Popover } from "./popover/popover.js";
export type { PreviewCardContentProps, PreviewCardRootProps, PreviewCardSide, PreviewCardTriggerProps, } from "./preview-card/preview-card.js";
export { PreviewCard } from "./preview-card/preview-card.js";
export type { ProgressProps } from "./progress/progress.js";
export { Progress } from "./progress/progress.js";
export type { RadioCardProps } from "./radio-card/radio-card.js";
export { RadioCard } from "./radio-card/radio-card.js";
export type { RadioGroupItemProps, RadioGroupProps, } from "./radio-group/radio-group.js";
export { RadioGroup } from "./radio-group/radio-group.js";
export type { RelativeTimeFormat, RelativeTimeProps, } from "./relative-time/relative-time.js";
export { RelativeTime } from "./relative-time/relative-time.js";
export type { ResizableHandleProps, ResizableOrientation, ResizablePanelProps, ResizableRootProps, } from "./resizable/resizable.js";
export { Resizable } from "./resizable/resizable.js";
export type { ScrollAreaOrientation, ScrollAreaProps, } from "./scroll-area/scroll-area.js";
export { ScrollArea } from "./scroll-area/scroll-area.js";
export type { SearchInputProps } from "./search-input/search-input.js";
export { SearchInput } from "./search-input/search-input.js";
export type { SegmentedControlItemProps, SegmentedControlRootProps, SegmentedControlSize, } from "./segmented-control/segmented-control.js";
export { SegmentedControl } from "./segmented-control/segmented-control.js";
export type { SelectContentProps, SelectGroupLabelProps, SelectGroupProps, SelectItemProps, SelectRootProps, SelectSeparatorProps, SelectSize, SelectTriggerProps, SelectValueProps, } from "./select/select.js";
export { Select } from "./select/select.js";
export type { SeparatorOrientation, SeparatorProps, } from "./separator/separator.js";
export { Separator } from "./separator/separator.js";
export type { ChangeEventDetails } from "./shared/change-event-details.js";
export type { SidebarContentProps, SidebarFooterProps, SidebarGroupLabelProps, SidebarGroupProps, SidebarHeaderProps, SidebarInsetProps, SidebarItemProps, SidebarProviderProps, SidebarRootProps, SidebarTriggerProps, UseSidebarResult, } from "./sidebar/sidebar.js";
export { Sidebar, useSidebar } from "./sidebar/sidebar.js";
export type { SkeletonProps, SkeletonVariant } from "./skeleton/skeleton.js";
export { Skeleton } from "./skeleton/skeleton.js";
export type { SliderProps, SliderValue } from "./slider/slider.js";
export { Slider } from "./slider/slider.js";
export type { SpinnerProps, SpinnerSize } from "./spinner/spinner.js";
export { Spinner } from "./spinner/spinner.js";
export type { SplitButtonProps } from "./split-button/split-button.js";
export { SplitButton } from "./split-button/split-button.js";
export type { StackAlign, StackDirection, StackGap, StackJustify, StackProps, } from "./stack/stack.js";
export { Stack } from "./stack/stack.js";
export type { StatProps, StatTone, StatTrend } from "./stat/stat.js";
export { Stat } from "./stat/stat.js";
export type { StatusIndicatorProps, StatusIndicatorVariant, } from "./status-indicator/status-indicator.js";
export { StatusIndicator } from "./status-indicator/status-indicator.js";
export type { StepperOrientation, StepperProps, StepperStep, } from "./stepper/stepper.js";
export { Stepper } from "./stepper/stepper.js";
export type { SwitchProps, SwitchSize } from "./switch/switch.js";
export { Switch } from "./switch/switch.js";
export type { TableBodyProps, TableCaptionProps, TableCellProps, TableExpandButtonProps, TableExpandedRowProps, TableFooterProps, TableHeaderProps, TableHeadProps, TableRootProps, TableRowProps, TableSortDirection, } from "./table/table.js";
export { Table } from "./table/table.js";
export type { TabsListProps, TabsPanelProps, TabsRootProps, TabsSize, TabsTabProps, } from "./tabs/tabs.js";
export { Tabs } from "./tabs/tabs.js";
export type { TagProps, TagSize, TagVariant } from "./tag/tag.js";
export { Tag } from "./tag/tag.js";
export type { TagGroupItemProps, TagGroupRootProps, } from "./tag-group/tag-group.js";
export { TagGroup } from "./tag-group/tag-group.js";
export type { TagInputProps, TagInputRejectReason, } from "./tag-input/tag-input.js";
export { TagInput } from "./tag-input/tag-input.js";
export type { TagOverflowItem, TagOverflowProps, } from "./tag-overflow/tag-overflow.js";
export { TagOverflow } from "./tag-overflow/tag-overflow.js";
export type { TextProps, TextSize, TextTag, TextTone, TextWeight, } from "./text/text.js";
export { Text } from "./text/text.js";
export type { TextareaProps, TextareaSize } from "./textarea/textarea.js";
export { Textarea } from "./textarea/textarea.js";
export type { ThemeProps, ThemeValues } from "./theme/theme.js";
export { Theme, useTheme } from "./theme/theme.js";
export type { TimePickerProps } from "./time-picker/time-picker.js";
export { TimePicker } from "./time-picker/time-picker.js";
export type { TimelineBadgeProps, TimelineBadgeVariant, TimelineBodyProps, TimelineItemProps, TimelineRootProps, } from "./timeline/timeline.js";
export { Timeline } from "./timeline/timeline.js";
export type { ToastActionOptions, ToastOptions, ToastProviderProps, ToastVariant, UseToastResult, } from "./toast/toast.js";
export { Toast, useToast } from "./toast/toast.js";
export type { ToggleProps } from "./toggle/toggle.js";
export { Toggle } from "./toggle/toggle.js";
export type { ToggleGroupOrientation, ToggleGroupProps, } from "./toggle-group/toggle-group.js";
export { ToggleGroup } from "./toggle-group/toggle-group.js";
export type { ToolbarButtonProps, ToolbarGroupProps, ToolbarLinkProps, ToolbarOrientation, ToolbarRootProps, ToolbarSeparatorProps, } from "./toolbar/toolbar.js";
export { Toolbar } from "./toolbar/toolbar.js";
export type { TooltipProps, TooltipProviderProps, TooltipSide, } from "./tooltip/tooltip.js";
export { Tooltip } from "./tooltip/tooltip.js";
export type { TreeViewNode, TreeViewProps, } from "./tree-view/tree-view.js";
export { TreeView } from "./tree-view/tree-view.js";
export type { TruncatedTextProps } from "./truncated-text/truncated-text.js";
export { TruncatedText } from "./truncated-text/truncated-text.js";
export type { VisuallyHiddenProps } from "./visually-hidden/visually-hidden.js";
export { VisuallyHidden } from "./visually-hidden/visually-hidden.js";


// ---- input-group/input-group.d.ts ----
import type { HTMLAttributes, InputHTMLAttributes, ReactNode, Ref } from "react";
export interface InputGroupRootProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    invalid?: boolean;
    children?: ReactNode;
}
declare function InputGroupRoot({ ref, invalid, className, ...rest }: InputGroupRootProps): import("react").JSX.Element;
export type InputGroupAddonAlign = "start" | "end";
export interface InputGroupAddonProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    align?: InputGroupAddonAlign;
    children?: ReactNode;
}
declare function InputGroupAddon({ ref, align, className, ...rest }: InputGroupAddonProps): import("react").JSX.Element;
export interface InputGroupInputProps extends InputHTMLAttributes<HTMLInputElement> {
    ref?: Ref<HTMLInputElement>;
    invalid?: boolean;
}
declare function InputGroupInput({ ref, invalid, disabled, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: InputGroupInputProps): import("react").JSX.Element;
export declare const InputGroup: typeof InputGroupRoot & {
    Addon: typeof InputGroupAddon;
    Input: typeof InputGroupInput;
};
export {};


// ---- input/input.d.ts ----
import type { InputHTMLAttributes, Ref } from "react";
export type InputSize = "small" | "medium" | "large";
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    ref?: Ref<HTMLInputElement>;
    invalid?: boolean;
    size?: InputSize;
}
export declare function Input({ ref, invalid, size, disabled, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: InputProps): import("react").JSX.Element;


// ---- kbd/kbd.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type KbdSize = "sm" | "md";
export interface KbdProps extends HTMLAttributes<HTMLElement> {
    ref?: Ref<HTMLElement>;
    size?: KbdSize;
    children?: ReactNode;
}
export declare function Kbd({ ref, size, className, ...rest }: KbdProps): import("react").JSX.Element;


// ---- link/link.d.ts ----
import type { AnchorHTMLAttributes, ReactElement, ReactNode, Ref } from "react";
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    ref?: Ref<HTMLAnchorElement>;
    render?: ReactElement;
    children?: ReactNode;
}
export declare function Link({ ref, render, className, ...rest }: LinkProps): import("react").JSX.Element | null;


// ---- list/list.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type ListVariant = "plain" | "contained";
export interface ListRootProps extends HTMLAttributes<HTMLUListElement> {
    ref?: Ref<HTMLUListElement>;
    variant?: ListVariant;
    children?: ReactNode;
}
declare function ListRoot({ variant, className, ...rest }: ListRootProps): import("react").JSX.Element;
export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
    ref?: Ref<HTMLLIElement>;
    leading?: ReactNode;
    trailing?: ReactNode;
    children?: ReactNode;
}
declare function ListItem({ leading, trailing, className, children, ...rest }: ListItemProps): import("react").JSX.Element;
export declare const List: typeof ListRoot & {
    Item: typeof ListItem;
};
export {};


// ---- live-region/live-region.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export interface LiveRegionProps extends Omit<HTMLAttributes<HTMLSpanElement>, "aria-atomic" | "aria-live"> {
    ref?: Ref<HTMLSpanElement>;
    politeness?: "polite" | "assertive";
    atomic?: boolean;
}
export declare function LiveRegion({ politeness, atomic, ...rest }: LiveRegionProps): import("react").JSX.Element;


// ---- menu/menu.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export interface MenuRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
    children?: ReactNode;
}
declare function MenuRoot({ open, defaultOpen, onOpenChange, ...rest }: MenuRootProps): import("react").JSX.Element;
export interface MenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    children?: ReactNode;
}
declare function MenuTrigger({ render, className, ...rest }: MenuTriggerProps): import("react").JSX.Element;
export type MenuSide = "top" | "right" | "bottom" | "left";
export type MenuAlign = "start" | "center" | "end";
export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    finalFocus?: OverlayFocusTarget;
    side?: MenuSide;
    sideOffset?: number;
    align?: MenuAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<MenuSide, number>>;
    children?: ReactNode;
}
declare function MenuContent({ side, sideOffset, align, alignOffset, collisionPadding, className, children, ...rest }: MenuContentProps): import("react").JSX.Element;
export interface MenuGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function MenuGroup(props: MenuGroupProps): import("react").JSX.Element;
export interface MenuGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function MenuGroupLabel({ className, ...rest }: MenuGroupLabelProps): import("react").JSX.Element;
export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    render?: ReactElement;
    nativeButton?: boolean;
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuItem({ className, ...rest }: MenuItemProps): import("react").JSX.Element;
export interface MenuCheckboxItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    ref?: Ref<HTMLDivElement>;
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuCheckboxItem({ checked, defaultChecked, onCheckedChange, disabled, className, children, ...rest }: MenuCheckboxItemProps): import("react").JSX.Element;
export interface MenuRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    ref?: Ref<HTMLDivElement>;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuRadioGroup({ value, defaultValue, onValueChange, disabled, ...rest }: MenuRadioGroupProps): import("react").JSX.Element;
export interface MenuRadioItemProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    value: string;
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuRadioItem({ value, disabled, className, children, ...rest }: MenuRadioItemProps): import("react").JSX.Element;
export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
}
declare function MenuSeparator({ className, ...rest }: MenuSeparatorProps): import("react").JSX.Element;
export interface MenuShortcutProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    children?: ReactNode;
}
declare function MenuShortcut({ className, ...rest }: MenuShortcutProps): import("react").JSX.Element;
export interface MenuSubmenuProps {
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuSubmenu(props: MenuSubmenuProps): import("react").JSX.Element;
export interface MenuSubmenuTriggerProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    render?: ReactElement;
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuSubmenuTrigger({ className, ...rest }: MenuSubmenuTriggerProps): import("react").JSX.Element;
export interface MenuLinkItemProps extends Omit<HTMLAttributes<HTMLAnchorElement>, "href"> {
    ref?: Ref<HTMLAnchorElement>;
    href?: string;
    closeOnClick?: boolean;
    children?: ReactNode;
}
declare function MenuLinkItem({ className, ...rest }: MenuLinkItemProps): import("react").JSX.Element;
export declare const Menu: typeof MenuRoot & {
    Trigger: typeof MenuTrigger;
    Content: typeof MenuContent;
    Group: typeof MenuGroup;
    GroupLabel: typeof MenuGroupLabel;
    Item: typeof MenuItem;
    LinkItem: typeof MenuLinkItem;
    CheckboxItem: typeof MenuCheckboxItem;
    RadioGroup: typeof MenuRadioGroup;
    RadioItem: typeof MenuRadioItem;
    Separator: typeof MenuSeparator;
    Shortcut: typeof MenuShortcut;
    Submenu: typeof MenuSubmenu;
    SubmenuTrigger: typeof MenuSubmenuTrigger;
};
export {};


// ---- menubar/menubar.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type MenubarOrientation = "horizontal" | "vertical";
export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    modal?: boolean;
    disabled?: boolean;
    orientation?: MenubarOrientation;
    loopFocus?: boolean;
    children?: ReactNode;
}
export declare function Menubar({ className, ...rest }: MenubarProps): import("react").JSX.Element;


// ---- meter/meter.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type MeterVariant = "default" | "success" | "warning" | "danger";
export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    ref?: Ref<HTMLDivElement>;
    value: number;
    min?: number;
    max?: number;
    label?: ReactNode;
    showValue?: boolean;
    variant?: MeterVariant;
}
export declare function Meter({ ref, value, min, max, label, showValue, variant, className, ...rest }: MeterProps): import("react").JSX.Element;


// ---- navigation-menu/navigation-menu.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export interface NavigationMenuRootProps<Value = unknown> extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "value" | "defaultValue"> {
    ref?: Ref<HTMLElement>;
    value?: Value | null;
    defaultValue?: Value | null;
    onValueChange?: (value: Value | null, eventDetails?: ChangeEventDetails) => void;
    delay?: number;
    closeDelay?: number;
    children?: ReactNode;
}
declare function NavigationMenuRoot<Value = unknown>({ value, defaultValue, onValueChange, className, ...rest }: NavigationMenuRootProps<Value>): import("react").JSX.Element;
export interface NavigationMenuListProps extends HTMLAttributes<HTMLUListElement> {
    ref?: Ref<HTMLUListElement>;
    children?: ReactNode;
}
declare function NavigationMenuList({ className, ...rest }: NavigationMenuListProps): import("react").JSX.Element;
export interface NavigationMenuItemProps extends HTMLAttributes<HTMLLIElement> {
    ref?: Ref<HTMLLIElement>;
    value?: unknown;
    children?: ReactNode;
}
declare function NavigationMenuItem({ className, ...rest }: NavigationMenuItemProps): import("react").JSX.Element;
export interface NavigationMenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    disabled?: boolean;
    children?: ReactNode;
}
declare function NavigationMenuTrigger({ className, ...rest }: NavigationMenuTriggerProps): import("react").JSX.Element;
export interface NavigationMenuLinkProps extends Omit<HTMLAttributes<HTMLAnchorElement>, "href"> {
    ref?: Ref<HTMLAnchorElement>;
    render?: ReactElement;
    href?: string;
    active?: boolean;
    closeOnClick?: boolean;
    children?: ReactNode;
}
declare function NavigationMenuLink({ className, ...rest }: NavigationMenuLinkProps): import("react").JSX.Element;
export interface NavigationMenuContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function NavigationMenuContent({ className, ...rest }: NavigationMenuContentProps): import("react").JSX.Element;
export type NavigationMenuSide = "top" | "right" | "bottom" | "left";
export type NavigationMenuAlign = "start" | "center" | "end";
export interface NavigationMenuViewportProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    side?: NavigationMenuSide;
    sideOffset?: number;
    align?: NavigationMenuAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<NavigationMenuSide, number>>;
}
declare function NavigationMenuViewport({ className, side, sideOffset, align, alignOffset, collisionPadding, ...rest }: NavigationMenuViewportProps): import("react").JSX.Element;
export declare const NavigationMenu: typeof NavigationMenuRoot & {
    List: typeof NavigationMenuList;
    Item: typeof NavigationMenuItem;
    Trigger: typeof NavigationMenuTrigger;
    Link: typeof NavigationMenuLink;
    Content: typeof NavigationMenuContent;
    Viewport: typeof NavigationMenuViewport;
};
export {};


// ---- number-field/number-field.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export type NumberFieldSize = "small" | "medium" | "large";
export interface NumberFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> {
    ref?: Ref<HTMLDivElement>;
    value?: number | null;
    defaultValue?: number;
    onValueChange?: (value: number | null) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    invalid?: boolean;
    size?: NumberFieldSize;
    name?: string;
    placeholder?: string;
    decrementLabel?: string;
    incrementLabel?: string;
}
export declare function NumberField({ ref, value, defaultValue, onValueChange, min, max, step, disabled, readOnly, required, invalid, size, name, placeholder, decrementLabel, incrementLabel, id, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: NumberFieldProps): import("react").JSX.Element;


// ---- otp-field/otp-field.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export interface OTPFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> {
    ref?: Ref<HTMLDivElement>;
    length?: number;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onValueComplete?: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    mask?: boolean;
    invalid?: boolean;
    name?: string;
    getSlotDescription?: (position: number, length: number) => string;
}
export declare function OTPField({ ref, length, value, defaultValue, onValueChange, onValueComplete, disabled, required, mask, invalid, name, getSlotDescription, id, className, "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: OTPFieldProps): import("react").JSX.Element;


// ---- page-header/page-header.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface PageHeaderRootProps extends HTMLAttributes<HTMLElement> {
    ref?: Ref<HTMLElement>;
    children?: ReactNode;
}
export interface PageHeaderBreadcrumbProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
export interface PageHeaderTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    ref?: Ref<HTMLHeadingElement>;
    children?: ReactNode;
}
export interface PageHeaderDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: Ref<HTMLParagraphElement>;
    children?: ReactNode;
}
export interface PageHeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
export interface PageHeaderTabsProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function PageHeaderRoot({ ref, className, ...rest }: PageHeaderRootProps): import("react").JSX.Element;
declare function PageHeaderBreadcrumb({ ref, className, ...rest }: PageHeaderBreadcrumbProps): import("react").JSX.Element;
declare function PageHeaderTitle({ ref, as: Heading, className, ...rest }: PageHeaderTitleProps): import("react").JSX.Element;
declare function PageHeaderDescription({ ref, className, ...rest }: PageHeaderDescriptionProps): import("react").JSX.Element;
declare function PageHeaderActions({ ref, className, ...rest }: PageHeaderActionsProps): import("react").JSX.Element;
declare function PageHeaderTabs({ ref, className, ...rest }: PageHeaderTabsProps): import("react").JSX.Element;
export declare const PageHeader: typeof PageHeaderRoot & {
    Breadcrumb: typeof PageHeaderBreadcrumb;
    Title: typeof PageHeaderTitle;
    Description: typeof PageHeaderDescription;
    Actions: typeof PageHeaderActions;
    Tabs: typeof PageHeaderTabs;
};
export {};


// ---- pagination/pagination.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    ref?: Ref<HTMLElement>;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    previousLabel?: string;
    nextLabel?: string;
}
export declare function Pagination({ ref, page, totalPages, onPageChange, siblingCount, previousLabel, nextLabel, "aria-label": ariaLabel, className, ...rest }: PaginationProps): import("react").JSX.Element;


// ---- password-input/password-input.d.ts ----
import type { InputHTMLAttributes, Ref } from "react";
export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    ref?: Ref<HTMLInputElement>;
    visible?: boolean;
    defaultVisible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    showLabel?: string;
    hideLabel?: string;
    invalid?: boolean;
}
export declare function PasswordInput({ ref, visible, defaultVisible, onVisibleChange, showLabel, hideLabel, invalid, className, ...rest }: PasswordInputProps): import("react").JSX.Element;


// ---- popconfirm/popconfirm.d.ts ----
import { type HTMLAttributes, type ReactElement, type ReactNode, type Ref } from "react";
import { type PopoverAlign, type PopoverSide } from "../popover/popover.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export type PopconfirmConfirmVariant = "primary" | "danger";
export interface PopconfirmProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
    ref?: Ref<HTMLDivElement>;
    title: ReactNode;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: PopconfirmConfirmVariant;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
    side?: PopoverSide;
    sideOffset?: number;
    align?: PopoverAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<PopoverSide, number>>;
    children: ReactElement;
}
export declare function Popconfirm({ ref, title, description, confirmLabel, cancelLabel, confirmVariant, onConfirm, onCancel, open, defaultOpen, onOpenChange, side, sideOffset, align, alignOffset, collisionPadding, className, children, ...rest }: PopconfirmProps): import("react").JSX.Element;


// ---- popover/popover.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export interface PopoverRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
    children?: ReactNode;
}
declare function PopoverRoot({ open, defaultOpen, onOpenChange, ...rest }: PopoverRootProps): import("react").JSX.Element;
export interface PopoverTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    children?: ReactNode;
}
declare function PopoverTrigger({ render, className, ...rest }: PopoverTriggerProps): import("react").JSX.Element;
export type PopoverSide = "top" | "right" | "bottom" | "left";
export type PopoverAlign = "start" | "center" | "end";
export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    side?: PopoverSide;
    sideOffset?: number;
    align?: PopoverAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<PopoverSide, number>>;
    initialFocus?: OverlayFocusTarget;
    finalFocus?: OverlayFocusTarget;
    children?: ReactNode;
}
declare function PopoverContent({ side, sideOffset, align, alignOffset, collisionPadding, className, children, ...rest }: PopoverContentProps): import("react").JSX.Element;
export interface PopoverTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    ref?: Ref<HTMLHeadingElement>;
    children?: ReactNode;
}
declare function PopoverTitle({ className, ...rest }: PopoverTitleProps): import("react").JSX.Element;
export interface PopoverDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: Ref<HTMLParagraphElement>;
    children?: ReactNode;
}
declare function PopoverDescription({ className, ...rest }: PopoverDescriptionProps): import("react").JSX.Element;
export interface PopoverCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    children?: ReactNode;
}
declare function PopoverClose({ render, className, ...rest }: PopoverCloseProps): import("react").JSX.Element;
export declare const Popover: typeof PopoverRoot & {
    Trigger: typeof PopoverTrigger;
    Content: typeof PopoverContent;
    Title: typeof PopoverTitle;
    Description: typeof PopoverDescription;
    Close: typeof PopoverClose;
};
export {};


// ---- preview-card/preview-card.d.ts ----
import type { AnchorHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
export interface PreviewCardRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function PreviewCardRoot({ open, defaultOpen, onOpenChange, ...rest }: PreviewCardRootProps): import("react").JSX.Element;
export interface PreviewCardTriggerProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    ref?: Ref<HTMLAnchorElement>;
    render?: ReactElement;
    delay?: number;
    closeDelay?: number;
    children?: ReactNode;
}
declare function PreviewCardTrigger({ className, ...rest }: PreviewCardTriggerProps): import("react").JSX.Element;
export type PreviewCardSide = "top" | "right" | "bottom" | "left";
export type PreviewCardAlign = "start" | "center" | "end";
export interface PreviewCardContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    side?: PreviewCardSide;
    sideOffset?: number;
    align?: PreviewCardAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<PreviewCardSide, number>>;
    children?: ReactNode;
}
declare function PreviewCardContent({ side, sideOffset, align, alignOffset, collisionPadding, className, children, ...rest }: PreviewCardContentProps): import("react").JSX.Element;
export declare const PreviewCard: typeof PreviewCardRoot & {
    Trigger: typeof PreviewCardTrigger;
    Content: typeof PreviewCardContent;
};
export {};


// ---- progress/progress.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    ref?: Ref<HTMLDivElement>;
    value: number | null;
    min?: number;
    max?: number;
    label?: ReactNode;
    showValue?: boolean;
}
export declare function Progress({ ref, value, min, max, label, showValue, className, ...rest }: ProgressProps): import("react").JSX.Element;


// ---- radio-card/radio-card.d.ts ----
import type { ReactNode } from "react";
import { type RadioGroupItemProps } from "../radio-group/radio-group.js";
export interface RadioCardProps<Value = string> extends RadioGroupItemProps<Value> {
    label: ReactNode;
    description?: ReactNode;
}
export declare function RadioCard<Value = string>({ label, description, className, children, ...rest }: RadioCardProps<Value>): import("react").JSX.Element;


// ---- radio-group/radio-group.d.ts ----
import type { HTMLAttributes, LabelHTMLAttributes, ReactNode, Ref } from "react";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export interface RadioGroupProps<Value = string> extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
    ref?: Ref<HTMLDivElement>;
    name?: string;
    value?: Value;
    defaultValue?: Value;
    onValueChange?: (value: Value, eventDetails?: ChangeEventDetails) => void;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    children?: ReactNode;
}
declare function RadioGroupRoot<Value = string>({ disabled, className, onValueChange, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: RadioGroupProps<Value>): import("react").JSX.Element;
export interface RadioGroupItemProps<Value = string> extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "value"> {
    ref?: Ref<HTMLLabelElement>;
    value: Value;
    disabled?: boolean;
    children?: ReactNode;
}
declare function RadioGroupItem<Value = string>({ value, disabled, className, children, ...rest }: RadioGroupItemProps<Value>): import("react").JSX.Element;
export declare const RadioGroup: typeof RadioGroupRoot & {
    Item: typeof RadioGroupItem;
};
export {};


// ---- relative-time/relative-time.d.ts ----
import type { ComponentPropsWithRef } from "react";
export type RelativeTimeFormat = "long" | "short" | "narrow";
export interface RelativeTimeProps extends Omit<ComponentPropsWithRef<"time">, "dateTime" | "children"> {
    date: Date | string | number;
    locale?: string;
    format?: RelativeTimeFormat;
    formatter?: (elapsedMilliseconds: number) => string;
    numeric?: "always" | "auto";
    refreshInterval?: number;
    now?: Date | number;
    showTitle?: boolean;
}
export declare function RelativeTime({ ref, date, locale, format, formatter, numeric, refreshInterval, now, showTitle, title, className, ...rest }: RelativeTimeProps): import("react").JSX.Element;


// ---- resizable/resizable.d.ts ----
import { type HTMLAttributes, type ReactNode, type Ref } from "react";
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
declare function ResizablePanel({ ref, defaultSize: _defaultSize, minSize: _minSize, maxSize: _maxSize, collapsible: _collapsible, collapsedSize: _collapsedSize, onCollapse: _onCollapse, className, style, children, ...rest }: ResizablePanelProps): import("react").JSX.Element;
declare function ResizableHandle({ ref, disabled, withHandle, step, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, onKeyDown, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onLostPointerCapture, children, ...rest }: ResizableHandleProps): import("react").JSX.Element;
declare function ResizableRoot({ ref, orientation, onLayout, className, children, ...rest }: ResizableRootProps): import("react").JSX.Element;
export declare const Resizable: typeof ResizableRoot & {
    Panel: typeof ResizablePanel;
    Handle: typeof ResizableHandle;
};
export {};


// ---- scroll-area/scroll-area.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    orientation?: ScrollAreaOrientation;
    maxHeight?: number | string;
    children?: ReactNode;
}
export declare function ScrollArea({ ref, orientation, maxHeight, className, style, children, ...rest }: ScrollAreaProps): import("react").JSX.Element;


// ---- search-input/search-input.d.ts ----
import type { InputHTMLAttributes, Ref } from "react";
export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
    ref?: Ref<HTMLInputElement>;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onClear?: () => void;
    clearLabel?: string;
    invalid?: boolean;
}
export declare function SearchInput({ ref, value, defaultValue, onValueChange, onClear, clearLabel, invalid, onKeyDown, className, ...rest }: SearchInputProps): import("react").JSX.Element;


// ---- segmented-control/segmented-control.d.ts ----
import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, type Ref } from "react";
export type SegmentedControlSize = "small" | "medium" | "large";
export interface SegmentedControlRootProps<Value extends string = string> extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    ref?: Ref<HTMLDivElement>;
    value?: Value;
    defaultValue?: Value;
    onValueChange?: (value: Value) => void;
    size?: SegmentedControlSize;
    fullWidth?: boolean;
    disabled?: boolean;
    children?: ReactNode;
}
export interface SegmentedControlItemProps<Value extends string = string> extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
    ref?: Ref<HTMLButtonElement>;
    value: Value;
    icon?: ReactNode;
    disabled?: boolean;
    children?: ReactNode;
}
declare function SegmentedControlRoot<Value extends string = string>({ ref, value, defaultValue, onValueChange, size, fullWidth, disabled, "aria-disabled": ariaDisabled, className, children, ...rest }: SegmentedControlRootProps<Value>): import("react").JSX.Element;
declare function SegmentedControlItem<Value extends string = string>({ ref, value, icon, disabled, type, className, onClick, onKeyDown, children, ...rest }: SegmentedControlItemProps<Value>): import("react").JSX.Element;
export declare const SegmentedControl: typeof SegmentedControlRoot & {
    Item: typeof SegmentedControlItem;
};
export {};


// ---- select/select.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
type SelectValueType<Value, Multiple extends boolean | undefined> = Multiple extends true ? Value[] : Value;
export interface SelectRootProps<Value = unknown, Multiple extends boolean | undefined = false> {
    value?: SelectValueType<Value, Multiple>;
    defaultValue?: SelectValueType<Value, Multiple>;
    onValueChange?: (value: SelectValueType<Value, Multiple> | (Multiple extends true ? never : null), eventDetails?: ChangeEventDetails) => void;
    multiple?: Multiple;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    name?: string;
    items?: Record<string, ReactNode> | ReadonlyArray<{
        label: ReactNode;
        value: Value;
    }>;
    children?: ReactNode;
}
declare function SelectRoot<Value = unknown, Multiple extends boolean | undefined = false>({ disabled, onValueChange, open, defaultOpen, onOpenChange, ...rest }: SelectRootProps<Value, Multiple>): import("react").JSX.Element;
export type SelectSize = "small" | "medium" | "large";
export interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    nativeButton?: boolean;
    size?: SelectSize;
    children?: ReactNode;
}
declare function SelectTrigger({ id, className, size, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, children, ...rest }: SelectTriggerProps): import("react").JSX.Element;
export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    placeholder?: string;
}
declare function SelectValue({ placeholder, ...rest }: SelectValueProps): import("react").JSX.Element;
export type SelectSide = "top" | "right" | "bottom" | "left";
export type SelectAlign = "start" | "center" | "end";
export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    finalFocus?: OverlayFocusTarget;
    side?: SelectSide;
    sideOffset?: number;
    align?: SelectAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<SelectSide, number>>;
    children?: ReactNode;
}
declare function SelectContent({ className, finalFocus, side, sideOffset, align, alignOffset, collisionPadding, children, ...rest }: SelectContentProps): import("react").JSX.Element;
export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    value: unknown;
    disabled?: boolean;
    children?: ReactNode;
}
declare function SelectItem({ className, children, ...rest }: SelectItemProps): import("react").JSX.Element;
export interface SelectGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function SelectGroup(props: SelectGroupProps): import("react").JSX.Element;
export interface SelectGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function SelectGroupLabel({ className, ...rest }: SelectGroupLabelProps): import("react").JSX.Element;
export interface SelectSeparatorProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
}
declare function SelectSeparator({ className, ...rest }: SelectSeparatorProps): import("react").JSX.Element;
export declare const Select: typeof SelectRoot & {
    Trigger: typeof SelectTrigger;
    Value: typeof SelectValue;
    Content: typeof SelectContent;
    Item: typeof SelectItem;
    Group: typeof SelectGroup;
    GroupLabel: typeof SelectGroupLabel;
    Separator: typeof SelectSeparator;
};
export {};


// ---- separator/separator.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export type SeparatorOrientation = "horizontal" | "vertical";
export interface SeparatorProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    ref?: Ref<HTMLDivElement>;
    orientation?: SeparatorOrientation;
}
export declare function Separator({ ref, orientation, className, ...rest }: SeparatorProps): import("react").JSX.Element;


// ---- shared/change-event-details.d.ts ----
export interface ChangeEventDetails {
    reason: string;
    event: Event;
    cancel: () => void;
    isCanceled: boolean;
}


// ---- sidebar/sidebar.d.ts ----
import { type ButtonHTMLAttributes, type HTMLAttributes, type MouseEventHandler, type ReactElement, type ReactNode, type Ref } from "react";
export interface UseSidebarResult {
    open: boolean;
    setOpen: (open: boolean) => void;
    toggle: () => void;
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}
export declare function useSidebar(): UseSidebarResult;
export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    onMobileOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function SidebarProvider({ open, defaultOpen, onOpenChange, mobileOpen, defaultMobileOpen, onMobileOpenChange, className, children, ...rest }: SidebarProviderProps): import("react").JSX.Element;
export interface SidebarRootProps extends HTMLAttributes<HTMLElement> {
    ref?: Ref<HTMLElement>;
    mobileTitle?: string;
    children?: ReactNode;
}
declare function SidebarRoot({ mobileTitle, className, children, ...rest }: SidebarRootProps): import("react").JSX.Element;
export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function SidebarHeader({ className, ...rest }: SidebarHeaderProps): import("react").JSX.Element;
export interface SidebarContentProps extends HTMLAttributes<HTMLElement> {
    ref?: Ref<HTMLElement>;
    children?: ReactNode;
}
declare function SidebarContent({ className, ...rest }: SidebarContentProps): import("react").JSX.Element;
export interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function SidebarFooter({ className, ...rest }: SidebarFooterProps): import("react").JSX.Element;
export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function SidebarGroup({ className, ...rest }: SidebarGroupProps): import("react").JSX.Element;
export interface SidebarGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function SidebarGroupLabel({ className, ...rest }: SidebarGroupLabelProps): import("react").JSX.Element;
export interface SidebarItemProps extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
    ref?: Ref<HTMLAnchorElement> | Ref<HTMLButtonElement> | Ref<HTMLElement>;
    render?: ReactElement;
    nativeButton?: boolean;
    active?: boolean;
    icon?: ReactNode;
    href?: string;
    target?: string;
    rel?: string;
    disabled?: boolean;
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
    onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    children?: ReactNode;
}
declare function SidebarItem({ ref, render, nativeButton, active, icon, href, target, rel, disabled, type, className, children, onClick, onClickCapture, ...rest }: SidebarItemProps): import("react").JSX.Element | null;
export interface SidebarInsetProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
declare function SidebarInset({ className, ...rest }: SidebarInsetProps): import("react").JSX.Element;
export interface SidebarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    mobile?: boolean;
}
declare function SidebarTrigger({ mobile, className, onClick, "aria-label": ariaLabel, children, ...rest }: SidebarTriggerProps): import("react").JSX.Element;
export declare const Sidebar: typeof SidebarRoot & {
    Provider: typeof SidebarProvider;
    Header: typeof SidebarHeader;
    Content: typeof SidebarContent;
    Footer: typeof SidebarFooter;
    Group: typeof SidebarGroup;
    GroupLabel: typeof SidebarGroupLabel;
    Item: typeof SidebarItem;
    Inset: typeof SidebarInset;
    Trigger: typeof SidebarTrigger;
};
export {};


// ---- skeleton/skeleton.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export type SkeletonVariant = "text" | "rectangular" | "circular";
export interface SkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    ref?: Ref<HTMLSpanElement>;
    variant?: SkeletonVariant;
    width?: number | string;
    height?: number | string;
}
export declare function Skeleton({ ref, variant, width, height, style, className, ...rest }: SkeletonProps): import("react").JSX.Element;


// ---- slider/slider.d.ts ----
import { type HTMLAttributes, type Ref } from "react";
export type SliderValue = number | readonly number[];
export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> {
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
export declare function Slider({ ref, value, defaultValue, onValueChange, min, max, step, disabled, name, id, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: SliderProps): import("react").JSX.Element;


// ---- spinner/spinner.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export type SpinnerSize = "small" | "medium" | "large";
export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    ref?: Ref<HTMLSpanElement>;
    size?: SpinnerSize;
    label?: string;
}
export declare function Spinner({ ref, size, label, className, ...rest }: SpinnerProps): import("react").JSX.Element;


// ---- split-button/split-button.d.ts ----
import type { ReactNode } from "react";
import { type ButtonProps } from "../button/button.js";
export interface SplitButtonProps extends Omit<ButtonProps, "render" | "children"> {
    menuLabel?: string;
    menu: ReactNode;
    children?: ReactNode;
}
export declare function SplitButton({ menuLabel, variant, size, menu, children, className, ...rest }: SplitButtonProps): import("react").JSX.Element;


// ---- stack/stack.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type StackDirection = "vertical" | "horizontal";
export type StackGap = "none" | "sm" | "md" | "lg";
export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type StackJustify = "start" | "center" | "end" | "between";
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    direction?: StackDirection;
    gap?: StackGap;
    align?: StackAlign;
    justify?: StackJustify;
    wrap?: boolean;
    children?: ReactNode;
}
export declare function Stack({ ref, direction, gap, align, justify, wrap, className, ...rest }: StackProps): import("react").JSX.Element;


// ---- stat/stat.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type StatTrend = "up" | "down" | "neutral";
export type StatTone = "info" | "success" | "warning" | "danger";
export interface StatProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    label: ReactNode;
    value: ReactNode;
    delta?: ReactNode;
    trend?: StatTrend;
    tone?: StatTone;
    helpText?: ReactNode;
    children?: ReactNode;
}
export declare function Stat({ ref, label, value, delta, trend, tone, helpText, className, children, ...rest }: StatProps): import("react").JSX.Element;


// ---- status-indicator/status-indicator.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type StatusIndicatorVariant = "neutral" | "info" | "success" | "warning" | "danger" | "pending" | "loading";
export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    variant?: StatusIndicatorVariant;
    pulse?: boolean;
    icon?: ReactNode;
    children?: ReactNode;
}
export declare function StatusIndicator({ ref, variant, pulse, icon, className, children, ...rest }: StatusIndicatorProps): import("react").JSX.Element;


// ---- stepper/stepper.d.ts ----
import type { OlHTMLAttributes, ReactNode, Ref } from "react";
export type StepperOrientation = "horizontal" | "vertical";
export interface StepperStep {
    id: string;
    label: ReactNode;
    description?: ReactNode;
}
export interface StepperProps extends Omit<OlHTMLAttributes<HTMLOListElement>, "children"> {
    ref?: Ref<HTMLOListElement>;
    steps: readonly StepperStep[];
    currentStep: number;
    orientation?: StepperOrientation;
}
export declare function Stepper({ ref, steps, currentStep, orientation, className, ...rest }: StepperProps): import("react").JSX.Element;


// ---- switch/switch.d.ts ----
import type { HTMLAttributes, Ref } from "react";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export type SwitchSize = "small" | "medium" | "large";
export interface SwitchProps extends Omit<HTMLAttributes<HTMLElement>, "defaultChecked" | "onChange"> {
    ref?: Ref<HTMLElement>;
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean, eventDetails?: ChangeEventDetails) => void;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    name?: string;
    size?: SwitchSize;
}
export declare function Switch({ ref, onCheckedChange, disabled, size, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: SwitchProps): import("react").JSX.Element;


// ---- table/table.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
export type TableSortDirection = "ascending" | "descending" | "none";
export interface TableRootProps extends TableHTMLAttributes<HTMLTableElement> {
    ref?: Ref<HTMLTableElement>;
    wrapperClassName?: string;
    stickyHeader?: boolean;
}
export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
    ref?: Ref<HTMLTableSectionElement>;
    sticky?: boolean;
}
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
    ref?: Ref<HTMLTableSectionElement>;
}
export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {
    ref?: Ref<HTMLTableSectionElement>;
}
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
    ref?: Ref<HTMLTableRowElement>;
    selected?: boolean;
    expanded?: boolean;
}
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
    ref?: Ref<HTMLTableCellElement>;
    sortDirection?: TableSortDirection;
    onSort?: () => void;
}
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
    ref?: Ref<HTMLTableCellElement>;
}
export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {
    ref?: Ref<HTMLTableCaptionElement>;
}
export interface TableExpandButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    ref?: Ref<HTMLButtonElement>;
    expanded: boolean;
    expandLabel?: string;
    collapseLabel?: string;
}
export interface TableExpandedRowProps extends HTMLAttributes<HTMLTableRowElement> {
    ref?: Ref<HTMLTableRowElement>;
    colSpan: number;
    open?: boolean;
    cellClassName?: string;
    children?: ReactNode;
}
declare function TableRoot({ ref, className, wrapperClassName, stickyHeader, ...rest }: TableRootProps): import("react").JSX.Element;
declare function TableHeader({ sticky, className, ...rest }: TableHeaderProps): import("react").JSX.Element;
declare function TableBody({ className, ...rest }: TableBodyProps): import("react").JSX.Element;
declare function TableFooter({ className, ...rest }: TableFooterProps): import("react").JSX.Element;
declare function TableRow({ selected, expanded, className, ...rest }: TableRowProps): import("react").JSX.Element;
declare function TableHead({ scope, sortDirection, onSort, className, children, "aria-sort": ariaSort, ...rest }: TableHeadProps): import("react").JSX.Element;
declare function TableCell({ className, ...rest }: TableCellProps): import("react").JSX.Element;
declare function TableCaption({ className, ...rest }: TableCaptionProps): import("react").JSX.Element;
declare function TableExpandButton({ ref, expanded, expandLabel, collapseLabel, className, type, "aria-label": ariaLabel, ...rest }: TableExpandButtonProps): import("react").JSX.Element;
declare function TableExpandedRow({ ref, colSpan, open, className, cellClassName, children, ...rest }: TableExpandedRowProps): import("react").JSX.Element | null;
export declare const Table: typeof TableRoot & {
    Header: typeof TableHeader;
    Body: typeof TableBody;
    Footer: typeof TableFooter;
    Row: typeof TableRow;
    Head: typeof TableHead;
    Cell: typeof TableCell;
    Caption: typeof TableCaption;
    ExpandButton: typeof TableExpandButton;
    ExpandedRow: typeof TableExpandedRow;
};
export {};


// ---- tabs/tabs.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export type TabsOrientation = "horizontal" | "vertical";
export type TabsSize = "small" | "medium";
export interface TabsRootProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
    ref?: Ref<HTMLDivElement>;
    value?: unknown;
    defaultValue?: unknown;
    onValueChange?: (value: unknown, eventDetails?: ChangeEventDetails) => void;
    orientation?: TabsOrientation;
    children?: ReactNode;
}
declare function TabsRoot({ onValueChange, className, ...rest }: TabsRootProps): import("react").JSX.Element;
export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    activateOnFocus?: boolean;
    loopFocus?: boolean;
    children?: ReactNode;
}
declare function TabsList({ className, children, ...rest }: TabsListProps): import("react").JSX.Element;
export interface TabsTabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    nativeButton?: boolean;
    value: unknown;
    disabled?: boolean;
    size?: TabsSize;
    children?: ReactNode;
}
declare function TabsTab({ className, children, size, ...rest }: TabsTabProps): import("react").JSX.Element;
export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    value: unknown;
    keepMounted?: boolean;
    children?: ReactNode;
}
declare function TabsPanel({ className, children, ...rest }: TabsPanelProps): import("react").JSX.Element;
export declare const Tabs: typeof TabsRoot & {
    List: typeof TabsList;
    Tab: typeof TabsTab;
    Panel: typeof TabsPanel;
};
export {};


// ---- tag-group/tag-group.d.ts ----
import { type HTMLAttributes, type ReactNode, type Ref } from "react";
import type { TagVariant } from "../tag/tag.js";
export interface TagGroupRootProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    onRemove?: (value: string) => void;
    getRemoveLabel?: (label: string) => string;
    children?: ReactNode;
}
export interface TagGroupItemProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    value: string;
    variant?: TagVariant;
    removable?: boolean;
    onRemove?: () => void;
    removeLabel?: string;
    children?: ReactNode;
}
declare function TagGroupRoot({ ref, onRemove, getRemoveLabel, className, children, ...rest }: TagGroupRootProps): import("react").JSX.Element;
declare function TagGroupItem({ ref, value, variant, removable, onRemove, removeLabel, className, children, ...rest }: TagGroupItemProps): import("react").JSX.Element;
export declare const TagGroup: typeof TagGroupRoot & {
    Item: typeof TagGroupItem;
};
export {};


// ---- tag-input/tag-input.d.ts ----
import { type InputHTMLAttributes, type Ref } from "react";
export type TagInputRejectReason = "duplicate" | "invalid" | "max";
export interface TagInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
    ref?: Ref<HTMLInputElement>;
    value?: readonly string[];
    defaultValue?: readonly string[];
    onValueChange?: (value: string[]) => void;
    inputValue?: string;
    defaultInputValue?: string;
    onInputValueChange?: (inputValue: string) => void;
    suggestions?: readonly string[];
    delimiters?: readonly string[];
    allowDuplicates?: boolean;
    maxTags?: number;
    validate?: (tag: string) => boolean;
    onReject?: (tag: string, reason: TagInputRejectReason) => void;
    invalid?: boolean;
    getRemoveLabel?: (tag: string) => string;
    wrapperClassName?: string;
}
export declare function TagInput({ ref, value, defaultValue, onValueChange, inputValue, defaultInputValue, onInputValueChange, suggestions, delimiters, allowDuplicates, maxTags, validate, onReject, invalid, disabled, readOnly, id, className, wrapperClassName, getRemoveLabel, onKeyDown, onPaste, onFocus, onBlur, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: TagInputProps): import("react").JSX.Element;


// ---- tag-overflow/tag-overflow.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface TagOverflowItem {
    id: string;
    label: ReactNode;
}
export interface TagOverflowProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    items: readonly TagOverflowItem[];
    max?: number;
    renderItem?: (item: TagOverflowItem) => ReactNode;
    overflowLabel?: (count: number) => string;
    overflowAriaLabel?: (count: number) => string;
}
export declare function TagOverflow({ ref, items, max, renderItem, overflowLabel, overflowAriaLabel, className, ...rest }: TagOverflowProps): import("react").JSX.Element;


// ---- tag/tag.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type TagVariant = "neutral" | "info" | "success" | "warning" | "danger";
export type TagSize = "small" | "medium" | "large";
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    variant?: TagVariant;
    size?: TagSize;
    onRemove?: () => void;
    removeLabel?: string;
    children?: ReactNode;
}
export declare function Tag({ ref, variant, size, onRemove, removeLabel, className, children, ...rest }: TagProps): import("react").JSX.Element;


// ---- text/text.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type TextTag = "p" | "span" | "div" | "label";
export type TextSize = "100" | "200" | "300";
export type TextWeight = "regular" | "medium" | "bold";
export type TextTone = "default" | "muted" | "inverse";
export interface TextProps extends HTMLAttributes<HTMLElement> {
    ref?: Ref<HTMLElement>;
    as?: TextTag;
    size?: TextSize;
    weight?: TextWeight;
    tone?: TextTone;
    children?: ReactNode;
}
export declare function Text({ as, size, weight, tone, className, ...rest }: TextProps): import("react").JSX.Element;


// ---- textarea/textarea.d.ts ----
import type { Ref, TextareaHTMLAttributes } from "react";
export type TextareaSize = "small" | "medium" | "large";
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    ref?: Ref<HTMLTextAreaElement>;
    invalid?: boolean;
    size?: TextareaSize;
}
export declare function Textarea({ ref, invalid, size, disabled, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: TextareaProps): import("react").JSX.Element;


// ---- theme/theme.d.ts ----
import { type HTMLAttributes, type Ref } from "react";
export interface ThemeValues {
    brand?: string;
    colorScheme?: "light" | "dark";
    density?: "default" | "compact";
    contrast?: "default" | "more";
}
export interface ThemeProps extends HTMLAttributes<HTMLDivElement>, ThemeValues {
    ref?: Ref<HTMLDivElement>;
}
export declare function useTheme(): Readonly<ThemeValues>;
export declare function Theme({ brand, colorScheme, density, contrast, children, ...rest }: ThemeProps): import("react").JSX.Element;


// ---- time-picker/time-picker.d.ts ----
import type { InputHTMLAttributes, Ref } from "react";
export interface TimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
    ref?: Ref<HTMLInputElement>;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    min?: string;
    max?: string;
    step?: number;
    invalid?: boolean;
}
export declare function TimePicker({ ref, value, defaultValue, onValueChange, min, max, step, invalid, disabled, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: TimePickerProps): import("react").JSX.Element;


// ---- timeline/timeline.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type TimelineBadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";
export interface TimelineRootProps extends HTMLAttributes<HTMLOListElement> {
    ref?: Ref<HTMLOListElement>;
    children?: ReactNode;
}
export interface TimelineItemProps extends HTMLAttributes<HTMLLIElement> {
    ref?: Ref<HTMLLIElement>;
    children?: ReactNode;
}
export interface TimelineBadgeProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    variant?: TimelineBadgeVariant;
    children?: ReactNode;
}
export interface TimelineBodyProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    timestamp?: ReactNode;
    children?: ReactNode;
}
declare function TimelineRoot({ ref, className, ...rest }: TimelineRootProps): import("react").JSX.Element;
declare function TimelineItem({ ref, className, ...rest }: TimelineItemProps): import("react").JSX.Element;
declare function TimelineBadge({ ref, variant, className, children, ...rest }: TimelineBadgeProps): import("react").JSX.Element;
declare function TimelineBody({ ref, timestamp, className, children, ...rest }: TimelineBodyProps): import("react").JSX.Element;
export declare const Timeline: typeof TimelineRoot & {
    Item: typeof TimelineItem;
    Badge: typeof TimelineBadge;
    Body: typeof TimelineBody;
};
export {};


// ---- toast/toast.d.ts ----
import type { ReactNode } from "react";
export type ToastVariant = "neutral" | "info" | "success" | "warning" | "danger";
export type ToastPosition = "top-start" | "top-end" | "bottom-start" | "bottom-end";
export interface ToastActionOptions {
    label: string;
    onClick: () => void;
}
export interface ToastOptions {
    id?: string;
    title?: ReactNode;
    description?: ReactNode;
    variant?: ToastVariant;
    timeout?: number;
    priority?: "low" | "high";
    action?: ToastActionOptions;
    icon?: ReactNode;
    onClose?: () => void;
}
export type ToastUpdateOptions = Partial<Omit<ToastOptions, "id">>;
export interface ToastPromiseOptions<Value> {
    loading: string | ToastUpdateOptions;
    success: string | ToastUpdateOptions | ((result: Value) => string | ToastUpdateOptions);
    error: string | ToastUpdateOptions | ((error: unknown) => string | ToastUpdateOptions);
}
export interface UseToastResult {
    add: (options: ToastOptions) => string;
    update: (id: string, options: ToastUpdateOptions) => void;
    close: (id?: string) => void;
    promise: <Value>(promise: Promise<Value>, options: ToastPromiseOptions<Value>) => Promise<Value>;
}
export interface ToastProviderProps {
    children: ReactNode;
    timeout?: number;
    limit?: number;
    dismissLabel?: string;
    position?: ToastPosition;
    className?: string;
}
declare function ToastProvider({ children, timeout, limit, dismissLabel, position, className, }: ToastProviderProps): import("react").JSX.Element;
export declare function useToast(): UseToastResult;
export declare const Toast: {
    Provider: typeof ToastProvider;
};
export {};


// ---- toggle-group/toggle-group.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { Toggle } from "../toggle/toggle.js";
export type ToggleGroupOrientation = "horizontal" | "vertical";
export interface ToggleGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    ref?: Ref<HTMLDivElement>;
    value?: readonly string[];
    defaultValue?: readonly string[];
    onValueChange?: (value: string[]) => void;
    multiple?: boolean;
    disabled?: boolean;
    orientation?: ToggleGroupOrientation;
    loopFocus?: boolean;
    children?: ReactNode;
}
declare function ToggleGroupRoot({ value, defaultValue, onValueChange, multiple, disabled, orientation, loopFocus, className, children, ...rest }: ToggleGroupProps): import("react").JSX.Element;
export declare const ToggleGroup: typeof ToggleGroupRoot & {
    Item: typeof Toggle;
};
export {};


// ---- toggle/toggle.d.ts ----
import type { ButtonHTMLAttributes, ReactElement, ReactNode, Ref } from "react";
export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    nativeButton?: boolean;
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    value?: string;
    children?: ReactNode;
}
export declare function Toggle({ ref, pressed, defaultPressed, onPressedChange, value, disabled, className, children, ...rest }: ToggleProps): import("react").JSX.Element;


// ---- toolbar/toolbar.d.ts ----
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
export type ToolbarOrientation = "horizontal" | "vertical";
export interface ToolbarRootProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    orientation?: ToolbarOrientation;
    disabled?: boolean;
    loopFocus?: boolean;
    children?: ReactNode;
}
declare function ToolbarRoot({ className, ...rest }: ToolbarRootProps): import("react").JSX.Element;
export interface ToolbarGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    disabled?: boolean;
    children?: ReactNode;
}
declare function ToolbarGroup({ className, ...rest }: ToolbarGroupProps): import("react").JSX.Element;
export interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    render?: ReactElement;
    nativeButton?: boolean;
    focusableWhenDisabled?: boolean;
    children?: ReactNode;
}
declare function ToolbarButton({ className, ...rest }: ToolbarButtonProps): import("react").JSX.Element;
export interface ToolbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    ref?: Ref<HTMLAnchorElement>;
    render?: ReactElement;
    children?: ReactNode;
}
declare function ToolbarLink({ className, ...rest }: ToolbarLinkProps): import("react").JSX.Element;
export interface ToolbarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
}
declare function ToolbarSeparator({ className, ...rest }: ToolbarSeparatorProps): import("react").JSX.Element;
export declare const Toolbar: typeof ToolbarRoot & {
    Group: typeof ToolbarGroup;
    Button: typeof ToolbarButton;
    Link: typeof ToolbarLink;
    Separator: typeof ToolbarSeparator;
};
export {};


// ---- tooltip/tooltip.d.ts ----
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";
export interface TooltipProviderProps {
    delay?: number;
    closeDelay?: number;
    timeout?: number;
    children?: ReactNode;
}
declare function TooltipProvider(props: TooltipProviderProps): import("react").JSX.Element;
export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "content" | "children"> {
    ref?: Ref<HTMLDivElement>;
    content: ReactNode;
    side?: TooltipSide;
    sideOffset?: number;
    align?: TooltipAlign;
    alignOffset?: number;
    collisionPadding?: number | Partial<Record<TooltipSide, number>>;
    disabled?: boolean;
    delay?: number;
    closeDelay?: number;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
    children: ReactElement;
}
declare function TooltipRoot({ id, content, side, sideOffset, align, alignOffset, collisionPadding, disabled, delay, closeDelay, className, open, defaultOpen, onOpenChange, children, ...rest }: TooltipProps): import("react").JSX.Element;
export declare const Tooltip: typeof TooltipRoot & {
    Provider: typeof TooltipProvider;
};
export {};


// ---- tree-view/tree-view.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface TreeViewNode<T = unknown> {
    id: string;
    label: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    children?: readonly TreeViewNode<T>[];
    hasChildren?: boolean;
    data?: T;
}
export interface TreeViewProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    ref?: Ref<HTMLDivElement>;
    items: readonly TreeViewNode<T>[];
    multiple?: boolean;
    selected?: readonly string[];
    defaultSelected?: readonly string[];
    onSelectedChange?: (selected: string[]) => void;
    expanded?: readonly string[];
    defaultExpanded?: readonly string[];
    onExpandedChange?: (expanded: string[]) => void;
    onLoadChildren?: (node: TreeViewNode<T>) => void;
    renderItem?: (node: TreeViewNode<T>) => ReactNode;
    getItemLabel?: (node: TreeViewNode<T>) => string;
}
export declare function TreeView<T = unknown>({ ref, items, multiple, selected, defaultSelected, onSelectedChange, expanded, defaultExpanded, onExpandedChange, onLoadChildren, renderItem, getItemLabel, className, ...rest }: TreeViewProps<T>): import("react").JSX.Element;


// ---- truncated-text/truncated-text.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface TruncatedTextProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    lines?: number;
    showTooltip?: boolean;
    children?: ReactNode;
}
export declare function TruncatedText({ ref, lines, showTooltip, className, children, ...rest }: TruncatedTextProps): import("react").JSX.Element;


// ---- visually-hidden/visually-hidden.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    children?: ReactNode;
}
export declare function VisuallyHidden({ ref, className, ...rest }: VisuallyHiddenProps): import("react").JSX.Element;

