import type { ComponentPropsWithoutRef, CSSProperties } from "react";

import styles from "./Primitives.module.css";
import { mergeClassNames } from "../utils/merge-class-names";

export type IconProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  source: string;
  label?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: styles.iconSm,
  md: styles.iconMd,
  lg: styles.iconLg,
} as const;

export const Icon = ({
  source,
  label,
  size = "md",
  className,
  style: callerStyle,
  ...props
}: IconProps) => {
  const style = {
    ...callerStyle,
    "--icon-source": `url("${source}")`,
  } as CSSProperties;

  return (
    <span
      {...props}
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
      className={mergeClassNames(styles.icon, sizeClasses[size], className)}
      role={label ? "img" : undefined}
      style={style}
    />
  );
};
