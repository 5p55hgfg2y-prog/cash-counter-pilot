# Kasseoptælling — Security-hardened pilot v6

Static, offline-capable Danish cash-counting PWA. No authentication, analytics, trackers, external JS/CSS, third-party libraries or remote API calls.

## Features
- Danish notes (500, 200, 100, 50 kr) and coins (20, 10, 5, 2, 1 kr and 50 øre)
- Separate totals for notes and coins; combined total
- Register cash movements (in/out) with reason, optional note, and time
- Reset **all current-day data** (counts and movements) after confirmation
- Choose date. Data remains local to the individual browser/web-app installation
- No export, no saved day-close screen, no store/cash-register input

## Security changes in v6
- HTML Content Security Policy (CSP) via a meta tag: same-origin scripts, styles, workers, and connections only; blocks object embeds and form submissions
- DOM nodes for denomination rows constructed using createElement and textContent (no innerHTML)
- Service worker uses network-first for freshness with offline cached fallback and only removes its own old cache versions
- Checks for a new service worker when app returns to foreground online
- Same localStorage key and date/store keying as v1-v5 to avoid unexpected data migration or deletion

## Publish to GitHub Pages
1. Unzip and upload all files directly to repository root (not the enclosing folder).
2. Commit using a branch + Pull Request if main branch rulesets require it.
3. Verify GitHub Actions pages deployment, then open HTTPS Pages URL.
4. With internet, perform tests and verify totals; reload once after update; switch to airplane mode to confirm offline behavior.
5. Test in Safari and the actual Intune Web Clip independently; storage and multitasking can differ.

## Critical limitations
- **Development / test only.** Not a POS or accounting system. No tamper-evident audit trail, backend, user roles, central backup or synchronization.
- localStorage contains unencrypted-at-application-layer data and can be cleared by device/browser policy. No sensitive data or real register records in this public pilot.
- Any author able to modify the published repository can replace served code. Protect GitHub account, main branch and repository write access.
- CSP in a meta tag cannot set `frame-ancestors`. On a separately controlled production host, also send a CSP response header and appropriate security headers.
- Service worker updates and browser cache require device validation; do not assume cached data will always be retained by iOS.

## Developer smoke test
From the folder run `python3 -m http.server 8000` and open `http://localhost:8000` on the same computer. iOS devices need HTTPS hosting for service workers.
