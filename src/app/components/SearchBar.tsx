import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '../context/CartContext';

interface SearchBarProps {
  products: Product[];
  onSearch: (filteredProducts: Product[]) => void;
  placeholder?: string;
}

// Función de distancia de Levenshtein para búsqueda fuzzy
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Función de búsqueda fuzzy con autocorrección
function fuzzySearch(query: string, products: Product[]): Product[] {
  if (!query.trim()) return products;
  
  const normalizedQuery = query.toLowerCase().trim();
  const results: { product: Product; score: number }[] = [];
  
  products.forEach(product => {
    let bestScore = Infinity;
    let matchFound = false;
    
    // Buscar en nombre
    const nameDistance = levenshteinDistance(normalizedQuery, product.name.toLowerCase());
    if (nameDistance <= Math.max(2, normalizedQuery.length * 0.4)) {
      bestScore = Math.min(bestScore, nameDistance);
      matchFound = true;
    }
    
    // Buscar en descripción
    const descDistance = levenshteinDistance(normalizedQuery, product.description.toLowerCase());
    if (descDistance <= Math.max(3, normalizedQuery.length * 0.5)) {
      bestScore = Math.min(bestScore, descDistance);
      matchFound = true;
    }
    
    // Buscar en categoría
    const categoryDistance = levenshteinDistance(normalizedQuery, product.category.toLowerCase());
    if (categoryDistance <= Math.max(2, normalizedQuery.length * 0.4)) {
      bestScore = Math.min(bestScore, categoryDistance);
      matchFound = true;
    }
    
    // Búsqueda por palabras clave (búsqueda parcial)
    const queryWords = normalizedQuery.split(' ');
    const nameWords = product.name.toLowerCase().split(' ');
    const descWords = product.description.toLowerCase().split(' ');
    
    queryWords.forEach(queryWord => {
      nameWords.forEach((nameWord: string) => {
        if (nameWord.includes(queryWord) || queryWord.includes(nameWord)) {
          bestScore = Math.min(bestScore, 1);
          matchFound = true;
        }
      });
      
      descWords.forEach((descWord: string) => {
        if (descWord.includes(queryWord) || queryWord.includes(descWord)) {
          bestScore = Math.min(bestScore, 2);
          matchFound = true;
        }
      });
    });
    
    if (matchFound) {
      results.push({ product, score: bestScore });
    }
  });
  
  // Ordenar por relevancia (menor score = mejor coincidencia)
  results.sort((a, b) => a.score - b.score);
  
  return results.map(r => r.product);
}

export function SearchBar({ products, onSearch, placeholder = "Buscar productos..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generar sugerencias basadas en los productos
  const generateSuggestions = useMemo(() => {
    const allWords = new Set<string>();
    
    products.forEach(product => {
      // Agregar palabras del nombre
      product.name.toLowerCase().split(' ').forEach((word: string) => {
        if (word.length > 2) allWords.add(word);
      });
      
      // Agregar palabras de la descripción
      product.description.toLowerCase().split(' ').forEach((word: string) => {
        if (word.length > 3) allWords.add(word);
      });
      
      // Agregar categoría
      allWords.add(product.category.toLowerCase());
    });
    
    return Array.from(allWords).sort();
  }, [products]);

  useEffect(() => {
    if (query.length > 2) {
      const filtered = generateSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, generateSuggestions]);

  useEffect(() => {
    const results = fuzzySearch(query, products);
    onSearch(results);
  }, [query, products, onSearch]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
