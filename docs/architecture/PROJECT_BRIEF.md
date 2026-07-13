# PROJECT_BRIEF.md

> **Project:** Journey Builder V2
>
> **Status:** Product Vision & Engineering Context
>
> This document is the primary orientation guide for every engineer and AI assistant contributing to the Journey Builder project.
>
> If there is uncertainty about the purpose of a feature, consult this document first before implementation.

---

# 1. Vision

Journey Builder is a visual workflow builder that enables banks, fintechs and enterprises to create digital onboarding and KYC journeys without writing code.

Instead of engineering teams hardcoding onboarding experiences, Journey Builder allows Product Managers, Operations teams and Implementation teams to visually compose complete customer journeys using reusable nodes.

The application should feel closer to professional workflow tools such as Figma, React Flow, Retool or Camunda than to a traditional form builder.

The objective is to reduce implementation time while maintaining enterprise-grade flexibility.

---

# 2. Problem Statement

Today, onboarding journeys are largely implemented by engineering teams.

This results in:

- Slow implementation cycles
- Expensive change requests
- Duplicate engineering effort
- Difficult maintenance
- Inconsistent customer journeys
- Poor scalability

Journey Builder solves this by introducing a visual canvas where journeys are assembled through reusable building blocks.

---

# 3. Target Users

Primary Users

- Product Managers
- Business Analysts
- Solution Consultants
- Operations Teams
- Implementation Teams

Secondary Users

- Designers
- QA Teams
- Frontend Engineers
- Backend Engineers

The application is not intended for end customers.

---

# 4. Product Goals

Journey Builder should allow users to:

- Create onboarding journeys visually
- Connect workflow nodes
- Configure node behaviour
- Define branching conditions
- Configure validation rules
- Preview journey execution
- Export journey configuration as structured JSON

The generated JSON becomes the contract between frontend and backend systems.

---

# 5. Product Philosophy

Journey Builder is **not** a screen design tool.

It is a workflow orchestration platform.

Users build logic.

The interface visualizes logic.

The application should prioritize clarity over decoration.

Every interaction should reduce cognitive load.

---

# 6. Core Concepts

The platform revolves around six concepts.

## Journey

A complete onboarding workflow.

Example

Savings Account Opening

Business KYC

Credit Card Onboarding

Video KYC

Merchant Onboarding

---

## Node

The smallest functional unit.

Examples include

Start

Form

API

Document Upload

OTP

Branch

Rule

Decision

Video KYC

Success

Failure

Nodes own behaviour.

---

## Edge

A connection between two nodes.

Edges represent execution flow.

Edges may contain labels or conditions.

---

## Properties

Every selected node exposes configurable properties.

Properties modify behaviour without changing node structure.

---

## Rules

Rules determine execution logic.

Examples

Age > 18

PAN Verified

CKYC Available

Face Match > Threshold

Rules are evaluated independently from UI components.

---

## Journey JSON

The serialized representation of an entire workflow.

Journey JSON is the application's single source of truth.

Everything on the canvas must serialize into Journey JSON.

---

# 7. Phase 1 Scope

Phase 1 focuses on creating a production-quality frontend demonstration suitable for:

- Engineering handoff
- Product demonstrations
- Internal validation
- UX testing

Phase 1 intentionally uses mock data.

Backend integration is not included.

---

# 8. Phase 1 Deliverables

The application must include:

✓ Interactive canvas

✓ Drag and drop node placement

✓ Zoom

✓ Pan

✓ Node selection

✓ Edge creation

✓ Node properties panel

✓ Rule configuration

✓ Journey validation

✓ JSON generation

✓ Basic project structure

✓ Enterprise-ready architecture

---

# 9. Phase 1 Exclusions

Phase 1 does NOT include:

Authentication

Real APIs

Database

User management

Version history

Real-time collaboration

Execution engine

Deployment pipelines

Backend services

Analytics

Audit logs

---

# 10. Design Principles

The interface should be:

Minimal

Professional

Enterprise-first

Predictable

Low cognitive load

Highly scannable

Responsive

Accessible

Figma remains the visual source of truth.

No UI should be invented beyond documented designs.

---

# 11. Engineering Principles

The frontend should be written as if backend APIs already exist.

Mock data should be replaceable with real APIs without requiring architectural changes.

Business logic must remain independent from presentation.

Journey JSON is the application's canonical state.

---

# 12. Success Criteria

The project is successful when:

A Product Manager can build a complete onboarding journey without engineering assistance.

A Frontend Engineer can extend the application without refactoring the architecture.

A Backend Engineer can integrate against the generated Journey JSON.

A Designer can iterate on interaction patterns without affecting business logic.

---

# 13. Documentation Hierarchy

Implementation decisions should follow this order:

1. PROJECT_BRIEF.md
2. PROJECT_ARCHITECTURE.md
3. PRODUCT_SCOPE.md
4. FRONTEND_STANDARDS.md
5. Design_System.md
6. business_rules.md
7. existing_patterns.md
8. Canvas_Component_Inventory.md
9. HTML reference modules
10. Figma

If conflicts occur, documentation higher in the hierarchy takes precedence.

---

# 14. AI Contribution Rules

Every AI-generated implementation must follow these principles.

Never invent product requirements.

Never invent node types.

Never invent business rules.

Never invent APIs.

Never invent workflows.

Never introduce placeholder functionality.

Never rewrite architecture without instruction.

Always prefer documented behaviour over assumptions.

If documentation is insufficient, stop implementation and request clarification.

---

# 15. Long-Term Vision

Journey Builder should evolve into a production-ready workflow platform capable of supporting:

- Multiple onboarding products
- Reusable node libraries
- Marketplace templates
- Rule engine integrations
- Backend orchestration
- Versioning
- Collaboration
- Enterprise deployment

Every architectural decision made during Phase 1 should support this future without requiring fundamental rewrites.