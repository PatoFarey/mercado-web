import React from 'react';
import Header from '../components/Header';
import BlogList from '../components/BlogList';

const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header community={null} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Descubre consejos, tutoriales y noticias para hacer crecer tu negocio
          </p>
        </div>
        
        <BlogList />
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

export default BlogPage