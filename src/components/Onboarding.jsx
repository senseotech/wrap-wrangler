import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Onboarding() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('wrp_onboarding_dismissed');
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('wrp_onboarding_dismissed', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-stone-900/20 dark:bg-stone-950/40 backdrop-blur-sm pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-[#FAF9F7] dark:bg-[#1a1a18] border border-stone-200 dark:border-stone-700 rounded px-6 py-5 max-w-xs w-full"
          >
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4 italic">
              "Welcome to the Wrapping Protocol Terminal. Geometry is a kindness."
            </p>
            <button
              onClick={dismiss}
              className="text-xs tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors select-none"
            >
              Begin
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}