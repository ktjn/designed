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
declare function ComboboxContent({ emptyMessage }: ComboboxContentProps): react_jsx_runtime.JSX.Element;
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


// ---- index.d.ts ----
export { Accordion, AccordionItemProps, AccordionPanelProps, AccordionRootProps, AccordionTriggerProps } from './accordion/accordion.js';
export { AlertDialog, AlertDialogContentProps, AlertDialogRootProps, AlertDialogTriggerProps } from './alert-dialog/alert-dialog.js';
export { Button, ButtonProps, ButtonSize, ButtonVariant } from './button/button.js';
export { Checkbox, CheckboxProps } from './checkbox/checkbox.js';
export { Combobox, ComboboxContentProps, ComboboxInputProps, ComboboxItem, ComboboxRootProps } from './combobox/combobox.js';
export { Dialog, DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogRootProps, DialogTitleProps, DialogTriggerProps } from './dialog/dialog.js';
export { Field, FieldRootProps } from './field/field.js';
export { FieldDescriptionProps } from './field/field-description.js';
export { FieldErrorProps } from './field/field-error.js';
export { FieldLabelProps } from './field/field-label.js';
export { Input, InputProps } from './input/input.js';
export { Link, LinkProps } from './link/link.js';
export { Menu, MenuContentProps, MenuItemProps, MenuRootProps, MenuTriggerProps } from './menu/menu.js';
export { Popover, PopoverContentProps, PopoverDescriptionProps, PopoverRootProps, PopoverSide, PopoverTitleProps, PopoverTriggerProps } from './popover/popover.js';
export { RadioGroup, RadioGroupItemProps, RadioGroupProps } from './radio-group/radio-group.js';
export { Select, SelectContentProps, SelectItemProps, SelectRootProps, SelectTriggerProps, SelectValueProps } from './select/select.js';
export { Switch, SwitchProps } from './switch/switch.js';
export { Tabs, TabsListProps, TabsPanelProps, TabsRootProps, TabsTabProps } from './tabs/tabs.js';
export { Textarea, TextareaProps } from './textarea/textarea.js';
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

