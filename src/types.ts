export type Currency = "NGN" | "USD";
export type ViewMode = "grid" | "list" | "map";
export type ListingTab = "buy" | "rent" | "sell" | "commercial";

export interface PropertyLocation {
  state: string;
  city: string;
  neighborhood: string;
  address: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  priceNgn: number;
  priceUsd: number;
  listingType: "for-sale" | "for-rent" | "commercial";
  location: PropertyLocation;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  parkingSpaces: number;
  yearBuilt: number;
  featured: boolean;
  images: string[];
  virtualTourUrl: string;
  amenities: string[];
  agentId: string;
  description: string;
  floorPlanUrl: string;
  coords: { x: number; y: number };
  views: number;
  listedDaysAgo: number;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  phone: string;
  whatsapp: string;
  email: string;
  photo: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  bio: string;
  activeListingsCount: number;
}

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  state: string;
  description: string;
  safetyScore: number;
  schoolRating: number;
  diningScore: number;
  avgPriceBuyNgn: number;
  avgRentNgn: number;
  image: string;
  highlights: string[];
}

export interface FilterState {
  tab: ListingTab;
  state: string;
  city: string;
  propertyType: string;
  rangeIndex: number;
  beds: number;
  baths: number;
  amenities: string[];
  query: string;
  featuredOnly: boolean;
}

export interface InquiryForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

export interface AppState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  comparison: string[];
  toggleCompare: (id: string) => void;
  openComparison: () => void;
  openDetails: (id: string) => void;
  openListProperty: () => void;
  filters: FilterState;
  setFilters: (patch: Partial<FilterState>) => void;
  resetFilters: () => void;
}
