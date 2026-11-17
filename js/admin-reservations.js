
// =========================================
// AHENK RESTAURANT
// REZERVASYON YÖNETİMİ
// =========================================

let allReservations = [];

const reservationStatusLabels = {
  pending: "Onay Bekliyor",
  confirmed: "Onaylandı",
  cancelled: "İptal Edildi",
  completed: "Tamamlandı",
  no_show: "Gelmedi"
};

// =========================================
// REZERVASYONLARI YÜKLE
// =========================================

window.loadReservations = async function () {

  const tableBody = document.getElementById(
    "reservationsTableBody"
  );

  if (!tableBody) {
    console.error("Rezervasyon tablosu bulunamadı.");
    return;
  }

  tableBody.innerHTML = `
    <tr>
      <td colspan="7">Rezervasyonlar yükleniyor...</td>
    </tr>
  `;

  try {

    const { data, error } = await supabaseClient
      .from("reservations")
      .select(`
        id,
        reservation_code,
        customer_name,
        phone,
        guest_count,
        reservation_date,
        reservation_time,
        status,
        note
      `)
      .order("reservation_date", { ascending: true })
      .order("reservation_time", { ascending: true });

    if (error) throw error;

    allReservations = data || [];

    updateReservationStats();
    setupReservationFilters();
    renderReservations();

  } catch (error) {

    console.error(
      "Rezervasyonlar yüklenemedi:",
      error
    );

    tableBody.innerHTML = `
      <tr>
        <td colspan="7">
          Rezervasyonlar yüklenemedi.
          Yetki veya bağlantı ayarlarını kontrol edin.
        </td>
      </tr>
    `;
  }
};

// =========================================
// İSTATİSTİKLER
// =========================================

function updateReservationStats() {

  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  const todayCount = allReservations.filter(r =>
    r.reservation_date === todayString &&
    !["cancelled", "no_show"].includes(r.status)
  ).length;

  const pendingCount = allReservations.filter(
    r => r.status === "pending"
  ).length;

  const confirmedCount = allReservations.filter(
    r => r.status === "confirmed"
  ).length;

  document.getElementById("todayReservations").textContent =
    todayCount;

  document.getElementById("pendingReservations").textContent =
    pendingCount;

  document.getElementById("confirmedReservations").textContent =
    confirmedCount;

  document.getElementById("totalReservations").textContent =
    allReservations.length;
}

// =========================================
// REZERVASYONLARI FİLTRELE VE GÖSTER
// =========================================

function renderReservations() {

  const tableBody = document.getElementById(
    "reservationsTableBody"
  );

  if (!tableBody) return;

  const search = (
    document.getElementById("reservationSearch")?.value || ""
  ).toLocaleLowerCase("tr-TR").trim();

  const selectedDate =
    document.getElementById("reservationDateFilter")?.value || "";

  const selectedStatus =
    document.getElementById("reservationStatusFilter")?.value || "";

  const filteredReservations = allReservations.filter(
    reservation => {

      const customerName = String(
        reservation.customer_name || ""
      ).toLocaleLowerCase("tr-TR");

      const reservationCode = String(
        reservation.reservation_code || ""
      ).toLocaleLowerCase("tr-TR");

      const matchesSearch =
        customerName.includes(search) ||
        reservationCode.includes(search);

      const matchesDate =
        !selectedDate ||
        reservation.reservation_date === selectedDate;

      const matchesStatus =
        !selectedStatus ||
        reservation.status === selectedStatus;

      return (
        matchesSearch &&
        matchesDate &&
        matchesStatus
      );
    }
  );

  if (filteredReservations.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="7">
          Arama kriterlerine uygun rezervasyon bulunamadı.
        </td>
      </tr>
    `;

    return;
  }

  tableBody.innerHTML = filteredReservations.map(
    reservation => {

      const dateParts = String(
        reservation.reservation_date
      ).split("-");

      const formattedDate =
        `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

      const time = String(
        reservation.reservation_time
      ).slice(0, 5);

      const statusLabel =
        reservationStatusLabels[reservation.status] ||
        "Bilinmiyor";

      return `
        <tr>

          <td>
            <strong>
              ${escapeHTML(reservation.customer_name)}
            </strong>
            <small>
              ${escapeHTML(reservation.reservation_code || "-")}
            </small>
          </td>

          <td>
            ${escapeHTML(reservation.phone)}
          </td>

          <td>
            ${formattedDate}
          </td>

          <td>
            ${time}
          </td>

          <td>
            ${Number(reservation.guest_count)} kişi
          </td>

          <td>
            <span class="status-badge status-${escapeHTML(reservation.status)}">
              ${statusLabel}
            </span>
          </td>

          <td>
            <button
              type="button"
              class="btn-secondary reservation-detail-btn"
              data-id="${escapeHTML(reservation.id)}">
              Detay
            </button>
          </td>

        </tr>
      `;

    }
  ).join("");
}

// =========================================
// FİLTRELERİ BAĞLA
// =========================================

function setupReservationFilters() {

  const search = document.getElementById(
    "reservationSearch"
  );

  const date = document.getElementById(
    "reservationDateFilter"
  );

  const status = document.getElementById(
    "reservationStatusFilter"
  );

  const clear = document.getElementById(
    "clearReservationFilters"
  );

  if (search && !search.dataset.bound) {

    search.addEventListener(
      "input",
      renderReservations
    );

    search.dataset.bound = "true";
  }

  if (date && !date.dataset.bound) {

    date.addEventListener(
      "change",
      renderReservations
    );

    date.dataset.bound = "true";
  }

  if (status && !status.dataset.bound) {

    status.addEventListener(
      "change",
      renderReservations
    );

    status.dataset.bound = "true";
  }

  if (clear && !clear.dataset.bound) {

    clear.addEventListener("click", () => {

      if (search) search.value = "";
      if (date) date.value = "";
      if (status) status.value = "";

      renderReservations();
    });

    clear.dataset.bound = "true";
  }
}

// =========================================
// GÜVENLİ HTML METNİ
// =========================================

function escapeHTML(value) {

  return String(value ?? "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]
  );
}
