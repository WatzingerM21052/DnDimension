import { useState } from "react";
import type { AggregateStore } from "@dndimension/core";
import {
  createIndexedDbAggregateStore,
  type IndexedDbAggregateStore,
} from "@dndimension/persistence";
import "./storage-lab.css";

type LabStore = AggregateStore &
  Partial<Pick<IndexedDbAggregateStore, "exportBackup" | "restoreBackup">>;

export const StorageLab = ({ store }: { store: LabStore }) => {
  const [name, setName] = useState("");
  const [revision, setRevision] = useState<number | null>(null);
  const [status, setStatus] = useState("Noch kein Spielstand geladen.");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [backup, setBackup] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (cause) {
      setError(
        `Aktion fehlgeschlagen. Der Entwurf bleibt erhalten. ${cause instanceof Error ? cause.message : "Speicher nicht verfügbar."}`,
      );
    } finally {
      setBusy(false);
    }
  };
  const load = async () => {
    const record = await store.read("lab-campaign");
    setRevision(record?.revision ?? 0);
    const value = record?.value;
    setName(
      value && typeof value === "object" && !Array.isArray(value) && typeof value.name === "string"
        ? value.name
        : "",
    );
    setStatus(`Geladen · Revision ${record?.revision ?? 0}`);
  };
  return (
    <main className="storage-lab">
      <p className="eyebrow">DnDimension · Entwicklerwerkstatt</p>
      <h1>Spielstände unter Prüfung</h1>
      <p>
        Technischer Testbereich, kein fertiger Kampagneneditor. Nur Testdaten verwenden.
        Browserdaten können gelöscht werden.
      </p>
      <fieldset disabled={busy}>
        <legend>Lokaler Spielstand</legend>
        <button onClick={() => void run(load)}>Spielstand laden</button>
        <p>Erneutes Laden ersetzt den ungespeicherten Entwurf durch den gespeicherten Stand.</p>
        <label htmlFor="campaign-name">Kampagnenname</label>
        <input
          id="campaign-name"
          value={name}
          maxLength={160}
          onChange={(event) => setName(event.target.value)}
        />
        <button
          disabled={revision === null || !name.trim()}
          onClick={() =>
            void run(async () => {
              if (revision === null) return;
              const result = await store.commit({
                commandId: crypto.randomUUID(),
                aggregateId: "lab-campaign",
                expectedRevision: revision,
                value: { name: name.trim() },
                event: { type: "LabCampaignSaved" },
              });
              if (result.status === "committed" || result.status === "replayed") {
                setRevision(result.revision);
                setStatus(`Gespeichert · Revision ${result.revision}`);
              } else if (result.status === "revision-conflict") {
                setError(
                  "Ein anderer Tab hat den Spielstand geändert. Dein Entwurf bleibt erhalten. Sichere ihn vor erneutem Laden.",
                );
              } else setError("Spielstand wurde nicht gespeichert. Bitte Eingaben prüfen.");
            })
          }
        >
          Spielstand speichern
        </button>
      </fieldset>
      {store.exportBackup && store.restoreBackup && (
        <fieldset disabled={busy}>
          <legend>Experimentelles Backup</legend>
          <p>
            Testformat, noch kein finales .dndim-Archiv. Wiederherstellung nur in eine leere
            Testdatenbank.
          </p>
          <button
            onClick={() =>
              void run(async () => {
                setBackup(await store.exportBackup!());
                setConfirmed(false);
                setStatus("Backup erstellt. Text extern sichern.");
              })
            }
          >
            Backup erstellen
          </button>
          <label htmlFor="backup-text">Backup-Text</label>
          <textarea
            id="backup-text"
            value={backup}
            onChange={(event) => {
              setBackup(event.target.value);
              setConfirmed(false);
            }}
            rows={5}
          />
          <label>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
            />{" "}
            Ich möchte dieses Testbackup in die leere Datenbank einspielen.
          </label>
          <button
            disabled={!confirmed || !backup}
            onClick={() =>
              void run(async () => {
                await store.restoreBackup!(backup);
                await load();
                setConfirmed(false);
                setStatus("Backup wiederhergestellt.");
              })
            }
          >
            Backup wiederherstellen
          </button>
        </fieldset>
      )}
      <fieldset disabled={busy}>
        <legend>Browser-Speicher</legend>
        <button
          onClick={() =>
            void run(async () => {
              if (!navigator.storage?.estimate)
                throw new Error("Speicheranzeige wird nicht unterstützt.");
              const estimate = await navigator.storage.estimate();
              setStatus(
                `Browser-Speicher: ${estimate.usage ?? "unbekannt"} Bytes belegt / ${estimate.quota ?? "unbekannt"} Bytes verfügbarer Gesamtrahmen.`,
              );
            })
          }
        >
          Speicherverbrauch prüfen
        </button>
        <button
          onClick={() =>
            void run(async () => {
              if (!navigator.storage?.persist)
                throw new Error("Persistenz-Anfrage wird nicht unterstützt.");
              const granted = await navigator.storage.persist();
              setStatus(
                granted
                  ? "Persistenter Speicher gewährt. Backups bleiben notwendig."
                  : "Persistenter Speicher nicht gewährt. Backups extern sichern.",
              );
            })
          }
        >
          Dauerhaften Speicher anfragen
        </button>
      </fieldset>
      <p role="status" aria-live="polite">
        {busy ? "Wird verarbeitet …" : status}
      </p>
      {error && <p role="alert">{error}</p>}
    </main>
  );
};

export default function BrowserStorageLab() {
  const [store] = useState(() => createIndexedDbAggregateStore("dndimension-storage-lab-v1"));
  return <StorageLab store={store} />;
}
