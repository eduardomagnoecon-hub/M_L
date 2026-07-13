const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const slides = document.querySelectorAll(".slide");
const photoPhrase = document.getElementById("photoPhrase");
const amountInput = document.getElementById("amountInput");
const amountRange = document.getElementById("amountRange");
const termSelect = document.getElementById("termSelect");
const precalificaHero = document.getElementById("precalificaHero");
const leadForm = document.getElementById("leadForm");
const jobForm = document.getElementById("jobForm");
const formMessage = document.getElementById("formMessage");
const jobMessage = document.getElementById("jobMessage");

let currentSlide = 0;

const phrases = [
  `Tu historial crediticio<br>no define todas tus<br><em>oportunidades.</em>`,
  `Cuando tu negocio está listo<br>para crecer, el capital<br><em>no puede esperar.</em>`,
  `Invierte hoy en la oportunidad<br>que cambiará<br><em>mañana.</em>`
];

function isMobileMenu() {
  return window.innerWidth <= 1150;
}

/* MENÚ MÓVIL LIMPIO */
function openMobileMenu() {
  if (!navLinks || !menuBtn) return;
  navLinks.classList.add("active");
  document.body.classList.add("mobile-menu-open");
  menuBtn.setAttribute("aria-expanded", "true");
  menuBtn.textContent = "×";
}

function closeMobileMenu() {
  if (!navLinks || !menuBtn) return;
  navLinks.classList.remove("active");
  document.body.classList.remove("mobile-menu-open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.textContent = "☰";
  document.querySelectorAll(".has-mega.open").forEach((item) => item.classList.remove("open"));
}

function toggleMobileMenu() {
  if (!navLinks) return;
  if (navLinks.classList.contains("active")) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMobileMenu();
  });
}

/* SUBMENÚS MÓVILES: SOLO HACIA ABAJO */
document.querySelectorAll(".has-mega > .nav-trigger").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    if (!isMobileMenu()) return;

    event.preventDefault();
    event.stopPropagation();

    const item = trigger.closest(".has-mega");
    if (!item) return;

    const shouldOpen = !item.classList.contains("open");

    document.querySelectorAll(".has-mega.open").forEach((openItem) => {
      if (openItem !== item) openItem.classList.remove("open");
    });

    item.classList.toggle("open", shouldOpen);

    if (navLinks) {
      navLinks.classList.add("active");
      navLinks.scrollLeft = 0;
    }
  });
});

/* Cerrar menú al tocar enlaces finales */
document.querySelectorAll("#navLinks a").forEach((link) => {
  link.addEventListener("click", () => {
    if (isMobileMenu()) {
      closeMobileMenu();
    }
  });
});

/* Cerrar con Escape */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});

/* Al pasar a escritorio, limpiar estado móvil */
window.addEventListener("resize", () => {
  if (!isMobileMenu()) {
    if (navLinks) navLinks.classList.remove("active");
    document.body.classList.remove("mobile-menu-open");
    if (menuBtn) {
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
    }
    document.querySelectorAll(".has-mega.open").forEach((item) => item.classList.remove("open"));
  }
});

/* CARRUSEL HERO */
function changeSlide() {
  if (!slides.length) return;
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
  if (photoPhrase) photoPhrase.innerHTML = phrases[currentSlide];
}
if (slides.length > 0) setInterval(changeSlide, 6000);

/* MONTO */
function parseAmount(value) {
  return Number(String(value).replace(/\D/g, ""));
}

function formatPlainAmount(value) {
  return new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(value)).replace(/,/g, " ");
}

function formatAmount(value) {
  return `S/ ${formatPlainAmount(value)}`;
}

function syncAmount(source) {
  if (!amountInput || !amountRange) return;

  let amount = source === amountRange
    ? Number(amountRange.value)
    : parseAmount(amountInput.value);

  const min = Number(amountInput.dataset.min || amountRange.min || 20000);
  const max = Number(amountInput.dataset.max || amountRange.max || 500000);

  if (!amount || amount < min) amount = min;
  if (amount > max) amount = max;

  amountInput.value = formatPlainAmount(amount);
  amountRange.value = amount;
}

if (amountInput && amountRange) {
  amountRange.addEventListener("input", () => syncAmount(amountRange));

  amountInput.addEventListener("input", () => {
    const cleanAmount = parseAmount(amountInput.value);
    amountInput.value = cleanAmount ? formatPlainAmount(cleanAmount) : "";
  });

  amountInput.addEventListener("blur", () => syncAmount(amountInput));
  syncAmount(amountRange);
}

if (precalificaHero) {
  precalificaHero.addEventListener("click", () => {
    const montoForm = document.getElementById("monto");
    const plazoForm = document.getElementById("plazo");
    if (montoForm && amountInput) montoForm.value = formatAmount(parseAmount(amountInput.value));
    if (plazoForm && termSelect) plazoForm.value = `${termSelect.value} meses`;
  });
}

document.querySelectorAll("[data-product]").forEach((link) => {
  link.addEventListener("click", () => {
    const producto = document.getElementById("producto");
    if (producto) producto.value = link.dataset.product;
  });
});

/* FORMULARIOS */
function showMessage(element, text, type) {
  if (!element) return;
  element.textContent = text;
  element.className = `form-message ${type}`;
}

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const producto = document.getElementById("producto").value;
    const monto = document.getElementById("monto").value.trim();
    const plazo = document.getElementById("plazo").value;
    const distrito = document.getElementById("distrito").value.trim();
    const acepta = document.getElementById("acepta").checked;
    const telefonoValido = /^[0-9]{9}$/.test(telefono);

    if (!nombre || !telefono || !producto || !monto || !plazo || !distrito || !acepta) {
      showMessage(formMessage, "Completa todos los campos antes de enviar.", "error");
      return;
    }

    if (!telefonoValido) {
      showMessage(formMessage, "El teléfono debe tener 9 dígitos. Ejemplo: 987654321.", "error");
      return;
    }

    showMessage(formMessage, "Solicitud registrada correctamente. Un asesor de CrediReal se comunicará contigo.", "success");
    leadForm.reset();
  });
}

if (jobForm) {
  jobForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showMessage(jobMessage, "Postulación recibida. El equipo de CrediReal revisará tus datos.", "success");
    jobForm.reset();
  });
}
