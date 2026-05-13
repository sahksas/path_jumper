import { readClipboard } from "./clipboard";
import { normalizeClipboardToPath } from "./normalizePath";
import { extractOrigin } from "./origin";
import { getSettings } from "./settings";
import { showJumpToast } from "./toast";

async function jumpToClipboardPath(tab: chrome.tabs.Tab): Promise<void> {
  const tabId = tab.id;
  if (typeof tabId !== "number") return;

  const origin = extractOrigin(tab.url);
  if (origin === null) return;

  const clipboard = await readClipboard();
  if (clipboard === null) return;

  const path = normalizeClipboardToPath(clipboard);
  if (path === null) return;

  const settings = await getSettings();

  await chrome.tabs.update(tabId, { url: `${origin}${path}` });

  if (!settings.showToast) return;
  const message = chrome.i18n.getMessage("toastJumped", path) || `→ ${path}`;
  await showJumpToast(tabId, message);
}

chrome.action.onClicked.addListener((tab) => {
  void jumpToClipboardPath(tab);
});
