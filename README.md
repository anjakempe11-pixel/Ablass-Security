# Ablaß Security – Website

Statische Website ohne Baukasten, ohne Framework, ohne Build-Schritt: reines
HTML, CSS und ein bisschen JavaScript. Läuft auf jedem Webspace mit
Standard-Hosting.

## Dateien

| Datei / Ordner        | Inhalt                                                        |
|-----------------------|---------------------------------------------------------------|
| `index.html`          | Startseite (Leistungen, Über uns, Qualität, FAQ, Kontakt)      |
| `impressum.html`      | Impressum nach § 5 DDG                                         |
| `datenschutz.html`    | Datenschutzerklärung                                           |
| `styles.css`          | Alle Styles                                                    |
| `script.js`           | Mobiles Menü und Kontaktformular                               |
| `assets/logo.svg`     | Firmenwappen als Vektorgrafik                                  |
| `assets/fonts.css`    | Einbindung der lokal gespeicherten Schriften                   |
| `assets/fonts/`       | Schriftdateien (EB Garamond, Playfair Display, OFL 1.1)        |
| `favicon.svg`         | Browser-Symbol                                                 |
| `robots.txt`, `sitemap.xml` | Angaben für Suchmaschinen                                |

## Lokal ansehen

```
npx serve .
```

Alternativ `python3 -m http.server`. Ein Doppelklick auf `index.html`
funktioniert auch, dann werden die Schriften aber teils nicht geladen —
für einen echten Eindruck lieber einen der beiden Befehle nutzen.

## Vor dem Online-Stellen — bitte abarbeiten

Alles Folgende ist im Code gelb markiert (`class="todo"`) und damit im
Browser sofort sichtbar.

**1. Impressum (`impressum.html`) vervollständigen**
- Vollständige Firmierung (z. B. „Ablaß Security e. K.“)
- Registergericht und Registernummer — oder den Abschnitt löschen
- Umsatzsteuer-Identifikationsnummer — oder den Abschnitt löschen
- Zuständige Aufsichtsbehörde für die Erlaubnis nach § 34a GewO
  (steht im Erlaubnisbescheid)

**2. Datenschutzerklärung (`datenschutz.html`) vervollständigen**
- Hosting-Anbieter mit Anschrift und Speicherdauer der Logfiles
- Stand (Monat/Jahr)

**3. Die beiden gelben Hinweiskästen entfernen**, sobald die Angaben stehen.

**4. Logo prüfen.** `assets/logo.svg` ist das Firmenwappen, als Vektor
nachgezeichnet — dadurch in jeder Größe scharf und nur wenige Kilobyte groß.
Wer stattdessen die Originaldatei einsetzen will, legt sie als
`assets/logo.png` ab und stellt die Verweise um:

```
grep -rl "logo.svg" *.html | xargs sed -i 's/logo\.svg/logo.png/g'
```

**5. Adresse prüfen.** Hinterlegt sind Beethovenstraße 46, 07973 Greiz und
0178 142 42 21 — bitte einmal gegenlesen, die Postleitzahl ist ergänzt.

**6. Domain eintragen.** An elf Stellen steht `www.ablass-security.de`
(in `index.html`, `impressum.html`, `datenschutz.html`, `robots.txt`,
`sitemap.xml`). Bei abweichender Domain überall ersetzen:

```
grep -rl "www.ablass-security.de" . | xargs sed -i 's/www.ablass-security.de/IHRE-DOMAIN.de/g'
```

Ohne Rechtsberatung: Impressum und Datenschutzerklärung sind sorgfältig
vorbereitete Vorlagen, die den heutigen Stand dieser Seite beschreiben.
Wer ganz sicher gehen will, lässt beides einmal anwaltlich prüfen.

## Kontaktformular

Standardmäßig öffnet das Formular das E-Mail-Programm des Besuchers mit
einer fertig ausgefüllten Nachricht an `info@ablass-security.de`. Das
funktioniert sofort und ohne Server — verlangt aber ein eingerichtetes
Mailprogramm.

Komfortabler ist ein Formular-Dienst (z. B. Formspree). Dort ein Formular
anlegen und die Adresse oben in `script.js` eintragen:

```js
const FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
```

Die Anfrage wird dann direkt von der Seite aus verschickt, ohne dass sich
ein Mailprogramm öffnet. Dabei verarbeitet der Dienst personenbezogene
Daten: Auftragsverarbeitungsvertrag abschließen und den Abschnitt
„Kontaktformular“ in der Datenschutzerklärung ergänzen (die Stelle ist
dort markiert).

Gegen Spam ist ein unsichtbares Feld eingebaut, das nur Bots ausfüllen;
solche Einsendungen werden verworfen.

## Online stellen

1. Domain und Hosting besorgen (z. B. IONOS, Strato)
2. **Alle** Dateien und Ordner per FTP oder Datei-Manager hochladen —
   der Ordner `assets/` gehört mit dazu
3. `index.html` muss im Hauptverzeichnis liegen
4. HTTPS aktivieren (bei allen gängigen Anbietern kostenlos enthalten)

## Technische Eckpunkte

- **Keine Cookies, kein Tracking** — daher auch kein Cookie-Banner nötig
- **Schriften liegen lokal.** Sie werden nicht von Google geladen, es wird
  also keine IP-Adresse der Besucher an Dritte übertragen
- Responsiv bis hinunter zu kleinen Telefondisplays, mit eigenem Menü
- Bedienbar per Tastatur, mit Sprunglink und beschrifteten Formularfeldern
- Strukturierte Daten (`SecurityService`) für die Google-Suche hinterlegt
