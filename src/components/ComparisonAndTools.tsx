import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  X, Check, CheckCircle, ArrowsLeftRight, MapPin,
  Phone, WhatsappLogo, EnvelopeSimple, Star, Plus, ShieldCheck,
  Sparkle, ArrowRight, CaretDown,
} from "@phosphor-icons/react";
import type { AppState, Property } from "../types";
import {
  NEIGHBORHOODS, AGENTS, PROPERTIES, formatPrice, whatsappLink,
  CONTACT_PHONE,
} from "../data/mockData";

const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20";

/* ---------------- Mortgage Calculator ---------------- */
export function MortgageCalculator() {
  const [price, setPrice] = useState(385_000_000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(18);
  const [years, setYears] = useState(15);

  const { monthly, totalInterest, principal, interestPct } = useMemo(() => {
    const principalAmt = price * (1 - downPct / 100);
    const n = years * 12;
    const r = rate / 100 / 12;
    const m = r === 0 ? principalAmt / n : (principalAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = m * n;
    const interest = total - principalAmt;
    return { monthly: m, totalInterest: interest, principal: principalAmt, interestPct: total > 0 ? (interest / total) * 100 : 0 };
  }, [price, downPct, rate, years]);

  const fmt = (v: number) => `₦${Math.round(v).toLocaleString("en-US")}`;

  return (
    <section id="calculator" className="scroll-mt-20 bg-[#0B132B] py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Financing</span>
          <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">Mortgage & Affordability Calculator</h2>
          <p className="mt-3 max-w-md text-white/60">Model your monthly repayment across Nigerian lending rates before you commit to a viewing.</p>

          <div className="mt-8 space-y-5">
            <Slider label="Property Price" value={fmt(price)} min={20_000_000} max={2_850_000_000} step={5_000_000} v={price} onChange={setPrice} />
            <Slider label="Down Payment" value={`${downPct}%`} min={5} max={80} step={1} v={downPct} onChange={setDownPct} />
            <Slider label="Annual Interest Rate" value={`${rate}%`} min={8} max={30} step={0.5} v={rate} onChange={setRate} />
            <Slider label="Loan Tenure" value={`${years} yrs`} min={1} max={30} step={1} v={years} onChange={setYears} />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm text-white/60">Estimated Monthly Repayment</p>
          <p className="mt-1 font-serif text-4xl font-semibold text-[#D4AF37] sm:text-5xl">{fmt(monthly)}</p>
          <div className="mt-6 space-y-3 text-sm">
            <Line label="Loan Principal" value={fmt(principal)} />
            <Line label="Total Interest" value={fmt(totalInterest)} />
            <Line label="Total Repayment" value={fmt(principal + totalInterest)} />
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xs text-white/60"><span>Principal {100 - Math.round(interestPct)}%</span><span>Interest {Math.round(interestPct)}%</span></div>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-white/10">
              <div className="bg-[#D4AF37]" style={{ width: `${100 - interestPct}%` }} />
              <div className="bg-white/30" style={{ width: `${interestPct}%` }} />
            </div>
          </div>
          <a href={whatsappLink("Hello, I'd like to discuss mortgage options for a PrimeNest property.")} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0B132B] transition-transform hover:scale-[1.02] active:scale-95">
            <WhatsappLogo size={16} weight="fill" /> Speak to a Financing Advisor
          </a>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, min, max, step, v, onChange }: { label: string; value: string; min: number; max: number; step: number; v: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm"><span className="text-white/70">{label}</span><span className="font-semibold text-white">{value}</span></div>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-[#D4AF37]" />
    </div>
  );
}
function Line({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-white/10 pb-2"><span className="text-white/60">{label}</span><span className="font-semibold text-white">{value}</span></div>;
}

/* ---------------- Neighborhoods ---------------- */
export function Neighborhoods() {
  return (
    <section id="neighborhoods" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C5A059]">Where to Live</span>
          <h2 className="mt-1 font-serif text-3xl text-[#0B132B] sm:text-4xl">Explore Prime Districts</h2>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {NEIGHBORHOODS.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-44 overflow-hidden">
              <img src={n.image} alt={n.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/80 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-serif text-xl text-white">{n.name}</h3>
                <p className="flex items-center gap-1 text-xs text-white/70"><MapPin size={12} /> {n.city}, {n.state}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="line-clamp-2 text-sm text-slate-500">{n.description}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Score label="Safety" v={n.safetyScore} />
                <Score label="Schools" v={n.schoolRating} />
                <Score label="Dining" v={n.diningScore} />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="text-slate-500">Avg. from</span>
                <span className="font-serif text-sm font-semibold text-[#0B132B]">{formatPrice(n.avgPriceBuyNgn, Math.round(n.avgPriceBuyNgn / 1500), "NGN", "for-sale")}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
function Score({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-lg bg-slate-50 py-2">
      <div className="font-serif text-lg font-semibold text-[#0B132B]">{v}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}

/* ---------------- Agents ---------------- */
export function Agents() {
  return (
    <section id="agents" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C5A059]">White-Glove Advisory</span>
        <h2 className="mt-1 font-serif text-3xl text-[#0B132B] sm:text-4xl">Meet Your Agents</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((a) => (
            <div key={a.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img src={a.photo} alt={a.name} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-[#0B132B] backdrop-blur"><Star size={12} weight="fill" className="text-[#D4AF37]" /> {a.rating}</span>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-[#0B132B]">{a.name}</h3>
                <p className="text-xs text-slate-500">{a.title}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {a.specialties.map((s) => <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">{s}</span>)}
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500">{a.bio}</p>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="grid place-items-center rounded-lg border border-slate-200 py-2 text-slate-600 hover:border-[#D4AF37]"><Phone size={15} /></a>
                  <a href={whatsappLink(`Hello ${a.name}, I'd like to speak with you.`)} target="_blank" rel="noreferrer" className="grid place-items-center rounded-lg bg-[#25D366] py-2 text-white hover:opacity-90"><WhatsappLogo size={15} weight="fill" /></a>
                  <a href={`mailto:${a.email}`} className="grid place-items-center rounded-lg border border-slate-200 py-2 text-slate-600 hover:border-[#D4AF37]"><EnvelopeSimple size={15} /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Comparison Drawer ---------------- */
export function ComparisonDrawer({ store, open, onClose }: { store: AppState; open: boolean; onClose: () => void }) {
  const items = PROPERTIES.filter((p) => store.comparison.includes(p.id));
  const rows: { label: string; render: (p: Property) => React.ReactNode }[] = [
    { label: "Price", render: (p) => <span className="font-serif font-semibold text-[#0B132B]">{formatPrice(p.priceNgn, p.priceUsd, store.currency, p.listingType)}</span> },
    { label: "Location", render: (p) => `${p.location.neighborhood}, ${p.location.city}` },
    { label: "Type", render: (p) => p.propertyType },
    { label: "Bedrooms", render: (p) => (p.bedrooms ? String(p.bedrooms) : "—") },
    { label: "Bathrooms", render: (p) => String(p.bathrooms) },
    { label: "Area", render: (p) => `${p.areaSqm} m²` },
    { label: "Parking", render: (p) => String(p.parkingSpaces) },
    { label: "Year Built", render: (p) => String(p.yearBuilt) },
    { label: "Amenities", render: (p) => `${p.amenities.length} listed` },
  ];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/40" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }} className="fixed right-0 top-0 z-50 flex h-full w-full max-w-4xl flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="flex items-center gap-2 font-serif text-lg text-[#0B132B]"><ArrowsLeftRight size={18} className="text-[#C5A059]" /> Compare Properties ({items.length})</h3>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                  <ArrowsLeftRight size={40} />
                  <p className="mt-3 font-serif text-lg text-[#0B132B]">Nothing to compare yet</p>
                  <p className="text-sm">Tap the compare icon on any property to add it here.</p>
                </div>
              ) : (
                <div className="min-w-full">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="w-32 text-left align-bottom pb-3 text-xs uppercase tracking-wider text-slate-400">Attribute</th>
                        {items.map((p) => (
                          <th key={p.id} className="p-2 align-bottom text-left">
                            <div className="relative">
                              <img src={p.images[0]} alt={p.title} className="h-28 w-full rounded-lg object-cover" />
                              <button onClick={() => store.toggleCompare(p.id)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-slate-600 shadow"><X size={12} /></button>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm font-semibold text-[#0B132B]">{p.title}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.label} className="border-t border-slate-100">
                          <td className="py-3 pr-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{r.label}</td>
                          {items.map((p) => <td key={p.id} className="p-2 text-sm text-slate-700">{r.render(p)}</td>)}
                        </tr>
                      ))}
                      <tr className="border-t border-slate-100">
                        <td className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Action</td>
                        {items.map((p) => (
                          <td key={p.id} className="p-2">
                            <button onClick={() => { onClose(); store.openDetails(p.id); }} className="inline-flex items-center gap-1 rounded-lg bg-[#0B132B] px-3 py-1.5 text-xs font-semibold text-white">View <ArrowRight size={12} /></button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- List Property Modal ---------------- */
export function ListPropertyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [f, setF] = useState({ title: "", type: "Detached Duplex", city: "Lekki", price: "", beds: "4", baths: "4", area: "400", name: "", email: "", phone: "" });

  const reset = () => { setStep(0); setDone(false); setConfirm(false); };
  const close = () => { onClose(); setTimeout(reset, 300); };
  const next = () => setStep((s) => Math.min(s + 1, 1));

  const submit = () => {
    setConfirm(true);
  };
  const confirmSubmit = () => {
    setConfirm(false);
    setDone(true);
    toast.success("Listing submitted — an advisor will call you within 24 hours.");
  };

  const fields = [
    { k: "title", ph: "Property title (e.g. Luxury Duplex, Lekki)" },
    { k: "price", ph: "Asking price in ₦" },
    { k: "name", ph: "Your full name" },
    { k: "email", ph: "Email address" },
    { k: "phone", ph: "Phone number" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[60] bg-[#0B132B]/70 backdrop-blur-sm" />
          <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
            <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} className="relative my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h3 className="flex items-center gap-2 font-serif text-lg text-[#0B132B]"><Sparkle size={16} className="text-[#C5A059]" /> {done ? "Submission Received" : "List Your Property"}</h3>
                <button onClick={close} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600"><X size={16} /></button>
              </div>

              {done ? (
                <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                  <CheckCircle size={52} weight="fill" className="text-emerald-500" />
                  <p className="font-serif text-xl text-[#0B132B]">Thank you, {f.name || "valued owner"}.</p>
                  <p className="max-w-sm text-sm text-slate-500">Your listing for <b>{f.title || "your property"}</b> is in review. A PrimeNest advisor will contact you on {f.phone || CONTACT_PHONE} within 24 hours to arrange a professional shoot.</p>
                  <button onClick={close} className="mt-2 rounded-full bg-[#0B132B] px-6 py-2.5 text-sm font-semibold text-white">Done</button>
                </div>
              ) : (
                <div className="p-5">
                  <div className="mb-5 flex items-center gap-2">
                    {[0, 1].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? "bg-[#D4AF37]" : "bg-slate-200"}`} />
                    ))}
                  </div>
                  <div className="space-y-3">
                    {step === 0 ? (
                      <>
                        <input className={inputCls} placeholder="Property title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
                        <div className="grid grid-cols-2 gap-3">
                          <SelectBox value={f.type} onChange={(v) => setF({ ...f, type: v })} options={["Detached Duplex", "Semi-Detached Duplex", "Terrace Duplex", "Penthouse", "Detached Villa", "Detached Mansion", "Apartment", "Office Tower", "Retail Complex"]} />
                          <SelectBox value={f.city} onChange={(v) => setF({ ...f, city: v })} options={["Ikoyi", "Lekki", "Victoria Island", "Eko Atlantic", "Ikeja", "Abuja"]} />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <input className={inputCls} placeholder="Beds" type="number" value={f.beds} onChange={(e) => setF({ ...f, beds: e.target.value })} />
                          <input className={inputCls} placeholder="Baths" type="number" value={f.baths} onChange={(e) => setF({ ...f, baths: e.target.value })} />
                          <input className={inputCls} placeholder="Area m²" type="number" value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })} />
                        </div>
                        <input className={inputCls} placeholder="Asking price in ₦" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} />
                      </>
                    ) : (
                      <>
                        <input className={inputCls} placeholder="Your full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                        <input className={inputCls} type="email" placeholder="Email address" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
                        <input className={inputCls} placeholder="Phone number" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
                        <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#C5A059]" /> Your details are confidential. We verify every listing before it goes live.</div>
                      </>
                    )}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <button onClick={() => (step === 0 ? close() : setStep(0))} className="text-sm font-medium text-slate-500 hover:text-slate-700">{step === 0 ? "Cancel" : "Back"}</button>
                    {step === 0 ? (
                      <button onClick={next} className="inline-flex items-center gap-1.5 rounded-full bg-[#0B132B] px-5 py-2.5 text-sm font-semibold text-white">Continue <ArrowRight size={14} /></button>
                    ) : (
                      <button onClick={submit} className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#0B132B]"><Plus size={14} weight="bold" /> Submit Listing</button>
                    )}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {confirm && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 p-6 backdrop-blur">
                    <div className="max-w-sm text-center">
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#D4AF37]/15 text-[#C5A059]"><Check size={22} weight="bold" /></div>
                      <p className="mt-3 font-serif text-lg text-[#0B132B]">Confirm submission?</p>
                      <p className="mt-1 text-sm text-slate-500">You're listing <b>{f.title || "your property"}</b> in {f.city}. Our team will reach out to {f.phone || "your number"}.</p>
                      <div className="mt-5 flex justify-center gap-2">
                        <button onClick={() => setConfirm(false)} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600">Edit</button>
                        <button onClick={confirmSubmit} className="rounded-full bg-[#0B132B] px-5 py-2 text-sm font-semibold text-white">Confirm</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function SelectBox({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} appearance-none pr-9`}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <CaretDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  );
}