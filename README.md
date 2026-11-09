# FundAfrica

A crowdfunding demo for community projects across Africa. Every campaign publishes a line-by-line budget; gifts fill those lines in order and milestones unlock as money arrives.

This is a portfolio project and runs with **no keys and no backend**:

- Campaigns, people, comments and gifts are sample data held in the browser (zustand with localStorage).
- Accounts are demo accounts (shared password `demo1234`, or create your own). Nothing leaves your browser.
- Checkout is a simulation. No payment provider is called and no money moves.
- "Reset demo data" in the footer restores the original sample data.

## Run it

```bash
npm install
npm run dev
```

No environment variables are needed.

```bash
npm run lint
npm test
npm run build
```

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS 4, zustand, Vitest.

## What you can try

Browse and filter campaigns, read a budget ledger and milestones, give through the simulated checkout, comment, start your own campaign, and view your profile and alerts.
