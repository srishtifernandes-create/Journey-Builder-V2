# NODE_LIFECYCLE.md

## Purpose

Defines the lifecycle contract every node type will eventually implement. This sprint defines the contract only — no lifecycle hook is implemented or invoked by runtime code yet. See Decision 009 in `DECISION_LOG.md`: lifecycle is contract-first.

## Contract

Defined in `src/features/nodes/contracts/INodeLifecycle.ts`.

```ts
interface INodeLifecycle {
  onCreate(node: INode): void
  onInitialize(node: INode): void
  onMount(node: INode): void
  onUpdate(previous: INode, next: INode): void
  onSerialize(node: INode): SerializedNode
  onValidate(node: INode): NodeValidationResult
  onDelete(node: INode): void
}
```

```ts
interface NodeValidationResult {
  valid: boolean
  errors?: string[]
}
```

## Stage Mapping

| Stage | Hook | Current implementation |
|---|---|---|
| Registration | — | `NodeRegistry.registerNode()` — implemented, not part of `INodeLifecycle` (registration happens before any instance exists). |
| Creation | `onCreate` | `NodeFactory.createNode()` performs the equivalent work today (id generation, defaults, ports, capabilities). No `INodeLifecycle` implementation is wired in yet. |
| Initialize | `onInitialize` | Not implemented. Reserved for future per-instance setup that runs after creation but before mount (e.g. computed defaults that depend on canvas context). |
| Mount | `onMount` | Not implemented. `CanvasViewport` mounts React Flow node components directly; no lifecycle hook is called. |
| Update | `onUpdate` | Not implemented. Node updates currently flow through `journeyStore.setNodes()` and React Flow's `onNodesChange`, with no lifecycle interception. |
| Serialization | `onSerialize` | `NodeSerializer.serialize()` performs the equivalent work today. Not yet expressed as an `INodeLifecycle` implementation. |
| Validation | `onValidate` | Not implemented. `NodeRegistration.validationSchema` is reserved for this but unused. |
| Deletion | `onDelete` | Not implemented. Node removal is not yet supported by the canvas/store. |
| Persistence | — | Handled outside the lifecycle contract, at the journey/document level (future sprint). |

## Why Contract-First

The contract exists so future sprints can attach real behavior (validation rules, side effects on mount/unmount, custom serialization per node type) without changing the shape every node type is expected to conform to. Implementing `INodeLifecycle` is optional per node type until a future sprint requires it — nothing in the current runtime calls these hooks.

## Non-Goals For This Sprint

- No lifecycle hook is invoked by `NodeFactory`, `NodeSerializer`, `CanvasViewport`, or the store.
- No default/base implementation of `INodeLifecycle` is provided.
- Validation logic, migration logic, and persistence logic are explicitly deferred to later sprints, per the Sprint 04 scope.
