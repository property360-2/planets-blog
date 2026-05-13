/*
  Solar System Showcase Runtime
  Purpose: Adds data-driven SVG planet art, the hero orrery, starfield rendering, custom cursor behavior, scroll progress, active navigation, and reveal animation.
  Contents: Planet constants, SVG template builders, DOM initialization helpers, canvas starfield controls, and anime.js interaction timelines.
  System fit: Keeps animation and generated visual logic separate from index.html, which remains the content and semantic structure for the page.
*/

const MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");
const SVG_NS = "http://www.w3.org/2000/svg";
const PLANETS = [
  { 
    id: "sun", name: "Sun", color: "#ffb347", size: 174, bands: ["#ffd36f", "#ff8d3a", "#fff0a8"], orbit: 0,
    layers: [
      { name: "Core", percentage: 25, desc: "Site of nuclear fusion, 15 million °C." },
      { name: "Radiative Zone", percentage: 45, desc: "Energy moves outward via photon random walk." },
      { name: "Convective Zone", percentage: 30, desc: "Plasma columns carry heat to the surface." }
    ],
    deepDive: "The Sun is a near-perfect sphere of hot plasma. It generates magnetic fields via a dynamo process, driving solar flares and Coronal Mass Ejections.",
    missions: ["Parker Solar Probe (Closest approach)", "SOHO (Long-term monitoring)", "Solar Orbiter"]
  },
  { 
    id: "mercury", name: "Mercury", color: "#a8a8a8", size: 76, bands: ["#707078", "#c8c8c8", "#8a8178"], orbit: 70,
    layers: [
      { name: "Metallic Core", percentage: 85, desc: "Massive iron core generating a weak magnetic field." },
      { name: "Silicate Mantle", percentage: 10, desc: "Relatively thin rocky layer." },
      { name: "Crust", percentage: 5, desc: "Heavily cratered, ancient rocky outer shell." }
    ],
    deepDive: "Mercury has the highest orbital eccentricity of all planets. Lacking an atmosphere to trap heat, it experiences the most extreme temperature swings in the solar system.",
    missions: ["MESSENGER (First to orbit)", "Mariner 10 (First flybys)", "BepiColombo (En route)"]
  },
  { 
    id: "venus", name: "Venus", color: "#e0a84b", size: 104, bands: ["#f2cf76", "#c88935", "#fff1b3"], orbit: 100,
    layers: [
      { name: "Iron Core", percentage: 50, desc: "Likely liquid, but no geodynamo due to slow rotation." },
      { name: "Rocky Mantle", percentage: 40, desc: "Thick silicate layer driving extreme volcanism." },
      { name: "Crust", percentage: 10, desc: "Basaltic rock reshaped by massive resurfacing events." }
    ],
    deepDive: "Venus's thick atmosphere is 96% carbon dioxide, triggering a runaway greenhouse effect that makes its surface hotter than Mercury's. The atmospheric pressure is 92 times that of Earth.",
    missions: ["Venera Program (First surface landings)", "Magellan (Global radar mapping)", "Akatsuki (Atmospheric study)"]
  },
  { 
    id: "earth", name: "Earth", color: "#4fa3e0", size: 110, bands: ["#2d72bf", "#50b36f", "#edf8ff"], orbit: 132,
    layers: [
      { name: "Iron-Nickel Core", percentage: 55, desc: "Solid inner core, liquid outer core generating magnetosphere." },
      { name: "Mantle", percentage: 40, desc: "Highly viscous layer driving tectonic plate motion." },
      { name: "Crust", percentage: 5, desc: "Thin outer shell rich in oxygen and silicon." }
    ],
    deepDive: "Earth is the only known ocean world with active plate tectonics. Its unique surface chemistry and stable magnetosphere have fostered an expansive biosphere.",
    missions: ["James Webb Space Telescope (Launched from Earth)", "International Space Station", "Artemis Program"]
  },
  { 
    id: "mars", name: "Mars", color: "#c1440e", size: 92, bands: ["#e07135", "#7f2f1d", "#f0b078"], orbit: 162,
    layers: [
      { name: "Liquid Iron Core", percentage: 45, desc: "Dormant core, lacking planetary-scale magnetic generation." },
      { name: "Silicate Mantle", percentage: 45, desc: "Solid rocky layer that once fueled massive shield volcanoes." },
      { name: "Crust", percentage: 10, desc: "Rich in iron oxide (rust), covered in fine regolith dust." }
    ],
    deepDive: "Mars features the largest volcano (Olympus Mons) and the deepest canyon (Valles Marineris) in the solar system. Dry riverbeds indicate ancient liquid water flows.",
    missions: ["Perseverance & Curiosity Rovers", "Mars Reconnaissance Orbiter", "Viking 1 & 2"]
  },
  { 
    id: "jupiter", name: "Jupiter", color: "#c88b3a", size: 208, bands: ["#f1c782", "#9b5831", "#efe0c9"], orbit: 205,
    layers: [
      { name: "Dense Core", percentage: 15, desc: "Rock and exotic ices under immense pressure." },
      { name: "Metallic Hydrogen", percentage: 65, desc: "Supercritical fluid generating massive magnetosphere." },
      { name: "Molecular Hydrogen", percentage: 20, desc: "Outer gaseous wrapper transitioning to clouds." }
    ],
    deepDive: "Jupiter is a gas giant with a mass 2.5 times that of all other planets combined. Its Great Red Spot is an anticyclonic storm larger than Earth that has persisted for centuries.",
    missions: ["Juno (Polar orbit studies)", "Galileo (First atmospheric probe)", "Voyager 1 & 2"]
  },
  { 
    id: "saturn", name: "Saturn", color: "#d4c273", size: 184, bands: ["#f6e4a6", "#b99a56", "#fff0c9"], orbit: 246,
    layers: [
      { name: "Rocky Core", percentage: 20, desc: "Silicate rock and ice core." },
      { name: "Metallic Hydrogen", percentage: 50, desc: "Electrically conductive fluid layer." },
      { name: "Atmospheric Envelope", percentage: 30, desc: "Hydrogen and helium wrapper with high-speed jet streams." }
    ],
    deepDive: "Saturn's spectacular ring system consists of countless pieces of water ice ranging from micrometers to meters in size. Its density is lower than water—it would float in a sufficiently large ocean.",
    missions: ["Cassini-Huygens (Extensive ring & Titan exploration)", "Voyager 1 & 2", "Pioneer 11"]
  },
  { 
    id: "uranus", name: "Uranus", color: "#7de8e8", size: 138, bands: ["#a7fbf1", "#5cc9cf", "#d8ffff"], orbit: 286,
    layers: [
      { name: "Rocky Core", percentage: 20, desc: "Silicate/iron-nickel core at the center." },
      { name: "Icy Mantle", percentage: 60, desc: "Hot, dense fluid of water, ammonia, and methane." },
      { name: "Atmosphere", percentage: 20, desc: "Hydrogen, helium, and methane clouds giving a cyan hue." }
    ],
    deepDive: "Uranus rotates on its side with an axial tilt of 97.7 degrees, likely caused by an ancient planetary collision. Consequently, its poles experience 42 years of continuous sunlight followed by 42 years of darkness.",
    missions: ["Voyager 2 (Only spacecraft to visit, 1986)"]
  },
  { 
    id: "neptune", name: "Neptune", color: "#3f54ba", size: 136, bands: ["#4d73ff", "#1b2e8f", "#8fb7ff"], orbit: 324,
    layers: [
      { name: "Silicate Core", percentage: 20, desc: "Solid rocky center roughly the mass of Earth." },
      { name: "Water-Ammonia Mantle", percentage: 60, desc: "Supercritical highly conductive pressurized fluid." },
      { name: "Upper Atmosphere", percentage: 20, desc: "Dynamic methane-rich clouds driving supersonic winds." }
    ],
    deepDive: "Neptune's vivid azure blue color is due to atmospheric methane absorbing red light. Despite receiving minimal solar energy, it features the most intense weather and highest wind speeds observed.",
    missions: ["Voyager 2 (Only spacecraft to visit, 1989)"]
  }
];
const STAR_LAYER_CONFIG = [
  { count: 90, speed: 0.12, radius: 1.1, alpha: 0.5 },
  { count: 58, speed: 0.28, radius: 1.6, alpha: 0.72 },
  { count: 24, speed: 0.5, radius: 2.1, alpha: 0.9 }
];
const state = {
  pointer: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  stars: [],
  sections: []
};

/*
  Creates an SVG element with the supplied attributes.
  Accepts a tag name and a plain object of SVG attributes.
  Returns the created SVGElement so templates can append it safely without string-concatenated markup.
*/
function createSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
  return element;
}

/*
  Appends multiple children to a parent element.
  Accepts a parent DOM node and an array of child nodes.
  Returns the parent to keep SVG builder functions compact and chainable.
*/
function appendChildren(parent, children) {
  children.forEach((child) => parent.appendChild(child));
  return parent;
}

/*
  Builds a radial gradient definition for a planet.
  Accepts a unique id plus primary, shadow, and highlight colors.
  Returns an SVG radialGradient node used by the planet disc fill.
*/
function createPlanetGradient(id, primary, shadow, highlight) {
  const gradient = createSvgElement("radialGradient", { id, cx: "34%", cy: "28%", r: "68%" });
  return appendChildren(gradient, [
    createSvgElement("stop", { offset: "0%", "stop-color": highlight }),
    createSvgElement("stop", { offset: "48%", "stop-color": primary }),
    createSvgElement("stop", { offset: "100%", "stop-color": shadow })
  ]);
}

/*
  Builds a clipping path that confines generated texture bands to the planet disc.
  Accepts a unique clip id and radius.
  Returns an SVG clipPath node centered in the local planet viewport.
*/
function createDiscClip(clipId, radius) {
  const clipPath = createSvgElement("clipPath", { id: clipId });
  clipPath.appendChild(createSvgElement("circle", { cx: 0, cy: 0, r: radius }));
  return clipPath;
}

/*
  Builds shared SVG defs for one planet visual.
  Accepts planet metadata, gradient id, and clip id.
  Returns a defs node containing the planet gradient, glow filter, and clipping path.
*/
function createPlanetDefs(planet, gradientId, clipId) {
  const defs = createSvgElement("defs");
  const filter = createSvgElement("filter", { id: `${planet.id}-glow`, x: "-40%", y: "-40%", width: "180%", height: "180%" });
  const merge = createSvgElement("feMerge");
  appendChildren(merge, [
    createSvgElement("feMergeNode", { in: "blur" }),
    createSvgElement("feMergeNode", { in: "SourceGraphic" })
  ]);
  appendChildren(filter, [
    createSvgElement("feGaussianBlur", { stdDeviation: "9", result: "blur" }),
    merge
  ]);
  return appendChildren(defs, [
    createPlanetGradient(gradientId, planet.color, planet.bands[1], planet.bands[2]),
    createDiscClip(clipId, planet.size / 2),
    filter
  ]);
}

/*
  Builds the horizontal texture bands used across planet illustrations.
  Accepts planet metadata and a clipping id.
  Returns an SVG group whose children are clipped to the planet disc.
*/
function createPlanetBands(planet, clipId) {
  const group = createSvgElement("g", { "clip-path": `url(#${clipId})`, opacity: "0.72" });
  const radius = planet.size / 2;
  planet.bands.forEach((color, index) => {
    group.appendChild(createSvgElement("ellipse", {
      class: "planet-band",
      cx: 0,
      cy: -radius + index * (radius * 0.56) + 16,
      rx: radius * 1.16,
      ry: 10 + index * 5,
      fill: color,
      opacity: index === 2 ? "0.4" : "0.55"
    }));
  });
  return group;
}

/*
  Builds special recognizable features for specific planets.
  Accepts planet metadata and a clipping id.
  Returns an SVG group containing rings, storms, continents, caps, or atmospheric hints as appropriate.
*/
function createPlanetFeatures(planet, clipId) {
  const group = createSvgElement("g", { "clip-path": `url(#${clipId})` });
  const radius = planet.size / 2;
  if (planet.id === "earth") {
    appendChildren(group, [
      createSvgElement("path", { class: "planet-feature", d: "M-34,-18 C-18,-36 10,-32 18,-14 C8,-2 -16,4 -34,-18Z", fill: "#5bbf78", opacity: "0.9" }),
      createSvgElement("path", { class: "planet-feature", d: "M6,18 C28,4 43,18 34,34 C17,37 6,30 6,18Z", fill: "#5bbf78", opacity: "0.82" }),
      createSvgElement("ellipse", { class: "planet-feature", cx: -10, cy: -44, rx: 34, ry: 8, fill: "#ffffff", opacity: "0.56" })
    ]);
  }
  if (planet.id === "jupiter") {
    group.appendChild(createSvgElement("ellipse", { class: "planet-feature", cx: 48, cy: 28, rx: 28, ry: 18, fill: "#b84628", opacity: "0.92" }));
  }
  if (planet.id === "mars") {
    group.appendChild(createSvgElement("ellipse", { class: "planet-feature", cx: -18, cy: -radius + 16, rx: 32, ry: 10, fill: "#ffe0c2", opacity: "0.68" }));
  }
  return group;
}

/*
  Builds one full planet SVG illustration.
  Accepts a planet metadata object from PLANETS.
  Returns an SVGElement sized around that planet and ready to inject into the matching visual container.
*/
function createPlanetSvg(planet) {
  const radius = planet.size / 2;
  const box = planet.id === "saturn" ? 360 : Math.max(260, planet.size + 110);
  const gradientId = `${planet.id}-gradient`;
  const clipId = `${planet.id}-clip`;
  const svg = createSvgElement("svg", { class: "planet-svg", viewBox: `${-box / 2} ${-box / 2} ${box} ${box}`, role: "img", "aria-label": `${planet.name} stylized planet illustration` });
  
  const defs = createPlanetDefs(planet, gradientId, clipId);
  
  // Inner shading gradient to give a 3D spherical illusion (light from top-left)
  const shadeGradient = createSvgElement("radialGradient", { id: `${planet.id}-shading`, cx: "30%", cy: "30%", r: "70%" });
  appendChildren(shadeGradient, [
    createSvgElement("stop", { offset: "0%", "stop-color": "rgba(255,255,255,0.4)" }),
    createSvgElement("stop", { offset: "40%", "stop-color": "rgba(255,255,255,0.0)" }),
    createSvgElement("stop", { offset: "100%", "stop-color": "rgba(0,0,0,0.8)" })
  ]);
  defs.appendChild(shadeGradient);
  svg.appendChild(defs);

  if (planet.id === "saturn") {
    svg.appendChild(createSvgElement("ellipse", { class: "ring-shape", cx: 0, cy: 0, rx: 148, ry: 42, fill: "none", stroke: "#eadb9a", "stroke-width": "18", opacity: "0.52", transform: "rotate(-12)" }));
    svg.appendChild(createSvgElement("ellipse", { class: "ring-shape", cx: 0, cy: 0, rx: 178, ry: 52, fill: "none", stroke: "#fff0c9", "stroke-width": "6", opacity: "0.45", transform: "rotate(-12)" }));
  }

  // Outer atmospheric glow
  svg.appendChild(createSvgElement("circle", { class: "planet-glow", cx: 0, cy: 0, r: radius + 18, fill: planet.color, opacity: "0.22", filter: `url(#${planet.id}-glow)` }));

  // Group elements that should rotate together
  const rotationGroup = createSvgElement("g", { class: "planet-rotation" });
  rotationGroup.appendChild(createSvgElement("circle", { class: "planet-disc-base", cx: 0, cy: 0, r: radius, fill: `url(#${gradientId})` }));
  rotationGroup.appendChild(createPlanetBands(planet, clipId));
  rotationGroup.appendChild(createPlanetFeatures(planet, clipId));
  svg.appendChild(rotationGroup);

  // Overlay shading on top (does not rotate, keeping light source fixed)
  svg.appendChild(createSvgElement("circle", { cx: 0, cy: 0, r: radius, fill: `url(#${planet.id}-shading)`, "pointer-events": "none" }));
  
  return svg;
}

/*
  Builds the hero orrery SVG with scaled orbits and interactive planet markers.
  Accepts no arguments because it reads the PLANETS constants.
  Returns an SVGElement that fits the hero overview container.
*/
function createOrrerySvg() {
  const svg = createSvgElement("svg", { class: "orrery-svg", viewBox: "-370 -370 740 740", role: "img", "aria-label": "Solar system orbital diagram" });
  const defs = createSvgElement("defs");
  defs.appendChild(createPlanetGradient("orrery-sun-gradient", "#ffb347", "#ff6a2f", "#fff0a8"));
  svg.appendChild(defs);
  svg.appendChild(createSvgElement("circle", { cx: 0, cy: 0, r: 38, fill: "url(#orrery-sun-gradient)", filter: "drop-shadow(0 0 22px #ffb347)" }));
  PLANETS.filter((planet) => planet.orbit > 0).forEach((planet) => {
    const orbitGroup = createSvgElement("g", { class: "orbit-group", "data-planet": planet.id });
    orbitGroup.appendChild(createSvgElement("circle", { cx: 0, cy: 0, r: planet.orbit, fill: "none", stroke: "rgba(255,255,255,0.16)", "stroke-width": "1" }));
    orbitGroup.appendChild(createSvgElement("circle", { class: "orbit-planet", cx: planet.orbit, cy: 0, r: Math.max(4, planet.size / 26), fill: planet.color, "data-planet": planet.id }));
    svg.appendChild(orbitGroup);
  });
  return svg;
}

/*
  Injects generated SVG visuals into the existing HTML placeholders.
  Accepts no arguments and queries containers by their documented ids.
  Returns nothing after replacing loading placeholders with live SVG nodes.
*/
function mountVisuals() {
  const orrery = document.querySelector("#hero-orrery");
  if (orrery) {
    orrery.replaceChildren(createOrrerySvg());
  }
  PLANETS.forEach((planet) => {
    const target = document.querySelector(`#${planet.id}-visual`);
    if (target) {
      target.replaceChildren(createPlanetSvg(planet));
    }
  });
}

/*
  Starts anime.js timelines for SVG planets and the hero orrery.
  Accepts no arguments and checks reduced-motion preferences before animating.
  Returns nothing because anime.js manages the animation lifecycle.
*/
function startAnimations() {
  if (MOTION_QUERY.matches || !window.anime) {
    return;
  }
  anime({ targets: ".orbit-group", rotate: "1turn", duration: (_, index) => 26000 + index * 4200, easing: "linear", loop: true });
  anime({ targets: ".planet-rotation", rotate: "1turn", duration: 18000, easing: "linear", loop: true });
  anime({ targets: ".planet-svg", translateY: ["-10px", "10px"], direction: "alternate", duration: 3000, easing: "easeInOutSine", loop: true });
  anime({ targets: ".ring-shape", rotate: ["-12deg", "348deg"], duration: 36000, easing: "linear", loop: true });
}

/*
  Creates randomized star particles for each canvas layer.
  Accepts canvas width and height.
  Returns an array of star records used by drawStarfield.
*/
function createStars(width, height) {
  return STAR_LAYER_CONFIG.flatMap((layer, layerIndex) => Array.from({ length: layer.count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    layer: layerIndex,
    radius: layer.radius * (0.6 + Math.random() * 0.7),
    alpha: layer.alpha
  })));
}

/*
  Draws the current starfield frame with subtle pointer parallax.
  Accepts a 2D canvas context plus canvas width and height.
  Returns nothing after painting all configured star particles.
*/
function drawStarfield(context, width, height) {
  context.clearRect(0, 0, width, height);
  const offsetX = (state.pointer.x / window.innerWidth - 0.5) * 18;
  const offsetY = (state.pointer.y / window.innerHeight - 0.5) * 18;
  state.stars.forEach((star) => {
    const layer = STAR_LAYER_CONFIG[star.layer];
    context.beginPath();
    context.arc(star.x + offsetX * layer.speed, star.y + offsetY * layer.speed, star.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255,255,255,${star.alpha})`;
    context.fill();
  });
}

/*
  Initializes the canvas starfield and resize behavior.
  Accepts no arguments and uses the #starfield canvas from the page.
  Returns nothing after starting the requestAnimationFrame loop.
*/
function initStarfield() {
  const canvas = document.querySelector("#starfield");
  const context = canvas?.getContext("2d");
  if (!canvas || !context) {
    return;
  }
  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    state.stars = createStars(window.innerWidth, window.innerHeight);
  };
  const tick = () => {
    drawStarfield(context, window.innerWidth, window.innerHeight);
    window.requestAnimationFrame(tick);
  };
  resize();
  window.addEventListener("resize", resize);
  tick();
}

/*
  Initializes the custom cursor and planet hover labels.
  Accepts no arguments and attaches pointer listeners to the document.
  Returns nothing after enabling cursor state updates.
*/
function initCursor() {
  const cursor = document.querySelector("#cursor");
  const dot = cursor?.querySelector(".cursor-dot");
  const ring = cursor?.querySelector(".cursor-ring");
  const label = cursor?.querySelector(".cursor-planet-label");
  if (!cursor || !label || !dot || !ring || window.matchMedia("(pointer: coarse)").matches) {
    return;
  }
  
  const ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  
  const updateRing = () => {
    ringPos.x += (state.pointer.x - ringPos.x) * 0.15;
    ringPos.y += (state.pointer.y - ringPos.y) * 0.15;
    ring.style.transform = `translate(-50%, -50%) translate(${ringPos.x}px, ${ringPos.y}px)`;
    
    if(cursor.classList.contains("is-planet")) {
      label.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translateY(0)`;
    } else {
      label.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translateY(4px)`;
    }
    requestAnimationFrame(updateRing);
  };
  requestAnimationFrame(updateRing);

  document.addEventListener("pointermove", (event) => {
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
    dot.style.transform = `translate(-50%, -50%) translate(${event.clientX}px, ${event.clientY}px)`;
    cursor.classList.add("is-visible");
  });

  // Handle Hoverable Elements
  const hoverables = "a, button, .planet-svg, .orbit-group, .back-to-top";
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest(hoverables)) {
      cursor.classList.add("is-hovering");
      
      const planetEl = e.target.closest("[data-planet]");
      if (planetEl) {
        const planet = PLANETS.find((item) => item.id === planetEl.dataset.planet);
        if (planet) {
          cursor.classList.add("is-planet");
          cursor.style.setProperty("--accent", planet.color);
          label.textContent = planet.name;
        }
      }
    }
  });

  document.addEventListener("pointerout", (e) => {
    if (e.target.closest(hoverables)) {
      cursor.classList.remove("is-hovering");
      cursor.classList.remove("is-planet");
    }
  });

  // Magnetic Nav Links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("pointermove", (e) => {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      anime({
        targets: link,
        translateX: x * 0.3,
        translateY: y * 0.3,
        duration: 50,
        easing: "linear"
      });
    });
    link.addEventListener("pointerleave", () => {
      anime({
        targets: link,
        translateX: 0,
        translateY: 0,
        duration: 400,
        easing: "easeOutElastic(1, .5)"
      });
    });
  });
}

/*
  Updates progress bar width and active navigation based on scroll position.
  Accepts no arguments and reads document scroll metrics.
  Returns nothing after mutating visual state classes and CSS styles.
*/
function updateScrollState() {
  const progress = document.querySelector("#scrollProgressFill");
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  if (progress) {
    progress.style.width = `${Math.min(1, ratio) * 100}%`;
  }
  const active = state.sections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.45;
  });
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("is-active", Boolean(active && link.getAttribute("href") === `#${active.id}`));
  });
}

/*
  Initializes scroll reveal observers and navigation section tracking.
  Accepts no arguments and queries reveal items plus planet sections.
  Returns nothing after observers and scroll handlers are registered.
*/
function initScrollEffects() {
  state.sections = Array.from(document.querySelectorAll(".section"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("is-animated")) {
        entry.target.classList.add("is-animated");
        const items = entry.target.querySelectorAll(".reveal-item");
        if (items.length > 0) {
          anime({
            targets: items,
            translateY: [26, 0],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(120),
            easing: "easeOutCubic"
          });
        }
      }
    });
  }, { threshold: 0.18 });
  state.sections.forEach(sec => observer.observe(sec));
  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
}

/*
  Animates hero stat counters when anime.js is available.
  Accepts no arguments and reads each element's data-target value.
  Returns nothing after scheduling numeric text updates.
*/
function initCounters() {
  if (MOTION_QUERY.matches || !window.anime) {
    document.querySelectorAll("[data-target]").forEach((element) => {
      element.textContent = element.dataset.target;
    });
    return;
  }
  document.querySelectorAll("[data-target]").forEach((element) => {
    const counter = { value: 0 };
    anime({
      targets: counter,
      value: Number(element.dataset.target),
      duration: 1400,
      easing: "easeOutExpo",
      round: 1,
      update: () => {
        element.textContent = String(counter.value);
      }
    });
  });
}

/*
  Initializes the full page experience after the DOM is ready.
  Accepts no arguments and coordinates visual mounting, animation, cursor, starfield, and scroll behavior.
  Returns nothing after setup is complete.
*/
function initSolarSystemShowcase() {
  document.querySelectorAll(".planet-section").forEach(sec => {
    if (sec.dataset.accent) {
      sec.style.setProperty('--section-accent', sec.dataset.accent);
    }
  });
  mountVisuals();
  initStarfield();
  initCursor();
  initScrollEffects();
  initCounters();
  startAnimations();
  initDeepDiveDrawer();
  initContextualTooltips();

  // Interactive Hover for Planet SVGs
  document.querySelectorAll(".planet-svg").forEach((svg) => {
    svg.addEventListener("pointerenter", () => {
      anime({
        targets: svg,
        scale: 1.05,
        duration: 800,
        easing: "easeOutElastic(1, .6)"
      });
      const glow = svg.querySelector(".planet-glow");
      if (glow) {
        anime({ targets: glow, scale: 1.15, opacity: 0.4, duration: 800, easing: "easeOutExpo" });
      }
    });
    svg.addEventListener("pointerleave", () => {
      anime({
        targets: svg,
        scale: 1,
        duration: 600,
        easing: "easeOutElastic(1, .6)"
      });
      const glow = svg.querySelector(".planet-glow");
      if (glow) {
        anime({ targets: glow, scale: 1, opacity: 0.22, duration: 600, easing: "easeOutExpo" });
      }
    });
  });

  // Interactive Hover for Hero Orrery Orbits
  document.querySelectorAll(".orbit-group").forEach((group) => {
    group.addEventListener("pointerenter", () => {
      document.querySelectorAll(".orbit-group").forEach(other => {
        if (other !== group) {
          anime({ targets: other, opacity: 0.2, duration: 300, easing: "easeOutSine" });
        }
      });
    });
    group.addEventListener("pointerleave", () => {
      document.querySelectorAll(".orbit-group").forEach(other => {
        anime({ targets: other, opacity: 1, duration: 300, easing: "easeOutSine" });
      });
    });
  });
}

function initDeepDiveDrawer() {
  const drawer = document.querySelector("#sideDrawer");
  const backdrop = document.querySelector("#drawerBackdrop");
  const closeBtn = document.querySelector("#drawerClose");
  const atmosphereToggle = document.querySelector("#toggleAtmosphere");

  const openDrawer = (planetId) => {
    const planet = PLANETS.find(p => p.id === planetId);
    if (!planet) return;

    // Populate Data
    document.querySelector("#drawerTitle").textContent = planet.name;
    document.querySelector("#drawerDeepDive").textContent = planet.deepDive;
    drawer.style.setProperty('--accent', planet.color);

    const layersContainer = document.querySelector("#drawerLayers");
    layersContainer.innerHTML = planet.layers.map(layer => `
      <div class="layer-bar-container">
        <div class="layer-meta">
          <span class="layer-name">${layer.name}</span>
          <span class="layer-pct">${layer.percentage}%</span>
        </div>
        <div class="layer-track"><div class="layer-fill" data-pct="${layer.percentage}"></div></div>
        <p class="layer-desc">${layer.desc}</p>
      </div>
    `).join('');

    const missionsContainer = document.querySelector("#drawerMissions");
    missionsContainer.innerHTML = planet.missions.map(m => `<li>${m}</li>`).join('');

    // Animate In
    backdrop.classList.add("is-active");
    anime({
      targets: drawer,
      translateX: ['100%', '0%'],
      duration: 600,
      easing: 'easeOutQuart'
    });

    // Animate Layer Bars
    anime({
      targets: '.layer-fill',
      width: (el) => el.dataset.pct + '%',
      duration: 1000,
      delay: anime.stagger(100, {start: 400}),
      easing: 'easeOutExpo'
    });
  };

  const closeDrawer = () => {
    backdrop.classList.remove("is-active");
    anime({
      targets: drawer,
      translateX: '100%',
      duration: 500,
      easing: 'easeInQuart'
    });
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.inspect-btn');
    if (btn) openDrawer(btn.dataset.planetId);
    
    const planetSvg = e.target.closest('.planet-svg');
    if (planetSvg) {
      const section = planetSvg.closest('.planet-section');
      if (section) openDrawer(section.dataset.planet);
    }
  });

  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  atmosphereToggle.addEventListener('change', (e) => {
    const opacity = e.target.checked ? 1 : 0;
    anime({
      targets: ['.planet-glow', '.planet-band', '.ring-shape', '.planet-feature'],
      opacity: (el) => {
        if (el.classList.contains('planet-glow')) return opacity * 0.22;
        if (el.classList.contains('planet-band')) return opacity * 0.72;
        if (el.classList.contains('ring-shape')) return opacity * 0.52;
        return opacity * 0.9;
      },
      duration: 600,
      easing: 'easeInOutSine'
    });
  });
}

function initContextualTooltips() {
  const tooltip = document.querySelector("#statTooltip");
  const content = document.querySelector("#tooltipContent");

  const contextMap = {
    "Diameter": "Size comparison across the planetary scale.",
    "Surface Temperature": "Extreme thermal environments driven by distance and atmosphere.",
    "Core Temperature": "The thermonuclear engine driving the solar system.",
    "Orbital Period": "Time to complete one full revolution around the Sun.",
    "Day Length": "Duration of a single sidereal rotation on its axis.",
    "Wind Speed": "Atmospheric jet streams driven by internal heat.",
    "Light Travel from Sun": "The time it takes for photons to reach this distance.",
    "Distance from Sun": "Interplanetary distance measured in AU or km."
  };

  document.querySelectorAll(".ps-row").forEach(row => {
    row.addEventListener("pointerenter", (e) => {
      const label = row.querySelector(".ps-label").textContent;
      if (contextMap[label]) {
        content.textContent = contextMap[label];
        
        anime.remove(tooltip);
        anime({
          targets: tooltip,
          opacity: 1,
          translateY: [10, 0],
          duration: 300,
          easing: 'easeOutCubic'
        });
      }
    });

    row.addEventListener("pointermove", (e) => {
      tooltip.style.left = e.clientX + 'px';
      tooltip.style.top = (e.clientY - 20) + 'px';
    });

    row.addEventListener("pointerleave", () => {
      anime({
        targets: tooltip,
        opacity: 0,
        translateY: 10,
        duration: 200,
        easing: 'easeInCubic'
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", initSolarSystemShowcase);
