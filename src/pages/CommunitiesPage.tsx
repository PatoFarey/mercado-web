import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Community } from '../types/community';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import axios from 'axios';

const CommunitiesPage: React.FC = () => {
    const navigate = useNavigate();

    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCommunities = async () => {
        try {
        setLoading(true);

        const headers = {
            Authorization: `Bearer ${config.PUBLIC_TOKEN}`,
        };
        const communitiesResponse = await axios.get(
            `${config.API_URL}/public/communities`,
            { headers }
        );

        setCommunities(communitiesResponse.data[0].comunidades || []);
        } catch (err) {
        console.error("Error cargando comunidades:", err);
        setError("Hubo un problema al cargar las comunidades.");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    const handleCommunityClick = (communityId: string | undefined) => {
        navigate(`/stores?comunidad=${communityId}`);
    };

    const getStatusBadge = (isOpen?: boolean) => {
        return (
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isOpen 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
            {isOpen ? 'Activa' : 'Inactiva'}
        </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Header community={null} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex-grow">
            {loading ? (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-blue-600 font-medium text-lg">Cargando comunidades...</span>
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
                        Comunidades
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
                        Descubre las diferentes comunidades disponibles y explora sus tiendas locales
                    </p>
                    <div className="mt-6 flex items-center justify-center">
                        <div className="bg-blue-50 px-4 py-2 rounded-full">
                        <span className="text-blue-600 font-semibold text-sm">
                            {communities.length} comunidad{communities.length !== 1 ? 'es' : ''} disponible{communities.length !== 1 ? 's' : ''}
                        </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communities.map((community: Community) => (
                        <div
                        key={community.id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden transform hover:-translate-y-1 h-[480px] flex flex-col"
                        onClick={() => handleCommunityClick(community.id)}
                        >
                        <div className="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 flex-shrink-0">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
                            <span className="text-white font-bold text-2xl">
                                {community.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                            </div>
                            <div className="absolute top-4 right-4">
                            {getStatusBadge(community.open)}
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-6 flex flex-col flex-grow">
                            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {community.name}
                            </h2>
                            {community.title && (
                            <h3 className="text-sm font-medium text-blue-600 mb-3">
                                {community.title}
                            </h3>
                            )}

                            <div className="flex-grow">
                            {community.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                                {community.description}
                                </p>
                            )}

                            {/* Información de contacto */}
                            <div className="space-y-2 mb-4">
                                {community.phone && (
                                <div className="flex items-center text-gray-500 text-sm">
                                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="truncate">{community.phone}</span>
                                </div>
                                )}
                                {community.email && (
                                <div className="flex items-center text-gray-500 text-sm">
                                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="truncate">{community.email}</span>
                                </div>
                                )}
                            </div>
                            </div>
                            {/* Botón de acción - siempre al final */}
                            <button
                                className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform group-hover:scale-105 shadow-sm hover:shadow-md mt-auto ${
                                    community.open
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                }`}
                                disabled={!community.open}
                            >
                                <span className="flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {community.open ? 'Ver tiendas' : 'No disponible'}
                                </span>
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
                {communities.length === 0 && (
                <div className="text-center py-16">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No hay comunidades disponibles
                    </h3>
                    <p className="text-gray-600">
                        Actualmente no hay comunidades disponibles.
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

export default CommunitiesPage;