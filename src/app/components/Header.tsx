import { Link, useNavigate } from 'react-router';
import { ShoppingCart, Search, User, LogOut, ShoppingBag, Sprout, Download } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const { t } = useTranslation();
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleInstall = async () => {
    const result = await install();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-leaf-green rounded-full flex items-center justify-center">
              <Sprout className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
            <span className="text-lg md:text-2xl font-bold text-dark-green">Jardín Verde</span>
            
            {/* PWA Install Button - Mobile only, next to header */}
            {isInstallable && (
              <button
                onClick={handleInstall}
                className="flex md:hidden items-center gap-1 px-2 py-1 bg-leaf-green text-white rounded-full text-xs font-bold hover:bg-dark-green transition-all shadow-md hover:shadow-lg ml-2"
                title={t('navigation.installApp')}
              >
                <Download className="h-3 w-3" />
                <span>{t('navigation.installApp')}</span>
              </button>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-leaf-green transition-colors">
              {t('navigation.home')}
            </Link>
            <Link to="/products" className="text-sm font-semibold text-gray-700 hover:text-leaf-green transition-colors">
              {t('navigation.products')}
            </Link>
            
            {/* PWA Install Button - Desktop, next to products */}
            {isInstallable && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 px-3 py-1.5 bg-leaf-green text-white rounded-full text-xs font-bold hover:bg-dark-green transition-all shadow-md hover:shadow-lg"
                title={t('navigation.installApp')}
              >
                <Download className="h-3 w-3" />
                <span>Instalar para móvil</span>
              </button>
            )}
            
            <Link to="/blog" className="text-sm font-semibold text-gray-700 hover:text-leaf-green transition-colors">
              {t('navigation.blog')}
            </Link>
            <Link to="/about" className="text-sm font-semibold text-gray-700 hover:text-leaf-green transition-colors">
              {t('navigation.about')}
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-leaf-green transition-colors hidden md:block">
              <Search className="h-5 w-5" />
            </button>
            
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-leaf-green transition-colors group">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-leaf-green text-[10px] text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:flex p-2 text-gray-600 hover:text-leaf-green transition-colors">
                  <User className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{t('navigation.profile')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    {t('navigation.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/my-orders')}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {t('navigation.orders')}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/admin')}>
                      {t('navigation.admin')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('navigation.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="hidden md:flex items-center justify-center px-6 py-2.5 bg-leaf-green text-white rounded-full text-sm font-bold hover:bg-dark-green transition-all shadow-md hover:shadow-lg">
                {t('navigation.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}