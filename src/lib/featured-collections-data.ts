export interface CollectionItem {
  id: string;
  name: string;
  views: number;
  avgSalesMonthly: number;
  status: "Enabled" | "Disabled";
  description?: string;
  bookCount?: number;
  sorting?: string;
  designLayout?: "A1 Design" | "A2 Design";
}

export interface FeaturedBook {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  subCategory: string;
  coverGradient: string;
  initials: string;
  isbn: string;
  price: number;
  format?: string;
}

export const FEATURED_CATALOGUE_BOOKS: FeaturedBook[] = [
  {
    id: "b1",
    title: "The Voice From Room 03",
    author: "Hellen Walker",
    publisher: "Harper Perennial",
    category: "Fiction",
    subCategory: "Crime & Thriller",
    coverGradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    initials: "VR",
    isbn: "9780062316097",
    price: 299,
    format: "EPUB",
  },
  {
    id: "b2",
    title: "Foreword - Classic Literary Introductions",
    author: "Various Authors",
    publisher: "Oxford University Press",
    category: "Literature & Classics",
    subCategory: "Classics",
    coverGradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
    initials: "FW",
    isbn: "9780199535569",
    price: 349,
    format: "EPUB",
  },
  {
    id: "b3",
    title: "NEP 2020 - Policy Formulation In Education",
    author: "Dr. Ashok Alex",
    publisher: "PixelBooks Press",
    category: "Education & Academics",
    subCategory: "Higher Education",
    coverGradient: "linear-gradient(135deg, #059669, #10b981)",
    initials: "NEP",
    isbn: "9789353218901",
    price: 315,
    format: "EPUB",
  },
  {
    id: "b4",
    title: "A Complete History of Music for Schools",
    author: "W. J. Baltzell",
    publisher: "Cambridge University Press",
    category: "Arts & Humanities",
    subCategory: "Music & Performing Arts",
    coverGradient: "linear-gradient(135deg, #b45309, #f59e0b)",
    initials: "MUS",
    isbn: "9781176559431",
    price: 399,
    format: "EPUB",
  },
  {
    id: "b5",
    title: "The Curtiss Aviation Book",
    author: "Glenn H. Curtiss",
    publisher: "Petals Publishers",
    category: "Science & Technology",
    subCategory: "Aviation & Engineering",
    coverGradient: "linear-gradient(135deg, #0284c7, #38bdf8)",
    initials: "CAB",
    isbn: "9781023481717",
    price: 249,
    format: "EPUB",
  },
  {
    id: "b6",
    title: "John M Upton - Special Edition",
    author: "John M Upton",
    publisher: "Meadows Publishers",
    category: "Fiction",
    subCategory: "Funny and Humorous",
    coverGradient: "linear-gradient(135deg, #d97706, #fbbf24)",
    initials: "JMU",
    isbn: "9780143128540",
    price: 199,
    format: "EPUB",
  },
  {
    id: "b7",
    title: "The Glass Palace Chronicle",
    author: "Werley Nortreus",
    publisher: "Werley Nortreus",
    category: "Fiction",
    subCategory: "Drama & Theater",
    coverGradient: "linear-gradient(135deg, #be123c, #fb7185)",
    initials: "GP",
    isbn: "9781400030651",
    price: 450,
    format: "EPUB",
  },
  {
    id: "b8",
    title: "The Chronicles of Eldoria: Mythical Realms",
    author: "Hellen Walker",
    publisher: "Penguin Random House",
    category: "Fiction",
    subCategory: "Fantasy Fiction",
    coverGradient: "linear-gradient(135deg, #4338ca, #6366f1)",
    initials: "CE",
    isbn: "9780345391803",
    price: 499,
    format: "EPUB",
  },
  {
    id: "b9",
    title: "Whispers of the Wind: Mythic Poems",
    author: "Virginia Woolf",
    publisher: "Oxford University Press",
    category: "Literature & Classics",
    subCategory: "Classical Poetry",
    coverGradient: "linear-gradient(135deg, #0d9488, #2dd4bf)",
    initials: "WW",
    isbn: "9780156907392",
    price: 180,
    format: "EPUB",
  },
  {
    id: "b10",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publisher: "Penguin Random House",
    category: "Literature & Classics",
    subCategory: "Romance & Drama",
    coverGradient: "linear-gradient(135deg, #db2777, #f472b6)",
    initials: "PP",
    isbn: "9780141439518",
    price: 220,
    format: "EPUB",
  },
  {
    id: "b11",
    title: "A Christmas Carol",
    author: "Charles Dickens",
    publisher: "Petals Publishers",
    category: "Literature & Classics",
    subCategory: "Classics",
    coverGradient: "linear-gradient(135deg, #15803d, #4ade80)",
    initials: "CC",
    isbn: "9780140439052",
    price: 160,
    format: "EPUB",
  },
  {
    id: "b12",
    title: "Full-Stack Architecture & Cloud Scalability",
    author: "Dr. Ashok Alex",
    publisher: "PixelBooks Press",
    category: "Science & Technology",
    subCategory: "Computer Science",
    coverGradient: "linear-gradient(135deg, #0f172a, #334155)",
    initials: "FSA",
    isbn: "9780132350884",
    price: 550,
    format: "EPUB",
  },
  {
    id: "b13",
    title: "Meditations and Reflections",
    author: "Marcus Aurelius",
    publisher: "Cambridge University Press",
    category: "Literature & Classics",
    subCategory: "Philosophy & Ethics",
    coverGradient: "linear-gradient(135deg, #854d0e, #ca8a04)",
    initials: "MED",
    isbn: "9780140449334",
    price: 320,
    format: "EPUB",
  },
  {
    id: "b14",
    title: "Shadows Over the Starlight Citadel",
    author: "Hellen Walker",
    publisher: "Harper Perennial",
    category: "Fiction",
    subCategory: "Fantasy Fiction",
    coverGradient: "linear-gradient(135deg, #581c87, #9333ea)",
    initials: "SC",
    isbn: "9780060850524",
    price: 420,
    format: "EPUB",
  },
  {
    id: "b15",
    title: "Sonnets of the Silent Moon",
    author: "Virginia Woolf",
    publisher: "Oxford University Press",
    category: "Literature & Classics",
    subCategory: "Classical Poetry",
    coverGradient: "linear-gradient(135deg, #0369a1, #38bdf8)",
    initials: "SSM",
    isbn: "9780156027878",
    price: 210,
    format: "EPUB",
  },
  {
    id: "b16",
    title: "The Elements of Style: Modern Edition",
    author: "William Strunk Jr.",
    publisher: "Aisha Publishers",
    category: "Education & Academics",
    subCategory: "Writing & Composition",
    coverGradient: "linear-gradient(135deg, #991b1b, #ef4444)",
    initials: "STY",
    isbn: "9780205309023",
    price: 199,
    format: "EPUB",
  },
  {
    id: "b17",
    title: "Knowledge for the Time: Historical Essays",
    author: "John Timbs",
    publisher: "Werley Nortreus",
    category: "Non-Fiction",
    subCategory: "History & Biography",
    coverGradient: "linear-gradient(135deg, #374151, #6b7280)",
    initials: "KFT",
    isbn: "9781019041857",
    price: 280,
    format: "EPUB",
  },
  {
    id: "b18",
    title: "Essays on Art, Aesthetics & Culture",
    author: "Clutton Brock",
    publisher: "Meadows Publishers",
    category: "Arts & Humanities",
    subCategory: "Visual Arts",
    coverGradient: "linear-gradient(135deg, #c2410c, #ea580c)",
    initials: "ART",
    isbn: "9781023088916",
    price: 360,
    format: "EPUB",
  },
  {
    id: "b19",
    title: "Neural Networks and Modern AI Architectures",
    author: "Dr. Ashok Alex",
    publisher: "PixelBooks Press",
    category: "Science & Technology",
    subCategory: "Artificial Intelligence",
    coverGradient: "linear-gradient(135deg, #047857, #10b981)",
    initials: "AI",
    isbn: "9780262035613",
    price: 650,
    format: "EPUB",
  },
  {
    id: "b20",
    title: "The Dragon's Crown of Valoria",
    author: "Hellen Walker",
    publisher: "Penguin Random House",
    category: "Fiction",
    subCategory: "Fantasy Fiction",
    coverGradient: "linear-gradient(135deg, #b91c1c, #f87171)",
    initials: "DC",
    isbn: "9780553103540",
    price: 520,
    format: "EPUB",
  },
  {
    id: "b21",
    title: "The Lean Startup Blueprint",
    author: "Various Authors",
    publisher: "Aisha Publishers",
    category: "Business & Finance",
    subCategory: "Entrepreneurship",
    coverGradient: "linear-gradient(135deg, #be185d, #ec4899)",
    initials: "LS",
    isbn: "9780307887894",
    price: 420,
    format: "EPUB",
  },
  {
    id: "b22",
    title: "Beyond the Solar Horizon",
    author: "Glenn H. Curtiss",
    publisher: "Orange Publishers",
    category: "Fiction",
    subCategory: "Science-Fiction",
    coverGradient: "linear-gradient(135deg, #1e1b4b, #4338ca)",
    initials: "BSH",
    isbn: "9780441569595",
    price: 380,
    format: "EPUB",
  },
  {
    id: "b23",
    title: "A Tangled Tale: Mathematical Riddles",
    author: "Lewis Carroll",
    publisher: "Cambridge University Press",
    category: "Education & Academics",
    subCategory: "Mathematics & Logic",
    coverGradient: "linear-gradient(135deg, #4d7c0f, #84cc16)",
    initials: "ATT",
    isbn: "9781646502776",
    price: 210,
    format: "EPUB",
  },
  {
    id: "b24",
    title: "Microservices and Distributed Data Systems",
    author: "Dr. Ashok Alex",
    publisher: "PixelBooks Press",
    category: "Science & Technology",
    subCategory: "Computer Science",
    coverGradient: "linear-gradient(135deg, #164e63, #06b6d4)",
    initials: "MDS",
    isbn: "9781492040347",
    price: 590,
    format: "EPUB",
  },
  {
    id: "b25",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publisher: "Penguin Random House",
    category: "Literature & Classics",
    subCategory: "Classics",
    coverGradient: "linear-gradient(135deg, #115e59, #14b8a6)",
    initials: "GG",
    isbn: "9780743273565",
    price: 299,
    format: "EPUB",
  },
  {
    id: "b26",
    title: "Galactic Odyssey: Year 3000",
    author: "Arthur Conan Doyle",
    publisher: "Fingerprint Publishing",
    category: "Fiction",
    subCategory: "Science-Fiction",
    coverGradient: "linear-gradient(135deg, #4c1d95, #7c3aed)",
    initials: "GO",
    isbn: "9780451457813",
    price: 340,
    format: "EPUB",
  },
];

export const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: "cat-1",
    name: "Fantasy Fiction",
    views: 45,
    avgSalesMonthly: 2,
    status: "Enabled",
    description: "Imaginative fiction featuring magical elements and mythical worlds.",
    bookCount: 4,
    designLayout: "A1 Design",
    sorting: "1",
  },
  {
    id: "cat-2",
    name: "Fantasy Poems",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Poetic compositions focused on mythical themes and verse.",
    bookCount: 2,
    designLayout: "A2 Design",
    sorting: "2",
  },
  {
    id: "cat-3",
    name: "Drama",
    views: 2,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Theatrical stories focusing on realistic characters and emotional conflict.",
    bookCount: 5,
    designLayout: "A1 Design",
    sorting: "3",
  },
  {
    id: "cat-4",
    name: "General & Literary Fiction",
    views: 53,
    avgSalesMonthly: 7,
    status: "Enabled",
    description: "Acclaimed literary works, narrative prose, and contemporary storytelling.",
    bookCount: 8,
    designLayout: "A2 Design",
    sorting: "4",
  },
  {
    id: "cat-5",
    name: "Tech Cat2",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Technical literature, programming guides, and software engineering.",
    bookCount: 3,
    designLayout: "A1 Design",
    sorting: "5",
  },
  {
    id: "cat-6",
    name: "Funny and Humorous",
    views: 0,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Lighthearted comedy, satire, jokes, and funny prose.",
    bookCount: 1,
    designLayout: "A2 Design",
    sorting: "6",
  },
  {
    id: "cat-7",
    name: "Science-Fiction & Fantasy",
    views: 2,
    avgSalesMonthly: 0,
    status: "Enabled",
    description: "Futuristic technology, space exploration, and speculative worlds.",
    bookCount: 6,
    designLayout: "A1 Design",
    sorting: "7",
  },
];

// Initial mapping of book assignments per collection
export const INITIAL_COLLECTION_BOOKS_MAP: Record<string, string[]> = {
  "cat-1": ["b1", "b8", "b14", "b20"],
  "cat-2": ["b9", "b15"],
  "cat-3": ["b2", "b7", "b10", "b11", "b13"],
  "cat-4": ["b1", "b2", "b6", "b10", "b11", "b16", "b17", "b25"],
  "cat-5": ["b3", "b12", "b19"],
  "cat-6": ["b6"],
  "cat-7": ["b1", "b5", "b8", "b14", "b22", "b26"],
};

const STORAGE_COLLECTIONS_KEY = "pixelbooks_featured_collections_list";
const STORAGE_COLLECTION_BOOKS_KEY = "pixelbooks_featured_collection_books_map";

// Local storage helpers
export function getStoredCollections(): CollectionItem[] {
  if (typeof window === "undefined") return INITIAL_COLLECTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_COLLECTIONS_KEY);
    if (!raw) return INITIAL_COLLECTIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COLLECTIONS;
  } catch {
    return INITIAL_COLLECTIONS;
  }
}

export function saveStoredCollections(collections: CollectionItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_COLLECTIONS_KEY, JSON.stringify(collections));
  } catch (err) {
    console.error("Failed to save collections to localStorage", err);
  }
}

export function getStoredBooksMap(): Record<string, string[]> {
  if (typeof window === "undefined") return INITIAL_COLLECTION_BOOKS_MAP;
  try {
    const raw = localStorage.getItem(STORAGE_COLLECTION_BOOKS_KEY);
    if (!raw) return INITIAL_COLLECTION_BOOKS_MAP;
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : INITIAL_COLLECTION_BOOKS_MAP;
  } catch {
    return INITIAL_COLLECTION_BOOKS_MAP;
  }
}

export function saveStoredBooksMap(booksMap: Record<string, string[]>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_COLLECTION_BOOKS_KEY, JSON.stringify(booksMap));
  } catch (err) {
    console.error("Failed to save books map to localStorage", err);
  }
}

export function getCollectionById(collectionId: string): CollectionItem | undefined {
  const collections = getStoredCollections();
  return collections.find((c) => c.id === collectionId);
}

export function getCollectionBookIds(collectionId: string): string[] {
  const booksMap = getStoredBooksMap();
  return booksMap[collectionId] || INITIAL_COLLECTION_BOOKS_MAP[collectionId] || [];
}

export function updateCollectionBooks(collectionId: string, bookIds: string[]) {
  const booksMap = getStoredBooksMap();
  booksMap[collectionId] = bookIds;
  saveStoredBooksMap(booksMap);

  // Also update collection bookCount in collections list
  const collections = getStoredCollections();
  const updated = collections.map((c) =>
    c.id === collectionId ? { ...c, bookCount: bookIds.length } : c
  );
  saveStoredCollections(updated);
}

// Categories list
export const ALL_CATEGORIES: string[] = [
  "All Categories",
  "Fiction",
  "Literature & Classics",
  "Science & Technology",
  "Arts & Humanities",
  "Education & Academics",
  "Business & Finance",
  "Non-Fiction",
];

// Subcategories list
export const ALL_SUB_CATEGORIES: string[] = [
  "All Sub Categories",
  "Fantasy Fiction",
  "Science-Fiction",
  "Crime & Thriller",
  "Romance & Drama",
  "Classics",
  "Classical Poetry",
  "Drama & Theater",
  "Computer Science",
  "Artificial Intelligence",
  "Aviation & Engineering",
  "Music & Performing Arts",
  "Visual Arts",
  "Higher Education",
  "Writing & Composition",
  "Mathematics & Logic",
  "Philosophy & Ethics",
  "History & Biography",
  "Entrepreneurship",
  "Funny and Humorous",
];

// Publishers list
export const ALL_PUBLISHERS: string[] = [
  "All Publishers",
  "Harper Perennial",
  "Oxford University Press",
  "Cambridge University Press",
  "Penguin Random House",
  "PixelBooks Press",
  "Aisha Publishers",
  "Werley Nortreus",
  "Petals Publishers",
  "Meadows Publishers",
  "Orange Publishers",
  "Fingerprint Publishing",
];

// Authors list
export const ALL_AUTHORS: string[] = [
  "All Authors",
  "Hellen Walker",
  "Various Authors",
  "Dr. Ashok Alex",
  "W. J. Baltzell",
  "Glenn H. Curtiss",
  "John M Upton",
  "Werley Nortreus",
  "Virginia Woolf",
  "Jane Austen",
  "Charles Dickens",
  "Marcus Aurelius",
  "William Strunk Jr.",
  "John Timbs",
  "Clutton Brock",
  "Lewis Carroll",
  "F. Scott Fitzgerald",
  "Arthur Conan Doyle",
];
