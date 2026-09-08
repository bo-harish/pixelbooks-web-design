import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export function PbWebFooter() {
  return (
    <footer className="w-full border-t border-border/70 bg-white py-8 px-4 sm:px-8 md:px-12 text-xs text-muted-foreground mt-16">
      <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Copyright */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center transition-opacity hover:opacity-85" title="PixelBooks - Workspace Selector">
            <img
              src="/logo.png"
              alt="PixelBooks"
              className="h-6 w-auto object-contain opacity-80"
            />
          </Link>
          <span>© 2026 PixelBooks. All rights reserved.</span>
        </div>

        {/* Middle: Individual Social Media Icon Containers */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-border/80 bg-neutral-50/80 text-muted-foreground shadow-2xs transition-all hover:bg-white hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:shadow-xs hover:-translate-y-0.5"
            title="Facebook"
            aria-label="Facebook"
          >
            <Facebook size={16} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-border/80 bg-neutral-50/80 text-muted-foreground shadow-2xs transition-all hover:bg-white hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:shadow-xs hover:-translate-y-0.5"
            title="Instagram"
            aria-label="Instagram"
          >
            <Instagram size={16} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-border/80 bg-neutral-50/80 text-muted-foreground shadow-2xs transition-all hover:bg-white hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:shadow-xs hover:-translate-y-0.5"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6">
          <Link to="/pb-web/about" className="hover:text-foreground transition-colors">
            About Us
          </Link>
          <Link to="/pb-web/faq" className="hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link to="/pb-web/support" className="hover:text-[#137365] transition-colors">
            Support
          </Link>
          <Link to="/pb-web/terms-conditions" className="hover:text-foreground transition-colors">
            Terms & Conditions
          </Link>
          <Link to="/pb-web/privacy-policy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
