"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import {
  Heart,
  ArrowRight,
  ImageIcon,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Download,
  Eye,
  Filter,
} from "lucide-react";
import Link from "next/link";

// Enhanced categories configuration with more variety
const categories = [
  {
    name: "Abstract Art",
    icon: "🎨",
    description: "Modern abstract designs and artistic compositions",
    searchQuery: "abstract+art",
    color: "purple",
    trending: true,
  },
  {
    name: "Space & Galaxy",
    icon: "🌌",
    description: "Cosmic views, nebulae, and stellar phenomena",
    searchQuery: "space+galaxy",
    color: "indigo",
    trending: true,
  },
  {
    name: "Minimalist",
    icon: "⚪",
    description: "Clean, simple designs with elegant aesthetics",
    searchQuery: "minimalist",
    color: "slate",
    trending: false,
  },
  {
    name: "Ocean & Waves",
    icon: "🌊",
    description: "Serene waters, waves, and marine landscapes",
    searchQuery: "ocean+waves",
    color: "blue",
    trending: false,
  },
  {
    name: "Sunset & Sunrise",
    icon: "🌅",
    description: "Golden hour magic and dramatic skies",
    searchQuery: "sunset+sunrise",
    color: "orange",
    trending: true,
  },
  {
    name: "Architecture",
    icon: "🏛️",
    description: "Modern buildings and architectural marvels",
    searchQuery: "architecture",
    color: "gray",
    trending: false,
  },
  {
    name: "Flowers & Botanical",
    icon: "🌸",
    description: "Beautiful blooms and botanical photography",
    searchQuery: "flowers+botanical",
    color: "pink",
    trending: false,
  },
  {
    name: "Technology",
    icon: "💻",
    description: "Digital art, circuits, and tech aesthetics",
    searchQuery: "technology+digital",
    color: "cyan",
    trending: true,
  },
  {
    name: "Animals & Wildlife",
    icon: "🦁",
    description: "Majestic creatures and wildlife photography",
    searchQuery: "animals+wildlife",
    color: "green",
    trending: false,
  },
  {
    name: "Vintage & Retro",
    icon: "📻",
    description: "Classic designs with nostalgic appeal",
    searchQuery: "vintage+retro",
    color: "amber",
    trending: false,
  },
  {
    name: "Fantasy & Magic",
    icon: "🧙‍♂️",
    description: "Mystical worlds and magical landscapes",
    searchQuery: "fantasy+magic",
    color: "violet",
    trending: true,
  },
  {
    name: "Urban & City",
    icon: "🏙️",
    description: "City skylines and urban photography",
    searchQuery: "urban+city",
    color: "stone",
    trending: false,
  },
  {
    name: "Mountains & Peaks",
    icon: "⛰️",
    description: "Majestic mountain ranges and alpine scenery",
    searchQuery: "mountains+peaks",
    color: "emerald",
    trending: false,
  },
  {
    name: "Tropical Paradise",
    icon: "🏝️",
    description: "Exotic beaches and tropical destinations",
    searchQuery: "tropical+beach",
    color: "teal",
    trending: true,
  },
  {
    name: "Autumn Colors",
    icon: "🍂",
    description: "Fall foliage and seasonal beauty",
    searchQuery: "autumn+fall",
    color: "red",
    trending: false,
  },
];

const PIXABAY_API_KEY = "50781656-478fec576b87761cff94f809e";
const PIXABAY_BASE_URL = "https://pixabay.com/api/";

const colorVariants = {
  purple:
    "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150",
  indigo:
    "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:from-indigo-100 hover:to-indigo-150",
  blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150",
  cyan: "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:from-cyan-100 hover:to-cyan-150",
  green:
    "bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-150",
  emerald:
    "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-150",
  teal: "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:from-teal-100 hover:to-teal-150",
  orange:
    "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-150",
  red: "bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-150",
  pink: "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:from-pink-100 hover:to-pink-150",
  amber:
    "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-150",
  violet:
    "bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 hover:from-violet-100 hover:to-violet-150",
  slate:
    "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-150",
  gray: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-150",
  stone:
    "bg-gradient-to-br from-stone-50 to-stone-100 border-stone-200 hover:from-stone-100 hover:to-stone-150",
};

const badgeVariants = {
  purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  indigo: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  cyan: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  green: "bg-green-100 text-green-800 hover:bg-green-200",
  emerald: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  teal: "bg-teal-100 text-teal-800 hover:bg-teal-200",
  orange: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  red: "bg-red-100 text-red-800 hover:bg-red-200",
  pink: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  amber: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  violet: "bg-violet-100 text-violet-800 hover:bg-violet-200",
  slate: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  gray: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  stone: "bg-stone-100 text-stone-800 hover:bg-stone-200",
};

export default function Page() {
  const [categoriesData, setCategoriesData] = useState(
    categories.map((cat) => ({
      ...cat,
      images: [],
      loading: true,
      error: null,
      imageCount: 0,
      liked: false,
      views: Math.floor(Math.random() * 10000) + 1000,
      downloads: Math.floor(Math.random() * 5000) + 500,
    }))
  );

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
        `${PIXABAY_BASE_URL}?key=${PIXABAY_API_KEY}&q=${cat.searchQuery}&image_type=photo&per_page=9&safesearch=true&min_width=640&order=popular`
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
        <div className="grid grid-cols-3 gap-2 h-40">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="w-full h-full rounded-lg" />
          ))}
        </div>
      );
    }

    if (category.error) {
      return (
        <Alert className="h-40 flex items-center justify-center">
          <AlertDescription className="text-center">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            {category.error}
          </AlertDescription>
        </Alert>
      );
    }

    if (category.images.length === 0) {
      return (
        <div className="h-40 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-lg">
          <ImageIcon className="h-8 w-8 mb-2" />
          <span className="text-sm">No images found</span>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2 h-40 rounded-xl overflow-hidden">
        {category.images.slice(0, 9).map((image, idx) => (
          <div key={idx} className="relative group overflow-hidden rounded-lg">
            <img
              src={image.previewURL || "/placeholder.svg"}
              alt={image.tags}
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
                <Eye className="h-3 w-3 text-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const filteredCategories = categoriesData.filter((cat) => {
    const matchesFilter = (() => {
      if (filter === "trending") return cat.trending;
      if (filter === "favorites") return cat.liked;
      return true;
    })();

    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalImages = categoriesData.reduce(
    (sum, cat) => sum + cat.imageCount,
    0
  );
  const readyCategories = categoriesData.filter(
    (cat) => !cat.loading && !cat.error
  ).length;
  const favoriteCategories = categoriesData.filter((cat) => cat.liked).length;
  const trendingCategories = categoriesData.filter(
    (cat) => cat.trending
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-8 shadow-xl shadow-primary/25">
            <Sparkles className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Premium Wallpaper Collections
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover stunning high-quality wallpapers across various categories.
            From abstract art to nature photography, find the perfect backdrop
            for your devices.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-4 text-sm border border-input bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              All Categories ({categories.length})
            </Button>
            <Button
              variant={filter === "trending" ? "default" : "outline"}
              onClick={() => setFilter("trending")}
              className="rounded-full"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending ({trendingCategories})
            </Button>
            {/* <Button
              variant={filter === "favorites" ? "default" : "outline"}
              onClick={() => setFilter("favorites")}
              className="rounded-full"
            >
              <Heart className="h-4 w-4 mr-2" />
              Favorites ({favoriteCategories})
            </Button> */}
          </div>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="text-center mb-8">
            <p className="text-muted-foreground">
              Found {filteredCategories.length} categories matching "
              {searchTerm}"
            </p>
          </div>
        )}

        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCategories.map((category, index) => {
            const originalIndex = categoriesData.findIndex(
              (cat) => cat.name === category.name
            );
            return (
              <Card
                key={category.name}
                className={`group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer border-2 hover:-translate-y-2 ${
                  colorVariants[category.color]
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl shadow-lg border">
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg capitalize font-semibold">
                          {category.name}
                        </CardTitle>
                        {category.trending && (
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-orange-500 mr-1" />
                            <span className="text-xs text-orange-600 font-medium">
                              Trending
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-background/50"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(originalIndex);
                      }}
                    >
                      <Heart
                        className={`h-5 w-5 transition-all duration-300 ${
                          category.liked
                            ? "fill-red-500 text-red-500 scale-110"
                            : "text-muted-foreground hover:text-red-500 hover:scale-110"
                        }`}
                      />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className={`${badgeVariants[category.color]} font-medium`}
                    >
                      {category.loading
                        ? "Loading..."
                        : `${category.imageCount} images`}
                    </Badge>
                    {!category.loading && !category.error && (
                      <>
                        <Badge
                          variant="outline"
                          className="text-xs border-green-200 text-green-700"
                        >
                          4K Quality
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          Premium
                        </Badge>
                      </>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ImageGrid category={category} />
                  <CardDescription className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </CardDescription>

                  {/* Stats */}
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {/* {category.views} */}
                      </div>
                      <div className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {/* {category.downloads} */}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated daily
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  <Link
                    href={`/collection/${category.searchQuery}`}
                    className="w-full"
                  >
                    <Button
                      className="w-full group/btn hover:shadow-lg transition-all duration-300"
                      variant="default"
                      disabled={category.loading || category.error}
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? `No categories match "${searchTerm}". Try a different search term.`
                : "No categories match your current filter. Try selecting a different filter."}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Enhanced Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              value: totalImages,
              label: "Total Images",
              icon: ImageIcon,
              color: "text-blue-600",
            },
            {
              value: categories.length,
              label: "Categories",
              icon: Filter,
              color: "text-green-600",
            },
            {
              value: readyCategories,
              label: "Ready to Browse",
              icon: Star,
              color: "text-yellow-600",
            },
            // {
            //   value: favoriteCategories,
            //   label: "Your Favorites",
            //   icon: Heart,
            //   color: "text-red-600",
            // },
          ].map((stat, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-2"
            >
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Bottom CTA */}
        {/* <div className="text-center mt-16">
          <Card className="inline-block p-8 hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-r from-background to-muted/20">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl font-bold mb-2">Want unlimited access?</h3>
                <p className="text-muted-foreground">
                  Get premium access to thousands more high-quality wallpapers, exclusive collections, and early access
                  to new releases.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="rounded-full bg-transparent">
                  Browse All Collections
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg">
                  Go Premium
                  <Star className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
