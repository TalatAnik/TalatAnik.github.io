# Portfolio Website — Three.js + GSAP

## 🧠 Overview

This is a **personal portfolio website** designed to showcase work through an immersive, scroll-driven experience powered by **Three.js** and **GSAP**. The project is built in **three phases**, progressively adding interactivity, 3D elements, and visual polish.

This is a **collaborative learning project** between the developer and **GitHub Copilot**.  
Copilot assists with **scaffolding**, **boilerplate setup**, and **code suggestions**, while the developer writes and understands all core logic and architectural decisions.

---

## 🎯 Project Phases

### **Phase 1: Core Layout & Scroll Animation** (Current)
Build the foundational scroll-driven layout with GSAP ScrollTrigger.

**Sections:**
1. **Section 1 (Hero):**  
   - Text on the left  
   - Image/placeholder on the right  
   - Image stays fixed initially, then moves horizontally (to the right) as user scrolls toward Section 2

2. **Section 2:**  
   - New text appears on the left when image moves  
   - Image continues horizontal movement

3. **Section 3:**  
   - Image scales down to a small size and centers itself in the viewport  
   - Text for Section 3 animates in (does NOT scroll in naturally; triggered animation when user reaches this section)  
   - Image then scrolls up out of view to reveal Section 3 content

4. **Section 4:**  
   - Two columns animate in from opposite sides  
   - Footer animates in last

**Global:**
- Sticky top navigation bar throughout the experience

**Tech:**
- GSAP + ScrollTrigger for all scroll animations  
- Vanilla HTML/CSS with modular JS  
- Placeholder image (later replaced with Three.js canvas in Phase 2)

---

### **Phase 2: Three.js 3D Model Integration** (Planned)
Replace the placeholder image with a **Three.js canvas** rendering an animated 3D model.

**Features:**
- Import and render a 3D model (GLB/GLTF)  
- Camera position changes as user scrolls (synchronized with scroll progress)  
- Subtle camera movement following mouse position (parallax effect)  
- Model stays in sync with scroll animations from Phase 1

**Tech:**
- Three.js (scene, camera, lighting, model loader)  
- GSAP to drive camera animations  
- Mouse event listeners for interactive camera movement

---

### **Phase 3: SVG Animations & Visual Polish** (Planned)
Enhance the site with decorative SVG animations and micro-interactions.

**Features:**
- Animated SVG graphics and icons  
- Smooth transitions between sections  
- Hover effects and interactive elements  
- Loading animations  
- Scroll progress indicators

**Tech:**
- GSAP for SVG animations  
- CSS transitions for micro-interactions  
- Potentially lottie-web for complex animations

---

## 🧩 Tech Stack

- **Three.js** — WebGL 3D rendering  
- **GSAP + ScrollTrigger** — Scroll-driven animations and timelines  
- **Vite** — Fast dev server and build tool  
- **Vanilla JavaScript (ES Modules)** — Modular, maintainable code  
- **HTML5/CSS3** — Semantic markup and modern styling

---

## 🏗️ Current Status

### ✅ Completed
- Basic project scaffolding (Vite, package.json, index.html)  
- Three.js scene setup with GLTFLoader  
- Emissive toon shader material for black-and-white clamped rendering  
- On-screen UI control for threshold adjustment  
- Material caching and performance optimizations  
- Minimal standalone HTML demo for model rendering

### 🚧 In Progress
- Phase 1: Implementing four-section scroll layout with GSAP ScrollTrigger  
- Setting up sticky navigation  
- Building image/placeholder movement and scaling animations

### 📋 To Do
- Complete Phase 1 sections and animations  
- Test and refine scroll timing  
- Phase 2: Integrate 3D model with scroll-driven camera  
- Phase 2: Add mouse-driven camera parallax  
- Phase 3: SVG animations and polish  
- Deploy to GitHub Pages

---

## 📂 Project Structure

```
portfolio/
│
├── public/
│   └── assets/          # 3D models, textures, images
│
├── src/
│   ├── main.js          # Entry point
│   ├── scene.js         # Three.js scene setup (Phase 2)
│   ├── materials.js     # Custom shader materials (Phase 2)
│   ├── styles.css       # Global styles
│   │
│   └── ui/
│       ├── controls.js  # On-screen UI controls
│       └── scrollScale.js # Scroll-driven scaling (Phase 1)
│
├── index.html           # Main HTML entry
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── copilot.json         # Copilot collaboration context
└── readme.md            # This file
```

---

## 🚀 Development

### Install dependencies
```bash
npm install
```

### Start dev server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

---

## 🤝 Developer–Copilot Collaboration

- **Developer role:** Write core logic, make architectural decisions, understand every implementation  
- **Copilot role:** Suggest patterns, provide boilerplate, explain unfamiliar APIs  
- **Communication style:** Concise, educational suggestions over long outputs  
- Keep code **modular**, **readable**, and **well-commented**  
- Avoid placeholder content; focus on functional, production-ready code

---

## 📝 Notes

- The website will be deployed to **GitHub Pages** (repository: `TalatAnik.github.io`)  
- Phase 1 focuses on **scroll animations** only — no Three.js yet  
- Three.js integration happens in **Phase 2** after scroll layout is solid  
- SVG animations and polish are saved for **Phase 3**

---

## 📅 Timeline

- **Phase 1:** Core scroll layout — Target: Week 1-2  
- **Phase 2:** Three.js integration — Target: Week 3-4  
- **Phase 3:** SVG polish and deployment — Target: Week 5+