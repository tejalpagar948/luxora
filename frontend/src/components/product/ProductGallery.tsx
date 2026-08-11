import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images[0] || '');

  if (!images.length) {
    return (
      <div className="aspect-[4/5] bg-background-alt rounded-lg flex items-center justify-center font-body text-neutral-400">
        No images available
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnail list */}
      <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(image)}
            className={`w-20 aspect-[4/5] overflow-hidden bg-background-alt rounded-md border flex-shrink-0 transition-colors duration-200 ${activeImage === image ? 'border-accent' : 'border-border-light hover:border-primary'
              }`}
          >
            <img src={image} alt={`Thumbnail ${idx + 1}`} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>

      {/* Main Image View */}
      <div className="flex-1 order-1 md:order-2 aspect-[4/4] overflow-hidden bg-background-alt rounded-lg">
        <img
          src={activeImage}
          alt="Active product view"
          className="object-cover w-full h-full w-full hover:scale-105 transition-transform duration-700"
        />
      </div>
    </div>
  );
};
