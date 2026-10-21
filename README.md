# Tarun.K — Cinematic Multi-Page Portfolio

An ultra-modern, performant, and cinematic multi-page developer portfolio built with semantic HTML5, modern CSS3, responsive typography, and zero-bloat vanilla JavaScript.

## 🌟 Highlights

- **Multi-Layer Staggered Page Shift Transition:** Buttery smooth top-down cascading transitions (`Gray -> White -> Black`) between routes with zero browser reload flicker.
- **Cinematic Welcome Intro:** Elegant, relaxed welcome sequence (`"Welcome to my portfolio."` → `"TARUN.K — Design. Develop. Deploy."`) with skip handler and replay toggle.
- **Executive Page Palettes:**
  - **Page 1 (Home):** Sleek monochrome black & white minimalist canvas with responsive interactive shapegrid and executive tech typography (`Plus Jakarta Sans` & `Inter`).
  - **Page 2 (Projects):** Charcoal and electric purple theme featuring interactive live preview modal, category filtering, and open-source GitHub repositories.
  - **Page 3 (My Expertise):** Deep dark obsidian and vibrant energetic orange theme covering programming capabilities, web architectures, and cloud systems.
  - **Page 4 (Contact):** Ultra-deep inky midnight abyss blue (`#01030a`), volumetric overhead spotlight, direct channels, and Formspree integration (`https://formspree.io/f/mqeyqlzw`) with instant confirmation feedback (`✓ msg sent`).
- **Responsive Mobile Navigation:** Minimalist pure white mobile toggle that transforms into a symmetric centered "✕" without duplicate ghost elements.

## 📁 Project Structure

```
├── index.html          # Page 1: Home (Monochrome Minimalist)
├── project.html        # Page 2: Projects (Electric Purple)
├── expertise.html      # Page 3: My Expertise (Dark Obsidian & Orange)
├── contact.html        # Page 4: Contact (Deep Midnight Abyss Blue)
├── css/
│   ├── base.css        # Global variables, typography, reset & shared nav
│   ├── transitions.css # Page shifts, intro animations & keyframes
│   ├── home.css        # Home page styles, layout & interactive canvas
│   ├── projects.css    # Projects grid, cards & modal preview styles
│   ├── expertise.css   # Technical capability grids & radar cards
│   └── contact.css     # Deep midnight blue contact form & channels
├── js/
│   ├── transitions.js  # Seamless SPA-style content swaps & intro controller
│   ├── projects.js     # Project filtering, search & modal viewer
│   └── contact.js      # Form validation & Formspree submission handler
├── assets/
│   └── images/         # Project screenshots and previews
└── serve.js            # Lightweight local static development server
```

## 🚀 Getting Started

To run locally:

```bash
node serve.js
```

Or open `index.html` directly in any modern browser.

---
© 2026 Tarun.K. Built with purposeful design and zero bloat.
