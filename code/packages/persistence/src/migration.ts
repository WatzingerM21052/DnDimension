import { Dexie, type Table } from "dexie";

export interface PreMigrationBackup {
  id?: number;
  createdAt: string;
  fromVersion: number;
  toVersion: number;
  /** Text in the verified backup format of `exportBackup`; restore with `restoreBackup`. */
  backup: string;
}

export interface BackupVault {
  save(entry: Omit<PreMigrationBackup, "id">): Promise<number>;
  latest(): Promise<PreMigrationBackup | undefined>;
  close(): void;
}

/**
 * Keeps pre-migration backups in a separate database, so a failed or interrupted upgrade of
 * the main database can never take its own safety copy with it.
 */
export const openBackupVault = (databaseName: string): BackupVault => {
  const db = new Dexie(`${databaseName}__backups`);
  db.version(1).stores({ backups: "++id, createdAt" });
  const backups: Table<PreMigrationBackup, number> = db.table("backups");
  return {
    save: (entry) => backups.add({ ...entry }),
    latest: () => backups.orderBy("id").last(),
    close: () => db.close(),
  };
};

export type MigrationOutcome =
  | Readonly<{ status: "migrated"; backupId: number }>
  | Readonly<{ status: "failed"; backupId: number; error: unknown }>;

/**
 * Pre-migration contract (v0.2 spec §13): export first, store the backup, then run the
 * upgrade. IndexedDB runs a schema upgrade in one versionchange transaction, so a thrown
 * error or a closed tab leaves the previous version intact; the backup covers everything
 * beyond that guarantee (bugs in a successful upgrade, later corruption).
 */
export const migrateWithBackup = async ({
  vault,
  exportBackup,
  upgrade,
  fromVersion,
  toVersion,
  now = () => new Date().toISOString(),
}: {
  vault: BackupVault;
  exportBackup: () => Promise<string>;
  upgrade: () => Promise<void>;
  fromVersion: number;
  toVersion: number;
  now?: () => string;
}): Promise<MigrationOutcome> => {
  const backup = await exportBackup();
  const backupId = await vault.save({ createdAt: now(), fromVersion, toVersion, backup });
  try {
    await upgrade();
    return { status: "migrated", backupId };
  } catch (error) {
    return { status: "failed", backupId, error };
  }
};
