
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

async function loadStaff() {
  if (currentUserRole !== "owner") return;

  staffList.textContent = "Çalışanlar yükleniyor...";

  const { data, error } = await supabaseClient
    .from("admin_profiles")
    .select("user_id, full_name, email, role, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
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
    staffList.innerHTML =
      "<p>Henüz çalışan kaydı bulunmuyor.</p>";
    return;
  }

  staffList.innerHTML = employees.map(employee => `
    <article class="staff-card">

      <div>
        <h3>${staffEscape(employee.full_name)}</h3>

        <p>${staffEscape(employee.email)}</p>

        <p>${staffEscape(employee.user_id)}</p>

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

// ÇALIŞAN EKLEME
staffForm.addEventListener("submit", async event => {
  event.preventDefault();

  if (currentUserRole !== "owner") {
    alert("Bu işlem için yetkiniz bulunmuyor.");
    return;
  }

  const fullName = document.getElementById("staffName").value.trim();
  const email = document.getElementById("staffEmail").value.trim();
  const userId = document.getElementById("staffUserId").value.trim();
  const role = document.getElementById("staffRole").value;

  if (!fullName || !email || !userId) {
    alert("Lütfen bütün alanları doldurun.");
    return;
  }

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(userId)) {
    alert("Geçerli bir Supabase kullanıcı UID girin.");
    return;
  }

  if (!staffRoleNames[role]) {
    alert("Geçersiz çalışan rolü.");
    return;
  }

  const button = staffForm.querySelector("button[type='submit']");
  button.disabled = true;

  const { error } = await supabaseClient
    .from("admin_profiles")
    .insert({
      user_id: userId,
      full_name: fullName,
      email: email,
      role: role,
      is_active: true
    });

  button.disabled = false;

  if (error) {
    alert("Çalışan kaydedilemedi: " + error.message);
    return;
  }

  alert("Çalışan başarıyla kaydedildi.");
  staffForm.reset();
  await loadStaff();
});

// ROL DEĞİŞTİRME
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

// AKTİF / PASİF
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
