"use client";
import { useEffect, useState } from "react";
import {
  ImageIcon,
  Download,
  Eye,
  Heart,
  User,
  Search,
  Filter,
  Grid,
  List,
  ArrowUp,
} from "lucide-react";
import { useAuth } from "@/context/authContext.js";

const PIXABAY_API_KEY = "50781656-478fec576b87761cff94f809e";
const PIXABAY_BASE_URL = "https://pixabay.com/api/";

export default function CollectionPage() {
  // Mock collection parameter - in real app this would come from useParams
  const collection = "nature";
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const{isLoggedIn} = useAuth()

  const searchQuery = decodeURIComponent(collection || "")
    .replace(/\+/g, " ")
    .trim();

  useEffect(() => {
    if (!searchQuery) {
      setError("No collection specified.");
      setLoading(false);
      return;
    }

    const url = `${PIXABAY_BASE_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
      searchQuery
    )}&image_type=photo&per_page=30&safesearch=true&min_width=640`;

    console.log("[CollectionPage] Fetching:", url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.hits) && data.hits.length > 0) {
          setImages(data.hits);
          setError(null);
        } else {
          setError("No images found for this collection.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load images.");
        setLoading(false);
      });
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const downloadImage = async (imageUrl, filename, imageId) => {
    setDownloadingIds((prev) => new Set(prev).add(imageId));

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    } finally {
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortedImages = [...images].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.views - a.views;
      case "downloads":
        return b.downloads - a.downloads;
      case "likes":
        return b.likes - a.likes;
      case "newest":
        return new Date(b.id) - new Date(a.id);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 mt-4">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 w-64 bg-gray-200 rounded-xl mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 w-48 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
          </div>

          {/* Controls Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-4 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-black bg-clip-text text-transparent capitalize">
              {searchQuery} Collection
            </h1>
          </div>
          <p className="text-slate-600 text-lg mb-4">
            Discover {images.length} stunning high-quality wallpapers
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>
                {formatNumber(images.reduce((sum, img) => sum + img.views, 0))}{" "}
                total views
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>
                {formatNumber(
                  images.reduce((sum, img) => sum + img.downloads, 0)
                )}{" "}
                downloads
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>
                {formatNumber(images.reduce((sum, img) => sum + img.likes, 0))}{" "}
                likes
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium"
              >
                <option value="popular">Most Popular</option>
                <option value="downloads">Most Downloaded</option>
                <option value="likes">Most Liked</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {viewMode === "grid" ? (
                <List className="w-4 h-4" />
              ) : (
                <Grid className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {viewMode === "grid" ? "List" : "Grid"}
              </span>
            </button>
          </div>
        </div>

        {/* Enhanced Image Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 md:grid-cols-2 gap-8"
          }`}
        >
          {sortedImages.map((img) => (
            <div
              key={img.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100"
              onMouseEnter={() => setHoveredImage(img.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={img.webformatURL}
                  alt={img.tags}
                  loading="lazy"
                  className={`w-full ${
                    viewMode === "grid" ? "h-64" : "h-80"
                  } object-cover transition-all duration-500 ${
                    hoveredImage === img.id ? "scale-110" : "scale-100"
                  }`}
                />

                {/* Enhanced Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-300 ${
                    hoveredImage === img.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{formatNumber(img.views)}</span>
                        </div>
                        {/* <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{formatNumber(img.likes)}</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Resolution Badge */}
                {/* <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                  {img.imageWidth} × {img.imageHeight}
                </div> */}

                {/* Quality Badge */}
                {/* <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  HD
                </div> */}
              </div>

              {/* Enhanced Image Info */}
              <div className="p-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {img.tags
                    .split(", ")
                    .slice(0, 3)
                    .map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>{formatNumber(img.downloads)}</span>
                    </div>
                    {/* <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{formatNumber(img.likes)}</span>
                    </div> */}
                    {isLoggedIn ? (
                      <button
                        onClick={() =>
                          downloadImage(
                            img.largeImageURL,
                            `${searchQuery}-${img.id}.jpg`,
                            img.id
                          )
                        }
                        disabled={downloadingIds.has(img.id)}
                        className="bg-gray-500 hover:bg-gray-600 disabled:bg-blue-400 text-white px-6 py-2 rounded-xl font-sm transition-colors duration-200 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {downloadingIds.has(img.id)
                          ? "Downloading..."
                          : "Download "}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          downloadImage(
                            img.largeImageURL,
                            `${searchQuery}-${img.id}.jpg`,
                            img.id
                          )
                        }
                        disabled={downloadingIds.has(img.id)}
                        className="bg-gray-500 hover:bg-gray-600 disabled:bg-blue-400 text-white px-6 py-2 rounded-xl font-sm transition-colors duration-200   items-center gap-2 hidden"
                      >
                        <Download className="w-4 h-4" />
                        {downloadingIds.has(img.id)
                          ? "Downloading..."
                          : "Download "}
                      </button>
                    )}
                  </div>

                  {/* <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-20">
                      {img.user}
                    </span>
                  </div> */}
                </div>

                {/* Download Button */}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-black text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-50"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
