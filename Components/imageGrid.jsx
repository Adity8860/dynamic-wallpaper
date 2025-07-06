"use client";

import { useState } from "react";
import {
  Download,
  Heart,
  Eye,
  MessageCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/context/authContext";

export default function ImageGrid({ images }) {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [errorImages, setErrorImages] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const { isLoggedIn } = useAuth();

  const handleImageLoad = (imageId) => {
    setLoadedImages((prev) => new Set([...prev, imageId]));
  };

  const handleImageError = (imageId, url) => {
    console.error(`Failed to load image ${imageId}: ${url}`);
    setErrorImages((prev) => new Set([...prev, imageId]));
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const downloadImage = async (image) => {
    setDownloading(true);
    try {
      const imageUrl = image.largeImageURL || image.webformatURL;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-4">
        {images.map((img) => (
          <Card
            key={img.id}
            className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => openModal(img)}
          >
            <CardContent className="p-0 relative">
              <div className="relative overflow-hidden">
                {!loadedImages.has(img.id) && !errorImages.has(img.id) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse z-10" />
                )}

                <Image
                  src={
                    errorImages.has(img.id)
                      ? "/placeholder.svg?height=400&width=300"
                      : img.webformatURL
                  }
                  alt={img.tags}
                  width={300}
                  height={400}
                  className={`w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110 ${
                    loadedImages.has(img.id) ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(img.id)}
                  onError={() => handleImageError(img.id, img.webformatURL)}
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Add to favorites functionality here
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div> */}

                {img.likes > 1000 && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                    🔥 Popular
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {img.tags.split(",").slice(0, 2).join(", ")}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {img.user || "Unknown"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {formatNumber(img.downloads)}
                    </span>
                    {/* <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatNumber(img.likes)}
                    </span> */}
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(img.views)}
                    </span>
                  </div>

                  {isLoggedIn ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(img);
                      }}
                      disabled={downloading}
                    >
                      {downloading ? "..." : "Download"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(img);
                      }}
                      disabled={downloading}
                    >
                      {downloading ? "..." : "Download"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-6xl max-h-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedImage.user && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <img
                        src={
                          selectedImage.userImageURL ||
                          "/placeholder.svg?height=24&width=24"
                        }
                        alt={selectedImage.user}
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=24&width=24";
                        }}
                      />
                      <span className="text-white text-sm font-medium">
                        {selectedImage.user}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadImage(selectedImage)}
                    disabled={downloading}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-full p-3 transition-colors duration-200 shadow-lg"
                  >
                    {downloading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main image */}
            <div className="relative">
              <img
                src={
                  errorImages.has(selectedImage.id)
                    ? "/placeholder.svg?height=600&width=800"
                    : selectedImage.largeImageURL || selectedImage.webformatURL
                }
                alt={selectedImage.tags}
                className="w-full h-auto max-h-[70vh] object-contain bg-gray-100"
                onError={() =>
                  handleImageError(
                    selectedImage.id,
                    selectedImage.largeImageURL || selectedImage.webformatURL
                  )
                }
              />
            </div>

            {/* Modal footer */}
            <div className="p-6 bg-gradient-to-t from-gray-50 to-white">
              <div className="mb-4">
                <h3 className="font-bold text-xl mb-2 text-gray-800">
                  {selectedImage.tags.split(",").slice(0, 5).join(", ")}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedImage.tags
                    .split(",")
                    .slice(0, 8)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors duration-200 cursor-pointer"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Views</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    {formatNumber(selectedImage.views)}
                  </span>
                </div>
                {/* <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-red-500 mb-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">Likes</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{formatNumber(selectedImage.likes)}</span>
                </div> */}
                {/* <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-blue-500 mb-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Comments</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{formatNumber(selectedImage.comments)}</span>
                </div> */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-green-500 mb-1">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Downloads</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    {formatNumber(selectedImage.downloads)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Image ID: {selectedImage.id} • Size:{" "}
                  {selectedImage.imageWidth}×{selectedImage.imageHeight}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadImage(selectedImage)}
                    disabled={downloading}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    {downloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download
                      </>
                    )}
                  </button>
                  {selectedImage.pageURL && (
                    <a
                      href={selectedImage.pageURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
