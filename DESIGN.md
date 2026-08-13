---
name: Meridian
description: A night workroom for one person's money — client projects and your own life as peer accounts under one mint instrument light.
colors:
  void: "#080a09"
  plate: "#101413"
  plate-2: "#161b19"
  plate-3: "#1c2321"
  rule: "#212927"
  rule-soft: "#171d1b"
  ink: "#e9f0ec"
  muted: "#93a19c"
  faint: "#7a8884"
  mint: "#2fe3a0"
  mint-1: "#5cf0bd"
  mint-2: "#2fe3a0"
  mint-3: "#22c489"
  mint-4: "#1aa373"
  mint-5: "#14835c"
  mint-deep: "#0d3d2c"
  rose: "#ff6178"
  rose-deep: "#45161f"
  amber: "#f5b341"
  amber-deep: "#3d2c0d"
typography:
  display:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "38px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum 1, ss01 1"
  headline:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontFeature: "tnum 1, ss01 1"
  title:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  subtitle:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  caption:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.14em"
  machine:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "10.5px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.01em"
rounded:
  hair: "1px"
  tick: "3px"
  chip: "5px"
  segment: "6px"
  control: "8px"
  plate: "14px"
  pill: "999px"
spacing:
  hair: "2px"
  xs: "6px"
  sm: "10px"
  md: "14px"
  gutter: "16px"
  stack: "20px"
  page: "28px"
components:
  button-primary:
    backgroundColor: "{colors.mint}"
    textColor: "#04150E"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "6px 14px"
  button-primary-hover:
    backgroundColor: "{colors.mint-1}"
  button-quiet:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.muted}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "6px 10px"
  button-quiet-hover:
    textColor: "{colors.ink}"
  segmented-track:
    backgroundColor: "{colors.plate}"
    rounded: "{rounded.control}"
    padding: "2px"
  segmented-item-active:
    backgroundColor: "{colors.plate-3}"
    textColor: "{colors.ink}"
    rounded: "{rounded.segment}"
    padding: "3px 8px"
  segmented-item-rest:
    textColor: "{colors.faint}"
    rounded: "{rounded.segment}"
    padding: "3px 8px"
  card-plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "16px"
  card-plate-hover:
    backgroundColor: "{colors.plate-2}"
  card-open:
    textColor: "{colors.ink}"
    padding: "0 0 14px 12px"
  input-field:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "6px 10px"
  chip-neutral:
    textColor: "{colors.faint}"
    rounded: "{rounded.chip}"
    padding: "1px 6px"
  chip-mint:
    backgroundColor: "{colors.mint-deep}"
    textColor: "{colors.mint}"
    rounded: "{rounded.chip}"
    padding: "1px 6px"
  chip-amber:
    backgroundColor: "{colors.amber-deep}"
    textColor: "{colors.amber}"
    rounded: "{rounded.chip}"
    padding: "1px 6px"
  chip-rose:
    backgroundColor: "{colors.rose-deep}"
    textColor: "{colors.rose}"
    rounded: "{rounded.chip}"
    padding: "1px 6px"
  nav-item-rest:
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "7px 8px"
  nav-item-active:
    backgroundColor: "{colors.mint-deep}"
    textColor: "{colors.mint}"
    rounded: "{rounded.control}"
    padding: "7px 8px"
---

# Design System: Meridian

## Overview

**Creative North Star: "The Night Workroom"**

Meridian is a dark room with one instrument lit. The ground is near-black with a cool green cast, so the single mint accent reads as emitted light rather than as a sticker pressed onto a grey UI. Everything else — plates, rules, labels — is a quiet neutral built from that same green-cast dark, which is why a mint bar or an amber badge can be small and still be the loudest thing on screen.

The system is dense and unceremonious. It is built for one person who already knows their own business, so there is no reassurance chrome: no hero, no empty-state illustration, no explanatory card stack. Surfaces are hairline plates on the ground, figures are large and tabular, and secondary text sits three tiers down in a muted ramp rather than in a box. Density is the courtesy.

Its refusal is the KPI dashboard. There are no metric tiles, no smooth area curves, no donut of categories, no arbitrary gauge. Money is drawn as discrete events on a shared scale — ticks and bands against one axis — because it arrives in lumps and a curve would invent continuity the data does not have. Where a figure is derived (a conversion through an FX rate), its provenance is rendered adjacent to it, not in a tooltip.

**Key Characteristics:**
- Near-black green-cast ground; a five-step mint ramp as the only identity system.
- Hairline 1px plates at 14px radius, no shadows for depth.
- Two label voices only: 10px tracked uppercase eyelines, and sentence-case body.
- Every figure is tabular; every converted figure carries its provenance.
- One authored motion moment ("the settle"), replayed only when numbers genuinely recompute.

## Colors

A near-black green-cast neutral field carrying exactly three signal hues, one of which is also the identity ramp.

### Primary
- **Instrument Mint** (`{colors.mint}`): Income, positive state, active navigation, focus rings, the caret, the check on a cleared queue, the primary button fill. Used at small area on any screen; its rarity is what makes an income bar read as light.
- **Mint Ramp, steps 1–5** (`{colors.mint-1}` … `{colors.mint-5}`): Per-account identity. An account's `hue` field indexes this ramp through `HUE_VAR`; the same step fills its flow-bar band, its tick strip, and its progress sweep so the account is recognisable across three different instruments without a legend.
- **Mint Deep** (`{colors.mint-deep}`): The only mint-tinted *background*. Active nav item, mint chip fill, mint card hover border. Never used for text.

### Secondary
- **Outflow Rose** (`{colors.rose}`): Everything that leaves — the below-axis band, the Personal account's figure, negative ledger amounts, invalid field borders, the "You" status dot. Category identity within spending is generated as a stepped mix of this one hue (`catFill`), never a second hue.
- **Rose Deep** (`{colors.rose-deep}`): Background and border for rose chips and the Personal card's hover border.

### Tertiary
- **Unfinished Amber** (`{colors.amber}`): Business that is not settled — the unattributed count badge, "No home yet" in the ledger, the "Wrapping up" status, the demo-data disclosure dot. Amber never means error and never means outflow; it means *not yet resolved*.
- **Amber Deep** (`{colors.amber-deep}`): Badge and chip background under amber text.

### Neutral
- **Workroom Void** (`{colors.void}`): The ground. Page background, sidebar, mobile bars, and the browser's own `color-scheme: dark`.
- **Plate** / **Plate 2** / **Plate 3** (`{colors.plate}`, `{colors.plate-2}`, `{colors.plate-3}`): The three-step surface ramp. Plate is every card, panel and field at rest; Plate 2 is hover on a card or a table row; Plate 3 is the selected segment of a control and the hover border on a field.
- **Rule** (`{colors.rule}`) and **Rule Soft** (`{colors.rule-soft}`): The two hairline weights. Rule draws the outer edge of a plate, the axis, and structural dividers between regions; Rule Soft draws internal dividers *inside* a plate — table rows, card footers, panel headers.
- **Ink / Muted / Faint** (`{colors.ink}`, `{colors.muted}`, `{colors.faint}`): The three text tiers. Ink for figures and names, Muted for supporting facts a user reads, Faint for labels, dates, and anything that exists to be scanned past.

### Named Rules

**The One Accent Rule.** Mint is the only accent. Rose and amber are semantics — outflow and unfinished — not palette slots. Any new identity dimension (an account, a spending category, a project) is expressed as a *step along an existing ramp*: `HUE_VAR` for accounts, `catFill` for categories. Adding a fourth hue is the single fastest way to break this world.

**The Deep-Variant Rule.** A signal hue is never used as a large fill. When mint, rose, or amber needs to back a surface, it uses its `-deep` variant (`{colors.mint-deep}`, `{colors.rose-deep}`, `{colors.amber-deep}`) with the bright hue as the foreground on top.

**The Ground Owns the Browser Rule.** Selection, caret, scrollbar track and thumb, and the focus outline are all themed from the palette. A default blue selection or a light scrollbar breaks the room.

## Typography

**Display Font:** Geist Sans (with system-ui, sans-serif)
**Body Font:** Geist Sans (with system-ui, sans-serif)
**Label/Mono Font:** Geist Mono (with ui-monospace, monospace)

**Character:** One neutral grotesque doing everything, tightened as it grows — display and headline figures carry negative tracking (−0.03em / −0.025em) so a large number reads as a single object rather than a row of digits. The mono is not a costume; it appears only where the text is literally machine output.

### Hierarchy
- **Display** (600, 38px, 1, −0.03em): The resolved net figure at the right end of the flow bar. One per screen at most.
- **Headline** (600, 26px, 1, −0.025em): The single earned/spent figure on an account card.
- **Title** (600, 17px, −0.015em): Page title in the header bar.
- **Subtitle** (600, 13.5px, −0.01em): Section headings inside a plate ("Flow", "No home yet") and sidebar nav items.
- **Body** (400, 12.5px, 1.55): Controls, field text, table cells, buttons.
- **Caption** (400, 11.5px, 1.5): Supporting lines under a figure, status labels, disclosures, footer sums.
- **Label / Eyeline** (500, 10px, 0.14em, uppercase, `{colors.faint}`): Column headers, nav group headers, the "Net · Last 6 months" line above the display figure.
- **Machine** (Geist Mono, 400, 10.5–11px, −0.01em): Bank counterparty strings and reference memos only.

### Named Rules

**The Two Voices Rule.** There are exactly two label voices: the 10px tracked uppercase `eyeline`, and sentence-case body. No small-caps, no title-case headings, no third tracked size.

**The Eyeline Is A Header, Not A Kicker Rule.** The eyeline labels a *region or column* — a table header, a nav group, the readout it sits above. It is never used as an eyebrow or kicker stacked above a headline to dress it up. If removing the eyeline would lose no information, remove it.

**The Tabular Rule.** Every number on every surface carries `tnum` (`font-variant-numeric: tabular-nums` plus `ss01`). Figures in a column must align on the digit; a figure that shifts when it updates is a bug.

**The Machine Text Rule.** Geist Mono is only ever used for strings a machine produced — bank counterparty text, reference memos. Never for dates, amounts, IDs shown to a person, or as a "technical" flavour on body copy.

## Layout

A fixed left rail and a fluid work area. At `lg` and up, a 236px sticky full-viewport-height sidebar (`{colors.void}`, right hairline in `{colors.rule}`) holds the wordmark in a 62px band that lines up exactly with the page header's 62px height, grouped nav under eyeline labels, and the synthetic-data disclosure pinned to the bottom. Below `lg` the rail is replaced by a 54px sticky top bar and a fixed five-column bottom tab bar, both `{colors.void}` at 95% with a backdrop blur; `main` carries 76px of bottom padding so the last row clears the tabs.

Page content is padded on a three-step responsive rhythm: 16px on mobile, 20px at `sm`, 28px at `xl`. Major sections stack at 20px; card grids sit at 16px. Plates pad internally at 16px, dense panels at 14px, and header/footer strips at 10–12px vertical against the section's own horizontal padding.

The board's spine is a full-width instrument, then a two-column split at `xl`: fluid account grid on the left, a fixed 324px sticky queue column on the right. The account grid is one column, two at `sm`, three at `2xl`. Inside the flow bar the readout detaches to a fixed 248px right-hand panel at `md` and stacks below the columns under it.

The ledger changes form rather than scrolling: at `md` and up it is a table with a 680px honest minimum width; below that the same rows render as a stacked list, because horizontally scrolling the money columns off-screen defeats the one thing the screen exists to show.

### Named Rules

**The Peer Cell Rule.** The Personal account occupies the same grid cell, footprint, and internal order as every client account. Anything that would summarise "you" in a wide panel under the grid re-creates the hierarchy the board exists to refuse.

**The Change Form, Don't Shrink Rule.** When a dense layout hits its honest minimum, swap the arrangement (table → stacked rows, row → column) rather than compressing columns or enabling a horizontal scroll on the primary figures.

## Elevation & Depth

There are no elevation shadows. Depth is tonal and linear: a three-step surface ramp (`{colors.plate}` → `{colors.plate-2}` → `{colors.plate-3}`) over the void ground, with two hairline weights doing all the edge work. A plate is legible as a surface because of a 1px `{colors.rule}` border, not because it floats.

The one box-shadow in the system is not elevation. The active item in a segmented control carries a 1px seat shadow (`0 1px 2px rgba(0,0,0,0.45)`) so the pressed segment reads as recessed into its track. Stacked category bands use an inset 1px ground-coloured rule (`inset 1px 0 0 var(--color-plate)`) as a separator, not a shadow.

### Named Rules

**The No-Float Rule.** Nothing casts a shadow to indicate height. Hover raises tone and border, never `translateY` plus a shadow. If a surface needs to feel closer, move it up the plate ramp.

**The Two Hairlines Rule.** `{colors.rule}` for the outer edge of a plate, the flow-bar axis, and the boundary between regions; `{colors.rule-soft}` for every divider *inside* a plate. Mixing them flattens the structure that tells a user where one surface ends.

## Shapes

Soft-rectangular throughout, on a small, disciplined radius ladder: 14px for a plate, 8px for a control (button, field, select, nav item, segmented track), 6px for a segment inside that track, 5px for a chip, 3px on the focus ring and the top cap of a bar, 1–2px on the interior segments of a stacked bar, and full pills (999px) only for count badges, status dots, and progress tracks. Bars and ticks are capped only on their outer end — the top of a rising income segment, the bottom of a falling spend band — so the axis edge stays square and the axis stays readable as a line.

Icons are an authored set on one geometry: a 20-unit box, 1.5 stroke, round caps and joins, 1.5 corner radius. The stroke weight is chosen to agree with the 1px hairlines at typical 15–19px render sizes. The brand mark is the only place a gradient appears (`#5CF0BD` → `#17B589` on a 28-unit rounded square) and it takes a per-instance `id`, because two identical SVG gradient ids in one document blank the second mark.

### Named Rules

**The Plate/Open-Frame Rule.** A closed plate — background, full 1px border, 14px radius — means *this is an account*. Anything that is not yet an account (a queued transaction, the "Log an entry" tile) is drawn as an unclosed frame: `border-b` and `border-l` only, open at top and right, sitting directly on the ground with no fill. Attributing the item is what closes it. This distinction is structural and must not be used decoratively.

**The Authored Icon Rule.** Icons are drawn for this world at 20/1.5/round. No icon library, no glyph or emoji standing in for an icon, no mixed stroke weights.

## Components

### Buttons
- **Shape:** Softly rounded (8px); no radius above 8px on any control.
- **Primary:** Mint fill with near-black green text (`#04150E`) at 6px/14px padding, 12.5px semibold. Hover lifts the fill to `{colors.mint-1}`. Exactly one primary action per surface.
- **Quiet (default):** Plate fill, 1px `{colors.rule}` border, `{colors.muted}` text. Hover moves the border to `{colors.plate-3}` and the text to `{colors.ink}` — no fill change.
- **Text:** `{colors.faint}` with a `{colors.rule}` underline at 3px offset; hover moves text to ink and the underline to `{colors.faint}`.
- **Focus:** Global — 2px mint outline at 2px offset, 3px radius. Never removed, never restyled per component.

### Chips
- **Style:** 10.5px medium, 0.04em tracking, tabular, 5px radius, 1px border, 1px/6px padding.
- **Tones:** Neutral (rule border, faint text) carries currency codes; mint, amber and rose use their `-deep` variant at 60% as fill with the bright hue as text.

### Cards / Containers
- **Corner Style:** 14px (the `plate` utility).
- **Background / Border:** `{colors.plate}` with a 1px `{colors.rule}` edge.
- **Shadow Strategy:** None; see Elevation & Depth.
- **Hover:** Border moves to `{colors.plate-3}` (or the account's `-deep` tone for the Personal card) and background to `{colors.plate-2}`, transitioning opacity, border-color and background-color over 200ms. Focus-visible produces the same border shift.
- **Internal Padding:** 16px standard, 14px for dense forms.
- **Interior dividers:** `{colors.rule-soft}`, with the `hair-t` utility for a footer strip.

### Inputs / Fields
- **Style:** Plate fill, 1px `{colors.rule}`, 8px radius, 6px/10px padding, 12.5px ink text, faint placeholder, mint caret.
- **Hover:** Border to `{colors.plate-3}`.
- **Focus:** Border to `{colors.mint-4}` under the global mint focus ring. Search fields widen on focus (172→212px, 168→220px) rather than opening a panel.
- **Error:** Border to `{colors.rose}`, with a rose 12px message in a live region beneath; the message names the offending input and says what a valid value looks like.
- **Selects:** Native `select` with `appearance: none`, right padding for an authored chevron positioned absolutely and made pointer-transparent.

### Navigation
- **Rail:** Nav items are 13.5px, 8px radius, 7px/8px padding, `{colors.muted}` at rest with a 150ms colour transition; hover fills `{colors.plate}` and lifts text to ink. The active item is `{colors.mint-deep}` fill with mint text and carries `aria-current="page"`. Groups sit under eyeline labels with 24px between groups.
- **Badges:** Amber-deep pill with amber tabular text, inline at the end of the nav item.
- **Mobile:** Five equal columns, icon over 10.5px label, mint when active and faint otherwise; the badge becomes a solid amber dot-pill with void-coloured text pinned to the icon's top-right.

### Segmented Control
The system's only mode switch — period, direction, display currency. A plate track with a 1px rule border, 8px radius and 2px inner padding; each option is a 6px-radius button, faint at rest, hover to muted, and when active a `{colors.plate-3}` seat with ink text and the 1px seat shadow. Rendered as a `radiogroup` with `aria-checked`. Two sizes only (11.5px and 12.5px).

### Flow Bar (signature)
The instrument every other surface is read against. One axis line in `{colors.rule}`; income rises above it as per-account bands on the mint ramp, stacked ascending so the account carrying the month sits on the axis; spending falls below it as a single rose band. Both regions share one per-unit scale derived from the peak income month, and the below-axis region is sized from the worst month at that same scale — nothing is clamped or normalised independently. Each band is a real button, so hovering or tabbing to it sets the shared focus id and dims every other account to 0.16 opacity while lighting that account's card on the board; the relationship runs both ways. The readout detaches at the right: eyeline, the 38px net, then In/Out in mint and rose. A hairline footer states the rate, whether it was entered by hand or edited, and the date it was set.

### Tick Strip (signature)
Per-account and per-category history inside a card: one tick per month on a `{colors.rule}` baseline, filled with the account's mint step or with rose, at 28px tall. Months with no money are still drawn, as a 3px `{colors.rule}` stub, so a gap is visible as a gap rather than closed up. Never a smooth curve — income lands in lumps.

### Named Rules

**The Shared Scale Rule.** Income and spending are drawn on one per-unit scale, always. No dual axes, no independent normalisation, no clamping, no truncated bar. A money bar that has been cut to fit lies.

**The Draw The Gap Rule.** An empty period is rendered at its position as a minimum-height neutral stub. Never omit an empty bucket and never let the series close over it.

**The Settle Rule.** One authored motion moment. Figures, bands and ticks arrive from a compressed state (`settle-in` at 620ms, `rise-bar` at 700ms, `sweep` at 760ms, all on `--ease-settle` = `cubic-bezier(0.16, 1, 0.3, 1)`), staggered by index at 18–55ms. It plays on mount and replays only when the numbers are genuinely recomputed — a currency switch or an FX-rate edit — keyed on `settleKey`. Motion is not decoration and is not attached to hover; hover changes colour and opacity only, over 150–200ms. Under `prefers-reduced-motion` all animation and transition durations collapse to 1ms.

**The Provenance Adjacency Rule.** A converted figure never appears without its origin nearby: the native amount labelled "as it landed", an "As landed" column beside the display column, and the rate with the date it was set and whether it was entered by hand. The provenance is rendered text, never a tooltip.

## Do's and Don'ts

### Do:
- **Do** express any new identity dimension as a step on an existing ramp — `HUE_VAR` for accounts, `catFill` for categories — and keep mint as the only accent.
- **Do** back signal colour with its `-deep` variant when a surface needs a fill, keeping the bright hue for foreground only.
- **Do** give a closed plate (14px radius, 1px `{colors.rule}`) to accounts, and the open frame (`border-b border-l`, no fill) to anything not yet attributed.
- **Do** put `tnum` on every figure, and tighten tracking as type grows (−0.01em at 14px through −0.03em at 38px).
- **Do** draw money as discrete events on one shared scale, with empty periods still rendered.
- **Do** keep a converted figure adjacent to its native amount and the rate's stated provenance.
- **Do** use `{colors.rule}` for a plate's outer edge and `{colors.rule-soft}` for dividers inside it.
- **Do** reserve Geist Mono for bank counterparty strings and reference memos.
- **Do** change layout form at the breakpoint (table to stacked rows) instead of compressing or side-scrolling primary figures.
- **Do** keep the global mint focus ring (2px, 2px offset) on every interactive element, including chart bands.

### Don't:
- **Don't** introduce a fourth hue, a categorical colour set, or a chart palette. Accounts and categories ride the ramps.
- **Don't** use mint, rose, or amber as a large flat fill or as body text colour.
- **Don't** add elevation shadows, hover lift, or a glass/blur panel treatment; depth is tonal and hairline. (The two exceptions are the segmented control's 1px seat shadow and the nav bars' backdrop blur over `{colors.void}`.)
- **Don't** draw income as a smooth area or line, use a donut or pie for categories, add a second axis, or clamp a bar to fit.
- **Don't** build a KPI tile row, a metric card grid, or a wide summary panel that ranks "you" below the client accounts.
- **Don't** use the eyeline as a kicker or eyebrow above a headline; it labels regions and columns only.
- **Don't** set body copy, dates, or human-facing amounts in mono, and don't use small-caps or a third tracked label size.
- **Don't** use icon-library, glyph, or emoji icons; draw to the 20-unit / 1.5-stroke / round-cap geometry.
- **Don't** render the same `Mark` gradient `id` twice in one document — the second instance renders empty.
- **Don't** attach the settle animations to hover or scroll, or replay them on a filter change; they belong to a genuine recomputation.
- **Don't** show a converted amount, a projection, or any FX-derived figure without its provenance in rendered text beside it.
- **Don't** write "invoice", "invoiced", or "billed" on any surface. Money *lands*; the native figure is "as it landed".
