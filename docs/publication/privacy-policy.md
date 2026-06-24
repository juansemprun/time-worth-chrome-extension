# TimeWorth Privacy Policy

**Effective date:** June 24, 2026

TimeWorth is a Chrome extension that helps you understand Amazon product prices in terms of your working time. It reads visible product prices on supported Amazon pages and calculates an estimated working-time equivalent using the salary and work-hours settings you provide.

## Data TimeWorth stores

TimeWorth stores only the settings needed to calculate working-time equivalents:

- Currency symbol
- Salary type, such as annual or monthly
- Salary amount
- Weekly work hours

These settings are stored with `chrome.storage.sync`, which means Chrome may sync them across browsers where you are signed in with the same Google account and have Chrome sync enabled.

## How TimeWorth uses page data

TimeWorth runs on supported Amazon domains listed in the extension manifest. On those pages, it reads visible price text from the page locally in your browser so it can calculate and display the equivalent number of working hours.

TimeWorth does not store Amazon page content, browsing history, product details, or purchase information.

## Data sharing and external transmission

TimeWorth does not sell, share, or transfer your settings to external servers.

TimeWorth does not have a backend service, does not send your salary or work-hour settings to the developer, and does not transmit Amazon page prices to an external service.

## Analytics and tracking

TimeWorth does not include analytics, advertising trackers, or behavioral tracking.

## Chrome permissions

TimeWorth requests the `storage` permission so it can save your settings and reuse them when calculating working-time equivalents on Amazon pages.

## Contact

If you have questions about this privacy policy, contact: juansemprun.dev@gmail.com.

## Publisher note

This privacy policy is provided as a clear starting point for publication. Before publishing, review it for accuracy, update the contact email, and confirm it satisfies the legal and marketplace requirements that apply in your jurisdiction.

The current publication build is intended to use system fonts and no third-party font requests. Also confirm the final packaged extension does not load analytics or other external resources. If external resources are added later, update this policy before publishing.
