# Portfolio Website — Talat Anik

## 🧠 Overview

This is a **personal portfolio website** for **Talat Anik**, designed with a focus on **award-worthy design** and immersive user experience. The site showcases full-stack development expertise through a minimalist, elegant design powered by **Three.js** and **GSAP**.

The project is built in **three phases**, progressively adding interactivity, 3D elements, and visual polish.

This is a **collaborative learning project** between the developer and **GitHub Copilot**.  
Copilot assists with **scaffolding**, **boilerplate setup**, and **code suggestions**, while the developer writes and understands all core logic and architectural decisions.

---

## 🎯 Project Phases

### **Phase 1: Core Layout & Design** ✅ (Complete)
Build the foundational structure with stunning visual design and scroll animations.

**Design Principles:**
- Minimalist elegance with sophisticated typography
- Dark theme (#0a0a0a background) with subtle white accents
- Mix-blend-mode navigation for modern aesthetic
- Smooth, purposeful animations

**Sections:**
1. **Abstract Introduction:**  
   - Two-sentence philosophical statement about craft and engineering  
   - Large serif headline with secondary muted text  
   - Placeholder for 3D visualization on the right  
   - Grid layout with elegant spacing

2. **Frontend Expertise:**  
   - Clean section title  
   - 4-column grid of core frontend skills  
   - Hover effects with subtle elevation  
   - Staggered fade-in animations

3. **Backend Expertise:**  
   - Matching layout to frontend section  
   - 4-column grid of backend skills  
   - Consistent styling and interactions  
   - Progressive reveal on scroll

**Navigation:**
- Sticky, transparent navigation with no background  
- Name (Talat Anik) on the left  
- Minimal 3-line menu button on the right  
- Mix-blend-mode for visibility over any background

**Tech:**
- GSAP + ScrollTrigger for scroll animations  
- Vanilla HTML/CSS with modern CSS Grid  
- Modular JavaScript (ES Modules)  
- Custom CSS properties for theming

---

### **Phase 2: Three.js 3D Model Integration** (Planned)
Replace the placeholder with a **Three.js canvas** rendering an animated 3D model.

**Features:**
- Import and render a 3D model (GLB/GLTF) with emissive toon shader  
- Camera position changes as user scrolls (synchronized with scroll progress)  
- Subtle camera movement following mouse position (parallax effect)  
- Model integrated into intro section layout

**Tech:**
- Three.js (scene, camera, lighting, GLTFLoader)  
- Custom emissive toon shader (already implemented in src/materials.js)  
- GSAP to drive camera animations  
- Mouse event listeners for interactive camera movement

---

### **Phase 3: SVG Animations & Visual Polish** (Planned)
Enhance the site with decorative SVG animations and micro-interactions.

**Features:**
- Animated SVG graphics and icons  
- Smooth transitions between sections  
- Enhanced hover effects and interactive elements  
- Loading animations  
- Scroll progress indicators  
- Additional micro-interactions

**Tech:**
- GSAP for SVG animations  
- CSS transitions for micro-interactions  
- Potentially lottie-web for complex animations

---

## 🧩 Tech Stack

- **Three.js 0.160.0** — WebGL 3D rendering with custom shaders  
- **GSAP 3.12.0 + ScrollTrigger** — Scroll-driven animations and timelines  
- **Vite 5.0.0** — Fast dev server and build tool  
- **gh-pages 6.1.0** — GitHub Pages deployment  
- **Vanilla JavaScript (ES Modules)** — Modular, maintainable code  
- **HTML5/CSS3** — Semantic markup and modern styling

---

## 🏗️ Current Status

### ✅ Completed
- Phase 1: Complete portfolio structure with 3 main sections  
- Award-worthy visual design with dark minimalist theme  
- Sticky transparent navigation (name + menu button)  
- Abstract introduction section with philosophical copy  
- Frontend & Backend expertise sections with skill grids  
- GSAP ScrollTrigger animations for all sections  
- Responsive design for mobile, tablet, desktop  
- GitHub Pages deployment configuration  
- Emissive toon shader material (ready for Phase 2)  
- Three.js scene setup with GLTFLoader (ready for Phase 2)

### 🚧 In Progress
- Testing and refinement of Phase 1 implementation  
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