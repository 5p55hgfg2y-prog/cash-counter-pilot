# Cash Counter / Kasseoptælling v9.0.0 — pilot

Offline-ready Danish cash-counting PWA for iPad and iPhone. Interface borrows general workflow ideas from POS counting screens, without copying the vendor's design or source.

## Features
- iPad landscape: coins and notes on the left, numeric keypad and live totals on the right
- iPhone: compact one-category-at-a-time denomination list and numeric keypad; some scrolling may still occur
- Select denomination, enter quantity with keypad, increment/decrement with buttons, Next advances to next denomination
- Notes and coins subtotals, combined total, cash movements (in/out)
- Start forfra resets current date's saved counts and movements after confirmation
- Confirm count only shows a local confirmation; **it does not close or submit a POS settlement**
- Header shows the **running JavaScript version** and offline-ready status
- No external dependencies, trackers, login, API calls, or export

## Deploy
1. Create a new branch `pilot-v9` from current `main`.
2. Upload all 9 extracted files to the repository root of that branch.
3. Commit and open a Pull Request to `main`.
4. Review changes, Squash and merge to publish GitHub Pages.
5. Verify version v9.0.0, test offline, check totals, movement registration, reset, and iPad/iPhone layout.

## Data and security notes
- Data remains in `localStorage` using previous `dk-cash-count-v1` key for compatibility. Upgrades should not intentionally clear local cash counts.
- No back-end storage, backup, audit trail or synchronization. Use fictional data only in this public pilot.
- Content Security Policy blocks scripts and resources from other origins; code uses safe DOM creation/textContent.
- App offline status denotes service worker readiness, **not** proof that a newer app version is not available.
- Quantity input is read-only, so users use in-app keypad; this avoids the iOS virtual keyboard obscuring the counting UI.
