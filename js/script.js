/* =================================================================
   MAISON BRAISE — Custom Script
   Latest additions: page loader, testimonials carousel, custom
   cursor and 3D menu-card tilt (all skipped or toned down for touch
   devices and prefers-reduced-motion). Earlier steps: menu, gallery
   + lightbox, about counters, contact form, footer, scroll effects.
   The floating WhatsApp button works through the shared
   data-wa-message delegation below.
   ================================================================= */

/* ---------- Restaurant contact config ---------- */
/* Replace with your real WhatsApp number in international format,
   digits only, no "+", spaces or leading zeros. */
const WHATSAPP_NUMBER = "212600000000";

/* Language of the message the reservation FORM sends to WhatsApp.
   "fr" = always French (the restaurant's working language — the original
   behaviour of this site). Set to null to write the message in whichever
   language the visitor is currently browsing in (EN / FR / AR). */
const RESERVATION_MESSAGE_LANG = "fr";

/* Shorthand for the translation helper from js/i18n.js (loaded first). */
const t = (key, vars, lang) => I18N.t(key, vars, lang);

/**
 * Opens WhatsApp (app on mobile, WhatsApp Web on desktop) in a new tab
 * with a pre-filled message, using WHATSAPP_NUMBER as the recipient.
 * Reused by every reservation / order button across the site —
 * just give an element a "data-wa-message" attribute and it works
 * automatically (see the delegated click listener below).
 *
 * @param {string} message - The pre-filled text to send.
 */
function openWhatsApp(message) {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* =================================================================
   MENU DATA
   Single source of truth for every dish. Add, remove or edit
   items here — the grid and filters update automatically.
   category must be one of: "starters", "mains", "desserts", "drinks"
   ================================================================= */
const MENU_ITEMS = [
  {
    id: 1,
    name: "Grilled Halloumi Skewers",
    description: "Charred halloumi, honey-lemon glaze, toasted pistachio.",
    price: 55,
    category: "starters",
    // Grilled halloumi with figs — Unsplash photo by sheri silver
    image: "https://images.unsplash.com/photo-1757522745249-d9a075cf38de?w=600&h=450&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Charred Octopus",
    description: "Smoked paprika, crushed potatoes, salsa verde.",
    price: 95,
    category: "starters",
    // Grilled octopus dish — Unsplash photo by Elle Hughes
    image: "https://images.unsplash.com/photo-1531890820402-2a683fbfd30c?w=600&h=450&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Braised Lamb Shoulder",
    description: "Slow-cooked twelve hours, root vegetables, red wine jus.",
    price: 150,
    category: "mains",
    // Grilled meat and vegetables on the table — Unsplash photo by Victoria Shes
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=450&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Wood-Fired Sea Bream",
    description: "Whole roasted, preserved lemon, herb butter.",
    price: 135,
    category: "mains",
    // Whole fish being grilled — Unsplash photo by Clint Bustrillos
    image: "https://images.unsplash.com/photo-1556814901-18c866c057da?w=600&h=450&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Braise Burger",
    description: "Dry-aged beef, smoked cheddar, caramelized onion.",
    price: 90,
    category: "mains",
    // Burger patty being cooked — Unsplash photo by Joshua Kantarges
    image: "https://images.unsplash.com/photo-1554306297-0c86e837d24b?w=600&h=450&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Roasted Pumpkin Risotto",
    description: "Toasted seeds, sage brown butter, parmesan.",
    price: 80,
    category: "mains",
    // Risotto on a white ceramic plate — Unsplash photo by Julien Pianetti
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=450&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Dark Chocolate Fondant",
    description: "Molten center, salted caramel, vanilla bean ice cream.",
    price: 48,
    category: "desserts",
    // Oozing caramel/chocolate cake — Unsplash photo by Jennifer Schmidt
    image: "https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?w=600&h=450&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Orange Blossom Crème Brûlée",
    description: "Torched sugar crust, citrus zest.",
    price: 42,
    category: "desserts",
    // Crème brûlée with mint garnish — Unsplash photo by Tommaso Ubezio
    image: "https://images.unsplash.com/photo-1779094543236-6c64b71ae14e?w=600&h=450&fit=crop&q=80",
  },
  {
    id: 9,
    name: "Mint Lemonade",
    description: "Fresh mint, lemon, sparkling water.",
    price: 28,
    category: "drinks",
    // Lemon juice with mint herb — Unsplash photo by Pixzolo Photography
    image: "https://images.unsplash.com/photo-1555949366-819808d99159?w=600&h=450&fit=crop&q=80",
  },
  {
    id: 10,
    name: "Spiced Moroccan Coffee",
    description: "Cardamom, cinnamon, dark roast.",
    price: 22,
    category: "drinks",
    // White ceramic cup with coffee — Unsplash photo by Ayaneshu Bhardwaj
    image: "https://images.unsplash.com/photo-1611312410928-bdcb480e6239?w=600&h=450&fit=crop&q=80",
  },
];

/* ---------- Reusable scroll-into-view helper ----------
   Generic replacement for the old scrollObserver/observeFadeInElements
   pair from earlier steps. Pass either a CSS selector (string) or an
   existing NodeList/array of elements (useful right after injecting
   dynamic content, so only the new elements are queried) plus a
   callback to run once when each element enters the viewport.
   Each element is unobserved right after its callback runs, so the
   effect (fade-in, count-up, ...) only ever fires once per element.
   @param {string|NodeList|Element[]} elements - Selector or elements to watch.
   @param {(el: Element) => void} callback - Runs once per element on enter.
   @param {IntersectionObserverInit} [options] - Observer options (default 15% visible).
*/
function observeElements(elements, callback, options = { threshold: 0.15 }) {
  const targets =
    typeof elements === "string" ? document.querySelectorAll(elements) : elements;

  if (!targets || !targets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, options);

  targets.forEach((el) => observer.observe(el));
}

/** Adds the CSS class that triggers a fade-in transition. Handy default callback for observeElements(). */
function revealElement(el) {
  el.classList.add("is-visible");
}

/**
 * Builds the HTML for a single dish card.
 * @param {object} item - One entry from MENU_ITEMS.
 * @returns {string} HTML markup for the card's grid column.
 */
function buildMenuCard(item) {
  // Name and description come from the translations (keys "dish.<id>.name" / ".desc");
  // the English values stored in MENU_ITEMS are only kept as a reference.
  const name = t(`dish.${item.id}.name`);
  const description = t(`dish.${item.id}.desc`);
  const currency = t("currency");

  // Pre-filled order message, e.g. "Hello, I would like to order: Braise Burger (90 MAD)"
  const orderMessage = t("wa.order", { name, price: item.price, cur: currency });

  return `
    <div class="col">
      <div class="menu-card fade-in-scroll">
        <div class="menu-card-img">
          <img src="${item.image}" alt="${name}" loading="lazy">
        </div>
        <div class="menu-card-body">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <h3 class="menu-card-title">${name}</h3>
            <span class="menu-card-price">${item.price} ${currency}</span>
          </div>
          <p class="menu-card-desc">${description}</p>
          <button type="button" class="btn-order" data-wa-message="${orderMessage}">
            <i class="bi bi-whatsapp"></i>
            <span>${t("menu.order")}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the dish grid for a given category, then (re)attaches
 * the scroll-in-view observer to the freshly created cards.
 * @param {string} category - "all", "starters", "mains", "desserts" or "drinks".
 */
let currentMenuCategory = "all";

function renderMenu(category = "all") {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  currentMenuCategory = category; // remembered so a language change can re-render the same filter

  const items =
    category === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === category);

  grid.innerHTML = items.map(buildMenuCard).join("");

  // Each render replaces the DOM nodes, so re-observe the new cards
  observeElements(grid.querySelectorAll(".fade-in-scroll"), revealElement);
}

/**
 * Wires up the category filter buttons: toggles the active state
 * and re-renders the grid with the selected category, no page reload.
 */
function initMenuFilters() {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      renderMenu(button.dataset.filter);
    });
  });
}

/* =================================================================
   GALLERY DATA
   Single source of truth for every gallery photo. Add, remove or
   reorder items here — the grid and lightbox update automatically.
   ================================================================= */
const GALLERY_ITEMS = [
  {
    // Cozy restaurant interior with string lights — Unsplash photo by Raymond Yeung
    src: "https://images.unsplash.com/photo-1744561249162-c597c1670032?w=600&h=600&fit=crop&q=80",
    alt: "Cozy dining room with warm lighting",
    caption: "Our cozy interior",
  },
  {
    // Chopping fresh cucumbers on a wooden board — Unsplash photo by Stanley Kustamin
    src: "https://images.unsplash.com/photo-1759147877000-1ff5530da05b?w=600&h=600&fit=crop&q=80",
    alt: "Fresh vegetables being prepared on a wooden board",
    caption: "Fresh ingredients",
  },
  {
    // Chef presenting a beautifully plated dish — Unsplash photo by Tommaso Ubezio
    src: "https://images.unsplash.com/photo-1750943082452-c714763f73b2?w=600&h=600&fit=crop&q=80",
    alt: "Chef plating a dish in the kitchen",
    caption: "Behind the pass",
  },
  {
    // Barbecue grilling over open flame — Unsplash photo by Evan Wise
    src: "https://images.unsplash.com/photo-1534797258760-1bd2cc95a5bd?w=600&h=600&fit=crop&q=80",
    alt: "Meat grilling over an open flame",
    caption: "Cooked over fire",
  },
  {
    // Outdoor patio with glowing heater and lanterns at dusk — Unsplash photo by Karwin Luo
    src: "https://images.unsplash.com/photo-1764099362403-16ee561b079a?w=600&h=600&fit=crop&q=80",
    alt: "Outdoor terrace seating at dusk",
    caption: "Evenings on the terrace",
  },
  {
    // Cake with chocolate drizzle — Unsplash photo by Adam Bartoszewicz
    src: "https://images.unsplash.com/photo-1652561781059-58d5d9ffcb4d?w=600&h=600&fit=crop&q=80",
    alt: "Close-up of a finished dessert",
    caption: "Sweet endings",
  },
];

/**
 * Builds the HTML for a single gallery tile.
 * data-index links the tile back to its position in GALLERY_ITEMS
 * so the lightbox knows which image to open.
 * @param {object} item - One entry from GALLERY_ITEMS.
 * @param {number} index - The item's position in the array.
 * @returns {string} HTML markup for the tile's grid column.
 */
function buildGalleryItem(item, index) {
  // Caption and alt text are translated: keys "gallery.<n>.caption" / ".alt"
  const caption = t(`gallery.${index + 1}.caption`);
  const alt = t(`gallery.${index + 1}.alt`);

  return `
    <div class="col">
      <div class="gallery-item fade-in-scroll" data-index="${index}" role="button" tabindex="0" aria-label="${t("gallery.open", { caption })}">
        <img src="${item.src}" alt="${alt}" loading="lazy">
        <div class="gallery-overlay">
          <i class="bi bi-zoom-in gallery-zoom-icon"></i>
          <span class="gallery-caption">${caption}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders every gallery tile into #galleryGrid and hooks the new
 * tiles up to the shared fade-in-on-scroll observer.
 */
function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  grid.innerHTML = GALLERY_ITEMS.map(buildGalleryItem).join("");
  observeElements(grid.querySelectorAll(".fade-in-scroll"), revealElement);
}

/* =================================================================
   LIGHTBOX
   A single Bootstrap modal instance is reused for every image;
   only its image/caption and the tracked index change.
   ================================================================= */
let currentLightboxIndex = 0;
let lightboxModalInstance = null;

/**
 * Updates the modal's image and caption to match currentLightboxIndex.
 */
function updateLightboxContent() {
  const item = GALLERY_ITEMS[currentLightboxIndex];
  const imageEl = document.getElementById("lightboxImage");
  const captionEl = document.getElementById("lightboxCaption");

  imageEl.src = item.src;
  imageEl.alt = t(`gallery.${currentLightboxIndex + 1}.alt`);
  captionEl.textContent = t(`gallery.${currentLightboxIndex + 1}.caption`);
}

/**
 * Opens the lightbox at a given gallery index.
 * @param {number} index - Index into GALLERY_ITEMS to display first.
 */
function openLightbox(index) {
  currentLightboxIndex = index;
  updateLightboxContent();

  const lightboxEl = document.getElementById("lightboxModal");
  lightboxModalInstance = bootstrap.Modal.getOrCreateInstance(lightboxEl);
  lightboxModalInstance.show();
}

/** Advances the lightbox to the next image, wrapping around at the end. */
function showNextLightboxImage() {
  currentLightboxIndex = (currentLightboxIndex + 1) % GALLERY_ITEMS.length;
  updateLightboxContent();
}

/** Moves the lightbox to the previous image, wrapping around at the start. */
function showPrevLightboxImage() {
  currentLightboxIndex =
    (currentLightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  updateLightboxContent();
}

/**
 * Wires up everything the lightbox needs: opening from a gallery
 * click, the prev/next arrow buttons, and keyboard navigation.
 * Escape-to-close and backdrop-click-to-close are already handled
 * natively by Bootstrap's modal (keyboard: true by default).
 */
function initLightbox() {
  const lightboxEl = document.getElementById("lightboxModal");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  if (!lightboxEl || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener("click", showPrevLightboxImage);
  nextBtn.addEventListener("click", showNextLightboxImage);

  // Open the lightbox when a gallery tile is clicked or activated via keyboard
  document.body.addEventListener("click", (event) => {
    const tile = event.target.closest(".gallery-item");
    if (tile) {
      openLightbox(Number(tile.dataset.index));
    }
  });

  document.body.addEventListener("keydown", (event) => {
    const tile = event.target.closest(".gallery-item");
    if (tile && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openLightbox(Number(tile.dataset.index));
    }
  });

  // Left / right arrow navigation while the lightbox is open
  document.addEventListener("keydown", (event) => {
    if (!lightboxEl.classList.contains("show")) return;

    // In right-to-left languages "next" lies to the left, so the arrows swap.
    const nextKey = I18N.isRTL ? "ArrowLeft" : "ArrowRight";
    const prevKey = I18N.isRTL ? "ArrowRight" : "ArrowLeft";

    if (event.key === nextKey) {
      showNextLightboxImage();
    } else if (event.key === prevKey) {
      showPrevLightboxImage();
    }
    // Escape is handled automatically by Bootstrap's modal
  });
}

/* =================================================================
   ABOUT SECTION — stat counters
   ================================================================= */

/**
 * Animates a stat number counting up from 0 to its target value.
 * Reads config straight from the element's data attributes, so no
 * per-stat JavaScript is needed — just add data-count-to (required),
 * data-decimals (optional, default 0) and data-suffix (optional,
 * e.g. "+" or "K+") to any <span class="stat-number"> in the HTML.
 * @param {HTMLElement} el - The element to animate.
 */
function animateCountUp(el) {
  const target = parseFloat(el.dataset.countTo);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1500; // ms
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    // Ease-out cubic: fast start, gentle settle — feels less mechanical than linear.
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    el.textContent = current.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toFixed(decimals) + suffix; // lock the exact final value
    }
  }

  requestAnimationFrame(tick);
}

/**
 * Sets up all of the About section's scroll-triggered effects:
 * the image/text columns sliding in, the stat counters, and the quote.
 */
function initAboutSection() {
  // Image column slides in from the left, text column from the right.
  observeElements(".fade-in-left, .fade-in-right", revealElement);

  // Stat rows, team cards and the closing quote all start hidden
  // (.fade-in-scroll) and fade in as they scroll into view.
  observeElements("#about .fade-in-scroll", revealElement);

  // Stat numbers count up once their row scrolls into view.
  observeElements(".stat-number", animateCountUp, { threshold: 0.4 });
}

/* =================================================================
   LOCAL STORAGE HELPERS
   localStorage can throw (private browsing, blocked storage), so all
   access goes through these two guarded wrappers.
   ================================================================= */
function getStoredValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    /* Storage unavailable — the choice just won't persist. */
  }
}

/* =================================================================
   DARK MODE
   Sets data-theme="dark" | "light" on <html> (the CSS overrides key
   off it) and mirrors it to Bootstrap 5.3's data-bs-theme so native
   Bootstrap pieces such as the <select> arrow follow along.
   ================================================================= */
const THEME_STORAGE_KEY = "theme";

/** Saved choice if there is one, otherwise the visitor's OS preference. */
function getInitialTheme() {
  const stored = getStoredValue(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Applies a theme to the page and syncs the toggle button's state. */
function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-bs-theme", theme);

  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    const isDark = theme === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? t("theme.toLight") : t("theme.toDark"));
  }
}

function initThemeToggle() {
  applyTheme(getInitialTheme());

  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const root = document.documentElement;
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    // 200ms cross-fade, only around a click (never on first load)
    // and never for visitors who prefer reduced motion.
    if (!prefersReducedMotion) {
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 250);
    }

    applyTheme(nextTheme);
    setStoredValue(THEME_STORAGE_KEY, nextTheme);
  });
}

/* =================================================================
   PROMO BANNER
   Visible by default; hidden on load if it was dismissed earlier.
   ================================================================= */
const BANNER_STORAGE_KEY = "banner-dismissed";

/** Hides the banner and releases the layout space CSS reserved for it. */
function hidePromoBanner() {
  const banner = document.getElementById("promoBanner");
  if (banner) banner.hidden = true;

  document.documentElement.classList.remove("has-promo-banner");
}

function initPromoBanner() {
  const banner = document.getElementById("promoBanner");
  if (!banner) return;

  if (getStoredValue(BANNER_STORAGE_KEY) === "true") {
    hidePromoBanner();
    return;
  }

  const closeBtn = document.getElementById("promoBannerClose");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      hidePromoBanner();
      setStoredValue(BANNER_STORAGE_KEY, "true");
    });
  }
}

/* =================================================================
   CONTACT SECTION — reservation form (Flatpickr)
   ================================================================= */

/* Weekdays with no online reservations (0 = Sunday ... 6 = Saturday).
   Edit here if the closed day changes. */
const RESERVATION_CLOSED_DAYS = [0];

/* Earliest and latest table time offered by the time picker. */
const RESERVATION_TIME_RANGE = { min: "12:00", max: "22:00" };

let reservationDatePicker = null;
let reservationTimePicker = null;

/** Clears the red/green validation state from a field. */
function clearFieldState(input) {
  input.classList.remove("is-invalid", "is-valid");
}

/**
 * Marks a field valid or invalid, optionally swapping its feedback text.
 * Needed for the Flatpickr inputs: they are read-only, so the browser
 * skips them during built-in validation and Bootstrap's :invalid styling
 * never triggers on its own.
 */
function setFieldState(input, isValid, message) {
  input.classList.toggle("is-invalid", !isValid);
  input.classList.toggle("is-valid", isValid);

  if (!isValid && message) {
    const feedback = document.getElementById(`${input.id}Feedback`);
    if (feedback) feedback.textContent = message;
  }
}

/** Today's date as YYYY-MM-DD in local time (used by the native fallback). */
function getTodayIsoDate() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/**
 * Turns the date and time inputs into Flatpickr pickers. If the Flatpickr
 * CDN failed to load, falls back to the browser's native date/time inputs
 * so the form still works.
 */
function initReservationPickers(dateInput, timeInput) {
  if (typeof flatpickr !== "function") {
    dateInput.type = "date";
    dateInput.min = getTodayIsoDate();
    timeInput.type = "time";
    timeInput.min = RESERVATION_TIME_RANGE.min;
    timeInput.max = RESERVATION_TIME_RANGE.max;
    timeInput.step = 1800;
    dateInput.addEventListener("input", () => clearFieldState(dateInput));
    timeInput.addEventListener("input", () => clearFieldState(timeInput));
    return;
  }

  reservationDatePicker = flatpickr(dateInput, {
    minDate: "today",
    dateFormat: "D j M Y",
    disable: [(date) => RESERVATION_CLOSED_DAYS.includes(date.getDay())],
    locale: getFlatpickrLocale(), // weekday/month names in the current language, weeks start on Monday
    disableMobile: true, // keep the same calendar (and disabled Sundays) on phones
    onChange: () => clearFieldState(dateInput),
  });

  reservationTimePicker = flatpickr(timeInput, {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minuteIncrement: 30,
    minTime: RESERVATION_TIME_RANGE.min,
    maxTime: RESERVATION_TIME_RANGE.max,
    locale: getFlatpickrLocale(),
    disableMobile: true,
    onChange: () => clearFieldState(timeInput),
  });
}

/**
 * Flatpickr locale for the current site language. The French and Arabic
 * packs are loaded from the CDN in index.html; English is Flatpickr's
 * built-in default. Weeks always start on Monday.
 */
function getFlatpickrLocale() {
  const pack = (window.flatpickr && flatpickr.l10ns && (flatpickr.l10ns[I18N.lang] || flatpickr.l10ns.default)) || {};
  return { ...pack, firstDayOfWeek: 1 };
}

/** Re-applies the calendar language after the visitor switches language. */
function updateReservationPickersLocale() {
  const locale = getFlatpickrLocale();
  if (reservationDatePicker) reservationDatePicker.set("locale", locale);
  if (reservationTimePicker) reservationTimePicker.set("locale", locale);
}

/** The chosen reservation date as a Date (local midnight), or null. */
function getReservationDate(dateInput) {
  if (reservationDatePicker && reservationDatePicker.selectedDates.length) {
    return reservationDatePicker.selectedDates[0];
  }

  // Native fallback: value looks like "2026-10-03"
  if (dateInput.type === "date" && dateInput.value) {
    const [year, month, day] = dateInput.value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return null;
}

/** True if the chosen date + "HH:MM" time has already passed. */
function isPastDateTime(date, time) {
  const [hours, minutes] = time.split(":").map(Number);
  const when = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
  return when.getTime() < Date.now();
}

/**
 * Builds the pre-filled WhatsApp message (in French, as requested).
 * @param {{name: string, phone: string, guests: string, date: Date, time: string}} details
 * @returns {string} A clean, multi-line reservation request.
 */
function buildReservationMessage({ name, phone, guests, date, time }) {
  // Written in RESERVATION_MESSAGE_LANG (French by default), or in the
  // visitor's current language when that constant is null.
  const lang = RESERVATION_MESSAGE_LANG || I18N.lang;
  const tr = (key) => t(key, undefined, lang);

  const dateLocales = { en: "en-GB", fr: "fr-FR", ar: "ar-MA" };
  const dateText = date.toLocaleDateString(dateLocales[lang] || "fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeText = lang === "fr" ? time.replace(":", "h") : time; // "19:30" -> "19h30" in French
  const guestsText = guests === "6+" ? tr("res.six") : guests;

  return [
    tr("res.hello"),
    tr("res.intro"),
    "",
    `${tr("res.name")} ${name}`,
    `${tr("res.phone")} ${phone}`,
    `${tr("res.date")} ${dateText}`,
    `${tr("res.time")} ${timeText}`,
    `${tr("res.guests")} ${guestsText}`,
    "",
    tr("res.thanks"),
  ].join("\n");
}

/**
 * Wires up the reservation form: Flatpickr pickers, validation, and —
 * once everything checks out — sending the request to WhatsApp through
 * the shared openWhatsApp() function.
 */
function initContactForm() {
  const form = document.getElementById("reservationForm");
  if (!form) return;

  const nameInput = document.getElementById("guestName");
  const phoneInput = document.getElementById("guestPhone");
  const dateInput = document.getElementById("reservationDate");
  const timeInput = document.getElementById("reservationTime");
  const guestsInput = document.getElementById("guestCount");

  initReservationPickers(dateInput, timeInput);

  // A custom "invalid phone" flag is set on submit; clear it as soon as they edit.
  phoneInput.addEventListener("input", () => phoneInput.setCustomValidity(""));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Phone: accept spaces, dashes, "+" etc., but require at least 8 digits.
    const digitCount = phoneInput.value.replace(/\D/g, "").length;
    phoneInput.setCustomValidity(digitCount >= 8 ? "" : "Invalid phone number");

    const date = getReservationDate(dateInput);
    const time = timeInput.value.trim();

    let dateError = "";
    if (!date) {
      dateError = t("form.err.date");
    } else if (RESERVATION_CLOSED_DAYS.includes(date.getDay())) {
      dateError = t("form.err.sunday");
    }

    let timeError = "";
    if (!time) {
      timeError = t("form.err.time");
    } else if (date && isPastDateTime(date, time)) {
      timeError = t("form.err.timePast");
    }

    setFieldState(dateInput, !dateError, dateError);
    setFieldState(timeInput, !timeError, timeError);

    const nativeFieldsValid = form.checkValidity(); // name, phone, guests
    form.classList.add("was-validated");

    if (!nativeFieldsValid || dateError || timeError) {
      const firstInvalid = form.querySelector(".is-invalid, :invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    openWhatsApp(
      buildReservationMessage({
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        guests: guestsInput.value,
        date,
        time,
      })
    );

    // Reset everything for a clean slate.
    form.reset();
    if (reservationDatePicker) reservationDatePicker.clear();
    if (reservationTimePicker) reservationTimePicker.clear();
    clearFieldState(dateInput);
    clearFieldState(timeInput);
    phoneInput.setCustomValidity("");
    form.classList.remove("was-validated");
  });
}

/**
 * Reveals the Contact section's info cards, form and map as they
 * scroll into view. Scoped to #contact so it doesn't re-observe
 * .fade-in-scroll elements that belong to the dynamic Menu/Gallery
 * grids (those are already handled by their own render functions).
 */
function initContactAnimations() {
  observeElements("#contact .fade-in-scroll", revealElement);
}

/* =================================================================
   FOOTER
   ================================================================= */

/** Sets the footer's copyright year to the current year automatically. */
function initFooterYear() {
  const yearEl = document.getElementById("footerYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Restaurant hours, expressed as 24-hour "open" / "close" numbers per
 * weekday (0 = Sunday ... 6 = Saturday), matching the Contact/Footer copy:
 * Mon–Thu 12:00–23:00, Fri–Sun 12:00–00:00 (midnight, i.e. hour 24).
 * Edit this if the real hours differ.
 */
const OPENING_HOURS = {
  0: { open: 12, close: 24 }, // Sunday
  1: { open: 12, close: 23 }, // Monday
  2: { open: 12, close: 23 }, // Tuesday
  3: { open: 12, close: 23 }, // Wednesday
  4: { open: 12, close: 23 }, // Thursday
  5: { open: 12, close: 24 }, // Friday
  6: { open: 12, close: 24 }, // Saturday
};

/**
 * Checks the current day/time against OPENING_HOURS.
 * @returns {boolean} True if the restaurant is currently open.
 */
function isRestaurantOpenNow() {
  const now = new Date();
  const todayHours = OPENING_HOURS[now.getDay()];
  const currentHour = now.getHours() + now.getMinutes() / 60;

  return currentHour >= todayHours.open && currentHour < todayHours.close;
}

/** Updates the footer's "Open Now" / "Closed Now" badge to match the current time. */
function updateOpeningStatusBadge() {
  const badgeEl = document.getElementById("openStatusBadge");
  const textEl = document.getElementById("openStatusText");
  if (!badgeEl || !textEl) return;

  const isOpen = isRestaurantOpenNow();
  badgeEl.classList.toggle("is-open", isOpen);
  badgeEl.classList.toggle("is-closed", !isOpen);
  textEl.textContent = isOpen ? t("footer.open") : t("footer.closed");
  textEl.removeAttribute("data-i18n"); // from now on this text is managed here, not by i18n.js
}

/**
 * Initializes the footer: sets the year, then the open/closed badge,
 * refreshing the badge every minute in case the page stays open
 * across an hour or day boundary.
 */
function initFooter() {
  initFooterYear();
  updateOpeningStatusBadge();
  setInterval(updateOpeningStatusBadge, 60000);
}

/* =================================================================
   SCROLL EFFECTS
   Navbar background-on-scroll and the back-to-top button's visibility
   share a single, requestAnimationFrame-throttled scroll listener so
   we're not running two separate scroll handlers on every frame.
   ================================================================= */
function initScrollEffects() {
  const navbar = document.getElementById("mainNavbar");
  const backToTopBtn = document.getElementById("backToTopBtn");

  const NAVBAR_SCROLL_THRESHOLD = 100;
  const BACK_TO_TOP_THRESHOLD = 300;
  let ticking = false;

  function updateOnScroll() {
    const scrollY = window.scrollY;

    if (navbar) {
      navbar.classList.toggle("navbar-scrolled", scrollY > NAVBAR_SCROLL_THRESHOLD);
    }
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("show", scrollY > BACK_TO_TOP_THRESHOLD);
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Run once immediately in case the page loads already scrolled
  // (e.g. a reload, or navigating back with browser history).
  updateOnScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* =================================================================
   ACTIVE NAV LINK HIGHLIGHTING
   Note: this needs its own IntersectionObserver rather than the
   observeElements() helper, because observeElements() is designed to
   fire once and unobserve (right for a one-time fade-in), while the
   active link must keep updating continuously in both directions as
   the user scrolls up and down through the page.
   ================================================================= */
function initActiveNavHighlighting() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  if (!sections.length || !navLinks.length) return;

  // Treat a section as "current" once it crosses the middle of the
  // viewport, rather than waiting for it to fully enter — this keeps
  // the highlight feeling responsive while scrolling past short sections.
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const activeId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));
}

/* =================================================================
   PROFESSIONAL POLISH
   ================================================================= */

/** True when the visitor has asked their OS to minimise motion. */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True for mouse/trackpad devices (false on phones and tablets). */
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Loading screen: fades out once the window "load" event fires.
 * A 4-second fallback guarantees a slow image (e.g. a hotlinked photo)
 * can never trap visitors behind the loader.
 */
function initPageLoader() {
  const loader = document.getElementById("pageLoader");
  if (!loader) return;

  const hideLoader = () => loader.classList.add("loaded");

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
    setTimeout(hideLoader, 4000);
  }
}

/**
 * Testimonials carousel: auto-slides every 5 seconds (pausing on hover).
 * Created from JS rather than data-bs-ride so autoplay can be switched
 * off for visitors who prefer reduced motion — they can still use the
 * arrows, dots and swipe gestures.
 */
function initTestimonialsCarousel() {
  const carouselEl = document.getElementById("testimonialsCarousel");
  if (!carouselEl) return;

  new bootstrap.Carousel(carouselEl, {
    interval: prefersReducedMotion ? false : 5000,
    ride: prefersReducedMotion ? false : "carousel",
    wrap: true,
    touch: true,
  });
}

/**
 * Custom cursor: a small gold dot that follows the mouse and grows into a
 * ring over links and buttons. Skipped entirely on touch devices and for
 * reduced-motion users, who keep the normal system cursor.
 */
function initCustomCursor() {
  const cursor = document.getElementById("customCursor");
  if (!cursor || !hasFinePointer || prefersReducedMotion) return;

  document.body.classList.add("has-custom-cursor");

  const interactiveSelector =
    "a, button, [role='button'], .gallery-item, .filter-btn, input, select, textarea, label";

  document.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.remove("is-hidden");
  });

  // Delegated, so it also covers dynamically rendered menu cards and gallery tiles.
  document.addEventListener("mouseover", (event) => {
    cursor.classList.toggle("grow", Boolean(event.target.closest(interactiveSelector)));
  });

  // Hide the dot when the pointer leaves the browser window.
  document.documentElement.addEventListener("mouseleave", () => {
    cursor.classList.add("is-hidden");
  });
}

/**
 * 3D tilt on menu cards: each card leans toward the pointer (max 6°).
 * Uses one delegated listener on #menuGrid, so it keeps working after
 * the category filters re-render the cards. Disabled on touch devices
 * and for reduced-motion users.
 */
function initMenuTilt() {
  const grid = document.getElementById("menuGrid");
  if (!grid || !hasFinePointer || prefersReducedMotion) return;

  const MAX_TILT_DEG = 6;

  grid.addEventListener("pointermove", (event) => {
    const card = event.target.closest(".menu-card");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    // Pointer position relative to the card's center, from -1 to 1
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    const rotateX = -offsetY * 2 * MAX_TILT_DEG;
    const rotateY = offsetX * 2 * MAX_TILT_DEG;

    card.classList.add("tilt-active");
    // Keeps the same lift + scale as the CSS :hover state from Step 3
    card.style.transform =
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.015)`;
  });

  // Clear the inline transform once the pointer leaves a card entirely.
  grid.addEventListener("pointerout", (event) => {
    const card = event.target.closest(".menu-card");
    if (!card || card.contains(event.relatedTarget)) return;

    card.style.transform = "";
    card.classList.remove("tilt-active");
  });
}

document.addEventListener("DOMContentLoaded", () => {

  // Theme first, so the page never paints in the wrong colours.
  initThemeToggle();

  // Promo banner (hidden right away if it was dismissed before).
  initPromoBanner();

  // Loading screen (fades out when the page has fully loaded).
  initPageLoader();

  // Render the full menu on load, then enable the category filters.
  renderMenu("all");
  initMenuFilters();

  // Render the gallery grid and enable the lightbox.
  renderGallery();
  initLightbox();

  // Enable the About section's entrance animations and stat counters.
  initAboutSection();

  // Enable the Contact section's reservation form and scroll-in animation.
  initContactForm();
  initContactAnimations();

  // Footer: copyright year + live open/closed badge.
  initFooter();

  // Navbar background-on-scroll and the back-to-top button.
  initScrollEffects();

  // Highlight the current section's nav link while scrolling.
  initActiveNavHighlighting();

  // Testimonials carousel, custom cursor and 3D menu-card tilt.
  initTestimonialsCarousel();
  initCustomCursor();
  initMenuTilt();

  // Single delegated click listener for every WhatsApp-triggering element
  // on the page (hero buttons, dish "Order" buttons, "View Full Menu"...).
  // Delegation is required here because dish cards are created dynamically
  // by renderMenu() and wouldn't exist yet if we queried for them upfront.
  document.body.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-wa-message]");
    if (trigger) {
      // data-wa-key = translated message in the visitor's language;
      // data-wa-message stays as the English fallback (and for dish orders,
      // which are rebuilt in the right language by buildMenuCard()).
      const key = trigger.dataset.waKey;
      openWhatsApp(key ? t(key) : trigger.getAttribute("data-wa-message"));
    }
  });

  // When the visitor switches language, re-render everything that was
  // generated by JavaScript (static text is handled by i18n.js itself).
  document.addEventListener("i18n:change", () => {
    renderMenu(currentMenuCategory);
    renderGallery();
    if (document.getElementById("lightboxModal")?.classList.contains("show")) {
      updateLightboxContent();
    }
    applyTheme(document.documentElement.getAttribute("data-theme") || "light");
    updateOpeningStatusBadge();
    updateReservationPickersLocale();
  });

  // Auto-close the mobile navbar when a nav link is clicked,
  // so navigating to a section doesn't leave the menu open.
  const navbarCollapseEl = document.getElementById("navbarContent");
  const navLinks = document.querySelectorAll("#navbarContent .nav-link");

  if (navbarCollapseEl && navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapseEl);
        bsCollapse.hide();
      });
    });
  }
});
