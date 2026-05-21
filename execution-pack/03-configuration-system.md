# Configuration System

## Objective

All configurable application behavior must be isolated from business logic.

The goal is:
- fast modifications
- scalable maintenance
- future admin systems
- easier CMS integration

---

# Core Principle

Never hardcode configurable content inside components.

---

# Required Config Files

## Branding Config

src/config/branding.ts

Controls:
- colors
- logo paths
- watermark
- gradients
- typography

---

## Navigation Config

src/config/navigation.ts

Controls:
- navbar items
- footer links
- menus

---

## Homepage Config

src/config/homepage.ts

Controls:
- hero sections
- homepage widgets
- featured rankings
- trending blocks

---

## Rankings Config

src/config/rankings.ts

Controls:
- categories
- labels
- SEO titles
- ordering

---

## Dashboard Config

src/config/dashboard.ts

Controls:
- enabled widgets
- analytics sections
- chart visibility

---

## Export Config

src/config/export.ts

Controls:
- export dimensions
- watermark behavior
- social templates

---

# Benefits

This architecture enables:
- future admin panels
- CMS integration
- dynamic rendering
- easier scalability