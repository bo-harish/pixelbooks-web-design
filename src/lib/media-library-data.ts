export interface VideoItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  categories: Record<string, string[]>;
  videoUrl?: string;
  duration?: string;
  courses?: string[];
  batches?: string[];
  course?: string;
  batch?: string;
  status: "Published" | "Draft";
  createdAt: string;
}

export interface AudioItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  categories: Record<string, string[]>;
  audioUrl?: string;
  duration?: string;
  narrator?: string;
  courses?: string[];
  batches?: string[];
  course?: string;
  batch?: string;
  status: "Published" | "Draft";
  createdAt: string;
}

export const MEDIA_CATEGORY_DATA: Record<string, string[]> = {
  "Academic & Educational": [
    "Higher Education",
    "Curriculum Books",
    "Research Papers",
    "Study Guides",
    "Reference",
    "Textbooks",
  ],
  Articles: ["News", "Opinion", "Analysis", "Peer Reviewed"],
  Autobiography: ["Memoirs", "Personal Journeys"],
  Biography: ["Historical", "Contemporary", "Political", "Literary"],
  "Children's Literature": ["Picture Books", "Early Readers", "Middle Grade"],
  Cinema: ["Screenplays", "Film Theory", "Documentaries", "Reviews"],
  "Cooking & Food": ["Recipes", "Nutrition", "Baking", "Culinary History"],
  Fiction: ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Thriller"],
  History: ["Ancient", "Modern", "Military", "Cultural", "World History"],
  "Science & Technology": ["Physics", "Computer Science", "Artificial Intelligence", "Engineering"],
  "Self-Help": ["Productivity", "Mindfulness", "Career", "Leadership"],
};

export const SEED_VIDEOS: VideoItem[] = [
  {
    id: "vid-1",
    title: "Introduction to Artificial Intelligence & Neural Networks",
    description:
      "A comprehensive overview of foundational AI concepts, deep learning architectures, and modern LLM applications designed for computer science and engineering students.",
    tags: ["Artificial Intelligence", "Computer Science", "Neural Networks", "Deep Learning"],
    categories: {
      "Science & Technology": ["Computer Science", "Artificial Intelligence"],
      "Academic & Educational": ["Higher Education", "Reference"],
    },
    courses: ["B.Sc (CS)", "B.Tech (IT)"],
    batches: ["2024 - 2028", "2023 - 2027"],
    videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
    duration: "45:20",
    status: "Published",
    createdAt: "2026-09-15",
  },
  {
    id: "vid-2",
    title: "World History: Ancient Civilizations and Trade Routes",
    description:
      "Explore the Indus Valley, Mesopotamia, Egypt, and the ancient Silk Road networks that shaped global cultural and economic exchange.",
    tags: ["History", "Ancient Civilizations", "Silk Road", "Archaeology"],
    categories: {
      History: ["Ancient", "Cultural", "World History"],
    },
    courses: ["MSC"],
    batches: ["Batch 2025"],
    videoUrl: "https://www.youtube.com/watch?v=sample-history",
    duration: "32:15",
    status: "Published",
    createdAt: "2026-09-20",
  },
  {
    id: "vid-3",
    title: "Creative Writing Workshop: Crafting Compelling Fiction",
    description:
      "Master character arcs, narrative pacing, and sensory worldbuilding with practical writing exercises and structural breakdown.",
    tags: ["Literature", "Creative Writing", "Fiction", "Storytelling"],
    categories: {
      Fiction: ["Fantasy", "Mystery"],
      "Self-Help": ["Productivity"],
    },
    courses: ["B.Com (CA)"],
    batches: ["2025 - 2029"],
    videoUrl: "",
    duration: "28:50",
    status: "Draft",
    createdAt: "2026-09-28",
  },
];

export const SEED_AUDIOS: AudioItem[] = [
  {
    id: "aud-1",
    title: "The Art of Mindful Leadership & Productivity",
    description:
      "An audio masterclass focusing on high-performance mental models, deep focus rituals, and empathetic team leadership for academic and industry professionals.",
    tags: ["Mindfulness", "Productivity", "Leadership", "Mental Health"],
    categories: {
      "Self-Help": ["Mindfulness", "Leadership", "Productivity"],
    },
    courses: ["M.B.A"],
    batches: ["2025 - 2027"],
    audioUrl: "https://example.com/audio/mindful-leadership.mp3",
    duration: "38:40",
    narrator: "Dr. Elena Vance",
    status: "Published",
    createdAt: "2026-09-12",
  },
  {
    id: "aud-2",
    title: "Great Speeches of Modern World History",
    description:
      "Dramatic readings and historical contextualization of the most influential political and cultural speeches of the 20th and 21st centuries.",
    tags: ["History", "Speeches", "Audiobook", "Modern History"],
    categories: {
      History: ["Modern", "Political"],
      Biography: ["Historical", "Political"],
    },
    courses: ["B.Sc (CS)"],
    batches: ["2025 - 2029"],
    audioUrl: "https://example.com/audio/great-speeches.mp3",
    duration: "54:10",
    narrator: "Marcus Thorne",
    status: "Published",
    createdAt: "2026-09-18",
  },
  {
    id: "aud-3",
    title: "Fundamentals of Quantum Mechanics: Spoken Lecture Series",
    description:
      "Part 1 of the university physics audio series covering wave-particle duality, Schrödinger equations, and quantum entanglement.",
    tags: ["Physics", "Quantum Mechanics", "Science", "Higher Education"],
    categories: {
      "Science & Technology": ["Physics"],
      "Academic & Educational": ["Higher Education", "Study Guides"],
    },
    courses: ["MSC"],
    batches: ["Batch 2026"],
    audioUrl: "",
    duration: "42:00",
    narrator: "Prof. Arthur Pendelton",
    status: "Draft",
    createdAt: "2026-09-29",
  },
];

const VIDEO_KEY = "pixelbooks_publisher_video_library";
const AUDIO_KEY = "pixelbooks_publisher_audio_library";

export function getVideoLibrary(): VideoItem[] {
  if (typeof window === "undefined") return SEED_VIDEOS;
  try {
    const raw = localStorage.getItem(VIDEO_KEY);
    if (!raw) {
      localStorage.setItem(VIDEO_KEY, JSON.stringify(SEED_VIDEOS));
      return SEED_VIDEOS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: VideoItem) => {
        const seedMatch = SEED_VIDEOS.find((s) => s.id === item.id);
        if (seedMatch) {
          const courses =
            item.courses && item.courses.length > 0
              ? item.courses
              : item.course
                ? [item.course]
                : seedMatch.courses;
          const batches =
            item.batches && item.batches.length > 0
              ? item.batches
              : item.batch
                ? [item.batch]
                : seedMatch.batches;
          return {
            ...item,
            courses,
            batches,
          };
        }
        return item;
      });
    }
    return SEED_VIDEOS;
  } catch {
    return SEED_VIDEOS;
  }
}

export function saveVideoLibrary(videos: VideoItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(VIDEO_KEY, JSON.stringify(videos));
  window.dispatchEvent(new CustomEvent("pb-video-library-change", { detail: videos }));
}

export function getAudioLibrary(): AudioItem[] {
  if (typeof window === "undefined") return SEED_AUDIOS;
  try {
    const raw = localStorage.getItem(AUDIO_KEY);
    if (!raw) {
      localStorage.setItem(AUDIO_KEY, JSON.stringify(SEED_AUDIOS));
      return SEED_AUDIOS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: AudioItem) => {
        const seedMatch = SEED_AUDIOS.find((s) => s.id === item.id);
        if (seedMatch) {
          const courses =
            item.courses && item.courses.length > 0
              ? item.courses
              : item.course
                ? [item.course]
                : seedMatch.courses;
          const batches =
            item.batches && item.batches.length > 0
              ? item.batches
              : item.batch
                ? [item.batch]
                : seedMatch.batches;
          return {
            ...item,
            courses,
            batches,
          };
        }
        return item;
      });
    }
    return SEED_AUDIOS;
  } catch {
    return SEED_AUDIOS;
  }
}

export function saveAudioLibrary(audios: AudioItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUDIO_KEY, JSON.stringify(audios));
  window.dispatchEvent(new CustomEvent("pb-audio-library-change", { detail: audios }));
}
