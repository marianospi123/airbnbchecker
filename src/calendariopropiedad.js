import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function CalendarioPropiedad({ nombre, reservas, currentDate }) {
  const eventos = reservas.map((r, idx) => ({
    id: idx,
    display: 'background',
    start: new Date(r.start), // 👈 mantenemos objeto Date
    end: new Date(r.end),     // 👈 sin formatear a string
    backgroundColor: '#f87171',
    allDay: true,
  }));

  return (
    <div style={{ margin: '2rem 0' }}>
      <h4>{nombre}</h4>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialDate={currentDate}
        events={eventos}
        height="auto"
        key={currentDate}
      />
    </div>
  );
}

export default CalendarioPropiedad;
