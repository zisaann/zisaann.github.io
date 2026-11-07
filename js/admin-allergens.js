
/* ==========================================
   ALERJEN YÖNETİMİ
   Supabase: allergens / product_allergens
========================================== */

let adminAllergens = [];
let allergenProductCounts = {};

const allergenList = document.getElementById("allergenList");
const allergenSummary = document.getElementById("allergenSummary");
const allergenSearch = document.getElementById("allergenSearch");
const allergenFormContainer = document.getElementById("allergenFormContainer");
const addAllergenBtn = document.getElementById("addAllergenBtn");


// HTML güvenliği
function escapeAllergenHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}


// Yeni alerjen için benzersiz ID üret
function createAllergenId(name) {
  const slug = name
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slug || "alerjen"}-${Date.now().toString(36)}`;
}


// ==========================================
// VERİLERİ YÜKLE
// ==========================================

async function loadAllergenData() {
  allergenList.textContent = "Alerjenler yükleniyor...";
  allergenSummary.textContent = "Veriler yükleniyor...";

  const [allergenResult, relationResult] = await Promise.all([
    supabaseClient
      .from("allergens")
      .select("id, name, sort_order")
      .order("sort_order", { ascending: true }),

    supabaseClient
      .from("product_allergens")
      .select("allergen_id")
  ]);

  if (allergenResult.error) {
    allergenList.textContent =
      "Alerjenler yüklenemedi: " + allergenResult.error.message;
    allergenSummary.textContent = "Veri yükleme hatası.";
    return;
  }

  if (relationResult.error) {
    allergenList.textContent =
      "Ürün bağlantıları yüklenemedi: " + relationResult.error.message;
    allergenSummary.textContent = "Veri yükleme hatası.";
    return;
  }

  adminAllergens = allergenResult.data || [];
  allergenProductCounts = {};

  (relationResult.data || []).forEach(relation => {
    allergenProductCounts[relation.allergen_id] =
      (allergenProductCounts[relation.allergen_id] || 0) + 1;
  });

  renderAllergenSummary();
  renderAllergenList();
}


// ==========================================
// ÖZET
// ==========================================

function renderAllergenSummary() {
  const totalRelations = Object.values(allergenProductCounts)
    .reduce((total, count) => total + count, 0);

  allergenSummary.textContent =
    `${adminAllergens.length} alerjen tanımlı · ` +
    `${totalRelations} ürün-alerjen bağlantısı`;
}


// ==========================================
// LİSTE
// ==========================================

function renderAllergenList() {
  const query = allergenSearch.value
    .trim()
    .toLocaleLowerCase("tr-TR");

  const filtered = adminAllergens.filter(allergen =>
    allergen.name.toLocaleLowerCase("tr-TR").includes(query)
  );

  if (filtered.length === 0) {
    allergenList.textContent = query
      ? "Aramanızla eşleşen alerjen bulunamadı."
      : "Henüz alerjen eklenmemiş.";

    return;
  }

  allergenList.innerHTML = filtered.map(allergen => {
    const productCount = allergenProductCounts[allergen.id] || 0;

    return `
      <div class="allergen-admin-item">

        <div class="allergen-admin-info">
          <strong>${escapeAllergenHTML(allergen.name)}</strong>

          <span>
            Sıralama: ${Number(allergen.sort_order) || 0}
            · ${productCount} ürünle bağlantılı
          </span>
        </div>

        <div class="allergen-admin-actions">

          <button
            type="button"
            data-action="edit"
            data-id="${escapeAllergenHTML(allergen.id)}">
            Düzenle
          </button>

          <button
            type="button"
            class="delete-allergen"
            data-action="delete"
            data-id="${escapeAllergenHTML(allergen.id)}"
            ${productCount > 0 ? "disabled title='Önce ürün bağlantılarını kaldırın'" : ""}>
            Sil
          </button>

        </div>
      </div>
    `;
  }).join("");
}


// ==========================================
// FORM
// ==========================================

function showAllergenForm(allergen = null) {
  const editing = Boolean(allergen);

  allergenFormContainer.innerHTML = `
    <form id="allergenForm">

      <h3>${editing ? "Alerjeni Düzenle" : "Yeni Alerjen Ekle"}</h3>

      <div>
        <label for="allergenName">Alerjen Adı</label>
        <input
          type="text"
          id="allergenName"
          maxlength="80"
          required
          placeholder="Örn. Kabuklu yemişler"
          value="${escapeAllergenHTML(allergen?.name || "")}">
      </div>

      <div>
        <label for="allergenSort">Sıralama</label>
        <input
          type="number"
          id="allergenSort"
          min="0"
          max="9999"
          required
          value="${Number(allergen?.sort_order ?? adminAllergens.length + 1)}">
      </div>

      <div class="allergen-form-actions">

        <button type="submit">
          ${editing ? "Değişiklikleri Kaydet" : "Alerjen Ekle"}
        </button>

        <button
          type="button"
          class="cancel-allergen"
          id="cancelAllergen">
          Vazgeç
        </button>

      </div>

    </form>
  `;

  document.getElementById("cancelAllergen")
    .addEventListener("click", () => {
      allergenFormContainer.innerHTML = "";
    });

  document.getElementById("allergenForm")
    .addEventListener("submit", async event => {
      event.preventDefault();

      const name = document.getElementById("allergenName")
        .value.trim();

      const sortOrder = Number(
        document.getElementById("allergenSort").value
      );

      if (!name || !Number.isInteger(sortOrder) ||
          sortOrder < 0 || sortOrder > 9999) {
        alert("Lütfen geçerli bir alerjen adı ve sıralama girin.");
        return;
      }

      const duplicate = adminAllergens.find(item =>
        item.id !== allergen?.id &&
        item.name.toLocaleLowerCase("tr-TR") ===
        name.toLocaleLowerCase("tr-TR")
      );

      if (duplicate) {
        alert("Bu isimde bir alerjen zaten bulunuyor.");
        return;
      }

      const submitButton = event.submitter;
      submitButton.disabled = true;

      const values = {
        name,
        sort_order: sortOrder
      };

      let result;

      if (editing) {
        result = await supabaseClient
          .from("allergens")
          .update(values)
          .eq("id", allergen.id);
      } else {
        result = await supabaseClient
          .from("allergens")
          .insert({
            id: createAllergenId(name),
            ...values
          });
      }

      if (result.error) {
        submitButton.disabled = false;
        alert("İşlem başarısız: " + result.error.message);
        return;
      }

      allergenFormContainer.innerHTML = "";
      await loadAllergenData();

      alert(editing
        ? "Alerjen başarıyla güncellendi."
        : "Yeni alerjen başarıyla eklendi.");
    });
}


// ==========================================
// SİLME
// ==========================================

async function deleteAllergen(allergen) {
  const productCount = allergenProductCounts[allergen.id] || 0;

  if (productCount > 0) {
    alert(
      `Bu alerjen ${productCount} ürünle bağlantılı. ` +
      "Önce ilgili ürünlerin alerjen bağlantılarını düzenlemelisiniz."
    );
    return;
  }

  const confirmation = confirm(
    `"${allergen.name}" alerjenini silmek istediğinize emin misiniz?`
  );

  if (!confirmation) return;

  const { error } = await supabaseClient
    .from("allergens")
    .delete()
    .eq("id", allergen.id);

  if (error) {
    alert("Alerjen silinemedi: " + error.message);
    return;
  }

  await loadAllergenData();
  alert("Alerjen silindi.");
}


// ==========================================
// BUTONLAR VE OLAYLAR
// ==========================================

addAllergenBtn.addEventListener("click", () => {
  showAllergenForm();
});

allergenSearch.addEventListener("input", renderAllergenList);

allergenList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button || button.disabled) return;

  const allergen = adminAllergens.find(
    item => item.id === button.dataset.id
  );

  if (!allergen) return;

  if (button.dataset.action === "edit") {
    showAllergenForm(allergen);
  }

  if (button.dataset.action === "delete") {
    deleteAllergen(allergen);
  }
});


// ==========================================
// BAŞLAT
// ==========================================

loadAllergenData();
