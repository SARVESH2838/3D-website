# 🚀 Techfest CA Nexus — A Simulated Paradigm

A cutting-edge, highly interactive 3D Web Experience built for the **Techfest, IIT Bombay Campus Ambassador Mission**. This portfolio transforms standard web presentation into a high-fidelity, interactive technical terminal. Adhering to the Techfest theme **"A Simulated Paradigm"**, the site fuses advanced interactive 3D particle physics, fluid spatial camera journeys, and an agency-grade responsive cybernetic UI layout.

🔗 **Live Experience:** [sarvesh2838.github.io/3D-website/](https://sarvesh2838.github.io/3D-website/)

---

## ✨ Key Features & Core Upgrades

### 🎨 1. Premium Agency Aesthetics & Typography
* **Typography Engine:** Upgraded from generic "AI-template" fonts to a hand-crafted, high-fidelity premium design pairing:
    * `Syne` — An ultra-modern, geometric display font for structural impact headers.
    * `Plus Jakarta Sans` — A clean, sleek geometric sans-serif for reading interface and body copy.
    * `Space Mono` — A technical monospace style for system tags, numbers, statistics, and metrics.
* **Surgical UI Refinement:** Hand-corrected apex padding distributions to pull the massive hero font blocks upward, eliminating unwanted vertical empty space beneath the navigation deck and beautifully positioning the "Launch Your Campus..." header entirely above the fold on launch.
* **Advanced Glassmorphism:** Replaced heavy borders with ultra-thin, low-opacity glass boundaries (`rgba(255, 255, 255, 0.06)`), glowing box shadows on hover, and embedded corner crosshairs (`+`) using CSS pseudo-elements to invoke an immersive grid-system diagnostic console look.

### 🌊 2. Smooth 3D Scroll Journey & Motion Mechanics
* **Kinetic Scroll Engine:** Integrated **Lenis Smooth Scroll** to completely decouple jittery manual scrolling into a buttery, physics-based, high-refresh-rate vertical track.
* **Linear Coordinate Mapping (`nexusCanvas`):** Page scrolling values are translated into 3D transformations via step-by-step spatial coordinates interpolation:
    * **Section 1 (Hero):** Matrix particles rest dynamically as an offset focal node on the right.
    * **Section 2 (Stats):** The particle web moves into dead center, scaling up by `1.4x` for hyper-focal attention.
    * **Section 3 (Role):** Coordinates shift horizontally leftward with a responsive, smooth matrix tilt.
    * **Section 4 (Journey):** Particles slowly disperse outwardly into a beautiful "flying-through-a-wormhole" tunnel depth effect.
    * **Section 5 (CTA):** Re-assembles gracefully into a glowing structural background halo.
* **Fluid Fluidity (`auroraCanvas`):** Custom scroll velocity variables hook straight into the aurora grid framework, creating dynamic cosmic drift acceleration as the user travels further through the site.

### 🕹️ 3. The "Simulated Paradigm" Interactive Layer
* **Particle Magnetism & Lerping:** Mouse hover vectors interlock directly with the 3D canvases. Moving your cursor subtly warps, pulls, and magnetizes neighboring node particles before seamlessly easing them back to their scroll-mapped coordinates.
* **Text-Scramble Terminal Effect:** Interface headings utilize a cryptographic JavaScript matrix scramble loop that visually "decodes" strings when elements scroll actively into view.

---

## 🛠️ Technology Stack & Dependencies

* **Core Canvas:** Raw `Three.js` / WebGL context rendering high-performance mathematical node structures.
* **Scroll Engine:** `Lenis` (Studio Freight) lightweight scroll interpolation client.
* **Style Framework:** Custom structural CSS architecture utilizing advanced layout variables, modern grid structures, and variable fluid media-queries.
* **Fonts Distribution:** Google Fonts Engine via unified asynchronous delivery.

---

## 📂 Project Architecture

```bash
├── index.html         # Main structural layout, metadata, HUD containers & data nodes
├── css/
│   └── styles.css     # Agency typography rules, layout fixes, and glassmorphic micro-animations
└── js/
    ├── main.js        # Main initialization, WebGL context loop, and particle orchestration
    └── lenis.min.js   # Embedded smooth scrolling controller matrix
