const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const yearTargets = document.querySelectorAll("[data-year]");
const revealTargets = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("[data-contact-form]");

yearTargets.forEach((target) => {
  target.textContent = new Date().getFullYear();
});

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const note = contactForm.querySelector("[data-form-note]");
    const formData = new FormData(contactForm);
    const name = formData.get("name") || "there";
    const email = formData.get("email") || "";
    const goal = formData.get("goal") || "Not specified";
    const message = formData.get("message") || "No additional message provided.";
    const subject = encodeURIComponent("New Training Inquiry");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTraining Goal: ${goal}\n\nMessage:\n${message}`
    );

    if (note) {
      note.textContent = `Thanks, ${name}. Opening your email app now.`;
    }

    window.location.href = `mailto:Jobeywankenobifitness@gmail.com?subject=${subject}&body=${body}`;
    contactForm.reset();
  });
}
