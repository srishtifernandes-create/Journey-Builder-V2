# Sprint 05 — Node Palette & Node Creation

> **Project:** Journey Builder V2
>
> **Sprint:** 05
>
> **Status:** Ready for Implementation
>
> **Depends On:**
>
> - Sprint 01 — Application Foundation
> - Sprint 02 — Workspace Shell
> - Sprint 03 — Canvas Runtime
> - Sprint 04 — Node Foundation

---

# Objective

Implement the first user-facing feature of Journey Builder.

This sprint introduces the **Node Palette** and establishes the complete node creation pipeline from the palette to the canvas.

The application should allow users to browse available node types, search for them, and create node instances by dragging or clicking.

No workflow execution, validation, properties editing, or edge connections are implemented during this sprint.

---

# User Story

As a Journey Builder user,

I want to browse available node types,

so that I can begin assembling onboarding journeys visually.

---

# Problem Statement

Sprint 04 established the architectural foundation for nodes:

- Registry
- Factory
- Renderer Registry
- Serialization
- Lifecycle Contracts

However, there is currently no mechanism for users to create node instances.

Sprint 05 activates this architecture.

Every visible node must originate from the registry and flow through the approved creation pipeline.

---

# Scope

## Included

- Left node palette
- Category grouping
- Palette search
- Registry-driven metadata
- Drag-to-create
- Click-to-create
- Canvas drop handling
- NodeFactory integration
- RendererRegistry rendering
- Automatic node selection
- Empty canvas support

---

## Explicitly Excluded

- Node properties
- Validation
- Connections
- Rule Engine
- Templates
- Undo / Redo
- Copy / Paste
- Context Menus
- Auto Layout
- Business logic
- Publish flow

---

# Functional Flow

```
Application

↓

Workspace

↓

Palette

↓

Search / Browse

↓

Drag Node

↓

Canvas Runtime

↓

NodeFactory

↓

Node Registry

↓

Journey Store

↓

Renderer Registry

↓

Canvas

↓

Selection Store
```

---

# Architecture Requirements

The approved creation pipeline is:

```
Palette

↓

Canvas Runtime

↓

NodeCreationService

↓

NodeFactory

↓

NodeRegistry

↓

JourneyStore

↓

RendererRegistry

↓

CanvasViewport
```

No component may bypass this pipeline.

---

# Deliverables

## 1. Node Palette

Create a permanent left-side node palette.

The palette should support:

- scrolling
- categories
- search
- draggable cards
- click-to-create

No business logic may exist inside the palette.

---

## 2. Registry-driven Categories

The palette must never hardcode node information.

Instead:

```
NodeRegistry

↓

getCategories()

↓

getNodes(category)

↓

render
```

Future node types should automatically appear once registered.

---

## 3. Search

Search must filter by:

- display name
- keywords
- category

Simple filtering only.

No fuzzy search.

---

## 4. Node Cards

Each node card displays:

- icon
- display name
- category
- short description

Every value must come from metadata.

---

## 5. Drag Source

Dragging a node card should expose only:

```
nodeType
```

No serialized node instance.

No configuration.

No React Flow objects.

---

## 6. Drop Target

The canvas accepts drops.

The runtime converts browser coordinates into canvas coordinates.

Creation flow:

```
Drop

↓

Canvas Runtime

↓

NodeCreationService

↓

NodeFactory.create()

↓

JourneyStore.addNode()

↓

SelectionStore.select()

↓

Canvas rerender
```

---

## 7. Click-to-create

Clicking a node card creates a node in the center of the current viewport.

Click creation must reuse the exact same creation pipeline as drag.

---

## 8. Node Creation Service

Introduce a dedicated NodeCreationService.

Responsibilities:

- translate coordinates
- invoke factory
- add node to journey
- update selection
- notify runtime

It should become the single entry point for node creation.

---

## 9. Metadata-driven UI

All palette UI should derive from NodeMetadata.

The UI must never switch on node type.

Forbidden:

```ts
if (node.type === "screen")
```

Required:

```ts
NodeRegistry.getMetadata(type)
```

---

# Folder Structure

```
src/

features/

palette/

components/

NodePalette.tsx

NodeCategory.tsx

NodeCard.tsx

PaletteSearch.tsx

hooks/

usePalette.ts

services/

NodeCreationService.ts

utils/
```

---

# Files to Modify

```
src/features/workspace/components/WorkspaceNavigation.tsx

src/features/workspace/components/WorkspaceCanvas.tsx

src/features/canvas/components/CanvasViewport.tsx

src/features/canvas/runtime/CanvasRuntime.ts

src/app/store/journeyStore.ts

src/app/store/selectionStore.ts
```

---

# Acceptance Criteria

Application boots successfully.

Palette renders.

Categories render.

Search filters correctly.

Dragging creates a node.

Clicking creates a node.

Created node originates from NodeFactory.

RendererRegistry renders the node.

Selection updates automatically.

No console errors.

Build passes.

Lint passes.

---

# Engineering Constraints

Node creation must never:

- instantiate INode directly
- bypass NodeFactory
- bypass NodeRegistry
- bypass RendererRegistry
- import React Flow into palette components
- hardcode node metadata
- mutate stores directly from UI components

---

# Verification

## Automated

Run:

```
npm run build

npx oxlint
```

Expected:

- zero build errors
- zero lint warnings

---

## Manual

Verify:

- application loads
- palette visible
- categories visible
- search works
- drag Screen node
- node appears
- click OCR node
- node appears
- selection updates
- refresh browser
- application still loads
- no console errors

---

# Deliverables

- Registry-driven node palette
- Search
- Categories
- Drag-and-drop creation
- Click creation
- NodeCreationService
- Updated canvas runtime
- Updated journey store
- Updated selection store
- Verification screenshots
- Verification report
- Implementation summary

---

# Non-Negotiables

Future node types must require only registration.

The palette must never require modification when new node types are added.

UI components must remain presentation-only.

Node creation must always pass through the approved architecture.

This sprint establishes the permanent node creation pipeline for the Journey Builder platform.

Future sprints (properties, validation, publishing, templates, execution) build on this pipeline without restructuring it.
