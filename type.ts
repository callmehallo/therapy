export interface ArztTerminTyp {
  zeit: string
}

export interface ArztTszDesTyps {
  typ: string
  sprechzeiten: ArztTerminTyp[]
}

export interface ArztTsz {
  d: string // z.B. "22.12."
  t: string // z.B. "So."
  tszDesTyps?: ArztTszDesTyps[]
}

export interface ArztAg {
  key: string
  value: string
}

export interface ArztKvg {
  values: string[]
  heading: string
}

export interface ArztData {
  arzt: boolean
  id: string
  web: string
  kv: string
  name: string
  tel: string
  fax: string
  anrede: string
  geschlecht: string
  handy: string
  email: string
  distance: number
  strasse: string
  hausnummer: string
  plz: string
  ort: string
  geoeffnet: string
  keineSprechzeiten: boolean
  ag: ArztAg[]
  tsz: ArztTsz[]
  fs: any[] // Falls hier etwas Spezifischeres möglich ist, bitte anpassen
  zb: any[] // Falls hier etwas Spezifischeres möglich ist, bitte anpassen
  fg: string[]
  psy: string[]
  zm: any[] // Falls hier etwas Spezifischeres möglich ist, bitte anpassen
  kvg: ArztKvg[]
  lat: number
  lon: number
  nteStart: string
  nteEnde: string
}
