
const productList = document.getElementById("productList");
const addProductBtn = document.getElementById("addProductBtn");
const productSearch = document.getElementById("productSearch");

let products = [];

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
      background:white;
      padding:18px;
      margin-top:15px;
      border-radius:12px;
      display:flex;
      align-items:center;
      gap:15px;
      flex-wrap:wrap;
    `;

    const image = document.createElement("img");
    image.src = product.image_url || "";
    image.alt = product.name;
    image.style.cssText = `
      width:85px;
      height:85px;
      object-fit:cover;
      border-radius:10px;
    `;
    image.hidden = !product.image_url;

    const info = document.createElement("div");
    info.style.flex = "1";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = product.price + " TL";

    const status = document.createElement("p");
    status.textContent = product.is_active ? "Yayında" : "Yayında değil";

    info.append(name, price, status);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Düzenle";
    editBtn.addEventListener("click", () => editProduct(product));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.style.background = "#a94442";
    deleteBtn.addEventListener("click", () => deleteProduct(product.id));

    card.append(image, info, editBtn, deleteBtn);
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
    background:white;
    padding:25px;
    margin-top:25px;
    border-radius:14px;
    display:grid;
    gap:12px;
  `;

  form.innerHTML = `
    <h2>${product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h2>

    <label>Ürün adı</label>
    <input name="name" required maxlength="150">

    <label>Açıklama</label>
    <textarea name="description"></textarea>

    <label>Fiyat (TL)</label>
    <input name="price" type="number" min="0" step="0.01" required>

    <label>Kalori</label>
    <input name="calories" type="number" min="0">

    <label>Alt kategori ID</label>
    <input name="subcategory_id" placeholder="Alt kategori ID">

    <label>Ürün fotoğrafı</label>
    <input name="image" type="file" accept="image/*">

    <label>Emoji</label>
    <input name="emoji" placeholder="🍽️">

    <label>
      <input name="allergens_verified" type="checkbox">
      Alerjen bilgileri doğrulandı
    </label>

    <label>
      <input name="is_active" type="checkbox">
      Ürün yayında
    </label>

    <label>Sıralama</label>
    <input name="sort_order" type="number" value="0">

    <button type="submit">Kaydet</button>
    <button type="button" id="cancelProduct">İptal</button>
  `;

  document.getElementById("productManagement")
    .appendChild(form);

  const fields = form.elements;

  if (product) {
    fields.name.value = product.name || "";
    fields.description.value = product.description || "";
    fields.price.value = product.price ?? "";
    fields.calories.value = product.calories ?? "";
    fields.subcategory_id.value = product.subcategory_id || "";
    fields.emoji.value = product.emoji || "";
    fields.allergens_verified.checked =
      product.allergens_verified || false;
    fields.is_active.checked = product.is_active;
    fields.sort_order.value = product.sort_order ?? 0;
  } else {
    fields.is_active.checked = true;
  }

  document.getElementById("cancelProduct")
    .addEventListener("click", () => form.remove());

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const saveButton = form.querySelector('button[type="submit"]');
    saveButton.disabled = true;
    saveButton.textContent = "Kaydediliyor...";

    try {
      let imageUrl = product?.image_url || null;
      const imageFile = fields.image.files[0];

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
        name: fields.name.value.trim(),
        description: fields.description.value.trim() || null,
        price: Number(fields.price.value),
        calories: fields.calories.value
          ? Number(fields.calories.value)
          : null,
        subcategory_id: fields.subcategory_id.value.trim() || null,
        image_url: imageUrl,
        emoji: fields.emoji.value.trim() || null,
        allergens_verified: fields.allergens_verified.checked,
        is_active: fields.is_active.checked,
        sort_order: Number(fields.sort_order.value) || 0
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
