"use client";

import Link from "next/link";
import { Button } from "@/Components/ui/button.jsx";
import { Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [query, setQuery] = useState("");
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${query}`);
    }
  };
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Logo</span>
            </Link>
          </div>

          {/* Search Field */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="flex">
              {" "}
              <div className="flex">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>

                  <input
                    type="text"
                    value={query}
                    placeholder="Search..."
                    onChange={(e) => setQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button type="submit" className="rounded-l-none">
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <Button className="rounded-l-none">Search</Button>
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col space-y-2 px-3">
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  
                  <Button className="justify-start" asChild>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
