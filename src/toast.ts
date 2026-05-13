const TAB_COMPLETE_TIMEOUT_MS = 8000;
const TOAST_FADE_OUT_AT_MS = 1400;
const TOAST_REMOVE_AT_MS = 1700;

function waitForTabComplete(
  tabId: number,
  timeoutMs: number
): Promise<void> {
  return new Promise((resolve) => {
    const cleanup = () => {
      clearTimeout(timer);
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    };
    const listener = (
      updatedTabId: number,
      info: chrome.tabs.OnUpdatedInfo
    ) => {
      if (updatedTabId === tabId && info.status === "complete") {
        cleanup();
      }
    };
    const timer = setTimeout(cleanup, timeoutMs);
    chrome.tabs.onUpdated.addListener(listener);
  });
}

// Runs in the destination page's isolated world via chrome.scripting.executeScript.
// Must be self-contained: it is serialized with Function.prototype.toString() and
// loses access to any module-level identifiers.
function renderToast(
  message: string,
  fadeOutAtMs: number,
  removeAtMs: number
): void {
  const id = "__path_jumper_toast__";
  document.getElementById(id)?.remove();

  const el = document.createElement("div");
  el.id = id;
  el.textContent = message;
  el.style.cssText = `
    position:fixed;top:16px;right:16px;max-width:60vw;
    padding:10px 14px;background:rgba(20,20,20,0.92);color:#fff;
    font:13px/1.4 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
    border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,0.25);
    z-index:2147483647;opacity:0;transform:translateY(-4px);
    transition:opacity .18s ease-out,transform .18s ease-out;
    pointer-events:none;white-space:nowrap;
    overflow:hidden;text-overflow:ellipsis;
  `.trim();
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(-4px)";
  }, fadeOutAtMs);
  setTimeout(() => el.remove(), removeAtMs);
}

export async function showJumpToast(
  tabId: number,
  message: string
): Promise<void> {
  await waitForTabComplete(tabId, TAB_COMPLETE_TIMEOUT_MS);
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: renderToast,
      args: [message, TOAST_FADE_OUT_AT_MS, TOAST_REMOVE_AT_MS],
    });
  } catch {
    // ignore - injection fails on chrome://, web store, etc.
  }
}
