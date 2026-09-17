import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowsLeftRight, Plus, List as ListIcon, X, Sparkle } from "@phosphor-icons/react";
import type { AppState } from "../types";
import { BRAND_NAME } from "../data/mockData";

const NAV_LINKS = [
  { label: "Buy", id: "listings" },
  { label: "Neighborhoods", id: "neighborhoods" },
  { label: "Agents", id: "agents" },
  { label: "Calculator", id: "calculator" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar({ store }: { store: AppState }) {
  const [open, setOpen] = useState(false);
  const favCount = store.favorites.length;
  const cmpCount = store.comparison.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D4AF37]/20 bg-[#0B132B]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => scrollTo("top")} className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-[#D4AF37] to-[#C5A059] text-[#0B132B]">
            <Sparkle size={18} weight="fill" />
          </span>
          <span className="font-serif text-lg tracking-tight text-white">
            Prime<span className="text-[#D4AF37]">Nest</span>
            <span className="ml-1 hidden text-[11px] font-sans uppercase tracking-[0.25em] text-white/50 sm:inline">Realty</span>
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-sm font-medium text-white/70 transition-colors hover:text-[#D4AF37]"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="mr-1 hidden items-center rounded-full border border-white/15 bg-white/5 p-0.5 sm:flex">
            {(["NGN", "USD"] as const).map((c) => (
              <button
                key={c}
                onClick={() => store.setCurrency(c)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  store.currency === c ? "bg-[#D4AF37] text-[#0B132B]" : "text-white/70 hover:text-white"
                }`}
              >
                {c === "NGN" ? "₦ NGN" : "$ USD"}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo("listings")}
            className="relative grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
            aria-label="Favorites"
          >
            <Heart size={17} weight={favCount ? "fill" : "regular"} />
            {favCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold text-[#0B132B]">{favCount}</span>
            )}
          </button>

          <button
            onClick={store.openComparison}
            className="relative hidden h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] sm:grid"
            aria-label="Compare"
          >
            <ArrowsLeftRight size={17} />
            {cmpCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold text-[#0B132B]">{cmpCount}</span>
            )}
          </button>

          <button
            onClick={store.openListProperty}
            className="ml-1 hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0B132B] transition-transform hover:scale-[1.03] active:scale-95 md:flex"
          >
            <Plus size={15} weight="bold" /> List Property
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white lg:hidden"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <ListIcon size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-[#0B132B] lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              <div className="mb-3 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-0.5">
                {(["NGN", "USD"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => store.setCurrency(c)}
                    className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      store.currency === c ? "bg-[#D4AF37] text-[#0B132B]" : "text-white/70"
                    }`}
                  >
                    {c === "NGN" ? "₦ NGN" : "$ USD"}
                  </button>
                ))}
              </div>
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => { scrollTo(l.id); setOpen(false); }}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/80 hover:bg-white/5"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => { store.openComparison(); setOpen(false); }}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/80 hover:bg-white/5"
              >
                Compare ({cmpCount})
              </button>
              <button
                onClick={() => { store.openListProperty(); setOpen(false); }}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#0B132B]"
              >
                <Plus size={15} weight="bold" /> List Your Property
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
