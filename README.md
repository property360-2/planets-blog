# Solar System Showcase

An immersive, high-fidelity, and interactive web experience exploring the wonders of our solar system. This project combines procedural SVG art, fluid motion design, and a responsive "Deep Dive" system to deliver a museum-grade educational experience.

## Key Features

- **Interactive Planet Illustrations**: Data-driven SVG visuals with procedural banding, atmospheric glows, and recognizable features (e.g., Jupiter's Great Red Spot, Saturn's rings).
- **3D Visual Fidelity**: Custom clipping paths and layered SVG rendering for a "wrap-around" ring effect on Saturn.
- **Deep-Dive Side Drawer**: Interactive detail view for every planet, revealing internal layer compositions, core facts, and historical missions.
- **Fluid Typography & Motion**: A fully responsive typography system using `clamp()` and smooth scroll-reveal animations powered by `anime.js`.
- **Immersive Starfield**: A multi-layered parallax starfield rendered on a high-performance 2D canvas.
- **Smart Mobile Design**: Adaptable layout that hides the navigation sidebar on smaller viewports to prioritize planet visuals and content legibility.
- **Contextual Tooltips**: Dynamic informational tooltips that provide definitions for planetary statistics on hover.

## Technology Stack

- **Core**: Semantic HTML5, Vanilla JavaScript (ES6+).
- **Styling**: Vanilla CSS with a token-based design system and CSS variables.
- **Animation**: [anime.js](https://animejs.com/) for complex timelines and motion logic.
- **Graphics**: Scalable Vector Graphics (SVG) and HTML5 Canvas.

## Installation & Usage

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/solar-system-showcase.git
   ```
2. **Navigate to the directory**:
   ```bash
   cd solar-system-showcase
   ```
3. **Run a local server**:
   Since the project uses ES6 modules and external assets, it's best viewed through a local server.
   ```bash
   npx http-server
   ```
4. **Open in Browser**:
   Visit `http://localhost:8080` (or the port provided by your server).

## Design Philosophy

The project follows a "Glassmorphic" and "Dark Mode" aesthetic, utilizing vibrant planetary accents against a deep space background. The focus is on **immersion**—reducing interface clutter on smaller screens and using micro-animations to reward user interaction.

## Credits

- **Fonts**: [Syne](https://fonts.google.com/specimen/Syne) for headers, [DM Mono](https://fonts.google.com/specimen/DM+Mono) for data, and [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) for editorial accents.
- **Icons**: Custom SVG icons and symbols.
- **Animation Library**: [anime.js](https://animejs.com/)

---

Developed by Antigravity.
