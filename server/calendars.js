const calendars = [
  {
    name: "Chacao",
    estado: "Caracas",
    url: "https://www.airbnb.co.ve/calendar/ical/1385011718927994475.ics?t=d8638dacb1de4975a8145b25c68b2d50",
    esteiUrl: null,
    capacity: 4,
    rooms: 2,
    baths: 1,
    airbnbLink: "https://airbnb.com/h/chacaoccs",
    esteiLink: "https://surl.lu/cnsvgv",
    airbnb: {
      pricePerNight: 85,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 120,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  },
    {
    name: "Boleita",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1343681520860355629.ics?s=a2d96f7fe387a7d3e27ce41d275f4a33&locale=es-XL",
    capacity: 2,
    rooms: 1,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/l/KQlHkFXF",
    esteiLink:  "https://short-url.org/1f00f ",
    airbnb: {
      pricePerNight: 55,
      cleaningFee: 45,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
       platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 47,
      platformFeePercentage: 0.15 // 13.05%
    },
  },
  {
    name: "Sebucán 2",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/964770823228978238.ics?s=18f5ceadceadf4e409822ee1c533f555&locale=en",
    capacity: 3,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/sebucanii",
    esteiLink: "https://surl.li/fxdhwn",
    airbnb: {
      pricePerNight: 55,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Paraíso",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1442428798352266133.ics?s=32dd2a635d95604c8754d606ac0ba4a2&locale=en",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "airbnb.com/h/elparaisoccs",
    esteiLink: "https://surl.lu/lefqgb",
    airbnb: {
      pricePerNight: 50,
      cleaningFee: 55,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.10,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 100,
      cleaningFee: 65,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Campiña",
     estado: "Caracas",
    url: "https://www.airbnb.co.ve/calendar/ical/1052345592684699011.ics?t=4ad6972b941b45dd9f46c83f8c31365a",
    capacity: 4,
    rooms: 2,
    baths: 2,
    airbnbLink: "airbnb.com/h/lacampinaccs",
    esteiLink: "https://goo.su/orcTbU",
    airbnb: {
      pricePerNight: 65,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 90,
      cleaningFee: 52,
      platformFeePercentage: 0.15
    },
  },

  {
    name: "Sebucán 1",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/40759881.ics?s=e236ee10e178f24d224d1ea7f9e12925&locale=en",
    capacity: 5,
    rooms: 2,
    baths: 1,
    airbnbLink: "airbnb.com/h/aptosebucanccs",
    esteiLink: "https://goo.su/oie40",
    airbnb: {
      pricePerNight: 60,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 52,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Castellana",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1052345592684699011.ics?s=b39c437d942da1cb8375fbd233e671a1&locale=en",
    capacity: 3,
    rooms: 1,
    baths: 1.5,
    airbnbLink: "airbnb.com/h/lacastellanaccs",
    esteiLink: "https://surl.lu/iozjba",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 45,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 110,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "POZ",
     estado: "POZ",
    url: "https://www.airbnb.com/calendar/ical/1419766431038404560.ics?s=9fe0c131ba2c39be3af7230db3461881&locale=en",
    capacity: 4,
    rooms: 2,
    baths: 2,
    airbnbLink: "airbnb.com/h/poz",
    esteiLink: "https://surl.lu/vszytm",
    airbnb: {
      pricePerNight: 60,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  },
   {
    name: "POZ 2 ",
     estado: "POZ",
    url: "https://www.airbnb.com/calendar/ical/1467815969855169714.ics?s=b2a411c1c5424fc37148794fc767788f&locale=es-XL",
    capacity: 4,
    rooms: 1,
    baths: 1.5,
    airbnbLink: "https://www.airbnb.com/l/inVVDYqF",
    esteiLink: "",
    airbnb: {
      pricePerNight: 50,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Trinidad",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/776060327262601969.ics?s=cb72b5158ad102d5754c8e8f0e81f693&locale=en",
    capacity: 5,
    rooms: 2,
    baths: 2,
    airbnbLink: "airbnb.com/h/latrinidadccs",
    esteiLink: "https://goo.su/HMKHf",
    airbnb: {
      pricePerNight: 50,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Altamira 2",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1376869011851689626.ics?s=143f61f625f9871c9445dd846750b66e&locale=en",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "airbnb.com/h/altamiraccs2",
    esteiLink: "https://surl.li/ktbyuw",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 55,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 140,
      cleaningFee: 62,
      platformFeePercentage: 0.15
    },
  },
  
  {
    name: "Rosal 2",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1373858155228586698.ics?s=a184d3528e9f3531fe05dad8faf344d5&locale=en",
    capacity: 3,
    rooms: 1,
    baths: 2,
    airbnbLink: "airbnb.com/h/elrosalccs2",
    esteiLink: "https://surl.li/veqvvk",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 45,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 120,
      cleaningFee: 52,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Bosque",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/636792226561707165.ics?s=624b00af94ab746c0fda9e260815c4ff&locale=en",
    capacity: 2,
    rooms: 1,
    baths: 2,
    airbnbLink: "airbnb.com/h/elbosqueccs",
    esteiLink: "https://surl.lu/fazirv",
    airbnb: {
      pricePerNight: 65,
      cleaningFee: 45,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.10
    },
    estei: {
      pricePerNight: 90,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Campo Alegre",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1041478066555189255.ics?s=9eafad6bbfe0f40f8ef3db4df0d47177&locale=en",
    capacity: 3,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/campoalegreccs",
    esteiLink: "https://surl.li/oewjkf",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 45,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 120,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Rosal",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1184965554998685991.ics?s=0ef8c9534f70a74ace217830dd15203e&locale=en",
    capacity: 2,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/elrosalccs",
    esteiLink: "https://surl.li/qeapdw",
    airbnb: {
      pricePerNight: 75,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 100,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  },
    {
    name: "Rosal3",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1486888471879683465.ics?s=34dd75f8aeb08666e2183229ef88af32&locale=es-XL",
    capacity: 5,
    rooms: 2,
    baths: 2,
    airbnbLink: "airbnb.com/h/rosal3-2hab",
    esteiLink: "https://surl.lt/vffsdo",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 50,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 100,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Altamira 1",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/968382219685565525.ics?s=e625583fa5cfc2188515639424cac8a1&locale=en",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "airbnb.com/h/lafloresta-altamira",
    esteiLink: "https://surl.li/etwute",
    airbnb: {
      pricePerNight: 70,
      cleaningFee: 50,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 100,
      cleaningFee: 57,
      platformFeePercentage: 0.15
    },
  },

  // ----------------------------- Margarita -----------------------------
  {
    name: "Margarita 1",
    estado: "Margarita",
    url: "https://www.airbnb.com/calendar/ical/1108208845727458623.ics?s=1ef7124628fe666c8ab5cd7ac8964a5b&locale=en",
    capacity: 5,
    rooms: 2,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/l/Lwvqrtz5",
    esteiLink: "#",
    airbnb: {
      pricePerNight: 49,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 85,
      cleaningFee: 42,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Margarita 2",
    estado: "Margarita",
    url: "https://www.airbnb.com/calendar/ical/1303210845707936867.ics?s=5233af9f7d3c6bf62ec0bd688f57182d&locale=en",
    capacity: 6,
    rooms: 2,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/l/Ul8TUZZ6",
    esteiLink: "#",
    airbnb: {
      pricePerNight: 80,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.10,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 100,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  },

  // ----------------------------- La Guaira -----------------------------
  {
    name: "La Guaira",
    estado: "La Guaira",
    url: "https://www.airbnb.com/calendar/ical/943785244844973207.ics?s=76642b6add65ffeac42bc7977c4324b5&locale=en",
    capacity: 5,
    rooms: 2,
    baths:2,
    airbnbLink: "https://www.airbnb.com/l/WlpePz5e",
    esteiLink: "#",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.10,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 85,
      cleaningFee: 42,
      platformFeePercentage: 0.15
    },
  },

  // ----------------------------- Poz (nuevo) -----------------------------
  {
    name: "Poz Isabellla",
    estado: "POZ",
    url: "https://www.airbnb.com/calendar/ical/979794923757351625.ics?s=3d9e5476cfa447b17e55000fc0aab93b&locale=en",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/l/x3VtyZDq",
    esteiLink: "https://surl.li/scjhju",
    airbnb: {
      pricePerNight: 55,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 85,
      cleaningFee: 47,
      platformFeePercentage: 0.15
    },
  }
,
  {
    name: "Cabudare",
    estado: "Barquisimeto",
    url: "https://www.airbnb.com/calendar/ical/1545049910848115258.ics?t=4d5db8850d614a78bfb1e59301f7b412&locale=es-XL",
    esteiUrl: "https://api.estei.app/api/calendars/3200063677-stay-17661842698973151059.ics",
    capacity: 6,
    rooms: 2,
    baths: 2,
    airbnbLink: "https://airbnb.com/h/cabudare",
    esteiLink: "https://estei.app/stay/17661842698973151059/profile",
    airbnb: {
      pricePerNight: 65,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 3,
      discountWeek: 0,
      discountMonth: 0,
      platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 110,
      cleaningFee: 45,
      platformFeePercentage: 0.15
    }
  },
  {
    name: "Bqto - Aeropuerto",
    estado: "Barquisimeto",
    url: "https://www.airbnb.com/calendar/ical/1477157897191458411.ics?t=926ce559fe304df0a958b9460a7e6660&locale=es-XL",
    esteiUrl: "https://api.estei.app/api/calendars/1116721807-stay-17623544190746887185.ics",
    capacity: 7,
    rooms: 3,
    baths: 4,
    airbnbLink: "https://es-l.airbnb.com/rooms/1477157897191458411",
    esteiLink: "https://estei.app/stay/17623544190746887185/profile",
    airbnb: {
      pricePerNight: 65,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 3,
      discountWeek: 0,
      discountMonth: 0,
      platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 145,
      cleaningFee: 15,
      platformFeePercentage: 0.15
    }
  },
  {
    name: "Bqto - El Pedregal",
    estado: "Barquisimeto",
    url: "https://www.airbnb.com/calendar/ical/1742790075940529000.ics?t=b42f62e4ee734e539408bf6bc33b7feb&locale=es-XL",
    esteiUrl: null,
    capacity: 5,
    rooms: 2,
    baths: 2,
    airbnbLink: "https://es-l.airbnb.com/rooms/1742790075940529000",
    esteiLink: null,
    airbnb: {
      pricePerNight: 85,
      cleaningFee: 35,
      extraGuestFeePerNight: 0,
      maxGuestsIncluded: 5,
      discountWeek: 0,
      discountMonth: 0,
      platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 120,
      cleaningFee: 45,
      platformFeePercentage: 0.15
    }
  },
  {
    name: "Bqto - Monte Real",
    estado: "Barquisimeto",
    url: "https://www.airbnb.com/calendar/ical/1705444277231632043.ics?t=2de32d1a242c45a2a62951469eb3c1c3&locale=es-XL",
    esteiUrl: null,
    capacity: 6,
    rooms: 2,
    baths: 2,
    airbnbLink: "https://es-l.airbnb.com/rooms/1705444277231632043",
    esteiLink: null,
    airbnb: {
      pricePerNight: 75,
      cleaningFee: 15,
      extraGuestFeePerNight: 0,
      maxGuestsIncluded: 6,
      discountWeek: 0,
      discountMonth: 0,
      platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: null,
      cleaningFee: null,
      platformFeePercentage: 0.15
    }
  },
  {
    name: "Bqto - Aeropuerto II",
    estado: "Barquisimeto",
    url: "https://www.airbnb.com/calendar/ical/1494140663126142099.ics?t=fbd63d2159324890bda29d5cf0cc6981&locale=es-XL",
    esteiUrl: "https://api.estei.app/api/calendars/1567321451-stay-17872696802590506410.ics",
    capacity: 12,
    rooms: 3,
    baths: 3,
    airbnbLink: "https://www.airbnb.com/h/bqtoaeropuerto2",
    esteiLink: "https://estei.app/stay/17872696802590506410/profile",
    airbnb: {
      pricePerNight: 60,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0,
      discountMonth: 0,
      platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 140,
      cleaningFee: 45,
      platformFeePercentage: 0.15
    }
  },
  {
    name: "Bqto - Pozo Blanco",
    estado: "Barquisimeto",
    url: "https://www.airbnb.com/calendar/ical/1408677551533094760.ics?t=7482cbdfde994472b6d1c2c94be45497&locale=es-XL",
    esteiUrl: "https://api.estei.app/api/calendars/4241910998-stay-17873521842414594647.ics",
    capacity: 7,
    rooms: 3,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/h/bqtopozoblanco",
    esteiLink: "https://estei.app/stay/17873521842414594647/profile",
    airbnb: {
      pricePerNight: 80,
      cleaningFee: 25,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0,
      discountMonth: 0,
      platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 120,
      cleaningFee: 45,
      platformFeePercentage: 0.15
    }
  },
  {
    name: "Mgta - Playa El Angel 1",
    estado: "Margarita",
    url: "https://www.airbnb.com/calendar/ical/1291392237582387437.ics?t=2c10658f74174867b21fc828d5cdad67",
    esteiUrl: "https://api.estei.app/api/calendars/2971641759-stay-17891306388317592823.ics",
    capacity: 5,
    rooms: 2,
    baths: 2,
    airbnbLink: "https://airbnb.com/h/mgtaplayaelangel1",
    esteiLink: "https://surl.li/esteimgtaplayaelangel1",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 35,
      extraGuestFeePerNight: 0,
      maxGuestsIncluded: 5,
      discountWeek: 0,
      discountMonth: 0,
      platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 120,
      cleaningFee: 55,
      platformFeePercentage: 0.15
    }
  },
  {
    name: "Mgta - Playa El Angel 2",
    estado: "Margarita",
    url: "https://www.airbnb.com/calendar/ical/1291280896133732435.ics?t=6df097eeca454d73b577bafbc8202e53",
    esteiUrl: "https://api.estei.app/api/calendars/3994542871-stay-17893508142605805992.ics",
    capacity: 5,
    rooms: 2,
    baths: 2,
    airbnbLink: "https://airbnb.com/h/mgtaplayaelangel2",
    esteiLink: "https://surl.li/esteimgtaplayaelangel2",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 35,
      extraGuestFeePerNight: 0,
      maxGuestsIncluded: 5,
      discountWeek: 0,
      discountMonth: 0,
      platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 120,
      cleaningFee: 55,
      platformFeePercentage: 0.15
    }
  },
  {
    name: "Base Aragua - Parque Choroni 3",
    estado: "Maracay",
    url: "https://es.airbnb.com/calendar/ical/915929743193024221.ics?t=56bfe76b72e64b98b8e3e1b805d74b8a",
    esteiUrl: "https://estei.nyc3.digitaloceanspaces.com/stg/ical/2301126440-stay-17364515228003869012.ics",
    capacity: 4,
    rooms: 2,
    baths: 2,
    airbnbLink: "https://es.airbnb.com/hosting/listings/editor/915929743193024221/view-your-space",
    esteiLink: "https://surl.li/mcyparque",
    airbnb: {
      pricePerNight: 70,
      cleaningFee: 35,
      extraGuestFeePerNight: 15,
      maxGuestsIncluded: 5,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 70,
      cleaningFee: 37,
      platformFeePercentage: 0.15
    }
  },
  {
    name: "San Jacinto II MCY",
    estado: "Maracay",
    url: "https://www.airbnb.com/calendar/ical/1411732896711046461.ics?t=02a3f17c041b442c930583f5de71954f&locale=es-XL",
    esteiUrl: "https://estei.nyc3.digitaloceanspaces.com/stg/ical/1292278534-stay-17464790159203345592.ics",
    capacity: 10,
    rooms: 4,
    baths: 5,
    airbnbLink: "https://es-l.airbnb.com/rooms/1411732896711046461?viralityEntryPoint=1&s=76",
    esteiLink: "https://estei.app/stay/17464790159203345592/profile?guests=6&arrival_date=2025-12-25&departure_date=2025-12-27",
    airbnb: {
      pricePerNight: 170,
      cleaningFee: 25,
      extraGuestFeePerNight: 15,
      maxGuestsIncluded: 7,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 200,
      cleaningFee: 37,
      platformFeePercentage: 0.15
    }
  }
];






module.exports = calendars;
