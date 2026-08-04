import React from "react";

export interface BookCoverProps {
  initials?: string;
  coverGradient?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  title?: string;
  showLogo?: boolean;
}

export function BookCover({
  initials,
  coverGradient = "linear-gradient(135deg, #059669, #10b981)",
  size = "sm",
  className = "",
  title,
  showLogo = true,
}: BookCoverProps) {
  const sizeClasses = {
    xs: "h-12 w-9 text-[8px]",
    sm: "h-14 w-10 text-[9.5px]",
    md: "h-16 w-12 text-[10px]",
    lg: "h-20 w-14 text-xs",
    xl: "h-28 w-20 text-sm",
  }[size];

  const logoSizes = {
    xs: "h-3.5 w-3.5",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  }[size];

  return (
    <div
      className={`relative flex shrink-0 flex-col items-center justify-between rounded-md p-1 font-bold text-white shadow-sm ring-1 ring-black/15 overflow-hidden transition-transform duration-200 group-hover:scale-105 ${sizeClasses} ${className}`}
      style={{ background: coverGradient }}
      title={title}
    >
      {/* 3D Spine Depth Shadow (Left edge) */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-10" />

      {/* Glossy Paper Lighting Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/20 pointer-events-none" />

      {/* Brand App Icon Watermark / Emblem */}
      {showLogo && (
        <div className="relative z-10 pt-0.5 flex items-center justify-center">
          <div className="rounded-full bg-black/25 p-0.5 backdrop-blur-[1px] shadow-2xs border border-white/25">
            <img src="/logo-app-icon.png" alt="PixelBooks Icon" className={`object-contain ${logoSizes}`} />
          </div>
        </div>
      )}

      {/* Book Initials Badge */}
      {initials && (
        <span className="relative z-10 pb-0.5 font-extrabold tracking-wider text-white drop-shadow-md">
          {initials}
        </span>
      )}
    </div>
  );
}
