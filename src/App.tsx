import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import TermsModal from './components/TermsModal';
import StoresPage from './pages/stores/StoresPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ProductPage from './pages/ProductPage';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import { Product } from './types/product';
import { Community } from './types/community';
import { Store } from './types/store';
import config from './config';
import productData from './data/products.json';
import communityData from './data/community.json';
import storeData from './data/stores.json';
import ProductListPage from './pages/stores/products/ProductListPage';

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [community, setCommunity] = useState<Community | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        const communityId = params.get('comunidad') || 'mercado-comunidad';
        const storeId = params.get('tienda');

        // Find the community data
        const foundCommunity = communityData.communities.find(c => c.id === communityId);
        if (!foundCommunity) {
          setError('Comunidad no encontrada');
          setLoading(false);
          return;
        }
        setCommunity(foundCommunity);

        // Find store data if storeId is provided
        if (storeId) {
          const foundStore = storeData.stores.find(s => s.id === storeId);
          if (!foundStore) {
            setError('Tienda no encontrada');
            setLoading(false);
            return;
          }
          setStore(foundStore);
        }

        // Load products
        let filteredProducts;
        if (config.useApi) {
          const response = await fetch(config.apiUrl);
          const data = await response.json();
          filteredProducts = data.products;
        } else {
          filteredProducts = productData.products;
        }

        // Apply filters
        if (communityId !== 'mercado-comunidad') {
          filteredProducts = filteredProducts.filter(p => p.id_community === communityId);
        }
        
        if (storeId) {
          filteredProducts = filteredProducts.filter(p => p.id_store === storeId);
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error cargando los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header community={community} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
            <p className="text-gray-600">Verifica la URL e intenta nuevamente.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header community={community} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex-grow">
        {store ? (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{store.Name}</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              {store.DNI}
            </p>
          </div>
        ) : community && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{community.title}</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              {community.description}
            </p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ProductList products={products} />
        )}
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              © 2025 MercadoComunidad - Conecta, comercia y crece en tu comunidad.{' '}
              <button
                onClick={() => setIsTermsModalOpen(true)}
                className="text-blue-400 hover:text-blue-300 transition-colors underline"
              >
                Términos y Condiciones
              </button>
            </p>
          </div>
        </div>
      </footer>

      <TermsModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/stores/:id/products" element={<ProductListPage />} />
      </Routes>
    </Router>
  );
}

export default App;