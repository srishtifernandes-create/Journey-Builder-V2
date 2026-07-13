# NODE_REGISTRY.md

## Purpose

The Node Registry is the single place where node types are made known to the application. Nothing discovers node types through imports or switch statements — everything goes through `NodeRegistry`.

## Interface

Defined in `src/features/nodes/contracts/INodeRegistry.ts`, implemented by `src/features/nodes/registry/NodeRegistry.ts`.

```ts
interface INodeRegistry {
  registerNode(registration: NodeRegistration): void
  unregisterNode(type: string): void
  getNode(type: string): NodeRegistration | undefined
  getNodeMetadata(type: string): NodeMetadata | undefined
  getAllNodes(): NodeRegistration[]
  getNodesByCategory(category: string): NodeRegistration[]
  getNodesByGroup(group: string): NodeRegistration[]
}
```

`NodeRegistry` is a singleton instance backed by an in-memory `Map<string, NodeRegistration>` keyed by node type. `registerNode` throws if the type is already registered, so double-registration fails loudly instead of silently overwriting.

## NodeRegistration

What a node type registers with the registry:

```ts
interface NodeRegistration {
  type: string
  metadata: NodeMetadata
  capabilities: NodeCapabilities
  defaultConfig: Record<string, any>
  initialPorts: PortDefinition[]
  validationSchema?: any // Zod validation rules, reserved for a future sprint
}
```

## NodeMetadata

Everything the UI needs to describe a node type without hardcoding it:

```ts
interface NodeMetadata {
  type: string
  displayName: string
  description: string
  category: 'flow' | 'logic' | 'integration' | 'lifecycle'
  group: string
  icon: string
  keywords: string[]
  tags: string[]
  schemaVersion: number
  documentationUrl?: string
}
```

`category` and `group` are both supported as lookup dimensions (`getNodesByCategory`, `getNodesByGroup`) — `category` is the fixed architectural bucket, `group` is a freeform label for finer-grained organization (e.g. a palette section) that doesn't require changing the `category` union.

## RendererRegistry

A separate, parallel registry (`src/features/nodes/registry/RendererRegistry.ts`, contract in `INodeRenderer.ts`) maps node type to how it renders on the canvas:

```ts
interface RendererDefinition {
  readonly type: string
  readonly component: ComponentType<{ node: INode }>
  readonly defaultWidth: number
  readonly defaultHeight: number
}

interface IRendererRegistry {
  registerRenderer(definition: RendererDefinition): void
  unregisterRenderer(type: string): void
  getRenderer(type: string): RendererDefinition | undefined
  getAllRenderers(): RendererDefinition[]
}
```

`NodeRegistry` and `RendererRegistry` are deliberately separate: node registration (metadata, capabilities, defaults) has no dependency on React, while renderer registration does. This keeps the node contracts framework-agnostic and avoids circular imports between the registry layer and React components — see Decision 010 in `DECISION_LOG.md`.

`CanvasViewport` builds its React Flow `nodeTypes` map by calling `RendererRegistry.getAllRenderers()`; it never imports a node renderer component directly.

## Bootstrap

Registration happens once, at app startup, in `src/features/nodes/registry/bootstrap.ts` (`bootstrapNodeFoundation()`, called from `src/main.tsx`). It registers each node type's `NodeRegistration` with `NodeRegistry` and its `RendererDefinition` with `RendererRegistry`. Adding a new node type means adding a registration block here (or in an equivalent future plugin entry point) — no other runtime file changes.

## Plugin / Extension Path

Because registration is just a function call against a `Map`, a future node package only needs to call `NodeRegistry.registerNode(...)` and `RendererRegistry.registerRenderer(...)` during its own initialization. No existing runtime code needs to change to add a node type; `unregisterNode` / `unregisterRenderer` exist to support hot-swapping or disabling a plugin's nodes.
