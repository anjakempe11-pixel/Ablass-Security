/* Ablaß Security — Website-Skripte
   ------------------------------------------------------------------
   KONFIGURATION DES KONTAKTFORMULARS

   Ohne Endpunkt öffnet das Formular eine vorausgefüllte E-Mail im
   Mailprogramm des Besuchers ("mailto"). Das funktioniert sofort und
   ohne Server, verlangt vom Besucher aber ein eingerichtetes
   Mailprogramm.

   Komfortabler ist ein Formular-Dienst (z. B. Formspree, Formsubmit).
   Dort ein Formular anlegen und die erhaltene Adresse unten eintragen:

       const FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";

   Wichtig: Ein solcher Dienst verarbeitet personenbezogene Daten. Dann
   einen Auftragsverarbeitungsvertrag abschließen und den Abschnitt
   "Kontaktformular" in der Datenschutzerklärung entsprechend ergänzen.
   ------------------------------------------------------------------ */
const FORM_ENDPOINT = "";
const EMPFAENGER_MAIL = "info@ablass-security.de";

(function () {
  "use strict";

  /* ---------- Jahreszahl im Footer ---------- */
  document.querySelectorAll("[data-jahr]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Mobiles Menü ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobilemenu");

  if (toggle && menu) {
    const setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      toggle.classList.toggle("is-open", open);
      menu.hidden = !open;
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Nach der Auswahl eines Links schließen
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Beim Wechsel zur Desktop-Breite aufräumen
    window.matchMedia("(min-width: 921px)").addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------- Kontaktformular ---------- */
  const form = document.getElementById("kontaktformular");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const button = form.querySelector(".submit-btn");

  const melde = function (text, art) {
    if (!status) return;
    status.textContent = text;
    status.className = "form-status" + (art ? " is-" + art : "");
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot: von Bots ausgefüllt -> stillschweigend verwerfen
    if (form.elements.website && form.elements.website.value !== "") return;

    if (!form.checkValidity()) {
      form.reportValidity();
      melde("Bitte füllen Sie die markierten Pflichtfelder aus.", "fehler");
      return;
    }

    const daten = new FormData(form);
    daten.delete("website");

    if (FORM_ENDPOINT) {
      button.disabled = true;
      melde("Anfrage wird gesendet …");

      fetch(FORM_ENDPOINT, {
        method: "POST",
        body: daten,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          melde("Vielen Dank — Ihre Anfrage ist eingegangen. Wir melden uns in der Regel innerhalb eines Werktags.", "erfolg");
        })
        .catch(function () {
          melde("Das Senden hat leider nicht geklappt. Schreiben Sie uns bitte direkt an " + EMPFAENGER_MAIL + " oder rufen Sie an.", "fehler");
        })
        .finally(function () {
          button.disabled = false;
        });
      return;
    }

    // Fallback ohne Formular-Dienst: vorausgefüllte E-Mail öffnen
    const zeilen = [
      "Name: " + (daten.get("name") || ""),
      "Unternehmen: " + (daten.get("firma") || "—"),
      "E-Mail: " + (daten.get("email") || ""),
      "Telefon: " + (daten.get("telefon") || "—"),
      "Gesuchte Leistung: " + (daten.get("leistung") || ""),
      "",
      "Nachricht:",
      daten.get("nachricht") || ""
    ].join("\n");

    const betreff = "Anfrage über die Website: " + (daten.get("leistung") || "Sicherheitsdienst");
    const mailto =
      "mailto:" + EMPFAENGER_MAIL +
      "?subject=" + encodeURIComponent(betreff) +
      "&body=" + encodeURIComponent(zeilen);

    // Ueber einen Link statt ueber window.location: funktioniert auch dort,
    // wo das Setzen der Adresse durch den Browser unterbunden wird.
    const link = document.createElement("a");
    link.href = mailto;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();

    melde("Ihr E-Mail-Programm wurde mit der fertigen Anfrage geöffnet. Bitte dort noch auf „Senden“ klicken.", "erfolg");
  });
})();
