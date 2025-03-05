interface CurrencyFormat {
  value: number;
  currency: string;
  locale: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const formatCurrency = ({
  value,
  currency,
  locale = 'en-US',
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
}: CurrencyFormat): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};

export const currencyLocaleMap = {
  'us': { locale: 'en-US', currency: 'USD' },
  'uk': { locale: 'en-GB', currency: 'GBP' },
  'eu': { locale: 'de-DE', currency: 'EUR' },
  'in': { locale: 'en-IN', currency: 'INR' },
  'br': { locale: 'pt-BR', currency: 'BRL' },
  'ng': { locale: 'en-NG', currency: 'NGN' },
  'za': { locale: 'en-ZA', currency: 'ZAR' },
  'ph': { locale: 'en-PH', currency: 'PHP' },
} as const; 