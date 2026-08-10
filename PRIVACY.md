# Privacy

Last updated: 2026-08-10

绩效助手 is a local Chrome extension for opening Feishu/Lark pages in the browser side panel.

## Data handled

- On matching Feishu/Lark pages, the extension reads the current page URL and the URL of a link the user clicks.
- It stores only the side-panel handoff state (`targetUrl` and `hideNav`) in `chrome.storage.local`.
- It does not collect page text, performance ratings, employee profiles, cookies, passwords, or analytics identifiers.

## Data sharing

The extension has no extension-operated backend, analytics service, advertising network, or data broker. URLs are passed from the content script to the local extension service worker so the requested page can open in the side panel. The requested site then receives the normal browser request needed to display that page.

## User control

Users can remove the extension or clear its site data in Chrome to delete locally stored handoff state. Users should only use it with Feishu/Lark accounts and pages they are authorized to access.

## Contact

Please open a GitHub issue in the public repository for privacy questions or reports.
