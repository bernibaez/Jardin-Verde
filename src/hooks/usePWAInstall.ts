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
  const [pwaReady, setPwaReady] = useState(false);

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
      
      // Immediate fallback for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      
      console.log('PWA Install Debug:', {
        isMobile,
        isHTTPS,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        userAgent: navigator.userAgent
      });
      
      if (isMobile && isHTTPS && !window.matchMedia('(display-mode: standalone)').matches) {
        console.log('PWA Install: Mobile device detected, showing install button immediately');
        setIsInstallable(true);
      }
      
      // Check if PWA criteria are met for install button
      const checkPWAInstallability = async () => {
        try {
          // Wait for service worker to be ready
          if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            setPwaReady(true);
            
            // Check if user has sufficient engagement (heuristic)
            const sessionTime = Date.now() - performance.timing.navigationStart;
            const hasMinimumEngagement = sessionTime > 5000; // 5 seconds (reduced from 30)
            
            if (hasMinimumEngagement && !window.matchMedia('(display-mode: standalone)').matches) {
              // Fallback: show install button even if beforeinstallprompt hasn't fired
              // Some browsers may not fire the event reliably
              setIsInstallable(true);
              console.log('PWA Install: PWA criteria met, showing install button as fallback');
            }
          }
        } catch (error) {
          console.log('PWA Install: Error checking PWA criteria', error);
        }
      };
      
      // Check installability after service worker registration (reduced from 5000ms to 2000ms)
      setTimeout(checkPWAInstallability, 2000);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) {
      // Fallback: try to trigger installation manually
      if (pwaReady && !isInstalled) {
        console.log('PWA Install: No prompt available, trying manual installation');
        
        // For Android Chrome, we can try to trigger the install
        if (navigator.userAgent.includes('Android') && 'serviceWorker' in navigator) {
          // Show instructions for manual installation
          return { 
            success: false, 
            message: 'To install: Tap the menu button (3 dots) > "Add to Home screen"' 
          };
        }
        
        // For iOS, we need to show instructions
        if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
          return { 
            success: false, 
            message: 'To install: Tap Share button > "Add to Home Screen"' 
          };
        }
      }
      
      return { success: false, message: 'Installation not available yet. Please try again later.' };
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
    pwaReady,
    install,
  };
}
