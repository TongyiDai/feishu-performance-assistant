# Chrome Web Store release notes

## Published item

- Store page: <https://chromewebstore.google.com/detail/gadlmgoojihfbclnnhkkllmjdmgpdjjl?utm_source=item-share-cb>
- Product name: 绩效助手
- Current source snapshot: 3.3
- Manifest: Manifest V3

## Single purpose

Open Feishu/Lark performance-review, Base, Wiki, and App links in Chrome's side panel to support split-screen work.

## Permissions

| Permission | Purpose |
| --- | --- |
| `sidePanel` | Open the requested page in Chrome's side panel. |
| `contextMenus` | Provide the right-click action for moving a page or link to the side panel. |
| `storage` | Pass the selected URL and display mode between the service worker and side panel. |
| `tabs` | Navigate the current tab to the tenant's performance-review page. |

## Data use

The extension handles URLs needed for its single purpose and keeps handoff state locally. See [PRIVACY.md](PRIVACY.md). When this repository is public, use its public HTTPS URL as the privacy-policy URL in the Chrome Web Store Developer Dashboard.

## Version history

| Version | Date | Notes |
| --- | --- | --- |
| 3.3 | 2026-08-10 | Public source snapshot of the published extension; tightened hostname matching and replaced the internal default URL with a documented tenant placeholder. |
