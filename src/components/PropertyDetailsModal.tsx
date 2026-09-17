import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  X, Heart, ArrowsLeftRight, MapPin, House, Bathtub, Ruler, Car,
  Phone, WhatsappLogo, EnvelopeSimple, Calendar, Check, CheckCircle,
  Play, ShieldCheck, Star, ArrowUpRight, ChatCircle,
} from "@phosphor-icons/react";
import type { AppState, Property } from "../types";
import {
  formatPrice, formatFullPrice, whatsappLink, getAgent, CONTACT_PHONE,
} from "../data/mockData";

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20";

function SpecTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#C5A059] shadow-sm">{icon}</span>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-[#0B132B]">{value}</p>
      </div>
    </div>
  );
}

export default function PropertyDetailsModal({ property, store, onClose }: { property: Property | null; store: AppState; onClose: () => void }) {
  const [active, setActive] = useState(0);
  const [tour, setTour] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (property) {
      setActive(0);
      setTour(false);
      setSent(false);
      setForm({ name: "", email: "", phone: "", date: "", message: `Hello, I'd like to arrange a private viewing of ${property.title}.` });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [property]);

  if (!property) return null;
  const p = property;
  const agent = getAgent(p.agentId);
  const fav = store.favorites.includes(p.id);
  const cmp = store.comparison.includes(p.id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error("Please add your name and email."); return; }
    setSent(true);
    toast.success("Viewing request sent — our advisor will confirm shortly.");
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0B132B]/70 p-0 backdrop-blur-sm sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative my-0 w-full max-w-6xl overflow-hidden bg-white shadow-2xl sm:my-4 sm:rounded-2xl"
        >
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="min-w-0">
              <h2 className="truncate font-serif text-lg text-[#0B132B] sm:text-xl">{p.title}</h2>
              <p className="flex items-center gap-1 truncate text-xs text-slate-500"><MapPin size={12} className="text-[#C5A059]" /> {p.location.address}, {p.location.city}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => store.toggleFavorite(p.id)} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 hover:border-rose-300">
                <Heart size={16} weight={fav ? "fill" : "regular"} className={fav ? "text-rose-500" : ""} />
              </button>
              <button onClick={() => store.toggleCompare(p.id)} className={`hidden h-9 w-9 place-items-center rounded-full border sm:grid ${cmp ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#8a6d1f]" : "border-slate-200 text-slate-600"}`}>
                <ArrowsLeftRight size={16} />
              </button>
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied to clipboard"); }} className="hidden h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 sm:grid">
                <ArrowUpRight size={16} />
              </button>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-[#0B132B] text-white"><X size={16} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 lg:grid-cols-3">
            <div className="lg:col-span-2 lg:p-6">
              <div className="relative aspect-[16/10] bg-slate-100 sm:rounded-xl">
                <img src={p.images[active]} alt={p.title} className="h-full w-full object-cover sm:rounded-xl" />
                <button onClick={() => setTour(true)} className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#0B132B] shadow-lg backdrop-blur transition-transform hover:scale-105">
                  <Play size={16} weight="fill" className="text-[#C5A059]" /> 3D Virtual Tour
                </button>
                <span className="absolute right-4 top-4 rounded-full bg-[#0B132B]/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {p.listingType === "for-rent" ? "For Rent" : p.listingType === "commercial" ? "Commercial" : "For Sale"}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto p-4 sm:p-0 sm:pt-3">
                {p.images.map((im, i) => (
                  <button key={i} onClick={() => setActive(i)} className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${active === i ? "border-[#D4AF37]" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    <img src={im} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="space-y-6 p-4 sm:p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">Guide price</p>
                    <p className="font-serif text-3xl font-semibold text-[#0B132B]">{formatPrice(p.priceNgn, p.priceUsd, store.currency, p.listingType)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Star size={16} weight="fill" className="text-[#D4AF37]" /> {p.views.toLocaleString()} views · Listed {p.listedDaysAgo}d ago
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <SpecTile icon={<House size={18} />} label="Beds" value={p.bedrooms ? String(p.bedrooms) : "—"} />
                  <SpecTile icon={<Bathtub size={18} />} label="Baths" value={String(p.bathrooms)} />
                  <SpecTile icon={<Ruler size={18} />} label="Area" value={`${p.areaSqm} m²`} />
                  <SpecTile icon={<Car size={18} />} label="Parking" value={String(p.parkingSpaces)} />
                </div>

                <div>
                  <h3 className="font-serif text-lg text-[#0B132B]">About this property</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
                    <span>Type: <b className="text-slate-700">{p.propertyType}</b></span>
                    <span>Year built: <b className="text-slate-700">{p.yearBuilt}</b></span>
                    <span>State: <b className="text-slate-700">{p.location.state}</b></span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg text-[#0B132B]">Amenities & Security</h3>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {p.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-700">
                        <Check size={15} weight="bold" className="text-[#C5A059]" /> {a}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg text-[#0B132B]">Floor Plan</h3>
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    <img src={p.floorPlanUrl} alt="Floor plan" className="h-64 w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            <aside className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-6 lg:col-span-1 lg:border-l lg:border-t-0">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={agent.photo} alt={agent.name} className="h-14 w-14 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#0B132B]">{agent.name}</p>
                    <p className="truncate text-xs text-slate-500">{agent.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Star size={12} weight="fill" className="text-[#D4AF37]" /> {agent.rating} · {agent.reviewCount} reviews</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-medium text-slate-700 hover:border-[#D4AF37]"><Phone size={16} /> Call</a>
                  <a href={whatsappLink(`Hello ${agent.name}, I'm interested in "${p.title}".`)} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 rounded-xl bg-[#25D366] py-2.5 text-xs font-semibold text-white hover:opacity-90"><WhatsappLogo size={16} weight="fill" /> Chat</a>
                  <a href={`mailto:${agent.email}`} className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-medium text-slate-700 hover:border-[#D4AF37]"><EnvelopeSimple size={16} /> Email</a>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base text-[#0B132B]">Schedule a Viewing</h3>
                  <ShieldCheck size={18} className="text-[#C5A059]" />
                </div>
                {sent ? (
                  <div className="mt-4 flex flex-col items-center gap-2 rounded-xl bg-emerald-50 py-8 text-center">
                    <CheckCircle size={34} className="text-emerald-500" weight="fill" />
                    <p className="font-semibold text-[#0B132B]">Request received</p>
                    <p className="px-4 text-sm text-slate-500">{agent.name} will confirm your private tour of {p.location.neighborhood} shortly.</p>
                    <button onClick={() => setSent(false)} className="mt-1 text-xs font-semibold text-[#C5A059] hover:underline">Send another</button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="mt-3 space-y-2.5">
                    <input className={inputCls} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <input className={inputCls} type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <input className={inputCls} placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <div className="relative">
                      <input className={inputCls} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                      <Calendar size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    <textarea className={inputCls} rows={3} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B132B] py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95">
                      <ChatCircle size={16} /> Request Private Tour
                    </button>
                    <p className="text-center text-[11px] text-slate-400">No obligation · Verified advisor · {formatFullPrice(p.priceNgn, "NGN")}</p>
                  </form>
                )}
              </div>
            </aside>
          </div>

          <AnimatePresence>
            {tour && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex flex-col bg-[#0B132B]">
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="text-sm font-semibold text-white">3D Virtual Tour · {p.title}</p>
                  <button onClick={() => setTour(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white"><X size={16} /></button>
                </div>
                <div className="relative flex-1">
                  <iframe title="virtual-tour" src={p.virtualTourUrl} className="h-full w-full" allow="fullscreen" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-[#0B132B] to-transparent p-4 text-center text-xs text-white/70">
                    Interactive walkthrough — drag to explore every room of this {p.propertyType.toLowerCase()}.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
