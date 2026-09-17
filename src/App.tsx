import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import {
  MapPin, Phone, EnvelopeSimple, WhatsappLogo, Sparkle,
  ArrowRight, Heart, ArrowsLeftRight, ShieldCheck,
} from "@phosphor-icons/react";
import type { AppState, Currency, FilterState } from "./types";
import {
  BRAND_NAME, CONTACT_PHONE, CONTACT_EMAIL, WHATSAPP_NUMBER,
  getProperty, whatsappLink, PROPERTIES,
} from "./data/mockData";
import Navbar from "./components/Navbar";
import HeroSearch from "./components/HeroSearch";
import PropertyListings from "./components/PropertyListings";
import PropertyDetailsModal from "./components/PropertyDetailsModal";
import {
  MortgageCalculator, Neighborhoods, Agents, ComparisonDrawer, ListPropertyModal,
} from "./components/ComparisonAndTools";

const DEFAULT_FILTERS: FilterState = {
  tab: "buy",
  state: "all",
  city: "all",
  propertyType: "all",
  rangeIndex: 0,
  beds: 0,
  baths: 0,
  amenities: [],
  query: "",
  featuredOnly: false,
};

export default function App() {
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("pn_favs") || "[]"); } catch { return []; }
  });
  const [comparison, setComparison] = useState<string[]>([]);
  const [filters, setFiltersState] = useState<FilterState>(DEFAULT_FILTERS);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("pn_favs", JSON.stringify(favorites)); } catch { /* ignore */ }
  }, [favorites]);

  const store: AppState = useMemo(() => ({
    currency,
    setCurrency,
    favorites,
    toggleFavorite: (id) => setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    comparison,
    toggleCompare: (id) =>
      setComparison((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= 4) return prev;
        return [...prev, id];
      }),
    openComparison: () => setShowComparison(true),
    openDetails: (id) => setDetailsId(id),
    openListProperty: () => setShowList(true),
    filters,
    setFilters: (patch) => setFiltersState((prev) => ({ ...prev, ...patch })),
    resetFilters: () => setFiltersState(DEFAULT_FILTERS),
  }), [currency, favorites, comparison, filters]);

  const details = detailsId ? getProperty(detailsId) ?? null : null;

  return (
    <div className="min-h-screen bg-white text-[#0B132B]">
      <Toaster position="top-center" richColors closeButton />
      <Navbar store={store} />
      <main>
        <HeroSearch store={store} />
        <PropertyListings store={store} />
        <Neighborhoods />
        <MortgageCalculator />
        <Agents />
      </main>
      <Footer store={store} />

      <PropertyDetailsModal property={details} store={store} onClose={() => setDetailsId(null)} />
      <ComparisonDrawer store={store} open={showComparison} onClose={() => setShowComparison(false)} />
      <ListPropertyModal open={showList} onClose={() => setShowList(false)} />

      <AnimatePresence>
        {comparison.length > 0 && !showComparison && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
            <button onClick={() => setShowComparison(true)} className="inline-flex items-center gap-2 rounded-full bg-[#0B132B] px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-transform hover:scale-105">
              <ArrowsLeftRight size={16} className="text-[#D4AF37]" /> Compare {comparison.length} propert{comparison.length > 1 ? "ies" : "y"} <ArrowRight size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Footer({ store }: { store: AppState }) {
  const links = [
    { label: "Buy", onClick: () => { store.setFilters({ tab: "buy" }); document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" }); } },
    { label: "Rent", onClick: () => { store.setFilters({ tab: "rent" }); document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" }); } },
    { label: "Commercial", onClick: () => { store.setFilters({ tab: "commercial" }); document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" }); } },
    { label: "Sell", onClick: () => store.openListProperty() },
  ];
  return (
    <footer className="bg-[#0B132B] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#D4AF37] text-[#0B132B]"><Sparkle size={18} weight="fill" /></span>
              <span className="font-serif text-xl">{BRAND_NAME}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-white/60">Nigeria's premier marketplace for luxury residences — curated homes in Lagos, Lekki and Abuja with white-glove advisory and verified security.</p>
            <div className="mt-5 flex items-center gap-2 text-xs text-white/50"><ShieldCheck size={16} className="text-[#D4AF37]" /> Every listing title-verified & inspected</div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {links.map((l) => <li key={l.label}><button onClick={l.onClick} className="text-white/70 transition-colors hover:text-[#D4AF37]">{l.label}</button></li>)}
              <li><a href="#calculator" className="text-white/70 hover:text-[#D4AF37]">Mortgage Calculator</a></li>
              <li><a href="#agents" className="text-white/70 hover:text-[#D4AF37]">Our Agents</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Concierge</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white/70 hover:text-[#D4AF37]"><Phone size={15} /> {CONTACT_PHONE}</a></li>
              <li><a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-white/70 hover:text-[#D4AF37]"><EnvelopeSimple size={15} /> {CONTACT_EMAIL}</a></li>
              <li><a href={whatsappLink("Hello PrimeNest, I'd like to speak with the concierge.")} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/70 hover:text-[#D4AF37]"><WhatsappLogo size={15} weight="fill" /> WhatsApp Concierge</a></li>
              <li className="flex items-center gap-2 text-white/70"><MapPin size={15} /> Victoria Island, Lagos</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. {PROPERTIES.length} curated residences.</p>
          <p className="inline-flex items-center gap-1">Crafted with <Heart size={12} weight="fill" className="text-[#D4AF37]" /> in Nigeria · +{WHATSAPP_NUMBER}</p>
        </div>
      </div>
    </footer>
  );
}
