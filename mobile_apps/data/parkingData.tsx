// Yogyakarta parking spots data
export const parkingSpots = [
  {
    id: 1,
    name: 'CCM Basement',
    address: 'Jl. Raya Grafika, Senolowo, Sinduadi, Mlati, Sleman',
    rating: 4.5,
    hourlyRate: 5000,
    available: 12,
    total: 20,
    latitude: -7.754, // Near your location in Yogyakarta
    longitude: 110.374,
    features: ['CCTV', 'Security', '24/7'],
    distance: 500, // 500 meters
    hours: '24/7',
    paymentMethods: ['Cash', 'Card', 'QRIS'],
  },
  {
    id: 2,
    name: 'Mall Galeria',
    address: 'Jl. Sudirman, Kotabaru, Gondokusuman, Yogyakarta',
    rating: 4.8,
    hourlyRate: 8000,
    available: 25,
    total: 50,
    latitude: -7.7956,
    longitude: 110.3695,
    features: ['Valet', 'Covered', 'Mall Access'],
    distance: 1200,
    hours: '08:00 - 22:00',
    paymentMethods: ['Cash', 'Card', 'QRIS', 'OVO'],
  },
  {
    id: 3,
    name: 'Jogja City Mall',
    address: 'Jl. Magelang, Kuningan, Sleman, Yogyakarta',
    rating: 4.3,
    hourlyRate: 6000,
    available: 18,
    total: 40,
    latitude: -7.7486,
    longitude: 110.3568,
    features: ['CCTV', 'Lift Access', 'Wheelchair Access'],
    distance: 2100,
    hours: '10:00 - 22:00',
    paymentMethods: ['Cash', 'Card', 'QRIS'],
  },
  {
    id: 4,
    name: 'Hartono Mall',
    address: 'Jl. Ring Road Utara, Condongcatur, Sleman, Yogyakarta',
    rating: 4.6,
    hourlyRate: 7000,
    available: 35,
    total: 80,
    latitude: -7.7336,
    longitude: 110.3844,
    features: ['Premium', 'Security', 'Food Court Access'],
    distance: 1800,
    hours: '10:00 - 22:00',
    paymentMethods: ['Cash', 'Card', 'QRIS', 'GoPay'],
  },
  {
    id: 5,
    name: 'UGM Parking Area',
    address: 'Bulaksumur, Caturtunggal, Sleman, Yogyakarta',
    rating: 4.1,
    hourlyRate: 3000,
    available: 45,
    total: 100,
    latitude: -7.7719,
    longitude: 110.3756,
    features: ['Campus Access', 'Student Discount'],
    distance: 2500,
    hours: '06:00 - 18:00',
    paymentMethods: ['Cash', 'Student Card'],
  },
];

export const filterSpotsBySearch = (spots: typeof parkingSpots, searchTerm: string) => {
  if (!searchTerm) return spots;
  return spots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const sortSpotsByDistance = (spots: typeof parkingSpots) => {
  return spots.sort((a, b) => a.distance - b.distance);
};
