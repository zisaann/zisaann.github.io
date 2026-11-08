
/*
  AKSARAY ÜNİVERSİTESİ DİJİTAL MENÜ
  Supabase üzerinden menü verilerini yükler.

  Alerjen filtresi:
  Seçilen alerjenlerden herhangi biriyle ilişkili
  ürünler gizlenir. Doğrulanmış/doğrulanmamış
  ayrımı yapılmaz.
*/

// ==========================================
// MENÜ VERİLERİ
// ==========================================

let MENU_DATA = [];
let CATEGORIES = ["Tümü"];
let ALLERGENS = [];
let PRODUCTS = [];

const selectedAllergens = new Set();

let activeCategory = "Tümü";
let activeSubcategory = "";
let searchTerm = "";

// ==========================================
// HTML ELEMENTLERİ
// ==========================================

const allergenList = document.getElementById("allergenList");
const categoryList = document.getElementById("categoryList");
const subcategoryList = document.getElementById("subcategoryList");
const productList = document.getElementById("productList");
const filterMessage = document.getElementById("filterMessage");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");

// ==========================================
// YARDIMCI FONKSİYONLAR
// ==========================================

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
  return String(value ?? "")
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
  const group = MENU_DATA.find(
    item => item.category === category
  );

  return group
    ? group.subcategories.map(item => item.name)
    : [];
}

// ==========================================
// MENÜ İSTATİSTİKLERİNİ KAYDET
// ==========================================

async function trackMenuAnalytics(eventType, productId = null) {
  try {
    const { error } = await supabaseClient
      .from("menu_analytics")
      .insert({
        event_type: eventType,
        product_id: productId
      });

    if (error) {
      console.error("İstatistik kaydedilemedi:", error);
    }
  } catch (error) {
    console.error("İstatistik kayıt hatası:", error);
  }
}

  return group
    ? group.subcategories.map(item => item.name)
    : [];
}

// ==========================================
// SUPABASE'DEN MENÜ VERİLERİNİ YÜKLE
// ==========================================

async function loadMenuData() {
  try {
    const [
      categoriesResult,
      subcategoriesResult,
      productsResult,
      allergensResult,
      relationsResult
    ] = await Promise.all([

      supabaseClient
        .from("categories")
        .select("id, name, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order"),

      supabaseClient
        .from("subcategories")
        .select("id, category_id, name, emoji, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order"),

      supabaseClient
        .from("products")
        .select("id, subcategory_id, name, description, price, calories, image_url, emoji, allergens_verified, is_active, sort_order")
        .eq("is_active", true)
        .order("sort_order"),

      supabaseClient
        .from("allergens")
        .select("id, name, sort_order")
        .order("sort_order"),

      supabaseClient
        .from("product_allergens")
        .select("product_id, allergen_id")

    ]);

    const results = [
      categoriesResult,
      subcategoriesResult,
      productsResult,
      allergensResult,
      relationsResult
    ];

    const failedResult = results.find(result => result.error);

    if (failedResult) {
      throw failedResult.error;
    }

    const categories = categoriesResult.data || [];
    const subcategories = subcategoriesResult.data || [];
    const productRows = productsResult.data || [];
    const allergenRows = allergensResult.data || [];
    const relationRows = relationsResult.data || [];

    // Alerjen listesini oluştur
    ALLERGENS = allergenRows.map(allergen => ({
      id: allergen.id,
      label: allergen.name
    }));

    // Ürün-alerjen ilişkilerini eşleştir
    const allergensByProduct = new Map();

    relationRows.forEach(relation => {
      if (!allergensByProduct.has(relation.product_id)) {
        allergensByProduct.set(relation.product_id, []);
      }

      allergensByProduct
        .get(relation.product_id)
        .push(relation.allergen_id);
    });

    // Kategorileri ve alt kategorileri oluştur
    MENU_DATA = categories.map(category => ({
      category: category.name,

      subcategories: subcategories
        .filter(subcategory =>
          subcategory.category_id === category.id
        )
        .map(subcategory => ({
          name: subcategory.name,
          emoji: subcategory.emoji || "🍽️",

          products: productRows
            .filter(product =>
              product.subcategory_id === subcategory.id
            )
            .map(product => product.name)
        }))
    }));

    CATEGORIES = [
      "Tümü",
      ...MENU_DATA.map(item => item.category)
    ];

    // Alt kategori eşleştirmeleri
    const subcategoryById = new Map(
      subcategories.map(item => [item.id, item])
    );

    // Kategori eşleştirmeleri
    const categoryById = new Map(
      categories.map(item => [item.id, item])
    );

    // Ürünleri site sistemine uygun hale getir
    PRODUCTS = productRows
      .map(product => {
        const subcategory = subcategoryById.get(
          product.subcategory_id
        );

        if (!subcategory) return null;

        const category = categoryById.get(
          subcategory.category_id
        );

        if (!category) return null;

        return {
          id: product.id,
          name: product.name,
          category: category.name,
          subcategory: subcategory.name,
          emoji: product.emoji || subcategory.emoji || "🍽️",
          image: product.image_url || "",
          price: product.price == null
            ? null
            : Number(product.price),
          description: product.description || "",
          calories: product.calories == null
            ? null
            : Number(product.calories),
          allergens: allergensByProduct.get(product.id) || [],
          allergensVerified: product.allergens_verified === true
        };
      })
      .filter(Boolean);

    // Ekranları yenile
    renderAllergens();
    renderCategories();
    renderSubcategories();
    renderProducts();

    console.log("Menü Supabase'den yüklendi:", PRODUCTS.length, "ürün");
    console.log("Kategori sayısı:", CATEGORIES.length - 1);
    console.log("Alerjen sayısı:", ALLERGENS.length);
    console.log("Ürün-alerjen bağlantısı:", relationRows.length);

  } catch (error) {
    console.error("Menü yüklenirken hata oluştu:", error);

    productList.hidden = false;
    emptyMessage.hidden = true;

    productList.innerHTML =
      "<p>Menü yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>";
  }
}

// ==========================================
// ALERJENLERİ GÖSTER
// ==========================================

function renderAllergens() {
  if (!allergenList) return;

  allergenList.innerHTML = ALLERGENS.map(item => `
    <label class="allergen-option">
      <input
        type="checkbox"
        value="${escapeHTML(item.id)}"
        aria-label="${escapeHTML(item.label)}"
      >
      <span>${escapeHTML(item.label)}</span>
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

// ==========================================
// KATEGORİLERİ GÖSTER
// ==========================================

function renderCategories() {
  if (!categoryList) return;

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

// ==========================================
// ALT KATEGORİLERİ GÖSTER
// ==========================================

function renderSubcategories() {
  if (!subcategoryList) return;

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

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  });
}

// ==========================================
// GÖRÜNÜR ÜRÜNLERİ BELİRLE
// ==========================================

function getVisibleProducts() {
  return PRODUCTS.filter(product => {

    // Kategori filtresi
    if (
      activeCategory !== "Tümü" &&
      product.category !== activeCategory
    ) {
      return false;
    }

    // Alt kategori filtresi
    if (
      activeSubcategory &&
      product.subcategory !== activeSubcategory
    ) {
      return false;
    }

    // Arama filtresi
    const normalizedSearch = searchTerm
      .trim()
      .toLocaleLowerCase("tr-TR");

    const searchableText = [
      product.name,
      product.description,
      product.category,
      product.subcategory
    ].join(" ").toLocaleLowerCase("tr-TR");

    if (
      normalizedSearch &&
      !searchableText.includes(normalizedSearch)
    ) {
      return false;
    }

    // Alerjen filtresi
    // Seçilen alerjenlerden herhangi birini içeren ürün gizlenir.
    // Doğrulanmış veya doğrulanmamış olması fark etmez.
    if (
      selectedAllergens.size > 0 &&
      product.allergens.some(allergen =>
        selectedAllergens.has(allergen)
      )
    ) {
      return false;
    }

    return true;
  });
}

// ==========================================
// ÜRÜN KARTI OLUŞTUR
// ==========================================

function renderProductCard(product) {
  return `
    <article
      class="product-card"
      data-product-id="${escapeHTML(product.id)}"
      tabindex="0"
      role="button"
      aria-label="${escapeHTML(product.name)} ayrıntılarını aç"
    >
      <div class="product-art">
        <span class="product-emoji" aria-hidden="true">
          ${escapeHTML(product.emoji)}
        </span>

        ${product.image ? `
          <img
            class="product-photo"
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
            onerror="this.style.display='none';"
          >
        ` : ""}
      </div>

      <div class="product-content">

        <div class="product-top">
          <h3 class="product-name">
            ${escapeHTML(product.name)}
          </h3>

          <span class="product-price">
            ${product.price != null
              ? `${product.price.toLocaleString("tr-TR")} TL`
              : "Fiyat belirtilmedi"}
          </span>
        </div>

        <p class="product-description">
          ${escapeHTML(
            product.description ||
            "Ürün açıklaması henüz eklenmedi."
          )}
        </p>

        <p class="product-calories">
          <span aria-hidden="true">🔥</span>
          ${product.calories != null
            ? `Yaklaşık ${product.calories} kcal / porsiyon`
            : "Kalori bilgisi eklenmedi"}
        </p>

        <div class="product-tags">
          <span class="product-tag">
            Olası alerjenler: ${
              product.allergens.length
                ? escapeHTML(
                    product.allergens
                      .map(id =>
                        ALLERGENS.find(a => a.id === id)?.label || id
                      )
                      .join(", ")
                  )
                : "Alerjen bilgisi henüz eklenmedi"
            }
          </span>

          ${!product.allergensVerified ? `
            <span class="product-tag allergen-warning">
              ⓘ Alerjen bilgisi henüz doğrulanmadı
            </span>
          ` : ""}
        </div>

      </div>
    </article>
  `;
}

// ==========================================
// ÜRÜNLERİ GÖSTER
// ==========================================

function renderProducts() {
  if (!productList) return;

  const visibleProducts = getVisibleProducts();
  const groups = [];

  // Kategori ve alt kategori sırasını koru
  MENU_DATA.forEach(category => {

    if (
      activeCategory !== "Tümü" &&
      activeCategory !== category.category
    ) {
      return;
    }

    category.subcategories.forEach(subcategory => {

      if (
        activeSubcategory &&
        activeSubcategory !== subcategory.name
      ) {
        return;
      }

      const groupProducts = visibleProducts.filter(product =>
        product.category === category.category &&
        product.subcategory === subcategory.name
      );

      if (groupProducts.length > 0) {
        groups.push({
          category: category.category,
          subcategory: subcategory.name,
          products: groupProducts
        });
      }
    });
  });

  productList.innerHTML = groups.map(group => {

    const heading = activeCategory === "Tümü"
      ? `${group.category} · ${group.subcategory}`
      : group.subcategory;

    return `
      <section
        class="product-group"
        id="${getGroupId(group.category, group.subcategory)}"
      >
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

  if (emptyMessage) {
    emptyMessage.hidden = visibleProducts.length !== 0;
  }

  if (resultCount) {
    resultCount.textContent = `${visibleProducts.length} ürün`;
  }

  if (filterMessage) {
    if (selectedAllergens.size > 0) {
      const names = [...selectedAllergens]
        .map(id =>
          ALLERGENS.find(item => item.id === id)?.label
        )
        .filter(Boolean);

      filterMessage.textContent =
        `${names.join(", ")} filtresi uygulandı. ${visibleProducts.length} ürün listeleniyor. Doğrulanmamış ürünler de listede bulunabilir.`;

    } else {
      filterMessage.textContent =
        `Henüz alerjen seçilmedi. ${visibleProducts.length} ürün listeleniyor.`;
    }
  }
}

// ==========================================
// ÜRÜN DETAY PENCERESİ
// ==========================================

function openProductModal(product) {
  if (!product) return;
  
  trackMenuAnalytics("product_view", product.id);

  let modal = document.getElementById("productModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "productModal";
    modal.className = "product-modal";
    modal.hidden = true;

    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "productModalTitle");

    document.body.appendChild(modal);
  }

  const allergenText = product.allergens.length
    ? product.allergens
        .map(id =>
          ALLERGENS.find(item => item.id === id)?.label || id
        )
        .join(", ")
    : "İçerik bilgisi işletme tarafından kontrol edilmelidir.";

  modal.innerHTML = `
    <div class="product-modal-content">

      <button
        type="button"
        class="product-modal-close"
        aria-label="Pencereyi kapat"
      >×</button>

      ${product.image ? `
        <img
          class="product-modal-image"
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
        >
      ` : ""}

      <div class="product-modal-details">

        <span class="product-modal-category">
          ${escapeHTML(product.category)}
          ·
          ${escapeHTML(product.subcategory)}
        </span>

        <h2 id="productModalTitle">
          ${escapeHTML(product.name)}
        </h2>

        <p class="product-modal-price">
          ${product.price != null
            ? `${product.price.toLocaleString("tr-TR")} TL`
            : "Fiyat belirtilmedi"}
        </p>

        <p class="product-modal-calories">
          🔥 ${product.calories != null
            ? `Yaklaşık ${product.calories} kcal / porsiyon`
            : "Kalori bilgisi eklenmedi"}
        </p>

        <h3>Ürün hakkında</h3>

        <p>
          ${escapeHTML(
            product.description ||
            "Ürün açıklaması henüz eklenmedi."
          )}
        </p>

        <h3>Olası alerjenler</h3>

        <p>${escapeHTML(allergenText)}</p>

        <p class="product-modal-warning">
          ⓘ Alerjen bilgileri işletme tarafından doğrulanmalıdır.
        </p>

      </div>
    </div>
  `;

  modal.hidden = false;
  document.body.classList.add("modal-open");

  const closeButton = modal.querySelector(
    ".product-modal-close"
  );

  closeButton.focus();

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  closeButton.addEventListener("click", closeModal);

  modal.onclick = event => {
    if (event.target === modal) {
      closeModal();
    }
  };

  modal.onkeydown = event => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  const modalImage = modal.querySelector(
    ".product-modal-image"
  );

  if (modalImage) {
    modalImage.addEventListener("error", () => {
      modalImage.style.display = "none";
    }, { once: true });
  }
}

// ==========================================
// ÜRÜN KARTI TIKLAMA
// ==========================================

productList.addEventListener("click", event => {
  const card = event.target.closest(".product-card");

  if (!card) return;

  const product = PRODUCTS.find(
    item => item.id === card.dataset.productId
  );

  openProductModal(product);
});

// ==========================================
// KLAVYEYLE ÜRÜN DETAYI AÇMA
// ==========================================

productList.addEventListener("keydown", event => {
  if (
    event.target.closest(
      "button, a, input, textarea, select"
    )
  ) {
    return;
  }

  if (
    event.key !== "Enter" &&
    event.key !== " "
  ) {
    return;
  }

  const card = event.target.closest(".product-card");

  if (!card) return;

  event.preventDefault();

  const product = PRODUCTS.find(
    item => item.id === card.dataset.productId
  );

  openProductModal(product);
});

// ==========================================
// FİLTRELERİ TEMİZLE
// ==========================================

function clearFilters() {
  selectedAllergens.clear();

  searchTerm = "";
  activeCategory = "Tümü";
  activeSubcategory = "";

  if (allergenList) {
    allergenList.querySelectorAll("input").forEach(input => {
      input.checked = false;
    });
  }

  if (searchInput) {
    searchInput.value = "";
  }

  renderCategories();
  renderSubcategories();
  renderProducts();
}

const clearFiltersButton = document.getElementById("clearFilters");
const emptyClearButton = document.getElementById("emptyClear");

if (clearFiltersButton) {
  clearFiltersButton.addEventListener("click", clearFilters);
}

if (emptyClearButton) {
  emptyClearButton.addEventListener("click", clearFilters);
}

// ==========================================
// ARAMA
// ==========================================

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});

// ==========================================
// QR KODU OLUŞTUR
// ==========================================

function createQRCode() {
  const qrElement = document.getElementById("qrcode");
  const message = document.getElementById("qrMessage");

  if (!qrElement || !message) return;

  if (typeof QRCode === "undefined") {
    message.textContent =
      "QR kütüphanesi yüklenemedi. İnternet bağlantısını kontrol et.";

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
// ==========================================
// ALERJEN BÖLÜMÜNÜ AÇIP KAPAT
// ==========================================

const allergenToggleBtn = document.getElementById("allergenToggleBtn");
const allergenSection = document.getElementById("allergens");

if (allergenToggleBtn && allergenSection) {
  allergenToggleBtn.addEventListener("click", () => {

    const isHidden = allergenSection.hidden;

    allergenSection.hidden = !isHidden;

    allergenToggleBtn.innerHTML = isHidden
      ? 'Alerjenleri gizle <span>⌃</span>'
      : 'Alerjenleri incele <span>⌄</span>';

    if (isHidden) {
      setTimeout(() => {
        allergenSection.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 50);
    }
  });
}

// ==========================================
// BAŞLAT
// ==========================================
// ==========================================
// İŞLETME BİLGİLERİNİ YÜKLE
// ==========================================

async function loadBusinessSettings() {
  try {
    const { data, error } = await supabaseClient
      .from("business_settings")
      .select("business_name, logo_url, address, phone, business_hours, description")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return;

    const setText = (id, value) => {
      const element = document.getElementById(id);
      if (element && value) {
        element.textContent = value;
      }
    };

    setText("businessNameHero", data.business_name);
    setText("businessNameQR", data.business_name);
    setText("businessNameHeader", data.business_name);
    setText("businessNameFooter", data.business_name);
    setText("businessDescriptionFooter", data.description);
    setText("businessAddressFooter", data.address);
    setText("businessPhoneFooter", data.phone);
    setText("businessHoursFooter", data.business_hours);

  } catch (error) {
    console.error("İşletme bilgileri yüklenemedi:", error);
  }
}
loadMenuData();
loadBusinessSettings();
// Menü ziyareti kaydı
trackMenuAnalytics("menu_visit");

if (document.readyState === "complete") {
  createQRCode();
} else {
  window.addEventListener(
    "load",
    createQRCode,
    { once: true }
  );
}
