import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types/product';
import { Search, Loader2 } from 'lucide-react';
import config from '../config';
import axios from 'axios';

interface ProductListProps {
  // Ya no necesitamos recibir products como prop
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ProductList: React.FC<ProductListProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Input temporal
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useRef<HTMLDivElement | null>(null);
  const productsPerPage = 20;

  // Función para obtener productos de la API
  const fetchProducts = useCallback(async (page: number, reset: boolean = false) => {
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);

      const headers = {
        Authorization: `Bearer ${config.PUBLIC_TOKEN}`,
      };

      const params = new URLSearchParams({
        page: page.toString(),
        limit: productsPerPage.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (selectedCategory) {
        params.append('categoria', selectedCategory);
      }

      const response = await axios.get<ProductsResponse>(
        `${config.API_URL}/public/products?${params.toString()}`,
        { headers }
      );

      const data = response.data;
      
      if (reset) {
        setProducts(data.products);
      } else {
        setProducts(prev => [...prev, ...data.products]);
      }

      setTotalProducts(data.total);
      setHasMore(page < data.totalPages);
      setCurrentPage(page);

      // Extraer categorías únicas de todos los productos cargados
      if (reset || categories.length === 0) {
        const uniqueCategories = Array.from(
          new Set([...data.products.map(product => product.categoria)])
        );
        setCategories(uniqueCategories);
      }

    } catch (err: any) {
      console.error("Error cargando productos:", err);
      if (err.response?.status === 404) {
        setError("No se encontraron productos.");
        setHasMore(false);
      } else {
        setError("Error al cargar los productos. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, loading, categories.length]);

  // Cargar productos iniciales
  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [searchTerm, selectedCategory]);

  // Configurar intersection observer para scroll infinito
  const lastProductElementCallback = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchProducts(currentPage + 1);
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
    
    if (node) observerRef.current.observe(node);
    lastProductElementRef.current = node;
  }, [loading, hasMore, currentPage, fetchProducts]);

  // Limpiar observer al desmontar
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchInput(''); // Clear search input when changing category
    setSearchTerm(''); // Clear actual search term
  };

  const handleSearchClick = () => {
    setSearchTerm(searchInput);
    setSelectedCategory(''); // Clear category when searching
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    // Si el input está vacío, limpiar la búsqueda inmediatamente
    if (value === '') {
      setSearchTerm('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <div className="w-full">
      {/* Barra de búsqueda y filtros */}
      <div className="max-w-4xl mx-auto mb-8 space-y-4">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Buscar por título, descripción o tienda..."
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button
            onClick={handleSearchClick}
            disabled={loading}
            className={`px-6 py-2 font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-white whitespace-nowrap ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {/* Filtros de categoría */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas las categorías
            </button>
            {categories.slice(0,5).map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Información de resultados */}
        {(searchTerm || selectedCategory) && (
          <div className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg">
            <div className="text-sm text-blue-700">
              {totalProducts > 0 ? (
                <>
                  Mostrando {products.length} de {totalProducts} productos
                  {searchTerm && ` para "${searchTerm}"`}
                  {selectedCategory && ` en "${selectedCategory}"`}
                </>
              ) : (
                'No se encontraron productos'
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Lista de productos */}
      {error ? (
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600">No se han encontrado productos...</p>
          </div>
        </div>
      ) : products.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory
                ? 'Intenta con diferentes términos de búsqueda o categorías.'
                : 'No hay productos disponibles en este momento.'}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todos los productos
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => {
              // Asignar ref al último elemento para el scroll infinito
              if (index === products.length - 1) {
                return (
                  <div key={product.id} ref={lastProductElementCallback}>
                    <ProductCard product={product} />
                  </div>
                );
              }
              return <ProductCard key={product.id} product={product} />;
            })}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-blue-600 font-medium">
                Cargando más productos...
              </span>
            </div>
          )}

          {/* Mensaje cuando no hay más productos */}
          {!hasMore && products.length > 0 && (
            <div className="text-center py-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-gray-600 text-sm">
                  Has visto todos los productos disponibles ({totalProducts} en total)
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;