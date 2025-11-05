// Simple localization hook. Chooses between `en` and `ja` bundles shipped under components/locales.
import { useMemo } from 'react';
import en from '../locales/en.json';
import ja from '../locales/ja.json';

const bundles: Record<string, any> = { en, ja };

function detectLocale(): 'en' | 'ja' {
    try {
        // Prefer Intl if available
        const resolved = (Intl as any)?.DateTimeFormat?.().resolvedOptions?.().locale;
        if (typeof resolved === 'string' && resolved.startsWith('ja')) return 'ja';
    } catch (e) {
        // ignore
    }
    // default to english
    return 'en';
}

export default function useLocalization() {
    const locale = useMemo(() => detectLocale(), []);

    const t = (key: string) => {
        const parts = key.split('.');
        let cur: any = bundles[locale];
        for (const p of parts) {
            if (!cur || typeof cur !== 'object' || !(p in cur)) {
                return key; // fallback to key when missing
            }
            cur = cur[p];
        }
        return typeof cur === 'string' ? cur : key;
    };

    return { t, locale } as const;
}
