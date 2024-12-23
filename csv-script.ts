import { writeFileSync } from "fs"
import data from "./therapists.json"
import { ArztData } from "./type"

// Diese beiden Strings beschreiben reine Kinder-/Jugendtherapie:
const childPsyStrings = [
  "Verhaltenstherapie für Kinder und Jugendliche in Einzeltherapie",
  "Verhaltenstherapie für Kinder und Jugendliche in Gruppentherapie",
]

// Kopfzeile der CSV
let csv = "Status;Name;Adresse;Telefon;Web;Zeiten\n"

;(data as ArztData[]).forEach((therapist) => {
  // 1) Prüfen, ob der Therapeut ausschließlich Kinder-/Jugendtherapie in `psy` hat
  const onlyChild =
    therapist.psy.length > 0 &&
    therapist.psy.every((p) => childPsyStrings.includes(p))

  // Wenn keine Sprechzeiten verfügbar sind, diesen Therapeuten auslassen
  if (therapist.keineSprechzeiten) {
    return
  }

  // Wenn "onlyChild" true ist, diesen Therapeuten auslassen
  if (onlyChild) {
    return
  }

  // 2) Therapeuten verarbeiten, die NICHT nur Kinder-/Jugendtherapie anbieten
  const name = therapist.name
  const address = `${therapist.strasse} ${therapist.hausnummer}, ${therapist.plz} ${therapist.ort}`
  const tel = therapist.tel
  const web = therapist.web

  // Hier sammeln wir telefonische Erreichbarkeiten pro Wochentag (z.B. "Mo.")
  const phoneTimesPerDay: Record<string, string[]> = {}

  // Alle Tage durchgehen und "Telefonische Erreichbarkeit" filtern
  therapist.tsz.forEach((day) => {
    if (!day.tszDesTyps) return

    day.tszDesTyps.forEach((tszDesTyp) => {
      if (tszDesTyp.typ === "Telefonische Erreichbarkeit") {
        // Falls für den aktuellen Wochentag noch kein Array existiert, legen wir es an
        if (!phoneTimesPerDay[day.t]) {
          phoneTimesPerDay[day.t] = []
        }
        // Zeitangaben hineinschreiben (z.B. "12:00-12:50")
        tszDesTyp.sprechzeiten.forEach((time) => {
          phoneTimesPerDay[day.t].push(time.zeit)
        })
      }
    })
  })

  // Duplikate entfernen: jedes Array in ein Set umwandeln und wieder zurück
  Object.keys(phoneTimesPerDay).forEach((weekday) => {
    const times = phoneTimesPerDay[weekday]
    // ...new Set(...) entfernt Duplikate
    phoneTimesPerDay[weekday] = [...new Set(times)]
  })

  // Jetzt bauen wir einen String, in dem alle Wochentage mit Zeiten zusammenstehen
  // z.B. "Mo.: 12:00-12:50 | Di.: 12:00-12:50, 14:00-15:00"
  const weekdayAndTimes = Object.entries(phoneTimesPerDay)
    .map(([weekday, times]) => `${weekday}: ${times.join(", ")}`)
    .join(" | ")

  // Eine Zeile in unsere CSV-Datei
  // Status -> immer "nicht angerufen"
  csv += `nicht angerufen;${name};${address};${tel};${web};${weekdayAndTimes}\n`
})

// CSV speichern
writeFileSync("therapists.csv", csv, { encoding: "utf-8" })
console.log("CSV-Datei erstellt: therapists.csv")
