import type { Ref } from "react";
import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components/TextField";

import styles from "./TextField.module.css";
import { mergeClassNames } from "../utils/merge-class-names";

export interface TextFieldProps extends Omit<AriaTextFieldProps, "children"> {
  label: string;
  description?: string;
  errorMessage?: string;
  inputRef?: Ref<HTMLInputElement>;
}

export const TextField = ({
  label,
  description,
  errorMessage,
  inputRef,
  className,
  ...props
}: TextFieldProps) => (
  <AriaTextField
    {...props}
    className={(renderProps) =>
      mergeClassNames(
        styles.field,
        typeof className === "function" ? className(renderProps) : className,
      )
    }
  >
    <Label className={styles.label}>{label}</Label>
    <Input {...(inputRef === undefined ? {} : { ref: inputRef })} className={styles.input ?? ""} />
    {description ? (
      <Text slot="description" className={styles.description}>
        {description}
      </Text>
    ) : null}
    {errorMessage ? (
      <FieldError className={styles.error ?? ""}>
        <span className={styles.errorIcon} aria-hidden="true">
          !
        </span>
        {errorMessage}
      </FieldError>
    ) : null}
  </AriaTextField>
);
