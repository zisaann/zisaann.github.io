
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("reservationDateInput");
  const timeSelect = document.getElementById("reservationTime");
  const guestsSelect = document.getElementById("reservationGuests");
  const reservationForm = document.getElementById("reservationForm");
  const message = document.getElementById("reservationFormMessage");

  const nameInput = document.getElementById("reservationName");
  const phoneInput = document.getElementById("reservationPhone");
  const noteInput = document.getElementById("reservationNote");
  const submitButton = reservationForm.querySelector(
    'button[type="submit"]'
  );

  if (
    !dateInput ||
    !timeSelect ||
    !guestsSelect ||
    !reservationForm ||
    !message ||
    !nameInput ||
    !phoneInput ||
    !noteInput
  ) {
    console.error("Rezervasyon formu elemanları bulunamadı.");
    return;
  }

  let requestNumber = 0;
  let isSubmitting = false;

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

      if (error) throw error;

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

  reservationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!reservationForm.reportValidity()) return;

    if (!timeSelect.value) {
      message.textContent = "Lütfen müsait bir saat seçin.";
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Rezervasyon oluşturuluyor...";
    message.textContent = "";

    try {
      const reservationData = {
        customer_name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        guest_count: Number(guestsSelect.value),
        reservation_date: dateInput.value,
        reservation_time: timeSelect.value,
        note: noteInput.value.trim() || null
      };

      const { data, error } = await supabaseClient.functions.invoke(
        "create-reservation",
        {
          body: reservationData
        }
      );

      if (error) {
        let errorMessage = error.message;

        if (error.context) {
          try {
            const response = await error.context.json();
            errorMessage = response.error || errorMessage;
          } catch (_) {}
        }

        throw new Error(errorMessage);
      }

      if (!data || data.success !== true || !data.reservation_code) {
        throw new Error(
          data?.error || "Rezervasyon sonucu alınamadı."
        );
      }

      reservationForm.reset();
      dateInput.min = getLocalDate();
      resetTimeSelect("Önce tarih ve kişi sayısı seçin");

      message.textContent =
        "Rezervasyonunuz oluşturuldu! Rezervasyon kodunuz: " +
        data.reservation_code;

      message.style.color = "#38734b";

    } catch (error) {
      console.error("Rezervasyon oluşturma hatası:", error);

      message.textContent =
        error.message || "Rezervasyon oluşturulurken bir hata oluştu.";

      message.style.color = "#a13d32";

      loadAvailableTimes();

    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.innerHTML =
        'Rezervasyon oluştur <span>↗</span>';
    }
  });

  resetTimeSelect("Önce tarih ve kişi sayısı seçin");
});
