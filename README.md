# DUNIZ Business Consultants — Official Website

An original, responsive consulting website for **DUNIZ — The Business Chanakya**, grounded in the provided DUNIZ corporate profile and Anupam Gupta personal brand blueprint.

## Site map

- `/` — company positioning, all seven advisory capabilities, engagement models, intervention sprints, founder profile, interactive Business Clarity Pulse, and contact.
- `/insights.html` — original three-part business insights journal.
- `/privacy.html` — contact and website privacy notice.
- `/assets/DUNIZ-Company-Profile.pdf` — downloadable official corporate profile.
- `/api/inquiry` — Vercel serverless enquiry endpoint (active after email configuration).

## Run locally

No frontend dependencies or build step are required. For static browsing, from this directory run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. The form will display an email fallback until the Vercel API is configured.

## Deploy on Vercel

1. Create a Vercel project and deploy this folder (preset **Other**, root `.`; no build command needed). Git-backed deployment is recommended for future content updates.
2. The static pages deploy without secrets. The contact function requires environment variables. Create a Resend account, verify a sending domain, and add the following values under Vercel Project Settings → Environment Variables:
   - `RESEND_API_KEY` — private API token.
   - `DUNIZ_FROM_EMAIL` — verified sender such as `DUNIZ Enquiries <enquiries@duniz.com>`.
   - `DUNIZ_INQUIRY_TO` — destination inbox, defaults to `anupam@duniz.com`.
3. Redeploy after setting environment variables; verify delivery end to end.
4. Add `duniz.com` and `www.duniz.com` under Vercel → Project → Settings → Domains. Prefer `www.duniz.com` as primary and set apex redirect. Change DNS at the domain's current DNS provider according to **the exact records Vercel reports** (typically apex A `76.76.21.21` and `www` CNAME `cname.vercel-dns.com`). Leave email MX, TXT (SPF/DKIM/DMARC) and other service records untouched.
5. Confirm ownership/domain verification and SSL in Vercel; test both apex and www and the contact form. Domain ownership and access are required.

## Editorial / operational notes

- The portfolio intentionally omits unverified success metrics, client logos, testimonials and any unannounced ventures. Add them only with verification and disclosure permission.
- Logo wordmark and tagline were preserved. A brighter color-corrected variant improves legibility on the dark navigation/background.
- Original supplied founder images are optimized to lightweight WebP.
- Dynamic features: service capability detail expansion, sprints tabs, five-question browser-only clarity pulse, mobile navigation, lead form and serverless email integration.
- The brand email and office location are taken from the DUNIZ corporate profile; verify email deliverability before launch.
- Content can be edited directly in `index.html`, `insights.html`, `script.js` and `styles.css`; the project is ready for later migration to a CMS if regular editorial updates become necessary.
