import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { ARTISANS, formatINR } from '../data/artisans';
import { Artisan, BookingDraft, CityName } from '../types/atelier';
import { ResilientImage } from './ResilientImage';

interface ArtistProfileScreenProps {
  artisanId: string;
  onSelectArtisan: (artisanId: string) => void;
  onBack: () => void;
  onProceedToCheckout: (draft: BookingDraft) => void;
}

const MUHURTHAM_SLOTS = [
  '04:30 AM – 08:00 AM (Dawn Muhurtham)',
  '06:00 AM – 09:30 AM (Morning Muhurtham)',
  '10:30 AM – 02:00 PM (Midday Oonjal)',
  '04:30 PM – 08:30 PM (Evening Reception)',
];

const CITIES: Exclude<CityName, 'All Cities'>[] = [
  'Chennai',
  'Bengaluru',
  'Hyderabad',
  'Kochi',
  'Coimbatore',
];

export const ArtistProfileScreen: React.FC<ArtistProfileScreenProps> = ({
  artisanId,
  onSelectArtisan,
  onBack,
  onProceedToCheckout,
}) => {
  const artisan: Artisan = useMemo(
    () => ARTISANS.find((a) => a.id === artisanId) || ARTISANS[0],
    [artisanId]
  );

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedPkgId, setSelectedPkgId] = useState(artisan.packages[0].id);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [eventDate, setEventDate] = useState('2026-11-24');
  const [muhurthamSlot, setMuhurthamSlot] = useState(MUHURTHAM_SLOTS[0]);
  const [city, setCity] = useState<Exclude<CityName, 'All Cities'>>(artisan.city);
  const [venueAddress, setVenueAddress] = useState(
    artisan.city === 'Chennai'
      ? 'MRC Nagar Mandapam, Mylapore, Chennai'
      : artisan.city === 'Bengaluru'
        ? 'The Leela Palace Ballroom, Indiranagar, Bengaluru'
        : artisan.city === 'Kochi'
          ? 'Bolgatty Palace Heritage Pavilion, Kochi'
          : artisan.city === 'Hyderabad'
            ? 'Jubilee Hills Convention Lawn, Hyderabad'
            : 'Residency Towers Grand Hall, Coimbatore'
  );

  // Sync package and default city when switching artisans
  React.useEffect(() => {
    setActiveImageIdx(0);
    setSelectedPkgId(artisan.packages[0].id);
    setSelectedAddOnIds([]);
    setCity(artisan.city);
  }, [artisan]);

  const selectedPackage =
    artisan.packages.find((p) => p.id === selectedPkgId) || artisan.packages[0];

  const selectedAddOns = artisan.addOns.filter((a) => selectedAddOnIds.includes(a.id));

  const addOnTotal = selectedAddOns.reduce((sum, item) => sum + item.priceInr, 0);
  const totalInr = selectedPackage.priceInr + addOnTotal;

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToCheckout({
      artisanId: artisan.id,
      packageId: selectedPackage.id,
      selectedAddOnIds,
      eventDate,
      muhurthamSlot,
      city,
      venueAddress: venueAddress.trim() || `${artisan.neighborhood}, ${city}`,
      clientName: '',
      clientPhone: '',
      paymentMethod: 'upi',
    });
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-14 py-8 lg:py-12">
      {/* Top Switcher & Back */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E2F2]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2E165B] hover:text-[#180040] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </button>

        {/* Quick Artisan Roster Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {ARTISANS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelectArtisan(a.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                a.id === artisan.id
                  ? 'bg-[#2E165B] text-white'
                  : 'bg-white border border-[#E8E2F2] text-[#5E5570] hover:text-[#181226]'
              }`}
            >
              {a.name.split(' ')[0]} · {a.city}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Editorial Atelier + Contiguous Booking Configurator */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left 7 Cols: Portfolio Gallery, Bio, Kit & Reviews */}
        <div className="lg:col-span-7 space-y-10">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-[#E8E2F2] bg-[#EFE4FF]">
              <ResilientImage
                src={artisan.galleryImages[activeImageIdx] || artisan.heroImage}
                alt={`${artisan.name} portfolio frame ${activeImageIdx + 1}`}
                fallbackTitle={artisan.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {artisan.galleryImages.map((img, idx) => (
                <button
                  key={`${artisan.id}-thumb-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx
                      ? 'border-[#D4AF37] shadow-md'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <ResilientImage
                    src={img}
                    alt={`${artisan.name} work sample ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Artisan Header & Credentials */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5E5570]">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#2E165B]">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                Verified Ki Ai Pro
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {artisan.city}, {artisan.neighborhood}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{artisan.experienceYears} years experience</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#181226] tabular-nums">
                <Star className="w-3.5 h-3.5 text-[#D4AF37]" fill="#D4AF37" />
                {artisan.rating.toFixed(2)} ({artisan.reviewCount} weddings)
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#181226]">
              {artisan.name}
            </h1>
            <p className="text-base font-medium text-[#2E165B]">{artisan.specialty}</p>
            <p className="text-sm sm:text-base text-[#494550] leading-relaxed">{artisan.bio}</p>

            {/* Kit & Dispatch Info */}
            <div className="pt-4 border-t border-[#E8E2F2] grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#735C00]">
                  Sterile Bridal Kit
                </p>
                <p className="text-sm text-[#181226] mt-1">{artisan.signatureKit}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#735C00]">
                  On-Demand Dispatch
                </p>
                <p className="text-sm text-[#181226] mt-1">
                  Arrives in ~{artisan.dispatchMinutes} mins · {artisan.vehicleInfo}
                </p>
              </div>
            </div>
          </div>

          {/* Client Wedding Testimonials */}
          <div className="pt-6 border-t border-[#E8E2F2] space-y-5">
            <h2 className="font-display text-2xl font-semibold text-[#181226]">
              South Indian Bride Reviews
            </h2>
            <div className="space-y-4">
              {artisan.reviews.map((rev) => (
                <div key={rev.id} className="card-resting rounded-2xl p-6 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#181226]">{rev.brideName}</p>
                      <p className="text-xs text-[#5E5570]">{rev.weddingContext}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#181226] tabular-nums">
                      <Star className="w-3.5 h-3.5 text-[#D4AF37]" fill="#D4AF37" />
                      {rev.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-[#494550] leading-relaxed">“{rev.comment}”</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Sticky Contiguous INR Booking Configurator */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <form onSubmit={handleCheckout} className="card-resting rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#E8E2F2]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#735C00]">
                  Direct Atelier Booking
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#181226] mt-0.5">
                  Configure Ceremony
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#2E165B] bg-[#F4EAFF] px-3 py-1.5 rounded-full whitespace-nowrap">
                0% Commission
              </span>
            </div>

            {/* Package Selection */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5E5570]">
                1. Select Bridal Package
              </p>
              <div className="space-y-3">
                {artisan.packages.map((pkg) => {
                  const active = pkg.id === selectedPackage.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        active
                          ? 'card-gold-active'
                          : 'bg-[#F8F6FC]/60 border-[#E8E2F2] hover:border-[#2E165B]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#181226]">{pkg.name}</p>
                          <p className="text-xs text-[#5E5570] mt-0.5">
                            {pkg.ritual} · {pkg.duration}
                          </p>
                        </div>
                        <p className="text-base font-bold text-[#2E165B] tabular-nums shrink-0">
                          {formatINR(pkg.priceInr)}
                        </p>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {pkg.includes.map((line) => (
                          <li key={line} className="flex items-start gap-2 text-xs text-[#494550]">
                            <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add-ons */}
            {artisan.addOns.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5E5570]">
                  2. Ritual Add-Ons (Optional)
                </p>
                <div className="space-y-2.5">
                  {artisan.addOns.map((addOn) => {
                    const checked = selectedAddOnIds.includes(addOn.id);
                    return (
                      <label
                        key={addOn.id}
                        className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                          checked
                            ? 'bg-[#FEF7FF] border-[#D4AF37]'
                            : 'bg-white border-[#E8E2F2] hover:bg-[#F8F6FC]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAddOn(addOn.id)}
                            className="mt-1 w-4 h-4 accent-[#2E165B] cursor-pointer"
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#181226]">{addOn.label}</p>
                            <p className="text-[11px] text-[#5E5570] mt-0.5">{addOn.note}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#2E165B] tabular-nums shrink-0">
                          +{formatINR(addOn.priceInr)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Date, Muhurtham Slot & Mandapam Venue */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5E5570]">
                3. Muhurtham Schedule &amp; Venue
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-[#5E5570] flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5" /> Event Date
                  </span>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#E8E2F2] bg-white text-sm text-[#181226] focus:outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-medium text-[#5E5570] flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5" /> City
                  </span>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as Exclude<CityName, 'All Cities'>)}
                    className="w-full h-11 px-3 rounded-xl border border-[#E8E2F2] bg-white text-sm text-[#181226] focus:outline-none focus:border-[#D4AF37]"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-[#5E5570] flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5" /> Muhurtham Arrival Slot
                </span>
                <select
                  value={muhurthamSlot}
                  onChange={(e) => setMuhurthamSlot(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#E8E2F2] bg-white text-sm text-[#181226] focus:outline-none focus:border-[#D4AF37]"
                >
                  {MUHURTHAM_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-medium text-[#5E5570] mb-1 block">
                  Mandapam / Bridal Suite Address
                </span>
                <input
                  type="text"
                  required
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="Enter temple, mandapam, or hotel suite"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E2F2] bg-white text-sm text-[#181226] focus:outline-none focus:border-[#D4AF37]"
                />
              </label>
            </div>

            {/* Transparent INR Summary */}
            <div className="pt-4 border-t border-[#E8E2F2] space-y-2 text-sm">
              <div className="flex items-center justify-between text-[#5E5570]">
                <span>Direct Artist Payout (100%)</span>
                <span className="font-semibold text-[#181226] tabular-nums">
                  {formatINR(selectedPackage.priceInr)}
                </span>
              </div>
              {addOnTotal > 0 && (
                <div className="flex items-center justify-between text-[#5E5570]">
                  <span>Selected Ritual Add-Ons ({selectedAddOns.length})</span>
                  <span className="font-semibold text-[#181226] tabular-nums">
                    {formatINR(addOnTotal)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-[#5E5570]">
                <span>Ki Ai Platform Commission</span>
                <span className="font-semibold text-[#2E165B] tabular-nums">₹0</span>
              </div>
              <div className="pt-3 border-t border-[#E8E2F2] flex items-center justify-between">
                <span className="font-semibold text-[#181226]">Total Payable</span>
                <span className="font-display text-2xl font-semibold text-[#2E165B] tabular-nums">
                  {formatINR(totalInr)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full text-sm font-semibold gold-cta cursor-pointer"
            >
              Proceed to OTP &amp; Dispatch
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
};
