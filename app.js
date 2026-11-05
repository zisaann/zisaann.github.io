/*
  AKSARAY ÜNİVERSİTESİ DİJİTAL MENÜ
  Ürün fiyatları varsa gösterilir.
  Alerjen filtreleri seçildiğinde alerjen bilgisi
  doğrulanmamış ürünler gösterilmez.
*/

// Supabase'den yüklenecek menü verileri
let MENU_DATA = [];
let CATEGORIES = ["Tümü"];
let ALLERGENS = [];
let PRODUCTS = [];

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
        .filter(subcategory => subcategory.category_id === category.id)
        .map(subcategory => ({
          name: subcategory.name,
          emoji: subcategory.emoji || "🍽️",

          products: productRows
            .filter(product => product.subcategory_id === subcategory.id)
            .map(product => product.name)
        }))
    }));

    CATEGORIES = [
      "Tümü",
      ...MENU_DATA.map(item => item.category)
    ];

    // Ürünleri mevcut site sisteminin anlayacağı biçime dönüştür
    const subcategoryById = new Map(
      subcategories.map(item => [item.id, item])
    );

    const categoryById = new Map(
      categories.map(item => [item.id, item])
    );

    PRODUCTS = productRows
      .map(product => {
        const subcategory = subcategoryById.get(product.subcategory_id);

        if (!subcategory) return null;

        const category = categoryById.get(subcategory.category_id);

        if (!category) return null;

        return {
          id: product.id,
          name: product.name,
          category: category.name,
          subcategory: subcategory.name,
          emoji: product.emoji || subcategory.emoji || "🍽️",
          image: product.image_url || "",
          price: product.price == null ? null : Number(product.price),
          description: product.description || "",
          calories: product.calories == null
            ? null
            : Number(product.calories),
          allergens: allergensByProduct.get(product.id) || [],
          allergensVerified: product.allergens_verified === true
        };
      })
      .filter(Boolean);

    // Veriler geldikten sonra mevcut ekranları yenile
    renderAllergens();
    renderCategories();
    renderSubcategories();
    renderProducts();

    console.log("Menü Supabase'den yüklendi:", PRODUCTS.length, "ürün");

  } catch (error) {
    console.error("Menü yüklenirken hata oluştu:", error);

    productList.hidden = false;
    emptyMessage.hidden = true;
    productList.innerHTML =
      "<p>Menü yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>";
  }
}

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
  // Alerjen filtresi seçildiğinde doğrulanmamış ürünleri gizle
  if (selectedAllergens.size > 0 && !product.allergensVerified) {
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
  <h3 class="product-name">${escapeHTML(product.name)}</h3>
  <span class="product-price">
    ${product.price != null
      ? `${product.price.toLocaleString("tr-TR")} TL`
      : "Fiyat belirtilmedi"}
  </span>
</div>

<p class="product-description">
  ${escapeHTML(product.description || "Ürün açıklaması henüz eklenmedi.")}
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
              .map(id => ALLERGENS.find(a => a.id === id)?.label || id)
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


function renderProducts() {
  const visibleProducts = getVisibleProducts();
  const groups = [];

  // Kategorilerin ve alt kategorilerin veritabanındaki
  // sort_order sırasını koru.
  MENU_DATA.forEach(category => {
    if (activeCategory !== "Tümü" &&
        activeCategory !== category.category) {
      return;
    }

    category.subcategories.forEach(subcategory => {
      if (activeSubcategory &&
          activeSubcategory !== subcategory.name) {
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

function openProductModal(product) {
  if (!product) return;

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
        .map(id => ALLERGENS.find(item => item.id === id)?.label || id)
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
          ${escapeHTML(product.category)} · ${escapeHTML(product.subcategory)}
        </span>

        <h2 id="productModalTitle">${escapeHTML(product.name)}</h2>

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
        <p>${escapeHTML(product.description || "Ürün açıklaması henüz eklenmedi.")}</p>

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

  const closeButton = modal.querySelector(".product-modal-close");
  closeButton.focus();

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  closeButton.addEventListener("click", closeModal);

  modal.onclick = event => {
    if (event.target === modal) closeModal();
  };

  modal.onkeydown = event => {
    if (event.key === "Escape") closeModal();
  };

  const modalImage = modal.querySelector(".product-modal-image");

if (modalImage) {
  modalImage.addEventListener("error", () => {
    modalImage.style.display = "none";
  }, { once: true });
 }
}

// Kartlara tıklanınca ürün ayrıntısını aç.
productList.addEventListener("click", event => {
  const card = event.target.closest(".product-card");
  if (!card) return;

  const product = PRODUCTS.find(
    item => item.id === card.dataset.productId
  );

  openProductModal(product);
});

// Klavyeyle de ürün ayrıntısı açılabilsin.
productList.addEventListener("keydown", event => {
  if (event.target.closest("button, a, input, textarea, select")) return;
  if (event.key !== "Enter" && event.key !== " ") return;

  const card = event.target.closest(".product-card");
  if (!card) return;

  event.preventDefault();

  const product = PRODUCTS.find(
    item => item.id === card.dataset.productId
  );

  openProductModal(product);
});

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

loadMenuData();

if (document.readyState === "complete") {
  createQRCode();
} else {
  window.addEventListener("load", createQRCode, { once: true });
}
