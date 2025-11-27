export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">
            About
          </a>
          <span className="hidden md:inline">•</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <span className="hidden md:inline">•</span>
          <p>Helping you verify realistic tech experience requirements</p>
        </div>
      </div>
    </footer>
  )
}
