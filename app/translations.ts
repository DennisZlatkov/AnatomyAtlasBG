// Bulgarian & Latin Anatomical Translations Dictionary
// Generated for complete human atlas localization

export interface TermTranslation {
  bg: string;
  latin: string;
}

// Pre-compiled fast dictionary
import translationsData from '../public/models/translations.json';

const TRANSLATIONS: Record<string, TermTranslation> = translationsData as Record<string, TermTranslation>;

export function getTranslation(name: string): TermTranslation {
  if (!name) return { bg: '', latin: '' };
  const found = TRANSLATIONS[name] || TRANSLATIONS[name.toLowerCase()];
  if (found) return found;
  return { bg: name, latin: name };
}

export function formatBilingualName(name: string): { primary: string; secondary: string } {
  const trans = getTranslation(name);
  if (trans.latin && trans.latin !== trans.bg) {
    return {
      primary: trans.bg,
      secondary: trans.latin
    };
  }
  return {
    primary: trans.bg || name,
    secondary: trans.latin || name
  };
}
