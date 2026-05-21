# Core Protection System

## Snapshot System

Analytics must depend on:
- historical subscribers
- historical views
- historical uploads

Snapshots are core value.

---

## API Isolation

Frontend NEVER communicates directly with external APIs.

All requests go through internal backend.

---

## Ranking Engine

Ranking calculations remain private.

Frontend only receives:
- labels
- rankings
- final scores

---

## Search Normalization

Normalize:
- URLs
- @handles
- channel names

inside service layer only.

---

## Core Principle

Frontend is not the product.

The real value is:
- historical data
- analytics intelligence
- ranking systems
- insights