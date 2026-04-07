import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      console.log('PWA Install: Installation prompt available');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA Install: App successfully installed');
    };

    // Check if app is already installed
    if ('serviceWorker' in navigator) {
      // Check if running in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        console.log('PWA Install: App is already installed (standalone mode)');
      }
    }

    // DEBUG: Always show install button in development
    if (process.env.NODE_ENV === 'development') {
      console.log('PWA Install: Development mode detected, showing install button for testing');
      setIsInstallable(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    // In development, simulate installation
    if (process.env.NODE_ENV === 'development') {
      console.log('PWA Install: Development mode - simulating installation');
      setIsInstalled(true);
      setIsInstallable(false);
      return { success: true, message: '¡Gracias por instalar Jardín Verde!' };
    }

    if (!deferredPrompt) {
      console.log('PWA Install: No installation prompt available');
      return { success: false, message: 'Installation not available' };
    }

    try {
      // Show the installation prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        console.log('PWA Install: User accepted the installation');
        return { success: true, message: '¡Gracias por instalar Jardín Verde!' };
      } else {
        console.log('PWA Install: User dismissed the installation');
        return { success: false, message: 'Installation cancelled' };
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return { success: false, message: 'Installation failed' };
    }
  };

  return {
    isInstallable,
    isInstalled,
    install,
  };
}
