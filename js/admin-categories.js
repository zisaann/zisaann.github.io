// ==========================================
// KATEGORİ VE ALT KATEGORİ YÖNETİMİ
// ==========================================

let adminCategories = [];
let adminSubcategories = [];

const categoryList = document.getElementById("categoryList");
const subcategoryList = document.getElementById("subcategoryList");
const categoryFormContainer = document.getElementById("categoryFormContainer");
const subcategoryFormContainer = document.getElementById("subcategoryFormContainer");
const parentCategorySelect = document.getElementById("parentCategorySelect");


// HTML güvenliği
function escapeCategoryHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}


// Türkçe kategori adından URL uyumlu slug oluşturur
function createCategorySlug(name) {
  return name
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}


// ==========================================
// VERİLERİ YÜKLE
// ==========================================

async function loadCategoryData() {
  categoryList.textContent = "Kategoriler yükleniyor...";

  const [categoryResult, subcategoryResult] = await Promise.all([
    supabaseClient
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true }),

    supabaseClient
      .from("subcategories")
      .select("*")
      .order("sort_order", { ascending: true })
  ]);

  if (categoryResult.error) {
    categoryList.textContent =
      "Kategori yüklenemedi: " + categoryResult.error.message;
    return;
  }

  if (subcategoryResult.error) {
    subcategoryList.textContent =
      "Alt kategoriler yüklenemedi: " + subcategoryResult.error.message;
    return;
  }

  adminCategories = categoryResult.data || [];
  adminSubcategories = subcategoryResult.data || [];

  renderCategoryList();
  renderParentCategorySelect();
  renderSubcategoryList();
}


// ==========================================
// ANA KATEGORİLERİ GÖSTER
// ==========================================

function renderCategoryList() {
  if (adminCategories.length === 0) {
    categoryList.textContent = "Henüz kategori eklenmemiş.";
    return;
  }

  categoryList.innerHTML = adminCategories.map(category => `
    <div class="category-item"
      style="background:white;padding:16px;border:1px solid #e7ece6;border-radius:10px;">

      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;">

        <div>
          <strong>${escapeCategoryHTML(category.name)}</strong>

          <p style="margin:5px 0;color:#78857b;font-size:13px;">
            Sıra: ${Number(category.sort_order) || 0}
            · ${category.is_active ? "Aktif" : "Pasif"}
          </p>
        </div>

        <div style="display:flex;gap:7px;flex-wrap:wrap;">
          <button type="button"
            data-action="edit-category"
            data-id="${category.id}">
            Düzenle
          </button>

          <button type="button"
            data-action="toggle-category"
            data-id="${category.id}"
            style="background:${category.is_active ? "#a65c4b" : "#315b43"};">
            ${category.is_active ? "Pasif Yap" : "Aktif Yap"}
          </button>
        </div>

      </div>
    </div>
  `).join("");
}


// ==========================================
// ALT KATEGORİ ANA KATEGORİ SEÇİMİ
// ==========================================

function renderParentCategorySelect(selectedId = "") {
  const activeCategories = adminCategories.filter(category => category.is_active);

  parentCategorySelect.innerHTML = `
    <option value="">Kategori seçin</option>
    ${activeCategories.map(category => `
      <option value="${category.id}"
        ${category.id === selectedId ? "selected" : ""}>
        ${escapeCategoryHTML(category.name)}
      </option>
    `).join("")}
  `;
}


// ==========================================
// SEÇİLEN ANA KATEGORİNİN ALT KATEGORİLERİ
// ==========================================

function renderSubcategoryList() {
  const selectedCategoryId = parentCategorySelect.value;

  if (!selectedCategoryId) {
    subcategoryList.textContent =
      "Alt kategorileri görmek için önce ana kategori seçin.";
    return;
  }

  const selectedSubcategories = adminSubcategories.filter(
    subcategory => subcategory.category_id === selectedCategoryId
  );

  if (selectedSubcategories.length === 0) {
    subcategoryList.textContent = "Bu kategoriye ait alt kategori bulunmuyor.";
    return;
  }

  subcategoryList.innerHTML = selectedSubcategories.map(subcategory => `
    <div style="background:white;padding:16px;border:1px solid #e7ece6;border-radius:10px;">

      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;">

        <div>
          <strong>
            ${escapeCategoryHTML(subcategory.emoji || "🍽️")}
            ${escapeCategoryHTML(subcategory.name)}
          </strong>

          <p style="margin:5px 0;color:#78857b;font-size:13px;">
            Sıra: ${Number(subcategory.sort_order) || 0}
            · ${subcategory.is_active ? "Aktif" : "Pasif"}
          </p>
        </div>

        <div style="display:flex;gap:7px;flex-wrap:wrap;">
          <button type="button"
            data-action="edit-subcategory"
            data-id="${subcategory.id}">
            Düzenle
          </button>

          <button type="button"
            data-action="toggle-subcategory"
            data-id="${subcategory.id}"
            style="background:${subcategory.is_active ? "#a65c4b" : "#315b43"};">
            ${subcategory.is_active ? "Pasif Yap" : "Aktif Yap"}
          </button>
        </div>

      </div>
    </div>
  `).join("");
}


// ==========================================
// YENİ ANA KATEGORİ FORMU
// ==========================================

function showCategoryForm(category = null) {
  const editing = Boolean(category);

  categoryFormContainer.innerHTML = `
    <form id="categoryForm"
      style="background:white;padding:18px;margin-top:18px;border:1px solid #dce4dc;border-radius:10px;">

      <h4>${editing ? "Kategori Düzenle" : "Yeni Kategori"}</h4>

      <label>Kategori Adı</label>
      <input
        type="text"
        id="categoryName"
        required
        maxlength="80"
        value="${escapeCategoryHTML(category?.name || "")}"
        placeholder="Örn. Kahvaltı">

      <label>Sıralama</label>
      <input
        type="number"
        id="categorySort"
        min="0"
        value="${Number(category?.sort_order ?? adminCategories.length + 1)}"
        required>

      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button type="submit">
          ${editing ? "Değişiklikleri Kaydet" : "Kategori Ekle"}
        </button>

        <button type="button" id="cancelCategory"
          style="background:#e8eee8;color:#315b43;">
          Vazgeç
        </button>
      </div>

    </form>
  `;

  document.getElementById("cancelCategory").addEventListener("click", () => {
    categoryFormContainer.innerHTML = "";
  });

  document.getElementById("categoryForm").addEventListener("submit", async event => {
    event.preventDefault();

    const name = document.getElementById("categoryName").value.trim();
    const sortOrder = Number(document.getElementById("categorySort").value);

    if (!name || !Number.isFinite(sortOrder) || sortOrder < 0) {
      alert("Lütfen kategori adını ve geçerli sıralamayı girin.");
      return;
    }

    const values = {
      name,
      slug: createCategorySlug(name),
      sort_order: sortOrder
    };

    const result = editing
      ? await supabaseClient
          .from("categories")
          .update(values)
          .eq("id", category.id)
      : await supabaseClient
          .from("categories")
          .insert({
            ...values,
            is_active: true
          });

    if (result.error) {
      alert("İşlem başarısız: " + result.error.message);
      return;
    }

    categoryFormContainer.innerHTML = "";
    await loadCategoryData();

    alert(editing ? "Kategori güncellendi." : "Kategori eklendi.");
  });
}


// ==========================================
// YENİ ALT KATEGORİ FORMU
// ==========================================

function showSubcategoryForm(subcategory = null) {
  const editing = Boolean(subcategory);
  const selectedCategoryId =
    subcategory?.category_id || parentCategorySelect.value;

  if (!selectedCategoryId) {
    alert("Önce bir ana kategori seçmelisiniz.");
    return;
  }

  subcategoryFormContainer.innerHTML = `
    <form id="subcategoryForm"
      style="background:white;padding:18px;margin-top:18px;border:1px solid #dce4dc;border-radius:10px;">

      <h4>${editing ? "Alt Kategori Düzenle" : "Yeni Alt Kategori"}</h4>

      <label>Alt Kategori Adı</label>
      <input
        type="text"
        id="subcategoryName"
        required
        maxlength="80"
        value="${escapeCategoryHTML(subcategory?.name || "")}"
        placeholder="Örn. Çorbalar">

      <label>Emoji</label>
      <input
        type="text"
        id="subcategoryEmoji"
        maxlength="12"
        value="${escapeCategoryHTML(subcategory?.emoji || "🍽️")}"
        placeholder="🍽️">

      <label>Sıralama</label>
      <input
        type="number"
        id="subcategorySort"
        min="0"
        value="${Number(subcategory?.sort_order ?? 1)}"
        required>

      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button type="submit">
          ${editing ? "Değişiklikleri Kaydet" : "Alt Kategori Ekle"}
        </button>

        <button type="button" id="cancelSubcategory"
          style="background:#e8eee8;color:#315b43;">
          Vazgeç
        </button>
      </div>

    </form>
  `;

  document.getElementById("cancelSubcategory").addEventListener("click", () => {
    subcategoryFormContainer.innerHTML = "";
  });

  document.getElementById("subcategoryForm").addEventListener("submit", async event => {
    event.preventDefault();

    const name = document.getElementById("subcategoryName").value.trim();
    const emoji = document.getElementById("subcategoryEmoji").value.trim();
    const sortOrder = Number(document.getElementById("subcategorySort").value);

    if (!name || !Number.isFinite(sortOrder) || sortOrder < 0) {
      alert("Lütfen alt kategori adını ve geçerli sıralamayı girin.");
      return;
    }

    const values = {
      category_id: selectedCategoryId,
      name,
      emoji: emoji || "🍽️",
      sort_order: sortOrder
    };

    const result = editing
      ? await supabaseClient
          .from("subcategories")
          .update(values)
          .eq("id", subcategory.id)
      : await supabaseClient
          .from("subcategories")
          .insert({
            ...values,
            is_active: true
          });

    if (result.error) {
      alert("İşlem başarısız: " + result.error.message);
      return;
    }

    subcategoryFormContainer.innerHTML = "";
    await loadCategoryData();

    parentCategorySelect.value = selectedCategoryId;
    renderSubcategoryList();

    alert(editing ? "Alt kategori güncellendi." : "Alt kategori eklendi.");
  });
}


// ==========================================
// AKTİF / PASİF İŞLEMLERİ
// ==========================================

async function toggleCategory(category) {
  const newStatus = !category.is_active;

  const confirmation = confirm(
    `"${category.name}" kategorisi ${newStatus ? "aktif" : "pasif"} yapılsın mı?`
  );

  if (!confirmation) return;

  const { error } = await supabaseClient
    .from("categories")
    .update({ is_active: newStatus })
    .eq("id", category.id);

  if (error) {
    alert("İşlem başarısız: " + error.message);
    return;
  }

  await loadCategoryData();
}


async function toggleSubcategory(subcategory) {
  const newStatus = !subcategory.is_active;

  const confirmation = confirm(
    `"${subcategory.name}" alt kategorisi ${newStatus ? "aktif" : "pasif"} yapılsın mı?`
  );

  if (!confirmation) return;

  const { error } = await supabaseClient
    .from("subcategories")
    .update({ is_active: newStatus })
    .eq("id", subcategory.id);

  if (error) {
    alert("İşlem başarısız: " + error.message);
    return;
  }

  const selectedCategoryId = parentCategorySelect.value;

  await loadCategoryData();

  parentCategorySelect.value = selectedCategoryId;
  renderSubcategoryList();
}


// ==========================================
// BUTON OLAYLARI
// ==========================================

document.getElementById("addCategoryBtn").addEventListener("click", () => {
  showCategoryForm();
});

document.getElementById("addSubcategoryBtn").addEventListener("click", () => {
  showSubcategoryForm();
});

parentCategorySelect.addEventListener("change", () => {
  subcategoryFormContainer.innerHTML = "";
  renderSubcategoryList();
});


categoryList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const category = adminCategories.find(
    item => item.id === button.dataset.id
  );

  if (!category) return;

  if (button.dataset.action === "edit-category") {
    showCategoryForm(category);
  }

  if (button.dataset.action === "toggle-category") {
    toggleCategory(category);
  }
});


subcategoryList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const subcategory = adminSubcategories.find(
    item => item.id === button.dataset.id
  );

  if (!subcategory) return;

  if (button.dataset.action === "edit-subcategory") {
    showSubcategoryForm(subcategory);
  }

  if (button.dataset.action === "toggle-subcategory") {
    toggleSubcategory(subcategory);
  }
});


// ==========================================
// BAŞLAT
// ==========================================

loadCategoryData();
