import type { ComponentPropsWithoutRef } from "react";

import styles from "./Primitives.module.css";
import { mergeClassNames } from "../utils/merge-class-names";

export type StackProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "section" | "form";
  gap?: "xs" | "sm" | "md" | "lg";
  align?: "start" | "center" | "stretch";
};

const gapClasses = {
  xs: styles.stackGapXs,
  sm: styles.stackGapSm,
  md: styles.stackGapMd,
  lg: styles.stackGapLg,
} as const;

const alignClasses = {
  start: styles.stackAlignStart,
  center: styles.stackAlignCenter,
  stretch: styles.stackAlignStretch,
} as const;

export const Stack = ({
  as: Component = "div",
  gap = "md",
  align = "stretch",
  className,
  ...props
}: StackProps) => {
  const Element = Component as "div";

  return (
    <Element
      {...props}
      className={mergeClassNames(styles.stack, gapClasses[gap], alignClasses[align], className)}
    />
  );
};
