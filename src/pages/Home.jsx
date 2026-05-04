import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, Copy, Check, Info } from 'lucide-react';
import { toast } from 'sonner';
import Onboarding from '../components/Onboarding';
import WrapDiagram from '../components/WrapDiagram';
import ExpertMode from '../components/ExpertMode';
import ProtocolCard from '../components/ProtocolCard';

export default function Home() {
  const [dimensions, setDimensions] = useState({
    width: '',
    depth: '',
    height: ''
  });
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('preferredUnit') || 'inches';
  });
  const [unitDrawerOpen, setUnitDrawerOpen] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = React.useRef(null);
  const startY = React.useRef(0);
  const isPulling = React.useRef(false);

  const PULL_THRESHOLD = 60;
  const hasAnyDimension = Object.values(dimensions).some(v => v !== '');

  // Track whether the touch started at the top — not just whether we arrive there
  const startedAtTop = React.useRef(false);

  const handleTouchStart = useCallback((e) => {
    startY.current = e.touches[0].clientY;
    // Only arm the gesture if we're genuinely resting at the top when the finger lands
    // Use the scroll parent (main) via closest, falling back to window.scrollY
    const scrollParent = containerRef.current?.closest('main');
    const scrollTop = scrollParent ? scrollParent.scrollTop : window.scrollY;
    startedAtTop.current = scrollTop === 0;
    isPulling.current = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!startedAtTop.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    const scrollParent = containerRef.current?.closest('main');
    const scrollTop = scrollParent ? scrollParent.scrollTop : window.scrollY;
    // Must be moving downward and still at the top — discard upward flicks that land at top
    if (diff > 0 && scrollTop === 0) {
      isPulling.current = true;
      setPullDistance(Math.min(diff * 0.5, 80));
    } else if (diff < 0) {
      // Moving upward — disarm entirely so a scroll-up-then-down doesn't trigger
      startedAtTop.current = false;
      setPullDistance(0);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > PULL_THRESHOLD && hasAnyDimension) {
      const previous = { ...dimensions };
      setDimensions({ width: '', depth: '', height: '' });
      setPullDistance(0);
      toast('Measurements cleared.', {
        duration: 4000,
        action: {
          label: 'Undo',
          onClick: () => setDimensions(previous),
        },
      });
    } else {
      setPullDistance(0);
    }
    isPulling.current = false;
  }, [pullDistance, dimensions, hasAnyDimension]);

  const handleUnitSelect = (selectedUnit) => {
    setUnit(selectedUnit);
    setUnitDrawerOpen(false);
  };

  React.useEffect(() => {
    localStorage.setItem('preferredUnit', unit);
  }, [unit]);

  const handleInputChange = (field, value) => {
    // LPLWW-6: Strip non-numeric but preserve empty string for clean UX
    const numValue = value.replace(/[^0-9.]/g, '');
    setDimensions(prev => ({ ...prev, [field]: numValue }));
  };

  // LPLWW-6: Derive validation message from current dimension state
  const validationMessage = useMemo(() => {
    const hasAnyValue = Object.values(dimensions).some(v => v !== '');
    if (!hasAnyValue) return null;
    const w = parseFloat(dimensions.width) || 0;
    const d = parseFloat(dimensions.depth) || 0;
    const h = parseFloat(dimensions.height) || 0;
    if (w === 0 || d === 0 || h === 0) {
      return 'All three dimensions need a value greater than zero to calculate.';
    }
    return null;
  }, [dimensions]);

  const calculations = useMemo(() => {
    const w = parseFloat(dimensions.width) || 0;
    const d = parseFloat(dimensions.depth) || 0;
    const h = parseFloat(dimensions.height) || 0;

    if (w <= 0 || d <= 0 || h <= 0) return null;

    const paperDiagonal = Math.sqrt(w * w + d * d) + (2 * h);
    const paperSide = paperDiagonal / Math.sqrt(2);

    return {
      paperSide: Math.round(paperSide * 10) / 10,
      paperDiagonal: Math.round(paperDiagonal * 10) / 10
    };
  }, [dimensions]);

  const unitLabel = unit === 'inches' ? 'in' : 'cm';
  const [expertMode, setExpertMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!calculations) return;
    const text = `Required Square Side: ${calculations.paperSide} ${unitLabel}\nPaper Diagonal: ${calculations.paperDiagonal} ${unitLabel}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }, [calculations, unitLabel]);

  return (
    <>
    <Onboarding />
    <div
      ref={containerRef}
      className="min-h-full"
      style={{backgroundColor: 'var(--void)'}}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to reset indicator */}
      <div
        className="flex justify-center items-end overflow-hidden transition-all duration-200"
        style={{ height: pullDistance }}
      >
        <span
          className="text-[10px] tracking-[0.2em] uppercase pb-2 transition-colors duration-200 select-none"
          style={{ color: pullDistance > PULL_THRESHOLD ? 'var(--amber)' : 'var(--text-dim)' }}
        >
          {pullDistance > PULL_THRESHOLD ? 'Release to clear' : 'Pull to clear'}
        </span>
      </div>
      
      <div className="max-w-md mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 select-none text-amber">
            Lost Province Labs · Field Notes
          </p>
          <h1 className="text-2xl md:text-3xl leading-tight mb-4 select-none" style={{fontFamily: 'var(--font-display)', color: 'var(--text-primary)'}}>
            Diagonal Wrap Protocol
          </h1>
          <p className="text-sm leading-relaxed select-none" style={{fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontWeight: 300}}>
            An old geometric technique for wrapping rectangular parcels with a single square of paper.
          </p>
        </motion.header>

        {/* Input Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs tracking-wide uppercase select-none" style={{color: 'var(--text-muted)'}}>Box Dimensions</span>
            <div className="flex-1 h-px" style={{backgroundColor: 'var(--amber-dim)'}} />
            {/* Expert Mode toggle */}
            <button
              onClick={() => setExpertMode(e => !e)}
              className="flex items-center gap-1.5 select-none group"
              aria-label="Toggle Expert Mode"
            >
              <span className="text-[10px] tracking-[0.15em] uppercase text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">Expert</span>
              <div className={`relative w-7 h-4 rounded-full transition-colors duration-200`} style={{backgroundColor: expertMode ? 'var(--amber)' : 'var(--border)'}}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white dark:bg-stone-200 shadow-sm transition-transform duration-200 ${expertMode ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
              </div>
            </button>
            <Drawer open={unitDrawerOpen} onOpenChange={setUnitDrawerOpen}>
              <DrawerTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-1 text-xs tracking-wide text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded select-none">
                  {unit === 'cm' ? 'cm' : 'in'}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#FAF9F7] dark:bg-[#1a1a18] border-stone-200 dark:border-stone-700">
                <DrawerHeader>
                  <DrawerTitle className="text-stone-800 dark:text-stone-200 select-none">Select Unit</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-8 space-y-2">
                  {[
                    { value: 'inches', label: 'Inches', short: 'in' },
                    { value: 'cm', label: 'Centimeters', short: 'cm' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleUnitSelect(option.value)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors select-none ${
                        unit === option.value
                          ? 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <span className="text-sm">{option.label}</span>
                      <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">{option.short}</span>
                    </button>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="border border-stone-200 dark:border-stone-700 rounded p-5 bg-white/30 dark:bg-stone-900/20">
            <div className="space-y-4">
              {[
                { key: 'width', label: 'w', name: 'width' },
                { key: 'depth', label: 'd', name: 'depth' },
                { key: 'height', label: 'h', name: 'height' }
              ].map((field) => (
                <div key={field.key} className="flex items-center gap-4">
                  <span className="w-16 text-sm text-stone-500 dark:text-stone-400 font-mono select-none">
                    {field.name}
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={dimensions[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder="—"
                      className="w-full bg-transparent border-b border-stone-200 dark:border-stone-700 py-2 text-lg text-stone-800 dark:text-stone-200 font-light tracking-wide placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors"
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-stone-400 dark:text-stone-500">
                      {unitLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-4 tracking-wide select-none">
              All calculations assume a perfect square sheet.
            </p>
          </div>
        </motion.section>

        {/* LPLWW-6: Validation message for zero/incomplete dimensions */}
        <AnimatePresence>
          {validationMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-stone-400 dark:text-stone-500 font-mono tracking-wide mb-6"
            >
              {validationMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {calculations && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs tracking-wide uppercase select-none" style={{color: 'var(--text-muted)'}}>Result</span>
                <div className="flex-1 h-px" style={{backgroundColor: 'var(--amber-dim)'}} />
                <button
                  onClick={handleCopy}
                  className="p-1.5 transition-colors select-none"
                  style={{color: copied ? 'var(--lp-blue-bright)' : 'var(--text-muted)'}}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--lp-blue-bright)'}
                  onMouseLeave={e => e.currentTarget.style.color = copied ? 'var(--lp-blue-bright)' : 'var(--text-muted)'}
                  aria-label="Copy results"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="font-mono text-sm space-y-1 mb-4">
                <div className="flex items-baseline">
                  <span className="select-none w-44" style={{color: 'var(--text-muted)'}}>Required Square Side</span>
                  <span className="tabular-nums" style={{color: 'var(--amber-bright)'}}>{calculations.paperSide}</span>
                  <span className="text-stone-400 dark:text-stone-500 text-xs ml-1">{unitLabel}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="select-none w-44" style={{color: 'var(--text-muted)'}}>Paper Diagonal</span>
                  <span className="tabular-nums" style={{color: 'var(--amber-bright)'}}>{calculations.paperDiagonal}</span>
                  <span className="text-stone-400 dark:text-stone-500 text-xs ml-1">{unitLabel}</span>
                </div>
              </div>

              {/* Expert Mode breakdown */}
              {expertMode && (
                <ExpertMode dimensions={dimensions} calculations={calculations} unit={unit} />
              )}

              {/* Visual Diagram */}
              <div className="mt-6 mb-2">
                <WrapDiagram dimensions={dimensions} calculations={calculations} />
              </div>

              {/* Protocol Card */}
              <ProtocolCard calculations={calculations} unit={unit} dimensions={dimensions} />

            </motion.section>
          )}
        </AnimatePresence>

        {/* Protocol Description */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-t pt-8"
          style={{borderColor: 'var(--border)'}}
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xs tracking-[0.2em] uppercase select-none" style={{color: 'var(--text-muted)'}}>
              The Protocol
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-1 transition-colors select-none" style={{color: 'var(--text-muted)'}}>
                  <Info className="w-3 h-3" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#FAF9F7] dark:bg-[#1a1a18] border-stone-200 dark:border-stone-700 max-w-sm">
                <DialogHeader>
                  <DialogTitle className="font-serif text-lg text-stone-800 dark:text-stone-200 select-none">
                    About This Protocol
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed select-none">
                    The Diagonal Wrap Protocol is a geometric technique for wrapping rectangular parcels using a single square sheet of paper, oriented at 45°.
                  </p>
                  
                  <div className="font-mono text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/50 p-3 rounded select-none">
                    <p className="mb-1">paper_diagonal = √(w² + d²) + 2h</p>
                    <p>paper_side = paper_diagonal / √2</p>
                  </div>

                  <pre className="font-mono text-[10px] text-stone-400 dark:text-stone-500 leading-tight select-none">{`
        ·  ·  ·  ·  ◇  ·  ·  ·  ·
        ·  ·  ·  ╱  ·  ╲  ·  ·  ·
        ·  ·  ╱  ·  ·  ·  ╲  ·  ·
        ·  ╱  ·  ┌───┐  ·  ╲  ·
        ◇  ·  ·  │ ▪ │  ·  ·  ◇
        ·  ╲  ·  └───┘  ·  ╱  ·
        ·  ·  ╲  ·  ·  ·  ╱  ·  ·
        ·  ·  ·  ╲  ·  ╱  ·  ·  ·
        ·  ·  ·  ·  ◇  ·  ·  ·  ·
                  `}</pre>

                  <p className="text-xs text-stone-400 dark:text-stone-500 italic select-none">
                    Recovered from the Old North Workshop archives. Origin uncertain — likely predates 1920.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
            <p className="text-sm leading-relaxed mb-6 select-none" style={{fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontWeight: 300}}>
            Place the box centered on the square sheet. Rotate it 45 degrees. Fold each corner toward the center. The geometry locks the wrap into place with almost no trimming and often a single piece of tape.
          </p>
          <div className="flex items-center gap-3 text-xs select-none" style={{color: 'var(--text-muted)'}}>
            <span className="w-1 h-1 rounded-full" style={{backgroundColor: 'var(--amber-dim)'}} />
            <span>Old North Workshop archives</span>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 pt-8"
          style={{borderTop: '1px solid var(--border)'}}
        >
          <p className="text-[10px] text-center tracking-wide mb-2 select-none" style={{color: 'var(--text-muted)'}}>
            Filed under: Everyday Geometry · Protocol WRP‑01
          </p>
          <p className="text-[10px] text-center italic mb-3 select-none" style={{fontFamily: 'var(--font-body)', color: 'var(--text-dim)', fontWeight: 300}}>
            Rediscovered, not invented.
          </p>
          <p className="text-[9px] text-center select-none" style={{fontFamily: 'var(--font-mono)', color: 'var(--text-dim)'}}>
            v1.2 · Revised 2026.02.10
          </p>
        </motion.footer>
      </div>
    </div>
    </>
  );
}