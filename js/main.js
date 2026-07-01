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




const projectTabs = document.querySelectorAll(".project-tab");
const projectsGallery = document.getElementById("projectsGallery");
const projectPrev = document.getElementById("projectPrev");
const projectNext = document.getElementById("projectNext");

const projectCategories = [
  {
    key: "uiux",
    projects: [
      {
        title: "Zestflow - CRM Dashboard",
        image: "images/project-uiux-01.jpg",
        alt: "Zestflow CRM dashboard project",
      },
      {
        title: "Roundup - Smart Meeting",
        image: "images/project-uiux-02.jpg",
        alt: "Roundup smart meeting project",
      },
      {
        title: "Furnishly - Furniture App",
        image: "images/project-uiux-03.jpg",
        alt: "Furnishly furniture app project",
      },
      {
        title: "Activity Tracking Apps - Liquid IOS",
        image: "images/project-uiux-04.jpg",
        alt: "Activity tracking app project",
      },
    ],
  },
  {
    key: "web",
    projects: [
      {
        title: "Nexora - SaaS Landing Page",
        image: "images/project-web-01.jpg",
        alt: "SaaS website dashboard project",
      },
      {
        title: "BrightCart - Ecommerce Website",
        image: "images/project-web-02.jpg",
        alt: "Ecommerce website project",
      },
      {
        title: "Cloudline - Business Platform",
        image: "images/project-web-03.jpg",
        alt: "Business platform web development project",
      },
      {
        title: "Medix - Healthcare Portal",
        image: "images/project-web-04.jpg",
        alt: "Healthcare web portal project",
      },
    ],
  },
  {
    key: "branding",
    projects: [
      {
        title: "Aurora - Brand Identity",
        image: "images/project-branding-01.jpg",
        alt: "Brand identity design project",
      },
      {
        title: "Vertex - Logo System",
        image: "images/project-branding-02.jpg",
        alt: "Logo system design project",
      },
      {
        title: "Bloomly - Visual Guidelines",
        image: "images/project-branding-03.jpg",
        alt: "Visual guideline branding project",
      },
      {
        title: "Northbay - Creative Campaign",
        image: "images/project-branding-04.jpg",
        alt: "Creative campaign branding project",
      },
    ],
  },
];

let activeProjectIndex = 0;
let projectSlideLocked = false;

const getProjectIndex = (key) => {
  return projectCategories.findIndex((category) => category.key === key);
};

const updateProjectTabs = () => {
  const activeKey = projectCategories[activeProjectIndex].key;

  projectTabs.forEach((tab) => {
    const isActive = tab.dataset.projectTab === activeKey;

    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
};

const updateProjectCards = () => {
  if (!projectsGallery) return;

  const activeProjects = projectCategories[activeProjectIndex].projects;
  const cards = projectsGallery.querySelectorAll(".project-card");

  cards.forEach((card, index) => {
    const project = activeProjects[index];
    const image = card.querySelector("img");
    const title = card.querySelector("h3");

    if (!project || !image || !title) return;

    image.src = project.image;
    image.alt = project.alt;
    title.textContent = project.title;
  });
};

const setActiveProjectCategory = (index) => {
  if (!projectsGallery || projectSlideLocked) return;

  const total = projectCategories.length;
  activeProjectIndex = (index + total) % total;
  projectSlideLocked = true;

  projectsGallery.classList.add("is-changing");

  window.setTimeout(() => {
    updateProjectTabs();
    updateProjectCards();

    requestAnimationFrame(() => {
      projectsGallery.classList.remove("is-changing");
      projectSlideLocked = false;
    });
  }, 280);
};

projectTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetIndex = getProjectIndex(tab.dataset.projectTab);

    if (targetIndex === -1 || targetIndex === activeProjectIndex) return;
    setActiveProjectCategory(targetIndex);
  });
});

projectPrev?.addEventListener("click", () => {
  setActiveProjectCategory(activeProjectIndex - 1);
});

projectNext?.addEventListener("click", () => {
  setActiveProjectCategory(activeProjectIndex + 1);
});