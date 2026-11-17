
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("reservationDateInput");
  const timeSelect = document.getElementById("reservationTime");
  const guestsSelect = document.getElementById("reservationGuests");
  const reservationForm = document.getElementById("reservationForm");
  const message = document.getElementById("reservationFormMessage");

  if (!dateInput || !timeSelect || !guestsSelect || !reservationForm) {
    console.error("Rezervasyon formu elemanları bulunamadı.");
    return;
  }

  let requestNumber = 0;

  function getLocalDate() {
    const now = new Date();

    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");
  }

  dateInput.min = getLocalDate();

  function resetTimeSelect(text) {
    timeSelect.innerHTML = "";

    const option = document.createElement("option");
    option.value = "";
    option.textContent = text;

    timeSelect.appendChild(option);
    timeSelect.disabled = true;
  }

  async function loadAvailableTimes() {
    const currentRequest = ++requestNumber;
    const date = dateInput.value;
    const guestCount = Number(guestsSelect.value);

    if (!date || !guestCount) {
      resetTimeSelect("Önce tarih ve kişi sayısı seçin");
      return;
    }

    resetTimeSelect("Müsait saatler kontrol ediliyor...");
    message.textContent = "";

    try {
      const { data, error } = await supabaseClient.functions.invoke(
        "reservation-availability",
        {
          body: {
            date: date,
            guest_count: guestCount
          }
        }
      );

      if (currentRequest !== requestNumber) return;

      if (error) {
        throw error;
      }

      if (!data || !Array.isArray(data.slots)) {
        throw new Error("Müsait saat bilgisi alınamadı.");
      }

      timeSelect.innerHTML = "";

      if (data.slots.length === 0) {
        resetTimeSelect("Bu tarihte uygun saat bulunamadı.");
        return;
      }

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Saat seçin";
      timeSelect.appendChild(placeholder);

      data.slots.forEach((time) => {
        const option = document.createElement("option");
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
      });

      timeSelect.disabled = false;

    } catch (error) {
      console.error("Müsaitlik kontrolü hatası:", error);

      if (currentRequest !== requestNumber) return;

      resetTimeSelect("Saatler yüklenemedi.");
      message.textContent =
        "Müsait saatler alınırken bir hata oluştu. Lütfen tekrar deneyin.";
    }
  }

  dateInput.addEventListener("change", loadAvailableTimes);
  guestsSelect.addEventListener("change", loadAvailableTimes);

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    message.textContent =
      "Rezervasyon kaydı henüz etkinleştirilmedi.";
  });

  resetTimeSelect("Önce tarih ve kişi sayısı seçin");
});
