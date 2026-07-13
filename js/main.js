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



// Ajuste móvil: cerrar el menú al tocar un enlace final
document.querySelectorAll("#navLinks a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 1150 && navLinks) {
      navLinks.classList.remove("active");
      document.querySelectorAll(".has-mega.open").forEach((item) => item.classList.remove("open"));
    }
  });
});

// Ajuste móvil: cerrar menú con tecla Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks) {
    navLinks.classList.remove("active");
    document.querySelectorAll(".has-mega.open").forEach((item) => item.classList.remove("open"));
  }
});



// Ajuste móvil final: solo un megamenú abierto a la vez
document.querySelectorAll(".has-mega .nav-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (window.innerWidth <= 1150) {
      const currentItem = trigger.closest(".has-mega");
      document.querySelectorAll(".has-mega.open").forEach((item) => {
        if (item !== currentItem) item.classList.remove("open");
      });
    }
  });
});


// Ajuste móvil final: al abrir un submenú, mantenerlo dentro del panel vertical
document.querySelectorAll(".has-mega .nav-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (window.innerWidth <= 1150) {
      setTimeout(() => {
        const currentItem = trigger.closest(".has-mega");
        if (currentItem && currentItem.classList.contains("open")) {
          currentItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 80);
    }
  });
});



// Ajuste final 16: evitar desplazamiento lateral al abrir submenús móviles
document.querySelectorAll(".has-mega .nav-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (window.innerWidth <= 1150) {
      setTimeout(() => {
        window.scrollTo({ left: 0, top: window.scrollY, behavior: "instant" });
        if (navLinks) navLinks.scrollLeft = 0;
      }, 40);
    }
  });
});



// AJUSTE FINAL 17: despliegue móvil confiable de submenús
document.addEventListener("click", (event) => {
  const trigger = event.target.closest(".has-mega > .nav-trigger");
  if (!trigger || window.innerWidth > 1150) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const currentItem = trigger.closest(".has-mega");
  if (!currentItem) return;

  const willOpen = !currentItem.classList.contains("open");

  document.querySelectorAll(".has-mega.open").forEach((item) => {
    if (item !== currentItem) item.classList.remove("open");
  });

  currentItem.classList.toggle("open", willOpen);

  if (navLinks) {
    navLinks.classList.add("active");
    navLinks.scrollLeft = 0;
  }

  setTimeout(() => {
    window.scrollTo(window.scrollX, window.scrollY);
  }, 20);
}, true);
