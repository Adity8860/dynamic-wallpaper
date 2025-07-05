"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Heart, ArrowRight, Image as ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";

// Categories configuration
const categories = [
  {
    name: "yellow flowers",
    icon: "🌻",
    description: "Beautiful yellow blooms and floral arrangements",
    searchQuery: "yellow+flowers",
    color: "yellow",
  },
  {
    name: "cars",
    icon: "🚗",
    description: "Vehicles, automobiles, and transportation",
    searchQuery: "cars",
    color: "blue",
  },
  {
    name: "nature",
    icon: "🌲",
    description: "Natural landscapes and outdoor scenery",
    searchQuery: "nature",
    color: "green",
  },
  {
    name: "birds",
    icon: "🐦",
    description: "Feathered friends and wildlife photography",
    searchQuery: "birds",
    color: "purple",
  },
  {
    name: "mountains",
    icon: "⛰️",
    description: "Majestic peaks and mountain landscapes",
    searchQuery: "mountains",
    color: "slate",
  },
];

const PIXABAY_API_KEY = "50781656-478fec576b87761cff94f809e";
const PIXABAY_BASE_URL = "https://pixabay.com/api/";

const colorVariants = {
  yellow: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  blue: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  green: "bg-green-50 border-green-200 hover:bg-green-100",
  purple: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  slate: "bg-slate-50 border-slate-200 hover:bg-slate-100",
};

const badgeVariants = {
  yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  green: "bg-green-100 text-green-800 hover:bg-green-200",
  purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  slate: "bg-slate-100 text-slate-800 hover:bg-slate-200",
};

export default function CollectionPage() {
  const [categoriesData, setCategoriesData] = useState(
    categories.map((cat) => ({
      ...cat,
      images: [],
      loading: true,
      error: null,
      imageCount: 0,
      liked: false,
    }))
  );

  const toggleLike = (index) => {
    setCategoriesData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], liked: !updated[index].liked };
      return updated;
    });
  };

  useEffect(() => {
    categories.forEach((cat, idx) => {
      fetch(
        `${PIXABAY_BASE_URL}?key=${PIXABAY_API_KEY}&q=${cat.searchQuery}&image_type=photo&per_page=6&safesearch=true&min_width=640`
      )
        .then((res) => res.json())
        .then((data) => {
          setCategoriesData((prev) => {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              images: data.hits || [],
              loading: false,
              error: null,
              imageCount: data.hits ? data.hits.length : 0,
            };
            return updated;
          });
        })
        .catch((err) => {
          setCategoriesData((prev) => {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              images: [],
              loading: false,
              error: "Failed to load images",
              imageCount: 0,
            };
            return updated;
          });
        });
    });
  }, []);

  const ImageGrid = ({ category }) => {
    if (category.loading) {
      return (
        <div className="grid grid-cols-3 gap-1 h-32">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-full h-full rounded-md" />
          ))}
        </div>
      );
    }

    if (category.error) {
      return (
        <Alert className="h-32 flex items-center justify-center">
          <AlertDescription className="text-center">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            {category.error}
          </AlertDescription>
        </Alert>
      );
    }

    if (category.images.length === 0) {
      return (
        <div className="h-32 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-lg">
          <ImageIcon className="h-8 w-8 mb-2" />
          <span className="text-sm">No images found</span>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-1 h-32 rounded-lg overflow-hidden">
        {category.images.slice(0, 6).map((image, idx) => (
          <div key={idx} className="relative group overflow-hidden">
            <img
              src={image.previewURL}
              alt={image.tags}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6 shadow-lg">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Wallpaper Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover stunning high-quality wallpapers across various categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.map((category, index) => (
            <Card
              key={category.name}
              className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
                colorVariants[category.color]
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-xl shadow-sm">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg capitalize">
                        {category.name}
                      </CardTitle>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLike(index);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        category.liked
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground hover:text-red-500"
                      }`}
                    />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={badgeVariants[category.color]}
                  >
                    {category.loading
                      ? "Loading..."
                      : `${category.imageCount} images`}
                  </Badge>
                  {!category.loading && !category.error && (
                    <Badge variant="outline" className="text-xs">
                      HD Quality
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ImageGrid category={category} />
                <CardDescription className="mt-4 text-sm leading-relaxed">
                  {category.description}
                </CardDescription>
              </CardContent>

              <CardFooter className="pt-4">
                <Link href={`/collection/${category.searchQuery}`}>
                  {" "}
                  <Button
                    className="w-full group/btn"
                    variant="default"
                    disabled={category.loading || category.error}
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">
              {categoriesData.reduce((sum, cat) => sum + cat.imageCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Images</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">
              {categories.length}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">
              {
                categoriesData.filter((cat) => !cat.loading && !cat.error)
                  .length
              }
            </div>
            <div className="text-sm text-muted-foreground">Ready</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">
              {categoriesData.filter((cat) => cat.liked).length}
            </div>
            <div className="text-sm text-muted-foreground">Favorites</div>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Card className="inline-block p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Want more categories?</h3>
                <p className="text-sm text-muted-foreground">
                  Discover thousands more wallpapers
                </p>
              </div>
              <Button variant="outline">
                Browse All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
