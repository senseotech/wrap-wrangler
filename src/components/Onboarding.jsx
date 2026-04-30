import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Onboarding() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // LPLWW-14: Use sessionStorage so splash shows once per session
    // but NOT on every internal route change (Settings → Calculator)
    const shown = sessionStorage.getItem('splash_shown');
    if (!shown) {
      setVisible(true);
      sessionStorage.setItem('splash_shown', '1');
    }
  }, []);

  const dismiss = () => {
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
            className="px-6 py-5 max-w-xs w-full"
            style={{backgroundColor: 'var(--deep)', border: '1px solid var(--border)', borderRadius: '2px'}}
          >
            <p className="text-sm leading-relaxed mb-5 italic select-none" style={{fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontWeight: 300}}>
              "Welcome to the Wrapping Protocol Terminal. Geometry is a kindness."
            </p>
            <button
              onClick={dismiss}
              className="text-xs tracking-[0.2em] uppercase transition-colors select-none"
              style={{color: 'var(--amber)'}}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--amber-bright)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--amber)'}
            >
              Begin
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}