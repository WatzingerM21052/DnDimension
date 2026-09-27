# Local persistence spike (P-02, partial)

`createIndexedDbAggregateStore(name)` provides the framework-free `AggregateStore` contract from core. Its three-store schema is experimental, not a replacement for DEC-009's eventual domain-specific object stores. Use a dedicated spike database name, never an existing user database.

## Guarantees exercised by tests

- Aggregate value, incremented revision, audit event and processed command are written in one read/write transaction.
- Creation expects revision zero. A stale revision returns a conflict without recording the command.
- An identical command returns its original revision without another event. Reusing its ID with changed content is rejected. IDs are database-wide.
- Input is finite JSON; object key order is normalized before comparing retries. Returned records do not expose internal references.
- Failures from the database reject the commit promise; callers must not display a successful save before it resolves.
- A constraint failure after the aggregate write rolls back that write and leaves the command retryable.

Normalization happens before the transaction. No network or unrelated asynchronous operation occurs inside it, following the [Dexie transaction guidance](<https://dexie.org/docs/Dexie/Dexie.transaction()>). The fingerprint is canonical request text, not a cryptographic checksum or backup integrity mechanism.

## Verification

Run `pnpm verify` from `code/`. The shared suite runs against the in-memory reference and Dexie with fake-indexeddb. Additional tests reopen the database, race separate connections, and inject a conflicting audit row into a disposable test database to prove rollback.

On 2026-09-08: 34 Vitest tests and 15 tooling tests passed; formatting, lint, boundaries, doctor, TypeScript and production build passed. Node 24.11.0 is compatible but differs from the CI reference 24.20.0; doctor reports that warning.

## Schema version conflicts

A cached, older app build must never write into a database that a newer build has migrated. Dexie 4 would silently re-create tables the newer schema removed, so the store opens explicitly and first compares the installed IndexedDB version with its own. A newer schema rejects every operation with `NewerSchemaError` (`isNewerSchemaError(error)`); the data stays untouched and the web app's update controller loads the newer build. `onVersionChange` fires when another tab upgrades the schema; the connection closes so that upgrade is not blocked.

## Still required before P-02 is accepted

- Actual target-browser close/reopen and multi-tab tests, including an understandable conflict UI.
- Startup recovery markers, pre-migration backup, failed/interrupted migration and restoration evidence.
- Explicit persistent-storage permission and quota estimates in real browsers.
- Real database-size fixtures and final object-store/index decisions.
- Portable backups and destructive restore confirmation before use for valuable campaign data. (Restore already writes only rows rebuilt from the verified history; unknown fields in a backup file are dropped.)

No production UI imports this package yet. The existing web build size therefore does not measure the adapter's eventual browser-bundle cost. No handbook text, PDF or real campaign data is included. Issue #20 remains open.
