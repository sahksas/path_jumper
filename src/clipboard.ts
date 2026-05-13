const OFFSCREEN_PATH = "offscreen.html";

async function ensureOffscreenDocument(): Promise<void> {
  const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_PATH);
  const existing = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [offscreenUrl],
  });
  if (existing.length > 0) return;

  await chrome.offscreen.createDocument({
    url: OFFSCREEN_PATH,
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification:
      "Read clipboard text to navigate the active tab to the pasted path.",
  });
}

export async function readClipboard(): Promise<string | null> {
  try {
    await ensureOffscreenDocument();
    const response = await chrome.runtime.sendMessage({
      type: "READ_CLIPBOARD",
    });
    if (response && typeof response.text === "string") return response.text;
    return null;
  } catch {
    return null;
  }
}
