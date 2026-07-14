# BUGFIX_002 — Node Creation Loop Investigation

> **Status:** 🟡 Investigation
> **Priority:** P0 — blocks Sprint 07
> **Discovered during:** BUGFIX_001 fix verification
> **Owner:** Canvas Runtime / Node Creation Pipeline

---

# Objective

Determine why both click-to-create and drag-to-create produce a "Maximum update depth exceeded" error inside React Flow's `<StoreUpdater>`.

This document is intentionally **not** an implementation plan. Its purpose is to identify the true source of the defect before any production code is modified. No workaround should be introduced before the investigation is complete.

---

# Background

During verification of `BUGFIX_001_SELECTION_FIREHOSE_FIX.md`, both click-to-create (via the node palette) and drag-and-drop creation were found to trigger a React "Maximum update depth exceeded" error, with the reported stack terminating inside `@xyflow/react`'s internal `<StoreUpdater>` component calling its own `setNodes`.

This was confirmed to be a second, independent defect — not caused by the Selection Firehose fix:

- It reproduces on the current implementation (with the Selection Firehose fix applied).
- It reproduces identically on the baseline **before** the Selection Firehose fix (confirmed via `git stash` and re-testing on the unmodified code).
- Therefore it is **not** caused by `BUGFIX_001`'s change to `onNodesChange`'s classification logic.

---

# Known Facts

- Reproduces on the current implementation.
- Reproduces on the baseline before `BUGFIX_001`.
- Therefore it is NOT caused by the Selection Firehose fix.
- The failure appears **after** node creation, not before — the app loads and renders correctly; the crash occurs only once a new node is created.
- The reported stack terminates inside `@xyflow/react`'s `<StoreUpdater>` component, inside a call to `setNodes` originating from `commitHookEffectListMount`.

---

# Scope

This investigation covers only the node creation pipeline and its interaction with React Flow's controlled `nodes` prop. It explicitly excludes:

- The Selection Firehose (`BUGFIX_001`) — already fixed and verified independently.
- The listener-leak defect (`BUGFIX_001` Phase 2/3) — already diagnosed, not yet fixed, tracked separately.
- Property Panel, Rendering, Node Registry, UX improvements.

---

# Suspected Components

Investigation priority, per the six candidates named in the investigation request:

- `journeyStore` updates (`addNode`)
- `CanvasRuntime` (`createNode`, `createNodeAtScreenPoint`, `createNodeAtViewportCenter`)
- `NodeCreationService`
- `CanvasViewport`
- `ReactFlowAdapter`
- React Flow itself

---

# Investigation Methodology

## Phase 1

Trace the loop's entry point. Answer only:

1. What is the first application function that leads into `<StoreUpdater>`?
2. Is the loop initiated by `journeyStore` updates, `CanvasRuntime`, `NodeCreationService`, `CanvasViewport`, `ReactFlowAdapter`, or React Flow itself?

Do not modify behavior. Only instrument.

## Phase 2+ (not yet started)

Reserved for later phases, following the same phased methodology used in `BUGFIX_001_SELECTION_FIREHOSE_INVESTIGATION.md` — propagation tracing, lifecycle verification, comparison against React Flow's documented patterns, and root cause isolation. Not performed as part of this document.

---

# Explicit Non-Goals

This investigation must NOT:

- Add guards, debounce, throttle, or suppress any callback.
- Duplicate state or introduce additional stores.
- Introduce workarounds.
- Fix anything. Any solution must remove the root cause rather than mask symptoms, and must not be implemented until the root cause is proven.

---

# Acceptance Criteria (for the investigation as a whole — not required to be met by Phase 1 alone)

The investigation is complete when all of the following are known:

- Which application function is the first to call into `<StoreUpdater>`.
- Which of the six candidate components initiates the loop.
- Why the loop is bounded by React's "Maximum update depth exceeded" safeguard rather than resolving on its own.
- A root-cause explanation is documented.
- A minimal implementation strategy has been proposed (in a separate fix-proposal document, following `BUGFIX_001`'s pattern).

No code changes should be merged until these criteria are satisfied.

---

# Phase 1 Findings — Loop Entry Point

**Status:** Phase 1 complete. All temporary instrumentation has been removed — `git diff` against the pre-Phase-1 state shows zero changes to source files. No fix has been implemented and no behavior has been modified.

## Method

A single shared probe (`globalThis.__creationLoopProbe(label)`, `undefined` outside a test harness, making it a true no-op in normal operation) was placed at the entry point of each of the six candidate components named in this investigation's scope:

- `journeyStore.addNode`
- `NodeCreationService.createNode`
- `CanvasRuntime.createNode`
- `CanvasViewport`'s render body and `onNodesChange` callback
- `ReactFlowAdapter.triggerSelectionChange`

A Playwright harness loaded the app, cleared mount-time probe noise, triggered click-to-create via the node palette, and recorded every probe call in order with a timestamp, for 800ms after the click (React's "Maximum update depth exceeded" safeguard aborts the loop well within this window).

## Call Order Observed

```
1. CanvasRuntime.createNode                    (once)
2. NodeCreationService.createNode              (once)
3. journeyStore.addNode                        (once)
4. CanvasViewport.render                       (x2 — StrictMode double-render)
5. ReactFlowAdapter.triggerSelectionChange
6. CanvasViewport.render                       (x2)
7. ReactFlowAdapter.triggerSelectionChange
8. CanvasViewport.render                       (x2)
9. ReactFlowAdapter.triggerSelectionChange
   ... (pattern repeats until React aborts with "Maximum update depth exceeded")
```

159 probe calls were captured before the array was truncated for this report; the actual count before React's safeguard fires is higher. The call-frequency tally over the captured window:

| Label | Count |
|---|---|
| `CanvasRuntime.createNode` | 1 |
| `NodeCreationService.createNode` | 1 |
| `journeyStore.addNode` | 1 |
| `CanvasViewport.render` | 104 |
| `ReactFlowAdapter.triggerSelectionChange` | 52 |

## Answers to Phase 1's Questions

**1. What is the first application function that leads into `<StoreUpdater>`?**

`CanvasRuntime.createNode` is the first application function in the call chain — it is the entry point invoked by the palette's click-to-create action. It calls `NodeCreationService.createNode`, which calls `journeyStore.addNode` exactly once. None of these three functions repeat. The repeating sequence begins immediately afterward, alternating between `CanvasViewport.render` and `ReactFlowAdapter.triggerSelectionChange` — this alternating pair is what ultimately keeps re-entering React's commit cycle and, per the crash's reported stack (`@xyflow/react`'s `<StoreUpdater>` calling its own `setNodes` from `commitHookEffectListMount`), is what leads into `<StoreUpdater>`.

**2. Is the loop initiated by `journeyStore` updates, `CanvasRuntime`, `NodeCreationService`, `CanvasViewport`, `ReactFlowAdapter`, or React Flow itself?**

The loop is **not** initiated by `journeyStore`, `CanvasRuntime`, or `NodeCreationService` — each fires exactly once in the captured sequence and never appears again. `journeyStore.addNode` in particular is not part of the repeating pattern at all, which rules out the node-creation store write itself as an ongoing driver of the loop (it triggers the *first* render, but does not re-fire).

The repeating pair is `CanvasViewport.render` and `ReactFlowAdapter.triggerSelectionChange`. This is the same two-component signature identified in `BUGFIX_001`'s Phase 4 investigation for the idle selection firehose: a render produces a new controlled `nodes` prop for `<ReactFlow>`, React Flow's internal reconciliation against that prop calls back into `onSelectionChange` (relayed through `ReactFlowAdapter.triggerSelectionChange`), and handling that callback leads to another render. Per this call order, **the loop is initiated by React Flow itself** reacting to the controlled `nodes` prop changing as a result of the one-time `journeyStore.addNode` write — not by any of the application-level components repeatedly calling anything. `CanvasViewport` and `ReactFlowAdapter` are relay points inside the loop, not its initiator; `journeyStore`, `CanvasRuntime`, and `NodeCreationService` are entirely outside the loop, having already completed before it begins.

## Relationship to BUGFIX_001

This confirms what was already suspected during `BUGFIX_001`'s fix verification: `BUGFIX_002` is a variant of the same underlying render→reconcile→re-emit mechanism `BUGFIX_001` diagnosed for the idle firehose, but triggered by a single legitimate `journeyStore` write (node creation) instead of a continuous stream of renderer-owned `dimensions` reports. `BUGFIX_001`'s fix does not — and was never expected to — prevent this, because a node-creation write is a genuine business mutation (`journeyStore.addNode`) that must persist; `BUGFIX_001`'s classification logic has no mechanism to suppress it, nor should it. The loop here is bounded only by React's "Maximum update depth exceeded" safeguard, which aborts it after enough iterations to crash the render tree — unlike the idle firehose, which stabilizes at a sustained high rate without crashing because the idle case has no single component instigating additional renders once the render/reconcile pair settles into steady-state.

Whether this is the exact same root cause as `BUGFIX_001` (React Flow's internal reconciliation against a controlled `nodes` prop) or a related-but-distinct mechanism specific to how selection is applied to a newly-created node has not yet been determined — that is reserved for Phase 2 and beyond, not concluded here.

## What Phase 1 Does Not Yet Explain

- Why this particular one-time `journeyStore` write produces an *unbounded, crashing* loop, while `BUGFIX_001`'s continuous `dimensions` writes produced a *bounded, sustained* (non-crashing) rate. This asymmetry is not yet explained and is a candidate question for Phase 2.
- Whether `NodeCreationService.createNode`'s call to `selectNode(node.id)` (which emits a `selectionChange` event, per `SelectionManager`) is the specific mechanism that seeds the first `ReactFlowAdapter.triggerSelectionChange` call, or whether it originates independently from React Flow's own post-creation reconciliation. The captured call order is consistent with either explanation and does not distinguish between them.
- Whether the listener-leak defect (`BUGFIX_001` Phase 2/3 — `SelectionManager.setAdapter()` never disposing its previous subscription) contributes to this loop's severity (e.g. by causing each `triggerSelectionChange` call to fan out to multiple stacked listeners) or is unrelated to it.

Per this task's instruction, Phase 1 stops here. No fix has been proposed or implemented.

---

# Phase 2 Findings — Why a Single `addNode()` Write Enters an Infinite Loop

**Status:** Phase 2 complete. All temporary instrumentation has been removed — `git diff` against the pre-Phase-2 state shows zero changes to source files. No fix has been implemented and no architecture has been changed.

## Method

Working only inside the controlled `nodes` pipeline (`CanvasViewport.tsx`) and `journeyStore.ts`, temporary no-op probes (`globalThis.__p2Probe(label, data)`, `undefined` outside the test harness) were placed at each candidate mechanism:

1. **`rfNodes` generation** — probe inside the `rfNodes` `useMemo`, recording node count and `selectedNodeId` on every recomputation.
2. **`useMemo` dependencies for `rfNodes`** — inferred from the recomputation probe firing in lockstep with the render probe (same dependency array `[nodes, selectedNodeId]` already visible in source).
3. **`selected` prop mapping** — the harness recorded `rfNodes.map(n => [n.id, n.selected])` on every render via a probe placed immediately before the `<ReactFlow>` element, so the actual `selected` boolean sent to React Flow could be read back per node, per render.
4. **`nodeTypes` object identity** — a probe inside the `nodeTypes` `useMemo`, plus a reference-identity fingerprint (via a `WeakMap`-assigned id, since raw object references can't cross the `page.evaluate` boundary) captured alongside `rfNodes`' and `onNodesChange`'s identities on every render.
5. **React Flow controlled `nodes` reconciliation** — not directly instrumentable (internal to `@xyflow/react`), inferred from the render/prop-identity timeline.
6. **`applyNodeChanges` usage after node creation** — instrumented indirectly: a probe at the top of `onNodesChange` records every invocation and the change types received; since `applyNodeChanges` is only ever called from inside that handler, zero `onNodesChange` invocations means zero `applyNodeChanges` calls.
7. **Immediate write-back from `onNodesChange`** — a probe immediately before the `setNodes(updatedNodes)` call inside `onNodesChange`, plus a probe inside `journeyStore.setNodes` itself, so a write-back would be visible from both the caller and store side even if one instrumentation point were somehow bypassed.

A Playwright harness loaded the app, cleared mount-time probe noise, triggered click-to-create, and captured every probe call with a timestamp for 600ms afterward.

## Experiments

| # | Hypothesis | Instrumentation | Observed Behaviour | Conclusion |
|---|---|---|---|---|
| 1 | `rfNodes` recomputes on every render, producing a new array each time. | Probe inside `rfNodes`' `useMemo`. | `rfNodes-recomputed` fired once per render, 104 times, matching the render count exactly. | Confirmed — `rfNodes` recomputes every render with no throttling. This is expected given its dependency array; not itself surprising, but confirms nothing skips recomputation. |
| 2 | `useMemo`'s dependency array (`[nodes, selectedNodeId]`) is what's forcing recomputation. | Same probe, recording `nodeCount` and `selectedNodeId` per call. | `nodeCount` stayed constant at 3 across all 104 recomputations (no further node creation/deletion). `selectedNodeId` alternated between the new node's ID and `null` on every call. | Confirmed — `nodes` itself is stable after the initial creation; `selectedNodeId` is the dependency actually changing on every render, and it is doing so continuously. |
| 3 | The `selected` flag on the newly created node is flipping between renders. | Probe capturing `rfNodes.map(n => [n.id, n.selected])` immediately before `<ReactFlow>`. | The new node's `selected` value alternated `true, true, false, false, true, true, false, false, ...` in lockstep with `selectedNodeId` alternating between the node's own ID and `null`. The other two (pre-existing) nodes stayed `false` throughout. | Confirmed and isolated — the newly created node's `selected` prop is the one value oscillating every render pair; nothing else in `rfNodes` changes after the initial creation. |
| 4 | `nodeTypes`' object identity is unstable and contributes to the loop. | Reference-identity fingerprint captured alongside `rfNodes`/`onNodesChange` on every render. | `nodeTypes` kept the same reference across all 104 renders (1 distinct id observed). | Ruled out — `nodeTypes` is correctly memoized with an empty dependency array and never changes during the loop. |
| 5 | React Flow re-derives and re-emits selection state in response to the controlled `nodes` prop changing on every render. | Not directly instrumentable; inferred from the render/prop-identity/selected-flag timeline together with `BUGFIX_001` Phase 1's confirmed stack trace (`ReactFlowAdapter.triggerSelectionChange` ← React Flow's `onSelectionChange` prop ← `commitPassiveMountOnFiber`). | `rfNodes` receives a new reference every render (104 distinct ids across 104 renders), and the `selected` flag inside it toggles every render pair with no `onNodesChange` call in between. This is consistent with React Flow reconciling against a changing controlled prop and independently re-deriving/re-emitting selection on each reconciliation. | Not directly disproven or newly confirmed by this phase's instrumentation (React Flow's internals remain a black box), but the observed pattern is fully consistent with this mechanism and there is no alternative explanation left standing once 1–4, 6, and 7 are ruled out or confirmed as non-causal on their own. |
| 6 | `applyNodeChanges` is being called repeatedly after node creation, contributing to the loop. | Probe at the top of `onNodesChange` (the only call site of `applyNodeChanges`), recording every invocation and its change types. | Zero `onNodesChange` invocations were recorded during the entire 104-render loop. | Ruled out — `applyNodeChanges` is never called during this loop. `onNodesChange` does not fire at all. |
| 7 | `CanvasViewport` or `journeyStore` writes something back immediately after node creation, re-triggering the cycle. | Probe before `setNodes(updatedNodes)` inside `onNodesChange`, and a separate probe inside `journeyStore.setNodes` itself. | Neither probe fired at any point during the loop. The only `journeyStore` write observed in the entire capture window was the single `addNode` call that preceded the loop's first render. | Ruled out — there is no write-back into `journeyStore` during the loop, from either `onNodesChange` or any other path. `journeyStore.nodes` is not part of the loop at all after the initial creation. |

## Answers to Phase 2's Questions

**1. Which specific controlled prop changes immediately before the first repeated render?**

The `selected` boolean inside `rfNodes`, specifically on the newly created node. `nodes` (node count/content) and `nodeTypes` are both stable after creation; `rfNodes` as an array reference changes every render (because it's a new `useMemo` output each time `selectedNodeId` changes), but the only *semantic* content change inside it, render over render, is that one node's `selected` flag flipping between `true` and `false`.

**2. Does `rfNodes` receive a new reference every render?**

Yes — confirmed directly. 104 distinct references were observed across 104 renders, with no repeats, for the entire duration of the loop.

**3. Does React Flow emit `onNodesChange` immediately after node creation?**

No — confirmed directly. Zero `onNodesChange` invocations were recorded at any point during the 104-render loop. Whatever is driving the repeated renders, it is not arriving through the `onNodesChange` channel.

**4. Does `CanvasViewport` immediately write anything back into `journeyStore` after node creation?**

No — confirmed directly, from both sides (the call site inside `onNodesChange` and `journeyStore.setNodes` itself). The single `addNode` call is the only `journeyStore` write in the entire captured window; nothing writes to `journeyStore` again until/unless the loop is externally interrupted.

**5. Is node creation itself complete before the loop starts?**

Yes — confirmed directly. `journeyStore.addNode` completes (its `set()` call returns) before the first render in the loop begins, and it is never called again during the loop. Node creation is a one-time, already-finished event by the time the repeated render/reconciliation cycle takes over.

## Interpretation

Node creation itself is not the ongoing driver of the loop — it fires once, correctly, and finishes. What follows is a cycle confined entirely to **selection state and React Flow's reconciliation of the `selected` prop**, with no participation from `nodes` content, `nodeTypes`, `onNodesChange`, or `journeyStore` after the initial write. `selectedNodeId` (sourced from `selectionStore` via `CanvasEngineProvider`'s context, per Decision 014's pipeline) alternates between the new node's ID and `null` every render, and this alternation — not any repeated business-data mutation — is what keeps `rfNodes` producing a new reference and keeps the cycle running until React's "Maximum update depth exceeded" safeguard aborts it.

This narrows the loop's true location to the **selection pipeline's interaction with React Flow's controlled-`selected`-prop reconciliation** — the same class of mechanism `BUGFIX_001` diagnosed for the idle firehose (Phase 1: React Flow calling back into `onSelectionChange` from its own passive-effect commit in response to a changing controlled prop), but here the trigger is the initial `NodeCreationService.createNode` → `selectNode(node.id)` call rather than a continuous `dimensions` report, and the observable symptom is `selectedNodeId` itself flapping between the new node and `null` rather than idling on empty. Why `selectedNodeId` specifically alternates to `null` and back — rather than settling on the new node's ID — is not established by this phase and is the natural next question for Phase 3.

## What Phase 2 Does Not Yet Explain

- Why `selectedNodeId` alternates specifically between the new node's ID and `null`, rather than settling on one value or the other. This points at the `selectionStore` → `CanvasEngineProvider` → context → `CanvasViewport` chain, but the exact mechanism producing the alternation (as opposed to a single spurious flip) has not been traced.
- Whether this is the exact same underlying React Flow behavior `BUGFIX_001` Phase 1 identified (reconciliation-driven re-emission from a passive-effect commit) or a related-but-distinct interaction specific to how a *newly mounted* node's selection is first applied. Phase 1's finding was for pre-existing, already-mounted nodes reacting to `dimensions` reports; this loop begins the instant a new node mounts, which may involve different React Flow internals (e.g. initial measurement/mount effects) not exercised by the idle-firehose case.
- Whether the listener-leak defect (`BUGFIX_001` Phase 2/3) contributes to this loop's severity or is unrelated — not evaluated in this phase, consistent with this investigation's scope being limited to the controlled `nodes` pipeline only.

Per this task's instruction, Phase 2 stops here. No fix has been proposed or implemented.

---

# Phase 3 Findings — Why `selectedNodeId` Alternates

**Status:** Phase 3 complete. All temporary instrumentation has been removed — `git diff` against the pre-Phase-3 state shows zero changes to source files. No fix has been implemented and no architecture has been changed.

## Method

Working only inside the selection pipeline, a shared no-op probe (`globalThis.__p3Probe(label, data)`) was placed at every hop between React Flow and `selectionStore`:

1. `ReactFlowAdapter.triggerSelectionChange` — records the raw `(nodes, edges)` payload as received directly from React Flow's `onSelectionChange` prop (via `CanvasViewport`'s inline handler), before any relay.
2. `SelectionManager`'s adapter callback (registered in `setAdapter`) — records the payload immediately on receipt (`adapterCallback-received`) and immediately before emitting on `CanvasEvents` (`adapterCallback-emitted`), so any transform between the two would be directly visible.
3. `SelectionManager.selectNode` and `SelectionManager.clearSelection` — instrumented separately, to check whether the programmatic-selection path (used by `NodeCreationService`) or the clear path is ever invoked during the loop.
4. `CanvasEngineProvider`'s `selectionChange` handler — records the payload it received from `CanvasEvents` and the exact `selectedNode`/`selectedEdge` values it derives before calling into `selectionStore`.
5. `selectionStore.selectNode`, `selectionStore.setSelectedNodeId`, and `selectionStore.clearSelection` — each instrumented to record its argument and a stack trace, so the actual caller of every store write is directly attributable rather than inferred.

A Playwright harness loaded the app, cleared mount-time noise, triggered click-to-create, and captured every probe call with a timestamp for 600ms afterward — long enough to observe many iterations of the loop before React's safeguard would abort it.

## Experiments

| # | Hypothesis | Instrumentation | Observed Behaviour | Conclusion |
|---|---|---|---|---|
| 1 | React Flow emits an empty selection immediately after mounting a new node. | Probe at `ReactFlowAdapter.triggerSelectionChange`, the earliest instrumented point, recording the raw `(nodes, edges)` payload. | The very first captured `triggerSelectionChange` call (t=863.6ms, immediately after the initial `SelectionManager.selectNode-called` from node creation at t=860.6ms) carried `nodes: []`. Every subsequent call alternated `[] → [newNodeId] → [] → [newNodeId] → ...`, 52 calls total in the capture window. | Confirmed — React Flow itself emits an empty selection shortly after the new node is created and mounted, and continues alternating between empty and the new node's ID indefinitely. This is the earliest point in the entire pipeline where the alternation is observable. |
| 2 | `CanvasViewport` derives `selected` incorrectly from `selectedNodeId`. | Not directly re-instrumented in this phase (already tested in Phase 2, Experiment 3: `rfNodes.map(n => [n.id, n.selected])` matched `selectedNodeId` exactly on every render, with no mismatch). | No new contradicting evidence found. `CanvasEngineProvider`'s handler in this phase's capture derives `selectedNode = selection.nodes[0] || null` correctly from whatever payload it receives — the derivation logic itself is correct given its input. | Ruled out — `CanvasViewport`'s `selected` mapping is a correct, faithful function of `selectedNodeId`; the alternation is not a derivation bug, it's a faithful reflection of an alternating input. |
| 3 | `CanvasEngineProvider`'s context value changes unexpectedly, independent of `selectionStore`. | Probe on the `selectionChange` handler recording the payload received and the `selectedNode`/`selectedEdge` values computed from it. | Every `CanvasEngineProvider.selectionChange-handler` call's `selectedNode` matched `selection.nodes[0] || null` exactly, and every such call was immediately followed by a matching `selectionStore.selectNode` call with the same `nodeId`. No handler invocation occurred without a corresponding upstream `CanvasEvents` emission. | Ruled out as an independent cause — `CanvasEngineProvider` does not change its context value on its own; every context change traces back to a `selectionChange` event it received, which in turn traces back to `ReactFlowAdapter.triggerSelectionChange`. |
| 4 | `SelectionManager` receives alternating callbacks from React Flow. | Probe on `SelectionManager`'s adapter callback, recording the payload at receipt. | `adapterCallback-received` alternated `{nodes:[],edges:[]}` / `{nodes:[newNodeId],edges:[]}` in lockstep with `ReactFlowAdapter.triggerSelectionChange`'s payloads — every receipt exactly matched the immediately preceding trigger call. 156 receipts recorded in the window (matching 52 trigger calls × up to 3 relays, consistent with the still-unfixed listener-leak defect from `BUGFIX_001` Phase 2/3 stacking multiple listeners on one adapter). | Confirmed, but attributed to the correct source — `SelectionManager` does receive alternating callbacks, but only because React Flow is alternately calling `triggerSelectionChange` with alternating payloads (Experiment 1). `SelectionManager` is a faithful receiver, not an independent source of the alternation. |
| 5 | `ReactFlowAdapter.triggerSelectionChange` emits alternating payloads. | Same probe as Experiment 1. | Confirmed directly — see Experiment 1. | Confirmed, but `ReactFlowAdapter.triggerSelectionChange` only emits what it is called with; it performs no internal logic of its own (`this.selectionListeners.forEach((cb) => cb({ nodes, edges }))`, an unconditional relay). The alternating payload originates from whatever calls `triggerSelectionChange` — i.e. `CanvasViewport`'s `onSelectionChange` prop handler, which only ever forwards exactly what React Flow itself passes into that prop. |
| 6 | `SelectionStore` itself alternates between `selectNode()` and `clearSelection()`. | Probes on `selectionStore.selectNode`, `selectionStore.clearSelection`, and `SelectionManager.clearSelection`. | `clearSelection` was called **zero times** at either the `SelectionManager` or `selectionStore` level, across the entire capture window (157 total `selectionStore.selectNode` calls, 0 `clearSelection` calls, confirmed by direct tally). `selectionStore.selectNode` was called repeatedly with alternating arguments: `nodeId` (the new node), then `null`, then `nodeId` again, in the same pattern as the upstream payloads. | Disproven as stated — `clearSelection()` is never invoked anywhere in this flow (nor, per a static grep across the codebase, is it called from anywhere at all currently). The `null` value reaching `selectionStore` arrives exclusively through repeated `selectNode(null)` calls, not through a separate `clearSelection()` path. The *effective* alternation (node ID vs. `null`) is real, but the mechanism named in this hypothesis (switching between two different methods) does not occur. |

## Answers to Phase 3's Questions

**1. Who writes `null` into `SelectionStore`?**

`CanvasEngineProvider`'s `selectionChange` handler, via `selectNode(selectedNode)` where `selectedNode = selection.nodes[0] || null`. When the upstream `selectionChange` event carries an empty `nodes` array, `selectedNode` evaluates to `null`, and that `null` is passed into `selectionStore.selectNode`, which is the only method that writes `selectedNodeId`. The stack trace captured for the first such call confirms the call path: `selectionStore.selectNode` ← `CanvasEngineProvider.tsx`'s handler ← `CanvasEvents.emit` ← (originating from `SelectionManager`'s adapter callback, itself triggered by `ReactFlowAdapter.triggerSelectionChange`).

**2. Does `clearSelection()` actually execute?**

No — confirmed directly. Zero invocations were recorded at either the `SelectionManager.clearSelection` or `selectionStore.clearSelection` level during the entire capture window. A static search of the codebase additionally confirms `clearSelection()` has no caller anywhere in the current source. It is dead code with respect to this (and, as far as this investigation has observed, any) flow.

**3. Which callback first emits an empty selection?**

`CanvasViewport`'s inline `onSelectionChange` prop handler (`({ nodes: selNodes, edges: selEdges }) => adapter.triggerSelectionChange(...)`), invoked by React Flow itself, is the first application-level callback to carry an empty selection — it does so because React Flow calls it with an empty `nodes` array as its argument. This is not a callback independently deciding to emit empty; it is relaying exactly what its caller (React Flow) passed in. Every downstream callback (`SelectionManager`'s adapter subscription, `CanvasEngineProvider`'s `selectionChange` handler) receives and relays the same empty payload without alteration.

**4. Does React Flow emit `[newNode]` then `[]`?**

Yes, and it continues alternating well beyond a single pair — confirmed directly via `ReactFlowAdapter.triggerSelectionChange`'s captured payloads: `[] → [newNodeId] → [] → [newNodeId] → ...`, sustained for the full 52-call capture window (and, per Phase 2's render count, continuing until React's "Maximum update depth exceeded" safeguard aborts it). The very first payload observed after node creation was empty (`[]`), arriving shortly after the initial programmatic `SelectionManager.selectNode(newNodeId)` call from `NodeCreationService` — i.e., the creation flow correctly selects the new node once, and then React Flow's own reconciliation immediately begins alternately reporting it as unselected and reselected, with no further application-level trigger.

**5. Does `SelectionManager` relay exactly what React Flow sends, or does it transform the payload?**

It relays exactly, with no transform. Every `adapterCallback-received` value was byte-for-byte identical (by structural comparison of the captured JSON) to the corresponding `adapterCallback-emitted` value, and both matched the immediately preceding `ReactFlowAdapter.triggerSelectionChange` payload. `SelectionManager.setAdapter`'s callback only assigns `this.selection = selection` and re-emits it verbatim on `CanvasEvents` — there is no filtering, mapping, or conditional logic that could alter the payload between receipt and emission.

## Interpretation

The alternation does not originate in this codebase's application code at any layer — `CanvasViewport`, `ReactFlowAdapter`, `SelectionManager`, `CanvasEngineProvider`, and `selectionStore` all behave as correct, faithful relays of whatever they are given. Each layer was independently confirmed to pass its input through unchanged (aside from `CanvasEngineProvider`'s trivial `nodes[0] || null` extraction, which is a correct transformation of an already-alternating array, not a source of alternation itself). The earliest point in the entire chain where the alternating `[] / [newNodeId]` pattern is observable is `ReactFlowAdapter.triggerSelectionChange`'s very first calls — meaning **React Flow itself is the originating source of the alternating payload**, consistent with `BUGFIX_001` Phase 1's finding that React Flow calls `onSelectionChange` from its own internal passive-effect commit cycle, independent of user interaction, in response to its controlled `nodes` prop changing (here, `Phase 2`'s finding that the new node's `selected` flag is the value alternating in that prop).

This closes the causal loop precisely: `NodeCreationService` selects the new node once (correctly) → React Flow's internal reconciliation, upon mounting/measuring the new node, calls back with an empty selection → `CanvasEngineProvider` faithfully writes `null` into `selectionStore` → `CanvasViewport` re-renders with the new node's `selected` flag now `false` → React Flow reconciles against that changed controlled prop and calls back again, this time reporting the node as selected → the cycle repeats, alternating indefinitely, with every application-level component behaving correctly given its inputs and no single component being the "cause" independent of this render/reconcile cycle.

## What Phase 3 Does Not Yet Explain

- Why React Flow's own internal reconciliation, upon a newly-mounted node's selection being set programmatically, produces this specific empty-then-selected oscillation rather than settling once. This is internal to `@xyflow/react` and was not (and per this investigation's stated scope, should not be) traced into the library's own source.
- Whether this is provoked specifically by the *timing* of the programmatic `selectNode` call relative to the new node's mount/measurement lifecycle (i.e., whether calling `selectNode` after the node has fully mounted and been measured would avoid triggering this), which would be a natural question for a future phase focused on the node-creation call sequence rather than the selection relay chain.
- Whether the still-unfixed listener-leak defect (`BUGFIX_001` Phase 2/3) — visible in this phase's data as `SelectionManager.adapterCallback-received` firing up to 3 times per single `ReactFlowAdapter.triggerSelectionChange` call — amplifies the severity or frequency of this loop, though it was confirmed not to be its origin (Experiment 4).

Per this task's instruction, Phase 3 stops here. No fix has been proposed or implemented.

---

# Phase 4 Findings — Why React Flow Emits the Alternating Payload

**Status:** Phase 4 complete. All temporary instrumentation has been removed — `git diff` against the pre-Phase-4 state shows zero changes to source files. No fix has been implemented and no architecture has been changed.

## Method

Working only inside `CanvasViewport.tsx`'s React Flow integration, three additions were made temporarily:

1. A module-level render sequence counter, incremented once per `CanvasViewportInner` render and captured into a local constant (`__p4ThisRenderSeq`) at the top of each render, so every prop/callback observed during that render could be tagged with a stable sequence number.
2. A probe immediately before the `<ReactFlow>` element, recording — on every render — the render's sequence number, reference-identity fingerprints (via a `WeakMap`-assigned id) for `rfNodes`, `nodeTypes`, and `onNodesChange`, and the exact `[id, selected]` pairs for every node in `rfNodes`.
3. A probe inside the `onSelectionChange` prop handler itself, recording the *most recently completed* render's sequence number (read from the same module-level counter) at the moment React Flow actually invokes the callback, plus the raw `nodes`/`edges` payload.

This design directly answers "which render, if any, immediately preceded a given emission" without guessing from timestamps alone — the `mostRecentRenderSeq` value recorded inside `onSelectionChange` is read from the live counter at the exact moment React Flow calls it, so it reflects the true most-recent commit rather than an inferred one.

A Playwright harness loaded the app, cleared mount-time noise, triggered click-to-create, and captured every probe call for 600ms afterward. A second, narrower run additionally checked the relationship between the new node's first appearance in `rfNodes` and the first empty-selection emission.

## Experiments

| # | Hypothesis | Instrumentation | Observed Behaviour | Conclusion |
|---|---|---|---|---|
| 1 | `selected` prop changes every render. | Per-node `[id, selected]` pairs captured on every render. | The new node's `selected` value alternated `true, true, false, false, true, true, ...` across consecutive renders, exactly as found in Phase 2/3. Confirmed again here with render-sequence tagging attached. | Confirmed, consistent with prior phases — not new information on its own, but necessary context for the timing analysis below. |
| 2 | `rfNodes` receives a new reference every render. | Reference-identity fingerprint on `rfNodes`, captured per render. | 104 distinct `rfNodesRefId` values across 104 renders — never repeated. | Confirmed — matches Phase 2's finding exactly. |
| 3 | `nodeTypes` receives a new reference every render. | Reference-identity fingerprint on `nodeTypes`, captured per render. | 1 distinct `nodeTypesRefId` value across all 104 renders. | Ruled out — `nodeTypes` is correctly memoized and stable throughout, matching Phase 2's finding. |
| 4 | `ReactFlowProvider`/`<StoreUpdater>` replays selection after controlled updates. | Not directly instrumentable (internal to `@xyflow/react`); inferred from the render-sequence-tagged emission timing (see Interpretation below). | The first empty-selection emission (`mostRecentRenderSeq=9`) occurred **after** a render (renderSeq=9) whose `selected` value for the new node was still `true` — not `false`. The render showing `selected: false` (renderSeq=10) only appears **after** that emission, not before it. | This is the central finding of this phase: the empty emission is not a reaction to a `selected: false` prop having just arrived — no such prop had arrived yet at that point. The emission precedes, rather than follows, the corresponding prop change, which is inconsistent with "React Flow is replaying/reconciling a value the application just sent it" and consistent with React Flow's own internal state changing on a timer/lifecycle basis independent of the immediately preceding prop values. |
| 5 | `CanvasViewport` rebuilds controlled props unnecessarily. | Same render/prop instrumentation as Experiments 1–3, cross-referenced against `onNodesChange`'s own reference count. | `onNodesChange` also received a new reference on every render (104 distinct, tied to its `[setNodes, selectedNodeId]` dependency array reacting to `selectedNodeId`'s alternation). No render was found where `CanvasViewport` rebuilt props without a corresponding change in `nodes` or `selectedNodeId` — every rebuild was a correct, expected `useMemo`/`useCallback` recomputation given its dependencies. | Ruled out as an independent, additional cause — `CanvasViewport` is not rebuilding props "unnecessarily" in the sense of ignoring its own memoization; it is correctly recomputing every time `selectedNodeId` changes, which is itself downstream of the loop (Phase 3), not a separate contributing defect. |
| 6 | React Flow receives conflicting `selected` values from `rfNodes`. | Per-render `[id, selected]` pairs for all three nodes, every render. | Within any single render, exactly one node (or zero) had `selected: true` at a time — never two nodes simultaneously `true`, never any internal inconsistency within a single `rfNodes` array. The two pre-existing nodes remained `false` throughout every render captured. | Ruled out — there is no internal conflict within a single `rfNodes` payload. The alternation is a single node's value changing across time (renders), not a contradiction within one point in time. |

## Answers to Phase 4's Questions

**1. Which controlled prop changes immediately before the first empty selection emission?**

None of `nodes`, `nodeTypes`, or the `selected` values had changed to reflect "unselected" by the time the first empty emission occurred. The render immediately preceding the emission (renderSeq=9) still showed the new node's `selected` value as `true` — identical to the render before it (renderSeq=8). No controlled prop changed between those two renders in a way that would explain React Flow suddenly reporting an empty selection.

**2. Does `selected` on the newly created node flip `true`/`false` before React Flow emits `[]`?**

No — confirmed directly, and this is the phase's key finding. The flip to `false` (renderSeq=10) happens **after** the first empty emission (t=875.00ms, tied to renderSeq=9), not before it. The sequence is: mount with `selected: true` (renderSeq=8) → one more render, still `true` (renderSeq=9) → **React Flow emits `[]`** → the application reacts by writing `null` into `selectionStore` → the next render reflects `selected: false` (renderSeq=10). The emission causes the prop change in this instance; the prop change does not cause the emission.

**3. Does `rfNodes` receive a new reference every render?**

Yes — confirmed directly, 104 distinct references across 104 renders, consistent with Phase 2.

**4. Does `nodeTypes` receive a new reference every render?**

No — confirmed directly, exactly 1 reference across all 104 renders. `nodeTypes` is stable and plays no role in the loop.

**5. Which prop change immediately precedes the first `[]` emission?**

None. This is the explicit answer, not an omission: comparing the render immediately before the emission (renderSeq=9) against the render before that (renderSeq=8), every recorded value — `selected` flags for all three nodes, and by extension the semantic content of `rfNodes` — was identical. The only things that differed between renderSeq=8 and renderSeq=9 were the (expected, memoization-driven) reference identities of `rfNodes`/`onNodesChange` themselves, not any value inside them. Reference identity changing without a value changing is not something the application controls directly avoiding — `useMemo` always returns a new array instance when it recomputes, and it recomputes because its own dependencies (which do not include anything that changed here) triggered it, or because the enclosing component re-rendered. There is no prop *value* change to point to as the trigger for this specific emission.

**6. If every controlled prop is stable, what is the earliest React Flow lifecycle method observed before the first `[]` emission?**

Controlled props were not perfectly stable in the reference sense (Q3 confirms `rfNodes` gets a new reference every render, by design), so this exact precondition did not occur naturally in the captured data, and reproducing it would require changing `CanvasViewport`'s memoization — out of scope for an investigation phase. The closest available answer: the earliest observed event correlated with the first empty emission is **the second render after the new node's initial mount** — the node first appears (with correct `selected: true`) at renderSeq=8, one further render occurs at renderSeq=9 with no semantic change, and the empty emission follows immediately after that second render commits. This places the emission's origin at a React Flow-internal step that runs shortly after a new node's first two render/commit cycles — consistent with an internal post-mount measurement or reconciliation pass — rather than at the mount render itself or at any subsequent prop-driven render.

## Interpretation

This phase shifts the causal understanding established in Phase 3. Phase 3 concluded that React Flow's alternating emissions were "the originating source" without establishing precise timing against the application's own render cycle. Phase 4's render-sequence-correlated data shows specifically that the **first** empty emission is not preceded by any corresponding application-level prop change — it occurs while the `selected: true` prop from node creation is still the most recently committed value. This rules out an explanation where the application's own prop churn (Experiments 1, 2, 5) is what triggers React Flow to report an empty selection; instead, React Flow appears to independently decide to report no selection shortly after a new node mounts, and the ensuing `selected: false` → re-render → React Flow re-reports `[newNode]` → `selected: true` → re-render → React Flow re-reports `[]` cycle is a *consequence* of that first, internally-triggered emission, sustained thereafter by the render/reconcile loop Phase 1–3 already characterized. In short: **the first domino is React Flow's own post-mount behavior, not a reaction to any applicaton-supplied prop value** — everything after that first emission is the application faithfully (and correctly, per each individual component's own logic) reacting to it, which is what keeps the cycle going.

## What Phase 4 Does Not Yet Explain

- What specific internal React Flow mechanism runs on the second render after a new node's mount that causes it to report an empty selection despite no prop indicating a deselection. This is internal to `@xyflow/react` and remains untraced, consistent with this investigation's scope boundary (application-level integration only).
- Whether this behavior is specific to nodes created via the programmatic `selectNode` path (as used by `NodeCreationService`) or would also occur for a node selected via a normal user click shortly after mount — not tested in this phase.
- Whether suppressing the second, semantically-unchanged render (renderSeq=9 in the captured example) — if such a thing were possible without altering the selection architecture — would prevent React Flow from reaching whatever internal state produces the empty emission. This is speculative and explicitly not a fix proposal; it is noted only as a direction a future phase or fix-design document might investigate.

Per this task's instruction, Phase 4 stops here. No fix has been proposed or implemented.
