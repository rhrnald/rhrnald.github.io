const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sections = Array.from(document.querySelectorAll(".section"));
const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

const getHashTarget = (hash) => {
  if (!hash || hash === "#") {
    return null;
  }

  return document.getElementById(hash.slice(1));
};

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.hash === `#${id}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

document.body.classList.add("js-ready");

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    }
  );

  sections.forEach((section) => revealObserver.observe(section));
} else {
  sections.forEach((section) => section.classList.add("is-visible"));
}

if ("IntersectionObserver" in window) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveLink(visible.target.id);
      }
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.1, 0.25, 0.5, 0.75],
    }
  );

  sections.forEach((section) => activeObserver.observe(section));
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = getHashTarget(link.hash);

    if (!target) {
      return;
    }

    event.preventDefault();
    setActiveLink(target.id);

    if (!reduceMotion) {
      document.body.classList.add("is-navigating");
      window.setTimeout(() => {
        document.body.classList.remove("is-navigating");
      }, 220);
    }

    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    window.history.pushState(null, "", link.hash);
  });
});

const initialSection = window.location.hash
  ? getHashTarget(window.location.hash)
  : sections[0];

if (initialSection) {
  initialSection.classList.add("is-visible");
  setActiveLink(initialSection.id);
}
