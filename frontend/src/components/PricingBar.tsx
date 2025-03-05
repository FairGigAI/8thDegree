import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function PricingBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-primary to-primary-dark py-8 text-white"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Start Your Journey Today</h3>
            <p className="text-white/80">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>AI-Powered Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
          </div>

          <button className="px-8 py-3 bg-white text-primary rounded-full font-semibold hover:bg-opacity-90 transition-colors shadow-lg">
            Get Started Free
          </button>
        </div>
      </div>
    </motion.div>
  );
} 