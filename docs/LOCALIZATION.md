# Localization Architecture

## Overview
AquaVolt AI uses a custom lightweight localization (i18n) foundation designed to easily map UI string keys to localized versions without over-engineering the application bundle or requiring heavy third-party libraries prematurely.

## Core Files
- `src/i18n/translations.ts`: Stores the `LanguageCode` definitions, default language configurations, and the `translations` object which currently serves as a dictionary map. 
- `src/i18n/LanguageContext.tsx`: Provides the `LanguageProvider` and `useLanguage` hook.

## Translation Status
- **English (`en`)**: Default (Fully Supported)
- **Marathi (`mr`)**: Implemented
- **Hindi (`hi`)**: Implemented
- **Tamil (`ta`)**: Language option / Fallback to English
- **Telugu (`te`)**: Language option / Fallback to English
- **Kannada (`kn`)**: Language option / Fallback to English
- **Bengali (`bn`)**: Language option / Fallback to English
- **Gujarati (`gu`)**: Language option / Fallback to English

For languages without full translations, the `t()` helper safely falls back to English to prevent broken UI keys.

## Usage

### The `useLanguage` hook
To consume translated strings or interact with the language state:

```tsx
import { useLanguage } from '../i18n/LanguageContext';

const MyComponent = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <h1>{t('greeting_title')}</h1>
      <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
    </div>
  );
};
```

### Persistence
The `LanguageProvider` automatically reads and writes to `localStorage` under the key `aquavolt_language`. It also sets the HTML `lang` attribute on the document root for accessibility and SEO.

## Future Translation Strategy
During the current frontend scaffolding phase, translations are deliberately sparse to avoid wasting development cycles translating placeholder text. As features mature, we will expand the dictionary map in `translations.ts` and optionally split it by feature/module if the bundle size grows significantly.
