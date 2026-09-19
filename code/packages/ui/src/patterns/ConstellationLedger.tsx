import { LayoutGroup, motion, useReducedMotion } from "motion/react";

import { ActionButton } from "../components/ActionButton";
import { WayfinderIcon } from "../primitives/WayfinderIcon";
import { mergeClassNames } from "../utils/merge-class-names";
import styles from "./ConstellationLedger.module.css";

export interface LedgerNode {
  id: string;
  label: string;
}

export interface ConstellationLedgerProps {
  label: string;
  nodes: readonly LedgerNode[];
  activeId: string;
  onActiveChange: (id: string) => void;
}

export const ConstellationLedger = ({
  label,
  nodes,
  activeId,
  onActiveChange,
}: ConstellationLedgerProps) => {
  const reducedMotion = useReducedMotion();

  return (
    <LayoutGroup id="constellation-ledger">
      <div aria-label={label} className={styles.ledger} role="group">
        <div className={styles.nodes}>
          {nodes.map((node) => {
            const isActive = node.id === activeId;

            return (
              <ActionButton
                aria-pressed={isActive}
                className={mergeClassNames(styles.node, isActive && styles.active)}
                key={node.id}
                onPress={() => onActiveChange(node.id)}
                type="button"
                variant="quiet"
              >
                <span className={styles.label}>{node.label}</span>
                {isActive &&
                  (reducedMotion ? (
                    <span className={styles.marker} data-motion="reduced">
                      <WayfinderIcon />
                    </span>
                  ) : (
                    <motion.span
                      className={styles.marker}
                      data-motion="animated"
                      layoutId="constellation-ledger-active"
                      transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
                    >
                      <WayfinderIcon />
                    </motion.span>
                  ))}
              </ActionButton>
            );
          })}
        </div>
      </div>
    </LayoutGroup>
  );
};
