import { describe, expect, it } from "vitest";
import {
  isVisibleTo,
  parseVisibilityPolicy,
  projectFields,
  projectItems,
  reveal,
  type VisibilityPolicy,
} from "./visibility";

const dmOnly: VisibilityPolicy = { kind: "dm_only" };
const playerFacing: VisibilityPolicy = { kind: "player_facing" };
const revealed: VisibilityPolicy = {
  kind: "revealed",
  revealedByEventId: "event-7",
  revealedAt: "2026-09-27T20:00:00.000Z",
};

describe("parseVisibilityPolicy", () => {
  it("accepts the three known policies", () => {
    for (const policy of [dmOnly, playerFacing, revealed])
      expect(parseVisibilityPolicy(policy)).toEqual({ ok: true, value: policy });
  });

  it("rejects unknown kinds and reveals without an event reference", () => {
    for (const raw of [
      null,
      "player_facing",
      { kind: "party_only" },
      { kind: "revealed", revealedAt: "2026-09-27T20:00:00.000Z" },
      { kind: "revealed", revealedByEventId: "e", revealedAt: "yesterday" },
    ])
      expect(parseVisibilityPolicy(raw).ok).toBe(false);
  });
});

describe("isVisibleTo", () => {
  it("shows players only player-facing and revealed knowledge", () => {
    expect(isVisibleTo(playerFacing, "player")).toBe(true);
    expect(isVisibleTo(revealed, "player")).toBe(true);
    expect(isVisibleTo(dmOnly, "player")).toBe(false);
  });

  it("denies players anything without a valid policy", () => {
    for (const policy of [undefined, null, {}, { kind: "future_policy" }, "player_facing"])
      expect(isVisibleTo(policy, "player")).toBe(false);
  });

  it("shows the DM everything", () => {
    for (const policy of [dmOnly, playerFacing, revealed, undefined])
      expect(isVisibleTo(policy, "dm")).toBe(true);
  });
});

describe("reveal", () => {
  it("turns DM-only knowledge into a traceable reveal", () => {
    expect(reveal(dmOnly, { eventId: "event-9", at: "2026-09-27T21:00:00.000Z" })).toEqual({
      kind: "revealed",
      revealedByEventId: "event-9",
      revealedAt: "2026-09-27T21:00:00.000Z",
    });
  });

  it("keeps the original reveal and player-facing policies unchanged", () => {
    const again = { eventId: "event-10", at: "2026-09-28T00:00:00.000Z" };
    expect(reveal(revealed, again)).toBe(revealed);
    expect(reveal(playerFacing, again)).toBe(playerFacing);
  });
});

describe("projections", () => {
  const clues = [
    { id: "a", visibility: playerFacing },
    { id: "b", visibility: dmOnly },
    { id: "c", visibility: revealed },
    { id: "d" },
  ];

  it("filters items for players and keeps all for the DM", () => {
    expect(projectItems(clues, "player").map((clue) => clue.id)).toEqual(["a", "c"]);
    expect(projectItems(clues, "dm")).toHaveLength(4);
  });

  it("removes DM-only and unclassified fields for players", () => {
    const npc = { name: "Mara", role: "Harbor master", secret: "Smuggler", mood: "tense" };
    const policies = { name: playerFacing, role: revealed, secret: dmOnly };
    expect(projectFields(npc, policies, "player")).toEqual({
      name: "Mara",
      role: "Harbor master",
    });
    expect(projectFields(npc, policies, "dm")).toEqual(npc);
  });
});
