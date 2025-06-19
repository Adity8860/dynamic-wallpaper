export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">L</span>
            </div>
            <span className="text-lg font-semibold">Logo</span>
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
