import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CreditCard, CheckCircle, Loader2, Lock, Shield, Truck, Leaf, User, MapPin, Calendar, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../../lib/services/orderService';
import { toast } from 'sonner';

export function Checkout() {
  const { cart, getTotalPrice, clearCartAfterOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const totalPrice = getTotalPrice();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'El código postal es requerido';
    if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }
    if (!formData.cardName.trim()) newErrors.cardName = 'El nombre en la tarjeta es requerido';
    if (!formData.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Fecha de expiración inválida';
    }
    if (!formData.cvv.trim() || formData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }
    
    if (!user) {
      toast.error('Debes iniciar sesión para realizar un pedido');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (cart.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(3);

    try {
      console.log('Starting order creation...', {
        userId: user.id,
        itemsCount: cart.length,
        total: totalPrice
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Prepare order data
      const orderData = {
        user_id: user.id,
        items: cart,
        total: totalPrice,
        status: 'pending' as const,
        shipping_address: {
          address: formData.address,
          city: formData.city,
          zip: formData.zipCode
        }
      };

      console.log('Creating order with data:', orderData);

      // Save order to Supabase
      const createdOrder = await orderService.createOrder(orderData);
      
      console.log('Order created successfully:', createdOrder);

      setIsProcessing(false);
      setOrderComplete(true);
      setCurrentStep(4);
      clearCartAfterOrder();

      toast.success('¡Pedido procesado exitosamente!');
      
      // Redirect to home after 4 seconds
      setTimeout(() => {
        navigate('/');
      }, 4000);

    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
      setCurrentStep(1);
      
      // Detailed error handling
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          toast.error('Error: Pedido duplicado. Por favor intenta de nuevo.');
        } else if (error.message.includes('foreign key')) {
          toast.error('Error: Usuario no válido. Por favor inicia sesión nuevamente.');
        } else if (error.message.includes('permission')) {
          toast.error('Error: No tienes permisos para crear pedidos.');
        } else {
          toast.error(`Error al procesar el pedido: ${error.message}`);
        }
      } else {
        toast.error('Error desconocido al procesar el pedido. Por favor contacta soporte.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Formatear automáticamente el número de tarjeta en grupos de 4 dígitos
    if (name === 'cardNumber') {
      let numeros: string = value.replace(/\D/g, "");
      numeros = numeros.slice(0, 16);
      const bloques: string[] | null = numeros.match(/.{1,4}/g);
      const formateado: string = bloques ? bloques.join(" ") : "";
      setFormData({ ...formData, [name]: formateado });
    } else if (name === 'expiryDate') {
      // Formatear automáticamente la fecha de expiración (MM/AA)
      const cleanedValue = value.replace(/\D/g, '').slice(0, 4);
      
      if (cleanedValue.length >= 3) {
        const formattedValue = cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2);
        setFormData({ ...formData, [name]: formattedValue });
      } else {
        setFormData({ ...formData, [name]: cleanedValue });
      }
    } else if (name === 'cvv') {
      // Solo permitir números para CVV
      const cleanedValue = value.replace(/\D/g, '').slice(0, 4);
      setFormData({ ...formData, [name]: cleanedValue });
      setIsCardFlipped(cleanedValue.length > 0);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f4e6] to-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-8 text-center max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-[#2D5128]/10 rounded-full blur-3xl"></div>
              <ShoppingBag className="h-32 w-32 text-[#2D5128]/30 relative" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Tu carrito está vacío</h1>
              <p className="text-lg text-gray-600 max-w-md">
                Descubre nuestra increíble selección de productos de jardinería y transforma tu espacio en un paraíso verde
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#2D5128] hover:bg-[#1f3d1f] text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              <Leaf className="h-5 w-5" />
              Explorar Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f4e6] to-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-green-100 rounded-full blur-2xl"></div>
                <CheckCircle className="relative mx-auto h-24 w-24 text-green-600 animate-bounce" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-green-800">¡Pago Procesado con Éxito!</h1>
              <p className="mb-6 text-gray-600 text-lg">
                Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación en breve.
              </p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Truck className="h-6 w-6 text-green-600" />
                  <span className="text-green-700 font-bold text-lg">Pedido en camino</span>
                </div>
                <p className="text-green-600">
                  Tu pedido llegará en 24-48 horas hábiles
                </p>
                <p className="text-green-700 font-medium mt-3">
                  ¡Gracias por confiar en Jardín Verde! 🌿
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-2 bg-[#2D5128] hover:bg-[#1f3d1f] text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  Ver Mis Pedidos
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 border-2 border-[#2D5128] text-[#2D5128] hover:bg-[#2D5128] hover:text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  Seguir Comprando
                </Link>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic mt-6">
              Redirigiendo a la página principal...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4e6] to-white py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Progress Indicator */}
        <div className="mb-8 sm:mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all text-xs sm:text-sm ${
                  currentStep >= 1 ? 'bg-[#2D5128] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <div className="hidden sm:block text-sm font-medium">
                  <span className={currentStep >= 1 ? 'text-[#2D5128]' : 'text-gray-500'}>Información</span>
                </div>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2 sm:mx-4">
                <div className={`h-full transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-[#2D5128]' : 'bg-gray-200'
                }`} style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all text-xs sm:text-sm ${
                  currentStep >= 2 ? 'bg-[#2D5128] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <div className="hidden sm:block text-sm font-medium">
                  <span className={currentStep >= 2 ? 'text-[#2D5128]' : 'text-gray-500'}>Pago</span>
                </div>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2 sm:mx-4">
                <div className={`h-full transition-all duration-300 ${
                  currentStep >= 3 ? 'bg-[#2D5128]' : 'bg-gray-200'
                }`} style={{ width: currentStep >= 3 ? '100%' : '0%' }}></div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all text-xs sm:text-sm ${
                  currentStep >= 3 ? 'bg-[#2D5128] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                <div className="hidden sm:block text-sm font-medium">
                  <span className={currentStep >= 3 ? 'text-[#2D5128]' : 'text-gray-500'}>Confirmación</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">Finalizar Compra</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Completa tus datos de envío y pago para recibir tus productos de jardinería
          </p>
        </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#2D5128] to-[#1f3d1f] p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 text-white">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                  <h2 className="text-xl sm:text-2xl font-bold">Información de Envío</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Nombre Completo <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] transition-all ${
                          errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Fulano de tal"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] transition-all ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="fulano@gmail.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Teléfono <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] transition-all ${
                          errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="+1 829 987 8357"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Dirección <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] transition-all ${
                          errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Calle Principal, 123"
                      />
                    </div>
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Ciudad <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] transition-all ${
                          errors.city ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Republica Dominicana"
                      />
                    </div>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Código Postal <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] transition-all ${
                          errors.zipCode ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="28001"
                      />
                    </div>
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#2D5128] to-[#1f3d1f] p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 text-white">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                  <h2 className="text-xl sm:text-2xl font-bold">Información de Pago</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Número de Tarjeta <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        maxLength={19}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] transition-all ${
                          errors.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Nombre en la Tarjeta <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        placeholder="FULANO DE TAL"
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] transition-all ${
                          errors.cardName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.cardName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.cardName}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Fecha de Expiración <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/AA"
                          required
                          maxLength={5}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] transition-all ${
                            errors.expiryDate ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        CVV <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          required
                          maxLength={4}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] transition-all ${
                            errors.cvv ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>Tus datos están protegidos con encriptación SSL</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#2D5128] to-[#1f3d1f] hover:from-[#1f3d1f] hover:to-[#2D5128] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  Procesando Pago...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                  Pagar ${totalPrice.toFixed(2)}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 sm:top-8 space-y-4 sm:space-y-6">
            {/* User Profile */}
            {user && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#2D5128] to-[#1f3d1f] p-6">
                  <div className="flex items-center gap-3 text-white">
                    <User className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">Tu Perfil</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#2D5128]/10 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-[#2D5128]" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                          <span className="text-xs text-gray-500 capitalize">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <button
                        onClick={() => navigate('/profile')}
                        className="w-full flex items-center justify-center gap-2 border border-[#2D5128] text-[#2D5128] hover:bg-[#2D5128] hover:text-white px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        <User className="h-4 w-4" />
                        Ver Perfil Completo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#2D5128] to-[#1f3d1f] p-6">
                <h2 className="text-2xl font-bold text-white">Resumen del Pedido</h2>
              </div>
              <div className="p-6">
                <div className="mb-6 space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">x {item.quantity}</p>
                      </div>
                      <span className="font-bold text-[#2D5128]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Envío
                    </span>
                    <span className="font-medium text-green-600">Gratis</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-[#2D5128]">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gradient-to-r from-[#f0f4e6] to-[#e8f0e8] rounded-2xl p-6 border border-[#2D5128]/20">
              <h3 className="font-bold text-gray-900 mb-4">¿Por qué comprar con nosotros?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2D5128] rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Envío Rápido</p>
                    <p className="text-sm text-gray-600">Entrega en 24-48h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2D5128] rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Pago Seguro</p>
                    <p className="text-sm text-gray-600">100% protegido</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2D5128] rounded-full flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">100% Orgánico</p>
                    <p className="text-sm text-gray-600">Productos certificados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="text-center text-sm text-gray-500 bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="h-4 w-4" />
                <span className="font-medium">Sitio Seguro</span>
              </div>
              <p>Tus datos están encriptados y protegidos</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}