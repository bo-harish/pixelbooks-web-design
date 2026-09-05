import { useEffect, useState } from "react";

export type PublisherThemeModeTokens = {
  color: string;
  bgLight: string;
  brand: string;
  brandContrast: string;
  brandGlow: string;
  sidebarHighlight: string;
  sidebarHighlightIcon: string;
  primary: string;
  ring: string;
  sidebarPrimary: string;
  sidebarAccent: string;
};

export type PublisherColorTheme = {
  id: string;
  name: string;
  tag: string;
  description: string;
  primaryColor: string; // Preview hex/swatch
  accentColor: string;  // Secondary preview swatch
  light: PublisherThemeModeTokens;
  dark: PublisherThemeModeTokens;
};

export const DEFAULT_PUBLISHER_THEME_ID = "classic-teal";
export const PUBLISHER_THEME_STORAGE_KEY = "pixelbooks_publisher_color_theme";
export const PUBLISHER_THEME_EVENT = "pixelbooks_publisher_theme_updated";

export const PUBLISHER_THEMES: PublisherColorTheme[] = [
  {
    id: "classic-teal",
    name: "Classic Teal",
    tag: "Default",
    description: "The signature PixelBooks teal palette with balanced contrast and clarity.",
    primaryColor: "#0f766e",
    accentColor: "#14b8a6",
    light: {
      color: "oklch(0.55 0.11 195)",
      bgLight: "color-mix(in oklab, oklch(0.55 0.11 195) 14%, transparent)",
      brand: "oklch(0.55 0.11 195)",
      brandContrast: "oklch(0.99 0.005 200)",
      brandGlow: "oklch(0.55 0.11 195 / 0.28)",
      sidebarHighlight: "oklch(0.94 0.02 195)",
      sidebarHighlightIcon: "oklch(0.5 0.1 195)",
      primary: "oklch(0.55 0.11 195)",
      ring: "oklch(0.55 0.11 195)",
      sidebarPrimary: "oklch(0.55 0.11 195)",
      sidebarAccent: "oklch(0.9 0.06 195)",
    },
    dark: {
      color: "oklch(0.74 0.14 175)",
      bgLight: "color-mix(in oklab, oklch(0.74 0.14 175) 16%, transparent)",
      brand: "oklch(0.78 0.17 155)",
      brandContrast: "oklch(0.19 0.03 220)",
      brandGlow: "oklch(0.78 0.17 155 / 0.32)",
      sidebarHighlight: "oklch(0.38 0.08 200)",
      sidebarHighlightIcon: "oklch(0.86 0.18 155)",
      primary: "oklch(0.62 0.11 195)",
      ring: "oklch(0.62 0.11 195)",
      sidebarPrimary: "oklch(0.62 0.11 195)",
      sidebarAccent: "oklch(0.38 0.08 200)",
    },
  },
  {
    id: "royal-indigo",
    name: "Royal Indigo",
    tag: "Scholarly",
    description: "Refined academic navy and deep indigo for prestige and university presses.",
    primaryColor: "#4338ca",
    accentColor: "#6366f1",
    light: {
      color: "oklch(0.50 0.20 270)",
      bgLight: "color-mix(in oklab, oklch(0.50 0.20 270) 14%, transparent)",
      brand: "oklch(0.50 0.20 270)",
      brandContrast: "oklch(0.99 0.005 270)",
      brandGlow: "oklch(0.50 0.20 270 / 0.28)",
      sidebarHighlight: "oklch(0.95 0.03 270)",
      sidebarHighlightIcon: "oklch(0.46 0.22 270)",
      primary: "oklch(0.50 0.20 270)",
      ring: "oklch(0.50 0.20 270)",
      sidebarPrimary: "oklch(0.50 0.20 270)",
      sidebarAccent: "oklch(0.92 0.05 270)",
    },
    dark: {
      color: "oklch(0.72 0.18 270)",
      bgLight: "color-mix(in oklab, oklch(0.72 0.18 270) 18%, transparent)",
      brand: "oklch(0.72 0.18 270)",
      brandContrast: "oklch(0.18 0.04 270)",
      brandGlow: "oklch(0.72 0.18 270 / 0.35)",
      sidebarHighlight: "oklch(0.28 0.08 270)",
      sidebarHighlightIcon: "oklch(0.82 0.16 270)",
      primary: "oklch(0.72 0.18 270)",
      ring: "oklch(0.72 0.18 270)",
      sidebarPrimary: "oklch(0.72 0.18 270)",
      sidebarAccent: "oklch(0.30 0.09 270)",
    },
  },
  {
    id: "emerald-forest",
    name: "Emerald Forest",
    tag: "Prestigious",
    description: "Deep botanical green reflecting vitality, growth, and academic heritage.",
    primaryColor: "#047857",
    accentColor: "#10b981",
    light: {
      color: "oklch(0.54 0.17 155)",
      bgLight: "color-mix(in oklab, oklch(0.54 0.17 155) 14%, transparent)",
      brand: "oklch(0.54 0.17 155)",
      brandContrast: "oklch(0.99 0.005 155)",
      brandGlow: "oklch(0.54 0.17 155 / 0.28)",
      sidebarHighlight: "oklch(0.95 0.03 155)",
      sidebarHighlightIcon: "oklch(0.48 0.18 155)",
      primary: "oklch(0.54 0.17 155)",
      ring: "oklch(0.54 0.17 155)",
      sidebarPrimary: "oklch(0.54 0.17 155)",
      sidebarAccent: "oklch(0.91 0.06 155)",
    },
    dark: {
      color: "oklch(0.75 0.17 155)",
      bgLight: "color-mix(in oklab, oklch(0.75 0.17 155) 18%, transparent)",
      brand: "oklch(0.75 0.17 155)",
      brandContrast: "oklch(0.18 0.04 155)",
      brandGlow: "oklch(0.75 0.17 155 / 0.35)",
      sidebarHighlight: "oklch(0.28 0.07 155)",
      sidebarHighlightIcon: "oklch(0.82 0.16 155)",
      primary: "oklch(0.75 0.17 155)",
      ring: "oklch(0.75 0.17 155)",
      sidebarPrimary: "oklch(0.75 0.17 155)",
      sidebarAccent: "oklch(0.30 0.08 155)",
    },
  },
  {
    id: "sapphire-blue",
    name: "Sapphire Blue",
    tag: "Executive",
    description: "Vibrant ultramarine and royal cobalt tailored for corporate publications.",
    primaryColor: "#1d4ed8",
    accentColor: "#3b82f6",
    light: {
      color: "oklch(0.52 0.20 250)",
      bgLight: "color-mix(in oklab, oklch(0.52 0.20 250) 14%, transparent)",
      brand: "oklch(0.52 0.20 250)",
      brandContrast: "oklch(0.99 0.005 250)",
      brandGlow: "oklch(0.52 0.20 250 / 0.28)",
      sidebarHighlight: "oklch(0.95 0.03 250)",
      sidebarHighlightIcon: "oklch(0.48 0.22 250)",
      primary: "oklch(0.52 0.20 250)",
      ring: "oklch(0.52 0.20 250)",
      sidebarPrimary: "oklch(0.52 0.20 250)",
      sidebarAccent: "oklch(0.92 0.05 250)",
    },
    dark: {
      color: "oklch(0.72 0.18 250)",
      bgLight: "color-mix(in oklab, oklch(0.72 0.18 250) 18%, transparent)",
      brand: "oklch(0.72 0.18 250)",
      brandContrast: "oklch(0.18 0.04 250)",
      brandGlow: "oklch(0.72 0.18 250 / 0.35)",
      sidebarHighlight: "oklch(0.28 0.08 250)",
      sidebarHighlightIcon: "oklch(0.80 0.17 250)",
      primary: "oklch(0.72 0.18 250)",
      ring: "oklch(0.72 0.18 250)",
      sidebarPrimary: "oklch(0.72 0.18 250)",
      sidebarAccent: "oklch(0.30 0.09 250)",
    },
  },
  {
    id: "crimson-ruby",
    name: "Crimson Ruby",
    tag: "Editorial",
    description: "Bold carmine and rich crimson accents for high-energy catalogs and bestsellers.",
    primaryColor: "#be123c",
    accentColor: "#f43f5e",
    light: {
      color: "oklch(0.54 0.22 15)",
      bgLight: "color-mix(in oklab, oklch(0.54 0.22 15) 14%, transparent)",
      brand: "oklch(0.54 0.22 15)",
      brandContrast: "oklch(0.99 0.005 15)",
      brandGlow: "oklch(0.54 0.22 15 / 0.28)",
      sidebarHighlight: "oklch(0.96 0.03 15)",
      sidebarHighlightIcon: "oklch(0.50 0.23 15)",
      primary: "oklch(0.54 0.22 15)",
      ring: "oklch(0.54 0.22 15)",
      sidebarPrimary: "oklch(0.54 0.22 15)",
      sidebarAccent: "oklch(0.93 0.05 15)",
    },
    dark: {
      color: "oklch(0.72 0.20 15)",
      bgLight: "color-mix(in oklab, oklch(0.72 0.20 15) 18%, transparent)",
      brand: "oklch(0.72 0.20 15)",
      brandContrast: "oklch(0.18 0.04 15)",
      brandGlow: "oklch(0.72 0.20 15 / 0.35)",
      sidebarHighlight: "oklch(0.28 0.08 15)",
      sidebarHighlightIcon: "oklch(0.82 0.18 15)",
      primary: "oklch(0.72 0.20 15)",
      ring: "oklch(0.72 0.20 15)",
      sidebarPrimary: "oklch(0.72 0.20 15)",
      sidebarAccent: "oklch(0.30 0.09 15)",
    },
  },
  {
    id: "amethyst-purple",
    name: "Amethyst Purple",
    tag: "Creative",
    description: "Luxurious violet and orchid tones that highlight fine arts, design, and literature.",
    primaryColor: "#7e22ce",
    accentColor: "#a855f7",
    light: {
      color: "oklch(0.52 0.23 305)",
      bgLight: "color-mix(in oklab, oklch(0.52 0.23 305) 14%, transparent)",
      brand: "oklch(0.52 0.23 305)",
      brandContrast: "oklch(0.99 0.005 305)",
      brandGlow: "oklch(0.52 0.23 305 / 0.28)",
      sidebarHighlight: "oklch(0.95 0.03 305)",
      sidebarHighlightIcon: "oklch(0.48 0.24 305)",
      primary: "oklch(0.52 0.23 305)",
      ring: "oklch(0.52 0.23 305)",
      sidebarPrimary: "oklch(0.52 0.23 305)",
      sidebarAccent: "oklch(0.92 0.05 305)",
    },
    dark: {
      color: "oklch(0.72 0.19 305)",
      bgLight: "color-mix(in oklab, oklch(0.72 0.19 305) 18%, transparent)",
      brand: "oklch(0.72 0.19 305)",
      brandContrast: "oklch(0.18 0.04 305)",
      brandGlow: "oklch(0.72 0.19 305 / 0.35)",
      sidebarHighlight: "oklch(0.28 0.08 305)",
      sidebarHighlightIcon: "oklch(0.80 0.18 305)",
      primary: "oklch(0.72 0.19 305)",
      ring: "oklch(0.72 0.19 305)",
      sidebarPrimary: "oklch(0.72 0.19 305)",
      sidebarAccent: "oklch(0.30 0.09 305)",
    },
  },
  {
    id: "warm-amber",
    name: "Warm Amber",
    tag: "Vintage",
    description: "Golden honey and ochre nuances reminiscent of classic illuminated manuscripts.",
    primaryColor: "#b45309",
    accentColor: "#f59e0b",
    light: {
      color: "oklch(0.58 0.17 65)",
      bgLight: "color-mix(in oklab, oklch(0.58 0.17 65) 14%, transparent)",
      brand: "oklch(0.58 0.17 65)",
      brandContrast: "oklch(0.99 0.005 65)",
      brandGlow: "oklch(0.58 0.17 65 / 0.28)",
      sidebarHighlight: "oklch(0.96 0.03 65)",
      sidebarHighlightIcon: "oklch(0.52 0.18 65)",
      primary: "oklch(0.58 0.17 65)",
      ring: "oklch(0.58 0.17 65)",
      sidebarPrimary: "oklch(0.58 0.17 65)",
      sidebarAccent: "oklch(0.93 0.05 65)",
    },
    dark: {
      color: "oklch(0.78 0.16 65)",
      bgLight: "color-mix(in oklab, oklch(0.78 0.16 65) 18%, transparent)",
      brand: "oklch(0.78 0.16 65)",
      brandContrast: "oklch(0.18 0.04 65)",
      brandGlow: "oklch(0.78 0.16 65 / 0.35)",
      sidebarHighlight: "oklch(0.30 0.07 65)",
      sidebarHighlightIcon: "oklch(0.85 0.16 65)",
      primary: "oklch(0.78 0.16 65)",
      ring: "oklch(0.78 0.16 65)",
      sidebarPrimary: "oklch(0.78 0.16 65)",
      sidebarAccent: "oklch(0.32 0.08 65)",
    },
  },
  {
    id: "nordic-slate",
    name: "Nordic Slate",
    tag: "Minimalist",
    description: "Clean graphite, charcoal, and cool steel for an understated modern workspace.",
    primaryColor: "#334155",
    accentColor: "#64748b",
    light: {
      color: "oklch(0.44 0.04 250)",
      bgLight: "color-mix(in oklab, oklch(0.44 0.04 250) 14%, transparent)",
      brand: "oklch(0.44 0.04 250)",
      brandContrast: "oklch(0.99 0.005 250)",
      brandGlow: "oklch(0.44 0.04 250 / 0.28)",
      sidebarHighlight: "oklch(0.94 0.01 250)",
      sidebarHighlightIcon: "oklch(0.38 0.05 250)",
      primary: "oklch(0.44 0.04 250)",
      ring: "oklch(0.44 0.04 250)",
      sidebarPrimary: "oklch(0.44 0.04 250)",
      sidebarAccent: "oklch(0.90 0.02 250)",
    },
    dark: {
      color: "oklch(0.74 0.04 250)",
      bgLight: "color-mix(in oklab, oklch(0.74 0.04 250) 18%, transparent)",
      brand: "oklch(0.74 0.04 250)",
      brandContrast: "oklch(0.18 0.02 250)",
      brandGlow: "oklch(0.74 0.04 250 / 0.35)",
      sidebarHighlight: "oklch(0.28 0.02 250)",
      sidebarHighlightIcon: "oklch(0.85 0.04 250)",
      primary: "oklch(0.74 0.04 250)",
      ring: "oklch(0.74 0.04 250)",
      sidebarPrimary: "oklch(0.74 0.04 250)",
      sidebarAccent: "oklch(0.30 0.03 250)",
    },
  },
  {
    id: "midnight-plum",
    name: "Midnight Plum",
    tag: "Literary",
    description: "Deep blackberry, wine, and regal aubergine for timeless humanities collections.",
    primaryColor: "#581c87",
    accentColor: "#9333ea",
    light: {
      color: "oklch(0.46 0.22 315)",
      bgLight: "color-mix(in oklab, oklch(0.46 0.22 315) 14%, transparent)",
      brand: "oklch(0.46 0.22 315)",
      brandContrast: "oklch(0.99 0.005 315)",
      brandGlow: "oklch(0.46 0.22 315 / 0.28)",
      sidebarHighlight: "oklch(0.95 0.03 315)",
      sidebarHighlightIcon: "oklch(0.42 0.23 315)",
      primary: "oklch(0.46 0.22 315)",
      ring: "oklch(0.46 0.22 315)",
      sidebarPrimary: "oklch(0.46 0.22 315)",
      sidebarAccent: "oklch(0.91 0.05 315)",
    },
    dark: {
      color: "oklch(0.70 0.19 315)",
      bgLight: "color-mix(in oklab, oklch(0.70 0.19 315) 18%, transparent)",
      brand: "oklch(0.70 0.19 315)",
      brandContrast: "oklch(0.18 0.04 315)",
      brandGlow: "oklch(0.70 0.19 315 / 0.35)",
      sidebarHighlight: "oklch(0.27 0.08 315)",
      sidebarHighlightIcon: "oklch(0.82 0.18 315)",
      primary: "oklch(0.70 0.19 315)",
      ring: "oklch(0.70 0.19 315)",
      sidebarPrimary: "oklch(0.70 0.19 315)",
      sidebarAccent: "oklch(0.29 0.09 315)",
    },
  },
  {
    id: "sunset-coral",
    name: "Sunset Coral",
    tag: "Dynamic",
    description: "Warm terracotta, burnt sienna, and vibrant coral for engaging interactive presses.",
    primaryColor: "#c2410c",
    accentColor: "#f97316",
    light: {
      color: "oklch(0.58 0.20 45)",
      bgLight: "color-mix(in oklab, oklch(0.58 0.20 45) 14%, transparent)",
      brand: "oklch(0.58 0.20 45)",
      brandContrast: "oklch(0.99 0.005 45)",
      brandGlow: "oklch(0.58 0.20 45 / 0.28)",
      sidebarHighlight: "oklch(0.96 0.03 45)",
      sidebarHighlightIcon: "oklch(0.52 0.21 45)",
      primary: "oklch(0.58 0.20 45)",
      ring: "oklch(0.58 0.20 45)",
      sidebarPrimary: "oklch(0.58 0.20 45)",
      sidebarAccent: "oklch(0.93 0.05 45)",
    },
    dark: {
      color: "oklch(0.74 0.18 45)",
      bgLight: "color-mix(in oklab, oklch(0.74 0.18 45) 18%, transparent)",
      brand: "oklch(0.74 0.18 45)",
      brandContrast: "oklch(0.18 0.04 45)",
      brandGlow: "oklch(0.74 0.18 45 / 0.35)",
      sidebarHighlight: "oklch(0.29 0.08 45)",
      sidebarHighlightIcon: "oklch(0.84 0.17 45)",
      primary: "oklch(0.74 0.18 45)",
      ring: "oklch(0.74 0.18 45)",
      sidebarPrimary: "oklch(0.74 0.18 45)",
      sidebarAccent: "oklch(0.31 0.09 45)",
    },
  },
];

export function getActivePublisherThemeId(): string {
  if (typeof window === "undefined") return DEFAULT_PUBLISHER_THEME_ID;
  const stored = localStorage.getItem(PUBLISHER_THEME_STORAGE_KEY);
  if (stored && PUBLISHER_THEMES.some((t) => t.id === stored)) {
    return stored;
  }
  return DEFAULT_PUBLISHER_THEME_ID;
}

export function getActivePublisherTheme(): PublisherColorTheme {
  const id = getActivePublisherThemeId();
  return PUBLISHER_THEMES.find((t) => t.id === id) || PUBLISHER_THEMES[0];
}

export function setPublisherTheme(themeId: string): void {
  if (typeof window === "undefined") return;
  const exists = PUBLISHER_THEMES.some((t) => t.id === themeId);
  const targetId = exists ? themeId : DEFAULT_PUBLISHER_THEME_ID;
  localStorage.setItem(PUBLISHER_THEME_STORAGE_KEY, targetId);

  const theme = PUBLISHER_THEMES.find((t) => t.id === targetId) || PUBLISHER_THEMES[0];
  applyPublisherThemeStyles(theme, window.location.pathname.startsWith("/publisher"));
  window.dispatchEvent(new Event(PUBLISHER_THEME_EVENT));
}

const STYLE_TAG_ID = "pb-publisher-dynamic-theme";

export function applyPublisherThemeStyles(theme: PublisherColorTheme, isPublisherPath: boolean): void {
  if (typeof document === "undefined") return;

  let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;

  if (!isPublisherPath) {
    if (styleTag) {
      styleTag.textContent = "";
    }
    return;
  }

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = STYLE_TAG_ID;
    document.head.appendChild(styleTag);
  }

  styleTag.textContent = `
    :root {
      --brand: ${theme.light.brand};
      --brand-contrast: ${theme.light.brandContrast};
      --brand-glow: ${theme.light.brandGlow};
      --sidebar-highlight: ${theme.light.sidebarHighlight};
      --sidebar-highlight-icon: ${theme.light.sidebarHighlightIcon};
      --primary: ${theme.light.primary};
      --ring: ${theme.light.ring};
      --sidebar-primary: ${theme.light.sidebarPrimary};
      --sidebar-accent: ${theme.light.sidebarAccent};
    }
    .dark {
      --brand: ${theme.dark.brand};
      --brand-contrast: ${theme.dark.brandContrast};
      --brand-glow: ${theme.dark.brandGlow};
      --sidebar-highlight: ${theme.dark.sidebarHighlight};
      --sidebar-highlight-icon: ${theme.dark.sidebarHighlightIcon};
      --primary: ${theme.dark.primary};
      --ring: ${theme.dark.ring};
      --sidebar-primary: ${theme.dark.sidebarPrimary};
      --sidebar-accent: ${theme.dark.sidebarAccent};
    }
  `;
}

export function usePublisherTheme() {
  const [themeId, setThemeId] = useState<string>(getActivePublisherThemeId);

  useEffect(() => {
    const handleUpdate = () => {
      setThemeId(getActivePublisherThemeId());
    };

    window.addEventListener(PUBLISHER_THEME_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(PUBLISHER_THEME_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const currentTheme = PUBLISHER_THEMES.find((t) => t.id === themeId) || PUBLISHER_THEMES[0];

  const updateTheme = (newId: string) => {
    setPublisherTheme(newId);
    setThemeId(newId);
  };

  const resetToDefault = () => {
    updateTheme(DEFAULT_PUBLISHER_THEME_ID);
  };

  return {
    themeId,
    currentTheme,
    themes: PUBLISHER_THEMES,
    setTheme: updateTheme,
    resetToDefault,
    isDefault: themeId === DEFAULT_PUBLISHER_THEME_ID,
  };
}
