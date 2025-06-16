import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import blogData from '../data/blogs.json';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';

const BlogDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const blog = blogData.blogs.find(b => b.id.toString() === id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header community={null} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Artículo no encontrado</h2>
            <p className="text-gray-600">El artículo que buscas no existe.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header community={null} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  <Tag className="w-4 h-4 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">{blog.title}</h1>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-8 pb-8 border-b">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {blog.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(blog.date)}
              </div>
            </div>

            <div className="prose max-w-none">
              {blog.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
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

export default BlogDetailPage