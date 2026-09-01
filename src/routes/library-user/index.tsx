import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Search,
  ArrowLeft,
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Type,
  FileText,
  Star,
  BookMarked,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/library-user/")({
  component: LibraryUserDashboard,
});

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  rating: number;
  progress: number;
  initials: string;
  category: "Academic" | "Music" | "Style" | "General";
  cover: string;
  description: string;
  chapters: { title: string; content: string }[];
}

function LibraryUserDashboard() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [readerTheme, setReaderTheme] = useState<"sepia" | "light" | "dark">("sepia");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const books: Book[] = [
    {
      id: "book-1",
      title: "NEP 2020 · Policy Formulation In Education",
      author: "Dr. K. Raghavan",
      isbn: "9789356781234",
      rating: 4.6,
      progress: 35,
      initials: "NEP",
      category: "Academic",
      cover: "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
      description:
        "A comprehensive critical analysis of the National Education Policy 2020, focusing on curriculum restructuring, student credits, and multi-disciplinary academic integration in Indian institutions.",
      chapters: [
        {
          title: "Chapter 1: The Historical Context of NEP",
          content:
            "The National Education Policy 2020 is India's third major policy restructure in higher education. Initiated under high-level panels, this document aims to address key systemic challenges such as lack of interdisciplinary study, rigid choice structures, and uneven funding distribution across research universities. The transition from 10+2 to 5+3+3+4 marks a fundamental shift in pedagogical organization designed to align learning with cognitive developmental stages.",
        },
        {
          title: "Chapter 2: Multidisciplinary Restructuring",
          content:
            "Historically, higher education institutes (HEIs) have operated in highly siloed formats. Universities of engineering did not integrate humanities, and liberal arts programs lacked basic computational foundations. Chapter 2 details the legal framework for HEIs to transition into integrated campuses, allowing students studying physics to concurrently major in Sanskrit or music under a unified Credit Accumulation bank.",
        },
      ],
    },
    {
      id: "book-2",
      title: "A Complete History of Music for Schools",
      author: "W. J. Baltzell",
      isbn: "1176559435",
      rating: 4.2,
      progress: 72,
      initials: "MUS",
      category: "Music",
      cover: "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
      description:
        "An archival study of classical melodies, instruments, composer biographies, and scale progressions designed for educational institutions and introductory music departments.",
      chapters: [
        {
          title: "Chapter 1: Early Polyphony and the Monks",
          content:
            "Before music was written in standardized bars, early church music relied entirely on the monophonic chant. St. Gregory compiled the chants that would form the liturgical backbone of Europe. This chapter explores how vocal lines split into two, introducing the parallel fourths and fifths that would define early polyphony.",
        },
      ],
    },
    {
      id: "book-3",
      title: "The Elements of Style",
      author: "William Strunk Jr.",
      isbn: "9780205309023",
      rating: 4.8,
      progress: 0,
      initials: "STY",
      category: "Style",
      cover: "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
      description:
        "The classic American English writing style guide. It includes basic rules of usage, elementary principles of composition, and commonly misused words and phrases.",
      chapters: [
        {
          title: "Chapter 1: Elementary Rules of Usage",
          content:
            "Rule 1: Form the possessive singular of nouns by adding 's. Write 'Charles's friend', 'Burns's poems', 'the witch's malice'. Rule 2: In a series of three or more terms with a single conjunction, use a comma after each term except the last.",
        },
      ],
    },
    {
      id: "book-4",
      title: "Knowledge for the Time",
      author: "John Timbs",
      isbn: "9781019041857",
      rating: 4.0,
      progress: 15,
      initials: "KFT",
      category: "General",
      cover: "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
      description:
        "A manual of curiosities, historical anecdotes, scientific facts, and literary snippets collected from Victorian records and early modern academic journals.",
      chapters: [
        {
          title: "Chapter 1: Curiosities of Science",
          content:
            "The progression of scientific discoveries in the nineteenth century occurred at an unprecedented pace. The electric telegraph transformed instantaneous communication. Steam engines linked far-flung towns in minutes, altering the perception of geographical distance.",
        },
      ],
    },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesCategory = activeCategory === "All" || book.category === activeCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenReader = (book: Book) => {
    setReadingBook(book);
    setCurrentChapter(0);
    setSelectedBook(null);
    toast.success(`Opening "${book.title}" in digital reader`);
  };

  const handleCloseReader = () => {
    if (readingBook) {
      toast.info(`Closed reader. Progress saved at ${readingBook.progress}%`);
    }
    setReadingBook(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" id="library-user-logo-link" className="flex items-center gap-2.5 shrink-0 group">
              <img src="/logo-app-icon.png" alt="PixelBooks App Icon" className="h-8 w-8 object-contain transition-transform group-hover:scale-105" />
              <span className="font-extrabold text-xl tracking-tight text-foreground">PixelBooks</span>
            </Link>

            <div className="h-5 w-px bg-border hidden sm:block" />

            <Link
              to="/"
              id="library-user-btn-back"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Return to Workspaces"
            >
              <ArrowLeft size={15} />
            </Link>

            <div>
              <h1 className="text-sm sm:text-base font-bold flex items-center gap-1.5 leading-tight">
                <BookOpen size={16} className="text-[oklch(0.62_0.15_155)]" />
                Student E-Library
              </h1>
              <p className="text-[11px] text-muted-foreground hidden md:block">
                Vimala Knowledge Hub · Digital Resources
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-full hidden sm:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={14}
              />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <Link
              to="/library-user/login"
              id="library-user-btn-login-screen"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all hover:bg-secondary"
              title="Student Login Screen"
            >
              <UserCheck size={14} className="text-emerald-500" />
              <span className="hidden sm:inline">Login Screen</span>
            </Link>

            <Link
              to="/library-user/profile"
              id="library-user-btn-profile"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-left transition-all hover:bg-secondary hover:border-border/80"
              title="View Student Profile"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[oklch(0.62_0.15_155)]/15 text-[oklch(0.62_0.15_155)] text-xs font-bold">
                AR
              </div>
              <span className="hidden text-xs font-semibold text-foreground md:inline">Ananya Roy</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8 space-y-8">
        {/* Currently Reading Banner */}
        <section className="rounded-xl border border-border bg-card p-5 relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="h-16 w-12 shrink-0 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow"
              style={{ background: books[0].cover }}
            >
              {books[0].initials}
            </div>
            <div>
              <span className="text-[10px] font-bold text-[oklch(0.62_0.15_155)] uppercase tracking-wider flex items-center gap-1">
                <Clock size={11} /> Currently Reading
              </span>
              <h2 className="font-bold text-sm md:text-base mt-1">{books[0].title}</h2>
              <p className="text-xs text-muted-foreground">by {books[0].author}</p>
            </div>
          </div>

          <div className="space-y-2 md:w-64">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <span>Progress</span>
              <span>{books[0].progress}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="bg-[oklch(0.62_0.15_155)] h-full rounded-full"
                style={{ width: `${books[0].progress}%` }}
              />
            </div>
            <button
              onClick={() => handleOpenReader(books[0])}
              id="library-user-btn-resume"
              className="w-full bg-[oklch(0.62_0.15_155)] text-white text-xs font-semibold py-1.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Resume Reading
            </button>
          </div>
        </section>

        {/* Filter Categories */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {["All", "Academic", "Music", "Style", "General"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                    activeCategory === cat
                      ? "bg-[oklch(0.62_0.15_155)] border-[oklch(0.62_0.15_155)] text-white"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Books Shelf Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="group cursor-pointer flex flex-col space-y-3 p-3 rounded-xl border border-border/80 bg-card hover:shadow-md hover:border-border transition-all"
              >
                <div
                  className="aspect-[3/4] w-full rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-[1.02]"
                  style={{ background: book.cover }}
                >
                  {book.initials}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-xs truncate text-foreground">{book.title}</h3>
                  <p className="text-[11px] text-muted-foreground truncate">by {book.author}</p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-0.5">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      {book.rating}
                    </span>
                    {book.progress > 0 && (
                      <span className="text-[10px] font-semibold text-[oklch(0.62_0.15_155)]">
                        {book.progress}% read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 relative shadow-2xl flex flex-col space-y-6">
            <div className="flex gap-4">
              <div
                className="h-28 w-20 shrink-0 rounded-lg flex items-center justify-center text-white font-bold text-base shadow"
                style={{ background: selectedBook.cover }}
              >
                {selectedBook.initials}
              </div>
              <div className="min-w-0 space-y-1">
                <span className="text-[10px] font-bold text-emerald-500 uppercase">
                  {selectedBook.category}
                </span>
                <h3 className="font-bold text-base text-foreground leading-tight">
                  {selectedBook.title}
                </h3>
                <p className="text-xs text-muted-foreground">by {selectedBook.author}</p>
                <div className="flex items-center gap-1.5 pt-2 text-xs">
                  <Star size={13} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{selectedBook.rating} / 5</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Synopsis
              </h4>
              <p className="text-xs text-muted-foreground/90 leading-relaxed font-medium">
                {selectedBook.description}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedBook(null)}
                id="library-user-btn-cancel-details"
                className="flex-1 py-2 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleOpenReader(selectedBook)}
                id={`btn-library-read-${selectedBook.id}`}
                className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[oklch(0.62_0.15_155)] text-white hover:opacity-90 shadow-sm transition-opacity"
              >
                Start Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Digital Reader Modal */}
      {readingBook && (
        <div
          className="fixed inset-0 z-50 flex flex-col transition-colors duration-200"
          style={{
            backgroundColor:
              readerTheme === "sepia" ? "#fbf0db" : readerTheme === "dark" ? "#181818" : "#ffffff",
            color:
              readerTheme === "sepia" ? "#433422" : readerTheme === "dark" ? "#e0e0e0" : "#202020",
          }}
        >
          {/* Reader Top Controls */}
          <header className="border-b border-border/10 px-4 py-3 flex items-center justify-between bg-black/5">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseReader}
                id="btn-reader-close"
                aria-label="Exit reader"
                className="h-8 w-8 rounded-lg flex items-center justify-center text-current/80 hover:bg-black/10 transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="min-w-0">
                <span className="block truncate text-[10px] uppercase font-bold tracking-wider opacity-70">
                  {readingBook.title}
                </span>
                <span className="block truncate text-xs font-semibold">
                  {readingBook.chapters[currentChapter]?.title}
                </span>
              </div>
            </div>

            {/* Reader options controls */}
            <div className="flex items-center gap-2">
              {/* Font Size controls */}
              <div className="flex items-center gap-0.5 bg-black/5 rounded-lg p-0.5 border border-border/10">
                <button
                  onClick={() => setFontSize("sm")}
                  id="btn-reader-font-sm"
                  className={`px-2 py-1 text-xs font-semibold rounded ${fontSize === "sm" ? "bg-black/15 font-bold" : "opacity-70"}`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize("base")}
                  id="btn-reader-font-base"
                  className={`px-2 py-1 text-xs font-semibold rounded ${fontSize === "base" ? "bg-black/15 font-bold" : "opacity-70"}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize("lg")}
                  id="btn-reader-font-lg"
                  className={`px-2 py-1 text-xs font-semibold rounded ${fontSize === "lg" ? "bg-black/15 font-bold" : "opacity-70"}`}
                >
                  A+
                </button>
              </div>

              {/* Theme togglers */}
              <div className="flex items-center gap-1">
                {(["sepia", "light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setReaderTheme(t)}
                    id={`btn-reader-theme-${t}`}
                    className={`h-6 px-2 text-[10px] font-bold rounded border uppercase tracking-wider transition-all ${
                      readerTheme === t
                        ? "border-current/80 bg-black/10 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Reader Content Body */}
          <div className="flex-1 overflow-y-auto px-6 py-12 md:px-12 flex justify-center items-start">
            <article
              className={`max-w-2xl w-full mx-auto leading-relaxed select-none space-y-6 ${
                fontSize === "sm"
                  ? "text-sm"
                  : fontSize === "base"
                    ? "text-base"
                    : fontSize === "lg"
                      ? "text-lg"
                      : "text-xl"
              }`}
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6 border-b border-current/10 pb-4">
                {readingBook.chapters[currentChapter]?.title}
              </h2>
              <p className="indent-8 text-justify font-serif">
                {readingBook.chapters[currentChapter]?.content}
              </p>
              <p className="text-justify font-serif">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </article>
          </div>

          {/* Reader Footer Navigation */}
          <footer className="border-t border-border/10 px-4 py-4 flex items-center justify-between bg-black/5 text-xs">
            <button
              onClick={() => {
                if (currentChapter > 0) {
                  setCurrentChapter((prev) => prev - 1);
                } else {
                  toast.error("You are on the first chapter.");
                }
              }}
              id="btn-reader-prev"
              className="flex items-center gap-1.5 font-semibold py-1.5 px-3 rounded bg-black/5 hover:bg-black/10 transition-colors"
            >
              <ChevronLeft size={14} /> Previous Chapter
            </button>

            <span className="font-mono opacity-80 font-bold">
              Page {currentChapter + 1} of {readingBook.chapters.length}
            </span>

            <button
              onClick={() => {
                if (currentChapter < readingBook.chapters.length - 1) {
                  setCurrentChapter((prev) => prev + 1);
                } else {
                  toast.success("Congratulations! You completed the book.");
                }
              }}
              id="btn-reader-next"
              className="flex items-center gap-1.5 font-semibold py-1.5 px-3 rounded bg-black/5 hover:bg-black/10 transition-colors"
            >
              Next Chapter <ChevronRight size={14} />
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
