
const productList = document.getElementById("productList");
const addProductBtn = document.getElementById("addProductBtn");
const productSearch = document.getElementById("productSearch");

let products = [];

// Ortak buton tasarımı
const buttonStyle = `
  border: none;
  border-radius: 9px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
`;

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

// Ürünleri ekranda göster
function renderProducts(list) {
  productList.innerHTML = "";

  if (list.length === 0) {
    productList.textContent = "Henüz ürün bulunmuyor.";
    return;
  }

  list.forEach(product => {
    const card = document.createElement("div");

    card.style.cssText = `
      background: #ffffff;
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
      background: #f3f4ef;
    `;

    image.hidden = !product.image_url;

    const info = document.createElement("div");
    info.style.cssText = `
      flex: 1;
      min-width: 180px;
    `;

    const name = document.createElement("h3");
    name.textContent = product.name;
    name.style.cssText = `
      margin: 0 0 8px;
      color: #263b32;
      font-size: 17px;
    `;

    const price = document.createElement("p");
    price.textContent = `${Number(product.price || 0).toLocaleString("tr-TR")} TL`;
    price.style.cssText = `
      margin: 0 0 7px;
      color: #557b61;
      font-weight: 700;
      font-size: 16px;
    `;

    const status = document.createElement("span");
    status.textContent = product.is_active ? "● Yayında" : "● Yayında değil";
    status.style.cssText = `
      color: ${product.is_active ? "#4d805c" : "#a94442"};
      font-size: 13px;
      font-weight: 600;
    `;

    info.append(name, price, status);

    const actions = document.createElement("div");
    actions.style.cssText = `
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    `;

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

// Ürün formu
function openProductForm(product = null) {
  const oldForm = document.getElementById("productForm");
  if (oldForm) oldForm.remove();

  const form = document.createElement("form");
  form.id = "productForm";

  form.style.cssText = `
    background: #ffffff;
    padding: 28px;
    margin-top: 25px;
    border: 1px solid #e6e9e3;
    border-radius: 18px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.04);
  `;

  form.innerHTML = `
    <div style="grid-column: 1 / -1; border-bottom: 1px solid #e9ece6; padding-bottom: 15px;">
      <h2 style="margin: 0 0 6px; color: #263b32; font-size: 23px;">
        ${product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
      </h2>
      <p style="margin: 0; color: #7a817b; font-size: 14px;">
        Menü ürününün bilgilerini aşağıdan düzenleyebilirsin.
      </p>
    </div>

    <div class="form-field">
      <label>Ürün adı</label>
      <input name="name" required maxlength="150" placeholder="Örn. Izgara Tavuk">
    </div>

    <div class="form-field">
      <label>Fiyat (TL)</label>
      <input name="price" type="number" min="0" step="0.01" required placeholder="Örn. 150">
    </div>

    <div class="form-field" style="grid-column: 1 / -1;">
      <label>Açıklama</label>
      <textarea name="description" rows="3" placeholder="Ürün hakkında kısa bir açıklama..."></textarea>
    </div>

    <div class="form-field">
      <label>Kalori</label>
      <input name="calories" type="number" min="0" placeholder="Örn. 450">
    </div>

    <div class="form-field">
      <label>Alt kategori ID</label>
      <input name="subcategory_id" placeholder="Alt kategori ID">
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

      <img
        id="imagePreview"
        alt="Fotoğraf önizlemesi"
        style="
          display: none;
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 12px;
          margin-top: 12px;
          border: 1px solid #e5e5e5;
        "
      >
    </div>

    <div style="grid-column: 1 / -1; display: flex; gap: 20px; flex-wrap: wrap;">
      <label class="checkbox-field">
        <input name="allergens_verified" type="checkbox">
        Alerjen bilgileri doğrulandı
      </label>

      <label class="checkbox-field">
        <input name="is_active" type="checkbox">
        Ürün yayında
      </label>
    </div>

    <div style="grid-column: 1 / -1; display: flex; gap: 10px; flex-wrap: wrap; margin-top: 5px;">
      <button type="submit" id="saveProductBtn">Kaydet</button>
      <button type="button" id="cancelProduct">İptal</button>
    </div>
  `;

  // Form alanlarının tasarımı
  const style = document.createElement("style");
  style.textContent = `
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
    #productForm textarea {
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
    #productForm textarea:focus {
      border-color: #78977e;
      background: #ffffff;
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
      cursor: pointer;
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

    #productForm button:hover {
      opacity: 0.88;
    }
  `;

  if (!document.getElementById("productFormStyle")) {
    style.id = "productFormStyle";
    document.head.appendChild(style);
  }

  document.getElementById("productManagement").appendChild(form);

  const field = name => form.querySelector(`[name="${name}"]`);

  if (product) {
    field("name").value = product.name || "";
    field("description").value = product.description || "";
    field("price").value = product.price ?? "";
    field("calories").value = product.calories ?? "";
    field("subcategory_id").value = product.subcategory_id || "";
    field("emoji").value = product.emoji || "";
    field("allergens_verified").checked = product.allergens_verified || false;
    field("is_active").checked = product.is_active;
    field("sort_order").value = product.sort_order ?? 0;

    const preview = form.querySelector("#imagePreview");

    if (product.image_url) {
      preview.src = product.image_url;
      preview.style.display = "block";
    }
  } else {
    field("is_active").checked = true;
  }

  // Fotoğraf seçildiğinde önizleme
  field("image").addEventListener("change", event => {
    const file = event.target.files[0];
    const preview = form.querySelector("#imagePreview");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir fotoğraf dosyası seç.");
      event.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    preview.src = imageUrl;
    preview.style.display = "block";
  });

  // İptal
  form.querySelector("#cancelProduct")
    .addEventListener("click", () => form.remove());

  // Kaydet
  form.addEventListener("submit", async event => {
    event.preventDefault();

    const saveButton = form.querySelector("#saveProductBtn");
    saveButton.disabled = true;
    saveButton.textContent = "Kaydediliyor...";

    try {
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
        subcategory_id: field("subcategory_id").value.trim() || null,
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
          .eq("id", product.id);
      } else {
        result = await supabaseClient
          .from("products")
          .insert([formData]);
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
  openProductForm();
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
loadProducts();
