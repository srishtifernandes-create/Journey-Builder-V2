# PROJECT_STRUCTURE.md

> **Project:** Journey Builder V2
>
> **Status:** Source of Truth

This document defines ownership of every top-level directory in the repository.

Future contributors and AI assistants must preserve these ownership boundaries.

---

# Repository Structure

```
src/
├── app/
├── config/
├── core/
├── features/
├── shared/
├── types/
├── assets/
```

---

# Directory Ownership

## app/

Owns application bootstrapping only.

Responsibilities:

- App entry point
- Routing
- Global providers
- Global layouts
- Zustand stores
- Error boundaries

Must never contain business features.

---

## features/

Owns all product functionality.

Every feature is isolated from every other feature.

Current feature modules:

- workspace/
- canvas/
- nodes/

Future modules:

- properties/
- validation/
- templates/
- publishing/

No feature should directly depend on another feature unless explicitly documented.

---

## features/canvas/

Owns the canvas runtime.

Responsibilities:

- CanvasRuntime
- ViewportManager
- CanvasEvents
- InteractionManager
- SelectionManager
- KeyboardManager
- React Flow integration

The canvas runtime is considered stable architecture.

---

## features/workspace/

Owns the editor shell.

Responsibilities:

- Header
- Navigation
- Workspace layout
- Inspector container
- Canvas container

No business logic belongs here.

---

## features/nodes/

Owns the node platform.

Responsibilities:

- Node contracts
- Registry
- Factory
- Renderer registry
- Serialization
- Lifecycle contracts

Business nodes extend this platform.

---

## shared/

Reusable code shared across multiple features.

Examples:

- UI components
- Hooks
- Utilities
- Constants
- Shared types

No feature-specific logic belongs here.

---

## core/

Cross-feature infrastructure.

Contains foundational utilities that are not tied to a single feature.

---

## config/

Global configuration.

Examples:

- Layout constants
- Theme constants
- Environment configuration

Configuration only.

No runtime logic.

---

## types/

Global application-wide contracts.

Feature-specific types belong inside their respective feature folders.

---

## assets/

Static resources.

Fonts

Icons

Images

Brand assets

---

# Architectural Boundaries

The following systems are considered stable architecture:

- Application Foundation (Sprint 01)
- Workspace Shell (Sprint 02)
- Canvas Runtime (Sprint 03)
- Node Platform (Sprint 04)

Future sprints must extend these systems rather than restructure them.

Architecture changes require a documented Architecture Decision Record (ADR) before implementation.

## Selection Ownership

### JourneyStore

Owns:

- nodes
- edges
- graph structure
- node configuration
- document data

Does NOT own:

- canvas selection
- hover state
- transient interaction state

---

### SelectionStore

Owns:

- selected node ids
- selected edge ids
- future multi-selection state

Does NOT own:

- graph structure
- node configuration
- renderer metadata

---

### Canvas Runtime

Owns:

- interaction orchestration
- event translation
- runtime communication

Does NOT own:

- business data
- document persistence

---

### React Flow

Owns:

- rendering
- gesture detection
- viewport interaction

Does NOT own:

- application state
- selection state
- business logic