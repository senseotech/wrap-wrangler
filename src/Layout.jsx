import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { ChevronLeft, Settings } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const isHome = currentPageName === 'Home';
  const isChildScreen = !isHome;

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--void)',
        overscrollBehavior: 'none',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {/* Header — gear icon on Home, back button on child screens */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 h-12"
        style={{
          backgroundColor: 'transparent',
          paddingTop: isChildScreen ? 'env(safe-area-inset-top)' : undefined
        }}
      >
        {/* Left — back button for child screens, empty spacer for Home */}
        {isChildScreen ? (
          <Link
            to={createPageUrl('Home')}
            className="flex items-center gap-1 transition-colors select-none"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs tracking-wide uppercase">Back</span>
          </Link>
        ) : (
          <div />
        )}

        {/* Right — settings gear on Home only */}
        {isHome && (
          <Link
            to={createPageUrl('Settings')}
            className="p-1.5 transition-colors select-none"
            style={{ color: 'var(--text-dim)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-muted)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto" style={{ overscrollBehavior: 'none' }}>
        {children}
      </main>
    </div>
  );
}
