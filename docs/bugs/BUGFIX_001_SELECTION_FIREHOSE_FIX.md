# BUGFIX_001 — Selection Firehose: Fix Proposal

> **Status:** Proposal only. Not implemented.
> **Depends on:** `BUGFIX_001_SELECTION_FIREHOSE_INVESTIGATION.md` (Phases 1–4)
> **Blocks:** Sprint 07

This document proposes a fix based on the findings already established in Phases 1–4. It contains no implementation code and does not modify the runtime. It is a plan for a future implementation pass, to be reviewed and approved before any file is touched.

---

# 1. Root Cause

Phase 4 isolated the exact trigger: `CanvasViewport.tsx`'s `onNodesChange` handler calls `journeyStore.setNodes(updatedNodes)` **unconditionally on every invocation**, regardless of what kind of change React Flow reported. React Flow reports `dimensions`-type changes continuously and independently of user interaction — this is its own internal measurement of rendered node bounding boxes (consistent with a `ResizeObserver`-backed mechanism), and it is not a signal that anything about the *journey* changed.

**Why a dimension-only update should never mutate `journeyStore.nodes`:**

- A `dimensions` change means "React Flow measured how large this node's DOM element rendered as." It carries no information about the node's business data — not its `config`, not its `position` (that's a separate `position`-type change), not its `ports`, not anything a Journey author configured. It is purely a fact about *how the renderer laid something out*, not a fact about *what the journey is*.
- Writing `journeyStore.nodes` to a new array on every `dimensions` report creates a new object reference for every node in the journey, on every measurement — even though nothing about any node's actual data changed. This is a correctness violation of `journeyStore`'s own purpose (holding business/document state) as much as it is a performance problem.
- That new array reference recomputes `CanvasViewport`'s `rfNodes` (`useMemo` keyed on `[nodes, selectedNodeId]`), which is passed back into `<ReactFlow nodes={rfNodes} />` as a new controlled prop. React Flow then reconciles against this "new" (but semantically identical) `nodes` array and, per Phase 4's isolation, re-derives and re-emits selection state as part of that reconciliation — even though no selection-relevant fact changed.
- This closes a self-sustaining loop entirely disconnected from user intent: **measurement → irrelevant store write → new controlled prop → re-reconciliation → re-emission → (React Flow continues measuring) → measurement again.** The loop requires no click, no drag, no keyboard input — it runs at whatever rate React Flow's own dimension observation fires (measured at ~125 events/second in Phases 1–4).
- Because this loop also fires `onSelectionChange` continuously with an empty selection, any real selection a user actually sets (via a click) is overwritten by the next spurious empty-selection emission within single-digit milliseconds — this is the mechanism behind the originally reported "selection doesn't work" symptom.

The dimension measurement itself is not a bug — React Flow needs it to lay out ports, handles, and edges correctly, and it is expected to recur (e.g. on font load, on container resize, on zoom). The bug is that this codebase's `onNodesChange` treats *every* reported change as if it were a business mutation worth persisting to `journeyStore`, when a `dimensions` report is not one.

---

# 2. Architectural Principle

This fix is grounded in a boundary that already exists in spirit across this codebase's prior decisions (Decision 006: Canvas Runtime is the permanent interaction layer; Decision 007: React Flow is an implementation detail; Decision 014: selection is interaction state, not document state) but has not yet been stated explicitly for **node change ownership** as a general category. The dimension-measurement defect is one instance of this boundary being violated — the principle itself is broader than dimensions, and must be stated as such so it does not need re-discovery the next time a different kind of renderer-owned change causes a similar symptom.

## Ownership Boundaries

**Business state — owned by `journeyStore`:**

- Node creation and deletion
- Position (where a user has authored a node to sit on the canvas)
- Configuration (`INode.config` — everything a Journey author sets)
- Ports (`INode.ports` — structural, factory-assigned)
- Metadata (node type, schema version, capabilities — registry-derived facts about what a node *is*)
- Any other information that is persisted as part of the Journey document — i.e., anything that would need to round-trip through `NodeSerializer`, be sent to a backend, or be visible to a Journey author as "this is what I configured"

**Renderer state — owned by React Flow:**

- Measured dimensions (how large a node's DOM element rendered as)
- Dragging state (in-progress drag position, before it settles into an authored `position`)
- Resizing state (in-progress resize interactions, if/when node resizing is introduced)
- Hover / focus (already established as CSS-only / DOM-native state per Sprint 06, never written to any store)
- Viewport (zoom, pan — already owned by `canvasStore` via a separate path, not `journeyStore`)
- Any other transient, renderer-internal fact that exists only to make the canvas draw correctly right now, and that a Journey author never configured and would not expect to see reflected in "unsaved changes"

**The general rule:** a `NodeChange` (or any other signal React Flow reports) is business-relevant only if it represents something a Journey author actually did or configured. If it represents something the renderer measured, observed, or is transiently tracking about its own presentation, it belongs to React Flow and must never be written to `journeyStore` — regardless of which specific change type carries it. `journeyStore` and React Flow must never hold two competing representations of the same fact, and renderer-owned facts must never be promoted into `journeyStore` just because they happen to arrive through the same `onNodesChange` callback as business-relevant ones.

This is the same shape of boundary Decision 014 already established for selection (interaction state, owned by `selectionStore`, never by `journeyStore`) — this principle extends that reasoning to node geometry/measurement, and is written generally enough to cover dragging state, resizing state, and any future renderer-reported change type without needing a new decision each time.

---

# 3. Proposed Fix

**Minimal architectural fix:** `CanvasViewport` only persists business-owned node changes into `journeyStore`. Renderer-owned changes remain inside React Flow and are never written to `journeyStore`, regardless of which specific change type carries them.

This is the rule — not "ignore dimension changes." Dimensions happen to be the only renderer-owned change type this codebase currently observes flowing through `onNodesChange` (per Phase 4's tracing), so implementing the rule today means excluding `dimensions`-type entries. But the fix must be designed and reviewed against the ownership boundary in Section 2, not against the one symptom that surfaced it — otherwise the same defect reappears the moment React Flow reports a different renderer-owned change (dragging-in-progress state, resize-in-progress state, or any future transient change type) through the same callback.

### `onNodesChange` classifies changes by ownership before persisting

`onNodesChange` in `CanvasViewport.tsx` must classify each incoming `NodeChange` against the ownership boundary in Section 2 before deciding whether to write to `journeyStore`: changes that represent something a Journey author did (a `position` change from a drag; a `remove`, if/when that becomes reachable) are business-owned and persist as they do today. Changes that represent something the renderer measured or is transiently tracking about its own presentation are renderer-owned and must never reach `journeyStore` — currently, per Phase 4, this means `dimensions`-type entries. A batch mixing a business-owned change with a renderer-owned one (e.g. a drag that also triggers a re-measurement in the same callback invocation) must still persist the business-owned part correctly; only the renderer-owned entries are excluded, not the whole batch.

`select`-type changes are excluded from this handler for a separate, already-established reason: Decision 014 requires that selection never be written to `journeyStore` at all, regardless of ownership classification — selection belongs to `selectionStore` exclusively, via the existing `onSelectionChange` path. This handler's classification logic should not need to reason about selection ownership itself; `select`-type entries are simply out of scope for `onNodesChange` to act on, full stop.

### `journeyStore` should only be updated for genuine business mutations

Node creation and deletion already do not go through this handler — creation flows through `NodeCreationService`/`NodeFactory` (Sprint 04/05), and deletion is not yet implemented anywhere in the runtime. This fix does not need to introduce deletion handling; it only needs to ensure the classification logic is written in terms of the ownership boundary (Section 2), so that if/when `remove`-type `NodeChange`s begin arriving from React Flow, they are correctly recognized as business-owned rather than needing separate re-discovery.

### React Flow remains the owner of renderer state

The fix does not attempt to suppress, cache, or intercept React Flow's own measurement, dragging-state, or resize-state tracking — that would mean re-implementing something React Flow already owns correctly, which Decision 007 and `FRONTEND_STANDARDS.md` §17 ("React Flow owns... never recreate these behaviours manually") both prohibit. React Flow continues to track all renderer-owned state exactly as it does today; the fix only changes what this codebase's integration layer chooses to *persist* in response to being told about it. `journeyStore` is not given any new field for renderer-owned facts, and no new store is introduced to hold them — they simply stay inside React Flow's own internal state, which is where they already correctly live. This applies uniformly to dimensions today and to any other renderer-owned change type the classification logic excludes in the future — the fix is not "a dimensions carve-out," it is the ownership boundary applied to whatever React Flow currently reports.

### Selection pipeline should become stable once business-owned nodes stop changing every render

Phase 4 demonstrated that once renderer-owned (`dimensions`-triggered) `setNodes` calls stop, the `rfNodes` reference passed into `<ReactFlow nodes={rfNodes}>` stops changing on every measurement cycle, and idle `selectionChange` emission drops from ~125/s to ~1.2/s. This fix, on its own, is expected to make the controlled `nodes` prop stable during idle periods, which should let Decision 014's selection pipeline (SelectionManager → CanvasEvents → CanvasEngineProvider → SelectionStore → Canvas Context → CanvasViewport → React Flow `selected` props) operate as designed — receiving one real emission per real gesture, not dozens of spurious ones per second. This fix does **not** by itself address the separately-diagnosed listener-leak defect (Phase 2/3: `SelectionManager.setAdapter()` never disposes its previous subscription, so `adapter.selectionListeners` grows to 3 and every real event is still relayed three times). Phase 3 explicitly found the listener leak alone insufficient to explain the firehose, and this proposal does not claim the inverse either — fixing the firehose does not retroactively fix the listener leak. Both defects should be corrected; this document scopes only the firehose fix, and the listener-leak fix (already fully specified by Phase 2/3's findings — capture and call the unsubscribe function `adapter.onSelectionChange()` returns before registering a new one) should be tracked and implemented alongside or immediately after this one so that click-selection persistence can be verified end-to-end rather than partially.

---

# 4. Risks

| Risk | Detail | Mitigation |
|---|---|---|
| **Filtering by `NodeChange.type` is a stringly-typed contract with `@xyflow/react`.** | The fix depends on `@xyflow/react`'s `NodeChange` union having a stable `type` discriminant (`dimensions`, `position`, `select`, `remove`, etc.). If a future version of the library renames or restructures this, the filter silently stops working correctly. | Reference `@xyflow/react`'s exported `NodeChange` type explicitly in the implementation (already imported in `CanvasViewport.tsx`) rather than a hand-rolled string list, so a TypeScript type error surfaces if the union shape changes. Pin/verify against the installed version (`^12.0.4`) during implementation. |
| **A batch could legitimately mix a `dimensions` change with a real change on the same node.** | If React Flow ever reports, in one `onNodesChange` call, both a `dimensions` entry and a `position` entry for the same node (e.g. during a drag that also triggers a re-measurement), a naive "skip the whole batch if any entry is dimensions" implementation would incorrectly drop the real change. | The proposed filter operates per-change-type across the whole batch (exclude `dimensions` entries, keep the rest), not per-batch skip-or-not — this was already noted as the generalization needed beyond Phase 4's Experiment 8, which only tested the coarser "skip if 100% dimensions" version. Verification must include a scenario with a real drag to confirm position updates still persist correctly once the filter is in place. |
| **Implementing this as a dimensions-specific carve-out rather than an ownership classification would leave a similar future defect latent.** | If React Flow introduces or already emits another renderer-owned `NodeChange` type not yet observed in this codebase's usage (e.g. dragging-in-progress or resize-in-progress state, per Section 2), a fix that only excludes `dimensions` by name would not generalize and the same class of defect would resurface under a different change type. | Implement the classification as an explicit allow-list of business-owned types (`position`, and `remove` if/when wired) derived from Section 2's ownership boundary, rather than a deny-list of `dimensions` only — an allow-list fails safe (an unrecognized, potentially renderer-owned change type is excluded by default rather than silently persisted), matching the general principle rather than re-patching per symptom. |
| **This fix does not address the listener leak; verifying it in isolation may show incomplete click-selection recovery**, as already observed in Phase 4's own test run. | Someone implementing only this fix might reasonably expect click-selection to fully work afterward and be confused when it does not, without the listener-leak fix applied alongside it. | State explicitly in acceptance criteria (§5) that full click-selection persistence requires both fixes; scope this document's acceptance criteria to what this fix alone is responsible for, and cross-reference the listener-leak fix as a co-requisite, not an optional follow-up. |
| **Regression risk to legitimate `dimensions`-driven behavior**, if any exists. | Nothing in the current codebase appears to depend on `dimensions` changes being persisted to `journeyStore` (confirmed by reading `CanvasViewport.tsx`, `journeyStore.ts`, and `INode`'s shape — no field derives from or requires per-render dimension data), but this should be explicitly verified during implementation, not assumed from this document's review alone. | Verification checklist (§7) includes confirming no visual or functional regression in node rendering, resizing, or port placement after the filter is applied. |

---

# 5. Acceptance Criteria

This fix is complete when:

- `onNodesChange` classifies incoming `NodeChange`s against the business/renderer ownership boundary (Section 2) before deciding whether to write to `journeyStore`, rather than persisting every reported change unconditionally.
- `journeyStore.setNodes()` is no longer called in response to a batch of changes that are exclusively renderer-owned (currently: `dimensions`-type, per Phase 4's tracing).
- A batch containing a genuine business-owned change (e.g. a `position` change from a user drag) still correctly persists that change to `journeyStore`, including when a renderer-owned entry is present in the same batch.
- Idle-canvas `selectionChange` emission rate returns to near-zero (consistent with Phase 4's measured ~1.2/s, not the ~125/s firehose baseline), verified via the same measurement approach used in Phases 1–4.
- No new field, store, or synchronization mechanism is introduced to hold renderer-owned state (dimensions or otherwise) — React Flow remains the sole owner of that state, unchanged.
- `journeyStore`'s shape (`JourneyState`, `INode`) is unmodified by this fix.
- This fix is explicitly documented (in its own implementation, and cross-referenced here) as necessary but not sufficient for full click-selection persistence — the listener-leak fix (Phase 2/3) must also be applied before that end-to-end behavior can be verified.
- `npm run build` and `npx oxlint` both pass.
- No architecture is changed: `SelectionManager` remains Zustand-free, `CanvasEngineProvider` remains the sole `selectionStore`-writing translation point, and `CanvasViewport` continues to read selection through the runtime/context layer — none of Decision 014's invariants are touched by this fix.

---

# 6. Files Expected to Change

| File | Expected change |
|---|---|
| `src/features/canvas/components/CanvasViewport.tsx` | `onNodesChange`'s implementation gains a classification step: partition or filter the incoming `NodeChange[]` by business/renderer ownership (Section 2) before calling `applyNodeChanges`/`setNodes`, excluding renderer-owned entries (currently `dimensions`-type) and skipping the `setNodes` call entirely when no business-owned change remains. This is the only file expected to require a behavioral change. |
| `docs/architecture/NODE_MODEL.md` | Should gain a note (in the `position` field's "Owner"/"Notes" row, or a new subsection) stating the general ownership boundary — `journeyStore` holds business-owned node state, React Flow holds renderer-owned state (dimensions, dragging/resize-in-progress, hover/focus) — so this principle is documented at the model level, not only in this bugfix doc. |
| `docs/architecture/DECISION_LOG.md` | A new decision recording this principle permanently (e.g. "journeyStore holds business-owned node state only; renderer-owned state remains inside React Flow") would be consistent with how Decision 014 was recorded for the selection-ownership principle — proposed for consideration during implementation, not mandated by this document. |

No changes are expected to `src/app/store/journeyStore.ts`, `src/features/nodes/contracts/INode.ts`, `src/features/canvas/runtime/**`, `src/features/canvas/runtime/adapters/ReactFlowAdapter.ts`, or `src/features/canvas/components/CanvasEngineProvider.tsx` — this fix is confined entirely to the filtering logic inside `CanvasViewport.tsx`'s `onNodesChange` handler, exactly as Phase 4 isolated it.

---

# 7. Verification Checklist

**Automated**
- [ ] `npm run build` passes with zero errors.
- [ ] `npx oxlint` passes with zero warnings/errors.

**Manual — Firehose resolution**
- [ ] Load the app; measure idle `selectionChange` emission over a fixed window (2–2.5s) with zero interaction. Confirm it is near-zero (not the ~125/s baseline), matching Phase 4's Experiment 8 result.
- [ ] Confirm `onNodesChange`'s invocation count during the same idle window is unchanged (React Flow still reports `dimensions` changes at its own rate — this fix does not and should not suppress the report, only what happens after it's received).

**Manual — No regression to real changes**
- [ ] Drag an existing node to a new position; confirm the new position persists to `journeyStore` (survives a re-render / is reflected if the journey were serialized).
- [ ] Create a new node via the palette (click-to-create and drag-and-drop); confirm it still appears with correct position and is added to `journeyStore.nodes`.
- [ ] Resize the browser window or change zoom level (both trigger dimension re-measurement); confirm nodes continue to render correctly with no visual regression, and confirm this does not cause a spike in `journeyStore` writes.

**Manual — Selection behavior**
- [ ] With this fix alone (listener leak still present): click an existing node and observe whether selection is more stable than before, but do not expect full persistence — cross-check against Phase 4's own finding that click-selection did not fully persist with only this fix applied.
- [ ] With this fix plus the listener-leak fix applied together (co-requisite per §5): click an existing node and confirm the selected state persists until a different selection-changing action occurs. This combined verification should be run once both fixes exist, even if implemented in separate changes.

**Architectural**
- [ ] Confirm no new store, field, or cross-store synchronization was introduced.
- [ ] Confirm `SelectionManager`, `CanvasRuntime`, and other Canvas Runtime classes remain untouched and Zustand-free.
- [ ] Confirm `CanvasEngineProvider` remains the sole `selectionStore`-writing file (`grep -rn "selectionStore" src/features/canvas` should show exactly one importer, as established after Decision 014's implementation).
