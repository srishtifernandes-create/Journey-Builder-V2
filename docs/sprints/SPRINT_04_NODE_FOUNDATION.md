# Sprint 04 — Node Foundation

> **Sprint Goal**
>
> Establish the permanent node architecture for Journey Builder V2.
>
> This sprint defines what a node is, how nodes are created, discovered, rendered, versioned, serialized and extended.
>
> No business nodes (Aadhaar, PAN, OCR, etc.) are implemented in this sprint.
>
> Future node implementations must build upon this foundation.

---

# Objectives

This sprint establishes:

- Canonical node model
- Node registry
- Node factory
- Renderer registry
- Metadata system
- Lifecycle contracts
- Serialization contracts
- Versioning
- Extension architecture

This sprint must not implement business functionality.

---

# Architectural Principles

The node system must satisfy the following principles.

## Single Source of Truth

Every node is represented by a canonical node object.

No duplicate representations.

---

## Registry Driven

Nodes are never discovered through imports or switch statements.

Every node must be registered.

---

## Metadata Driven

UI must never hardcode node information.

Everything comes from metadata.

Examples:

- display name
- icon
- category
- keywords
- documentation
- capabilities

---

## Renderer Agnostic

Canvas never knows how a node renders.

It asks the renderer registry.

---

## Extensible

Adding a new node type should require:

- implementing the node
- registering it

Nothing else.

---

## Serializable

Every node must serialize to Journey JSON.

Every Journey JSON must deserialize back into nodes.

Round-trip integrity is mandatory.

---

## Versioned

Every node carries an explicit version.

Migration support will depend on this.

---

# Scope

## Included

Canonical node interfaces

Node metadata

Registry

Factory

Renderer registry

Lifecycle interfaces

Serialization contracts

Version support

Architecture documentation updates

---

## Excluded

Business nodes

Properties

Validation

Connections

Execution engine

Templates

Publishing

---

# Deliverables

## 1. Canonical Node Model

Create the permanent node interfaces.

A node should contain concepts equivalent to:

- id
- type
- version
- metadata
- configuration
- ui state
- ports
- capabilities

The exact implementation is left to engineering.

---

## 2. Node Metadata Model

Every node exposes metadata.

Metadata includes:

- display name
- description
- category
- icon
- keywords
- documentation
- version
- tags

Metadata must be reusable throughout the application.

---

## 3. Node Registry

Implement a registry responsible for:

- registerNode()
- unregisterNode()
- getNode()
- getAllNodes()
- getNodeMetadata()
- getNodesByCategory()

No switch statements are permitted.

---

## 4. Node Factory

Implement a factory responsible for creating nodes.

Responsibilities include:

- generating identifiers
- assigning defaults
- applying metadata
- assigning versions
- returning complete node objects

No component creates nodes directly.

---

## 5. Renderer Registry

Implement a renderer registry.

The canvas requests renderers by node type.

Canvas components never import node renderers directly.

---

## 6. Lifecycle Contracts

Define lifecycle hooks.

Examples include:

- onCreate()
- onMount()
- onUpdate()
- onDelete()
- onSerialize()
- onValidate()

Implementation is deferred.

Only contracts are required.

---

## 7. Serialization Contracts

Define serialization interfaces.

Support:

Node

↓

Journey JSON

↓

Node

without information loss.

---

## 8. Versioning

Every node contains:

- version

Future migrations will build upon this.

---

## 9. Extension Architecture

The registry must support future plugins.

Future node packages should be installable without modifying existing runtime code.

---

# Folder Structure

The following folders may be introduced or expanded.

src/features/nodes/

- models/
- registry/
- factory/
- metadata/
- lifecycle/
- renderers/
- serialization/
- hooks/
- types/
- utils/

Engineering may refine this structure provided the separation of responsibilities is preserved.

---

# Documentation Updates

The following documents must be completed during this sprint.

docs/architecture/

- NODE_MODEL.md
- NODE_REGISTRY.md
- NODE_LIFECYCLE.md

These documents become the permanent source of truth for node architecture.

---

# Acceptance Criteria

The sprint is complete when:

✓ A canonical node model exists.

✓ Nodes are created exclusively through the factory.

✓ Nodes are discovered exclusively through the registry.

✓ Renderer lookup is registry-driven.

✓ Serialization contracts exist.

✓ Lifecycle contracts exist.

✓ Versioning is implemented.

✓ Architecture documentation reflects implementation.

✓ npm run build succeeds.

✓ npx oxlint succeeds.

---

# Explicitly Forbidden

Do not implement:

- OCR node
- Aadhaar node
- PAN node
- Rule Engine node
- API node
- Property editor
- Validation engine
- Drag & Drop palette
- Edge creation
- Journey execution

Those belong to future sprints.

---

# Engineering Questions

Before implementation begins, provide an implementation plan answering the following.

1. What is the canonical node interface?

2. How will metadata be separated from runtime state?

3. How will renderer registration avoid circular dependencies?

4. How will the registry support future plugin nodes?

5. How will version migrations be introduced later?

6. Which files from Sprint 03 will be modified?

7. How will serialization avoid React-specific data?

8. What technical debt could this sprint accidentally introduce?

Do not begin implementation until this plan is approved.