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

const galleryAlbumModal = document.querySelector("[data-gallery-album-modal]");
const galleryAlbumTitle = document.querySelector("[data-gallery-album-title]");
const galleryAlbumClose = document.querySelector("[data-gallery-album-close]");
const galleryAlbumTriggers = document.querySelectorAll("[data-gallery-album-trigger]");
const galleryAlbumImages = document.querySelectorAll("[data-gallery-album-image]");
let activeGalleryAlbumTrigger = null;

const closeGalleryAlbum = () => {
  if (!galleryAlbumModal) return;

  galleryAlbumModal.hidden = true;
  document.body.classList.remove("gallery-album-open");

  if (activeGalleryAlbumTrigger) {
    activeGalleryAlbumTrigger.focus({ preventScroll: true });
    activeGalleryAlbumTrigger = null;
  }
};

const openGalleryAlbum = (trigger) => {
  if (!galleryAlbumModal || !galleryAlbumTitle || !galleryAlbumClose) return;

  const album = trigger.dataset.galleryAlbumTrigger;
  if (!album) return;

  galleryAlbumImages.forEach((item) => {
    item.hidden = item.dataset.galleryAlbum !== album;
  });

  activeGalleryAlbumTrigger = trigger;
  galleryAlbumTitle.textContent = trigger.dataset.galleryAlbumTitle || "Galerie";
  galleryAlbumModal.hidden = false;
  document.body.classList.add("gallery-album-open");
  galleryAlbumClose.focus({ preventScroll: true });
};

if (galleryAlbumModal && galleryAlbumTitle && galleryAlbumClose && galleryAlbumTriggers.length) {
  galleryAlbumTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openGalleryAlbum(trigger));
  });

  galleryAlbumClose.addEventListener("click", closeGalleryAlbum);

  galleryAlbumModal.addEventListener("click", (event) => {
    if (event.target !== galleryAlbumModal) return;
    closeGalleryAlbum();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || galleryAlbumModal.hidden) return;
    if (credentialModal && !credentialModal.hidden) return;
    closeGalleryAlbum();
  });
}

const testimonialCarousel = document.querySelector("[data-testimonial-carousel]");

if (testimonialCarousel) {
  const track = testimonialCarousel.querySelector("[data-testimonial-track]");
  const viewport = testimonialCarousel.querySelector("[data-testimonial-viewport]");
  const prevButton = testimonialCarousel.querySelector("[data-testimonial-prev]");
  const nextButton = testimonialCarousel.querySelector("[data-testimonial-next]");
  const cards = Array.from(testimonialCarousel.querySelectorAll("[data-testimonial-card]"));
  let activeTestimonialIndex = 0;
  let pointerStartX = 0;
  let pointerEndX = 0;

  const getVisibleCards = () => {
    if (window.matchMedia("(max-width: 720px)").matches) return 1;
    if (window.matchMedia("(max-width: 980px)").matches) return 2;
    return 3;
  };

  const getMaxTestimonialIndex = () => Math.max(0, cards.length - getVisibleCards());

  const getTestimonialStep = () => {
    if (cards.length < 2) return 0;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  };

  const updateTestimonialCarousel = () => {
    if (!track || !prevButton || !nextButton) return;

    const maxIndex = getMaxTestimonialIndex();
    activeTestimonialIndex = Math.min(Math.max(activeTestimonialIndex, 0), maxIndex);
    track.classList.toggle("is-single", cards.length === 1);
    track.classList.toggle("is-centered", cards.length <= getVisibleCards());
    track.style.transform = `translateX(-${activeTestimonialIndex * getTestimonialStep()}px)`;
    prevButton.disabled = activeTestimonialIndex === 0;
    nextButton.disabled = activeTestimonialIndex === maxIndex;
  };

  const setTestimonialIndex = (index) => {
    activeTestimonialIndex = index;
    updateTestimonialCarousel();
  };

  cards.forEach((card) => {
    const toggleCard = () => {
      const isFlipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(isFlipped));
    };

    card.addEventListener("click", toggleCard);

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleCard();
    });
  });

  prevButton?.addEventListener("click", () => setTestimonialIndex(activeTestimonialIndex - 1));
  nextButton?.addEventListener("click", () => setTestimonialIndex(activeTestimonialIndex + 1));

  viewport?.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
    pointerEndX = event.clientX;
  });

  viewport?.addEventListener("pointermove", (event) => {
    pointerEndX = event.clientX;
  });

  viewport?.addEventListener("pointerup", () => {
    const delta = pointerEndX - pointerStartX;
    if (Math.abs(delta) < 48) return;
    setTestimonialIndex(activeTestimonialIndex + (delta < 0 ? 1 : -1));
  });

  window.addEventListener("resize", updateTestimonialCarousel);
  updateTestimonialCarousel();
}

const animatedItems = document.querySelectorAll(
  ".service-preview article, .feature-grid article, .timeline article, .pricing-card, .steps article, .method-media, .credential-list article, .credential-photo, .credential-docs article, .gallery-grid article, .testimonial-card, .contact-action"
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
