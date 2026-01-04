# UX Design Specification: Stellar Co-Pilot (Operational Velocity)

**Version:** 1.0
**Status:** Approved
**Date:** 2025-12-23
**Author:** UX Agent / Joe (Consultant)

## 1. Design Philosophy: "The Cockpit"
* **Metaphor:** A high-density, dark-mode interface that gives the recruiter total situational awareness (Map) and operational control (Crew Panel).
* **Emotional Goal:** "Command." Transform the user from an anxious "Order Taker" to a calm "Order Maker."
* **Principle:** "No Pixel Wasted." High information density, minimal whitespace.

## 2. Global Visual Foundation
* **Framework:** Tailwind CSS + Shadcn UI (Radix).
* **Theme:** "Stellar Glass" (Dark Mode).
    * `bg-background`: `bg-slate-950`
    * `bg-card`: `bg-slate-900/50 backdrop-blur-md` (Top-level containers only)
    * `radius`: `rounded-sm` (Sharp, tactical look)
* **Color Semantics (Traffic Light System):**
    * **Success (Green):** `text-emerald-400` (Inside Zone / Compliant / Margin Safe).
    * **Warning (Yellow):** `text-amber-400` (Margin Risk / Expiring / Non-blocking).
    * **Danger (Red):** `text-rose-400` (Unavailable / Error / Blocking).

## 3. Core Interface: The "Bench Match" Map (Direction 2)

### 3.1 The Layout
* **Background:** Full-screen `GeospatialMap` component.
* **Overlay (Right):** A Collapsible Glass Panel (Width: 400px Desktop, 35% iPad).
    * *State:** Can be "Pinned" (always open) or "Floating" (dismissible).
* **Overlay (Top-Center):** "Live Squad Tally" (Sticky Header).
    * *Content:* Headcount (e.g., 5/10) | Avg Cost ($45/hr) | Margin Status.

### 3.2 The Map Layer (The Terrain)
* **Isochrone Toggle:** Switch to render "Green Zone" (30-min drive time).
* **Pin Logic:**
    * **Green Pin:** Inside zone.
    * **Yellow Pin:** Outside zone (Margin Risk).
    * **Red Pin:** Unavailable.
* **Interaction:**
    * **Tap/Click Pin:** Selects pin + Context Tooltip.
    * **Drag Pin:** Draggable object for the "Crew Panel."

### 3.3 The Crew Panel (The Action)
* **Structure:** List of "Crew Slots."
* **Interaction:**
    * **Desktop:** Drag Pin -> Drop on Panel.
    * **Touch:** Tap Pin -> "Add to Crew" button in action bar.
* **Feedback:** "Live Squad Tally" updates instantly.

## 4. Operational Features

### 4.1 "Flash Comms" (WhatsApp)
* **Trigger:** "Deploy Crew" or "Select All."
* **Modal:** Glass modal with:
    1.  **Generated Message:** *"Job: [Project]. Rate: [$]. Start: [Date]. Reply YES."*
    2.  **Action:** "Copy to Clipboard" + "Open WhatsApp Web."

### 4.2 "Crew" Entity Management
* **Concept:** Treat a group of workers as a single unit.
* **Visual:** Drag a "Crew Card" onto a Project to auto-fill slots.

## 5. UX Pattern Decisions

### 5.1 Consistency Rules
1.  **Button Hierarchy:**
    * **Primary (Deploy):** Solid Emerald Green.
    * **Secondary (Edit):** Glass White.
2.  **Feedback Patterns:**
    * **Non-Blocking Margin Warning:** Loud but permissive. Warn, don't stop.
    * **Error:** Blocking (Red border + Shake).
3.  **Navigation:**
    * **Context:** Never leave the Dashboard unless necessary. Use Side Panels (Sheets).

## 6. Component Strategy
1.  **Crew Slot:** Drop zone built with `@dnd-kit`.
2.  **Live Tally Header:** Reactive component with Framer Motion number ticks.
3.  **Action Pin:** Custom Leaflet DivIcon with React event handlers.
4.  **Glass Segmented Control:** For toggling Map/List views.
5.  **WhatsApp Blaster:** Modal for clipboard logic.

## 7. Responsive & Accessibility (iPad First)
* **Breakpoint:** < 1200px triggers "Tablet Mode" (Floating Drawer).
* **Touch Targets:** Minimum 44x44px.
* **Performance:**
    * **Glass Tax:** Only apply `backdrop-blur` to containers, not list items.
    * **Events:** `stopPropagation` on map pins to prevent zoom-on-tap.

## 8. Implementation Guidance
1.  **DND Performance:** Use `translate` transforms.
2.  **State Management:** `CrewContext` drives the Tally.
3.  **Library:** Shadcn UI (Radix) for base components, customized to "Stellar Glass."