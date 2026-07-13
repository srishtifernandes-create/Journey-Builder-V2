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

## Relationship to Metadata

`INode` holds only runtime/instance state. Static, type-level information (display name, description, category, icon, keywords, tags, documentation) lives in `NodeMetadata` (`src/features/nodes/contracts/INodeRegistry.ts`) and is looked up through the registry by `type` — it is never duplicated onto `INode` instances.

## Versioning

Every node carries `schemaVersion`, sourced from the type's registered `NodeMetadata.schemaVersion`. Migrations between schema versions are out of scope for this sprint; `schemaVersion` exists so future migration logic has something to key off of.

## Extending the Model

Business-specific fields must be introduced through `config`, not by adding new top-level fields to `INode`. Adding a new node type requires a new `NodeRegistration` (metadata, capabilities, default config, initial ports) — it never requires changing `INode` itself.
