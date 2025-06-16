import React from 'react';
import { Store } from '../types/store';

interface StoresMenuProps {
  stores: Store[];
  selectedStore: string | null;
}

const StoresMenu: React.FC<StoresMenuProps> = ({ stores, selectedStore }) => {
  const handleStoreClick = (storeId: string) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('tienda', storeId);
    window.location.href = currentUrl.toString();
  };

  const handleAllStoresClick = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('tienda');
    window.location.href = currentUrl.toString();
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Tiendas</h2>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !selectedStore 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={handleAllStoresClick}
        >
          Todas las tiendas
        </button>
        {stores.map((store) => (
          <button
            key={store.id}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStore === store.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleStoreClick(store.id)}
          >
            {store.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoresMenu;