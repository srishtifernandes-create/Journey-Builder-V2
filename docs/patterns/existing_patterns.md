# UX Patterns — Journey Builder

> Internal reference. Every rule here is derived from shipped screens or approved Figma frames.
> If a pattern isn't in this doc, it doesn't exist in JB yet. Don't invent one — escalate to design.
>
> **Figma source:** `Journey-Builder` (`ogfjMNvPjkuy4DcCnpGKSs`)
> **Last verified:** July 2026

---

## 1. Layout Shells

JB uses exactly three shell configurations. Every screen maps to one of them. There is no fourth option.

### Shell A — Lifecycle View

```
┌──────┬──────────────┬─────────────────────────────────┐
│      │              │                                 │
│ 52px │   396px      │        fills remaining          │
│ side │   stage      │        stage-specific           │
│ bar  │   panel      │        content area             │
│      │              │                                 │
└──────┴──────────────┴─────────────────────────────────┘
```

- Stage panel width is **396px** including 16px horizontal padding. Inner content width is 364px.
- Content area has **60px** horizontal padding from the panel edge.
- Stage panel scrolls independently. Content area scrolls independently.
- No right panel ever appears in Shell A.

### Shell B — Flow Editor (no page selected)

```
┌──────┬─────────┬──────────────────────────────────────┐
│      │         │                                      │
│ 52px │  286px  │           canvas                     │
│ side │  page   │                                      │
│ bar  │  list   │                                      │
│      │         │                                      │
└──────┴─────────┴──────────────────────────────────────┘
```

- Page list panel width is **286px**. No horizontal padding on the panel container itself; items inside use 16px left margin.
- Canvas fills remaining width.
- Zoom controls sit at canvas top-right. Shortcut hints sit at canvas bottom-left. Zoom percentage sits at canvas bottom-right.

### Shell C — Flow Editor (page selected)

```
┌──────┬─────────┬──────────────────────┬───────────────┐
│      │         │                      │               │
│ 52px │  286px  │    canvas            │    340px      │
│ side │  page   │    (compressed)      │    settings   │
│ bar  │  list   │                      │    panel      │
│      │         │                      │               │
└──────┴─────────┴──────────────────────┴───────────────┘
```

- Settings panel is **340px** with a 1px left border (Neutral-40).
- Canvas compresses — it does not scroll behind the panel.
- Panel opens when a page card is clicked on the canvas or selected from the page list.
- Panel closes via the `×` button (28×28px, top-right of panel header).

### Rules

- **Never combine left panel types.** Shell A uses stage cards. Shells B and C use the page list. They do not coexist.
- **The sidebar (52px) is present in every shell.** No full-bleed screens exist.
- **Shell transitions are full replacements**, not incremental reveals. Lifecycle → Flow Editor replaces the entire area to the right of the sidebar.
- **The settings panel (Shell C) is the only right-side surface in JB.** Do not introduce drawers, slide-overs, or inspector panels on any other screen.

---

## 2. Sidebar

52px wide. White background. Right border: `1px solid #ECEDED`.

### Anatomy (top to bottom)

| Zone | Y-start | Content |
|---|---|---|
| Logo | 0px | 48px header: 28×28px gradient mark (`135deg, #1766D6 → #104EB8`, radius 7px) with "JB" in 11px/800/white |
| Create | 58px | 31×32px Primary-500 rectangle (radius 8px), white plus icon 14px |
| Nav icons | 92px | Icon buttons, each 35×34px, 16px icons, Neutral-200, radius 8px. 2px vertical gap between items |
| Divider | — | `border-top: 1px solid #ECEDED` above bottom zone |
| Utilities | bottom | Settings, logout, avatar. Avatar is 24px circle with gradient (`135deg, #1766D6 → #33AFCD`), white user icon 12px |

### Rules

- **No labels.** The sidebar is icon-only at 52px. No tooltips are currently implemented — this is a known gap, not a design decision.
- **No active-state highlight** is visible on nav icons in any Figma frame. If one is needed, use `Primary-50` (#E0F0FD) background fill on the 35×34px button area. Do not use left-edge indicators or icon colour changes.
- **The sidebar does not collapse.** 52px is fixed at all viewport widths.

---

## 3. Header Bar

Sits inside the content area of Shell A, not as a global bar. It is **not a separate navigation row** — it is the top section of the stage panel's sibling content area.

### Anatomy

| Element | Spec |
|---|---|
| Breadcrumb | 12px/500 Neutral-100 trail segments, chevron-right icon separators (14px, Neutral-100), final segment 12px/500 Neutral-300 |
| Journey title | 16px/700 Neutral-400, followed by 12px pencil icon (edit-in-place affordance) |
| Status badge | Inline after title. See §8 Badges. |
| Action buttons | Right-aligned. "Edit theme" (tinted), "Save draft" (secondary outlined). Both 36px height. |

### Rules

- **Breadcrumb depth is exactly 4 levels:** `Home > [context] > [context] > [current page name]`. Never fewer, never more.
- **Breadcrumb separators are chevron-right icons**, not text characters. Not `/`, not `·`, not `>` as a text glyph.
- **The header bar does not appear in Shell B or C.** The flow editor replaces it with the "Back to Lifecycle" context button inside the page list panel.

---

## 4. Stage Cards

Used exclusively in Shell A's left panel. Not reused anywhere else.

### States

| State | Background | Border | Shadow | Right element |
|---|---|---|---|---|
| Active (current) | White | `1px solid #1766D6` | `0px 1px 1.5px rgba(0,0,0,0.06)` | Percentage (12px/700) |
| Inactive (locked) | `#FAFAFB` | `1px solid rgba(19,26,37,0.2)` | none | Lock icon 10.6px |
| Inactive (unlocked) | `#FAFAFB` | `1px solid rgba(19,26,37,0.2)` | none | Percentage (12px/700) |
| Complete | White | `1px solid #1A7A1E` | none | Checkmark icon |

### Anatomy (all states)

- Border radius: **12px**
- Padding: 16px horizontal, 16px top, 20px bottom
- Stage number badge: 22px square (active: `#E0F0FD` bg, 6px radius, 12px/500 `#104EB8` text) or ~21px square (inactive: `#ECEDED` bg, ~5px radius, 12px/500 `#7D8187` text)
- Title: 16px/700 Neutral-400
- Description: 14px/500 `#7A7F86`, max-width 291px, wraps to 2 lines max
- Gap between cards: **16px** (set by parent flex gap, not card margin)

### Rules

- **Only one card can be active at a time.** Active state = the stage the user is currently configuring.
- **Locked stages show a lock icon, not a percentage.** A locked stage has no completion data — don't show "0%".
- **Stage number badges are not componentized in Figma** — they drift by ~0.8px between active and inactive. Treat 22px/6px-radius as canonical and normalize the inactive badge to match.
- **Description text is capped at 291px width** regardless of panel width. This is a hard constraint from the Figma layout, not a responsive breakpoint.

---

## 5. Page List Panel (Flow Editor Left Panel)

286px wide. Used in Shells B and C.

### Sections (top to bottom)

| Section | Content |
|---|---|
| Collapse toggle | Sidebar-collapse icon (25.5×25.5px), top-left, 12px from edges |
| Journey context | "Back to Lifecycle" link (13px, with left-arrow icon) + journey name + version/market metadata + mini progress bar (4px height) |
| Template selector | Journey name as dropdown (truncated with chevron) + "Drafts · N pages" metadata |
| Info banner | Light blue bg, 13px text. "We have created a flow which matches the details you provided…" |
| Section groups | INTRO / INPUT / ENDING / custom — each with page list items |
| Add section button | Full-width, dashed outline |

### Page List Item

- Height: **34px**
- Left padding: 13px from container edge
- Layout: `[Page code] [Page name] ———— [Drag handle] [Remove icon]`
- Page code: 14px container, text "P1"–"P12" etc, Neutral-200
- Page name: 14px/400 Neutral-400
- Drag handle: 6-dot grip, 7×11px, Neutral-200, right side before remove
- Remove: `fi:minus` icon, 14×14px

### Section Group

- Label: "INTRO" / "INPUT" / "ENDING" — **uppercase**, 12px/500, Neutral-200
- "+" button: 20×20px, right-aligned on the label row
- 16px top padding above label within the group
- 0px gap between page list items within a section (items are stacked flush)

### Rules

- **Section names are fixed vocabulary:** INTRO, INPUT, ENDING. Custom sections use the user's label but follow the same uppercase rendering.
- **"Add a section" button** sits between ENDING and the panel bottom. It is a full-width (254px after padding) dashed-outline button, 34px height, with plus icon + "Add a section" label centred.
- **The info banner appears only on auto-generated flows.** If the user built the flow from scratch, this banner does not appear. (Inferred from the copy "We have created a flow which matches the details you provided.")
- **Page list items do not have visible selected state in the left panel.** Selection is reflected on the canvas (cog icon overlay on the page card) and by the settings panel opening.

---

## 6. Canvas (Flow Editor)

The main working area in Shells B and C.

### Page Cards

- Size: **121.36 × 65.6px** (unselected), **121.36 × 66.42px** (selected — accommodates cog icon)
- Background: White
- Border: `1px solid #ECEDED`
- Internal padding: ~10.66px
- Contents: page icon (9px) + "PAGE N" label (12px/500 Neutral-200, uppercase) + page name (13px/400 Neutral-400) + "Modify" link (13px/400 Primary-500 with link icon 9px)

**Selected state:** A settings cog icon (11.48×11.48px) appears at the card's top-right corner. Card height increases by ~0.82px. The settings panel (Shell C) opens simultaneously.

### Connectors

| Type | Spec | Used between |
|---|---|---|
| Horizontal arrow | Line (40.18px × 1.64px, Neutral-40) + arrowhead (5.74 × 8.2px) | Page cards within a section row |
| Vertical section connector | Vertical line (1.64px × 19.68px) + downward chevron (8.2 × 6.56px). Total height: 26.24px | Section rows |

### Add Page Buttons

| Variant | Shape | Size | Position |
|---|---|---|---|
| Inline (between connectors) | Circle | 15px diameter | Centred on the horizontal connector line between two page cards |
| End-of-section | Square | 32.8 × 32.8px | After the last page card in a section, where the next card would go |

Inline circle: `Primary-50` bg, Primary-500 plus icon (7.5px).
End-of-section square: `Neutral-10` bg or transparent, `1px dashed Neutral-50` border, Neutral-200 plus icon (16.4px).

### Zoom & Canvas Controls

- Zoom buttons: three 32×32px icon buttons, top-right of canvas, grouped horizontally (zoom in, zoom out, fit-to-screen)
- Zoom percentage: bottom-right, "82%" in monospace-ish rendering (13px, Neutral-200)
- Shortcut hints: bottom-left, "Scroll to pan · Ctrl+Scroll to zoom · Space+Drag to pan" in 12px/400 Neutral-200

### Rules

- **Page cards are laid out 4-per-row maximum** within a section. If a section has more than 4 pages, they wrap to a second row within the same section band.
- **Every page card gets a "Modify" link.** There is no card variant without it.
- **Connectors are not user-editable.** They are automatically drawn between adjacent page cards in the sequence. The user reorders pages in the left panel, not by dragging cards on the canvas.
- **The canvas does not support freeform node placement.** Cards follow a strict grid dictated by section rows and 4-per-row wrapping. This is a structured flow editor, not a node graph.

---

## 7. Settings Panel (Right Panel)

340px wide. Only appears in Shell C (flow editor with a page selected). Divided into stacked sections.

### Panel Header

- Height: 55px
- Left: page code badge (27×22px, with "P1" text centred) + page name (14px/500)
- Right: "Save" button (56×30px, Primary filled) + close `×` button (28×28px)

### Sections

**Page Details**
- Section label: "Page Details" — 13px/500, Neutral-200-ish
- Fields: Order (72px-wide number input), Page Title (fills remaining), Mobile Title (full width), Page ID (full width, with 13px helper text below)
- Input height: **34px** within this panel
- Input border: `1px solid #ECEDED`, radius 8px
- Input text: 13px/400

**Access & Visibility**
- Section label: "Access & Visibility"
- Contains 4 toggle rows, each: label (14px/400) + helper text (13px/400 Neutral-200) + toggle switch (38×22px)
- Toggle rows are separated by implicit spacing, not visible dividers
- Toggle ON: knob at right position (x=19), Primary-500 track fill
- Toggle OFF: knob at left position (x=3), Neutral-40 track fill

**Conditions**
- Section label: "Conditions"
- Empty state: "Always visible — no rules set" (13px, Neutral-200) + "+ Add rule" outlined button (83×30px, right-aligned)
- When rules exist: rule rows replace the empty state text (not yet designed in current Figma frames)

**Advanced**
- Expandable row: "Advanced" label + "JSON, unique keys" descriptor (13px, Neutral-200) + chevron-right icon (14px)
- Expanded content: not shown in any current Figma frame

### Panel Footer

- "Last edited just now" — 13px/400, Neutral-200, 16px left padding, vertically centred in a 55px footer zone

### Rules

- **Input height inside the settings panel is 34px**, not the 40px used in full-page configuration forms (Shell A). This is intentional — the panel is space-constrained.
- **"Save" in the panel header saves page-level settings only.** "Save draft" in the header bar (Shell A) saves the entire journey. These are different save scopes.
- **The panel has no tabs.** It is a single scrollable column. Do not introduce tabbed navigation within this panel.
- **Toggle rows do not have explicit dividers** between them. They are separated by the row's own vertical padding (11px top internal padding per row). Do not add `border-bottom` between toggle rows.
- **The "Conditions" section is a placeholder for the Universal Condition Builder** integration. When rules are configured, they will render as condition rows using the shared condition builder component (AND/OR nesting, type-aware operators). This component is designed but not yet integrated into this panel.

---

## 8. Badges & Status Tags

All badges: `border-radius: 20px`, 12px/500 text.

| Badge | Background | Border | Text | Dot icon | Used on |
|---|---|---|---|---|---|
| DRAFT | `rgba(237,142,0,0.1)` | `1px solid rgba(237,142,0,0.3)` | `#AA5800` | Yes (10px, filled) | Journey title row |
| Coming soon | `rgba(237,142,0,0.1)` | `1px solid rgba(237,142,0,0.3)` | `#CB7100` | No | Disabled accordion features |
| Back: On | `#E0F0FD` | none | `#104EB8` | No | Accordion section inline status |

### Rules

- **Badges sit inline with their parent element's text baseline**, not floating above or pinned to a corner.
- **The DRAFT badge is the only badge that uses a dot icon prefix.** Don't add dot icons to other badge types.
- **"Coming soon" badges make their parent section non-interactive.** The accordion chevron still renders but clicking does nothing. The section label should also render at reduced contrast (not yet explicitly tokenized — flag for design if implementing).

---

## 9. Buttons

### Size Matrix

| Variant | Height | Font | Radius | Context |
|---|---|---|---|---|
| Primary filled | 36px | 14px/500 white | 8px | "Open Flow Editor", "Skip to Next →" |
| Secondary outlined | 36px | 14px/500 Neutral-400 | 8px | "Save draft" (border: Neutral-200) |
| Tinted (soft primary) | 36px | 14px/500 Primary-500 | 8px | "Edit theme" (bg: #EFF8FF) |
| Outlined chip | 36px | 14px/500 Primary-500 | 8px | "⟨⟩ API Reference" (border: Primary-500) |
| Panel save | 30px | 13px/500 white | 8px | "Save" in settings panel header |
| Small outlined | 30px | 13px/400 Neutral-400 | 8px | "+ Add rule" |
| Dashed add | 34px | 14px/500 Primary-500 | 8px | "Add a section" (border: dashed Neutral-50) |
| Icon-only | 32×32px | — | 8px | Zoom controls, close panel |
| Micro icon | 20×20px | — | — | Section "+" buttons in page list |

### Rules

- **Standard button height in JB is 36px.** Not 44px (which is CAM). Do not mix these across modules without explicit design system approval.
- **Tinted buttons are reserved for secondary actions that need visual emphasis** without competing with the primary CTA. Currently only "Edit theme" uses this variant. Don't proliferate it.
- **Panel-context buttons (30px) only appear inside the 340px settings panel.** They do not appear in full-page layouts.
- **Icon-only buttons do not have visible borders at rest.** They gain a hover state (Neutral-10 bg fill). This applies to zoom controls, panel close, and section "+" buttons.

---

## 10. Form Inputs

Two height tiers exist. Use the correct one for the context.

| Context | Input height | Used in |
|---|---|---|
| Full-page forms (Shell A content area) | **40px** | Pre Journey Configurations accordion sections |
| Settings panel (Shell C right panel) | **34px** | Page Details fields, Conditions |

### Shared Input Spec (both tiers)

- Border: `1px solid #E7E8E9`
- Border radius: `8px`
- Left padding: `10px`
- Text: 13px/400 (panel) or 14px/400 (full-page) Neutral-400
- Placeholder: Neutral-100 (`#BFC2C4`)
- Focus: border becomes `#4F76C1`, focus ring `0 0 0 3px #A8C7F4`
- Error: not yet designed (see §14 Known Gaps)

### Helper Text

- 13px/400, Neutral-200
- Sits directly below input with no extra top margin (uses the parent's gap)
- Example: "Used internally as a unique key. Lowercase, underscores only."

### Rules

- **Do not use 40px inputs inside the settings panel** or 34px inputs on full-page forms. The tier is dictated by the shell, not the field type.
- **Helper text is not optional boilerplate.** Only add it when the field's purpose or format constraints are non-obvious. "Page Title" needs no helper. "Page ID" does.

---

## 11. Radio Cards (Selection Cards)

Used for mutually exclusive choices where each option needs a description. Currently used only in Pre Journey Configurations → Trigger Configuration → Link Distribution.

### Spec

- Two cards side-by-side, equal width, within the accordion section content area
- Border: `1px solid #E7E8E9` (unselected), `1px solid #1766D6` (selected)
- Border radius: `12px`
- Padding: `16px`
- Radio circle: 18px diameter, top-right corner of card. Outline only (unselected), filled Primary-500 (selected)
- Title: 14px/600 Neutral-400
- Description: 13px/400 Neutral-200

### Rules

- **Radio cards are for binary or ternary choices with descriptions.** If the choice doesn't need descriptions, use standard radio buttons. If it's binary without descriptions, use a segmented toggle.
- **Maximum 3 radio cards per row.** If more than 3 options exist, stack as a vertical list instead.
- **"× Deselect" button** appears at the section level when a radio card is selected, allowing the user to clear the selection and return to default (all options available).

---

## 12. Accordion Sections

Used in Shell A content area for stage-specific configuration (Pre Journey Configurations).

### Anatomy

- Container: White bg, `1px solid #ECEDED`, `border-radius: 12px`
- Header: section name (14px/600 Neutral-400) + optional inline badge + optional inline description (14px/400 Neutral-200) + chevron toggle (right-aligned)
- Expanded: chevron points up. Content area renders below header with 16px top padding.
- Collapsed: chevron points down. Only the header row is visible.

### Variants

| Variant | Visual difference |
|---|---|
| Standard | No badge. Expandable. |
| With status badge | "Back: On" Primary tint badge inline after section name |
| With description | "Configure the navigation buttons…" Neutral-200 text inline |
| Disabled ("Coming soon") | "Coming soon" warning badge inline. Non-expandable. Content area is inaccessible. |
| With inline info banner | Expanded state includes a full-width `#E0F0FD` bg banner (8px radius, no border) at the top of the content area before other content |

### Rules

- **One accordion section = one configuration concern.** Don't nest accordions.
- **The first section in a stage starts expanded.** All others start collapsed. This is not configurable per-section; it's the page-load default.
- **Disabled sections are visually present but non-functional.** The user sees the section label and the "Coming soon" badge. The chevron renders but does not respond to clicks. This communicates roadmap intent without creating dead ends.

---

## 13. Progress Indicators

### Journey Completion Bar

- Location: top of Shell A left panel, inside a 364px-wide card (White bg, `1px solid #ECEDED`, 12px radius)
- Label: "Complete all stages to publish the journey" — 12px/500 `#7A7F86`
- Percentage: 14px/700 Neutral-400, right-aligned on same line as label
- Bar: 5px height, `#ECEDED` track, `#1766D6` fill, `border-radius: 100px`
- Sub-label: "N of M stages complete" — 12px/500 `#7A7F86`

### Mini Progress Bar (Flow Editor)

- Location: inside the "Back to Lifecycle" context card in the page list panel
- Bar: 4px height, same colour tokens
- Counter: "0/5" text right of bar — 13px/400 Neutral-200

### Stage Percentage

- Location: top-right of each stage card
- Rendering: "0%" / "40%" / "100%" — 12px/700 Neutral-400
- Only shown on unlocked stages. Locked stages show a lock icon instead.

### Rules

- **Progress bar fill colour is always Primary-500.** Do not use semantic colours (green for complete, amber for partial). Stage status is communicated by the percentage value and the badge, not bar colour.
- **The denominator in "N of M stages complete" must match the actual stage count.** This is where the 5-vs-6 stage inconsistency becomes a visible bug. See §15 Inconsistencies.

---

## 14. Known Gaps

These patterns are referenced or implied in the product but have no Figma frame or spec. Do not implement without design input.

| Gap | Impact | Severity |
|---|---|---|
| Input error states (validation, duplicates) | Settings panel Page ID field can conflict. No error treatment exists. | High — blocks form validation |
| Stage-level validation errors | What does a stage card look like when its contents fail validation before publish? | High — blocks Validate & Publish stage |
| Drag-and-drop interaction states | Handle exists but during-drag, drop-target, and reorder-animation states are undesigned | Medium — blocks polish pass |
| Empty flow editor state | No pages, no sections. What does the canvas show? | Medium — edge case but real |
| Empty section state | All pages removed from INTRO. Does the section collapse? Show placeholder? | Medium |
| Advanced section (settings panel) expanded | "JSON, unique keys" — what fields appear inside? | Medium — blocks implementation |
| Context menu on page cards | Right-click / more-options for duplicate, delete, move-to-section | Medium — blocks workflow efficiency |
| Section rename/delete/reorder | "Add a section" exists but no management affordances | Medium |
| Toggle component disabled state | What does a toggle look like when the feature it controls isn't available? | Low |
| Responsive behaviour below 1280px | Does the left panel collapse? Does the settings panel stack? | Low — internal tool, fixed viewport assumed |
| Keyboard shortcuts reference | Hints shown on canvas but no full reference accessible | Low |
| Selected page card border treatment on canvas | Cog icon appears but border colour change (if any) is ambiguous | Low — visual polish |

---

## 15. Inconsistencies to Resolve

These require a decision, not a design spec. Flag to PM or design lead.

### 15.1 Stage Count: 5 or 6?

`764:7256` (lifecycle Figma frame) shows **6 stages**: Pre journey configs → Journey Builder → Post Checks → Rules → Meta Data → Send for review.

`1042:3044` (settings panel Figma frame) and the live staging app show **5 stages**: Trigger Definition → Journey Builder → Post Checks → Meta data → Validate & Publish.

The completion bar says "0 of 5" in one and would need "0 of 6" in the other. **One frame is stale. Identify which and archive it.**

### 15.2 Stage 01 Name

"Pre journey configs" (764:7256) vs "Trigger Definition" (1042:3044). These are not synonyms. Pre Journey Configurations encompasses trigger config, link distribution, navigation buttons, integration type, prefilled data, and link expiry — all confirmed in the live staging screenshot. "Trigger Definition" is a subset. **Recommend "Pre Journey Configurations" as canonical** since it matches the staging app and covers the full scope.

### 15.3 Stage Number Badge Size

Active: 22×22px. Inactive: 21.21×21.21px. This 0.79px discrepancy is a Figma artifact, not a design decision. **Normalize both to 22×22px.**

### 15.4 Settings Panel Input Height vs Full-Page Input Height

34px (panel) vs 40px (full-page). If intentional, document it as two tiers (done in §10 above). If unintentional, pick one. **Recommend keeping both — the panel is genuinely space-constrained at 340px.**

### 15.5 Page Card Height Shift on Selection

Unselected: 65.6px. Selected: 66.42px. The 0.82px increase accommodates the cog icon overlay. This causes a sub-pixel layout shift on the canvas. **Either absorb the cog icon into the existing 65.6px frame, or pad all cards to 66.42px and hide the cog icon slot when unselected.**

---

*End of document.*
