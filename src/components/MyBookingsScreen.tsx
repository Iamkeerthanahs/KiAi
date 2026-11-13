import React, { useState } from 'react';
import { Calendar, MapPin, Navigation, ShieldCheck, Star } from 'lucide-react';
import { ARTISANS, formatINR } from '../data/artisans';
import { ConfirmedBooking } from '../types/atelier';
import { ResilientImage } from './ResilientImage';

interface MyBookingsScreenProps {
  bookings: ConfirmedBooking[];
  savedArtisanIds: string[];
  onOpenDispatch: (bookingId: string) => void;
  onInspectArtisan: (artisanId: string) => void;
  onExploreDiscover: () => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({
  bookings,
  savedArtisanIds,
  onOpenDispatch,
  onInspectArtisan,
  onExploreDiscover,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'arrived'>('all');

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active') return b.progressStep < 3;
    if (filter === 'arrived') return b.progressStep >= 3;
    return true;
  });

  const savedArtisans = ARTISANS.filter((a) => savedArtisanIds.includes(a.id));
  const totalSavedInr = bookings.reduce((sum, b) => sum + Math.round(b.totalInr * 0.18), 0);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-14 py-8 lg:py-12 space-y-12">
      {/* Header & Commission Savings Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8E2F2]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#735C00]">
            Ceremony Schedule &amp; Receipts
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#181226] mt-1">
            My Bridal Bookings
          </h1>
          <p className="text-sm text-[#5E5570] mt-1">
            Estimated aggregator commission saved via Ki Ai direct booking:{' '}
            <span className="font-bold text-[#2E165B] tabular-nums">
              {formatINR(totalSavedInr)}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: `All (${bookings.length})` },
            { id: 'active', label: 'En Route / Scheduled' },
            { id: 'arrived', label: 'Arrived' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as 'all' | 'active' | 'arrived')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#2E165B] text-white'
                  : 'bg-white border border-[#E8E2F2] text-[#5E5570] hover:text-[#181226]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="card-resting rounded-3xl p-12 text-center space-y-4">
          <h2 className="font-display text-2xl text-[#181226]">No bookings in this view</h2>
          <p className="text-sm text-[#5E5570]">
            Explore our South Indian Muhurtham makeup, Kanjeevaram draping, and photography roster.
          </p>
          <button
            type="button"
            onClick={onExploreDiscover}
            className="px-6 py-3 rounded-full text-sm font-semibold gold-cta cursor-pointer"
          >
            Browse Artisans
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => (
            <article
              key={booking.id}
              className="card-resting rounded-3xl p-6 flex flex-col sm:flex-row gap-5 justify-between"
            >
              <div className="flex gap-4">
                <div className="w-20 h-24 rounded-2xl overflow-hidden bg-[#EFE4FF] shrink-0">
                  <ResilientImage
                    src={booking.artisanImage}
                    alt={booking.artisanName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#5E5570]">
                    <span className="font-semibold text-[#2E165B]">{booking.referenceCode}</span>
                    <span aria-hidden="true">·</span>
                    <span>{booking.status}</span>
                  </div>
                  <h2 className="font-display text-xl font-semibold text-[#181226]">
                    {booking.artisanName}
                  </h2>
                  <p className="text-xs font-medium text-[#2E165B]">{booking.packageName}</p>
                  <div className="pt-1 space-y-1 text-xs text-[#5E5570]">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {booking.eventDate} · {booking.muhurthamSlot}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{booking.venueAddress}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#E8E2F2] shrink-0">
                <div className="text-left sm:text-right">
                  <p className="text-[11px] text-[#5E5570]">Direct Total</p>
                  <p className="font-display text-xl font-semibold text-[#181226] tabular-nums">
                    {formatINR(booking.totalInr)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenDispatch(booking.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold gold-cta whitespace-nowrap cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Live Radar</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Saved Artisans Shelf */}
      <section className="pt-6 border-t border-[#E8E2F2] space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-[#181226]">
            Shortlisted Bridal Artisans
          </h2>
          <button
            type="button"
            onClick={onExploreDiscover}
            className="text-xs font-semibold text-[#2E165B] hover:underline cursor-pointer"
          >
            Discover More
          </button>
        </div>

        {savedArtisans.length === 0 ? (
          <p className="text-sm text-[#5E5570]">
            Bookmark artisans from Discover to compare Muhurtham &amp; Reception rates here.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedArtisans.map((artist) => (
              <button
                key={artist.id}
                type="button"
                onClick={() => onInspectArtisan(artist.id)}
                className="card-resting rounded-2xl p-4 flex items-center gap-4 text-left hover:border-[#D4AF37] transition-colors cursor-pointer"
              >
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#EFE4FF] shrink-0">
                  <ResilientImage
                    src={artist.heroImage}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E165B]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {artist.city}
                  </p>
                  <p className="font-display text-lg font-semibold text-[#181226] truncate">
                    {artist.name}
                  </p>
                  <p className="text-xs text-[#5E5570] flex items-center gap-2 mt-0.5 tabular-nums">
                    <span className="font-semibold text-[#181226]">
                      From {formatINR(artist.startingPriceInr)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-[#D4AF37]" fill="#D4AF37" />
                      {artist.rating.toFixed(2)}
                    </span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
