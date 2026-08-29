import { type FormEvent, useRef, useState } from "react";

import { ActionButton } from "../components/ActionButton";
import { ModalDialog } from "../components/ModalDialog";
import { TextField } from "../components/TextField";
import { Stack } from "../primitives/Stack";
import { Surface } from "../primitives/Surface";
import { Text } from "../primitives/Text";
import { WayfinderIcon } from "../primitives/WayfinderIcon";
import { ConstellationLedger } from "./ConstellationLedger";
import styles from "./WaypointDraftPattern.module.css";

const ledgerNodes = [
  { id: "unmapped", label: "Unkartiert" },
  { id: "drafted", label: "Entwurf" },
] as const;

export const WaypointDraftPattern = () => {
  const [savedName, setSavedName] = useState<string>();
  const [activeId, setActiveId] = useState("unmapped");

  return (
    <section aria-labelledby="waypoint-draft-title" className={styles.pattern}>
      <div className={styles.chapterEdge}>
        <Text as="h2" id="waypoint-draft-title" variant="title">
          Wegmarkenentwurf
        </Text>
      </div>
      <div className={styles.content}>
        <Surface as="section" className={styles.reading} variant="reading">
          <Stack gap="sm">
            <div className={styles.readingHeading}>
              <WayfinderIcon aria-hidden="true" />
              <Text as="h3" tone="on-reading" variant="label">
                Reisechronik
              </Text>
            </div>
            <Text tone="on-reading">
              Halte einen Ort fest, bevor die Spur im Kartennebel verblasst. Der Entwurf bleibt
              lokal, bis er später einer Reise zugeordnet wird.
            </Text>
            <ModalDialog title="Wegmarke anlegen" triggerLabel="Wegmarke anlegen">
              {({ close }) => (
                <WaypointDraftForm
                  close={close}
                  onSaved={(name) => {
                    setSavedName(name);
                    setActiveId("drafted");
                  }}
                />
              )}
            </ModalDialog>
          </Stack>
        </Surface>
        <aside aria-label="Wegmarkenstatus" className={styles.ledgerPanel}>
          <Text as="h3" variant="label">
            Kartenstand
          </Text>
          <ConstellationLedger
            activeId={activeId}
            label="Wegmarkenstatus"
            nodes={ledgerNodes}
            onActiveChange={setActiveId}
          />
        </aside>
      </div>
      {savedName ? <p role="status">Wegmarke „{savedName}“ wurde vorgemerkt.</p> : null}
    </section>
  );
};

interface WaypointDraftFormProps {
  close: () => void;
  onSaved: (name: string) => void;
}

const WaypointDraftForm = ({ close, onSaved }: WaypointDraftFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const draftNameRef = useRef("");
  const [draftName, setDraftName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const textFieldError = errorMessage === undefined ? {} : { errorMessage };

  const saveDraft = () => {
    draftNameRef.current = inputRef.current?.value ?? draftNameRef.current;
    const normalizedName = draftNameRef.current.trim();

    if (normalizedName.length === 0) {
      setErrorMessage("Gib einen Namen für die Wegmarke ein.");
      inputRef.current?.focus();
      return;
    }

    setErrorMessage(undefined);
    onSaved(normalizedName);
    close();
  };

  const submitDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveDraft();
  };

  return (
    <form className={styles.form} onSubmit={submitDraft}>
      <TextField
        {...textFieldError}
        inputRef={inputRef}
        isInvalid={errorMessage !== undefined}
        label="Name der Wegmarke"
        onChange={(value) => {
          draftNameRef.current = value;
          setDraftName(value);
        }}
        value={draftName}
      />
      <div className={styles.actions}>
        <ActionButton onPress={close} type="button" variant="secondary">
          Abbrechen
        </ActionButton>
        <ActionButton onPress={saveDraft} type="submit">
          Wegmarke speichern
        </ActionButton>
      </div>
    </form>
  );
};
