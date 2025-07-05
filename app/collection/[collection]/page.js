"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/Components/ui/skeleton";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Image as ImageIcon, Download, Eye, Heart, User } from "lucide-react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";

const PIXABAY_API_KEY = "50781656-478fec576b87761cff94f809e";
const PIXABAY_BASE_URL = "https://pixabay.com/api/";

export default function CollectionPage() {
  const { collection } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  const searchQuery = decodeURIComponent(collection || "").replace(/\+/g, " ").trim();

  useEffect(() => {
    if (!searchQuery) {
      setError("No collection specified.");
      setLoading(false);
      return;
    }

    const url = `${PIXABAY_BASE_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&per_page=30&safesearch=true&min_width=640`;

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

  const downloadImage = async (imageUrl, filename, imageId) => {
    setDownloadingIds(prev => new Set(prev).add(imageId));
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full h-64 rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Alert className="max-w-md mx-4 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <ImageIcon className="h-5 w-5" />
          <AlertDescription className="text-center mt-2">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-black bg-clip-text text-transparent capitalize mb-4">
            {searchQuery} Collection
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Discover {images.length} stunning wallpapers
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img) => (
            <Card key={img.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <div className="relative overflow-hidden">
                <img
                  src={img.webformatURL}
                  alt={img.tags}
                  loading="lazy"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay with download button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => downloadImage(img.largeImageURL, `${searchQuery}-${img.id}.jpg`, img.id)}
                      disabled={downloadingIds.has(img.id)}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {downloadingIds.has(img.id) ? 'Downloading...' : 'Download'}
                    </Button>
                  </div>
                </div>

                {/* Image resolution badge */}
                <Badge variant="secondary" className="absolute top-3 left-3 bg-black/50 text-white border-0">
                  {img.imageWidth} × {img.imageHeight}
                </Badge>
              </div>

              {/* Image Info */}
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {img.tags.split(', ').slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatNumber(img.views)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>{formatNumber(img.downloads)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{formatNumber(img.likes)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {img.user}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

      
      </div>
    </div>
  );
}