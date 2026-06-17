/* =========================================================
   The Lawnsmith — interactions
   ========================================================= */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");

  /* Sticky nav background on scroll */
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu */
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

  /* Scroll-reveal */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // small stagger for siblings entering together
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

  /* Animated stat counters */
  const counters = document.querySelectorAll(".stat__num");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach((el) => {
      el.textContent =
        parseFloat(el.dataset.count).toFixed(parseInt(el.dataset.decimals || "0", 10)) +
        (el.dataset.suffix || "");
    });
  }

  /* Quote form — client-side validation + friendly confirmation.
     Wire this to your inbox/CRM (Formspree, Netlify Forms, etc.) — see README. */
  const form = document.getElementById("quoteForm");
  const note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name;
      const phone = form.phone;
      let ok = true;
      [name, phone].forEach((field) => {
        if (!field.value.trim()) {
          field.classList.add("invalid");
          ok = false;
        } else {
          field.classList.remove("invalid");
        }
      });
      if (!ok) {
        note.textContent = "Please add your name and phone so we can reach you.";
        note.classList.remove("success");
        return;
      }
      note.textContent = "Thanks! Your request is in — we'll be in touch shortly. 🌿";
      note.classList.add("success");
      form.reset();
    });
    form.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("input", () => inp.classList.remove("invalid"))
    );
  }

  /* Footer year */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
