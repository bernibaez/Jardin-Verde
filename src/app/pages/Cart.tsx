import { Link } from 'react-router';
import { Trash2, Plus, Minus, ShoppingBag, Truck, Shield, Leaf, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCartTemp } = useCart();
  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 100 ? 0 : 15;
  const finalTotal = totalPrice + shippingCost;

  if (cart.length === 0) {
    // Check if there are saved items in localStorage
    const hasSavedItems = typeof window !== 'undefined' && localStorage.getItem('jardin-verde-cart');
    
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
                {hasSavedItems 
                  ? "Tus productos están guardados y volverán a aparecer cuando los agregues nuevamente."
                  : "Descubre nuestra increíble selección de productos de jardinería y transforma tu espacio en un paraíso verde"
                }
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#2D5128] hover:bg-[#1f3d1f] text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                <Leaf className="h-5 w-5" />
                Explorar Productos
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 border-2 border-[#2D5128] text-[#2D5128] hover:bg-[#2D5128] hover:text-white px-8 py-4 rounded-full font-bold transition-all"
              >
                Volver al Inicio
              </Link>
            </div>
            {hasSavedItems && (
              <div className="bg-soft-green rounded-xl p-4 mt-4">
                <p className="text-sm text-dark-green font-medium">
                  <strong>¡Buenas noticias!</strong> Tus productos favoritos están guardados en este dispositivo. 
                  Cuando agregues productos al carrito, se recordarán para tu próxima visita.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f4e6] to-white py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">Carrito de Compras</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600">
            <span>{cart.length} {cart.length === 1 ? 'producto' : 'productos'}</span>
            <span className="hidden sm:inline">•</span>
            <span>Total: ${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {cart.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="flex gap-4 p-4 sm:p-6">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 group-hover:scale-105 transition-transform duration-300">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {item.quantity > 1 && (
                      <div className="absolute -top-2 -right-2 bg-[#2D5128] text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.quantity}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/product/${item.id}`}
                            className="text-lg sm:text-xl font-bold text-gray-900 hover:text-[#2D5128] transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 font-medium">{item.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xl sm:text-2xl font-black text-[#2D5128]">
                              ${item.price.toFixed(2)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">c/u</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">Cantidad:</span>
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-bold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="text-xl sm:text-2xl font-black text-[#2D5128]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-200">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-[#2D5128] hover:text-[#1f3d1f] font-medium transition-colors order-2 sm:order-1"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Continuar Comprando
              </Link>
              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    clearCartTemp();
                  }
                }}
                className="text-red-500 hover:text-red-600 font-medium transition-colors order-1 sm:order-2"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 sm:top-8 space-y-4 sm:space-y-6">
              {/* Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Resumen del Pedido</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} productos)</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Envío
                    </span>
                    <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                      {shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  {shippingCost > 0 && (
                    <div className="bg-[#f0f4e6] p-3 rounded-lg text-sm text-[#2D5128]">
                      🎁 Agrega ${ (100 - totalPrice).toFixed(2) } más para obtener envío gratis
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-[#2D5128]">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="mt-4 sm:mt-6 w-full bg-[#2D5128] hover:bg-[#1f3d1f] text-white py-3 sm:py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Proceder al Pago
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-[#f0f4e6] to-[#e8f0e8] rounded-2xl p-4 sm:p-6 border border-[#2D5128]/20">
                <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">¿Por qué comprar con nosotros?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2D5128] rounded-full flex items-center justify-center">
                      <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Envío Rápido</p>
                      <p className="text-xs sm:text-sm text-gray-600">Entrega en 24-48h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2D5128] rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Garantía de Calidad</p>
                      <p className="text-xs sm:text-sm text-gray-600">30 días de devolución</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2D5128] rounded-full flex items-center justify-center">
                      <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">100% Orgánico</p>
                      <p className="text-xs sm:text-sm text-gray-600">Productos certificados</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="text-center text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="h-4 w-4" />
                  <span>Pago Seguro</span>
                </div>
                <p>Tus datos están protegidos con encriptación SSL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}