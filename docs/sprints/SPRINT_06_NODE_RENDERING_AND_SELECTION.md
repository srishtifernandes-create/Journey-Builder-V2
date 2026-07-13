# Sprint 06 — Node Rendering & Selection

## Objective

Implement the complete node rendering pipeline for Journey Builder.

At the end of this sprint, nodes created in Sprint 05 should become fully rendered visual components on the canvas, support selection, display metadata from the registry, and expose interaction states.

No properties editing, validation, workflow execution, or business-specific nodes will be implemented.

---

# Goals

Implement:

- Renderer pipeline
- Base node renderer
- Node status rendering
- Selection visuals
- Hover states
- Metadata-driven rendering
- Port rendering
- React Flow custom node registration
- Node interaction layer

Do NOT implement:

- Property editing
- Validation
- Connections
- Rules
- Conditions
- Templates
- Publishing
- Workflow execution

---

# Problem Statement

Sprint 05 can create nodes.

However those nodes are merely data.

Journey Builder now requires a reusable rendering architecture capable of supporting dozens of future node types without modifying the canvas runtime.

Rendering must remain registry-driven.

---

# Architectural Principles

Rendering must never contain business logic.

Renderers consume metadata.

Canvas consumes renderers.

Canvas never knows individual node types.

Node metadata remains the source of truth.

---

# Rendering Architecture
CanvasViewport
↓
ReactFlow
↓
RendererRegistry
↓
RendererDefinition
↓
BaseNodeRenderer
↓
Custom Renderer


Every node must pass through this pipeline.

---

# Rendering Pipeline


INode
↓

RendererRegistry

↓

RendererDefinition

↓

ReactFlow Node

↓

BaseNodeRenderer

↓

Rendered Component


No switch statements.

No if(type==="screen").

---

# Renderer Responsibilities

## RendererRegistry

Responsible for:

- registering renderers
- resolving renderer by node type
- fallback renderer

Must expose


registerRenderer()

getRenderer()

hasRenderer()


---

## BaseNodeRenderer

Responsible for

- layout
- borders
- title
- description
- icon
- ports
- badges
- interaction states

Must NOT

- hardcode node types
- contain workflow logic
- perform validation

---

## RendererDefinition

Each renderer supplies

- component
- minimum size
- default dimensions
- supportsPorts
- resize policy

No rendering decisions belong inside CanvasViewport.

---

# Metadata Driven Rendering

Renderers consume metadata only.

Examples

Display Name


Screen


Description


Collect customer information


Icon


Monitor


Category


Flow


Nothing should be duplicated.

---

# Selection Behaviour

Implement

Selected

Hovered

Focused

Disabled

Default

States only.

No editing.

---

# Visual States

Default

- subtle border
- white surface

Hover

- elevated shadow
- border emphasis

Selected

- primary outline
- selection glow

Disabled

- reduced opacity

Focused

- accessibility outline

---

# Port Rendering

Render visual ports only.

No connections.

Support

Top

Bottom

Left

Right

Visibility comes from metadata.

---

# Folder Structure

Create


src/features/rendering/

components/
BaseNodeRenderer.tsx
NodePorts.tsx
NodeBadge.tsx
NodeHeader.tsx

registry/
RendererRegistry.ts

contracts/
IRenderer.ts
IRendererDefinition.ts

hooks/
useRenderer.ts


---

# Files to Modify

RendererRegistry.ts

bootstrap.ts

CanvasViewport.tsx

NodeRegistry.ts

BaseNodeRenderer.tsx

WorkspaceCanvas.tsx

---

# Engineering Questions

Implementation must answer

1.

How are renderers registered?

2.

How is fallback renderer resolved?

3.

How does metadata reach the renderer?

4.

How are ports rendered without implementing connections?

5.

How are interaction states synchronized with React Flow?

6.

How are renderer dimensions calculated?

7.

How does RendererRegistry avoid importing node implementations?

8.

How can new renderers be added without modifying existing code?

---

# Acceptance Criteria

✓ Nodes visually render

✓ Registry selects renderer

✓ Base renderer reusable

✓ Selection works

✓ Hover works

✓ Metadata displayed

✓ Ports visible

✓ No hardcoded node logic

✓ No switch statements

✓ ReactFlow custom node registration complete

✓ npm build passes

✓ oxlint passes

---

# Deliverables

RendererRegistry

BaseNodeRenderer

Renderer contracts

Node visual states

Port renderer

Metadata-driven rendering

Verification screenshots

Verification report

Implementation summary