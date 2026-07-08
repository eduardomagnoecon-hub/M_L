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

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("active"));
}

document.querySelectorAll(".nav-drop-btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (window.innerWidth <= 1150) {
      const item = button.closest(".has-dropdown");
      item.classList.toggle("open");
    }
  });
});

function changeSlide() {
  if (!slides.length) return;
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
  if (photoPhrase) photoPhrase.innerHTML = phrases[currentSlide];
}
if (slides.length > 0) setInterval(changeSlide, 6000);

function formatAmount(value) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 0 }).format(value);
}

function syncAmount(source) {
  if (!amountInput || !amountRange) return;
  let amount = Number(source.value);
  const min = Number(amountInput.min);
  const max = Number(amountInput.max);
  if (amount < min) amount = min;
  if (amount > max) amount = max;
  amountInput.value = amount;
  amountRange.value = amount;
}

if (amountInput && amountRange) {
  amountRange.addEventListener("input", () => syncAmount(amountRange));
  amountInput.addEventListener("input", () => syncAmount(amountInput));
}

if (precalificaHero) {
  precalificaHero.addEventListener("click", () => {
    const montoForm = document.getElementById("monto");
    const plazoForm = document.getElementById("plazo");
    if (montoForm && amountInput) montoForm.value = formatAmount(Number(amountInput.value));
    if (plazoForm && termSelect) plazoForm.value = `${termSelect.value} meses`;
  });
}

document.querySelectorAll("[data-product]").forEach((link) => {
  link.addEventListener("click", () => {
    const producto = document.getElementById("producto");
    if (producto) producto.value = link.dataset.product;
  });
});

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


// Megamenú móvil Fase 2 corregido
const megaItems = document.querySelectorAll(".has-mega");
megaItems.forEach((item) => {
  const trigger = item.querySelector(".nav-trigger");
  if (trigger) {
    trigger.addEventListener("click", () => {
      if (window.innerWidth <= 1150) {
        item.classList.toggle("open");
      }
    });
  }
});
