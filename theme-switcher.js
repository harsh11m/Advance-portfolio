"use strict";

/**
 * theme-switcher.js
 * Handles: theme cycling (CSS variable swap), mobile nav toggle,
 * scroll-reveal animations, and contact form validation.
 */

const IS_DEV = false;
const THEMES = ["lavender", "sunset", "midnight"];
const STORAGE_KEY = "portfolio-theme";

const log = (...args) => { if (IS_DEV) console.log("[theme-switcher]", ...args); };

/* ---- Theme switching ------------------------------------------------------ */
const initThemeSwitcher = () => {
  const themeBtn = document.getElementById("themeToggle");
  const themeIcon = themeBtn?.querySelector(".nav__theme-icon");
  if (!themeBtn) return;

  const applyTheme = (theme) => {
    if (theme === "lavender") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      log("localStorage unavailable", err);
    }
  };

  const savedTheme = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  })();

  let currentIndex = THEMES.indexOf(savedTheme) !== -1 ? THEMES.indexOf(savedTheme) : 0;
  applyTheme(THEMES[currentIndex]);

  themeBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % THEMES.length;
    applyTheme(THEMES[currentIndex]);
    themeIcon?.classList.remove("is-spinning");
    void themeIcon?.offsetWidth; // restart animation
    themeIcon?.classList.add("is-spinning");
  });
};

/* ---- Mobile nav toggle ------------------------------------------------------ */
const initNavToggle = () => {
  const toggleBtn = document.getElementById("navToggle");
  const navList = document.getElementById("navList");
  if (!toggleBtn || !navList) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("is-open");
    toggleBtn.classList.toggle("is-active", isOpen);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  navList.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("is-open");
      toggleBtn.classList.remove("is-active");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
};

/* ---- Scroll reveal via IntersectionObserver --------------------------------- */
const initScrollReveal = () => {
  const targets = document.querySelectorAll(".gallery__item, .about__card--bio");
  if (!targets.length || !("IntersectionObserver" in window)) return;

  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
};

/* ---- Contact form validation (data-driven rules) ----------------------------- */
const FIELD_RULES = {
  name: {
    validate: (value) => value.trim().length >= 2,
    message: "Please enter your name (min 2 characters).",
  },
  email: {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: "Please enter a valid email address.",
  },
  message: {
    validate: (value) => value.trim().length >= 10,
    message: "Message should be at least 10 characters.",
  },
};

const initContactForm = () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  const validateField = (fieldName) => {
    const input = form.elements[fieldName];
    const errorEl = document.getElementById(`${fieldName}Error`);
    const rule = FIELD_RULES[fieldName];
    if (!input || !errorEl || !rule) return true;

    const isValid = rule.validate(input.value);
    const wrapper = input.closest(".form-field");
    errorEl.textContent = isValid ? "" : rule.message;
    wrapper?.classList.toggle("has-error", !isValid);
    return isValid;
  };

  Object.keys(FIELD_RULES).forEach((fieldName) => {
    const input = form.elements[fieldName];
    input?.addEventListener("blur", () => validateField(fieldName));
    input?.addEventListener("input", () => {
      const wrapper = input.closest(".form-field");
      if (wrapper?.classList.contains("has-error")) validateField(fieldName);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const allValid = Object.keys(FIELD_RULES)
      .map(validateField)
      .every(Boolean);

    status.classList.remove("is-success", "is-error");

    if (!allValid) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("is-error");
      return;
    }

    status.textContent = "Thanks! Your message has been noted (demo form — no backend connected).";
    status.classList.add("is-success");
    form.reset();
  });
};

/* ---- Footer year ------------------------------------------------------------- */
const initFooterYear = () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
};

/* ---- Init -------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initThemeSwitcher();
  initNavToggle();
  initScrollReveal();
  initContactForm();
  initFooterYear();
});
