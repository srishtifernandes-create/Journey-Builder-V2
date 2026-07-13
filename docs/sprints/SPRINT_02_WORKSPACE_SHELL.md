# Sprint 02 — Workspace Shell

Project: Journey Builder V2

Status:
Sprint Specification

---

# Goal

Construct the complete application workspace that will host the Journey Builder.

Sprint 02 intentionally does NOT implement any business logic.

No node creation.

No edge creation.

No drag & drop.

No JSON generation.

No validation.

The objective is to build the permanent application layout that all future sprints will use.

---

# User Story

As a Journey Builder user,

I should see the complete editor workspace,

so that future functionality can be added without restructuring the application.

---

# Scope

## In Scope

Create the permanent editor shell.

Application header

Left navigation

Canvas viewport

Right properties panel

Resizable panel layout

Responsive behavior

Keyboard focus management

Loading placeholders

Empty canvas state

Workspace providers

React Flow viewport mounted

---

## Out of Scope

Nodes

Edges

Drag

Selection

Zoom controls

Mini map

Toolbar actions

Properties logic

Node configuration

Validation

Undo

Redo

Autosave

JSON

Templates

Business rules

---

# Workspace Layout

The application should resemble professional workflow tools.

+--------------------------------------------------------------+
| Header |
+-----------+------------------------------+-------------------+
| | | |
| Left | Canvas Viewport | Right Panel |
| Navigation | (React Flow) | Properties |
| | | |
| | | |
+-----------+------------------------------+-------------------+

The layout should remain fixed.

Only the center canvas changes.

---

# Header

Contains:

Application name

Journey name placeholder

Environment badge

Future toolbar slot

Future publish slot

No working buttons.

Visual only.

---

# Left Navigation

Visual shell only.

Collapsed width.

Future icons only.

Canvas

Templates

Assets

Validation

History

Settings

No navigation behavior.

---

# Canvas Viewport

Mount React Flow.

No nodes.

No edges.

Disable all interaction.

Background grid enabled.

FitView enabled.

Empty state illustration centered.

React Flow must own the canvas area.

---

# Right Panel

Properties panel shell.

Contains:

Panel title

Scrollable container

Placeholder skeleton

No editable fields.

---

# Resizable Panels

User should be able to resize

Canvas

Right Panel

using splitter.

Left navigation remains fixed.

Use a production-ready panel library.

---

# Empty State

Display:

Journey Builder

Start by adding your first screen.

Node creation becomes available in Sprint 04.

CTA should not perform any action.

---

# Theme

Apply Design_System.md.

Spacing

Typography

Colors

Elevation

Border radius

Hover

Focus

Scrollbars

No custom visual experimentation.

Must match Figma references.

---

# Accessibility

Visible keyboard focus

Semantic landmarks

Proper heading hierarchy

Scrollable regions

Resizable panel keyboard accessible

Contrast AA minimum

---

# State

No business state.

Only UI state.

Examples:

Left navigation collapsed

Right panel width

Workspace loading

Theme

Nothing else.

---

# Folder Additions

src/features/workspace/

components/

Workspace.tsx

WorkspaceHeader.tsx

WorkspaceNavigation.tsx

WorkspaceCanvas.tsx

WorkspaceProperties.tsx

hooks/

types/

styles/

---

# Acceptance Criteria

✓ Header rendered

✓ Left navigation rendered

✓ React Flow mounted

✓ Empty state visible

✓ Right panel rendered

✓ Panels resizable

✓ Responsive

✓ No TypeScript errors

✓ No lint errors

✓ npm build passes

✓ React Flow mounted successfully

✓ No business logic introduced

---

# Deliverables

Updated workspace

Updated routing

Workspace feature module

React Flow integration

Verification screenshots

Verification report

Implementation summary
