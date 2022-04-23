import { writable, derived, get } from "svelte/store";
import translations from "src/scripts/translate.js";

export const locale = writable('us');
export const languages = Object.keys(translations);

const translateText = (key, vars, locale) => {
  const splitKey = key.split('.');
  let text = translations[locale];
  splitKey.forEach((partialId) => {
    text = text[partialId];
  });

  Object.keys(vars).map((k) => {
    const regex = new RegExp(`{{${k}}}`, "g");
    text = text.replace(regex, vars[k]);
  });

  return (text);
}

export const __ = derived(locale, (locale) => (key, vars = {}) => translateText(key, vars, locale));

export const tranlate = (key, vars = {}) => {
  return translateText(key, vars, get(locale))
}
