
/* =========================================
   LUNA - İŞLETME BİLGİLERİ
========================================= */

const businessForm = document.getElementById("businessSettingsForm");
const saveBusinessButton = document.getElementById("saveBusinessSettings");

async function loadBusinessSettings() {
  if (!businessForm) return;

  const { data, error } = await supabaseClient
    .from("business_settings")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("İşletme bilgileri yüklenemedi:", error);
    return;
  }

  if (!data) return;

  document.getElementById("businessName").value = data.business_name || "";
  document.getElementById("businessLogo").value = data.logo_url || "";
  document.getElementById("businessAddress").value = data.address || "";
  document.getElementById("businessPhone").value = data.phone || "";
  document.getElementById("businessHours").value = data.business_hours || "";
  document.getElementById("businessDescription").value = data.description || "";
}

async function saveBusinessSettings() {
  if (!businessForm) return;

  const businessName = document.getElementById("businessName").value.trim();

  if (!businessName) {
    alert("İşletme adı boş bırakılamaz.");
    return;
  }

  saveBusinessButton.disabled = true;
  saveBusinessButton.textContent = "Kaydediliyor...";

  const settingsData = {
    business_name: businessName,
    logo_url: document.getElementById("businessLogo").value.trim() || null,
    address: document.getElementById("businessAddress").value.trim() || null,
    phone: document.getElementById("businessPhone").value.trim() || null,
    business_hours: document.getElementById("businessHours").value.trim() || null,
    description: document.getElementById("businessDescription").value.trim() || null,
    updated_at: new Date().toISOString()
  };

  try {
    const { data: existing, error: readError } = await supabaseClient
      .from("business_settings")
      .select("id")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (readError) throw readError;

    let result;

    if (existing) {
      result = await supabaseClient
        .from("business_settings")
        .update(settingsData)
        .eq("id", existing.id);
    } else {
      result = await supabaseClient
        .from("business_settings")
        .insert(settingsData);
    }

    if (result.error) throw result.error;

    alert("İşletme bilgileri başarıyla kaydedildi.");

  } catch (error) {
    console.error("İşletme bilgileri kaydedilemedi:", error);
    alert("Kaydetme sırasında bir hata oluştu.");
  } finally {
    saveBusinessButton.disabled = false;
    saveBusinessButton.textContent = "Bilgileri Kaydet";
  }
}

if (saveBusinessButton) {
  saveBusinessButton.addEventListener("click", saveBusinessSettings);
}

loadBusinessSettings();
