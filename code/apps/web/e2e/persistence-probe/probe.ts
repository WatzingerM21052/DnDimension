import {
  createIndexedDbAggregateStore,
  isNewerSchemaError,
  migrateWithBackup,
  openBackupVault,
} from "@dndimension/persistence";

/** Browser entry for persistence.spec.ts: exposes the real adapter to page.evaluate. */
const probe = {
  createIndexedDbAggregateStore,
  isNewerSchemaError,
  migrateWithBackup,
  openBackupVault,
};

declare global {
  interface Window {
    probe: typeof probe;
  }
}

window.probe = probe;
