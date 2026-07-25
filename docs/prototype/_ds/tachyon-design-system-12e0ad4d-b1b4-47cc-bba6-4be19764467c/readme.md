# Tachyon — Design System

> **Tachyon** is a brand for the bare-metal era: raw compute made beautiful.
> A glassmorphism design system built on a deep-water palette and a circuit-creature
> mascot. Frosted surfaces float over a dark teal substrate, lit by brand-colored glows.

---

## 1. Brand context

Tachyon is a **software-development** company whose edge is **performance** — stacks and code
that run close to the metal. It is _not_ a frontend or backend specialist, and _not_ a UI shop;
it's a builder of fast, well-engineered systems (think performance + UX + raw compute). The
identity centers on a hero emblem: a **giant water-bug** ("barata d'água") rendered as a living
**printed-circuit board** — antennae become signal traces, the carapace a die, the legs power
rails. The creature is nicknamed **Volt**. It reads as resilient, fast, and close to the metal.

The system pairs that detailed, almost coin-engraved emblem with a clean, modern **glassmorphism**
UI: translucent frosted panels, soft depth, and the four brand colors used as luminous washes.
The `ui_kits/console/` example is _one_ product surface (a bare-metal compute console) — it shows
the system in use, but the brand itself is broader than any single interface.

**Name:** _Tachyon_ — after the hypothetical faster-than-light particle: pure **speed** with real
engineering depth, and it reads like a serious infra/dev company. **Confirmed** by the user.
The wordmark lights the **"on"** in gold (_powered on / connected_) — `Tachy` in paper, `on` in
gold-400. Mascot: **Volt** (a separate entity from the brand name — never fold the mascot into the
wordmark).

### Sources provided

- `uploads/final.svg` — the master logo artwork (1200×1200). **Note:** the source file is a
  flattened single-layer export that renders as a solid black disc in most renderers (the detail
  paths share one fill over a filled disc). We reconstructed usable two-tone artwork from it — see
  _Logo & assets_ below. A clean multi-color vector re-export from the user would be ideal.
- Brand palette, fonts, and direction were given as written notes (see below).

---

## 2. Content fundamentals — voice & tone

Tachyon speaks like a **calm senior engineer**: precise, confident, low on hype.

- **Person:** address the user as **you**; the product/brand is **we** sparingly. Mostly write in
  the **imperative** for actions ("Provision a node", "Attach volume", "Deprovision").
- **Casing:** **Sentence case** for almost everything — headings, buttons, labels, menus.
  Reserve ALL-CAPS for tiny eyebrows/overlines (tracked out) and short status badges (`PRO`).
- **Tone:** technical but human. Short declaratives. Numbers and units are welcome and exact
  ("42 ms", "7.3 TB/s", "sa-east-1"), never vague ("super fast"). No exclamation marks in UI.
- **The script accent (Parisienne)** carries the _emotional_ line only — a tagline or hero
  flourish like _"bare metal, alive"_. Never use it for body, labels, or anything functional.
- **Mono (Ubuntu Mono)** carries machine truth: IDs, regions, CLI, metrics — e.g. `CIR-04F2-A19`.
- **Emoji:** not used. **Icons** (Lucide) carry meaning instead.
- **Vibe words:** bare metal · circuitry · water/marsh · resilient · provisioned · live.

Example microcopy:

- Button: `Provision node` · `Attach volume` · `Cancel` · `Deprovision`
- Empty state: `No nodes yet. Provision your first to get started.`
- Toast: `Node online — cir-prod-01 joined the sa-east-1 pool.`
- Error: `This key has expired. Generate a new one to continue.`

---

## 3. Visual foundations

**Aesthetic:** glassmorphism over a "deep water" backdrop. The page is a dark teal-ink gradient
lit by four soft radial glows (teal, gold, sage, orange). Everything else is frosted glass.

- **Color** — Primary **gold `#ECBA28`** for action and brand accent. Auxiliaries: **sage
  `#8EA37B`** (success/organic), **teal `#2A7384`** (info/"the water", and the base of the ink
  neutral scale), **orange `#D97C20`** (warning/energy). Neutrals are a teal-tinted **ink** scale
  plus a warm **paper** cream. A clay-red `#CF4F2C` is _derived_ for danger only (not a brand
  color — flagged). See `tokens/colors.css`.
- **Glass (the signature)** — surfaces use `backdrop-filter: blur(18px) saturate(140%)`, a
  translucent white fill (`~7–13%`), a hairline border (`white @ 16%`), a crisp **top inner
  highlight** (`inset 0 1px 0`), and a soft diffuse drop shadow. Tinted variants wash the glass
  with a brand color. Utilities: `.glass`, `.glass-strong`, `.glass-weak`, `.glass-gold/-teal/-sage/-orange`.
- **Type** — **Ubuntu** for all UI/body (300/400/500/700); **Parisienne** for the display script
  accent; **Ubuntu Mono** for code/data. Scale is a 1.250 major-third on a 16px base.
- **Backgrounds** — never flat. Use `.tachyon-bg` (fixed multi-radial gradient). Imagery, when
  present, skews **cool and deep** (teal water, dark metal) with warm gold highlights.
- **Corners** — generous, glassy. Controls are mostly **pill** (`--radius-pill`) or `md`(14)/`lg`(20);
  cards `lg`(20)/`xl`(28); modals `xl`(28).
- **Shadows** — soft and diffuse (never hard/black). Elevation rises with blur + opacity. The
  `--shadow-glass` token bundles drop + top highlight + hairline.
- **Motion** — quick and eased-out (`--ease-out`, 120–220 ms). Switches/dialogs use a gentle
  spring (`--ease-spring`). Press states **shrink slightly** (`scale .985–.92`) and nudge down 1px.
  Dialogs fade + pop; toasts slide in. No infinite/decorative loops.
- **Hover** — surfaces brighten (fill opacity up) and borders strengthen; cards lift `-3px`;
  primary buttons lighten one gold step and grow their glow.
- **Focus** — always a 3px gold ring (`--focus-ring`), never removed.
- **Cards** — frosted fill + hairline border + top highlight + soft shadow + `lg`+ radius.
  Interactive cards add lift on hover. No colored-left-border cards.

---

## 4. Iconography

- **System:** [**Lucide**](https://lucide.dev) (`unpkg.com/lucide`) — clean 24×24, **2px** stroke,
  rounded caps/joins. This matches Tachyon's calm-engineer voice and the thin glass hairlines.
  _Lucide is a substitution_ — no proprietary icon set was supplied. Flag if the user has their own.
- **Usage:** stroke icons inherit `currentColor`; size 16 in buttons/fields, 18–20 in nav.
  In cards/components we mount via `<i data-lucide="name">` then `lucide.createIcons()`.
- **Status dots & accents** use solid semantic colors (see `Badge`, `Toast`, `Avatar`).
- **No emoji.** Unicode glyphs only inside mono data strings (e.g. `●` for status) where apt.
- **The emblem** (`assets/logo/`) is artwork, not an icon — never inline it as a UI glyph.

---

## 5. Logo & assets (`assets/logo/`)

Reconstructed two-tone artwork from `uploads/final.svg`. Each emblem ships as **SVG (scalable)**
and **PNG (1400px, reliable everywhere)**:

| File                | Use                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `emblem-primary`    | **Hero.** Gold circuit-creature + teal accents on a deep-ink coin. Works on any background. |
| `emblem-night`      | Gold on near-black coin — dark, restrained contexts.                                        |
| `emblem-cream`      | Deep-teal artwork on a cream coin — light surfaces.                                         |
| `emblem-ink-dark`   | Monochrome stamp (transparent field) for light backgrounds.                                 |
| `emblem-ink-light`  | Monochrome cream stamp for dark / glass backgrounds.                                        |
| `emblem-ink-gold`   | Monochrome gold stamp.                                                                      |
| `_source-final.svg` | Untouched master export (renders solid — kept for reference).                               |

Lockup: emblem + **Ubuntu** wordmark _"Tachy**on**"_ — `Tachy` in paper/ink, the **"on" lit gold**
(`--gold-400`), evoking _powered on / connected_. Optional Parisienne tagline (_"faster than the
metal"_). Keep the emblem inside its coin; never crop it.

> **Positioning note:** Tachyon is a **software-development** company built on **performance &
> speed** — fast stacks and code, close to the metal — _not_ a frontend/UI shop. The voice leans
> **performance / speed / UX / raw compute**, never "UI". The mascot **Volt** is separate from the
> brand name; don't merge them.

---

## 6. Index / manifest

**Root**

- `styles.css` — global entry point (import this). `@import`s only.
- `components.css` — component classes (states live here).
- `readme.md` — this guide. · `SKILL.md` — Agent-Skill wrapper.

**`tokens/`** — `fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `base.css`
(backdrop + glass utilities).

**`guidelines/`** — foundation specimen cards (Design System tab): colors, glass, type, spacing,
brand. Each is a tagged `.html`.

**`components/`** — React primitives (bundled into `_ds_bundle.js`; reach via
the compiled bundle's window namespace (resolve it dynamically, or read it from `_ds_manifest.json`)):

- `buttons/` — **Button**, **IconButton**
- `forms/` — **Input**, **Switch**
- `surfaces/` — **Card**, **Badge**, **Avatar**
- `navigation/` — **Tabs**
- `feedback/` — **Dialog**, **Toast**

**`ui_kits/console/`** — the Tachyon bare-metal **Console** product (full screens).

**`assets/logo/`** — emblem artwork (see §5).

---

## 7. Notes & substitutions

- **Fonts** load from Google Fonts via `@import` (the compiler reports 0 local font files because
  they're remote). To ship offline, drop `.woff2` files in `assets/fonts/` and replace the
  `@import` in `tokens/fonts.css` with `@font-face` rules.
- **Icons:** Lucide is a substitution for an unspecified icon set.
- **Danger red** is derived, not a brand color.
- **Brand name "Tachyon"** (wordmark lights the "on" gold) and **mascot name "Volt"** are both
  **confirmed** by the user. Tachyon = the company; Volt = the circuit-creature mascot — kept distinct.
- **Compiler namespace:** the generated bundle global is `window.CircuitaDesignSystem_12e0ad`, a
  frozen handle tied to this project's creation ID — it is _not_ brand text and never appears in any
  rendered design. Authored card scripts resolve it dynamically (`…DesignSystem_<hash>`), so no
  source file hardcodes it. It can't be renamed without recreating the project.
