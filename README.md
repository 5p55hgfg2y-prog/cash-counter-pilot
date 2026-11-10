# Cash Counter PWA v2.5 — pilot

## Förändringar
- Den svarta bekräftelserutan efter **Start forfra** visas kort och döljs sedan helt (`hidden`), utan att lämna en synlig kant längst ned på iPad.
- Innehåller v2.3:s automatiska uppdateringskontroll: vid start, när appen får fokus och var 30:e minut online. Nästa service worker väntar på **Opdatér nu**.
- Samma danska valörer och kompakta iPad-layout som i v2.2. Versionsnummer `v2.5` och offlineindikator finns kvar.
- Samma `localStorage`-nyckel `cash-counter-v2_2` så befintliga provantal kan finnas kvar.

## Publicering
1. Skapa branch `pilot-v2-5` från `main`.
2. Ladda upp de **nio filerna inuti ZIP-filen** direkt i repositoryts rot.
3. Commit och Pull Request till `main`, kontrollera ändringarna och mergea.
4. GitHub Pages ska därefter visa `v2.5`. Ändra inte Web Clip-URL i Intune.

## Verifiera på iPad
- Öppna `v2.5`, testa valörer och totaler.
- Tryck **Start forfra**, godkänn och kontrollera att notisen försvinner helt efter cirka två sekunder, även efter att du scrollar.
- Kontrollera befintliga testantal, offline och återstart.
- Uppdateringsnotisen kan testas fullt ut när en **senare** version publiceras (v2.5 innehåller nu väntande-worker-flödet).

**Endast pilot med testbelopp.** Webbappen är inte integrerad med POS och saknar central datalagring.

## v2.5 - förhindra dubbeltryckszoom
- `touch-action: manipulation` på touchytor och valörrader förhindrar dubbeltryckszoom i moderna Safari/iPadOS utan att stänga av pinch-zoom.
- `user-select: none` begränsas till knappar/tangentbord så antal-fälten fortfarande kan markeras och redigeras.
- Kontrollera på fysisk iPad: tryck 5–10 gånger snabbt på `+`, `−` och det numeriska tangentbordet. Appen ska inte zooma och varje tryck ska räknas exakt en gång.
- Uppdateringsflödet från v2.4 finns kvar; v2.5 är en bra testrelease för att verifiera uppdateringsmeddelandet på v2.4.
