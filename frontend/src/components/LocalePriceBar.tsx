import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, currencyLocaleMap } from '@/utils/currency';

// This would come from your backend/API in a real implementation
const regionPricing = {
  'us': { multiplier: 1 },
  'uk': { multiplier: 0.8 },
  'eu': { multiplier: 0.9 },
  'in': { multiplier: 0.3 },
  'br': { multiplier: 0.4 },
  'ng': { multiplier: 0.35 },
  'za': { multiplier: 0.45 },
  'ph': { multiplier: 0.25 },
};

const basePrices = {
  starter: 29,
  professional: 99,
  enterprise: 299,
};

export function LocalePriceBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('us');

  const calculatePrice = (basePrice: number) => {
    const region = regionPricing[selectedRegion as keyof typeof regionPricing];
    const { currency, locale } = currencyLocaleMap[selectedRegion as keyof typeof currencyLocaleMap];
    const price = Math.round(basePrice * region.multiplier);
    
    return formatCurrency({
      value: price,
      currency,
      locale,
    });
  };

  return (
    <div className="bg-[#030a59] text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 text-sm font-medium hover:text-white/90"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span className="font-medium">Preview localized prices</span>
          </button>

          <div className="flex items-center space-x-4 text-sm">
            <span className="font-medium">Starting from</span>
            <span className="font-semibold">{calculatePrice(basePrices.starter)}/month</span>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/10"
            >
              <div className="py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(currencyLocaleMap).map(([code, { currency }]) => (
                  <button
                    key={code}
                    onClick={() => setSelectedRegion(code)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      selectedRegion === code
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={`/flags/${code}.svg`}
                        alt={currency}
                        className="w-5 h-5 rounded-full"
                      />
                      <span>{currency}</span>
                    </div>
                    <div className="font-semibold">
                      {calculatePrice(basePrices.starter)}
                    </div>
                  </button>
                ))}
              </div>

              <div className="py-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-sm text-white/80">Starter</div>
                    <div className="font-semibold text-lg">
                      {calculatePrice(basePrices.starter)}/mo
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/80">Professional</div>
                    <div className="font-semibold text-lg">
                      {calculatePrice(basePrices.professional)}/mo
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/80">Enterprise</div>
                    <div className="font-semibold text-lg">
                      {calculatePrice(basePrices.enterprise)}/mo
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 