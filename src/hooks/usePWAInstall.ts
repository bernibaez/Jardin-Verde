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
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      
      console.log('PWA Install Debug:', {
        isMobile,
        isIOS,
        isHTTPS,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        userAgent: navigator.userAgent
      });
      
      // For iOS, always show install button if not installed and serving over HTTPS
      if (isIOS && isHTTPS && !window.matchMedia('(display-mode: standalone)').matches) {
        console.log('PWA Install: iOS device detected, showing install button');
        setIsInstallable(true);
      }
      
      // For Android, show install button if HTTPS and not installed
      else if (isMobile && isHTTPS && !window.matchMedia('(display-mode: standalone)').matches) {
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
            
            if (hasMinimumEngagement && !window.matchMedia('(display-mode: standalone)').matches && !isIOS) {
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
    // Check if running on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // For iOS, show instructions for manual installation
      return { 
        success: false, 
        message: 'Para instalar en iOS: Toca el botón Compartir (cuadro con flecha) en Safari > "Añadir a pantalla de inicio"' 
      };
    }
    
    if (!deferredPrompt) {
      // Fallback: try to trigger installation manually for Android
      if (pwaReady && !isInstalled) {
        console.log('PWA Install: No prompt available, trying manual installation');
        
        // For Android Chrome, we can try to trigger the install
        if (navigator.userAgent.includes('Android') && 'serviceWorker' in navigator) {
          // Show instructions for manual installation
          return { 
            success: false, 
            message: 'Para instalar: Toca el menú (3 puntos) > "Instalar aplicación" o "Añadir a pantalla de inicio"' 
          };
        }
      }
      
      return { success: false, message: 'Instalación no disponible aún. Intenta de nuevo más tarde.' };
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
        return { success: false, message: 'Instalación cancelada' };
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return { success: false, message: 'Error en la instalación' };
    }
  };

  return {
    isInstallable,
    isInstalled,
    pwaReady,
    install,
  };
}
