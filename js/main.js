const menuToggle = document.getElementById("menuToggle");
const navClose = document.getElementById("navClose");
const mainNav = document.getElementById("mainNav");
const menuOverlay = document.getElementById("menuOverlay");
const revealItems = document.querySelectorAll(".reveal-animation");
const counterGroups = document.querySelectorAll(".hero-stats, .about-stats");

const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setMenuIcon = (iconName) => {
  const icon = menuToggle?.querySelector("ion-icon");
  if (icon) icon.setAttribute("name", iconName);
};

const openMenu = () => {
  if (!mainNav || !menuOverlay || !menuToggle) return;

  mainNav.classList.add("is-active");
  menuOverlay.classList.add("is-active");
  document.body.classList.add("menu-open");

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
  setMenuIcon("close-outline");
};

const closeMenu = () => {
  if (!mainNav || !menuOverlay || !menuToggle) return;

  mainNav.classList.remove("is-active");
  menuOverlay.classList.remove("is-active");
  document.body.classList.remove("menu-open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  setMenuIcon("menu-outline");
};

const toggleMenu = () => {
  mainNav?.classList.contains("is-active") ? closeMenu() : openMenu();
};

if (menuToggle && mainNav && menuOverlay) {
  menuToggle.addEventListener("click", toggleMenu);
  menuOverlay.addEventListener("click", closeMenu);
  navClose?.addEventListener("click", closeMenu);

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainNav.classList.contains("is-active")) closeMenu();
  });
}

const showRevealItems = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

if (isReducedMotion) {
  showRevealItems();
} else if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const formatCounterValue = (value, decimal) => {
  return decimal > 0 ? value.toFixed(decimal) : Math.round(value).toString();
};

const setCounterFinalValue = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || "";
  const decimal = Number(counter.dataset.decimal || 0);

  counter.textContent = `${formatCounterValue(target, decimal)}${suffix}`;
};

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || "";
  const decimal = Number(counter.dataset.decimal || 0);
  const duration = 1700;
  const startTime = performance.now();

  const updateCounter = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = target * easedProgress;

    counter.textContent = `${formatCounterValue(currentValue, decimal)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      setCounterFinalValue(counter);
    }
  };

  requestAnimationFrame(updateCounter);
};

const startCounterGroup = (group) => {
  if (group.dataset.counterStarted === "true") return;

  group.dataset.counterStarted = "true";

  group.querySelectorAll(".counter-number").forEach((counter) => {
    isReducedMotion ? setCounterFinalValue(counter) : animateCounter(counter);
  });
};

if (counterGroups.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        startCounterGroup(entry.target);
      });
    },
    {
      threshold: 0.35,
    }
  );

  counterGroups.forEach((group) => counterObserver.observe(group));
}

window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});