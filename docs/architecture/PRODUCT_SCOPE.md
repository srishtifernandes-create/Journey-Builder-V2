# PRODUCT_SCOPE.md

> **Status:** Living document · **Last updated:** 13 July 2026
> **Companion to:** `PROJECT_ARCHITECTURE.md`
> **Current phase:** Phase 1 (Design + Simulation)

This document defines exactly what is in scope, what is out, and what is deferred — per phase. If a feature isn't listed here, it doesn't exist. If it's marked ✘, no one builds it in that phase. If it's marked ⏳, it's designed but not implemented.

---

## How to Read This

```
✔  In scope — must ship in this phase
⏳ Designed / scaffolded — UI exists but behaviour is simulated
✘  Explicitly out of scope — do not build, do not design
◐  Partially in scope — specific sub-features listed below
⊘  Blocked — waiting on PM or engineering dependency
```

---

## Phase 1 — Design + Interactive Simulation

> **Goal:** A fully interactive Antigravity prototype that a PM can click through end-to-end. Simulates the complete journey-building workflow for an Individual Savings Account KYC journey. Not connected to any backend. All data is local/in-memory.

### 1.1 Canvas — Core Interactions

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | Drag node from sidebar library to canvas | ✔ | Left sidebar (240px), categorised: Flow, Logic, Integration, Lifecycle |
| 2 | Create node via output port "+" menu | ✔ | Contextual dropdown filtered to valid node types |
| 3 | Connect nodes (port-to-port edge drawing) | ✔ | Figma/Miro-style drag from output port to input port |
| 4 | Delete node | ✔ | Delete/Backspace key + confirmation modal |
| 5 | Delete edge | ✔ | Click edge to select, then Delete key |
| 6 | Move node (freeform drag) | ✔ | Manual repositioning after auto-layout |
| 7 | Select node (open right panel) | ✔ | Single-node selection only. No multi-select. |
| 8 | Deselect (close right panel) | ✔ | Click canvas background or press Escape |
| 9 | Inline rename node | ✔ | Double-click node title → editable text field → Enter to confirm |
| 10 | Connection splitting on insert | ✔ | Drag a node onto an existing edge → auto-splits the connection |
| 11 | Invalid connection rejection | ✔ | Output→output, input→input, self-loop, cycle-creating edges visually rejected |
| 12 | Orphan node flagging | ✔ | Real-time: any node with zero incoming edges (except start) gets warning badge |

### 1.2 Canvas — Navigation

| # | Feature | Status | Notes |
|---|---|---|---|
| 13 | Zoom in/out | ✔ | Scroll-wheel (anchored to cursor), ⌘+/⌘−, toolbar buttons. Range: 25%–200%. |
| 14 | Pan | ✔ | Space+drag, middle-click drag, touch two-finger drag |
| 15 | Fit to view | ✔ | ⌘0 or toolbar button. Fits entire graph in viewport. |
| 16 | Reset to 100% | ✔ | ⌘1 |
| 17 | Minimap | ✔ | 160×120px, bottom-right. Collapsed by default (expand via "Map" chip). Viewport indicator is draggable. |
| 18 | Zoom-to-node | ✔ | Click a node in the right panel's screen list → canvas centres and zooms to that node |
| 19 | Zoom-level label display | ✔ | Toolbar shows current zoom % in DM Mono |
| 20 | "Lost?" recovery toast | ✔ | After 2s of no visible canvas content: "Lost? Press ⌘0 to fit" |

### 1.3 Canvas — Layout

| # | Feature | Status | Notes |
|---|---|---|---|
| 21 | Auto-layout via ELK.js | ✔ | Layered algorithm, direction DOWN, orthogonal edge routing |
| 22 | Orthogonal edge routing | ✔ | All connectors routed via ELK — no hand-rolled beziers |
| 23 | Reset to auto-layout button | ✔ | Toolbar action. Re-runs ELK, snaps all nodes to computed positions. |
| 24 | Branch visualisation | ✔ | Switch/decision branches visually offset from main spine |
| 25 | Edge labels | ✔ | YES/NO on decision edges, branch names on switch edges |
| 26 | Connector redraw on drag | ✔ | requestAnimationFrame loop — connectors follow dragged node within 1 frame |
| 27 | Canvas dot-grid background | ✔ | 20px spacing, Neutral-200 dots on Neutral-50 background |

### 1.4 Node Types

| # | Feature | Status | Notes |
|---|---|---|---|
| 28 | Screen node | ✔ | 180×72px. Rounded rect, 12px radius. 1 in / 1 out port. |
| 29 | Decision node | ✔ | 140×64px. Diamond/chamfered. 1 in / 2 out (YES right, NO left). |
| 30 | API Check node | ✔ | 160×64px. Rounded rect + accent left border. 1 in / 1 out. |
| 31 | Action node | ✔ | 140×56px. Pill shape. 1 in / 1 out. |
| 32 | Switch node | ✔ | 200×(80+24n)px. 1 in / 2–12 out + required default port. |
| 33 | Child Journey node | ✔ | 200×80px collapsed. Double border. Collapsible sub-flow. |
| 34 | Terminal node | ✔ | 120×48px. Accent filled. 1 in / 0 out. |
| 35 | Node states: default, hover, selected, error, incomplete | ✔ | All 5 states per node type with LoKey tokens |
| 36 | Status badges on nodes | ✔ | Three-state: not started (grey), incomplete (orange), complete (green) |
| 37 | Type badges on nodes | ✔ | AUTH, FORM, CONSENT, API CHECK, BIOMETRIC, UIDAI, COMPLIANCE, UPLOAD, STATIC |
| 38 | Rule badges on nodes | ✔ | Shows condition count ("2 rules"), trigger-dependency flags |

### 1.5 Right Panel — Property Editor

| # | Feature | Status | Notes |
|---|---|---|---|
| 39 | Panel slide-in on node select | ✔ | 340px, slides from right, 240ms ease |
| 40 | Panel header: type icon, name, status badge, save, close | ✔ | |
| 41 | Config tab (per-node-type config) | ✔ | See §8 in PROJECT_ARCHITECTURE.md for per-type contents |
| 42 | Rules tab (Depends On, Disabled On, Entry Conditions) | ✔ | Powered by Universal Condition Builder |
| 43 | History tab | ⏳ | UI exists, shows simulated edit log entries. Not connected to real versioning. |
| 44 | Context-switch between nodes | ✔ | Click different node → panel content swaps (120ms crossfade), panel stays open |
| 45 | Screen node: trigger visibility toggles | ✔ | Per-trigger-type toggles: Assisted / CTA Clicked / QR Scanned |
| 46 | Switch node: branch reorder (drag) | ✔ | Drag-to-reorder branch list + "+ Add branch" |
| 47 | Switch node: default path config | ✔ | Dashed border section, warns if empty |
| 48 | Decision node: condition row | ✔ | [source screen] [field] [operator] [value] |
| 49 | API Check node: timing, retry, on-failure | ✔ | During journey / Post-submission toggle, max 3 retries, Skip/Block/Flag |
| 50 | Child Journey node: dependency type | ✔ | Dependent (parent waits) / Independent (separate submission) |

### 1.6 Universal Condition Builder (UCB)

| # | Feature | Status | Notes |
|---|---|---|---|
| 51 | AND/OR nesting | ✔ | Max 2 levels deep. 3rd level: "Add group" hidden. |
| 52 | Type-aware operator filtering | ✔ | String, Integer, Date, Boolean, Array operators + null handling |
| 53 | Source field picker (dynamic) | ✔ | Lists output fields from upstream screens + API responses |
| 54 | GJK Drawer integration | ✔ | Live search, PII masking, type badges, orphaned key indicators |
| 55 | Max 10 conditions per rule | ✔ | 11th "+" disabled + tooltip |
| 56 | AND/OR mixing warning | ✔ | Warning banner when AND and OR mixed at same nesting level |
| 57 | Deleted field reference detection | ✔ | Condition referencing removed upstream field flagged as error |
| 58 | Configurable outcomes | ✔ | Show/Hide, Enable/Disable, Accept/Reject (per context) |

### 1.7 Validation

| # | Feature | Status | Notes |
|---|---|---|---|
| 59 | Real-time validation (continuous) | ✔ | Recomputes on every graph mutation. Not publish-time only. |
| 60 | Error badges on nodes | ✔ | Red badge, blocking. Listed in validation summary. |
| 61 | Warning badges on nodes | ✔ | Orange badge, non-blocking. |
| 62 | Validation summary panel | ✔ | Journey-level overview with "Go to" links per issue |
| 63 | Orphan detection | ✔ | Any node unreachable from start |
| 64 | Cycle detection | ✔ | Real-time on edge creation |
| 65 | Missing terminal detection | ✔ | "Your journey needs an end point" |
| 66 | Empty journey detection | ✔ | "Your journey is empty" on zero nodes |
| 67 | Publish gating (errors block, warnings confirm) | ✔ | See §9 in PROJECT_ARCHITECTURE.md |
| 68 | Progress bar | ✔ | "9 of 11 screens configured" with Success-500 fill |

### 1.8 Persistence & Lifecycle

| # | Feature | Status | Notes |
|---|---|---|---|
| 69 | Save Draft (manual) | ✔ | Button in header. Serialises graph to JSON (§10 in ARCHITECTURE). |
| 70 | JSON export | ✔ | Full journey graph → JSON payload. Canonical format defined. |
| 71 | Auto-save simulation | ⏳ | After 30s inactivity: toast "Auto-saving…" → "Auto-saved ✓". Simulated, no backend write. |
| 72 | Unsaved changes guard | ✔ | `beforeunload` for tab close. Custom modal for stage navigation. |
| 73 | Draft → In Review → Published → Archived lifecycle | ⏳ | UI for status transitions exists. State machine simulated locally. |
| 74 | Version history (snapshot per save) | ⏳ | History UI shows simulated version list. Revert action simulated. |
| 75 | Single-editor locking | ⏳ | Banner: "Rahul is currently editing. View only." Simulated. |
| 76 | Templates (secondary creation path) | ⏳ | Template gallery UI exists. Applying a template pre-populates the canvas. Simulated set only. |

### 1.9 Stage Navigation

| # | Feature | Status | Notes |
|---|---|---|---|
| 77 | 5-stage horizontal step bar | ✔ | Trigger Definition → Journey Builder → Post Checks → Meta Data → Validate & Publish |
| 78 | Stage completion indicators | ✔ | Completed (green check), active (blue), upcoming (grey) |
| 79 | Non-linear stage access | ✔ | Configurator can jump to any stage at any time. Not gated. |
| 80 | Stage 1: Trigger Definition form | ✔ | Trigger type selection, pre-fill fields, distribution type |
| 81 | Stage 2: Journey Builder (canvas) | ✔ | This is the primary design surface — everything in §1.1–1.8 |
| 82 | Stage 3: Post Checks page | ◐ | Layout designed. Ordered list with drag-reorder for API execution sequence. Auto-decisioning section ⊘ pending PM rule list. |
| 83 | Stage 4: Meta Data form | ⏳ | Form exists. Fields simulated. |
| 84 | Stage 5: Validate & Publish | ✔ | Full validation summary. Publish action with error/warning/success modals. |

### 1.10 Assistance & Onboarding

| # | Feature | Status | Notes |
|---|---|---|---|
| 85 | Welcome modal (first-time) | ✔ | 3-step overview → "Start Guided Tour" or "Skip" |
| 86 | Guided tour (5-step spotlight) | ✔ | Stage nav → swim lanes → trigger nodes → OTP nodes → right panel |
| 87 | Contextual coach marks (7 triggers) | ✔ | First node select, first switch, first 3+ warnings, first config tab, first empty canvas, first drag-insert split, first connection |
| 88 | Coach mark persistence | ✔ | sessionStorage — dismiss per session, reappear on refresh |
| 89 | Empty state helpers | ✔ | Empty Rules tab, empty History, empty library search, no validation issues |
| 90 | Keyboard shortcut overlay | ✔ | [?] button → 320px panel with grouped shortcuts |
| 91 | "Restart tour" chip | ✔ | Bottom-right, appears after tour completion |

### 1.11 Edge Case Handling

| # | Feature | Status | Notes |
|---|---|---|---|
| 92 | Zoom to 25%: nodes become colour blocks, labels hidden | ✔ | Connectors thin to 0.8px |
| 93 | Zoom to 200%: nodes reveal sub-labels and field counts | ✔ | |
| 94 | Node dragged to canvas edge: clamps to bounds (16px margin) | ✔ | |
| 95 | Cmd+A: select all nodes, right panel shows "N nodes selected" | ✔ | No multi-config — "click a single node to configure it" |
| 96 | Canvas panned so all nodes off-screen | ✔ | "Lost?" toast after 2s |
| 97 | Touch/pointer events for all drag interactions | ✔ | `pointerdown`/`pointermove`/`pointerup` throughout |
| 98 | Delete key with node selected | ✔ | Confirmation modal before deletion |

---

### Phase 1 — Explicitly Out of Scope

| # | Feature | Status | Reason |
|---|---|---|---|
| 99 | True undo/redo | ✘ | Requires centralized state store (Phase 2). Shows simulation toast: "Undo/Redo available in the full product." |
| 100 | Authentication / login | ✘ | No backend. Configurator identity is hardcoded (Rahul K). |
| 101 | Backend API integration | ✘ | All data local/in-memory. No server calls. |
| 102 | Database persistence | ✘ | JSON export to file only. No DB writes. |
| 103 | Multi-user real-time editing | ✘ | Phase 3. Single-editor lock is the Phase 1 pattern. |
| 104 | Journey execution engine | ✘ | The builder creates configurations. It does not run them. Execution is a separate system. |
| 105 | Live API calls (PAN verification, CKYC fetch, etc.) | ✘ | API Check nodes are configured, not executed. Responses are mocked. |
| 106 | Theme builder | ✘ | Separate scope owned by reportee. Excluded from this workstream. |
| 107 | Reviewer console / Back Office (M3) | ✘ | Deferred pending PM feedback. Separate product surface. |
| 108 | Mobile-native preview | ✘ | No dedicated mobile previewer. Responsive web only. |
| 109 | API Marketplace browsing | ✘ | Concrete API list not available in PRD. Node config uses hardcoded provider set. |
| 110 | Applicant-facing UI rendering | ✘ | Builder configures what applicants will see. It does not render the applicant experience. |
| 111 | Role-based access control (RBAC) | ✘ | No user management. All users have full access in simulation. |
| 112 | Audit trail (compliance-grade logging) | ✘ | History tab shows simulated edits. No tamper-proof log. |
| 113 | i18n / multi-language | ✘ | English only. |
| 114 | Analytics / usage telemetry | ✘ | No event tracking in simulation. |
| 115 | Webhooks / integrations config | ✘ | Action nodes have UI for webhook URL but no actual HTTP calls. |
| 116 | Export to PDF / PPTX | ✘ | No journey-to-document export. |
| 117 | Comment/annotation on canvas | ✘ | No collaborative annotation. |
| 118 | Branching / forking journeys | ✘ | No journey-level version branching (git-style). Linear version history only. |

---

## Phase 2 — Centralized State + Full Persistence

> **Goal:** Replace prop-drilling with a centralized store. Connect the frontend to a real persistence layer. Enable true undo/redo.

### 2.1 State Management

| # | Feature | Status | Notes |
|---|---|---|---|
| 119 | Centralized store (Zustand or Jotai — TBD) | ✔ | Single source of truth for graph, UI, validation, history |
| 120 | True undo/redo (command pattern) | ✔ | Max depth: 50. Covers all graph mutations. UI-only changes (zoom, pan) excluded. |
| 121 | Dirty state tracking | ✔ | Live state machine: any edit → dirty, save/auto-save → clean |

### 2.2 Backend Integration

| # | Feature | Status | Notes |
|---|---|---|---|
| 122 | Journey CRUD API | ✔ | Create, read, update, delete journeys via REST/GraphQL |
| 123 | Real auto-save (backend write) | ✔ | Debounced 30s after last edit. Replaces simulated toast with actual persistence. |
| 124 | Version history (real snapshots) | ✔ | Every save creates an immutable snapshot. Diff view between versions. |
| 125 | Revert to previous version | ✔ | Select snapshot → restore as new draft |
| 126 | Journey list / home screen | ✔ | CRUD operations on journeys. Grid or list view with status filters. |
| 127 | Draft → Published lifecycle (real) | ✔ | Backend-enforced state machine with validation gates |

### 2.3 Validation Enhancements

| # | Feature | Status | Notes |
|---|---|---|---|
| 128 | Cross-stage validation | ✔ | Stage 5 validates across all 5 stages, not just canvas |
| 129 | Dynamic output schema derivation | ✔ | Screen output keys computed from configured fields + API response fields |
| 130 | Stale reference auto-cleanup | ✔ | When a field is removed, downstream conditions offer "Remove reference" quick action |

### 2.4 Still Excluded in Phase 2

| # | Feature | Status | Reason |
|---|---|---|---|
| 131 | Multi-user editing | ✘ | Phase 3 |
| 132 | Authentication (SSO/RBAC) | ✘ | Phase 3 |
| 133 | Execution engine | ✘ | Separate system. Never in the builder. |
| 134 | Theme builder | ✘ | Parallel workstream |
| 135 | API Marketplace | ✘ | Still waiting on concrete API list from PM |
| 136 | Mobile-native preview | ✘ | Phase 4 |

---

## Phase 3 — Collaboration + Access Control

> **Goal:** Multiple configurators can work on journeys safely. Role-based access controls enforce who can edit vs. view vs. publish.

### 3.1 Collaboration

| # | Feature | Status | Notes |
|---|---|---|---|
| 137 | Edit locking (real, server-enforced) | ✔ | Replace simulated lock banner with backend lease system |
| 138 | Multi-user simultaneous editing | ✔ | Real-time cursors, operational transforms or CRDT-based conflict resolution |
| 139 | Presence indicators | ✔ | Avatars showing who is viewing/editing the journey |
| 140 | Comment/annotation on canvas | ✔ | Pin comments to nodes or canvas regions |
| 141 | Activity feed | ✔ | Real-time feed of changes: "Rahul added PAN Verification screen" |

### 3.2 Access Control

| # | Feature | Status | Notes |
|---|---|---|---|
| 142 | Authentication (SSO integration) | ✔ | SAML/OIDC for enterprise clients |
| 143 | RBAC: Configurator / Reviewer / Admin roles | ✔ | Configurator edits, Reviewer approves, Admin manages |
| 144 | Journey-level permissions | ✔ | Per-journey read/write/publish grants |
| 145 | Audit trail (compliance-grade) | ✔ | Tamper-proof log of all mutations with actor, timestamp, before/after |

### 3.3 Still Excluded in Phase 3

| # | Feature | Status | Reason |
|---|---|---|---|
| 146 | Execution engine | ✘ | Separate system |
| 147 | Mobile-native preview | ✘ | Phase 4 |
| 148 | API Marketplace | ⊘ | Depends on PM-provided API list |
| 149 | Branching / forking journeys | ✘ | Evaluating whether needed |

---

## Phase 4 — Preview, Testing & Marketplace

> **Goal:** Configurators can preview what applicants will see. API integrations are browsable and testable within the builder.

### 4.1 Preview

| # | Feature | Status | Notes |
|---|---|---|---|
| 150 | Web preview (responsive) | ✔ | Desktop + mobile viewport simulation within the builder |
| 151 | Mobile-native preview | ✔ | Pixel-accurate rendering of the applicant-facing screens |
| 152 | Journey walk-through mode | ✔ | Step through the journey as an applicant with test data |
| 153 | Conditional path simulation | ✔ | Choose branch paths to preview different flows |

### 4.2 API Marketplace

| # | Feature | Status | Notes |
|---|---|---|---|
| 154 | API directory (browsable) | ✔ | Catalogue of available verification APIs with descriptions, pricing, SLAs |
| 155 | One-click API integration | ✔ | Select API → auto-creates API Check node with correct config schema |
| 156 | API response testing | ✔ | Send test request with sample data, see response shape |
| 157 | API health monitoring | ✔ | Status indicators per API provider (up/degraded/down) |

### 4.3 Testing

| # | Feature | Status | Notes |
|---|---|---|---|
| 158 | End-to-end journey testing | ✔ | Run a full journey with synthetic applicant data |
| 159 | Validation coverage report | ✔ | "All branches tested" / "3 branches untested" per switch node |
| 160 | Test data generation | ✔ | Auto-generate PAN numbers, Aadhaar-format data, names per field type |

---

## Cross-Phase Feature Matrix

A quick-reference view of where major features land.

| Feature | Ph1 | Ph2 | Ph3 | Ph4 |
|---|---|---|---|---|
| **Canvas: drag, connect, delete, move** | ✔ | ✔ | ✔ | ✔ |
| **7 node types** | ✔ | ✔ | ✔ | ✔ |
| **Right panel property editor** | ✔ | ✔ | ✔ | ✔ |
| **Universal Condition Builder** | ✔ | ✔ | ✔ | ✔ |
| **Real-time validation** | ✔ | ✔ | ✔ | ✔ |
| **JSON export** | ✔ | ✔ | ✔ | ✔ |
| **Zoom / pan / minimap** | ✔ | ✔ | ✔ | ✔ |
| **ELK.js layout** | ✔ | ✔ | ✔ | ✔ |
| **Save draft** | ✔ | ✔ | ✔ | ✔ |
| **Templates** | ⏳ | ✔ | ✔ | ✔ |
| **Coach marks / guided tour** | ✔ | ✔ | ✔ | ✔ |
| **Keyboard shortcuts** | ✔ | ✔ | ✔ | ✔ |
| **True undo/redo** | ✘ | ✔ | ✔ | ✔ |
| **Backend persistence** | ✘ | ✔ | ✔ | ✔ |
| **Version history (real)** | ✘ | ✔ | ✔ | ✔ |
| **Authentication** | ✘ | ✘ | ✔ | ✔ |
| **RBAC** | ✘ | ✘ | ✔ | ✔ |
| **Multi-user editing** | ✘ | ✘ | ✔ | ✔ |
| **Audit trail** | ✘ | ✘ | ✔ | ✔ |
| **Comments / annotations** | ✘ | ✘ | ✔ | ✔ |
| **Mobile-native preview** | ✘ | ✘ | ✘ | ✔ |
| **API Marketplace** | ✘ | ✘ | ⊘ | ✔ |
| **Journey test runner** | ✘ | ✘ | ✘ | ✔ |
| **Execution engine** | ✘ | ✘ | ✘ | ✘ |
| **Theme builder** | ✘ | ✘ | ✘ | ✘ |

---

## Scope Boundaries — Things That Are Never In This Builder

These are explicitly separate systems. They are not deferred features — they are different products.

| System | Relationship to Journey Builder |
|---|---|
| **Execution Engine** | Consumes the JSON the builder exports. Runs the journey for real applicants. Completely separate runtime. |
| **Theme Builder** | Separate workstream owned by reportee. Accessed via a different entry point. The canvas builder does not render themes. |
| **Reviewer Console (Back Office / M3)** | Where compliance officers review submitted applications. Reads journey configuration but does not modify it. Deferred pending PM scope definition. |
| **Applicant-Facing SDK** | The mobile/web SDK that renders the journey to end-users. The builder configures what the SDK shows. The builder is not the SDK. |
| **Client Onboarding Portal** | Where GJKs, API keys, and client-level settings are configured. System-level, not journey-level. |

---

## PM-Blocked Items

These features are designed and ready to build but are waiting on specific PM deliverables.

| Feature | Blocked By | PM Owner | Impact |
|---|---|---|---|
| Auto-Decisioning outcomes (accept/reject/refer rules) | Auto-accept/auto-reject rule list | Paulomee | Stage 3 Post Checks page incomplete |
| API Check node: provider list | API Marketplace — concrete API catalogue | Paulomee / Product | Using hardcoded provider set (PAN, CKYC, UIDAI, AML) as interim |
| Back Office integration hooks | M3 scope definition | Paulomee | No reviewer-facing touchpoints designed |
| Switch node port cap (12 vs 20) | DISC-01 resolution | Paulomee | Currently designed for 12. If 20, needs "port overflow" pattern. |
| JSON logic mode for Switch nodes | Phase 1 or deferred? | Paulomee | Currently Rules-based only. JSON-based mode UI not designed. |

---

## Design Worklist Status (Phase 1)

Where every major design surface stands right now.

| Surface | Status | Dependency |
|---|---|---|
| Node shape system (all 7 types, all states) | ✔ Designed | — |
| Port & connection interaction design | ✔ Designed | — |
| Badge system (status, rule, type) | ✔ Designed | — |
| Switch node detailed design (2–12 ports) | ✔ Designed | Port cap resolution needed for >12 |
| Canvas shell layouts (Shell B + C) | ✔ Designed | — |
| Auto-layout topologies (linear, single switch, nested) | ✔ Designed | — |
| Minimap + zoom controls | ✔ Designed | — |
| Drag-to-canvas interaction | ✔ Designed | — |
| Output port "+" creation menu | ✔ Designed | — |
| Connection drawing interaction | ✔ Designed | — |
| Right panel redesign (tabs, context switch) | ✔ Designed | — |
| Condition builder in right panel | ✔ Designed | — |
| Switch node configuration panel | ✔ Designed | — |
| Validation nudge system | ✔ Designed | — |
| Empty canvas + first-node experience | ✔ Designed | — |
| Child journey compound node | ✔ Designed | — |
| Full canvas mockup (happy path) | ✔ Designed | — |
| Stage 1: Trigger Definition | ✔ Designed | — |
| Stage 3: Post Checks | ◐ Partial | Auto-decisioning rules ⊘ blocked |
| Stage 4: Meta Data | ⏳ Scaffolded | — |
| Stage 5: Validate & Publish | ✔ Designed | — |
| Component inventory & Figma handoff | In progress | — |
| GJK key taxonomy | ◐ Partial | Expected revisions from PM |
| Operator matrix per data type | ◐ Partial | Expected revisions from PM |

---

## Changelog

| Date | Change | Author |
|---|---|---|
| 2026-07-13 | Initial document created from accumulated scope decisions | Design |
| — | — | — |

---

> **How to Use This Document**
>
> Before building anything, check this doc. If the feature is ✘ for your current phase, stop. If it's ⊘, check the PM-Blocked Items table. If it's ✔, check PROJECT_ARCHITECTURE.md for how to build it.
>
> Before adding a feature to scope, add it here first with a phase assignment and get team agreement. Scope creep happens one unmarked feature at a time.
