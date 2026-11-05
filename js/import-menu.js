(() => {
  const statusEl = document.getElementById("importStatus");
  const previewEl = document.getElementById("importPreview");
  const importButton = document.getElementById("startImport");

  const say = (message) => {
    statusEl.textContent = message;
  };

  const productKey = (subcategoryId, name) => `${subcategoryId}::${name}`;

  async function getAuthorizedAdmin() {
    const { data: sessionData, error: sessionError } =
      await supabaseClient.auth.getSession();

    if (sessionError) throw sessionError;
    const user = sessionData?.session?.user;
    if (!user) throw new Error("Önce yönetici hesabınla giriş yapmalısın.");

    const { data: profile, error: profileError } = await supabaseClient
      .from("admin_profiles")
      .select("role, is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile || profile.is_active !== true ||
        !["owner", "admin"].includes(profile.role)) {
      throw new Error("Bu işlem için aktif yönetici yetkisi gerekiyor.");
    }
    return user;
  }

  async function loadMappings() {
    const [{ data: categories, error: categoryError },
           { data: subcategories, error: subcategoryError },
           { data: allergens, error: allergenError }] = await Promise.all([
      supabaseClient.from("categories")
        .select("id, name, is_active")
        .eq("is_active", true),
      supabaseClient.from("subcategories")
        .select("id, category_id, name, is_active")
        .eq("is_active", true),
      supabaseClient.from("allergens").select("id")
    ]);

    if (categoryError) throw categoryError;
    if (subcategoryError) throw subcategoryError;
    if (allergenError) throw allergenError;

    const categoryNames = new Map(categories.map(c => [c.id, c.name]));
    const subcategoryIds = new Map();

    for (const sub of subcategories) {
      const categoryName = categoryNames.get(sub.category_id);
      if (categoryName) {
        subcategoryIds.set(`${categoryName}::${sub.name}`, sub.id);
      }
    }

    return {
      subcategoryIds,
      allergenIds: new Set(allergens.map(a => a.id))
    };
  }

  function buildSourceRows(subcategoryIds) {
    const rows = [];
    const missingGroups = [];
    const sortBySubcategory = new Map();

    for (const product of window.OLD_PRODUCTS) {
      const subcategoryId = subcategoryIds.get(
        `${product.category}::${product.subcategory}`
      );

      if (!subcategoryId) {
        missingGroups.push(`${product.category} / ${product.subcategory}`);
        continue;
      }

      const sortOrder = sortBySubcategory.get(subcategoryId) || 0;
      sortBySubcategory.set(subcategoryId, sortOrder + 1);

      rows.push({
        subcategory_id: subcategoryId,
        name: product.name,
        description: product.description || "",
        price: Number.isFinite(Number(product.price)) ? Number(product.price) : null,
        calories: Number.isFinite(Number(product.calories)) ? Number(product.calories) : null,
        image_url: product.image || null,
        emoji: product.emoji || "🍽️",
        allergens_verified: false,
        is_active: true,
        sort_order: sortOrder
      });
    }

    return { rows, missingGroups: [...new Set(missingGroups)] };
  }

  async function preview() {
    await getAuthorizedAdmin();
    const { subcategoryIds } = await loadMappings();
    const { rows, missingGroups } = buildSourceRows(subcategoryIds);

    previewEl.textContent =
      `Eski dosyada ${window.OLD_PRODUCTS.length} ürün bulundu.\n` +
      `Kategori/alt kategori eşleşmesi bulunan: ${rows.length}\n` +
      `Eşleşmeyen grup sayısı: ${missingGroups.length}\n\n` +
      (missingGroups.length
        ? `Eşleşmeyen gruplar:\n${missingGroups.join("\n")}`
        : "Tüm ürün grupları veritabanındaki alt kategorilerle eşleşiyor.") +
      "\n\nİçe aktarma mevcut ürünleri silmez veya güncellemez. " +
      "Aynı alt kategoride aynı isimli ürün varsa atlanır.";
    importButton.disabled = rows.length === 0;
    return rows.length;
  }

  async function importAll() {
    importButton.disabled = true;
    try {
      say("Yönetici yetkisi kontrol ediliyor…");
      await getAuthorizedAdmin();

      say("Kategori ve alerjen eşleşmeleri hazırlanıyor…");
      const { subcategoryIds, allergenIds } = await loadMappings();
      const { rows, missingGroups } = buildSourceRows(subcategoryIds);

      if (missingGroups.length) {
        throw new Error(
          "Bazı kategori/alt kategori adları eşleşmedi. Önce veritabanındaki adları kontrol et: " +
          missingGroups.join(", ")
        );
      }

      const { data: existingProducts, error: existingError } = await supabaseClient
        .from("products")
        .select("id, name, subcategory_id");

      if (existingError) throw existingError;

      const productMap = new Map();
      for (const product of (existingProducts || [])) {
        productMap.set(productKey(product.subcategory_id, product.name), product);
      }

      const newRows = rows.filter(row =>
        !productMap.has(productKey(row.subcategory_id, row.name))
      );

      let addedCount = 0;
      for (let i = 0; i < newRows.length; i += 25) {
        const batch = newRows.slice(i, i + 25);
        say(`Ürünler ekleniyor… ${Math.min(i + batch.length, newRows.length)} / ${newRows.length}`);

        const { data: inserted, error: insertError } = await supabaseClient
          .from("products")
          .insert(batch)
          .select("id, name, subcategory_id");

        if (insertError) throw insertError;

        for (const product of (inserted || [])) {
          productMap.set(productKey(product.subcategory_id, product.name), product);
          addedCount++;
        }
      }

      const sourceProductByKey = new Map();
      for (const sourceProduct of window.OLD_PRODUCTS) {
        const subcategoryId = subcategoryIds.get(
          `${sourceProduct.category}::${sourceProduct.subcategory}`
        );
        if (subcategoryId) {
          sourceProductByKey.set(
            productKey(subcategoryId, sourceProduct.name),
            sourceProduct
          );
        }
      }

      const allProductIds = [...productMap.values()].map(p => p.id);
      const existingLinks = new Set();

      for (let i = 0; i < allProductIds.length; i += 500) {
        const idBatch = allProductIds.slice(i, i + 500);
        const { data: links, error: linksError } = await supabaseClient
          .from("product_allergens")
          .select("product_id, allergen_id")
          .in("product_id", idBatch);

        if (linksError) throw linksError;
        for (const link of (links || [])) {
          existingLinks.add(`${link.product_id}::${link.allergen_id}`);
        }
      }

      const allergenRows = [];
      for (const [key, product] of productMap) {
        const sourceProduct = sourceProductByKey.get(key);
        if (!sourceProduct || !Array.isArray(sourceProduct.allergens)) continue;

        for (const allergenId of sourceProduct.allergens) {
          if (!allergenIds.has(allergenId)) continue;
          const linkKey = `${product.id}::${allergenId}`;
          if (!existingLinks.has(linkKey)) {
            allergenRows.push({
              product_id: product.id,
              allergen_id: allergenId
            });
            existingLinks.add(linkKey);
          }
        }
      }

      let allergenLinkCount = 0;
      for (let i = 0; i < allergenRows.length; i += 100) {
        const batch = allergenRows.slice(i, i + 100);
        say(`Alerjen bağlantıları ekleniyor… ${Math.min(i + batch.length, allergenRows.length)} / ${allergenRows.length}`);

        const { error: allergenInsertError } = await supabaseClient
          .from("product_allergens")
          .insert(batch);

        if (allergenInsertError) throw allergenInsertError;
        allergenLinkCount += batch.length;
      }

      const skippedCount = rows.length - addedCount;
      say(
        `Aktarım tamamlandı!\n` +
        `Yeni eklenen ürün: ${addedCount}\n` +
        `Zaten bulunduğu için atlanan ürün: ${skippedCount}\n` +
        `Eklenen alerjen bağlantısı: ${allergenLinkCount}\n\n` +
        `Not: Fiyatlar ve alerjenler eski menü dosyasından alınmıştır; ` +
        `işletme tarafından doğrulanmalıdır. Alerjen doğrulama durumu güvenlik amacıyla kapalı bırakıldı.`
      );
    } catch (error) {
      console.error("Menü aktarım hatası:", error);
      say(`Aktarım yapılamadı: ${error.message || error}\n\nGeliştirici konsolundaki hatayı da kontrol edebilirsin.`);
    } finally {
      importButton.disabled = false;
    }
  }

  importButton.addEventListener("click", async () => {
    const confirmed = window.confirm(
      "Eski menüdeki ürünler Supabase'e aktarılacak. Mevcut kayıtlar silinmeyecek veya güncellenmeyecek. Devam edilsin mi?"
    );
    if (confirmed) await importAll();
  });

  preview().then(() => say("Önizleme hazır. Aktarımı başlatmadan önce ürün sayısını kontrol et."))
    .catch(error => {
      console.error(error);
      say(`Önizleme alınamadı: ${error.message || error}`);
      importButton.disabled = true;
    });
})();
