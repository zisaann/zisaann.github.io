
/* =========================================
   İŞLEM GEÇMİŞİ - TABLO GÖRÜNÜMÜ
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

    const actionClasses = {
      create: "audit-create",
      update: "audit-update",
      delete: "audit-delete",
      status_change: "audit-status",
      role_change: "audit-role",
      password_reset: "audit-password"
    };

    list.innerHTML = `
      <div class="audit-table-wrapper">
        <table class="audit-table">
          <thead>
            <tr>
              <th>İŞLEM</th>
              <th>İŞLEMİ YAPAN</th>
              <th>BÖLÜM</th>
              <th>KAYIT</th>
              <th>TARİH VE SAAT</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(log => {
              const date = new Date(log.created_at);

              const dateText = date.toLocaleDateString("tr-TR");
              const timeText = date.toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit"
              });

              const actionName =
                actionNames[log.action] || log.action;

              const actionClass =
                actionClasses[log.action] || "audit-default";

              return `
                <tr>
                  <td>
                    <span class="audit-action ${actionClass}">
                      ${escapeHTML(actionName)}
                    </span>
                  </td>

                  <td class="audit-user">
                    ${escapeHTML(log.actor_name || "Bilinmeyen kullanıcı")}
                  </td>

                  <td>
                    ${escapeHTML(tableNames[log.table_name] || log.table_name)}
                  </td>

                  <td class="audit-record">
                    ${escapeHTML(log.record_name || "Belirtilmemiş")}
                  </td>

                  <td class="audit-date">
                    <span>${escapeHTML(dateText)}</span>
                    <small>${escapeHTML(timeText)}</small>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;

    status.textContent = `${data.length} işlem kaydı listeleniyor.`;

  } catch (error) {
    console.error("İşlem geçmişi yüklenemedi:", error);
    status.textContent = "İşlem kayıtları yüklenirken bir hata oluştu.";
    list.textContent = "Lütfen bağlantıyı ve erişim izinlerini kontrol edin.";
  }
};
