# UI Architecture

## Philosophy

Frontend is a visualization layer.

It must:
- stay modular
- stay scalable
- avoid coupling
- support future expansion

---

# Component Structure

## UI Components

Reusable primitives:
- buttons
- cards
- inputs
- modals

Location:
components/ui/

---

## Feature Components

Feature-specific components:
- rankings
- analytics widgets
- channel cards

Location:
components/channel/
components/rankings/

---

## Layout Components

Global layout:
- navbar
- sidebar
- footer

Location:
components/layout/

---

# Data Flow

Services → Hooks → Components

Never:
Components → External APIs

---

# Forbidden

- duplicated state
- duplicated UI
- API calls inside UI
- hardcoded business logic