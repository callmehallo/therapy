// access the therapists.json file
// import therapists from "./therapists.json"
import { writeFileSync } from "fs"
import test from "./test.json"
import { ArztData } from "./type"

const result = (test as ArztData[]).map((therapist) => {
  const name = therapist.name
  const address = `${therapist.strasse} ${therapist.hausnummer}, ${therapist.plz} ${therapist.ort}`
  const web = therapist.web
  const tel = therapist.tel
  const days = therapist.tsz.map((day) => ({
    day: day.d,
    weekday: day.t,
    tszDesTyps: day.tszDesTyps,
  }))

  const telhours = days.flatMap((day) => {
    // Falls der Tag Einträge in tszDesTyps hat
    if (day.tszDesTyps) {
      // Filtern nach "Telefonische Erreichbarkeit"
      return day.tszDesTyps
        .filter((el) => el.typ === "Telefonische Erreichbarkeit")
        .map((el) => {
          // Mappen die Zeiten in ein TelHour-Objekt
          return {
            day: day.day,
            weekday: day.weekday,
            times: el.sprechzeiten.map((time) => time.zeit),
          }
        })
    }
    // Wenn kein tszDesTyps vorhanden ist, geben wir ein leeres Array zurück
    return []
  })

  return {
    name,
    address,
    web,
    tel,
    telhours,
  }
})

writeFileSync("therapists-transformed.json", JSON.stringify(result, null, 2), {
  encoding: "utf-8",
})
