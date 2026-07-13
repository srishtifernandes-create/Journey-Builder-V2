Decision 001

Journey JSON is the single source of truth.

Decision 002

React Flow is the mandatory canvas engine.

## Decision 003

**Title**

Feature-first architecture is the permanent project structure.

**Reason**

Business capabilities are organized into independent feature modules.

Shared code remains generic and reusable.

This minimizes coupling and allows future features to evolve independently.

**Date**

13 July 2026
## Decision 004

**Title**

Zustand is the global application state manager.

**Reason**

Application state must remain lightweight, modular and independent from React component trees.

Zustand provides a predictable state layer without unnecessary boilerplate.

Future business state should extend existing stores rather than introducing additional state libraries.

**Date**

13 July 2026

## Decision 005

**Title**

Production architecture precedes feature implementation.

**Reason**

The project must establish stable architecture before implementing business functionality.

Every sprint builds upon permanent infrastructure rather than temporary prototypes.

This minimizes rewrites and ensures long-term maintainability.

**Date**

13 July 2026


## Decision 006

**Title**

Canvas Runtime is the permanent interaction layer.

**Reason**

All canvas interactions must pass through the Canvas Runtime.

Features must never manipulate the underlying graph library directly.

This creates a stable abstraction layer and allows future changes to the rendering engine without affecting feature modules.

**Date**

13 July 2026

---

## Decision 007

**Title**

React Flow is accessed only through the ReactFlow Adapter.

**Reason**

React Flow is considered an implementation detail.

Only the adapter layer may communicate directly with the library.

This prevents feature modules from depending on third-party APIs and makes future upgrades or replacements significantly easier.

**Date**

13 July 2026

---

## Decision 008

**Title**

Canvas managers communicate exclusively through CanvasEvents.

**Reason**

Canvas managers remain independent and loosely coupled.

No manager should directly invoke another manager's internal methods.

All runtime communication must occur through the CanvasEvents event bus.

This improves modularity, testability and future extensibility.

**Date**

13 July 2026

## Decision 009

Node lifecycle is contract-first.

Lifecycle hooks exist as interfaces before implementation.

Business logic is introduced in later sprints without changing the lifecycle API.

## Decision 010

RendererRegistry registers RendererDefinitions rather than React components.

Rendering behavior is metadata-driven.

## Decision 011

Port creation is delegated to PortFactory.

NodeFactory never constructs ports directly.

## Decision 012

> **Superseded by Decision 014**

**Title**

JourneyStore owns node visual selection.

**Reason**

This decision reflected the initial selection architecture introduced during Sprint 05.

During Sprint 06 verification, it was discovered that coupling node selection to JourneyStore created a bidirectional synchronization loop between JourneyStore and React Flow, resulting in unstable controlled selection behaviour.

This decision remains in the log for historical context only.

**Date**

14 July 2026

## Decision 013

Title

ICanvasAdapter exposes coordinate transformation.

Reason

Coordinate conversion is considered part of the graph engine abstraction.

Canvas Runtime must not depend directly on React Flow APIs.

Future graph engines must implement the same adapter contract.

Date

14 July 2026

## Decision 014

### Title

SelectionStore is the single source of truth for canvas selection.

### Reason

Selection is interaction state rather than document state.

JourneyStore owns the graph model, while SelectionStore owns which nodes or edges are currently selected.

React Flow is treated as a rendering engine and interaction source only.

Canvas Runtime (specifically SelectionManager) orchestrates selection by emitting
selection intent through CanvasEvents. It never imports or writes to SelectionStore
directly — Canvas Runtime remains fully independent of Zustand.

CanvasEngineProvider is the single translation point that turns emitted selection
intent into a SelectionStore write. This preserves the Sprint 03 boundary between
the framework-agnostic Canvas Runtime and the application's state layer.

CanvasViewport renders selection by consuming the runtime/context layer
(CanvasEngineProvider's context value), not by importing SelectionStore or
JourneyStore for selection purposes.

This removes dual ownership of selection state, prevents synchronization loops, and
provides a scalable foundation for future features such as multi-selection, keyboard
shortcuts, copy/paste, undo/redo, inspector synchronization and collaborative editing.

### Event Flow

```
User Gesture
    ↓
React Flow
    ↓
SelectionManager        (emits intent — no store import, ever)
    ↓
CanvasEvents            (selectionChange event)
    ↓
CanvasEngineProvider    (the ONLY file that writes to SelectionStore)
    ↓
SelectionStore
    ↓
Canvas Context          (CanvasEngineProvider's context value: { runtime, selectedNodeId })
    ↓
CanvasViewport          (reads selectedNodeId from context, never from a store import)
    ↓
React Flow `selected` props
```

Programmatic selection (e.g. a newly created node) enters this same pipeline at the
SelectionManager step — NodeCreationService's selectNode dependency calls
`runtime.selection.selectNode(nodeId)`, which emits the same CanvasEvents event a
canvas gesture would produce. There is exactly one pipeline, regardless of origin.

### Invariants

- JourneyStore never stores node selection.
- SelectionStore is the only owner of selection state.
- React Flow emits interaction events but never owns application selection.
- Canvas Runtime orchestrates selection intent but never imports or writes to
  SelectionStore — it remains independent of Zustand.
- CanvasEngineProvider is the single translation point between Canvas Runtime events
  and SelectionStore writes.
- CanvasViewport consumes selection through the runtime/context layer, never through
  a direct SelectionStore or JourneyStore import.
- Every selection update, regardless of origin (canvas click, lasso, programmatic
  creation, future keyboard shortcuts), passes through this single pipeline.
- `INode.uiState.status`'s `'selected'` value is deprecated but temporarily retained
  for migration safety (see NODE_MODEL.md). No code writes it. Removal is scheduled
  for a future sprint once all consumers are confirmed migrated.

### Date

14 July 2026

## Decision 015

### Title

Selection Firehose Investigation Deferred

### Reason

During verification of Decision 014, a pre-existing runtime defect was discovered:
React Flow continuously emits empty selectionChange events even when the canvas is
idle, with no user interaction taking place.

This defect was confirmed to reproduce on the untouched Sprint 06 baseline (verified
by temporarily reverting Decision 014's changes and re-testing). It is therefore not
caused by, and is not a consequence of, Decision 014.

Decision 014 remains complete and correct. SelectionStore is the single source of
truth for selection state, Canvas Runtime emits intent only, and CanvasEngineProvider
is the sole translation point into application state, exactly as specified.

No workaround, guard, or duplicated state will be introduced to mask this defect.
Masking a runtime-level event-emission bug with application-level guards would
reintroduce the same class of architectural risk Decision 014 was written to
eliminate — a second, informal source of truth papering over the real defect.

The issue will be investigated separately, under its own dedicated bug
investigation document, to preserve the architectural integrity established by
Decision 014.

### Invariants

- Decision 014's architecture is not modified, reverted, or worked around as a
  result of this defect.
- No selection-related guard, debounce, or synchronization logic is added outside
  the pipeline Decision 014 already defines.
- The defect is tracked and investigated as BUGFIX_001_SELECTION_FIREHOSE,
  independent of any sprint's feature scope.
- Sprint 07 remains blocked until the defect is resolved and node selection is
  confirmed functioning correctly end-to-end.

### Date

14 July 2026