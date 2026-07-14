# AI_IMPLEMENTATION_RULES.md

## Purpose

Governs how implementation work proceeds in this repository. These rules apply to every future workflow implementation (WF01, WF02, ...) and every architectural change. See `SOURCE_OF_TRUTH.md` for which document wins when sources disagree.

---

### 1. Never implement directly from assumptions

Always read, in order:

```
Workflow Contract
    ↓
Workflow Diagram
    ↓
Reference HTML
```

before writing code. If a lower-priority doc (Canvas Component Inventory, Design System) is needed to fill a gap the above three don't cover, read it too — but the three above take precedence per `SOURCE_OF_TRUTH.md`.

---

### 2. Workflow Contracts are executable specifications

Every workflow contract should completely describe:
- nodes
- configs
- inspector
- variables
- rules
- navigation
- runtime
- acceptance

No behaviour should exist only in code. If code implements a behavior not described in the contract, either the contract is incomplete (fix the contract) or the behavior shouldn't exist (fix the code).

---

### 3. Never hardcode workflow logic

No:
```ts
if (node.type === 'Consent') { ... }
switch (node.type) { ... }
```

Everything node-type-specific comes from schemas (`INodeSchema`, `IInspectorSchema`, `IRuleSchema`, `IVariableSchema`) attached to that type's registration. Generic code iterates over schema data; it never branches on a specific type string.

---

### 4. The framework becomes more generic with every workflow

WF02 should require **less** framework work than WF01. WF03 less than WF02. Eventually, new workflows should mostly require documentation plus schema registration — not new framework code.

If implementing a new workflow requires framework changes, ask: is this a genuinely new capability the schema system doesn't yet support, or a symptom of the previous workflow's schema being too narrow? Prefer widening the schema over adding a one-off code path.

---

### 5. Business behaviour belongs inside node schemas

Do **not** create canvas nodes for implementation details.

**Correct:**
```
Consent Screen
  contains: validation, enable CTA, create consent URL
```

**Incorrect** (unless explicitly defined as separate nodes by the workflow contract):
```
Validation Node
Enable CTA Node
Generate URL Node
```

If a workflow contract's node inventory doesn't list something as its own node, it isn't one — it's a behavior inside a node's schema.

---

### 6. Canvas nodes are authoring primitives; runtime actions are implementation behaviour

Do not confuse the two. A canvas node is something a Product Manager places and connects while authoring a journey. Runtime behavior (an API call firing, an SMS being sent, a poll happening) is what that node *does* when the journey executes — it is described in the node's schema (`runtime` section) but is not itself a separate authorable node unless the contract says so.

---

### 7. Every node must define, before implementation

- Purpose
- Inspector Schema
- Runtime
- Rules
- Variables
- Ports
- Validation
- Capabilities
- Acceptance

If a node contract in a workflow document is missing one of these, resolve it by reading the contract more carefully or checking sibling nodes' patterns before inventing one from scratch (see rule 9).

---

### 8. Every implementation milestone follows this sequence

```
Read documentation
    ↓
Review implementation
    ↓
Implementation plan
    ↓
Approval
    ↓
Implementation
    ↓
Build
    ↓
Lint
    ↓
Playwright verification
    ↓
Stop
```

Never continue automatically past "Stop." Never skip verification. Never batch multiple milestones' worth of implementation into one pass.

---

### 9. Resolving documentation ambiguity

Whenever documentation ambiguity is found, **do not ask immediately**. First attempt to resolve it by:

1. Reading higher-priority docs (per `SOURCE_OF_TRUTH.md`).
2. Checking workflow contracts for an explicit answer.
3. Checking architecture docs for an existing decision.
4. Documenting the resolution (update the lower-priority doc with a note, or add a Decision Log entry if architecturally significant).

Only ask the user if the ambiguity **changes business behaviour** — i.e., the resolution would materially change what the product does, not just an internal implementation detail, a visual styling conflict resolvable via `SOURCE_OF_TRUTH.md`, or a naming/structural question with an obvious answer from context.
