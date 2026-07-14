# NODE_MODEL.md

## Purpose

Defines the canonical data model used by every node in Journey Builder.

Every node must conform to this structure regardless of node type.

## Canonical Interface

Defined in `src/features/nodes/contracts/INode.ts`.

```ts
interface INode {
  id: string
  type: string
  schemaVersion: number
  position: Position
  config: Record<string, any>
  uiState: NodeUIState
  ports: Record<string, PortState>
  capabilities: NodeCapabilities
}
```

### Position

```ts
interface Position {
  x: number
  y: number
}
```

### NodeUIState

Transient, runtime-only presentation state. Never persisted as part of node identity beyond what serialization chooses to keep.

```ts
interface NodeUIState {
  status: 'default' | 'hover' | 'selected' | 'error' | 'incomplete'
  configCompleteStatus: 'not_started' | 'incomplete' | 'complete'
}
```

> **Deprecated value:** `'selected'` is no longer written by any code path (see Decision 014 in `DECISION_LOG.md` — `selectionStore` is now the sole owner of selection state). The value remains in the type for migration safety and will be removed in a future sprint once all consumers have confirmed no dependency on it. Do not add new writers of `status: 'selected'`; use `selectionStore` instead.

### PortState

```ts
interface PortState {
  id: string
  type: 'input' | 'output'
  connected: boolean
  label?: string
}
```

### NodeCapabilities

Static flags describing what a node type is allowed to do. Assigned by the factory from the node's registration and copied onto every instance.

```ts
interface NodeCapabilities {
  canHaveFields: boolean
  canRoute: boolean
  isIntegration: boolean
  isTerminal: boolean
}
```

## Field Responsibilities

| Field | Owner | Notes |
|---|---|---|
| `id` | `NodeFactory` | Generated as `${type}-${crypto.randomUUID()}` at creation time. |
| `type` | `NodeRegistry` | Must match a registered node type. |
| `schemaVersion` | `NodeRegistry` (via `NodeMetadata.schemaVersion`) | Copied onto the node at creation. Used for future migrations. |
| `position` | Canvas / `ReactFlowAdapter` | Mutated as the node moves on the canvas. |
| `config` | Node-type defaults + user edits | Seeded from `NodeRegistration.defaultConfig`, later overridden by serialized data or property editors (future sprint). |
| `uiState` | Canvas runtime | Not persisted by `NodeSerializer`; recomputed at runtime. |
| `ports` | `PortFactory` | Built from `NodeRegistration.initialPorts` at creation time. |
| `capabilities` | `NodeRegistry` (via `NodeRegistration.capabilities`) | Copied verbatim onto every instance of a type. |

## Node State Ownership: Business vs. Renderer

`journeyStore` holds business-owned node state only: creation and deletion, authored `position`, `config`, `ports`, and registry-derived metadata — everything that would round-trip through `NodeSerializer` or be visible to a Journey author as configured/authored.

React Flow owns renderer state: measured dimensions, in-progress dragging/resizing, hover/focus, and any other transient fact that exists only to make the canvas draw correctly right now. Renderer state is never written to `journeyStore`. `CanvasViewport`'s `onNodesChange` handler enforces this by classifying incoming `NodeChange`s against an explicit allow-list of business-owned types (`position`, `remove`) before persisting — see `docs/bugs/BUGFIX_001_SELECTION_FIREHOSE_FIX.md` for the incident that established this boundary.

## Relationship to Metadata

`INode` holds only runtime/instance state. Static, type-level information (display name, description, category, icon, keywords, tags, documentation) lives in `NodeMetadata` (`src/features/nodes/contracts/INodeRegistry.ts`) and is looked up through the registry by `type` — it is never duplicated onto `INode` instances.

## Versioning

Every node carries `schemaVersion`, sourced from the type's registered `NodeMetadata.schemaVersion`. Migrations between schema versions are out of scope for this sprint; `schemaVersion` exists so future migration logic has something to key off of.

## Extending the Model

Business-specific fields must be introduced through `config`, not by adding new top-level fields to `INode`. Adding a new node type requires a new `NodeRegistration` (metadata, capabilities, default config, initial ports) — it never requires changing `INode` itself.

## Business Behaviour vs. Canvas Behaviour

Canvas nodes are **authoring primitives** — the things a Product Manager drags, drops, connects, and configures while building a journey on the canvas. They are not a one-to-one mirror of every internal implementation step a node performs at runtime.

Business logic — validation rules, enablement conditions, URL generation, API payload shaping, and similar behaviors — lives **inside a node's schema** (its `config`, `IInspectorSchema`, `IRuleSchema`, and `IVariableSchema`, per `docs/architecture/AI_IMPLEMENTATION_RULES.md`), not as separate canvas nodes.

**Correct:** a "Consent Screen" node's schema declares that it performs mandatory-field validation, enables a Send Consent CTA once valid, and produces a consent URL — all as behavior described within that one node's contract.

**Incorrect:** splitting those same behaviors into standalone "Validation Node", "Enable CTA Node", and "Generate URL Node" canvas nodes, when the workflow contract does not define them as separate authorable nodes.

Implementation behaviour must never appear as separate canvas nodes unless a workflow contract (`docs/workflows/WF_xx/*`) explicitly models it that way. If a workflow contract's node inventory lists something as its own node, it is one; otherwise, it is a behavior inside a node's schema. See `docs/architecture/SOURCE_OF_TRUTH.md` for how conflicts between a workflow contract and any other doc or the current implementation are resolved.
