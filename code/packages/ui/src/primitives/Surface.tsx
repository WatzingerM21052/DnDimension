import type { ComponentPropsWithoutRef } from "react";

import styles from "./Primitives.module.css";
import { mergeClassNames } from "../utils/merge-class-names";

export type SurfaceProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "main" | "section" | "article" | "aside";
  variant?: "canvas" | "workspace" | "reading" | "overlay";
};

const variantClasses = {
  canvas: styles.surfaceCanvas,
  workspace: styles.surfaceWorkspace,
  reading: styles.surfaceReading,
  overlay: styles.surfaceOverlay,
} as const;

export const Surface = ({
  as: Component = "div",
  variant = "canvas",
  className,
  ...props
}: SurfaceProps) => (
  <Component
    {...props}
    className={mergeClassNames(styles.surface, variantClasses[variant], className)}
  />
);
