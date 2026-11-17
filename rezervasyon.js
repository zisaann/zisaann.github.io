
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("reservationDateInput");
  const timeSelect = document.getElementById("reservationTime");
  const reservationForm = document.getElementById("reservationForm");
  const message = document.getElementById("reservationFormMessage");

  if (!dateInput || !timeSelect || !reservationForm) {
    return;
  }

  // Bugünün tarihini yerel saatle YYYY-MM-DD biçiminde al
  function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Geçmiş tarihlerde rezervasyon yapılmasını engelle
  dateInput.min = getLocalDate();

  // 09.00–22.00 çalışma saatleri
  // 30 dakikalık aralıklar, son başlangıç saati 20.30
  function populateTimeOptions() {
    timeSelect.innerHTML = '<option value="">Saat seçin</option>';

    for (let hour = 9; hour <= 20; hour++) {
      for (const minute of [0, 30]) {
        if (hour === 20 && minute > 30) continue;

        const value =
          String(hour).padStart(2, "0") +
          ":" +
          String(minute).padStart(2, "0");

        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;

        timeSelect.appendChild(option);
      }
    }
  }

  dateInput.addEventListener("change", () => {
    populateTimeOptions();
    message.textContent = "";
  });

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    message.textContent =
      "Rezervasyon sistemi henüz etkinleştirilmedi. Lütfen daha sonra tekrar deneyin.";
  });
});
