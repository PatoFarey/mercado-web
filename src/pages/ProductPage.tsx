import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store, Facebook, Instagram, MessageCircle, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import ImageCarousel from '../components/ImageCarousel';
import { Product } from '../types/product';
import productData from '../data/products.json';
import communityData from '../data/community.json';
import Swal from 'sweetalert2';

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Find the product
  const product = productData.products.find(p => p.id.toString() === id);
  
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

  const handleStoreClick = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('tienda', product!.id_store);
    currentUrl.searchParams.set('comunidad', communityId);
    navigate(`/?${currentUrl.searchParams.toString()}`);
  };

  const handleContactClick = () => {
    Swal.fire({
      title: 'Información de Contacto',
      html: `
        <div class="text-left">
          ${product!.phone ? `<p class="mb-2"><strong>Teléfono:</strong> ${product!.phone}</p>` : ''}
          <p><strong>Email:</strong> ${product!.email}</p>
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header community={community} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
            <p className="text-gray-600">El producto que buscas no existe.</p>
            <button
              onClick={handleBack}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                <ImageCarousel images={product.images} />
              </div>
            </div>
            
            {/* Product Details Section */}
            <div className="p-8 lg:p-12">
              {/* Store Info */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                <img 
                  src={product.storeLogo}
                  alt={product.storeName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h3 
                    className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                    onClick={handleStoreClick}
                  >
                    {product.storeName}
                  </h3>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-1">
                    {product.categoria}
                  </span>
                </div>
              </div>

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
                  {product.longDescription}
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
                  <button
                    onClick={handleStoreClick}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                    title="Ver tienda"
                  >
                    <Store size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Ver tienda</span>
                  </button>
                  
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