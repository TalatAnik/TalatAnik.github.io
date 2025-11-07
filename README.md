# Three.js Render Target + GSAP Animation Experiment

## 🧠 Overview

This project explores how a **Three.js render target** can be treated like a regular **HTML element** that can then be animated using **CSS** and **GSAP**.  
The purpose is both **technical** and **educational** — to deeply understand how render targets work, and to learn how they can interact with standard web animation techniques.

This is a **collaborative learning project** between the developer and **GitHub Copilot**.  
Copilot will assist with **scaffolding**, **boilerplate setup**, and **code completion**, while the main logic and architectural decisions are written and understood by the developer.

---

## 🎯 Objectives

- Learn how to use and manipulate **render targets** in Three.js  
- Display the render target as a **texture on an HTML element (e.g., canvas or img)**  
- Animate the render output using **CSS transforms and GSAP**  
- Keep the project **simple, modular, and well-documented**  
- Use **Copilot responsibly**: as a coding partner for suggestions and structure, not a code generator

---

## 🧩 Tech Stack

- **Three.js** — for WebGL rendering  
- **GSAP** — for smooth, timeline-based animations  
- **Vite** or **Parcel** — for a fast, minimal dev environment  
- **Vanilla JavaScript (ES Modules)** — to keep the setup lightweight  
- **HTML/CSS** — for styling and integration

---

## 🏗️ Project Goals

1. **Render Scene → Render Target:**  
   Create a Three.js scene rendered into an offscreen `WebGLRenderTarget`.

2. **Display Render Target in DOM:**  
   Convert or attach the render target output (texture) to an HTML element.

3. **Animate It:**  
   Apply CSS and GSAP-based animations to the rendered output — such as rotation, scaling, opacity, and motion synced with scroll or UI events.

4. **Iterate and Observe:**  
   Adjust Three.js settings (camera, materials, post-processing) and observe how they interact with DOM-based animations.

---

## 🤝 Developer–Copilot Collaboration Guidelines

This project is meant to **teach through collaboration**.  
To make Copilot most effective and educational:

- Write **clear file comments** and **JSDoc summaries** explaining intentions before coding  
- Let Copilot propose **boilerplate** and **completions**; review and understand each suggestion  
- Keep commits **atomic** and **annotated** — summarize what was learned or changed  
- Periodically **refactor manually** to reinforce understanding  
- Avoid letting Copilot fill in large chunks of logic without direction

---

## 📂 Suggested Folder Structure

project-root/
│
├── src/
│ ├── main.js # Entry point
│ ├── scene.js # Three.js scene and render target setup
│ ├── animation.js # GSAP + CSS animation logic
│ ├── utils.js # Helper functions
│ └── styles.css # Basic layout and animation styles
│
├── index.html # Minimal HTML container
├── package.json
├── vite.config.js # (Optional) for local dev server
└── copilot.json # Project context for Copilot collaboration