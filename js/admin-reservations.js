
// =========================================
// AHENK RESTAURANT - REZERVASYON YÖNETİMİ
// =========================================

window.loadReservations = async function () {
  const tableBody = document.getElementById("reservationsTableBody");

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

    const reservations = data || [];

    // Tarihleri yerel biçimde göster
    const today = new Date();
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    const todayCount = reservations.filter(r =>
      r.reservation_date === todayString &&
      !["cancelled", "no_show"].includes(r.status)
    ).length;

    const pendingCount = reservations.filter(
      r => r.status === "pending"
    ).length;

    const confirmedCount = reservations.filter(
      r => r.status === "confirmed"
    ).length;

    document.getElementById("todayReservations").textContent = todayCount;
    document.getElementById("pendingReservations").textContent = pendingCount;
    document.getElementById("confirmedReservations").textContent = confirmedCount;
    document.getElementById("totalReservations").textContent = reservations.length;

    if (reservations.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7">Henüz rezervasyon bulunmuyor.</td>
        </tr>
      `;
      return;
    }

    const statusLabels = {
      pending: "Onay Bekliyor",
      confirmed: "Onaylandı",
      cancelled: "İptal Edildi",
      completed: "Tamamlandı",
      no_show: "Gelmedi"
    };

    tableBody.innerHTML = reservations.map(reservation => {
      const dateParts = reservation.reservation_date.split("-");
      const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

      const time = String(reservation.reservation_time).slice(0, 5);

      const safeName = escapeHTML(reservation.customer_name);
      const safePhone = escapeHTML(reservation.phone);
      const safeCode = escapeHTML(reservation.reservation_code || "-");
      const safeStatus = statusLabels[reservation.status] || "Bilinmiyor";

      return `
        <tr>
          <td>
            <strong>${safeName}</strong>
            <small>${safeCode}</small>
          </td>
          <td>${safePhone}</td>
          <td>${formattedDate}</td>
          <td>${time}</td>
          <td>${reservation.guest_count} kişi</td>
          <td>
            <span class="status-badge status-${reservation.status}">
              ${safeStatus}
            </span>
          </td>
          <td>
            <button
              type="button"
              class="btn-secondary reservation-detail-btn"
              data-id="${reservation.id}">
              Detay
            </button>
          </td>
        </tr>
      `;
    }).join("");

  } catch (error) {
    console.error("Rezervasyonlar yüklenemedi:", error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="7">
          Rezervasyonlar yüklenemedi. Yetki veya bağlantı ayarlarını kontrol edin.
        </td>
      </tr>
    `;
  }
};

// HTML içine güvenli metin yerleştirmek için
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}
