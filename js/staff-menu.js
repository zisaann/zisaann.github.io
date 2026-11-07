
const staffMenuList = document.getElementById("staffMenuList");
const staffMenuSearch = document.getElementById("staffMenuSearch");

let staffMenuProducts = [];

async function loadStaffMenu() {
  if (!staffMenuList) return;

  staffMenuList.textContent = "Menü yükleniyor...";

  try {
    const [
      productResult,
      subcategoryResult,
      allergenResult,
      connectionResult
    ] = await Promise.all([
      supabaseClient
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),

      supabaseClient
        .from("subcategories")
        .select("id, name, category_id"),

      supabaseClient
        .from("allergens")
        .select("id, name"),

      supabaseClient
        .from("product_allergens")
        .select("product_id, allergen_id")
    ]);

    if (productResult.error) throw productResult.error;
    if (subcategoryResult.error) throw subcategoryResult.error;
    if (allergenResult.error) throw allergenResult.error;
    if (connectionResult.error) throw connectionResult.error;

    const subcategories = subcategoryResult.data || [];
    const allergens = allergenResult.data || [];
    const connections = connectionResult.data || [];

    staffMenuProducts = (productResult.data || []).map(product => {
      const subcategory = subcategories.find(
        item => item.id === product.subcategory_id
      );

      const productAllergenIds = connections
        .filter(item => item.product_id === product.id)
        .map(item => item.allergen_id);

      const productAllergens = allergens.filter(
        item => productAllergenIds.includes(item.id)
      );

      return {
        ...product,
        subcategoryName: subcategory?.name || "",
        allergenNames: productAllergens.map(item => item.name)
      };
    });

    renderStaffMenu(staffMenuProducts);

  } catch (error) {
    staffMenuList.textContent =
      "Menü yüklenemedi: " + error.message;
  }
}

function renderStaffMenu(list) {
  staffMenuList.innerHTML = "";

  if (list.length === 0) {
    staffMenuList.textContent = "Gösterilecek ürün bulunamadı.";
    return;
  }

  list.forEach(product => {
    const card = document.createElement("article");

    card.style.cssText = `
      background: white;
      border: 1px solid #e8e9e5;
      border-radius: 15px;
      padding: 18px;
      margin-top: 14px;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    `;

    if (product.image_url) {
      const image = document.createElement("img");
      image.src = product.image_url;
      image.alt = product.name;
      image.style.cssText = `
        width: 90px;
        height: 90px;
        object-fit: cover;
        border-radius: 12px;
      `;
      card.appendChild(image);
    }

    const info = document.createElement("div");
    info.style.cssText = "flex:1; min-width:180px;";

    const name = document.createElement("h3");
    name.textContent = `${product.emoji || "🍽️"} ${product.name}`;
    name.style.margin = "0 0 8px";

    const category = document.createElement("p");
    category.textContent = product.subcategoryName;
    category.style.cssText = "margin:0 0 8px; color:#777;";

    const description = document.createElement("p");
    description.textContent =
      product.description || "Ürün açıklaması eklenmemiş.";
    description.style.cssText = "margin:0 0 8px;";

    info.append(name, category, description);

    if (currentUserRole === "waiter") {
      const price = document.createElement("p");
      price.textContent =
        `${Number(product.price || 0).toLocaleString("tr-TR")} TL`;
      price.style.cssText =
        "font-weight:700; color:#557b61; margin:8px 0;";
      info.appendChild(price);
    }

    const allergenInfo = document.createElement("p");
    allergenInfo.style.cssText =
      "margin:8px 0 0; font-size:13px; color:#8b563c;";

    allergenInfo.textContent = product.allergens_verified
      ? (
          product.allergenNames.length
            ? "Alerjenler: " + product.allergenNames.join(", ")
            : "Kayıtlı alerjen bulunmuyor."
        )
      : "Alerjen bilgileri henüz doğrulanmamıştır.";

    info.appendChild(allergenInfo);
    card.appendChild(info);
    staffMenuList.appendChild(card);
  });
}

if (staffMenuSearch) {
  staffMenuSearch.addEventListener("input", () => {
    const search = staffMenuSearch.value.toLocaleLowerCase("tr");

    const filtered = staffMenuProducts.filter(product =>
      (product.name || "").toLocaleLowerCase("tr").includes(search) ||
      (product.description || "").toLocaleLowerCase("tr").includes(search) ||
      (product.subcategoryName || "").toLocaleLowerCase("tr").includes(search)
    );

    renderStaffMenu(filtered);
  });
}

window.loadStaffMenu = loadStaffMenu;
