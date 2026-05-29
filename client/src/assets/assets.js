import profile_icon from "./profile_icon.png";
import main_banner from "./main-banner1.png";
import white_arrow from "./white_arrow_icon.svg";
import black_arrow from "./black_arrow_icon.svg";
import train1 from "./train1.png";
import train2 from "./train2.png";
import train3 from "./train3.png";
import train4 from "./train4.png";

export const assets={
  profile_icon,
  main_banner,
  white_arrow,
  black_arrow,
  train1,
  train2,
  train3,
  train4
}

export const trains = [
  {
    id: 1,
    trainNo: "12627",
    name: "Chennai Express",

    route: "Chennai → Bangalore",

    departure: "06:00 AM",
    arrival: "12:00 PM",
    duration: "6h 00m",

    price: 450,

    type: "AC Chair Car",

    availableSeats: 32,

    rating: 4.5,

    reason: "💰 Low Price",

    image: train2
  },

  {
    id: 2,
    trainNo: "12711",
    name: "Superfast Express",

    route: "Chennai → Hyderabad",

    departure: "09:00 PM",
    arrival: "06:00 AM",
    duration: "9h 00m",

    price: 600,

    type: "AC Sleeper",

    availableSeats: 18,

    rating: 4.7,

    reason: "⚡ Fastest Route",

    image: train3
  },

  {
    id: 3,
    trainNo: "12675",
    name: "Night Rider",

    route: "Chennai → Coimbatore",

    departure: "10:00 PM",
    arrival: "05:00 AM",
    duration: "7h 00m",

    price: 500,

    type: "Sleeper",

    availableSeats: 25,

    rating: 4.6,

    reason: "🔥 Most Popular",

    image: train1
  },

  // {
  //   id: 4,
  //   trainNo: "12681",
  //   name: "Coimbatore Intercity",

  //   route: "Chennai → Coimbatore",

  //   departure: "02:15 PM",
  //   arrival: "09:30 PM",
  //   duration: "7h 15m",

  //   price: 520,

  //   type: "Non-AC Seater",

  //   availableSeats: 40,

  //   rating: 4.3,

  //   reason: "🛋 Comfortable Journey",

  //   image: train4
  // }
];






export const allTrains = [
  {
    id: 1,
    trainNo: "12627",
    name: "Chennai Express",
    from: "Chennai",
    to: "Bangalore",
    departure: "06:00 AM",
    arrival: "12:00 PM",
    duration: "6h 00m",
    price: 450,
    type: "AC Chair Car",
    rating: 4.5,

    bookings: [
      { date: "2026-05-15", availableSeats: 32 },
      { date: "2026-05-16", availableSeats: 24 },
      { date: "2026-05-17", availableSeats: 18 }
    ]
  },

  {
    id: 2,
    trainNo: "12711",
    name: "Superfast Express",
    from: "Chennai",
    to: "Hyderabad",
    departure: "09:00 PM",
    arrival: "06:00 AM",
    duration: "9h 00m",
    price: 600,
    type: "AC Sleeper",
    rating: 4.7,

    bookings: [
      { date: "2026-05-15", availableSeats: 18 },
      { date: "2026-05-16", availableSeats: 12 },
      { date: "2026-05-17", availableSeats: 7 }
    ]
  },

  {
    id: 3,
    trainNo: "12675",
    name: "Night Rider",
    from: "Chennai",
    to: "Coimbatore",
    departure: "10:00 PM",
    arrival: "05:00 AM",
    duration: "7h 00m",
    price: 500,
    type: "Sleeper",
    rating: 4.6,

    bookings: [
      { date: "2026-05-15", availableSeats: 25 },
      { date: "2026-05-16", availableSeats: 20 },
      { date: "2026-05-17", availableSeats: 14 }
    ]
  },

  {
    id: 4,
    trainNo: "12681",
    name: "Coimbatore Intercity",
    from: "Chennai",
    to: "Coimbatore",
    departure: "02:15 PM",
    arrival: "09:30 PM",
    duration: "7h 15m",
    price: 520,
    type: "Non-AC Seater",
    rating: 4.3,

    bookings: [
      { date: "2026-05-15", availableSeats: 40 },
      { date: "2026-05-16", availableSeats: 34 },
      { date: "2026-05-17", availableSeats: 28 }
    ]
  },

  {
    id: 5,
    trainNo: "12801",
    name: "Southern Rail",
    from: "Chennai",
    to: "Madurai",
    departure: "07:30 AM",
    arrival: "03:00 PM",
    duration: "7h 30m",
    price: 550,
    type: "AC Chair Car",
    rating: 4.4,

    bookings: [
      { date: "2026-05-15", availableSeats: 20 },
      { date: "2026-05-16", availableSeats: 16 },
      { date: "2026-05-17", availableSeats: 10 }
    ]
  },

  {
    id: 6,
    trainNo: "12644",
    name: "Vaigai Express",
    from: "Madurai",
    to: "Chennai",
    departure: "01:40 PM",
    arrival: "09:30 PM",
    duration: "7h 50m",
    price: 580,
    type: "AC Sleeper",
    rating: 4.8,

    bookings: [
      { date: "2026-05-15", availableSeats: 16 },
      { date: "2026-05-16", availableSeats: 11 },
      { date: "2026-05-17", availableSeats: 6 }
    ]
  },

  {
    id: 7,
    trainNo: "12007",
    name: "Shatabdi Express",
    from: "Chennai",
    to: "Mysore",
    departure: "05:30 AM",
    arrival: "01:00 PM",
    duration: "7h 30m",
    price: 850,
    type: "AC Chair Car",
    rating: 4.9,

    bookings: [
      { date: "2026-05-15", availableSeats: 12 },
      { date: "2026-05-16", availableSeats: 8 },
      { date: "2026-05-17", availableSeats: 4 }
    ]
  },

  {
    id: 8,
    trainNo: "12759",
    name: "Charminar Express",
    from: "Hyderabad",
    to: "Chennai",
    departure: "06:20 PM",
    arrival: "07:10 AM",
    duration: "12h 50m",
    price: 670,
    type: "Sleeper",
    rating: 4.2,

    bookings: [
      { date: "2026-05-15", availableSeats: 45 },
      { date: "2026-05-16", availableSeats: 38 },
      { date: "2026-05-17", availableSeats: 30 }
    ]
  },

  {
    id: 9,
    trainNo: "12655",
    name: "Navjeevan Express",
    from: "Chennai",
    to: "Ahmedabad",
    departure: "09:35 AM",
    arrival: "11:45 AM",
    duration: "26h 10m",
    price: 1450,
    type: "AC Sleeper",
    rating: 4.5,

    bookings: [
      { date: "2026-05-15", availableSeats: 8 },
      { date: "2026-05-16", availableSeats: 5 },
      { date: "2026-05-17", availableSeats: 2 }
    ]
  },

  {
    id: 10,
    trainNo: "16127",
    name: "Guruvayur Express",
    from: "Chennai",
    to: "Kerala",
    departure: "08:15 PM",
    arrival: "10:00 AM",
    duration: "13h 45m",
    price: 720,
    type: "Sleeper",
    rating: 4.1,

    bookings: [
      { date: "2026-05-15", availableSeats: 28 },
      { date: "2026-05-16", availableSeats: 22 },
      { date: "2026-05-17", availableSeats: 16 }
    ]
  },

  {
    id: 11,
    trainNo: "22675",
    name: "Kovai Express",
    from: "Coimbatore",
    to: "Chennai",
    departure: "02:30 PM",
    arrival: "09:45 PM",
    duration: "7h 15m",
    price: 640,
    type: "AC Chair Car",
    rating: 4.6,

    bookings: [
      { date: "2026-05-15", availableSeats: 19 },
      { date: "2026-05-16", availableSeats: 15 },
      { date: "2026-05-17", availableSeats: 9 }
    ]
  },

  {
    id: 12,
    trainNo: "11064",
    name: "Mumbai Mail",
    from: "Chennai",
    to: "Mumbai",
    departure: "11:45 PM",
    arrival: "10:30 PM",
    duration: "22h 45m",
    price: 1600,
    type: "AC Sleeper",
    rating: 4.7,

    bookings: [
      { date: "2026-05-15", availableSeats: 5 },
      { date: "2026-05-16", availableSeats: 3 },
      { date: "2026-05-17", availableSeats: 1 }
    ]
  },

  {
    id: 13,
    trainNo: "12633",
    name: "Kanniyakumari Express",
    from: "Chennai",
    to: "Kanniyakumari",
    departure: "05:10 PM",
    arrival: "06:20 AM",
    duration: "13h 10m",
    price: 790,
    type: "Sleeper",
    rating: 4.4,

    bookings: [
      { date: "2026-05-15", availableSeats: 31 },
      { date: "2026-05-16", availableSeats: 26 },
      { date: "2026-05-17", availableSeats: 20 }
    ]
  },

  {
    id: 14,
    trainNo: "22851",
    name: "Bilaspur Superfast",
    from: "Chennai",
    to: "Bilaspur",
    departure: "03:00 PM",
    arrival: "08:30 AM",
    duration: "17h 30m",
    price: 1350,
    type: "AC Sleeper",
    rating: 4.3,

    bookings: [
      { date: "2026-05-15", availableSeats: 14 },
      { date: "2026-05-16", availableSeats: 10 },
      { date: "2026-05-17", availableSeats: 5 }
    ]
  },

  {
    id: 15,
    trainNo: "16351",
    name: "Nagercoil Express",
    from: "Chennai",
    to: "Nagercoil",
    departure: "07:50 PM",
    arrival: "08:40 AM",
    duration: "12h 50m",
    price: 880,
    type: "Non-AC Seater",
    rating: 4.2,

    bookings: [
      { date: "2026-05-15", availableSeats: 38 },
      { date: "2026-05-16", availableSeats: 30 },
      { date: "2026-05-17", availableSeats: 24 }
    ]
  }
];

export const bookings = [

  {
    id: 1,
    train: "Chennai Express",
    from: "Chennai",
    to: "Bangalore",

    date: "16 May 2026",

    departure: "06:00 AM",
    arrival: "12:00 PM",

    passenger: "Deepa",

    seats: 2,

    amount: 900,

    status: "Confirmed"
  },

  {
    id: 2,
    train: "Vaigai Express",
    from: "Madurai",
    to: "Chennai",

    date: "20 May 2026",

    departure: "01:40 PM",
    arrival: "09:30 PM",

    passenger: "Deepa",

    seats: 1,

    amount: 580,

    status: "Cancelled"
  },

  {
    id: 3,
    train: "Shatabdi Express",
    from: "Chennai",
    to: "Mysore",

    date: "25 May 2026",

    departure: "05:30 AM",
    arrival: "01:00 PM",

    passenger: "Deepa",

    seats: 3,

    amount: 2550,

    status: "Confirmed"
  }

];

export const ticketData = [

  {
    id: 1,

    train: "Chennai Express",
    trainNo: "12627",

    from: "Chennai",
    to: "Bangalore",

    journeyDate: "16 May 2026",

    departure: "06:00 AM",
    arrival: "12:00 PM",

    passenger: "Deepa",

    seats: 2,

    coach: "S1",

    seatNumbers: ["21", "22"],

    bookingId: "TR45892",

    amount: 900,

    status: "Confirmed"
  },

  {
    id: 2,

    train: "Vaigai Express",
    trainNo: "12644",

    from: "Madurai",
    to: "Chennai",

    journeyDate: "20 May 2026",

    departure: "01:40 PM",
    arrival: "09:30 PM",

    passenger: "Deepa",

    seats: 1,

    coach: "B2",

    seatNumbers: ["14"],

    bookingId: "TR67215",

    amount: 580,

    status: "Cancelled"
  },

  {
    id: 3,

    train: "Shatabdi Express",
    trainNo: "12007",

    from: "Chennai",
    to: "Mysore",

    journeyDate: "25 May 2026",

    departure: "05:30 AM",
    arrival: "01:00 PM",

    passenger: "Deepa",

    seats: 3,

    coach: "C1",

    seatNumbers: ["10", "11", "12"],

    bookingId: "TR98134",

    amount: 2550,

    status: "Confirmed"
  }

];