import type { ReactNode } from "react";
import { Dialog, DialogTrigger, Heading } from "react-aria-components/Dialog";
import { Modal, ModalOverlay } from "react-aria-components/Modal";

import styles from "./ModalDialog.module.css";
import { ActionButton } from "./ActionButton";

export interface ModalDialogProps {
  triggerLabel: string;
  title: string;
  children: (controls: { close: () => void }) => ReactNode;
}

export const ModalDialog = ({ triggerLabel, title, children }: ModalDialogProps) => (
  <DialogTrigger>
    <ActionButton>{triggerLabel}</ActionButton>
    <ModalOverlay className={styles.overlay ?? ""} isDismissable>
      <Modal className={styles.modal ?? ""}>
        <Dialog className={styles.dialog ?? ""}>
          {({ close }) => (
            <>
              <Heading slot="title" className={styles.title ?? ""}>
                {title}
              </Heading>
              <div className={styles.content}>{children({ close })}</div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  </DialogTrigger>
);
