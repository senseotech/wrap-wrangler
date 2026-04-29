import { useEffect } from 'react';

export default function Settings() {
  // LPLWW-7: Dark mode only — force dark on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <div className="min-h-full px-6 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold text-stone-200 mb-8">Settings</h1>
        <div className="rounded-xl border border-stone-700 p-6 bg-stone-900/50">
          <h2 className="text-sm tracking-wide uppercase text-stone-400 mb-4">Appearance</h2>
          <p className="text-stone-400 text-sm">
            Wrap Wrangler runs in dark mode. This is intentional.
          </p>
        </div>
        <p className="text-center text-stone-600 text-xs mt-8 font-mono">
          Wrap Wrangler v1.2.0 · Lost Province Labs
        </p>
      </div>
    </div>
  );
}
