import { useEffect, useState } from 'react';
import { ArtistProfileScreen } from './components/ArtistProfileScreen';
import { DiscoverScreen } from './components/DiscoverScreen';
import { LiveDispatchScreen } from './components/LiveDispatchScreen';
import { MyBookingsScreen } from './components/MyBookingsScreen';
import { OtpCheckoutScreen } from './components/OtpCheckoutScreen';
import { TopBar } from './components/TopBar';
import { ARTISANS, INITIAL_BOOKINGS } from './data/artisans';
import { BookingDraft, CityName, ConfirmedBooking, ScreenId } from './types/atelier';

const STORAGE_BOOKINGS_KEY = 'kiai_atelier_bookings_v1';
const STORAGE_SAVED_KEY = 'kiai_atelier_saved_v1';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('discover');
  const [selectedCity, setSelectedCity] = useState<CityName>('All Cities');
  const [selectedArtisanId, setSelectedArtisanId] = useState<string>(ARTISANS[0].id);

  const [bookings, setBookings] = useState<ConfirmedBooking[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_BOOKINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_BOOKINGS;
  });

  const [activeBookingId, setActiveBookingId] = useState<string>(INITIAL_BOOKINGS[0].id);

  const [savedArtisanIds, setSavedArtisanIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return ['ananya-subramanian', 'kavya-nair'];
  });

  const [pendingDraft, setPendingDraft] = useState<BookingDraft>(() => ({
    artisanId: ARTISANS[0].id,
    packageId: ARTISANS[0].packages[0].id,
    selectedAddOnIds: [],
    eventDate: '2026-11-24',
    muhurthamSlot: '04:30 AM – 08:00 AM (Dawn Muhurtham)',
    city: ARTISANS[0].city,
    venueAddress: 'MRC Nagar Mandapam, Mylapore, Chennai',
    clientName: 'Keerthana Balasubramanian',
    clientPhone: '+91 98401 44219',
    paymentMethod: 'upi',
  }));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedArtisanIds));
    } catch {
      // ignore
    }
  }, [savedArtisanIds]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (screen: ScreenId) => {
    setActiveScreen(screen);
    scrollToTop();
  };

  const handleInspectArtisan = (artisanId: string) => {
    setSelectedArtisanId(artisanId);
    setActiveScreen('profile');
    scrollToTop();
  };

  const handleQuickBookArtisan = (artisanId: string) => {
    const artist = ARTISANS.find((a) => a.id === artisanId) || ARTISANS[0];
    setSelectedArtisanId(artist.id);
    setPendingDraft({
      artisanId: artist.id,
      packageId: artist.packages[0].id,
      selectedAddOnIds: [],
      eventDate: '2026-11-24',
      muhurthamSlot: '04:30 AM – 08:00 AM (Dawn Muhurtham)',
      city: artist.city,
      venueAddress: `${artist.neighborhood} Heritage Mandapam, ${artist.city}`,
      clientName: 'Keerthana Balasubramanian',
      clientPhone: '+91 98401 44219',
      paymentMethod: 'upi',
    });
    setActiveScreen('checkout');
    scrollToTop();
  };

  const handleToggleSaveArtisan = (artisanId: string) => {
    setSavedArtisanIds((prev) =>
      prev.includes(artisanId) ? prev.filter((id) => id !== artisanId) : [...prev, artisanId]
    );
  };

  const handleProceedToCheckout = (draft: BookingDraft) => {
    setPendingDraft(draft);
    setActiveScreen('checkout');
    scrollToTop();
  };

  const handleConfirmBooking = (completedDraft: BookingDraft) => {
    const artist = ARTISANS.find((a) => a.id === completedDraft.artisanId) || ARTISANS[0];
    const pkg =
      artist.packages.find((p) => p.id === completedDraft.packageId) || artist.packages[0];
    const addOns = artist.addOns.filter((a) =>
      completedDraft.selectedAddOnIds.includes(a.id)
    );
    const totalInr = pkg.priceInr + addOns.reduce((sum, item) => sum + item.priceInr, 0);

    const newBooking: ConfirmedBooking = {
      id: `bk-${Date.now()}`,
      referenceCode: `KIAI-${Math.floor(1000 + Math.random() * 8999)}`,
      artisanId: artist.id,
      artisanName: artist.name,
      artisanImage: artist.heroImage,
      specialty: artist.specialty,
      packageName: pkg.name,
      addOnLabels: addOns.map((a) => a.label),
      totalInr,
      city: completedDraft.city,
      originNeighborhood: `${artist.neighborhood} Atelier`,
      venueAddress: completedDraft.venueAddress,
      eventDate: completedDraft.eventDate,
      muhurthamSlot: completedDraft.muhurthamSlot,
      clientName: completedDraft.clientName,
      clientPhone: completedDraft.clientPhone,
      paymentMethod: completedDraft.paymentMethod,
      status: 'En Route',
      etaMinutes: artist.dispatchMinutes,
      distanceKm: 4.1,
      progressStep: 2,
      createdAt: 'Just now',
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBookingId(newBooking.id);
    setActiveScreen('dispatch');
    scrollToTop();
  };

  const handleAdvanceMilestone = (bookingId: string) => {
    const statusMap: ConfirmedBooking['status'][] = [
      'Confirmed',
      'Kit Sterilized',
      'En Route',
      'Arrived',
    ];
    const etaMap = [35, 24, 12, 0];
    const distMap = [7.4, 5.1, 2.3, 0];

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const nextStep = b.progressStep >= 3 ? 0 : b.progressStep + 1;
        return {
          ...b,
          progressStep: nextStep,
          status: statusMap[nextStep],
          etaMinutes: etaMap[nextStep],
          distanceKm: distMap[nextStep],
        };
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6FC] text-[#181226]">
      <TopBar
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        onQuickBook={() => handleQuickBookArtisan(selectedArtisanId)}
        bookingCount={bookings.length}
      />

      <main className="flex-1">
        {activeScreen === 'discover' && (
          <DiscoverScreen
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onInspectArtisan={handleInspectArtisan}
            onQuickBookArtisan={handleQuickBookArtisan}
            savedArtisanIds={savedArtisanIds}
            onToggleSaveArtisan={handleToggleSaveArtisan}
          />
        )}

        {activeScreen === 'profile' && (
          <ArtistProfileScreen
            artisanId={selectedArtisanId}
            onSelectArtisan={setSelectedArtisanId}
            onBack={() => handleNavigate('discover')}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}

        {activeScreen === 'checkout' && (
          <OtpCheckoutScreen
            draft={pendingDraft}
            onBackToProfile={() => handleNavigate('profile')}
            onConfirmBooking={handleConfirmBooking}
          />
        )}

        {activeScreen === 'dispatch' && (
          <LiveDispatchScreen
            bookings={bookings}
            activeBookingId={activeBookingId}
            onSelectBooking={setActiveBookingId}
            onAdvanceMilestone={handleAdvanceMilestone}
          />
        )}

        {activeScreen === 'bookings' && (
          <MyBookingsScreen
            bookings={bookings}
            savedArtisanIds={savedArtisanIds}
            onOpenDispatch={(id) => {
              setActiveBookingId(id);
              handleNavigate('dispatch');
            }}
            onInspectArtisan={handleInspectArtisan}
            onExploreDiscover={() => handleNavigate('discover')}
          />
        )}
      </main>

      <footer className="bg-[#FFFFFF] border-t border-[#E8E2F2] mt-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-14 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#5E5570]">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-semibold text-[#2E165B]">Ki Ai</span>
            <span aria-hidden="true">·</span>
            <span>South Indian Bridal &amp; Event Atelier · Zero-Commission INR Bookings</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => handleNavigate('discover')}
              className="hover:text-[#180040] cursor-pointer"
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('profile')}
              className="hover:text-[#180040] cursor-pointer"
            >
              Artisans
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('dispatch')}
              className="hover:text-[#180040] cursor-pointer"
            >
              Live Dispatch
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('bookings')}
              className="hover:text-[#180040] cursor-pointer"
            >
              Bookings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
