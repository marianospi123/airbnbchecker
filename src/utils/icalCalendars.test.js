import {
  getCalendarHealth,
  parseIcalReservas,
  rangesOverlap,
  snapshotRangesToReservations,
} from "./icalCalendars";

const emptyCalendar = `BEGIN:VCALENDAR
VERSION:2.0
END:VCALENDAR`;

const reservedCalendar = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART;VALUE=DATE:20260810
DTEND;VALUE=DATE:20260813
SUMMARY:Reserved
UID:test-reservation@airbnb.com
END:VEVENT
END:VCALENDAR`;

const currentChacaoAirbnbCalendar = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART;VALUE=DATE:20261022
DTEND;VALUE=DATE:20261028
SUMMARY:Airbnb (Not available)
END:VEVENT
BEGIN:VEVENT
DTSTART;VALUE=DATE:20270731
DTEND;VALUE=DATE:20270801
SUMMARY:Airbnb (Not available)
END:VEVENT
END:VCALENDAR`;

test("parses reserved dates from a valid iCal", () => {
  const reservations = parseIcalReservas(reservedCalendar);

  expect(reservations).toHaveLength(1);
  expect(reservations[0].start.getFullYear()).toBe(2026);
  expect(reservations[0].start.getMonth()).toBe(7);
  expect(reservations[0].start.getDate()).toBe(10);
  expect(reservations[0].end.getDate()).toBe(13);
});

test("detects Chacao blocks across different months and years", () => {
  const reservations = parseIcalReservas(currentChacaoAirbnbCalendar);

  expect(reservations).toHaveLength(2);
  expect(
    reservations.some((reservation) =>
      rangesOverlap(
        new Date(2026, 9, 23),
        new Date(2026, 9, 24),
        reservation.start,
        reservation.end
      )
    )
  ).toBe(true);
  expect(
    reservations.some((reservation) =>
      rangesOverlap(
        new Date(2027, 6, 31),
        new Date(2027, 7, 1),
        reservation.start,
        reservation.end
      )
    )
  ).toBe(true);
});

test("uses Estei snapshot blocks with an exclusive checkout date", () => {
  const reservations = snapshotRangesToReservations({
    ranges: [{ start: "2026-08-01", end: "2026-08-14" }],
  });

  expect(reservations).toHaveLength(1);
  expect(
    rangesOverlap(
      new Date(2026, 7, 13),
      new Date(2026, 7, 14),
      reservations[0].start,
      reservations[0].end
    )
  ).toBe(true);
  expect(
    rangesOverlap(
      new Date(2026, 7, 14),
      new Date(2026, 7, 15),
      reservations[0].start,
      reservations[0].end
    )
  ).toBe(false);
});

test("blocks Chacao when every configured calendar is empty", () => {
  const reservations = parseIcalReservas(emptyCalendar);
  const health = getCalendarHealth({
    propertyName: "Chacao",
    configuredSources: 2,
    successfulSources: 2,
    reservations,
    warnings: [],
  });

  expect(health.forceUnavailable).toBe(true);
  expect(health.warning).toContain("llegaron vacíos");
});

test("blocks availability when any calendar source fails", () => {
  const health = getCalendarHealth({
    propertyName: "Chacao",
    configuredSources: 2,
    successfulSources: 1,
    reservations: parseIcalReservas(reservedCalendar),
    warnings: ["No se pudo leer el iCal de Estéi para Chacao."],
  });

  expect(health.forceUnavailable).toBe(true);
  expect(health.warning).toContain("Estéi");
});
