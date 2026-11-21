// ---- accordion/accordion.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface AccordionRootProps {
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
declare function AccordionRoot({ onValueChange, ...rest }: AccordionRootProps): react_jsx_runtime.JSX.Element;
interface AccordionItemProps {
    value: unknown;
    disabled?: boolean;
    children?: ReactNode;
}
declare function AccordionItem({ children, ...rest }: AccordionItemProps): react_jsx_runtime.JSX.Element;
interface AccordionTriggerProps {
    children?: ReactNode;
}
declare function AccordionTrigger({ children }: AccordionTriggerProps): react_jsx_runtime.JSX.Element;
interface AccordionPanelProps {
    children?: ReactNode;
}
declare function AccordionPanel({ children }: AccordionPanelProps): react_jsx_runtime.JSX.Element;
declare const Accordion: typeof AccordionRoot & {
    Item: typeof AccordionItem;
    Trigger: typeof AccordionTrigger;
    Panel: typeof AccordionPanel;
};

export { Accordion, type AccordionItemProps, type AccordionPanelProps, type AccordionRootProps, type AccordionTriggerProps };


// ---- alert-dialog/alert-dialog.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { DialogTitleProps, DialogDescriptionProps, DialogCloseProps } from '../dialog/dialog.js';

interface AlertDialogRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function AlertDialogRoot({ onOpenChange, ...rest }: AlertDialogRootProps): react_jsx_runtime.JSX.Element;
interface AlertDialogTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function AlertDialogTrigger(props: AlertDialogTriggerProps): react_jsx_runtime.JSX.Element;
interface AlertDialogContentProps {
    children?: ReactNode;
}
declare function AlertDialogContent({ children }: AlertDialogContentProps): react_jsx_runtime.JSX.Element;
declare const AlertDialog: typeof AlertDialogRoot & {
    Trigger: typeof AlertDialogTrigger;
    Content: typeof AlertDialogContent;
    Title: ({ className, ...rest }: DialogTitleProps) => react_jsx_runtime.JSX.Element;
    Description: ({ className, ...rest }: DialogDescriptionProps) => react_jsx_runtime.JSX.Element;
    Close: (props: DialogCloseProps) => react_jsx_runtime.JSX.Element;
};

export { AlertDialog, type AlertDialogContentProps, type AlertDialogRootProps, type AlertDialogTriggerProps };


// ---- alert/alert.d.ts ----
import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

type AlertVariant = "info" | "success" | "warning" | "danger";
interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: AlertVariant;
    title?: ReactNode;
    children?: ReactNode;
}
declare const Alert: react.ForwardRefExoticComponent<AlertProps & react.RefAttributes<HTMLDivElement>>;

export { Alert, type AlertProps, type AlertVariant };


// ---- avatar/avatar.d.ts ----
import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

type AvatarSize = "small" | "medium" | "large";
interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    src?: string;
    alt: string;
    fallback?: ReactNode;
    size?: AvatarSize;
}
declare const Avatar: react.ForwardRefExoticComponent<AvatarProps & react.RefAttributes<HTMLSpanElement>>;

export { Avatar, type AvatarProps, type AvatarSize };


// ---- badge/badge.d.ts ----
import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    children?: ReactNode;
}
declare const Badge: react.ForwardRefExoticComponent<BadgeProps & react.RefAttributes<HTMLSpanElement>>;

export { Badge, type BadgeProps, type BadgeVariant };


// ---- breadcrumb/breadcrumb.d.ts ----
import * as react from 'react';
import { HTMLAttributes, OlHTMLAttributes, LiHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

type BreadcrumbRootProps = HTMLAttributes<HTMLElement>;
type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>;
type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;
type BreadcrumbLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;
type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;
interface BreadcrumbSeparatorProps extends LiHTMLAttributes<HTMLLIElement> {
    children?: ReactNode;
}
declare function BreadcrumbList({ className, ...rest }: BreadcrumbListProps): react_jsx_runtime.JSX.Element;
declare function BreadcrumbItem({ className, ...rest }: BreadcrumbItemProps): react_jsx_runtime.JSX.Element;
declare function BreadcrumbLink({ className, ...rest }: BreadcrumbLinkProps): react_jsx_runtime.JSX.Element;
declare function BreadcrumbPage({ className, ...rest }: BreadcrumbPageProps): react_jsx_runtime.JSX.Element;
declare function BreadcrumbSeparator({ children, className, ...rest }: BreadcrumbSeparatorProps): react_jsx_runtime.JSX.Element;
declare const Breadcrumb: react.ForwardRefExoticComponent<BreadcrumbRootProps & react.RefAttributes<HTMLElement>> & {
    List: typeof BreadcrumbList;
    Item: typeof BreadcrumbItem;
    Link: typeof BreadcrumbLink;
    Page: typeof BreadcrumbPage;
    Separator: typeof BreadcrumbSeparator;
};

export { Breadcrumb, type BreadcrumbItemProps, type BreadcrumbLinkProps, type BreadcrumbListProps, type BreadcrumbPageProps, type BreadcrumbRootProps, type BreadcrumbSeparatorProps };


// ---- button/button.d.ts ----
import * as react from 'react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "medium";
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children?: ReactNode;
}
declare const Button: react.ForwardRefExoticComponent<ButtonProps & react.RefAttributes<HTMLButtonElement>>;

export { Button, type ButtonProps, type ButtonSize, type ButtonVariant };


// ---- card/card.d.ts ----
import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
}
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
}
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function CardHeader({ className, ...rest }: CardHeaderProps): react_jsx_runtime.JSX.Element;
declare function CardTitle({ className, ...rest }: CardTitleProps): react_jsx_runtime.JSX.Element;
declare function CardDescription({ className, ...rest }: CardDescriptionProps): react_jsx_runtime.JSX.Element;
declare function CardContent({ className, ...rest }: CardContentProps): react_jsx_runtime.JSX.Element;
declare function CardFooter({ className, ...rest }: CardFooterProps): react_jsx_runtime.JSX.Element;
declare const Card: react.ForwardRefExoticComponent<CardRootProps & react.RefAttributes<HTMLDivElement>> & {
    Header: typeof CardHeader;
    Title: typeof CardTitle;
    Description: typeof CardDescription;
    Content: typeof CardContent;
    Footer: typeof CardFooter;
};

export { Card, type CardContentProps, type CardDescriptionProps, type CardFooterProps, type CardHeaderProps, type CardRootProps, type CardTitleProps };


// ---- checkbox/checkbox.d.ts ----
import * as react from 'react';

interface CheckboxProps {
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
declare const Checkbox: react.ForwardRefExoticComponent<CheckboxProps & react.RefAttributes<HTMLElement>>;

export { Checkbox, type CheckboxProps };


// ---- combobox/combobox.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface ComboboxItem<Value> {
    label: string;
    value: Value;
}
interface ComboboxRootProps<Value = unknown> {
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
declare function ComboboxRoot<Value = unknown>({ value, defaultValue, onValueChange, onInputValueChange, items, ...rest }: ComboboxRootProps<Value>): react_jsx_runtime.JSX.Element;
interface ComboboxInputProps {
    id?: string;
    placeholder?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}
declare function ComboboxInput({ id, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest }: ComboboxInputProps): react_jsx_runtime.JSX.Element;
interface ComboboxContentProps {
    emptyMessage?: ReactNode;
}
declare function ComboboxContent({ emptyMessage, }: ComboboxContentProps): react_jsx_runtime.JSX.Element;
declare const Combobox: typeof ComboboxRoot & {
    Input: typeof ComboboxInput;
    Content: typeof ComboboxContent;
};

export { Combobox, type ComboboxContentProps, type ComboboxInputProps, type ComboboxItem, type ComboboxRootProps };


// ---- dialog/dialog.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { HTMLAttributes, ReactNode, ButtonHTMLAttributes } from 'react';

interface DialogRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean | "trap-focus";
    children?: ReactNode;
}
declare function DialogRoot({ onOpenChange, ...rest }: DialogRootProps): react_jsx_runtime.JSX.Element;
interface DialogTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function DialogTrigger(props: DialogTriggerProps): react_jsx_runtime.JSX.Element;
interface DialogContentProps {
    children?: ReactNode;
    closeLabel?: string;
}
declare function DialogContent({ children, closeLabel }: DialogContentProps): react_jsx_runtime.JSX.Element;
interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
}
declare function DialogTitle({ className, ...rest }: DialogTitleProps): react_jsx_runtime.JSX.Element;
interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
}
declare function DialogDescription({ className, ...rest }: DialogDescriptionProps): react_jsx_runtime.JSX.Element;
interface DialogCloseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function DialogCloseButton(props: DialogCloseProps): react_jsx_runtime.JSX.Element;
declare const Dialog: typeof DialogRoot & {
    Trigger: typeof DialogTrigger;
    Content: typeof DialogContent;
    Title: typeof DialogTitle;
    Description: typeof DialogDescription;
    Close: typeof DialogCloseButton;
};

export { Dialog, type DialogCloseProps, type DialogContentProps, type DialogDescriptionProps, type DialogRootProps, type DialogTitleProps, type DialogTriggerProps };


// ---- dialog/use-dialog-portal-container.d.ts ----
declare function useDialogPortalContainer(): {
    container: HTMLElement | null | undefined;
    scopeRef: (node: HTMLSpanElement | null) => void;
};

export { useDialogPortalContainer };


// ---- field/field-context.d.ts ----
import * as react from 'react';

interface FieldContextValue {
    controlId: string;
    descriptionId: string;
    errorId: string;
    describedBy: string;
    invalid: boolean;
}
declare const FieldContext: react.Context<FieldContextValue | null>;
declare function useFieldContext(): FieldContextValue | null;

export { FieldContext, type FieldContextValue, useFieldContext };


// ---- field/field-description.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface FieldDescriptionProps {
    children?: ReactNode;
}
declare function FieldDescription({ children }: FieldDescriptionProps): react_jsx_runtime.JSX.Element;

export { FieldDescription, type FieldDescriptionProps };


// ---- field/field-error.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface FieldErrorProps {
    children?: ReactNode;
}
declare function FieldError({ children }: FieldErrorProps): react_jsx_runtime.JSX.Element | null;

export { FieldError, type FieldErrorProps };


// ---- field/field-label.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { LabelHTMLAttributes, ReactNode } from 'react';

interface FieldLabelProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor"> {
    children?: ReactNode;
}
declare function FieldLabel({ children, className, ...rest }: FieldLabelProps): react_jsx_runtime.JSX.Element;

export { FieldLabel, type FieldLabelProps };


// ---- field/field.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { FieldDescription } from './field-description.js';
import { FieldError } from './field-error.js';
import { FieldLabel } from './field-label.js';

interface FieldRootProps {
    invalid?: boolean;
    disabled?: boolean;
    children?: ReactNode;
}
declare function FieldRoot({ invalid, disabled, children }: FieldRootProps): react_jsx_runtime.JSX.Element;
declare const Field: typeof FieldRoot & {
    Label: typeof FieldLabel;
    Description: typeof FieldDescription;
    Error: typeof FieldError;
};

export { Field, type FieldRootProps };


// ---- fieldset/fieldset.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { FieldsetHTMLAttributes, ReactNode, HTMLAttributes } from 'react';

interface FieldsetRootProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
    children?: ReactNode;
}
interface FieldsetLegendProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function FieldsetRoot({ disabled, className, children, ...rest }: FieldsetRootProps): react_jsx_runtime.JSX.Element;
declare function FieldsetLegend({ className, children, ...rest }: FieldsetLegendProps): react_jsx_runtime.JSX.Element;
declare const Fieldset: typeof FieldsetRoot & {
    Legend: typeof FieldsetLegend;
};

export { Fieldset, type FieldsetLegendProps, type FieldsetRootProps };


// ---- index.d.ts ----
export { Accordion, AccordionItemProps, AccordionPanelProps, AccordionRootProps, AccordionTriggerProps } from './accordion/accordion.js';
export { Alert, AlertProps, AlertVariant } from './alert/alert.js';
export { AlertDialog, AlertDialogContentProps, AlertDialogRootProps, AlertDialogTriggerProps } from './alert-dialog/alert-dialog.js';
export { Avatar, AvatarProps, AvatarSize } from './avatar/avatar.js';
export { Badge, BadgeProps, BadgeVariant } from './badge/badge.js';
export { Breadcrumb, BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbListProps, BreadcrumbPageProps, BreadcrumbRootProps, BreadcrumbSeparatorProps } from './breadcrumb/breadcrumb.js';
export { Button, ButtonProps, ButtonSize, ButtonVariant } from './button/button.js';
export { Card, CardContentProps, CardDescriptionProps, CardFooterProps, CardHeaderProps, CardRootProps, CardTitleProps } from './card/card.js';
export { Checkbox, CheckboxProps } from './checkbox/checkbox.js';
export { Combobox, ComboboxContentProps, ComboboxInputProps, ComboboxItem, ComboboxRootProps } from './combobox/combobox.js';
export { Dialog, DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogRootProps, DialogTitleProps, DialogTriggerProps } from './dialog/dialog.js';
export { Field, FieldRootProps } from './field/field.js';
export { FieldDescriptionProps } from './field/field-description.js';
export { FieldErrorProps } from './field/field-error.js';
export { FieldLabelProps } from './field/field-label.js';
export { Fieldset, FieldsetLegendProps, FieldsetRootProps } from './fieldset/fieldset.js';
export { Input, InputProps } from './input/input.js';
export { Link, LinkProps } from './link/link.js';
export { Menu, MenuContentProps, MenuItemProps, MenuRootProps, MenuTriggerProps } from './menu/menu.js';
export { NumberField, NumberFieldProps } from './number-field/number-field.js';
export { Pagination, PaginationProps } from './pagination/pagination.js';
export { Popover, PopoverContentProps, PopoverDescriptionProps, PopoverRootProps, PopoverSide, PopoverTitleProps, PopoverTriggerProps } from './popover/popover.js';
export { Progress, ProgressProps } from './progress/progress.js';
export { RadioGroup, RadioGroupItemProps, RadioGroupProps } from './radio-group/radio-group.js';
export { Select, SelectContentProps, SelectItemProps, SelectRootProps, SelectTriggerProps, SelectValueProps } from './select/select.js';
export { Separator, SeparatorOrientation, SeparatorProps } from './separator/separator.js';
export { Skeleton, SkeletonProps, SkeletonVariant } from './skeleton/skeleton.js';
export { Slider, SliderProps, SliderValue } from './slider/slider.js';
export { Spinner, SpinnerProps, SpinnerSize } from './spinner/spinner.js';
export { Switch, SwitchProps } from './switch/switch.js';
export { Table, TableBodyProps, TableCaptionProps, TableCellProps, TableFooterProps, TableHeadProps, TableHeaderProps, TableRootProps, TableRowProps } from './table/table.js';
export { Tabs, TabsListProps, TabsPanelProps, TabsRootProps, TabsTabProps } from './tabs/tabs.js';
export { Textarea, TextareaProps } from './textarea/textarea.js';
export { Toast, ToastActionOptions, ToastOptions, ToastProviderProps, ToastVariant, UseToastResult, useToast } from './toast/toast.js';
export { Toggle, ToggleProps } from './toggle/toggle.js';
export { ToggleGroup, ToggleGroupOrientation, ToggleGroupProps } from './toggle-group/toggle-group.js';
export { Tooltip, TooltipProps, TooltipSide } from './tooltip/tooltip.js';
import 'react/jsx-runtime';
import 'react';


// ---- input/input.d.ts ----
import * as react from 'react';
import { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
    invalid?: boolean;
}
declare const Input: react.ForwardRefExoticComponent<InputProps & react.RefAttributes<HTMLInputElement>>;

export { Input, type InputProps };


// ---- link/link.d.ts ----
import * as react from 'react';
import { AnchorHTMLAttributes, ReactNode } from 'react';

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
    children?: ReactNode;
}
declare const Link: react.ForwardRefExoticComponent<LinkProps & react.RefAttributes<HTMLAnchorElement>>;

export { Link, type LinkProps };


// ---- menu/menu.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react';

interface MenuRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function MenuRoot({ onOpenChange, ...rest }: MenuRootProps): react_jsx_runtime.JSX.Element;
interface MenuTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function MenuTrigger(props: MenuTriggerProps): react_jsx_runtime.JSX.Element;
interface MenuContentProps {
    children?: ReactNode;
}
declare function MenuContent({ children }: MenuContentProps): react_jsx_runtime.JSX.Element;
interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
    children?: ReactNode;
}
declare function MenuItem({ className, ...rest }: MenuItemProps): react_jsx_runtime.JSX.Element;
declare const Menu: typeof MenuRoot & {
    Trigger: typeof MenuTrigger;
    Content: typeof MenuContent;
    Item: typeof MenuItem;
};

export { Menu, type MenuContentProps, type MenuItemProps, type MenuRootProps, type MenuTriggerProps };


// ---- number-field/number-field.d.ts ----
import * as react from 'react';
import { HTMLAttributes } from 'react';

interface NumberFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> {
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
declare const NumberField: react.ForwardRefExoticComponent<NumberFieldProps & react.RefAttributes<HTMLDivElement>>;

export { NumberField, type NumberFieldProps };


// ---- pagination/pagination.d.ts ----
import * as react from 'react';
import { HTMLAttributes } from 'react';

interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    previousLabel?: string;
    nextLabel?: string;
}
declare const Pagination: react.ForwardRefExoticComponent<PaginationProps & react.RefAttributes<HTMLElement>>;

export { Pagination, type PaginationProps };


// ---- popover/popover.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react';

interface PopoverRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
}
declare function PopoverRoot({ onOpenChange, ...rest }: PopoverRootProps): react_jsx_runtime.JSX.Element;
interface PopoverTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function PopoverTrigger(props: PopoverTriggerProps): react_jsx_runtime.JSX.Element;
type PopoverSide = "top" | "right" | "bottom" | "left";
interface PopoverContentProps {
    side?: PopoverSide;
    sideOffset?: number;
    children?: ReactNode;
}
declare function PopoverContent({ side, sideOffset, children, }: PopoverContentProps): react_jsx_runtime.JSX.Element;
interface PopoverTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
}
declare function PopoverTitle({ className, ...rest }: PopoverTitleProps): react_jsx_runtime.JSX.Element;
interface PopoverDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
}
declare function PopoverDescription({ className, ...rest }: PopoverDescriptionProps): react_jsx_runtime.JSX.Element;
interface PopoverCloseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode;
}
declare function PopoverClose(props: PopoverCloseProps): react_jsx_runtime.JSX.Element;
declare const Popover: typeof PopoverRoot & {
    Trigger: typeof PopoverTrigger;
    Content: typeof PopoverContent;
    Title: typeof PopoverTitle;
    Description: typeof PopoverDescription;
    Close: typeof PopoverClose;
};

export { Popover, type PopoverCloseProps, type PopoverContentProps, type PopoverDescriptionProps, type PopoverRootProps, type PopoverSide, type PopoverTitleProps, type PopoverTriggerProps };


// ---- progress/progress.d.ts ----
import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    value: number | null;
    min?: number;
    max?: number;
    label?: ReactNode;
    showValue?: boolean;
}
declare const Progress: react.ForwardRefExoticComponent<ProgressProps & react.RefAttributes<HTMLDivElement>>;

export { Progress, type ProgressProps };


// ---- radio-group/radio-group.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface RadioGroupProps<Value = string> {
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
declare function RadioGroupRoot<Value = string>({ onValueChange, "aria-describedby": ariaDescribedBy, ...rest }: RadioGroupProps<Value>): react_jsx_runtime.JSX.Element;
interface RadioGroupItemProps<Value = string> {
    value: Value;
    disabled?: boolean;
    children?: ReactNode;
}
declare function RadioGroupItem<Value = string>({ value, disabled, children, }: RadioGroupItemProps<Value>): react_jsx_runtime.JSX.Element;
declare const RadioGroup: typeof RadioGroupRoot & {
    Item: typeof RadioGroupItem;
};

export { RadioGroup, type RadioGroupItemProps, type RadioGroupProps };


// ---- select/select.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface SelectRootProps<Value = unknown> {
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
declare function SelectRoot<Value = unknown>({ onValueChange, ...rest }: SelectRootProps<Value>): react_jsx_runtime.JSX.Element;
interface SelectTriggerProps {
    id?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
    children?: ReactNode;
}
declare function SelectTrigger({ id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, children, }: SelectTriggerProps): react_jsx_runtime.JSX.Element;
interface SelectValueProps {
    placeholder?: string;
}
declare function SelectValue({ placeholder }: SelectValueProps): react_jsx_runtime.JSX.Element;
interface SelectContentProps {
    children?: ReactNode;
}
declare function SelectContent({ children }: SelectContentProps): react_jsx_runtime.JSX.Element;
interface SelectItemProps {
    value: unknown;
    disabled?: boolean;
    children?: ReactNode;
}
declare function SelectItem({ children, ...rest }: SelectItemProps): react_jsx_runtime.JSX.Element;
declare const Select: typeof SelectRoot & {
    Trigger: typeof SelectTrigger;
    Value: typeof SelectValue;
    Content: typeof SelectContent;
    Item: typeof SelectItem;
};

export { Select, type SelectContentProps, type SelectItemProps, type SelectRootProps, type SelectTriggerProps, type SelectValueProps };


// ---- separator/separator.d.ts ----
import * as react from 'react';
import { HTMLAttributes } from 'react';

type SeparatorOrientation = "horizontal" | "vertical";
interface SeparatorProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    orientation?: SeparatorOrientation;
}
declare const Separator: react.ForwardRefExoticComponent<SeparatorProps & react.RefAttributes<HTMLDivElement>>;

export { Separator, type SeparatorOrientation, type SeparatorProps };


// ---- skeleton/skeleton.d.ts ----
import * as react from 'react';
import { HTMLAttributes } from 'react';

type SkeletonVariant = "text" | "rectangular" | "circular";
interface SkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    variant?: SkeletonVariant;
    width?: number | string;
    height?: number | string;
}
declare const Skeleton: react.ForwardRefExoticComponent<SkeletonProps & react.RefAttributes<HTMLSpanElement>>;

export { Skeleton, type SkeletonProps, type SkeletonVariant };


// ---- slider/slider.d.ts ----
import * as react from 'react';
import { HTMLAttributes } from 'react';

type SliderValue = number | readonly number[];
interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> {
    value?: SliderValue;
    defaultValue?: SliderValue;
    onValueChange?: (value: SliderValue) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    name?: string;
}
declare const Slider: react.ForwardRefExoticComponent<SliderProps & react.RefAttributes<HTMLDivElement>>;

export { Slider, type SliderProps, type SliderValue };


// ---- spinner/spinner.d.ts ----
import * as react from 'react';
import { HTMLAttributes } from 'react';

type SpinnerSize = "small" | "medium" | "large";
interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    size?: SpinnerSize;
    label?: string;
}
declare const Spinner: react.ForwardRefExoticComponent<SpinnerProps & react.RefAttributes<HTMLSpanElement>>;

export { Spinner, type SpinnerProps, type SpinnerSize };


// ---- switch/switch.d.ts ----
import * as react from 'react';

interface SwitchProps {
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
declare const Switch: react.ForwardRefExoticComponent<SwitchProps & react.RefAttributes<HTMLElement>>;

export { Switch, type SwitchProps };


// ---- table/table.d.ts ----
import * as react from 'react';
import { TableHTMLAttributes, HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

type TableRootProps = TableHTMLAttributes<HTMLTableElement>;
type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;
type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;
type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;
type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;
declare function TableHeader({ className, ...rest }: TableHeaderProps): react_jsx_runtime.JSX.Element;
declare function TableBody({ className, ...rest }: TableBodyProps): react_jsx_runtime.JSX.Element;
declare function TableFooter({ className, ...rest }: TableFooterProps): react_jsx_runtime.JSX.Element;
declare function TableRow({ className, ...rest }: TableRowProps): react_jsx_runtime.JSX.Element;
declare function TableHead({ scope, className, ...rest }: TableHeadProps): react_jsx_runtime.JSX.Element;
declare function TableCell({ className, ...rest }: TableCellProps): react_jsx_runtime.JSX.Element;
declare function TableCaption({ className, ...rest }: TableCaptionProps): react_jsx_runtime.JSX.Element;
declare const Table: react.ForwardRefExoticComponent<TableRootProps & react.RefAttributes<HTMLTableElement>> & {
    Header: typeof TableHeader;
    Body: typeof TableBody;
    Footer: typeof TableFooter;
    Row: typeof TableRow;
    Head: typeof TableHead;
    Cell: typeof TableCell;
    Caption: typeof TableCaption;
};

export { Table, type TableBodyProps, type TableCaptionProps, type TableCellProps, type TableFooterProps, type TableHeadProps, type TableHeaderProps, type TableRootProps, type TableRowProps };


// ---- tabs/tabs.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface TabsRootProps {
    value?: unknown;
    defaultValue?: unknown;
    onValueChange?: (value: unknown) => void;
    children?: ReactNode;
}
declare function TabsRoot({ onValueChange, ...rest }: TabsRootProps): react_jsx_runtime.JSX.Element;
interface TabsListProps {
    children?: ReactNode;
}
declare function TabsList({ children }: TabsListProps): react_jsx_runtime.JSX.Element;
interface TabsTabProps {
    value: unknown;
    disabled?: boolean;
    children?: ReactNode;
}
declare function TabsTab({ children, ...rest }: TabsTabProps): react_jsx_runtime.JSX.Element;
interface TabsPanelProps {
    value: unknown;
    children?: ReactNode;
}
declare function TabsPanel({ children, ...rest }: TabsPanelProps): react_jsx_runtime.JSX.Element;
declare const Tabs: typeof TabsRoot & {
    List: typeof TabsList;
    Tab: typeof TabsTab;
    Panel: typeof TabsPanel;
};

export { Tabs, type TabsListProps, type TabsPanelProps, type TabsRootProps, type TabsTabProps };


// ---- textarea/textarea.d.ts ----
import * as react from 'react';
import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
    invalid?: boolean;
}
declare const Textarea: react.ForwardRefExoticComponent<TextareaProps & react.RefAttributes<HTMLTextAreaElement>>;

export { Textarea, type TextareaProps };


// ---- toast/toast.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

type ToastVariant = "neutral" | "info" | "success" | "warning" | "danger";
interface ToastActionOptions {
    label: string;
    onClick: () => void;
}
interface ToastOptions {
    id?: string;
    title?: ReactNode;
    description?: ReactNode;
    variant?: ToastVariant;
    timeout?: number;
    priority?: "low" | "high";
    action?: ToastActionOptions;
}
interface UseToastResult {
    add: (options: ToastOptions) => string;
    close: (id?: string) => void;
}
interface ToastProviderProps {
    children: ReactNode;
    timeout?: number;
    limit?: number;
    dismissLabel?: string;
}
declare function ToastProvider({ children, timeout, limit, dismissLabel, }: ToastProviderProps): react_jsx_runtime.JSX.Element;
declare function useToast(): UseToastResult;
declare const Toast: {
    Provider: typeof ToastProvider;
};

export { Toast, type ToastActionOptions, type ToastOptions, type ToastProviderProps, type ToastVariant, type UseToastResult, useToast };


// ---- toggle-group/toggle-group.d.ts ----
import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ToggleProps } from '../toggle/toggle.js';

type ToggleGroupOrientation = "horizontal" | "vertical";
interface ToggleGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    value?: readonly string[];
    defaultValue?: readonly string[];
    onValueChange?: (value: string[]) => void;
    multiple?: boolean;
    disabled?: boolean;
    orientation?: ToggleGroupOrientation;
    loopFocus?: boolean;
    children?: ReactNode;
}
declare function ToggleGroupRoot({ value, defaultValue, onValueChange, multiple, disabled, orientation, loopFocus, className, children, ...rest }: ToggleGroupProps): react_jsx_runtime.JSX.Element;
declare const ToggleGroup: typeof ToggleGroupRoot & {
    Item: react.ForwardRefExoticComponent<ToggleProps & react.RefAttributes<HTMLButtonElement>>;
};

export { ToggleGroup, type ToggleGroupOrientation, type ToggleGroupProps };


// ---- toggle/toggle.d.ts ----
import * as react from 'react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    value?: string;
    children?: ReactNode;
}
declare const Toggle: react.ForwardRefExoticComponent<ToggleProps & react.RefAttributes<HTMLButtonElement>>;

export { Toggle, type ToggleProps };


// ---- tooltip/tooltip.d.ts ----
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, ReactElement } from 'react';

type TooltipSide = "top" | "right" | "bottom" | "left";
interface TooltipProps {
    content: ReactNode;
    side?: TooltipSide;
    sideOffset?: number;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactElement;
}
declare function Tooltip({ content, side, sideOffset, onOpenChange, children, ...rest }: TooltipProps): react_jsx_runtime.JSX.Element;

export { Tooltip, type TooltipProps, type TooltipSide };

