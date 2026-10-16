/*
 AKSARAY ÜNİVERSİTESİ DİJİTAL MENÜ

  Ürünleri PRODUCTS listesinden düzenle.
  Fiyatı sayı olarak gir.
  Alerjen adlarını ALLERGENS listesindeki ID'lerle yaz.

  ÖNEMLİ:
  Örnek ürünler ve alerjen kayıtları DEMO amaçlıdır.
  Gerçek menüde her ürünün içeriğini doğrulamadan
  allergensVerified değerini true yapma.
*/

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

const CATEGORIES = [
  "Tümü",
  "Kahvaltı",
  "Başlangıçlar",
  "Atıştırmalıklar",
  "Ana yemekler",
  "Salatalar",
  "Tatlılar",
  "İçecekler"
];

/*
  ÜRÜN EKLEME ÖRNEĞİ:

  {
    id: 13,
    name: "Sebzeli Bowl",
    category: "Ana yemekler",
    price: 220,
    description: "Mevsim sebzeleri ve pirinç.",
    emoji: "🥗",
    color: "#dce8d6",
    badge: "Vegan",
    allergens: ["sesame", "soy"],
    allergensVerified: false
  }

  allergensVerified:
  true  = İçerik ve alerjen bilgileri doğrulandı.
  false = Bilgiler henüz doğrulanmadı.

  Doğrulanmamış ürünler, bir alerjen filtresi
  seçildiğinde sonuçlarda gösterilmez.
*/

const PRODUCTS = [
  {
    id: 1,
    name: "Kremalı Mantarlı Makarna",
    category: "Ana yemekler",
    price: 245,
    description: "Krema, mantar, parmesan ve taze otlar.",
    emoji: "🍝",
    color: "#e7e0d0",
    badge: "Çok sevilen",
    allergens: ["gluten", "milk"],
    allergensVerified: true
  },
  {
    id: 2,
    name: "Izgara Tavuk Tabağı",
    category: "Ana yemekler",
    price: 295,
    description: "Izgara tavuk, sebzeler ve limonlu sos.",
    emoji: "🍗",
    color: "#e9d9c6",
    badge: "",
    allergens: [],
    allergensVerified: true
  },
  {
    id: 3,
    name: "Akdeniz Salatası",
    category: "Salatalar",
    price: 185,
    description: "Domates, salatalık, zeytin ve beyaz peynir.",
    emoji: "🥗",
    color: "#dce8d6",
    badge: "Vejetaryen",
    allergens: ["milk"],
    allergensVerified: true
  },
  {
    id: 4,
    name: "Mercimek Çorbası",
    category: "Başlangıçlar",
    price: 105,
    description: "Kırmızı mercimek ve günlük hazırlanan sebzeler.",
    emoji: "🍲",
    color: "#ead9bd",
    badge: "",
    allergens: [],
    allergensVerified: true
  },
  {
    id: 5,
    name: "Fırınlanmış Somon",
    category: "Ana yemekler",
    price: 365,
    description: "Fırın somon, patates ve yeşil salata.",
    emoji: "🐟",
    color: "#f0d7c7",
    badge: "Şefin seçimi",
    allergens: ["fish"],
    allergensVerified: true
  },
  {
    id: 6,
    name: "Çikolatalı Brownie",
    category: "Tatlılar",
    price: 145,
    description: "Yoğun çikolatalı brownie.",
    emoji: "🍫",
    color: "#e4d4cc",
    badge: "",
    allergens: ["gluten", "milk", "egg", "soy"],
    allergensVerified: true
  },
  {
    id: 7,
    name: "Mevsim Meyve Tabağı",
    category: "Tatlılar",
    price: 120,
    description: "Mevsimine göre seçilmiş meyveler.",
    emoji: "🍓",
    color: "#f0d9d6",
    badge: "Vegan",
    allergens: [],
    allergensVerified: true
  },
  {
    id: 8,
    name: "Humus ve Sebzeler",
    category: "Başlangıçlar",
    price: 155,
    description: "Nohut, tahin, limon ve zeytinyağı.",
    emoji: "🥙",
    color: "#e8e0c9",
    badge: "Vegan",
    allergens: ["sesame"],
    allergensVerified: true
  },
  {
    id: 9,
    name: "Fıstıklı Cheesecake",
    category: "Tatlılar",
    price: 165,
    description: "Kremalı cheesecake ve bisküvi tabanı.",
    emoji: "🍰",
    color: "#e8ddc9",
    badge: "",
    allergens: ["gluten", "milk", "egg", "peanut"],
    allergensVerified: true
  },
  {
    id: 10,
    name: "Ev Yapımı Limonata",
    category: "İçecekler",
    price: 85,
    description: "Taze limon, nane ve hafif şeker.",
    emoji: "🍋",
    color: "#e8edc9",
    badge: "Serinletici",
    allergens: [],
    allergensVerified: true
  },
  {
    id: 11,
    name: "Susamlı Tavuk Bowl",
    category: "Ana yemekler",
    price: 265,
    description: "Tavuk, pirinç, sebze ve susamlı sos.",
    emoji: "🍚",
    color: "#dfe5d8",
    badge: "",
    allergens: ["sesame", "soy"],
    allergensVerified: true
  },
  {
    id: 12,
    name: "Avokadolu Yeşil Salata",
    category: "Salatalar",
    price: 195,
    description: "Avokado, roka, salatalık ve limon.",
    emoji: "🥑",
    color: "#d8e4d1",
    badge: "Vegan",
    allergens: [],
    allergensVerified: true
  }
];

// Sayfa elemanları
const selectedAllergens = new Set();

let activeCategory = "Tümü";
let searchTerm = "";

const allergenList = document.getElementById("allergenList");
const categoryList = document.getElementById("categoryList");
const productList = document.getElementById("productList");
const filterMessage = document.getElementById("filterMessage");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");

// Alerjen filtrelerini oluştur
function renderAllergens() {
  allergenList.innerHTML = ALLERGENS.map(item => `
    <label class="allergen-option">
      <input
        type="checkbox"
        value="${item.id}"
        aria-label="${item.label}"
      >
      <span>${item.label}</span>
    </label>
  `).join("");

  allergenList.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked) {
        selectedAllergens.add(input.value);
      } else {
        selectedAllergens.delete(input.value);
      }

      renderProducts();
    });
  });
}

// Kategori düğmelerini oluştur
function renderCategories() {
  categoryList.innerHTML = CATEGORIES.map(category => `
    <button
      type="button"
      class="category-btn ${
        category === activeCategory ? "active" : ""
      }"
      data-category="${category}"
    >${category}</button>
  `).join("");

  categoryList.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;

      renderCategories();
      renderProducts();
    });
  });
}

// Fiyatı Türk lirası biçiminde göster
function formatPrice(price) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0
  }).format(price);
}

// HTML içine güvenli metin yerleştir
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

// Seçimlere uygun ürünleri belirle
function getVisibleProducts() {
  return PRODUCTS.filter(product => {
    const allergens = product.allergens || [];

    // Alerjen seçilmişse doğrulanmamış ürünleri gösterme
    if (selectedAllergens.size > 0 &&
        product.allergensVerified !== true) {
      return false;
    }

    // Seçilen alerjenlerden herhangi birini içerenleri çıkar
    const hasSelectedAllergen = [...selectedAllergens].some(
      allergen => allergens.includes(allergen)
    );

    if (hasSelectedAllergen) {
      return false;
    }

    // Kategori filtresi
    const matchesCategory =
      activeCategory === "Tümü" ||
      product.category === activeCategory;

    // Türkçe karakterleri dikkate alan arama
    const query = searchTerm
      .trim()
      .toLocaleLowerCase("tr-TR");

    const searchableText = [
      product.name,
      product.description,
      product.category
    ].join(" ").toLocaleLowerCase("tr-TR");

    const matchesSearch =
      !query || searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });
}

// Ürün kartlarını oluştur
function renderProducts() {
  const visibleProducts = getVisibleProducts();

  productList.innerHTML = visibleProducts.map(product => {
    const allergens = product.allergens || [];

    const allergenNames = allergens
      .map(id => ALLERGENS.find(a => a.id === id)?.label)
      .filter(Boolean);

    let tags = "";

    if (product.allergensVerified !== true) {
      tags = `<span class="product-tag">
        Alerjen bilgisi doğrulanmadı
      </span>`;
    } else if (allergenNames.length > 0) {
      tags = allergenNames.map(name => `
        <span class="product-tag">${escapeHTML(name)}</span>
      `).join("");
    } else {
      tags = `<span class="product-tag">
        Kayıtlarda alerjen belirtilmedi
      </span>`;
    }

    return `
      <article class="product-card">
        <div
          class="product-art"
          style="background:${escapeHTML(product.color || "#e8e8df")}"
        >
          ${
            product.badge
              ? `<span class="product-badge">${escapeHTML(product.badge)}</span>`
              : ""
          }
          <span class="product-emoji" aria-hidden="true">
            ${escapeHTML(product.emoji || "🍽️")}
          </span>
        </div>

        <div class="product-content">
          <div class="product-top">
            <h3 class="product-name">${escapeHTML(product.name)}</h3>
            <span class="product-price">${formatPrice(product.price)}</span>
          </div>

          <p class="product-description">
            ${escapeHTML(product.description)}
          </p>

          <div class="product-tags">${tags}</div>
        </div>
      </article>
    `;
  }).join("");

  productList.hidden = visibleProducts.length === 0;
  emptyMessage.hidden = visibleProducts.length !== 0;

  resultCount.textContent = `${visibleProducts.length} ürün`;

  if (selectedAllergens.size > 0) {
    const names = [...selectedAllergens]
      .map(id => ALLERGENS.find(a => a.id === id)?.label)
      .filter(Boolean);

    filterMessage.textContent =
      `${names.join(", ")} içeren ve alerjen bilgisi doğrulanmamış ürünler gösterilmiyor. ${visibleProducts.length} ürün listelendi.`;
  } else {
    filterMessage.textContent =
      `Henüz alerjen seçilmedi. ${visibleProducts.length} ürün listeleniyor.`;
  }
}

// Filtreleri sıfırla
function clearFilters() {
  selectedAllergens.clear();
  searchTerm = "";
  activeCategory = "Tümü";

  allergenList.querySelectorAll("input").forEach(input => {
    input.checked = false;
  });

  searchInput.value = "";

  renderCategories();
  renderProducts();
}

document.getElementById("clearFilters")
  .addEventListener("click", clearFilters);

document.getElementById("emptyClear")
  .addEventListener("click", clearFilters);

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});

// QR kodu oluştur
function createQRCode() {
  const qrElement = document.getElementById("qrcode");
  const message = document.getElementById("qrMessage");

  if (typeof QRCode === "undefined") {
    message.textContent =
      "QR kütüphanesi yüklenemedi. İnternet bağlantısını kontrol et.";
    return;
  }

  qrElement.innerHTML = "";

  const url = window.location.href.split("#")[0];

  new QRCode(qrElement, {
    text: url,
    width: 180,
    height: 180,
    colorDark: "#20251f",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  if (
    location.protocol === "file:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1"
  ) {
    message.textContent =
      "Bu yerel bir önizleme. Gerçek QR kodu için siteyi yayınla.";
  } else {
    message.textContent = "Menü bağlantısının QR kodu hazır.";
  }
}

// QR kodunu PNG olarak indir
document.getElementById("downloadQR")
  .addEventListener("click", () => {
    const qrElement = document.getElementById("qrcode");
    const canvas = qrElement.querySelector("canvas");
    const image = qrElement.querySelector("img");

    let dataUrl = "";

    if (canvas) {
      dataUrl = canvas.toDataURL("image/png");
    } else if (image && image.src.startsWith("data:image")) {
      dataUrl = image.src;
    }

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

// İlk açılış
renderAllergens();
renderCategories();
renderProducts();

if (document.readyState === "complete") {
  createQRCode();
} else {
  window.addEventListener("load", createQRCode, { once: true });
}
