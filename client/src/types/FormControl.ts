import React, { ReactNode } from "react";
import { ActionMeta } from "react-select";

export interface IOption {
  value: string | number;
  label: string;
}

export interface ICustomFormControl {
  label: string;
  placeholder?: string;
  type?: string;
  isDisabled?: boolean;
  value?: string | number;
  setValue?: (value: string) => void;
  variant?: "input" | "select" | "textarea";
  options?: string[] | IOption[];
  addRightLeftElement?: boolean;
  rightElementText?: string;
  rightElementLink?: string;
  rightElement?: ReactNode;
  onClickRightElement?: () => {};
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export interface CustomFormMultiSelectProps {
  as?: any;
  colSpan?: any;
  label: string;
  placeholder: string;
  options: IOption[];
  onChange?: (value: string[], action: ActionMeta<any>) => void;
  formLabel: string;
  value?: any;
  defaultValue?: any;
}
