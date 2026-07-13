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

## Decision 012

Title

JourneyStore owns node visual selection.

Reason

Node visual state is part of the graph model.

SelectionStore represents interaction state and mirrors the currently selected node.

Rendering must derive from JourneyStore to avoid multiple sources of truth.

Date
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