# Kasseoptælling DKK – offline PWA

Proof-of-concept for a Danish retail POS iPad. No accounts, advertising, analytics, network calls, external libraries, location or camera permission.

## Features
- Danish valid banknotes: 500, 200, 100, 50 DKK. Coins: 20, 10, 5, 2, 1 DKK, 50 øre.
- Count notes/coins, register cash in/out with timestamps and reasons, enter opening float, calculate expected balance and cash difference, save a daily closing snapshot.
- Export UTF-8 BOM semicolon CSV (Danish/Excel-friendly) and JSON backup for the currently selected store/date.
- Local-only persistent browser storage, cached static assets for offline use.

## Pilot deployment
1. Publish the entire directory (including icons, manifest and service worker) at a stable HTTPS URL, e.g. `https://<internal-host>/kasse/` (HTTPS is required for PWA service workers except `localhost`). Do not open `index.html` via file://.
2. Open URL on pilot iPad using Safari, choose Share > Add to Home Screen. Launch from the icon, then disconnect Wi-Fi and test counting, entries, close and export.
3. For controlled distribution, pilot an Intune web clip (with full-screen settings as appropriate to enrollment type and iPadOS version). Validate whether installed web clip and offline storage persist as expected on the specific userless/supervised devices.
4. On every iPad, test restart, app/cache clearing, OS update, loss of connectivity and CSV export workflow before production.

## Data and limitations
- **Not a cash register/accounting system or an authoritative audit trail.** Data is only in browser localStorage on the local device, is editable, can be cleared by browser/site data deletion and is not automatically backed up or synchronized between iPads.
- A saved closing is a historical local snapshot, not a locked, tamper-proof accounting record. Deleting a movement does not alter previous snapshots.
- Enter cash sales as positive movements, cash withdrawals/refunds as negative movements. Physical denomination counts represent actual cash in drawer; they are **not** adjusted automatically when movements are recorded.
- `0` opening amount is the default until entered; distinguish from actually verified zero.
- Keep the kiosk OS/browser profile and Intune app/data lifecycle in mind. If production use requires immutable records, multi-device sync, user roles or POS integration, add server-side storage/authentication and proper retention policy.
- Note: DKK 1000 banknotes are no longer legal tender, nor are older banknote series. Reference: https://www.nationalbanken.dk/en/what-we-do/notes-and-coins/danish-banknotes-today

## Local smoke test
Run `python3 -m http.server 8000` in this folder, then open `http://localhost:8000` on the same computer. For an iPad use a real HTTPS host.

## License
Internal proof-of-concept; adjust and review before deployment.


## Version 2
- Export/backup buttons removed
- Store/cash register field hidden (legacy stored data remains scoped to its previous internal key)
- Separate notes and coins subtotals
- Offline cache version incremented to dk-kasse-v2

Note: Data is still stored only locally and may be lost if site data is cleared. Do not use this pilot as the sole cash audit record.
