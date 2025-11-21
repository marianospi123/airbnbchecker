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



const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://airbnbchecker-4.onrender.com"
  : "http://localhost:4004";


const calendars = [
  {
    name: "Chacao",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1385011718927994475.ics?s=4e4d11b7c6db289a9012851c43364d23&locale=en",
    esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/1473257424-stay-17432889927468941438.ics",
    capacity: 4,
    rooms: 2,
    baths: 1,
    airbnbLink: "airbnb.com/h/chacaoccs",
    esteiLink:  "https://surl.lu/cnsvgv",
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
    name: "Boleita",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1343681520860355629.ics?s=a2d96f7fe387a7d3e27ce41d275f4a33&locale=es-XL",
    esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/1996747011-stay-17382856932068656972.ics",
    capacity: 2,
    rooms: 1,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/l/KQlHkFXF",
    esteiLink:  "https://short-url.org/1f00f ",
    airbnb: {
      pricePerNight: 55,
      cleaningFee: 40,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
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
    esteiLink: "https://surl.li/fxdhwn",
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
    name: "Paraíso",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1442428798352266133.ics?s=32dd2a635d95604c8754d606ac0ba4a2&locale=en",
    esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/2928268937-stay-17503280947540278330.ics",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "airbnb.com/h/elparaisoccs",
    esteiLink: "https://surl.lu/lefqgb",
    airbnb: {
      pricePerNight: 50,
      cleaningFee: 50,
      extraGuestFeePerNight: 5,
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
    name: "Campiña",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1332629584763087489.ics?s=d90bafbfe647f3451520a54fc98d2522&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/144124055-stay-17362995794045266032.ics",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "airbnb.com/h/lacampinaccs",
    esteiLink: "https://goo.su/orcTbU",
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
    name: "Sebucán 1",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/40759881.ics?s=e236ee10e178f24d224d1ea7f9e12925&locale=en",
     esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/2914190771-stay-17322691782694977756.ics",
    capacity: 5,
    rooms: 2,
    baths: 1,
    airbnbLink: "airbnb.com/h/aptosebucanccs",
    esteiLink: "https://goo.su/oie40",
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
    esteiLink: "https://surl.lu/iozjba",
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
    esteiLink: "https://goo.su/HMKHf",
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
    esteiLink: "https://surl.li/ktbyuw",
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
    esteiLink: "https://surl.li/veqvvk",
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
    esteiLink: "https://surl.lu/fazirv",
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
    esteiLink: "https://surl.li/oewjkf",
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
    esteiLink: "https://surl.li/qeapdw",
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
    esteiLink: "https://short-url.org/1hAzi",
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
    esteiLink: "https://surl.li/etwute",
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
      pricePerNight: 100,
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
    esteiLink: "https://surli.cc/uketkt",
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
      pricePerNight: 90,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.10,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 85,
      cleaningFee: 35,
      platformFeePercentage: 0.15
    },
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
  name: "Apt de lujo, 5 hab, piscina y vista al lago",
  estado: "Maracaibo",
  url: "https://www.airbnb.co.ve/calendar/ical/1487058676175453143.ics?s=b30ddf70122a2023544022e7e83d9d34",
   esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/168939025-stay-17563892666605964165.ics",
  capacity: 9,
  rooms: 5,
  baths: 5.5,
  airbnbLink: "https://airbnb.co.ve/h/cdl11",
  esteiLink: "https://estei.app/stay/17563892666605964165/profile",
  airbnb: {
    pricePerNight: 140,
    cleaningFee: 35,
    extraGuestFeePerNight: 15,
    maxGuestsIncluded: 1,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 150,
    cleaningFee: 45,
    platformFeePercentage: 0.15
  },
},
{
  name: "Relax y vista insuperable en el Milagro con 4H+4B",
  estado: "Maracaibo",
  url: "https://www.airbnb.co.ve/calendar/ical/1508336810645062616.ics?s=6b0b830243ed4e7fcfc5356cfaa16ec5",
   esteiUrl:"https://estei.nyc3.digitaloceanspaces.com/stg/ical/2688266043-stay-17565032145339330524.ics",
  capacity: 6,
  rooms: 4,
  baths: 4.5,
  airbnbLink: "https://airbnb.co.ve/h/cdl12",
  esteiLink: "https://estei.app/stay/17565032145339330524/profile",
  airbnb: {
    pricePerNight: 85,
    cleaningFee: 35,
    extraGuestFeePerNight: 15,
    maxGuestsIncluded: 1,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 120,
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
  capacity: 4,
  rooms: 2,
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
  name: "Paraíso Familiar en Isla Margarita",
  estado: "Margarita",
  url: "https://www.airbnb.co.ve/calendar/ical/1354618645998155424.ics?s=867f81c1c97841b53330fc62c4e3bdf1",
  capacity: 4,
  rooms: 2,
  baths: 2,
  airbnbLink: "https://airbnb.co.ve/h/solarium6",
  esteiLink: null,
  airbnb: {
    pricePerNight: 45,
    cleaningFee: 25,
    extraGuestFeePerNight: 10,
    maxGuestsIncluded: 1,
    discountWeek: 0.05,
    discountMonth: 0.15,
    platformFeePercentage: 0.1411
  },
  estei: {
    pricePerNight: 0,
    cleaningFee: 0,
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
    const aExtraGuestPrice = a.extraGuestFeePerNight * aExtraGuests * nights;

    let discountedNightsPrice = aNightsPrice;
    if (nights >= 7 && nights < 26) {
      discountedNightsPrice *= (1 - a.discountWeek);
    } else if (nights >= 26) {
      discountedNightsPrice *= (1 - a.discountMonth);
    }

    const aBaseWithDiscount = discountedNightsPrice + aExtraGuestPrice;
    const cleaningFee = a.cleaningFee;
    const aSubtotalWithCleaning = aBaseWithDiscount + cleaningFee;
    const aPlatformFee = aSubtotalWithCleaning * (a.platformFeeRate || 0.1411);

    let aTotalPrice = aSubtotalWithCleaning + aPlatformFee;
    aTotalPrice = Math.round(aTotalPrice * 100) / 100;

    // ---------- ESTEI PRICE ----------
    const e = cal.estei;
    const eNightsPrice = e.pricePerNight * nights;
    const eExtraGuests = Math.max(0, people - (e.maxGuestsIncluded || 2));
    const eExtraGuestPrice = (e.extraGuestFeePerNight || 0) * eExtraGuests * nights;
    const eCleaningFee = e.cleaningFee || 0;

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
      airbnbPrice: aTotalPrice.toFixed(2),
      esteiPrice: eTotalPrice.toFixed(2),
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

      return `📍 *${r.name}* — ${nightsLabel} (${r.rooms}H / ${r.baths}B / máx. ${r.capacity} pers.)

USD: $${r.airbnbPrice} → ${r.airbnbLink}  
Bolívares (BCV): $${r.esteiPrice} → ${r.esteiLink}  
Directo USD: $${r.airbnbPrice} + Depósito $${deposit}  
Directo Bs.: $${r.esteiPrice} + Depósito $${deposit}${index !== availableApts.length - 1 ? "\n\n────────────────────────\n" : ""}`;
    })
    .join("");

  copyToClipboard(combinedText);
};



  


  // You need to return your JSX from the App component:
// You need to return your JSX from the App component:
return (
  <div>
    <>
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
        {verReservas ? "Ocultar Reservas" : "Ver Reservas"}
      </button>

      {/* TABLA DE RESERVAS CON SCROLL */}
      {verReservas && (
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <Reservas />
        </div>
      )}

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

      <button onClick={copyAvailableApartments}>📋 Copiar todos los apartamentos disponibles</button>

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
          {[...Array(6).keys()].map((n) => (
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
                  ({r.rooms} hab / {r.baths} baños · Máx. {r.capacity} personas)
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
  </div>
);

}

export default App;