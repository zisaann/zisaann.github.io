
/* =========================================
   İŞLEM GEÇMİŞİ
========================================= */

window.loadAuditLogs = async function () {
  const status = document.getElementById("auditLogStatus");
  const list = document.getElementById("auditLogList");

  if (!status || !list) return;

  status.textContent = "İşlem kayıtları yükleniyor...";
  list.innerHTML = "";

  try {
    const { data, error } = await supabaseClient
      .from("audit_logs")
      .select(`
        id,
        actor_name,
        action,
        table_name,
        record_name,
        old_data,
        new_data,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    if (!data || data.length === 0) {
      status.textContent = "Henüz işlem kaydı bulunmuyor.";
      return;
    }

    const actionNames = {
      create: "Oluşturma",
      update: "Güncelleme",
      delete: "Silme",
      status_change: "Durum değişikliği",
      role_change: "Görev değişikliği",
      password_reset: "Şifre güncelleme"
    };

    const tableNames = {
      products: "Ürünler",
      categories: "Kategoriler",
      subcategories: "Alt kategoriler",
      admin_profiles: "Çalışan hesapları"
    };

    const escapeHTML = value =>
      String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]);

    list.innerHTML = data.map(log => {
      const date = new Date(log.created_at).toLocaleString("tr-TR");

      return `
        <article class="audit-log-item">
          <div class="audit-log-top">
            <strong>${escapeHTML(actionNames[log.action] || log.action)}</strong>
            <span>${escapeHTML(date)}</span>
          </div>

          <div class="audit-log-details">
            <span><b>İşlemi yapan:</b> ${escapeHTML(log.actor_name || "Bilinmeyen kullanıcı")}</span>
            <span><b>Bölüm:</b> ${escapeHTML(tableNames[log.table_name] || log.table_name)}</span>
            <span><b>Kayıt:</b> ${escapeHTML(log.record_name || "Belirtilmemiş")}</span>
          </div>
        </article>
      `;
    }).join("");

    status.textContent = `${data.length} işlem kaydı listeleniyor.`;

  } catch (error) {
    console.error("İşlem geçmişi yüklenemedi:", error);
    status.textContent = "İşlem kayıtları yüklenirken bir hata oluştu.";
    list.textContent = "Lütfen bağlantıyı ve erişim izinlerini kontrol edin.";
  }
};
