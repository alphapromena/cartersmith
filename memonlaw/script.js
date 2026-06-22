/* =========================================================
   Law Offices of Kamran Memon — premium interactions
   ========================================================= */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Loader ---------- */
  window.addEventListener("load", () => {
    const l = document.getElementById("loader");
    if (l) setTimeout(() => l.classList.add("is-done"), 350);
  });

  /* ---------- Nav ---------- */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); })
  );

  /* ---------- Custom cursor ---------- */
  if (fine) {
    const cur = document.getElementById("cursor");
    const dot = document.getElementById("cursorDot");
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
    });
    const loop = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('[data-cursor="link"], a, button').forEach((el) => {
      el.addEventListener("mouseenter", () => cur.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cur.classList.remove("is-hover"));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduce) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${mx * 0.25}px,${my * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- 3D tilt cards ---------- */
  if (fine && !reduce) {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -10;
        const ry = (px - 0.5) * 12;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("is-visible"), (i % 6) * 70);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("is-visible"));

  /* ---------- Hero parallax ---------- */
  if (!reduce) {
    const par = document.querySelector("[data-parallax]");
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (par && y < innerHeight) { par.style.transform = `translateY(${y * 0.18}px)`; par.style.opacity = String(1 - y / (innerHeight * 0.9)); }
    }, { passive: true });
  }

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll(".stat__num");
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const plain = el.dataset.plain === "true";
    const suffix = el.dataset.suffix || "";
    const dur = 1500, start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = (plain ? String(val) : val.toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (plain ? String(target) : target.toLocaleString()) + suffix;
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  } else counters.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));

  /* ---------- Consultation form ---------- */
  const form = document.getElementById("consultForm");
  const note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      [form.name, form.phone].forEach((f) => { if (!f.value.trim()) { f.classList.add("invalid"); ok = false; } else f.classList.remove("invalid"); });
      if (!ok) { note.textContent = "Please add your name and phone so we can reach you."; note.classList.remove("success"); return; }
      note.textContent = "Thank you. Your request has been received — we'll be in touch soon.";
      note.classList.add("success");
      form.reset();
    });
    form.querySelectorAll("input").forEach((inp) => inp.addEventListener("input", () => inp.classList.remove("invalid")));
  }

  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- WebGL 3D hero (Three.js) ---------- */
  const canvas = document.getElementById("bg3d");
  if (canvas && window.THREE && !reduce) {
    try { init3D(canvas); } catch (e) { /* graceful: gradient fallback remains */ }
  }

  function init3D(canvas) {
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
    camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);

    const gold = new THREE.Color(0xe7cd87);

    // --- Particle field (gold dust forming a rotating sphere shell) ---
    const COUNT = 1600;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 5 + Math.random() * 4;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(p) * Math.cos(t);
      positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      positions[i * 3 + 2] = r * Math.cos(p);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ color: gold, size: 0.045, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // --- Faceted crystal (gold wireframe icosahedron) ---
    const icoGeo = new THREE.IcosahedronGeometry(2.1, 0);
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(icoGeo),
      new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.5 })
    );
    scene.add(wire);
    const solid = new THREE.Mesh(
      icoGeo,
      new THREE.MeshBasicMaterial({ color: 0x112a4d, transparent: true, opacity: 0.35 })
    );
    scene.add(solid);

    // pointer parallax
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    window.addEventListener("mousemove", (e) => { tmx = (e.clientX / innerWidth - 0.5); tmy = (e.clientY / innerHeight - 0.5); });

    const clock = new THREE.Clock();
    let raf;
    const render = () => {
      const t = clock.getElapsedTime();
      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
      points.rotation.y = t * 0.05;
      points.rotation.x = t * 0.02;
      wire.rotation.y = solid.rotation.y = t * 0.18;
      wire.rotation.x = solid.rotation.x = t * 0.12;
      camera.position.x = mx * 2;
      camera.position.y = -my * 2;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });

    // pause when hero off-screen (perf)
    const hero = document.getElementById("top");
    if ("IntersectionObserver" in window && hero) {
      new IntersectionObserver((ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting && !raf) render();
          else if (!en.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0.01 }).observe(hero);
    }
  }
})();
