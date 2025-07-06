"use client";

import Link from "next/link";
import { Button } from "@/Components/ui/button.jsx";
import { Input } from "@/Components/ui/input.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/Components/ui/dropdown-menu.jsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/Components/ui/avatar.jsx";
import { Badge } from "@/Components/ui/badge.jsx";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/Components/ui/sheet.jsx";
import { Separator } from "@/Components/ui/separator.jsx";
import {
  Menu,
  Search,
  Sparkles,
  User,
  LogOut,
  Settings,
  Heart,
  Download,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext.js";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const { isLoggedIn, login, logout, isLoading, user } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const UserAvatar = ({ className = "" }) => (
    <Avatar className={`h-8 w-8 ${className}`}>
      <AvatarImage src={user?.avatar} alt={user?.name} />
      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
        {user?.name?.charAt(0) || "U"}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b shadow-lg"
          : "bg-background/80 backdrop-blur-md border-b border-border/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative inline-flex items-center justify-center w-10 h-10 bg-primary rounded-2xl shadow-lg group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/25 transition-all duration-300">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <span className="ml-3 text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                D-wally
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                Beta
              </Badge>
            </Link>
          </div>

          {/* Enhanced Search Field */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div
                className={`relative flex items-center transition-all duration-300 ${
                  isSearchFocused ? "ring-2 ring-primary/20" : ""
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search
                    className={`h-4 w-4 transition-colors duration-300 ${
                      isSearchFocused ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <Input
                  type="text"
                  value={query}
                  placeholder="Search wallpapers, collections, themes..."
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 pr-24 h-10 bg-background/50 border-border/50 rounded-full focus:bg-background transition-all duration-300"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 rounded-full px-4 h-8 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              // <div className="flex items-center space-x-2">
              //   {/* Notifications */}
              //   <Button variant="ghost" size="icon" className="relative">
              //     <Bell className="h-4 w-4" />
              //     <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive hover:bg-destructive/90">
              //       3
              //     </Badge>
              //   </Button>

              //   {/* User Dropdown */}
              //   <DropdownMenu>
              //     <DropdownMenuTrigger asChild>
              //       <Button
              //         variant="ghost"
              //         className="flex items-center space-x-2 h-10 px-3"
              //       >
              //         <UserAvatar />
              //         <span className="text-sm font-medium">
              //           {user?.name || "User"}
              //         </span>
              //         <ChevronDown className="h-4 w-4 text-muted-foreground" />
              //       </Button>
              //     </DropdownMenuTrigger>
              //     <DropdownMenuContent align="end" className="w-56">
              //       <DropdownMenuLabel>My Account</DropdownMenuLabel>
              //       <DropdownMenuSeparator />
              //       <DropdownMenuItem>
              //         <User className="mr-2 h-4 w-4" />
              //         Profile
              //       </DropdownMenuItem>
              //       <DropdownMenuItem>
              //         <Heart className="mr-2 h-4 w-4" />
              //         Favorites
              //       </DropdownMenuItem>
              //       <DropdownMenuItem>
              //         <Download className="mr-2 h-4 w-4" />
              //         Downloads
              //       </DropdownMenuItem>
              //       <DropdownMenuItem>
              //         <Settings className="mr-2 h-4 w-4" />
              //         Settings
              //       </DropdownMenuItem>
              //       <DropdownMenuSeparator />
              //       <DropdownMenuItem
              //         onClick={logout}
              //         className="text-destructive focus:text-destructive"
              //       >
              //         <LogOut className="mr-2 h-4 w-4" />
              //         Sign out
              //       </DropdownMenuItem>
              //     </DropdownMenuContent>
              //   </DropdownMenu>
              // </div>
              <div className="space-y-2">
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Sheet Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-primary rounded-xl">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span>D-wally</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={query}
                        placeholder="Search..."
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Search
                    </Button>
                  </form>

                  <Separator />

                  {/* Mobile Auth Section */}
                  {isLoggedIn ? (
                    // <div className="space-y-4">
                    //   <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    //     <UserAvatar className="h-10 w-10" />
                    //     <div>
                    //       <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    //       <p className="text-xs text-muted-foreground">{user?.email}</p>
                    //     </div>
                    //   </div>

                    //   <div className="space-y-2">
                    //     <Button variant="ghost" className="w-full justify-start">
                    //       <User className="mr-2 h-4 w-4" />
                    //       Profile
                    //     </Button>
                    //     <Button variant="ghost" className="w-full justify-start">
                    //       <Heart className="mr-2 h-4 w-4" />
                    //       Favorites
                    //     </Button>
                    //     <Button variant="ghost" className="w-full justify-start">
                    //       <Download className="mr-2 h-4 w-4" />
                    //       Downloads
                    //     </Button>
                    //     <Button variant="ghost" className="w-full justify-start">
                    //       <Settings className="mr-2 h-4 w-4" />
                    //       Settings
                    //     </Button>

                    //     <Separator />

                    //     <Button
                    //       onClick={logout}
                    //       variant="ghost"
                    //       className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    //     >
                    //       <LogOut className="mr-2 h-4 w-4" />
                    //       Sign out
                    //     </Button>
                    //   </div>
                    // </div>
                    <div className="space-y-2">
                      <Button
                        onClick={logout}
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        asChild
                        className="w-full justify-start"
                      >
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
