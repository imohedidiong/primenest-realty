import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ArrowsLeftRight, MapPin, House, Bathtub, Ruler, Car,
  GridFour, List as ListIcon, MapTrifold, SlidersHorizontal, X,
  Check, CaretDown, ChatCircle, ArrowRight,
} from "@phosphor-icons/react";
import type { AppState, Property, ViewMode } from "../types";
import {
  PROPERTIES, PRICE_RANGES, ALL_AMENITIES, PROPERTY_TYPES, CITIES,
  formatPrice, whatsappLink,
} from "../data/mockData";

const TAB_TO_TYPE: Record<string, string | null> = {
  buy: "for-sale",
  rent: "for-rent",
  commercial: "commercial",
  sell: null,
};

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "newest", label: "Newest" },
  { key: "size", label: "Largest" },
];

function matches(p: Property, s: AppState): boolean {
  const f = s.filters;
  const type = TAB_TO_TYPE[f.tab];
  if (type && p.listingType !== type) return false;
  if (f.city !== "all" && p.location.city !== f.city && p.location.neighborhood !== f.city) return false;
  if (f.state !== "all" && p.location.state !== f.state) return false;
  if (f.propertyType !== "all" && p.propertyType !== f.propertyType) return false;
  if (f.beds > 0 && p.bedrooms < f.beds) return false;
  if (f.baths > 0 && p.bathrooms < f.baths) return false;
  if (f.featuredOnly && !p.featured) return false;
  if (f.amenities.length && !f.amenities.every((a) => p.amenities.includes(a))) return false;
  const range = PRICE_RANGES[f.rangeIndex] ?? PRICE_RANGES[0];
  const price = s.currency === "USD" ? p.priceUsd : p.priceNgn;
  const min = s.currency === "USD" ? range.min / 1500 : range.min;
  const max = s.currency === "USD" ? range.max / 1500 : range.max;
  if (price < min || price > max) return false;
  if (f.query) {
    const q = f.query.toLowerCase();
    const hay = `${p.title} ${p.location.neighborhood} ${p.location.city} ${p.propertyType}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function Spec({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
      {icon} {value}
    </span>
  );
}

function Card({ p, store, onOpen }: { p: Property; store: AppState; onOpen: () => void }) {
  const fav = store.favorites.includes(p.id);
  const cmp = store.comparison.includes(p.id);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-200/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={p.images[0]} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-[#0B132B]/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
            {p.listingType === "for-rent" ? "For Rent" : p.listingType === "commercial" ? "Commercial" : "For Sale"}
          </span>
          {p.featured && <span className="rounded-full bg-[#D4AF37] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0B132B]">Featured</span>}
        </div>
        <button
          onClick={() => store.toggleFavorite(p.id)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#0B132B] backdrop-blur transition-transform hover:scale-110 active:scale-90"
          aria-label="Save"
        >
          <Heart size={17} weight={fav ? "fill" : "regular"} className={fav ? "text-rose-500" : ""} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg leading-tight text-[#0B132B]">{p.title}</h3>
        </div>
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={13} className="text-[#C5A059]" /> {p.location.neighborhood}, {p.location.city}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-slate-100 py-3">
          {p.propertyType === "Office Tower" || p.propertyType === "Retail Complex" ? (
            <Spec icon={<Car size={14} />} value={`${p.parkingSpaces} bays`} />
          ) : (
            <Spec icon={<House size={14} />} value={`${p.bedrooms} Beds`} />
          )}
          <Spec icon={<Bathtub size={14} />} value={`${p.bathrooms} Baths`} />
          <Spec icon={<Ruler size={14} />} value={`${p.areaSqm} m²`} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="font-serif text-xl font-semibold text-[#0B132B]">
            {formatPrice(p.priceNgn, p.priceUsd, store.currency, p.listingType)}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => store.toggleCompare(p.id)}
              className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors ${cmp ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#8a6d1f]" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
              aria-label="Compare"
            >
              <ArrowsLeftRight size={16} />
            </button>
            <button onClick={onOpen} className="inline-flex items-center gap-1 rounded-lg bg-[#0B132B] px-3.5 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95">
              Details <ArrowRight size={14} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Row({ p, store, onOpen }: { p: Property; store: AppState; onOpen: () => void }) {
  const fav = store.favorites.includes(p.id);
  return (
    <motion.article layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-lg sm:flex-row">
      <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-auto sm:w-64">
        <img src={p.images[0]} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <button onClick={() => store.toggleFavorite(p.id)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 backdrop-blur">
          <Heart size={15} weight={fav ? "fill" : "regular"} className={fav ? "text-rose-500" : "text-[#0B132B]"} />
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600">{p.propertyType}</span>
            {p.featured && <span className="rounded-full bg-[#D4AF37]/20 px-2 py-0.5 text-[10px] font-bold uppercase text-[#8a6d1f]">Featured</span>}
          </div>
          <h3 className="mt-2 font-serif text-xl text-[#0B132B]">{p.title}</h3>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500"><MapPin size={14} className="text-[#C5A059]" /> {p.location.address}, {p.location.city}</p>
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">{p.description}</p>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Spec icon={<House size={14} />} value={`${p.bedrooms} Beds`} />
            <Spec icon={<Bathtub size={14} />} value={`${p.bathrooms} Baths`} />
            <Spec icon={<Ruler size={14} />} value={`${p.areaSqm} m²`} />
            <Spec icon={<Car size={14} />} value={`${p.parkingSpaces} Parking`} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold text-[#0B132B]">{formatPrice(p.priceNgn, p.priceUsd, store.currency, p.listingType)}</span>
            <button onClick={onOpen} className="inline-flex items-center gap-1 rounded-lg bg-[#0B132B] px-3 py-2 text-xs font-semibold text-white">Details <ArrowRight size={14} /></button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function MapView({ items, store, onOpen }: { items: Property[]; store: AppState; onOpen: (id: string) => void }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  const sel = items.find((p) => p.id === active) ?? items[0];
  return (
    <div className="relative h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-[#1C2541]">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(#ffffff12 1px,transparent 1px),linear-gradient(90deg,#ffffff12 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B]/40 to-[#1C2541]/60" />
      {items.map((p) => {
        const on = p.id === active;
        return (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            style={{ left: `${p.coords.x}%`, top: `${p.coords.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold shadow-lg transition-all ${on ? "z-20 scale-110 bg-[#D4AF37] text-[#0B132B]" : "z-10 bg-white text-[#0B132B] hover:bg-[#D4AF37]/80"}`}
          >
            {formatPrice(p.priceNgn, p.priceUsd, store.currency, p.listingType)}
          </button>
        );
      })}
      {sel && (
        <div className="absolute bottom-4 left-4 right-4 z-30 mx-auto max-w-sm sm:left-4 sm:right-auto">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl">
            <div className="flex gap-3 p-3">
              <img src={sel.images[0]} alt={sel.title} className="h-20 w-24 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-serif text-sm text-[#0B132B]">{sel.title}</h4>
                <p className="truncate text-xs text-slate-500">{sel.location.neighborhood}, {sel.location.city}</p>
                <p className="mt-1 font-serif text-base font-semibold text-[#0B132B]">{formatPrice(sel.priceNgn, sel.priceUsd, store.currency, sel.listingType)}</p>
                <div className="mt-1.5 flex gap-1.5">
                  <button onClick={() => onOpen(sel.id)} className="rounded-md bg-[#0B132B] px-2.5 py-1 text-[11px] font-semibold text-white">View</button>
                  <a href={whatsappLink(`Hello PrimeNest, I'm interested in ${sel.title}`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600"><ChatCircle size={12} /> WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterDrawer({ open, onClose, store }: { open: boolean; onClose: () => void; store: AppState }) {
  const { filters, setFilters } = store;
  const toggleA = (a: string) => setFilters({ amenities: filters.amenities.includes(a) ? filters.amenities.filter((x) => x !== a) : [...filters.amenities, a] });
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/40" />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }} className="fixed right-0 top-0 z-50 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="font-serif text-lg text-[#0B132B]">Refine Search</h3>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600"><X size={16} /></button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">City / Area</p>
                <div className="relative">
                  <select value={filters.city} onChange={(e) => setFilters({ city: e.target.value })} className="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2.5 pr-9 text-sm">
                    <option value="all">All areas</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <CaretDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Property Type</p>
                <div className="relative">
                  <select value={filters.propertyType} onChange={(e) => setFilters({ propertyType: e.target.value })} className="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2.5 pr-9 text-sm">
                    <option value="all">Any type</option>
                    {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <CaretDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Bedrooms</p>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setFilters({ beds: n })} className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-medium ${filters.beds === n ? "border-[#0B132B] bg-[#0B132B] text-white" : "border-slate-200 text-slate-600"}`}>{n === 0 ? "Any" : `${n}+`}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Amenities & Security</p>
                <div className="space-y-1.5">
                  {ALL_AMENITIES.map((a) => {
                    const on = filters.amenities.includes(a);
                    return (
                      <button key={a} onClick={() => toggleA(a)} className="flex w-full items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm hover:bg-slate-50">
                        <span className="text-slate-700">{a}</span>
                        <span className={`grid h-5 w-5 place-items-center rounded ${on ? "bg-[#D4AF37] text-[#0B132B]" : "border border-slate-300 text-transparent"}`}><Check size={13} weight="bold" /></span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
                <span className="text-sm font-medium text-slate-700">Featured only</span>
                <button onClick={() => setFilters({ featuredOnly: !filters.featuredOnly })} className={`h-6 w-11 rounded-full p-0.5 transition-colors ${filters.featuredOnly ? "bg-[#0B132B]" : "bg-slate-300"}`}>
                  <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${filters.featuredOnly ? "translate-x-5" : ""}`} />
                </button>
              </label>
            </div>
            <div className="flex gap-2 border-t border-slate-200 p-4">
              <button onClick={store.resetFilters} className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600">Reset</button>
              <button onClick={onClose} className="flex-1 rounded-lg bg-[#0B132B] py-2.5 text-sm font-semibold text-white">Show Results</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default function PropertyListings({ store }: { store: AppState }) {
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState("featured");
  const [drawer, setDrawer] = useState(false);

  const results = useMemo(() => {
    const list = PROPERTIES.filter((p) => matches(p, store));
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.priceNgn - b.priceNgn);
    else if (sort === "price-desc") sorted.sort((a, b) => b.priceNgn - a.priceNgn);
    else if (sort === "newest") sorted.sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
    else if (sort === "size") sorted.sort((a, b) => b.areaSqm - a.areaSqm);
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
  }, [store.filters, store.currency, sort]);

  const f = store.filters;
  const chips: { label: string; clear: () => void }[] = [];
  const tabLabel = { buy: "For Sale", rent: "For Rent", commercial: "Commercial", sell: "Sell" }[f.tab];
  chips.push({ label: tabLabel, clear: () => store.setFilters({ tab: "buy" }) });
  if (f.city !== "all") chips.push({ label: f.city, clear: () => store.setFilters({ city: "all" }) });
  if (f.propertyType !== "all") chips.push({ label: f.propertyType, clear: () => store.setFilters({ propertyType: "all" }) });
  if (f.rangeIndex > 0) chips.push({ label: PRICE_RANGES[f.rangeIndex].label, clear: () => store.setFilters({ rangeIndex: 0 }) });
  if (f.beds > 0) chips.push({ label: `${f.beds}+ Beds`, clear: () => store.setFilters({ beds: 0 }) });
  if (f.baths > 0) chips.push({ label: `${f.baths}+ Baths`, clear: () => store.setFilters({ baths: 0 }) });
  if (f.featuredOnly) chips.push({ label: "Featured", clear: () => store.setFilters({ featuredOnly: false }) });
  f.amenities.forEach((a) => chips.push({ label: a, clear: () => store.setFilters({ amenities: f.amenities.filter((x) => x !== a) }) }));

  return (
    <section id="listings" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C5A059]">Curated Portfolio</span>
          <h2 className="mt-1 font-serif text-3xl text-[#0B132B] sm:text-4xl">Exceptional Properties</h2>
          <p className="mt-1 text-sm text-slate-500">{results.length} residence{results.length !== 1 ? "s" : ""} matching your criteria</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-700">
              {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <CaretDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button onClick={() => setDrawer(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">
            <SlidersHorizontal size={16} /> <span className="hidden sm:inline">Filters</span>
            {(f.amenities.length > 0) && <span className="grid h-5 w-5 place-items-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-[#0B132B]">{f.amenities.length}</span>}
          </button>
          <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
            {([["grid", GridFour], ["list", ListIcon], ["map", MapTrifold]] as const).map(([v, Icon]) => (
              <button key={v} onClick={() => setView(v)} className={`grid h-[42px] w-11 place-items-center transition-colors ${view === v ? "bg-[#0B132B] text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                <Icon size={17} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {chips.map((c, i) => (
            <button key={i} onClick={c.clear} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200">
              {c.label} <X size={12} />
            </button>
          ))}
          <button onClick={store.resetFilters} className="text-xs font-semibold text-[#C5A059] hover:underline">Clear all</button>
        </div>
      )}

      <div className="mt-8">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-slate-400 shadow-sm"><MapPin size={24} /></div>
            <h3 className="mt-4 font-serif text-xl text-[#0B132B]">No properties match</h3>
            <p className="mt-1 text-sm text-slate-500">Try broadening your search or clearing filters.</p>
            <button onClick={store.resetFilters} className="mt-4 rounded-lg bg-[#0B132B] px-4 py-2 text-sm font-semibold text-white">Reset Filters</button>
          </div>
        ) : view === "map" ? (
          <MapView items={results} store={store} onOpen={store.openDetails} />
        ) : view === "list" ? (
          <div className="space-y-4">
            {results.map((p) => <Row key={p.id} p={p} store={store} onOpen={() => store.openDetails(p.id)} />)}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {results.map((p) => <Card key={p.id} p={p} store={store} onOpen={() => store.openDetails(p.id)} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <FilterDrawer open={drawer} onClose={() => setDrawer(false)} store={store} />
    </section>
  );
}
