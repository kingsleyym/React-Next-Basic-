# Matcha-Blog München — Plan

Redaktioneller, nicht gewinnorientierter Blog über Matcha in München.
Kein Verkauf, keine Werbung, keine Affiliate-Links, kein Gewerbe.

Grundlage ist dieses Repo (`React-Next-Basic-`). Dieses Dokument ist ein
Entwurf zur Entscheidung — es enthält keine Artikel und richtet keine
Texterzeugung ein.

---

## 0. Zwei Dinge, die vor allem anderen entschieden werden müssen

### 0.1 Der Name kollidiert mit einem Münchner Unternehmen

**„Daily Matcha" ist in München bereits ein Betrieb mit fünf Filialen** —
dailymatcha.de, Standorte laut eigener Seite u. a. Fraunhoferstr. 32,
Maximilianstr. 38, Leopoldstr. 20, Augustenstr. 5, Elsässerstr. 28. Der
Laden verkauft genau das, worüber der Blog schreiben soll, in genau der
Stadt, um die es geht.

Betreiberin ist laut Impressum die **VCTRY GmbH**, Leopoldstraße 20,
80802 München, AG München **HRB 295996**. Sie hält seit dem **31.07.2026
zwei eingetragene Unionsmarken** auf „Daily Matcha".

Damit hat der Domainname drei getrennte Probleme:

- **Die Domain ist ohnehin vergeben.** `daily-matcha.de` ist bereits
  registriert (STRATO-Parkseite „Domain reserved"), `daily-matcha.com`
  steht bei Afternic zum Verkauf. Gut möglich, dass VCTRY die Variante
  selbst defensiv reserviert hat. **Die Frage könnte sich damit faktisch
  schon erledigt haben.**
- **SEO:** Der Blog konkurriert dauerhaft um die Markensuche eines lokalen
  Anbieters. Für „daily matcha münchen" liefern die Ergebnisse heute
  Store-Seiten und Lieferdienst-Listings. Dort ist kein Platz, und der
  Blog würde von Google eher als Brand-Konkurrenz einsortiert.
- **Namensrecht:** Nicht das Markenrecht ist der wunde Punkt, sondern
  **§ 12 BGB** — und der greift gerade *unabhängig* davon, ob der
  Blog kommerziell ist. Ausführlich in Abschnitt 5.6.

**Empfehlung: Namen wechseln, bevor Inhalte entstehen.** Ein Name ist
später kaum noch zu ändern, ohne die gesamte aufgebaute Sichtbarkeit zu
verlieren. Alles Übrige in diesem Plan gilt unabhängig vom Namen.

### 0.2 Die Wohnanschrift wird öffentlich

§ 18 Abs. 1 MStV verlangt Name und ladungsfähige Anschrift von jedem
Telemedienangebot, das nicht ausschließlich persönlichen oder familiären
Zwecken dient. Die Norm kennt kein „geschäftsmäßig" und keine
Gewinnerzielungsabsicht. Der Leitfaden der Landesanstalt für Kommunikation
Baden-Württemberg (Stand 2024, S. 2) nennt als Kriterium ausdrücklich,
dass ein Angebot „eine breite Öffentlichkeit erreichen" soll — das ist die
Definition des erklärten Ziels.

**Reichweite über Google und Anonymität schließen einander aus.** Ein
Postfach genügt nicht. Das ist keine Konfigurationsfrage, die sich später
lösen lässt, sondern eine Vorbedingung. Details in Abschnitt 5.1.

---

## 1. Stand des Gerüsts

### 1.1 Welcher Zweig ist der bessere

Die Frage stellt sich anders als vermutet: Die beiden Zweige sind **keine
Alternativen**.

```
git rev-list --left-right --count origin/gemmatest...origin/claude/react-architecture-docs-cc6pf9
1       0
```

`gemmatest` enthält `claude/react-architecture-docs-cc6pf9` vollständig und
genau **einen** Commit mehr: `3475abe "test"` vom 23.06.2026, 13 Dateien,
+244/−42 Zeilen. Beide Zweige stammen von `d8b7661 Initial commit` ab, das
auch `main` ist — der Merge nach `main` ist also konfliktfrei.

Die Dateizahlen (155 gegen 147) unterscheiden sich allein wegen dieses
Commits. Es gibt keinen inhaltlichen Zweig-Vergleich zu führen, sondern nur
eine Frage: taugt `3475abe` als Fundament?

**Antwort: teilweise.** Es ist explorative Arbeit, und sie hat vier
Probleme hinterlassen:

| Fund | Beleg |
|---|---|
| `lib/auth-store.ts` ist eine zweite, schwächere Kopie von `shared/stores/auth.store.ts` — das Feld `status` fehlt | beide Dateien, identischer Zweck |
| `login-screen.tsx` wird von nichts importiert, dupliziert `login-form.tsx`, nutzt `err: any` | `grep -rn "login-screen\|LoginScreen"` findet nur die Definition |
| `/` wurde zur `'use client'`-Seite hinter `useRequireAuth` — die einzige öffentlich indexierbare Route fiel weg | `apps/web/src/app/page.tsx` |
| Zugangsdaten `luca@test.com` / `passwort` im Commit, dazu ein wörtliches `// ... rest of code ...` und 17 Leerzeilen | `apps/web/src/lib/backend.ts`, `packages/core/src/db/memory.db.ts` |

Für einen Blog wiegt der dritte Punkt am schwersten: eine Startseite hinter
einem Auth-Gate ist für Suchmaschinen unsichtbar.

**Der ernsteste Fund steckt aber woanders.** Derselbe Commit hat
`count()` in das `DbService`-Interface aufgenommen und nur in `memory.db`
implementiert. `createFirebaseDb` und `createSupabaseDb` deklarieren beide
`: DbService`, implementieren `count()` aber nicht. Ein Providerwechsel —
der einzige Zweck des Pakets — wäre gebrochen.

Warum das niemand gesehen hat:

```json
// packages/core/tsconfig.json
"exclude": ["node_modules", "dist", "src/**/adapters/**"]
```

Der Typecheck war grün, weil er genau die beiden kaputten Dateien nicht
ansieht. Ein grüner Prüflauf ist hier kein Nachweis, sondern eine Lücke.

**Entscheidung: `main` bekommt die Historie von `gemmatest`** (nichts geht
verloren, kein Zweig wird gelöscht, kein Force-Push), **plus zwei
Reparatur-Commits.**

### 1.2 Was repariert wurde

`fix(core): honour the DbService contract in every adapter`

- Firebase: `count()` über `getCountFromServer` mit denselben Query-Constraints
- Supabase: `select('*', { count: 'exact', head: true })` — zählt ohne Zeilentransfer
- `BaseRepository.count()`, damit Features über die Repository-Schicht
  zählen statt direkt am `DbService`
- `memory.db.ts`: 17 Leerzeilen entfernt
- `@repo/ui`: peer-Range stand auf `zod ^3.24`, während das Repo seit dem
  Wave-1-Upgrade auf `zod ^4.4` läuft. Blieb still, weil `.npmrc`
  `strict-peer-dependencies=false` setzt.

`refactor(web): undo the WIP regressions, keep a public home page`

- `lib/auth-store.ts` und `login-screen.tsx` entfernt
- `dashboard-screen.tsx` entfernt (dupliziert `/dashboard`, verwendet
  `bg-blue-50`/`bg-green-50`/`bg-purple-50` statt der Design-Tokens)
- `/` wieder als statische Server-Seite
- Seed-Zugangsdaten und Kommentarreste aus `backend.ts`
- **Behalten:** das `user-counter`-Feature. Es folgt dem Aufbau
  `api/ components/ hooks/ context.md`, wird jetzt auf `/dashboard`
  gerendert statt ungenutzt herumzuliegen, und zählt über das Repository
  statt alle Nutzer zu laden und `.length` zu lesen.

### 1.3 Prüflauf

Das Projekt ist ein **pnpm-Monorepo mit Turborepo**, kein npm-Projekt.
`npm ci` scheitert am `workspace:*`-Protokoll; `.github/workflows/ci.yml`
nutzt korrekt `pnpm install --frozen-lockfile`.

Umgebung: Node v22.22.0, pnpm 10.15.1.

| Schritt | vor der Reparatur | nach der Reparatur |
|---|---|---|
| `pnpm install --frozen-lockfile` | Exit 0, 219 Pakete, 4,8 s | Exit 0 |
| `pnpm typecheck` | Exit 0, 3/3 Tasks, 6,537 s | Exit 0, 3/3 Tasks, 5,847 s |
| `pnpm lint` | Exit 0 | Exit 0 |
| `pnpm test` | Exit 0, 2 Dateien, 4 Tests, 592 ms | Exit 0, 2 Dateien, 4 Tests, 621 ms |
| `pnpm build` | Exit 0, 1/1 Task, 13,974 s, 6 Routen | Exit 0, 1/1 Task, 14,218 s, 6 Routen |

`pnpm-lock.yaml` bleibt unverändert — die CI-Prüfung mit
`--frozen-lockfile` geht durch.

Zwei Einschränkungen, die zum Ergebnis gehören:

- **4 Tests sind sehr wenig** für 155 Dateien. Sie decken `cn()` und
  `UserRepository` ab, sonst nichts. „Tests grün" heißt hier fast nichts.
- **Meine `count()`-Implementierungen sind ungeprüft.** Die Adapter sind
  vom Typecheck ausgenommen und die Provider-SDKs sind bewusst nicht
  installiert (siehe Kommentar in `packages/core/package.json`). Der Code
  ist nach Aktenlage geschrieben, nicht vom Compiler bestätigt. Siehe
  Entscheidung E4.

---

## 2. Blogstruktur

### 2.1 Wo die Texte liegen — und warum

Gewählt: **Markdown mit YAML-Frontmatter im Repo**, zur Bauzeit statisch
gerendert.

Das ist keine Modeentscheidung, sondern folgt aus vier Anforderungen, die
alle in dieselbe Richtung zeigen:

**Der Prüfschritt ist gratis.** Ein Agent erzeugt keinen Artikel, sondern
einen Pull Request. Erst ein Merge veröffentlicht. Das ist genau die
„menschliche Überprüfung oder redaktionelle Kontrolle", die Art. 50 Abs. 4
AI Act als Ausnahme von der Offenlegungspflicht vorsieht — und sie ist
über die Git-Historie belegbar: wer wann was freigegeben hat. Schreibt ein
Agent dagegen in eine Datenbank, geht der Text ungeprüft live. **Das ist
das stärkste Argument und es ist ein rechtliches, kein technisches.**

**Preisangaben brauchen eine Änderungshistorie.** Der Blog lebt davon,
Preise und Öffnungszeiten zu nennen. Ein `git diff` zeigt auf den Tag
genau, wann ein Preis erhoben und wann er korrigiert wurde. Das trägt das
„zuletzt geprüft am" (Abschnitt 3) und die Empfehlung aus dem
Bewertungsrecht, jede überprüfbare Angabe zu datieren (Abschnitt 5.5).

**Kein weiterer Auftragsverarbeiter.** Ein CMS oder Firestore ist eine
zusätzliche DSGVO-Beziehung mit AV-Vertrag. Dateien im Git sind keine.

**Statische Ausgabe.** Vollständiges Prerendering, kein Server, keine
Datenbankabfrage im Request. Das kostet im Betrieb praktisch nichts und
liefert die Core Web Vitals, die für den SEO-Wettbewerb gebraucht werden.
Nebeneffekt: Die Seite läuft auf **jedem** Statik-Host, was die
Hoster-Entscheidung (Abschnitt 5.3) offen und billig hält.

Nicht gewählt und warum:

- **Firestore** (im Bestand `Daily-Matcha` vorhanden): kein Prüfschritt,
  Laufzeitabhängigkeit, dynamisches Rendering. Der dortige Bestand ist
  außerdem ein Laden-Gerüst, kein Blog.
- **Headless CMS** (Sanity, Contentful): dritter Datenverarbeiter,
  laufende Kosten, und die Artikel liegen außerhalb der Versionierung.
- **MDX statt Markdown:** MDX erlaubt beliebiges JSX im Text. Bei
  maschinell erzeugten Inhalten ist das eine Angriffsfläche, die man nicht
  braucht. Strukturierte Elemente kommen stattdessen aus dem Frontmatter
  und werden von festen Komponenten gerendert — das ist zugleich
  einheitlicher und maschinell prüfbar.

Der Nachteil, ehrlich benannt: **Vom Handy aus schreiben ist unbequem.**
Behelf ist der GitHub-Web-Editor; später wäre ein kleiner Editor denkbar,
der über die GitHub-API committet. Siehe Entscheidung E5.

### 2.2 Datenmodell

Zwei Entitäten. Validierung mit Zod zur Bauzeit — ein fehlerhafter
Artikel bricht den Build, statt still online zu gehen. Das entspricht dem
Vertragsgedanken, der schon in `packages/core/src/repositories` steckt.

**`Lokal`** — die dauerhafte Entität, eine Seite je Ort:

```ts
const Lokal = z.object({
  slug: z.string(),
  name: z.string(),
  stadtteil: z.enum(['maxvorstadt', 'schwabing', 'glockenbach',
                     'altstadt', 'haidhausen', 'neuhausen', 'sonstige']),
  adresse: z.object({
    strasse: z.string(), plz: z.string(), ort: z.literal('München'),
    lat: z.number(), lon: z.number(),
  }),
  website: z.string().url().nullable(),

  // Trägt die Glaubwürdigkeit — siehe Abschnitt 3
  erstbesuch: z.iso.date(),          // ohne diesen Wert kein Erfahrungsbericht
  zuletztGeprueft: z.iso.date(),

  preise: z.array(z.object({
    was: z.enum(['matcha_pur', 'matcha_latte', 'iced_matcha', 'matcha_to_go']),
    eur: z.number(),
    groesse_ml: z.number().nullable(),
    erhoben: z.iso.date(),
    quelle: z.enum(['vor_ort', 'aushang_foto', 'website']),
  })).min(1),

  milch: z.array(z.enum(['kuh', 'hafer', 'soja', 'kokos', 'mandel'])),
  merkmale: z.array(z.enum(['to_go', 'sitzplaetze', 'wlan',
                            'vegan_komplett', 'zeremonie'])),

  fotos: z.array(z.object({
    datei: z.string(),
    aufgenommen: z.iso.date(),
    ort: z.enum(['aussen_strasse', 'innen']),
    // Innenaufnahmen brauchen die Erlaubnis des Betreibers (Abschnitt 5.4)
    erlaubnis: z.string().nullable(),
  })),
});
```

Die Felder sind kein Selbstzweck: `erstbesuch`, `preise[].quelle` und
`fotos[].erlaubnis` sind die maschinenlesbare Form der Rechtsauflagen aus
Abschnitt 5. Was als Regel nur in einer Datei stünde, wird so vom Build
durchgesetzt.

**`Artikel`** — der redaktionelle Text:

```ts
const Artikel = z.object({
  slug: z.string(),
  titel: z.string().max(60),          // Title-Tag-Länge
  beschreibung: z.string().max(155),  // Meta-Description
  rubrik: z.enum(['wissen', 'journal', 'vergleich']),
  veroeffentlicht: z.iso.date(),
  aktualisiert: z.iso.date(),
  autor: z.string(),
  erwaehnteLokale: z.array(z.string()),   // slugs, für Querverlinkung
  quellen: z.array(z.object({ titel: z.string(), url: z.string().url() })),
});
```

`erwaehnteLokale` erzeugt die interne Verlinkung automatisch — für SEO
wichtiger als jeder Einzelartikel, und von Hand gepflegt zuverlässig
falsch.

### 2.3 Routen

```
/                        Startseite
/cafes                   alle Orte, filterbar (Stadtteil, Preis, Milch)
/cafes/[slug]            ein Ort
/stadtteil/[slug]        Maxvorstadt, Schwabing, Glockenbach …
/preise                  Preisübersicht München  ← das Alleinstellungsmerkmal
/wissen                  Herkunft, Zubereitung, Qualität
/wissen/[slug]
/journal                 datierte Beiträge (Neueröffnungen, Saison)
/journal/[slug]
/vergleich/[slug]        thematische Gegenüberstellungen
/ueber                   wer schreibt, Methodik, Unabhängigkeitserklärung
/impressum
/datenschutz
/sitemap.xml
/feed.xml
/robots.txt
```

Bewusst **kein `/blog/…`**: Das Segment trägt keine Bedeutung. `/cafes/`
und `/preise` sagen Suchmaschine und Leser, worum es geht.

Alles über `generateStaticParams` vorgerendert. Die Filter auf `/cafes`
laufen clientseitig über den bereits geladenen Index — keine Query-Parameter,
die indexierbare Duplikate erzeugen.

### 2.4 Kategorien

Vier Rubriken, mehr nicht: **cafes, preise, wissen, journal**
(`vergleich` hängt unter wissen). Ein wucherndes Tag-System erzeugt dünne
Seiten, die untereinander konkurrieren. Der Stadtteil ist die einzige
zweite Achse, und er ist endlich.

### 2.5 Sitemap, RSS, strukturierte Daten

**Sitemap:** `app/sitemap.ts` mit `MetadataRoute.Sitemap` — in Next
eingebaut, keine Bibliothek. `lastModified` kommt aus `aktualisiert` bzw.
`zuletztGeprueft`, nicht aus der Dateizeit; sonst meldet jeder Build alle
Seiten als geändert.

**RSS:** `app/feed.xml/route.ts` mit `export const dynamic = 'force-static'`,
gespeist aus demselben Index.

**JSON-LD:**

- `BlogPosting` bzw. `Article` auf allen Textseiten — mit `author`,
  `datePublished`, `dateModified`
- `BreadcrumbList` überall
- `ItemList` auf `/cafes`, `/preise`, `/stadtteil/[slug]`
- `Person` für den Autor, verknüpft über `author`
- Auf Ortsseiten: `Review` mit `itemReviewed: { @type: CafeOrCoffeeShop, … }`
  statt die fremden Betriebe direkt als `LocalBusiness` auszuzeichnen —
  die Seite ist eine Besprechung, nicht die Selbstdarstellung des Lokals.

**Nicht in diesem Durchgang geprüft:** ob Google für `Review` auf lokale
Betriebe und für `FAQPage` derzeit überhaupt noch Rich Results ausspielt.
Beides wurde in den letzten Jahren eingeschränkt. Die Auszeichnung hilft
dem Entitätsverständnis auch ohne Rich Result — aber ich würde darauf
keine Inhaltsentscheidung stützen, bevor das jemand nachgesehen hat.

### 2.6 Wie das später autonom läuft (Entwurf, nicht gebaut)

```
Themenliste  →  Agent erzeugt Entwurf  →  Pull Request
                                            │
                            ┌───────────────┴───────────────┐
                            │  CI prüft mechanisch:         │
                            │  · Zod-Schema erfüllt         │
                            │  · jeder Preis hat quelle     │
                            │    und Datum                  │
                            │  · zuletztGeprueft < 6 Monate │
                            │  · Erfahrungsbericht nur mit  │
                            │    gesetztem erstbesuch       │
                            │  · Innenfoto nur mit          │
                            │    erlaubnis != null          │
                            └───────────────┬───────────────┘
                                            │
                              Luca liest und merged  →  Deploy
```

Der Punkt ist die vierte Prüfung. „Nur bewerten, wo man war" ist eine
Rechtsauflage (Abschnitt 5.5), die als Merksatz in einer Datei niemand
einhält und die als Build-Regel niemand umgehen kann. Dasselbe gilt für
die Fotoerlaubnis.

Was der Agent **nicht** darf: veröffentlichen. Der Merge bleibt beim
Menschen — sonst fällt die Ausnahme aus Art. 50 Abs. 4 AI Act weg und die
Faktenprüfung gleich mit.

### 2.7 Wo das Ganze wohnt

**Empfehlung: ein eigenes Repo**, aus diesem Grundgerüst erzeugt. Der
Matcha-Blog gehört nicht in `React-Next-Basic-` — das ist Lucas
themenneutrale Grundlage für beliebige Projekte, und Café-Routen darin
wären Ballast für jedes künftige Projekt.

Die **generischen** Teile — Content-Loader, Sitemap, RSS, JSON-LD-Helfer —
gehören umgekehrt sehr wohl hierher, etwa als `packages/content`. Das ist
Ausstattung, die jedes Inhaltsprojekt braucht. Siehe Entscheidung E3.

---

## 3. SEO-Fundament „Matcha München"

### 3.1 Was ich zu Suchvolumina sagen kann: nichts

**Für keinen einzigen Begriff liegt eine belastbare Volumenzahl vor.**
Gezielt gesucht, nichts Überprüfbares für Deutschland gefunden. Wer Zahlen
braucht, muss Keyword Planner, Search Console oder Ahrefs/Semrush selbst
abfragen. Hier wird nichts geschätzt.

Auch nicht gesehen, weil das Werkzeug es nicht liefert: Google-Autosuggest
und „Ähnliche Fragen". Was folgt, ist die **Struktur** der Nachfrage aus
den Ergebnisseiten, nicht ihre Größe. Ob ein Local Pack erscheint — bei
einer Ortssuche wahrscheinlich — müsste von Hand in Google geprüft werden.

### 3.2 Struktur der Nachfrage

- **Ortssuche überwiegt deutlich.** „matcha münchen", „matcha café
  münchen", „bester matcha münchen", „matcha latte münchen" liefern fast
  ausschließlich Listen vom Typ „11 Orte…", „Die 10 besten Spots…". Die
  Absicht ist *wo trinke ich hier Matcha*, nicht *was ist Matcha*.
- **„kaufen" ist ein anderer Intent** und kommerziell dicht besetzt
  (teeblatt.de, dailymatcha.de, matcharina.com). Dort ist nichts zu holen.
- **„japanischer tee münchen" ist ein getrenntes Feld** (Tea House,
  Teeschale, Tushita, Teehaus im Englischen Garten). Matcha-Cafés kommen
  dort praktisch nicht vor — zwei Welten, die niemand verbindet.
- **Zeremonie ist eine eigene Nische** mit eigenem Ökosystem
  (urasenke-muenchen.de, japan-in-muenchen.de). Belegt: öffentliche
  Teezeremonien im Teehaus Kanshoan an je einem Wochenende pro Monat von
  April bis Oktober, Beitrag 6 € (Quelle: japan-in-muenchen.de).
- **Vokabular aus den Texten der Ranker** (belegt als Wortgebrauch, nicht
  als Volumen): „Matcha to go", „100 % vegan", „Hafer-, Kokos- oder
  Sojamilch", „Iced Matcha Dirty", „Matcha ohne Zucker", „Matcha
  Cheesecake", „Matcha Softeis".

### 3.3 Wer heute vorn steht

Dieselben rund sieben Seiten rotieren über alle Kernqueries:

| Typ | Beispiele |
|---|---|
| Stadtmagazin-Listicles | muenchen.mitvergnuegen.com, mrmuenchen.com, 1000thingsmagazine.com, abendzeitung-muenchen.de |
| Einzelblogs | muenchen-sehen.de, jaegerundsammlerblog.de, **matcha-spot.com** |
| Shops | teeblatt.de, dailymatcha.de, matcharina.com, orii-matcha.com, teahouse.de |
| Bewertungsportale | yelp.com, tripadvisor.de, wanderlog.com |
| Lieferdienste | wolt.com, ubereats.com |
| Social | tiktok.com und Instagram ranken **in der Websuche mit** |

Zwei Beobachtungen dazu:

**Fast alle Ranker sind kommerziell gefärbt.** mrmuenchen.com verkauft
Rabattkarten („20 % für Card-Members"). muenchen-sehen.de hat
Amazon-Affiliate und bewirbt eigene Local-SEO-Dienstleistungen.
matcha-spot.com ist Amazon-Affiliate. **Keiner von ihnen kann glaubhaft
sagen, dass er nichts verdient.**

**matcha-spot.com ist der nächste Verwandte** des Vorhabens: ein
Städteverzeichnis (München, Wien, Zürich, Berlin, Hamburg) mit Adresse,
Öffnungszeiten und Sternebewertung je Café — **aber ohne Preise.**

### 3.4 Die Lücke

**a) Preistransparenz — die größte und am besten belegbare.** Kein Ranker
führt systematisch Preise. Und die wenigen vorhandenen Zahlen
widersprechen sich hart:

- t-online: Matcha-Getränke in München meist 6–8 €, bei Daily Matcha kalt
  6–11 €, ein Lotus-Matcha bei 12 €; Matcha Lap 4,20–6,30 €; Kencho 6–7 €.
- tripz.de-Preisindex: München **4,28 €** (Bundesschnitt 4,12 €; Methodik
  245 Cafés in 79 Städten).

Ein Index, der München bei 4,28 € verortet, während die lokale Presse
6–12 € dokumentiert, ist entweder anders geschnitten oder falsch. **Dieser
Widerspruch ist ein fertiges Artikelthema**, und eine eigene Erhebung über
alle Münchner Läden wäre originäre Daten, die es im Netz nicht gibt. Das
ist der stärkste denkbare Startartikel — er schließt die größte Lücke,
schafft eigene Daten und beantwortet eine dokumentierte offene Frage.

**b) Echte Einzeltests statt Sammellisten.** Pro Laden ein datierter
Bericht mit Foto, Preis, Milchoptionen, Sitzplätzen. Unbesetzt und
skaliert auf 25+ Seiten.

**c) Aktualität.** Die Szene ändert sich schnell; Listicles veralten
still. Ein sichtbares „zuletzt geprüft am" je Laden ist ein echter
Nutzenvorsprung. Wie schlampig die Konkurrenz ist, zeigt ein Detail: Der
Laden nahe Marienplatz heißt bei t-online **„Matcha Lap"**, bei
matcha-spot.com **„Matcha Lab"**. Eine der beiden Quellen irrt, und
niemand hat es geprüft.

**d) Wissen ohne Verkaufsabsicht.** Die deutschsprachige
Matcha-Wissensecke gehört komplett Shop-Blogs (matchoya.de, verymatcha.de,
tea-club.de, friendsoftea.de). Jeder Text zu Uji, Beschattung oder
Chasen endet im Produktkatalog. **Hier ist die fehlende Verkaufsabsicht
kein Handicap, sondern der einzige echte Wettbewerbsvorteil.**

**e) Saison und Knappheit — zeitlich gerade passend.** Belegte Zahlen:
Tencha-Auktionspreise 2026 bei rund 10.843 Yen/kg (etwa das Doppelte des
2025-Niveaus), Kyoto-Tencha zwischen ~8.235 und ~13.972 Yen/kg, Kagoshima
bis ~19.000 Yen/kg; Japan verlor zwischen 2000 und 2020 rund 53.000
Teebauern. Ein Artikel „Warum dein Matcha in München teurer wird — von Uji
bis Schwabing" verbindet Weltmarkt und Lokalpreis und liefert die Ursache
zu Lücke (a). Das macht kein Stadtmagazin.

**f) Verbindungen, die niemand zieht.** Zeremonie-Welt ↔ Café-Welt.
Stadtteil-Routen. „Matcha to go"-Übersicht. Hafermilch-Übersicht.

### 3.5 Inventar (aus der Recherche, nicht selbst verifiziert)

**Gesamtzahl aller Matcha-Läden Münchens: keine belastbare Zahl geprüft** —
es existiert keine Quelle, die das zählt. Was vorliegt, sind rund 30
unterscheidbare Namen. Adressen und Öffnungszeiten sind **vor
Veröffentlichung zu prüfen.**

*Spezialisten:* Daily Matcha (5 Filialen) · Matcha Rina (Brienner Str. 1 /
Herzogstraße / Elisabethmarkt) · Kencho Matcha (Schellingstr. 15) · toto
matcha (Schellingstr. 48) · Neosociety (Herzogstr. 77) · Orii Matcha ·
Matcha Lap/Lab (Schreibweise unklar) · Letcha (Herzogstr. 1A / Türkenstraße)

*Teehäuser:* Tushita (Klenzestr. 53) · Tea House (Sendlinger Str. 62) ·
Teeblatt · Teeschale

*Cafés mit Matcha:* Orno Café · UP Coffee · Tanpopo Konditorei · Café FÉLA ·
Morning Bliss · Suuapinga · lecker.munich · Max & Moritz Tagesbar ·
Ralph's Coffee · Banco de Café · Coffee Box · OHANA · Wagners Juicery ·
Paw-Over · Man Versus Machine

*Zeremonie:* Teehaus Kanshoan im Englischen Garten (Urasenke Kyokai München)

Schwerpunkt: **Maxvorstadt und Schwabing**, zweiter Cluster
Glockenbach/Isarvorstadt. Das trägt die Stadtteil-Achse aus 2.4.

### 3.6 KI-Inhalte und E-E-A-T

Google verbietet KI nicht; der Maßstab ist das Ergebnis. Wörtlich aus der
Dokumentation: *„Using generative AI tools … to generate many pages
without adding value for users may violate Google's spam policy on scaled
content abuse."* Und zur Offenlegung: *„If you're automatically generating
content, consider adding information on how your content was created."*

Das relevante Verbot heißt **Scaled Content Abuse** — viele Seiten
vorrangig zur Ranking-Manipulation, gleich ob Mensch oder Maschine sie
schrieb. Konkret: 30 KI-Seiten aus zusammengesuchten Web-Schnipseln sind
genau dieses Muster. 30 Seiten mit **eigener Preiserhebung, eigenen Fotos,
eigenem Besuchsdatum** sind es nicht — auch wenn KI beim Formulieren hilft.

Zu E-E-A-T, nüchtern: **Anonymität ist der einzige strukturelle Nachteil
des Vorhabens.** Trust ist laut Google das wichtigste Signal, und Trust
entsteht bei einem Café-Thema fast nur über nachweisbare *Experience*.
Genau dieses erste E erfüllt eine Privatperson aber leichter als jede
Redaktion: Wer hier wohnt und in 25 Läden war, hat mehr Ersterfahrung als
jedes Stadtmagazin-Team. Der Hebel sind Belege, nicht Titel — eigene,
unverwechselbare Fotos (keine Stockbilder, keine KI-Bilder),
Besuchsdaten, notierte Preise, offen benannte Irrtümer.

Praktisch: Vorname, Gesicht und „ich wohne seit X Jahren in München"
schlagen volle Anonymität deutlich. Dazu ein sichtbarer Hinweis: *„Diese
Seite verkauft nichts, hat keine Affiliate-Links und wird nicht bezahlt."*
Das ist ein Trust-Argument, das **keiner** der aktuellen Top-Ranker führen
kann. Und die Adresse steht nach Abschnitt 0.2 ohnehin im Impressum — der
Privatsphäre-Preis ist also längst bezahlt, der Nutzen aber noch nicht
eingelöst.

---

## 4. Design

Entwurf zur Entscheidung, nicht gebaut.

### 4.1 Die Leitidee: Prüfbericht, nicht Lifestyle

Jede Matcha-Seite im Netz sieht gleich aus: sattes Grün, große
Stimmungsfotos, weiche Rundungen, Café-Ästhetik. Das ist die visuelle
Sprache der Anbieter — und der Blog ist keiner.

Der Inhalt ist ein **datierter Prüfbericht mit Preisen und Quellen**. Das
Erscheinungsbild sollte das sagen: näher an einem Feldnotizbuch oder einer
Testzeitschrift als an einem Café-Instagram. Das ist zugleich das
Unterscheidungsmerkmal aus Abschnitt 3.4 (d) in sichtbarer Form.

Konkret heißt das auch: **keine Hero-Slider, keine Pop-ups, kein
Newsletter-Overlay, keine „Angebot"-Störer.** Deren Abwesenheit ist die
Botschaft.

### 4.2 Das Signaturelement: der Prüfblock

Jede Ortsseite trägt oben einen festen, scanbaren Block — immer gleich
aufgebaut, direkt aus dem Frontmatter gerendert:

```
┌──────────────────────────────────────────────┐
│  Matcha Latte        5,80 €   (350 ml)       │
│  Matcha pur          4,50 €                  │
│  Milch          Hafer · Soja · Kuh           │
│  Sitzplätze     12 innen, keine draußen      │
│  ──────────────────────────────────────────  │
│  Erhoben vor Ort am 14.03.2026               │
│  Zuletzt geprüft   14.03.2026                │
└──────────────────────────────────────────────┘
```

Er leistet drei Dinge gleichzeitig: Er ist das, was Leser suchen und
sonst nirgends finden. Er ist maschinell befüllbar und damit für den
autonomen Betrieb geeignet. Und er macht das Datum zum sichtbaren
Qualitätsversprechen — der Punkt, an dem die Konkurrenz still veraltet.

### 4.3 Farbe

Das Token-System liegt vollständig in `packages/ui/src/tokens.css` und ist
an genau dieser einen Stelle umskinbar. Vorschlag als HSL-Tripel:

| Token | Hell | Dunkel |
|---|---|---|
| `--background` | `40 25% 97%` (warmes Papier, kein Weiß) | `155 14% 9%` |
| `--foreground` | `155 14% 13%` (Tinte mit Grünstich) | `42 16% 93%` |
| `--muted-foreground` | `150 8% 40%` | `150 8% 66%` |
| `--primary` | `88 34% 32%` (tiefes, entsättigtes Blattgrün) | `88 40% 66%` |
| `--border` | `45 14% 87%` | `155 10% 20%` |

Gemessene Kontraste (WCAG 2.1, selbst berechnet):

| Paarung | Hell | Dunkel |
|---|---|---|
| foreground auf background | **14,67:1** (AAA) | **15,25:1** (AAA) |
| muted-foreground auf background | **5,07:1** (AA) | **7,76:1** (AAA) |
| primary auf background | **5,46:1** (AA) | **9,74:1** (AAA) |

Ein Akzent, sparsam eingesetzt: Links, Trennlinien, der Rahmen des
Prüfblocks. **Nicht** das grelle `#7CB342`, das jeder Matcha-Shop nutzt —
entsättigt wirkt es wie Tee und nicht wie Lebensmittelfarbe.

Der `border`-Kontrast von 1,24:1 bzw. 1,45:1 ist bewusst niedrig: Es sind
Trennlinien, keine Bedienelemente. **Umrandungen von Bedienelementen
brauchen 3:1 und müssen ein eigenes Token bekommen** — das fehlt im
bestehenden System und wäre beim Umskinnen zu ergänzen.

### 4.4 Typografie und Raster

- Fließtext in einer **Serife** (editoriale Glaubwürdigkeit),
  Bedienelemente und Datenblöcke in einer geometrischen Grotesk.
  Zahlen im Prüfblock **tabellarisch**, damit Preise untereinander
  ausgerichtet stehen.
- Satzbreite rund 68 Zeichen. Eine Spalte, keine Sidebar.
- **Schriften lokal einbinden**, nicht über Google Fonts — siehe 5.3.
  Das ist hier kein Kompromiss: lokale Fonts laden schneller.
- Dark Mode: das Repo bringt `.dark` und `suppressHydrationWarning`
  bereits mit, die Tokens oben decken beide Modi ab.
- Fotos: nur eigene, natürlich belassen, kein Filter, immer mit Datum
  in der Bildunterschrift.

---

## 5. Rechtliche Seite

**Kein Anwalt, keine Rechtsberatung.** Im Folgenden getrennt nach:
gesichert / strittig / Anwalt sinnvoll.

Eine Klarstellung vorweg, weil sie fast alles prägt: **„nicht
gewinnorientiert" ist rechtlich fast nie der Befreiungstatbestand, für den
man es hält.** Gewinnerzielungsabsicht ist Tatbestandsmerkmal beim
Gewerbebegriff — und sonst praktisch nirgends. Nicht bei § 18 Abs. 1 MStV,
nicht bei der DSGVO, nicht bei § 25 TDDDG, nicht beim Urheberrecht, nicht
bei Art. 50 AI Act.

### 5.1 Impressum

**Gesichert.** Das TMG ist abgelöst; seit 14.05.2024 gilt das DDG, die
Impressumspflicht steht in **§ 5 DDG**. Ein Impressum, das noch „§ 5 TMG"
zitiert, verweist auf ein nicht mehr existierendes Gesetz.

Entscheidender ist aber **§ 18 Abs. 1 MStV**: Anbieter von Telemedien,
„die nicht ausschließlich persönlichen oder familiären Zwecken dienen",
müssen Name und Anschrift vorhalten. Kein „geschäftsmäßig", keine
Gewinnschwelle. Die LFK-Aufsicht schreibt dazu (Leitfaden 2024, S. 2):
*„Verfügt das Angebot … über eine große Anzahl an Nutzern, soll es eine
breite Öffentlichkeit erreichen …, unterliegt es der Impressumspflicht
nach § 18 Abs. 1 MStV."*

**Ladungsfähig** heißt: kein Postfach, keine Packstation. Bei einer
Privatperson also die Wohnanschrift. Verstoß ist Ordnungswidrigkeit
(§ 115 Abs. 1 MStV / § 33 Abs. 2 DDG), Bußgeld bis 50.000 €. Zuständig
für München ist die **BLM**. Platzierung: höchstens zwei Klicks von jedem
Bereich.

Zur Geschäftsmäßigkeit nach § 5 DDG: Nach der Gesetzesbegründung ist
„jede nachhaltige Tätigkeit mit oder ohne Gewinnerzielungsabsicht"
geschäftsmäßig. Die LFK nennt als Indizien Bannerwerbung,
Affiliate-Links, Partnerprogramme, Werbekooperationen, „Vorstellung von
Produkten/Marken gegen geldwerte Vorteile" — und, überraschend, **die
Angabe einer E-Mail-Adresse „für Business-Anfragen"**.

**Strittig.** Ob § 18 **Abs. 2** MStV greift (zusätzlicher
Verantwortlicher für journalistisch-redaktionelle Angebote). Die LFK legt
eng aus — „professionell … journalistisch-redaktionell gestaltet", Beispiel
Online-Zeitungen, und Blogs nur, wenn sie „über ein Redaktionsteam
verfügen". Danach fällt ein Ein-Personen-Blog heraus. Andere Quellen
fassen weiter. Ob die frühere Einschränkung auf geschäftsmäßige Angebote
(§ 55 Abs. 2 RStV) im MStV fortgilt, **konnte nicht verifiziert werden.**

**Empfehlung.** Vollständiges Impressum, das alle Ebenen abdeckt: Vor- und
Nachname, ladungsfähige Anschrift, E-Mail plus zweite schnelle
Kontaktmöglichkeit, und — weil es bei einer Einzelperson keine
zusätzlichen Daten offenlegt — vorsorglich „Verantwortlich für den Inhalt
nach § 18 Abs. 2 MStV: [Name, Anschrift]". **§ 5 DDG** zitieren, nicht
§ 5 TMG. Keine „Business-Anfragen"-Adresse, schlicht „Kontakt".

**Anwalt** nur, wenn die Wohnanschrift nicht veröffentlicht werden soll —
die Empfangsbevollmächtigung über einen Anwalt ist konstruktiv heikel und
wird nicht durchweg akzeptiert.

### 5.2 Datenschutzerklärung

**Gesichert.** Die Haushaltsausnahme (Art. 2 Abs. 2 lit. c DSGVO) greift
**nicht**. EuGH **Lindqvist, C-101/01** (06.11.2003): Veröffentlichung auf
einer frei zugänglichen Website fällt gerade nicht darunter. **Ryneš,
C-212/13** (11.12.2014) bestätigt die Linie. Ein öffentlicher,
SEO-optimierter Blog ist der Lehrbuchfall des Gegenteils.

Die Informationspflicht aus Art. 13 DSGVO knüpft an den „Verantwortlichen",
nicht an Gewinn. Datenschutzerklärung ist Pflicht — auch ohne
Kontaktformular und ohne Analytics.

Server-Logs: EuGH **Breyer, C-582/14** (19.10.2016) — dynamische IPs sind
für den Betreiber personenbezogene Daten, wenn er über Dritte mit
zumutbarem Aufwand die Identität bestimmen kann. Rechtsgrundlage für Logs
ist üblicherweise Art. 6 Abs. 1 lit. f (berechtigtes Interesse); dafür
braucht es keine Einwilligung.

**Empfehlung.** Erklärung ab Tag eins. **AV-Vertrag mit dem Hoster nach
Art. 28 DSGVO** — wird regelmäßig vergessen und ist bei jedem Hosting
Pflicht. Nur tatsächlich eingesetzte Dienste beschreiben. Kontaktformular:
TLS, Datensparsamkeit (nur E-Mail und Nachricht), Löschfrist benennen.
Generatoren reichen für diesen Zuschnitt.

**Anwalt** erst bei Newsletter mit Tracking, Nutzerkonten oder
Kommentarfunktion.

### 5.3 Cookies, Analytics, eingebettete Dienste

**Gesichert.** Das TTDSG heißt seit 14.05.2024 **TDDDG**. § 25 Abs. 1
verlangt Einwilligung für **jede** Speicherung auf dem Endgerät und jeden
Zugriff darauf — nicht nur Cookies, sondern auch localStorage und
Fingerprinting, unabhängig vom Personenbezug. **§ 25 TDDDG kennt kein
berechtigtes Interesse**; die Abwägung aus Art. 6 Abs. 1 lit. f hilft
hier nicht. Reine Reichweitenmessung ist **nicht** privilegiert — die
geplante Statistik-Ausnahme des ePrivacy-Entwurfs wurde nie Gesetz.
Bußgeld bis 300.000 €.

| Dienst | Einschätzung |
|---|---|
| Google Analytics | Einwilligung zwingend, auch „cookieless"; dazu US-Transfer. Schlechteste Wahl. |
| Matomo, selbst gehostet | Praktisch bester Weg: cookieless + IP-Anonymisierung; deutsche Aufsichtsbehörden halten einwilligungsfreien Einsatz für vertretbar. Kein Dritter, kein AV-Vertrag, kein Drittland. |
| Plausible | Cookieless, EU-gehostet; wird als einwilligungsfrei einsetzbar dargestellt. |
| Vercel Analytics | **Nicht belastbar recherchiert.** US-Anbieter; vor Einsatz gesondert prüfen. |

**Google Fonts:** LG München I, **Az. 3 O 17493/20** (20.01.2022) —
dynamische Einbindung ohne Einwilligung verstößt gegen die DSGVO, 100 €
Schadensersatz plus Unterlassung. Lösung ist trivial: **lokal hosten.**

**Google Maps und YouTube** übertragen beim Laden IPs; Einwilligung ist
**vor** Ausführung nötig. Datenschutzfreundliche Alternative:
OpenStreetMap — oder schlicht ein statisches Kartenbild mit gewöhnlichem
Link.

**Strittig.** Wie „cookieless" cookieless wirklich ist: Auch Tools ohne
Cookies lesen typischerweise User-Agent, Auflösung und Sprache aus. Ob das
schon „Zugriff auf Informationen im Endgerät" ist, beurteilen die
Aufsichtsbehörden uneinheitlich. **Eine Garantie für „Analytics ohne
Banner" gibt es nicht**, nur ein deutlich reduziertes Risiko. Der
EU-Digital-Omnibus (Vorschlag 11/2025) könnte die Cookie-Einwilligung neu
ordnen; Verabschiedung frühestens Ende 2026. **Gilt heute nicht** — in
zwölf Monaten erneut ansehen.

**Empfehlung — der Bauplan für „Reichweite ohne Cookie-Banner":**

1. Kein Google Analytics. Stattdessen selbstgehostetes Matomo (cookieless,
   `disableCookies`, IP-Anonymisierung) oder Plausible.
2. Schriften lokal, per `@font-face`. Kein CDN.
3. Keine externen CDNs für JS, Icons, Bilder. Alles vom eigenen Server.
4. Kein Google Maps. OpenStreetMap oder statisches Kartenbild.
5. Keine YouTube-Embeds; falls nötig, Zwei-Klick-Lösung.
6. Dann **kein Consent-Banner nötig.**

Punkt 6 ist der Grund, warum diese Architektur nicht nur juristisch,
sondern auch für das SEO-Ziel die bessere ist: kein Layout-Shift, bessere
Core Web Vitals, keine Absprünge am Banner. **Diese Entscheidung ist am
Anfang billig und später teuer.**

Sie passt außerdem zur Wahl aus 2.1: Weil die Ausgabe statisch ist, kann
sie auf einem EU-Host liegen — was die Drittlandfrage beim Hosting selbst
gleich miterledigt.

### 5.4 Bildrechte

**Gesichert.** Die **Panoramafreiheit (§ 59 UrhG) gilt nicht für
Innenräume** — nur für Werke an öffentlichen Wegen, Straßen und Plätzen,
und nur die Außenansicht, aufgenommen von einem öffentlich zugänglichen
Ort (keine Leiter, keine Drohne).

Das **Hausrecht** bleibt davon unberührt: Der Café-Betreiber kann
Fotografieren untersagen oder von einer Erlaubnis abhängig machen.
Umgekehrt hat der BGH im Sanssouci-Komplex (**V ZR 44/10** und
**V ZR 45/10**, 17.12.2010) entschieden, dass Fotografieren und Verwerten
keine Eigentumsbeeinträchtigung sind, wenn das Grundstück nicht betreten
wurde. Daraus die klare Linie:

- **Fassade von der Straße** → unproblematisch.
- **Innen fotografiert** → Lokal betreten, Hausrecht greift, Erlaubnis nötig.

**Fremde Fotos von Café-Websites oder Instagram: nein.** Quellenangabe
ersetzt die Erlaubnis nicht — das ist der verbreitetste Irrtum überhaupt.
Gilt auch für „Reposten" mit Verlinkung.

**Personen:** Über Art. 85 Abs. 2 DSGVO gelten für
journalistisch-redaktionelle Zwecke vorrangig **§§ 22, 23 KUG**. Praktisch
wichtig: Die DSGVO-Einwilligung ist jederzeit grundlos widerrufbar, die
KUG-Einwilligung nur bei wichtigem Grund.

**Strittig.** Ob KUG oder DSGVO gilt, hängt daran, ob die Veröffentlichung
„ausschließlich journalistisch-redaktionellen Zwecken" dient — bei einem
privaten Blog offen. **Und das erzeugt eine echte Spannung mit 5.1:** Wer
sich gegen die journalistisch-redaktionelle Einordnung nach § 18 Abs. 2
MStV wehrt, schwächt zugleich sein Argument für die KUG-Privilegierung.
Beides hängt an derselben Vorfrage und zieht in entgegengesetzte
Richtungen.

Ebenfalls offen: **Verpackungsdesign** kann urheberrechtlich geschützt
sein. § 57 UrhG (unwesentliches Beiwerk) hilft nur, wenn die Verpackung
zufällig im Bild ist — bei einem formatfüllenden Produktfoto nicht.

**Empfehlung.**

1. Vor jedem Foto im Lokal den Betreiber fragen — formlos, aber
   **schriftlich** (WhatsApp/E-Mail genügt als Nachweis).
2. Die Nutzung konkret benennen: „Veröffentlichung auf meinem Blog [URL]
   und in zugehörigen Kanälen". Ein „Sie dürfen fotografieren" deckt die
   Veröffentlichung nicht sicher ab.
3. **Keine erkennbaren Gäste im Bild.** Menschenleere Aufnahmen in
   Randzeiten lösen die gesamte KUG/DSGVO-Abwägung auf.
4. Mitarbeiter nur mit schriftlicher Einwilligung inkl. Widerrufsregelung.
5. **Ausschließlich eigene Fotos.**
6. Fassaden von der Straße sind der sichere Hafen und tragen einen
   erheblichen Teil der Bebilderung.

Das Datenmodell in 2.2 hält genau das fest: `fotos[].ort` und
`fotos[].erlaubnis`, geprüft im Build (2.6).

### 5.5 Marken und Lokale nennen

**Gesichert.** Namen von Marken und Cafés **dürfen im redaktionellen Text
genannt werden.** Markenrechtlich setzt eine Verletzung
**kennzeichenmäßige Benutzung** voraus — die Verwendung zur
Herkunftskennzeichnung eigener Waren. Die beschreibende Nennung ist keine;
§ 23 MarkenG erlaubt sie ausdrücklich. Verfassungsrechtlich tritt Art. 5
Abs. 1 GG hinzu.

Für **kritische Bewertungen** gilt die Abgrenzung Tatsachenbehauptung /
Werturteil. Unternehmen haben ein Unternehmenspersönlichkeitsrecht, müssen
aber dulden, öffentlich bewertet zu werden. Gastronomiebewertungen beruhen
überwiegend auf Geschmacksempfindungen und sind damit Meinung, nicht
Tatsache. Auch harsche Kritik ist hinzunehmen.

**BGH, VI ZR 1244/20** (09.08.2022): Eine Bewertung aus Sternevergabe plus
Fließtext ist eine **einheitliche, nicht aufspaltbare Meinungsäußerung.**
Praktisch: Wer 2 von 5 Punkten vergibt und begründet, dessen Punktzahl
kann nicht isoliert angegriffen werden.

**Die drei harten Grenzen:** unwahre Tatsachenbehauptungen (§ 186 StGB
üble Nachrede — dort trägt der Behauptende die Erweislichkeit der
Wahrheit); Schmähkritik (eng ausgelegt); **Bewertung ohne
Kundenkontakt.**

**Strittig.** Logos als **Grafik** sind heikler als die Wortnennung —
kritisch besonders in Kopfzeile, Favicon oder Navigation, wo der Eindruck
einer Verbindung entsteht. Und die Grenze Meinung/Tatsache im Einzelfall:
„schmeckte bitter" ist Geschmacksurteil, „war überlagert" ist eine
überprüfbare Tatsache.

**Ausdrücklich:** Es wurde **keine BGH-Entscheidung gefunden**, die exakt
die redaktionelle Markennennung durch einen privaten Blogger behandelt.
Die Linie stammt aus Fachbeiträgen zur allgemeinen Dogmatik, nicht aus
gesicherter Rechtsprechung zu diesem Fall.

**Empfehlung.**

1. Namen als Text nennen: unbedenklich.
2. **Fremde Logos als Grafik vermeiden** — nie als Designelement, im
   Header, im Favicon oder in der Navigation.
3. **Kein Markenname in Domain oder Seitentitel.** (Siehe 0.1 und 5.6.)
4. Bewertungen als Meinung formulieren: „mir schmeckte…", „mein Eindruck
   war…". Das ist keine Floskel, sondern verschiebt die Einordnung.
5. **Nur bewerten, wo man war**, mit Besuchsdatum. Das dokumentiert den
   Geschäftskontakt und relativiert zugleich.
6. Überprüfbare Behauptungen belegen oder weglassen.
7. **Keine Aussagen zu Hygiene, Gesundheit oder Verhalten von
   Mitarbeitern.** Dort wird aus Kritik Strafrecht.

Punkte 5 und 6 sind im Datenmodell verankert (`erstbesuch`,
`preise[].quelle`, `quellen[]`) und werden im Build erzwungen.

**Anwalt sofort** bei jeder Abmahnung oder anwaltlichen Beanstandung —
kurze Fristen, und eine ungeprüft unterschriebene strafbewehrte
Unterlassungserklärung wirkt lebenslang. **Anwalt vorab**, wenn ein
Ranking mit Verlierern geplant ist.

### 5.6 Der Name — Kennzeichen- und Namensrecht

*Sachverhalt in Abschnitt 0.1.*

**Das Markenrecht ist hier der schwächste Angriffspunkt der Gegenseite.
Das eigentliche Risiko ist § 12 BGB — und der greift ausgerechnet
unabhängig davon, ob der Blog kommerziell ist.** Wer nur auf die Marke
schaut, prüft die falsche Norm.

#### Registerbefund (gesichert)

Abgefragt über **TMview** (offizielle Datenbank des EUIPO/EUIPN, spiegelt
DPMA- und EUIPO-Daten). Inhaberin ist die VCTRY GmbH, bis September 2024
firmierend als „Kurfürst 2036 GmbH", Unternehmensgegenstand „Betrieb von
gastronomischen Einrichtungen".

| Nr. | Zeichen | Art | Angemeldet | Eingetragen | Nizza-Klassen |
|---|---|---|---|---|---|
| 019266133 | „Daily Matcha" | Wortmarke | 24.10.2025 | 31.07.2026 | **25, 35** |
| 019266080 | „daily MATCHA" | Wort-/Bildmarke | 24.10.2025 | 31.07.2026 | **25, 35** |

Klasse 25 = Bekleidung, Klasse 35 = Werbung/Geschäftsführung. **Eine
deutsche Marke existiert nicht** — TMview zeigt beim DPMA null Treffer.

**Der auffälligste Teil des Befundes ist, was fehlt: Klasse 30 (Tee) und
Klasse 43 (Verpflegung von Gästen).** Für eine Café-Kette mit fünf
Filialen ist das ungewöhnlich — und vermutlich kein Versehen: In
Klasse 30/43 hätte das EUIPO die Marke sehr wahrscheinlich beanstandet,
weil „Matcha" dort schlicht das Produkt benennt. **Der Markenschutz liegt
also genau nicht dort, wo das Geschäft stattfindet.**

Dass „Matcha" für Tee und Gastronomie nach § 8 Abs. 2 MarkenG nicht
schutzfähig ist, lässt sich am Register ablesen: „MATCHA" ist eingetragen
für **Farben** (Farrow & Ball, Kl. 2) und **Transport** (Kl. 39) — die
Anmeldungen für Tee und Lebensmittel (DE 3020182366590,
DE 3020100555491) tragen dagegen kein Eintragungsdatum. Entsprechend
koexistieren „Hi Matcha", „Oh Matcha", „Got Matcha", „Uji Matcha" und ein
Dutzend weitere teils in derselben Klasse.

#### Warum das Markenrecht trotzdem nicht greift

§ 14 Abs. 2 MarkenG setzt Benutzung **im geschäftlichen Verkehr** voraus.
Der BGH definiert das als Handeln „im Zusammenhang mit einer auf einen
wirtschaftlichen Vorteil gerichteten kommerziellen Tätigkeit und nicht im
privaten Bereich" (**I ZR 240/12** „Kinderhochstühle im Internet III",
bestätigt in **I ZR 136/17** „Tork"; Ursprung EuGH **C-206/01** „Arsenal").

Ausdrücklich **nicht** erfasst: wissenschaftliche, politische, kirchliche
und **meinungsbildende/redaktionelle** Tätigkeit. **Öffentliche Reichweite
allein begründet keinen geschäftlichen Verkehr.**

Und selbst wenn man ihn annähme, scheiterte die Verletzung an den Klassen:
Ein redaktionelles Online-Angebot gehört systematisch in **Klasse 41**
(Bereitstellen von Online-Publikationen) — weder Kleidung (25) noch
Werbedienstleistung (35). Keine Doppelidentität, keine
Dienstleistungsähnlichkeit, und für den Bekanntheitsschutz ist eine im
Juli 2026 eingetragene Marke ersichtlich zu jung.

Dasselbe gilt für **§ 5/15 MarkenG** (Unternehmenskennzeichen — entsteht
ohne Eintragung, hat VCTRY also seit spätestens 2024) und für das
**gesamte UWG**: § 2 Abs. 1 Nr. 2 UWG hängt an der „geschäftlichen
Handlung", und die Gesetzesbegründung nimmt „redaktionelle" Äußerungen
ausdrücklich aus. Ohne geschäftliche Handlung: kein § 5 UWG, kein
§ 4 Nr. 3 UWG, keine Mitbewerbereigenschaft.

Die bloße **Nennung** von „Daily Matcha" in einem Beitrag über das Café ist
nach § 23 MarkenG ohnehin zulässig (vgl. Abschnitt 5.5).

#### Das Kernrisiko: § 12 BGB

§ 12 BGB schützt auch Firmen und Unternehmenskennzeichen — und **verlangt
kein Handeln im geschäftlichen Verkehr.** Genau deshalb greift er dort, wo
das Markenrecht aussetzt. Die **Registrierung einer Domain ist bereits
Namensgebrauch** (BGH **I ZR 138/99** „shell.de", **I ZR 159/05**
„afilias.de"); verletzt ist das Recht bei **Zuordnungsverwirrung**.

Der fast deckungsgleiche Fall ist **OLG Hamburg, 3 W 110/07**: Eine
Privatperson betrieb unter `unternehmensname.blog.de` einen kritischen
Blog. Das Gericht verneinte das Markenrecht klar — „Beiträge zur
Meinungsbildung im gesellschaftlichen Raum", kein geschäftlicher Verkehr —
**bejahte aber § 12 BGB** und erließ die einstweilige Verfügung. Begründung:
Die Kombination „Unternehmensname + blog" suggeriert ein offizielles
Corporate Blog; der Zusatz wird nur beschreibend verstanden.

Übertragen: `daily-matcha.de` würde von Münchner Nutzern mit hoher
Wahrscheinlichkeit für die Website der Café-Kette gehalten. Luca hat
**kein eigenes Namensrecht** an „Daily Matcha" — das Recht der
Gleichnamigen aus shell.de hilft ihm nicht. Die Priorität liegt eindeutig
bei VCTRY.

**Strittig — und hier liegt die beste Verteidigung:** § 12 BGB setzt
namensmäßige Unterscheidungskraft voraus. Bei Gattungsbezeichnungen fehlt
sie; Schutz entstünde dann erst über Verkehrsgeltung. „Daily Matcha" liegt
im Grenzbereich. **Ob ein Gericht dem Namen die nötige Unterscheidungskraft
zubilligt, ist offen — und daran hängt alles.** Gegen Luca spricht, dass es
nicht um eine abstrakte Gattungsdomain geht (wie BGH **I ZR 216/99**
„mitwohnzentrale.de", wo Gattungsdomains für zulässig erklärt wurden),
sondern um den identischen Namen eines konkret existierenden Anbieters am
selben Ort, dessen Läden auch noch besprochen werden sollen.

**Rechtsfolge:** Unterlassung und **Verzicht** auf die Domain — kein
Übertragungsanspruch. Praktisch sichert sich der Berechtigte die Domain
über einen **DENIC-DISPUTE-Eintrag**, der sie nach Freigabe automatisch
zuspielt.

#### Praktisches Risiko

Einschätzung, keine Rechtsauskunft: **hoch genug, um kein Projekt darauf zu
bauen.** Wer im Oktober 2025 gleich zwei Unionsmarken anmeldet, hat
anwaltliche Beratung und beobachtet sein Zeichen. Die Klasse-25-Anmeldung
(Merch) und Franchise-Beratung in Klasse 35 zeigen ein Unternehmen in
Expansion, für das die Marke ein Asset ist. Und der Blog würde nicht
irgendwo stehen, sondern **die Läden des Markeninhabers bewerten** — das
macht ihn maximal sichtbar. Bei kritischer Besprechung ist die Domain der
bequemste Angriffspunkt, gerade weil die Kritik selbst geschützt wäre.

Kosten (Größenordnungen): Streitwerte im Kennzeichenrecht typischerweise
25.000–100.000 €; Abmahnkosten **ca. 1.250–2.500 €** (bei 50.000 €
Streitwert etwa 2.000 €); einstweilige Verfügung schnell 5.000–10.000 €.
Bei nicht-kommerzieller Nutzung ist ein niedrigerer Streitwert
argumentierbar — aber das entscheidet erst das Gericht, und die Abmahnung
kommt mit dem hohen Wert. Schadensersatz setzt geschäftlichen Verkehr
voraus und wäre hier praktisch null.

**Was nicht hilft:**

| Maßnahme | Wirkung |
|---|---|
| Disclaimer „kein Zusammenhang mit dem Unternehmen" | **Nahezu wirkungslos.** Die Zuordnungsverwirrung entsteht beim Aufruf der Domain — bevor der Nutzer irgendeinen Text liest. Ratsam, aber rettet die Domain nicht. |
| Andere TLD (.com, .blog) | **Hilft kaum.** § 12 BGB ist TLD-unabhängig. Praktisch ohnehin hinfällig — beide Varianten sind weg. |
| Zusatz im Namen | **Die naheliegenden Zusätze sind die falschen.** `daily-matcha-blog.de` ist exakt OLG Hamburg 3 W 110/07. `daily-matcha-muenchen.de` wäre schlechter — der Ortszusatz *verstärkt* die Zuordnung zu einem Münchner Filialbetrieb. |
| Strikt kein Geld, keine Werbung | **Wirksam gegen Marken-, Kennzeichen- und Wettbewerbsrecht — nicht gegen § 12 BGB.** Und ein einziger Affiliate-Link kippt die ganze Verteidigungslinie. |

**Das Kernrisiko ist durch Gestaltung nicht wegzubekommen, solange „Daily
Matcha" im Domainnamen steht.**

#### Namensvorschläge

Alle in TMview über die Ämter DE, EUIPO und WIPO geprüft: **null Treffer**,
und ohne DNS-Eintrag, also mit hoher Wahrscheinlichkeit frei. **Vor dem Kauf
über denic.de/webwhois verifizieren** — eine Domain kann registriert und
nur nicht delegiert sein.

| Name | Anmerkung |
|---|---|
| **Isarmatcha** | Favorit der Recherche. Isar = unmissverständlich München, ohne „München" zu sagen. Kurz, sprechbar, eigenständig genug für eigenen Schutz. |
| **Matchaviertel** | „Viertel" transportiert Stadt und Rundgang-Idee, trägt die Stadtteil-Achse aus 2.4 gut. |
| **Matchakompass** | Guide-Charakter im Namen. Vorsicht: ältere „KOMPASS"-Marken in anderen Klassen — vorher gegenprüfen. |
| **Matchakarte** | Doppeldeutig (Stadtplan / Getränkekarte), aber näher an beschreibend. |
| **Matcharadar** | Passt zu „Neueröffnungen im Blick". |
| **Eisbachmatcha** | Sehr münchnerisch. „Eisbach"/„Eisbachwelle" wurde **nicht** geprüft — nachzuholen. |
| **Bergmatcha** | Bayern-Bezug ohne Ortsnamen; trägt auch über München hinaus. |

Regeln für die Namenswahl: **vor** der Registrierung prüfen (TMview,
DPMAregister, Handelsregister, Google, Instagram, DENIC — alles kostenlos);
**nie** ein fremder Anbietername mit Zusatz; nicht rein beschreibend
(`matcha-muenchen.de` ist ohnehin vergeben und wäre nicht verteidigbar);
Ortsbezug in Titel und Inhalt statt im Domainkern — Google gewichtet
Exact-Match-Domains seit dem EMD-Update 2012 stark ab; Domain und
Social-Handle gleichzeitig sichern.

#### Was nicht geprüft werden konnte

**DPMAregister direkt** — die Suchmaske ist ein Formular ohne öffentliche
GET-Schnittstelle; ersatzweise TMview, das die DPMA-Daten spiegelt.
**EUIPO eSearch plus** liefert 403. Der wörtliche
Waren-/Dienstleistungstext der EU-Marken stammt aus Sekundärquellen, nicht
aus dem Amtsregister. Wer `daily-matcha.de` hält, gibt die DENIC seit der
DSGVO nicht mehr preis. Das fehlende Eintragungsdatum der Tee-Anmeldungen
ist ein starkes Indiz für eine Zurückweisung, aber kein Beweis.

Selbst nachprüfen, kostenlos und ohne Anmeldung:
**TMview** — tmdn.org/tmview (EU plus alle nationalen Ämter, filterbar nach
Amt und Nizzaklasse) · **DPMA** — register.dpma.de, Marken/Basisrecherche ·
**EUIPO** — euipo.europa.eu/en/search, Nummer 019266133 · **Handelsregister**
— handelsregister.de, „VCTRY GmbH".

#### Empfehlung

**Namenswechsel.** Nicht weil das Risiko sicher eintritt, sondern weil das
Verhältnis nicht stimmt: Der Gewinn ist ein Name, den ein anderer schon hat;
das Risiko sind vierstellige Kosten, Domainverlust und ein Umzug mitten im
Aufbau. Bei einem Projekt ohne Einnahmen ist das ein schlechtes Geschäft —
und die Domain ist ohnehin vergeben.

**Anwalt** (Fachanwalt gewerblicher Rechtsschutz) nur, falls der Name
trotzdem behalten werden soll: Die Unterscheidungskraft nach § 12 BGB ist
eine Wertungsfrage mit offenem Ausgang. Erstberatung ist nach § 34 RVG auf
190 € netto gedeckelt — günstig gegenüber 2.000 € Abmahnkosten, aber
teurer als ein Namenswechsel, der nichts kostet.

### 5.7 Wann es ins Kommerzielle kippt

Drei getrennte Rechtsfolgen mit **unterschiedlichen Schwellen**, die gern
vermengt werden.

**(i) Gewerbeanmeldung (§ 14 GewO).** Setzt Gewinnerzielungsabsicht
voraus — hier, und praktisch nur hier, ist deren Fehlen der
Befreiungstatbestand. Nebenbei: Journalistische Tätigkeit wäre ohnehin
freier Beruf nach § 18 EStG.

**(ii) Steuerpflicht — hier wird der Spendenbutton gefährlich.**
**FG Berlin-Brandenburg, Az. 14 K 14067/24** (12.06.2025): Freiwillige
Zahlungen an einen Blogger sind trotz des Etiketts „Spende"
**Betriebseinnahmen**, wenn berufliche Veranlassung besteht. Im Fall:
50.728–68.110 € jährlich über PayPal. Die Kriterien des Gerichts:
nahezu tägliche Veröffentlichung erfüllt § 18 EStG; maßgeblich ist der
Anlass der Zahlung; und **Newsletter, Abo-Funktionen, beworbene
Spendenbuttons und „Liquiditätshinweise"** belegten Gewinnerzielungsabsicht.

**„Buy me a coffee", Ko-Fi und Patreon sind Betriebseinnahmen, keine
Schenkungen.** Bemerkenswert: Das Gericht zog ausgerechnet die
**Newsletter-Funktion** als Professionalitätsindiz heran.

**(iii) Werbekennzeichnung nach UWG — die niedrigste Schwelle.**
§ 5a Abs. 4 UWG. **BGH, I ZR 90/20 und I ZR 125/20** (09.09.2021) sowie
**I ZR 35/21 „Influencer III"** (13.01.2022): Wer Waren oder
Dienstleistungen absatzfördernd präsentiert, die ihm vom begünstigten
Unternehmen **kostenlos zur Verfügung gestellt** wurden, betreibt
kennzeichnungspflichtige Werbung — unabhängig von Followerzahl.

**Damit ist die Produktproben-Frage beantwortet: Eine Gratis-Probe oder
ein Freigetränk vom Café, über das anschließend positiv berichtet wird,
löst die Kennzeichnungspflicht aus.** Kein Geld muss fließen. Und die LFK
zählt „Vorstellung von Produkten gegen geldwerte Vorteile" zugleich zu den
Indizien der Geschäftsmäßigkeit nach 5.1 — die Gratistasse kippt also zwei
Regime auf einmal.

**Strittig.** Ob die Influencer-Rechtsprechung (Instagram, große
Reichweite) dieselbe Schwelle bei einem kleinen Blog erreicht. Das Risiko
ist real, die Verfolgungswahrscheinlichkeit bei kleiner Reichweite
gering — eine Prognose, keine Rechtsauskunft, und sie ändert sich mit der
Reichweite. **Liebhaberei ist keine Schutzzone**, sondern nur der Verlust
der Verlustanerkennung.

**Was erlaubt bleibt:** redaktionelle Texte in beliebigem Umfang, eigene
Fotos, Cafés und Marken nennen und bewerten, **SEO ohne jede
Einschränkung** (SEO ist für keines der drei Regime ein
Tatbestandsmerkmal), und ganz normal als zahlender Gast berichten.

**Was nicht geht, wenn es nicht-kommerziell bleiben soll:**

- keine Werbung, keine Banner, **keine Affiliate-Links** — auch keine einzelnen
- **kein Spenden-Button, kein „Buy me a coffee", kein Ko-Fi, kein Patreon**
- **keine Gratisproben, keine Freigetränke, keine Pressekonditionen** —
  oder mit „Werbung" kennzeichnen und die Schwelle bewusst überschreiten.
  Einen Mittelweg gibt es nicht.
- keine Kooperationen
- keine „Business-Anfragen"-Adresse
- **kein Newsletter mit Abo-Charakter**, jedenfalls nicht ungeprüft

**Die wichtigste Alltagsregel:** Wenn ein Café erfährt, dass Sie einen Blog
betreiben, und Ihnen daraufhin den Matcha ausgibt — **bezahlen Sie
trotzdem.** Genau das ist die Schwelle, und sie kommt beiläufig und
freundlich daher.

**Steuerberater** (nicht Anwalt), sobald irgendeine Zahlung fließt, auch
eine einzelne.

### 5.8 KI-generierte Inhalte

**Gesichert.** Eine allgemeine deutsche Kennzeichnungspflicht für
KI-Texte auf Websites existiert nicht. Geregelt wird das allein über den
EU AI Act (VO 2024/1689). **Art. 50 gilt seit 02.08.2026** — keine
Zukunftsfrage mehr.

Adressaten trennen: **Art. 50 Abs. 2** verpflichtet **Anbieter** von
KI-Systemen zur maschinenlesbaren Markierung — das ist die Pflicht von
OpenAI, Anthropic, Google, nicht Lucas. **Art. 50 Abs. 4** trifft
**Betreiber**: Wer KI einsetzt, um Texte zu erzeugen, *die veröffentlicht
werden, um die Öffentlichkeit über Angelegenheiten von öffentlichem
Interesse zu informieren*, muss offenlegen — **es sei denn, die Inhalte
wurden einer menschlichen Überprüfung oder redaktionellen Kontrolle
unterzogen und eine Person trägt die redaktionelle Verantwortung.**

Zwei Filter, beide müssten überwunden sein, damit eine Pflicht entsteht:

1. **„Angelegenheiten von öffentlichem Interesse"** meint nach der
   Fachliteratur Politik, Gesellschaft, Nachrichten. Ein Blog über
   Matcha-Cafés ist Lifestyle- und Verbraucherinformation.
2. **Redaktionelle Kontrolle** — wer Entwürfe durchsieht, überarbeitet und
   unter seinem Namen veröffentlicht, übernimmt die Verantwortung.

**Ergebnis: nach dieser Einschätzung keine Kennzeichnungspflicht.**
Der PR-Merge-Ablauf aus 2.6 erfüllt Filter 2 und macht ihn belegbar.

**Strittig.** „Öffentliches Interesse" ist nicht legaldefiniert; es gibt
weder Rechtsprechung noch Kommissions-Leitlinien zu Art. 50. Bei Beiträgen
über Lieferketten, Pestizidbelastung oder Gesundheitsaussagen zu Matcha
wäre Filter 1 deutlich weniger klar.

Zwei von Art. 50 unberührte Punkte, **nicht geprüft**: ob vollständig
KI-erzeugte Texte, die als persönliche Erfahrungsberichte auftreten,
irreführend sind; und dass rein KI-generierte Texte mangels menschlicher
Schöpfung keinen Urheberrechtsschutz genießen — relevant, wenn der Blog
sich gegen Übernahme wehren will.

**Empfehlung.** Jeden Entwurf tatsächlich lesen und überarbeiten — nicht
nur wegen Art. 50, sondern wegen des eigentlichen Risikos: erfundener
Fakten. Ein halluziniertes Café oder eine falsche Adresse ist zugleich
eine unwahre Tatsachenbehauptung nach 5.5. **Niemals KI-generierte
Erfahrungsberichte über Orte, an denen niemand war** — das ist der Punkt,
an dem KI-Nutzung und Bewertungsrecht kollidieren, und genau ihn sperrt
die Build-Regel aus 2.6. Ein freiwilliger Transparenzhinweis ist nicht
gefordert, aber unschädlich und dokumentiert die Verantwortung. Kommt je
ein Chatbot auf die Seite: Hinweis nach Art. 50 Abs. 1 ist Pflicht.

### 5.9 Die vier meistübersehenen Punkte

1. **§ 18 Abs. 1 MStV, nicht § 5 DDG**, ist die entscheidende
   Impressumsnorm. Die ganze „geschäftsmäßig"-Debatte geht am Kern vorbei.
   Die Wohnadresse wird öffentlich, und das ist nicht verhandelbar, wenn
   Reichweite das Ziel ist.
2. **Fehlende Gewinnerzielungsabsicht befreit fast nirgends.**
3. **Der Gratis-Matcha ist die eigentliche Gefahrenstelle.** Der Übergang
   ins Kommerzielle passiert nicht durch eine Entscheidung, sondern durch
   eine freundliche Geste an der Theke.
4. **Die technische Architektur entscheidet über den Rechtsaufwand — und
   sie deckt sich mit dem SEO-Ziel.** Lokale Fonts, keine CDNs, kein
   Google Maps, kein Google Analytics: erspart Consent-Banner,
   Google-Fonts-Risiko und Drittlandproblematik in einem Zug und liefert
   die besseren Ladezeiten.

---

## 6. Entscheidungen, die anstehen

| # | Entscheidung | Warum jetzt |
|---|---|---|
| **E1** | **Welcher Name?** Empfehlung: wechseln. | Blockiert alles. `daily-matcha.de` ist bereits vergeben und `.com` steht zum Verkauf — die Entscheidung ist faktisch schon halb gefallen. Kernrisiko ist § 12 BGB, und das lässt sich durch Disclaimer oder Zusatz **nicht** entschärfen. Vorschläge in 5.6. Siehe 0.1 und 5.6. |
| **E2** | **Klarname und Wohnanschrift veröffentlichen?** | § 18 Abs. 1 MStV lässt keine Wahl, wenn Reichweite das Ziel ist. Wenn nein, ist das Vorhaben in dieser Form hinfällig. Siehe 0.2. |
| **E3** | **Eigenes Repo oder `apps/blog` in diesem Monorepo?** | Empfehlung: eigenes Repo; die generischen Inhaltsbausteine kommen als `packages/content` hierher zurück. Siehe 2.7. |
| **E4** | **Adapter in den Typecheck aufnehmen?** | Firebase/Supabase sind bewusst nicht installiert, deshalb prüft sie niemand — genau darum blieb der `count()`-Bruch unsichtbar. Optional: SDKs als devDependencies plus eigener CI-Schritt. Siehe 1.3. |
| **E5** | **Wie wird vom Handy geschrieben?** | GitHub-Web-Editor reicht am Anfang; ein Editor über die GitHub-API wäre später zu bauen. Siehe 2.1. |
| **E6** | **Matomo selbst hosten oder Plausible?** | Beeinflusst Hosting und Datenschutzerklärung. Beides ohne Banner betreibbar; Matomo ist unabhängiger, Plausible bequemer. Siehe 5.3. |
| **E7** | **Erster Artikel: die eigene Preiserhebung?** | Größte Lücke, originäre Daten, löst einen dokumentierten Widerspruch auf — aber er kostet Feldarbeit in ~25 Läden. Siehe 3.4 (a). |

---

## 7. Was offen bleibt

- **Suchvolumina.** Keine einzige belastbare Zahl. Nur mit Keyword
  Planner, Search Console oder einem Bezahltool zu klären.
- **Local Pack.** Ob und wie Google Maps bei diesen Suchen einblendet,
  konnte nicht gesehen werden — von Hand in Google zu prüfen.
- **Rich-Result-Fähigkeit** von `Review` auf lokale Betriebe und von
  `FAQPage`: in diesem Durchgang nicht geprüft.
- **Reichweite von § 18 Abs. 2 MStV** — gilt er nur für geschäftsmäßige
  Angebote? Wie professionell ist „professionell"?
- **KUG-Privilegierung über Art. 85 Abs. 2 DSGVO** für einen privaten
  Blog. Hängt an derselben Vorfrage wie der vorige Punkt und zieht in die
  entgegengesetzte Richtung. Ein Medienrechtler könnte beides in einer
  Stunde einordnen.
- **Unterscheidungskraft von „Daily Matcha" nach § 12 BGB** — die Frage,
  an der das Namensrisiko hängt. Offener Ausgang, nur ein Fachanwalt kann
  sie einordnen.
- **Register nur mittelbar geprüft.** DPMAregister und EUIPO eSearch plus
  waren nicht direkt abfragbar (Formular ohne GET-Schnittstelle bzw. 403);
  der Befund stammt aus TMview, das beide Datenbestände spiegelt. Der
  wörtliche Waren-/Dienstleistungstext kommt aus Sekundärquellen.
- **Inhaber von `daily-matcha.de`** — die DENIC gibt ihn seit der DSGVO
  nicht mehr preis. Ob VCTRY selbst dahintersteht, ist Vermutung.
- **Verfügbarkeit der Namensvorschläge** wurde per DNS geprüft, nicht beim
  Registrar. Eine Domain kann registriert und nur nicht delegiert sein.
- **Vercel Analytics** datenschutzrechtlich nicht belastbar bewertet.
- **Meine `count()`-Implementierungen** sind nicht compilergeprüft
  (siehe E4).
- **Das Inventar in 3.5** ist aus fremden Artikeln zusammengetragen.
  Adressen, Öffnungszeiten und die Schreibweise „Matcha Lap/Lab" sind vor
  Veröffentlichung vor Ort zu prüfen.
