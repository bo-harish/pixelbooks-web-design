// The 4 columns of categories directly matching the screenshot
export const categoryColumns = [
  // Column 1
  [
    "Academic & Educational",
    "Children's Literature",
    "Epic",
    "Health Science",
    "Lifestyle & Personal Interest",
    "Memoirs",
    "Novels",
    "Regional & Language-Based Literature",
    "Studies",
  ],
  // Column 2
  [
    "Articles",
    "Cinema",
    "Essay",
    "History",
    "Literature & Poems",
    "NEET",
    "Performing Arts",
    "Short Stories",
    "Study Abroad",
  ],
  // Column 3
  [
    "Autobiography",
    "Crime, Thriller, Mystery",
    "Fiction",
    "Humour & Romance",
    "Malayalam Fiction",
    "NEET Solved Papers",
    "Philosophy",
    "Sports Thriller Fiction",
    "Travel & Tourism",
  ],
  // Column 4
  [
    "Biography",
    "Cultural Studies",
    "Folklore",
    "JEE",
    "Malayalam Literature",
    "Non-Fiction",
    "Reference",
    "Stories",
  ],
];

export interface PbWebBook {
  title: string;
  author: string;
  rating: number;
  price: string;
  tag: string;
  gradient: string;
  isbn: string;
  cover?: string;
}

// Sample featured books for genre preview drawer and search autocomplete
export const sampleBooksByGenre: Record<string, PbWebBook[]> = {
  "Academic & Educational": [
    {
      title: "NEET Courseware Chemistry Class-XII",
      author: "Career Launcher / GKP",
      rating: 4.9,
      price: "₹495",
      tag: "Courseware",
      gradient: "from-amber-700 to-stone-900",
      isbn: "978-93-91067-12-8",
      cover: "/images/covers/neet-chemistry.png",
    },
    {
      title: "Foundation Mathematics for JEE / Olympiad",
      author: "O.P. Tandon & Team",
      rating: 4.8,
      price: "₹499",
      tag: "Best Seller",
      gradient: "from-blue-600 to-indigo-900",
      isbn: "978-0-13-468599-1",
    },
    {
      title: "Comprehensive Physics for Competitive Exams",
      author: "H.C. Verma & Scholars",
      rating: 4.9,
      price: "₹520",
      tag: "High Yield",
      gradient: "from-violet-600 to-purple-900",
      isbn: "978-0-13-468601-1",
    },
  ],
  JEE: [
    {
      title: "Foundation Mathematics for JEE Mains & Advanced",
      author: "Dr. G. Sharma",
      rating: 4.9,
      price: "₹599",
      tag: "Exam Favorite",
      gradient: "from-amber-600 to-orange-900",
      isbn: "978-0-13-468602-8",
    },
    {
      title: "Cracking the JEE: Comprehensive Guide",
      author: "Academic Faculty Board",
      rating: 4.7,
      price: "₹549",
      tag: "Updated 2026",
      gradient: "from-cyan-600 to-blue-900",
      isbn: "978-0-13-468603-5",
    },
  ],
  NEET: [
    {
      title: "NEET Courseware Biology Class-XII",
      author: "Career Launcher / GKP",
      rating: 4.9,
      price: "₹525",
      tag: "Biology Essential",
      gradient: "from-emerald-700 to-teal-950",
      isbn: "978-93-91067-15-9",
      cover: "/images/covers/neet-biology.png",
    },
    {
      title: "NEET Courseware Chemistry Class-XII",
      author: "Career Launcher / GKP",
      rating: 4.9,
      price: "₹495",
      tag: "Essential Textbook",
      gradient: "from-amber-700 to-stone-900",
      isbn: "978-93-91067-12-8",
      cover: "/images/covers/neet-chemistry.png",
    },
    {
      title: "NEET Medical Biology Mastery",
      author: "Dr. S. K. Rastogi",
      rating: 4.8,
      price: "₹525",
      tag: "Top Rated",
      gradient: "from-rose-600 to-pink-900",
      isbn: "978-0-13-468604-2",
    },
    {
      title: "NEET 10-Year Solved Papers & Mock Exams",
      author: "Editorial Board",
      rating: 4.6,
      price: "₹399",
      tag: "Mock Papers",
      gradient: "from-teal-600 to-emerald-950",
      isbn: "978-0-13-468605-9",
    },
  ],
  "Malayalam Literature": [
    {
      title: "പെണ്ണാഴങ്ങൾ (Pennaazhangal)",
      author: "ലിജി മാത്യു",
      rating: 4.9,
      price: "₹340",
      tag: "SPCS Fiction",
      gradient: "from-sky-700 to-indigo-950",
      isbn: "978-81-264-0016-2",
      cover: "/images/covers/pennaazhangal.jpg",
    },
    {
      title: "ഇന്ത്യയെ കണ്ടെത്തുക (Sukumar Azhikode)",
      author: "സുകുമാർ അഴീക്കോട്",
      rating: 5.0,
      price: "₹380",
      tag: "SPCS Publication",
      gradient: "from-stone-700 to-amber-950",
      isbn: "978-81-264-0012-4",
      cover: "/images/covers/sukumar-azhikode.png",
    },
    {
      title: "കേരളത്തിലെ നാടൻപാട്ടുകളും നാട്ടുവായത്താരികളും",
      author: "സത്യൻ കല്ലുരുട്ടി",
      rating: 4.8,
      price: "₹360",
      tag: "SPCS Folklore",
      gradient: "from-emerald-600 to-teal-950",
      isbn: "978-81-264-0014-8",
      cover: "/images/covers/kerala-boat-race.jpg",
    },
  ],
  Folklore: [
    {
      title: "തെയ്യങ്ങൾ (Theyyangal)",
      author: "ടി.കെ.ഡി. മുഴപ്പിലങ്ങാട്",
      rating: 4.9,
      price: "₹420",
      tag: "Cultural Heritage",
      gradient: "from-red-600 to-orange-950",
      isbn: "978-81-264-0013-1",
      cover: "/images/covers/theyyam.jpg",
    },
    {
      title: "കേരളത്തിലെ നാടൻപാട്ടുകളും നാട്ടുവായത്താരികളും",
      author: "സത്യൻ കല്ലുരുട്ടി",
      rating: 4.8,
      price: "₹360",
      tag: "Folklore Classic",
      gradient: "from-emerald-600 to-teal-950",
      isbn: "978-81-264-0014-8",
      cover: "/images/covers/kerala-boat-race.jpg",
    },
  ],
  "Cultural Studies": [
    {
      title: "തെയ്യങ്ങൾ (Theyyangal)",
      author: "ടി.കെ.ഡി. മുഴപ്പിലങ്ങാട്",
      rating: 4.9,
      price: "₹420",
      tag: "Folk Ritual Arts",
      gradient: "from-red-600 to-orange-950",
      isbn: "978-81-264-0013-1",
      cover: "/images/covers/theyyam.jpg",
    },
    {
      title: "India: What Can It Teach Us?",
      author: "Max Muller (വിവർത്തനം: കെ.കെ.സി. നായർ)",
      rating: 4.9,
      price: "₹340",
      tag: "SPCS Classic",
      gradient: "from-slate-700 to-zinc-900",
      isbn: "978-81-264-0015-5",
      cover: "/images/covers/max-muller.jpg",
    },
  ],
  Biography: [
    {
      title: "ഇന്ത്യയെ കണ്ടെത്തുക (Sukumar Azhikode)",
      author: "സുകുമാർ അഴീക്കോട്",
      rating: 5.0,
      price: "₹380",
      tag: "Biography & Thought",
      gradient: "from-stone-700 to-amber-950",
      isbn: "978-81-264-0012-4",
      cover: "/images/covers/sukumar-azhikode.png",
    },
  ],
  Fiction: [
    {
      title: "The Midnight Library of Alexandria",
      author: "Eleanor Vance",
      rating: 4.8,
      price: "₹349",
      tag: "Literary Award",
      gradient: "from-purple-700 to-slate-900",
      isbn: "978-0-13-468606-6",
    },
    {
      title: "Echoes Across the Horizon",
      author: "Devan Nair",
      rating: 4.6,
      price: "₹299",
      tag: "Contemporary",
      gradient: "from-indigo-600 to-sky-950",
      isbn: "978-0-13-468607-3",
    },
  ],
  Novels: [
    {
      title: "Shadows Over Malabar Coast",
      author: "M. T. Vasudevan",
      rating: 4.9,
      price: "₹399",
      tag: "Classic",
      gradient: "from-emerald-700 to-slate-900",
      isbn: "978-0-13-468608-0",
    },
    {
      title: "The Silent Watcher",
      author: "Claire Beauchamp",
      rating: 4.5,
      price: "₹320",
      tag: "Bestseller",
      gradient: "from-rose-700 to-stone-900",
      isbn: "978-0-13-468609-7",
    },
  ],
};

export const trendingSearches = [
  "Foundation Mathematics",
  "JEE Mains",
  "NEET Solved Papers",
  "Malayalam Fiction",
  "Children's Literature",
  "Academic & Educational",
];
