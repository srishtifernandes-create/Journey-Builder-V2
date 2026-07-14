# BUGFIX_001 — Selection Firehose Investigation

**Status**
🟡 Investigation

**Priority**
P0 – Blocks Sprint 07

**Discovered During**
Decision 014 – Selection Ownership Migration

**Owner**
Canvas Runtime

---

# Objective

Determine the root cause of continuous `selectionChange` events emitted by the canvas runtime.

This document is intentionally **not** an implementation plan.

Its purpose is to identify the true source of the defect before any production code is modified.

No workaround should be introduced before the investigation is complete.

---

# Background

Decision 014 successfully migrated node selection ownership from `JourneyStore` to `SelectionStore`.

During verification, node selection still failed.

Instrumentation revealed a much deeper issue:

Even on an idle canvas with zero user interaction, the runtime continuously emits empty `selectionChange` events.

This behaviour reproduces on the untouched Sprint 06 baseline.

Therefore, the defect predates Decision 014.

---

# Problem Statement

Observed behaviour:

```
Idle Canvas

↓

selectionChange

↓

selectionChange

↓

selectionChange

↓

...
(~370 events / second)
```

Expected behaviour:

```
User selects node

↓

selectionChange

↓

Application updates selection

↓

No further events
```

---

# Confirmed Observations

The following observations have already been verified.

## Confirmed

✅ Reproduces on Sprint 06 baseline

✅ Reproduces after Decision 014

✅ Build passes

✅ Lint passes

✅ Decision 014 migration does not introduce the bug

✅ Empty selections continue to be emitted indefinitely

---

## Not Yet Verified

- Which component emits the first event
- Which component repeats the event
- Whether React Flow is behaving correctly
- Whether subscriptions are duplicated
- Whether callback identities are unstable
- Whether Strict Mode contributes to the issue

---

# Scope

This investigation covers only runtime selection behaviour.

It explicitly excludes:

- Property Panel
- Node Rendering
- JourneyStore
- Node Creation
- Node Registry
- UX improvements

---

# Suspected Components

Investigation priority:

## High

- CanvasViewport
- SelectionManager
- ReactFlowAdapter

## Medium

- CanvasEngineProvider
- CanvasRuntime

## Low

- SelectionStore
- JourneyStore

---

# Investigation Questions

## 1. Event Origin

Where is the first `selectionChange` event emitted?

---

## 2. Event Frequency

Why are events emitted continuously without user interaction?

---

## 3. Subscription Lifecycle

Is the listener registered:

- once
- multiple times
- every render

---

## 4. Callback Stability

Are callback references recreated on every render?

Does React Flow interpret them as new subscriptions?

---

## 5. React Flow Behaviour

Is this expected React Flow behaviour?

Or is the runtime configuring React Flow incorrectly?

---

## 6. Strict Mode

Does the issue disappear with React Strict Mode disabled?

---

## 7. Controlled vs Uncontrolled

Is React Flow operating as a controlled component?

Are controlled props triggering internal reconciliation loops?

---

## 8. Adapter Behaviour

Does `ReactFlowAdapter` subscribe more than once?

Does it correctly clean up listeners?

---

# Investigation Methodology

The investigation should proceed incrementally.

## Phase 1

Trace event origin.

Do not modify behaviour.

Only instrument.

---

## Phase 2

Trace event propagation.

Identify:

```
Emitter

↓

SelectionManager

↓

CanvasEvents

↓

CanvasEngineProvider

↓

SelectionStore
```

Record frequency at every step.

---

## Phase 3

Verify lifecycle.

Check:

- mount
- unmount
- cleanup
- duplicate subscriptions

---

## Phase 4

Compare against React Flow documentation.

Verify that runtime usage matches recommended controlled-selection patterns.

---

## Phase 5

Identify root cause.

Only after root cause has been proven should implementation begin.

---

# Explicit Non-Goals

This investigation must NOT:

- add guards
- debounce events
- throttle events
- suppress callbacks
- duplicate state
- introduce additional stores
- introduce workarounds

Any solution must remove the root cause rather than masking symptoms.

---

# Acceptance Criteria

The investigation is complete when all of the following are known:

- Which component emits the first event
- Why continuous events occur
- Why the issue reproduces on an idle canvas
- Why the issue predates Decision 014
- Whether React Flow is correctly configured
- Which component owns the defect
- A root-cause explanation is documented
- A minimal implementation strategy has been proposed

No code changes should be merged until these criteria are satisfied.

---

# Deliverables

The investigation should produce:

1. Root Cause Analysis
2. Event Sequence Diagram
3. Affected Components
4. Proposed Fix Strategy
5. Risk Assessment
6. Verification Plan

Only after these deliverables exist should implementation begin.

---

# Exit Criteria

The investigation concludes only when the team can answer:

> "What is the single root cause responsible for the continuous `selectionChange` events?"

If that question cannot be answered confidently, the investigation remains open.

---

# Phase 1 Findings — Event Origin

**Status:** Phase 1 complete. Instrumentation was added temporarily, findings were captured, and all instrumentation has been removed. No production behavior was modified — `git diff` against the pre-Phase-1 state shows zero changes to source files.

## Method

Three temporary, no-op-by-default probe hooks were added at the earliest observable points in the pipeline:

1. `ReactFlowAdapter.triggerSelectionChange()` — the exact call site React Flow's `onSelectionChange` prop invokes. Captured a stack trace, the emitted payload, and the current size of `selectionListeners` on every call.
2. `SelectionManager.setAdapter()` — captured a stack trace on every call, to detect duplicate subscription registration.
3. `CanvasViewportInner` (function body, first line) — incremented a render counter, to correlate emission frequency with component render frequency.

All three probes called an optional `globalThis` hook (e.g. `globalThis.__selectionFirehoseProbe?.(...)`) that is `undefined` in normal operation, making the instrumentation a true no-op outside of a test harness that explicitly installs the hooks. A headless-browser harness (Playwright) installed the hooks via `page.addInitScript()` before the app booted, loaded the app with **zero user interaction**, and captured data over a 1.5–2 second window.

## Q1 — Event Origin: Answered

**The first and every subsequent `selectionChange` event originates from React Flow's own internals calling the `onSelectionChange` prop passed to `<ReactFlow>` in `CanvasViewport.tsx`, invoked from inside a React passive-effect commit — not from any user gesture, timer, or polling loop in this codebase.**

Captured stack trace for the first event (materially identical for every subsequent event observed):

```
ReactFlowAdapter.triggerSelectionChange   (ReactFlowAdapter.ts:50)
  ← onSelectionChange                     (CanvasViewport.tsx:132, the inline prop handler)
  ← @xyflow/react internals               (chunk @xyflow_react.js:6306)
  ← commitHookEffectListMount             (React internals)
  ← commitPassiveMountOnFiber             (React internals)
  ← commitPassiveMountEffects_complete    (React internals)
```

This means: **our code is a passive victim of this call, not the initiator.** `CanvasViewport.tsx:132`'s inline handler and `ReactFlowAdapter.triggerSelectionChange` only relay a call that React Flow already decided to make. The true origin sits inside `@xyflow/react`'s own passive-effect-driven selection reconciliation, which fires on effect commit — i.e., on every render commit where React Flow's internal effects run, not exclusively in response to pointer/keyboard input.

## Supporting Data (contributing factors, not yet root-caused in full — reserved for Phase 2)

These were incidentally captured while answering Q1 and are recorded here for Phase 2 to pick up, per the investigation's own methodology (Phase 1 traces origin; Phase 2 traces propagation and frequency in depth):

- **`SelectionManager.setAdapter()` was called 3 times** within the first ~1.5 seconds after load, all from the identical call site (`CanvasViewport.tsx`'s adapter-binding `useEffect`, via `CanvasRuntime.bindAdapter`), all via `commitHookEffectListMount`. This is consistent with React StrictMode's deliberate mount → cleanup → re-mount double-invocation of effects in development, plus at least one additional re-run.
- **`ReactFlowAdapter.selectionListeners` (a `Set`) grew from size 0 → 1 → and stabilized at 3**, and stayed at 3 for the remainder of the observation window. This matches the 3 `setAdapter` calls: each call to `SelectionManager.setAdapter()` registers a new listener via `adapter.onSelectionChange(callback)`, and `CanvasRuntime.unbindAdapter()` — which runs at the start of every `bindAdapter()` call — disposes the viewport/click/doubleclick/contextmenu listeners it tracks in `disposeList`, but does **not** dispose or track the selection listener `SelectionManager.setAdapter()` registers. The selection listener has no corresponding cleanup path at all.
- **249 `selectionChange` events were observed in ~2 seconds** (idle canvas, zero interaction) against **499 renders of `CanvasViewportInner`** in the same window — roughly a 1:2 ratio, consistent with emission being tied to render/commit frequency rather than to a fixed-interval timer.
- Every captured event during the idle window carried an empty payload (`{ nodes: [], edges: [] }`), consistent with the previously confirmed observation that idle emissions are always empty, never a stale non-empty selection.

## What Phase 1 Does Not Yet Explain

Per the investigation's own phase boundaries, the following remain open for Phase 2 onward and are explicitly not claimed as resolved by this document:

- Why React Flow's internal effects re-run at this frequency on an idle canvas (Q2, Q5, Q7).
- Whether the 3x `setAdapter` call count is fully explained by StrictMode alone, or whether an additional real (non-StrictMode) re-run of `CanvasViewport`'s adapter-binding effect is also occurring (Q3, Q6).
- Whether the un-disposed selection listener (3 stacked listeners, never cleaned up) independently triples emitted event *handling* even if React Flow's own emission rate were otherwise normal, and whether these are one root cause or two compounding ones (Q3, Q8).
- Whether this matches documented/expected `@xyflow/react` v12 behavior for controlled `nodes` props, or is a misconfiguration on this codebase's part (Q5).

## Phase 1 Exit Statement

Q1 ("Where is the first `selectionChange` event emitted?") is answered: **inside React Flow's own passive-effect commit machinery, relayed unmodified through `CanvasViewport.tsx`'s `onSelectionChange` prop and `ReactFlowAdapter.triggerSelectionChange`.** This is not sufficient to satisfy the investigation's overall Exit Criteria (a single root cause fully explaining continuous emission) — that requires Phase 2 (propagation/frequency tracing) and Phase 4 (comparison against React Flow's documented controlled-selection patterns) to determine whether the un-disposed listener leak, the repeated effect execution, and React Flow's internal re-emission behavior are one unified root cause or multiple compounding factors. Per the investigation's own rules, implementation must not begin until that fuller picture exists.

Per this task's instruction, Phase 1 stops here.

---

# Phase 2 Findings — Why `setAdapter()` Runs Three Times and Listener Count Reaches Three

**Status:** Phase 2 complete, scoped exactly as instructed: explaining the 3x `SelectionManager.setAdapter()` calls and the growth of `adapter.selectionListeners.size` to 3. Full propagation tracing (every step from emitter to `SelectionStore`) was explicitly out of scope for this phase and was not performed. Instrumentation was added temporarily and fully removed afterward — `git diff` against the pre-Phase-2 state shows zero changes to source files.

## Method

Identity tags were added to `CanvasRuntime`, `ReactFlowAdapter`, and `SelectionManager` (a `__debugId` field, assigned once per instance from a module-level counter) so that distinct instances could be told apart from re-renders of the same instance. Additional temporary probes captured, for every `bindAdapter()` call and every `setAdapter()` call: a stack trace, the runtime's `__debugId`, the adapter's `__debugId`, a per-callback identity (assigned via a `WeakMap`, since two closures with identical source are still different function references), and the render count of `CanvasViewportInner` at the moment the adapter-binding effect was created versus the moment it actually ran. `ReactFlowAdapter.onSelectionChange()` was instrumented to report both registration and the invocation of its returned unsubscribe function, so that a "cleanup never called" finding would be a direct observation, not an inference. All probes called optional `globalThis` hooks, `undefined` outside of the test harness, making them true no-ops in normal operation. A Playwright harness installed the hooks before app boot and observed a 2.5 second idle window.

## Per-Invocation Record

| # | Caller | Runtime identity | Adapter identity | Callback identity | Render count (created → ran) | Previous listener removed? |
|---|---|---|---|---|---|---|
| 1 | `CanvasRuntime.bindAdapter` ← `CanvasViewport.tsx`'s adapter-binding `useEffect` ← `commitHookEffectListMount` ← `commitPassiveMountOnFiber` | `runtime-2` | `adapter-2` | `cb-1` (new closure) | created at render 2 → ran at render 3 | **No** — zero unregistrations recorded before, during, or after this call |
| 2 | Identical call site to #1 ← `commitHookEffectListMount` ← `invokePassiveEffectMountInDEV` | `runtime-2` (same instance as #1) | `adapter-2` (same instance as #1) | `cb-2` (new closure, different from `cb-1`) | created at render 2 → ran at render 3 | **No** |
| 3 | Identical call site to #1/#2 ← `commitHookEffectListMount` ← `commitPassiveMountOnFiber` | `runtime-2` (same instance) | `adapter-2` (same instance) | `cb-3` (new closure, different from `cb-1` and `cb-2`) | created at render 5 → ran at render 5 | **No** |

`adapter.selectionListeners.size` was observed at exactly `1`, `2`, `3` immediately after registrations #1, #2, #3 respectively, and never decreased. Zero calls to any listener's returned unsubscribe function were recorded at any point in the observation window.

## Interpretation

- **Runtime identity is stable across all three calls.** This is the same `CanvasRuntime` instance every time — runtime recreation is not occurring and is not a contributing factor.
- **Adapter identity is stable across all three calls.** This is the same `ReactFlowAdapter` instance every time — adapter recreation is not occurring and is not a contributing factor.
- **Callback identity is unstable — a new closure is created and registered on every single `setAdapter()` call.** This is because `SelectionManager.setAdapter()` defines its callback inline, with no memoization at the `SelectionManager` level (`setAdapter` itself has no mechanism to reuse a previous callback, since it is not a React hook and has no dependency array). This instability is real, but on its own it would be harmless — a new callback replacing an old one is a normal pattern, provided the old one is removed.
- **The previous listener is never removed, for any of the three invocations.** This is the actual defect. `ReactFlowAdapter.onSelectionChange(callback)` returns an unsubscribe function specifically so a caller can remove its own prior registration before adding a new one, but `SelectionManager.setAdapter()` discards that returned function every time it is called — it is not stored, not called, and not passed anywhere. `CanvasRuntime.unbindAdapter()` (invoked at the start of every `bindAdapter()` call, specifically to clean up before rebinding) disposes the viewport/click/doubleclick/contextmenu listeners it tracks via `disposeList`, but the selection listener registered inside `selection.setAdapter(this.adapter)` was never added to that same `disposeList`, so it has no cleanup path at all — neither on rebind nor on `dispose()`.
- **Calls #1 and #2 both originate from an effect instance created at render 2**, consistent with React StrictMode's documented development-mode behavior of mounting an effect, immediately cleaning it up, and remounting it once, to help surface exactly this class of missing-cleanup bug. **Call #3 originates from a distinct, later effect instance created at render 5** — a genuine additional re-run of the adapter-binding effect, not part of the StrictMode double-invoke pair. This means the "three calls" are two different phenomena layered together: two calls from one legitimate (and intentionally surfaced by React) double-invoke, plus a third call from an independent effect re-run whose own trigger was not investigated further, as it falls outside this phase's explicit scope (tracing why `CanvasViewport`'s adapter effect re-runs a third time belongs to propagation/lifecycle tracing, not to explaining the `setAdapter`/listener-count mechanics asked for here).

## Root Cause Determination

Of the five candidate root causes posed by this investigation:

- ❌ **React StrictMode** — StrictMode is real and does contribute two of the three calls by design, but StrictMode intentionally double-invoking an effect is not itself a defect; it is a diagnostic feature that only *surfaces* a defect that would otherwise be latent. StrictMode is a contributing/amplifying factor, not the root cause.
- ❌ **Runtime recreation** — ruled out. Identity was confirmed stable (`runtime-2`) across all three calls.
- ❌ **Adapter recreation** — ruled out. Identity was confirmed stable (`adapter-2`) across all three calls.
- ⚠️ **Callback identity instability** — confirmed present (three distinct closures registered), but not itself sufficient to explain the defect. Unstable callback identity is only a problem *because* nothing removes the previous one; if cleanup were correct, a new callback replacing an old one on each call would leave `selectionListeners.size` at a constant 1, not growing to 3.
- ✅ **Missing cleanup** — confirmed as the direct, sufficient explanation for why `adapter.selectionListeners.size` grows to 3 and stays there. `SelectionManager.setAdapter()` never captures or invokes the unsubscribe function returned by `adapter.onSelectionChange()`, and `CanvasRuntime.unbindAdapter()` has no corresponding disposal entry for the selection listener the way it does for every other listener type it manages.

**Root cause for this phase's specific question:** Missing cleanup in `SelectionManager.setAdapter()` / `CanvasRuntime.unbindAdapter()`, compounded by (a) StrictMode's intentional double-invoke surfacing it twice in quick succession, and (b) callback identity instability meaning each of the three calls adds a genuinely new listener rather than harmlessly re-adding an already-present one. Runtime recreation and adapter recreation are both ruled out as factors.

## What Phase 2 Does Not Yet Explain

Per this phase's explicit scope boundary, the following remain unaddressed and are reserved for later phases:

- Why call #3's effect re-run happens at all (i.e. why `CanvasViewport`'s `[reactFlow, runtime, adapter]` effect dependency array produces a change at render 5) — this is propagation/lifecycle tracing, not in scope here.
- Whether fixing the missing-cleanup defect alone (so `selectionListeners.size` stays at 1) fully resolves the original ~370 events/sec idle emission rate, or whether React Flow's own internal re-emission behavior (Phase 1's finding) independently continues at some non-zero rate even with exactly one listener registered. This requires re-measurement after a fix is implemented, which is explicitly not part of this investigation.

Per this task's instruction, Phase 2 stops here. No fix has been proposed or implemented.

---

# Phase 3 Findings — Is the Listener Leak Sufficient to Explain the Firehose?

**Status:** Phase 3 complete. A temporary experimental change was applied to `SelectionManager.setAdapter()`, measured, and then fully reverted. `git diff` against the pre-Phase-3 state shows zero changes to source files. No permanent fix was implemented.

## Method

`SelectionManager.setAdapter()` was temporarily modified to capture the unsubscribe function returned by `adapter.onSelectionChange(callback)` in a new private field (`unsubscribeSelectionChange`), and to call that stored function — if one existed from a prior `setAdapter()` call — before registering the new callback. This directly addresses the exact defect confirmed in Phase 2 (missing cleanup) with the smallest possible change, and nothing else in `SelectionManager` or elsewhere was touched.

A second, purely observational probe (identical in kind to the ones used in Phases 1 and 2 — an optional `globalThis` hook, `undefined` outside a test harness) was added to `ReactFlowAdapter.triggerSelectionChange()` to report the emitted payload size and the current `selectionListeners.size` on every call, so listener count and event frequency could be measured directly rather than inferred.

A Playwright harness loaded the app with the experimental fix and probe in place, and measured, in order: (1) listener count during an initial idle window, (2) whether idle emission continued at all, (3) event frequency during that window compared against the Phase 1/2 baseline, (4) whether a real click on an existing node now results in a persistent visual selection, and (5) whether a fresh idle window opened after that click still shows emission with zero further interaction. The measurement was run twice to confirm the results were not run-to-run noise.

## Measurements

| Metric | Before (Phase 1/2 baseline, unmodified code) | After (temporary fix applied) |
|---|---|---|
| `adapter.selectionListeners.size` at steady state | 3 | **1** |
| Idle `selectionChange` events in ~2–2.5s | ~249 (2s window) | ~313–315 (2.5s window) |
| Approximate events/second | ~124.5/s | ~125–126/s |
| Idle emission still occurring at all? | Yes | **Yes — unchanged** |
| Node visually selected 500ms after a real click? | No | **No — unchanged** |
| Fresh idle window after the click still emits with zero interaction? | (not separately re-measured in Phase 1/2) | **Yes — 240–241 events in a fresh 2s window, listener count stayed at 1** |

Two consecutive runs produced consistent results (313 and 315 events in the first idle window; 240 and 241 in the post-click window), confirming the measurement is stable and not dominated by run-to-run timing noise.

## Observations

1. **The fix worked exactly as intended for its own scope.** Listener count stabilized at 1 instead of growing to 3 — confirming Phase 2's root-cause finding (missing cleanup in `setAdapter()`) was correctly diagnosed and the minimal correction resolves that specific defect.
2. **The per-second emission rate is materially unchanged** (~125/s with 1 listener vs. ~124.5/s with 3 listeners in the baseline). This is the key finding: React Flow is calling `onSelectionChange` at essentially the same frequency regardless of how many listeners `ReactFlowAdapter` forwards that call to. The listener-count fix changes how many times each React-Flow-originated call is *relayed* internally (1 relay per call instead of 3), but does not change how often React Flow makes that call in the first place.
3. **Click-selection still does not persist** with the fix applied. A real click on an existing node does not result in a visually persistent selected state 500ms later, identical to the unfixed baseline. This is consistent with observation 2: since idle emissions of `{ nodes: [], edges: [] }` continue at ~125/s regardless of the listener leak, any real selection set by a click continues to be overwritten by the next idle-empty emission within roughly 8ms on average — far too fast for the fix to have any user-visible effect.
4. **React Flow continues to emit `selectionChange` with zero user interaction** even after the fix, confirmed both in the initial idle window and in a second, freshly-idled window captured after the click. The listener leak fix does not reduce this to zero, or even measurably reduce the per-listener rate.

## Conclusion

**The confirmed listener leak (Phase 2's root cause) is a real defect and should still be fixed on its own merits — un-disposed listeners are a memory/correctness issue regardless of this investigation — but it is not sufficient to explain the firehose.** Correcting it changes the listener count from 3 to 1 and proportionally reduces total event *handling* (3 relays per React-Flow call → 1 relay per call), but it does not change the frequency at which `onSelectionChange` is called, does not stop idle emission of empty selections, and does not restore click-selection persistence.

The dominant driver appears to be React Flow's interaction lifecycle. The investigation has narrowed the remaining search space to `CanvasViewport`'s React Flow configuration and React Flow's controlled-selection behavior. The exact trigger has not yet been isolated. The listener leak and the firehose are two separate, independently real defects: fixing the leak is necessary but not sufficient, and any permanent fix strategy must still identify and address the specific configuration or integration point responsible for continuous idle emission — which is the subject of Phase 4.

Decision 014's architecture (SelectionStore as sole owner, Canvas Runtime emitting intent only, CanvasEngineProvider as the sole translation point) remains architecturally correct and is not implicated by this or any prior phase's findings. The defect under investigation is confined to the React Flow integration layer, not to the selection-ownership architecture Decision 014 established.

Per this task's instruction, Phase 3 stops here. No permanent fix has been proposed or implemented, and all temporary changes have been reverted — `git status` confirms no source files remain modified.

---

# Phase 4 Findings — Isolating the Exact Trigger

**Status:** Phase 4 complete. The exact configuration/integration point responsible for continuous idle `selectionChange` emission has been isolated. All temporary instrumentation and experimental changes have been reverted — `git diff` against the pre-Phase-4 state shows zero changes to source files. No permanent fix has been implemented and no architecture has been changed.

## Method

Working only inside `CanvasViewport.tsx` and its `<ReactFlow>` configuration (per this phase's scope), a single reusable measurement harness was built: a temporary `globalThis.__firehoseP4` hook installed on `ReactFlowAdapter.triggerSelectionChange()` (measurement only, no behavior change), read by a Playwright script that loads the app, waits 2.5 seconds with zero interaction, counts emitted `selectionChange` events, and additionally checks whether a real click on an existing node results in a persistent visual selection. Each experiment isolated exactly one variable, was measured, and was fully reverted before the next experiment began — no two experimental changes were combined. `npm run build` was confirmed passing after every change.

## Experiments

| # | What was tested | Temporary change made | Idle frequency | Click-selection worked | Conclusion |
|---|---|---|---|---|---|
| 0 | Baseline (measurement probe only, no behavioral change) | Added `__firehoseP4` hook to `triggerSelectionChange` | ~125.6/s | No | Confirms measurement harness reproduces the same rate established in Phases 1–3. |
| 1 | `panOnDrag` | Set `panOnDrag={false}` | ~125.2/s | No | No effect. `panOnDrag` ruled out. |
| 2 | `fitView` | Removed the `fitView` prop entirely | ~122.8/s | No | No effect. `fitView` ruled out. |
| 3 | `onNodesChange` presence | Removed the `onNodesChange` prop entirely (nodes become uncontrolled w.r.t. change reporting) | ~1.2/s | No | Large effect — but see Experiment 4 before concluding *why*. |
| 4 | `onNodesChange` identity vs. behavior | Replaced the real handler with an inline no-op (`() => {}`), keeping the prop present | ~1.2/s | No | Rate stayed low. Rules out "any handler present" as sufficient — the *specific behavior* of the real handler matters, not merely whether the prop exists. |
| 5 | Restore real `onNodesChange` | Reverted to the original handler (calls `applyNodeChanges` + `setNodes`) | ~123.2/s | No | Confirms the real handler's behavior — not its mere presence — is what drives the high rate. Reproduced the baseline exactly. |
| 6 | Redundant `selectionStore` writes | Added a guard in `CanvasEngineProvider` to skip `selectNode`/`setSelectedEdgeId` when the incoming value already matches current state | ~138.0/s (no reduction) | No | Ruled out: the firehose is not caused by `selectionStore` writes triggering re-renders that feed back into React Flow. This also rules out a `CanvasEngineProvider`-context-driven render loop as the mechanism. |
| 7 | `setNodes` call inside the real `onNodesChange` body | Disabled only the `setNodes(updatedNodes)` call at the end of the real handler, keeping `applyNodeChanges` and everything else identical | ~1.2/s | No | Large effect — directly implicates the `journeyStore` write inside `onNodesChange`, not the handler's other logic. |
| 8 | Change-type-specific write | Instrumented `onNodesChange` to record every invocation's change types, then added a guard to skip `setNodes` only when every change in a given call is `type: "dimensions"` | ~1.2/s (from ~123/s) — fully reproduced twice | No (unchanged) | **Isolated the exact trigger.** See below. |

## Key Intermediate Discovery

Experiment 7 revealed something Phase 1–3 had not yet established: **`onNodesChange` is invoked continuously during the "idle" window, with zero user interaction.** This contradicted the working assumption (reasonable but incorrect) that a handler only reachable via `NodeChange` events would be silent absent a gesture. Direct tracing (a temporary probe recording every invocation's `changes.map(c => c.type)`) confirmed: **248 invocations in 2 seconds, every single one carrying only `{ type: "dimensions" }` entries** (two per call, one per node) — never `position`, never `select`, never any interaction-driven change type.

This is React Flow's own internal dimension/resize measurement (consistent with a `ResizeObserver`-backed mechanism recomputing node bounding boxes) firing repeatedly and reporting each measurement as a `NodeChange` through the controlled `onNodesChange` prop, entirely independent of user interaction.

## The Isolated Trigger

The codebase's `onNodesChange` handler (`CanvasViewport.tsx`) calls `setNodes(updatedNodes)` **unconditionally on every invocation**, regardless of what kind of change was reported. Because React Flow reports `dimensions`-only changes continuously on an idle canvas, this handler writes to `journeyStore` continuously, which:

1. Produces a new `nodes` array reference in `journeyStore` on every `dimensions` report.
2. Recomputes `rfNodes` (`useMemo` keyed on `[nodes, selectedNodeId]`) with a new array reference.
3. Passes that new array into `<ReactFlow nodes={rfNodes} />` as a controlled prop.
4. React Flow's internal reconciliation against the newly-received controlled `nodes` prop re-derives and re-reports selection state, firing `onSelectionChange` again — even though nothing about the actual selection changed.
5. This closes a self-sustaining cycle: `dimensions` change → `setNodes` → new `rfNodes` → React Flow reconciles → `onSelectionChange` fires → (separately) `dimensions` continues to be reported → cycle continues indefinitely with no further user input required.

Guarding the `setNodes` call to skip execution when every incoming change is `dimensions`-only (Experiment 8) reduced idle emission from ~123/s to ~1.2/s — a return to a quiet baseline, fully reproduced across two independent runs. This is the first and only single change identified across this investigation that resolves the idle emission rate to near-zero without removing legitimate functionality (position/selection changes still flow through normally; only redundant `dimensions`-only writes are skipped).

## Why Click-Selection Still Did Not Persist in This Test

Experiment 8 resolved the idle emission rate but did not restore click-selection persistence in this test run. This is expected and does not weaken the finding: Phase 2 separately confirmed a listener-leak defect (`adapter.selectionListeners` growing to 3 due to missing cleanup in `SelectionManager.setAdapter()`), which was deliberately left unfixed during this phase (per scope — Phase 4 investigates the React Flow integration layer only, not the listener lifecycle addressed in Phase 2/3). With three stacked listeners still relaying every real event three times, and no cleanup fix applied in this phase's experiments, click-selection persistence cannot be conclusively evaluated in isolation from that separate, already-diagnosed defect. Resolving both the dimensions-only write and the listener leak together — not evaluated in combination in this investigation — would be required before drawing a conclusion about end-to-end click-selection behavior.

## Conclusion

The exact trigger has been isolated: **the `onNodesChange` handler in `CanvasViewport.tsx` writes to `journeyStore` on every reported change, including React Flow's continuous, interaction-independent `dimensions`-only change reports, and this write feeds a new controlled `nodes` prop back into `<ReactFlow>` that causes it to re-derive and re-emit selection state.** This is a distinct, independently-confirmed defect from the listener leak (Phase 2/3) — the two compound but are not the same root cause. `panOnDrag`, `fitView`, `selectionStore` write redundancy, and mere `onNodesChange` prop presence were all tested and ruled out as the trigger; only the specific behavior of writing to `journeyStore` in response to `dimensions`-only changes reproduced and then resolved the firehose.

No permanent fix has been implemented. No architecture has been changed. All temporary instrumentation and experimental modifications have been removed — `git diff` and `git status` confirm zero remaining source changes, and `npm run build` / `npx oxlint` both pass clean.

Per this task's instruction, Phase 4 stops here.
