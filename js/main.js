// Initialize Lenis Smooth Scroll
if (typeof Lenis !== "undefined") {
  const lenis = new Lenis({
    lerp: 0.08, // This eliminates the "huge delay" by using snappy physics instead of a 1.2s fixed duration
    smoothWheel: true,
    smoothTouch: false,
  });

  // Dynamic 3D Card Scroll Engine
  // Cache positions to completely eliminate layout thrashing (getBoundingClientRect inside a scroll event is bad)
  const cards3D = Array.from(document.querySelectorAll('.stat-card, .info-card, .task-card, .faq-item, .form-card, .level-card')).map(el => {
    return { el, top: 0, height: 0, width: 0, left: 0 };
  });

  const cacheCardPositions = () => {
    // 1. Temporarily clear transforms to get true document layout positions
    cards3D.forEach(card => {
      card.oldTransform = card.el.style.transform;
      card.el.style.transform = 'none';
    });
    
    // 2. Read layout metrics
    cards3D.forEach(card => {
      const rect = card.el.getBoundingClientRect();
      card.top = rect.top + window.scrollY;
      card.height = rect.height;
      card.width = rect.width;
      card.left = rect.left;
    });

    // 3. Restore transforms
    cards3D.forEach(card => {
      card.el.style.transform = card.oldTransform;
    });
  };

  // Cache on load and resize
  window.addEventListener('resize', cacheCardPositions, { passive: true });
  
  const update3DCards = () => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const scrollY = lenis.animatedScroll || window.scrollY;
    
    cards3D.forEach(card => {
      // Calculate current rect.top relative to viewport without querying DOM layout
      const currentTop = card.top - scrollY;
      const cardCenterY = currentTop + card.height / 2;
      
      const distanceFromCenter = (cardCenterY - windowHeight / 2) / (windowHeight / 2);
      
      if (distanceFromCenter > -1.5 && distanceFromCenter < 1.5) {
        const clampedDist = Math.max(-1.2, Math.min(1.2, distanceFromCenter));
        const rotateX = clampedDist * 35; 
        const translateZ = Math.abs(clampedDist) * -120;
        const opacity = 1 - Math.pow(Math.abs(clampedDist), 3);
        
        const cardCenterX = card.left + card.width / 2;
        const distFromCenterX = (cardCenterX - windowWidth / 2) / (windowWidth / 2);
        const rotateY = distFromCenterX * 15;
        
        card.el.style.setProperty('--scroll-rot-x', `${rotateX}deg`);
        card.el.style.setProperty('--scroll-rot-y', `${rotateY}deg`);
        card.el.style.setProperty('--scroll-trans-z', `${translateZ}px`);
        card.el.style.setProperty('--scroll-op', Math.max(0.05, opacity));
      }
    });
  };

  lenis.on('scroll', update3DCards);
  
  // Initial pass to set correct positions
  setTimeout(() => {
    cacheCardPositions();
    update3DCards();
  }, 50);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Shared navbar behavior
const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menuBtn");

if (navbar) {
  let navTicking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (navTicking) return;

      navTicking = true;
      requestAnimationFrame(() => {
        navbar.classList.toggle("scrolled", window.scrollY > 30);
        navTicking = false;
      });
    },
    { passive: true },
  );
}

if (menuBtn && navbar) {
  menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("open");
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => navbar.classList.remove("open"));
  });
}

// Active page link
const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a, .footer-links a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage) {
    link.classList.add("active");
  }
});

// FAQ accordion
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    item.classList.toggle("open");
  });
});

// Hero object mouse parallax
const nexusObject = document.getElementById("nexusObject");

if (nexusObject) {
  window.addEventListener("mousemove", (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const x = (event.clientX / window.innerWidth - 0.5) * 16;
    const y = (event.clientY / window.innerHeight - 0.5) * 16;

    nexusObject.style.transform =
      "rotateY(" + x + "deg) rotateX(" + -y + "deg)";
  });
}

// =====================================================
// SIMULATED PARADIGM: CYBER CURSOR & DECODER
// =====================================================

// 1. Cyber Cursor
const cyberCursor = document.createElement('div');
cyberCursor.className = 'cyber-cursor';
const cyberCursorTrail = document.createElement('div');
cyberCursorTrail.className = 'cyber-cursor-trail';
document.body.appendChild(cyberCursor);
document.body.appendChild(cyberCursorTrail);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let trailX = mouseX;
let trailY = mouseY;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cyberCursor.style.left = `${mouseX}px`;
  cyberCursor.style.top = `${mouseY}px`;
});

function animateCursor() {
  trailX += (mouseX - trailX) * 0.2;
  trailY += (mouseY - trailY) * 0.2;
  cyberCursorTrail.style.left = `${trailX}px`;
  cyberCursorTrail.style.top = `${trailY}px`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// 2. Hacker Text Decoder
class HackerTextDecoder {
  constructor(element) {
    this.element = element;
    this.originalText = element.innerText;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+<>_';
    this.frame = 0;
    this.decodeDelay = 2; // frames per letter
    this.decoded = false;
  }
  
  decode() {
    if (this.decoded) return;
    this.decoded = true;
    let iteration = 0;
    
    const interval = setInterval(() => {
      this.element.innerText = this.originalText
        .split('')
        .map((char, index) => {
          if (index < iteration || char === ' ') {
            return this.originalText[index];
          }
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        })
        .join('');
      
      if (iteration >= this.originalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / this.decodeDelay;
    }, 30);
  }
}

const decodeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target._decoder) {
        entry.target._decoder.decode();
      }
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('h2, h3, .eyebrow').forEach(el => {
  el._decoder = new HackerTextDecoder(el);
  decodeObserver.observe(el);
});

// 3. Global Canvas State
window.techfestState = {
  speedMultiplier: 1.0,
  colorShift: 0.0,
  mouseX: window.innerWidth / 2,
  mouseY: window.innerHeight / 2
};

window.addEventListener('mousemove', (e) => {
  window.techfestState.mouseX = e.clientX;
  window.techfestState.mouseY = e.clientY;
});

document.querySelectorAll('.card-3d').forEach(card => {
  card.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-hover');
    card.classList.add('card-hover-active');
    window.techfestState.speedMultiplier = 4.0;
    window.techfestState.colorShift = 1.0;
  });
  card.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-hover');
    card.classList.remove('card-hover-active');
    window.techfestState.speedMultiplier = 1.0;
    window.techfestState.colorShift = 0.0;
  });
});

// =====================================================
// OPTIMIZED MASTER BACKGROUND:
// Smooth full-screen particle network
// Scatter → 3D Triangle → Scatter → 3D Square → Scatter → 3D Hexagon
// =====================================================

(() => {
  const canvas = document.getElementById("nexusCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  let width = 0;
  let height = 0;
  let dpr = 1;

  // Reduced for smooth performance
  const SHAPE_COUNT = 50;
  const AMBIENT_COUNT = 30;

  const shapeParticles = [];
  const ambientParticles = [];

  const shapes = ["triangle", "square", "hexagon"];

  // Slower, smoother timing
  const timing = {
    scatterHold: 1800,
    form: 6200,
    hold: 2600,
    disperse: 5800,
  };

  const totalDuration =
    timing.scatterHold + timing.form + timing.hold + timing.disperse;

  let lastCycle = -1;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  function mix(a, b, t) {
    return a + (b - a) * t;
  }

  let smoothedScrollY = 0;
  let scrollProgress = 0;

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener("mousemove", (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2.0;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2.0;
  }, { passive: true });

  function getScrollParameters() {
    const t = scrollProgress;
    let centerX = 0;
    let centerY = 0;
    let scaleMultiplier = 1.0;
    let dispersion = 0.0;
    let rotationSpeed = 1.0;

    const isMobile = width < 760;
    const heroCenterX = isMobile ? width * 0.5 : width * 0.68;
    const heroCenterY = isMobile ? height * 0.55 : height * 0.48;

    if (t < 0.25) {
      // Hero (Right-aligned) -> Stats (Centered and scaled up 1.4x)
      const p = t / 0.25;
      centerX = mix(heroCenterX, width * 0.5, p);
      centerY = mix(heroCenterY, height * 0.5, p);
      scaleMultiplier = mix(1.0, 1.4, p);
      dispersion = 0.0;
      rotationSpeed = mix(1.0, 1.8, p);
    } else if (t < 0.5) {
      // Stats (Centered 1.4x) -> Role (Left-aligned, 0.95x, tilt)
      const p = (t - 0.25) / 0.25;
      centerX = mix(width * 0.5, isMobile ? width * 0.5 : width * 0.28, p);
      centerY = mix(height * 0.5, height * 0.48, p);
      scaleMultiplier = mix(1.4, 0.95, p);
      dispersion = 0.0;
      rotationSpeed = mix(1.8, 1.2, p);
    } else if (t < 0.75) {
      // Role (Left-aligned) -> Journey (Slowly disperses into flying tunnel effect)
      const p = (t - 0.5) / 0.25;
      centerX = mix(isMobile ? width * 0.5 : width * 0.28, width * 0.5, p);
      centerY = mix(height * 0.48, height * 0.5, p);
      scaleMultiplier = mix(0.95, 2.2, p);
      dispersion = p * 1.6;
      rotationSpeed = mix(1.2, 3.0, p);
    } else {
      // Journey -> CTA (Re-forms beautifully into a background halo)
      const p = (t - 0.75) / 0.25;
      centerX = width * 0.5;
      centerY = mix(height * 0.5, height * 0.55, p);
      scaleMultiplier = mix(2.2, 1.5, p);
      dispersion = mix(1.6, 0.15, p);
      rotationSpeed = mix(3.0, 0.8, p);
    }

    return {
      centerX,
      centerY,
      scaleMultiplier,
      dispersion,
      rotationSpeed,
    };
  }

  // Full-screen scatter, not right-side clustered
  function makeScatterTarget() {
    return {
      x: random(-1.2, 1.2),
      y: random(-1.2, 1.2),
      z: random(-1.0, 1.0),
    };
  }

  function getShapeSides(type) {
    if (type === "triangle") return 3;
    if (type === "square") return 4;
    return 6;
  }

  function getShapeVertices(type) {
    const sides = getShapeSides(type);
    const vertices = [];

    let startAngle = -Math.PI / 2;

    if (type === "square") {
      startAngle = -Math.PI / 4;
    }

    for (let i = 0; i < sides; i++) {
      const angle = startAngle + (i / sides) * Math.PI * 2;

      vertices.push({
        x: Math.cos(angle),
        y: Math.sin(angle),
        z: Math.sin(angle * 2.0) * 0.18,
      });
    }

    return vertices;
  }

  function rotate3D(point, time, type) {
    let x = point.x;
    let y = point.y;
    let z = point.z;

    const params = getScrollParameters();

    // Scroll-based rotation angles
    const scrollAngleY = scrollProgress * Math.PI * 1.5;
    const scrollAngleX = scrollProgress * Math.PI * 0.5;

    // Apply mouse parallax tilt
    const rotX = -0.58 + Math.sin(time * 0.00012) * 0.1 + scrollAngleX - mouseY * 0.15;
    const rotY = time * 0.00008 * params.rotationSpeed + (type === "hexagon" ? 0.25 : 0) + scrollAngleY + mouseX * 0.15;
    const rotZ = time * 0.00004 + scrollProgress * 0.8;

    // Rotate X
    let c = Math.cos(rotX);
    let s = Math.sin(rotX);
    let y1 = y * c - z * s;
    let z1 = y * s + z * c;
    y = y1;
    z = z1;

    // Rotate Y
    c = Math.cos(rotY);
    s = Math.sin(rotY);
    let x1 = x * c + z * s;
    z1 = -x * s + z * c;
    x = x1;
    z = z1;

    // Rotate Z
    c = Math.cos(rotZ);
    s = Math.sin(rotZ);
    x1 = x * c - y * s;
    y1 = x * s + y * c;

    return { x: x1, y: y1, z };
  }

  function project3D(point, type, index = 0) {
    const isMobile = width < 760;

    const params = getScrollParameters();

    let px = point.x;
    let py = point.y;
    let pz = point.z;

    // Apply dispersion pushing particles radially out
    if (params.dispersion > 0.0) {
      const angle = index * 2.39996; // golden angle for uniform distribution
      const push = (index / SHAPE_COUNT) * params.dispersion * 1.5;
      px += Math.cos(angle) * push;
      py += Math.sin(angle) * push;
      pz += Math.sin(index * 0.9) * params.dispersion * 0.5;
    }

    const baseSize = Math.min(width, height) * (isMobile ? 0.23 : 0.27) * params.scaleMultiplier;
    const perspective = 2.9 / (2.9 - pz);

    return {
      x: params.centerX + px * baseSize * perspective,
      y: params.centerY + py * baseSize * perspective,
      z: pz,
      perspective,
    };
  }

  function getPolygonVertices(type, z = 0, radius = 1) {
    const sides = getShapeSides(type);
    const vertices = [];

    let startAngle = -Math.PI / 2;

    if (type === "square") {
      startAngle = -Math.PI / 4;
    }

    for (let i = 0; i < sides; i++) {
      const angle = startAngle + (i / sides) * Math.PI * 2;

      vertices.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z,
      });
    }

    return vertices;
  }

  function lerpPoint(a, b, t) {
    return {
      x: mix(a.x, b.x, t),
      y: mix(a.y, b.y, t),
      z: mix(a.z, b.z, t),
    };
  }

  function hash01(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function getEdgePoint(vertices, indexFloat) {
    const sides = vertices.length;
    const edgeIndex = Math.floor(indexFloat) % sides;
    const nextIndex = (edgeIndex + 1) % sides;
    const edgeProgress = indexFloat - Math.floor(indexFloat);

    return lerpPoint(vertices[edgeIndex], vertices[nextIndex], edgeProgress);
  }

  function getFaceFillPoint(vertices, seed, zLayer) {
    const sides = vertices.length;

    const sector = Math.floor(hash01(seed * 1.91) * sides) % sides;
    const next = (sector + 1) % sides;

    const a = vertices[sector];
    const b = vertices[next];

    const edgeT = hash01(seed * 2.37);
    const radiusT = Math.sqrt(hash01(seed * 3.71)) * 0.88;

    const edgePoint = lerpPoint(a, b, edgeT);

    return {
      x: edgePoint.x * radiusT,
      y: edgePoint.y * radiusT,
      z: zLayer,
    };
  }

  function buildShapeBlueprint(type) {
    const sides = getShapeSides(type);

    const targets = [];

    const front = getPolygonVertices(type, 0.68, 1.0);
    const middle = getPolygonVertices(type, 0, 0.92);
    const back = getPolygonVertices(type, -0.68, 1.0);

    const edgeShellCount = Math.floor(SHAPE_COUNT * 0.28);
    const faceFillCount = Math.floor(SHAPE_COUNT * 0.5);
    const depthCount = SHAPE_COUNT - edgeShellCount - faceFillCount;

    // 1) Outer shell: front, middle, back edges
    for (let i = 0; i < edgeShellCount; i++) {
      const edgePosition = (i / edgeShellCount) * sides * 3;

      let layerVertices;

      if (i % 3 === 0) {
        layerVertices = front;
      } else if (i % 3 === 1) {
        layerVertices = middle;
      } else {
        layerVertices = back;
      }

      targets.push(getEdgePoint(layerVertices, edgePosition));
    }

    // 2) Body fill: multiple depth layers
    const layers = [-0.58, -0.32, -0.12, 0.12, 0.32, 0.58];

    for (let i = 0; i < faceFillCount; i++) {
      const layer = layers[i % layers.length];
      const layerVertices = getPolygonVertices(type, layer, 0.92);

      targets.push(getFaceFillPoint(layerVertices, i + sides * 37.7, layer));
    }

    // 3) Depth structure: particles between front and back edges
    for (let i = 0; i < depthCount; i++) {
      const edgePosition = (i / depthCount) * sides;

      const frontPoint = getEdgePoint(front, edgePosition);
      const backPoint = getEdgePoint(back, edgePosition);

      const depthProgress = (i % 9) / 8;

      targets.push(lerpPoint(frontPoint, backPoint, depthProgress));
    }

    return targets;
  }

  const shapeBlueprints = {};

  function getShapePoint(type, index, time) {
    if (
      !shapeBlueprints[type] ||
      shapeBlueprints[type].length !== SHAPE_COUNT
    ) {
      shapeBlueprints[type] = buildShapeBlueprint(type);
    }

    let point = shapeBlueprints[type][index % shapeBlueprints[type].length];

    const breathe = 1 + Math.sin(time * 0.00055 + index * 0.72) * 0.008;

    return {
      x: point.x * breathe,
      y: point.y * breathe,
      z: point.z + Math.sin(index * 1.2 + time * 0.00026) * 0.018,
    };
  }

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.12);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (shapeParticles.length === 0) {
      for (let i = 0; i < SHAPE_COUNT; i++) {
        const scatterA = makeScatterTarget();
        const scatterB = makeScatterTarget();

        shapeParticles.push({
          x: 0,
          y: 0,
          z: 0,
          localX: scatterA.x,
          localY: scatterA.y,
          localZ: scatterA.z,
          scatterA,
          scatterB,
          size: random(0.65, 1.15),
          speed: random(0.018, 0.032),
        });
      }
    } else {
      shapeParticles.forEach((p) => {
        p.scatterA = makeScatterTarget();
        p.scatterB = makeScatterTarget();
      });
    }

    if (ambientParticles.length === 0) {
      for (let i = 0; i < AMBIENT_COUNT; i++) {
        ambientParticles.push({
          x: random(0, width),
          y: random(0, height),
          vx: random(-0.055, 0.055),
          vy: random(-0.055, 0.055),
          size: random(0.45, 0.95),
        });
      }
    }
  }

  function drawAmbientParticles() {
    for (const p of ambientParticles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(115, 215, 255, 0.38)";
      ctx.fill();
    }

    // Lightweight ambient connections only for nearby indexed particles
    for (let i = 0; i < ambientParticles.length - 1; i++) {
      const a = ambientParticles[i];

      for (let k = 1; k <= 3; k++) {
        const j = i + k;
        if (!ambientParticles[j]) continue;

        const b = ambientParticles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 155) {
          const alpha = (1 - distance / 155) * 0.07;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(105, 205, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function drawShapeConnections(visibility) {
    if (visibility <= 0.04) return;

    const maxDistance = Math.max(
      68,
      Math.min(86, Math.min(width, height) * 0.085),
    );

    let shift = 0;
    if (window.techfestState) shift = window.techfestState.colorShift;

    // Lerp colors based on trigger states
    const r = Math.floor(95 + (106 - 95) * shift);
    const g = Math.floor(220 + (255 - 220) * shift);
    const b = Math.floor(255 + (193 - 255) * shift);

    for (let i = 0; i < shapeParticles.length; i++) {
      const a = shapeParticles[i];

      for (let j = i + 1; j < shapeParticles.length; j++) {
        const bP = shapeParticles[j];

        const dx = a.x - bP.x;
        const dy = a.y - bP.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const zDifference = Math.abs(a.z - bP.z);

          if (zDifference > 0.95) continue;

          const alpha =
            (1 - distance / maxDistance) *
            (0.035 + visibility * 0.105) *
            (1 - zDifference * 0.32);

          if (alpha <= 0.008) continue;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(bP.x, bP.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function drawShapeParticles(visibility) {
    ctx.save();

    let shift = 0;
    if (window.techfestState) shift = window.techfestState.colorShift;

    // Outer glow
    const rOuter = Math.floor(85 + (106 - 85) * shift);
    const gOuter = Math.floor(230 + (255 - 230) * shift);
    const bOuter = Math.floor(255 + (193 - 255) * shift);
    
    // Inner core
    const rInner = Math.floor(225 + (200 - 225) * shift);
    const gInner = Math.floor(250 + (255 - 250) * shift);
    const bInner = Math.floor(255 + (220 - 255) * shift);

    for (const p of shapeParticles) {
      const depthBoost = 1 + p.z * 0.1;
      const radius = p.size * depthBoost * (1 + visibility * 0.16);

      // Small glow, not huge laggy glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * 2.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rOuter}, ${gOuter}, ${bOuter}, ${0.12 + visibility * 0.18})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rInner}, ${gInner}, ${bInner}, ${0.76 + visibility * 0.22})`;
      ctx.fill();
    }

    ctx.restore();
  }

  function updateTargets(time) {
    const cycle = Math.floor(time / totalDuration);
    const localTime = time % totalDuration;

    if (cycle !== lastCycle) {
      lastCycle = cycle;

      shapeParticles.forEach((p) => {
        p.scatterA = p.scatterB;
        p.scatterB = makeScatterTarget();
      });
    }

    const shapeType = shapes[cycle % shapes.length];

    let visibility = 0;

    shapeParticles.forEach((p, index) => {
      const shapeTarget = getShapePoint(shapeType, index, time);

      let targetX = p.scatterA.x;
      let targetY = p.scatterA.y;
      let targetZ = p.scatterA.z;

      if (localTime < timing.scatterHold) {
        visibility = 0;
      } else if (localTime < timing.scatterHold + timing.form) {
        const raw = (localTime - timing.scatterHold) / timing.form;
        const progress = easeInOutSine(clamp(raw, 0, 1));

        visibility = progress;

        targetX = mix(p.scatterA.x, shapeTarget.x, progress);
        targetY = mix(p.scatterA.y, shapeTarget.y, progress);
        targetZ = mix(p.scatterA.z, shapeTarget.z, progress);
      } else if (localTime < timing.scatterHold + timing.form + timing.hold) {
        visibility = 1;

        targetX = shapeTarget.x;
        targetY = shapeTarget.y;
        targetZ = shapeTarget.z;
      } else {
        const raw =
          (localTime - timing.scatterHold - timing.form - timing.hold) /
          timing.disperse;

        const progress = easeInOutSine(clamp(raw, 0, 1));

        visibility = 1 - progress;

        targetX = mix(shapeTarget.x, p.scatterB.x, progress);
        targetY = mix(shapeTarget.y, p.scatterB.y, progress);
        targetZ = mix(shapeTarget.z, p.scatterB.z, progress);
      }

      p.localX += (targetX - p.localX) * p.speed;
      p.localY += (targetY - p.localY) * p.speed;
      p.localZ += (targetZ - p.localZ) * p.speed;
    });

    return {
      shapeType,
      visibility,
    };
  }

  let lastFrame = 0;
  const targetFPS = 34;
  const frameInterval = 1000 / targetFPS;

  let canvasTime = 0;
  let lastRealTime = 0;
  let currentSpeed = 1.0;
  let currentColorShift = 0.0;

  function animate(time) {
    requestAnimationFrame(animate);

    if (document.hidden) return;

    // Time scaling for speed triggers
    const dt = time - lastRealTime;
    lastRealTime = time;
    
    // Safety clamp dt to avoid huge jumps if tab was inactive
    if (dt > 100 || dt < 0) {
       canvasTime += 16;
    } else {
       if (window.techfestState) {
         currentSpeed += (window.techfestState.speedMultiplier - currentSpeed) * 0.08;
         currentColorShift += (window.techfestState.colorShift - currentColorShift) * 0.08;
       }
       canvasTime += dt * currentSpeed;
    }

    // Smoothly interpolate scroll state
    const targetScroll = window.scrollY;
    smoothedScrollY += (targetScroll - smoothedScrollY) * 0.15;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = docHeight > 0 ? smoothedScrollY / docHeight : 0;

    // Smoothly interpolate mouse parallax coordinates
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    ctx.clearRect(0, 0, width, height);

    const state = updateTargets(canvasTime);

    // Update screen-space coordinates on every single frame based on the latest scroll/mouse parameters
    shapeParticles.forEach((p, index) => {
      const localPoint = { x: p.localX, y: p.localY, z: p.localZ };
      const rotated = rotate3D(localPoint, canvasTime, state.shapeType);
      const projected = project3D(rotated, state.shapeType, index);

      // Dynamic Magnetism
      if (window.techfestState) {
        const dx = projected.x - window.techfestState.mouseX;
        const dy = projected.y - window.techfestState.mouseY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 280) {
          const force = (280 - dist) / 280;
          const swirlFactor = 1.0 + (currentSpeed - 1.0) * 0.5; // Swirl more when speed is high
          projected.x += (dx * 0.15 + dy * 0.3) * force * swirlFactor;
          projected.y += (dy * 0.15 - dx * 0.3) * force * swirlFactor;
        }
      }

      p.x = projected.x;
      p.y = projected.y;
      p.z = projected.z;
      p.perspective = projected.perspective;
    });

    ctx.globalCompositeOperation = "source-over";
    drawAmbientParticles();

    ctx.globalCompositeOperation = "lighter";
    drawShapeConnections(state.visibility);
    drawShapeParticles(state.visibility);

    ctx.globalCompositeOperation = "source-over";
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });
  requestAnimationFrame(animate);
})();
// Hero scroll-based phase transition
const heroStage = document.querySelector("[data-hero-stage]");
const phaseTitle = document.querySelector(".phase-title");
const phaseCopy = document.querySelector(".phase-copy");
const consoleState = document.querySelector(".console-state");
const launchMeter = document.querySelector(".launch-meter span");

const heroPhases = [
  {
    state: "PHASE 01 // SIGNAL BOOT",
    title: "Campus link online",
    copy: "Your mission starts with one signal. Connect your campus, activate tasks, and begin your ambassador journey.",
  },
  {
    state: "PHASE 02 // NODE SYNC",
    title: "Campus nodes detected",
    copy: "The network expands as your outreach grows. Every task strengthens your signal across student communities.",
  },
  {
    state: "PHASE 03 // MISSION ROUTE",
    title: "Mission path unlocked",
    copy: "Complete campaigns, submit proof, earn points, and move through Bronze, Silver, Gold, and Diamond leagues.",
  },
  {
    state: "PHASE 04 // DASHBOARD READY",
    title: "Ambassador console ready",
    copy: "Track points, credits, rank, rewards, and projects from your personal mission-control dashboard.",
  },
];

function updateHeroPhase() {
  if (!heroStage || !phaseTitle || !phaseCopy || !consoleState || !launchMeter)
    return;

  const progress = Math.min(Math.max(window.scrollY / 760, 0), 1);
  const phaseIndex = Math.min(
    heroPhases.length - 1,
    Math.floor(progress * heroPhases.length),
  );
  const phase = heroPhases[phaseIndex];

  heroStage.classList.remove(
    "hero-phase-0",
    "hero-phase-1",
    "hero-phase-2",
    "hero-phase-3",
  );
  heroStage.classList.add(`hero-phase-${phaseIndex}`);

  consoleState.textContent = phase.state;
  phaseTitle.textContent = phase.title;
  phaseCopy.textContent = phase.copy;
  launchMeter.style.width = `${18 + progress * 82}%`;
}

window.addEventListener("scroll", updateHeroPhase, { passive: true });
updateHeroPhase();


/* =====================================================
   FINAL MASTER AURORA BOREALIS ENGINE
   Clean, fast, layered canvas aurora inspired by the reference image.
   Runs on its own low-resolution canvas under the particle network.
   ===================================================== */

(() => {
  const canvas = document.getElementById("auroraCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let screenW = 0;
  let screenH = 0;
  let width = 0;
  let height = 0;
  let scale = 0.6;
  let lastFrame = 0;

  const FPS = 24;
  const FRAME_DELAY = 1000 / FPS;

  const leftBeams = makeBeamSeeds(15, 11.3);
  const rightBeams = makeBeamSeeds(14, 47.7);
  const centerBeams = makeBeamSeeds(8, 83.1);

  let smoothedScrollY = 0;
  let scrollProgress = 0;

  function hash(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function makeBeamSeeds(count, offset) {
    return Array.from({ length: count }, (_, i) => {
      const h = hash(i + offset);
      const h2 = hash((i + 1) * offset);

      return {
        t: count === 1 ? 0.5 : i / (count - 1),
        phase: h * Math.PI * 2,
        width: 0.75 + h2 * 1.8,
        shift: (h - 0.5) * 0.035,
        alpha: 0.68 + hash(i * 3.17 + offset) * 0.42,
      };
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function gaussian(t, center, width) {
    const x = (t - center) / width;
    return Math.exp(-(x * x));
  }

  function rgba(rgb, alpha) {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  }

  function cubic(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;

    return {
      x:
        mt2 * mt * p0.x +
        3 * mt2 * t * p1.x +
        3 * mt * t2 * p2.x +
        t2 * t * p3.x,
      y:
        mt2 * mt * p0.y +
        3 * mt2 * t * p1.y +
        3 * mt * t2 * p2.y +
        t2 * t * p3.y,
    };
  }

  function curvePoint(curve, t) {
    const p = cubic(curve.p0, curve.p1, curve.p2, curve.p3, t);

    // Apply scroll-linked drift (drift downwards) and horizontal wave distortion
    const scrollOffset = scrollProgress * height * 0.35;
    const wave = Math.sin(t * Math.PI + scrollProgress * 3.5) * width * 0.035;

    return {
      x: p.x * width + wave,
      y: p.y * height + scrollOffset,
    };
  }

  function mixPoint(a, b, t) {
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
    };
  }

  function resizeAurora() {
    screenW = window.innerWidth;
    screenH = window.innerHeight;

    scale = screenW < 700 ? 0.36 : screenW < 1100 ? 0.42 : 0.48;

    width = Math.max(320, Math.floor(screenW * scale));
    height = Math.max(320, Math.floor(screenH * scale));

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${screenW}px`;
    canvas.style.height = `${screenH}px`;
  }

  const emerald = [72, 255, 204];
  const cyan = [104, 246, 255];
  const deepCyan = [30, 174, 190];
  const violet = [149, 82, 255];
  const purple = [190, 110, 255];

  const leftTop = {
    p0: { x: -0.06, y: 0.34 },
    p1: { x: 0.08, y: 0.19 },
    p2: { x: 0.28, y: 0.23 },
    p3: { x: 0.55, y: 0.56 },
  };

  const leftBottom = {
    p0: { x: -0.02, y: 0.50 },
    p1: { x: 0.18, y: 0.42 },
    p2: { x: 0.30, y: 0.80 },
    p3: { x: 0.58, y: 0.78 },
  };

  const leftCore = {
    p0: { x: 0.02, y: 0.35 },
    p1: { x: 0.16, y: 0.24 },
    p2: { x: 0.26, y: 0.52 },
    p3: { x: 0.39, y: 0.78 },
  };

  const rightTop = {
    p0: { x: 0.67, y: 0.70 },
    p1: { x: 0.78, y: 0.39 },
    p2: { x: 0.91, y: 0.34 },
    p3: { x: 1.08, y: 0.48 },
  };

  const rightBottom = {
    p0: { x: 0.70, y: 0.86 },
    p1: { x: 0.82, y: 0.68 },
    p2: { x: 0.92, y: 0.61 },
    p3: { x: 1.08, y: 0.76 },
  };

  const rightCore = {
    p0: { x: 0.73, y: 0.80 },
    p1: { x: 0.81, y: 0.58 },
    p2: { x: 0.90, y: 0.47 },
    p3: { x: 0.99, y: 0.62 },
  };

  function drawSoftBase(time) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const leftGlow = ctx.createRadialGradient(
      width * 0.22,
      height * 0.62,
      0,
      width * 0.22,
      height * 0.62,
      width * 0.33,
    );
    leftGlow.addColorStop(0, "rgba(58, 255, 204, 0.10)");
    leftGlow.addColorStop(0.42, "rgba(58, 255, 204, 0.045)");
    leftGlow.addColorStop(1, "rgba(58, 255, 204, 0)");
    ctx.fillStyle = leftGlow;
    ctx.fillRect(0, 0, width, height);

    const rightGlow = ctx.createRadialGradient(
      width * 0.87,
      height * 0.62,
      0,
      width * 0.87,
      height * 0.62,
      width * 0.29,
    );
    rightGlow.addColorStop(0, "rgba(154, 82, 255, 0.13)");
    rightGlow.addColorStop(0.48, "rgba(154, 82, 255, 0.055)");
    rightGlow.addColorStop(1, "rgba(154, 82, 255, 0)");
    ctx.fillStyle = rightGlow;
    ctx.fillRect(0, 0, width, height);

    const centralGlow = ctx.createRadialGradient(
      width * 0.64,
      height * 0.87,
      0,
      width * 0.64,
      height * 0.87,
      width * 0.25,
    );
    centralGlow.addColorStop(0, "rgba(76, 255, 230, 0.10)");
    centralGlow.addColorStop(0.28, "rgba(110, 120, 255, 0.08)");
    centralGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = centralGlow;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  function drawSheetFill(topCurve, bottomCurve, colorA, colorB, alpha, blur, time, focus) {
    const samples = 30;
    const top = [];
    const bottom = [];

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const pTop = curvePoint(topCurve, t);
      const pBottom = curvePoint(bottomCurve, t);
      const bend = Math.sin(time * 0.00012 + t * 5.5) * height * 0.008;
      const cut = Math.sin(t * 19 + time * 0.0001) * height * 0.004 * Math.sin(Math.PI * t);

      top.push({ x: pTop.x, y: pTop.y + bend - cut });
      bottom.push({ x: pBottom.x, y: pBottom.y + bend * 0.5 + cut * 1.7 });
    }

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = alpha;
    ctx.filter = `blur(${blur}px)`;

    const gradient = ctx.createLinearGradient(0, height * 0.22, 0, height * 0.86);
    gradient.addColorStop(0, rgba(colorA, 0));
    gradient.addColorStop(0.18, rgba(colorA, 0.06));
    gradient.addColorStop(0.38, rgba(colorA, 0.24));
    gradient.addColorStop(0.53, rgba(colorB, 0.24));
    gradient.addColorStop(0.68, rgba(colorA, 0.15));
    gradient.addColorStop(0.88, rgba(colorB, 0.05));
    gradient.addColorStop(1, rgba(colorA, 0));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(top[0].x, top[0].y);

    for (let i = 1; i < top.length; i++) {
      const prev = top[i - 1];
      const curr = top[i];
      ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + curr.x) / 2, (prev.y + curr.y) / 2);
    }

    for (let i = bottom.length - 1; i >= 0; i--) {
      const prev = bottom[Math.min(i + 1, bottom.length - 1)];
      const curr = bottom[i];
      ctx.quadraticCurveTo(prev.x, prev.y, curr.x, curr.y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // bright middle body like the reference image
    const center = mixPoint(curvePoint(topCurve, focus), curvePoint(bottomCurve, focus), 0.58);
    const glowRadius = width * 0.15;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = alpha * 0.64;
    ctx.filter = "blur(10px)";
    const glow = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, glowRadius);
    glow.addColorStop(0, rgba(colorB, 0.20));
    glow.addColorStop(0.28, rgba(colorA, 0.14));
    glow.addColorStop(0.68, rgba(colorA, 0.04));
    glow.addColorStop(1, rgba(colorA, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(center.x - glowRadius, center.y - glowRadius, glowRadius * 2, glowRadius * 2);
    ctx.restore();
  }

  function drawCurtainBeams(topCurve, bottomCurve, beams, colorA, colorB, alpha, time, options = {}) {
    const {
      focus = 0.5,
      focusWidth = 0.28,
      beamBlur = 3.5,
      core = true,
      sway = 1,
      minWidth = 2.2,
      maxWidth = 9.0,
    } = options;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.filter = `blur(${beamBlur}px)`;

    for (const beam of beams) {
      const t = clamp(beam.t + beam.shift, 0, 1);
      const top = curvePoint(topCurve, t);
      const bottom = curvePoint(bottomCurve, t);
      const fade = Math.pow(Math.sin(Math.PI * t), 0.72);
      const center = gaussian(t, focus, focusWidth);
      const live = reduceMotion.matches ? 0 : Math.sin(time * 0.0002 + beam.phase) * width * 0.006 * sway;
      const fold = Math.sin(t * 14 + beam.phase + time * 0.00012) * height * 0.018 * fade;
      const lowerFold = Math.cos(t * 20 + beam.phase * 0.8 + time * 0.00009) * height * 0.010 * fade;

      const start = {
        x: top.x + live,
        y: top.y + fold * 0.35,
      };
      const end = {
        x: bottom.x - live * 0.45,
        y: bottom.y + lowerFold,
      };

      const cp1 = {
        x: lerp(start.x, end.x, 0.34) + Math.sin(beam.phase) * width * 0.018 * fade,
        y: lerp(start.y, end.y, 0.34) - height * 0.025 * center,
      };
      const cp2 = {
        x: lerp(start.x, end.x, 0.70) + Math.cos(beam.phase) * width * 0.022 * fade,
        y: lerp(start.y, end.y, 0.72) + height * 0.030 * center,
      };

      const strokeAlpha = alpha * beam.alpha * fade * (0.22 + center * 0.78);
      const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
      grad.addColorStop(0, rgba(colorA, 0));
      grad.addColorStop(0.18, rgba(colorA, strokeAlpha * 0.16));
      grad.addColorStop(0.42, rgba(colorA, strokeAlpha * 0.44));
      grad.addColorStop(0.56, rgba(colorB, strokeAlpha * 0.38));
      grad.addColorStop(0.77, rgba(colorA, strokeAlpha * 0.18));
      grad.addColorStop(1, rgba(colorB, 0));

      ctx.strokeStyle = grad;
      ctx.lineWidth = minWidth + beam.width * (1.2 + center * (maxWidth - minWidth));
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
      ctx.stroke();
    }

    ctx.restore();

    if (!core) return;

    // crisp inner luminous folds; small and fast
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.filter = "blur(0.6px)";

    for (let i = 0; i < beams.length; i += 3) {
      const beam = beams[i];
      const t = clamp(beam.t + beam.shift * 0.5, 0, 1);
      const top = curvePoint(topCurve, t);
      const bottom = curvePoint(bottomCurve, t);
      const fade = Math.pow(Math.sin(Math.PI * t), 0.9);
      const center = gaussian(t, focus, focusWidth);

      if (center < 0.16) continue;

      const live = reduceMotion.matches ? 0 : Math.sin(time * 0.00016 + beam.phase) * width * 0.004 * sway;
      const grad = ctx.createLinearGradient(top.x, top.y, bottom.x, bottom.y);
      grad.addColorStop(0, rgba(colorA, 0));
      grad.addColorStop(0.36, rgba(colorB, 0.08 * fade * center));
      grad.addColorStop(0.58, rgba(colorA, 0.17 * fade * center));
      grad.addColorStop(0.84, rgba(colorB, 0.05 * fade * center));
      grad.addColorStop(1, rgba(colorA, 0));

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2 + center * 2.0;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(top.x + live, top.y);
      ctx.bezierCurveTo(
        lerp(top.x, bottom.x, 0.35) + live * 1.5,
        lerp(top.y, bottom.y, 0.32),
        lerp(top.x, bottom.x, 0.72) - live,
        lerp(top.y, bottom.y, 0.72),
        bottom.x - live * 0.4,
        bottom.y,
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawFloorReflection(time) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.filter = "blur(10px)";

    const pool = ctx.createRadialGradient(
      width * 0.66,
      height * 0.89,
      0,
      width * 0.66,
      height * 0.89,
      width * 0.24,
    );
    pool.addColorStop(0, "rgba(70, 255, 224, 0.16)");
    pool.addColorStop(0.25, "rgba(122, 78, 255, 0.11)");
    pool.addColorStop(0.62, "rgba(70, 255, 224, 0.035)");
    pool.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = pool;
    ctx.fillRect(width * 0.42, height * 0.72, width * 0.50, height * 0.28);
    ctx.restore();
  }

  function drawAurora(time) {
    drawSoftBase(time);

    // broad blended sheets first
    drawSheetFill(leftTop, leftBottom, emerald, cyan, 0.74, 5, time, 0.52);
    drawSheetFill(rightTop, rightBottom, violet, purple, 0.78, 5, time, 0.46);

    // secondary depth layers to avoid a flat shape
    drawSheetFill(leftCore, leftBottom, deepCyan, emerald, 0.26, 8, time, 0.55);
    drawSheetFill(rightCore, rightBottom, violet, cyan, 0.26, 8, time, 0.44);

    // detailed curtain folds
    drawCurtainBeams(leftTop, leftBottom, leftBeams, emerald, cyan, 0.78, time, {
      focus: 0.50,
      focusWidth: 0.28,
      beamBlur: 2.0,
      sway: 1.0,
      minWidth: 1.8,
      maxWidth: 7.8,
    });

    drawCurtainBeams(rightTop, rightBottom, rightBeams, violet, purple, 0.80, time, {
      focus: 0.44,
      focusWidth: 0.30,
      beamBlur: 2.1,
      sway: 0.9,
      minWidth: 1.8,
      maxWidth: 8.2,
    });

    drawCurtainBeams(leftCore, leftBottom, centerBeams, cyan, emerald, 0.36, time, {
      focus: 0.60,
      focusWidth: 0.25,
      beamBlur: 3.4,
      sway: 0.75,
      minWidth: 1.5,
      maxWidth: 5.8,
      core: false,
    });

    drawFloorReflection(time);
  }

  function render(time) {
    requestAnimationFrame(render);

    if (document.hidden) return;

    // Smoothly interpolate scroll state
    const targetScroll = window.scrollY;
    smoothedScrollY += (targetScroll - smoothedScrollY) * 0.15;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = docHeight > 0 ? smoothedScrollY / docHeight : 0;

    ctx.clearRect(0, 0, width, height);
    drawAurora(time || 0);
  }

  resizeAurora();
  window.addEventListener("resize", resizeAurora, { passive: true });
  requestAnimationFrame(render);
})();

