# BUGFIX 001 — Selection Firehose

Status: Open
Priority: P0
Discovered during: Decision 014

---

## Summary

React Flow continuously emits empty `selectionChange` events (~370/sec)
even when no user interaction occurs.

This reproduces on the untouched Sprint 06 baseline.

Therefore this defect predates Decision 014.

---

## Symptoms

- Existing nodes cannot remain selected.
- Click selection immediately clears.
- Property panel cannot reliably open.
- Any feature depending on selection is blocked.

---

## Reproduction

1. Load the application with the canvas visible and at least one node present.
2. Attach a temporary console listener to the `selectionChange` event (e.g. inside
   `CanvasEngineProvider`'s existing subscription) or otherwise count emissions.
3. With zero user interaction — no mouse movement, no clicks, no keyboard input —
   observe the event count over a fixed window (e.g. 2 seconds).
4. Click directly on a rendered node.
5. Observe whether the node's `selected` state persists shortly after the click.

## Confirmed Observations

- Idle event volume measured at roughly 350–400 `selectionChange` events per second
  with no interaction taking place.
- Every observed idle-state event carried an empty selection payload
  (`{ nodes: [], edges: [] }`) — never a stale or incorrect non-empty selection.
- The high emission rate is sustained, not just an initial-mount burst that tapers
  off after a few seconds.
- No React "Maximum update depth exceeded" warning accompanies this defect on its
  own — it is a steady high-frequency event stream, not an unbounded recursive
  re-render loop.

## Reproduced On

- Sprint 06 baseline
- Decision 014 branch

---

## NOT caused by

Decision 014.

Decision 014 only migrated ownership.

---

## Suspected files

CanvasViewport.tsx

ReactFlowAdapter.ts

SelectionManager.ts

CanvasEngineProvider.tsx

---

## Investigation Questions

- Why is onSelectionChange firing continuously?
- Is React Flow registering duplicate listeners?
- Is callback recreated every render?
- Is StrictMode causing duplicate subscriptions?
- Is CanvasViewport recreating handlers?
- Is controlled node state triggering React Flow reconciliation?

---

## Acceptance Criteria

- selectionChange fires only on genuine user interaction.
- Existing node selection persists.
- Property panel can depend on selection.
