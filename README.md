# Meridian

One board for a single independent worker's money: every client project and your own life as peer
accounts, in EUR or AED.

`Meridian` is a working name — the product name is an open decision, recorded as such in
[PRODUCT.md](PRODUCT.md). Change it in `src/components/shell/sidebar.tsx`, `src/app/layout.tsx`, and
the per-route `metadata` titles.

## Running it

```bash
npm run dev
```

`npm run build` produces a static export in `out/`. The app is exported rather
than served by Node, so `npm start` does not apply — to preview the built output:

```bash
npx serve out
```

## Deployment

Pushing to `main` builds the export and publishes it to GitHub Pages via
[.github/workflows/deploy.yml](.github/workflows/deploy.yml). The site is served
from a sub-path, so the workflow sets `NEXT_PUBLIC_BASE_PATH=/DashBoard`. Rename
that value if the repository is ever renamed, or every asset will 404.

## What is real and what is not

**Every client, figure, transaction and rate in the app is invented.** The dataset lives in one file,
`src/lib/data.ts`, frozen to a fixed `AS_OF` date so the demo does not drift against a live clock.
Nothing connects to a bank. The app says so in the sidebar, on the connections page, and under the
flow bar — do not remove those notices while the data is still synthetic.

Rows marked **Synced** are demonstration data written into that file, not transactions fetched from
anywhere. Rows marked **By hand** are the same, except they model the manual-entry path.

To replace with real material:

- `src/lib/data.ts` — `ACCOUNTS`, `ENTRIES`, `UNATTRIBUTED`, `FX`, `AS_OF`
- the product name, wherever it appears (above)
- the brand mark in `src/components/icons.tsx` (`Mark`)

## Shape

- `/` — the board. The flow bar (income above the axis, spending below, net resolved at the right),
  the accounts grid, and the queue of movements with no home yet.
- `/projects` and `/projects/[id]` — the work, and each account's own ledger. `/projects/self` is
  your own account, in the same grammar as a client's.
- `/transactions` — the whole ledger. `/transactions/unattributed` — the triage queue at full width.
- `/settings` — display currency and the FX rate. `/settings/connections` — where movements come
  from.

## Decisions the code deliberately leaves open

The FX rate is passed explicitly into every `convert()` call rather than read from a module, so no
converted figure can outlive the rate that produced it. Whether that rate should come from a live
feed, a per-movement snapshot, or your own hand is not decided — see `/settings`. The same goes for
the bank aggregator, the backend, and the spending taxonomy. `PRODUCT.md` lists all of them.

## Design

The visual system is recorded in [DESIGN.md](DESIGN.md), derived from the built app rather than from
intentions. The direction this build was made against is an HTML comment at the top of `<body>` in
`src/app/layout.tsx`, and it survives the production build.

## Review tooling

`node scripts/screenshot.mjs http://localhost:3000` captures the desktop and mobile review set into
`.impeccable/review/`. It needs `puppeteer`, which is a devDependency for this purpose only.
