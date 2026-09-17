import { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlass, MapPin, Buildings, House, Bathtub, CaretDown } from "@phosphor-icons/react";
import type { AppState, ListingTab } from "../types";
import { HERO_IMAGE, PROPERTY_TYPES, PRICE_RANGES, ALL_AMENITIES } from "../data/mockData";

const TABS: { key: ListingTab; label: string }[] = [
  { key: "buy", label: "Buy" },
  { key: "rent", label: "Rent" },
  { key: "commercial", label: "Commercial" },
  { key: "sell", label: "Sell" },
];

const QUICK = ["Swimming Pool", "24/7 Security", "Smart Home", "Standby Generator"];

const selectCls =
  "w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm font-medium text-slate-800 outline-none transition-colors focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20";

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {icon} {label}
      </span>
      <div className="relative">
        {children}
        <CaretDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}

export default function HeroSearch({ store }: { store: AppState }) {
  const { filters, setFilters } = store;
  const [activeTab, setActiveTab] = useState<ListingTab>(filters.tab);

  const pickTab = (t: ListingTab) => {
    setActiveTab(t);
    if (t === "sell") {
      store.openListProperty();
      return;
    }
    setFilters({ tab: t });
  };

  const toggleAmenity = (a: string) => {
    const has = filters.amenities.includes(a);
    setFilters({ amenities: has ? filters.amenities.filter((x) => x !== a) : [...filters.amenities, a] });
  };

  const scrollToResults = () => {
    const el = document.getElementById("listings");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="top" className="relative overflow-hidden bg-[#0B132B]">
      <div className="absolute inset-0">
        <img src={HERO_IMAGE} alt="Luxury residence" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/80 via-[#0B132B]/70 to-[#0B132B]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pt-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            Nigeria's Premier Property Marketplace
          </span>
          <h1 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            {"Find a Place You'll Love to Call Home"}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Curated luxury residences across Lagos, Lekki, Ikoyi and Abuja. Verified listings, private viewings, and white-glove advisory.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="mt-10 rounded-2xl border border-white/10 bg-white/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-3"
        >
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => pickTab(t.key)}
                className={`relative flex-1 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  activeTab === t.key ? "text-[#0B132B]" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {activeTab === t.key && (
                  <motion.span layoutId="herotab" className="absolute inset-0 rounded-lg bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 p-1 sm:grid-cols-2 lg:grid-cols-3">
            <Field icon={<MapPin size={12} />} label="Location">
              <select className={selectCls} value={filters.city} onChange={(e) => setFilters({ city: e.target.value })}>
                <option value="all">All cities</option>
                {["Ikoyi", "Lekki", "Victoria Island", "Eko Atlantic", "Ikeja", "Abuja"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field icon={<Buildings size={12} />} label="Property Type">
              <select className={selectCls} value={filters.propertyType} onChange={(e) => setFilters({ propertyType: e.target.value })}>
                <option value="all">Any type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field icon={<MagnifyingGlass size={12} />} label="Budget">
              <select className={selectCls} value={filters.rangeIndex} onChange={(e) => setFilters({ rangeIndex: Number(e.target.value) })}>
                {PRICE_RANGES.map((r, i) => (
                  <option key={r.label} value={i}>{r.label}</option>
                ))}
              </select>
            </Field>
            <Field icon={<House size={12} />} label="Bedrooms">
              <select className={selectCls} value={filters.beds} onChange={(e) => setFilters({ beds: Number(e.target.value) })}>
                <option value={0}>Any</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}+ beds</option>
                ))}
              </select>
            </Field>
            <Field icon={<Bathtub size={12} />} label="Bathrooms">
              <select className={selectCls} value={filters.baths} onChange={(e) => setFilters({ baths: Number(e.target.value) })}>
                <option value={0}>Any</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}+ baths</option>
                ))}
              </select>
            </Field>
            <div className="flex items-end">
              <button
                onClick={scrollToResults}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B132B] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
              >
                <MagnifyingGlass size={16} weight="bold" /> Search Properties
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-1 pb-1 pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Popular:</span>
            {QUICK.map((a) => {
              const on = filters.amenities.includes(a);
              return (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    on ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#8a6d1f]" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {a}
                </button>
              );
            })}
            {ALL_AMENITIES.length > 0 && (
              <button onClick={() => setFilters({ amenities: [] })} className="ml-auto text-xs font-medium text-slate-400 hover:text-slate-600">
                Clear
              </button>
            )}
          </div>
        </motion.div>

        <div className="mt-8 grid max-w-2xl grid-cols-3 gap-4">
          {[
            { n: "500+", l: "Verified Listings" },
            { n: "₦2.1T", l: "Assets Transacted" },
            { n: "12", l: "Prime Districts" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-serif text-2xl text-[#D4AF37] sm:text-3xl">{s.n}</div>
              <div className="text-xs text-white/60">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}