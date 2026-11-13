import React, { useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, Smartphone } from 'lucide-react';
import { ARTISANS, formatINR } from '../data/artisans';
import { BookingDraft } from '../types/atelier';
import { ResilientImage } from './ResilientImage';

interface OtpCheckoutScreenProps {
  draft: BookingDraft;
  onBackToProfile: () => void;
  onConfirmBooking: (completedDraft: BookingDraft) => void;
}

export const OtpCheckoutScreen: React.FC<OtpCheckoutScreenProps> = ({
  draft,
  onBackToProfile,
  onConfirmBooking,
}) => {
  const artisan = ARTISANS.find((a) => a.id === draft.artisanId) || ARTISANS[0];
  const pkg = artisan.packages.find((p) => p.id === draft.packageId) || artisan.packages[0];
  const addOns = artisan.addOns.filter((a) => draft.selectedAddOnIds.includes(a.id));
  const totalInr = pkg.priceInr + addOns.reduce((sum, a) => sum + a.priceInr, 0);

  const [clientName, setClientName] = useState(draft.clientName || 'Keerthana Balasubramanian');
  const [clientPhone, setClientPhone] = useState(draft.clientPhone || '+91 98401 44219');
  const [venueAddress, setVenueAddress] = useState(draft.venueAddress);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'venue'>(draft.paymentMethod);

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [activeTile, setActiveTile] = useState<number>(0);
  const [otpSent, setOtpSent] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      setErrorMsg('');
      return;
    }

    const digit = cleaned.slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    setErrorMsg('');

    if (index < 3) {
      setActiveTile(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      setActiveTile(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFillDemoOtp = () => {
    setOtpDigits(['4', '8', '2', '9']);
    setActiveTile(3);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !venueAddress.trim()) {
      setErrorMsg('Please complete your name, Indian mobile number, and mandapam address.');
      return;
    }
    const code = otpDigits.join('');
    if (code.length < 4) {
      setErrorMsg('Enter the 4-digit dispatch OTP (or tap Fill Demo OTP) to confirm.');
      return;
    }

    onConfirmBooking({
      ...draft,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      venueAddress: venueAddress.trim(),
      paymentMethod,
    });
  };

  return (
    <div className="max-w-[1160px] mx-auto px-4 sm:px-8 py-8 lg:py-12">
      <button
        type="button"
        onClick={onBackToProfile}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#2E165B] hover:text-[#180040] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Edit Ceremony Configuration</span>
      </button>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Client Details + 4-Digit OTP Verification */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 card-resting rounded-3xl p-6 sm:p-8 space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#735C00]">
              Step 2 of 2 · Instant Dispatch Lock
            </p>
            <h1 className="font-display text-3xl font-semibold text-[#181226] mt-1">
              Verify &amp; Confirm Booking
            </h1>
            <p className="text-sm text-[#5E5570] mt-1">
              Your artisan receives 100% direct settlement with zero marketplace deductions.
            </p>
          </div>

          {/* Host Details */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[#181226]">Bride / Family Host Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-[#5E5570] mb-1.5 block">Full Name</span>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-[#E8E2F2] bg-white text-sm text-[#181226] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-[#5E5570] mb-1.5 block">
                  Mobile Number (WhatsApp / OTP)
                </span>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-[#E8E2F2] bg-white text-sm text-[#181226] tabular-nums focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-medium text-[#5E5570] mb-1.5 block">
                Mandapam / Bridal Suite Venue
              </span>
              <input
                type="text"
                required
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-[#E8E2F2] bg-white text-sm text-[#181226] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </label>
          </div>

          {/* Direct INR Payment Mode */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[#181226]">Direct INR Settlement Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'upi', title: 'Direct UPI', sub: 'GPay · PhonePe · BHIM' },
                { id: 'card', title: 'RuPay / Card', sub: 'Instant zero-fee hold' },
                { id: 'venue', title: 'Pay at Mandapam', sub: 'Direct QR scan on arrival' },
              ].map((option) => {
                const selected = paymentMethod === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id as 'upi' | 'card' | 'venue')}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      selected
                        ? 'card-gold-active'
                        : 'bg-[#F8F6FC]/60 border-[#E8E2F2] hover:border-[#2E165B]/40'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#181226]">{option.title}</p>
                    <p className="text-xs text-[#5E5570] mt-0.5">{option.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4-Digit OTP Confirmation Tiles */}
          <div className="pt-6 border-t border-[#E8E2F2] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#2E165B]" />
                <h2 className="text-sm font-semibold text-[#181226]">
                  4-Digit Arrival &amp; Dispatch OTP
                </h2>
              </div>
              <button
                type="button"
                onClick={handleFillDemoOtp}
                className="text-xs font-semibold text-[#735C00] hover:text-[#2E165B] underline underline-offset-4 cursor-pointer"
              >
                Fill Demo OTP (4829)
              </button>
            </div>

            <p className="text-xs text-[#5E5570]">
              {otpSent
                ? `Verification code sent to ${clientPhone}. Share this 4-digit PIN with ${artisan.name.split(' ')[0]} when she arrives at your bridal suite.`
                : 'Request OTP to lock your dispatch slot.'}
            </p>

            <div className="flex items-center gap-3 sm:gap-4">
              {otpDigits.map((digit, index) => {
                const isFocused = activeTile === index;
                return (
                  <input
                    key={`otp-tile-${index}`}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`OTP digit ${index + 1}`}
                    value={digit}
                    onFocus={() => setActiveTile(index)}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-14 h-16 rounded-xl bg-white text-center text-2xl font-bold text-[#181226] tabular-nums border transition-all focus:outline-none ${
                      isFocused || digit
                        ? 'border-[#E8E2F2] border-b-[3px] border-b-[#D4AF37] shadow-[0_4px_16px_rgba(212,175,55,0.14)]'
                        : 'border-[#E8E2F2]'
                    }`}
                  />
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setOtpSent(true);
                  handleFillDemoOtp();
                }}
                className="ml-2 text-xs font-semibold text-[#5E5570] hover:text-[#2E165B] cursor-pointer"
              >
                Resend
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs font-medium text-[#BA1A1A] bg-[#FFDAD6]/60 px-3.5 py-2.5 rounded-xl">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-full text-sm sm:text-base font-semibold gold-cta flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Confirm Dispatch · {formatINR(totalInr)}</span>
          </button>
        </form>

        {/* Right 5 Cols: Stationery Booking Summary */}
        <aside className="lg:col-span-5 card-resting rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-[#E8E2F2]">
            <div className="w-16 h-20 rounded-2xl overflow-hidden bg-[#EFE4FF] shrink-0">
              <ResilientImage
                src={artisan.heroImage}
                alt={artisan.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E165B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                Verified Atelier Pro
              </p>
              <h2 className="font-display text-xl font-semibold text-[#181226] mt-0.5">
                {artisan.name}
              </h2>
              <p className="text-xs text-[#5E5570] mt-0.5">
                {draft.city} · Est. arrival {artisan.dispatchMinutes} mins
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-[#5E5570]">Selected Package</p>
              <p className="font-semibold text-[#181226]">{pkg.name}</p>
            </div>
            <div>
              <p className="text-xs text-[#5E5570]">Muhurtham Date &amp; Slot</p>
              <p className="font-medium text-[#181226]">
                {draft.eventDate} · {draft.muhurthamSlot}
              </p>
            </div>
            {addOns.length > 0 && (
              <div>
                <p className="text-xs text-[#5E5570]">Ritual Add-Ons</p>
                <ul className="mt-1 space-y-1">
                  {addOns.map((a) => (
                    <li key={a.id} className="flex items-center justify-between text-xs text-[#181226]">
                      <span>{a.label}</span>
                      <span className="tabular-nums font-semibold">{formatINR(a.priceInr)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E8E2F2] space-y-2 text-sm">
            <div className="flex items-center justify-between text-[#5E5570]">
              <span>Package Subtotal</span>
              <span className="tabular-nums font-medium text-[#181226]">
                {formatINR(pkg.priceInr)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#5E5570]">
              <span>Zero-Commission Guarantee</span>
              <span className="tabular-nums font-semibold text-[#2E165B]">₹0 Fee</span>
            </div>
            <div className="pt-3 border-t border-[#E8E2F2] flex items-center justify-between">
              <span className="font-semibold text-[#181226]">Direct Total (INR)</span>
              <span className="font-display text-2xl font-semibold text-[#2E165B] tabular-nums">
                {formatINR(totalInr)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F8F6FC] p-4 flex items-start gap-3 text-xs text-[#5E5570]">
            <CheckCircle2 className="w-4 h-4 text-[#2E165B] shrink-0 mt-0.5" />
            <span>
              Live GPS radar activates immediately upon OTP verification so your family coordinator
              can track the artist’s vehicle to the mandapam gate.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};
