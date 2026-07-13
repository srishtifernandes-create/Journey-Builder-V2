# Canvas Redesign — Component Inventory
### Figma construction checklist & engineering handoff reference

> **Scope:** Every new component introduced by the canvas redesign (nodes, ports, connections, badges, toolbar, minimap, node library, creation menu, right panel, empty state).
> **Naming convention:** `Category/Type/Variant/State`, applied consistently with prior canvas artifacts in this project (this pattern is not itself a literal rule from `Design_System.md` — it is layered on top of that document's token/typography/spacing/radius system for Figma component-library organization).
> **Token source of truth:** `Design_System.md` — all color tokens referenced here by name only (no hex), typography by role name (§1.1), spacing by token (§1.3), radius by context (§1.4).
> **Known internal spec inconsistency (flagged, not resolved):** Decision-node port placement differs between two source files — `Canvas Node Types — Journey Builder.html` places Yes/No ports on the **bottom edge at 22%/78%** width, while `Port-to-Port Connection Drawing.html` places them on the **right edge at top:34%/66%**. The latter is recommended as canonical (it's consistent with every other node type's right-edge output convention) but this is a design decision to confirm with the team before Figma construction, not something this document silently picks for you.

---

## 1. `Canvas/Node/Screen`

**Dimensions:** `180px` width × `min-height: 72px` (grows with content)
**Radius:** `12px` (Cards, §1.4)

**States:**
| State | Treatment |
|---|---|
| Default | `1px solid Neutral-50` border, white fill |
| Hover | Border → `Neutral-100`; output port grows `6px → 10px`; "+" affordance fades in below output port after 100ms delay |
| Selected | `1.5px solid Primary-500` border + `box-shadow` (Selected shadow token); scale `1.0 → 1.02` over 80ms |
| Drag | `cursor: grabbing`; `opacity: 0.92`; shadow; `z-index: 100`; other connected ports pulse faintly (still-wired indicator); connectors redraw every animation frame |
| Error (orphaned) | `3px solid Destructive-500`, **top edge only** |
| Error (dead-end) | `3px solid Destructive-500`, **bottom edge only** |
| Error (general) | `3px solid Destructive-500`, **full border** |
| Incomplete | `3px solid Warning-500`, **left edge only** |
| Unreachable | `opacity: 0.5` + grey "Unreachable" badge |

**Color tokens:** Neutral-50 (border, rest), Neutral-100 (border, hover), Primary-500 (border, selected), Destructive-500 (error variants), Warning-500 (incomplete)
**Typography:** Body (14px/500) for node title, Metadata/small (12px/500) for type sub-label
**Spacing:** space-12 internal padding, space-4 icon-to-label gap in badge row
**Interaction:** Click selects + opens right panel. Drag repositions on canvas (pointer events, not mouse-only). Double-click has no special behavior on this node type.
**Figma note:** Build as an auto-layout frame with a fixed 180px width and `hug` height; badges live in a nested auto-layout row (`Canvas/Badge/*` instances) with `4px` gap; port instances are absolutely-positioned children, not part of the auto-layout flow.

---

## 2. `Canvas/Node/Decision`

**Dimensions:** `148px × 60px`, hexagon via `clip-path` with a `13px` inset on each corner-cutting edge
**Radius:** N/A (hexagon clip-path, not a radius-based shape)

**States:** Same Default/Hover/Selected/Drag/Error/Incomplete/Unreachable state set as `Canvas/Node/Screen`, applied to the hexagon shape.
**Special treatment:** YES/NO port labels are **always visible** (not hover-only) — "YES" in `Success-600`, "NO" in `Destructive-600`, positioned adjacent to their respective ports.
**Color tokens:** Success-600 (YES label), Destructive-600 (NO label), plus standard node border/state tokens above.
**Typography:** Body (14px/500) for condition text, Small bold (12px/700) for YES/NO labels.
**Port positions:** ⚠️ See the flagged inconsistency at the top of this document. Canonical recommendation: input port left-center; YES output right edge at `top: 34%`; NO output right edge at `top: 66%`.
**Figma note:** Construct the hexagon as a vector shape (not CSS clip-path, which has no Figma equivalent) — use a boolean-subtract of two triangles from a rectangle, or a custom vector path matching the 13px corner inset.

---

## 3. `Canvas/Node/APICheck`

**Variants:** `api` (generic API Check), `uidai`, `biometric`
**Dimensions:** `180px × min-72px` (same footprint as Screen node)
**Radius:** `12px`

**Distinguishing treatment:** `3px` left accent bar — `Primary-500` for API Check, `Success-500` for UIDAI/Biometric.
**States:** Same Default/Hover/Selected/Drag/Error/Incomplete/Unreachable set as Screen node, with state-border rules applying to the outer node border (the left accent bar is independent of state and always shows).
**Color tokens:** Primary-500 or Success-500 (accent bar per variant), plus standard state-border tokens.
**Typography:** Body (14px/500) title, Metadata/small (12px/500) provider label.
**Interaction:** Same click-to-select/drag behavior as Screen node.
**Figma note:** Accent bar is a separate rectangle layer pinned to the left edge, `3px` wide, full node height, sitting beneath/inside the card radius (clip to parent's rounded corners so the bar's top/bottom corners inherit the 12px radius on that side).

---

## 4. `Canvas/Node/Action`

**Dimensions:** `160px × 56px`, pill shape
**Radius:** `28px` (half of height — full pill, consistent with the Badge radius convention of 20px scaled up for this larger element)

**States:** Default/Hover/Selected/Drag/Incomplete apply; Action nodes are not subject to the orphan/dead-end error states in the same way as flow-screens (documented behavior: Action nodes execute inline and don't have the same "reachability" semantics) — confirm with PM/eng whether Error states still apply structurally (e.g., if genuinely orphaned).
**Color tokens:** Same border-state tokens as other nodes.
**Typography:** Body (14px/500).
**Figma note:** Build as a pill auto-layout frame (`radius: 28px`), icon + label horizontal layout, single input/output port pair only (no branching ports).

---

## 5. `Canvas/Node/Switch`

**Dimensions:** `224px` fixed width (never changes, even at 12-branch stress state) × variable height (`header + N × 40px rows + default/fallback row`)
**Radius:** `12px`

**Anatomy:**
- Header: icon + "SWITCH" label + N-paths count badge
- Source row (the field being evaluated)
- Branch rows: `40px` each, standard; **`4.5px` dense variant** kicks in as rows approach the 12-branch max, with font shrinking to `10px/500`
- Dashed default/fallback row (always last)

**Port formula:** `port_y = node_top + header_height + (row_index × row_height) + (row_height / 2)` — each branch row owns its own port at its own row's vertical center (critical anti-stacking rule: ports are positioned relative to their row, never absolutely stacked by index alone).

**States:**
| State | Treatment |
|---|---|
| Configured | Standard badge treatment, no warning |
| Partially configured | Warning-tinted badge on unconfigured branch rows |
| Missing default path | Distinct warning badge + tooltip on the fallback row specifically |
| Selected | Badge turns **Primary-500 filled** (distinct from other node types' border-only selected state) |
| 12-branch stress | Row height compresses to dense (`4.5px` variant... note: likely a compressed row *padding* value, not a literal 4.5px row height — flag for confirmation against source), "+Add branch" disables with tooltip |

**Color tokens:** Primary-500 (selected badge fill), Warning tokens (partial/missing-default states).
**Typography:** Body (14px/500) standard rows, dense-state override to 10px/500 at high branch counts.
**Interaction:** Branch rows are drag-to-reorder **inside the Switch Config Panel**, and that reorder syncs live to the canvas port positions in real time — this panel↔canvas sync is called out in the source as "the critical sync between panel and canvas." Remove-branch has a confirm tooltip and is blocked below 2 branches. Add-branch disables at 12.
**Figma note:** Because port position is a function of row index, build the Switch node as a component with as many boolean branch-row variants as needed (2 through 12), OR document the port-position formula directly in the component's dev-mode annotation so engineering can confirm it's implemented as row-relative, not index-absolute.

---

## 6. `Canvas/Node/ChildJourney` (collapsed)

**Dimensions:** `200px × 80px`
**Radius:** `12px` outer

**Anatomy:** Double border — `1px solid Neutral-40` outer + `2px dashed Primary-200` inner, inset `4px`. Stacked-card shadow via two pseudo-elements offset `+3px`/`+6px` to suggest depth (documented as the "stack-ghost" effect).
**Content:** Kind label ("Child Journey"), journey name, screen-count badge, Dependent/Independent chip, hover hint "↕ Double-click to expand" (appears after 300ms hover delay).
**States:** Adds a **Not-Configured** state showing an amber "Not started" badge, on top of the standard state set.
**Color tokens:** Neutral-40 (outer border), Primary-200 (inner dashed border), Warning tokens (Not-Configured badge).
**Figma note:** The two stack-ghost pseudo-elements need to be real duplicate rectangle layers behind the main card in Figma (no pseudo-element equivalent) — offset `+3px, +3px` and `+6px, +6px`, lower opacity, sent to back.

---

## 7. `Canvas/Node/ChildJourney` (expanded)

**Dimensions:** grows outward from collapsed footprint on expand (exact expanded dimensions are canvas-content-dependent — inner sub-canvas sized to fit its 5 inner nodes at 80% scale)
**Animation:** Phase 1 (0–100ms): scale `1.0 → 1.06` ease-out. Phase 2 (100–300ms): card expands outward; canvas dims via a `rgba(15,23,42,0.05)` overlay fading in over 200ms; inner sub-canvas appears with a smaller dot-grid background.
**Inner canvas scale:** Inner nodes render at **80% scale** of the standard node size.
**Figma note:** Build collapsed and expanded as two separate component variants (Figma can't natively animate a scale-expand transition) — engineering implements the actual transition; Figma's job is to spec both end-states precisely, plus a note on the 0.05-opacity dim overlay treatment.

---

## 8. `Canvas/Port/Input`

**Base:** `8px` diameter, `1.5px Neutral-100` ring, positioned left-center on standard nodes (`node_top + height/2`), or per the node-type-specific port table (Decision, Switch, Terminal have their own formulas).

**State machine:**
| State | Size | Treatment |
|---|---|---|
| Default | 8px | 1.5px Neutral-100 ring |
| Hover | 12px | Primary-500 ring; tooltip "Input · [Node name]" after 130ms delay |
| Connected | 4px | Filled Primary-500, no ring |
| Valid-Target (during drag) | 10px | Success-500 ring, `0 0 0 3px rgba(26,122,30,0.18)` glow, pulses scale `1.0 → 1.3 → 1.0` over 0.8s infinite |
| Snap (drop imminent) | 14px | Filled Success-500; ring expands to 6px; separate 22px snap-ring pulses on a 0.9s loop |
| Invalid-Target | — | Destructive-500 ring, no fill, **does not pulse** (visually distinct from Valid-Target's pulsing so PMs can tell the difference from a static glance) |
| Error-Orphaned | 6px | Destructive-500 ring + halo |

**Color tokens:** Neutral-100 (default ring), Primary-500 (hover/connected), Success-500 (valid-target/snap), Destructive-500 (invalid/orphaned).
**Figma note:** Build each state as a separate component variant on a shared `Canvas/Port/Input` component set — the pulsing/glow states need a dev-mode note pointing to the exact animation-timing values above since Figma prototyping can't losslessly express infinite CSS keyframe loops.

---

## 9. `Canvas/Port/Output`

Same state machine and token set as `Canvas/Port/Input`, positioned right-center on standard nodes (or per node-type-specific formulas — Decision's Yes/No, Switch's per-row ports, Action/API-check single output). Tooltip text differs: "Output · [Node name]".

**Figma note:** Model as a variant of the same component set as Input where feasible (shared visual language, different position/tooltip-text), to keep the Figma library from duplicating the entire state machine twice.

---

## 10. `Canvas/Connection/Default`

**Rendering:** SVG bezier path between an output port and an input port.
**States:**
| State | Treatment |
|---|---|
| Default (settled) | `Neutral-100` stroke |
| During-drag (new connection) | Dashed, animated "marching ants" — `stroke-dasharray: 6 5`, offset animates `0 → -11` over 0.5s linear infinite; follows cursor until hovering a valid target, then snaps to a solid green preview |
| Hover (existing connection) | Thickens to `2.5px`, tints `Primary-200` |
| Selected for delete | Shows a `×` delete pill at the connector's midpoint — `24px`, `Destructive-500` background; second click on the pill removes the connection |
| New connection draw-in | `stroke-dashoffset` animates from total path length → 0 over 420ms `cubic-bezier(0.3, 0.8, 0.4, 1)`, then settles to Neutral-100 stroke over 500ms |

**Color tokens:** Neutral-100 (settled), Primary-200 (hover thicken), Success-500 (valid-drag-target solid preview), Destructive-500 (delete pill).
**Figma note:** Static states (settled, hover-thickened, delete-pill-active) can be built as Figma components; the marching-ants and draw-in animations are implementation-only — document the exact timing values in dev-mode notes rather than attempting to fake them with a static Figma animation.

---

## 11. `Canvas/Connection/Conditional`

Used specifically for Switch-node branch connections. Same base rendering as `Canvas/Connection/Default`, with branch-specific coloring at the port end: `.cport.branch-yes` / `.branch-no` / `.branch-default` classes color-code which branch a given wire belongs to at a glance (documented only in `Canvas Auto-Layout Engine.html` — confirm this coloring convention is intended to ship broadly or was an auto-layout-diagram-only affordance before including it in the production component library).

**Figma note:** Flag this one to engineering/design as needing confirmation — it may be diagram-only sugar rather than a shipped interaction affordance.

---

## 12. `Canvas/Badge/Status`

**Base primitive:** `.nb` — `20px` height, `0 8px` padding, `20px` radius (full pill), `11px/500` text, `4px` icon-to-label gap (space-4).

**Variants:**
| Variant | Background | Text | Icon |
|---|---|---|---|
| Complete | Success-100 | Success-600 | 10×10px checkmark SVG (stroke-only, inherits text color) |
| Incomplete | Warning-opacity-10% + `1px Warning-opacity-30%` border | Warning-700 | none |
| Error | Destructive-100 | Destructive-600 | 10×10px triangle-alert SVG (stroke-only) |
| Not started | Neutral-40 | Neutral-200 (text-muted) | none |

**Priority rule:** Status **always occupies slot 1** — never overflows, regardless of what else is competing for badge space.
**Typography:** Metadata/small (11px/500, close to the 12px/500 Metadata role but the badge system uses its own compacted 11px tier — confirm with design whether this should formally align to the 12px Metadata token or stays as a documented exception for badge-scale text).
**Figma note:** Build as a component set with a `variant` property (Complete/Incomplete/Error/NotStarted) — icon visibility toggles per variant via a boolean layer, not a swapped instance, since only 2 of 4 variants carry an icon.

---

## 13. `Canvas/Badge/Rule`

**Base:** `.nb` + `.nb-rule` — same 20px/pill/11px-500 base as Status.
**Color tokens:** Primary-50 background, Primary-600 text (light); dark-theme override to a translucent Primary tint with a lighter text tone.
**Icon:** Varies by rule sub-type — a 3-line filter/list glyph for condition-count badges, a checklist glyph for post-check-count badges, or no icon for a truncated dependency-preview string (e.g. "Depends on: PAN → Verified", `max-width: 150px` with ellipsis truncation).
**Priority rule:** Slot 2, shown **only when logic is attached** to the node.
**Figma note:** Since label content varies (count vs. truncated string), build as a single component with a text-override property rather than per-content variants; add both icon options as swappable boolean layers.

---

## 14. `Canvas/Badge/Type`

**Base:** `.nb` + `.nb-type` (light surface) or `.nb-type-oninverse` (dark surface, used on the black API-check card).
**Color tokens:** Neutral-30 bg / Neutral-50 border / Neutral-300 text (light surface); translucent white bg/border with a light gray text tone (dark/inverse surface).
**Icon:** None — text-only in both variants.
**Priority rule:** Slot 2, **only when no Rule badge is present**; otherwise this badge is the one that gets pushed to overflow.
**Deprecation note:** An older `.type-badge` class (Primary-50 tint, 600-weight text) exists in an earlier prototype file and is explicitly superseded — do not use the Primary-50 tint for Type badges; that tint now belongs exclusively to Rule badges to avoid the two categories visually colliding.
**Figma note:** Build both surface variants as one component set with a `surface: light/dark` property.

---

## 15. `Canvas/Badge/Overflow`

**Base:** `.nb` + `.nb-overflow` — transparent background, `1px Neutral-50` border, Neutral-200 text, **600-weight** (the one deviation from the system's standard 500 weight for badges).
**Content:** "+N" or "+N more" (both forms appear in source mockups without one being canonicalized — pick one for production and document it).
**Behavior:** Catches every badge beyond the 2-slot limit. Click opens the right panel's full badge list (not a hover tooltip — confirmed no CSS hover-tooltip exists in source, only a click-to-reveal-in-panel interaction).
**Figma note:** This is effectively a 3rd badge slot visually but semantically a "there's more" indicator — keep it visually distinct (no icon, bolder text, unfilled background) so it doesn't read as a 4th badge category.

---

## 16. `Canvas/Toolbar/ZoomControls`

**Container:** `.tb-group` — grouped button cluster, positioned top-left of canvas.
**Buttons:** `32×32px` each — zoom out / zoom-display / zoom in / fit-to-view, plus a second group: reset-layout / undo / redo (stub) / keyboard-shortcuts.
**Zoom display:** Editable input (confirmed canonical over an older read-only div variant) — click resets to 100%, same as `⌘1`. Range `25%–200%`, `±10%` per click, `±5%` per scroll-wheel tick (anchored to cursor position).
**States:** Each button has a tooltip on hover; overflow menu (`⋮` icon) exposes Clear canvas / Export PNG (stub) / Journey settings (stub).
**Color tokens:** Standard button/icon-button tokens (Neutral-200 icon default, Primary-500 on hover/active per system convention — confirm against the actual button component in §3.1 of Design_System.md).
**Figma note:** Build the toolbar as a horizontal auto-layout bar with two nested `.tb-group` auto-layout clusters, `8px` gap between groups (space-8).

---

## 17. `Canvas/Minimap`

**Collapsed state:** "Map" pill chip, `32px` height, bottom-right positioned.
**Expanded state:** `160×120px`, scale-in + fade over 150ms.
**Node rendering:** Proportional rectangles, color-coded by type — Screen (Primary-200), Decision (Neutral-200), API Check (Success-200), Switch (Warning-200), Child Journey (Purple-200/Primary-100 — confirm exact token, source lists both), Terminal (Neutral-100).
**Viewport rect:** Draggable, `1.5px Primary-500` border, `12%` opacity fill. Real-time 1:1 tracking while dragging (no easing); click-to-pan elsewhere on the minimap uses `200ms` ease.
**Collapse:** Via a `×` button on the expanded panel.
**Figma note:** Build collapsed/expanded as two variants of one component; the node-color-coding needs its own small internal legend or at minimum a dev-mode note mapping each node type to its minimap color, since this mapping doesn't otherwise appear anywhere else in the system.

---

## 18. `Canvas/NodeLibrary/Category`

**Structure:** Collapsible section — canonical class `.lib-cat` (supersedes an older `.nl-cat`). Categories: Screens, Verification, Logic, Flow.
**Default collapse state:** All collapsed except Screens (distinct from the Inline Creation Menu, which defaults all categories expanded — see item 20).
**Typography:** Section heading style (14px/600) per §1.1, uppercase.
**Figma note:** Build as an auto-layout frame with a chevron-rotate expand/collapse interaction (standard accordion pattern, consistent with §3.5 Accordion Sections in Design_System.md).

---

## 19. `Canvas/NodeLibrary/Item`

**Structure:** `.lib-item` (canonical, supersedes `.nl-item`) — icon + label row, draggable.
**Drag lifecycle (full spec):** hover → mousedown produces a ghost element + dims the source item → dragging over canvas shows a dropzone indicator → dragging over an existing connection shows an insert-indicator (splits the connection) → valid drop scales the new node in, auto-opens the right panel, and triggers an orphan check → invalid drop **on** another node snaps back with a toast → drop outside the canvas silently snaps back (no toast).
**Search:** Live filter with a clear button; explicit "no results" empty state.
**Figma note:** The drag-ghost and dropzone-indicator states need to be built as separate overlay components (not states of the Item component itself), since they render on the canvas, not in the library list.

---

## 20. `Canvas/CreationMenu`

**Dimensions:** `220px` wide, `max-height: 320px`, scrollable.
**Shadow:** Explicitly called out in source as **"the one spec exception that gets a shadow"** — every other component in this system avoids decorative shadows per §1.5's border-only elevation rule; this menu is a deliberate, documented exception.
**Search field:** `34px` height.
**Categories:** Same 4 categories as the Node Library, but **all expanded by default** here (vs. collapsed-except-Screens in the library sidebar) — this is an intentional default-state difference between the two surfaces, not an inconsistency to fix.
**Keyboard nav:** `↓`/`↑` move selection, `Enter` selects, `Escape` dismisses, `Tab` wraps.
**Trigger sources:** Either the node "+" affordance or a wire-release-on-empty-canvas (when that toggle is on). Dismiss-without-selecting behavior differs by trigger: a wire-release-triggered menu fades the in-progress wire on dismiss; a "+"-triggered menu just closes.
**Figma note:** Because this is the one shadow-bearing component, give it its own elevation token (e.g. `--shadow-menu`) rather than reusing the Modal shadow token, even if the values happen to match — keeps the "only these two things get shadows" rule auditable in the token file.

---

## 21. `Panel/Header/NodeContext`

**Height:** `55px`.
**Anatomy:** Generic icon slot (icon swapped via an `IC[iconKey]` lookup keyed by node type — one shared icon-slot component rather than one bespoke header per node type), node name, status badge, Save button, `×` close.
**Save button states:** disabled (no unsaved changes) → active (unsaved) → spinner (saving) → "Saved ✓" (transient) → back to disabled.
**Node-switch behavior:** Updates in place with an **80ms cross-fade** — the panel itself never closes when the user clicks a different node; only the explicit `×`, a background click, or Escape closes it.
**Figma note:** Build the icon slot as a component-swap–driven instance so changing the bound node type in a dev-mode variable swaps the icon without needing a separate header component per node type.

---

## 22. `Panel/Tab/Config` / `Panel/Tab/Rules` / `Panel/Tab/History`

**Tab bar:** `.cp-tabbar` / `.cp-tab`, instant content swap (no transition) between tabs.
**Config tab:** Per-node-type field sets (Screen: Page Details + Access & Visibility + read-only Fields list; API Check family: Provider badge + Execution timing + Retry stepper + On-failure dropdown; Decision: single capped condition row + read-only Yes/No targets; Terminal: read-only summary + fabricated stats; Action: action-type dropdown + target input; Child Journey: name + Dependent/Independent toggle + read-only screen count).
**Rules tab:** Full Universal Condition Builder — empty state with collapsible examples, condition rows with source/field/operator/value, AND/OR joiner pills, nested groups (max 2 levels), live plain-English preview, 10-condition cap.
**History tab:** Fabricated chronological log rows (avatar + action + timestamp), "View full history →" stub, empty state for new nodes.
**Figma note:** Each tab's content area should be its own frame/component so engineering can literally swap frames on tab-click rather than trying to animate between drastically different field layouts.

---

## 23. `Panel/ValidationSummary` (Journey Overview / Shell B)

**Trigger:** Shown when no node is selected.
**Anatomy:** Issue-count chip row (clickable filters) → grouped node list by status (Errors / Warnings / Incomplete / Complete-collapsed) → filter pill row → per-row "Go to" action → empty "Journey looks good!" state when no issues exist.
**Figma note:** Build the grouped list as a set of repeating list-item components under labeled section headers, with the whole panel having two top-level states (has-issues / all-clear) rather than trying to force one component to cover both.

---

## 24. `Canvas/EmptyState`

**Trigger:** "Clear canvas" action (behind a confirmation modal warning it can't be undone).
**Anatomy:** Centered dashed 3-node outline illustration at `0.5` opacity, heading + subtext + primary "+ Add Welcome Screen" button.
**Sequencing:** Pulsing library grip on the "Welcome Screen" item (stops after the first node is placed) → first-node-placed state shows an oversized "+" (`28px` vs. the standard `20px`) labeled "Add next screen," which dismisses itself after the 2nd node is added → a dismissible coach mark on the auto-opened right panel, persisted via `sessionStorage`.
**Figma note:** This is really 3 sequential states (true-empty / first-node-placed / normal) — build as 3 variants of one component set rather than one component with too many conditional layers.

---

## Cross-cutting notes for engineering handoff

1. **Badge slot-priority ladder** (documented once, applies to every node type that carries badges): max 2 visible badges — Status always wins slot 1; Rule wins slot 2 if present; otherwise Type takes slot 2; everything else collapses into the Overflow chip.
2. **Only two components in this entire system use a decorative shadow**: the Inline Creation Menu (§20) and the Active Stage Card (per `Design_System.md` §1.5). Every other elevation cue is border-only. Treat any other shadow appearing in implementation as a bug, not a stylistic choice.
3. **Decision-node port-position inconsistency** (flagged at the top of this document) needs a design decision before Figma construction locks in a canonical value.
4. **Switch-node port-per-row formula** is the one interaction in this inventory where panel state (branch order) and canvas state (port position) must stay synced live — call this out explicitly in engineering handoff as it's the most failure-prone interaction in the set.
5. Two legacy/deprecated class names were found and intentionally excluded from this inventory in favor of their canonical replacements: `.type-badge` → `.nb-type` / `.nb-type-oninverse`; `.nl-cat`/`.nl-item` → `.lib-cat`/`.lib-item`; a legacy read-only `.canvas-zoom` div → the editable `.canvas-zoom input`. If any of these old names still appear in a live codebase, they should be treated as needing migration, not as an alternate valid implementation.
