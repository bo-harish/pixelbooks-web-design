export type PromoStatus =
  | "Pending for Admin Approval"
  | "Approved"
  | "Rejected"
  | "Disabled"
  | "Expired";

export type Activation = "Available" | "Not available";

export type Promo = {
  id: string;
  code: string;
  title: string;
  ebook: string;
  discount: number;
  minimumAmount: number;
  start: string;
  end: string;
  startDateISO: string;
  endDateISO: string;
  status: PromoStatus;
  activation: Activation;
  active: boolean;
  description: string;
  usageCount: number;
  maxUsageLimit?: number;
  createdAt: string;
};

export const seedPromos: Promo[] = [
  {
    id: "1",
    code: "FQSGFQX799",
    title: "All",
    ebook: "All eBooks in Storefront",
    discount: 10,
    minimumAmount: 299,
    start: "Dec 09, 2025",
    end: "Dec 09, 2025",
    startDateISO: "2025-12-09",
    endDateISO: "2025-12-09",
    status: "Expired",
    activation: "Not available",
    active: false,
    description:
      "End of year special 10% discount promo code applicable across all eBook titles for registered storefront readers.",
    usageCount: 142,
    maxUsageLimit: 200,
    createdAt: "Dec 01, 2025",
  },
  {
    id: "2",
    code: "MONSOON25",
    title: "Monsoon Reads",
    ebook: "Monsoon Reads Collection",
    discount: 25,
    minimumAmount: 499,
    start: "Jul 01, 2026",
    end: "Aug 31, 2026",
    startDateISO: "2026-07-01",
    endDateISO: "2026-08-31",
    status: "Approved",
    activation: "Available",
    active: true,
    description:
      "Monsoon reading bonanza promo code offering 25% discount on curated monsoon titles with minimum purchase of ₹499.",
    usageCount: 88,
    maxUsageLimit: 500,
    createdAt: "Jun 25, 2026",
  },
  {
    id: "3",
    code: "KIDS15",
    title: "Kids Collection",
    ebook: "Kids Collection & Illustrated Tales",
    discount: 15,
    minimumAmount: 199,
    start: "Jun 15, 2026",
    end: "Dec 31, 2026",
    startDateISO: "2026-06-15",
    endDateISO: "2026-12-31",
    status: "Approved",
    activation: "Available",
    active: true,
    description:
      "Special children's reading incentive promo code for all titles in the Kids & Young Adult collection.",
    usageCount: 235,
    maxUsageLimit: 1000,
    createdAt: "Jun 10, 2026",
  },
  {
    id: "4",
    code: "WELCOME5",
    title: "New Users",
    ebook: "Harry Potter and the Philosopher's Stone",
    discount: 5,
    minimumAmount: 99,
    start: "Jan 01, 2026",
    end: "Dec 31, 2026",
    startDateISO: "2026-01-01",
    endDateISO: "2026-12-31",
    status: "Pending for Admin Approval",
    activation: "Not available",
    active: false,
    description:
      "First-time buyer welcoming discount promo code submitted for publisher admin verification.",
    usageCount: 0,
    maxUsageLimit: 500,
    createdAt: "Jul 20, 2026",
  },
  {
    id: "5",
    code: "AUG40",
    title: "Independence Sale",
    ebook: "A Promised Land",
    discount: 40,
    minimumAmount: 799,
    start: "Aug 01, 2026",
    end: "Aug 15, 2026",
    startDateISO: "2026-08-01",
    endDateISO: "2026-08-15",
    status: "Disabled",
    activation: "Not available",
    active: false,
    description:
      "August independence flash sale discount promo code currently disabled by seller management.",
    usageCount: 0,
    maxUsageLimit: 300,
    createdAt: "Jul 15, 2026",
  },
  {
    id: "6",
    code: "FLASH20",
    title: "Flash Weekend",
    ebook: "The Great Gatsby",
    discount: 20,
    minimumAmount: 350,
    start: "Mar 10, 2026",
    end: "Mar 12, 2026",
    startDateISO: "2026-03-10",
    endDateISO: "2026-03-12",
    status: "Rejected",
    activation: "Not available",
    active: false,
    description:
      "Weekend flash offer promo code rejected by admin due to minimum discount threshold policies.",
    usageCount: 0,
    maxUsageLimit: 100,
    createdAt: "Mar 01, 2026",
  },
];

const LOCAL_STORAGE_KEY = "pixelbooks_publisher_promo_codes";

export function getPromos(): Promo[] {
  if (typeof window === "undefined") {
    return seedPromos;
  }
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedPromos));
    return seedPromos;
  }
  try {
    const parsed: Promo[] = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) return seedPromos;
    return parsed;
  } catch {
    return seedPromos;
  }
}

export function savePromos(promos: Promo[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(promos));
}

export function getPromoById(id: string): Promo | undefined {
  const list = getPromos();
  return list.find((p) => p.id === id);
}

export function deletePromoById(id: string): Promo[] {
  const list = getPromos();
  const updated = list.filter((p) => p.id !== id);
  savePromos(updated);
  return updated;
}
