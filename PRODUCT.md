# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (user's choice). Nothing is scaffolded yet — this is a greenfield project directory.

## Users

One person, using this for themselves. They earn income through client projects and manage their own spending against it. There is no team, no accountant, and no second role; every screen is for the owner of the money.

They operate across two currency contexts — EUR and AED — which means their financial picture is never expressible in a single native currency.

## Product Purpose

One place that answers, for a single independent worker: what is coming in, what is going out, and which projects are producing the income.

Personal-finance tools treat income as a flat inbound stream and have no concept of the work that produced it. Project tools track the work and ignore the money. This product refuses that split: a project is both a unit of work and the origin of specific income entries, and the two views are the same data.

Success is that the user can open it and know where they stand — across both currencies, across active projects — without reconciling anything by hand.

## Positioning

Income is attributed to projects, not to categories. Every income entry belongs to the client project that generated it, so "how is this project doing" and "how am I doing" are answered from one ledger rather than two systems that must be kept in sync.

## Operating Context

- The user works on client projects that earn money; projects are the income-producing unit.
- Money moves in two currencies, EUR and AED, and a conversion rate mediates between them.
- Financial data arrives two ways: **manual entry** by the user, and **bank API integration** that syncs transactions automatically. Both are in scope — neither is a fallback for the other.
- Usage is personal and recurring rather than periodic and formal: this is checked, not audited.

## Capabilities and Constraints

**Confirmed:**

- Income entries are recorded against projects. Projects earn; income does not float free of them.
- Spending is tracked alongside income for the personal financial picture.
- Project management is in scope as a first-class side of the product, not a tag on a transaction.
- Multi-currency: EUR and AED, with a conversion rate between them.
- Display currency is **switchable** — the user picks which currency totals and reports roll up into, and everything reconverts. Neither currency is privileged as the permanent home currency.
- No invoicing. There is no invoice object, no sent/paid/outstanding status, and no document generation. Income is logged when it lands.
- Interface language is English.

**Explicitly undecided — do not invent:**

- Product name. The directory is named `Budgetting`; that is a folder, not a confirmed name.
- Bank API provider. EUR and AED coverage differ substantially between aggregators, and no provider has been chosen. The integration is confirmed in scope; its vendor is not.
- FX rate source — live rate feed, periodic snapshot, or a rate the user sets manually. Rate provenance affects whether historical totals are stable, and has not been decided.
- Persistence and hosting. Bank API sync implies a real backend and stored credentials, but no database, auth model, or deploy target has been chosen.
- Spending taxonomy — categories, envelopes, or free tagging.
- Whether project management includes tasks, milestones, time tracking, or only project-level status.

## Evidence on Hand

None. There are no real transactions, no client names, no project history, no logo, no brand assets, and no existing copy in this project — the directory is empty.

Future work must not fabricate client names, revenue figures, testimonials, pricing, or usage statistics. Placeholder data must read as placeholder, and any number shown in a mock is illustrative until real data exists.

## Product Principles

1. **A project is the unit of income.** Any view of money should be able to answer which project it came from, and any view of a project should be able to answer what it earned.
2. **Two currencies, one truth.** The user's position is never a single native number. Original currency stays visible on every entry; the roll-up currency is a display choice, not a rewrite of the record.
3. **Manual entry is a first-class path, not a degraded one.** Bank sync will never cover everything — cash, foreign accounts, corrections — so entering something by hand must be fast enough to do without resentment.
4. **Built for one person who already knows their own business.** No onboarding ceremony, no explanatory hand-holding, no approval flows. Density and speed over reassurance.
5. **Do not imply certainty the data does not have.** Converted amounts, projections, and anything derived from an FX rate must be legible as derived.
