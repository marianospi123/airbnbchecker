import ICAL from "ical.js";

const EMPTY_CALENDAR_PROTECTED_PROPERTIES = new Set(["Chacao", "Altamira 1"]);

export function parseIcalReservas(text) {
  if (!text || !text.includes("BEGIN:VCALENDAR")) {
    throw new Error("El archivo descargado no parece un calendario iCal válido.");
  }

  const jcalData = ICAL.parse(text);
  const comp = new ICAL.Component(jcalData);
  const events = comp.getAllSubcomponents("vevent");

  return events
    .map((eventComponent) => {
      const event = new ICAL.Event(eventComponent);

      return {
        start: event.startDate ? event.startDate.toJSDate() : null,
        end: event.endDate ? event.endDate.toJSDate() : null,
        summary: event.summary || "",
      };
    })
    .filter((reservation) => reservation.start && reservation.end);
}

export function getCalendarHealth({
  propertyName,
  configuredSources,
  successfulSources,
  reservations,
  warnings,
}) {
  const allSourcesSucceeded =
    configuredSources > 0 && successfulSources === configuredSources;
  const protectedEmptyCalendar =
    EMPTY_CALENDAR_PROTECTED_PROPERTIES.has(propertyName) &&
    allSourcesSucceeded &&
    reservations.length === 0;
  const messages = [...warnings];

  if (protectedEmptyCalendar) {
    messages.push(
      `Los calendarios de ${propertyName} llegaron vacíos. No se muestra disponible por seguridad.`
    );
  }

  return {
    forceUnavailable: messages.length > 0,
    warning: messages.join(" "),
  };
}
