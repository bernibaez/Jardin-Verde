import { Link, useLocation } from 'react-router';
import { Home, ShoppingBag, FileText, User, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export function MobileNavigation() {
  const { t } = useTranslation();
  const { getTotalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInstallable, install } = usePWAInstall();
  const location = useLocation();
  const totalItems = getTotalItems();

  const handleInstall = async () => {
    const result = await install();
    if (result.success) {
      // Toast is handled in Header component
      console.log(result.message);
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: t('navigation.home'), active: location.pathname === '/' },
    { path: '/products', icon: ShoppingBag, label: t('navigation.products'), active: location.pathname === '/products' },
    { path: '/blog', icon: FileText, label: t('navigation.blog'), active: location.pathname === '/blog' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
              item.active
                ? 'text-leaf-green'
                : 'text-gray-500 hover:text-leaf-green'
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
        
        {/* Cart Icon */}
        <Link
          to="/cart"
          className="flex flex-col items-center justify-center py-2 px-3 rounded-lg text-gray-500 hover:text-leaf-green transition-colors relative"
        >
          <ShoppingCart className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">{t('navigation.cart')}</span>
          {totalItems > 0 && (
            <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-leaf-green text-[10px] text-white">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Profile/Install Icon */}
        {isInstallable ? (
          <button
            onClick={handleInstall}
            className="flex flex-col items-center justify-center py-2 px-3 rounded-lg text-gray-500 hover:text-leaf-green transition-colors"
          >
            <svg className="h-5 w-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-medium">{t('navigation.installApp')}</span>
          </button>
        ) : (
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="flex flex-col items-center justify-center py-2 px-3 rounded-lg text-gray-500 hover:text-leaf-green transition-colors"
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">
              {isAuthenticated ? t('navigation.profile') : t('navigation.login')}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
