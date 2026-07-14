# SOURCE_OF_TRUTH.md

## Purpose

This document is the canonical decision hierarchy for the repository. Whenever two sources of information disagree — a workflow contract and the code, a diagram and a design doc, a reference HTML and a component inventory — this hierarchy decides which one wins.

Every implementation decision must trace back to this order. When a conflict is found, resolve it using this hierarchy and record the resolution (see `AI_IMPLEMENTATION_RULES.md` §9) rather than guessing or asking by default.

---

## Documentation Hierarchy

### Priority 1 — Workflow Contracts

`docs/workflows/WF_xx/*`

Defines:
- business behaviour
- runtime
- rules
- variables
- inspector schema
- node inventory
- acceptance criteria

If any implementation differs from a workflow contract, **the workflow contract wins**.

---

### Priority 2 — Workflow Diagram

PNG / Mermaid, shipped alongside each workflow contract (e.g. `WF01_canvas_reference.png`).

Defines:
- orchestration
- execution order
- branching
- navigation
- runtime transitions

The diagram must match the workflow contract. If it doesn't, Priority 1 wins and the diagram is treated as stale until corrected.

---

### Priority 3 — Reference HTML

`docs/references/htmls/`

Defines:
- node anatomy
- spacing
- interaction states (hover, selected, collapsed, error, incomplete)
- badges
- ports
- visual hierarchy

The HTML is the implementation reference for canvas rendering. On any visual-composition conflict, **HTML wins over the Canvas Component Inventory and the Design System**.

---

### Priority 4 — Canvas Component Inventory

`docs/design/Canvas_Component_Inventory.md`

Defines:
- reusable component catalogue
- node categories
- component responsibilities

If it conflicts with the Reference HTML on visual composition, **HTML wins**. The Inventory remains authoritative for anything the HTML doesn't cover (e.g. component naming, category-to-component mapping, behavioral responsibilities not expressed visually).

---

### Priority 5 — Design System

`docs/design/Design_System.md`

Defines:
- typography
- spacing scale
- radii
- shadows
- colours
- elevations
- icons

Never overrides workflow behaviour. Acts as the non-conflicting baseline (fonts, tokens, elevation rules) underneath Priorities 1–4.

---

### Priority 6 — Existing Source Code

The current implementation is **not** a source of truth. It is merely today's implementation.

Whenever implementation differs from higher-priority documentation, **implementation must be changed** — not the other way around, and not the documentation.

---

## Applying the Hierarchy

When a conflict is found between two sources:
1. Identify which priority tier each source belongs to.
2. The higher tier (lower number) wins outright.
3. Within the same tier, prefer the more specific document (a workflow-specific contract over a general architecture doc) unless stated otherwise above.
4. Record the resolution where the conflict was found — either inline as a comment/note in the lower-priority doc pointing to the winning source, or as a Decision Log entry if the resolution is architecturally significant (see `decision_log.md`).

This hierarchy itself is Priority 0 in the sense that it governs how all other priorities are read — if this document is ever unclear, escalate to the user rather than resolving silently, per `AI_IMPLEMENTATION_RULES.md` §9.
