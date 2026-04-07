import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { productService } from '../../lib/services/productService';
import { Product } from '../context/CartContext';
import { Filter, Loader2, Package, Grid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Use search results if available, otherwise use all products
  let baseProducts = searchResults.length > 0 ? searchResults : products;
  
  let filteredProducts = selectedCategory === 'all'
    ? baseProducts
    : baseProducts.filter(p => p.category === selectedCategory);

  // Sort products
  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'name') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  const productCount = filteredProducts.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4e6] to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Catálogo de Productos</h1>
              <p className="text-gray-600 text-lg">
                Descubre la planta perfecta para cada rincón de tu hogar
              </p>
              {productCount > 0 && (
                <p className="text-sm text-[#2D5128] font-medium mt-2">
                  {productCount} {productCount === 1 ? 'producto encontrado' : 'productos encontrados'}
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBar 
                products={products} 
                onSearch={setSearchResults}
                placeholder="Buscar productos..."
              />
              
              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-[#2D5128] text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Vista de cuadrícula"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-[#2D5128] text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Vista de lista"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8 space-y-4">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 w-full justify-center"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros y Ordenamiento
          </button>

          <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white rounded-xl border border-gray-200 p-6 space-y-6`}>
            {/* Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#2D5128]" />
                Categorías
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-[#2D5128] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-[#2D5128]" />
                Ordenar por
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'default', label: 'Destacados' },
                  { value: 'name', label: 'Nombre A-Z' },
                  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
                  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
                  { value: 'rating', label: 'Mejor Valorados' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      sortBy === option.value
                        ? 'bg-[#2D5128] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="absolute inset-0 bg-[#2D5128]/20 rounded-full blur-3xl"></div>
              <Loader2 className="h-12 w-12 animate-spin text-[#2D5128] relative" />
            </div>
            <p className="text-gray-600 font-medium mt-4">Cargando los mejores productos para ti...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              : "space-y-4"
          }>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="max-w-md mx-auto">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-[#2D5128]/10 rounded-full blur-3xl"></div>
                <Package className="h-20 w-20 text-[#2D5128]/30 relative" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchResults.length > 0 ? 'No encontramos productos' : 'No hay productos en esta categoría'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchResults.length > 0 
                  ? 'Intenta con otros términos de búsqueda o revisa la ortografía.'
                  : 'Prueba seleccionando otra categoría o explora todos nuestros productos.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchResults([]);
                  }}
                  className="bg-[#2D5128] hover:bg-[#1f3d1f] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Ver Todos los Productos
                </button>
                {searchResults.length > 0 && (
                  <button
                    onClick={() => setSearchResults([])}
                    className="border border-[#2D5128] text-[#2D5128] hover:bg-[#2D5128] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Limpiar Búsqueda
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}