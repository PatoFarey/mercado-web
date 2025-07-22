import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store, Facebook, Instagram, MessageCircle, ArrowLeft, Loader2, Package } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';
import ImageCarousel from '../components/ImageCarousel';
import communityData from '../data/community.json';
import config from '../config';
import Swal from 'sweetalert2';

interface Product {
  _id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  categoria: string;
  phone: string;
  storeName: string;
  storeDNI: string;
  storeLogo: string;
  facebookLink: string;
  instagramLink: string;
  images: string[];
}

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  const getWhatsAppLink = (phone: string, productTitle: string) => {
    const formattedPhone = phone.replace(/\s+/g, '');
    const message = encodeURIComponent(`Hola, me interesa el producto: ${productTitle}`);
    return `https://wa.me/${formattedPhone}?text=${message}`;
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = {
        Authorization: `Bearer ${config.PUBLIC_TOKEN}`,
      };

      const response = await axios.get(
        `${config.API_URL}/public/products/${id}`,
        { headers }
      );
      console.log(response.data)
      setProduct(response.data);
    } catch (err: any) {
      console.error("Error cargando producto:", err);
      if (err.response?.status === 404) {
        setError('Producto no encontrado');
      } else {
        setError(err.response?.data?.error || 'Error al cargar el producto');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleStoreClick = () => {
    if (product?.storeDNI) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('comunidad', communityId);
      navigate(`/stores/${product.storeDNI}/products?${currentUrl.searchParams.toString()}`);
    }
  };

  const handleContactClick = () => {
    if (!product) return;
    
    Swal.fire({
      title: 'Información de Contacto',
      html: `
        <div class="text-left">
          ${product.phone ? `<p class="mb-2"><strong>Teléfono:</strong> ${product.phone}</p>` : ''}
          ${product.storeName ? `<p class="mb-2"><strong>Tienda:</strong> ${product.storeName}</p>` : ''}
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#3B82F6'
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header community={community} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Cargando producto...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header community={community} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Producto no encontrado'}
            </h2>
            <p className="text-gray-600 mb-6">
              {error === 'Producto no encontrado' 
                ? 'El producto que buscas no existe o no está disponible.'
                : 'Ha ocurrido un error al cargar el producto.'
              }
            </p>
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
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative bg-gray-50">
              <div className="aspect-square">
                {product.images && product.images.length > 0 ? (
                  <ImageCarousel images={product.images} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Package className="w-20 h-20 text-gray-300" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Details Section */}
            <div className="p-8 lg:p-12">
              {/* Store Info */}
              {(product.storeName || product.storeLogo || product.categoria) && (
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                  {product.storeLogo && (
                    <img 
                      src={product.storeLogo}
                      alt={product.storeName || 'Tienda'}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    {product.storeName && (
                      <h3 
                        className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                        onClick={handleStoreClick}
                      >
                        {product.storeName}
                      </h3>
                    )}
                    {product.categoria && (
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-1">
                        {product.categoria}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Product Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {product.title}
              </h1>
              
              {/* Price */}
              <div className="mb-8">
                <span className="text-4xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.longDescription || product.description}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                <button 
                  onClick={handleContactClick}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Contactar Vendedor
                </button>
                
                <div className="flex justify-center gap-6 pt-4">
                  {product.storeName && (
                    <button
                      onClick={handleStoreClick}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                      title="Ver tienda"
                    >
                      <Store size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Ver tienda</span>
                    </button>
                  )}
                  
                  {product.phone && (
                    <a 
                      href={getWhatsAppLink(product.phone, product.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors group"
                      title="WhatsApp"
                    >
                      <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">WhatsApp</span>
                    </a>
                  )}
                  
                  {product.facebookLink && (
                    <a 
                      href={product.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                      title="Facebook"
                    >
                      <Facebook size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Facebook</span>
                    </a>
                  )}
                  
                  {product.instagramLink && (
                    <a 
                      href={product.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors group"
                      title="Instagram"
                    >
                      <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default ProductPage;