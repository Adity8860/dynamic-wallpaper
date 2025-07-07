"use client";
// Components/Herosection.js
import Image from "next/image";
import { Button } from "@/Components/ui/button.jsx";
import { Card, CardContent } from "@/Components/ui/card.jsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/Components/ui/hover-card";
import { Download, Heart, Eye } from "lucide-react";
import { downloadImage } from "@/lib/utils";
import { useAuth } from "@/context/authContext.js";
import Link from "next/link";

export default function HeroSection({ images }) {
  const { isLoggedIn } = useAuth();
  // Map Pixabay data to the structure expected by the UI
  const featuredWallpapers = images.map((image, index) => {
    // Get up to 4 unique hover images from all images, excluding the main image
    const hoverImages = images
      .filter((hoverImage) => hoverImage.id !== image.id) // Exclude main image
      .slice(0, 4) // Get first 4 available images
      .map((hoverImage) => hoverImage.previewURL); // Use previewURL for hover images

    return {
      id: image.id,
      title: image.tags.split(",")[0]?.trim() || `Flower Image ${index + 1}`,
      categoryN: "Flowers",
      mainImage: image.webformatURL,
      hoverImages:
        hoverImages.length >= 4
          ? hoverImages
          : [
              ...hoverImages,
              ...Array(4 - hoverImages.length).fill(image.previewURL), // Fallback to main previewURL if not enough images
            ],
      downloads: `${Math.floor(image.downloads / 1000) || 0}K`,
      likes: `${Math.floor(image.likes / 1000) || 0}K`,
    };
  });

  // Handle case where no images are available
  if (!featuredWallpapers.length) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="text-center text-muted-foreground">
            No wallpapers available
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        {/* Hero Content */}
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Beautiful Wallpapers for
              <span className="text-primary"> Every Screen</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover thousands of high-quality wallpapers. From stunning
              landscapes to abstract art, find the perfect background for your
              device.
            </p>
          </div>
          <div className="space-x-4">
            <Link href="/collection">
              <Button size="lg" className="h-11 px-8">
                Browse Collection
              </Button>
            </Link>

            {/* <Button variant="outline" size="lg" className="h-11 px-8">
              Upload Wallpaper
            </Button> */}
          </div>
        </div>

        {/* Featured Wallpapers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredWallpapers.map((wallpaper) => (
            <HoverCard key={wallpaper.id} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-0 relative">
                    <div className="relative overflow-hidden">
                      <Image
                        src={wallpaper.mainImage || "/placeholder.svg"}
                        alt={wallpaper.title}
                        width={300}
                        height={400}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                        >
                          <Heart className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">
                          {wallpaper.title}
                        </h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {wallpaper.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Download
                              className="h-3 w-3"
                              onClick={downloadImage}
                            />
                            {wallpaper.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {wallpaper.likes}
                          </span>
                        </div>

                        {isLoggedIn ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={downloadImage}
                          >
                            Download
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs hidden"
                            onClick={downloadImage}
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4" side="top">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {wallpaper.title} Collection
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{wallpaper.hoverImages.length} more</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {wallpaper.hoverImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group/item cursor-pointer"
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${wallpaper.title} ${index + 1}`}
                          width={150}
                          height={200}
                          className="w-full h-24 object-cover rounded-md transition-transform duration-200 group-hover/item:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 rounded-md" />
                        {/* <div className="absolute top-1 right-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" onClick={downloadImage}>
                          <Button size="sm" variant="secondary" className="h-6 w-6 p-0" >
                            <Download className="h-3 w-3" onClick={downloadImage} />
                          </Button>
                        </div> */}
                      </div>
                    ))}
                  </div>
                  <Link href="/collection">
                    <Button className="w-full" size="sm">
                      View All Collection
                    </Button>
                  </Link>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}
