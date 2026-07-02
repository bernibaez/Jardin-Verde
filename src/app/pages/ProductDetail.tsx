import { useParams, Link } from 'react-router';
import { ShoppingCart, Star, ArrowLeft, Package, Shield, TruckIcon, Loader2 } from 'lucide-react';
import { Product, useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { getProductById } from '../data/mockProducts';

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = () => {
      if (!id) return;
      try {
        const data = getProductById(id);
        setProduct(data || null);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#2D5128]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl">Producto no encontrado</h1>
        <Link to="/products" className="text-[#2D5128] hover:text-[#1f3d1f]">
          Volver a productos
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/products"
        className="mb-8 inline-flex items-center gap-2 text-[#2D5128] hover:text-[#1f3d1f]"
      >
        <ArrowLeft className="h-5 w-5" />
        Volver a productos
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-lg bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 inline-block self-start rounded-full bg-[#e8f0e8] px-3 py-1 text-sm text-[#2D5128]">
            {product.category}
          </div>
          <h1 className="mb-4 text-4xl">{product.name}</h1>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">({product.rating})</span>
          </div>

          <p className="mb-6 text-gray-600">{product.description}</p>

          <div className="mb-6 text-4xl font-semibold">${product.price}</div>

          {/* Quantity Selector */}
          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm">Cantidad:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="mb-8 flex items-center justify-center gap-2 rounded-lg bg-[#2D5128] px-8 py-4 text-white transition-colors hover:bg-[#1f3d1f]"
          >
            <ShoppingCart className="h-5 w-5" />
            Agregar al Carrito
          </button>

          {/* Features */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-start gap-3">
              <TruckIcon className="h-6 w-6 text-[#2D5128]" />
              <div>
                <h3 className="font-semibold">Envío Gratis</h3>
                <p className="text-sm text-gray-600">Entrega en 24-48 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-[#2D5128]" />
              <div>
                <h3 className="font-semibold">Garantía de Calidad</h3>
                <p className="text-sm text-gray-600">Plantas saludables garantizadas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="h-6 w-6 text-[#2D5128]" />
              <div>
                <h3 className="font-semibold">Devoluciones Gratis</h3>
                <p className="text-sm text-gray-600">30 días para cambios y devoluciones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}