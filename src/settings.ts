export type Settings = {
  showToast: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  showToast: true,
};

export async function getSettings(): Promise<Settings> {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return {
    showToast: typeof stored.showToast === "boolean" ? stored.showToast : DEFAULT_SETTINGS.showToast,
  };
}

export async function saveSettings(partial: Partial<Settings>): Promise<void> {
  await chrome.storage.sync.set(partial);
}
