import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Apple,
  ArrowLeft,
  Clock,
  LockKeyhole,
  Mail,
  Monitor,
  Play,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/pb-web/email-template")({
  head: () => ({
    meta: [
      { title: "Email Template — PixelBooks" },
      {
        name: "description",
        content: "Preview the PixelBooks account verification email design.",
      },
    ],
  }),
  component: EmailTemplatePage,
});

function EmailTemplatePage() {
  const [previewSize, setPreviewSize] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="min-h-screen bg-[#f3f6f5] text-[#19302d]">
      <header className="border-b border-[#dce6e3] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Back to PixelBooks home"
          >
            <img src="/logo-app-icon.png" alt="" className="h-8 w-8 object-contain" />
            <span className="text-lg font-bold text-[#19302d]">PixelBooks</span>
          </Link>
          <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-[#66807b] sm:block">
            Email design preview
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#607772] transition-colors hover:text-[#137365]"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>

        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#137365]">
              Account security / Verification
            </p>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#19302d] sm:text-4xl">
              Verify your email address
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#607772]">
              A secure, one-time code email for PixelBooks accounts.
            </p>
          </div>

          <div
            className="inline-flex self-start rounded-lg border border-[#d5e1de] bg-white p-1 sm:self-auto"
            role="group"
            aria-label="Email preview size"
          >
            <button
              type="button"
              onClick={() => setPreviewSize("desktop")}
              aria-pressed={previewSize === "desktop"}
              className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${
                previewSize === "desktop"
                  ? "bg-[#137365] text-white"
                  : "text-[#607772] hover:bg-[#f1f6f4]"
              }`}
            >
              <Monitor size={15} />
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewSize("mobile")}
              aria-pressed={previewSize === "mobile"}
              className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${
                previewSize === "mobile"
                  ? "bg-[#137365] text-white"
                  : "text-[#607772] hover:bg-[#f1f6f4]"
              }`}
            >
              <Smartphone size={15} />
              Mobile
            </button>
          </div>
        </div>

        <section
          aria-label="Email preview"
          className="overflow-hidden rounded-xl border border-[#dce6e3] bg-white shadow-sm"
        >
          <div className="overflow-x-auto bg-[#edf2f0] px-3 py-5 sm:px-8 sm:py-8">
            <article
              className={`mx-auto w-full overflow-hidden rounded-md bg-white shadow-sm transition-[max-width] duration-300 ${
                previewSize === "desktop" ? "max-w-[750px]" : "max-w-[375px]"
              }`}
            >
              <div className="relative flex min-h-[92px] items-center border-b border-[#e9efec] bg-white px-7 py-5 sm:px-[30px]">
                <div className="flex items-center">
                  <img
                    src="/logoPixel.svg"
                    alt="PixelBooks"
                    className="h-[41px] w-[155px] object-contain"
                  />
                </div>
              </div>

              <div className="px-7 pb-6 pt-6 sm:px-[30px] sm:pb-7 sm:pt-4">
                <p className="mt-4 text-[14px] font-semibold text-[#253b39]">Hi Harish,</p>
                <p className="mt-2 text-[13px] leading-[19px] text-[#718582]">
                  You’re one step away. Use the verification code below to verify your email address
                  and continue to PixelBooks.
                </p>
                <div className="mt-5 rounded-md border border-[#b7dfd5] bg-[#eaf8f4] px-4 py-4 text-center sm:py-[17px]">
                  <p className="text-[8px] font-semibold uppercase text-[#075b52]">
                    Your verification code
                  </p>
                  <div className="mt-3 flex justify-center gap-2">
                    {["7", "9", "3", "0"].map((digit, index) => (
                      <span
                        key={`${digit}-${index}`}
                        className="flex h-12 w-[43px] items-center justify-center rounded-md border border-[#c5dfd8] bg-white text-[28px] font-semibold leading-none text-[#075b52] shadow-[0_1px_3px_rgba(9,62,53,0.08)]"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#81918e]">
                  <Clock size={11} />
                  This code expires in <span className="font-medium text-[#283c39]">1 minute</span>
                </p>

                <div className="mt-5 border-l border-[#e6ad56] py-0.5 pl-3">
                  <p className="flex items-center gap-2 text-[11px] leading-[17px] text-[#334b47]">
                    <LockKeyhole size={11} className="shrink-0 text-[#728984]" />
                    <span>
                      <strong className="font-semibold">Keep this code to yourself.</strong>{" "}
                      Never share it with anyone.
                    </span>
                  </p>
                  <p className="pl-[19px] text-[11px] leading-[17px] text-[#81918e]">
                    If you didn’t request this code, you can safely ignore this email.
                  </p>
                </div>

                <div className="mt-5 text-[12px] leading-[18px] text-[#81918e]">
                  <p>Warm regards,</p>
                  <p className="font-semibold text-[#075b52]">The PixelBooks Team</p>
                </div>

                <div className="mt-4 border-t border-[#d9e5e2] pt-4 text-[11px] leading-[17px] text-[#81918e]">
                  <p>Need a hand? We’re here for you.</p>
                  <a href="mailto:info@pixelbooksapp.com" className="font-medium text-[#075b52]">
                    info@pixelbooksapp.com
                  </a>
                </div>
              </div>

              <div className="border-t border-[#d9e5e2] bg-[#f1f8f7] px-5 py-5 text-center">
               
                <h3 className="mt-2 text-[15px] font-semibold text-[#203735]">
                  PixelBooks, Endless Read. One App.
                </h3>
                <p className="mt-1 text-[9px] text-[#81918e]">
                  Download the app and keep everything at your fingertips.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <div className="flex h-9 min-w-[116px] items-center justify-center gap-2 rounded-md bg-[#111b1a] px-2.5 text-white">
                    <Apple size={21} fill="currentColor" />
                    <span className="text-left leading-none">
                      <span className="block text-[7px]">Download on the</span>
                      <span className="mt-0.5 block text-[12px] font-medium">App Store</span>
                    </span>
                  </div>
                  <div className="flex h-9 min-w-[116px] items-center justify-center gap-2 rounded-md bg-[#111b1a] px-2.5 text-white">
                    <Play size={19} fill="currentColor" />
                    <span className="text-left leading-none">
                      <span className="block text-[7px]">GET IT ON</span>
                      <span className="mt-0.5 block text-[12px] font-medium">Google Play</span>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
        <footer className="mx-auto mt-5 max-w-[750px] text-center text-[9px] leading-[17px] text-[#8a9a97]">
          <p>Sent with care by the PixelBooks Team. © 2026 PixelBooks. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}