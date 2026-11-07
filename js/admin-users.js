
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

  staffList.textContent = "Çalışanlar yükleniyor...";

  const { data, error } = await supabaseClient
    .from("admin_profiles")
    .select("user_id, full_name, username, role, is_active, created_at")
    .order("created_at", { ascending: false });

 if (error) {
  console.error("Çalışan oluşturma hatası:", error);

  if (error.context) {
    const response = error.context;

    console.log("HTTP STATUS:", response.status);

    const responseText = await response.clone().text();

    console.log("FUNCTION RESPONSE:", responseText);

    alert("Sunucu hatası: " + responseText);
  } else {
    alert("Sunucu hatası: " + error.message);
  }

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

        <p>
          Kullanıcı adı:
          <strong>${staffEscape(employee.username || "Henüz tanımlanmamış")}</strong>
        </p>

        <p>
          Görev:
          <strong>${staffRoleNames[employee.role] || "Tanımsız"}</strong>
        </p>

        <p>
          Durum:
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

      </div>
    </article>
  `).join("");
}

// YENİ ÇALIŞAN HESABI OLUŞTUR
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
    alert("Kullanıcı adı 3-30 karakter olmalı; küçük harf, rakam, nokta, tire ve alt çizgi kullanılabilir.");
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

  const { data, error } = await supabaseClient.functions.invoke(
     console.log("FUNCTION DATA:", data);
console.log("FUNCTION ERROR:", error);
console.log("ERROR CONTEXT:", error?.context);
    "create-staff",
    {
      body: {
        fullName,
        username,
        password,
        role
      }
    }
  );

  button.disabled = false;
  button.textContent = "Çalışan Hesabını Oluştur";

  if (error) {
    console.error("Çalışan oluşturma hatası:", error);
    alert("Çalışan oluşturulamadı: " + error.message);
    return;
  }

  if (!data?.success) {
    alert(data?.error || "Çalışan hesabı oluşturulamadı.");
    return;
  }

  alert("Çalışan hesabı başarıyla oluşturuldu.");

  staffForm.reset();
  await loadStaff();
});

// ÇALIŞAN GÖREVİNİ DEĞİŞTİR
staffList.addEventListener("change", async event => {
  const select = event.target.closest("[data-staff-role]");

  if (!select || currentUserRole !== "owner") return;

  const userId = select.dataset.staffRole;
  const newRole = select.value;

  if (!staffRoleNames[newRole]) return;

  const { error } = await supabaseClient
    .from("admin_profiles")
    .update({ role: newRole })
    .eq("user_id", userId);

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

  const userId = button.dataset.staffToggle;
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
    .eq("user_id", userId);

  if (error) {
    alert("Hesap durumu değiştirilemedi: " + error.message);
    return;
  }

  await loadStaff();
});

window.loadStaff = loadStaff;
