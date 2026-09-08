import { createFileRoute } from "@tanstack/react-router";
import { PbWebHeader } from "@/components/pb-web-header";
import { PbWebFooter } from "@/components/pb-web-footer";

export const Route = createFileRoute("/pb-web/about")({
  head: () => ({
    meta: [
      { title: "About Us — PixelBooks" },
      {
        name: "description",
        content:
          "Welcome to PixelBooks, the digital space where publishers and readers come together to share, discover, and enjoy the world of books.",
      },
    ],
  }),
  component: PbWebAboutPage,
});

function PbWebAboutPage() {
  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col justify-between pb-web-portal">
      {/* Universal Header */}
      <PbWebHeader />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Content Container Card */}
        <div className="rounded-2xl border border-border/70 bg-white p-6 sm:p-10 md:p-12 shadow-xs space-y-8">
          {/* Header Title & Version */}
          <div className="space-y-1 pb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              About PixelBooks
            </h1>
            <p className="text-xs font-medium text-muted-foreground/80 tracking-wide">
              V2.2.5
            </p>
          </div>

          {/* About Us Section */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              About Us
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Welcome to PixelBooks, the digital space where publishers and readers come together to share, discover, and enjoy the world of books. Our mission is simple: to empower publishers by providing an easy-to-use platform for publishing their books online, while offering readers an exceptional and immersive reading experience.
            </p>
          </section>

          {/* For Publishers Section */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              For Publishers
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              At PixelBooks, we understand the challenges publishers face in today’s fast-paced digital world. That’s why we’ve created a seamless platform that allows you to publish, distribute, and manage your books with ease. Whether you’re an independent author or a large publishing house, our intuitive tools and flexible features make it easy to reach a global audience and connect with readers directly.
            </p>
            <ul className="space-y-2.5 pl-1 sm:pl-2">
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                <span>
                  <strong className="font-semibold text-foreground">Simple Publishing Process:</strong>{" "}
                  Upload your book, customize your format, and hit publish—all with just a few clicks.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                <span>
                  <strong className="font-semibold text-foreground">Global Distribution:</strong>{" "}
                  Reach readers around the world with our wide distribution network, helping you expand your book’s reach without the need for intermediaries.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                <span>
                  <strong className="font-semibold text-foreground">Comprehensive Analytics:</strong>{" "}
                  Track your book’s performance in real-time with detailed sales and engagement reports.
                </span>
              </li>
            </ul>
          </section>

          {/* For Readers Section */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              For Readers
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              For readers, we offer more than just a place to buy books. We strive to create an engaging and enjoyable reading experience that keeps you coming back for more. Our platform features an extensive library of books across all genres, and our user-friendly interface makes discovering new reads effortless.
            </p>
            <ul className="space-y-2.5 pl-1 sm:pl-2">
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                <span>
                  <strong className="font-semibold text-foreground">Immersive Reading Experience:</strong>{" "}
                  With customizable text sizes, backgrounds, and font styles, our platform ensures a comfortable and personalized reading experience on any device.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                <span>
                  <strong className="font-semibold text-foreground">Advanced Search & Recommendations:</strong>{" "}
                  Find your next great read quickly with our advanced search options and personalized book recommendations tailored to your tastes.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0 mt-2" />
                <span>
                  <strong className="font-semibold text-foreground">Community Features:</strong>{" "}
                  Join discussions, write reviews, and share recommendations with fellow readers.
                </span>
              </li>
            </ul>
          </section>

          {/* Closing Section */}
          <section className="space-y-3 pt-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              At PixelBooks, we believe that both publishers and readers should have access to the best tools and resources to connect and grow. Whether you’re looking to publish your next best-seller or find your next page-turner, we’re here to make it happen.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Thank you for choosing PixelBooks—where books come to life, and reading becomes a joy.
            </p>
          </section>
        </div>
      </main>

      {/* Reusable Footer */}
      <PbWebFooter />
    </div>
  );
}
