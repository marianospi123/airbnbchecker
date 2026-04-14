import ICAL from "ical.js";
import React, {   } from 'react';
import CalendarioPropiedad from './calendariopropiedad';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './App.css';
import Reservas from "./components/excel"; // o donde esté tu archivo Reservas.js
import  { useState, useEffect } from "react";
import ReservasAdmin from "./components/ReservasAdmin";




const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://airbnbchecker-4.onrender.com"
  : "http://localhost:4004";


const calendars = [
  
      {
    name: "Boleita",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1343681520860355629.ics?s=a2d96f7fe387a7d3e27ce41d275f4a33&locale=es-XL",
    esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/1996747011-stay-17382856932068656972.ics",
    capacity: 4,
    rooms: 1,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/l/KQlHkFXF",
    esteiLink:  "https://surl.li/esteiboleita",
    airbnb: {
      pricePerNight: 60,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 3,
      discountWeek: 0.05,
      discountMonth: 0.15,
       platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 40,
      platformFeePercentage: 0.15 // 13.05%
    },
  },
  {
    name: "Sebucán 2",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/964770823228978238.ics?s=18f5ceadceadf4e409822ee1c533f555&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/4173194429-stay-17324639709782356499.ics",
    capacity: 3,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/sebucanii",
    esteiLink: "https://surl.li/esteisebucan2",
    airbnb: {
      pricePerNight: 55,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },
  {
  name: "Mañongo - Sambil (Sun Suites)",
  estado: "Valencia",
  url: "https://www.airbnb.com/calendar/ical/1333342504443328914.ics?t=af791a38a9ed45f6a6d9c104e628c3f4",
  esteiUrl: "https://estei.nyc3.digitaloceanspaces.com/stg/ical/2531490531-stay-17677585276339368129.ics",
  capacity: 4,
  rooms: 2,
  baths: 2,
  airbnbLink: "https://airbnb.co.ve/h/naguanagua",
  esteiLink: "https://surl.li/esteivalencia",
  airbnb: {
    pricePerNight: 45,
    cleaningFee: 30,
    extraGuestFeePerNight: 5,
    maxGuestsIncluded: 2,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 65,
    cleaningFee: 40,
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
    cleaningFee: 30,
    extraGuestFeePerNight: 15,
    maxGuestsIncluded: 5,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 70,
    cleaningFee: 30,
    platformFeePercentage: 0.15
  }
},


  {
    name: "Paraíso",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1442428798352266133.ics?s=32dd2a635d95604c8754d606ac0ba4a2&locale=en",
    esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/2928268937-stay-17503280947540278330.ics",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "airbnb.com/h/elparaisoccs",
    esteiLink: "https://surl.li/esteiparaiso",
    airbnb: {
      pricePerNight: 55,
      cleaningFee: 50,
      extraGuestFeePerNight: 7,
      maxGuestsIncluded: 2,
      discountWeek: 0.10,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 50,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Chacao",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1385011718927994475.ics?s=4e4d11b7c6db289a9012851c43364d23&locale=en",
    esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/1473257424-stay-17432889927468941438.ics",
    capacity: 4,
    rooms: 2,
    baths: 1,
    airbnbLink: "airbnb.com/h/chacaoccs",
    esteiLink:  "https://surl.li/mzmqcd",
    airbnb: {
      pricePerNight: 85,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
       platformFeePercentage: 0.1411
    },
    estei: {
      pricePerNight: 120,
      cleaningFee: 40,
      platformFeePercentage: 0.15 // 13.05%
    },
  },
  {
    name: "Campiña",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1332629584763087489.ics?s=d90bafbfe647f3451520a54fc98d2522&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/144124055-stay-17362995794045266032.ics",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "airbnb.com/h/lacampinaccs",
    esteiLink: "https://surl.li/esteicampina",
    airbnb: {
      pricePerNight: 65,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 90,
      cleaningFee: 45,
      platformFeePercentage: 0.15
    },
  },

  {
  name: "El Rosal 4",
  estado: "Caracas",
  url: "https://es.airbnb.com/calendar/ical/1581880326729488561.ics?t=913e6becc4da4b3cb7396ee91f40d05a",
  esteiUrl: "https://estei.nyc3.digitaloceanspaces.com/stg/ical/3965638750-stay-17662696694553345998.ics",
  capacity: 4,
  rooms: 1,
  baths: 1,
  airbnbLink: "https://airbnb.com/h/elrosal4",
  esteiLink: "https://surl.li/esteirosal4",
  airbnb: {
    pricePerNight: 80,
    cleaningFee: 45,
    extraGuestFeePerNight: 10,
    maxGuestsIncluded: 2,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 130,
    cleaningFee: 55,
    platformFeePercentage: 0.15
  }
},


  {
    name: "Sebucán 1",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/40759881.ics?s=e236ee10e178f24d224d1ea7f9e12925&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/2914190771-stay-17322691782694977756.ics",
    capacity: 5,
    rooms: 2,
    baths: 1,
    airbnbLink: "airbnb.com/h/aptosebucanccs",
    esteiLink: "https://surl.li/esteisebucan1",
    airbnb: {
      pricePerNight: 60,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 45,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Castellana",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1052345592684699011.ics?s=b39c437d942da1cb8375fbd233e671a1&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/257750876-stay-17339822030440348612.ics",
    capacity: 3,
    rooms: 1,
    baths: 1.5,
    airbnbLink: "airbnb.com/h/lacastellanaccs",
    esteiLink: "https://surl.li/esteicastellana",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 110,
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "POZ",
     estado: "POZ",
    url: "https://www.airbnb.com/calendar/ical/1419766431038404560.ics?s=9fe0c131ba2c39be3af7230db3461881&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/2214294779-stay-17501850674216020372.ics",
    capacity: 4,
    rooms: 2,
    baths: 2,
    airbnbLink: "airbnb.com/h/poz",
    esteiLink: "https://surl.lu/vszytm",
    airbnb: {
      pricePerNight: 60,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },

  {
    name: "Trinidad",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/776060327262601969.ics?s=cb72b5158ad102d5754c8e8f0e81f693&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/730506826-stay-17332148220206977372.ics",
    capacity: 5,
    rooms: 2,
    baths: 2,
    airbnbLink: "airbnb.com/h/latrinidadccs",
    esteiLink: "https://surl.li/esteitrinidad",
    airbnb: {
      pricePerNight: 50,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 80,
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Altamira 2",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1376869011851689626.ics?s=143f61f625f9871c9445dd846750b66e&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/1855016593-stay-17422034755364752882.ics",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "airbnb.com/h/altamiraccs2",
    esteiLink: "https://surl.li/esteialtamira2",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 50,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 140,
      cleaningFee: 55,
      platformFeePercentage: 0.15
    },
  },
  
  {
    name: "Rosal 2",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1373858155228586698.ics?s=a184d3528e9f3531fe05dad8faf344d5&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/3178869625-stay-17411824245292709348.ics",
    capacity: 3,
    rooms: 1,
    baths: 2,
    airbnbLink: "airbnb.com/h/elrosalccs2",
    esteiLink: "https://surl.li/esteirosal2",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 120,
      cleaningFee: 45,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Bosque",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/636792226561707165.ics?s=624b00af94ab746c0fda9e260815c4ff&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/2484821531-stay-17284832244356034483.ics",
    capacity: 2,
    rooms: 1,
    baths: 2,
    airbnbLink: "airbnb.com/h/elbosqueccs",
    esteiLink: "https://surl.li/esteibosque",
    airbnb: {
      pricePerNight: 65,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.10
    },
    estei: {
      pricePerNight: 90,
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Campo Alegre",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1041478066555189255.ics?s=9eafad6bbfe0f40f8ef3db4df0d47177&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/3122756129-stay-17333322201196982163.ics",
    capacity: 3,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/campoalegreccs",
    esteiLink: "https://surl.li/esteicampoalegre",
    airbnb: {
      pricePerNight: 90,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 120,
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Rosal",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1184965554998685991.ics?s=0ef8c9534f70a74ace217830dd15203e&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/1334933393-stay-17334886485220080855.ics",
    capacity: 2,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/elrosalccs",
    esteiLink: "https://surl.li/esteirosal",
    airbnb: {
      pricePerNight: 75,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.15,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 100,
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },
    {
    name: "Rosal3",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1486888471879683465.ics?s=34dd75f8aeb08666e2183229ef88af32&locale=es-XL",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/1855876766-stay-17551817479231016224.ics",
    capacity: 5,
    rooms: 2,
    baths: 2,
    airbnbLink: "airbnb.com/h/rosal3-2hab",
    esteiLink: "https://surl.li/esteirosal3",
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
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Altamira 1",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/968382219685565525.ics?s=e625583fa5cfc2188515639424cac8a1&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/2474076535-stay-17325007819524651943.ics",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "airbnb.com/h/lafloresta-altamira",
    esteiLink: "https://surl.li/esteialtamira1",
    airbnb: {
      pricePerNight: 70,
      cleaningFee: 45,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 105,
      cleaningFee: 50,
      platformFeePercentage: 0.15
    },
  },

  {
    name: "Barquisimeto",
    estado: "Barquisimeto",
    url: "https://www.airbnb.com/calendar/ical/1329992387476344688.ics?s=240d6400f1397c4acbfb22187cc80029&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/3761257520-stay-17361284393152580414.ics",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/l/qr0k7RQY",
    esteiLink: "https://surl.li/esteibqto",
    airbnb: {
      pricePerNight: 60,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 100,
      cleaningFee: 40,
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
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 85,
      cleaningFee: 35,
      platformFeePercentage: 0.15
    },
  },

  // ----------------------------- La Guaira -----------------------------
  {
    name: "La Guaira",
    estado: "La Guaira",
    url: "https://www.airbnb.com/calendar/ical/943785244844973207.ics?s=76642b6add65ffeac42bc7977c4324b5&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/4238222494-stay-17362578953146424770.ics",
    capacity: 5,
    rooms: 2,
    baths:2,
    airbnbLink: "https://www.airbnb.com/l/WlpePz5e",
    esteiLink: "https://estei.app/stay/17362578953146424770/profile?guests=1&arrival_date=2026-02-01&departure_date=2026-02-03",
    airbnb: {
      pricePerNight: 120,
      cleaningFee: 45,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.10,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 150,
      cleaningFee: 50,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "La Soledad - Mcy",
    estado: "Maracay",
    url: "https://www.airbnb.com/calendar/ical/1257351696352930087.ics?t=4c937bf3113147ef888cd226e28d82f1&locale=es-XL",
    esteiUrl: "https://estei.nyc3.digitaloceanspaces.com/stg/ical/394272640-stay-17471411218787671669.ics",
    capacity: 4,
    rooms: 2,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/h/lasoledadmcy",
    esteiLink: "https://estei.app/stay/17754790055589832972/profile",
    airbnb: {
      pricePerNight: 60,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 3,
      discountWeek: 0.05, // Valor estándar, ajustar si aplica
      discountMonth: 0.10, // Valor estándar, ajustar si aplica
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 100,
      cleaningFee: 45,
      platformFeePercentage: 0.15
    },
    observaciones: "No colocar fachada del edificio para publicidad",
  },
 

  // ----------------------------- Poz (nuevo) -----------------------------
  {
    name: "Poz 3",
    estado: "POZ",
    url: "https://www.airbnb.com/calendar/ical/979794923757351625.ics?s=3d9e5476cfa447b17e55000fc0aab93b&locale=en",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/l/x3VtyZDq",
    esteiLink: "https://surl.li/scjhju",
    airbnb: {
      pricePerNight: 55,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 85,
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },


 {
  name: "Apartamento Panorámico con Planta Eléctrica y Pozo",
  estado: "Maracaibo",
  url: "https://www.airbnb.co.ve/calendar/ical/1236421312796299870.ics?s=a6ceab9ad1e1ae6146b2f39dd5082d6d",
   esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/1421191605-stay-17377878151510675621.ics",
  capacity: 9,
  rooms: 5,
  baths: 5.5,
  airbnbLink: "https://airbnb.co.ve/h/cdl8",
  esteiLink: "https://estei.app/stay/17377878151510675621/profile",
  airbnb: {
    pricePerNight: 100,
    cleaningFee: 35,
    extraGuestFeePerNight: 15,
    maxGuestsIncluded: 1,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 140,
    cleaningFee: 45,
    platformFeePercentage: 0.15
  },
},

{
  name: "Acogedor apto - cocina equipada",
  estado: "Maracaibo",
  url: "https://www.airbnb.co.ve/calendar/ical/1389198391472630431.ics?s=9d69d8e04a6ba73d4c12e3336f5139fe",
   esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/3533338522-stay-17483089366375025123.ics",
  capacity: 4,
  rooms: 2,
  baths: 1,
  airbnbLink: "https://airbnb.co.ve/h/buritaca7",
  esteiLink: "https://estei.app/stay/17483089366375025123/profile",
  airbnb: {
    pricePerNight: 45,
    cleaningFee: 25,
    extraGuestFeePerNight: 7,
    maxGuestsIncluded: 1,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 51,
    cleaningFee: 35,
    platformFeePercentage: 0.15
  },
},
{
  name: "Apartamento moderno y seguro en Viento Norte",
  estado: "Maracaibo",
  url: "https://www.airbnb.co.ve/calendar/ical/1428495104850535793.ics?s=67c22f50814cbf351d6b51872c1fb1b4",
   esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/2698274004-stay-17481197854059978676.ics",
  capacity: 4,
  rooms: 2,
  baths: 2,
  airbnbLink: "https://airbnb.co.ve/h/islanorte",
  esteiLink: "https://estei.app/stay/17481197854059978676/profile",
  airbnb: {
    pricePerNight: 55,
    cleaningFee: 25,
    extraGuestFeePerNight: 7,
    maxGuestsIncluded: 1,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 55,
    cleaningFee: 35,
    platformFeePercentage: 0.15
  },
},
{
  name: "Comodidad a pasos del Sambil - 2 hab 2 baños",
  estado: "Maracaibo",
  url: "https://www.airbnb.co.ve/calendar/ical/1527183806348918468.ics?s=039c5d57644f9b3b852b362eac5fbf71",
   esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/349832410-stay-17624979618330213286.ics",
  capacity: 7,
  rooms: 3,
  baths: 2,
  airbnbLink: "https://airbnb.co.ve/h/alejandrasofia2",
  esteiLink: "https://estei.app/stay/17624979618330213286/profile",
  airbnb: {
    pricePerNight: 36,
    cleaningFee: 25,
    extraGuestFeePerNight: 7,
    maxGuestsIncluded: 1,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 75,
    cleaningFee: 35,
    platformFeePercentage: 0.15
  },
},
{
  name: "Penthouse de Ensueño -Terraza y Vistas Panorámicas",
  estado: "Maracaibo",
  url: "https://www.airbnb.co.ve/calendar/ical/1067409956723404896.ics?s=df0a8b14727df88dc3406881d863774a",
   esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/2933938144-stay-17261876211180782474.ics",
  capacity: 8,
  rooms: 4,
  baths: 4,
  airbnbLink: "https://airbnb.co.ve/h/ph6",
  esteiLink: "https://estei.app/stay/17261876211180782474/profile",
  airbnb: {
    pricePerNight: 59,
    cleaningFee: 35,
    extraGuestFeePerNight: 15,
    maxGuestsIncluded: 1,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 145,
    cleaningFee: 45,
    platformFeePercentage: 0.15
  },
},
{
  name: "La Guaira II – PH Frente al Mar con Terraza y Acceso Directo a la Playa",
  estado: "La Guaira",
  url: "https://www.airbnb.com/calendar/ical/1297827504339510758.ics?s=eedafe1e2ba1db25c7483d102f6c9b52&locale=es-XL",
  esteiUrl: "https://estei.nyc3.digitaloceanspaces.com/stg/ical/759217472-stay-17653524748602095832.ics",
  capacity: 8,
  rooms: 3,
  baths: 4,
  airbnbLink: "https://airbnb.com/h/laguaira2",
  esteiLink: "https://estei.app/stay/17653524748602095832/profile",
  airbnb: {
    pricePerNight: 145,
    cleaningFee: 100,
    extraGuestFeePerNight: 15,
    maxGuestsIncluded: 4,
    discountWeek: 0.05,
    discountMonth: 0.20,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 250,
    cleaningFee: 130,
    platformFeePercentage: 0.15
  },
},

{
  name: "San Jacinto Duplex",
  estado: "Maracay",
  url: "https://www.airbnb.com/calendar/ical/917282052805307185.ics?s=069c885fd92d7251cafce6cf7399a133",
  esteiUrl: "https://estei.nyc3.digitaloceanspaces.com/stg/ical/3826949146-stay-17364673106311892762.ics",
  capacity: 6,
  rooms: 3,
  baths: 2,
  airbnbLink: "https://airbnb.com/h/mcysanjacinto",
  esteiLink: "https://surl.li/esteisanjacinto",
  airbnb: {
    pricePerNight: 70,
    cleaningFee: 35,
    extraGuestFeePerNight: 5,
    maxGuestsIncluded: 2,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 120,
    cleaningFee: 50,
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
    cleaningFee: 20,
    extraGuestFeePerNight: 15,
    maxGuestsIncluded: 7,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 200,
    cleaningFee: 30,
    platformFeePercentage: 0.15
  }
},
{
  name: "Costa Esmeralda 1 - Tucacas",
  estado: "Tucacas",
  url: "https://www.airbnb.com/calendar/ical/982666610125158253.ics?t=3a34661e6bfe46f6bbeec4472d420528&locale=es-XL",
  esteiUrl: "https://estei.nyc3.digitaloceanspaces.com/stg/ical/1471102895-stay-17473201623688294439.ics",
  capacity: 10,
  rooms: 2,
  baths: 2,
  airbnbLink: "https://www.airbnb.co.ve/hosting/listings/editor/982666610125158253/view-your-space",
  esteiLink: "https://estei.app/stay/17473201623688294439/settings/profile/basic-info",
  airbnb: {
    pricePerNight: 110,
    cleaningFee: 20,
    extraGuestFeePerNight: 15,
    maxGuestsIncluded: 8,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 140,
    cleaningFee: 20,
    platformFeePercentage: 0.15
  }
},

{
  name: "Costa Esmeralda 2 - Tucacas",
  estado: "Tucacas",
  url: "https://www.airbnb.com/calendar/ical/1638442866536316067.ics?t=58813a318a6d43ed91f0a7667699692d&locale=es-XL",
  esteiUrl: "https://estei.nyc3.digitaloceanspaces.com/stg/ical/3997898827-stay-17731920350168058630.ics",
  capacity: 9,
  rooms: 3,
  baths: 2,
  airbnbLink: "https://www.airbnb.co.ve/hosting/listings/editor/1638442866536316067/view-your-space",
  esteiLink: "https://estei.app/stay/17731920350168058630/profile",
  airbnb: {
    pricePerNight: 90,
    cleaningFee: 20,
    extraGuestFeePerNight: 0,
    maxGuestsIncluded: 9,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 170,
    cleaningFee: 20,
    platformFeePercentage: 0.15
  }
},
{
  name: "Cartago - Tucacas",
  estado: "Tucacas",
  url: "https://www.airbnb.com/calendar/ical/1257351696352930087.ics?t=4c937bf3113147ef888cd226e28d82f1&locale=es-XL",
  esteiUrl: "https://estei.app/stay/17471411218787671669/profile",
  capacity: 5,
  rooms: 2,
  baths: 2,
  airbnbLink: "https://www.airbnb.co.ve/hosting/listings/editor/1257351696352930087/view-your-space",
  esteiLink: "https://estei.app/stay/17471411218787671669/settings/profile/preview",
  airbnb: {
    pricePerNight: 90,
    cleaningFee: 20,
    extraGuestFeePerNight: 15,
    maxGuestsIncluded: 5,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 160,
    cleaningFee: 20,
    platformFeePercentage: 0.15
  }
},

{
  name: "Base Aragua 2",
  estado: "Maracay",
  url: "https://www.airbnb.com/calendar/ical/1578594724762798631.ics?t=bca2d74877514abead061d7b01ea1b76",
  esteiUrl: "https://estei.nyc3.digitaloceanspaces.com/stg/ical/3879173943-stay-17662372109560241497.ics",
  capacity: 6,
  rooms: 3,
  baths: 2,
  airbnbLink: "https://airbnb.com/h/basearagua2",
  esteiLink: "https://surl.li/esteibasearagua",
  airbnb: {
    pricePerNight: 70,
    cleaningFee: 35,
    extraGuestFeePerNight: 5,
    maxGuestsIncluded: 2,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 90,
    cleaningFee: 30,
    platformFeePercentage: 0.15
  }
},

{
  name: "El Bosque MCY — Bosque IV (PB con Terraza)",
  estado: "Maracay",
  url: "https://www.airbnb.com/calendar/ical/1572045439500125799.ics?s=860ebf3997bd5d51cf865381ea2624df&locale=es-XL",
  esteiUrl: "https://estei.nyc3.digitaloceanspaces.com/stg/ical/67837963-stay-17651549041258793067.ics",
  capacity: 3,
  rooms: 1,
  baths: 1,
  airbnbLink: "https://www.airbnb.com/l/BmUrVF9g",
  esteiLink: "https://estei.app/stay/17651549041258793067/profile",
  airbnb: {
    pricePerNight: 75,
    cleaningFee: 35,
    extraGuestFeePerNight: 10,
    maxGuestsIncluded: 2,
    discountWeek: 0,
    discountMonth: 0,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 70,
    cleaningFee: 30,
    platformFeePercentage: 0.15
  },
},

]







function App() {
  // Nuevo estado para guardar el estado seleccionado
   const [verReservas, setVerReservas] = useState(false);
  const [selectedEstado, setSelectedEstado] = React.useState("Caracas");

  // Estados existentes
  const [dateRange, setDateRange] = React.useState([
    { startDate: new Date(), endDate: addDays(new Date(), 1), key: "selection" },
  ]);
  const [people, setPeople] = React.useState(1);
  const [customDiscounts, setCustomDiscounts] = React.useState(() => {
    const saved = localStorage.getItem("customDiscounts");
    return saved ? JSON.parse(saved) : {};
  });
  const [discountDateRanges, setDiscountDateRanges] = React.useState(() => {
    const saved = localStorage.getItem("discountDateRanges");
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    for (const key in parsed) {
      if (parsed[key]) {
        parsed[key].startDate = new Date(parsed[key].startDate);
        parsed[key].endDate = new Date(parsed[key].endDate);
      }
    }
    return parsed;
  });
  const [showDiscounts, setShowDiscounts] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Obtengo la lista única de estados para el select (basado en el array calendars)
  const estados = React.useMemo(() => {
    const uniqueEstados = [...new Set(calendars.map((c) => c.estado))];
    return uniqueEstados;
  }, []);

  // Función para revisar superposición de fechas (la tuya)
  function rangesOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
  }

  // Guardar customDiscounts y discountDateRanges en localStorage (tu lógica ya está perfecta)
  React.useEffect(() => {
    localStorage.setItem("customDiscounts", JSON.stringify(customDiscounts));
  }, [customDiscounts]);
  React.useEffect(() => {
    localStorage.setItem("discountDateRanges", JSON.stringify(discountDateRanges));
  }, [discountDateRanges]);

  // Función checkAvailability (igual a la tuya, pero filtrando por estado seleccionado)
  const checkAvailability = async () => {
    const from = dateRange[0].startDate;
    const to = dateRange[0].endDate;
    const nights = Math.ceil((to - from) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      alert("El rango de fechas seleccionadas es incorrecto.");
      return;
    }
    if (people < 1) {
      alert("Selecciona una cantidad válida de personas.");
      return;
    }

    setLoading(true);
    const output = [];

    // Filtrar solo los apartamentos del estado seleccionado
  const filteredCalendars = calendars.filter(
  (cal) => cal.estado === selectedEstado && cal.capacity >= people
);

for (const cal of filteredCalendars) {
  try {
    let reservas = [];

    // ---------- AIRBNB ----------
    try {
      const proxyUrl = `${BASE_URL}/proxy?url=${encodeURIComponent(cal.url)}`;
      const res = await fetch(proxyUrl);
      const text = await res.text();

      const jcalData = ICAL.parse(text);
      const comp = new ICAL.Component(jcalData);
      const events = comp.getAllSubcomponents("vevent");

      const airbnbReservas = events
        .map((e) => {
          const ev = new ICAL.Event(e);
          return {
            start: ev.startDate.toJSDate(),
            end: ev.endDate.toJSDate()
          };
        })
        .filter((r) => r.start && r.end);

      reservas = reservas.concat(airbnbReservas);
    } catch (err) {
      console.error(`Error al procesar iCal Airbnb de ${cal.name}`, err);
    }

    // ---------- ESTEI ----------
    if (cal.esteiUrl) {
      try {
        const proxyUrlEstei = `${BASE_URL}/proxy?url=${encodeURIComponent(cal.esteiUrl)}`;
        const resEstei = await fetch(proxyUrlEstei);
        const textEstei = await resEstei.text();

        const jcalDataEstei = ICAL.parse(textEstei);
        const compEstei = new ICAL.Component(jcalDataEstei);
        const eventsEstei = compEstei.getAllSubcomponents("vevent");

        const esteiReservas = eventsEstei
          .map((e) => {
            const ev = new ICAL.Event(e);
            return {
              start: ev.startDate.toJSDate(),
              end: ev.endDate.toJSDate()
            };
          })
          .filter((r) => r.start && r.end);

        reservas = reservas.concat(esteiReservas);
      } catch (err) {
        console.error(`Error al procesar iCal Estéi de ${cal.name}`, err);
      }
    }

    // ---------- DISPONIBILIDAD ----------
    const isAvailable = !reservas.some((r) =>
      rangesOverlap(from, to, r.start, r.end)
    );

    // ---------- AIRBNB PRICE ----------
const a = cal.airbnb;
const aExtraGuests = Math.max(0, people - a.maxGuestsIncluded);
const aNightsPrice = a.pricePerNight * nights;
const aExtraGuestPrice = (a.extraGuestFeePerNight || 0) * aExtraGuests * nights;

// ✅ DIRECTO USD BASE (SIN % NI DESCUENTOS)
// DIRECTO usa el mismo descuento de estadía larga
let directDiscounted = a.pricePerNight * nights;

if (nights >= 7 && nights < 26) {
  directDiscounted *= (1 - (a.discountWeek || 0));
} else if (nights >= 26) {
  directDiscounted *= (1 - (a.discountMonth || 0));
}

const aDirectBase = directDiscounted + aExtraGuestPrice + (a.cleaningFee || 0);


let discountedNightsPrice = aNightsPrice;
if (nights >= 7 && nights < 26) {
  discountedNightsPrice *= (1 - (a.discountWeek || 0));
} else if (nights >= 26) {
  discountedNightsPrice *= (1 - (a.discountMonth || 0));
}

const aBaseWithDiscount = discountedNightsPrice + aExtraGuestPrice;
const cleaningFee = a.cleaningFee || 0;
const aSubtotalWithCleaning = aBaseWithDiscount + cleaningFee;
const aPlatformFee = aSubtotalWithCleaning * (a.platformFeeRate || 0.1411);

let aTotalPrice = aSubtotalWithCleaning + aPlatformFee;
aTotalPrice = Math.round(aTotalPrice * 100) / 100;


// ---------- ESTEI PRICE ----------
const e = cal.estei;
const eNightsPrice = (e.pricePerNight || 0) * nights;
const eExtraGuests = Math.max(0, people - (e.maxGuestsIncluded || 2));
const eExtraGuestPrice = (e.extraGuestFeePerNight || 0) * eExtraGuests * nights;
const eCleaningFee = e.cleaningFee || 0;

// ✅ DIRECTO BS BASE (SIN % NI DESCUENTOS)
const eDirectBase = eNightsPrice + eExtraGuestPrice + eCleaningFee;

let eSubtotal = eNightsPrice + eExtraGuestPrice + eCleaningFee;
let eDiscount = 0;
if (nights >= 7 && nights < 30) eDiscount = eNightsPrice * (e.discountWeek || 0);
else if (nights >= 30) eDiscount = eNightsPrice * (e.discountMonth || 0);

const ePlatformFee = eSubtotal * (e.platformFeePercentage || 0);
let eTotalPrice = eSubtotal + ePlatformFee - eDiscount;


// ---------- DESCUENTO PERSONALIZADO ----------
const discountPercent = customDiscounts[cal.name] || 0;
const dr = discountDateRanges[cal.name];
const hasDiscountRange = dr && dr.startDate && dr.endDate;

if (discountPercent > 0 && hasDiscountRange && rangesOverlap(from, to, dr.startDate, dr.endDate)) {
  aTotalPrice = aTotalPrice * (1 - discountPercent / 100);
  eTotalPrice = eTotalPrice * (1 - discountPercent / 100);
  // 👇 OJO: Directo Base NO se toca (porque lo quieres sin descuentos ni %)
}


// ---------- PUSH OUTPUT ----------
output.push({
  name: cal.name,
  nights,
  capacity: cal.capacity,
  rooms: cal.rooms,
  baths: cal.baths,
  airbnbLink: cal.airbnbLink,
  esteiLink: cal.esteiLink,
  reservas,
  isAvailable,

  // Precios por apps (con fee + descuentos como ya lo tienes)
  airbnbPrice: aTotalPrice.toFixed(2),
  esteiPrice: eTotalPrice.toFixed(2),

  // ✅ Precios directos BASE (solo noche(s) + extra huésped + limpieza)
  directUsdBase: (Math.round(aDirectBase * 100) / 100).toFixed(2),
  directBsBase: (Math.round(eDirectBase * 100) / 100).toFixed(2),
});


  } catch (err) {
    console.error(`Error al procesar ${cal.name}`, err);
  }
}


    setResults(output);
    setLoading(false);
  };

  // Función copiar texto (igual)
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Texto copiado al portapapeles");
    } catch {
      alert("Error al copiar");
    }
  };

const copyAvailableApartments = () => {
  const availableApts = results.filter((r) => r.isAvailable);
  if (availableApts.length === 0) {
    alert("No hay apartamentos disponibles para copiar.");
    return;
  }

  const paymentInfo = `Cómo reservar y pagar

1️⃣ Por aplicaciones (Airbnb / Estéi)

Reserva directamente desde el link del apartamento.
• Airbnb: tarjeta internacional o PayPal
• Estéi: Bolívares (tasa BCV)
No requiere depósito.

2️⃣ Directo con nosotros

Si no puedes usar las aplicaciones, puedes reservar directo.
• Requiere depósito reembolsable, devuelto al finalizar la estadía.
`;

  // Función para calcular depósito según noches
  const getDeposit = (nights) => {
    if (nights === 2) return 130;
    if (nights === 3) return 150;
    if (nights >= 4 && nights <= 7) return 250;
    if (nights >= 8 && nights <= 15) return 500;
    if (nights >= 16 && nights <= 30) return 750;
    return 1000; // más de 30 noches
  };

  const combinedText = paymentInfo + "\n\n" + availableApts
    .map((r, index) => {
      const nights =
        typeof r.nights === "number" && !isNaN(r.nights)
          ? r.nights
          : Math.max(
              1,
              Math.ceil(
                (dateRange[0].endDate - dateRange[0].startDate) / (1000 * 60 * 60 * 24)
              )
            );
      const nightsLabel = nights === 1 ? `${nights} noche` : `${nights} noches`;
      const deposit = getDeposit(nights);

      return `📍 *${r.name} - ${nightsLabel} | ${r.rooms} H / ${r.baths} B | Máx. ${r.capacity} pers.)*

USD: $${r.airbnbPrice} vía App Airbnb (DESCUENTO)
Bs. (BCV): $${r.esteiPrice} vía ESTEI App

Ver fotos y características: ${r.esteiLink}

Directo: USD: $${r.directUsdBase} + Depósito: $${deposit}
Directo: Bs. (BCV): $${r.directBsBase} + Depósito: $${deposit}${index !== availableApts.length - 1 ? "\n\n────────────────────────\n\n" : ""}`;


    })
    .join("");

  copyToClipboard(combinedText);
};


const copySingleApartment = (apt) => {
  const nightsLabel = apt.nights === 1 ? `${apt.nights} noche` : `${apt.nights} noches`;

  const getDeposit = (n) => {
    if (n === 2) return 130;
    if (n === 3) return 150;
    if (n >= 4 && n <= 7) return 250;
    if (n >= 8 && n <= 15) return 500;
    if (n >= 16 && n <= 30) return 750;
    return 1000;
  };

  const deposit = getDeposit(apt.nights);

  const paymentInfo = `Cómo reservar y pagar

1️⃣ Por aplicaciones (Airbnb / Estéi)

Reserva directamente desde el link del apartamento.
• Airbnb: tarjeta internacional o PayPal
• Estéi: Bolívares (tasa BCV)
No requiere depósito.

2️⃣ Directo con nosotros

Si no puedes usar las aplicaciones, puedes reservar directo.
• Requiere depósito reembolsable, devuelto al finalizar la estadía.
`;

  const text = `${paymentInfo}

📍 *${apt.name}* — ${nightsLabel} (${apt.rooms}H / ${apt.baths}B / máx. ${apt.capacity} pers.)

USD: $${apt.airbnbPrice} → ${apt.airbnbLink || ""}
Bolívares (BCV): $${apt.esteiPrice} → ${apt.esteiLink || apt.airbnbLink || ""}

Directo USD: $${apt.directUsdBase} + Depósito $${deposit}
Directo Bs.: $${apt.directBsBase} + Depósito $${deposit}
`;

  copyToClipboard(text);
};

  


  // You need to return your JSX from the App component:
// You need to return your JSX from the App component:
return (
  <div>
    {/* BOTÓN PARA VER/OCULTAR RESERVAS */}
    <button
      onClick={() => setVerReservas(!verReservas)}
      style={{
        marginBottom: 20,
        padding: "0.5rem 1rem",
        backgroundColor: "green",
        color: "white",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      {verReservas ? "← Volver" : "Ver Reservas"}
    </button>

    {/* MODO RESERVAS */}
    {verReservas ? (
      <div style={{ overflowX: "auto", marginBottom: 20 }}>
        <ReservasAdmin />
      </div>
    ) : (
      <>
        {/* Select para escoger estado */}
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="estadoSelect" style={{ marginRight: 8, fontWeight: "bold" }}>
            Escoge el estado:
          </label>
          <select
            id="estadoSelect"
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            style={{ padding: "0.3rem 0.5rem" }}
          >
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {/* Botón para mostrar/ocultar campos de descuento */}
        <h2>Asignar descuentos personalizados a apartamentos</h2>
        <button
          style={{ marginBottom: 20, padding: "0.5rem 1rem", cursor: "pointer" }}
          onClick={() => setShowDiscounts(!showDiscounts)}
        >
          {showDiscounts ? "Ocultar campos de descuento" : "Mostrar campos de descuento"}
        </button>

        {/* Campos de descuento */}
        {showDiscounts &&
          calendars
            .filter((cal) => cal.estado === selectedEstado)
            .map((cal) => (
              <div
                key={cal.name}
                style={{
                  marginBottom: "1.5rem",
                  border: "1px solid #ddd",
                  padding: 10,
                  borderRadius: 6,
                }}
              >
                <label>
                  {cal.name} (% descuento):
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={customDiscounts[cal.name] || ""}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(0, Number(e.target.value)));
                      setCustomDiscounts((prev) => ({ ...prev, [cal.name]: val }));
                    }}
                    style={{ width: "60px", marginLeft: "0.5rem" }}
                  />
                </label>

                <div style={{ marginTop: 10 }}>
                  <DateRange
                    ranges={[
                      discountDateRanges[cal.name] || {
                        startDate: new Date(),
                        endDate: addDays(new Date(), 1),
                        key: "selection",
                      },
                    ]}
                    onChange={(item) =>
                      setDiscountDateRanges((prev) => ({ ...prev, [cal.name]: item.selection }))
                    }
                    editableDateInputs
                    moveRangeOnFirstSelection={false}
                    minDate={new Date()}
                    rangeColors={["#10b981"]}
                    showMonthAndYearPickers
                    direction="horizontal"
                  />
                </div>
              </div>
            ))}

        <button onClick={copyAvailableApartments}>
          📋 Copiar todos los apartamentos disponibles
        </button>

        {/* Selección de fechas y personas */}
        <h2>Selecciona fechas y personas</h2>
        <DateRange
          editableDateInputs
          onChange={(item) => setDateRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
          minDate={new Date()}
          rangeColors={["#3d91ff"]}
        />

        <label style={{ display: "block", margin: "1rem 0" }}>
  Personas:{" "}
  <select value={people} onChange={(e) => setPeople(Number(e.target.value))}>
    {[...Array(8).keys()].map((n) => (
      <option key={n + 1} value={n + 1}>
        {n + 1}
      </option>
    ))}
  </select>
</label>

        <button onClick={checkAvailability} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          Consultar
        </button>

        {/* Resultados */}
        <div style={{ marginTop: "2rem" }}>
          {loading && <p>Cargando...</p>}

          {!loading &&
            results.map((r, i) => (
              <div
                key={i}
                className="result-item"
                style={{ borderBottom: "1px solid #ccc", paddingBottom: 15, marginBottom: 15 }}
              >
                <div className="result-info">
                  <h3>📍 {r.name}</h3>
                  <p>
                    ({r.rooms} habit / {r.baths} baños · Máx. {r.capacity} personas)
                  </p>

                  {r.isAvailable ? (
                    <>
                      <p>
                        ✅ Disponible — Airbnb: ${r.airbnbPrice} / Estei: ${r.esteiPrice} en {r.nights} noches
                      </p>
                      <p>💳 Pay via Airbnb o Pago móvil, Tasa BCV, Transferencia y Zelle para Estei</p>

                      <p>
                        <a href={r.airbnbLink} target="_blank" rel="noopener noreferrer">
                          Ver en Airbnb
                        </a>
                      </p>

                      <button
                        onClick={() => copySingleApartment(r)}
                        style={{
                          marginTop: "10px",
                          padding: "0.4rem 0.7rem",
                          backgroundColor: "#4174e0ff",
                          color: "white",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        📋 Copiar Presupuesto
                      </button>
                    </>
                  ) : (
                    <p style={{ color: "#dc2626" }}>❌ No disponible</p>
                  )}
                </div>

                <div className="calendar-container" style={{ marginTop: 10 }}>
                  <CalendarioPropiedad
                    nombre={r.name}
                    reservas={r.reservas}
                    currentDate={dateRange[0].startDate}
                  />
                </div>
              </div>
            ))}
        </div>
      </>
    )}
  </div>
);


}

export default App;