import { Link, useLocation } from 'react-router';
import { Home, ShoppingBag, FileText, User, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { InstallInstructions } from './IOSInstallInstructions';
import { useState } from 'react';

export function MobileNavigation() {
  const { t } = useTranslation();
  const { getTotalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInstallable, install } = usePWAInstall();
  const location = useLocation();
  const totalItems = getTotalItems();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  const handleInstall = async () => {
    // Check if running on iOS or Android
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    console.log('MobileNavigation handleInstall - isIOS:', isIOS, 'isAndroid:', isAndroid, 'userAgent:', navigator.userAgent);
    
    if (isIOS || isAndroid) {
      console.log('Showing installation instructions modal in MobileNavigation');
      setShowIOSInstructions(true);
      return;
    }
    
    const result = await install();
    if (result.success) {
      // Toast is handled in Header component
      console.log(result.message);
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: t('navigation.home'), active: location.pathname === '/' },
    { path: '/products', icon: ShoppingBag, label: t('navigation.products'), active: location.pathname === '/products' },
    { path: isAuthenticated ? '/my-orders' : '/login', icon: ShoppingBag, label: t('navigation.orders'), active: location.pathname === '/my-orders' },
    { path: '/blog', icon: FileText, label: t('navigation.blog'), active: location.pathname === '/blog' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors ${
              item.active
                ? 'text-leaf-green'
                : 'text-gray-500 hover:text-leaf-green'
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
        
        {/* Cart Icon */}
        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors relative ${
            location.pathname === '/cart' ? 'text-leaf-green' : 'text-gray-500 hover:text-leaf-green'
          }`}
        >
          <ShoppingCart className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-medium whitespace-nowrap">{t('navigation.cart')}</span>
          {totalItems > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-leaf-green text-[10px] text-white">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Profile Icon */}
        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors ${
            location.pathname === '/profile' || location.pathname === '/login' ? 'text-leaf-green' : 'text-gray-500 hover:text-leaf-green'
          }`}
        >
          <User className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-medium whitespace-nowrap">
            {isAuthenticated ? t('navigation.profile') : t('navigation.login')}
          </span>
        </Link>
      </div>
      
      {/* iOS/Android Installation Instructions Modal */}
      {showIOSInstructions && (
        <InstallInstructions 
          onClose={() => setShowIOSInstructions(false)} 
          isAndroid={/Android/.test(navigator.userAgent)}
          onInstall={install}
        />
      )}
    </div>
  );
}
