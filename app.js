
/*
  AKSARAY ÜNİVERSİTESİ DİJİTAL MENÜ
  Ürün fiyatları ve alerjen bilgileri henüz doğrulanmadığı için
  fiyat gösterilmez; alerjen filtreleri seçildiğinde doğrulanmamış
  ürünler gösterilmez.
*/

const MENU_DATA = [
  {
    category: "Kahvaltı",
    subcategories: [
      {
        name: "Kahvaltı menüleri",
        emoji: "🍳",
        products: [
          "2 Kişilik Kahvaltı",
          "Tek Kişilik Kahvaltı",
          "Kahvaltı Tabağı (Tek Kişilik)",
          "Pişi Kahvaltı",
          "Pankek Tabağı"
        ]
      },
      {
        name: "Sıcak kahvaltı",
        emoji: "🍳",
        products: ["Menemen", "Mıhlama", "Yumurtalı Ekmek", "Gözleme"]
      },
      {
        name: "Yumurta çeşitleri",
        emoji: "🍳",
        products: [
          "Sade Yumurta",
          "Sucuklu Yumurta",
          "Omlet",
          "Beyaz Peynirli Yumurta",
          "Kaşar Peynirli Yumurta"
        ]
      },
      {
        name: "Tostlar",
        emoji: "🥪",
        products: ["Kaşarlı Tost", "Karışık Tost", "Ayvalık Tostu", "Akdeniz Tostu"]
      }
    ]
  },
  {
    category: "Başlangıçlar",
    subcategories: [
      {
        name: "Soğuk başlangıçlar",
        emoji: "🥙",
        products: [
          "Humus",
          "Haydari / Girit Ezmesi",
          "Kabak Tarator",
          "Bruschetta",
          "Yaprak Sarma veya Zeytinyağlı Enginar"
        ]
      },
      {
        name: "Çorbalar",
        emoji: "🍲",
        products: ["Mercimek Çorbası", "Domates Çorbası", "Kremalı Mantar Çorbası"]
      }
    ]
  },
  {
    category: "Atıştırmalıklar",
    subcategories: [
      {
        name: "Atıştırmalıklar",
        emoji: "🍟",
        products: [
          "Patates Kızartması",
          "Çıtır Tavuk Tabağı",
          "Combo Tabak",
          "Soğan Halkası",
          "Karışık Börek Tabağı"
        ]
      }
    ]
  },
  {
    category: "Ana yemekler",
    subcategories: [
      {
        name: "Pizzalar",
        emoji: "🍕",
        products: ["Margarita Pizza", "Karışık Pizza", "Tavuklu Pizza", "Akdeniz Pizza"]
      },
      {
        name: "Burgerler",
        emoji: "🍔",
        products: [
          "Hamburger",
          "Cheeseburger",
          "Smash Burger",
          "Cafe de Pars Burger",
          "Chicken Burger"
        ]
      },
      {
        name: "Dürümler",
        emoji: "🌯",
        products: ["Tavuklu Dürüm", "Çıtır Tavuk Dürüm", "Etli Dürüm"]
      },
      {
        name: "Bowl",
        emoji: "🥗",
        products: [
          "Somon Bowl",
          "Beef Bowl",
          "Chicken Teriyaki Bowl",
          "Izgara Tavuk Bowl",
          "Falafel Bowl",
          "Köfte Bowl"
        ]
      },
      {
        name: "Makarnalar",
        emoji: "🍝",
        products: [
          "Tavuklu Fettuccine",
          "Tavuklu Penne",
          "Körili Tavuklu Makarna",
          "Mac and Cheese"
        ]
      },
      {
        name: "Beyaz etler",
        emoji: "🍗",
        products: [
          "Izgara Tavuk Şiş",
          "Mantarlı Soslu Tavuk",
          "Beğendi Yatağında Piliç Külbastı",
          "Köri Soslu Tavuk",
          "Barbekü Soslu Tavuk",
          "Tavuklu Çökertme Kebabı",
          "Tavuklu Fajita"
        ]
      },
      {
        name: "Kırmızı etler",
        emoji: "🥩",
        products: [
          "Izgara Köfte",
          "Pideli Balaban Köfte",
          "Etli Çökertme Kebabı",
          "Izgara Lokum Bonfile",
          "Karışık Izgara"
        ]
      }
    ]
  },
  {
    category: "Salatalar",
    subcategories: [
      {
        name: "Salatalar",
        emoji: "🥗",
        products: [
          "Akdeniz Salata",
          "Çoban Salata",
          "Çok Tahıllı Salata",
          "Roka Salata",
          "Çıtır Tavuk Salata",
          "Tavuklu Sezar Salata"
        ]
      }
    ]
  },
  {
    category: "Tatlılar",
    subcategories: [
      {
        name: "Tatlılar",
        emoji: "🍰",
        products: [
          "Kızarmış Dondurma",
          "Crème Brûlée",
          "Waffle",
          "Lotuslu Krep Roll",
          "Brownie Cup",
          "Magnolia",
          "Profiterol",
          "Tiramisu",
          "Supangle",
          "Frambuazlı Cheesecake",
          "Fıstıklı San Sebastian"
        ]
      }
    ]
  },
  {
    category: "İçecekler",
    subcategories: [
      {
        name: "Soğuk içecekler",
        emoji: "🥤",
        products: [
          "Su",
          "Soda",
          "Churchill",
          "Ayran",
          "Cola",
          "Fanta",
          "Sprite",
          "Fuse Tea",
          "Red Bull",
          "Şalgam",
          "Cool Lime"
        ]
      },
      {
        name: "Sıcak içecekler",
        emoji: "☕",
        products: [
          "Çay",
          "Bitki Çayı",
          "Türk Kahvesi",
          "Dibek Kahvesi",
          "Menengiç Kahvesi",
          "Filtre Kahve",
          "Espresso",
          "Americano",
          "Cappuccino",
          "Latte",
          "Salep"
        ]
      }
    ]
  }
];

const CATEGORIES = ["Tümü", ...MENU_DATA.map(item => item.category)];

const ALLERGENS = [
  { id: "gluten", label: "Gluten" },
  { id: "milk", label: "Süt ve ürünleri" },
  { id: "egg", label: "Yumurta" },
  { id: "peanut", label: "Yer fıstığı" },
  { id: "treeNuts", label: "Kuruyemiş" },
  { id: "soy", label: "Soya" },
  { id: "sesame", label: "Susam" },
  { id: "fish", label: "Balık" },
  { id: "shellfish", label: "Kabuklu deniz ürünleri" },
  { id: "mustard", label: "Hardal" },
  { id: "celery", label: "Kereviz" },
  { id: "lupin", label: "Acı bakla" },
  { id: "sulphites", label: "Sülfitler" },
  { id: "molluscs", label: "Midye / Kalamar" }
];

// Ürünler, yukarıdaki menü gruplarından oluşturulur.
const PRODUCTS = MENU_DATA.flatMap(group =>
  group.subcategories.flatMap(subcategory =>
    subcategory.products.map((name, index) => ({
      id: `${group.category}-${subcategory.name}-${index}`,
      name,
      category: group.category,
      subcategory: subcategory.name,
      emoji: subcategory.emoji,
    
image: ({
  // Pizzalar
  "Margarita Pizza": "images/margaritapizza.webp",
  "Karışık Pizza": "images/karisikpizza.webp",
  "Tavuklu Pizza": "images/tavuklupizza.webp",
  "Akdeniz Pizza": "images/italianopizza.webp",

  // Burgerler
  "Hamburger": "images/hamburger.jpg",
  "Cheeseburger": "images/cheeseburger.jpg",
  "Smash Burger": "images/smashburger.jpg",
  "Cafe de Pars Burger": "images/cafedeparisburger.jpg",
  "Chicken Burger": "images/chickenburger.jpg",

  // Dürümler
  "Etli Dürüm": "images/etlidurum.jpg",
  "Çıtır Tavuk Dürüm": "images/citirtavukludurum.jpg",
  "Tavuklu Dürüm": "images/tavukludurum.jpg"
})[name] || `images/${slugify(name)}.jpg`,

      price: null,
      description: "",
      allergens: [],
      allergensVerified: false
    }))
  )
);

const selectedAllergens = new Set();
let activeCategory = "Tümü";
let activeSubcategory = "";
let searchTerm = "";

const allergenList = document.getElementById("allergenList");
const categoryList = document.getElementById("categoryList");
const subcategoryList = document.getElementById("subcategoryList");
const productList = document.getElementById("productList");
const filterMessage = document.getElementById("filterMessage");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function slugify(value) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getGroupId(category, subcategory) {
  return `group-${slugify(category)}-${slugify(subcategory)}`;
}

function getSubcategories(category) {
  const group = MENU_DATA.find(item => item.category === category);
  return group ? group.subcategories.map(item => item.name) : [];
}

function renderAllergens() {
  allergenList.innerHTML = ALLERGENS.map(item => `
    <label class="allergen-option">
      <input type="checkbox" value="${item.id}" aria-label="${escapeHTML(item.label)}">
      <span>${escapeHTML(item.label)}</span>
    </label>
  `).join("");

  allergenList.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked) selectedAllergens.add(input.value);
      else selectedAllergens.delete(input.value);
      renderProducts();
    });
  });
}

function renderCategories() {
  categoryList.innerHTML = CATEGORIES.map(category => `
    <button
      type="button"
      class="category-btn ${category === activeCategory ? "active" : ""}"
      data-category="${escapeHTML(category)}"
    >${escapeHTML(category)}</button>
  `).join("");

  categoryList.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      activeSubcategory = "";
      renderCategories();
      renderSubcategories();
      renderProducts();
    });
  });
}

function renderSubcategories() {
  if (activeCategory === "Tümü") {
    subcategoryList.innerHTML = "";
    subcategoryList.hidden = true;
    return;
  }

  const subcategories = getSubcategories(activeCategory);
  subcategoryList.hidden = subcategories.length === 0;
  subcategoryList.innerHTML = subcategories.map(subcategory => `
    <button
      type="button"
      class="subcategory-btn ${subcategory === activeSubcategory ? "active" : ""}"
      data-subcategory="${escapeHTML(subcategory)}"
    >${escapeHTML(subcategory)}</button>
  `).join("");

  subcategoryList.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeSubcategory = button.dataset.subcategory;
      renderSubcategories();
      renderProducts();

      requestAnimationFrame(() => {
        const target = document.getElementById(
          getGroupId(activeCategory, activeSubcategory)
        );
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });
}

function getVisibleProducts() {
  const query = searchTerm.trim().toLocaleLowerCase("tr-TR");

  return PRODUCTS.filter(product => {
    // Alerjen seçilirse doğrulanmamış ürünler gösterilmez.
    if (selectedAllergens.size > 0 && product.allergensVerified !== true) {
      return false;
    }

    const containsSelectedAllergen = [...selectedAllergens].some(id =>
      product.allergens.includes(id)
    );
    if (containsSelectedAllergen) return false;

    const matchesCategory =
      activeCategory === "Tümü" || product.category === activeCategory;

    const matchesSubcategory =
      !activeSubcategory || product.subcategory === activeSubcategory;

    const searchableText = [
      product.name,
      product.category,
      product.subcategory,
      product.description
    ].join(" ").toLocaleLowerCase("tr-TR");

    return matchesCategory && matchesSubcategory &&
      (!query || searchableText.includes(query));
  });
}

function renderProductCard(product) {
  return `
    <article class="product-card">
      <div class="product-art">
        <span class="product-emoji" aria-hidden="true">
          ${escapeHTML(product.emoji)}
        </span>

        <img
          class="product-photo"
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="this.style.display='none';"
        >
      </div>

      <div class="product-content">
        <div class="product-top">
          <h3 class="product-name">${escapeHTML(product.name)}</h3>
          <span class="product-price">Fiyat bilgisi yok</span>
        </div>

        <p class="product-description">
          Ürün açıklaması henüz eklenmedi.
        </p>

        <div class="product-tags">
          <span class="product-tag">
            Alerjen bilgisi doğrulanmadı
          </span>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  const groups = [];

  visibleProducts.forEach(product => {
    let group = groups.find(item =>
      item.category === product.category &&
      item.subcategory === product.subcategory
    );

    if (!group) {
      group = {
        category: product.category,
        subcategory: product.subcategory,
        products: []
      };
      groups.push(group);
    }

    group.products.push(product);
  });

  productList.innerHTML = groups.map(group => {
    const heading = activeCategory === "Tümü"
      ? `${group.category} · ${group.subcategory}`
      : group.subcategory;

    return `
      <section class="product-group" id="${getGroupId(group.category, group.subcategory)}">
        <div class="product-group-heading">
          <h3>${escapeHTML(heading)}</h3>
          <span>${group.products.length} ürün</span>
        </div>
        <div class="product-grid">
          ${group.products.map(renderProductCard).join("")}
        </div>
      </section>
    `;
  }).join("");

  productList.hidden = visibleProducts.length === 0;
  emptyMessage.hidden = visibleProducts.length !== 0;
  resultCount.textContent = `${visibleProducts.length} ürün`;

  if (selectedAllergens.size > 0) {
    const names = [...selectedAllergens]
      .map(id => ALLERGENS.find(item => item.id === id)?.label)
      .filter(Boolean);

    filterMessage.textContent =
      `${names.join(", ")} seçildi. Alerjen bilgisi doğrulanmamış ürünler gösterilmiyor. ${visibleProducts.length} ürün listelendi.`;
  } else {
    filterMessage.textContent =
      `Henüz alerjen seçilmedi. ${visibleProducts.length} ürün listeleniyor.`;
  }
}

function clearFilters() {
  selectedAllergens.clear();
  searchTerm = "";
  activeCategory = "Tümü";
  activeSubcategory = "";

  allergenList.querySelectorAll("input").forEach(input => {
    input.checked = false;
  });

  searchInput.value = "";
  renderCategories();
  renderSubcategories();
  renderProducts();
}

document.getElementById("clearFilters").addEventListener("click", clearFilters);
document.getElementById("emptyClear").addEventListener("click", clearFilters);

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});

function createQRCode() {
  const qrElement = document.getElementById("qrcode");
  const message = document.getElementById("qrMessage");

  if (typeof QRCode === "undefined") {
    message.textContent = "QR kütüphanesi yüklenemedi. İnternet bağlantısını kontrol et.";
    return;
  }

  qrElement.innerHTML = "";

  new QRCode(qrElement, {
    text: window.location.href.split("#")[0],
    width: 180,
    height: 180,
    colorDark: "#20251f",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  message.textContent =
    location.protocol === "file:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1"
      ? "Bu yerel bir önizleme. Gerçek QR kodu için siteyi yayınla."
      : "Menü bağlantısının QR kodu hazır.";
}

document.getElementById("downloadQR").addEventListener("click", () => {
  const qrElement = document.getElementById("qrcode");
  const canvas = qrElement.querySelector("canvas");
  const image = qrElement.querySelector("img");

  const dataUrl = canvas
    ? canvas.toDataURL("image/png")
    : image && image.src.startsWith("data:image")
      ? image.src
      : "";

  if (!dataUrl) {
    document.getElementById("qrMessage").textContent =
      "QR kod henüz hazır değil. Sayfayı yenileyip tekrar dene.";
    return;
  }

  const link = document.createElement("a");
  link.download = "aksarayuni-menu-qr.png";
  link.href = dataUrl;
  link.click();
});

renderAllergens();
renderCategories();
renderSubcategories();
renderProducts();

if (document.readyState === "complete") {
  createQRCode();
} else {
  window.addEventListener("load", createQRCode, { once: true });
}
