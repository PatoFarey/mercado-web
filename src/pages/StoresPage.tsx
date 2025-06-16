import React from 'react';
import Header from '../components/Header';
import { Store } from '../types/store';
import storeData from '../data/stores.json';
import communityData from '../data/community.json';
import { useNavigate } from 'react-router-dom';

const StoresPage: React.FC = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const communityId = params.get('comunidad');

  // Find community data
  const community = communityData.communities.find(c => c.id === communityId);

  // Filter stores that belong to the current community
  const communityStores = storeData.stores.filter(store => 
    store.communities.includes(communityId || '')
  );

  const handleStoreClick = (storeId: string) => {
    navigate(`/?comunidad=${communityId}&tienda=${storeId}`);
  };

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header community={null} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Comunidad no encontrada</h2>
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
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tiendas en {community.name}</h1>
          <p className="max-w-2xl mx-auto text-gray-600">{community.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityStores.map((store: Store) => (
            <div 
              key={store.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleStoreClick(store.id)}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{store.name}</h2>
                <p className="text-gray-600 mb-4">{store.description}</p>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Ver productos
                </button>
              </div>
            </div>
          ))}
        </div>

        {communityStores.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay tiendas disponibles en esta comunidad.</p>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              © 2025 MercadoComunidad - Conecta, comercia y crece en tu comunidad
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoresPage;