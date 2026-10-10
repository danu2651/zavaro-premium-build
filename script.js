/* =========================================================
   ZAVARO — PRODUCT DATA
========================================================= */

const products = [
  {
    id: 1,
    name: "Heavyweight T-Shirt",
    price: 79,
    cat: "tops",
    color: "Jet Black",
    sizes: ["S", "M", "L", "XL"],
    image: "assets/images/board_1_crops/01_signature_tee1.jpg",
    desc: "240–280 GSM premium combed cotton with a clean ZAVARO chest mark and signature sleeve detail.",
    badge: "Foundation",
  },

  {
    id: 2,
    name: "Oversized T-Shirt",
    price: 84,
    cat: "tops",
    color: "Ivory",
    sizes: ["S", "M", "L", "XL"],
    image: "assets/images/board_1_crops/02_oversized_tee1.jpg",
    desc: "Relaxed heavyweight silhouette designed for everyday confidence.",
    badge: "New",
  },

  {
    id: 3,
    name: "Premium Hoodie",
    price: 129,
    cat: "hoodies",
    color: "Jet Black",
    sizes: ["S", "M", "L", "XL"],
    image: "assets/images/board_1_crops/03_premium_hoodie1.jpg",
    desc: "420–500 GSM French terry / fleece with an oversized fit and tonal ZV back identity.",
    badge: "Featured",
  },

  {
    id: 4,
    name: "Zip Hoodie",
    price: 139,
    cat: "hoodies",
    color: "Washed Black",
    sizes: ["S", "M", "L", "XL"],
    image: "assets/images/board_1_crops/04_zip_hoodie1.jpg",
    desc: "A structured zip hoodie with substantial fabric and understated branding.",
    badge: "New",
  },

  {
    id: 5,
    name: "Longsleeve",
    price: 92,
    cat: "tops",
    color: "Jet Black",
    sizes: ["S", "M", "L", "XL"],
    image: "assets/images/board_1_crops/05_longsleeve1.jpg",
    desc: "Clean long-sleeve essential finished with subtle ZAVARO identity.",
    badge: "",
  },

  {
    id: 6,
    name: "Sweatpants",
    price: 109,
    cat: "bottoms",
    color: "Jet Black",
    sizes: ["S", "M", "L", "XL"],
    image: "assets/images/board_1_crops/06_sweatpants1.jpg",
    desc: "Heavyweight fleece sweatpants with a relaxed leg and signature ZV detail.",
    badge: "",
  },

  {
    id: 7,
    name: "Cargo Pants",
    price: 119,
    cat: "bottoms",
    color: "Dark Olive",
    sizes: ["S", "M", "L", "XL"],
    image: "assets/images/board_1_crops/07_cargo_pants1.jpg",
    desc: "Utility-inspired cargo pants balancing function with the ZAVARO silhouette.",
    badge: "New",
  },

  {
    id: 8,
    name: "Track Jacket",
    price: 139,
    cat: "outerwear",
    color: "Jet Black",
    sizes: ["S", "M", "L", "XL"],
    image: "assets/images/board_1_crops/08_track_jacket1.jpg",
    desc: "Lightweight track jacket with clean piping, structured shape and back branding.",
    badge: "",
  },

  {
    id: 9,
    name: "Nylon Jacket",
    price: 149,
    cat: "outerwear",
    color: "Jet Black",
    sizes: ["S", "M", "L", "XL"],
    image: "assets/images/board_1_crops/09_nylon_jacket1.jpg",
    desc: "Technical everyday layer with a quiet oversized ZAVARO back mark.",
    badge: "",
  },

  {
    id: 10,
    name: "Mesh Shorts",
    price: 69,
    cat: "bottoms",
    color: "Jet Black",
    sizes: ["S", "M", "L", "XL"],
    image: "assets/images/board_1_crops/10_mesh_shorts1.jpg",
    desc: "Lightweight mesh shorts designed for movement and everyday wear.",
    badge: "",
  },

  {
    id: 11,
    name: "ZV Cap",
    price: 49,
    cat: "headwear",
    color: "Bone",
    sizes: ["One Size"],
    image: "assets/images/board_1_crops/headwear1.jpg",
    desc: "Adjustable cotton twill cap with the ZV monogram.",
    badge: "Accessory",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const money = (value) => `$${Number(value).toFixed(2)}`;

/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn(`Could not load ${key}`, error);
    return fallback;
  }
}

let cart = loadStorage("zavaro-cart");
let wishlist = loadStorage("zavaro-wishlist");

let selected = null;
let selectedSize = null;
let currentFilter = "all";

/* =========================================================
   TOAST
========================================================= */

function toast(message) {
  const element = $("#toast");

  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 2100);
}

/* =========================================================
   SAVE DATA
========================================================= */

function save() {
  localStorage.setItem("zavaro-cart", JSON.stringify(cart));
  localStorage.setItem("zavaro-wishlist", JSON.stringify(wishlist));

  renderBag();
  renderFavorites();
}

let heroSlideTimer = null;
let heroSlideIndex = 0;

function startHeroSlideshow() {
  if (heroSlideTimer) {
    clearInterval(heroSlideTimer);
    heroSlideTimer = null;
  }

  const hero = document.querySelector("#zavaroHero");

  if (!hero) {
    return;
  }

  const slides = [...hero.querySelectorAll(".hero-slide")];
  const dots = [...hero.querySelectorAll("[data-hero-slide]")];

  if (!slides.length || slides.length !== dots.length) {
    return;
  }

  heroSlideIndex = 0;

  function showSlide(index) {
    heroSlideIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const active = i === heroSlideIndex;

      slide.classList.toggle("active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });

    dots.forEach((dot, i) => {
      const active = i === heroSlideIndex;

      dot.classList.toggle("active", active);
      dot.setAttribute("aria-pressed", String(active));
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.heroSlide));

      clearInterval(heroSlideTimer);

      heroSlideTimer = setInterval(() => {
        showSlide(heroSlideIndex + 1);
      }, 6000);
    });
  });

  showSlide(0);

  heroSlideTimer = setInterval(() => {
    showSlide(heroSlideIndex + 1);
  }, 6000);
}

/* =========================================================
   BODY LOCK
========================================================= */

function setLock() {
  const elements = [
    "bagDrawer",
    "favoritesPanel",
    "searchPanel",
    "productModal",
    "checkoutModal",
    "successModal",
  ];

  const active = elements.some((id) => {
    const element = $("#" + id);
    return element && element.classList.contains("active");
  });

  document.body.classList.toggle("lock", active);
}

/* =========================================================
   MEGA MENUS
========================================================= */

function closeMenus() {
  $$(".mega-menu").forEach((menu) => {
    menu.classList.remove("active");
  });
}

/* =========================================================
   BAG
========================================================= */

function openBag() {
  const bag = $("#bagDrawer");
  const overlay = $("#overlay");

  if (!bag || !overlay) {
    return;
  }

  closeFavorites();
  bag.classList.add("active");
  overlay.classList.add("active");

  renderBag();
  setLock();
}

function closeBag() {
  const bag = $("#bagDrawer");
  const overlay = $("#overlay");

  if (bag) {
    bag.classList.remove("active");
  }

  if (overlay) {
    if (!$("#favoritesPanel")?.classList.contains("active")) {
      overlay.classList.remove("active");
    }
  }

  setLock();
}

function openFavorites() {
  const panel = $("#favoritesPanel");
  const overlay = $("#overlay");

  if (!panel || !overlay) {
    return;
  }

  closeBag();
  closeSearch();
  renderFavorites();
  panel.classList.add("active");
  panel.setAttribute("aria-hidden", "false");
  overlay.classList.add("active");

  setLock();
}

function closeFavorites() {
  const panel = $("#favoritesPanel");

  if (panel) {
    panel.classList.remove("active");
    panel.setAttribute("aria-hidden", "true");
  }

  if (!$("#bagDrawer")?.classList.contains("active")) {
    $("#overlay")?.classList.remove("active");
  }

  setLock();
}

/* =========================================================
   SEARCH
========================================================= */

function openSearch() {
  const panel = $("#searchPanel");

  if (!panel) {
    return;
  }

  panel.classList.add("active");

  setTimeout(() => {
    $("#searchInput")?.focus();
  }, 80);

  setLock();
}

function closeSearch() {
  const panel = $("#searchPanel");

  if (panel) {
    panel.classList.remove("active");
  }

  const input = $("#searchInput");
  const results = $("#searchResults");

  if (input) {
    input.value = "";
  }

  if (results) {
    results.innerHTML = "";
  }

  setLock();
}

/* =========================================================
   PRODUCT MODAL
========================================================= */

function openModal(id) {
  selected = products.find((product) => product.id === id);

  if (!selected) {
    return;
  }

  selectedSize = selected.sizes[0];

  const modalImage = $("#modalImage");
  const modalName = $("#modalName");
  const modalPrice = $("#modalPrice");
  const modalColor = $("#modalColor");
  const modalDesc = $("#modalDesc");
  const modalBadge = $("#modalBadge");
  const modalSizes = $("#modalSizes");
  const modal = $("#productModal");

  if (!modal) {
    return;
  }

  if (modalImage) {
    modalImage.src = selected.image;
    modalImage.alt = selected.name;
  }

  if (modalName) {
    modalName.textContent = selected.name;
  }

  if (modalPrice) {
    modalPrice.textContent = money(selected.price);
  }

  if (modalColor) {
    modalColor.textContent = selected.color;
  }

  if (modalDesc) {
    modalDesc.textContent = selected.desc;
  }

  if (modalBadge) {
    modalBadge.textContent = selected.badge || "ZAVARO";
  }

  if (modalSizes) {
    modalSizes.innerHTML = selected.sizes
      .map(
        (size) => `
        <button
          class="${size === selectedSize ? "active" : ""}"
          data-size="${size}"
        >
          ${size}
        </button>
      `,
      )
      .join("");
  }

  modal.classList.add("active");

  setLock();
}

function closeProduct() {
  const modal = $("#productModal");

  if (modal) {
    modal.classList.remove("active");
  }

  setLock();
}

/* =========================================================
   CART
========================================================= */

function addToCart(id, size = null) {
  const product = products.find((item) => item.id === id);

  if (!product) {
    return;
  }

  size = size || product.sizes[0];

  const key = `${id}-${size}`;

  const existing = cart.find((item) => item.key === key);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      color: product.color,
      qty: 1,
    });
  }

  save();

  toast(`${product.name} added to bag`);
}

/* =========================================================
   RENDER BAG
========================================================= */

function renderBag() {
  const bagCount = $("#bagCount");
  const bagSubtotal = $("#bagSubtotal");
  const bagEmpty = $("#bagEmpty");
  const bagItems = $("#bagItems");

  if (!bagCount || !bagSubtotal || !bagEmpty || !bagItems) {
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const quantity = cart.reduce((sum, item) => sum + item.qty, 0);

  bagCount.textContent = quantity;
  bagSubtotal.textContent = money(total);

  bagEmpty.style.display = cart.length ? "none" : "block";

  bagItems.innerHTML = cart
    .map(
      (item) => `
      <div class="bag-item">

        <img
          src="${item.image}"
          alt="${item.name}"
        >

        <div>

          <h4>${item.name}</h4>

          <p>
            ${item.color} · SIZE ${item.size}
          </p>

          <div class="qty">

            <button
              data-qty="${item.key}"
              data-change="-1"
            >
              −
            </button>

            <span>${item.qty}</span>

            <button
              data-qty="${item.key}"
              data-change="1"
            >
              +
            </button>

          </div>

          <button
            class="remove"
            data-remove="${item.key}"
          >
            REMOVE
          </button>

        </div>

        <strong>
          ${money(item.price * item.qty)}
        </strong>

      </div>
    `,
    )
    .join("");
}

function renderFavorites() {
  const favoritesGrid = $("#favoritesGrid");
  const favoritesEmpty = $("#favoritesEmpty");

  if (!favoritesGrid || !favoritesEmpty) {
    return;
  }

  const favorites = products.filter((product) => wishlist.includes(product.id));

  favoritesEmpty.style.display = favorites.length ? "none" : "block";
  favoritesGrid.innerHTML = renderProducts(favorites);
}

function updateFavoriteButtons(id) {
  const product = products.find((item) => item.id === id);
  const active = wishlist.includes(id);

  $$(`[data-heart="${id}"]`).forEach((button) => {
    button.textContent = active ? "♥" : "♡";
    button.classList.toggle("active", active);
    button.setAttribute(
      "aria-label",
      `${active ? "Remove" : "Add"} ${product?.name || "item"} ${
        active ? "from" : "to"
      } favorites`,
    );
  });
}

function toggleFavorite(id) {
  wishlist = wishlist.includes(id)
    ? wishlist.filter((item) => item !== id)
    : [...wishlist, id];

  save();
  updateFavoriteButtons(id);

  return wishlist.includes(id);
}

$("#favoritesGrid")?.addEventListener("click", (event) => {
  const heart = event.target.closest("[data-heart]");

  if (heart) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(Number(heart.dataset.heart));
    return;
  }

  const quickAdd = event.target.closest("[data-add]");

  if (quickAdd) {
    event.preventDefault();
    event.stopPropagation();
    addToCart(Number(quickAdd.dataset.add));
    return;
  }

  const card = event.target.closest(".product-card");

  if (card) {
    closeFavorites();
    openModal(Number(card.dataset.id));
  }
});

/* =========================================================
   PRODUCT CARDS
========================================================= */

function renderProducts(list) {
  return list
    .map((product) => {
      const isWishlisted = wishlist.includes(product.id);

      return `
        <article
          class="product-card"
          data-id="${product.id}"
        >

          <div class="product-media">

            <img
              src="${product.image}"
              alt="${product.name}"
              loading="lazy"
            >

            ${
              product.badge ? `<span class="badge">${product.badge}</span>` : ""
            }

            <button
              class="heart ${isWishlisted ? "active" : ""}"
              data-heart="${product.id}"
              aria-label="${isWishlisted ? "Remove" : "Add"} ${product.name} ${
                isWishlisted ? "from" : "to"
              } favorites"
            >
              ${isWishlisted ? "♥" : "♡"}
            </button>

            <button
              class="quick-add"
              data-add="${product.id}"
              aria-label="Add ${product.name} to bag"
            >
              ADD TO BAG
              <span>↗</span>
            </button>

            <span class="product-hover">
              VIEW PRODUCT ↗
            </span>

          </div>

          <div class="product-info">

            <h3>${product.name}</h3>

            <strong>
              ${money(product.price)}
            </strong>

            <p>
              ${product.color}
            </p>

          </div>

        </article>
      `;
    })
    .join("");
}

/* =========================================================
   HOME
========================================================= */

function home() {
  return `
    <section
      class="hero"
      id="zavaroHero"
      aria-label="ZAVARO fashion campaign"
    >
      <!-- Full-screen campaign slideshow -->
      <div class="hero-slides">

        <div class="hero-slide active" aria-hidden="false">
          <img
            src="assets/images/board_4_crops/hoodie_back1.jpg"
            alt="ZAVARO Collection 001 campaign"
            fetchpriority="high"
          >
        </div>
    




        <div class="hero-slide" aria-hidden="true">
          <img
            src="assets/images/board_4_crops/image.jpg"
            alt="ZAVARO contemporary fashion campaign"
            loading="lazy"
          >
        </div>

        <div class="hero-slide" aria-hidden="true">
          <img
            src="assets/images/board_2_crops/collection_cover4.jpg"
            alt="ZAVARO editorial fashion collection"
            loading="lazy"
          >
        </div>

      </div>

      <!-- Subtle overlay for image depth and header readability -->
      <div class="hero-overlay" aria-hidden="true"></div>

    
<!-- Minimal bottom-left campaign note -->
<div class="hero-note">
  <span class="hero-note-label">EVERYDAY,REFINED.</span>
</div>



      

      <!-- Slideshow controls -->
      <div
        class="hero-pagination"
        aria-label="Choose hero image"
      >
        <button
          class="hero-dot active"
          type="button"
          data-hero-slide="0"
          aria-label="Show image 1"
          aria-pressed="true"
        >01</button>

        <button
          class="hero-dot"
          type="button"
          data-hero-slide="1"
          aria-label="Show image 2"
          aria-pressed="false"
        >02</button>

        <button
          class="hero-dot"
          type="button"
          data-hero-slide="2"
          aria-label="Show image 3"
          aria-pressed="false"
        >03</button>
      </div>
    </section>

    <!-- Featured products -->
    <section class="product-editorial">
      <div class="section-head">
        <div>
          <span class="eyebrow">COLLECTION 001</span>
          <h2>FEATURED PIECES</h2>
        </div>

        <a class="text-link" href="#shop/all">VIEW ALL ↗</a>
      </div>

      <div class="product-grid">
        ${renderProducts(products.slice(0, 3))}
      </div>
    </section>

    <!-- Editorial campaign -->
    <section class="campaign">
      <img
        src="assets/images/board_2_crops/collection_cover4.jpg"
        alt="ZAVARO campaign"
        loading="lazy"
      >

      <div class="campaign-copy">
        <span class="eyebrow">ZAVARO / 2026</span>
        <h2>The form of<br><em>everyday.</em></h2>

        <a class="text-link" href="#collection/editorial">
          ENTER EDITORIAL ↗
        </a>
      </div>
    </section>

    <!-- Shop by category -->
    <section class="worlds">
      <div class="section-head">
        <div>
          <span class="eyebrow">EXPLORE ZAVARO</span>
          <h2>SHOP BY WORLD</h2>
        </div>
      </div>

      <div class="world-grid">
        ${[
          ["MENS", "assets/images/board_4_crops/image.jpg", "world/mens"],
          [
            "WOMENS",
            "assets/images/board_2_crops/collection_cover4.jpg",
            "world/womens",
          ],
          ["KIDS", "assets/images/board_1_crops/details1.jpg", "world/kids"],
        ]
          .map(
            (item) => `
              <a class="world-card" href="#${item[2]}">
                <img
                  src="${item[1]}"
                  alt="${item[0]}"
                  loading="lazy"
                >

                <div class="world-info">
                  <strong>${item[0]}</strong>
                  <span>SHOP ${item[0]} →</span>
                </div>
              </a>
            `,
          )
          .join("")}
      </div>
    </section>

    <!-- Featured collection image -->
    <section class="feature-image">
      <img
        src="assets/images/board_4_crops/image.jpg"
        alt="ZAVARO collection campaign"
        loading="lazy"
      >

      <div class="feature-image-copy">
        <span class="eyebrow">COLLECTION 001</span>
        <h2>Made for<br><em>every day.</em></h2>

        <a class="text-link" href="#collection/001">
          DISCOVER THE COLLECTION ↗
        </a>
      </div>
    </section>

    <!-- New arrivals -->
    <section class="arrivals">
      <div class="section-head">
        <div>
          <span class="eyebrow">JUST IN</span>
          <h2>NEW ARRIVALS</h2>
        </div>

        <a class="text-link" href="#collection/new">VIEW NEW ↗</a>
      </div>

      <div class="horizontal-grid">
        ${renderProducts(
          products
            .filter((product) => product.badge === "New")
            .concat(products.slice(0, 1))
            .slice(0, 3),
        )}
      </div>
    </section>

    <!-- Brand story -->
    <section class="brand-story">
      <h2>Wear less.<br><em>Mean more.</em></h2>

      <div>
        <span class="eyebrow">THE ZAVARO IDEA</span>

        <p>
          ZAVARO creates modern essentials around proportion, material
          and presence. The intention is simple: fewer distractions,
          better pieces, a wardrobe with a point of view.
        </p>

        <a class="text-link" href="#collection/editorial">
          READ OUR STORY ↗
        </a>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter">
      <div>
        <span class="eyebrow">ZAVARO NOTES</span>
        <h2>Good things,<br><em>occasionally.</em></h2>
      </div>

      <form id="newsletterForm">
        <input
          type="email"
          id="newsletterEmail"
          placeholder="Your email address"
          required
        >

        <button type="submit">JOIN US ↗</button>
      </form>
    </section>
  `;
}

/* =========================================================
   SHOP / PRODUCT GRID
========================================================= */

function productGridView(title, subtitle, list, filter = true) {
  return `

    <section class="page-hero">

      <img
        src="${list[0]?.image || "assets/images/board_4_crops/image.jpg"}"
        alt="${title}"
      >

      <div class="page-hero-copy">

        <span class="eyebrow">
          ${subtitle}
        </span>

        <h1>
          ${title}
        </h1>

      </div>

    </section>


    <section class="shop-view">

      ${
        filter
          ? `
            <div class="filter-row">

              ${["all", "tops", "hoodies", "bottoms", "outerwear", "headwear"]
                .map(
                  (category) => `
                      <button
                        class="${currentFilter === category ? "active" : ""}"
                        data-filter="${category}"
                      >
                        ${category}
                      </button>
                    `,
                )
                .join("")}

            </div>
          `
          : ""
      }


      <div
        class="product-grid"
        id="shopGrid"
      >
        ${renderProducts(list)}
      </div>

    </section>

  `;
}

/* =========================================================
   WORLD VIEW
========================================================= */

/* =========================================================
   WORLD VIEW — MEN / WOMEN / KIDS
   Single category hero followed directly by products.
========================================================= */

function worldView(world) {
  const title = world.toUpperCase();

  // Keep the existing product selection behavior.
  const list = world === "kids" ? products.slice(0, 5) : products;

  // Preserve the existing category hero images.
  const heroImage =
    world === "mens"
      ? "assets/images/board_4_crops/image.jpg"
      : world === "womens"
        ? "assets/images/board_2_crops/collection_cover4.jpg"
        : "assets/images/board_1_crops/details1.jpg";

  return `
    <!-- Category hero -->
    <section class="page-hero">
      <img
        src="${heroImage}"
        alt="${title}"
      >

      <div class="page-hero-copy">
        <span class="eyebrow">
          ${world === "kids" ? "ZAVARO JUNIOR" : "COLLECTION 001"}
        </span>

        <h1>${title}</h1>
      </div>
    </section>

    <!-- Products appear immediately after the hero -->
    <section class="shop-view">
      <div class="section-head">
        <div>
          <span class="eyebrow">SELECTED PIECES</span>
          <h2>${title}</h2>
        </div>
      </div>

      <div class="product-grid">
        ${renderProducts(list)}
      </div>
    </section>
  `;
}

/* =========================================================
   COLLECTION VIEW
========================================================= */

/* =========================================================
   ZAVARO JOURNAL — EDITORIAL STORY
========================================================= */

function journalView() {
  return `
    <main class="zv-journal">

      <!-- OPENING CAMPAIGN -->
      <section class="zv-journal-hero">
        <img
          src="assets/images/board_4_crops/image.jpg"
          alt="ZAVARO contemporary fashion campaign"
          fetchpriority="high"
        >

        <div class="zv-journal-hero-shade"></div>

        <div class="zv-journal-hero-copy">
          <span class="zv-journal-kicker">
            ZAVARO JOURNAL — NO. 001
          </span>

          <h1>
            The art of<br>
            <em>everyday.</em>
          </h1>

          <p>
            A study in simplicity, presence and the things
            we choose to wear.
          </p>

          <a href="#journal-story" class="zv-journal-light-link">
            EXPLORE THE STORY <span>↓</span>
          </a>
        </div>

        <span class="zv-journal-index">01 / THE PERSPECTIVE</span>
      </section>


      <!-- INTRODUCTION -->
      <section class="zv-journal-intro" id="journal-story">
        <span class="zv-journal-kicker">THE ZAVARO PERSPECTIVE</span>

        <h2>
          Less, but<br>
          <em>with intention.</em>
        </h2>

        <div class="zv-journal-intro-copy">
          <p>
            Personal style does not need to announce itself.
            Sometimes, it is found in a silhouette, the weight
            of a fabric, or the quiet confidence of a familiar piece.
          </p>

          <p>
            ZAVARO explores modern essentials through considered
            proportions, understated details and clothing made
            to feel natural in everyday life.
          </p>
        </div>
      </section>


      <!-- FULL-WIDTH IMAGE STORY -->
      <section class="zv-journal-full-image">
        <img
          src="assets/images/board_4_crops/hoodie_back1.jpg"
          alt="ZAVARO collection and silhouette"
          loading="lazy"
        >

        <div class="zv-journal-image-caption">
          <span>COLLECTION 001</span>
          <span>FORM IN FOCUS — 01</span>
        </div>
      </section>


      <!-- SILHOUETTE STORY -->
      <section class="zv-journal-split">
        <div class="zv-journal-split-image">
          <img
            src="assets/images/board_2_crops/collection_cover4.jpg"
            alt="ZAVARO fashion and contemporary proportions"
            loading="lazy"
          >
        </div>

        <div class="zv-journal-split-copy">
          <span class="zv-journal-kicker">01 / THE SILHOUETTE</span>

          <h2>
            A shape<br>
            of your <em>own.</em>
          </h2>

          <p>
            The way a garment falls can change the feeling of an
            entire look. Relaxed proportions, clean lines and
            considered volume create a balance between comfort
            and character.
          </p>

          <p>
            Not designed to follow every moment, but to become
            part of your own.
          </p>

          <a href="#shop/all" class="zv-journal-link">
            DISCOVER THE PIECES ↗
          </a>
        </div>
      </section>


      <!-- EDITORIAL STATEMENT -->
      <section class="zv-journal-quote">
        <span class="zv-journal-kicker">A ZAVARO NOTE</span>

        <blockquote>
          “The strongest statement<br>
          is often the <em>simplest.</em>”
        </blockquote>

        <span class="zv-journal-quote-line"></span>

        <p>BUILT AROUND THE EVERYDAY.</p>
      </section>


      <!-- SECOND IMAGE STORY -->
      <section class="zv-journal-detail">
        <div class="zv-journal-detail-image">
          <img
            src="assets/images/board_1_crops/details1.jpg"
            alt="Details from the ZAVARO collection"
            loading="lazy"
          >
        </div>

        <div class="zv-journal-detail-copy">
          <span class="zv-journal-kicker">02 / THE DETAILS</span>

          <h2>
            Thoughtful<br>
            by <em>design.</em>
          </h2>

          <p>
            Texture. Weight. Construction. The smallest details
            influence how a piece looks, feels and becomes part
            of your wardrobe.
          </p>

          <p>
            Our perspective is simple: let the form speak,
            let the details reward a closer look, and leave
            room for your own interpretation.
          </p>
        </div>
      </section>


      <!-- CLOSING CAMPAIGN -->
      <section class="zv-journal-ending">
        <img
          src="assets/images/board_4_crops/image.jpg"
          alt="ZAVARO Collection 001 campaign"
          loading="lazy"
        >

        <div class="zv-journal-ending-shade"></div>

        <div class="zv-journal-ending-copy">
          <span class="zv-journal-kicker">THE ZAVARO IDEA</span>

          <h2>
            Wear less.<br>
            <em>Mean more.</em>
          </h2>

          <p>
            Find your uniform. Make it your own.
          </p>

          <a href="#collection/001" class="zv-journal-light-link">
            DISCOVER COLLECTION 001 ↗
          </a>
        </div>
      </section>

    </main>
  `;
}

/* =========================================================
   COLLECTION VIEW
========================================================= */

function collectionView(slug) {
  // Editorial has its own complete storytelling page.
  if (slug === "editorial") {
    return journalView();
  }

  const blocks = [
    [
      "COLLECTION 001",
      "THE EVERYDAY UNIFORM",
      "assets/images/board_4_crops/hoodie_back1.jpg",
    ],
    [
      "ESSENTIALS",
      "FOUNDATIONAL PIECES",
      "assets/images/board_2_crops/collection_cover4.jpg",
    ],
    [
      "NEW ARRIVALS",
      "THE LATEST FORM",
      "assets/images/board_1_crops/details1.jpg",
    ],
  ];

  let chosen;

  if (slug === "new") {
    chosen = blocks.slice(2, 3);
  } else if (slug === "essentials") {
    chosen = blocks.slice(1, 2);
  } else {
    chosen = blocks;
  }

  return `
    <div class="collection-view">
      ${chosen
        .map(
          (block, index) => `
            <section class="collection-block">
              <img
                src="${block[2]}"
                alt="${block[0]}"
                loading="${index ? "lazy" : "eager"}"
              >

              <div class="collection-block-copy">
                <span class="eyebrow">${block[0]}</span>
                <h2>${block[1]}</h2>

                <a class="text-link" href="#shop/all">
                  SHOP COLLECTION ↗
                </a>
              </div>
            </section>
          `,
        )
        .join("")}
    </div>
  `;
}

/* =========================================================
   CLIENT SERVICES
========================================================= */

function serviceView(type) {
  const data = {
    shipping: [
      "SHIPPING",
      "Orders are prepared after checkout and delivery details are confirmed directly with the customer.",
    ],

    returns: [
      "RETURNS",
      "Returns and exchanges can be discussed with ZAVARO client services after delivery.",
    ],

    size: [
      "SIZE GUIDE",
      "Choose your usual size for the intended relaxed ZAVARO silhouette. For a precise recommendation, contact client services.",
    ],
  };

  const current = data[type] || [
    "CLIENT SERVICES",
    "For questions about orders, delivery, returns or sizing, contact ZAVARO directly.",
  ];

  return `

    <section class="service-view">

      <span class="eyebrow">
        ZAVARO / CLIENT SERVICES
      </span>

      <h1>
        ${current[0]}
      </h1>


      <article>

        <h3>
          ${current[0]}
        </h3>

        <p>
          ${current[1]}
        </p>

      </article>


      <article>

        <h3>
          CONTACT
        </h3>

        <p>

          <a href="tel:+17205957723">
            +1 (720) 595-7723
          </a>

          <br>

          <a href="mailto:aseminew@zavarogmail.com">
            aseminew@zavarogmail.com
          </a>

        </p>

      </article>

    </section>

  `;
}

/* =========================================================
   ROUTER
========================================================= */

function route() {
  closeMenus();

  const mobileNav = $("#mobileNav");

  if (mobileNav) {
    mobileNav.classList.remove("active");
  }

  const raw = location.hash.replace("#", "") || "home";

  const [type, arg = "all"] = raw.split("/");

  let view = "";

  if (type === "home") {
    view = home();
  } else if (type === "shop") {
    currentFilter = arg;

    const list =
      arg === "all"
        ? products
        : products.filter((product) => product.cat === arg);

    view = productGridView(
      "SHOP",
      arg === "all" ? "ZAVARO / ALL PIECES" : `ZAVARO / ${arg}`,
      list,
    );
  } else if (type === "world") {
    view = worldView(arg);
  } else if (type === "collection") {
    view = collectionView(arg);
  } else if (type === "service") {
    view = serviceView(arg);
  } else {
    view = home();
  }

  $("#app").innerHTML = view;
  if (type === "home") {
    startHeroSlideshow();
  }

  window.scrollTo({
    top: 0,
    behavior: "instant",
  });

  bindDynamic();
}

/* =========================================================
   DYNAMIC EVENTS
========================================================= */

function bindDynamic() {
  $$("#app .product-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (
        event.target.closest(".heart") ||
        event.target.closest(".quick-add")
      ) {
        return;
      }

      openModal(Number(card.dataset.id));
    });
  });

  $$("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;

      const list =
        currentFilter === "all"
          ? products
          : products.filter((product) => product.cat === currentFilter);

      const grid = $("#shopGrid");

      if (grid) {
        grid.innerHTML = renderProducts(list);
        bindDynamic();
      }
    });
  });

  $$("#app [data-heart]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const id = Number(button.dataset.heart);
      toggleFavorite(id);
    });
  });

  $$("#app [data-add]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      addToCart(Number(button.dataset.add));
    });
  });

  $("#newsletterForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    toast("You're on the ZAVARO list.");

    event.target.reset();
  });
}

/* =========================================================
   GLOBAL ACTIONS
========================================================= */

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;

  if (!action) {
    return;
  }

  if (action === "bag") {
    openBag();
  }

  if (action === "favorites") {
    openFavorites();
  }

  if (action === "closeBag") {
    closeBag();
  }

  if (action === "closeFavorites") {
    closeFavorites();
  }

  if (action === "search") {
    openSearch();
  }

  if (action === "closeSearch") {
    closeSearch();
  }

  if (action === "checkout") {
    if (!cart.length) {
      toast("Your bag is empty");
      return;
    }

    closeBag();

    $("#checkoutModal")?.classList.add("active");

    setLock();

    setTimeout(() => {
      $("#customerName")?.focus();
    }, 100);
  }

  if (action === "closeCheckout") {
    $("#checkoutModal")?.classList.remove("active");

    setLock();
  }

  if (action === "closeProduct") {
    closeProduct();
  }

  if (action === "modalAdd") {
    if (!selected) {
      return;
    }

    addToCart(selected.id, selectedSize);

    closeProduct();
  }

  if (action === "modalWishlist") {
    if (!selected) {
      return;
    }

    const active = toggleFavorite(selected.id);

    toast(active ? "Added to wishlist" : "Removed from wishlist");
  }

  if (action === "mobileMenu") {
    $("#mobileNav")?.classList.add("active");

    setLock();
  }

  if (action === "mobileClose") {
    $("#mobileNav")?.classList.remove("active");

    setLock();
  }

  if (action === "closeSuccess") {
    $("#successModal")?.classList.remove("active");

    setLock();
  }
});

/* =========================================================
   DESKTOP MEGA MENU
========================================================= */

document.addEventListener("click", (event) => {
  const trigger = event.target.closest(".nav-trigger");

  if (!trigger) {
    return;
  }

  const id = trigger.dataset.menu;
  const menu = $("#" + id);

  if (!menu) {
    return;
  }

  const wasActive = menu.classList.contains("active");

  closeMenus();

  if (!wasActive) {
    menu.classList.add("active");
  }
});

/* =========================================================
   BAG OVERLAY
========================================================= */

$("#overlay")?.addEventListener("click", () => {
  closeBag();
  closeFavorites();
});

/* =========================================================
   PRODUCT SIZE SELECTION
========================================================= */

$("#modalSizes")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-size]");

  if (!button) {
    return;
  }

  selectedSize = button.dataset.size;

  $$("#modalSizes button").forEach((item) => item.classList.remove("active"));

  button.classList.add("active");
});

/* =========================================================
   BAG QUANTITY / REMOVE
========================================================= */

$("#bagItems")?.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-qty]");

  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    const item = cart.find(
      (cartItem) => cartItem.key === quantityButton.dataset.qty,
    );

    if (item) {
      item.qty += Number(quantityButton.dataset.change);

      if (item.qty <= 0) {
        cart = cart.filter((cartItem) => cartItem !== item);
      }

      save();
    }
  }

  if (removeButton) {
    cart = cart.filter((item) => item.key !== removeButton.dataset.remove);

    save();
  }
});

/* =========================================================
   SEARCH
========================================================= */

$("#searchInput")?.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();

  const results = products
    .filter((product) =>
      `${product.name} ${product.cat} ${product.color}`
        .toLowerCase()
        .includes(query),
    )
    .slice(0, 8);

  const searchResults = $("#searchResults");

  if (!searchResults) {
    return;
  }

  searchResults.innerHTML = query
    ? results
        .map(
          (product) => `
                <button
                  class="search-result"
                  data-result="${product.id}"
                >

                  <img
                    src="${product.image}"
                    alt="${product.name}"
                  >

                  <strong>
                    ${product.name}
                  </strong>

                  <small>
                    ${money(product.price)}
                    ·
                    ${product.color}
                  </small>

                </button>
              `,
        )
        .join("")
    : "";
});

/* =========================================================
   SEARCH RESULT
========================================================= */

$("#searchResults")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-result]");

  if (!button) {
    return;
  }

  closeSearch();

  openModal(Number(button.dataset.result));
});

/* =========================================================
   CHECKOUT
========================================================= */

$("#checkoutForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!cart.length) {
    toast("Your bag is empty");
    return;
  }

  const order = {
    id: `ZV-${Date.now()}`,

    customer: {
      name: $("#customerName")?.value.trim() || "",

      phone: $("#customerPhone")?.value.trim() || "",

      email: $("#customerEmail")?.value.trim() || "",
    },

    paymentMethod: "Cash on Delivery",

    items: cart.map((item) => ({ ...item })),

    subtotal: cart.reduce((sum, item) => sum + item.price * item.qty, 0),

    status: "Pending",

    createdAt: new Date().toISOString(),
  };

  const orders = loadStorage("zavaro-orders");

  orders.push(order);

  localStorage.setItem("zavaro-orders", JSON.stringify(orders));

  cart = [];

  save();

  event.target.reset();

  $("#checkoutModal")?.classList.remove("active");

  const successText = $("#successText");

  if (successText) {
    successText.textContent = `Order ${order.id} has been received. We will contact you with payment and delivery details.`;
  }

  $("#successModal")?.classList.add("active");

  setLock();
});

/* =========================================================
   ROUTING
========================================================= */

window.addEventListener("hashchange", route);

/* =========================================================
   ESCAPE KEY
========================================================= */

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  closeMenus();
  closeBag();
  closeFavorites();
  closeSearch();
  closeProduct();

  $("#checkoutModal")?.classList.remove("active");

  $("#successModal")?.classList.remove("active");

  setLock();
});

/* =========================================================
   INITIALIZE
========================================================= */

window.addEventListener("load", () => {
  renderBag();
  renderFavorites();
  route();
});

/* =========================================================
   ZAVARO — HIDE ON SCROLL DOWN, REVEAL ON SCROLL UP
========================================================= */

(() => {
  const header = document.querySelector("#siteHeader");

  if (!header || header.dataset.scrollRevealReady === "true") {
    return;
  }

  header.dataset.scrollRevealReady = "true";

  let previousScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
  const currentScrollY = window.scrollY;
  const difference = currentScrollY - previousScrollY;
  const hero = document.querySelector("#zavaroHero");
  const heroBottom = hero
    ? hero.getBoundingClientRect().bottom
    : 0;

  /* Keep the homepage header transparent over the hero */
  header.classList.toggle(
    "header-scrolled",
    !hero || heroBottom <= header.offsetHeight
  );

  /* Always show the header at the top */
  if (currentScrollY <= 20) {
    header.classList.remove("header-hidden");
  } else if (difference > 5) {
    header.classList.add("header-hidden");
  } else if (difference < -5) {
    header.classList.remove("header-hidden");
  }

  previousScrollY = currentScrollY;
  ticking = false;
}

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );

  /* Reset the header after navigating to another page */
  window.addEventListener("hashchange", () => {
    header.classList.remove("header-hidden");
    previousScrollY = window.scrollY;
  });
})();