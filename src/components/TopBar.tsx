import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ScreenId } from '../types/atelier';

interface TopBarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onQuickBook: () => void;
  bookingCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  onNavigate,
  onQuickBook,
  bookingCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ScreenId; label: string }[] = [
    { id: 'discover', label: 'Discover' },
    { id: 'profile', label: 'Artisans' },
    { id: 'dispatch', label: 'Live Dispatch' },
    { id: 'bookings', label: bookingCount > 0 ? `Bookings (${bookingCount})` : 'Bookings' },
  ];

  const handleNav = (id: ScreenId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E8E2F2]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-14 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single clean wordmark */}
        <button
          type="button"
          onClick={() => handleNav('discover')}
          className="font-display text-2xl font-semibold tracking-tight text-[#2E165B] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-md"
        >
          Ki Ai
        </button>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive =
              activeScreen === item.id || (activeScreen === 'checkout' && item.id === 'profile');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded ${
                  isActive
                    ? 'text-[#180040] font-semibold'
                    : 'text-[#5E5570] hover:text-[#180040]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#D4AF37] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onQuickBook}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold gold-cta whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E165B]"
          >
            Book Artist Now
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E8E2F2] text-[#2E165B] hover:bg-[#F8F6FC] cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E2F2] bg-[#FFFFFF] px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#2E165B] text-white'
                    : 'text-[#181226] hover:bg-[#F8F6FC]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onQuickBook();
            }}
            className="w-full mt-2 py-3 px-5 rounded-full text-sm font-semibold gold-cta cursor-pointer"
          >
            Book Artist Now
          </button>
        </div>
      )}
    </header>
  );
};
