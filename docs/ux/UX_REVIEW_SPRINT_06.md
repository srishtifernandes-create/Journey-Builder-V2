# UX Review — Sprint 06

**Sprint**
Sprint 06 — Node Rendering & Selection

**Reviewer**
Srishti Bharara

**Review Date**
14 July 2026

---

# Objective

Evaluate the Journey Builder experience from the perspective of a Product Designer rather than an engineer.

The purpose of this review is to identify usability, visual design, interaction quality, and product maturity issues before progressing to subsequent sprints.

---

# Overall Impression

The underlying architecture is progressing well and the application now resembles a functional Journey Builder.

However, the current experience does not yet feel production-ready.

The editor currently feels closer to a developer prototype than an enterprise product.

The biggest contributors are visual language, incomplete interactions, and onboarding experience.

---

# Critical Blockers

## 1. Drag & Drop

**Severity:** Critical

Unable to drag nodes from the palette onto the canvas in the deployed build.

This blocks validation of:

- Node rendering
- Port rendering
- Node spacing
- Canvas interactions
- Future workflow creation

Sprint cannot be considered fully complete until drag-and-drop functions correctly.

---

## 2. Node Selection

**Severity:** Critical

Existing nodes cannot be visually selected.

This is a known architectural issue currently under review.

Selection ownership will be addressed through an architectural refactor before Sprint 07.

---

# Visual Design

## Color System

Current interaction green feels overly vibrant and communicates success rather than professionalism.

The interface should feel:

- Calm
- Precise
- Trustworthy
- Enterprise-ready

Reference quality:

https://www.alloy.com/

Recommendation:

- Reserve green exclusively for semantic success states.
- Use subtle neutral interaction colours for hover and focus.
- Selection should use a restrained primary accent aligned with the IDfy design language.

Priority: High

---

## Hover Behaviour

Current hover introduces green accents.

Recommendation:

- Darken border slightly
- Soft elevation
- Subtle shadow
- No green interaction colour

Hover should communicate affordance.

Selection should remain the strongest interaction state.

Priority: High

---

# Workspace Layout

## Canvas Space

The left navigation consumes valuable canvas space.

Recommendation:

Introduce a collapsible navigation rail.

Benefits:

- Larger canvas
- Better focus
- Closer to Figma, Miro and enterprise workflow tools

Priority: High

---

# Node Library

## Visual Design

Current node cards feel closer to developer tooling than enterprise software.

Recommendations:

- Improve spacing
- Remove gradients
- Premium typography
- Cleaner hierarchy
- More restrained styling

Priority: High

---

## Categories

Current categories are engineering-oriented.

The palette should expose product-oriented groupings instead.

Potential categories:

- Identity
- Documents
- Biometrics
- Risk
- Decisioning
- Business Rules
- Communication
- Utility
- Developer
- Manual Review

Priority: High

---

## Node Coverage

The library currently contains too few node types.

Expand coverage to better represent realistic onboarding journeys.

Priority: Medium

---

## Tags

Current tags (MO, FL) are not meaningful.

Replace with:

- icons
- capability indicators
- meaningful badges

Priority: Medium

---

## Descriptions

Descriptions truncate too aggressively.

Recommendation:

- Keep card height fixed
- Truncate
- Reveal complete description through tooltip

Avoid scrolling or marquee text.

Priority: Medium

---

# Empty State

Current empty state encourages starting with a blank canvas.

Opportunity:

Create a proper First-Time User Experience.

Suggested actions:

- Create from template
- Start blank
- Recent journeys
- Popular templates
- Documentation
- Guided onboarding

Priority: High

---

# Interaction Review

Successfully Verified

- Palette search
- Keyboard focus
- Tab order

Unable to Verify

- Drag-and-drop
- Node ports
- Selection
- End-to-end workflow creation

---

# Product Readiness

Current Status

Architecture:
Excellent

Engineering:
Strong

Visual Polish:
Needs improvement

Interaction Quality:
Incomplete

Enterprise Readiness:
Not yet

---

# Overall Recommendation

Do not continue implementing major product features until:

- Selection ownership is resolved
- Drag-and-drop functions reliably
- Visual language is refined
- Node palette reaches enterprise quality

Completing these foundational UX improvements will significantly improve future feature development.