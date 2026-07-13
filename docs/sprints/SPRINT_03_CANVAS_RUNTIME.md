# Sprint 03 — Canvas Runtime

Sprint ID: JB-S03

Status:
Ready for implementation

---

# Goal

Implement the Canvas Runtime.

The runtime owns interaction.

The runtime does not own business logic.

---

# Purpose

Create the permanent runtime responsible for canvas behaviour.

The runtime should remain stable for the lifetime of the application.

Future sprints should extend it instead of replacing it.

---

# In Scope

React Flow runtime

Viewport management

Pan

Zoom

Fit View

Reset View

Background grid

Canvas event pipeline

Keyboard shortcut infrastructure

Interaction modes

Selection infrastructure

CanvasProvider integration

CanvasBoundary integration

---

# Out of Scope

Nodes

Edges

Node rendering

Properties

Rules

Validation

Undo

Redo

Templates

Journey JSON

Business logic

---

# Interaction Modes

Prepare infrastructure for:

Select

Pan

Connect

Disabled

Only Select mode should be active.

Others remain placeholders.

---

# Viewport

Support

Pan

Zoom

Fit View

Reset View

Current viewport retrieval

Viewport change events

---

# Keyboard

Register infrastructure only.

Future shortcuts include:

Delete

Escape

Space

Ctrl + Z

Ctrl + Shift + Z

Ctrl + C

Ctrl + V

Do not implement actions.

Only event registration.

---

# Event Pipeline

Prepare event architecture for

Canvas Click

Canvas Double Click

Viewport Change

Selection Change

Context Menu

Drop

Wheel

No business actions.

Only event propagation.

---

# Grid

Dot grid

Toggle infrastructure

Snap infrastructure

Snap disabled.

---

# Selection

Empty canvas selection

Future node selection

Selection events

No node selection yet.

---

# Folder Additions

features/canvas/

runtime/

CanvasRuntime.ts

CanvasEvents.ts

ViewportManager.ts

InteractionManager.ts

KeyboardManager.ts

SelectionManager.ts

hooks/

useCanvasRuntime.ts

useViewport.ts

types/

CanvasRuntime.ts

Viewport.ts

InteractionMode.ts

---

# Acceptance Criteria

✓ Infinite pan

✓ Zoom

✓ Fit View

✓ Reset View

✓ Dot grid

✓ Event infrastructure

✓ Keyboard infrastructure

✓ Canvas runtime isolated

✓ No business logic

✓ No nodes

✓ No edges

✓ No JSON

✓ Build passes

✓ Lint passes
