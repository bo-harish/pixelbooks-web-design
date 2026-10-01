import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadCloud, Megaphone, Monitor, Smartphone } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/ad-banners/genre")({
  head: () => ({
    meta: [
      { title: "Genre Banner — PixelBooks Admin" },
      {
        name: "description",
        content: "Manage genre banner artwork for the PixelBooks storefront.",
      },
    ],
  }),
  component: GenreBannerPage,
});

function GenreBannerPage() {
  const [webCoverUploaded, setWebCoverUploaded] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("pb_admin_genre_banner_web_image");
  });

  const [mobileCoverUploaded, setMobileCoverUploaded] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("pb_admin_genre_banner_mobile_image");
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!webCoverUploaded || !mobileCoverUploaded) {
      toast.error("Please upload both Web and Mobile genre banner images.");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("pb_admin_genre_banner_web_image", webCoverUploaded);
      localStorage.setItem("pb_admin_genre_banner_mobile_image", mobileCoverUploaded);
    }

    toast.success("Genre banner saved successfully.");
  };

  return (
    <AppShell
      title="Genre Banner"
      subtitle="Manage web and mobile genre banner artwork for storefront placements."
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full">
        <form onSubmit={handleSave} className="space-y-6 w-full">
          <div className="rounded-xl  border-border bg-card p-6 md:p-8 shadow-2xs space-y-8 w-full">
            <div>
              <div className="mb-5">
                <h4 className="text-sm font-bold text-foreground">Banner Artwork</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload high-resolution promotional artwork optimized for desktop and mobile
                  devices.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-3.5 w-full min-h-[230px] transition-colors hover:bg-muted/30">
                  {webCoverUploaded ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className="h-24 w-64 md:w-72 rounded-lg border border-border shadow-xs overflow-hidden flex items-center justify-center text-white text-xs font-bold p-2 text-center"
                        style={{
                          background:
                            webCoverUploaded.startsWith("blob:") ||
                            webCoverUploaded.startsWith("http") ||
                            webCoverUploaded.startsWith("data:")
                              ? `url(${webCoverUploaded}) center/cover no-repeat`
                              : webCoverUploaded,
                        }}
                      >
                        <span className="bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded text-xs truncate max-w-[230px]">
                          Genre Web Banner
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-2xl bg-[var(--sidebar-highlight)] border border-[var(--brand)]/20 flex items-center justify-center shadow-2xs">
                      <Monitor size={28} className="text-[var(--brand)] shrink-0" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-center gap-1.5">
                      <p className="text-xs font-bold text-foreground">
                        Web Cover Image <span className="text-red-500">*</span>
                      </p>
                      <span className="text-[10px] font-semibold bg-[var(--brand)]/10 text-[var(--brand)] px-2 py-0.5 rounded-full border border-[var(--brand)]/20">
                        Desktop / Laptop
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                      1360x526 pixels (or 2x scale), less than 5 MB
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer transition-colors shadow-2xs">
                    <UploadCloud size={14} className="text-[var(--brand)]" />
                    <span>
                      {webCoverUploaded ? "Change Image for Web" : "Choose Image for Web"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0];
                          setWebCoverUploaded(URL.createObjectURL(file));
                          toast.success("Web Banner image selected!");
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-3.5 w-full min-h-[230px] transition-colors hover:bg-muted/30">
                  {mobileCoverUploaded ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className="h-24 w-40 md:w-44 rounded-lg border border-border shadow-xs overflow-hidden flex items-center justify-center text-white text-xs font-bold p-2 text-center"
                        style={{
                          background:
                            mobileCoverUploaded.startsWith("blob:") ||
                            mobileCoverUploaded.startsWith("http") ||
                            mobileCoverUploaded.startsWith("data:")
                              ? `url(${mobileCoverUploaded}) center/cover no-repeat`
                              : mobileCoverUploaded,
                        }}
                      >
                        <span className="bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] truncate max-w-[130px]">
                          Mobile Banner
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-2xl bg-[var(--sidebar-highlight)] border border-[var(--brand)]/20 flex items-center justify-center shadow-2xs">
                      <Smartphone size={28} className="text-[var(--brand)] shrink-0" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-center gap-1.5">
                      <p className="text-xs font-bold text-foreground">
                        Mobile Cover Image <span className="text-red-500">*</span>
                      </p>
                      <span className="text-[10px] font-semibold bg-[var(--brand)]/10 text-[var(--brand)] px-2 py-0.5 rounded-full border border-[var(--brand)]/20">
                        Smartphone / Mobile
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                      1518x864 pixels (or 2x scale), less than 5 MB
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer transition-colors shadow-2xs">
                    <UploadCloud size={14} className="text-[var(--brand)]" />
                    <span>
                      {mobileCoverUploaded ? "Change Image for Mobile" : "Choose Image for Mobile"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0];
                          setMobileCoverUploaded(URL.createObjectURL(file));
                          toast.success("Mobile Banner image selected!");
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 w-full">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center px-6 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
            >
              Save Genre Banner
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
