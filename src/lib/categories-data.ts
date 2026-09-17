export interface SubcategoryItemObject {
  name: string;
  externalLink?: string;
}

export type SubcategoryItem = string | SubcategoryItemObject;

export function getSubcategoryName(sub: SubcategoryItem): string {
  return typeof sub === "string" ? sub : sub.name;
}

export function getSubcategoryLink(sub: SubcategoryItem): string | undefined {
  return typeof sub === "string" ? undefined : sub.externalLink;
}

export interface MasterCategory {
  id: string;
  name: string;
  subcategories: SubcategoryItem[];
  views: number;
  status: "Enabled" | "Disabled";
  description?: string;
  bookCount: number;
  code?: string;
  displayOrder?: number;
  enableExternalLink?: boolean;
  externalLink?: string;
}

export interface LibraryCategoryItem {
  id: string;
  masterId?: string;
  name: string;
  isCustom?: boolean;
  subcategories?: SubcategoryItem[];
  masterSubcategories: SubcategoryItem[];
  selectedSubcategories: SubcategoryItem[];
  customSubcategories?: SubcategoryItem[];
  enabled: boolean;
  bookCount: number;
  description?: string;
  lastModified?: string;
  displayOrder?: number;
  enableExternalLink?: boolean;
  externalLink?: string;
}

export const MASTER_CATEGORIES: MasterCategory[] = [
  {
    id: "cat-1",
    name: "Fantasy Fiction",
    displayOrder: 1,
    subcategories: ["High Fantasy", "Urban Fantasy", "Dark Fantasy", "Epic Fantasy"],
    views: 45,
    status: "Enabled",
    bookCount: 14,
    code: "FAN-FIC",
    description: "Imaginative and fantastical tales, mythic adventures, and world-building sagas.",
  },
  {
    id: "cat-2",
    name: "Fantasy Poems",
    displayOrder: 2,
    subcategories: ["Mythological Verse", "Folk Ballads", "Epic Rhymes"],
    views: 0,
    status: "Enabled",
    bookCount: 6,
    code: "FAN-POE",
    description: "Poetic works themed around myth, fantasy, lyrical folklore, and ancient verse.",
  },
  {
    id: "cat-3",
    name: "Drama",
    displayOrder: 3,
    subcategories: ["Tragedy", "Historical Drama", "Contemporary", "Theatre & Plays"],
    views: 2,
    status: "Enabled",
    bookCount: 12,
    code: "DRA-GEN",
    description: "Theatrical plays, character-driven narratives, and classic dramatic literature.",
  },
  {
    id: "cat-4",
    name: "General & Literary Fiction",
    displayOrder: 4,
    subcategories: ["Modern Classics", "Cultural Fiction", "Philosophical", "Short Stories"],
    views: 53,
    status: "Enabled",
    bookCount: 28,
    code: "LIT-FIC",
    description: "Celebrated fiction, modern literary classics, cultural narratives, and prose.",
  },
  {
    id: "cat-5",
    name: "Tech Cat2",
    displayOrder: 5,
    subcategories: [
      "Software Engineering",
      { name: "Pearson Learning Hub", externalLink: "https://in.pearson.com/" },
      "Web Development",
      "Cloud Computing",
    ],
    views: 0,
    status: "Enabled",
    bookCount: 16,
    code: "TEC-CAT",
    description: "Computer science, programming frameworks, machine learning, and systems architecture.",
  },
  {
    id: "cat-6",
    name: "Funny and Humorous",
    displayOrder: 6,
    subcategories: ["Satire", "Comic Strips", "Parody", "Humour & Romance"],
    views: 0,
    status: "Enabled",
    bookCount: 8,
    code: "HUM-GEN",
    description: "Witty fiction, comic parodies, satirical novels, and humorous entertainment.",
  },
  {
    id: "cat-7",
    name: "Science-Fiction & Fantasy",
    displayOrder: 7,
    subcategories: ["Cyberpunk", "Space Opera", "Dystopian", "Time Travel"],
    views: 2,
    status: "Enabled",
    bookCount: 22,
    code: "SCI-FAN",
    description: "Futuristic explorations, space exploration, speculative science, and dystopian sagas.",
  },
  {
    id: "cat-8",
    name: "Academic & Educational",
    displayOrder: 8,
    subcategories: ["Courseware", "Higher Education", "Competitive Exams", "Curriculum Guides", "Reference"],
    views: 38,
    status: "Enabled",
    bookCount: 42,
    code: "ACA-EDU",
    description: "Core academic textbooks, educational syllabi, competitive exam modules, and study guides.",
    enableExternalLink: true,
    externalLink: "https://in.pearson.com/",
  },
  {
    id: "cat-9",
    name: "Travel & History",
    displayOrder: 9,
    subcategories: ["World History", "Travelogue", "Cultural Geography", "Ancient Civilizations"],
    views: 19,
    status: "Enabled",
    bookCount: 18,
    code: "TRV-HIS",
    description: "Historical chronicles, explorations, travel narratives, and archaeological studies.",
  },
  {
    id: "cat-10",
    name: "Philosophy & Ethics",
    displayOrder: 10,
    subcategories: ["Ancient Philosophy", "Stoicism", "Modern Ethics", "Logic & Reasoning"],
    views: 25,
    status: "Enabled",
    bookCount: 15,
    code: "PHI-ETH",
    description: "Philosophical inquiries, treatises on ethics, logic, epistemology, and moral philosophy.",
  },
  {
    id: "cat-11",
    name: "Science & Biology",
    displayOrder: 11,
    subcategories: ["Physics", "Chemistry", "Molecular Biology", "Health Science", "Environmental Studies"],
    views: 31,
    status: "Enabled",
    bookCount: 34,
    code: "SCI-BIO",
    description: "Empirical sciences, life sciences, organic chemistry, physics textbooks, and ecology.",
  },
  {
    id: "cat-12",
    name: "Biography & Memoir",
    displayOrder: 12,
    subcategories: ["Autobiography", "Historical Figures", "Literary Memoirs", "Leaders & Innovators"],
    views: 14,
    status: "Enabled",
    bookCount: 19,
    code: "BIO-MEM",
    description: "Inspiring biographies, personal journals, memoirs, and life stories of historical figures.",
  },
  {
    id: "cat-13",
    name: "Language & Literature",
    displayOrder: 13,
    subcategories: ["English Literature", "Linguistics", "Regional Classics", "Poetry & Verse"],
    views: 22,
    status: "Enabled",
    bookCount: 25,
    code: "LAN-LIT",
    description: "Linguistic studies, literary criticism, grammar treatises, and classical anthologies.",
  },
  {
    id: "cat-14",
    name: "Commerce & Economics",
    displayOrder: 14,
    subcategories: ["Microeconomics", "Business Management", "Financial Accounting", "Banking & Finance"],
    views: 17,
    status: "Enabled",
    bookCount: 20,
    code: "COM-ECO",
    description: "Macroeconomics, financial accounting principles, commerce, and business strategy.",
  },
  {
    id: "cat-15",
    name: "Law & Governance",
    displayOrder: 15,
    subcategories: ["Constitutional Law", "Public Administration", "International Relations", "Human Rights"],
    views: 8,
    status: "Enabled",
    bookCount: 11,
    code: "LAW-GOV",
    description: "Jurisprudence, constitutional rights, public policy, and administrative governance.",
  },
  {
    id: "cat-16",
    name: "Crime, Thriller, Mystery",
    displayOrder: 16,
    subcategories: ["Detective Fiction", "Psychological Thriller", "Cozy Mystery", "True Crime"],
    views: 15,
    status: "Enabled",
    bookCount: 17,
    code: "CRM-THR",
    description: "Suspense novels, crime investigations, psychological puzzles, and detective stories.",
  },
  {
    id: "cat-17",
    name: "Children's Literature",
    displayOrder: 17,
    subcategories: ["Picture Books", "Fairy Tales", "Early Readers", "Middle Grade"],
    views: 11,
    status: "Enabled",
    bookCount: 20,
    code: "CHD-LIT",
    description: "Engaging stories, illustrated tales, and learning material for young readers.",
  },
  {
    id: "cat-18",
    name: "Health Science",
    displayOrder: 18,
    subcategories: ["Nutrition", "Public Health", "Clinical Medicine", "Mental Wellness"],
    views: 9,
    status: "Enabled",
    bookCount: 14,
    code: "HLT-SCI",
    description: "Medical science, physical fitness, nutrition, healthcare manuals, and well-being.",
  },
  {
    id: "cat-19",
    name: "Lifestyle & Personal Interest",
    displayOrder: 19,
    subcategories: ["Self-Improvement", "Mindfulness", "Productivity", "Cookery"],
    views: 12,
    status: "Enabled",
    bookCount: 15,
    code: "LIF-PER",
    description: "Personal growth, lifestyle design, habit mastery, and practical guides.",
  },
  {
    id: "cat-20",
    name: "Cultural Studies & Folklore",
    displayOrder: 20,
    subcategories: ["Anthropology", "Folklore Traditions", "Mythology", "Indigenous Culture"],
    views: 7,
    status: "Enabled",
    bookCount: 10,
    code: "CUL-FOL",
    description: "Cross-cultural anthropology, heritage stories, regional customs, and lore.",
  },
  {
    id: "cat-21",
    name: "Cinema & Performing Arts",
    displayOrder: 21,
    subcategories: ["Screenwriting", "Theatre Arts", "Film Studies", "Music Theory"],
    views: 5,
    status: "Enabled",
    bookCount: 8,
    code: "CIN-ART",
    description: "Cinematography, dramatic performance, musical history, and theatrical design.",
  },
  {
    id: "cat-22",
    name: "Competitive Exams (NEET / JEE)",
    displayOrder: 22,
    subcategories: ["NEET Preparation", "JEE Advanced", "Solved Papers", "Mock Question Sets"],
    views: 29,
    status: "Enabled",
    bookCount: 30,
    code: "CMP-EXM",
    description: "Specialized prep material, previous year question banks, and entrance modules.",
  },
  {
    id: "cat-23",
    name: "Malayalam Literature & Fiction",
    displayOrder: 23,
    subcategories: ["Classic Malayalam Novels", "Kerala Folklore", "Modern Poetry", "Malayalam Prose"],
    views: 33,
    status: "Enabled",
    bookCount: 26,
    code: "MAL-LIT",
    description: "Rich literary heritage of Kerala, prominent Malayalam novelists, and regional poetry.",
  },
];

// Initial default categories for table view
export const INITIAL_LIBRARY_CATEGORIES: LibraryCategoryItem[] = MASTER_CATEGORIES.map((m) => ({
  id: m.id,
  masterId: m.id,
  name: m.name,
  subcategories: [...m.subcategories],
  views: m.views,
  status: m.status,
  masterSubcategories: [...m.subcategories],
  selectedSubcategories: [...m.subcategories],
  enabled: m.status === "Enabled",
  bookCount: m.bookCount,
  description: m.description,
  lastModified: "12 Mar 2026",
  displayOrder: m.displayOrder,
  enableExternalLink: m.enableExternalLink,
  externalLink: m.externalLink,
}));

const STORAGE_KEY = "pixelbooks_library_categories_vimala";

export function loadLibraryCategories(): LibraryCategoryItem[] {
  if (typeof window === "undefined") return INITIAL_LIBRARY_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading library categories from localStorage:", e);
  }
  return INITIAL_LIBRARY_CATEGORIES;
}

export function saveLibraryCategories(categories: LibraryCategoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error("Error saving library categories to localStorage:", e);
  }
}

export function resetLibraryCategories(): LibraryCategoryItem[] {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing library categories in localStorage:", e);
    }
  }
  return INITIAL_LIBRARY_CATEGORIES;
}
