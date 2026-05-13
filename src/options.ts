import { getSettings, saveSettings } from "./settings";

function localize(): void {
  document.title = chrome.i18n.getMessage("optionsTitle") || document.title;
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const msg = chrome.i18n.getMessage(key);
    if (msg) el.textContent = msg;
  });
}

function flashStatus(): void {
  const status = document.getElementById("status");
  if (!status) return;
  status.classList.add("visible");
  window.setTimeout(() => status.classList.remove("visible"), 1200);
}

async function init(): Promise<void> {
  localize();

  const showToastInput = document.getElementById(
    "showToast"
  ) as HTMLInputElement | null;
  if (!showToastInput) return;

  const settings = await getSettings();
  showToastInput.checked = settings.showToast;

  showToastInput.addEventListener("change", async () => {
    await saveSettings({ showToast: showToastInput.checked });
    flashStatus();
  });
}

void init();
