# Cash Counter PWA v2.6 – Pilot

## Ändringar jämfört med v2.5
- Sedlar först, fallande ordning: 500, 200, 100, 50 kr.
- Mynt därefter, fallande ordning: 20, 10, 5, 2, 1 kr och 50 øre.
- Kolumnrubriker: Valør / Antal / Beløb.
- Tab i valfritt Antal-fält flyttar till nästa Antal i räkningsordningen (Shift+Tab bakåt). Næste använder samma sekvens. På iPhone byts valörkategori automatiskt.
- Samma datalagringsnyckel `cash-counter-v2_2` och tidigare sparade antal ska behållas.
- Version v2.6; service worker cache `cash-counter-2-6`.
- Alla tidigare funktioner som offline, snabbtrycksskydd och uppdateringsnotiser kvar.

## Pilot och test
1. Skapa branch `pilot-v2-6` från `main` i GitHub.
2. Ladda upp ZIP-filens nio uppackade filer i repositoryts rot.
3. Commit, PR och Squash and merge till main.
4. Verifiera v2.6 på pilot-iPad: valörordning, totalsummor, Tab/Shift+Tab med externt tangentbord, Næste, plus/minus, offline och uppdateringsflöde.

Ingen POS-integration; använd endast testbelopp i GitHub Pages-piloten.
