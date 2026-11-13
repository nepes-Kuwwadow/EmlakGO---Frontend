import { ref, computed } from 'vue';
import tk from './locales/tk';
import en from './locales/en';
import ru from './locales/ru';
import de from './locales/de';

const messages = {
  tk,
  en,
  ru,
  de,
};

export const availableLocales = [
  { code: 'tk', label: 'Türkmençe', short: 'TM' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
];

const savedLocale = localStorage.getItem('emlakgo_locale') || 'tk';
export const currentLocale = ref(messages[savedLocale] ? savedLocale : 'tk');

export function setLocale(code) {
  if (messages[code]) {
    currentLocale.value = code;
    localStorage.setItem('emlakgo_locale', code);
    document.documentElement.lang = code;
  }
}

export function t(path, params = {}) {
  const lang = currentLocale.value;
  const keys = path.split('.');

  // Try current language
  let val = messages[lang];
  for (const k of keys) {
    if (val && typeof val === 'object' && k in val) {
      val = val[k];
    } else {
      val = null;
      break;
    }
  }

  // Fallback to Turkmen (tk) if not found
  if (val === null && lang !== 'tk') {
    let fallback = messages.tk;
    for (const k of keys) {
      if (fallback && typeof fallback === 'object' && k in fallback) {
        fallback = fallback[k];
      } else {
        fallback = null;
        break;
      }
    }
    val = fallback;
  }

  // Fallback to key itself if still null
  if (val === null || val === undefined) {
    return path;
  }

  if (typeof val === 'string' && Object.keys(params).length > 0) {
    return val.replace(/\{(\w+)\}/g, (_, match) => {
      return params[match] !== undefined ? params[match] : `{${match}}`;
    });
  }

  return val;
}

/**
 * Translates a category object or string name/slug into the active language
 */
export function translateCategory(cat) {
  if (!cat) return '';
  const raw = typeof cat === 'string' ? cat : (cat.slug || cat.name || '');
  const normalized = raw
    .toLowerCase()
    .trim()
    .replace(/ý/g, 'y')
    .replace(/[-_ ]+/g, '_');

  const slugMap = {
    'kwartira': 'kwartira',
    'kvartira': 'kwartira',
    'apartment': 'kwartira',
    'flat': 'kwartira',
    'yer': 'yer',
    'land': 'yer',
    'plot': 'yer',
    'ofis': 'ofis',
    'office': 'ofis',
    'jay': 'jay',
    'house': 'jay',
    'kireyine_jay': 'kireyine_jay',
    'kireyine-jay': 'kireyine_jay',
    'kireyine': 'kireyine_jay',
    'rent': 'kireyine_jay',
    'rental': 'kireyine_jay',
    'rentals': 'kireyine_jay',
  };

  const key = slugMap[normalized] || normalized;
  const translated = t(`categories.${key}`);
  if (translated && !translated.startsWith('categories.')) {
    return translated;
  }
  return typeof cat === 'object' ? (cat.name || '') : cat;
}

/**
 * Translates a city name into the active language
 */
export function translateCity(cityName) {
  if (!cityName) return '';
  const normalized = cityName
    .toLowerCase()
    .trim()
    .replace(/ý/g, 'y')
    .replace(/ş/g, 's')
    .replace(/ä/g, 'a')
    .replace(/[-_ ]+/g, '');

  const cityMap = {
    'asgabat': 'asgabat',
    'ashgabat': 'asgabat',
    'arkadag': 'arkadag',
    'mary': 'mary',
    'turkmenabat': 'turkmenabat',
    'dasoguz': 'dasoguz',
    'dashoguz': 'dasoguz',
    'balkanabat': 'balkanabat',
    'turkmenbasy': 'turkmenbasy',
    'turkmenbashi': 'turkmenbasy',
    'anew': 'anew',
  };

  const key = cityMap[normalized] || normalized;
  const translated = t(`cities.${key}`);
  if (translated && !translated.startsWith('cities.')) {
    return translated;
  }
  return cityName;
}

export function useI18n() {
  return {
    locale: currentLocale,
    setLocale,
    t,
    translateCategory,
    translateCity,
    availableLocales,
  };
}

export const i18nPlugin = {
  install(app) {
    app.config.globalProperties.$t = t;
    app.config.globalProperties.$tc = translateCategory;
    app.config.globalProperties.$tCity = translateCity;
    app.config.globalProperties.$locale = currentLocale;
    app.provide('i18n', {
      locale: currentLocale,
      setLocale,
      t,
      translateCategory,
      translateCity,
      availableLocales,
    });
  },
};
