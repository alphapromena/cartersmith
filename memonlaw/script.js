/* Law Offices of Kamran Memon — minimal interactions */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); })
  );

  /* Reveal on scroll */
  const els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("in"), (i % 8) * 55);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
  } else els.forEach((el) => el.classList.add("in"));

  /* Form */
  const form = document.getElementById("form");
  const note = document.getElementById("note");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      [form.name, form.phone].forEach((f) => {
        if (!f.value.trim()) { f.classList.add("bad"); ok = false; } else f.classList.remove("bad");
      });
      if (!ok) { note.textContent = "Please add your name and phone."; note.classList.remove("ok"); return; }
      note.textContent = "Received. We'll be in touch shortly.";
      note.classList.add("ok");
      form.reset();
    });
    form.querySelectorAll("input").forEach((i) => i.addEventListener("input", () => i.classList.remove("bad")));
  }

  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
