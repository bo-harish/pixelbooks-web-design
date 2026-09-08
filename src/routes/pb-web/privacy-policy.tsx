import { createFileRoute } from "@tanstack/react-router";
import { PbWebHeader } from "@/components/pb-web-header";
import { PbWebFooter } from "@/components/pb-web-footer";

export const Route = createFileRoute("/pb-web/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — PixelBooks" },
      {
        name: "description",
        content:
          "This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service.",
      },
    ],
  }),
  component: PbWebPrivacyPolicyPage,
});

function PbWebPrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-xs font-medium text-muted-foreground/80">
              <span className="font-semibold text-foreground">Last updated:</span>{" "}
              <span className="italic">November 14, 2024</span>
            </p>
          </div>

          {/* Overview & Purpose */}
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service. It also informs You about Your privacy rights and how the law protects You.
            </p>
            <p>
              We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </div>

          {/* Questions and Concerns Callout */}
          <div className="rounded-xl border border-border/60 bg-neutral-50/60 p-4 sm:p-5 space-y-2.5">
            <h3 className="text-sm font-bold text-foreground">
              Questions and Concerns?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Reading this privacy policy will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our services.
            </p>
            <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
              If you have questions or comments about this notice, contact us by post at:
              <div className="font-semibold text-foreground mt-1">
                brandOptics India Private Limited, Unit 403, 4th Floor, Tower B, World Trade Center, Infopark Phase I, Kochi, Kerala 682 042
              </div>
            </div>
          </div>

          {/* Interpretation and Definitions */}
          <section className="space-y-6 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Interpretation and Definitions
            </h2>

            {/* Interpretation */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Interpretation
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The words with initial capital letters have meanings defined below. These definitions have the same meaning regardless of whether they appear in singular or plural form.
              </p>
            </div>

            {/* Definitions */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Definitions
              </h3>
              <p className="text-sm text-muted-foreground">
                For the purposes of this Privacy Policy:
              </p>

              <ul className="space-y-3 pl-1 sm:pl-2">
                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                  <span>
                    <strong className="font-semibold text-foreground">Account</strong> means a unique account created for You to access our Service or parts of our Service.
                  </span>
                </li>

                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                  <span>
                    <strong className="font-semibold text-foreground">Application</strong> refers to PixelBooks, the software program provided by the Company.
                  </span>
                </li>

                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                  <span>
                    <strong className="font-semibold text-foreground">Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to <strong className="font-semibold text-foreground">brandOptics India Pvt Ltd.</strong>
                  </span>
                </li>

                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                  <span>
                    <strong className="font-semibold text-foreground">Country</strong> refers to: India
                  </span>
                </li>

                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                  <span>
                    <strong className="font-semibold text-foreground">Device</strong> means any device that can access the Service, such as a computer, a cell phone, or a digital tablet.
                  </span>
                </li>

                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                  <span>
                    <strong className="font-semibold text-foreground">Personal Data</strong> is any information that relates to an identified or identifiable individual.
                  </span>
                </li>

                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                  <span>
                    <strong className="font-semibold text-foreground">Service</strong> refers to the Application.
                  </span>
                </li>

                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                  <span>
                    <strong className="font-semibold text-foreground">Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. This includes third-party companies or individuals employed by the Company to facilitate the Service, provide the Service on behalf of the Company, perform services related to the Service, or assist the Company in analyzing how the Service is used.
                  </span>
                </li>

                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                  <span>
                    <strong className="font-semibold text-foreground">Third-party Social Media Service</strong> refers to any website or social network through which a User can log in or create an account to use the Service.
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* Reusable Footer */}
      <PbWebFooter />
    </div>
  );
}
