import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  onImageClick?: () => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onImageClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] min-w-0 cursor-pointer aspect-square"
              onClick={onImageClick}
            >
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-contain bg-white"
              />
            </div>
          ))}
        </div>
      </div>
      
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          scrollPrev();
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          scrollNext();
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ImageCarousel