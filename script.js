/**
 * Anas Taghzaoui | Portfolio Interactive Engine
 * Visual Upgrade: 3D Hero Scene, Magnetic Cursor, 3D Card Tilt, Parallax & Scroll Motion
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const navbar = document.querySelector('.navbar');
  const scrollProgress = document.querySelector('.scroll-progress');
  const sections = document.querySelectorAll('.section');
  const cards = document.querySelectorAll('.card');
  const skills = document.querySelectorAll('.skill');
  const emailButton = document.querySelector('.email-button');
  const ambientGlow1 = document.querySelector('.ambient-glow-1');
  const ambientGlow2 = document.querySelector('.ambient-glow-2');

  // Mouse State
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let cursorTarget = { x: mouse.x, y: mouse.y };
  let cursorCurrent = { x: mouse.x, y: mouse.y };

  // Listen to Mouse Move
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (cursor) {
      cursor.style.left = `${mouse.x}px`;
      cursor.style.top = `${mouse.y}px`;
    }

    if (cursorDot) {
      cursorDot.style.left = `${mouse.x}px`;
      cursorDot.style.top = `${mouse.y}px`;
    }
  }, { passive: true });

  // Smooth Cursor Ring Lerp Loop
  const renderCursor = () => {
    cursorCurrent.x += (mouse.x - cursorCurrent.x) * 0.18;
    cursorCurrent.y += (mouse.y - cursorCurrent.y) * 0.18;

    if (cursorRing) {
      cursorRing.style.left = `${cursorCurrent.x}px`;
      cursorRing.style.top = `${cursorCurrent.y}px`;
    }
    requestAnimationFrame(renderCursor);
  };
  renderCursor();

  // Magnetic Hover Targets
  const interactiveTargets = document.querySelectorAll('a, button, .btn, .skill, .card, .logo');
  interactiveTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      cursorRing?.classList.add('is-hovering');
    });

    target.addEventListener('mouseleave', () => {
      cursorRing?.classList.remove('is-hovering');
      target.style.transform = '';
    });

    target.addEventListener('mousemove', (e) => {
      if (target.classList.contains('btn') || target.classList.contains('email-button') || target.classList.contains('logo')) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.25;
        const deltaY = (e.clientY - centerY) * 0.25;
        target.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      }
    });
  });

  // --- THREE.JS 3D HERO VISUAL SCENE ---
  const initHero3D = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Fallback 2D Canvas Renderer if Three.js is unavailable
    if (typeof THREE === 'undefined') {
      initCanvas2DFallback(canvas);
      return;
    }

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 7;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 3D Geometry: Outer Geodesic Sphere
      const outerGeo = new THREE.IcosahedronGeometry(2.2, 2);
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      });
      const outerSphere = new THREE.Mesh(outerGeo, outerMat);
      scene.add(outerSphere);

      // Inner Glowing Core
      const innerGeo = new THREE.IcosahedronGeometry(1.4, 1);
      const innerMat = new THREE.MeshPhongMaterial({
        color: 0x4c1d95,
        emissive: 0x2c357e,
        shininess: 90,
        wireframe: false,
        transparent: true,
        opacity: 0.65
      });
      const innerSphere = new THREE.Mesh(innerGeo, innerMat);
      scene.add(innerSphere);

      // Ambient Orbital Particle Ring
      const particleCount = 300;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 2.8 + Math.random() * 2.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;

        positions[i] = radius * Math.cos(theta) * Math.cos(phi);
        positions[i + 1] = radius * Math.sin(phi);
        positions[i + 2] = radius * Math.sin(theta) * Math.cos(phi);
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xd7ff4f,
        size: 0.035,
        transparent: true,
        opacity: 0.7
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x8b5cf6, 2, 50);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xd7ff4f, 1.5, 50);
      pointLight2.position.set(-5, -5, 2);
      scene.add(pointLight2);

      // Smooth Animation Loop
      let targetRotX = 0;
      let targetRotY = 0;

      const animate3D = () => {
        requestAnimationFrame(animate3D);

        // Slow organic rotation
        outerSphere.rotation.x += 0.002;
        outerSphere.rotation.y += 0.003;
        innerSphere.rotation.x -= 0.003;
        innerSphere.rotation.y -= 0.002;
        particles.rotation.y += 0.001;

        // Subtle mouse tilt reaction
        const normX = (mouse.x / window.innerWidth - 0.5) * 2;
        const normY = (mouse.y / window.innerHeight - 0.5) * 2;

        targetRotX = normY * 0.35;
        targetRotY = normX * 0.35;

        outerSphere.rotation.x += (targetRotX - outerSphere.rotation.x) * 0.04;
        outerSphere.rotation.y += (targetRotY - outerSphere.rotation.y) * 0.04;

        renderer.render(scene, camera);
      };
      animate3D();

      // Window Resize Listener
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, { passive: true });

    } catch (e) {
      console.warn('Three.js initialization notice:', e);
      initCanvas2DFallback(canvas);
    }
  };

  // 2D Canvas Floating Particle Fallback Renderer
  const initCanvas2DFallback = (canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.3 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(215, 255, 79, 0.5)'
    }));

    const drawFallback = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(drawFallback);
    };
    drawFallback();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });
  };

  initHero3D();

  // --- 3D TILT INTERACTION FOR PROJECT CARDS ---
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardX = e.clientX - rect.left;
      const cardY = e.clientY - rect.top;

      // Update CSS Variables for Spotlight Glow
      card.style.setProperty('--spotlight-x', `${cardX}px`);
      card.style.setProperty('--spotlight-y', `${cardY}px`);

      // 3D Tilt Angle Calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((cardY - centerY) / centerY) * 12;
      const rotateY = ((cardX - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });

  // --- STAGGERED SKILL HOVER ANIMATION ---
  skills.forEach((skill, idx) => {
    skill.style.animationDelay = `${(idx % 5) * 0.1}s`;
  });

  // --- SCROLL PROGRESS & PARALLAX OBSERVER ---
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // Navbar Scrolled State & Top Progress Bar Width
    if (navbar) {
      navbar.classList.toggle('is-scrolled', scrollY > 60);
    }
    if (scrollProgress && maxScroll > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
      scrollProgress.style.width = `${progressPercent}%`;
    }

    // Ambient Glow Orbs Parallax Shift
    if (ambientGlow1) {
      ambientGlow1.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
    if (ambientGlow2) {
      ambientGlow2.style.transform = `translateY(${-scrollY * 0.06}px)`;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- SCROLL REVEAL INTERSECTION OBSERVER ---
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.14 }
  );

  sections.forEach((section) => {
    section.classList.add('reveal');
    revealObserver.observe(section);
  });

  // --- EMAIL COPY BUTTON FUNCTIONALITY ---
  if (emailButton) {
    emailButton.addEventListener('click', async () => {
      const email = emailButton.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        emailButton.innerHTML = 'EMAIL COPIED <span>✓</span>';
        emailButton.style.borderColor = 'var(--acid)';
        setTimeout(() => {
          emailButton.innerHTML = 'COPY EMAIL <span>↗</span>';
          emailButton.style.borderColor = '';
        }, 1800);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  }
});

