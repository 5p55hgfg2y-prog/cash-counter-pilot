# Cash Counter / Kasseoptælling v10.0.0 — pilot

Offline-capable Danish cash-counting PWA for iPad and iPhone. Simple cash counting only; no POS connection.

## Changes from v9
- Removed the entire **Ind / ud** feature, its screen, and all movement-related JavaScript.
- Removed the navigation tabs to free vertical space.
- Preserved the Omnium-inspired layout, keypad, denomination selection, Next, and reset.
- Preserved cash totals, separate coins and notes subtotals, version display, and offline status.
- Kept the existing local-storage key so previously counted denomination quantities remain available after an update.
- Updated service-worker cache name to `dk-kasse-v10`.

## Deploy
1. Create branch `pilot-v10` from the latest `main`.
2. Upload all 9 unpacked files into the repository root on the new branch.
3. Commit changes, open Pull Request targeting `main`, review and squash-merge.
4. Wait for successful GitHub Pages action and verify the page shows `v10.0.0`.
5. Test notes/coins totals, keypad, Next, reset, offline access, and iPad/iPhone layout.

## Important notes
- Previous locally stored movement data is not displayed or used, but is not proactively deleted during the upgrade. Reset on a given day will clear that day's local data.
- Data is stored in browser `localStorage`, without backend, synchronization or audit trail.
- Use fictitious amounts only on publicly hosted GitHub Pages pilot.
- `Offline-klar` means service worker is ready, not proof that the device is on the newest release.
- The confirm button is a local acknowledgement, not a POS transaction or daily closing.
