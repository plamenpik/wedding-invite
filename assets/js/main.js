/**
 * Wedding Invitation Website — Interactive Logic
 * Couple: Maria & Alexander
 * Date: 06.06.2027
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const introOverlay = document.getElementById("introOverlay");
  const envelopeWrapper = document.getElementById("envelopeWrapper");
  const waxSealBtn = document.getElementById("waxSealBtn");
  const bgMusic = document.getElementById("bgMusic");
  const audioToggleBtn = document.getElementById("audioToggleBtn");
  const addToCalendarBtn = document.getElementById("addToCalendarBtn");

  let isAudioPlaying = false;
  let isEnvelopeOpened = false;

  // --------------------------------------------------------------------------
  // 1. Audio Control & 3D Envelope Opening
  // --------------------------------------------------------------------------
  const playAudio = () => {
    if (!bgMusic) return;
    bgMusic.volume = 0.1;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isAudioPlaying = true;
          audioToggleBtn.classList.add("playing");
        })
        .catch(() => {
          // Autoplay blocked without user gesture
          isAudioPlaying = false;
          audioToggleBtn.classList.remove("playing");
        });
    }
  };

  const pauseAudio = () => {
    if (!bgMusic) return;
    bgMusic.pause();
    isAudioPlaying = false;
    audioToggleBtn.classList.remove("playing");
  };

  const openEnvelope = () => {
    if (isEnvelopeOpened || !envelopeWrapper || !introOverlay) return;
    isEnvelopeOpened = true;

    // Step 1: Open flap and slide letter up
    envelopeWrapper.classList.add("open");
    playAudio();

    // Step 2: Fade out overlay smoothly after revealing the letter
    setTimeout(() => {
      introOverlay.classList.add("fade-out");
      setTimeout(() => {
        introOverlay.remove();
      }, 1000);
    }, 1300);
  };

  if (waxSealBtn) {
    waxSealBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener("click", openEnvelope);
    envelopeWrapper.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isAudioPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Countdown Timer
  // --------------------------------------------------------------------------
  const targetWeddingDate = new Date("2027-06-06T16:00:00+03:00").getTime();

  const elDays = document.getElementById("countDays");
  const elHours = document.getElementById("countHours");
  const elMinutes = document.getElementById("countMinutes");
  const elSeconds = document.getElementById("countSeconds");

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetWeddingDate - now;

    if (distance <= 0) {
      if (elDays) elDays.innerText = "00";
      if (elHours) elHours.innerText = "00";
      if (elMinutes) elMinutes.innerText = "00";
      if (elSeconds) elSeconds.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (elDays) elDays.innerText = String(days).padStart(2, "0");
    if (elHours) elHours.innerText = String(hours).padStart(2, "0");
    if (elMinutes) elMinutes.innerText = String(minutes).padStart(2, "0");
    if (elSeconds) elSeconds.innerText = String(seconds).padStart(2, "0");
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --------------------------------------------------------------------------
  // 3. FAQ Accordion
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    if (!questionBtn) return;

    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Close other open accordions
      faqItems.forEach((other) => {
        other.classList.remove("active");
        const btn = other.querySelector(".faq-question");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("active");
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Add to Calendar (iCal / Google Calendar)
  // --------------------------------------------------------------------------
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener("click", () => {
      const eventTitle = "Сватбата на Мария & Александър";
      const eventLocation = "Арт Комплекс Анел, Созопол, България";
      const eventDescription = "Празнуваме сватбения ден на Мария и Александър! Начало на събирането: 16:00 ч.";
      const startDate = "20270606T130000Z"; // 16:00 EEST (UTC+3)
      const endDate = "20270607T010000Z";   // 04:00 EEST

      // Direct Google Calendar Link
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        eventTitle
      )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
        eventDescription
      )}&location=${encodeURIComponent(eventLocation)}`;

      // Generate iCal format (.ics) for Apple/Outlook/Universal
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Wedding Invite//BG",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `SUMMARY:${eventTitle}`,
        `DESCRIPTION:${eventDescription}`,
        `LOCATION:${eventLocation}`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      // Create downloadable .ics file
      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "svatba-maria-i-aleksandar.ics");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Also give choice or note
      setTimeout(() => {
        const openGoogle = confirm("Събитието беше изтеглено за Apple / Outlook Calendar! Желаете ли да го отворите и в Google Calendar?");
        if (openGoogle) {
          window.open(googleCalendarUrl, "_blank");
        }
      }, 300);
    });
  }

  // --------------------------------------------------------------------------
  // 5. Scroll Reveal Animations (Intersection Observer)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach((el) => el.classList.add("active"));
  }
});
