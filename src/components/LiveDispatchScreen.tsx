import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  MapPin,
  Mic,
  MicOff,
  Navigation,
  Phone,
  PhoneOff,
  Receipt,
  ShieldCheck,
  Volume2,
  X,
} from 'lucide-react';
import { ARTISANS, formatINR } from '../data/artisans';
import { ConfirmedBooking } from '../types/atelier';
import { ResilientImage } from './ResilientImage';

interface LiveDispatchScreenProps {
  bookings: ConfirmedBooking[];
  activeBookingId: string;
  onSelectBooking: (bookingId: string) => void;
  onAdvanceMilestone: (bookingId: string) => void;
}

const MILESTONES = [
  { label: 'Booking Confirmed', detail: '4-digit arrival OTP locked with artisan' },
  { label: 'Kit Sterilized & Packed', detail: 'UV-sanitized vanity & chilled Mallipoo loaded' },
  { label: 'En Route to Mandapam', detail: 'Live radar beacon active on city corridor' },
  { label: 'Arrived at Bridal Suite', detail: 'Ready for OTP handoff & saree drape' },
];

const CITY_LANDMARKS: Record<string, { roadA: string; roadB: string; landmark: string }> = {
  Chennai: {
    roadA: 'Luz Church Rd',
    roadB: 'Kutchery Rd · Mylapore',
    landmark: 'Kapaleeshwarar Tank',
  },
  Bengaluru: {
    roadA: '100 Feet Rd',
    roadB: 'Old Airport Rd · Indiranagar',
    landmark: 'Domlur Corridor',
  },
  Kochi: {
    roadA: 'Princess St',
    roadB: 'Marine Drive Link',
    landmark: 'Vembanad Backwaters',
  },
  Hyderabad: {
    roadA: 'Road No. 36',
    roadB: 'Jubilee Hills Checkpost',
    landmark: 'KBR Park Perimeter',
  },
  Coimbatore: {
    roadA: 'DB Road',
    roadB: 'Avinashi Rd · RS Puram',
    landmark: 'Race Course Pavilion',
  },
};

// Beacon coordinates along the SVG route for steps 0, 1, 2, 3
const ROUTE_POINTS = [
  { x: 130, y: 375 },
  { x: 255, y: 300 },
  { x: 425, y: 205 },
  { x: 585, y: 125 },
];

export const LiveDispatchScreen: React.FC<LiveDispatchScreenProps> = ({
  bookings,
  activeBookingId,
  onSelectBooking,
  onAdvanceMilestone,
}) => {
  const booking = bookings.find((b) => b.id === activeBookingId) || bookings[0];
  const artisan =
    ARTISANS.find((a) => a.id === booking?.artisanId) || ARTISANS[0];

  const [copiedLink, setCopiedLink] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    if (!callOpen) {
      setCallSeconds(0);
      return;
    }
    const timer = window.setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [callOpen]);

  if (!booking) {
    return (
      <div className="max-w-[960px] mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-[#181226]">No Active Dispatch Yet</h1>
        <p className="text-sm text-[#5E5570] mt-2">
          Confirm an artisan booking with OTP to activate the live GPS arrival radar.
        </p>
      </div>
    );
  }

  const landmarks = CITY_LANDMARKS[booking.city] || CITY_LANDMARKS.Chennai;
  const point = ROUTE_POINTS[Math.min(booking.progressStep, ROUTE_POINTS.length - 1)];

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/?track=${booking.referenceCode}`;
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 2400);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const rem = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${rem}`;
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-14 py-6 lg:py-10">
      {/* Top Booking Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E8E2F2]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#735C00]">
            Live Radar &amp; Arrival Tracker
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#181226]">
            {booking.artisanName} · {booking.referenceCode}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {bookings.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBooking(b.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                b.id === booking.id
                  ? 'bg-[#2E165B] text-white'
                  : 'bg-white border border-[#E8E2F2] text-[#5E5570] hover:text-[#181226]'
              }`}
            >
              {b.referenceCode} · {b.city}
            </button>
          ))}
        </div>
      </div>

      {/* Split-Screen Desktop Tracker: Map Left (7 cols), Dispatch Sheet Right (5 cols) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left 7 Cols: Soft-Dimmed Purple-and-Ivory Live Radar Map */}
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-[#E8E2F2] bg-[#EFE4FF] min-h-[420px] lg:min-h-[580px] flex flex-col justify-between">
          {/* Interactive SVG Architectural City Map */}
          <svg
            viewBox="0 0 720 480"
            className="w-full h-full absolute inset-0 object-cover select-none"
            role="img"
            aria-label={`Live route map in ${booking.city} from ${booking.originNeighborhood} to ${booking.venueAddress}`}
          >
            <defs>
              <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5EEFF" />
                <stop offset="100%" stopColor="#E6DAF8" />
              </linearGradient>
              <pattern id="cityGrid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="#D9CCE8"
                  strokeWidth="0.9"
                />
              </pattern>
            </defs>

            <rect width="720" height="480" fill="url(#mapBg)" />
            <rect width="720" height="480" fill="url(#cityGrid)" />

            {/* City Water / Temple Tank Landmark */}
            <rect
              x="470"
              y="265"
              width="175"
              height="120"
              rx="18"
              fill="#DDD0F2"
              stroke="#C6B5E3"
              strokeWidth="1.5"
            />
            <text
              x="557"
              y="330"
              textAnchor="middle"
              fill="#5E5570"
              fontSize="11"
              fontWeight="600"
            >
              {landmarks.landmark}
            </text>

            {/* Primary Urban Arteries */}
            <path
              d="M 30 390 Q 220 355 370 250 T 680 95"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M 110 70 L 290 430"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 410 40 L 445 450"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Road Name Labels */}
            <text x="195" y="346" fill="#5E5570" fontSize="11" fontWeight="600">
              {landmarks.roadA}
            </text>
            <text x="340" y="160" fill="#5E5570" fontSize="11" fontWeight="600">
              {landmarks.roadB}
            </text>

            {/* Route Polyline */}
            <path
              d="M 130 375 C 215 330, 315 265, 425 205 S 520 155, 585 125"
              fill="none"
              stroke="#2E165B"
              strokeWidth="4.5"
              strokeDasharray="8 6"
              strokeLinecap="round"
            />

            {/* Origin Studio Marker */}
            <circle cx="130" cy="375" r="9" fill="#FFFFFF" stroke="#2E165B" strokeWidth="3" />
            <rect x="65" y="394" width="132" height="26" rx="13" fill="#FFFFFF" stroke="#E8E2F2" />
            <text x="131" y="411" textAnchor="middle" fill="#181226" fontSize="11" fontWeight="600">
              {booking.originNeighborhood}
            </text>

            {/* Destination Mandapam Marker */}
            <circle cx="585" cy="125" r="11" fill="#2E165B" stroke="#D4AF37" strokeWidth="3" />
            <rect x="480" y="75" width="198" height="28" rx="14" fill="#180040" />
            <text x="579" y="93" textAnchor="middle" fill="#FFE088" fontSize="11" fontWeight="600">
              Mandapam Bridal Suite
            </text>
          </svg>

          {/* Real-Time Pulsating Dual-Ring Gold Artist Beacon Overlay */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
            style={{
              left: `${(point.x / 720) * 100}%`,
              top: `${(point.y / 480) * 100}%`,
            }}
          >
            <span className="absolute inset-0 w-12 h-12 -ml-6 -mt-6 rounded-full bg-[#D4AF37]/35 animate-radar-ring" />
            <span className="absolute inset-0 w-12 h-12 -ml-6 -mt-6 rounded-full bg-[#D4AF37]/25 animate-radar-ring-delayed" />
            <div className="relative w-10 h-10 -ml-5 -mt-5 rounded-full bg-[#2E165B] border-2 border-[#D4AF37] shadow-lg flex items-center justify-center">
              <Navigation className="w-4 h-4 text-[#FFE088]" />
            </div>
          </div>

          {/* Floating Map Top Status Strip */}
          <div className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="bg-white/95 backdrop-blur-md border border-[#E8E2F2] rounded-2xl px-4 py-2.5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#735C00]">
                {booking.status}
              </p>
              <p className="text-sm font-bold text-[#181226] tabular-nums">
                {booking.progressStep >= 3
                  ? 'Arrived at Mandapam Gate'
                  : `${booking.etaMinutes} mins away · ${booking.distanceKm.toFixed(1)} km`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onAdvanceMilestone(booking.id)}
              className="px-4 py-2.5 rounded-full bg-[#2E165B] text-white text-xs font-semibold hover:bg-[#180040] shadow-md whitespace-nowrap cursor-pointer"
            >
              {booking.progressStep >= 3 ? 'Reset Demo Route' : 'Simulate Next Arrival Step'}
            </button>
          </div>

          {/* Floating Bottom Vehicle & Venue Pill */}
          <div className="relative z-10 p-4 sm:p-5">
            <div className="bg-white/95 backdrop-blur-md border border-[#E8E2F2] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#2E165B] shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-[#181226]">{booking.venueAddress}</p>
                  <p className="text-xs text-[#5E5570] mt-0.5">
                    {artisan.vehicleInfo} · Muhurtham {booking.muhurthamSlot}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#2E165B] tabular-nums">
                OTP PIN: 4829
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Elevated Dispatch Control Sheet */}
        <div className="lg:col-span-5 card-resting rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
          {/* Artist Header + Direct Audio Call Trigger */}
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#E8E2F2]">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-16 rounded-2xl overflow-hidden bg-[#EFE4FF] shrink-0">
                  <ResilientImage
                    src={booking.artisanImage}
                    alt={booking.artisanName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E165B]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Verified Pro En Route
                  </p>
                  <h2 className="font-display text-xl font-semibold text-[#181226]">
                    {booking.artisanName}
                  </h2>
                  <p className="text-xs text-[#5E5570]">{booking.packageName}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCallOpen(true)}
                aria-label={`Audio call ${booking.artisanName}`}
                className="w-12 h-12 rounded-full gold-cta flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Phone className="w-5 h-5" />
              </button>
            </div>

            {/* Sterile Kit Manifest */}
            <div className="rounded-2xl bg-[#F8F6FC] p-4 border border-[#E8E2F2]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#735C00]">
                Dispatched Kit &amp; Floral Manifest
              </p>
              <p className="text-xs text-[#181226] mt-1 leading-relaxed">
                {artisan.signatureKit}
              </p>
            </div>

            {/* 4-Step Live Milestone Timeline */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5E5570]">
                Live Dispatch Progress
              </p>
              <div className="space-y-3.5">
                {MILESTONES.map((step, idx) => {
                  const done = idx <= booking.progressStep;
                  const current = idx === booking.progressStep;
                  return (
                    <div key={step.label} className="flex items-start gap-3.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          done
                            ? 'bg-[#2E165B] text-[#FFE088]'
                            : 'bg-[#F8F6FC] border border-[#E8E2F2] text-[#7A7581]'
                        }`}
                      >
                        {done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-semibold ${
                            current
                              ? 'text-[#2E165B]'
                              : done
                                ? 'text-[#181226]'
                                : 'text-[#7A7581]'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-[#5E5570]">{step.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Actions: Share Link & INR Tax Receipt */}
          <div className="pt-5 border-t border-[#E8E2F2] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#5E5570]">Direct Settlement (0% fee)</span>
              <span className="font-bold text-[#181226] tabular-nums">
                {formatINR(booking.totalInr)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="py-2.5 px-4 rounded-full border border-[#E8E2F2] text-xs font-semibold text-[#2E165B] hover:bg-[#F8F6FC] inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied' : 'Share Tracker'}</span>
              </button>

              <button
                type="button"
                onClick={() => setReceiptOpen(true)}
                className="py-2.5 px-4 rounded-full bg-[#2E165B] text-white text-xs font-semibold hover:bg-[#180040] inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>INR Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Audio Call Modal */}
      {callOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#180040]/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Direct Audio Call"
        >
          <div className="w-full max-w-sm bg-[#2E165B] text-white rounded-3xl p-8 text-center shadow-2xl border border-[#D4AF37]/40 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#D4AF37]">
              <ResilientImage
                src={booking.artisanImage}
                alt={booking.artisanName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#E5C358]">
                {callSeconds < 3 ? 'Connecting Encrypted Audio...' : 'Connected with Artisan'}
              </p>
              <h3 className="font-display text-2xl font-semibold mt-1">{booking.artisanName}</h3>
              <p className="text-sm text-[#EADDFF] tabular-nums mt-1">
                {formatTimer(callSeconds)}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border cursor-pointer ${
                  muted ? 'bg-white text-[#180040]' : 'border-white/30 text-white hover:bg-white/10'
                }`}
                aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setCallOpen(false)}
                className="w-14 h-14 rounded-full bg-[#BA1A1A] text-white flex items-center justify-center hover:bg-[#93000A] cursor-pointer"
                aria-label="End audio call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={() => {}}
                className="w-12 h-12 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 cursor-pointer"
                aria-label="Speaker active"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INR Receipt Modal */}
      {receiptOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#180040]/50 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="INR Direct Settlement Receipt"
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2F2] shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#735C00]">
                  Zero-Commission Tax Receipt
                </p>
                <h3 className="font-display text-2xl font-semibold text-[#181226] mt-0.5">
                  {booking.referenceCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReceiptOpen(false)}
                className="w-9 h-9 rounded-full border border-[#E8E2F2] flex items-center justify-center text-[#5E5570] hover:text-[#181226] cursor-pointer"
                aria-label="Close receipt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-sm border-y border-[#E8E2F2] py-4">
              <div className="flex justify-between">
                <span className="text-[#5E5570]">Artisan</span>
                <span className="font-semibold text-[#181226]">{booking.artisanName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E5570]">Package</span>
                <span className="font-medium text-[#181226]">{booking.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E5570]">Client</span>
                <span className="font-medium text-[#181226]">{booking.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E5570]">Ki Ai Commission</span>
                <span className="font-semibold text-[#2E165B] tabular-nums">₹0 (0%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#181226]">Total Direct Payout</span>
              <span className="font-display text-2xl font-semibold text-[#2E165B] tabular-nums">
                {formatINR(booking.totalInr)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setReceiptOpen(false)}
              className="w-full py-3 rounded-full bg-[#2E165B] text-white text-sm font-semibold hover:bg-[#180040] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
