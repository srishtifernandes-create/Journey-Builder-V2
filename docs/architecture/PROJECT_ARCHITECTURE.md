# PROJECT_ARCHITECTURE.md

> **Status:** Living document · **Last updated:** 13 July 2026
> **Owner:** Design · **Codebase:** Antigravity (React + Vite SPA)
> **Design system:** LoKey v2.0 · **Figma source of truth:** [LoKey v2.0](https://www.figma.com/design/NY6uAqOpZNiiaKTyx8KZKt/LoKey--v2.0-?node-id=11-1833)

This document is the **constitution** of the OnboardIQ Journey Builder. Every prompt, every design decision, every code change must be consistent with what is written here. If something contradicts this document, this document wins — or this document gets explicitly amended with a dated changelog entry.

---

## Table of Contents

1. [Domain Glossary](#1-domain-glossary)
2. [What Is a Journey?](#2-what-is-a-journey)
3. [The Graph Model](#3-the-graph-model)
4. [Node Types & Registration](#4-node-types--registration)
5. [Ports](#5-ports)
6. [Edges](#6-edges)
7. [State Management](#7-state-management)
8. [Property Rendering (Right Panel)](#8-property-rendering-right-panel)
9. [Validations](#9-validations)
10. [JSON Generation (Export Schema)](#10-json-generation-export-schema)
11. [Undo / Redo](#11-undo--redo)
12. [Layout Engine](#12-layout-engine)
13. [Stage Model (Lifecycle)](#13-stage-model-lifecycle)
14. [Shell Model (UI Frames)](#14-shell-model-ui-frames)
15. [Design System Constraints](#15-design-system-constraints)
16. [Mandatory Libraries](#16-mandatory-libraries)
17. [Protected Paths & Folders](#17-protected-paths--folders)
18. [Design Principles (Non-Negotiable)](#18-design-principles-non-negotiable)
19. [Open Questions & PM Dependencies](#19-open-questions--pm-dependencies)
20. [Changelog](#20-changelog)

---

## 1. Domain Glossary

These terms have precise meaning in OnboardIQ. Use them exactly as defined.

| Term | Definition |
|---|---|
| **Journey** | A complete, publishable onboarding flow — a directed acyclic graph of screens, checks, decisions, and actions that an applicant traverses end-to-end. |
| **Node** | A single unit on the canvas: Screen, Decision, API Check, Action, Switch, Child Journey, or Terminal. |
| **Port** | A named connection point on a node. Input ports receive edges; output ports emit edges. Ports are fixed-position, not free-floating. |
| **Edge** | An explicit, user-drawn connection between one node's output port and another node's input port. Edges are the journey's sequencing logic — there are no implicit connections. |
| **Screen** | The primary node type. Represents a single UI view the applicant sees (form, consent, OTP, document upload, etc.). Contains configured fields/bundles. |
| **Bundle** | A reusable UI component group configured within a Screen node (e.g., PAN input bundle, address bundle, document upload bundle). |
| **GJK (Global Journey Key)** | A system-level key-value pair configured during client onboarding, not within individual journeys. Spans four source groups. Available as read-only variables downstream. |
| **Trigger** | The event that initiates a journey: Assisted (RM-initiated), CTA Clicked, or QR Code Scanned. Configured in Stage 1. |
| **Child Journey** | A sub-flow spawned from a parent journey (e.g., individual KYC for each director in a KYB flow). Can be dependent (parent waits) or independent (submitted separately). |
| **Switch Node** | A routing node that evaluates a condition against a source field and directs the applicant to exactly one of N branches + a required default/fallback path. |
| **Decision Node** | A binary routing node: evaluates a single condition and routes to YES or NO. |
| **Condition Builder** | The Universal Condition Builder (UCB) — supports AND/OR nesting up to 2 levels, type-aware operator filtering per data type. Used in Depends On, Disabled On, Entry Conditions, and Auto-Decisioning. |
| **Post-Submission Check** | An API call or verification that runs after form submission (not during the applicant's screen interaction). Configured in Stage 3. |
| **Auto-Decisioning** | Rules engine that automatically accepts or rejects an application based on configured conditions. The last feature in the introduction sequence. |
| **Configurator** | The L2 user (Journey Builder persona) who designs and publishes journeys. Not the applicant. |

---

## 2. What Is a Journey?

A Journey is a **directed acyclic graph (DAG)** that models the complete onboarding flow an applicant traverses. It is:

- **Typed:** Every journey has a product type (Individual Savings KYC, Merchant KYB, Partnership KYC, etc.) and a trigger type (Assisted, CTA, QR).
- **Multi-stage:** Configured across 5 stages (see §13), but the graph itself lives in Stage 2 (Journey Builder).
- **Publishable:** A journey must pass validation (§9) before it can be published. Publishing freezes the configuration.
- **Versioned:** Each publish creates a new version. The version history UI supports viewing snapshots but not branching.
- **Client-scoped:** Journeys belong to a client. GJKs are set at the client level, not the journey level.

A journey contains:
- Exactly 1 Start node (implicit — the first screen after trigger)
- 1–N Screen nodes
- 0–N Decision, Switch, API Check, Action, and Child Journey nodes
- Exactly 1 Terminal node (Journey Complete)
- Edges connecting all nodes into a connected DAG with no orphans and no cycles

---

## 3. The Graph Model

The journey graph is a **port-based directed acyclic graph**.

```
Graph {
  nodes: Map<NodeId, Node>
  edges: Map<EdgeId, Edge>
  metadata: JourneyMetadata
}
```

**Constraints enforced at all times:**
- No cycles. If a user draws an edge that creates a cycle, the connection is visually rejected.
- No orphan nodes. Any node with zero incoming edges (except the start node) is flagged as a validation error.
- No dangling edges. Every edge must connect a valid source port to a valid target port.
- Single connected component. All nodes must be reachable from the start node.

**Graph direction:** Top-to-bottom (confirmed). This matches how configurators read the PRD and how applicants experience the journey.

---

## 4. Node Types & Registration

There are exactly **7 node types**. No additional types may be introduced without amending this document.

| Type | Shape | Width | Min Height | Ports (In/Out) | Description |
|---|---|---|---|---|---|
| **Screen** | Rounded rect (12px radius) | 180px | 72px | 1 in (top) / 1 out (bottom) | UI view the applicant sees |
| **Decision** | Diamond or chamfered rect | 140px | 64px | 1 in (top) / 2 out (left=NO, right=YES) | Binary condition evaluation |
| **API Check** | Rounded rect + accent left border | 160px | 64px | 1 in (top) / 1 out (bottom) | External API verification (PAN, CKYC, UIDAI, etc.) |
| **Action** | Pill (fully rounded ends) | 140px | 56px | 1 in (top) / 1 out (bottom) | System action (send SMS, trigger webhook, etc.) |
| **Switch** | Rounded rect with port array | 200px | 80px + (24px × port count) | 1 in (top) / 2–12 out (bottom, evenly spaced) + 1 default | Multi-path routing |
| **Child Journey** | Rounded rect with double border | 200px | 80px (collapsed) | 1 in (top) / 1 out (bottom) | Collapsible sub-flow |
| **Terminal** | Rounded rect, filled accent | 120px | 48px | 1 in (top) / 0 out | Journey Complete endpoint |

### Node Registration

Nodes are registered in a **node type registry** — a static map that defines:

```typescript
interface NodeTypeDefinition {
  type: NodeType;                    // 'screen' | 'decision' | 'api_check' | 'action' | 'switch' | 'child_journey' | 'terminal'
  label: string;                     // Human-readable label
  icon: string;                      // Icon identifier from LoKey icon set
  category: NodeCategory;            // 'flow' | 'logic' | 'integration' | 'lifecycle'
  ports: PortDefinition[];           // Fixed port definitions
  configSchema: ConfigSchema;        // What appears in the right panel Config tab
  rulesSchema: RulesSchema | null;   // What appears in the right panel Rules tab (null for Terminal)
  defaultConfig: Record<string, any>;// Initial values on creation
  validationRules: ValidationRule[]; // Per-node validation checks
  states: ['default', 'hover', 'selected', 'error', 'incomplete'];
}
```

**Node categories for the sidebar library:**

| Category | Contains |
|---|---|
| Flow | Screen, Terminal |
| Logic | Decision, Switch |
| Integration | API Check, Action |
| Lifecycle | Child Journey |

**Node creation methods (both must always be available):**
1. **Sidebar drag-and-drop:** Drag a node type from the left sidebar library onto the canvas.
2. **Output port "+" menu:** Click the "+" affordance on any node's output port to see a contextual dropdown of valid node types, filtered by what can legally connect at that point. Selecting one creates and auto-connects the node.

---

## 5. Ports

Ports are **named, fixed-position connection points** on nodes. They are not free-floating or user-repositionable.

```typescript
interface Port {
  id: string;           // e.g., 'in', 'out', 'yes', 'no', 'branch-0', 'default'
  type: 'input' | 'output';
  position: PortPosition;  // Computed from node type, not user-set
  label?: string;       // Visible label for switch branches and decision outputs
  connected: boolean;   // Whether an edge is attached
}
```

### Port Positions (Top-to-Bottom Layout)

| Node Type | Input Port(s) | Output Port(s) |
|---|---|---|
| Screen | Top-center | Bottom-center |
| Decision | Top-center | Left-center (NO), Right-center (YES) |
| API Check | Top-center | Bottom-center |
| Action | Top-center | Bottom-center |
| Switch | Top-center | Bottom edge, evenly spaced (branch-0 through branch-N) + default (rightmost, visually distinct) |
| Child Journey | Top-center | Bottom-center |
| Terminal | Top-center | None |

### Port Interaction States

Every port has 5 visual states:
1. **Default:** Subtle dot (6px, Neutral-200 fill)
2. **Hover:** Enlarged dot (10px, Primary-500 fill) + tooltip showing port name
3. **Dragging-from:** Pulsing ring animation, rubber-band edge follows cursor
4. **Valid-target:** Green ring (Success-500) when a compatible edge is being dragged nearby
5. **Invalid-target:** Red ring (Error-500) when an incompatible edge is being dragged nearby (e.g., output→output)

### Port Constraints

- An input port accepts **at most 1 incoming edge** (except: switch node outputs can converge at a single downstream input).
- An output port emits **exactly 1 edge** (except: the "+" creation affordance, which is distinct from the edge itself).
- Decision node: both YES and NO outputs **must** be connected before the node validates.
- Switch node: the default/fallback port **must** be connected. This is a compliance-level concern — unhandled cases mean applicants get stuck.

---

## 6. Edges

Edges are **explicit, user-drawn connections**. There are no auto-connections and no implicit sequencing.

```typescript
interface Edge {
  id: string;
  source: { nodeId: string; portId: string };
  target: { nodeId: string; portId: string };
  label?: string;        // For decision YES/NO labels, switch branch labels
  validated: boolean;     // Does this edge connect valid port types?
}
```

### Edge Drawing Interaction

1. User hovers an output port → port enters hover state
2. User mousedown on output port → rubber-band edge begins
3. User drags toward another node → valid input ports glow green, invalid glow red
4. User releases on a valid input port → edge is created, ELK re-layouts
5. User releases on empty canvas or invalid port → edge is discarded

### Edge Rendering

- **Algorithm:** Orthogonal routing via ELK.js (see §12). No hand-rolled bezier curves.
- **Style:** 1.5px stroke, Neutral-300 default, Primary-500 when selected/hovered
- **Labels:** Rendered at the midpoint of the edge for Decision (YES/NO) and Switch (branch name) edges
- **Animation on creation:** 200ms fade-in

### Edge Constraints

- Edges cannot create cycles (DAG constraint, validated in real-time)
- Edges cannot connect two ports on the same node (no self-loops)
- Edges cannot connect output→output or input→input
- Deleting an edge disconnects the downstream node, which gets flagged as orphaned

---

## 7. State Management

### Current State (Antigravity — as-is)

Localized React state within large parent wrapper components. Prop drilling. No centralized store. This is a **confirmed architecture gap** that causes lossy context-switching between the canvas and screen editor.

### Target State (Confirmed Direction)

A centralized store is required. The recommended approach:

```
JourneyStore (single source of truth)
├── graph: { nodes, edges, metadata }
├── ui: { selectedNodeId, panelOpen, zoomLevel, panOffset, expandedChildJourneys }
├── validation: { errors[], warnings[] }
├── history: { undoStack, redoStack }  // Phase 2 — simulated in Phase 1
└── dirty: boolean  // Has unsaved changes?
```

**State flow rules:**
- Canvas reads from `graph` and `ui`. Writes to `graph` (node add/remove/move, edge add/remove) and `ui` (selection, zoom, pan).
- Right panel reads from `graph[selectedNodeId]` and `validation`. Writes to `graph[selectedNodeId].config`.
- Validation engine subscribes to `graph` changes and recomputes `validation` on every mutation.
- Auto-save watches `dirty` flag. After 30s of inactivity with `dirty: true`, triggers save.

**What is NOT in the store:**
- Transient drag state (rubber-band edge position, node drag ghost) — local component state only.
- Tutorial/coach mark dismiss state — sessionStorage.
- Layout computed positions — derived from ELK on each graph mutation, cached but not persisted.

### Persistence

- **Auto-save:** After 30s of inactivity with unsaved changes. Toast: "Auto-saving…" → "Auto-saved ✓"
- **Manual save:** "Save Draft" button in the header. Writes the full `graph` state to the backend.
- **Unsaved changes guard:** `beforeunload` event fires the browser's native dialog. Stage navigation within the app fires a custom modal: "You have unsaved changes. Leave without saving?" [Keep editing] [Discard & switch]
- **Collaboration:** Single-editor locking in Phase 1. Multi-user collaboration deferred to post-Phase 1.

---

## 8. Property Rendering (Right Panel)

The right panel is the **sole configuration surface** for any selected node. It is 340px wide, slides in from the right (240ms ease) when a node is clicked, and slides out when the canvas background is clicked or Escape is pressed.

### Panel Structure

```
Panel (340px)
├── Header (55px)
│   ├── [Node type icon] [Node name — editable inline] [Status badge]
│   └── [Save — disabled until edit] [× close]
├── Tabs
│   ├── Config (varies by node type — see below)
│   ├── Rules (Depends On, Disabled On, Entry Conditions via UCB)
│   └── History (per-node edit log)
└── Footer validation bar (if errors/warnings exist for this node)
```

### Config Tab — Per Node Type

| Node Type | Config Tab Contents |
|---|---|
| **Screen** | Page Details (order, title, mobile title, page ID) · Access & Visibility (toggle per trigger type: Assisted, CTA, QR) · Fields list (visual inventory of bundles/components on this screen) |
| **Decision** | Single condition row: [source screen] [field] [operator] [value] · YES path target (read-only, from canvas) · NO path target (read-only, from canvas) |
| **API Check** | Provider badge (e.g., "CKYC Central Registry") · Execution timing toggle: "During journey" / "Post-submission" · Retry policy (max 3) · On failure dropdown: Skip / Block / Flag |
| **Action** | Action type selector · Configuration fields specific to action type (webhook URL, SMS template, etc.) |
| **Switch** | Evaluate section: [source screen dropdown] [field dropdown] · Branches list: drag-to-reorder, each row = condition value + target + drag handle · "+ Add branch" · Default path section (dashed border, warns if empty) · Validation bar: "N of N branches configured" |
| **Child Journey** | Journey selector · Dependency type: Dependent (parent waits) / Independent · Mapping: which parent fields pass to child · Status indicators for child configuration completeness |
| **Terminal** | Read-only: "This is the terminal node. The journey ends here." |

### Rules Tab (UCB-Powered)

Available on Screen, Decision, API Check, and Action nodes. Contains:

- **Depends On:** Show this node only if [condition]. Uses UCB with AND/OR nesting (max 2 levels).
- **Disabled On:** Disable this node if [condition]. Same UCB.
- **Entry Conditions:** Prerequisite checks before the applicant can enter this screen.

The UCB provides:
- Type-aware operator filtering per data type (String, Integer, Date, Boolean, Array + null handling)
- Source field picker that dynamically lists output fields from upstream screens and API responses
- AND/OR group nesting up to 2 levels deep (3+ levels: "Add group" button hidden)
- Maximum 10 conditions per rule (11th "+" button disabled + tooltip)

### History Tab

Per-node edit log: timestamp, author, change description. Phase 1 shows simulated entries.

---

## 9. Validations

Validation is **real-time and continuous**, not a publish-time-only gate. The validation engine subscribes to every graph mutation and recomputes the full validation state.

### Validation Severity Levels

| Level | Behaviour |
|---|---|
| **Error (blocking)** | Prevents publishing. Red badge on node. Listed in validation summary with "Go to" link. |
| **Warning (non-blocking)** | Allows publishing with confirmation modal. Orange badge on node. |
| **Info** | Informational nudge. No badge. Shown in panel only. |

### Node-Level Validations

| Rule | Severity | Applies To |
|---|---|---|
| Node has zero incoming edges (not start node) | Error | All except first Screen |
| Node has zero outgoing edges (not Terminal) | Error | All except Terminal |
| Required config fields are empty | Error | All |
| Decision node: YES or NO port unconnected | Error | Decision |
| Switch node: default/fallback port unconnected | Error | Switch |
| Switch node: zero branches configured | Error | Switch |
| Screen node: no fields/bundles configured | Warning | Screen |
| API Check: retry policy > 3 | Warning | API Check |
| Condition references a deleted/modified upstream field | Error | Any node with Rules |
| AND/OR mixing at same nesting level | Warning | UCB conditions |

### Graph-Level Validations

| Rule | Severity |
|---|---|
| Graph has zero nodes | Error (blocks publish: "Your journey is empty.") |
| No Terminal node reachable | Error ("Your journey needs an end point.") |
| Start node unconnected to anything | Error |
| Disconnected subgraph detected | Error |
| Cycle detected | Error |
| All nodes configured and connected | Pass → "Journey looks good! ✓" |

### Publish Gating

| Scenario | Behaviour |
|---|---|
| Errors present | Slide-up blocking panel listing all errors with "Go to" links |
| Warnings only (no errors) | Confirmation modal: "There are N warnings. Publish anyway?" [Review warnings] [Publish anyway] |
| Clean (no errors, no warnings) | Success modal + publish animation |

---

## 10. JSON Generation (Export Schema)

When a journey is saved or published, the graph state is serialized to a JSON payload for the backend. This is the **canonical format**.

```jsonc
{
  "journeyId": "uuid",
  "version": 3,
  "metadata": {
    "name": "Individual Savings KYC",
    "productType": "individual_savings",
    "triggerTypes": ["assisted", "cta_clicked", "qr_scanned"],
    "clientId": "uuid",
    "createdBy": "rahul@client.com",
    "createdAt": "2026-07-13T10:00:00Z",
    "updatedAt": "2026-07-13T14:30:00Z",
    "status": "draft" // "draft" | "published" | "archived"
  },
  "nodes": [
    {
      "id": "node-001",
      "type": "screen",
      "position": { "x": 200, "y": 100 },  // Canvas coordinates (persisted for user layout)
      "config": {
        "title": "PAN Verification",
        "mobileTitle": "Verify PAN",
        "pageId": "pan_verify",
        "triggerVisibility": {
          "assisted": true,
          "cta_clicked": true,
          "qr_scanned": false
        },
        "fields": [
          { "fieldId": "pan_number", "type": "text", "bundleRef": "pan_input_bundle" }
        ]
      },
      "rules": {
        "dependsOn": null,    // UCB condition tree or null
        "disabledOn": null,
        "entryConditions": null
      },
      "outputSchema": [       // Dynamically derived, stored for downstream reference
        { "key": "pan_number", "type": "string", "source": "field" },
        { "key": "pan_status", "type": "string", "source": "api_response" },
        { "key": "name_match_score", "type": "integer", "source": "api_response" }
      ]
    }
    // ... more nodes
  ],
  "edges": [
    {
      "id": "edge-001",
      "source": { "nodeId": "node-001", "portId": "out" },
      "target": { "nodeId": "node-002", "portId": "in" },
      "label": null
    }
    // ... more edges
  ],
  "globalJourneyKeys": [
    // Read-only reference — actual values set at client level, not journey level
    { "key": "customer_segment", "type": "string", "source": "crm" }
  ],
  "postSubmissionChecks": [
    // Configured in Stage 3, not on the canvas
    {
      "checkId": "ckyc_fetch",
      "provider": "ckyc_central_registry",
      "executionOrder": 1,
      "onFailure": "flag",
      "retryPolicy": { "maxRetries": 2, "backoffMs": 1000 }
    }
  ],
  "autoDecisioning": {
    // Configured in Stage 3 or Stage 4 — pending PM confirmation
    "rules": []  // UCB condition trees with accept/reject/refer outcomes
  }
}
```

### Output Schema Derivation

Screen output schemas are **dynamically derived**, not predefined. When a downstream node references a source screen, the available keys come from:

1. **Fields configured on that screen** — every form field the configurator added (e.g., `pan_number`, `date_of_birth`)
2. **API response fields from that screen's checks** — known response fields (e.g., `status`, `name_match_score`, `category`)
3. **System-injected fields** — timestamp, session ID, device info

This means: if a configurator removes a field from a screen, any downstream condition referencing that field is immediately flagged as a validation error.

---

## 11. Undo / Redo

### Phase 1 (Current — Simulation Only)

Undo/Redo keyboard shortcuts (Cmd+Z / Cmd+Shift+Z) are bound but **do not revert state**. They show a toast: "Undo/Redo available in the full product — this is a simulation."

This is an intentional scope cut. Proper undo requires a centralized state store with a command/action pattern, which is a Phase 2 dependency.

### Phase 2 (Target)

Command-based undo stack:

```typescript
interface UndoableAction {
  type: string;           // 'ADD_NODE' | 'DELETE_NODE' | 'MOVE_NODE' | 'ADD_EDGE' | 'DELETE_EDGE' | 'UPDATE_CONFIG' | ...
  forward: () => void;    // Apply the action
  reverse: () => void;    // Revert the action
  description: string;    // For the History tab: "Added PAN Verification screen"
}

// Store
undoStack: UndoableAction[]  // max depth: 50
redoStack: UndoableAction[]  // cleared on any new action
```

Every graph mutation must be wrapped in an `UndoableAction`. UI-only state changes (zoom, pan, selection) are **not** undoable.

---

## 12. Layout Engine

### Mandatory: ELK.js (`elkjs`)

**ELK.js is the sole layout engine.** No hand-rolled bezier curves, no manual coordinate computation for connectors. The old `WorkflowDiagram.tsx` approach with `bezierPath()` / `controlPoint()` / `portCenter()` is deprecated and must be fully removed.

### How It Works

1. On every graph mutation (node add/remove/resize, edge add/remove), build an ELK graph JSON from the current `graph.nodes` and `graph.edges`.
2. Each node specifies its `width`, `height`, and named ports with fixed relative positions.
3. ELK computes: node x/y positions (auto-layout) and edge bend-points (orthogonal routing).
4. The renderer applies ELK's output to position DOM/SVG elements.

### ELK Configuration

```javascript
{
  algorithm: 'layered',
  'elk.direction': 'DOWN',
  'elk.edgeRouting': 'ORTHOGONAL',
  'elk.layered.spacing.nodeNodeBetweenLayers': 80,
  'elk.layered.spacing.edgeNodeBetweenLayers': 40,
  'elk.portConstraints': 'FIXED_POS'  // Ports stay where CSS puts them
}
```

### User Override

- Configurators can **manually reposition any node** after auto-layout (freeform drag).
- A "Reset to auto-layout" toolbar button re-runs ELK and snaps all nodes to computed positions.
- ELK re-runs automatically only on structural graph changes (add/remove/resize), not on manual position drags.
- Manual positions are persisted in the JSON export (§10, `position` field).

### Alternative (Not Recommended)

Dagre (`dagre-js`) was evaluated. It is lighter but lacks port-aware orthogonal routing and edge/node collision avoidance. Given this project has fixed ports, decision branches, and switch multi-branch nodes, ELK is the correct choice.

---

## 13. Stage Model (Lifecycle)

The journey is built across **5 stages** (confirmed — the 6-stage variant from an older Figma was superseded).

| # | Stage | Description | Editable Surface |
|---|---|---|---|
| 1 | **Trigger Definition** | Define how the journey is initiated. Select trigger types, configure pre-fill fields. | Dedicated form |
| 2 | **Journey Builder** | Build the graph. Add/connect/configure nodes. This is the canvas. | Canvas + Right Panel |
| 3 | **Post Checks** | Configure post-submission API checks, execution order, retry policies. | Ordered list with drag-reorder |
| 4 | **Meta Data** | Journey metadata: name, description, tags, compliance notes. | Form |
| 5 | **Validate & Publish** | Run full validation, review summary, publish. | Read-only summary + publish action |

**Stage navigation:**
- Displayed as a horizontal step bar at the top of the app (below the header, above the canvas).
- Stages are visually marked: completed (green check), active (blue highlight), upcoming (grey).
- Stages are always accessible (not gated) — a configurator can jump to any stage at any time.
- Validation at publish time covers all stages, not just the current one.

---

## 14. Shell Model (UI Frames)

The app has 3 shell configurations that compose the same viewport differently.

### Shell A — Lifecycle View (No Canvas)

Used when the configurator is in Stages 1, 3, 4, or 5.

```
┌─────────────────────────────────────────┐
│ Header (56px)                           │
├─────────────────────────────────────────┤
│ Stage Nav (48px)                        │
├─────────────────────────────────────────┤
│                                         │
│          Stage-specific content         │
│          (full width, scrollable)       │
│                                         │
└─────────────────────────────────────────┘
```

### Shell B — Canvas, No Selection (Stage 2, nothing selected)

```
┌─────────────────────────────────────────┐
│ Header (56px)                           │
├─────────────────────────────────────────┤
│ Stage Nav (48px)                        │
├──────────┬──────────────────────────────┤
│ Node     │                              │
│ Library  │       Canvas                 │
│ Sidebar  │       (dot grid bg)          │
│ (240px)  │                              │
│          │                    ┌────────┐│
│          │                    │Minimap ││
│          │                    └────────┘│
└──────────┴──────────────────────────────┘
```

### Shell C — Canvas + Right Panel (Stage 2, node selected)

```
┌─────────────────────────────────────────────────┐
│ Header (56px)                                   │
├─────────────────────────────────────────────────┤
│ Stage Nav (48px)                                │
├──────────┬───────────────────────┬──────────────┤
│ Node     │                       │ Right Panel  │
│ Library  │       Canvas          │ (340px)      │
│ Sidebar  │                       │              │
│ (240px)  │                       │ [Config]     │
│          │                       │ [Rules]      │
│          │              ┌───────┐│ [History]    │
│          │              │Minimap││              │
│          │              └───────┘│              │
└──────────┴───────────────────────┴──────────────┘
```

**Shell transitions:**
- B → C: Node clicked. Right panel slides in (240ms ease). Canvas width shrinks by 340px.
- C → B: Canvas background clicked, or Escape pressed, or × in panel header. Right panel slides out.
- C → C (different node): Panel content swaps with a 120ms crossfade. Panel stays open.
- Any → A: Stage nav clicked to non-Stage-2 stage. Canvas unmounts, stage content mounts.

---

## 15. Design System Constraints

All UI must comply with **LoKey v2.0**. Token compliance is a hard requirement — no exceptions.

### Source of Truth

- Figma file: `NY6uAqOpZNiiaKTyx8KZKt`
- Library key: `lk-c1c67f16e1c90d8f4ddee18d1153b8aac318951ca25a7f7a6fe75bf56f947c4879347e77fa062531c044f13ef200dae4210d43eaf3f5cada61009b1627a61c18`
- Variable collection for colours: `Colors` (set key `d41651bd6e92a2b1a37bb32834330e90f21585f9`)

### Hard-Coded Token Mappings

| Usage | Hex | LoKey Token |
|---|---|---|
| Primary actions, selected states | `#1766D6` | `color.primary.500` (variable key: `896cf5a1980c3c2ffff50c10216a3cce72d9689f`) |
| Primary hover | — | `color.primary.600` (key: `5d05c284e7bd8bce1450bcc4e2c98862f9b8d756`) |
| Primary background tint | — | `color.primary.50` (key: `d5e95ab1e0dcd50bc1d68da79d1c83ffa369c213`) |
| Neutral text (headings, labels) | `#131A25` | `color.neutral.900` (key: `12528cef1c7c50eaf7ba12ae220b7a8b98eacf29`) |
| Muted text | — | `color.neutral.500` |
| Subtle text | — | `color.neutral.300` |
| Borders | — | `color.neutral.200` |
| Surface (cards, panels) | `#FFFFFF` | `color.neutral.0` |
| Background | — | `color.neutral.50` |
| Success | — | `color.success.500` |
| Warning | — | `color.warning.500` |
| Error | — | `color.error.500` |

### Typography

| Role | Font | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| Desktop Paragraph MD | Plus Jakarta Sans | 18px | 400 | 140% | 0.4% |
| Node title | Plus Jakarta Sans | 13px | 600 | 1.3 | 0 |
| Node type label | DM Mono | 10px | 400 | 1.2 | 0 |
| Badge text | Plus Jakarta Sans | 10px | 500 | 1 | 0 |
| Panel section header | Plus Jakarta Sans | 12px | 600 | 1.3 | 0.05em |

### Component Sizing

| Component | Height | Radius | Notes |
|---|---|---|---|
| Standard Button (M) | **36px** | 8px | Hard requirement — not negotiable |
| Card | Auto | 12px | Consistent with node shapes |
| Input field | 36px | 6px | Matches button height |
| Badge / Chip | 20px | 4px | |
| Toggle | 20px | 10px | LoKey component key: `2358ec71f601afe32e31fad687f4287762e365ab` |

### Interactive State Rules

| State | Background Opacity | Text Opacity |
|---|---|---|
| Default | 100% | 100% |
| Hover | Shift one shade darker | 100% |
| Active/Pressed | Shift two shades darker | 100% |
| **Disabled** | **32%** | **60%** |
| Selected | Primary-500 border + canonical shadow `0px 1px 1.5px rgba(0,0,0,0.06)` | 100% |

### Off-Spec Colour Protocol

Any colour not in the LoKey palette is **Design Debt**. It must be flagged, tracked, and resolved before the component ships. The "Heal Not Criticize" mandate applies: generate a Figma Scripter snippet to replace the offending hex with the correct LoKey variable, don't just report it.

---

## 16. Mandatory Libraries

These libraries are required in the Antigravity codebase. They may not be replaced without amending this document.

| Library | Purpose | Version Constraint |
|---|---|---|
| **React** | Component framework | ≥18 |
| **Vite** | Build tool | Latest stable |
| **ELK.js** (`elkjs`) | Graph layout engine — DAG layout + orthogonal edge routing | Latest stable |
| **Plus Jakarta Sans** | Primary typeface (LoKey) | Google Fonts latest |
| **DM Mono** | Monospace typeface for code/labels | Google Fonts latest |

### Evaluated and Rejected

| Library | Reason |
|---|---|
| Dagre / `dagre-js` | Lacks port-aware orthogonal routing and edge/node collision avoidance |
| React Flow | Evaluated but overly opinionated for this use case — port constraints and custom node rendering are easier without it |
| Hand-rolled bezier (`bezierPath`, `controlPoint`, `portCenter`) | Legacy approach. Causes crossing/overlapping lines. **Must be fully removed.** |

### Recommended (Not Yet Mandatory)

| Library | Purpose | Decision Point |
|---|---|---|
| Zustand or Jotai | Centralized state management (§7) | Must be decided before Phase 2 implementation begins |
| Immer | Immutable state updates for undo stack | Paired with state management decision |

---

## 17. Protected Paths & Folders

These paths/folders may **never** be modified by AI prompts or automated scripts without explicit human review and approval:

| Path | Reason |
|---|---|
| `src/theme/` | LoKey token definitions. Changes here affect every component. |
| `src/types/` | TypeScript type definitions for the graph model, node types, edge types. Schema changes cascade everywhere. |
| `public/` | Static assets, manifest, favicon. |
| `.env*` | Environment configuration. |
| `package.json` / `package-lock.json` | Dependency manifest. Only modify via explicit `npm install` commands. |
| `vite.config.*` | Build configuration. |
| `tsconfig.*` | TypeScript configuration. |
| Any file in `src/` containing `WorkflowDiagram` | Legacy graph renderer. Must be fully replaced by ELK-based system, not patched. |

### Figma Protected Resources

| Resource | Rule |
|---|---|
| LoKey v2.0 library components | Never detach instances. Swap with library instances. |
| LoKey variable collection (`Colors`) | Never add ad-hoc variables. Request additions via design system governance. |
| Figma Make frames | Always run through the "Heal Not Criticize" protocol (§15) before handoff. |

---

## 18. Design Principles (Non-Negotiable)

These were established over the life of the project. They are not suggestions.

**1. Extend, don't invent.** Fit new features into the existing 3-screen structure (Lifecycle → Canvas → Screen Editor). Don't create new top-level surfaces unless there is literally no alternative.

**2. Domain accuracy over generic UX.** Ground every design decision in the specific Indian KYC/KYB regulatory context. A decision node isn't abstract — it's "Is the applicant's PAN status Active or Inactive?" Use real field names (PAN, Aadhaar, CKYC, FATCA, MCA21), real API responses, real regulatory requirements in all mockups.

**3. Feature introduction order matters.** The sequence is fixed:
  1. Workflow configurations
  2. Depends On conditions
  3. Post-Submission Checks
  4. Disabled On conditions
  5. Auto-Decisioning (last — builds on established condition builder familiarity)

**4. Incomplete tasks need visual indicators.** Every screen, rule, or check that is partially configured must be visually distinguishable from complete and not-started states. Three states minimum: not started (grey), incomplete (orange/warning), complete (green/success).

**5. Nudge, don't block.** Validation warnings let the configurator continue working. Only true errors (cycles, missing terminals, empty required fields) are blocking. The builder should feel like a power tool, not a compliance form.

**6. Separate PM-dependent from independently executable.** Track PM-blocking items separately. Never let a PM dependency stall design work that can proceed without it.

**7. Work through ambiguity analytically, then design.** Problem definition → IA → interaction model → mockup. Not the reverse.

**8. GJKs are system-level, not journey-level.** This is a fixed architectural constraint. GJKs are configured during client onboarding. If they're missing, surface a visible nudge — but never let the configurator set them inside a journey.

---

## 19. Open Questions & PM Dependencies

| # | Question | Owner | Status | Impact |
|---|---|---|---|---|
| OQ-01 | Auto-accept / auto-reject rule list for Auto-Decisioning | PM (Paulomee) | **Pending** | Blocks auto-decisioning outcome design |
| OQ-02 | API Marketplace — concrete list of available APIs | PM | Known gap in PRD | Affects API Check node provider badges and config fields |
| OQ-03 | Back Office / M3 scope | PM | Deferred | Affects reviewer console integration |
| OQ-04 | Switch node port cap: 12 (README) vs 20 (Business Rules WF-06) | PM | **Needs resolution** | Affects port spacing, label layout, visual density |
| OQ-05 | JSON logic mode for Switch nodes: Phase 1 or deferred? | PM | **Needs resolution** | Affects Switch node config panel complexity |
| OQ-06 | State management library choice (Zustand vs Jotai vs other) | Engineering | **Needs decision** | Blocks Phase 2 undo/redo and centralized store |

---

## 20. Changelog

| Date | Section | Change | Author |
|---|---|---|---|
| 2026-07-13 | All | Initial document created from accumulated project decisions | Design |
| — | — | — | — |

---

> **How to Amend This Document**
>
> 1. Add a row to the Changelog with the date, section, and change description.
> 2. Make the change in the relevant section.
> 3. If the change contradicts a prior decision, explicitly note what was superseded and why.
> 4. Share the diff with the team for review.
>
> This document is not a wiki anyone can silently edit. Changes are tracked, reviewed, and intentional.
