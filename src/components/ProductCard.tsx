import React, { useState } from 'react';
import { Store, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Product } from '../types/product';
import ImageCarousel from './ImageCarousel';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
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
    currentUrl.searchParams.set('tienda', product.id_store);
    window.location.href = currentUrl.toString();
  };

  const handleContactClick = () => {
    Swal.fire({
      title: 'Información de Contacto',
      html: `
        <div class="text-left">
          ${product.phone ? `<p class="mb-2"><strong>Teléfono:</strong> ${product.phone}</p>` : ''}
          <p><strong>Email:</strong> ${product.email}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#3B82F6'
    });
  };

  const handleProductClick = () => {
    const params = new URLSearchParams(window.location.search);
    const communityId = params.get('comunidad') || 'mercado-comunidad';
    navigate(`/product/${product.id}?comunidad=${communityId}`);
  };

  return (
    <div 
      className="relative bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer"
      style={{ 
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : ''
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      <div className="absolute top-4 left-4 z-10">
        <img 
          onClick={(e) => {e.stopPropagation(); navigate(`/stores/${product.storeLink}/products`);}}
          src={product.storeLogo}
          alt={product.storeName}
          className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
        />
      </div>

      <ImageCarousel images={product.images} />
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-3">
          <h3 
            className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleStoreClick();
            }}
          >
            {product.storeName}
          </h3>
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {product.categoria}
          </span>
        </div>

        <h4 className="text-lg font-semibold text-gray-800 mb-2">{product.title}</h4>
        <p className="text-gray-600 mb-4 text-sm flex-grow">{product.description}</p>
        
        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleContactClick();
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 ${
                isHovered ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span className="text-sm font-medium">Contacto</span>
            </button>
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-2 border-t">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStoreClick();
              }}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              title="Ver tienda"
            >
              <Store size={20} />
            </button>
            {product.phone && (
              <a 
                href={getWhatsAppLink(product.phone, product.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle size={20} />
              </a>
            )}
            {product.facebookLink && (
              <a 
                href={product.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Facebook size={20} />
              </a>
            )}
            {product.instagramLink && (
              <a 
                href={product.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Instagram size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;