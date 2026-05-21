# Documentation Rules

## Objective

All code must be understandable, maintainable, and reusable.

The project should remain easy to scale even after months of development.

---

# Core Rule

Important logic must always include descriptive comments.

Comments should explain:
- purpose
- reasoning
- architectural intent

NOT obvious syntax.

---

# Required Comment Areas

## Services

Explain:
- API purpose
- normalization logic
- transformations
- caching logic

---

## Hooks

Explain:
- reusable behavior
- state flow
- optimization purpose

---

## Complex Components

Explain:
- rendering strategy
- composition logic
- responsive behavior

---

## Utilities

Explain:
- expected inputs
- outputs
- edge-case handling

---

## Config Files

Every config must explain:
- what it controls
- expected usage
- expansion possibilities

---

# Forbidden Comments

Avoid useless comments like:
- "increment counter"
- "render div"

Comments must add architectural value.

---

# Documentation Standard

Code should feel:
- enterprise-ready
- maintainable
- readable by future developers

---

# Scalability Principle

A future developer must understand the system quickly without needing external explanations.