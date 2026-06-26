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
  const note = contactForm.querySelector("[data-form-note]");
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (note) {
      note.textContent = "Sending your inquiry...";
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to send inquiry.");
      }

      if (note) {
        note.textContent = "Thanks. Your inquiry was sent successfully.";
      }

      contactForm.reset();
    } catch (error) {
      if (note) {
        note.textContent = "Sorry, the inquiry could not be sent. Please email Jobeywankenobifitness@gmail.com directly.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send inquiry";
      }
    }
  });
}
