function readClipboardViaExecCommand(): string | null {
  const ta = document.getElementById(
    "paste-target"
  ) as HTMLTextAreaElement | null;
  if (!ta) return null;
  ta.value = "";
  ta.focus();
  ta.select();
  const ok = document.execCommand("paste");
  const value = ta.value;
  ta.value = "";
  return ok ? value : null;
}

type IncomingMessage = { type?: unknown } | null | undefined;

chrome.runtime.onMessage.addListener(
  (message: IncomingMessage, _sender, sendResponse) => {
    if (message?.type !== "READ_CLIPBOARD") return;

    if (navigator.clipboard?.readText) {
      navigator.clipboard
        .readText()
        .then((text) => sendResponse({ text }))
        .catch(() => sendResponse({ text: readClipboardViaExecCommand() }));
      return true;
    }

    sendResponse({ text: readClipboardViaExecCommand() });
  }
);
