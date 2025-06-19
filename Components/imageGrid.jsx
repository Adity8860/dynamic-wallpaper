"use client";
// app/components/ImageGrid.jsx
import { useState } from 'react';

export default function ImageGrid({ images }) {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative overflow-hidden rounded-xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => openModal(img)}
          >
            {/* Loading skeleton */}
            {!loadedImages.has(img.id) && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            )}
            
            <img
              src={img.webformatURL}
              alt={img.tags}
              className={`w-full h-48 object-cover transition-all duration-300 group-hover:scale-105 ${
                loadedImages.has(img.id) ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(img.id)}
              loading="lazy"
            />
            
            {/* Overlay with image info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-sm font-medium line-clamp-2 mb-1">
                  {img.tags.split(',').slice(0, 3).join(', ')}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>{img.views?.toLocaleString() || 0} views</span>
                  <span>❤️ {img.likes?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>

            {/* Corner badge for premium/featured images */}
            {img.likes > 1000 && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Popular
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for full-size image view */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-full bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img
              src={selectedImage.largeImageURL || selectedImage.webformatURL}
              alt={selectedImage.tags}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            
            <div className="p-6 bg-white">
              <h3 className="font-semibold text-lg mb-2">
                {selectedImage.tags.split(',').slice(0, 5).join(', ')}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>👁️ {selectedImage.views?.toLocaleString() || 0} views</span>
                <span>❤️ {selectedImage.likes?.toLocaleString() || 0} likes</span>
                <span>💬 {selectedImage.comments?.toLocaleString() || 0} comments</span>
                <span>📥 {selectedImage.downloads?.toLocaleString() || 0} downloads</span>
              </div>
              {selectedImage.user && (
                <div className="mt-4 flex items-center gap-2">
                  <img
                    src={selectedImage.userImageURL}
                    alt={selectedImage.user}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">by {selectedImage.user}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}