import { createFileRoute } from "@tanstack/react-router";
import { PbWebHeader } from "@/components/pb-web-header";
import { PbWebFooter } from "@/components/pb-web-footer";

export const Route = createFileRoute("/pb-web/terms-conditions")({
  head: () => ({
    meta: [
      { title: "Terms and Condition — PixelBooks" },
      {
        name: "description",
        content:
          "These Legal Terms constitute a legally binding agreement between you and brandOptics India Pvt Ltd. concerning your access to and use of PixelBooks Services.",
      },
    ],
  }),
  component: PbWebTermsConditionsPage,
});

function PbWebTermsConditionsPage() {
  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col justify-between pb-web-portal">
      {/* Universal Header */}
      <PbWebHeader />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Content Container Card */}
        <div className="rounded-2xl border border-border/70 bg-white p-6 sm:p-10 md:p-12 shadow-xs space-y-8">
          {/* Header Title & Last Updated */}
          <div className="space-y-1.5 pb-2 border-b border-border/60">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Terms and Conditions
            </h1>
            <p className="text-xs font-medium text-muted-foreground/80">
              <span className="font-semibold text-foreground">Last updated:</span>{" "}
              <span className="italic">June 14, 2024</span>
            </p>
          </div>

          {/* Agreement to Our Legal Terms */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              AGREEMENT TO OUR LEGAL TERMS
            </h2>

            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                We are <strong className="font-semibold text-foreground">brandOptics India Pvt Ltd.</strong> (“Company,” “we,” “us,” “our”). We operate, as well as any other related products and services that refer or link to these legal terms (the “Legal Terms”) (collectively, the “Services”).
              </p>

              <div className="rounded-xl border border-border/60 bg-neutral-50/60 p-4 sm:p-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                You can contact us by mail to{" "}
                <strong className="font-semibold text-foreground">
                  BrandOptics India Private Limited, Unit 403, 4th Floor, Tower B, World Trade Center, Infopark Phase I, Kochi, Kerala 682 042
                </strong>
              </div>

              <p>
                These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”), and <strong className="font-semibold text-foreground">BrandOptics India Pvt Ltd.</strong> concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms.{" "}
                <strong className="font-bold text-foreground">
                  IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                </strong>
              </p>

              <p>
                Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the “Last updated” date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.
              </p>
            </div>
          </section>

          {/* 1. Our Services */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              1. OUR SERVICES
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
            </p>
          </section>

          {/* 2. Intellectual Property Rights */}
          <section className="space-y-4 pt-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              2. INTELLECTUAL PROPERTY RIGHTS
            </h2>

            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Our Intellectual Property
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the “Content”), as well as the trademarks, service marks, and logos contained therein (the “Marks”). Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in India and around the world.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The Content and Marks are provided in or through the Services “AS IS” for your personal, non-commercial use or internal business purposes only.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Your Use of Our Services
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Subject to your complete compliance with these Legal Terms, you are granted a non-exclusive, non-transferable, revocable license to access the Services solely for your personal reading or institutional reference.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Reusable Footer */}
      <PbWebFooter />
    </div>
  );
}
