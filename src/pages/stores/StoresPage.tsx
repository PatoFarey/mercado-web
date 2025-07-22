import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Store } from '../../types/store';
import { Community } from '../../types/community';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import axios from 'axios';

const StoresPage: React.FC = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const communityId = params.get('comunidad');

  const [community, setCommunity] = useState<Community | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunityAndStores = async () => {
    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${config.PUBLIC_TOKEN}`,
      };

      const communityResponse = await axios.get(
        `${config.API_URL}/public/communities/${communityId}`,
        { headers }
      );
      const storesResponse = await axios.get(
        `${config.API_URL}/public/stores?comunidad=${communityId}`,
        { headers }
      );
      console.log(storesResponse);
      setCommunity(communityResponse.data);
      setStores(storesResponse.data.stores || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Hubo un problema al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchCommunityAndStores();
    } else {
      setLoading(false);
      setError("No se proporcionó ID de comunidad");
    }
  }, [communityId]);

  const handleStoreClick = (storeId: string) => {
    navigate(`/stores/${storeId}/products`);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-2.297 0-4.163-1.866-4.163-4.163 0-2.297 1.866-4.163 4.163-4.163 2.297 0 4.163 1.866 4.163 4.163 0 2.297-1.866 4.163-4.163 4.163zm7.718 0c-2.297 0-4.163-1.866-4.163-4.163 0-2.297 1.866-4.163 4.163-4.163 2.297 0 4.163 1.866 4.163 4.163 0 2.297-1.866 4.163-4.163 4.163z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header community={community} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex-grow">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-blue-600 font-medium text-lg">Cargando tiendas...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12 pt-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Tiendas en {community?.name}
              </h1>
              <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
                {community?.description}
              </p>
              <div className="mt-6 flex items-center justify-center">
                <div className="bg-blue-50 px-4 py-2 rounded-full">
                  <span className="text-blue-600 font-semibold text-sm">
                    {stores.length} tienda{stores.length !== 1 ? 's' : ''} disponible{stores.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stores.map((store: Store) => (
                <div
                  key={store.ID}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden transform hover:-translate-y-1"
                  onClick={() => handleStoreClick(store.LinkStore)}
                >
                  <div className="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                    {store.Logo ? (
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <img
                          src={store.Logo}
                          alt={`Logo de ${store.Name}`}
                          className="max-w-full max-h-full object-contain rounded-lg shadow-sm bg-white p-2 transition-all duration-300 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) {
                              fallback.classList.remove('hidden');
                              fallback.classList.add('flex');
                            }
                          }}
                          loading="lazy"
                        />
                        <div 
                          className={`hidden absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg items-center justify-center shadow-inner`}
                        >
                          <span className="text-white font-bold text-2xl">
                            {store.Name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
                        <span className="text-white font-bold text-2xl">
                          {store.Name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {store.Name}
                    </h2>
                    {store.DNI && (
                      <p className="text-gray-500 text-sm mb-4">
                        DNI: {store.DNI}
                      </p>
                    )}
                    {/* Redes sociales */}
                    <div className="flex space-x-3 mb-4">
                      {store.Facebook && (
                        <a
                          href={store.Facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {getSocialIcon('facebook')}
                        </a>
                      )}
                      {store.Instagram && (
                        <a
                          href={store.Instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-800 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {getSocialIcon('instagram')}
                        </a>
                      )}
                      {store.TikTok && (
                        <a
                          href={store.TikTok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-800 hover:text-black transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {getSocialIcon('tiktok')}
                        </a>
                      )}
                    </div>
                    {/* Botón de acción */}
                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform group-hover:scale-105 shadow-sm hover:shadow-md">
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Ver productos
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {stores.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay tiendas disponibles
                  </h3>
                  <p className="text-gray-600">
                    Actualmente no hay tiendas disponibles en esta comunidad.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © 2025 MercadoComunidad - Conecta, comercia y crece en tu comunidad
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StoresPage;