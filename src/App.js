import ICAL from "ical.js";
import React, { useState, useEffect } from 'react';
import CalendarioPropiedad from './calendariopropiedad';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const calendars = [
  {
    name: "Chacao",
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
      discountMonth: 0.20,
      platformFeePercentage: 0.14 // 14.2%
    },
    estei: {
      pricePerNight: 120,
      cleaningFee: 40,
      platformFeePercentage: 0.15 // 13.05%
    },
  },
  {
    name: "Sebucán 2",
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
      discountWeek: 0.05,
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
    url: "https://www.airbnb.com/calendar/ical/1332629584763087489.ics?s=d90bafbfe647f3451520a54fc98d2522&locale=en",
    capacity: 4,
    rooms: 2,
    baths: 2,
    airbnbLink: "airbnb.com/h/lacampinaccs",
    esteiLink: "https://goo.su/orcTbU",
    airbnb: {
      pricePerNight: 70,
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
    name: "Sebucán 4",
    url: "https://www.airbnb.com/calendar/ical/828812513697117205.ics?s=c5bd1934f996f8ee77b3742979342db6&locale=en",
    capacity: 5,
    rooms: 2,
    baths: 2,
    airbnbLink: "airbnb.com/h/sebucan4",
    esteiLink: "https://estei.app/stay/17332237155689559816/profile?guests=1&arrival_date=2025-07-01&departure_date=2025-07-03",
    airbnb: {
      pricePerNight: 55,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.1
    },
     estei: {
      pricePerNight: 90,
      cleaningFee: 45,
      platformFeePercentage: 0.15
    },
    
  },
  {
    name: "Sebucán 1",
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
      discountMonth: 0.20,
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
    url: "https://www.airbnb.com/calendar/ical/1419766431038404560.ics?s=9fe0c131ba2c39be3af7230db3461881&locale=en",
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
      discountMonth: 0.20,
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
    name: "Trinidad",
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
    name: "Sebucán 3",
    url: "https://www.airbnb.com/calendar/ical/1298924651912966615.ics?s=a0857ac3afe38166c5df3e029f90b3f9&locale=en",
    capacity: 4,
    rooms: 2,
    baths: 2,
    airbnbLink: "airbnb.com/h/sebucan3",
    esteiLink: "https://goo.su/zbxDmN",
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
      pricePerNight: 80,
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Boleita",
    url: "https://www.airbnb.com/calendar/ical/1343681520860355629.ics?s=a2d96f7fe387a7d3e27ce41d275f4a33&locale=en",
    capacity: 2,
    rooms: 1,
    baths: 1,
    airbnbLink: " airbnb.com/h/los2caminos",
    esteiLink: "https://estei.app/stay/17382856932068656972/profile?guests=1&arrival_date=2025-07-01&departure_date=2025-07-03",
    airbnb: {
      pricePerNight: 100,
      cleaningFee: 35,
      extraGuestFeePerNight: 5,
      maxGuestsIncluded: 2,
      discountWeek: 0.05,
      discountMonth: 0.20,
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 95,
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Rosal 2",
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
      platformFeePercentage: 0.14
    },
    estei: {
      pricePerNight: 90,
      cleaningFee: 40,
      platformFeePercentage: 0.15
    },
  },
  {
    name: "Campo Alegre",
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
      discountMonth: 0.20,
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
      discountMonth: 0.20,
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
  }
];




function App() {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [people, setPeople] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  function rangesOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
  }

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

    for (const cal of calendars) {
      if (cal.capacity < people) continue;
      try {
        const proxyUrl = `http://localhost:4004/proxy?url=${encodeURIComponent(cal.url)}`;
        const res = await fetch(proxyUrl);
        const text = await res.text();

        const jcalData = ICAL.parse(text);
        const comp = new ICAL.Component(jcalData);
        const events = comp.getAllSubcomponents("vevent");

        const reservas = events
          .map(e => {
            const ev = new ICAL.Event(e);
            return { start: ev.startDate.toJSDate(), end: ev.endDate.toJSDate() };
          })
          .filter(r => r.start && r.end);

        const isAvailable = !reservas.some(r => rangesOverlap(from, to, r.start, r.end));

        // Airbnb price calc
       // Airbnb price calc
const a = cal.airbnb;
const aExtraGuests = Math.max(0, people - a.maxGuestsIncluded);
const aNightsPrice = a.pricePerNight * nights;
const aExtraGuestPrice = a.extraGuestFeePerNight * aExtraGuests * nights;
const aCleaningFee = a.cleaningFee;

let aDiscount = 0;
if (nights >= 7 && nights < 30) aDiscount = aNightsPrice * a.discountWeek;
else if (nights >= 30) aDiscount = aNightsPrice * a.discountMonth;

const aSubtotal = aNightsPrice + aExtraGuestPrice + aCleaningFee;
const aSubtotalWithDiscount = aSubtotal - aDiscount;

const aPlatformFee = aSubtotalWithDiscount * a.platformFeePercentage;
const aTotalPrice = (aSubtotalWithDiscount + aPlatformFee).toFixed(2);
// 👉 Función para calcular el fee fijo de plataforma Estei según noches
function platformFee(nights) {
  if (nights < 2) return 0;
  return 42 + (nights - 2) * 18;
}

// 👉 Cálculo completo del precio total Estei
const e = cal.estei;

let eNightsPrice = e.pricePerNight * nights;
let eExtraGuests = Math.max(0, people - (e.maxGuestsIncluded || 2));
let eExtraGuestPrice = (e.extraGuestFeePerNight || 0) * eExtraGuests * nights;
let eCleaningFee = e.cleaningFee || 0;

let eSubtotal = eNightsPrice + eExtraGuestPrice + eCleaningFee;

let eDiscount = 0;
if (nights >= 7 && nights < 30) {
  eDiscount = eNightsPrice * (e.discountWeek || 0);
} else if (nights >= 30) {
  eDiscount = eNightsPrice * (e.discountMonth || 0);
}

const ePlatformFee = eSubtotal * (e.platformFeePercentage || 0);


const eTotalPrice = (eSubtotal + ePlatformFee - eDiscount).toFixed(2);




        output.push({
          name: cal.name,
          nights,
          capacity: cal.capacity,
          rooms: cal.rooms,
          baths: cal.baths,
          airbnbLink: cal.airbnbLink,
          reservas,
          isAvailable,
          airbnbPrice: aTotalPrice,
          esteiPrice: eTotalPrice,
          esteiLink: cal.esteiLink
        });
      } catch (err) {
        console.error(`Error al procesar ${cal.name}`, err);
      }
    }

    setResults(output);
    setLoading(false);
  };
return (
  <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
    <h2>Selecciona tus fechas y personas</h2>

    <DateRange
      editableDateInputs
      onChange={item => setDateRange([item.selection])}
      moveRangeOnFirstSelection={false}
      ranges={dateRange}
      minDate={new Date()}
      rangeColors={['#3d91ff']}
    />

    <label style={{ display: 'block', margin: '1rem 0' }}>
      Personas:{' '}
      <select value={people} onChange={e => setPeople(Number(e.target.value))}>
        {[...Array(6).keys()].map(n => (
          <option key={n + 1} value={n + 1}>{n + 1}</option>
        ))}
      </select>
    </label>

    <button onClick={checkAvailability} style={{ padding: '0.5rem 1rem' }}>
      Consultar
    </button>

    <div style={{ marginTop: '2rem' }}>
      {loading && <p>Cargando...</p>}
      {!loading &&
        results.map((r, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '2rem',
            marginBottom: '2rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1 }}>
              <h3>📍 {r.name}</h3>
              <p>({r.rooms} hab / {r.baths} baños · Máx. {r.capacity} personas)</p>
              {r.isAvailable ? (
                <>
                  <p>✅ Disponible — Airbnb: ${r.airbnbPrice} / Estei: ${r.esteiPrice} en {r.nights} noches</p>
                  <p>💳 Pay via Airbnb o Pago móvil, Tasa BCV, Transferencia y Zelle para Estei</p>
                  <p>
                    <a href={r.airbnbLink} target="_blank" rel="noopener noreferrer">
                      Ver en Airbnb
                    </a>
                  </p>

                  {(() => {
                    const airbnbText = `Ya revisé la disponibilidad para las fechas que me diste. Aquí te dejo los detalles de los apartamentos con el precio total, incluyendo todas las tasas y cargos.

📍${r.name}
(${r.rooms} hab / ${r.baths} baños, Máx. ${r.capacity} personas):

✅ Precio total Airbnb: $${r.airbnbPrice} / ${r.nights} noches  / ${people} persona${people > 1 ? 's' : ''}

💳 Método de pago: Airbnb (tarjeta de crédito, tarjeta de débito o PayPal).

👉🏻¿Quieres reservarlo? Haz click aquí: ${r.airbnbLink}`;

                    const esteiText = `Ya revisé la disponibilidad para las fechas que me diste. Aquí te dejo los detalles de los apartamentos con el precio total, incluyendo todas las tasas y cargos.

📍${r.name}
(${r.rooms} hab / ${r.baths} baños, Máx. ${r.capacity} personas):

✅ Precio total Estei: $${r.esteiPrice} / ${r.nights} noches  / ${people} persona${people > 1 ? 's' : ''}

💳 Método de pago: Pago móvil, Tasa BCV, Transferencia y Zelle.

👉🏻¿Quieres reservarlo? Haz click aquí: ${r.esteiLink}`;

                    const copyToClipboard = async (text) => {
                      try {
                        await navigator.clipboard.writeText(text);
                        alert('Texto copiado al portapapeles');
                      } catch (err) {
                        alert('Error al copiar');
                      }
                    };

                    return (
                      <>
                        <div style={{
                          background: '#f9fafb',
                          border: '1px dashed #999',
                          padding: '1rem',
                          marginTop: '1rem',
                          borderRadius: '6px',
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'inherit',
                          lineHeight: '1.6'
                        }}>{airbnbText}</div>
                        <button onClick={() => copyToClipboard(airbnbText)} style={{ marginTop: '0.5rem' }}>
                          📋 Copiar texto Airbnb
                        </button>

                        <div style={{
                          background: '#f9fafb',
                          border: '1px dashed #999',
                          padding: '1rem',
                          marginTop: '1rem',
                          borderRadius: '6px',
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'inherit',
                          lineHeight: '1.6'
                        }}>{esteiText}</div>
                        <button onClick={() => copyToClipboard(esteiText)} style={{ marginTop: '0.5rem' }}>
                          📋 Copiar texto Estei
                        </button>
                      </>
                    );
                  })()}
                </>
              ) : (
                <p style={{ color: '#dc2626' }}>❌ No disponible</p>
              )}
            </div>

            <div style={{ width: '360px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                fontWeight: 'bold',
                background: '#fff',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px'
              }}>
                {r.isAvailable ? '✅ Disponible' : '❌ No disponible'}
              </div>
              <CalendarioPropiedad
                nombre={r.name}
                reservas={r.reservas}
                currentDate={dateRange[0].startDate}
              />
            </div>
          </div>
        ))
      }
    </div>
  </div>
);
}

export default App;