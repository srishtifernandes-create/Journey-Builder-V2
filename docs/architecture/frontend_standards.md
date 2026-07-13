# FRONTEND_STANDARDS.md

> **Project:** Journey Builder V2
> **Status:** Source of Truth
> **Applies To:** Every React component, hook, page, feature and AI-generated implementation.
>
> If this document conflicts with an implementation prompt, this document wins unless explicitly overridden by PROJECT_ARCHITECTURE.md.

---

# 1. Purpose

Journey Builder is a production-quality frontend application.

It is **not**:

- an HTML prototype
- a design playground
- a collection of demo screens
- an AI experiment

The codebase should be written as if it will be maintained by multiple frontend engineers over several years.

Every implementation must prioritize:

- Maintainability
- Readability
- Predictability
- Scalability
- Performance
- Type Safety

---

# 2. Technology Stack

Mandatory.

- React
- TypeScript
- Vite
- React Router
- React Flow (@xyflow/react)
- Zustand
- React Hook Form
- Zod
- TailwindCSS
- Lucide React
- clsx

No alternative libraries should be introduced unless explicitly approved.

---

# 3. Source of Truth

The application has only ONE source of truth.

Journey JSON.

The UI renders JSON.

The UI never becomes the source of business logic.

Never derive application state from rendered components.

---

# 4. Architecture Principles

The application follows Feature First Architecture.

Example

src/

app/

features/

shared/

providers/

router/

store/

types/

utils/

assets/

---

# 5. Feature Modules

Each feature owns its own files.

Example

features/

canvas/

components/

hooks/

types/

utils/

store/

services/

Feature folders should never depend directly on another feature's internal files.

Cross-feature communication must happen through shared types or the global store.

---

# 6. Component Principles

Each component has one responsibility.

Components should remain small.

Recommended size

150–200 lines

Maximum

250 lines

If exceeded

Extract:

- hooks
- helpers
- utilities
- child components

---

# 7. Component Classification

Every component must belong to one category.

Presentational

Receives props.

Contains no business logic.

Container

Coordinates data.

Calls hooks.

Layout

Responsible only for structure.

Feature Component

Specific to one feature.

Shared Component

Reusable across multiple features.

---

# 8. State Management

Global state uses Zustand.

State should be divided into domains.

Example

UI Store

Journey Store

Canvas Store

Selection Store

Validation Store

History Store

Never duplicate state.

Never keep the same value in two stores.

---

# 9. Local State

useState only for UI state.

Examples

Modal open

Hovered item

Input focus

Temporary text

Business state never belongs in local component state.

---

# 10. Business Logic

Business logic never lives inside JSX.

Extract logic into

hooks/

services/

utils/

Components should describe UI.

Hooks should describe behaviour.

---

# 11. Custom Hooks

Use hooks whenever

logic exceeds one component

or

logic exceeds ~30 lines.

Examples

useCanvas()

useJourney()

useValidation()

useSelection()

---

# 12. Routing

React Router owns navigation.

Routes live in

router/

Pages remain lightweight.

Pages compose layouts and features.

---

# 13. Folder Ownership

Only feature folders own feature code.

Example

features/canvas

owns

Canvas.tsx

CanvasToolbar.tsx

CanvasStore.ts

CanvasHooks.ts

No unrelated folders may modify feature internals.

---

# 14. TypeScript

Strict mode.

Never use any.

Prefer interfaces.

Use explicit types.

Shared interfaces belong in

/types

Feature-specific interfaces belong inside the feature.

---

# 15. Styling

Tailwind only.

No inline styles.

No CSS frameworks.

Component variants should use clsx.

Spacing follows Design_System.md.

Never invent spacing values.

---

# 16. Icons

Lucide only.

Do not introduce additional icon libraries.

---

# 17. React Flow

React Flow owns:

Canvas

Dragging

Selection

Zoom

Pan

Connections

MiniMap

Handles

Never recreate these behaviours manually.

---

# 18. JSON

Journey JSON is canonical.

Everything must serialize back into JSON.

Every node.

Every edge.

Every property.

Every rule.

If something cannot be serialized

it is implemented incorrectly.

---

# 19. Validation

Validation belongs to Validation Engine.

Never scatter validation across components.

Components display validation.

They do not calculate validation.

---

# 20. Mock Data

Phase 1 uses mock data.

Mock data lives only inside

/mock

Never embed fake objects inside components.

---

# 21. Performance

Memoize expensive components.

Memoize nodes.

Avoid unnecessary rerenders.

Lazy load routes.

Avoid deeply nested renders.

---

# 22. Error Handling

Never silently fail.

Show meaningful errors.

Wrap application in Error Boundary.

Guard against undefined state.

---

# 23. Accessibility

Keyboard accessible.

Visible focus states.

Semantic HTML.

ARIA only where required.

Never sacrifice accessibility for visual fidelity.

---

# 24. Naming

Components

PascalCase

Hooks

camelCase starting with use

Stores

camelCase ending in Store

Types

PascalCase

Constants

UPPER_SNAKE_CASE

---

# 25. Imports

Order

React

Third Party

Shared

Feature

Relative

Avoid long relative chains.

Prefer aliases when configured.

---

# 26. AI Implementation Rules

AI must never:

Invent node types.

Invent business rules.

Invent APIs.

Invent validation.

Invent permissions.

Invent workflows.

Invent UI not present in Figma.

If documentation is missing

STOP.

Do not guess.

---

# 27. Documentation Hierarchy

When making decisions consult

1 PROJECT_ARCHITECTURE.md

2 PRODUCT_SCOPE.md

3 FRONTEND_STANDARDS.md

4 Design_System.md

5 business_rules.md

6 existing_patterns.md

7 Canvas_Component_Inventory.md

8 HTML Specifications

9 Figma

This order is mandatory.

---

# 28. Definition of Done

A feature is complete only if

✓ Builds successfully

✓ Types compile

✓ No console errors

✓ No warnings

✓ Responsive

✓ Uses Design System

✓ Uses documented architecture

✓ State is typed

✓ JSON serialization works (where applicable)

✓ No duplicated logic

✓ No hardcoded business rules

---

# 29. Git

One feature.

One commit.

One responsibility.

Commit messages should follow

feat:

fix:

refactor:

docs:

chore:

---

# 30. Non-Negotiables

Never rewrite architecture without instruction.

Never replace React Flow.

Never bypass Zustand.

Never duplicate business logic.

Never generate placeholder features.

Never generate demo data unless requested.

Never violate documentation.

When uncertain

STOP

and ask.

No component should exceed approximately 250 lines of implementation code. If a component grows beyond that, extract child components or hooks

Import ordering rule.

Maximum component size (~250 lines).

Every manager/provider must expose a dispose() lifecycle method.

Layout constants belong in config/layout.ts.

### Selection Architecture

Selection is interaction state.

Document state and interaction state must never exist in the same store.

SelectionStore is the only source of truth for node selection.

JourneyStore must never own selection state again.

Canvas Runtime emits intent only. It never imports or writes to a Zustand store.

CanvasEngineProvider is the only bridge between runtime events and application stores.

React Flow is an interaction source only.

Presentation components must never synchronize selection between stores.

Runtime bugs must be fixed at their source rather than introducing duplicated state or synchronization workarounds.

### Business Logic Separation

Business logic must never live inside React components.

Responsibilities are divided as follows:

- Components render UI.
- Hooks coordinate UI behaviour.
- Runtime managers execute canvas interactions.
- Zustand stores persist application state.
- Utility modules contain pure functions.

Components should remain declarative and presentation-focused.

### Architecture Freeze

Canvas Runtime

Workspace Shell

Node Platform

are considered stable architecture.

Future sprints must extend these systems.

They must not restructure them unless an Architecture Decision Record explicitly approves the change.

