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
declare function AccordionRoot({ onValueChange, ...rest }: AccordionRootProps): import("react/jsx-runtime").JSX.Element;
export interface AccordionItemProps {
    value: unknown;
    disabled?: boolean;
    children?: ReactNode;
}
declare function AccordionItem({ children, ...rest }: AccordionItemProps): import("react/jsx-runtime").JSX.Element;
export interface AccordionTriggerProps {
    children?: ReactNode;
}
declare function AccordionTrigger({ children }: AccordionTriggerProps): import("react/jsx-runtime").JSX.Element;
export interface AccordionPanelProps {
    children?: ReactNode;
}
declare function AccordionPanel({ children }: AccordionPanelProps): import("react/jsx-runtime").JSX.Element;
export declare const Accordion: typeof AccordionRoot & {
    Item: typeof AccordionItem;
    Trigger: typeof AccordionTrigger;
    Panel: typeof AccordionPanel;
};
export {};


// ---- alert-dialog/alert-dialog.d.ts ----
import type { ButtonHTMLAttributes, ReactNode } from "react";
export interface AlertDialogRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function AlertDialogRoot({ onOpenChange, ...rest }: AlertDialogRootProps): import("react/jsx-runtime").JSX.Element;
export interface AlertDialogTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function AlertDialogTrigger(props: AlertDialogTriggerProps): import("react/jsx-runtime").JSX.Element;
export interface AlertDialogContentProps {
    children?: ReactNode;
}
declare function AlertDialogContent({ children }: AlertDialogContentProps): import("react/jsx-runtime").JSX.Element;
export declare const AlertDialog: typeof AlertDialogRoot & {
    Trigger: typeof AlertDialogTrigger;
    Content: typeof AlertDialogContent;
    Title: ({ className, ...rest }: import("../dialog/dialog.js").DialogTitleProps) => import("react/jsx-runtime").JSX.Element;
    Description: ({ className, ...rest }: import("../dialog/dialog.js").DialogDescriptionProps) => import("react/jsx-runtime").JSX.Element;
    Close: (props: import("../dialog/dialog.js").DialogCloseProps) => import("react/jsx-runtime").JSX.Element;
};
export {};


// ---- alert/alert.d.ts ----
import type { HTMLAttributes, ReactNode } from "react";
export type AlertVariant = "info" | "success" | "warning" | "danger";
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: AlertVariant;
    title?: ReactNode;
    children?: ReactNode;
}
export declare const Alert: import("react").ForwardRefExoticComponent<AlertProps & import("react").RefAttributes<HTMLDivElement>>;


// ---- avatar/avatar.d.ts ----
import type { HTMLAttributes, ReactNode } from "react";
export type AvatarSize = "small" | "medium" | "large";
export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    src?: string;
    alt: string;
    fallback?: ReactNode;
    size?: AvatarSize;
}
export declare const Avatar: import("react").ForwardRefExoticComponent<AvatarProps & import("react").RefAttributes<HTMLSpanElement>>;


// ---- badge/badge.d.ts ----
import type { HTMLAttributes, ReactNode } from "react";
export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    children?: ReactNode;
}
export declare const Badge: import("react").ForwardRefExoticComponent<BadgeProps & import("react").RefAttributes<HTMLSpanElement>>;


// ---- breadcrumb/breadcrumb.d.ts ----
import type { AnchorHTMLAttributes, HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes, ReactNode } from "react";
export type BreadcrumbRootProps = HTMLAttributes<HTMLElement>;
export type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>;
export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;
export type BreadcrumbLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;
export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;
export interface BreadcrumbSeparatorProps extends LiHTMLAttributes<HTMLLIElement> {
    children?: ReactNode;
}
declare function BreadcrumbList({ className, ...rest }: BreadcrumbListProps): import("react/jsx-runtime").JSX.Element;
declare function BreadcrumbItem({ className, ...rest }: BreadcrumbItemProps): import("react/jsx-runtime").JSX.Element;
declare function BreadcrumbLink({ className, ...rest }: BreadcrumbLinkProps): import("react/jsx-runtime").JSX.Element;
declare function BreadcrumbPage({ className, ...rest }: BreadcrumbPageProps): import("react/jsx-runtime").JSX.Element;
declare function BreadcrumbSeparator({ children, className, ...rest }: BreadcrumbSeparatorProps): import("react/jsx-runtime").JSX.Element;
export declare const Breadcrumb: import("react").ForwardRefExoticComponent<BreadcrumbRootProps & import("react").RefAttributes<HTMLElement>> & {
    List: typeof BreadcrumbList;
    Item: typeof BreadcrumbItem;
    Link: typeof BreadcrumbLink;
    Page: typeof BreadcrumbPage;
    Separator: typeof BreadcrumbSeparator;
};
export {};


// ---- button/button.d.ts ----
import type { ButtonHTMLAttributes, ReactNode } from "react";
export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "small" | "medium" | "large";
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children?: ReactNode;
}
export declare const Button: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;


// ---- card/card.d.ts ----
import type { HTMLAttributes, ReactNode } from "react";
export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
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
declare function CardHeader({ className, ...rest }: CardHeaderProps): import("react/jsx-runtime").JSX.Element;
declare function CardTitle({ className, ...rest }: CardTitleProps): import("react/jsx-runtime").JSX.Element;
declare function CardDescription({ className, ...rest }: CardDescriptionProps): import("react/jsx-runtime").JSX.Element;
declare function CardContent({ className, ...rest }: CardContentProps): import("react/jsx-runtime").JSX.Element;
declare function CardFooter({ className, ...rest }: CardFooterProps): import("react/jsx-runtime").JSX.Element;
export declare const Card: import("react").ForwardRefExoticComponent<CardRootProps & import("react").RefAttributes<HTMLDivElement>> & {
    Header: typeof CardHeader;
    Title: typeof CardTitle;
    Description: typeof CardDescription;
    Content: typeof CardContent;
    Footer: typeof CardFooter;
};
export {};


// ---- checkbox/checkbox.d.ts ----
export interface CheckboxProps {
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
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}
export declare const Checkbox: import("react").ForwardRefExoticComponent<CheckboxProps & import("react").RefAttributes<HTMLElement>>;


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
    /**
     * The full list of selectable items. Base UI's filtering-as-you-type and
     * its built-in empty state (`Combobox.Content`'s "no results" message)
     * are entirely items-array driven -- without this, every item is treated
     * as filtered out regardless of what's typed, and the empty message
     * shows permanently. Found via a real-browser Storybook review: the
     * input never filtered anything and "No results" rendered even when
     * matching items existed.
     */
    items: ReadonlyArray<ComboboxItem<Value>>;
    children?: ReactNode;
}
declare function ComboboxRoot<Value = unknown>({ value, defaultValue, onValueChange, onInputValueChange, items, ...rest }: ComboboxRootProps<Value>): import("react/jsx-runtime").JSX.Element;
export interface ComboboxInputProps {
    id?: string;
    placeholder?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}
declare function ComboboxInput({ id, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: ComboboxInputProps): import("react/jsx-runtime").JSX.Element;
export interface ComboboxContentProps {
    emptyMessage?: ReactNode;
}
declare function ComboboxContent({ emptyMessage, }: ComboboxContentProps): import("react/jsx-runtime").JSX.Element;
export declare const Combobox: typeof ComboboxRoot & {
    Input: typeof ComboboxInput;
    Content: typeof ComboboxContent;
};
export {};


// ---- dialog/dialog.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
export interface DialogRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean | "trap-focus";
    children?: ReactNode;
}
declare function DialogRoot({ onOpenChange, ...rest }: DialogRootProps): import("react/jsx-runtime").JSX.Element;
export interface DialogTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function DialogTrigger(props: DialogTriggerProps): import("react/jsx-runtime").JSX.Element;
export interface DialogContentProps {
    children?: ReactNode;
    closeLabel?: string;
}
declare function DialogContent({ children, closeLabel }: DialogContentProps): import("react/jsx-runtime").JSX.Element;
export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
}
declare function DialogTitle({ className, ...rest }: DialogTitleProps): import("react/jsx-runtime").JSX.Element;
export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
}
declare function DialogDescription({ className, ...rest }: DialogDescriptionProps): import("react/jsx-runtime").JSX.Element;
export interface DialogCloseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function DialogCloseButton(props: DialogCloseProps): import("react/jsx-runtime").JSX.Element;
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
    container: HTMLElement | null | undefined;
    scopeRef: (node: HTMLSpanElement | null) => void;
};


// ---- field/field-context.d.ts ----
export interface FieldContextValue {
    controlId: string;
    descriptionId: string;
    errorId: string;
    describedBy: string;
    invalid: boolean;
}
export declare const FieldContext: import("react").Context<FieldContextValue | null>;
export declare function useFieldContext(): FieldContextValue | null;


// ---- field/field-description.d.ts ----
import type { ReactNode } from "react";
export interface FieldDescriptionProps {
    children?: ReactNode;
}
export declare function FieldDescription({ children }: FieldDescriptionProps): import("react/jsx-runtime").JSX.Element;


// ---- field/field-error.d.ts ----
import type { ReactNode } from "react";
export interface FieldErrorProps {
    children?: ReactNode;
}
export declare function FieldError({ children }: FieldErrorProps): import("react/jsx-runtime").JSX.Element | null;


// ---- field/field-label.d.ts ----
import type { LabelHTMLAttributes, ReactNode } from "react";
export interface FieldLabelProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor"> {
    children?: ReactNode;
}
export declare function FieldLabel({ children, className, ...rest }: FieldLabelProps): import("react/jsx-runtime").JSX.Element;


// ---- field/field.d.ts ----
import type { ReactNode } from "react";
import { FieldDescription } from "./field-description.js";
import { FieldError } from "./field-error.js";
import { FieldLabel } from "./field-label.js";
export interface FieldRootProps {
    invalid?: boolean;
    disabled?: boolean;
    children?: ReactNode;
}
declare function FieldRoot({ invalid, disabled, children }: FieldRootProps): import("react/jsx-runtime").JSX.Element;
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
declare function FieldsetRoot({ disabled, className, children, ...rest }: FieldsetRootProps): import("react/jsx-runtime").JSX.Element;
declare function FieldsetLegend({ className, children, ...rest }: FieldsetLegendProps): import("react/jsx-runtime").JSX.Element;
export declare const Fieldset: typeof FieldsetRoot & {
    Legend: typeof FieldsetLegend;
};
export {};


// ---- index.d.ts ----
export type { AccordionItemProps, AccordionPanelProps, AccordionRootProps, AccordionTriggerProps, } from "./accordion/accordion.js";
export { Accordion } from "./accordion/accordion.js";
export type { AlertProps, AlertVariant } from "./alert/alert.js";
export { Alert } from "./alert/alert.js";
export type { AlertDialogContentProps, AlertDialogRootProps, AlertDialogTriggerProps, } from "./alert-dialog/alert-dialog.js";
export { AlertDialog } from "./alert-dialog/alert-dialog.js";
export type { AvatarProps, AvatarSize } from "./avatar/avatar.js";
export { Avatar } from "./avatar/avatar.js";
export type { BadgeProps, BadgeVariant } from "./badge/badge.js";
export { Badge } from "./badge/badge.js";
export type { BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbListProps, BreadcrumbPageProps, BreadcrumbRootProps, BreadcrumbSeparatorProps, } from "./breadcrumb/breadcrumb.js";
export { Breadcrumb } from "./breadcrumb/breadcrumb.js";
export type { ButtonProps, ButtonSize, ButtonVariant, } from "./button/button.js";
export { Button } from "./button/button.js";
export type { CardContentProps, CardDescriptionProps, CardFooterProps, CardHeaderProps, CardRootProps, CardTitleProps, } from "./card/card.js";
export { Card } from "./card/card.js";
export type { CheckboxProps } from "./checkbox/checkbox.js";
export { Checkbox } from "./checkbox/checkbox.js";
export type { ComboboxContentProps, ComboboxInputProps, ComboboxItem, ComboboxRootProps, } from "./combobox/combobox.js";
export { Combobox } from "./combobox/combobox.js";
export type { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogRootProps, DialogTitleProps, DialogTriggerProps, } from "./dialog/dialog.js";
export { Dialog } from "./dialog/dialog.js";
export type { FieldRootProps } from "./field/field.js";
export { Field } from "./field/field.js";
export type { FieldDescriptionProps } from "./field/field-description.js";
export type { FieldErrorProps } from "./field/field-error.js";
export type { FieldLabelProps } from "./field/field-label.js";
export type { FieldsetLegendProps, FieldsetRootProps, } from "./fieldset/fieldset.js";
export { Fieldset } from "./fieldset/fieldset.js";
export type { InputProps } from "./input/input.js";
export { Input } from "./input/input.js";
export type { LinkProps } from "./link/link.js";
export { Link } from "./link/link.js";
export type { MenuContentProps, MenuItemProps, MenuRootProps, MenuTriggerProps, } from "./menu/menu.js";
export { Menu } from "./menu/menu.js";
export type { NumberFieldProps } from "./number-field/number-field.js";
export { NumberField } from "./number-field/number-field.js";
export type { PaginationProps } from "./pagination/pagination.js";
export { Pagination } from "./pagination/pagination.js";
export type { PopoverContentProps, PopoverDescriptionProps, PopoverRootProps, PopoverSide, PopoverTitleProps, PopoverTriggerProps, } from "./popover/popover.js";
export { Popover } from "./popover/popover.js";
export type { ProgressProps } from "./progress/progress.js";
export { Progress } from "./progress/progress.js";
export type { RadioGroupItemProps, RadioGroupProps, } from "./radio-group/radio-group.js";
export { RadioGroup } from "./radio-group/radio-group.js";
export type { SelectContentProps, SelectItemProps, SelectRootProps, SelectTriggerProps, SelectValueProps, } from "./select/select.js";
export { Select } from "./select/select.js";
export type { SeparatorOrientation, SeparatorProps, } from "./separator/separator.js";
export { Separator } from "./separator/separator.js";
export type { SkeletonProps, SkeletonVariant } from "./skeleton/skeleton.js";
export { Skeleton } from "./skeleton/skeleton.js";
export type { SliderProps, SliderValue } from "./slider/slider.js";
export { Slider } from "./slider/slider.js";
export type { SpinnerProps, SpinnerSize } from "./spinner/spinner.js";
export { Spinner } from "./spinner/spinner.js";
export type { SwitchProps } from "./switch/switch.js";
export { Switch } from "./switch/switch.js";
export type { TableBodyProps, TableCaptionProps, TableCellProps, TableFooterProps, TableHeaderProps, TableHeadProps, TableRootProps, TableRowProps, } from "./table/table.js";
export { Table } from "./table/table.js";
export type { TabsListProps, TabsPanelProps, TabsRootProps, TabsTabProps, } from "./tabs/tabs.js";
export { Tabs } from "./tabs/tabs.js";
export type { TextareaProps } from "./textarea/textarea.js";
export { Textarea } from "./textarea/textarea.js";
export type { ToastActionOptions, ToastOptions, ToastProviderProps, ToastVariant, UseToastResult, } from "./toast/toast.js";
export { Toast, useToast } from "./toast/toast.js";
export type { ToggleProps } from "./toggle/toggle.js";
export { Toggle } from "./toggle/toggle.js";
export type { ToggleGroupOrientation, ToggleGroupProps, } from "./toggle-group/toggle-group.js";
export { ToggleGroup } from "./toggle-group/toggle-group.js";
export type { TooltipProps, TooltipSide } from "./tooltip/tooltip.js";
export { Tooltip } from "./tooltip/tooltip.js";


// ---- input/input.d.ts ----
import type { InputHTMLAttributes } from "react";
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
    invalid?: boolean;
}
export declare const Input: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;


// ---- link/link.d.ts ----
import type { AnchorHTMLAttributes, ReactNode } from "react";
export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
    children?: ReactNode;
}
export declare const Link: import("react").ForwardRefExoticComponent<LinkProps & import("react").RefAttributes<HTMLAnchorElement>>;


// ---- menu/menu.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
export interface MenuRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function MenuRoot({ onOpenChange, ...rest }: MenuRootProps): import("react/jsx-runtime").JSX.Element;
export interface MenuTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function MenuTrigger(props: MenuTriggerProps): import("react/jsx-runtime").JSX.Element;
export interface MenuContentProps {
    children?: ReactNode;
}
declare function MenuContent({ children }: MenuContentProps): import("react/jsx-runtime").JSX.Element;
export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuItem({ className, ...rest }: MenuItemProps): import("react/jsx-runtime").JSX.Element;
export declare const Menu: typeof MenuRoot & {
    Trigger: typeof MenuTrigger;
    Content: typeof MenuContent;
    Item: typeof MenuItem;
};
export {};


// ---- number-field/number-field.d.ts ----
import type { HTMLAttributes } from "react";
export interface NumberFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> {
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
export declare const NumberField: import("react").ForwardRefExoticComponent<NumberFieldProps & import("react").RefAttributes<HTMLDivElement>>;


// ---- pagination/pagination.d.ts ----
import type { HTMLAttributes } from "react";
export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    previousLabel?: string;
    nextLabel?: string;
}
export declare const Pagination: import("react").ForwardRefExoticComponent<PaginationProps & import("react").RefAttributes<HTMLElement>>;


// ---- popover/popover.d.ts ----
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
export interface PopoverRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function PopoverRoot({ onOpenChange, ...rest }: PopoverRootProps): import("react/jsx-runtime").JSX.Element;
export interface PopoverTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function PopoverTrigger(props: PopoverTriggerProps): import("react/jsx-runtime").JSX.Element;
export type PopoverSide = "top" | "right" | "bottom" | "left";
export interface PopoverContentProps {
    side?: PopoverSide;
    sideOffset?: number;
    children?: ReactNode;
}
declare function PopoverContent({ side, sideOffset, children, }: PopoverContentProps): import("react/jsx-runtime").JSX.Element;
export interface PopoverTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
}
declare function PopoverTitle({ className, ...rest }: PopoverTitleProps): import("react/jsx-runtime").JSX.Element;
export interface PopoverDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
}
declare function PopoverDescription({ className, ...rest }: PopoverDescriptionProps): import("react/jsx-runtime").JSX.Element;
export interface PopoverCloseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function PopoverClose(props: PopoverCloseProps): import("react/jsx-runtime").JSX.Element;
export declare const Popover: typeof PopoverRoot & {
    Trigger: typeof PopoverTrigger;
    Content: typeof PopoverContent;
    Title: typeof PopoverTitle;
    Description: typeof PopoverDescription;
    Close: typeof PopoverClose;
};
export {};


// ---- progress/progress.d.ts ----
import type { HTMLAttributes, ReactNode } from "react";
export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    value: number | null;
    min?: number;
    max?: number;
    label?: ReactNode;
    showValue?: boolean;
}
export declare const Progress: import("react").ForwardRefExoticComponent<ProgressProps & import("react").RefAttributes<HTMLDivElement>>;


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
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    children?: ReactNode;
}
declare function RadioGroupRoot<Value = string>({ onValueChange, "aria-describedby": ariaDescribedBy, ...rest }: RadioGroupProps<Value>): import("react/jsx-runtime").JSX.Element;
export interface RadioGroupItemProps<Value = string> {
    value: Value;
    disabled?: boolean;
    children?: ReactNode;
}
declare function RadioGroupItem<Value = string>({ value, disabled, children, }: RadioGroupItemProps<Value>): import("react/jsx-runtime").JSX.Element;
export declare const RadioGroup: typeof RadioGroupRoot & {
    Item: typeof RadioGroupItem;
};
export {};


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
    /**
     * Maps item values to their display label, so `Select.Value` renders the
     * label of the selected item instead of the raw value. Required for
     * `Select.Value` to show anything other than the raw value once selected.
     */
    items?: Record<string, ReactNode> | ReadonlyArray<{
        label: ReactNode;
        value: Value;
    }>;
    children?: ReactNode;
}
declare function SelectRoot<Value = unknown>({ onValueChange, ...rest }: SelectRootProps<Value>): import("react/jsx-runtime").JSX.Element;
export interface SelectTriggerProps {
    id?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
    children?: ReactNode;
}
declare function SelectTrigger({ id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, children, }: SelectTriggerProps): import("react/jsx-runtime").JSX.Element;
export interface SelectValueProps {
    placeholder?: string;
}
declare function SelectValue({ placeholder }: SelectValueProps): import("react/jsx-runtime").JSX.Element;
export interface SelectContentProps {
    children?: ReactNode;
}
declare function SelectContent({ children }: SelectContentProps): import("react/jsx-runtime").JSX.Element;
export interface SelectItemProps {
    value: unknown;
    disabled?: boolean;
    children?: ReactNode;
}
declare function SelectItem({ children, ...rest }: SelectItemProps): import("react/jsx-runtime").JSX.Element;
export declare const Select: typeof SelectRoot & {
    Trigger: typeof SelectTrigger;
    Value: typeof SelectValue;
    Content: typeof SelectContent;
    Item: typeof SelectItem;
};
export {};


// ---- separator/separator.d.ts ----
import type { HTMLAttributes } from "react";
export type SeparatorOrientation = "horizontal" | "vertical";
export interface SeparatorProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    orientation?: SeparatorOrientation;
}
export declare const Separator: import("react").ForwardRefExoticComponent<SeparatorProps & import("react").RefAttributes<HTMLDivElement>>;


// ---- skeleton/skeleton.d.ts ----
import type { HTMLAttributes } from "react";
export type SkeletonVariant = "text" | "rectangular" | "circular";
export interface SkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    variant?: SkeletonVariant;
    width?: number | string;
    height?: number | string;
}
export declare const Skeleton: import("react").ForwardRefExoticComponent<SkeletonProps & import("react").RefAttributes<HTMLSpanElement>>;


// ---- slider/slider.d.ts ----
import type { HTMLAttributes } from "react";
export type SliderValue = number | readonly number[];
export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> {
    value?: SliderValue;
    defaultValue?: SliderValue;
    onValueChange?: (value: SliderValue) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    name?: string;
}
export declare const Slider: import("react").ForwardRefExoticComponent<SliderProps & import("react").RefAttributes<HTMLDivElement>>;


// ---- spinner/spinner.d.ts ----
import type { HTMLAttributes } from "react";
export type SpinnerSize = "small" | "medium" | "large";
export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    size?: SpinnerSize;
    label?: string;
}
export declare const Spinner: import("react").ForwardRefExoticComponent<SpinnerProps & import("react").RefAttributes<HTMLSpanElement>>;


// ---- switch/switch.d.ts ----
export interface SwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    name?: string;
    id?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}
export declare const Switch: import("react").ForwardRefExoticComponent<SwitchProps & import("react").RefAttributes<HTMLElement>>;


// ---- table/table.d.ts ----
import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
export type TableRootProps = TableHTMLAttributes<HTMLTableElement>;
export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;
export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;
declare function TableHeader({ className, ...rest }: TableHeaderProps): import("react/jsx-runtime").JSX.Element;
declare function TableBody({ className, ...rest }: TableBodyProps): import("react/jsx-runtime").JSX.Element;
declare function TableFooter({ className, ...rest }: TableFooterProps): import("react/jsx-runtime").JSX.Element;
declare function TableRow({ className, ...rest }: TableRowProps): import("react/jsx-runtime").JSX.Element;
declare function TableHead({ scope, className, ...rest }: TableHeadProps): import("react/jsx-runtime").JSX.Element;
declare function TableCell({ className, ...rest }: TableCellProps): import("react/jsx-runtime").JSX.Element;
declare function TableCaption({ className, ...rest }: TableCaptionProps): import("react/jsx-runtime").JSX.Element;
export declare const Table: import("react").ForwardRefExoticComponent<TableRootProps & import("react").RefAttributes<HTMLTableElement>> & {
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
declare function TabsRoot({ onValueChange, ...rest }: TabsRootProps): import("react/jsx-runtime").JSX.Element;
export interface TabsListProps {
    children?: ReactNode;
}
declare function TabsList({ children }: TabsListProps): import("react/jsx-runtime").JSX.Element;
export interface TabsTabProps {
    value: unknown;
    disabled?: boolean;
    children?: ReactNode;
}
declare function TabsTab({ children, ...rest }: TabsTabProps): import("react/jsx-runtime").JSX.Element;
export interface TabsPanelProps {
    value: unknown;
    children?: ReactNode;
}
declare function TabsPanel({ children, ...rest }: TabsPanelProps): import("react/jsx-runtime").JSX.Element;
export declare const Tabs: typeof TabsRoot & {
    List: typeof TabsList;
    Tab: typeof TabsTab;
    Panel: typeof TabsPanel;
};
export {};


// ---- textarea/textarea.d.ts ----
import type { TextareaHTMLAttributes } from "react";
export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
    invalid?: boolean;
}
export declare const Textarea: import("react").ForwardRefExoticComponent<TextareaProps & import("react").RefAttributes<HTMLTextAreaElement>>;


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
declare function ToastProvider({ children, timeout, limit, dismissLabel, }: ToastProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useToast(): UseToastResult;
export declare const Toast: {
    Provider: typeof ToastProvider;
};
export {};


// ---- toggle-group/toggle-group.d.ts ----
import type { HTMLAttributes, ReactNode } from "react";
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
declare function ToggleGroupRoot({ value, defaultValue, onValueChange, multiple, disabled, orientation, loopFocus, className, children, ...rest }: ToggleGroupProps): import("react/jsx-runtime").JSX.Element;
export declare const ToggleGroup: typeof ToggleGroupRoot & {
    Item: import("react").ForwardRefExoticComponent<import("../toggle/toggle.js").ToggleProps & import("react").RefAttributes<HTMLButtonElement>>;
};
export {};


// ---- toggle/toggle.d.ts ----
import type { ButtonHTMLAttributes, ReactNode } from "react";
export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    value?: string;
    children?: ReactNode;
}
export declare const Toggle: import("react").ForwardRefExoticComponent<ToggleProps & import("react").RefAttributes<HTMLButtonElement>>;


// ---- tooltip/tooltip.d.ts ----
import type { ReactElement, ReactNode } from "react";
export type TooltipSide = "top" | "right" | "bottom" | "left";
export interface TooltipProps {
    content: ReactNode;
    side?: TooltipSide;
    sideOffset?: number;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactElement;
}
export declare function Tooltip({ content, side, sideOffset, onOpenChange, children, ...rest }: TooltipProps): import("react/jsx-runtime").JSX.Element;

