import ICAL from "ical.js";
import React, {   } from 'react';
import CalendarioPropiedad from './calendariopropiedad';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './App.css';

const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://airbnbchecker-3.onrender.com"
  : "http://localhost:4004";


const calendars = [
  {
    name: "Chacao",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/1385011718927994475.ics?s=4e4d11b7c6db289a9012851c43364d23&locale=en",
    capacity: 4,
    rooms: 2,
    baths: 2,
    airbnbLink: "airbnb.com/h/chacaoccs",
    esteiLink:  "https://estei.app/stay/17432889927468941438/profile?guests=1&arrival_date=2025-07-02&departure_date=2025-07-17",
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
    name: "Sebucán 2",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/964770823228978238.ics?s=18f5ceadceadf4e409822ee1c533f555&locale=en",
    capacity: 3,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/sebucanii",
    esteiLink: "https://estei.app/stay/17324639709782356499/profile",
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
    capacity: 6,
    rooms: 3,
    baths: 3,
    airbnbLink: "airbnb.com/h/elparaisoccs",
    esteiLink: "https://estei.app/stay/17503280947540278330/profile?guests=1&arrival_date=2025-07-01&departure_date=2025-07-15",
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
    capacity: 4,
    rooms: 2,
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
    capacity: 5,
    rooms: 2,
    baths: 2,
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
    capacity: 3,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/lacastellanaccs",
    esteiLink: "https://estei.app/stay/17339822030440348612/profile?guests=1&arrival_date=2025-06-25&departure_date=2025-06-28",
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
    capacity: 4,
    rooms: 2,
    baths: 1,
    airbnbLink: "airbnb.com/h/poz",
    esteiLink: "https://estei.app/stay/17362986804439617945/profile?guests=1&arrival_date=2025-03-08&departure_date=2025-03-10",
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
    capacity: 6,
    rooms: 3,
    baths: 3,
    airbnbLink: "airbnb.com/h/altamiraccs2",
    esteiLink: "https://estei.app/stay/17422034755364752882/profile",
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
    capacity: 3,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/elrosalccs2",
    esteiLink: "https://estei.app/stay/17411824245292709348/profile?guests=1&arrival_date=2025-07-01&departure_date=2025-07-03",
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
    capacity: 2,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/elbosqueccs",
    esteiLink: "https://estei.app/stay/17284832244356034483/profile?guests=1&arrival_date=2025-07-01&departure_date=2025-07-03",
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
    capacity: 3,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/campoalegreccs",
    esteiLink: "https://estei.app/stay/17333322201196982163/profile?guests=1&arrival_date=2025-07-01&departure_date=2025-07-03",
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
    capacity: 2,
    rooms: 1,
    baths: 1,
    airbnbLink: "airbnb.com/h/elrosalccs",
    esteiLink: "https://estei.app/stay/17334886485220080855/profile?guests=1&arrival_date=2025-07-01&departure_date=2025-07-03",
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
    name: "Altamira 1",
     estado: "Caracas",
    url: "https://www.airbnb.com/calendar/ical/968382219685565525.ics?s=e625583fa5cfc2188515639424cac8a1&locale=en",
    capacity: 6,
    rooms: 3,
    baths: 3,
    airbnbLink: "airbnb.com/h/lafloresta-altamira",
    esteiLink: "https://estei.app/stay/17325007819524651943/profile?guests=1&arrival_date=2025-07-01&departure_date=2025-07-03",
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
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/l/qr0k7RQY",
    esteiLink: "https://estei.app/stay/17361284393152580414/profile?guests=1&arrival_date=2025-07-01&departure_date=2025-07-15",
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
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.10,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 100,
      cleaningFee: 40,
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
    name: "Poz 2",
    estado: "POZ",
    url: "https://www.airbnb.com/calendar/ical/979794923757351625.ics?s=3d9e5476cfa447b17e55000fc0aab93b&locale=en",
    capacity: 6,
    rooms: 3,
    baths: 2,
    airbnbLink: "https://www.airbnb.com/l/x3VtyZDq",
    esteiLink: "https://estei.app/stay/17362986804439617945/profile?guests=1&arrival_date=2025-07-02&departure_date=2025-07-04",
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
  }
];




function App() {
  // Nuevo estado para guardar el estado seleccionado
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
        const proxyUrl = `${BASE_URL}/proxy?url=${encodeURIComponent(cal.url)}`;
        const res = await fetch(proxyUrl);
        const text = await res.text();

        const jcalData = ICAL.parse(text);
        const comp = new ICAL.Component(jcalData);
        const events = comp.getAllSubcomponents("vevent");

        const reservas = events
          .map((e) => {
            const ev = new ICAL.Event(e);
            return { start: ev.startDate.toJSDate(), end: ev.endDate.toJSDate() };
          })
          .filter((r) => r.start && r.end);

        const isAvailable = !reservas.some((r) => rangesOverlap(from, to, r.start, r.end));

        
const a = cal.airbnb;
const aExtraGuests = Math.max(0, people - a.maxGuestsIncluded);
const aNightsPrice = a.pricePerNight * nights;
const aExtraGuestPrice = a.extraGuestFeePerNight * aExtraGuests * nights;

// Aplicar descuento SOLO sobre el precio base por noche
let discountedNightsPrice = aNightsPrice;
if (nights >= 7 && nights < 26) {
  discountedNightsPrice *= (1 - a.discountWeek);
} else if (nights >= 26) {
  discountedNightsPrice *= (1 - a.discountMonth);
}

// Precio base + huéspedes extra sin descuento
const aBaseWithDiscount = discountedNightsPrice + aExtraGuestPrice;

// Limpieza SIN impuestos
const cleaningFee = a.cleaningFee;

const aSubtotalWithCleaning = aBaseWithDiscount + cleaningFee;

// Comisión plataforma
const aPlatformFee = aSubtotalWithCleaning * (a.platformFeeRate || 0.1411);

// Precio total redondeado
let aTotalPrice = aSubtotalWithCleaning + aPlatformFee;
aTotalPrice = Math.round(aTotalPrice * 100) / 100;





// Estei price calc
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

// Aplicar descuento personalizado solo si el rango de fecha del descuento se superpone con el rango buscado
const discountPercent = customDiscounts[cal.name] || 0;
const dr = discountDateRanges[cal.name];
const hasDiscountRange = dr && dr.startDate && dr.endDate;

if (discountPercent > 0 && hasDiscountRange && rangesOverlap(from, to, dr.startDate, dr.endDate)) {
  aTotalPrice = aTotalPrice * (1 - discountPercent / 100);
  eTotalPrice = eTotalPrice * (1 - discountPercent / 100);
}


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

    const combinedText = availableApts
      .map((r) => {
        return `📍 ${r.name}
(${r.rooms} hab / ${r.baths} baños, máx. ${r.capacity} personas)

🔹 Opción 1: Reserva por Airbnb
💰 $${r.airbnbPrice} / ${r.nights} noches / ${people} persona${people > 1 ? "s" : ""}
💳 Tarjeta crédito, débito en moneda extranjera o PayPal
👉 ${r.airbnbLink}

🔹 Opción 2: Reserva por Estei
💰 $${r.esteiPrice} / ${r.nights} noches / ${people} persona${people > 1 ? "s" : ""}
💳 Pago móvil (TASA BCV)
👉 ${r.esteiLink}

🔹 Opción 3: Reserva directa (fuera de plataformas)
Depósito obligatorio 💵 (reembolsable al salir) | 💳 Zelle o efectivo disponibles para el pago.

🅰️ Si pagás la reserva por adelantado (Zelle):
 • El depósito lo entregás al llegar (efectivo) o lo enviás por Zelle/Pago móvil.

🅱️ Si pagás la reserva en efectivo al llegar:
 • El depósito debe enviarse antes por Zelle/Pago móvil para asegurar la reserva.

————————————————————————
`;
      })
      .join("\n");

    copyToClipboard(combinedText);
  };













  
return (
  <div className="app-container" style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
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

    {/* Botón para mostrar u ocultar campos de descuento */}
    <h2>Asignar descuentos personalizados a apartamentos</h2>
    <button
      style={{ marginBottom: 20, padding: "0.5rem 1rem", cursor: "pointer" }}
      onClick={() => setShowDiscounts(!showDiscounts)}
    >
      {showDiscounts ? "Ocultar campos de descuento" : "Mostrar campos de descuento"}
    </button>

    {/* Campos de descuento personalizados */}
    {showDiscounts &&
      calendars
        .filter((cal) => cal.estado === selectedEstado) // Solo mostrar campos descuentos para el estado seleccionado
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
                showMonthAndYearPickers={true}
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
    results.map((r, i) => {
      return (
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

                <button
                  className="copy-button"
                  onClick={() => {
                    const combinedText = 
`📍 ${r.name}
(${r.rooms} hab / ${r.baths} baños, máx. ${r.capacity} personas)

🔹 Opción 1: Reserva por Airbnb
💰 $${r.airbnbPrice} / ${r.nights} noches / ${people} persona${people > 1 ? "s" : ""}
💳 Tarjeta crédito, débito en moneda extranjera o PayPal
👉 ${r.airbnbLink}

🔹 Opción 2: Reserva por Estei
💰 $${r.esteiPrice} / ${r.nights} noches / ${people} persona${people > 1 ? "s" : ""}
💳 Pago móvil (TASA BCV)
👉 ${r.esteiLink}

🔹 Opción 3: Reserva directa (fuera de plataformas)
Depósito obligatorio 💵 (reembolsable al salir) | 💳 Zelle o efectivo disponibles para el pago.

🅰️ Si pagás la reserva por adelantado (Zelle):
 • El depósito lo entregás al llegar (efectivo) o lo enviás por Zelle/Pago móvil.

🅱️ Si pagás la reserva en efectivo al llegar:
 • El depósito debe enviarse antes por Zelle/Pago móvil para asegurar la reserva.
`;
                    copyToClipboard(combinedText);
                  }}
                  style={{ padding: "0.3rem 0.6rem", cursor: "pointer" }}
                >
                  📋 Copiar texto presupuesto completo
                </button>
              </>
            ) : (
              <p style={{ color: "#dc2626" }}>❌ No disponible</p>
            )}
          </div>
          <div className="calendar-container" style={{ marginTop: 10 }}>
            <div
              className="availability-badge"
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: 10,
                backgroundColor: r.isAvailable ? "#34d399" : "#f87171",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {r.isAvailable ? "✅ Disponible" : "❌ No disponible"}
            </div>
            <div style={{ marginTop: 10 }}>
              <CalendarioPropiedad
                nombre={r.name}
                reservas={r.reservas}
                currentDate={dateRange[0].startDate}
              />
            </div>
          </div>
        </div>
      );
    })}
</div>
  </div>
);
}
export default App;