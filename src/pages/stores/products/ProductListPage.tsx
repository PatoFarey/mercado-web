import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Package, ChevronLeft, ChevronRight, Loader2, MessageCircle, Facebook, Instagram, SquareUserRound } from 'lucide-react';
import axios from 'axios';
import Header from '../../../components/Header';
import { Product } from '../../../types/product';
import communityData from '../../../data/community.json';
import config from '../../../config';
import ImageCarousel from '../../../components/ImageCarousel';
import { Store } from '../../../types/store';

const StorePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [storeInfo, setStoreInfo] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
    });

    // Get community data for header
    const params = new URLSearchParams(window.location.search);
    const communityId = params.get('comunidad') || 'mercado-comunidad';
    const community = communityData.communities.find(c => c.id === communityId);

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getWhatsAppLink = (phone: string, storeName: string) => {
        const formattedPhone = phone.replace(/\s+/g, '');
        const message = encodeURIComponent(`Hola, me interesa conocer más sobre los productos de ${storeName}`);
        return `https://wa.me/${formattedPhone}?text=${message}`;
    };

    const fetchstoreInfo = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${config.PUBLIC_TOKEN}`,
            };

            const response = await axios.get(
                `${config.API_URL}/public/stores/${id}`,
                { headers }
            );
            console.log("Datos de la tienda:", response.data);
            setStoreInfo(response.data);
        } catch (err: any) {
            console.error("Error cargando datos de la tienda:", err);
            // No establecemos error aquí para que no interfiera con la carga de productos
        }
    };

    const fetchStoreProducts = async (page: number = 1, search: string = '') => {
        try {
            setLoading(true);
            setError(null);

            const headers = {
                Authorization: `Bearer ${config.PUBLIC_TOKEN}`,
            };

            const params: any = {
                page: page.toString(),
                limit: '12',
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            const response = await axios.get(
                `${config.API_URL}/public/stores/${id}/products`,
                {
                    headers,
                    params
                }
            );

            setProducts(response.data.products || []);
            setPagination(response.data || {
                page: 1,
                limit: 12,
                total: 0,
                totalPages: 0,
                hasNext: false,
                hasPrev: false
            });
            setCurrentPage(page);
        } catch (err: any) {
            console.error("Error cargando productos:", err);
            if (err.response?.status === 404) {
                setError('No se encontraron productos para esta tienda');
            } else {
                setError(err.response?.data?.error || 'Error al cargar los productos');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchstoreInfo();
            fetchStoreProducts(1, searchTerm);
        }
    }, [id]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchStoreProducts(1, searchTerm);
    };

    const handlePageChange = (page: number) => {
        if (pagination && page >= 1 && page <= pagination.totalPages) {
            fetchStoreProducts(page, searchTerm);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleProductClick = (productId: string) => {
        const currentUrl = new URL(window.location.href);
        navigate(`/product/${productId}?${currentUrl.searchParams.toString()}`);
    };

    if (loading && products.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header community={community} />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">Cargando productos de la tienda...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header community={community} />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar la tienda</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={handleBack}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header community={community} />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                <button
                    onClick={handleBack}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4 group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Volver</span>
                </button>

                {/* Minimal Store Header */}
                <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {storeInfo?.Logo && (
                                <img 
                                    src={storeInfo?.Logo}
                                    alt={storeInfo?.Name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            )}
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">
                                    {storeInfo?.Name || 'Tienda'}
                                </h1>
                            </div>
                        </div>

                        {/* Minimal Social Links */}
                        {storeInfo && (
                            <div className="flex gap-1">
                                {(storeInfo.Facebook) && (
                                    <a 
                                        href={storeInfo.Facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Facebook"
                                    >
                                        <Facebook size={16} />
                                    </a>
                                )}
                                {(storeInfo.Instagram && (
                                    <a 
                                        href={storeInfo.Instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 text-gray-400 hover:text-pink-600 transition-colors"
                                        title="Instagram"
                                    >
                                        <Instagram size={16} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Minimal Search */}
                <div className="mb-6">
                    <form onSubmit={handleSearchSubmit}>
                        <div className="relative max-w-xs">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={`Buscar productos (${pagination?.total || 0} disponibles)`}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                    </form>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.map((product) => (
                                <div
                                key={product.id}
                                onClick={() => handleProductClick(product.id.toString())}
                                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                                >
                                <div className="aspect-square">
                                    <ImageCarousel images={product.images} />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {product.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-blue-600">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                        {product.categoria}
                                    </span>
                                    </div>
                                </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-3 mb-6">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!pagination?.hasPrev}
                                    className="flex items-center px-5 py-3 text-sm font-semibold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Anterior
                                </button>

                                <div className="flex space-x-1">
                                    {Array.from({ length: pagination?.totalPages || 0 }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                                                page === currentPage
                                                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                                    : 'text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!pagination?.hasNext}
                                    className="flex items-center px-5 py-3 text-sm font-semibold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    Siguiente
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        )}

                        {/* Minimal Results Summary */}
                        <div className="text-center text-xs text-gray-400 py-2">
                            Mostrando {products.length} de {pagination?.total || 0} productos
                            {searchTerm && ` para "${searchTerm}"`}
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            No se encontraron productos
                        </h3>
                        <p className="text-gray-600 text-lg mb-6">
                            {searchTerm 
                                ? `No hay productos que coincidan con "${searchTerm}" en esta tienda`
                                : "Esta tienda no tiene productos disponibles en este momento"
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    fetchStoreProducts(1, '');
                                }}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Ver todos los productos
                            </button>
                        )}
                    </div>
                )}

                {loading && products.length > 0 && (
                    <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-600">Cargando más productos...</p>
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

export default StorePage;