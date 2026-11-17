
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("reservationDateInput");
  const timeSelect = document.getElementById("reservationTime");
  const reservationForm = document.getElementById("reservationForm");
  const message = document.getElementById("reservationFormMessage");

  if (!dateInput || !timeSelect || !reservationForm) {
    console.error("Rezervasyon formu elemanları bulunamadı.");
    return;
  }

  function getLocalDate() {
    const now = new Date();

    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");
  }

  dateInput.min = getLocalDate();

  function populateTimeOptions() {
    timeSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Saat seçin";
    timeSelect.appendChild(placeholder);

    for (let hour = 9; hour <= 20; hour++) {
      for (const minute of [0, 30]) {
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

    timeSelect.disabled = false;
  }

  function handleDateChange() {
    if (!dateInput.value) {
      timeSelect.innerHTML =
        '<option value="">Önce tarih seçin</option>';
      return;
    }

    populateTimeOptions();
    message.textContent = "";
  }

  dateInput.addEventListener("change", handleDateChange);
  dateInput.addEventListener("input", handleDateChange);

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    message.textContent =
      "Rezervasyon sistemi henüz etkinleştirilmedi.";
  });
});
