# Cash Counter PWA v2.4 — pilot

## Förändringar
- Den svarta bekräftelserutan efter **Start forfra** visas kort och döljs sedan helt (`hidden`), utan att lämna en synlig kant längst ned på iPad.
- Innehåller v2.3:s automatiska uppdateringskontroll: vid start, när appen får fokus och var 30:e minut online. Nästa service worker väntar på **Opdatér nu**.
- Samma danska valörer och kompakta iPad-layout som i v2.2. Versionsnummer `v2.4` och offlineindikator finns kvar.
- Samma `localStorage`-nyckel `cash-counter-v2_2` så befintliga provantal kan finnas kvar.

## Publicering
1. Skapa branch `pilot-v2-4` från `main`.
2. Ladda upp de **nio filerna inuti ZIP-filen** direkt i repositoryts rot.
3. Commit och Pull Request till `main`, kontrollera ändringarna och mergea.
4. GitHub Pages ska därefter visa `v2.4`. Ändra inte Web Clip-URL i Intune.

## Verifiera på iPad
- Öppna `v2.4`, testa valörer och totaler.
- Tryck **Start forfra**, godkänn och kontrollera att notisen försvinner helt efter cirka två sekunder, även efter att du scrollar.
- Kontrollera befintliga testantal, offline och återstart.
- Uppdateringsnotisen kan testas fullt ut när en **senare** version publiceras (v2.4 innehåller nu väntande-worker-flödet).

**Endast pilot med testbelopp.** Webbappen är inte integrerad med POS och saknar central datalagring.
