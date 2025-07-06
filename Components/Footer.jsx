import Link from "next/link"
import { Sparkles } from "lucide-react"


export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Logo */}
          {/* <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">L</span>
            </div>
            <span className="text-lg font-semibold">Logo</span>
          </div> */}
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
            
            </Link>
          </div>

          {/* Copyright Disclaimer */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
