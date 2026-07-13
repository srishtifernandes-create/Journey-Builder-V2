# SPRINT 01 — APPLICATION FOUNDATION

**Sprint ID:** JB-S01

**Status:** Ready for Implementation

**Priority:** Critical

**Estimated Duration:** 1 Sprint

---

# Purpose

Sprint 01 establishes the technical foundation of Journey Builder V2.

No Journey Builder functionality is implemented during this sprint.

The objective is to create a scalable application shell that future features can plug into without requiring architectural changes.

Think of this sprint as constructing the foundation of a building—not decorating the rooms.

---

# Why This Sprint Exists

The previous Journey Builder prototype tightly coupled UI, business logic and canvas interactions.

As additional functionality was added, the application became increasingly difficult to extend.

Sprint 01 deliberately avoids product functionality.

Instead it establishes:

- project structure
- routing
- layouts
- providers
- global state architecture
- feature boundaries

Future sprints will build upon this foundation.

---

# Documentation Order

Before implementation read documentation in this exact order.

1. AI_ONBOARDING.md
2. PROJECT_BRIEF.md
3. PROJECT_ARCHITECTURE.md
4. PRODUCT_SCOPE.md
5. FRONTEND_STANDARDS.md
6. Remaining documentation

Documentation is the source of truth.

If documentation conflicts, stop implementation.

Do not guess.

---

# Sprint Objective

Create a production-ready React application shell.

The result should compile successfully but intentionally contain almost no product functionality.

---

# Deliverables

## Application Shell

Create:

- Application root
- Providers
- Router
- Main Layout
- Error Boundary

The shell should become the permanent entry point of the application.

---

## Routing

Configure React Router.

Create routes only.

Required pages:

Home

404

No additional pages.

No navigation UI.

---

## Providers

Prepare providers for future use.

Examples:

AppProvider

ThemeProvider

Future providers may be added later.

No provider should contain business logic.

---

## State

Prepare Zustand stores.

Only skeleton stores.

No implementation.

Suggested stores:

UI Store

Journey Store

Selection Store

Canvas Store

No mock journey data.

No fake nodes.

No fake state.

---

## Feature Modules

Create feature folders only.

No feature implementation.

Required modules:

canvas

nodes

properties

templates

validation

journey

Each feature should own:

components

hooks

types

store

utils

services

Folders may remain empty.

---

## Shared Modules

Prepare shared folders.

shared/

components

hooks

utils

types

constants

Providers should not depend on feature folders.

---

## Styling

Prepare Tailwind integration.

Do not build UI.

Do not invent styling.

Do not create design tokens.

Design System remains the source of truth.

---

# Explicitly Out of Scope

Do NOT implement:

Canvas

React Flow

Nodes

Edges

Property Panel

Toolbar

JSON

Validation Engine

Templates

Journey Import

Journey Export

Rules

Mock APIs

Fake Data

Sample Journeys

Drag and Drop

Zoom

Pan

Minimap

Node Registry

These belong to future sprints.

---

# Files Expected

Example structure

src/

app/

layouts/

pages/

providers/

router/

store/

shared/

features/

canvas/

journey/

nodes/

properties/

templates/

validation/

hooks/

types/

utils/

assets/

---

# Files That Must Not Change

Documentation

Design System

Business Rules

HTML References

Canvas Specifications

Existing Patterns

Do not rewrite documentation.

Do not rename documentation.

---

# Engineering Constraints

React

TypeScript

Vite

React Router

Zustand

Tailwind

No additional architecture decisions.

No additional libraries.

Do not replace existing tooling.

---

# Architecture Principles

Business logic must remain independent from UI.

UI should remain independent from data.

State should remain independent from components.

Feature modules should remain isolated.

Composition over inheritance.

Small components over large components.

Strong typing over convenience.

---

# Acceptance Criteria

The project builds successfully.

npm run dev succeeds.

No TypeScript errors.

No ESLint errors.

Home page renders.

404 page renders.

Providers are wired.

Router works.

Application layout renders.

Feature folders exist.

Stores exist.

No Journey Builder UI exists.

No React Flow exists.

---

# Manual QA Checklist

Run:

npm run dev

Verify:

Application loads.

No console errors.

No warnings.

404 route works.

Folder structure matches documentation.

No mock data exists.

No business logic exists.

---

# Git Commit

feat(app): scaffold application foundation

---

# Definition of Done

Sprint 01 is complete only when:

Application foundation exists.

Documentation remains unchanged.

Future features can be implemented without restructuring the application.

No product functionality has been implemented.

Architecture is ready for Sprint 02.

---

# Sprint Completion Notes

Record:

Architecture decisions made

Unexpected implementation challenges

Recommended improvements for Sprint 02

Any documentation updates required

Append these notes to DECISION_LOG.md if architectural decisions are introduced.