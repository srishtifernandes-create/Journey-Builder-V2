# Journey Builder Module — Design System & Source of Truth

> **Product:** OnboardIQ — Journey Builder (JB)
> **Design system anchor:** IDfy product family
> **Font:** Plus Jakarta Sans
> **Last updated:** July 2026
> **Status:** Source of truth. All JB screens must conform to this document before handoff.
> **Figma file:** `Journey-Builder` (file key: `ogfjMNvPjkuy4DcCnpGKSs`)

---

## Table of Contents

1. [Foundations](#1-foundations)
   - 1.1 Typography
   - 1.2 Colour Palette
   - 1.3 Spacing & Grid
   - 1.4 Border Radius
   - 1.5 Elevation & Shadows
2. [Navigation & Shell](#2-navigation--shell)
3. [Components](#3-components)
   - 3.1 Buttons
   - 3.2 Badges & Status Tags
   - 3.3 Form Elements
   - 3.4 Cards
   - 3.5 Accordion Sections
   - 3.6 Toasts & Notifications
   - 3.7 Alert Banners
   - 3.8 Modals
   - 3.9 Progress Bars
   - 3.10 Segmented Toggles
   - 3.11 Radio Cards (Selection Cards)
4. [JB-Specific Patterns](#4-jb-specific-patterns)
   - 4.1 Stage Card
   - 4.2 Page Card (Flow Editor)
   - 4.3 Page List Item (Left Panel)
   - 4.4 Section Group (Flow Editor)
   - 4.5 Section Connector
   - 4.6 Drag-and-Drop Reorder Handle
   - 4.7 Journey Completion Bar
   - 4.8 Add Page Button
   - 4.9 Inline Info Banner (Configuration)
   - 4.10 "Coming Soon" Feature Badge
5. [Screen Inventory & Layout Rules](#5-screen-inventory--layout-rules)
   - 5.1 Journey Lifecycle View
   - 5.2 Flow Editor View
   - 5.3 Pre Journey Configurations
   - 5.4 Theme Builder
   - 5.5 Home / Journey List
   - 5.6 Form Fill / Screen Editor
   - 5.7 Post Checks Configuration
   - 5.8 Rules Configuration
   - 5.9 Meta Data Configuration
   - 5.10 Send for Review
6. [Journey Stage Model](#6-journey-stage-model)
7. [State Machine Visual Mapping](#7-state-machine-visual-mapping)
8. [Notification Events](#8-notification-events)
9. [Deviations from Prototype](#9-deviations-from-prototype)
10. [Open Design Decisions](#10-open-design-decisions)

---

## 1. Foundations

### 1.1 Typography

**Font family:** `Plus Jakarta Sans` — use across all weights and sizes.

| Role | Size | Weight | Line-height | Letter-spacing | Usage |
|---|---|---|---|---|---|
| Page title | 16px | 700 (Bold) | 140% | 0.4% | Screen heading in main content area: "Journey Builder", "Pre Journey Configurations" |
| Section heading | 14px | 600 (SemiBold) | 140% | 0.4% | "CONFIGURATION STAGES", section headers — uppercase |
| Stage card title | 16px | 700 (Bold) | 140% | 0.4% | Stage names: "Pre journey configs", "Journey Builder" |
| Body | 14px | 500 (Medium) | 140% | 0.4% | Descriptions, form labels, button text |
| Metadata / small | 12px | 500 (Medium) | 130% | 0.4% | Breadcrumbs, progress labels, sub-text, badge text |
| Small bold | 12px | 700 (Bold) | 130% | 0.4% | Percentage counters ("40%"), stage number labels |
| Breadcrumb current | 12px | 500 (Medium) | 130% | 0.4% | Final breadcrumb segment, uses Neutral-300 |
| Breadcrumb trail | 12px | 500 (Medium) | 130% | 0.4% | Non-current breadcrumb segments, uses Neutral-100 |
| Page card label | 12px | 500 (Medium) | 130% | 0.4% | "PAGE 1", "PAGE 2" — uppercase |
| Page card name | 13px | 400 (Regular) | — | — | "Landing Page", "Sign up" — sentence case |
| Section label (flow) | 12px | 500 (Medium) | 130% | 0.4% | "INTRO", "INPUT", "ENDING" — uppercase |
| Page count | 13px | 400 (Regular) | — | — | "4 pages", "7 pages" |
| Button modify link | 13px | 400 (Regular) | — | — | "Modify" text link in page cards |

**Font feature settings:** `"case"` enabled on all text. `"liga" 0` on small/metadata text to disable ligatures.

**Breadcrumb separator:** Chevron-right icon (`>` arrow), `14px`, Neutral-100 colour. Never use `/`, `|`, or `·`.

---

### 1.2 Colour Palette

All colour references use the IDfy design system token names. JB inherits the same token structure as CAM but with a different Primary-500 anchor.

#### Neutral

| Token | Hex | Usage |
|---|---|---|
| Neutral-10 | `#FAFAFB` | Page background, inactive stage card background |
| Neutral-30 | `#F3F3F4` | Table header row background |
| Neutral-40 | `#ECEDED` | Dividers, progress bar track, section borders, inactive stage number bg |
| Neutral-50 | `#E7E8E9` | Card borders (rest), input borders (rest), sidebar item dividers |
| Neutral-100 | `#BFC2C4` | Breadcrumb trail text, placeholder text, disabled text |
| Neutral-200 | `#7D8187` | Secondary text, "Save draft" button border, inactive stage number text, lock icons |
| Neutral-300 | `#484E56` | Current breadcrumb text, body text secondary |
| Neutral-400 | `#131A25` | Body text primary, headings, stage card titles |
| Neutral-500 | `#131A25` | Maximum emphasis text (same as 400 in this system) |
| Neutral-600 | `#0E141C` | High-contrast text |

**Note on Neutral-opacity tokens observed in Figma:**
- `neutral/opacity-20%` = `rgba(19, 26, 37, 0.2)` — used for inactive stage card borders
- `neutral/opacity(-10%)` = `rgba(255, 255, 255, 0.1)` — decorative rotated border elements

#### Primary (Interactive)

| Token | Hex | Usage |
|---|---|---|
| Primary-50 | `#E0F0FD` | Active stage number background, light tint surfaces |
| Primary-200 | `#A8C7F4` | Focus ring, soft badge fill |
| Primary-300 | `#769EE0` | Focus ring alternative |
| Primary-400 | `#4F76C1` | Active input border |
| Primary-500 | `#1766D6` | **Primary brand blue — CTAs, links, active stage border, progress bar fill, "+" button, "Edit theme" text, sidebar logo gradient start** |
| Primary-600 | `#104EB8` | CTA hover state, active stage number text |
| Primary-700 | `#10276D` | CTA pressed state |

> **Critical difference from CAM:** JB Primary-500 is `#1766D6`, not CAM's `#214698`. All interactive elements must use the JB token.

#### Success

| Token | Hex | Usage |
|---|---|---|
| Success-20 | `#E9FCE5` | Success banner background |
| Success-100 | `#DDF8D1` | Completed stage badge background |
| Success-500 | `#1A7A1E` | Success icon, completed stage checkmark |
| Success-600 | `#13681E` | Success text on light bg |

#### Warning

| Token | Hex | Usage |
|---|---|---|
| Warning-opacity-10% | `rgba(237, 142, 0, 0.1)` | DRAFT badge background |
| Warning-opacity-30% | `rgba(237, 142, 0, 0.3)` | DRAFT badge border |
| Warning-500 | `#ED8E00` | Warning icon |
| Warning-600 | `#CB7100` | Warning text on light bg |
| Warning-700 | `#AA5800` | DRAFT badge text |

#### Destructive

| Token | Hex | Usage |
|---|---|---|
| Destructive-500 | `#E23318` | Error icon, destructive actions |
| Destructive-600 | `#C21B11` | Error text on light bg |

#### Info

| Token | Hex | Usage |
|---|---|---|
| Info-20 | `#EFF8FF` | "Edit theme" button background tint |
| Info-500 | `#007FAD` | Info icon |

#### Shades

| Token | Hex | Usage |
|---|---|---|
| White | `#FFFFFF` | Card backgrounds, modal backgrounds, main content area bg |
| Black | `#131A25` | Neutral text anchor |

---

### 1.3 Spacing & Grid

| Token | Value | Usage |
|---|---|---|
| space-2 | 2px | Tight gaps between sidebar nav items |
| space-4 | 4px | Icon-to-label gap in badges |
| space-6 | 6px | Icon-to-text gap in buttons |
| space-8 | 8px | Between inline elements, page list item internal gap |
| space-12 | 12px | Button horizontal padding, stage card internal gap, between stacked items |
| space-16 | 16px | Card internal padding, between sections in left panel, form field vertical gap |
| space-20 | 20px | Card internal padding bottom, right-side content padding |
| space-24 | 24px | Top padding for header section |

**Page layout:** Left sidebar 52px fixed. Left configuration panel 286–396px (varies by view). Main content area fills remaining width. No persistent right panel (unlike CAM).

**Flow editor layout:** Left page list panel 286px fixed. Canvas area fills remaining width.

**Lifecycle view layout:** Left stage panel 396px. Right content area fills remaining width with 60px horizontal padding.

---

### 1.4 Border Radius

| Context | Value |
|---|---|
| Inputs, dropdowns, textareas | 8px |
| Buttons (standard) | 8px |
| Cards (stage cards, content cards) | 12px |
| Badges / status pills | 20px (full pill) |
| Modals | 12px |
| Sidebar logo mark | 7px |
| Stage number badge (active) | 6px |
| Stage number badge (inactive) | ~5.3px (rounds to 5px) |
| Progress bar track + fill | 100px (fully rounded) |
| Page cards (flow editor) | Inherited from card (12px) |
| Sidebar "+" button | 8px |

---

### 1.5 Elevation & Shadows

The IDfy product family uses **no decorative shadows** except where noted. Elevation is communicated through borders.

| Element | Treatment |
|---|---|
| Cards (inactive) | `1px solid Neutral-40 (#ECEDED)` or `1px solid neutral/opacity-20%` |
| Cards (active stage) | `1px solid Primary-500 (#1766D6)` + `drop-shadow(0px 1px 1.5px rgba(0, 0, 0, 0.06))` |
| Sidebar | `border-right: 1px solid Neutral-40 (#ECEDED)` |
| Header bar | `border-bottom: 1px solid Neutral-50 (#E7E8E9)` |
| Inputs (focus) | `0 0 0 3px Primary-200 (#A8C7F4)` focus ring |

> **Active stage card is the only JB element that uses a drop shadow.** All other elevation is border-only.

---

## 2. Navigation & Shell

### Left Sidebar

- Width: **52px**
- Background: **White `#FFFFFF`**
- Right border: `1px solid Neutral-40 (#ECEDED)`
- Top section (48px height): Logo mark container with bottom border
  - Logo mark: `28px × 28px`, `border-radius: 7px`, `linear-gradient(135deg, Primary-500 #1766D6 → Primary-600 #104EB8)`
  - Logo text: "JB" in `11px / 800 (ExtraBold) / White`, letter-spacing: `-0.22px`
- "+" button below logo: `31px × 32px`, `Primary-500` fill, `border-radius: 8px`, white plus icon `14px`
- Nav icons section: starts at top `92px`, icons `16px`, buttons `35px × 34px` with `8px` radius, `10px` left padding
- Bottom section: border-top `1px solid Neutral-40`, settings/logout icons, avatar
  - Avatar: `24px` circle, `linear-gradient(135deg, Primary-500 → #33AFCD)`, white user icon `12px`

> **Difference from CAM:** JB sidebar is white with Neutral-40 border, not Neutral-600 (dark) like CAM. Icons are Neutral-200 (gray), not white.

### Top Breadcrumb / Header Bar

- No separate breadcrumb bar. The header is integrated into the main content area.
- Background: **White `#FFFFFF`**
- Bottom border: `1px solid Neutral-50 (#E7E8E9)`
- Padding: `24px top, 20px horizontal, 20px bottom`
- Breadcrumb row: `12px / 500 / Neutral-100` with chevron-right `14px` separators. Final segment: `12px / 500 / Neutral-300`
- Title row below breadcrumb: journey name `16px / 700 / Neutral-400` + pencil edit icon `12px` + status badge (e.g. DRAFT)
- Action buttons right-aligned: "Edit theme" (tinted), "Save draft" (outlined)

### No Tab Bar (Unlike CAM)

JB does not use a horizontal tab bar for navigation. The stage navigation is handled by the vertical **Stage Card** list in the left panel. See Section 4.1.

---

## 3. Components

### 3.1 Buttons

#### Primary (filled)

- Background: `Primary-500 (#1766D6)`
- Text: White, `14px / 500 (Medium)`
- Border radius: `8px`
- Height: **`36px`**
- Padding: `0 12px`
- Hover: `Primary-600 (#104EB8)`
- Pressed: `Primary-700 (#10276D)`
- Optional prefix icon: `16–20px`, `6px` gap to text

**JB uses:** "Open Flow Editor" (with left arrow icon), "Skip to Next →", "Add a section" (with plus icon)

> **Critical difference from CAM:** JB standard button height is **36px**, not CAM's 44px. The Primary-500 colour is also different (`#1766D6` vs `#214698`).

#### Secondary (outlined)

- Background: White
- Border: `1px solid Neutral-200 (#7D8187)`
- Text: `Neutral-400 (#131A25)`, `14px / 500`
- Border radius: `8px`
- Height: **`36px`**
- Hover: border darkens

**JB uses:** "Save draft" (with save icon), "Cancel", "× Deselect"

#### Tinted (soft primary)

- Background: `Info-20 (#EFF8FF)`
- Border: none
- Text: `Primary-500 (#1766D6)`, `14px / 500`
- Border radius: `8px`
- Height: **`36px`**
- Optional prefix icon: `20px`, `6px` gap

**JB uses:** "Edit theme" (with paint-drop icon)

> This button style does not exist in CAM. It is JB-specific for secondary actions with visual emphasis.

#### Ghost / Text

- No background, no border
- Text: `Primary-500 (#1766D6)`, `14px / 400`
- Used for: "Modify" links in page cards, "Cancel" in some contexts

#### Outline (API Reference)

- Background: White
- Border: `1px solid Primary-500 (#1766D6)`
- Text: `Primary-500`, `14px / 500`
- Border radius: `8px`
- Height: `36px`
- Used for: "⟨⟩ API Reference" chip button

#### Small buttons (list actions)

- Height: `32px` or `34px`
- Font: `13px / 400`
- Same radius (8px) and colour rules as above
- Used inside page list items, section controls

---

### 3.2 Badges & Status Tags

All badges use `border-radius: 20px` (full pill), `12px / 500` text, `4px` horizontal padding.

| State | Background | Border | Text colour | Usage |
|---|---|---|---|---|
| Draft | `Warning-opacity-10%` | `1px solid Warning-opacity-30%` | `Warning-700 (#AA5800)` | Journey status: DRAFT |
| Published | `Success-100 (#DDF8D1)` | `1px solid Success-300` | `Success-600 (#13681E)` | Journey status: PUBLISHED |
| Coming Soon | `Warning-opacity-10%` | `1px solid Warning-opacity-30%` | `Warning-600 (#CB7100)` | Feature badge: "Coming soon" |
| Back: On | `Primary-50 (#E0F0FD)` | none | `Primary-600 (#104EB8)` | Toggle status indicator |

**Badge anatomy:**
- Dot indicator: `10px` filled circle icon (optional, used in DRAFT badge)
- Text: `12px / 500`
- Height: `23px` (including border)
- Padding: `4px` horizontal

---

### 3.3 Form Elements

#### Text input / Number input

- Height: `40px`
- Border: `1px solid Neutral-50 (#E7E8E9)`
- Border radius: `8px`
- Padding: `0 12px`
- Font: `14px / 400 / Neutral-400`
- Placeholder: `Neutral-100 (#BFC2C4)`
- Focus: border `Primary-400 (#4F76C1)`, focus ring `0 0 0 3px Primary-200`
- Error: border `Destructive-500`, focus ring `0 0 0 3px Destructive-100`

#### Dropdown / Select

Same height, border, radius, padding as text input. Chevron icon right-aligned, `Neutral-200`.

#### Date picker

Same as text input with calendar icon right-aligned.

#### Textarea

- Min-height: `80px`
- Same border, radius, and colour rules as text input

---

### 3.4 Cards

#### Standard card (inactive stage, info box)

- Background: `Neutral-10 (#FAFAFB)`
- Border: `1px solid neutral/opacity-20% (rgba(19, 26, 37, 0.2))`
- Border radius: `12px`
- Padding: `16px horizontal, 16px top, 20px bottom`
- No shadow

#### Active stage card

- Background: **White `#FFFFFF`**
- Border: `1px solid Primary-500 (#1766D6)`
- Border radius: `12px`
- Padding: same as standard
- Shadow: `drop-shadow(0px 1px 1.5px rgba(0, 0, 0, 0.06))`

#### Content info card (right area)

- Background: White
- Border: `1px solid Neutral-40 (#ECEDED)`
- Border radius: `12px`
- Padding: `25px`

#### Info/tip box

- Background: White
- Border: `1px solid Neutral-40 (#ECEDED)`
- Border radius: `12px`
- Padding: `17px`
- Contains: info icon `20px` + text block with heading + bullet list

---

### 3.5 Accordion Sections

Used in Pre Journey Configurations for "Trigger Configuration", "Navigation Buttons", "Integration Type", "Prefilled Data", "Link Expiry Period".

- Container: White background, `1px solid Neutral-40`, `border-radius: 12px`
- Header: section name `14px / 600 / Neutral-400` + chevron-up (expanded) or chevron-down (collapsed), right-aligned
- Expanded state: content below header with `16px` top padding
- Collapsed state: header only with chevron pointing down
- Optional inline badges: e.g. "Back: On" primary tint pill beside section name
- Optional inline description: `14px / 400 / Neutral-200` beside section name

---

### 3.6 Toasts & Notifications

**Position:** Top-right corner, `16px` from top and right edges.

Follow the same toast pattern as CAM (Section 3.6 in CAM doc). JB-specific toast messages:

| Event | Type | Title | Body |
|---|---|---|---|
| Journey saved | Success | `Draft saved` | Journey configuration saved successfully. |
| Journey published | Success | `Journey published` | Journey is now live. |
| Validation failed | Error | `Validation failed` | {N} issue(s) found. Review highlighted stages. |
| Stage completed | Success | `{Stage name} complete` | — |
| GJK not configured | Warning | `Global Journey Keys pending` | Configure GJKs before publishing. |

---

### 3.7 Alert Banners

Same pattern as CAM (Section 3.7). JB-specific banner usage:

| Context | Type | Message |
|---|---|---|
| Trigger configuration (top of accordion) | Info | "Select the credential and authentication combination that acts as the entry point for this journey." |
| Flow editor (blue info box) | Info | "We have created a flow which matches the details you provided. You can modify it as needed." |
| GJK nudge | Warning | "Global Journey Keys are not configured. Complete setup in Client Settings before publishing." |
| Validation errors | Error | "{N} validation error(s) found. Fix before proceeding to next stage." |
| Coming soon feature | Info | "This feature is coming soon and cannot be configured yet." |

**Banner anatomy in JB accordion sections:**
- Background: `Primary-50 (#E0F0FD)` (for info type)
- Border: none (borderless variant)
- Border radius: `8px`
- Padding: `10px 14px`
- Text: `14px / 400 / Primary-500`
- Full-width within accordion content area

---

### 3.8 Modals

Follow CAM modal pattern (Section 3.8) with JB sizes:

| Name | Width | Used for |
|---|---|---|
| Small | `460px` | Confirm discard, delete page |
| Medium | `680px` | Add page, configure step, GJK drawer |
| Large | `860px` | Condition builder, API sequence editor |

---

### 3.9 Progress Bars

- Track: `Neutral-40 (#ECEDED)`, height `5px`, `border-radius: 100px`
- Fill: `Primary-500 (#1766D6)`, same height, `border-radius: 100px` (left side full-round, right side `20000px` on the leading edge for a clean cap)
- Width of fill: proportional to completion percentage
- No percentage label on the bar itself — percentage shown as separate text element

Used in: Journey completion bar (top of lifecycle view), stage-level completion counters.

---

### 3.10 Segmented Toggles

Not confirmed in current JB Figma screens. Reserved for future use if needed (follow CAM pattern Section 3.3).

---

### 3.11 Radio Cards (Selection Cards)

Used in: Trigger Configuration → Link Distribution (Targeted / Broadcast)

- Two cards side-by-side, equal width
- Height: auto (content-driven), minimum ~60px
- Border: `1px solid Neutral-50 (#E7E8E9)`
- Border radius: `12px`
- Padding: `16px`
- Radio indicator: `18px` circle, top-right, unfilled circle outline in Neutral-200
- **Selected state:** border becomes `Primary-500`, radio circle filled with Primary-500
- Title: `14px / 600 / Neutral-400`
- Description: `13px / 400 / Neutral-200`

---

## 4. JB-Specific Patterns

### 4.1 Stage Card

Used in: Lifecycle view left panel

```
┌──────────────────────────────────────────────┐ ← Primary-500 border (active)
│  [01]  Pre journey configs              0%   │    OR Neutral-opacity-20% border (inactive)
│        Define the trigger events and         │
│        conditions that will initiate…        │
└──────────────────────────────────────────────┘
```

- Card: `12px` radius, `16px` padding
- **Active state:** White bg, `1px solid Primary-500`, `drop-shadow(0px 1px 1.5px rgba(0,0,0,0.06))`
- **Inactive state:** `Neutral-10` bg, `1px solid neutral/opacity-20%`, no shadow
- **Locked state:** same as inactive + lock icon `10.6px` right-aligned (Neutral-200)
- **Completed state:** green checkmark replaces stage number, `Success-500` colour
- Stage number badge:
  - Active: `22px` square, `Primary-50` bg, `border-radius: 6px`, text `12px / 500 / Primary-600`
  - Inactive: `~21px` square, `Neutral-40` bg, `border-radius: ~5px`, text `12px / 500 / Neutral-200`
- Title: `16px / 700 / Neutral-400`
- Description: `14px / 500 / Neutral-200` (`#7A7F86` in practice), max-width `291px`
- Percentage: `12px / 700 / Neutral-400`, right-aligned

---

### 4.2 Page Card (Flow Editor Canvas)

Used in: Flow editor main canvas area

```
┌─────────────────────┐
│  📄 PAGE 1          │
│  Landing Page       │
│  🔗 Modify          │
└─────────────────────┘
```

- Size: `121.36px × 65.6px`
- Border: `1px solid Neutral-40`
- Border radius: inherited from parent (12px context)
- Background: White
- Padding: `~10.66px`
- Page label: `12px / 500 / Neutral-200` — "PAGE 1", "PAGE 2" (uppercase)
- Page icon: `9px`, Neutral-200, before label
- Page name: `13px / 400 / Neutral-400`
- Modify link: `13px / 400 / Primary-500` with link icon `9px`

---

### 4.3 Page List Item (Left Panel)

Used in: Flow editor left panel page list

```
│    P1  Landing page                    ⋮⋮  [−] │
```

- Height: `34px`
- Background: White (within container)
- Left padding: `13px`
- Page code: `14px` container, `P1` / `P2` etc., text `Neutral-200`
- Page name: `14px / 400 / Neutral-400`
- Right controls: drag handle dots icon (`16px`) + minus/remove icon (`14px`)
- Hover: subtle bg tint
- Selected: `Primary-50` bg tint, `Primary-500` left border (2px)

---

### 4.4 Section Group (Flow Editor)

Groups pages into logical sections on both the canvas and the left panel.

**Left panel section:**
- Section label: `12px / 500 / Neutral-200` — "INTRO", "INPUT", "ENDING" (uppercase)
- Top padding: `16px` above label
- "+" add button: `20px × 20px`, right-aligned beside section label
- Pages listed below with `0px` gap between items

**Canvas section:**
- Section label: `12px / 500` in a tinted tag pill
  - Background: uses a subtle tint matching the section colour
  - Text: section name
- Page count: `13px / 400 / Neutral-200` — "4 pages", "7 pages" inline after section label
- Pages laid out in a horizontal row with arrow connectors between them

---

### 4.5 Section Connector

Vertical connector between sections on the canvas.

- Vertical line: `1.64px wide × 19.68px tall`, `Primary-500` or `Neutral-40`
- Arrow: downward chevron `8.2px × 6.56px` at bottom of line
- Total connector height: `26.24px`

---

### 4.6 Drag-and-Drop Reorder Handle

- Icon: 6-dot grip pattern (`7px × 11px`), Neutral-200
- Position: right side of page list item, before remove button
- Cursor: `grab` on hover, `grabbing` while dragging
- During drag: item gets `Primary-50` bg tint, `2px solid Primary-200` border, slight elevation

---

### 4.7 Journey Completion Bar

Top of lifecycle view left panel.

```
┌──────────────────────────────────────────────┐
│  Complete all stages to publish the journey  40%  │
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  2 of 5 stages complete                      │
└──────────────────────────────────────────────┘
```

- Container: White bg, `1px solid Neutral-40`, `12px` radius, `16px` padding
- Label: `12px / 500 / #7A7F86` — "Complete all stages to publish the journey"
- Percentage: `14px / 700 / Neutral-400` — right-aligned on same line as label
- Progress bar: `5px` height, full width, `Neutral-40` track, `Primary-500` fill, `border-radius: 100px`
- Sub-label: `12px / 500 / #7A7F86` — "N of 6 stages complete"

---

### 4.8 Add Page Button

Two variants:

**Left panel variant (within section):**
- "Add a section" button: full-width outlined button, `Primary-500` text, plus icon left
- Height: `34px`
- Border: `1px dashed Neutral-50`
- Border radius: `8px`

**Canvas variant (between page cards):**
- Circle: `15px` diameter
- Background: `Primary-50`
- Icon: plus `7.5px`, `Primary-500`
- Position: centred between connector lines

**Canvas variant (end of section):**
- Square: `32.8px × 32.8px`
- Background: `Neutral-10` or transparent
- Border: `1px dashed Neutral-50`
- Icon: plus `16.4px`, `Neutral-200`

---

### 4.9 Inline Info Banner (Configuration)

Used within accordion sections to provide instructional context.

- Background: `Primary-50 (#E0F0FD)`
- Border: none
- Border radius: `8px`
- Padding: `10px 14px`
- Text: `14px / 400 / Primary-500 (#1766D6)`
- Full-width within parent container
- No icon prefix (text-only in most cases)

---

### 4.10 "Coming Soon" Feature Badge

Used next to feature names that are not yet available.

- Text: "Coming soon"
- Background: `Warning-opacity-10%`
- Border: `1px solid Warning-opacity-30%`
- Border radius: `20px`
- Text: `12px / 500 / Warning-600`
- Height: `23px`
- The associated accordion section should be non-expandable and visually muted (`opacity: 0.6` on the section label)

---

## 5. Screen Inventory & Layout Rules

### 5.1 Journey Lifecycle View

**Layout:** Full-width within main content. Left panel (396px, scrollable) + right content area.

**Left panel contents:**
1. Journey Completion Bar (sticky or top-aligned)
2. "CONFIGURATION STAGES" section heading (`14px / 600 / uppercase`)
3. Stage card list (6 cards, vertical stack, `16px` gap)

**Right content area:**
- Stage-specific content fills this area
- When "Journey Builder" stage is selected: shows "Build Your Journey" card with two sub-options (Journey Flow, Theme & Branding) and "Open Flow Editor" CTA
- When other stages are selected: shows accordion-based configuration forms

**Stage card states:**
- Not started + locked: `Neutral-10` bg, lock icon, `0%`
- Not started + unlocked (current): `White` bg, `Primary-500` border, shadow
- In progress: `White` bg, `Primary-500` border, percentage > 0%
- Complete: `White` bg, `Success-500` border or checkmark, `100%`

---

### 5.2 Flow Editor View

**Layout:** Left panel (286px, scrollable) + canvas area (fills remaining width).

**Left panel:**
1. Back to Lifecycle button (top, with sidebar collapse icon)
2. Journey context card: journey name (dropdown), status line (version · market), progress mini-bar
3. Auto-generated flow info banner
4. Section groups with page list items (INTRO, INPUT, ENDING + custom sections)
5. "Add a section" button at bottom

**Canvas area:**
- Dot-grid background or clean white
- Page cards arranged in horizontal rows per section
- Arrow connectors between page cards within a section
- Vertical section connectors between section rows
- Add page buttons at connection points
- Top-right: zoom controls (zoom in, zoom out, fit-to-screen buttons, `32px × 32px` each)
- Bottom-left: keyboard shortcut hint text (`12px / 400 / Neutral-200`)
- Bottom-right: zoom percentage (`13px / 400 / Neutral-200`)

---

### 5.3 Pre Journey Configurations

**Layout:** Right content area of lifecycle view when Stage 01 is selected.

**Header:**
- Icon: settings/gear icon `36px` in `Primary-50` circle
- Title: "Pre Journey Configurations" `20px / 600 / Neutral-400`
- Subtitle: `14px / 400 / Neutral-200`
- Right: "⟨⟩ API Reference" outline button

**Content:** Stacked accordion sections:
1. Trigger Configuration (expanded by default)
   - Info banner (Primary-50 bg)
   - Body text: `14px / 400 / Neutral-400`
   - "× Deselect" button right-aligned
   - Numbered sub-section: "1 Link Distribution" with radio cards (Targeted / Broadcast)
2. Navigation Buttons (collapsed, with "Back: On" badge)
3. Integration Type (collapsed)
4. Prefilled Data (collapsed)
5. Link Expiry Period (collapsed, with "Coming soon" badge — disabled)

**Bottom bar:**
- Sticky footer: "Nothing to configure here? Skip to the next step." text + "Skip to Next →" primary button

---

### 5.4 Theme Builder

**Layout:** Separate view accessed from "Edit theme" button or from the Journey Builder stage sub-option. *(Scope owned by reportee — document layout constraints only, not detailed specs.)*

---

### 5.5 Home / Journey List

**Layout:** Full page with sidebar. Journey cards in a grid or list view.

*(To be documented after Figma node `314:1049` is fully inspected.)*

---

### 5.6 Form Fill / Screen Editor

**Layout:** Right panel or full-width view for configuring individual page/screen content.

*(To be documented after Figma node `198:2058` is fully inspected.)*

---

### 5.7 Post Checks Configuration

Stage 03 content. Rule-based decisioning, risk assessment, compliance checks.

*(Design in progress — see Context document "Next Steps" for current status.)*

---

### 5.8 Rules Configuration

Stage 04 content. Trigger events and conditions.

*(Design in progress — pending PM feedback on auto-decisioning outcomes.)*

---

### 5.9 Meta Data Configuration

Stage 05 content. Journey metadata, environment settings.

*(To be designed.)*

---

### 5.10 Send for Review

Stage 06 content. Review, validate, and submit for approval.

*(To be designed.)*

---

## 6. Journey Stage Model

JB uses a **6-stage sequential lifecycle** for journey creation. Stages unlock progressively — a locked stage cannot be entered until its predecessor is complete (or explicitly skipped where permitted).

| # | Stage Name | Internal ID | Description | Lockable |
|---|---|---|---|---|
| 01 | Pre Journey Configurations | `pre-journey-config` | Trigger definition, link distribution, navigation, integration, prefilled data | No (always open) |
| 02 | Journey Builder | `journey-builder` | Flow editor + theme & branding | Yes |
| 03 | Post Checks | `post-checks` | Rule-based decisioning, risk assessment, compliance checks | Yes |
| 04 | Rules | `rules` | Trigger events and conditions | Yes |
| 05 | Meta Data | `meta-data` | Environment settings, configuration details | Yes |
| 06 | Send for Review | `send-for-review` | Validation, approval submission | Yes |

> **Open question:** The earlier context document listed 5 stages. The Figma file shows 6 (with "Rules" as a separate stage from "Post Checks"). The live staging screenshot shows 5 stages where "Post Checks" and "Rules" may be combined. **Confirm with PM which is canonical.**

**Stage state machine:**

```
Not Started (locked) → Not Started (unlocked) → In Progress → Complete
                              ↑                       |
                              └───────────────────────┘
                                  (re-edit allowed)
```

---

## 7. State Machine Visual Mapping

| Journey status | Visual indicator | Where shown |
|---|---|---|
| Draft | `DRAFT` warning badge (amber) | Header beside journey name |
| Published | `PUBLISHED` success badge (green) | Header beside journey name |
| In Review | `IN REVIEW` info badge (blue) | Header beside journey name |
| Stage not started | Lock icon + `Neutral-10` bg card | Lifecycle left panel |
| Stage in progress | `Primary-500` border + percentage | Lifecycle left panel |
| Stage complete | Checkmark + `100%` | Lifecycle left panel |

---

## 8. Notification Events

| Event | Recipient | Channel | Toast type |
|---|---|---|---|
| Journey saved as draft | Configurator | In-platform | Success |
| Journey submitted for review | Reviewer (Compliance Officer) | In-platform + email | Info |
| Review approved | Configurator | In-platform + email | Success |
| Review rejected with comments | Configurator | In-platform + email | Warning |
| Journey published | Configurator + Ops team | In-platform + email | Success |
| Validation errors detected | Configurator | In-platform | Error |
| GJK configuration missing | Configurator | In-platform | Warning |

---

## 9. Deviations from Prototype

The following patterns in the screen-review HTML prototype (`screen-review-with-tutorial.html`) must be corrected to match this design system.

| # | Prototype behaviour | Correct behaviour | Source |
|---|---|---|---|
| 1 | Horizontal stage navigation bar (5 stages) | Vertical stage card list in left panel (6 stages) | Figma JB lifecycle view |
| 2 | Primary colour `#2563eb` (Tailwind blue-600) | `#1766D6` (IDfy Primary-500) | IDfy design system |
| 3 | Swim lane canvas with screen nodes | Section-based flow editor with page cards + connectors | Figma flow editor |
| 4 | Right panel (360px) with review summary | No persistent right panel; content fills right area | Figma lifecycle view |
| 5 | Font: Inter | Plus Jakarta Sans, strictly | IDfy brand spec |
| 6 | `border-radius: 6px` (--radius-sm) on buttons | `8px` | IDfy component spec |
| 7 | `border-radius: 12px` (--radius-lg) on cards | `12px` — matches, but some prototype elements use `8px` inconsistently | IDfy component spec |
| 8 | Shadow-heavy elevation (--shadow-sm through --shadow-xl) | No decorative shadows except active stage card (`0px 1px 1.5px`) | IDfy elevation rules |
| 9 | Canvas dot-grid `20px` spacing | Actual canvas layout TBD from flow editor implementation | Figma flow editor |
| 10 | Button height varies (implicit in padding) | Fixed `36px` height for standard, `32px` for small | Figma button measurements |
| 11 | Hardcoded hex colours throughout CSS | Use IDfy palette tokens as specified in Section 1.2 | IDfy colour system |
| 12 | Sidebar `56px` top header | Sidebar `52px` width with integrated top section | Figma sidebar measurements |

---

## 10. Open Design Decisions

Items from the PRD and context discussions that are unresolved. Design should prepare for both paths but not implement until decided.

| ID | Question | Design impact |
|---|---|---|
| JB-1 | Is the lifecycle 5 stages or 6? (Post Checks + Rules combined or separate?) | Affects stage card count, left panel height, stage numbering |
| JB-2 | Auto-accept/auto-reject rule list for Auto-Decisioning | Pending from PM Paulomee. Blocks Rules stage design. |
| JB-3 | API Marketplace — what APIs are available? | PRD gap. Affects Integration Type accordion content. |
| JB-4 | GJK key taxonomy — final list of keys per source group | Ready to begin with expected revisions. |
| JB-5 | Operator matrix — final validation of data type operators | Ready to begin with expected revisions. |
| JB-6 | Back Office / M3 scope | Deferred pending PM feedback. |
| JB-7 | Can a configurator skip a stage entirely, or just "Skip to Next" within a stage? | Affects stage lock logic and skip affordances. |
| JB-8 | Is theme builder accessed within the flow editor or as a separate lifecycle stage? | Figma shows both paths. Affects navigation. |
| JB-9 | Does "Send for Review" include automatic validation, or is validation a manual step? | Affects stage 06 content and error surfacing. |

---

*End of document.*
