
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

  if (!tableBody) return;

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

    console.error("Rezervasyonlar yüklenemedi:", error);

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

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  setText("todayReservations", todayCount);
  setText("pendingReservations", pendingCount);
  setText("confirmedReservations", confirmedCount);
  setText("totalReservations", allReservations.length);
}

// =========================================
// REZERVASYONLARI GÖSTER
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

      return (
        (customerName.includes(search) ||
          reservationCode.includes(search)) &&
        (!selectedDate ||
          reservation.reservation_date === selectedDate) &&
        (!selectedStatus ||
          reservation.status === selectedStatus)
      );
    }
  );

  if (!filteredReservations.length) {

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
        reservation.reservation_date || ""
      ).split("-");

      const formattedDate = dateParts.length === 3
        ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`
        : "-";

      const time = String(
        reservation.reservation_time || "-"
      ).slice(0, 5);

      const statusLabel =
        reservationStatusLabels[reservation.status] ||
        "Bilinmiyor";

      return `
        <tr>
          <td>
            <strong>${escapeHTML(reservation.customer_name)}</strong>
            <small>${escapeHTML(reservation.reservation_code || "-")}</small>
          </td>

          <td>${escapeHTML(reservation.phone || "-")}</td>
          <td>${formattedDate}</td>
          <td>${time}</td>
          <td>${Number(reservation.guest_count) || 0} kişi</td>

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
// FİLTRELER
// =========================================

function setupReservationFilters() {

  const search = document.getElementById("reservationSearch");
  const date = document.getElementById("reservationDateFilter");
  const status = document.getElementById("reservationStatusFilter");
  const clear = document.getElementById("clearReservationFilters");

  if (search && !search.dataset.bound) {
    search.addEventListener("input", renderReservations);
    search.dataset.bound = "true";
  }

  if (date && !date.dataset.bound) {
    date.addEventListener("change", renderReservations);
    date.dataset.bound = "true";
  }

  if (status && !status.dataset.bound) {
    status.addEventListener("change", renderReservations);
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
// REZERVASYON DETAY PENCERESİ
// =========================================

function openReservationDetail(reservationId) {

  console.log("Detay fonksiyonuna girildi:", reservationId);

  const reservation = allReservations.find(
    r => String(r.id) === String(reservationId)
  );

  if (!reservation) {
    console.error("Rezervasyon bulunamadı:", reservationId);
    return;
  }

  let modal = document.getElementById(
    "reservationDetailModal"
  );

  if (!modal) {

    modal = document.createElement("div");
    modal.id = "reservationDetailModal";
    modal.className = "reservation-modal";

    document.body.appendChild(modal);
  }

  const dateParts = String(
    reservation.reservation_date || ""
  ).split("-");

  const formattedDate = dateParts.length === 3
    ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`
    : "-";

  const statusLabel =
    reservationStatusLabels[reservation.status] ||
    "Bilinmiyor";

  modal.innerHTML = `
    <div class="reservation-modal-content">

      <div class="reservation-modal-header">

        <div>
          <span class="reservation-modal-eyebrow">
            REZERVASYON DETAYI
          </span>

          <h2>${escapeHTML(reservation.customer_name)}</h2>

          <p>
            Rezervasyon No:
            ${escapeHTML(reservation.reservation_code || "-")}
          </p>
        </div>

        <button
          type="button"
          class="reservation-modal-close"
          data-close-reservation
          aria-label="Pencereyi kapat">
          &times;
        </button>

      </div>

      <div class="reservation-modal-grid">

        <div class="reservation-modal-item">
          <span>Telefon</span>
          <strong>${escapeHTML(reservation.phone || "-")}</strong>
        </div>

        <div class="reservation-modal-item">
          <span>Rezervasyon Durumu</span>
          <strong>${escapeHTML(statusLabel)}</strong>
        </div>

        <div class="reservation-modal-item">
          <span>Tarih</span>
          <strong>${formattedDate}</strong>
        </div>

        <div class="reservation-modal-item">
          <span>Saat</span>
          <strong>
            ${escapeHTML(String(reservation.reservation_time || "-").slice(0, 5))}
          </strong>
        </div>

        <div class="reservation-modal-item">
          <span>Kişi Sayısı</span>
          <strong>${Number(reservation.guest_count) || 0} kişi</strong>
        </div>

      </div>

      <div class="reservation-modal-note">
        <span>Müşteri Notu</span>
        <p>
          ${escapeHTML(reservation.note || "Müşteri not bırakmamış.")}
        </p>
      </div>

      <div class="reservation-modal-footer">
        <button
          type="button"
          class="btn-secondary"
          data-close-reservation>
          Kapat
        </button>
      </div>

    </div>
  `;

  modal.classList.add("active");
}

// =========================================
// TIKLAMA İŞLEMLERİ
// =========================================

if (!window.reservationDetailEventsBound) {

  document.addEventListener("click", function(event) {

    const detailButton = event.target.closest(
      ".reservation-detail-btn"
    );

    if (detailButton) {

      openReservationDetail(detailButton.dataset.id);
      return;
    }

    if (
      event.target.closest("[data-close-reservation]") ||
      event.target.id === "reservationDetailModal"
    ) {

      document.getElementById(
        "reservationDetailModal"
      )?.classList.remove("active");
    }

  });

  window.reservationDetailEventsBound = true;
}

// =========================================
// ESC İLE KAPAT
// =========================================

if (!window.reservationEscapeBound) {

  document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

      document.getElementById(
        "reservationDetailModal"
      )?.classList.remove("active");
    }

  });

  window.reservationEscapeBound = true;
}

// =========================================
// GÜVENLİ HTML
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

console.log("Ahenk rezervasyon yönetimi başarıyla yüklendi.");
