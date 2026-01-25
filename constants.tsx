
import React from 'react';

export const TRANSLATIONS = {
  en: {
    title: "TN Bus Expert",
    subtitle: "Every route, every village, every bus.",
    detecting: "Detecting your location...",
    findBus: "Finding buses near you...",
    arrivingIn: "Arriving in",
    mins: "mins",
    live: "LIVE",
    route: "Route",
    trips: "Trips/Day",
    firstLast: "First/Last",
    walkToRoute: "Walk to Route",
    noBuses: "No buses detected on this road segment yet.",
    changeLang: "தமிழ்",
    searchPlaceholder: "Search destination...",
    loadingInfo: "Using AI to analyze road segments...",
    tabs: {
      nearby: "Nearby",
      search: "Search Route",
      board: "Bus Stand Board"
    },
    search: {
      from: "From (Source)",
      to: "To (Destination)",
      btn: "Check All Buses",
      results: "Buses on this route",
      total: "Total Buses",
      freq: "Frequency: every"
    },
    board: {
      placeholder: "Enter Bus Stand Name (e.g. Trichy Central, Lalpet Stand)",
      btn: "Show Timing Board",
      departures: "DEPARTURES",
      destination: "DESTINATION",
      time: "SCHED. TIME",
      status: "STATUS",
      ontime: "ON TIME",
      delayed: "DELAYED"
    }
  },
  ta: {
    title: "தமிழ்நாடு பஸ் நிபுணர்",
    subtitle: "ஒவ்வொரு வழித்தடமும், ஒவ்வொரு கிராமமும், ஒவ்வொரு பேருந்தும்.",
    detecting: "உங்கள் இருப்பிடத்தைக் கண்டறிகிறது...",
    findBus: "உங்களுக்கு அருகிலுள்ள பேருந்துகளைத் தேடுகிறது...",
    arrivingIn: "வருகை நேரம்",
    mins: "நிமிடங்கள்",
    live: "நேரடி",
    route: "வழித்தடம்",
    trips: "பயணங்கள்/நாள்",
    firstLast: "முதல்/கடைசி",
    walkToRoute: "வழித்தடத்திற்குச் செல்லுங்கள்",
    noBuses: "இந்தச் சாலைப் பகுதியில் இன்னும் பேருந்துகள் கண்டறியப்படவில்லை.",
    changeLang: "English",
    searchPlaceholder: "இலக்கைத் தேடுங்கள்...",
    loadingInfo: "சாலைப் பகுதிகளை ஆய்வு செய்ய AI ஐப் பயன்படுத்துகிறது...",
    tabs: {
      nearby: "அருகிலுள்ளவை",
      search: "வழித்தடத் தேடல்",
      board: "பேருந்து நிலைய பலகை"
    },
    search: {
      from: "கிளம்பும் இடம்",
      to: "சேருமிடம்",
      btn: "அனைத்து பேருந்துகளையும் சரிபார்க்கவும்",
      results: "இந்த வழித்தடத்தில் உள்ள பேருந்துகள்",
      total: "மொத்த பேருந்துகள்",
      freq: "அதிர்வெண்: ஒவ்வொரு"
    },
    board: {
      placeholder: "பேருந்து நிலையத்தின் பெயரை உள்ளிடவும்",
      btn: "நேரப் பலகையைக் காட்டு",
      departures: "புறப்பாடுகள்",
      destination: "சேருமிடம்",
      time: "நேரம்",
      status: "நிலை",
      ontime: "சரியான நேரம்",
      delayed: "தாமதம்"
    }
  }
};

export const SAMPLE_BUSES = [
  {
    id: "route-1",
    busNumber: "21G",
    name: "Broadway to Vandalur",
    type: "MTC (Chennai City)",
    source: "Broadway",
    destination: "Vandalur Zoo",
    firstBus: "05:00 AM",
    lastBus: "10:30 PM",
    tripsPerDay: 48,
    imageUrl: "https://picsum.photos/seed/bus1/400/300",
  },
  {
    id: "route-2",
    busNumber: "P-45",
    name: "Rural Express",
    type: "Private Bus",
    source: "Kattumannarkoil",
    destination: "Lalpet",
    firstBus: "06:15 AM",
    lastBus: "08:45 PM",
    tripsPerDay: 12,
    imageUrl: "https://picsum.photos/seed/bus2/400/300",
  }
];
