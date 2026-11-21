// ---- accordion/accordion.d.ts ----
import type { ReactNode } from "react";
export interface AccordionRootProps {
    value?: unknown[];
    defaultValue?: unknown[];
    onValueChange?: (value: unknown[]) => void;
    disabled?: boolean;
    /**
     * Whether multiple items can be open at the same time.
     * @default false
     */
    multiple?: boolean;
    children?: ReactNode;
}
declare function AccordionRoot({ onValueChange, ...rest }: AccordionRootProps): import("react").JSX.Element;
export interface AccordionItemProps {
    value: unknown;
    disabled?: boolean;
    children?: ReactNode;
}
declare function AccordionItem({ children, ...rest }: AccordionItemProps): import("react").JSX.Element;
export interface AccordionTriggerProps {
    children?: ReactNode;
}
declare function AccordionTrigger({ children }: AccordionTriggerProps): import("react").JSX.Element;
export interface AccordionPanelProps {
    children?: ReactNode;
}
declare function AccordionPanel({ children }: AccordionPanelProps): import("react").JSX.Element;
export declare const Accordion: typeof AccordionRoot & {
    Item: typeof AccordionItem;
    Trigger: typeof AccordionTrigger;
    Panel: typeof AccordionPanel;
};
export {};


// ---- alert-dialog/alert-dialog.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode } from "react";
import type { DialogCloseProps, DialogDescriptionProps, DialogTitleProps } from "../dialog/dialog.js";
export interface AlertDialogRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function AlertDialogRoot({ onOpenChange, ...rest }: AlertDialogRootProps): import("react").JSX.Element;
export interface AlertDialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    render?: ReactElement;
    children?: ReactNode;
}
declare function AlertDialogTrigger({ render, className, ...rest }: AlertDialogTriggerProps): import("react").JSX.Element;
export interface AlertDialogContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function AlertDialogContent({ className, children, ...rest }: AlertDialogContentProps): import("react").JSX.Element;
declare function AlertDialogTitle({ className, ...rest }: DialogTitleProps): import("react").JSX.Element;
declare function AlertDialogDescription({ className, ...rest }: DialogDescriptionProps): import("react").JSX.Element;
declare function AlertDialogClose({ render, className, ...rest }: DialogCloseProps): import("react").JSX.Element;
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
    children?: ReactNode;
}
export declare function Alert({ ref, variant, title, children, role, className, ...rest }: AlertProps): import("react").JSX.Element;


// ---- aspect-ratio/aspect-ratio.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    ratio?: number;
    children?: ReactNode;
}
export declare function AspectRatio({ ref, ratio, className, style, ...rest }: AspectRatioProps): import("react").JSX.Element;


// ---- autocomplete/autocomplete.d.ts ----
import type { InputHTMLAttributes } from "react";
export interface AutocompleteProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
    items: readonly string[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    emptyMessage?: string;
    invalid?: boolean;
}
export declare function Autocomplete({ items, value, defaultValue, onValueChange, emptyMessage, invalid, disabled, name, placeholder, id, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: AutocompleteProps): import("react").JSX.Element;


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
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    variant?: BadgeVariant;
    children?: ReactNode;
}
export declare function Badge({ ref, variant, className, ...rest }: BadgeProps): import("react").JSX.Element;


// ---- breadcrumb/breadcrumb.d.ts ----
import type { AnchorHTMLAttributes, HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes, ReactNode, Ref } from "react";
export interface BreadcrumbRootProps extends HTMLAttributes<HTMLElement> {
    ref?: Ref<HTMLElement>;
}
export type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>;
export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;
export type BreadcrumbLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;
export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;
export interface BreadcrumbSeparatorProps extends LiHTMLAttributes<HTMLLIElement> {
    children?: ReactNode;
}
declare function BreadcrumbRoot({ ref, "aria-label": ariaLabel, className, ...rest }: BreadcrumbRootProps): import("react").JSX.Element;
declare function BreadcrumbList({ className, ...rest }: BreadcrumbListProps): import("react").JSX.Element;
declare function BreadcrumbItem({ className, ...rest }: BreadcrumbItemProps): import("react").JSX.Element;
declare function BreadcrumbLink({ className, ...rest }: BreadcrumbLinkProps): import("react").JSX.Element;
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
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "small" | "medium" | "large" | "icon";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children?: ReactNode;
}
export declare function Button({ ref, variant, size, loading, disabled, type, className, onClick, "aria-disabled": ariaDisabled, children, ...rest }: ButtonProps): import("react").JSX.Element;


// ---- calendar/calendar.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    ref?: Ref<HTMLDivElement>;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    min?: string;
    max?: string;
    locale?: string;
    weekStartsOn?: WeekdayIndex;
    disabled?: boolean;
    previousMonthLabel?: string;
    nextMonthLabel?: string;
}
export declare function parseIsoDate(iso: string | undefined): Date | null;
export declare function Calendar({ ref, value, defaultValue, onValueChange, min, max, locale, weekStartsOn, disabled, previousMonthLabel, nextMonthLabel, className, ...rest }: CalendarProps): import("react").JSX.Element;


// ---- card/card.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
    ref?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
}
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
}
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function CardRoot({ ref, className, ...rest }: CardRootProps): import("react").JSX.Element;
declare function CardHeader({ className, ...rest }: CardHeaderProps): import("react").JSX.Element;
declare function CardTitle({ className, ...rest }: CardTitleProps): import("react").JSX.Element;
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


// ---- checkbox/checkbox.d.ts ----
import type { Ref } from "react";
export interface CheckboxProps {
    ref?: Ref<HTMLElement>;
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    indeterminate?: boolean;
    name?: string;
    value?: string;
    id?: string;
    className?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}
export declare function Checkbox({ ref, onCheckedChange, disabled, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: CheckboxProps): import("react").JSX.Element;


// ---- collapsible/collapsible.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
export interface CollapsibleRootProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function CollapsibleRoot({ onOpenChange, className, ...rest }: CollapsibleRootProps): import("react").JSX.Element;
export interface CollapsibleTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
}
declare function CollapsibleTrigger({ className, children, ...rest }: CollapsibleTriggerProps): import("react").JSX.Element;
export interface CollapsiblePanelProps extends HTMLAttributes<HTMLDivElement> {
    keepMounted?: boolean;
    children?: ReactNode;
}
declare function CollapsiblePanel({ className, children, ...rest }: CollapsiblePanelProps): import("react").JSX.Element;
export declare const Collapsible: typeof CollapsibleRoot & {
    Trigger: typeof CollapsibleTrigger;
    Panel: typeof CollapsiblePanel;
};
export {};


// ---- combobox/combobox.d.ts ----
import type { ReactNode } from "react";
export interface ComboboxItem<Value> {
    label: string;
    value: Value;
}
export interface ComboboxRootProps<Value = unknown> {
    value?: Value;
    defaultValue?: Value;
    onValueChange?: (value: Value | null) => void;
    inputValue?: string;
    onInputValueChange?: (inputValue: string) => void;
    disabled?: boolean;
    readOnly?: boolean;
    name?: string;
    items: ReadonlyArray<ComboboxItem<Value>>;
    children?: ReactNode;
}
declare function ComboboxRoot<Value = unknown>({ value, defaultValue, onValueChange, onInputValueChange, disabled, items, ...rest }: ComboboxRootProps<Value>): import("react").JSX.Element;
export interface ComboboxInputProps {
    id?: string;
    className?: string;
    placeholder?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}
declare function ComboboxInput({ id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: ComboboxInputProps): import("react").JSX.Element;
export interface ComboboxContentProps {
    className?: string;
    emptyMessage?: ReactNode;
}
declare function ComboboxContent({ className, emptyMessage, }: ComboboxContentProps): import("react").JSX.Element;
export declare const Combobox: typeof ComboboxRoot & {
    Input: typeof ComboboxInput;
    Content: typeof ComboboxContent;
};
export {};


// ---- command-palette/command-palette.d.ts ----
export interface CommandPaletteItem {
    id: string;
    label: string;
    group?: string;
    keywords?: readonly string[];
    shortcut?: string;
    disabled?: boolean;
}
export interface CommandPaletteProps {
    items: readonly CommandPaletteItem[];
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSelect?: (item: CommandPaletteItem) => void;
    title?: string;
    placeholder?: string;
    searchLabel?: string;
    emptyMessage?: string;
    closeLabel?: string;
    enableGlobalShortcut?: boolean;
}
export declare function CommandPalette({ items, open, defaultOpen, onOpenChange, onSelect, title, placeholder, searchLabel, emptyMessage, closeLabel, enableGlobalShortcut, }: CommandPaletteProps): import("react").JSX.Element;


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
import type { HTMLAttributes, ReactNode } from "react";
export interface ContextMenuRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuRoot({ onOpenChange, ...rest }: ContextMenuRootProps): import("react").JSX.Element;
export interface ContextMenuTriggerProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function ContextMenuTrigger({ className, ...rest }: ContextMenuTriggerProps): import("react").JSX.Element;
export interface ContextMenuContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function ContextMenuContent({ className, children, ...rest }: ContextMenuContentProps): import("react").JSX.Element;
export interface ContextMenuGroupProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function ContextMenuGroup(props: ContextMenuGroupProps): import("react").JSX.Element;
export interface ContextMenuGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function ContextMenuGroupLabel({ className, ...rest }: ContextMenuGroupLabelProps): import("react").JSX.Element;
export interface ContextMenuItemProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuItem({ className, ...rest }: ContextMenuItemProps): import("react").JSX.Element;
export interface ContextMenuCheckboxItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuCheckboxItem({ checked, defaultChecked, onCheckedChange, disabled, className, children, ...rest }: ContextMenuCheckboxItemProps): import("react").JSX.Element;
export interface ContextMenuRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuRadioGroup({ value, defaultValue, onValueChange, disabled, ...rest }: ContextMenuRadioGroupProps): import("react").JSX.Element;
export interface ContextMenuRadioItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
    children?: ReactNode;
}
declare function ContextMenuRadioItem({ value, disabled, className, children, ...rest }: ContextMenuRadioItemProps): import("react").JSX.Element;
export interface ContextMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {
}
declare function ContextMenuSeparator({ className, ...rest }: ContextMenuSeparatorProps): import("react").JSX.Element;
export interface ContextMenuShortcutProps extends HTMLAttributes<HTMLSpanElement> {
    children?: ReactNode;
}
declare function ContextMenuShortcut({ className, ...rest }: ContextMenuShortcutProps): import("react").JSX.Element;
export declare const ContextMenu: typeof ContextMenuRoot & {
    Trigger: typeof ContextMenuTrigger;
    Content: typeof ContextMenuContent;
    Group: typeof ContextMenuGroup;
    GroupLabel: typeof ContextMenuGroupLabel;
    Item: typeof ContextMenuItem;
    CheckboxItem: typeof ContextMenuCheckboxItem;
    RadioGroup: typeof ContextMenuRadioGroup;
    RadioItem: typeof ContextMenuRadioItem;
    Separator: typeof ContextMenuSeparator;
    Shortcut: typeof ContextMenuShortcut;
};
export {};


// ---- date-picker/date-picker.d.ts ----
import type { InputHTMLAttributes, Ref } from "react";
import { type WeekdayIndex } from "../calendar/calendar.js";
export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
    ref?: Ref<HTMLInputElement>;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    min?: string;
    max?: string;
    locale?: string;
    weekStartsOn?: WeekdayIndex;
    invalid?: boolean;
    openCalendarLabel?: string;
}
export declare function DatePicker({ ref, value, defaultValue, onValueChange, min, max, locale, weekStartsOn, invalid, disabled, readOnly, placeholder, openCalendarLabel, id, className, onBlur, onKeyDown, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: DatePickerProps): import("react").JSX.Element;


// ---- dialog/dialog.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode } from "react";
export interface DialogRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean | "trap-focus";
    children?: ReactNode;
}
declare function DialogRoot({ onOpenChange, ...rest }: DialogRootProps): import("react").JSX.Element;
export interface DialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    render?: ReactElement;
    children?: ReactNode;
}
declare function DialogTrigger({ render, className, ...rest }: DialogTriggerProps): import("react").JSX.Element;
export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    closeLabel?: string;
}
declare function DialogContent({ children, closeLabel, className, ...rest }: DialogContentProps): import("react").JSX.Element;
export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
}
declare function DialogTitle({ className, ...rest }: DialogTitleProps): import("react").JSX.Element;
export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
}
declare function DialogDescription({ className, ...rest }: DialogDescriptionProps): import("react").JSX.Element;
export interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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


// ---- dialog/use-dialog-portal-container.d.ts ----
export declare function useDialogPortalContainer(): {
    container: HTMLElement | undefined;
    scopeRef: (node: HTMLSpanElement | null) => void;
};


// ---- drawer/drawer.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode } from "react";
export type DrawerSide = "right" | "left" | "bottom";
export interface DrawerRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: DrawerSide;
    children: ReactNode;
}
export interface DrawerTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    render?: ReactElement;
    children?: ReactNode;
}
export interface DrawerContentProps extends HTMLAttributes<HTMLDivElement> {
    side?: DrawerSide;
    closeLabel?: string;
    children: ReactNode;
}
export interface DrawerTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
}
export interface DrawerDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children: ReactNode;
}
export interface DrawerCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    render?: ReactElement;
    children?: ReactNode;
}
declare function DrawerRoot({ open, defaultOpen, onOpenChange, side, children, }: DrawerRootProps): import("react").JSX.Element;
declare function DrawerTrigger({ render, className, children, ...rest }: DrawerTriggerProps): import("react").JSX.Element;
declare function DrawerContent({ side, closeLabel, className, children, ...rest }: DrawerContentProps): import("react").JSX.Element;
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
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    ref?: Ref<HTMLDivElement>;
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
}
export declare function EmptyState({ ref, icon, title, description, action, className, ...rest }: EmptyStateProps): import("react").JSX.Element;


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
import type { LabelHTMLAttributes, ReactNode } from "react";
export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    children?: ReactNode;
}
export declare function FieldLabel({ htmlFor, children, className, ...rest }: FieldLabelProps): import("react").JSX.Element;


// ---- field/field.d.ts ----
import type { HTMLAttributes, ReactNode } from "react";
import { FieldDescription } from "./field-description.js";
import { FieldError } from "./field-error.js";
import { FieldLabel } from "./field-label.js";
export interface FieldRootProps extends HTMLAttributes<HTMLDivElement> {
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
import type { FieldsetHTMLAttributes, HTMLAttributes, ReactNode } from "react";
export interface FieldsetRootProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
    children?: ReactNode;
}
export interface FieldsetLegendProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function FieldsetRoot({ disabled, className, children, ...rest }: FieldsetRootProps): import("react").JSX.Element;
declare function FieldsetLegend({ className, children, ...rest }: FieldsetLegendProps): import("react").JSX.Element;
export declare const Fieldset: typeof FieldsetRoot & {
    Legend: typeof FieldsetLegend;
};
export {};


// ---- file-upload/file-upload.d.ts ----
import type { InputHTMLAttributes, Ref } from "react";
export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
    ref?: Ref<HTMLInputElement>;
    files?: File[];
    defaultFiles?: File[];
    onFilesChange?: (files: File[]) => void;
    invalid?: boolean;
    prompt?: string;
    hint?: string;
    getRemoveLabel?: (file: File) => string;
}
export declare function FileUpload({ ref, files, defaultFiles, onFilesChange, invalid, disabled, multiple, accept, prompt, hint, getRemoveLabel, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: FileUploadProps): import("react").JSX.Element;


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


// ---- index.d.ts ----
export type { AccordionItemProps, AccordionPanelProps, AccordionRootProps, AccordionTriggerProps, } from "./accordion/accordion.js";
export { Accordion } from "./accordion/accordion.js";
export type { AlertProps, AlertVariant } from "./alert/alert.js";
export { Alert } from "./alert/alert.js";
export type { AlertDialogContentProps, AlertDialogRootProps, AlertDialogTriggerProps, } from "./alert-dialog/alert-dialog.js";
export { AlertDialog } from "./alert-dialog/alert-dialog.js";
export type { AspectRatioProps } from "./aspect-ratio/aspect-ratio.js";
export { AspectRatio } from "./aspect-ratio/aspect-ratio.js";
export type { AutocompleteProps } from "./autocomplete/autocomplete.js";
export { Autocomplete } from "./autocomplete/autocomplete.js";
export type { AvatarProps, AvatarSize } from "./avatar/avatar.js";
export { Avatar } from "./avatar/avatar.js";
export type { BadgeProps, BadgeVariant } from "./badge/badge.js";
export { Badge } from "./badge/badge.js";
export type { BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbListProps, BreadcrumbPageProps, BreadcrumbRootProps, BreadcrumbSeparatorProps, } from "./breadcrumb/breadcrumb.js";
export { Breadcrumb } from "./breadcrumb/breadcrumb.js";
export type { ButtonProps, ButtonSize, ButtonVariant, } from "./button/button.js";
export { Button } from "./button/button.js";
export type { ButtonGroupOrientation, ButtonGroupProps, } from "./button-group/button-group.js";
export { ButtonGroup } from "./button-group/button-group.js";
export type { CalendarProps, WeekdayIndex } from "./calendar/calendar.js";
export { Calendar } from "./calendar/calendar.js";
export type { CardContentProps, CardDescriptionProps, CardFooterProps, CardHeaderProps, CardRootProps, CardTitleProps, } from "./card/card.js";
export { Card } from "./card/card.js";
export type { CheckboxProps } from "./checkbox/checkbox.js";
export { Checkbox } from "./checkbox/checkbox.js";
export type { CollapsiblePanelProps, CollapsibleRootProps, CollapsibleTriggerProps, } from "./collapsible/collapsible.js";
export { Collapsible } from "./collapsible/collapsible.js";
export type { ComboboxContentProps, ComboboxInputProps, ComboboxItem, ComboboxRootProps, } from "./combobox/combobox.js";
export { Combobox } from "./combobox/combobox.js";
export type { CommandPaletteItem, CommandPaletteProps, } from "./command-palette/command-palette.js";
export { CommandPalette } from "./command-palette/command-palette.js";
export type { ContainerProps, ContainerSize } from "./container/container.js";
export { Container } from "./container/container.js";
export type { ContextMenuCheckboxItemProps, ContextMenuContentProps, ContextMenuGroupLabelProps, ContextMenuGroupProps, ContextMenuItemProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuRootProps, ContextMenuSeparatorProps, ContextMenuShortcutProps, ContextMenuTriggerProps, } from "./context-menu/context-menu.js";
export { ContextMenu } from "./context-menu/context-menu.js";
export type { DatePickerProps } from "./date-picker/date-picker.js";
export { DatePicker } from "./date-picker/date-picker.js";
export type { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogRootProps, DialogTitleProps, DialogTriggerProps, } from "./dialog/dialog.js";
export { Dialog } from "./dialog/dialog.js";
export type { DrawerCloseProps, DrawerContentProps, DrawerDescriptionProps, DrawerRootProps, DrawerSide, DrawerTitleProps, DrawerTriggerProps, } from "./drawer/drawer.js";
export { Drawer } from "./drawer/drawer.js";
export type { EmptyStateProps } from "./empty-state/empty-state.js";
export { EmptyState } from "./empty-state/empty-state.js";
export type { FieldRootProps } from "./field/field.js";
export { Field } from "./field/field.js";
export type { FieldDescriptionProps } from "./field/field-description.js";
export type { FieldErrorProps } from "./field/field-error.js";
export type { FieldLabelProps } from "./field/field-label.js";
export type { FieldsetLegendProps, FieldsetRootProps, } from "./fieldset/fieldset.js";
export { Fieldset } from "./fieldset/fieldset.js";
export type { FileUploadProps } from "./file-upload/file-upload.js";
export { FileUpload } from "./file-upload/file-upload.js";
export type { GridAlign, GridColumns, GridGap, GridProps, } from "./grid/grid.js";
export { Grid } from "./grid/grid.js";
export type { InputProps } from "./input/input.js";
export { Input } from "./input/input.js";
export type { InputGroupAddonAlign, InputGroupAddonProps, InputGroupInputProps, InputGroupRootProps, } from "./input-group/input-group.js";
export { InputGroup } from "./input-group/input-group.js";
export type { KbdProps, KbdSize } from "./kbd/kbd.js";
export { Kbd } from "./kbd/kbd.js";
export type { LinkProps } from "./link/link.js";
export { Link } from "./link/link.js";
export type { MenuCheckboxItemProps, MenuContentProps, MenuGroupLabelProps, MenuGroupProps, MenuItemProps, MenuRadioGroupProps, MenuRadioItemProps, MenuRootProps, MenuSeparatorProps, MenuShortcutProps, MenuTriggerProps, } from "./menu/menu.js";
export { Menu } from "./menu/menu.js";
export type { MeterProps, MeterVariant } from "./meter/meter.js";
export { Meter } from "./meter/meter.js";
export type { NumberFieldProps } from "./number-field/number-field.js";
export { NumberField } from "./number-field/number-field.js";
export type { OTPFieldProps } from "./otp-field/otp-field.js";
export { OTPField } from "./otp-field/otp-field.js";
export type { PaginationProps } from "./pagination/pagination.js";
export { Pagination } from "./pagination/pagination.js";
export type { PopoverContentProps, PopoverDescriptionProps, PopoverRootProps, PopoverSide, PopoverTitleProps, PopoverTriggerProps, } from "./popover/popover.js";
export { Popover } from "./popover/popover.js";
export type { PreviewCardContentProps, PreviewCardRootProps, PreviewCardSide, PreviewCardTriggerProps, } from "./preview-card/preview-card.js";
export { PreviewCard } from "./preview-card/preview-card.js";
export type { ProgressProps } from "./progress/progress.js";
export { Progress } from "./progress/progress.js";
export type { RadioGroupItemProps, RadioGroupProps, } from "./radio-group/radio-group.js";
export { RadioGroup } from "./radio-group/radio-group.js";
export type { ScrollAreaOrientation, ScrollAreaProps, } from "./scroll-area/scroll-area.js";
export { ScrollArea } from "./scroll-area/scroll-area.js";
export type { SelectContentProps, SelectItemProps, SelectRootProps, SelectTriggerProps, SelectValueProps, } from "./select/select.js";
export { Select } from "./select/select.js";
export type { SeparatorOrientation, SeparatorProps, } from "./separator/separator.js";
export { Separator } from "./separator/separator.js";
export type { SidebarContentProps, SidebarFooterProps, SidebarGroupLabelProps, SidebarGroupProps, SidebarHeaderProps, SidebarInsetProps, SidebarItemProps, SidebarProviderProps, SidebarRootProps, SidebarTriggerProps, UseSidebarResult, } from "./sidebar/sidebar.js";
export { Sidebar, useSidebar } from "./sidebar/sidebar.js";
export type { SkeletonProps, SkeletonVariant } from "./skeleton/skeleton.js";
export { Skeleton } from "./skeleton/skeleton.js";
export type { SliderProps, SliderValue } from "./slider/slider.js";
export { Slider } from "./slider/slider.js";
export type { SpinnerProps, SpinnerSize } from "./spinner/spinner.js";
export { Spinner } from "./spinner/spinner.js";
export type { StackAlign, StackDirection, StackGap, StackJustify, StackProps, } from "./stack/stack.js";
export { Stack } from "./stack/stack.js";
export type { StepperOrientation, StepperProps, StepperStep, } from "./stepper/stepper.js";
export { Stepper } from "./stepper/stepper.js";
export type { SwitchProps } from "./switch/switch.js";
export { Switch } from "./switch/switch.js";
export type { TableBodyProps, TableCaptionProps, TableCellProps, TableFooterProps, TableHeaderProps, TableHeadProps, TableRootProps, TableRowProps, } from "./table/table.js";
export { Table } from "./table/table.js";
export type { TabsListProps, TabsPanelProps, TabsRootProps, TabsTabProps, } from "./tabs/tabs.js";
export { Tabs } from "./tabs/tabs.js";
export type { TagProps, TagVariant } from "./tag/tag.js";
export { Tag } from "./tag/tag.js";
export type { TextareaProps } from "./textarea/textarea.js";
export { Textarea } from "./textarea/textarea.js";
export type { ToastActionOptions, ToastOptions, ToastProviderProps, ToastVariant, UseToastResult, } from "./toast/toast.js";
export { Toast, useToast } from "./toast/toast.js";
export type { ToggleProps } from "./toggle/toggle.js";
export { Toggle } from "./toggle/toggle.js";
export type { ToggleGroupOrientation, ToggleGroupProps, } from "./toggle-group/toggle-group.js";
export { ToggleGroup } from "./toggle-group/toggle-group.js";
export type { ToolbarButtonProps, ToolbarGroupProps, ToolbarLinkProps, ToolbarOrientation, ToolbarRootProps, ToolbarSeparatorProps, } from "./toolbar/toolbar.js";
export { Toolbar } from "./toolbar/toolbar.js";
export type { TooltipProps, TooltipSide } from "./tooltip/tooltip.js";
export { Tooltip } from "./tooltip/tooltip.js";
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
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    ref?: Ref<HTMLInputElement>;
    invalid?: boolean;
}
export declare function Input({ ref, invalid, disabled, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: InputProps): import("react").JSX.Element;


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
import type { AnchorHTMLAttributes, ReactNode, Ref } from "react";
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    ref?: Ref<HTMLAnchorElement>;
    children?: ReactNode;
}
export declare function Link({ ref, className, ...rest }: LinkProps): import("react").JSX.Element;


// ---- menu/menu.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode } from "react";
export interface MenuRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function MenuRoot({ onOpenChange, ...rest }: MenuRootProps): import("react").JSX.Element;
export interface MenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    render?: ReactElement;
    children?: ReactNode;
}
declare function MenuTrigger({ render, className, ...rest }: MenuTriggerProps): import("react").JSX.Element;
export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function MenuContent({ className, children, ...rest }: MenuContentProps): import("react").JSX.Element;
export interface MenuGroupProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function MenuGroup(props: MenuGroupProps): import("react").JSX.Element;
export interface MenuGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function MenuGroupLabel({ className, ...rest }: MenuGroupLabelProps): import("react").JSX.Element;
export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuItem({ className, ...rest }: MenuItemProps): import("react").JSX.Element;
export interface MenuCheckboxItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuCheckboxItem({ checked, defaultChecked, onCheckedChange, disabled, className, children, ...rest }: MenuCheckboxItemProps): import("react").JSX.Element;
export interface MenuRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuRadioGroup({ value, defaultValue, onValueChange, disabled, ...rest }: MenuRadioGroupProps): import("react").JSX.Element;
export interface MenuRadioItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuRadioItem({ value, disabled, className, children, ...rest }: MenuRadioItemProps): import("react").JSX.Element;
export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {
}
declare function MenuSeparator({ className, ...rest }: MenuSeparatorProps): import("react").JSX.Element;
export interface MenuShortcutProps extends HTMLAttributes<HTMLSpanElement> {
    children?: ReactNode;
}
declare function MenuShortcut({ className, ...rest }: MenuShortcutProps): import("react").JSX.Element;
export declare const Menu: typeof MenuRoot & {
    Trigger: typeof MenuTrigger;
    Content: typeof MenuContent;
    Group: typeof MenuGroup;
    GroupLabel: typeof MenuGroupLabel;
    Item: typeof MenuItem;
    CheckboxItem: typeof MenuCheckboxItem;
    RadioGroup: typeof MenuRadioGroup;
    RadioItem: typeof MenuRadioItem;
    Separator: typeof MenuSeparator;
    Shortcut: typeof MenuShortcut;
};
export {};


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


// ---- number-field/number-field.d.ts ----
import type { HTMLAttributes, Ref } from "react";
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
    name?: string;
    placeholder?: string;
    decrementLabel?: string;
    incrementLabel?: string;
}
export declare function NumberField({ ref, value, defaultValue, onValueChange, min, max, step, disabled, readOnly, required, invalid, name, placeholder, decrementLabel, incrementLabel, id, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: NumberFieldProps): import("react").JSX.Element;


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


// ---- popover/popover.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode } from "react";
export interface PopoverRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function PopoverRoot({ onOpenChange, ...rest }: PopoverRootProps): import("react").JSX.Element;
export interface PopoverTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    render?: ReactElement;
    children?: ReactNode;
}
declare function PopoverTrigger({ render, className, ...rest }: PopoverTriggerProps): import("react").JSX.Element;
export type PopoverSide = "top" | "right" | "bottom" | "left";
export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
    side?: PopoverSide;
    sideOffset?: number;
    children?: ReactNode;
}
declare function PopoverContent({ side, sideOffset, className, children, ...rest }: PopoverContentProps): import("react").JSX.Element;
export interface PopoverTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
}
declare function PopoverTitle({ className, ...rest }: PopoverTitleProps): import("react").JSX.Element;
export interface PopoverDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
}
declare function PopoverDescription({ className, ...rest }: PopoverDescriptionProps): import("react").JSX.Element;
export interface PopoverCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
import type { AnchorHTMLAttributes, ReactNode } from "react";
export interface PreviewCardRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function PreviewCardRoot({ onOpenChange, ...rest }: PreviewCardRootProps): import("react").JSX.Element;
export interface PreviewCardTriggerProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    delay?: number;
    closeDelay?: number;
    children?: ReactNode;
}
declare function PreviewCardTrigger({ className, ...rest }: PreviewCardTriggerProps): import("react").JSX.Element;
export type PreviewCardSide = "top" | "right" | "bottom" | "left";
export interface PreviewCardContentProps {
    side?: PreviewCardSide;
    sideOffset?: number;
    className?: string;
    children?: ReactNode;
}
declare function PreviewCardContent({ side, sideOffset, className, children, }: PreviewCardContentProps): import("react").JSX.Element;
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


// ---- radio-group/radio-group.d.ts ----
import type { ReactNode } from "react";
export interface RadioGroupProps<Value = string> {
    name?: string;
    value?: Value;
    defaultValue?: Value;
    onValueChange?: (value: Value) => void;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    className?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    children?: ReactNode;
}
declare function RadioGroupRoot<Value = string>({ disabled, className, onValueChange, "aria-describedby": ariaDescribedBy, ...rest }: RadioGroupProps<Value>): import("react").JSX.Element;
export interface RadioGroupItemProps<Value = string> {
    value: Value;
    disabled?: boolean;
    children?: ReactNode;
}
declare function RadioGroupItem<Value = string>({ value, disabled, children, }: RadioGroupItemProps<Value>): import("react").JSX.Element;
export declare const RadioGroup: typeof RadioGroupRoot & {
    Item: typeof RadioGroupItem;
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


// ---- select/select.d.ts ----
import type { ReactNode } from "react";
export interface SelectRootProps<Value = unknown> {
    value?: Value;
    defaultValue?: Value;
    onValueChange?: (value: Value | null) => void;
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
declare function SelectRoot<Value = unknown>({ disabled, onValueChange, ...rest }: SelectRootProps<Value>): import("react").JSX.Element;
export interface SelectTriggerProps {
    id?: string;
    className?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
    children?: ReactNode;
}
declare function SelectTrigger({ id, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, children, }: SelectTriggerProps): import("react").JSX.Element;
export interface SelectValueProps {
    placeholder?: string;
}
declare function SelectValue({ placeholder }: SelectValueProps): import("react").JSX.Element;
export interface SelectContentProps {
    className?: string;
    children?: ReactNode;
}
declare function SelectContent({ className, children }: SelectContentProps): import("react").JSX.Element;
export interface SelectItemProps {
    value: unknown;
    disabled?: boolean;
    className?: string;
    children?: ReactNode;
}
declare function SelectItem({ className, children, ...rest }: SelectItemProps): import("react").JSX.Element;
export declare const Select: typeof SelectRoot & {
    Trigger: typeof SelectTrigger;
    Value: typeof SelectValue;
    Content: typeof SelectContent;
    Item: typeof SelectItem;
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


// ---- sidebar/sidebar.d.ts ----
import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
export interface UseSidebarResult {
    open: boolean;
    setOpen: (open: boolean) => void;
    toggle: () => void;
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}
export declare function useSidebar(): UseSidebarResult;
export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
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
    mobileTitle?: string;
    children?: ReactNode;
}
declare function SidebarRoot({ mobileTitle, className, children, ...rest }: SidebarRootProps): import("react").JSX.Element;
export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function SidebarHeader({ className, ...rest }: SidebarHeaderProps): import("react").JSX.Element;
export interface SidebarContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function SidebarContent({ className, ...rest }: SidebarContentProps): import("react").JSX.Element;
export interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function SidebarFooter({ className, ...rest }: SidebarFooterProps): import("react").JSX.Element;
export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function SidebarGroup({ className, ...rest }: SidebarGroupProps): import("react").JSX.Element;
export interface SidebarGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function SidebarGroupLabel({ className, ...rest }: SidebarGroupLabelProps): import("react").JSX.Element;
export interface SidebarItemProps {
    active?: boolean;
    icon?: ReactNode;
    href?: string;
    className?: string;
    children?: ReactNode;
    onClick?: () => void;
    "aria-label"?: string;
}
declare function SidebarItem({ active, icon, href, className, children, onClick, "aria-label": ariaLabel, }: SidebarItemProps): import("react").JSX.Element;
export interface SidebarInsetProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function SidebarInset({ className, ...rest }: SidebarInsetProps): import("react").JSX.Element;
export interface SidebarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
import type { HTMLAttributes, Ref } from "react";
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
export declare function Slider({ ref, value, defaultValue, onValueChange, min, max, step, disabled, name, id, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, ...rest }: SliderProps): import("react").JSX.Element;


// ---- spinner/spinner.d.ts ----
import type { HTMLAttributes, Ref } from "react";
export type SpinnerSize = "small" | "medium" | "large";
export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    ref?: Ref<HTMLSpanElement>;
    size?: SpinnerSize;
    label?: string;
}
export declare function Spinner({ ref, size, label, className, ...rest }: SpinnerProps): import("react").JSX.Element;


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


// ---- stepper/stepper.d.ts ----
import type { OlHTMLAttributes, ReactNode, Ref } from "react";
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
export declare function Stepper({ ref, steps, currentStep, orientation, className, ...rest }: StepperProps): import("react").JSX.Element;


// ---- switch/switch.d.ts ----
import type { Ref } from "react";
export interface SwitchProps {
    ref?: Ref<HTMLElement>;
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    name?: string;
    id?: string;
    className?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}
export declare function Switch({ ref, onCheckedChange, disabled, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: SwitchProps): import("react").JSX.Element;


// ---- table/table.d.ts ----
import type { HTMLAttributes, Ref, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
export interface TableRootProps extends TableHTMLAttributes<HTMLTableElement> {
    ref?: Ref<HTMLTableElement>;
}
export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;
export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;
declare function TableRoot({ ref, className, ...rest }: TableRootProps): import("react").JSX.Element;
declare function TableHeader({ className, ...rest }: TableHeaderProps): import("react").JSX.Element;
declare function TableBody({ className, ...rest }: TableBodyProps): import("react").JSX.Element;
declare function TableFooter({ className, ...rest }: TableFooterProps): import("react").JSX.Element;
declare function TableRow({ className, ...rest }: TableRowProps): import("react").JSX.Element;
declare function TableHead({ scope, className, ...rest }: TableHeadProps): import("react").JSX.Element;
declare function TableCell({ className, ...rest }: TableCellProps): import("react").JSX.Element;
declare function TableCaption({ className, ...rest }: TableCaptionProps): import("react").JSX.Element;
export declare const Table: typeof TableRoot & {
    Header: typeof TableHeader;
    Body: typeof TableBody;
    Footer: typeof TableFooter;
    Row: typeof TableRow;
    Head: typeof TableHead;
    Cell: typeof TableCell;
    Caption: typeof TableCaption;
};
export {};


// ---- tabs/tabs.d.ts ----
import type { ReactNode } from "react";
export interface TabsRootProps {
    value?: unknown;
    defaultValue?: unknown;
    onValueChange?: (value: unknown) => void;
    children?: ReactNode;
}
declare function TabsRoot({ onValueChange, ...rest }: TabsRootProps): import("react").JSX.Element;
export interface TabsListProps {
    children?: ReactNode;
}
declare function TabsList({ children }: TabsListProps): import("react").JSX.Element;
export interface TabsTabProps {
    value: unknown;
    disabled?: boolean;
    children?: ReactNode;
}
declare function TabsTab({ children, ...rest }: TabsTabProps): import("react").JSX.Element;
export interface TabsPanelProps {
    value: unknown;
    children?: ReactNode;
}
declare function TabsPanel({ children, ...rest }: TabsPanelProps): import("react").JSX.Element;
export declare const Tabs: typeof TabsRoot & {
    List: typeof TabsList;
    Tab: typeof TabsTab;
    Panel: typeof TabsPanel;
};
export {};


// ---- tag/tag.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export type TagVariant = "neutral" | "info" | "success" | "warning" | "danger";
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    variant?: TagVariant;
    onRemove?: () => void;
    removeLabel?: string;
    children?: ReactNode;
}
export declare function Tag({ ref, variant, onRemove, removeLabel, className, children, ...rest }: TagProps): import("react").JSX.Element;


// ---- textarea/textarea.d.ts ----
import type { Ref, TextareaHTMLAttributes } from "react";
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    ref?: Ref<HTMLTextAreaElement>;
    invalid?: boolean;
}
export declare function Textarea({ ref, invalid, disabled, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: TextareaProps): import("react").JSX.Element;


// ---- toast/toast.d.ts ----
import type { ReactNode } from "react";
export type ToastVariant = "neutral" | "info" | "success" | "warning" | "danger";
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
}
export interface UseToastResult {
    add: (options: ToastOptions) => string;
    close: (id?: string) => void;
}
export interface ToastProviderProps {
    children: ReactNode;
    timeout?: number;
    limit?: number;
    dismissLabel?: string;
}
declare function ToastProvider({ children, timeout, limit, dismissLabel, }: ToastProviderProps): import("react").JSX.Element;
export declare function useToast(): UseToastResult;
export declare const Toast: {
    Provider: typeof ToastProvider;
};
export {};


// ---- toggle-group/toggle-group.d.ts ----
import type { HTMLAttributes, ReactNode } from "react";
import { Toggle } from "../toggle/toggle.js";
export type ToggleGroupOrientation = "horizontal" | "vertical";
export interface ToggleGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
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
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
    ref?: Ref<HTMLButtonElement>;
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    value?: string;
    children?: ReactNode;
}
export declare function Toggle({ ref, pressed, defaultPressed, onPressedChange, value, disabled, className, children, ...rest }: ToggleProps): import("react").JSX.Element;


// ---- toolbar/toolbar.d.ts ----
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
export type ToolbarOrientation = "horizontal" | "vertical";
export interface ToolbarRootProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: ToolbarOrientation;
    disabled?: boolean;
    loopFocus?: boolean;
    children?: ReactNode;
}
declare function ToolbarRoot({ className, ...rest }: ToolbarRootProps): import("react").JSX.Element;
export interface ToolbarGroupProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
    children?: ReactNode;
}
declare function ToolbarGroup({ className, ...rest }: ToolbarGroupProps): import("react").JSX.Element;
export interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    focusableWhenDisabled?: boolean;
    children?: ReactNode;
}
declare function ToolbarButton({ className, ...rest }: ToolbarButtonProps): import("react").JSX.Element;
export interface ToolbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    children?: ReactNode;
}
declare function ToolbarLink({ className, ...rest }: ToolbarLinkProps): import("react").JSX.Element;
export interface ToolbarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
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
import type { ReactElement, ReactNode } from "react";
export type TooltipSide = "top" | "right" | "bottom" | "left";
export interface TooltipProps {
    content: ReactNode;
    side?: TooltipSide;
    sideOffset?: number;
    className?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactElement;
}
export declare function Tooltip({ content, side, sideOffset, className, onOpenChange, children, ...rest }: TooltipProps): import("react").JSX.Element;


// ---- visually-hidden/visually-hidden.d.ts ----
import type { HTMLAttributes, ReactNode, Ref } from "react";
export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: Ref<HTMLSpanElement>;
    children?: ReactNode;
}
export declare function VisuallyHidden({ ref, className, ...rest }: VisuallyHiddenProps): import("react").JSX.Element;

