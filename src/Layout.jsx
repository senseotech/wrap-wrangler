import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { ChevronLeft, Settings, Calculator } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const isChildScreen = currentPageName !== 'Home' && currentPageName !== 'Settings';

  return (
    <div 
      className="min-h-screen bg-[#FAF9F7] dark:bg-[#1a1a18] flex flex-col"
      style={{ 
        overscrollBehavior: 'none',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)'
      }}
    >
      {/* Minimal Header - only show back button for child screens */}
      {isChildScreen && (
        <header className="sticky top-0 z-50 bg-[#FAF9F7]/90 dark:bg-[#1a1a18]/90 backdrop-blur-sm">
          <div 
            className="flex items-center px-6 h-12"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <Link 
              to={createPageUrl('Home')} 
              className="flex items-center gap-1 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors select-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs tracking-wide uppercase select-none">Back</span>
            </Link>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto" style={{ overscrollBehavior: 'none' }}>
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-[#FAF9F7]/95 dark:bg-[#1a1a18]/95 backdrop-blur-sm border-t border-stone-200 dark:border-stone-800 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around h-16">
          <Link 
            to={createPageUrl('Home')}
            className={`flex flex-col items-center gap-1 px-8 py-2 transition-colors select-none ${
              currentPageName === 'Home' 
                ? 'text-stone-800 dark:text-stone-200' 
                : 'text-stone-400 dark:text-stone-500'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span className="text-[10px] tracking-wide uppercase select-none">Calculator</span>
          </Link>
          <Link 
            to={createPageUrl('Settings')}
            className={`flex flex-col items-center gap-1 px-8 py-2 transition-colors select-none ${
              currentPageName === 'Settings' 
                ? 'text-stone-800 dark:text-stone-200' 
                : 'text-stone-400 dark:text-stone-500'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] tracking-wide uppercase select-none">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}