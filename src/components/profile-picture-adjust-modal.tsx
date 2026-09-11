import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Check,
  Upload,
  Circle,
  Square,
  Move,
} from "lucide-react";
import { toast } from "sonner";

export interface ProfilePictureAdjustModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  title?: string;
  description?: string;
  cropShape?: "circle" | "round-square";
  onApply: (croppedDataUrl: string) => void;
  onSelectNewFile?: (file: File) => void;
}

const CROP_BOX_SIZE = 280; // Size of the framing box in px
const CROP_DIAMETER = 240; // Diameter of the crop circle/square

export function ProfilePictureAdjustModal({
  open,
  onOpenChange,
  imageSrc,
  title = "Adjust Profile Picture",
  description = "Drag to reposition the picture. Use zoom, rotate, and nudge controls to frame it.",
  cropShape: initialCropShape = "circle",
  onApply,
  onSelectNewFile,
}: ProfilePictureAdjustModalProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0); // in degrees: 0, 90, 180, 270
  const [cropShape, setCropShape] = useState<"circle" | "round-square">(initialCropShape);
  const [imageNaturalSize, setImageNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // Sync cropShape if prop changes
  useEffect(() => {
    setCropShape(initialCropShape);
  }, [initialCropShape]);

  // Reset adjustments whenever a new image is loaded or modal opens
  useEffect(() => {
    if (open && imageSrc) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setIsDragging(false);

      const img = new Image();
      img.onload = () => {
        setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = imageSrc;
    }
  }, [open, imageSrc]);

  // Compute base dimensions to cover CROP_DIAMETER
  const getBaseDimensions = useCallback(() => {
    if (!imageNaturalSize) return { width: CROP_DIAMETER, height: CROP_DIAMETER, baseScale: 1 };
    const { width: nw, height: nh } = imageNaturalSize;
    // Fit shortest edge to CROP_DIAMETER
    const baseScale = Math.max(CROP_DIAMETER / nw, CROP_DIAMETER / nh);
    return {
      width: nw * baseScale,
      height: nh * baseScale,
      baseScale,
    };
  }, [imageNaturalSize]);

  const { width: baseWidth, height: baseHeight } = getBaseDimensions();

  // Pointer drag handlers for mouse & touch
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: Math.round(dragStartRef.current.panX + dx),
      y: Math.round(dragStartRef.current.panY + dy),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    dragStartRef.current = null;
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    setZoom((prev) => Math.min(3, Math.max(1, +(prev + delta).toFixed(2))));
  };

  // Nudge position
  const nudge = (dx: number, dy: number) => {
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  // Reset to default
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    toast.info("Position and zoom reset");
  };

  // Rotate 90 deg clockwise / counter-clockwise
  const handleRotate = (dir: 90 | -90) => {
    setRotation((r) => (r + dir + 360) % 360);
  };

  // Switch file
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      onSelectNewFile?.(file);
    }
  };

  // Export cropped image via Canvas
  const handleApply = () => {
    if (!imageSrc || !imageNaturalSize) return;

    const OUTPUT_SIZE = 512; // High-res square output
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      toast.error("Failed to generate adjusted image.");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Clear canvas
      ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      // Clip according to shape
      if (cropShape === "circle") {
        ctx.beginPath();
        ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      } else {
        // Rounded square clip
        const radius = 64;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(OUTPUT_SIZE - radius, 0);
        ctx.quadraticCurveTo(OUTPUT_SIZE, 0, OUTPUT_SIZE, radius);
        ctx.lineTo(OUTPUT_SIZE, OUTPUT_SIZE - radius);
        ctx.quadraticCurveTo(OUTPUT_SIZE, OUTPUT_SIZE, OUTPUT_SIZE - radius, OUTPUT_SIZE);
        ctx.lineTo(radius, OUTPUT_SIZE);
        ctx.quadraticCurveTo(0, OUTPUT_SIZE, 0, OUTPUT_SIZE - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.clip();
      }

      // Scaling factor from UI crop circle to output canvas
      const scaleFactor = OUTPUT_SIZE / CROP_DIAMETER;

      // Center translation
      ctx.translate(OUTPUT_SIZE / 2 + pan.x * scaleFactor, OUTPUT_SIZE / 2 + pan.y * scaleFactor);
      ctx.rotate((rotation * Math.PI) / 180);

      // Render image centered
      const drawWidth = baseWidth * zoom * scaleFactor;
      const drawHeight = baseHeight * zoom * scaleFactor;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

      const croppedDataUrl = canvas.toDataURL("image/png", 0.95);
      onApply(croppedDataUrl);
      onOpenChange(false);
      toast.success("Profile picture updated successfully!");
    };

    img.onerror = () => {
      toast.error("Could not load image for cropping.");
    };

    img.src = imageSrc;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 gap-0 overflow-hidden bg-card border-border rounded-2xl shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-5 pb-4 border-b border-border/70 text-left">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Move size={18} className="text-[var(--brand)]" />
            <DialogTitle className="text-base sm:text-lg font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Viewport Area */}
        <div className="p-5 flex flex-col items-center justify-center bg-secondary/15 select-none">
          <div
            className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-border shadow-inner cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
            style={{ width: CROP_BOX_SIZE, height: CROP_BOX_SIZE }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
          >
            {/* The Scaled & Translated Image */}
            {imageSrc && (
              <div
                className="absolute flex items-center justify-center pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px)`,
                }}
              >
                <img
                  ref={imageElementRef}
                  src={imageSrc}
                  alt="Crop Target"
                  draggable={false}
                  className="max-w-none select-none pointer-events-none"
                  style={{
                    width: `${baseWidth}px`,
                    height: `${baseHeight}px`,
                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                    transformOrigin: "center center",
                  }}
                />
              </div>
            )}

            {/* Dark Mask with Clear Cutout Overlay */}
            <div
              className={`pointer-events-none absolute inset-0 transition-all ${
                cropShape === "circle" ? "rounded-full" : "rounded-3xl"
              }`}
              style={{
                width: CROP_DIAMETER,
                height: CROP_DIAMETER,
                left: (CROP_BOX_SIZE - CROP_DIAMETER) / 2,
                top: (CROP_BOX_SIZE - CROP_DIAMETER) / 2,
                boxShadow: "0 0 0 9999px rgba(10, 15, 25, 0.72)",
                border: "2px solid rgba(255, 255, 255, 0.9)",
              }}
            >
              {/* Rule of Thirds Guide Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 pointer-events-none">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Center Crosshair Marker */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="h-2 w-2 rounded-full border border-white" />
              </div>
            </div>

            {/* Drag helper tooltip badge */}
            <div className="absolute bottom-2.5 inset-x-0 flex justify-center pointer-events-none">
              <span className="bg-black/60 backdrop-blur-xs text-[10px] font-medium text-white/90 px-2.5 py-0.5 rounded-full border border-white/10 shadow-xs">
                {isDragging ? "Panning..." : "Click & drag to reposition"}
              </span>
            </div>
          </div>

          {/* Quick Preview & Shape Indicator */}
          <div className="mt-3 flex items-center justify-between w-full max-w-[340px] px-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-semibold text-foreground text-[11px]">Preview:</span>
              <div
                className={`relative h-9 w-9 overflow-hidden border border-border bg-card shadow-xs ${
                  cropShape === "circle" ? "rounded-full" : "rounded-lg"
                }`}
              >
                {imageSrc && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      transform: `translate(${(pan.x / CROP_DIAMETER) * 36}px, ${(pan.y / CROP_DIAMETER) * 36}px)`,
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt="Mini Preview"
                      draggable={false}
                      className="max-w-none select-none pointer-events-none"
                      style={{
                        width: `${(baseWidth / CROP_DIAMETER) * 36}px`,
                        height: `${(baseHeight / CROP_DIAMETER) * 36}px`,
                        transform: `rotate(${rotation}deg) scale(${zoom})`,
                        transformOrigin: "center center",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Shape toggle buttons */}
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setCropShape("circle")}
                className={`flex h-7 items-center gap-1 px-2 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  cropShape === "circle"
                    ? "bg-[var(--brand)] text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Circular avatar mask"
              >
                <Circle size={12} />
                <span>Circle</span>
              </button>
              <button
                type="button"
                onClick={() => setCropShape("round-square")}
                className={`flex h-7 items-center gap-1 px-2 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  cropShape === "round-square"
                    ? "bg-[var(--brand)] text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Rounded square mask"
              >
                <Square size={12} />
                <span>Rounded</span>
              </button>
            </div>
          </div>
        </div>

        {/* Position & Picture Adjustment Controls */}
        <div className="p-5 space-y-4 border-t border-border/70 bg-card">
          {/* Zoom Slider Control */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <ZoomIn size={14} className="text-muted-foreground" />
                Zoom
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)))}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>

              <div className="flex-1 py-1">
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.02}
                  onValueChange={([val]) => setZoom(val)}
                  className="cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
            </div>
          </div>

          {/* Alignment Nudges & Rotation Grid */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Directional Nudges */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Nudge Position
              </span>
              <div className="flex items-center gap-1.5">
                <div className="grid grid-cols-3 gap-1 w-24">
                  <div />
                  <button
                    type="button"
                    onClick={() => nudge(0, -10)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    title="Nudge Up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <div />
                  <button
                    type="button"
                    onClick={() => nudge(-10, 0)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    title="Nudge Left"
                  >
                    <ArrowLeft size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-secondary/70 text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    title="Center & Reset"
                  >
                    <RefreshCw size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudge(10, 0)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    title="Nudge Right"
                  >
                    <ArrowRight size={13} />
                  </button>
                  <div />
                  <button
                    type="button"
                    onClick={() => nudge(0, 10)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    title="Nudge Down"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <div />
                </div>

                <div className="text-[11px] text-muted-foreground flex flex-col justify-center">
                  <span>Offset:</span>
                  <span className="font-mono text-[10px]">
                    X: {pan.x}px | Y: {pan.y}px
                  </span>
                </div>
              </div>
            </div>

            {/* Rotation & Reset */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Rotate & Reset
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRotate(-90)}
                  className="flex h-8 items-center gap-1.5 px-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  title="Rotate 90° Counter-Clockwise"
                >
                  <RotateCcw size={13} />
                  <span>-90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRotate(90)}
                  className="flex h-8 items-center gap-1.5 px-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  title="Rotate 90° Clockwise"
                >
                  <RotateCw size={13} />
                  <span>+90°</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex h-8 items-center gap-1 px-2.5 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  title="Reset adjustments"
                >
                  <RefreshCw size={12} />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 sm:p-5 border-t border-border/70 bg-secondary/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Choose Different Photo button */}
          <div>
            <input
              ref={hiddenFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <button
              type="button"
              onClick={() => hiddenFileInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-1.5 px-3 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-colors shadow-2xs cursor-pointer"
            >
              <Upload size={14} />
              <span>Choose Another File</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none h-10 px-4 rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-none inline-flex h-10 items-center justify-center gap-2 px-5 rounded-xl bg-[var(--brand)] text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Check size={15} />
              <span>Apply & Save</span>
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Convenient React Hook for integrating Profile Picture adjustments into any component
 */
export function useProfilePictureUpload({
  onImageApplied,
}: {
  onImageApplied: (dataUrl: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result as string);
      setModalOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset file input so selecting the same file triggers change
    e.target.value = "";
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleApply = (dataUrl: string) => {
    onImageApplied(dataUrl);
    setModalOpen(false);
    setSelectedImageSrc(null);
  };

  const handleSelectNewFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return {
    modalOpen,
    setModalOpen,
    selectedImageSrc,
    setSelectedImageSrc,
    fileInputRef,
    openFilePicker,
    handleFileChange,
    handleApply,
    handleSelectNewFile,
  };
}
