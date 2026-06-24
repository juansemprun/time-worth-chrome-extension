# TimeWorth Publication Checklist

Use this checklist before submitting TimeWorth to the Chrome Web Store.

## Required before submission

- [x] Replace `[your contact email]` in the privacy policy.
- [ ] Review the privacy policy for your jurisdiction and Chrome Web Store requirements.
- [x] Create final extension icons in the required Chrome Web Store sizes.
- [ ] Create screenshots that show the popup and Amazon price badge.
- [ ] Confirm the store listing short description, long description, category, and privacy wording.
- [ ] Confirm there are no third-party font/resource requests before packaging, or update the privacy policy accordingly.
- [ ] Complete the Chrome Web Store privacy declarations accurately.
- [ ] Run the manual QA checklist below.
- [ ] Package a clean ZIP for upload.

## Clean ZIP contents checklist

Include only files needed by the extension at runtime:

- [ ] `manifest.json`
- [ ] `popup.html`
- [ ] `popup.css`
- [ ] `popup.js`
- [ ] `content.js`
- [ ] `timeworth-calculations.js`
- [ ] `timeworth-i18n.js`
- [ ] Final icon files referenced by `manifest.json`, if added

Do not include development-only or publication-only files in the upload ZIP:

- [ ] Exclude `docs/`
- [x] Exclude `openspec/`
- [x] Exclude `.atl/`
- [ ] Exclude `.git/` and Git metadata
- [ ] Exclude local notes, screenshots drafts, and unused assets

## Manual QA checklist

### Popup settings

- [ ] Open the extension popup successfully.
- [ ] Confirm the popup displays in English when the browser language is English.
- [ ] Confirm the popup displays in Spanish when the browser language is Spanish.
- [ ] Change currency and confirm the hourly-rate preview updates.
- [ ] Enter annual salary, salary amount, and weekly hours, then save.
- [ ] Enter monthly salary, salary amount, and weekly hours, then save.
- [ ] Confirm validation prevents invalid salary amounts.
- [ ] Confirm validation prevents weekly hours outside the allowed range.

### Amazon badge behavior

- [ ] Open a supported Amazon domain from `manifest.json`.
- [ ] Confirm a TimeWorth badge appears near supported product prices.
- [ ] Confirm the badge shows an estimated working-time value.
- [ ] Confirm the badge tooltip reflects the saved settings.
- [ ] Change settings in the popup and confirm badges update without a full extension reinstall.
- [ ] Check at least one Amazon domain that uses comma decimal formatting, if available.

### Storage and privacy expectations

- [ ] Confirm settings persist after closing and reopening the popup.
- [ ] Confirm settings are stored through Chrome extension storage.
- [ ] Confirm the extension requests only the `storage` permission plus the Amazon host matches declared in `manifest.json`.
- [ ] Confirm no analytics, tracking, or external network requests are expected from TimeWorth.
- [ ] Confirm the popup does not request Google Fonts or other third-party resources in the final packaged build.
- [ ] Confirm no backend, API key, or external service configuration is required.

## Developer dashboard fields

- [ ] Extension name: `TimeWorth`
- [ ] Short description: choose one option from `chrome-web-store-listing.md`.
- [ ] Detailed description: paste the long description from `chrome-web-store-listing.md`.
- [ ] Category: `Productivity`
- [ ] Privacy policy URL: publish the privacy policy and paste the final URL.
- [ ] Privacy declarations: declare only the data and permissions the extension actually uses.

## Final review

- [ ] Store copy matches the current extension behavior.
- [ ] Privacy policy matches the current extension behavior.
- [ ] Screenshots show the current UI.
- [ ] ZIP contains no source-control, planning, or documentation artifacts.
- [ ] Uploaded build installs and runs from the Chrome Web Store developer dashboard test flow.
