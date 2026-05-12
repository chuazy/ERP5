# ERP5 Dashboard Foundation Implementation Plan

> For Hermes: implement as a GitHub Pages-compatible static app with separated config/data and reusable render functions.

**Goal:** Turn ERP5 from a placeholder page into a real enterprise harness dashboard prototype with reusable components and a config-driven model.

**Architecture:** Use a static multi-file web app: `index.html` as shell, `assets/styles.css` for theme/layout, `data/dashboard-config.js` for the enterprise harness model, and `assets/app.js` for rendering and interaction. Keep everything GitHub Pages compatible with no build step.

**Tech Stack:** HTML, CSS, vanilla JavaScript, GitHub Pages via GitHub Actions.

---

## Planned Milestones

1. Replace placeholder HTML with application shell
2. Create config-driven enterprise harness data model
3. Implement reusable renderers for overview, topology, governance, memory/skills, walkthroughs
4. Deploy and verify on GitHub Pages
