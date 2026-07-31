import { getCalendarHealth, parseIcalReservas } from "./icalCalendars";

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

test("parses reserved dates from a valid iCal", () => {
  const reservations = parseIcalReservas(reservedCalendar);

  expect(reservations).toHaveLength(1);
  expect(reservations[0].start.getFullYear()).toBe(2026);
  expect(reservations[0].start.getMonth()).toBe(7);
  expect(reservations[0].start.getDate()).toBe(10);
  expect(reservations[0].end.getDate()).toBe(13);
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
