import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function PWARedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if app is running in standalone mode (PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      // Redirect to products page when app is installed
      navigate('/products', { replace: true });
    }
  }, [navigate]);

  // This component doesn't render anything visible
  return null;
}
