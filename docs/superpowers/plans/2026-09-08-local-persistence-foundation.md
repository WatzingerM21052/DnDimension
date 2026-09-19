# Local persistence foundation

Goal: implement and verify the adapter-independent write contract before attaching browser storage.

Architecture: framework-free application contract in core; an in-memory reference adapter exercises optimistic revisions, command identity and atomic audit writes. A subsequent IndexedDB adapter must pass the same observable contract. This is a partial delivery for #20, not completion of P-02.

Tech stack: existing TypeScript and Vitest; Dexie 4.4.5 as isolated runtime adapter and fake-indexeddb 6.2.5 as test-only dependency. Exact versions and lockfile are committed.

Specification: DEC-006, DEC-008, DEC-009 and the existing technical blueprint remain authoritative.

## Constraints

- Preserve the prototype and the separate UI-quality worktree.
- Do not copy private handbooks or claim rules completeness.
- No browser durability, migration recovery or backup guarantees from an in-memory adapter.
- A command ID is bound to its entire normalized JSON request; changed retries are rejected.
- Read results must not expose mutable internal references.

## Tasks

1. Add shared contract tests in `code/packages/persistence/src/store.test.ts`: atomic state/audit, duplicate retry, changed command, stale revision, racing writes, invalid JSON and reference isolation. Run `pnpm test:unit` and observe missing behavior before implementing it.
2. Implement `code/packages/core/src/aggregate-store.ts` and export through `src/index.ts`. Expected revisions start at zero for creation; successful writes increment by one. Errors leave all records unchanged.
3. Implement `code/packages/persistence/src/index.ts` behind the same contract; verify both adapters and add database close/reopen, independent-connection race and late-write rollback tests.
4. Run `pnpm verify`; document measured results and remaining P-02 gates. Commit and push the isolated branch without closing #20.

## Next production increments

1. Completed in this increment: IndexedDB adapter with identical contract suite, rollback fault injection and close/reopen tests under fake-indexeddb.
2. Next: real-browser multi-tab conflicts, storage estimate/persistence permission and interrupted migration recovery. The automated environment is not browser acceptance evidence.
3. Versioned backup inspection/restore and PWA offline lifecycle.
4. Integrate the existing UI-quality foundation, then licensed content/domain and rules contracts.
5. Deliver character creation → campaign preparation → playable human-DM session as connected vertical slices, following the existing release roadmap.

The approved medieval/clockwork design remains the presentation direction; foundation work does not replace it with a new visual concept.
