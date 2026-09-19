import type { ComponentPropsWithoutRef } from "react";

import styles from "./Primitives.module.css";
import { mergeClassNames } from "../utils/merge-class-names";

export type TextProps = Omit<ComponentPropsWithoutRef<"p">, "color"> & {
  as?: "p" | "span" | "h1" | "h2" | "h3";
  variant?: "body" | "label" | "title" | "display";
  tone?: "primary" | "muted" | "on-reading";
};

const variantClasses = {
  body: styles.textBody,
  label: styles.textLabel,
  title: styles.textTitle,
  display: styles.textDisplay,
} as const;

const toneClasses = {
  primary: styles.textPrimary,
  muted: styles.textMuted,
  "on-reading": styles.textOnReading,
} as const;

export const Text = ({
  as: Component = "p",
  variant = "body",
  tone = "primary",
  className,
  ...props
}: TextProps) => (
  <Component
    {...props}
    className={mergeClassNames(styles.text, variantClasses[variant], toneClasses[tone], className)}
  />
);
