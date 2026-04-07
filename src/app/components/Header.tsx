import { Link, useNavigate } from 'react-router';
import { ShoppingCart, Search, User, Menu, X, LogOut, ShoppingBag, Sprout, Download } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-leaf-green rounded-full flex items-center justify-center">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-dark-green">Jardín Verde</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-leaf-green transition-colors">
              {t('navigation.home')}
            </Link>
            <Link to="/products" className="text-sm font-semibold text-gray-700 hover:text-leaf-green transition-colors">
              {t('navigation.products')}
            </Link>
            <Link to="/blog" className="text-sm font-semibold text-gray-700 hover:text-leaf-green transition-colors">
              {t('navigation.blog')}
            </Link>
            <Link to="/about" className="text-sm font-semibold text-gray-700 hover:text-leaf-green transition-colors">
              {t('navigation.about')}
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-leaf-green transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            {/* PWA Install Button */}
            {isInstallable && (
              <button
                onClick={handleInstall}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-leaf-green text-white rounded-full text-sm font-bold hover:bg-dark-green transition-all shadow-md hover:shadow-lg"
                title={t('navigation.installApp')}
              >
                <Download className="h-4 w-4" />
                <span>{t('navigation.installApp')}</span>
              </button>
            )}
            
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
                <DropdownMenuTrigger className="p-2 text-gray-600 hover:text-leaf-green transition-colors">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-6 border-t border-gray-100 bg-white">
            <div className="flex flex-col gap-6">
              <Link
                to="/"
                className="text-lg font-bold text-dark-green"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.home')}
              </Link>
              <Link
                to="/products"
                className="text-lg font-bold text-dark-green"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.products')}
              </Link>
              <Link
                to="/blog"
                className="text-lg font-bold text-dark-green"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.blog')}
              </Link>
              <Link
                to="/about"
                className="text-lg font-bold text-dark-green"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.about')}
              </Link>
              
              {/* PWA Install Button - Mobile */}
              {isInstallable && (
                <button
                  onClick={() => {
                    handleInstall();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-lg font-bold text-leaf-green pt-6 border-t border-gray-100"
                >
                  <Download className="h-5 w-5" />
                  {t('navigation.installApp')}
                </button>
              )}
              
              {isAuthenticated ? (
                <div className="pt-6 border-t border-gray-100">
                  <div className="text-sm text-gray-400 mb-1">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-4">
                    {user?.email}
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-lg font-bold text-dark-green mb-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    {t('navigation.profile')}
                  </Link>
                  <Link
                    to="/my-orders"
                    className="flex items-center gap-2 text-lg font-bold text-dark-green mb-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {t('navigation.orders')}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 text-lg font-bold text-dark-green mb-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('navigation.admin')}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-lg font-bold text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    {t('navigation.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-lg font-bold text-leaf-green pt-6 border-t border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  {t('navigation.login')}
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}