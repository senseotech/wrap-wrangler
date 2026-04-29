import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { base44 } from '@/api/base44Client';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
        }
      } catch (e) {
        // User not authenticated
      }
    };
    checkAuth();

    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Note: Account deletion would typically be handled by a backend function
      // For now, we'll just log the user out
      await base44.auth.logout('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-full px-6 py-8">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Settings</h1>

          {/* Theme Selection */}
          <Card className="p-6 bg-white dark:bg-gray-800 border-0 shadow-lg dark:shadow-gray-900/50 rounded-2xl mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance</h2>
            <div className="flex gap-3">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'system', icon: Monitor, label: 'System' }
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all select-none ${
                    theme === value
                      ? 'border-[#F97066] bg-[#F97066]/5 dark:bg-[#F97066]/10'
                      : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${theme === value ? 'text-[#F97066]' : 'text-gray-500 dark:text-gray-400'}`} />
                  <span className={`text-sm font-medium ${theme === value ? 'text-[#F97066]' : 'text-gray-600 dark:text-gray-300'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Account Section - Only show if authenticated */}
          {user && (
            <Card className="p-6 bg-white dark:bg-gray-800 border-0 shadow-lg dark:shadow-gray-900/50 rounded-2xl">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Account</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Signed in as {user.email}
              </p>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => base44.auth.logout('/')}
                  className="w-full justify-start text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 select-none"
                >
                  Log out
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 select-none"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 dark:text-white">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Delete Account
                      </AlertDialogTitle>
                      <AlertDialogDescription className="dark:text-gray-400">
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 select-none">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white select-none"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          )}

          {/* App Info */}
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">
            WrapMaster v1.0.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}