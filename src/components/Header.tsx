import React, { useState } from 'react';
import { ShoppingBag, Store, BookOpen } from 'lucide-react';
import ContactModal from './ContactModal';
import { Community } from '../types/community';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  community: Community | null;
}

const Header: React.FC<HeaderProps> = ({ community }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleStoresClick = () => {
    const currentUrl = new URL(window.location.href);
    const communityId = currentUrl.searchParams.get('comunidad') || 'mercado-comunidad';
    navigate(`/stores?comunidad=${communityId}`);
  };

  const handleBlogClick = () => {
    navigate('/blog');
  };

  const showStoresButton = () => {
    const currentUrl = new URL(window.location.href);
    const storeId = currentUrl.searchParams.get('tienda');
    return !storeId;
  };

  return (
    <>
      <header className="bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">MercadoComunidad</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Inicio</a>
            {showStoresButton() && (
              <button 
                onClick={handleStoresClick}
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                <Store className="h-5 w-5" />
                <span>Tiendas</span>
              </button>
            )}
            <button 
              onClick={handleBlogClick}
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              <span>Blog</span>
            </button>
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contacto
            </button>
          </nav>
        </div>
      </header>

      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        community={community}
      />
    </>
  );
};

export default Header;