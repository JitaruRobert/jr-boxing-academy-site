const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");

if (year) {
  year.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Închide meniul" : "Deschide meniul");
  });

  nav.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLAnchorElement)) return;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Deschide meniul");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !nav.classList.contains("is-open")) return;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Deschide meniul");
    navToggle.focus();
  });
}

const credentialModal = document.querySelector("[data-credential-modal]");
const credentialModalImage = document.querySelector("[data-credential-modal-image]");
const credentialModalClose = document.querySelector("[data-credential-modal-close]");
const credentialModalTriggers = document.querySelectorAll("[data-credential-modal-trigger]");
let activeCredentialTrigger = null;

const closeCredentialModal = () => {
  if (!credentialModal || !credentialModalImage) return;

  credentialModal.hidden = true;
  credentialModalImage.removeAttribute("src");
  credentialModalImage.alt = "";
  document.body.classList.remove("credential-modal-open");

  if (activeCredentialTrigger) {
    activeCredentialTrigger.focus({ preventScroll: true });
    activeCredentialTrigger = null;
  }
};

const openCredentialModal = (trigger) => {
  if (!credentialModal || !credentialModalImage || !credentialModalClose) return;

  const image = trigger.querySelector("img");
  if (!image) return;

  activeCredentialTrigger = trigger;
  credentialModalImage.src = image.currentSrc || image.src;
  credentialModalImage.alt = image.alt || "";
  credentialModal.hidden = false;
  document.body.classList.add("credential-modal-open");
  credentialModalClose.focus({ preventScroll: true });
};

if (credentialModal && credentialModalImage && credentialModalClose && credentialModalTriggers.length) {
  credentialModalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openCredentialModal(trigger));
  });

  credentialModalClose.addEventListener("click", closeCredentialModal);

  credentialModal.addEventListener("click", (event) => {
    if (event.target !== credentialModal) return;
    closeCredentialModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || credentialModal.hidden) return;
    closeCredentialModal();
  });
}

const animatedItems = document.querySelectorAll(
  ".service-preview article, .feature-grid article, .timeline article, .pricing-card, .steps article, .method-media, .credential-list article, .credential-photo, .credential-docs article, .gallery-grid article, .contact-action"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  animatedItems.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
} else {
  animatedItems.forEach((item) => item.classList.add("is-visible"));
}
