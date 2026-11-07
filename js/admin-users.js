
/* =========================================
   RESTORAN ÇALIŞAN YÖNETİMİ
   Yalnızca Owner kullanabilir.
========================================= */

const staffList = document.getElementById("staffList");
const staffSummary = document.getElementById("staffSummary");
const staffForm = document.getElementById("staffForm");

const staffRoleNames = {
  manager: "İşletme Müdürü",
  waiter: "Garson",
  kitchen: "Mutfak Personeli"
};

function staffEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// ÇALIŞANLARI LİSTELE
async function loadStaff() {
  if (currentUserRole !== "owner") return;
  if (!staffList || !staffSummary) return;

  staffList.textContent = "Çalışanlar yükleniyor...";

  const { data, error } = await supabaseClient
    .from("admin_profiles")
    .select("user_id, full_name, username, role, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Çalışan listesi hatası:", error);
    staffList.textContent = "Çalışanlar yüklenemedi: " + error.message;
    return;
  }

  const employees = (data || []).filter(
    employee => employee.role !== "owner"
  );

  staffSummary.textContent =
    `Toplam ${employees.length} çalışan · ` +
    `${employees.filter(e => e.is_active).length} aktif · ` +
    `${employees.filter(e => !e.is_active).length} pasif`;

  if (!employees.length) {
    staffList.innerHTML = "<p>Henüz çalışan kaydı bulunmuyor.</p>";
    return;
  }

  staffList.innerHTML = employees.map(employee => `
    <article class="staff-card">
      <div>
        <h3>${staffEscape(employee.full_name)}</h3>
        <p>Kullanıcı adı:
          <strong>${staffEscape(employee.username || "Tanımsız")}</strong>
        </p>
        <p>Görev:
          <strong>${staffRoleNames[employee.role] || "Tanımsız"}</strong>
        </p>
        <p>Durum:
          <strong>${employee.is_active ? "Aktif" : "Pasif"}</strong>
        </p>
      </div>

      <div class="staff-actions">
        <select
          data-staff-role="${staffEscape(employee.user_id)}"
          aria-label="Çalışan görevini değiştir">

          <option value="manager" ${employee.role === "manager" ? "selected" : ""}>
            İşletme Müdürü
          </option>

          <option value="waiter" ${employee.role === "waiter" ? "selected" : ""}>
            Garson
          </option>

          <option value="kitchen" ${employee.role === "kitchen" ? "selected" : ""}>
            Mutfak Personeli
          </option>
        </select>

        <button
          type="button"
          data-staff-toggle="${staffEscape(employee.user_id)}"
          data-active="${employee.is_active}">
          ${employee.is_active ? "Pasif Yap" : "Aktif Yap"}
        </button>
        <button
  type="button"
  data-staff-edit="${staffEscape(employee.user_id)}"
  data-staff-name="${staffEscape(employee.full_name)}">
  Adı Düzenle
</button>
<button
  type="button"
  data-staff-password="${staffEscape(employee.user_id)}">
  Şifre Sıfırla
</button>
      </div>
    </article>
  `).join("");
}

// YENİ ÇALIŞAN HESABI OLUŞTUR
if (staffForm) {
  staffForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (currentUserRole !== "owner") {
      alert("Bu işlem için yetkiniz bulunmuyor.");
      return;
    }

    const fullName = document.getElementById("staffName").value.trim();
    const username = document.getElementById("staffUsername").value.trim().toLowerCase();
    const password = document.getElementById("staffPassword").value;
    const role = document.getElementById("staffRole").value;

    if (!fullName || !username || !password) {
      alert("Lütfen bütün alanları doldurun.");
      return;
    }

    if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
      alert("Kullanıcı adı 3-30 karakter olmalıdır.");
      return;
    }

    if (password.length < 8) {
      alert("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    if (!staffRoleNames[role]) {
      alert("Geçersiz çalışan görevi.");
      return;
    }

    const button = staffForm.querySelector("button[type='submit']");
    button.disabled = true;
    button.textContent = "Hesap oluşturuluyor...";

    try {
      const { data, error } = await supabaseClient.functions.invoke(
        "create-staff",
        {
          body: { fullName, username, password, role }
        }
      );

      if (error) {
        console.error("Çalışan oluşturma hatası:", error);

        if (error.context) {
          const response = error.context;
          const responseText = await response.clone().text();
          console.error("FUNCTION RESPONSE:", responseText);
          alert("Sunucu hatası: " + responseText);
        } else {
          alert("Çalışan oluşturulamadı: " + error.message);
        }
        return;
      }

      if (!data?.success) {
        alert(data?.error || "Çalışan hesabı oluşturulamadı.");
        return;
      }

      alert("Çalışan hesabı başarıyla oluşturuldu.");
      staffForm.reset();
      await loadStaff();

    } catch (error) {
      console.error("Beklenmeyen hata:", error);
      alert("Beklenmeyen hata: " + error.message);

    } finally {
      button.disabled = false;
      button.textContent = "Çalışan Hesabını Oluştur";
    }
  });
}

// ÇALIŞAN GÖREVİNİ DEĞİŞTİR
if (staffList) {
  staffList.addEventListener("change", async event => {
    const select = event.target.closest("[data-staff-role]");
    if (!select || currentUserRole !== "owner") return;

    const { error } = await supabaseClient
      .from("admin_profiles")
      .update({ role: select.value })
      .eq("user_id", select.dataset.staffRole);

    if (error) {
      alert("Görev değiştirilemedi: " + error.message);
      await loadStaff();
      return;
    }

    await loadStaff();
  });

  // ÇALIŞANI AKTİF / PASİF YAP
  staffList.addEventListener("click", async event => {
    const button = event.target.closest("[data-staff-toggle]");
    if (!button || currentUserRole !== "owner") return;

    const currentlyActive = button.dataset.active === "true";

    const confirmed = confirm(
      currentlyActive
        ? "Bu çalışanı pasif yapmak istiyor musunuz?"
        : "Bu çalışanı yeniden aktif yapmak istiyor musunuz?"
    );

    if (!confirmed) return;

    const { error } = await supabaseClient
      .from("admin_profiles")
      .update({ is_active: !currentlyActive })
      .eq("user_id", button.dataset.staffToggle);

    if (error) {
      alert("Hesap durumu değiştirilemedi: " + error.message);
      return;
    }

    await loadStaff();
  });
}
// ÇALIŞAN ADINI DÜZENLE
if (staffList) {
  staffList.addEventListener("click", async event => {
    const button = event.target.closest("[data-staff-edit]");
    if (!button || currentUserRole !== "owner") return;

    const userId = button.dataset.staffEdit;
    const oldName = button.dataset.staffName;

    const newName = prompt("Yeni çalışan adını girin:", oldName);

    if (newName === null) return;

    const fullName = newName.trim();

    if (!fullName) {
      alert("Çalışan adı boş bırakılamaz.");
      return;
    }

    const { error } = await supabaseClient
      .from("admin_profiles")
      .update({ full_name: fullName })
      .eq("user_id", userId);

    if (error) {
      alert("Çalışan adı güncellenemedi: " + error.message);
      return;
    }

    alert("Çalışan adı başarıyla güncellendi.");
    await loadStaff();
  });
}
// ÇALIŞAN ŞİFRESİNİ SIFIRLA
if (staffList) {
  staffList.addEventListener("click", async event => {
    const button = event.target.closest("[data-staff-password]");
    if (!button || currentUserRole !== "owner") return;

    const userId = button.dataset.staffPassword;

    const password = prompt(
      "Yeni şifreyi girin (en az 8 karakter):"
    );

    if (password === null) return;

    if (password.length < 8) {
      alert("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    const confirmed = confirm(
      "Bu çalışanın şifresini değiştirmek istiyor musunuz?"
    );

    if (!confirmed) return;

    button.disabled = true;
    button.textContent = "Güncelleniyor...";

    try {
      const { data, error } = await supabaseClient.functions.invoke(
        "reset-staff-password",
        {
          body: { userId, password }
        }
      );

      if (error) {
        console.error("Şifre sıfırlama hatası:", error);
        alert("Şifre değiştirilemedi: " + error.message);
        return;
      }

      if (!data?.success) {
        alert(data?.error || "Şifre değiştirilemedi.");
        return;
      }

      alert("Çalışan şifresi başarıyla değiştirildi.");

    } catch (error) {
      console.error(error);
      alert("Beklenmeyen hata: " + error.message);

    } finally {
      button.disabled = false;
      button.textContent = "Şifre Sıfırla";
    }
  });
}
window.loadStaff = loadStaff;
