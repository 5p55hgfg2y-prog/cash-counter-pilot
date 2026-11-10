# Kasseoptælling v2.2

PWA for enkel optælling af sedler og mønter.

## Funktioner
- Omnium-inspireret optællingslayout
- Offline-støtte
- Versionsvisning i appen
- Lokal lagring på enheden
- Ingen POS-integration
- Ingen ind/ud-funktion

## v2.2 layout
- Compact landscape layout on iPad (at least 900 CSS pixels wide)
- All denominations intended to fit on a typical landscape iPad without full-page scrolling
- Independent denomination-list scrolling is used when the viewport is too short
- iPhone styling unchanged
- Offline cache version: cash-counter-2-2

- Uses valid Danish denominations: coins 50 øre, 1, 2, 5, 10, 20 kr; notes 50, 100, 200, 500 kr.
- New local storage key for pilot v2.2 because denominations were corrected; earlier pilot counts are not imported.
