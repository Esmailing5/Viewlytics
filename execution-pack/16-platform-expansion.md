# Multi-Platform Expansion Rules

## Objective

The architecture must support future analytics integrations for:
- YouTube
- Twitch
- Kick
- TikTok

without requiring major frontend rewrites.

---

# Core Principle

Platform logic must remain isolated.

---

# Platform Services Structure

services/platforms/
├── youtube/
├── twitch/
├── kick/
└── shared/

---

# Rules

Each platform must provide:
- normalized creator data
- normalized content data
- normalized metrics

---

# Frontend Principle

Frontend should never depend on platform-specific structures.

Frontend only consumes:
- unified analytics models
- normalized metrics
- unified ranking data

---

# Shared Metrics

Unified metrics include:
- followers/subscribers
- views
- uploads/streams
- engagement score
- growth rate

---

# Future Goal

Viewlytics evolves into:
a creator intelligence platform,
not only a YouTube analytics tool.