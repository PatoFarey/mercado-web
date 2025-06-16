import React from 'react';
import { useNavigate } from 'react-router-dom';
import blogData from '../data/blogs.json';
import { Calendar, User, Tag } from 'lucide-react';

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReadClick = (blogId: number) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogData.blogs.map((blog) => (
        <article 
          key={blog.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="relative h-48">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
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
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {blog.title}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {blog.summary}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {blog.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(blog.date)}
              </div>
            </div>

            <button
              onClick={() => handleReadClick(blog.id)}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Leer artículo
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogList;