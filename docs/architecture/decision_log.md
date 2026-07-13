# DECISION LOG

This document records architectural decisions made throughout the Journey Builder project.

---

## Decision 001

**Title**

Journey JSON is the single source of truth.

**Reason**

Allows serialization, backend integration and scalable architecture.

**Date**

13 July 2026

---

## Decision 002

**Title**

React Flow is the mandatory canvas engine.

**Reason**

Avoids rebuilding pan, zoom, drag, minimap and edge management.

**Date**

13 July 2026

---

## Decision 003

**Title**

Zustand manages global application state.

**Reason**

Simple, scalable and ideal for React Flow integration.

**Date**

13 July 2026