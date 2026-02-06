const reveals = document.querySelectorAll(".reveal");

const activateReveal = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
};

const observer = new IntersectionObserver(activateReveal, {
  threshold: 0.2,
});

reveals.forEach((el) => observer.observe(el));
