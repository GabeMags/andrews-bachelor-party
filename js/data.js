const PARTY = {
  title: "Andrew's Bachelor Party",
  dateDisplay: "Sunday, July 5, 2026",
  dateISO: "2026-07-05T09:00:00-07:00",
  guestCount: 6,
  payment: {
    venmo: { handle: "@GabrielMagallanes", username: "GabrielMagallanes" }
  },
  schedule: [
    {
      id: "mass",
      type: "event",
      icon: "⛪",
      title: "Mass",
      venue: "St. Therese of Lisieux Catholic Church",
      location: "Alhambra, CA",
      start: "09:00",
      end: "10:00",
      status: "confirmed",
      cost: 0,
      notes: "Also the wedding venue."
    },
    {
      id: "drive1",
      type: "travel",
      icon: "🚗",
      title: "Drive to Rancho Cucamonga",
      duration: "~45 min",
      notes: "~39 min with no traffic — buffer added for Sunday late-morning traffic on the 10/210."
    },
    {
      id: "lunch",
      type: "event",
      icon: "🥩",
      title: "Lunch",
      venue: "THE CUT",
      location: "Rancho Cucamonga, CA",
      start: "11:30",
      end: "13:00",
      status: "tentative",
      cost: 35,
      notes: "No reservation yet — location can change."
    },
    {
      id: "drive2",
      type: "travel",
      icon: "🚗",
      title: "Drive to Klatch Coffee",
      duration: "~10 min"
    },
    {
      id: "coffee",
      type: "event",
      icon: "☕",
      title: "Coffee",
      venue: "Klatch Coffee Roasting",
      location: "8916 Foothill Blvd, Rancho Cucamonga, CA",
      start: "13:10",
      end: "13:40",
      status: "confirmed",
      cost: 8,
      notes: "Andrew's pick — a real specialty coffee roastery, worth the short detour."
    },
    {
      id: "drive3",
      type: "travel",
      icon: "🚗",
      title: "Drive to Victoria Gardens",
      duration: "~10 min"
    },
    {
      id: "game",
      type: "event",
      icon: "🎮",
      title: "Immersive Gamebox",
      venue: "Immersive Gamebox",
      location: "Victoria Gardens, Rancho Cucamonga, CA",
      start: "13:50",
      end: "15:20",
      status: "tentative",
      cost: 45,
      notes: "90-min package (60-min game + 30-min add-on)."
    },
    {
      id: "walk1",
      type: "travel",
      icon: "🚶",
      title: "Walk to The Escape Game",
      duration: "~5 min",
      notes: "Same shopping complex."
    },
    {
      id: "escape",
      type: "event",
      icon: "🔐",
      title: "The Escape Game",
      venue: "The Escape Game",
      location: "12549 N Mainstreet, Rancho Cucamonga, CA",
      start: "15:25",
      end: "16:40",
      status: "tentative",
      cost: 42,
      notes: "60-min escape room + briefing/wrap-up. Replaces the VR arena, which has since closed."
    },
    {
      id: "freetime",
      type: "event",
      icon: "🛍️",
      title: "Free Time",
      venue: "Victoria Gardens",
      location: null,
      start: "16:40",
      end: "17:25",
      status: "confirmed",
      cost: 0,
      notes: "Shops, walk around, breathe before dinner."
    },
    {
      id: "walk2",
      type: "travel",
      icon: "🚶",
      title: "Walk to Fogo de Chão",
      duration: "~5 min"
    },
    {
      id: "dinner",
      type: "event",
      icon: "🍖",
      title: "Dinner",
      venue: "Fogo de Chão",
      location: "12240 Foothill Blvd, Rancho Cucamonga, CA",
      start: "17:30",
      end: "19:00",
      status: "tentative",
      cost: 75,
      notes: "No reservation yet."
    },
    {
      id: "drive4",
      type: "travel",
      icon: "🚗",
      title: "Drive to La Verne",
      duration: "~20 min",
      notes: "~17 min with no traffic."
    },
    {
      id: "house",
      type: "event",
      icon: "🃏",
      title: "Poker, Cigars & Guitars",
      venue: "Private House",
      location: "📍 Address sent separately",
      start: "19:20",
      end: "22:00",
      status: "confirmed",
      cost: 0,
      notes: "Free. Side bets at the poker table are fair game if you're into it — no obligation though.",
      noDirections: true
    }
  ]
};
