import { Button, type ButtonProps } from "react-aria-components";

import styles from "./ActionButton.module.css";
import { mergeClassNames } from "../utils/merge-class-names";

export interface ActionButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "quiet" | "danger";
}

export const ActionButton = ({ variant = "primary", className, ...props }: ActionButtonProps) => (
  <Button
    {...props}
    data-variant={variant}
    className={(renderProps) =>
      mergeClassNames(
        styles.button,
        styles[variant],
        typeof className === "function" ? className(renderProps) : className,
      )
    }
  />
);
