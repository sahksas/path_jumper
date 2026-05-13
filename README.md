# Path Jumper

A Chrome extension that replaces the current URL path with the contents of your clipboard, while keeping the active tab's origin (protocol + host + port) intact.

When teammates share a link as a relative path (e.g. `/page/hogehuga`) because each environment has a different domain, you can jump to it on **your own** environment in a single click — no manual address bar editing.

> [!IMPORTANT]
> The first time you use the extension on a given site, the browser may ask for clipboard permission. Allow it once and the extension will work silently afterwards.

## Features

- One-click jump from the toolbar icon, or via the `Alt+J` keyboard shortcut.
- Pastes a relative path (`/foo/bar`) onto the current origin.
- Strips the origin from a full URL (`https://other-site.com/x?q=1#h`) and applies the path part only — convenient when teammates accidentally paste a full link from a different environment.
- Preserves query and hash (`/page?id=1#sec`).
- Optional toast notification in the top-right showing the destination path after navigation.
- Silent on errors: no popups when the clipboard is empty or the page is restricted.

## How It Works

1. Read the active tab's `origin` (protocol + host + port).
2. Read the clipboard text and trim whitespace.
3. Normalize the clipboard text to a path:
   - **Full URL** (`http(s)://...`): take `pathname + search + hash`, discard the origin.
   - **Relative path**: prepend `/` if missing.
4. Navigate the active tab to `origin + path`.

| Clipboard | On `https://example.com/foo` jumps to |
|---|---|
| `/bar/baz` | `https://example.com/bar/baz` |
| `bar/baz` | `https://example.com/bar/baz` |
| `/page?id=1#sec` | `https://example.com/page?id=1#sec` |
| `https://other-site.com/x/y?q=1#h` | `https://example.com/x/y?q=1#h` |
| _(empty)_ | (no-op) |

## Installation

Until the extension is published to the Chrome Web Store, install it as an unpacked extension:

1. Run `pnpm install && pnpm build` to produce the `dist/` directory.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the `dist/` directory.

## Keyboard Shortcut

The default shortcut is `Alt+J`. You can change it from `chrome://extensions/shortcuts`.

## Settings

Open the options page from the extension icon's right-click menu → **Options**, or from `chrome://extensions` → Path Jumper → **Details** → **Extension options**.

| Option | Default | Description |
|---|---|---|
| Show toast on jump | ON | After navigation, briefly displays the destination path in the top-right corner. |

Settings are stored via `chrome.storage.sync` and follow your Chrome profile across devices.

## Development

```bash
pnpm install        # install dependencies
pnpm build          # production build → dist/
pnpm watch          # rebuild on change
pnpm test           # jest unit tests
pnpm format         # prettier
```

### Project Structure

| Path | Purpose |
|---|---|
| `src/background.ts` | Service worker entry. Thin orchestrator that wires together the other modules on icon click. |
| `src/origin.ts` | Pure function that extracts a tab's origin from its URL (unit-tested, port-preserving). |
| `src/normalizePath.ts` | Pure function that converts clipboard text to a path (unit-tested). |
| `src/clipboard.ts` | Lazily creates the offscreen document and reads the clipboard through it. |
| `src/toast.ts` | Waits for the destination tab to finish loading, then injects the toast DOM. |
| `src/settings.ts` | `chrome.storage.sync` wrapper for the user-facing options. |
| `src/options.ts` | Options page script (loads/saves settings, localizes text). |
| `src/offscreen.ts` | Offscreen-document message handler that reads the clipboard via `navigator.clipboard` (with `execCommand("paste")` fallback). |
| `public/manifest.json` | Manifest V3 (`icon_variants` for light/dark toolbar themes). |
| `public/offscreen.html` | Offscreen document host. |
| `public/options.html` | Options page. |
| `public/_locales/` | i18n messages (`en`, `ja`). |

### Why an Offscreen Document?

Service workers have no DOM, so `navigator.clipboard.readText()` cannot run there directly. Injecting it into the active tab fails on non-secure pages (HTTP), where `navigator.clipboard` is undefined regardless of the extension's `clipboardRead` permission. Path Jumper uses [`chrome.offscreen`](https://developer.chrome.com/docs/extensions/reference/api/offscreen) to host an extension-owned hidden document where the Clipboard API is always available.

## Known Issues

- Special pages such as `chrome://`, `chrome-extension://`, the Chrome Web Store, and other browser-internal pages cannot be navigated or have scripts injected into them. Jumps targeting these pages will not show the toast.
- The first jump after the extension is reloaded may be slightly slower while the offscreen document is being created.

## Release Notes

### 1.0.0

- Initial release.
- Jump via toolbar icon or `Alt+J`.
- Optional toast notification with on/off toggle in options.
- English / Japanese UI (`chrome.i18n`).

### Additional request

- [sahksas/path-jumper](https://github.com/sahksas/path-jumper)

If you find a bug or have a feature request, please open an issue or send a pull request.

## Privacy Policy

- Path Jumper does **not** collect, transmit, or share any user data.
- Clipboard contents are read only when you trigger the extension, used solely to construct the destination URL, and never stored or sent anywhere.
- The only data persisted is your toggle preference (`showToast`), stored via `chrome.storage.sync` so it follows your Chrome profile across devices.

## License

[MIT](./LICENSE)
