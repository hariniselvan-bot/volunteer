# Stackly — Volunteer Organization

A premium, fully responsive website for **Stackly Volunteer Organization** —
"Stronger Communities, Brighter Tomorrows."

Built with **HTML5 + CSS3 + pure Vanilla JavaScript**, enhanced with
**GSAP / ScrollTrigger** and **AOS** (CDN). No frameworks, no build step.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, partners marquee, about, programs, why, steps, causes, impact, stories slider, events, ways to support, FAQ, final CTA |
| `about.html` | Story, mission, vision, values, community, impact, team |
| `service.html` | All nine volunteer programs with impact stats and roles |
| `blog.html` | Stackly Stories — search, category filters, load more |
| `contact.html` | Contact cards + validated form with animated success state |
| `login.html` | Split-screen sign in with User/Admin role selection |
| `register.html` | Registration with password strength + match validation |
| `dashboard.html` | Volunteer dashboard (hours, programs, events, certificates, messages, profile) |
| `seller-dashboard.html` | Organization admin dashboard (volunteers, applications, donations, canvas charts) |
| `404.html` | Animated not-found page (`Go Back` uses `window.history.back()`) |

## Demo authentication (frontend only)

- Register stores the profile in `localStorage` (`stacklyUser`).
- Login creates a session (`stacklySession`) and redirects:
  - **User** → `dashboard.html`
  - **Admin** → `seller-dashboard.html`
- Dashboards read the session (name, email, role) and redirect to
  `login.html` when signed out. **Logout** clears the session.
- First visit with no account? Signing in with any valid email creates a
  demo profile on the fly.

## Structure

```
assets/
  css/  style.css · responsive.css · animations.css · auth.css · dashboard.css
  js/   main.js · navigation.js · animations.js · slider.js · forms.js · auth.js · dashboard.js
  img/  hero/ about/ programs/ blog/ team/ events/ impact/ dashboard/
  svg/  stackly-logo.svg · stackly-symbol.svg · stackly-wordmark.svg · icons.svg · decorative.svg · …
```

## Notes

- Colors: forest `#102B22`, deep `#173D2F`, lime `#C9F45A`, light lime `#DFFF91`, background `#F7F8F3`.
- Fonts: Manrope (sans) + Playfair Display italic (accent) via Google Fonts.
- Respects `prefers-reduced-motion`; custom cursor is desktop-only.
- Photography: key visuals generated in-house; card imagery from Unsplash CDN.
