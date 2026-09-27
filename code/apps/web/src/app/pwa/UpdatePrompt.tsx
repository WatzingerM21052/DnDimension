import { ActionButton, Stack, Surface, Text } from "@dndimension/ui";
import { useSyncExternalStore } from "react";
import type { UpdateController } from "./update-controller";
import styles from "./UpdatePrompt.module.css";

export const UpdatePrompt = ({ controller }: { controller: UpdateController }) => {
  const state = useSyncExternalStore(controller.subscribe, controller.getState);
  const showUpdate = state.updateAvailable && !state.postponed;

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {showUpdate ? (
        <Surface as="aside" variant="overlay" className={styles.card} aria-label="App-Update">
          <Stack gap="sm">
            <Text variant="title">Neue Version verfügbar</Text>
            {state.blockedByUnsavedWork ? (
              <Text>
                Du hast ungespeicherte Änderungen. Speichere sie zuerst – das Update wartet so
                lange.
              </Text>
            ) : (
              <Text>Die App lädt einmal neu. Gespeicherte Daten bleiben erhalten.</Text>
            )}
            {state.failed ? (
              <Text role="alert">Das Update konnte nicht aktiviert werden. Versuch es erneut.</Text>
            ) : null}
            <div className={styles.actions}>
              <ActionButton
                isDisabled={state.blockedByUnsavedWork || state.applying}
                onPress={() => void controller.applyUpdate()}
              >
                {state.applying ? "Wird aktualisiert …" : "Jetzt aktualisieren"}
              </ActionButton>
              <ActionButton variant="quiet" onPress={controller.postpone}>
                Später
              </ActionButton>
            </div>
          </Stack>
        </Surface>
      ) : state.offlineReady ? (
        <Surface as="aside" variant="overlay" className={styles.card} aria-label="Offline-Modus">
          <Stack gap="sm">
            <Text>DnDimension ist jetzt auch offline verfügbar.</Text>
            <div className={styles.actions}>
              <ActionButton variant="quiet" onPress={controller.dismissOfflineReady}>
                Verstanden
              </ActionButton>
            </div>
          </Stack>
        </Surface>
      ) : null}
    </div>
  );
};
