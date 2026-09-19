import type { ComponentPropsWithoutRef } from "react";

import styles from "./Primitives.module.css";
import { mergeClassNames } from "../utils/merge-class-names";

export type VisuallyHiddenProps = ComponentPropsWithoutRef<"span">;

export const VisuallyHidden = ({ className, ...props }: VisuallyHiddenProps) => (
  <span {...props} className={mergeClassNames(styles.visuallyHidden, className)} />
);
