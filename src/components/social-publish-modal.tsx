import { useState, useEffect } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Copy,
  Check,
  Send,
  Share2,
  Download,
  CheckCircle2,
  Globe,
  ThumbsUp,
  MessageSquare,
  BookOpen,
  PencilLine,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface SocialPublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: {
    id?: string;
    title: string;
    author: string;
    cover?: string;
    initials?: string;
  } | null;
}

export function SocialPublishModal({ open, onOpenChange, book }: SocialPublishModalProps) {
  const [selectedChannels, setSelectedChannels] = useState<{
    facebook: boolean;
    instagram: boolean;
    linkedin: boolean;
  }>({
    facebook: true,
    instagram: true,
    linkedin: true,
  });

  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (book) {
      const defaultContent = `New Book on PixelBooks!\n\n${book.title}\n By ${book.author}\n\nDiscover, read, and enjoy this new addition to the PixelBooks library.\n\nAvailable now on PixelBooks\nwww.pixelbooksapp.com\n\n#PixelBooks #NewBook #eBooks`;
      setMessage(defaultContent);
      setSelectedChannels({ facebook: true, instagram: true, linkedin: true });
    }
  }, [book, open]);

  if (!book) return null;

  const toggleChannel = (channel: "facebook" | "instagram" | "linkedin") => {
    setSelectedChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const selectedCount = Object.values(selectedChannels).filter(Boolean).length;
  const isAllSelected = selectedCount === 3;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedChannels({ facebook: false, instagram: false, linkedin: false });
    } else {
      setSelectedChannels({ facebook: true, instagram: true, linkedin: true });
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Post text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy post text.");
    }
  };

  const handlePublish = () => {
    if (selectedCount === 0) {
      toast.error("Please select at least one social media channel to publish.");
      return;
    }

    const channelNames: string[] = [];
    if (selectedChannels.facebook) channelNames.push("Facebook");
    if (selectedChannels.instagram) channelNames.push("Instagram");
    if (selectedChannels.linkedin) channelNames.push("LinkedIn");

    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      onOpenChange(false);
      toast.success(`Post successfully published to ${channelNames.join(", ")}!`);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[96vw] max-h-[94vh] overflow-y-auto bg-card border border-border rounded-2xl p-0 shadow-2xl">
        {/* Header Banner */}
        <div className="border-b border-border px-6 py-5 bg-gradient-to-r from-[var(--brand)]/10 via-[var(--brand)]/5 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                <Share2 size={24} className="text-[var(--brand)]" />
                <span>Broadcast on Social Media</span>
              </DialogTitle>
              <DialogDescription className="text-xs md:text-sm text-muted-foreground">
                Review and publish this promotional announcement across your connected social channels.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Content Body: Two columns layout (Left: Post Preview, Right: Target Channels & Action Buttons) */}
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Left Column: Real Social Post Preview (Caption Above Creative & Editable) */}
          <div className="flex-1 p-5 md:p-7 space-y-4 bg-muted/5 min-w-0">
            {/* Top Bar above post */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Post Preview
                </span>
                <span className="text-[10.5px] font-medium text-muted-foreground">
                  (Live Editable Feed Card)
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] hover:underline cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Real Social Post Card Container */}
            <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card shadow-md overflow-hidden transition-all">
              {/* Post Header: Profile & Account details */}
              <div className="p-4 sm:p-4.5 border-b border-border/70 flex items-center justify-between gap-3 bg-secondary/10">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/30 flex items-center justify-center text-[var(--brand)] font-bold shadow-2xs shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-foreground">PixelBooks</span>
                      <CheckCircle2 size={14} className="text-[#1877F2] fill-[#1877F2] text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span>Just now</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Globe size={11} />
                        <span>Public</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-border">
                    <PencilLine size={12} className="text-[var(--brand)]" />
                    <span>Editable</span>
                  </span>
                </div>
              </div>

              {/* Post Caption & Message: Positioned directly ABOVE the creative and editable */}
              <div className="p-4 sm:p-5 space-y-2 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <span>Post Caption &amp; Message</span>
                    <span className="text-[10px] text-muted-foreground/80">(click inside to edit)</span>
                  </label>
                  <span className="text-[10.5px] text-muted-foreground">
                    {message.length} characters
                  </span>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={9}
                  placeholder="Write your post caption..."
                  className="w-full rounded-xl border border-border/80 bg-secondary/20 hover:bg-secondary/35 focus:bg-background focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] p-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed font-sans resize-y transition-colors"
                />
              </div>

              {/* Creative Image: Positioned directly BELOW the caption */}
              <div className="p-4 sm:p-5 bg-neutral-900/5 dark:bg-neutral-950/60">
                <div className="relative rounded-xl border border-border overflow-hidden bg-white dark:bg-neutral-900 shadow-inner p-2 sm:p-3 flex flex-col items-center">
                  <div className="w-full flex items-center justify-center">
                    <img
                      src="/sample-social-post.jpg"
                      alt="Sample Social Post Creative"
                      className="w-auto h-auto max-h-[460px] md:max-h-[500px] max-w-full object-contain rounded-lg"
                    />
                  </div>

                  {/* Creative sub-bar with Actions */}
                  <div className="w-full bg-card/95 backdrop-blur-xs p-2.5 mt-2.5 rounded-lg border border-border/80 flex items-center justify-end gap-2 text-xs">
                    <a
                      href="/sample-social-post.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground hover:bg-secondary transition-colors"
                      title="View Full Resolution"
                    >
                      <span>Full View</span>
                    </a>
                    <a
                      href="/sample-social-post.jpg"
                      download="pixelbooks-sample-post.jpg"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground hover:bg-secondary transition-colors shadow-2xs"
                    >
                      <Download size={12} />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Authentic Social Engagement Footer (Like, Comment, Share) */}
              <div className="px-4 py-2.5 border-t border-border/70 flex items-center justify-around bg-secondary/10 text-muted-foreground text-xs font-semibold select-none">
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer py-1 px-3 rounded-lg hover:bg-secondary/40">
                  <ThumbsUp size={15} />
                  <span>Like</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer py-1 px-3 rounded-lg hover:bg-secondary/40">
                  <MessageSquare size={15} />
                  <span>Comment</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer py-1 px-3 rounded-lg hover:bg-secondary/40">
                  <Share2 size={15} />
                  <span>Share</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Select Target Channels & Action Buttons */}
          <div className="w-full md:w-80 lg:w-92 shrink-0 border-t md:border-t-0 md:border-l border-border p-5 md:p-6 bg-secondary/15 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Layers size={13} className="text-[var(--brand)]" />
                  <span>Select Target Channels</span>
                  <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs font-semibold text-[var(--brand)] hover:underline cursor-pointer"
                >
                  {isAllSelected ? "Deselect All" : "Select All (3)"}
                </button>
              </div>

              {/* Stack of Channels: One below another */}
              <div className="space-y-3">
                {/* Facebook Checkbox Card */}
                <label
                  onClick={() => toggleChannel("facebook")}
                  className={`flex items-center justify-between rounded-xl border p-3.5 transition-all cursor-pointer ${selectedChannels.facebook
                    ? "border-[#1877F2]/60 bg-[#1877F2]/8 shadow-2xs"
                    : "border-border bg-card hover:bg-secondary/40 opacity-60"
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedChannels.facebook}
                      onChange={() => { }}
                      className="h-4 w-4 rounded border-border text-[#1877F2] accent-[#1877F2] cursor-pointer shrink-0"
                    />
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1877F2]/15 text-[#1877F2]">
                      <Facebook size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground">Facebook</p>
                      <p className="text-[11px] text-muted-foreground truncate">PixelBooks Official</p>
                    </div>
                  </div>
                  {selectedChannels.facebook && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Selected" />
                  )}
                </label>

                {/* Instagram Checkbox Card */}
                <label
                  onClick={() => toggleChannel("instagram")}
                  className={`flex items-center justify-between rounded-xl border p-3.5 transition-all cursor-pointer ${selectedChannels.instagram
                    ? "border-[#E1306C]/60 bg-[#E1306C]/8 shadow-2xs"
                    : "border-border bg-card hover:bg-secondary/40 opacity-60"
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedChannels.instagram}
                      onChange={() => { }}
                      className="h-4 w-4 rounded border-border text-[#E1306C] accent-[#E1306C] cursor-pointer shrink-0"
                    />
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E1306C]/15 text-[#E1306C]">
                      <Instagram size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground">Instagram</p>
                      <p className="text-[11px] text-muted-foreground truncate">@pixelbooksapp</p>
                    </div>
                  </div>
                  {selectedChannels.instagram && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Selected" />
                  )}
                </label>

                {/* LinkedIn Checkbox Card */}
                <label
                  onClick={() => toggleChannel("linkedin")}
                  className={`flex items-center justify-between rounded-xl border p-3.5 transition-all cursor-pointer ${selectedChannels.linkedin
                    ? "border-[#0A66C2]/60 bg-[#0A66C2]/8 shadow-2xs"
                    : "border-border bg-card hover:bg-secondary/40 opacity-60"
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedChannels.linkedin}
                      onChange={() => { }}
                      className="h-4 w-4 rounded border-border text-[#0A66C2] accent-[#0A66C2] cursor-pointer shrink-0"
                    />
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2]/15 text-[#0A66C2]">
                      <Linkedin size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground">LinkedIn</p>
                      <p className="text-[11px] text-muted-foreground truncate">PixelBooks Inc.</p>
                    </div>
                  </div>
                  {selectedChannels.linkedin && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Selected" />
                  )}
                </label>
              </div>
            </div>

            {/* Publication Info Summary Box */}
            <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Sparkles size={14} className="text-[var(--brand)]" />
                <span>Broadcast Summary</span>
              </div>
              <ul className="space-y-2 text-muted-foreground text-[11.5px] leading-relaxed">
                <li className="flex items-center justify-between">
                  <span>Selected Channels:</span>
                  <span className="font-semibold text-foreground">{selectedCount} of 3</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Attached Creative:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Out Now! Poster</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Target eBook:</span>
                  <span className="font-semibold text-foreground truncate max-w-[130px]" title={book.title}>
                    {book.title}
                  </span>
                </li>
              </ul>
              <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
                Caption and creative will be published simultaneously to all checked channels.
              </div>
            </div>

            {/* Action Buttons: Right below Broadcast Summary */}
            <div className="pt-1 space-y-3">
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  disabled={selectedCount === 0 || isPublishing}
                  onClick={handlePublish}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  <Send size={15} className={isPublishing ? "animate-pulse" : ""} />
                  <span>
                    {isPublishing
                      ? "Publishing..."
                      : `Publish to ${selectedCount} Channel${selectedCount > 1 ? "s" : ""}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="w-full h-10 inline-flex items-center justify-center rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Skip for now
                </button>
              </div>

              <p className="text-[11.5px] text-muted-foreground text-center">
                {selectedCount === 0 ? (
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    Please select at least 1 channel above.
                  </span>
                ) : (
                  <span>
                    Ready to broadcast to <strong>{selectedCount}</strong> channel{selectedCount > 1 ? "s" : ""}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
