import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X, ShoppingBag, Heart, Settings, LogOut, Camera, Package, Star, Trash2, Eye, EyeOff, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService, Order } from '../../lib/services/orderService';
import { profileService, UserProfile, UserPreferences } from '../../lib/services/profileService';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export function Profile() {
  const { user, logout, supabaseUser } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    city: userProfile?.city || '',
    zipCode: userProfile?.zipCode || '',
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      // Load user profile
      const profile = await profileService.getProfile(user.id);
      setUserProfile(profile);
      
      // Load user preferences
      const userPrefs = await profileService.getPreferences(user.id);
      setPreferences(userPrefs);
      
      // Load orders
      await loadOrders();
      
      // Load favorites (mock data for now)
      setFavorites([
        { id: 1, name: 'Maceta Cerámica', price: 18.50, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d434?w=400' },
        { id: 2, name: 'Fertilizante Líquido', price: 15.99, image: 'https://images.unsplash.com/photo-1585859668131-9150114940b3?w=400' },
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadOrders = async () => {
    if (!user) return;
    
    setLoadingOrders(true);
    try {
      const userOrders = await orderService.getUserOrders(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Error al cargar los pedidos');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userProfile) {
      setFormData({
        name: userProfile.name || user?.name || '',
        email: userProfile.email || user?.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        zipCode: userProfile.zipCode || '',
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await profileService.updateProfile(user.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
      });
      
      await loadUserData();
      toast.success('Perfil actualizado exitosamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = async (key: keyof UserPreferences, value: boolean) => {
    if (!user || !preferences) return;
    
    try {
      const updatedPrefs = await profileService.updatePreferences(user.id, {
        [key]: value
      });
      setPreferences(updatedPrefs);
      toast.success('Preferencias actualizadas');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Error al actualizar preferencias');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (file.size > maxSize) {
      toast.error('La imagen no puede ser mayor a 5MB');
      return;
    }
    
    try {
      const avatarUrl = await profileService.uploadAvatar(user.id, file);
      await profileService.updateProfile(user.id, { avatar_url: avatarUrl });
      await loadUserData();
      toast.success('Foto de perfil actualizada');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Error al actualizar la foto de perfil');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Contraseña actualizada exitosamente');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error al cambiar la contraseña');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      await profileService.deleteAccount(user.id);
      toast.success('Cuenta eliminada exitosamente');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error al eliminar la cuenta');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4e6] to-white py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#2D5128] to-[#1f3d1f] p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 overflow-hidden">
                    {userProfile?.avatar_url ? (
                      <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer">
                    <Camera className="h-4 w-4 text-[#2D5128]" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-center md:text-left text-white flex-1">
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <p className="text-white/80 mb-2">{user.email}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-purple-400' : 'bg-green-400'}`}></div>
                    <span className="text-sm capitalize">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all backdrop-blur-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'info' 
                      ? 'bg-[#2D5128] text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5" />
                  Información Personal
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'orders' 
                      ? 'bg-[#2D5128] text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  Mis Pedidos
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'favorites' 
                      ? 'bg-[#2D5128] text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                  Favoritos
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'settings' 
                      ? 'bg-[#2D5128] text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  Configuración
                </button>
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Resumen de Actividad</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Pedidos</span>
                  <span className="font-bold text-[#2D5128]">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Artículos en Carrito</span>
                  <span className="font-bold text-[#2D5128]">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Favoritos</span>
                  <span className="font-bold text-[#2D5128]">{favorites.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Miembro desde</span>
                  <span className="font-bold text-[#2D5128]">
                    {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : 'Ene 2024'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Personal Information Tab */}
            {activeTab === 'info' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Información Personal</h2>
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 border border-[#2D5128] text-[#2D5128] hover:bg-[#2D5128] hover:text-white rounded-lg transition-all"
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2D5128] text-white hover:bg-[#1f3d1f] rounded-lg transition-all disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        {isLoading ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User className="h-4 w-4" />
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] disabled:bg-gray-50 disabled:border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] disabled:bg-gray-50 disabled:border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Phone className="h-4 w-4" />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+34 600 000 000"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] disabled:bg-gray-50 disabled:border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar className="h-4 w-4" />
                      Fecha de Registro
                    </label>
                    <input
                      type="text"
                      value={new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
                      disabled
                      className="w-full px-4 py-3 border rounded-lg bg-gray-50 border-gray-200"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin className="h-4 w-4" />
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Calle Principal, 123"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] disabled:bg-gray-50 disabled:border-gray-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h2>
                {loadingOrders ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5128] mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando pedidos...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No tienes pedidos aún</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="inline-flex items-center gap-2 bg-[#2D5128] hover:bg-[#1f3d1f] text-white px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      Ver Productos
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold text-gray-900">Pedido #{order.id.slice(-8)}</p>
                            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                            <p className="text-lg font-bold text-[#2D5128] mt-2">${order.total.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-600 mb-2">{order.items.length} artículos</p>
                          <div className="flex gap-2">
                            <button className="text-sm text-[#2D5128] hover:underline">Ver detalles</button>
                            <span className="text-gray-300">•</span>
                            <button className="text-sm text-[#2D5128] hover:underline">Comprar de nuevo</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Favoritos</h2>
                {loadingFavorites ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5128] mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando favoritos...</p>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No tienes productos favoritos aún</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="inline-flex items-center gap-2 bg-[#2D5128] hover:bg-[#1f3d1f] text-white px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      Descubrir Productos
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
                        <div className="aspect-video overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-[#2D5128]">${item.price.toFixed(2)}</span>
                            <div className="flex gap-2">
                              <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                <Heart className="h-4 w-4 fill-current" />
                              </button>
                              <button className="p-2 text-[#2D5128] hover:bg-[#2D5128]/10 rounded-lg transition-all">
                                <ShoppingCart className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h2>
                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Notificaciones</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-600">Email promocionales</span>
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-[#2D5128]" 
                          checked={preferences?.email_promotions || false}
                          onChange={(e) => handlePreferenceChange('email_promotions', e.target.checked)}
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-600">Notificaciones de pedidos</span>
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-[#2D5128]" 
                          checked={preferences?.order_notifications || false}
                          onChange={(e) => handlePreferenceChange('order_notifications', e.target.checked)}
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-600">Newsletter</span>
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-[#2D5128]" 
                          checked={preferences?.newsletter || false}
                          onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="border-b pb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Privacidad</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-600">Perfil público</span>
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-[#2D5128]" 
                          checked={preferences?.public_profile || false}
                          onChange={(e) => handlePreferenceChange('public_profile', e.target.checked)}
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-600">Mostrar actividad</span>
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-[#2D5128]" 
                          checked={preferences?.show_activity || false}
                          onChange={(e) => handlePreferenceChange('show_activity', e.target.checked)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="border-b pb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Idioma y Región</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Idioma de la aplicación
                        </label>
                        <div className="flex items-center gap-3">
                          <LanguageSwitcher />
                          <span className="text-sm text-gray-500">
                            Selecciona tu idioma preferido para la interfaz
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Cuenta</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-between"
                      >
                        <span>Cambiar Contraseña</span>
                        <Settings className="h-4 w-4 text-gray-400" />
                      </button>
                      <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full text-left px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all flex items-center justify-between"
                      >
                        <span>Eliminar Cuenta</span>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Cambiar Contraseña</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-2 bg-[#2D5128] text-white hover:bg-[#1f3d1f] rounded-lg transition-all"
              >
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-red-600">Eliminar Cuenta</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900 mb-1">Esta acción es irreversible</p>
                    <p className="text-sm text-red-700">
                      Al eliminar tu cuenta, se perderán permanentemente todos tus datos, pedidos y preferencias.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  ¿Estás seguro de que deseas eliminar tu cuenta permanentemente?
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all"
              >
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
