/* =========================================================
   Law Offices of Kamran Memon — interactions
   ========================================================= */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  /* Scroll reveal */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("is-visible"), (i % 6) * 70);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Stat counters */
  const counters = document.querySelectorAll(".stat__num");
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const plain = el.dataset.plain === "true"; // years like 1997 — no grouping/decimals
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const start = performance.now();
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
    const co = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));
  }

  /* Consultation form */
  const form = document.getElementById("consultForm");
  const note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      [form.name, form.phone].forEach((f) => {
        if (!f.value.trim()) { f.classList.add("invalid"); ok = false; }
        else f.classList.remove("invalid");
      });
      if (!ok) {
        note.textContent = "Please add your name and phone so we can reach you.";
        note.classList.remove("success");
        return;
      }
      note.textContent = "Thank you. Your request has been received — we'll be in touch soon.";
      note.classList.add("success");
      form.reset();
    });
    form.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("input", () => inp.classList.remove("invalid"))
    );
  }

  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
