/**
 * i18n helper for Chrome extension
 * Uses chrome.i18n.getMessage() to get localized strings
 */

import { useCallback } from "react";

export type MessageKey =
  | "appName"
  | "appDescription"
  | "popupTitle"
  | "optionsTitle"
  | "settingsSaved"
  | "errorOccurred";

/**
 * Get a localized message by key
 * @param key - The message key defined in messages.json
 * @param substitutions - Optional substitution strings
 * @returns The localized message string
 */
export function getMessage(
  key: MessageKey,
  substitutions?: string | string[]
): string {
  return chrome.i18n.getMessage(key, substitutions);
}

/**
 * Get the current UI language
 * @returns The browser's UI language code (e.g., "en", "ja")
 */
export function getUILanguage(): string {
  return chrome.i18n.getUILanguage();
}

/**
 * Get the accept languages
 * @returns Promise resolving to an array of language codes
 */
export function getAcceptLanguages(): Promise<string[]> {
  return new Promise((resolve) => {
    chrome.i18n.getAcceptLanguages((languages) => {
      resolve(languages);
    });
  });
}

/**
 * Apply i18n to all elements with data-i18n attribute
 * Usage: <span data-i18n="appName"></span>
 */
export function localizeHtmlPage(): void {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n") as MessageKey;
    if (key) {
      element.textContent = getMessage(key);
    }
  });

  const placeholderElements = document.querySelectorAll(
    "[data-i18n-placeholder]"
  );
  placeholderElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder") as MessageKey;
    if (key && element instanceof HTMLInputElement) {
      element.placeholder = getMessage(key);
    }
  });

  const titleElements = document.querySelectorAll("[data-i18n-title]");
  titleElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-title") as MessageKey;
    if (key && element instanceof HTMLElement) {
      element.title = getMessage(key);
    }
  });
}

/**
 * React hook for i18n
 * @returns Object with t function for getting messages
 */
export function useI18n() {
  const t = useCallback(
    (key: MessageKey, substitutions?: string | string[]): string => {
      return getMessage(key, substitutions);
    },
    []
  );

  return { t, getUILanguage, getAcceptLanguages };
}
