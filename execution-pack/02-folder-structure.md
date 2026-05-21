# Folder Structure

src/
├── app/
│
├── components/
│   ├── ui/
│   ├── charts/
│   ├── rankings/
│   ├── export/
│   ├── channel/
│   ├── layout/
│   └── shared/
│
├── config/
│   ├── branding.ts
│   ├── navigation.ts
│   ├── homepage.ts
│   ├── rankings.ts
│   ├── dashboard.ts
│   └── export.ts
│
├── services/
│   └── platforms/
│       ├── youtube/
│       ├── twitch/
│       ├── kick/
│       └── shared/
│
├── hooks/
│
├── store/
│
├── constants/
│
├── utils/
│
├── lib/
│
├── styles/
│
└── types/

---

# Folder Rules

## Components

Only rendering and presentation.

No business logic.

---

## Config

All editable system behavior.

---

## Services

API communication only.

---

## Hooks

Reusable logic only.

---

## Store

Global state only.

---

## Utils

Pure helper functions only.