
const productList = document.getElementById("productList");
const addProductBtn = document.getElementById("addProductBtn");
const productSearch = document.getElementById("productSearch");

let products = [];
let categories = [];
let subcategories = [];
let allergens = [];

const buttonStyle = `
  border: none;
  border-radius: 9px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

// Kategorileri ve alt kategorileri getir
async function loadCategories() {
  const [categoryResult, subcategoryResult] = await Promise.all([
    supabaseClient
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),

    supabaseClient
      .from("subcategories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
  ]);

  if (categoryResult.error) {
    throw categoryResult.error;
  }

  if (subcategoryResult.error) {
    throw subcategoryResult.error;
  }

  categories = categoryResult.data || [];
  subcategories = subcategoryResult.data || [];
}
// Alerjenleri getir
async function loadAllergens() {
  const { data, error } = await supabaseClient
    .from("allergens")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  allergens = data || [];
  console.log("Supabase'den gelen alerjenler:", allergens);
console.log("Alerjen sayısı:", allergens.length);
}
// Ürünleri getir
async function loadProducts() {
  productList.textContent = "Ürünler yükleniyor...";

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    productList.textContent = "Ürünler yüklenemedi: " + error.message;
    return;
  }

  products = data || [];
  renderProducts(products);
}

// Ürünleri göster
function renderProducts(list) {
  productList.innerHTML = "";

  if (list.length === 0) {
    productList.textContent = "Henüz ürün bulunmuyor.";
    return;
  }

  list.forEach(product => {
    const card = document.createElement("div");

    card.style.cssText = `
      background: white;
      border: 1px solid #e8e9e5;
      padding: 18px;
      margin-top: 15px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
      box-shadow: 0 3px 12px rgba(0,0,0,0.03);
    `;

    const image = document.createElement("img");
    image.src = product.image_url || "";
    image.alt = product.name;
    image.style.cssText = `
      width: 90px;
      height: 90px;
      object-fit: cover;
      border-radius: 12px;
    `;
    image.hidden = !product.image_url;

    const info = document.createElement("div");
    info.style.cssText = "flex: 1; min-width: 180px;";

    const name = document.createElement("h3");
    name.textContent = product.name;
    name.style.cssText = "margin: 0 0 8px; color: #263b32;";

    const price = document.createElement("p");
    price.textContent =
      `${Number(product.price || 0).toLocaleString("tr-TR")} TL`;
    price.style.cssText =
      "margin: 0 0 7px; color: #557b61; font-weight: 700;";

    const status = document.createElement("span");
    status.textContent = product.is_active
      ? "● Yayında"
      : "● Yayında değil";

    status.style.color = product.is_active ? "#4d805c" : "#a94442";

    info.append(name, price, status);

    const actions = document.createElement("div");
    actions.style.cssText =
      "display: flex; gap: 8px; flex-wrap: wrap;";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Düzenle";
    editBtn.style.cssText = `
      ${buttonStyle}
      background: #e8eee8;
      color: #355b43;
    `;
    editBtn.addEventListener("click", () => editProduct(product));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.style.cssText = `
      ${buttonStyle}
      background: #f8e8e6;
      color: #a94442;
    `;
    deleteBtn.addEventListener("click", () => deleteProduct(product.id));

    actions.append(editBtn, deleteBtn);
    card.append(image, info, actions);
    productList.appendChild(card);
  });
}

// Form tasarımı
function addFormStyles() {
  if (document.getElementById("productFormStyle")) return;

  const style = document.createElement("style");
  style.id = "productFormStyle";

  style.textContent = `
    #productForm {
      background: #fff;
      padding: 28px;
      margin-top: 25px;
      border: 1px solid #e6e9e3;
      border-radius: 18px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 18px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.04);
    }

    #productForm .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    #productForm .form-field label {
      color: #35483b;
      font-size: 14px;
      font-weight: 600;
    }

    #productForm input:not([type="checkbox"]):not([type="file"]),
    #productForm textarea,
    #productForm select {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #dfe4dc;
      background: #fbfcfa;
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 14px;
      color: #263b32;
      outline: none;
    }

    #productForm input:focus,
    #productForm textarea:focus,
    #productForm select:focus {
      border-color: #78977e;
      background: #fff;
    }

    #productForm input[type="file"] {
      padding: 10px;
      border: 1px dashed #cbd5c9;
      background: #f8faf7;
      border-radius: 10px;
    }

    #productForm .checkbox-field {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #35483b;
      font-size: 14px;
    }

    #productForm button[type="submit"] {
      ${buttonStyle}
      background: #557b61;
      color: white;
      min-width: 130px;
    }

    #productForm button[type="button"] {
      ${buttonStyle}
      background: #eef0ec;
      color: #465448;
    }

    #productForm button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  document.head.appendChild(style);
}

// Alt kategori seçeneklerini doldur
function updateSubcategories(categoryId, selectedId = "") {
  const select = document.querySelector(
    '#productForm [name="subcategory_id"]'
  );

  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Alt kategori seçin";
  select.appendChild(placeholder);

  const filtered = subcategories.filter(
    item => item.category_id === categoryId
  );

  filtered.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.emoji || ""} ${item.name}`.trim();

    select.appendChild(option);
  });

  select.value = selectedId || "";

  select.disabled = filtered.length === 0;

  if (filtered.length === 0) {
    placeholder.textContent = "Bu kategoride alt kategori yok";
  }
}

// Ürün formu
async function openProductForm(product = null) {
  const oldForm = document.getElementById("productForm");
  if (oldForm) oldForm.remove();

  addFormStyles();

  const form = document.createElement("form");
  form.id = "productForm";

  form.innerHTML = `
    <div style="grid-column: 1 / -1; border-bottom: 1px solid #e9ece6; padding-bottom: 15px;">
      <h2 style="margin: 0 0 6px; color: #263b32;">
        ${product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
      </h2>
      <p style="margin: 0; color: #7a817b; font-size: 14px;">
        Ürün bilgilerini aşağıdan doldurabilirsin.
      </p>
    </div>

    <div class="form-field">
      <label>Ürün adı</label>
      <input name="name" required maxlength="150"
        placeholder="Örn. Izgara Tavuk">
    </div>

    <div class="form-field">
      <label>Fiyat (TL)</label>
      <input name="price" type="number" min="0"
        step="0.01" required placeholder="Örn. 150">
    </div>

    <div class="form-field" style="grid-column: 1 / -1;">
      <label>Açıklama</label>
      <textarea name="description" rows="3"
        placeholder="Ürün hakkında kısa bir açıklama..."></textarea>
    </div>

    <div class="form-field">
      <label>Ürün kategorisi</label>
      <select name="category_id" required>
        <option value="">Ana kategori seçin</option>
      </select>
    </div>

    <div class="form-field">
      <label>Alt kategori</label>
      <select name="subcategory_id" required disabled>
        <option value="">Önce ana kategori seçin</option>
      </select>
    </div>

    <div class="form-field">
      <label>Kalori</label>
      <input name="calories" type="number" min="0"
        placeholder="Örn. 450">
    </div>

    <div class="form-field">
      <label>Emoji</label>
      <input name="emoji" placeholder="🍽️">
    </div>

    <div class="form-field">
      <label>Sıralama</label>
      <input name="sort_order" type="number" value="0">
    </div>

    <div class="form-field" style="grid-column: 1 / -1;">
      <label>Ürün fotoğrafı</label>
      <input name="image" type="file" accept="image/*">

      <img id="imagePreview" alt="Fotoğraf önizlemesi"
        style="display:none; width:150px; height:150px;
        object-fit:cover; border-radius:12px; margin-top:12px;">
    </div>
<div class="form-field" style="grid-column: 1 / -1;">
  <label>Üründeki alerjenler</label>
  <div id="allergenCheckboxes"
    style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; padding:15px; background:#f8faf7; border-radius:12px;">
  </div>
</div>
    <div style="grid-column: 1 / -1; display:flex; gap:20px; flex-wrap:wrap;">
      <label class="checkbox-field">
        <input name="allergens_verified" type="checkbox">
        Alerjen bilgileri doğrulandı
      </label>

      <label class="checkbox-field">
        <input name="is_active" type="checkbox">
        Ürün yayında
      </label>
    </div>

    <div style="grid-column:1 / -1; display:flex; gap:10px; flex-wrap:wrap;">
      <button type="submit" id="saveProductBtn">Kaydet</button>
      <button type="button" id="cancelProduct">İptal</button>
    </div>
  `;

  const productDetails = document.getElementById("productListDetails");

document.getElementById("productManagement")
  .insertBefore(form, productDetails);
  // Alerjen seçim kutularını oluştur
const allergenContainer = form.querySelector("#allergenCheckboxes");

allergens.forEach(allergen => {
  const label = document.createElement("label");

  label.style.cssText = `
    display:flex;
    align-items:center;
    gap:8px;
    font-size:14px;
    color:#35483b;
  `;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = allergen.id;
  checkbox.dataset.allergenId = allergen.id;

  label.append(checkbox, document.createTextNode(allergen.name));
  allergenContainer.appendChild(label);
});

// Düzenlenen ürünün mevcut alerjenlerini getir
if (product) {
  const { data: selectedAllergens, error } = await supabaseClient
    .from("product_allergens")
    .select("allergen_id")
    .eq("product_id", product.id);

  if (error) {
    alert("Alerjenler yüklenemedi: " + error.message);
  } else {
    const selectedIds = (selectedAllergens || [])
      .map(item => item.allergen_id);

    allergenContainer
      .querySelectorAll('input[type="checkbox"]')
      .forEach(checkbox => {
        checkbox.checked = selectedIds.includes(checkbox.value);
      });
  }
}

  const field = name =>
    form.querySelector(`[name="${name}"]`);

  // Ana kategorileri doldur
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    field("category_id").appendChild(option);
  });

  // Düzenleme durumunda eski kategori ve alt kategoriyi bul
  if (product) {
    field("name").value = product.name || "";
    field("description").value = product.description || "";
    field("price").value = product.price ?? "";
    field("calories").value = product.calories ?? "";
    field("emoji").value = product.emoji || "";
    field("allergens_verified").checked =
      product.allergens_verified || false;
    field("is_active").checked = product.is_active;
    field("sort_order").value = product.sort_order ?? 0;

    const oldSubcategory = subcategories.find(
      item => item.id === product.subcategory_id
    );

    if (oldSubcategory) {
      field("category_id").value = oldSubcategory.category_id;

      updateSubcategories(
        oldSubcategory.category_id,
        oldSubcategory.id
      );
    }
  } else {
    field("is_active").checked = true;
  }

  // Ana kategori değişince alt kategorileri yenile
  field("category_id").addEventListener("change", () => {
    updateSubcategories(field("category_id").value);
  });

  // Mevcut fotoğraf önizlemesi
  const preview = field("image")
    .closest(".form-field")
    .querySelector("#imagePreview");

  if (product?.image_url) {
    preview.src = product.image_url;
    preview.style.display = "block";
  }

  // Yeni fotoğraf seçildiğinde önizleme
  field("image").addEventListener("change", event => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir fotoğraf dosyası seç.");
      event.target.value = "";
      return;
    }

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  });

 // İptal
form.querySelector("#cancelProduct").addEventListener("click", () => {
  form.remove();
});

 // Kaydet
form.addEventListener("submit", async event => {
  event.preventDefault();

  const saveButton = form.querySelector("#saveProductBtn");
  saveButton.disabled = true;
  saveButton.textContent = "Kaydediliyor...";

    try {
      const selectedSubcategory = field("subcategory_id").value;

      if (!selectedSubcategory) {
        throw new Error("Lütfen bir alt kategori seçin.");
      }

      let imageUrl = product?.image_url || null;
      const imageFile = field("image").files[0];

      // Fotoğrafı Supabase Storage'a yükle
      if (imageFile) {
        const extension = imageFile.name.split(".").pop();
        const filePath = `${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabaseClient
          .storage
          .from("menu-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: imageData } = supabaseClient
          .storage
          .from("menu-images")
          .getPublicUrl(filePath);

        imageUrl = imageData.publicUrl;
      }

      const formData = {
        name: field("name").value.trim(),
        description: field("description").value.trim() || null,
        price: Number(field("price").value),
        calories: field("calories").value
          ? Number(field("calories").value)
          : null,
        subcategory_id: selectedSubcategory,
        image_url: imageUrl,
        emoji: field("emoji").value.trim() || null,
        allergens_verified: field("allergens_verified").checked,
        is_active: field("is_active").checked,
        sort_order: Number(field("sort_order").value) || 0
      };

      let result;

     if (product) {
  result = await supabaseClient
    .from("products")
    .update(formData)
    .eq("id", product.id)
    .select();
} else {
  result = await supabaseClient
    .from("products")
    .insert([formData])
    .select();
}

if (result.error) {
  throw result.error;
}

if (!result.data || result.data.length === 0) {
  throw new Error("Ürün kaydedilemedi. Supabase herhangi bir kayıt döndürmedi.");
}
      // Kaydedilen ürünün ID'si
const savedProduct = result.data[0];

// Formda seçilen alerjenler
const selectedAllergenIds = Array.from(
  form.querySelectorAll("#allergenCheckboxes input:checked")
).map(checkbox => checkbox.value);

// Önce eski alerjen bağlantılarını sil
const { error: deleteAllergensError } = await supabaseClient
  .from("product_allergens")
  .delete()
  .eq("product_id", savedProduct.id);

if (deleteAllergensError) {
  throw deleteAllergensError;
}

// Seçilen alerjenleri kaydet
if (selectedAllergenIds.length > 0) {
  const allergenRows = selectedAllergenIds.map(allergenId => ({
    product_id: savedProduct.id,
    allergen_id: allergenId
  }));

  const { error: allergenInsertError } = await supabaseClient
    .from("product_allergens")
    .insert(allergenRows);

  if (allergenInsertError) {
    throw allergenInsertError;
  }
}

      if (result.error) throw result.error;

      alert(product ? "Ürün güncellendi!" : "Ürün eklendi!");

      form.remove();
      await loadProducts();

    } catch (error) {
      alert("İşlem başarısız: " + error.message);
      saveButton.disabled = false;
      saveButton.textContent = "Kaydet";
    }
  });
}

// Ürün ekleme
addProductBtn.addEventListener("click", () => {
  async function openProductForm(product = null) {
});

// Ürün düzenleme
function editProduct(product) {
  openProductForm(product);
}

// Ürün silme
async function deleteProduct(id) {
  if (!confirm("Bu ürünü silmek istediğine emin misin?")) {
    return;
  }

  const { error } = await supabaseClient
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Silme işlemi başarısız: " + error.message);
    return;
  }

  alert("Ürün silindi!");
  await loadProducts();
}

// Ürün arama
productSearch.addEventListener("input", () => {
  const search = productSearch.value.toLocaleLowerCase("tr");

  const filtered = products.filter(product =>
    (product.name || "").toLocaleLowerCase("tr").includes(search)
  );

  renderProducts(filtered);
});

// Başlangıç
async function initializeProductManagement() {
  try {
await loadCategories();
await loadAllergens();
await loadProducts();
  } catch (error) {
    productList.textContent =
      "Kategori bilgileri yüklenemedi: " + error.message;
  }
}

initializeProductManagement();
