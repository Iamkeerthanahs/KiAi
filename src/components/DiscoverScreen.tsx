import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Check,
  MapPin,
  Search,
  ShieldCheck,
  Star,
} from 'lucide-react';
import {
  ARTISANS,
  CEREMONY_RATE_GUIDE,
  HERO_BRIDE_IMAGE,
  formatINR,
} from '../data/artisans';
import { Artisan, CityName, ServiceCategory } from '../types/atelier';
import { ResilientImage } from './ResilientImage';

interface DiscoverScreenProps {
  selectedCity: CityName;
  onSelectCity: (city: CityName) => void;
  onInspectArtisan: (artisanId: string) => void;
  onQuickBookArtisan: (artisanId: string) => void;
  savedArtisanIds: string[];
  onToggleSaveArtisan: (artisanId: string) => void;
}

const CITIES: CityName[] = [
  'All Cities',
  'Chennai',
  'Bengaluru',
  'Hyderabad',
  'Kochi',
  'Coimbatore',
];

const CATEGORIES: ServiceCategory[] = [
  'All',
  'Muhurtham Makeup',
  'Kanjeevaram & Jadai',
  'Mandapam Photography',
  'Bridal Mehndi',
];

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  selectedCity,
  onSelectCity,
  onInspectArtisan,
  onQuickBookArtisan,
  savedArtisanIds,
  onToggleSaveArtisan,
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtisans = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ARTISANS.filter((artist) => {
      const cityMatch = selectedCity === 'All Cities' || artist.city === selectedCity;
      const catMatch = activeCategory === 'All' || artist.category === activeCategory;
      const queryMatch =
        !q ||
        artist.name.toLowerCase().includes(q) ||
        artist.specialty.toLowerCase().includes(q) ||
        artist.neighborhood.toLowerCase().includes(q) ||
        artist.city.toLowerCase().includes(q);
      return cityMatch && catMatch && queryMatch;
    });
  }, [selectedCity, activeCategory, searchQuery]);

  const scrollToCatalog = () => {
    const el = document.getElementById('artisan-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-16">
      {/* Editorial Hero Split */}
      <section className="bg-[#2E165B] text-white border-b border-[#180040]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-14 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Copy & Instant Search */}
            <div className="lg:col-span-7 flex flex-col justify-between py-2">
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#E5C358] mb-4">
                  Chennai · Bengaluru · Hyderabad · Kochi · Coimbatore
                </p>
                <h1 className="font-display text-[2.1rem] sm:text-[2.85rem] lg:text-[3.25rem] font-semibold leading-[1.12] tracking-[-0.02em] text-white [text-wrap:balance]">
                  South Indian bridal artisans, dispatched on demand.
                </h1>
                <p className="mt-5 text-base sm:text-lg text-[#EADDFF] max-w-2xl leading-relaxed">
                  Direct zero-commission bookings with verified Muhurtham makeup artists,
                  Kanjeevaram &amp; Poola Jadai stylists, and mandapam photographers—priced
                  transparently in Indian Rupees with live arrival tracking.
                </p>
              </div>

              {/* Search & City Bar */}
              <div className="mt-8 bg-[#FFFFFF] text-[#181226] rounded-2xl p-3 sm:p-4 shadow-xl border border-[#E8E2F2]">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5 relative">
                    <MapPin className="w-4 h-4 text-[#5E5570] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      aria-label="Filter by South Indian city"
                      value={selectedCity}
                      onChange={(e) => onSelectCity(e.target.value as CityName)}
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E8E2F2] bg-[#F8F6FC] text-sm font-semibold text-[#181226] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 cursor-pointer"
                    >
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-7 relative">
                    <Search className="w-4 h-4 text-[#5E5570] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Kanjeevaram, Mallipoo, Mylapore..."
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E8E2F2] bg-white text-sm text-[#181226] placeholder:text-[#7A7581] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                    />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#E8E2F2] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5E5570]">
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#181226]">
                      <Check className="w-3.5 h-3.5 text-[#735C00]" />
                      100% artist payout
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Instant 4-digit OTP dispatch</span>
                    <span aria-hidden="true">·</span>
                    <span>UPI &amp; card accepted</span>
                  </div>

                  <button
                    type="button"
                    onClick={scrollToCatalog}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold gold-cta whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Explore Artisans</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right South Indian Bridal Editorial Portrait */}
            <div className="lg:col-span-5">
              <div className="relative h-80 sm:h-96 lg:h-full min-h-[380px] rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl">
                <ResilientImage
                  src={HERO_BRIDE_IMAGE}
                  alt="South Indian bride in crimson Kanjeevaram silk saree and temple gold jewellery inside Chettinad courtyard mandapam"
                  fallbackTitle="South Indian Muhurtham Atelier"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#180040]/90 via-[#180040]/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#E5C358]">
                      Muhurtham Featured Look
                    </p>
                    <p className="font-display text-xl text-white mt-0.5">
                      Chettinad Silk &amp; Kemp Temple Suite
                    </p>
                    <p className="text-xs text-[#EADDFF] mt-1">
                      Mylapore &amp; Indiranagar · From <span className="tabular-nums font-semibold">₹24,000</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onInspectArtisan('ananya-subramanian')}
                    className="px-4 py-2 rounded-full bg-white/95 text-[#180040] text-xs font-semibold hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    View Look
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Full-Width Transparency Strip */}
      <section className="bg-[#FFFFFF] border-b border-[#E8E2F2]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-14 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="space-y-1">
              <p className="font-display text-2xl font-semibold text-[#2E165B] tabular-nums">
                ₹0 Commission
              </p>
              <p className="text-xs text-[#5E5570]">
                100% of every Rupee goes directly to your bridal artisan
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-display text-2xl font-semibold text-[#2E165B] tabular-nums">
                25–45 mins
              </p>
              <p className="text-xs text-[#5E5570]">
                On-demand dawn arrival for early 5:30 AM Muhurthams
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-display text-2xl font-semibold text-[#2E165B]">
                Verified Pro Kits
              </p>
              <p className="text-xs text-[#5E5570]">
                UV-sterilized vanity, steam silk press &amp; chilled Mallipoo
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-display text-2xl font-semibold text-[#2E165B]">
                Live GPS Radar
              </p>
              <p className="text-xs text-[#5E5570]">
                Track your makeup or draping team en route to the mandapam
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Artisans Catalog */}
      <section id="artisan-catalog" className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-14 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8E2F2]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#735C00]">
              Curated Roster
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#181226] mt-1">
              Verified Bridal Artisans
            </h2>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Service categories">
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2E165B] text-white'
                      : 'bg-white text-[#5E5570] border border-[#E8E2F2] hover:border-[#2E165B]/40 hover:text-[#181226]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Artisan Cards Grid */}
        {filteredArtisans.length === 0 ? (
          <div className="mt-10 card-resting rounded-3xl p-12 text-center">
            <p className="font-display text-2xl text-[#181226]">
              No artisans match “{searchQuery || selectedCity}”
            </p>
            <p className="text-sm text-[#5E5570] mt-2">
              Try clearing your search or viewing artisans across all South Indian cities.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                onSelectCity('All Cities');
              }}
              className="mt-6 px-6 py-2.5 rounded-full text-sm font-semibold bg-[#2E165B] text-white hover:bg-[#180040] cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtisans.map((artisan: Artisan) => {
              const isSaved = savedArtisanIds.includes(artisan.id);
              return (
                <article
                  key={artisan.id}
                  className="card-resting rounded-3xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {/* 4:5 Portrait Media Area */}
                  <div className="relative aspect-[4/5] bg-[#EFE4FF] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onInspectArtisan(artisan.id)}
                      className="w-full h-full block text-left cursor-pointer"
                    >
                      <ResilientImage
                        src={artisan.heroImage}
                        alt={`${artisan.name} — ${artisan.specialty}`}
                        fallbackTitle={artisan.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                      />
                    </button>

                    {/* Single measured scrim at bottom for rating + dispatch */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#180040]/85 via-[#180040]/35 to-transparent" />

                    {/* Top-right save bookmark button (functional affordance) */}
                    <button
                      type="button"
                      onClick={() => onToggleSaveArtisan(artisan.id)}
                      aria-label={isSaved ? `Remove ${artisan.name} from saved` : `Save ${artisan.name}`}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-[#181226]'
                          : 'bg-white/90 border-[#E8E2F2] text-[#2E165B] hover:bg-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                    </button>

                    {/* Bottom overlay clean text */}
                    <div className="pointer-events-none absolute bottom-4 left-5 right-5 flex items-center justify-between text-white">
                      <span className="text-xs font-medium text-[#FFE088]">
                        Available Today · {artisan.dispatchMinutes}m dispatch
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums">
                        <Star className="w-3.5 h-3.5 text-[#E5C358]" fill="#E5C358" />
                        {artisan.rating.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body — Clean Unboxed Metadata */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-[#5E5570]">
                        <span>
                          {artisan.city} · {artisan.neighborhood}
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-[#2E165B]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                          Verified Pro
                        </span>
                      </div>

                      <h3 className="font-display text-2xl font-semibold text-[#181226] mt-2">
                        <button
                          type="button"
                          onClick={() => onInspectArtisan(artisan.id)}
                          className="text-left hover:text-[#2E165B] transition-colors cursor-pointer"
                        >
                          {artisan.name}
                        </button>
                      </h3>

                      <p className="text-sm text-[#5E5570] mt-1.5 leading-relaxed">
                        {artisan.specialty}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E8E2F2] flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-medium text-[#5E5570]">
                          Starting rate · 0% fee
                        </p>
                        <p className="text-lg font-bold text-[#181226] tabular-nums">
                          {formatINR(artisan.startingPriceInr)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onInspectArtisan(artisan.id)}
                          className="px-4 py-2.5 rounded-full text-xs font-semibold border border-[#E8E2F2] text-[#2E165B] hover:bg-[#F8F6FC] whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Atelier
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickBookArtisan(artisan.id)}
                          className="px-4 py-2.5 rounded-full text-xs font-semibold gold-cta whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Transparent South Indian Ceremony Rate Guide */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-14 mt-16">
        <div className="card-resting rounded-3xl p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E8E2F2]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#735C00]">
                Standardized INR Guide
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#181226] mt-1">
                Transparent South Indian Wedding Rates
              </h2>
            </div>
            <p className="text-sm text-[#5E5570] max-w-md">
              Every rupee quoted includes artist travel within city limits and sterile kit
              preparation—with zero marketplace commission added.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CEREMONY_RATE_GUIDE.map((item) => (
              <div key={item.ritual} className="space-y-2">
                <p className="text-xs text-[#5E5570]">{item.cities}</p>
                <h3 className="font-display text-xl font-semibold text-[#181226]">
                  {item.ritual}
                </h3>
                <p className="text-base font-bold text-[#2E165B] tabular-nums">{item.rangeInr}</p>
                <p className="text-sm text-[#5E5570] leading-relaxed">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
