import { Link } from 'react-router';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full">
      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1 sm:gap-2 pointer-events-none">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-[#2D5128] hover:bg-[#2D5128] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 pointer-events-auto"
            title="Agregar al carrito"
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-[#2D5128] hover:bg-[#2D5128] hover:text-white transition-all duration-300 transform hover:scale-110 pointer-events-auto"
            title="Ver detalles"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
          <button
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-[#2D5128] hover:bg-[#2D5128] hover:text-white transition-all duration-300 transform hover:scale-110 pointer-events-auto"
            title="Agregar a favoritos"
          >
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <Badge className="bg-[#2D5128]/90 text-white text-xs font-medium px-2 py-1 rounded-full">
            {product.category}
          </Badge>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              product.stock > 0 
                ? 'bg-[#2D5128] text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
            </span>
          </div>
        )}

        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#2D5128] transition-colors duration-300 line-clamp-2 hover:underline">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-xs text-gray-500 line-clamp-1 mt-1">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-sm sm:text-lg font-bold text-[#2D5128]">
              ${product.price.toFixed(2)}
            </span>
            {product.stock && product.stock > 0 && product.stock <= 5 && (
              <span className="text-xs text-orange-600 font-medium block">¡Últimas unidades!</span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-[#2D5128] hover:bg-[#1f3d1f] text-white p-1.5 sm:p-2 rounded-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
            title="Agregar al carrito"
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}