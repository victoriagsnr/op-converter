/***********************
 * 1️⃣ OP-Liste laden
 ***********************/
let mapping = [];
let dataLoaded = false;

fetch("opliste.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("opliste.json konnte nicht geladen werden");
    }
    return response.json();
  })
  .then(data => {
    mapping = data.map(item => ({
      animeStarts: Number(item.animeStarts),
      animeEnds: Number(item.animeEnds),
      mangaStarts: item.mangaStarts ? Number(item.mangaStarts) : null,
      mangaEnds: item.mangaEnds ? Number(item.mangaEnds) : null,
      extraChapter: item.extraChapter|| "",
      arc: item.arc || ""
    }));
    dataLoaded = true;
    console.log("OP-Liste geladen:", mapping.length);
  })
  .catch(err => {
    console.error("Fehler beim Laden der opliste.json:", err);
  });

/*******************************
 * 2️⃣ Richtungsumschalter
 *******************************/
let direction = "animeToManga";

const fromLabel = document.getElementById("fromLabel");
const toLabel = document.getElementById("toLabel");
const resultEl = document.getElementById("result");

document.getElementById("swapBtn").addEventListener("click", () => {
  direction =
    direction === "animeToManga"
      ? "mangaToAnime"
      : "animeToManga";

  fromLabel.textContent =
    direction === "animeToManga" ? "Anime" : "Manga";
  toLabel.textContent =
    direction === "animeToManga" ? "Manga" : "Anime";

  resultEl.textContent = "";
});

/*******************************
 * 3️⃣ Haupt-Convert-Funktion
 *******************************/
function convert() {
  const value = Number(document.getElementById("inputValue").value);

  if (!dataLoaded) {
    resultEl.textContent = "Daten werden noch geladen… ⚓";
    return;
  }

  if (!value) {
    resultEl.textContent = "Bitte eine Zahl eingeben ☠️";
    return;
  }

  let result;

  if (direction === "animeToManga") {
    result = mapping.find(m =>
      m.animeStarts !== null &&
      value >= m.animeStarts &&
      value <= m.animeEnds
    );

    resultEl.textContent = result
      ? formatMangaResult(result)
      : "Keine Daten gefunden ☠️";

  } else {
    result = mapping.find(m =>
      m.mangaStart !== null &&
      value >= m.mangaStarts &&
      value <= m.mangaEnds
    );

    resultEl.textContent = result
      ? formatAnimeResult(result)
      : "Keine Daten gefunden ☠️";
  }
}

/********************************
 * 4️⃣ Ausgabe-Formatierung
 ********************************/
function formatMangaResult(m) {
  let text =
    m.mangaStart === m.mangaEnd
      ? `Manga Kapitel ${m.mangaStarts}`
      : `Manga Kapitel ${m.mangaStarts}–${m.mangaEnds}`;

  if (m.extraChapter) {
    text += ` (inkl. Rückblick: ${m.extraChapter})`;
  }

  if (m.arc) {
    text += ` · ${m.arc}`;
  }

  return text;
}

function formatAnimeResult(m) {
  let text =
    m.animeStarts === m.animeEnds
      ? `Anime Folge ${m.animeStarts}`
      : `Anime Folgen ${m.animeStarts}–${m.animeEnds}`;

  if (m.arc) {
    text += ` · ${m.arc}`;
  }

  return text;
}

/********************************
 * 5️⃣ Enter-Taste auslösen
 ********************************/
document.getElementById("inputValue").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    convert();
  }
});