export type ScreenId = 'discover' | 'profile' | 'checkout' | 'dispatch' | 'bookings';

export type CityName = 'All Cities' | 'Chennai' | 'Bengaluru' | 'Hyderabad' | 'Kochi' | 'Coimbatore';

export type ServiceCategory =
  | 'All'
  | 'Muhurtham Makeup'
  | 'Kanjeevaram & Jadai'
  | 'Mandapam Photography'
  | 'Bridal Mehndi';

export interface ArtistPackage {
  id: string;
  name: string;
  ritual: string;
  duration: string;
  priceInr: number;
  includes: string[];
}

export interface ArtistAddOn {
  id: string;
  label: string;
  priceInr: number;
  note: string;
}

export interface ArtistReview {
  id: string;
  brideName: string;
  weddingContext: string;
  rating: number;
  comment: string;
}

export interface Artisan {
  id: string;
  name: string;
  specialty: string;
  category: Exclude<ServiceCategory, 'All'>;
  city: Exclude<CityName, 'All Cities'>;
  neighborhood: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  dispatchMinutes: number;
  availableToday: boolean;
  verifiedPro: boolean;
  startingPriceInr: number;
  heroImage: string;
  galleryImages: string[];
  bio: string;
  signatureKit: string;
  vehicleInfo: string;
  packages: ArtistPackage[];
  addOns: ArtistAddOn[];
  reviews: ArtistReview[];
}

export interface BookingDraft {
  artisanId: string;
  packageId: string;
  selectedAddOnIds: string[];
  eventDate: string;
  muhurthamSlot: string;
  city: Exclude<CityName, 'All Cities'>;
  venueAddress: string;
  clientName: string;
  clientPhone: string;
  paymentMethod: 'upi' | 'card' | 'venue';
}

export interface ConfirmedBooking {
  id: string;
  referenceCode: string;
  artisanId: string;
  artisanName: string;
  artisanImage: string;
  specialty: string;
  packageName: string;
  addOnLabels: string[];
  totalInr: number;
  city: Exclude<CityName, 'All Cities'>;
  originNeighborhood: string;
  venueAddress: string;
  eventDate: string;
  muhurthamSlot: string;
  clientName: string;
  clientPhone: string;
  paymentMethod: 'upi' | 'card' | 'venue';
  status: 'Confirmed' | 'Kit Sterilized' | 'En Route' | 'Arrived';
  etaMinutes: number;
  distanceKm: number;
  progressStep: number; // 0 to 3
  createdAt: string;
}
