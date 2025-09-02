// src/components/Reservas.js
import { useState, useEffect, useRef } from "react";
import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";
import { parseDate, getAlert, getRowClass } from "../utils/utils";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [tokenFCM, setTokenFCM] = useState("");
  const isFirstLoad = useRef(true);

 // Definición de campos
const campos = [
  { key: "fechaCheckin", label: "Fecha Check-in", type: "date" },
  { key: "fechaCheckout", label: "Fecha Check-out", type: "date" },
  { key: "plataforma", label: "Plataforma", type: "text" },
  { key: "huesped", label: "Huésped", type: "text" },
  { key: "monto", label: "Monto", type: "number" },
  { key: "noches", label: "Noches", type: "number" },

  // 🔄 Cambiados a checkbox
  { key: "documentacion", label: "Documentación", type: "check" },
  { key: "checkin", label: "Check-in", type: "check" },
  { key: "cada3dias", label: "Cada 3 días", type: "check" },
  { key: "checkout", label: "Check-out", type: "check" },
];


  // -----------------------
  // Cargar reservas desde backend o localStorage
  // -----------------------
  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const res = await fetch("http://localhost:4004/api/reservas");
        if (!res.ok) throw new Error("Backend no disponible");
        const data = await res.json();
        setReservas(Array.isArray(data) ? data : []);
        localStorage.setItem("reservas", JSON.stringify(data));
      } catch (err) {
        console.warn("Usando localStorage por error en backend:", err);
        const local = localStorage.getItem("reservas");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            setReservas(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            setReservas([]);
          }
        } else {
          setReservas([]);
        }
      }
    };
    cargarReservas();
  }, []);

  // -----------------------
  // Guardar token FCM y registrar SW
  // -----------------------
  useEffect(() => {
    const registrarSWyFCM = async () => {
      try {
        const sw = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("Service Worker registrado:", sw);

        const permiso = await Notification.requestPermission();
        if (permiso === "granted") {
          const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
          if (token) {
            setTokenFCM(token);
            console.log("Token FCM:", token);
            await fetch("http://localhost:4004/api/fcm-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });
          }
        }
      } catch (err) {
        console.error("Error registrando SW o FCM:", err);
      }
    };

    registrarSWyFCM();

    onMessage(messaging, (payload) => {
  console.log("Mensaje recibido:", payload);
  // alert eliminado para que no interrumpa al usuario
});

  }, []);

  // -----------------------
  // Guardar en localStorage cada vez que cambian reservas
  // -----------------------
  useEffect(() => {
    if (!isFirstLoad.current) {
      localStorage.setItem("reservas", JSON.stringify(reservas));
    } else {
      isFirstLoad.current = false;
    }
  }, [reservas]);

  // -----------------------
  // Función para enviar notificación
  // -----------------------
  const enviarNotificacion = async (reserva) => {
    if (!tokenFCM || !reserva) return;
    try {
      const message = {
        notification: {
          title: "Reserva Actualizada",
          body: `Reserva de ${reserva.huesped} para ${reserva.fechaCheckin}`,
        },
        tokens: [tokenFCM],
      };

      await fetch("http://localhost:4004/api/fcm-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
    } catch (err) {
      console.error("Error enviando notificación:", err);
    }
  };

  // -----------------------
  // Agregar nueva reserva
  // -----------------------
  const agregarReserva = async () => {
    const hoy = new Date();
    const manana = new Date();
    manana.setDate(hoy.getDate() + 1);

    const nueva = {
      fechaCheckin: hoy.toISOString().split("T")[0],
      fechaCheckout: manana.toISOString().split("T")[0],
      plataforma: "",
      huesped: "Pendiente",
      monto: 0,
      noches: 1,
      documentacion: "", // 🔄 cambiado
      checkin: "",
      cada3dias: "",
      checkout: "",
    };

    try {
      const res = await fetch("http://localhost:4004/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva),
      });
      const data = await res.json();
      const nuevaFinal = data.success && data.reserva ? data.reserva : nueva;
      setReservas([...reservas, nuevaFinal]);
      enviarNotificacion(nuevaFinal);
    } catch (err) {
      console.error("Error agregando reserva:", err);
      setReservas([...reservas, nueva]);
      enviarNotificacion(nueva);
    }
  };

  // -----------------------
  // Editar reserva
  // -----------------------
  const editarReserva = async (idx, campo, valor) => {
    const copia = [...reservas];
    copia[idx][campo] = valor;
    setReservas(copia);

    const reserva = copia[idx];
    if (reserva.id) {
      try {
        await fetch(`http://localhost:4004/api/reservas/${reserva.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reserva),
        });
        enviarNotificacion(reserva);
      } catch (err) {
        console.error("Error actualizando reserva:", err);
      }
    }
  };

  // -----------------------
  // Borrar reserva
  // -----------------------
  const borrarReserva = async (idx) => {
    const reserva = reservas[idx];
    const nuevas = reservas.filter((_, i) => i !== idx);
    setReservas(nuevas);

    if (reserva.id) {
      try {
        await fetch(`http://localhost:4004/api/reservas/${reserva.id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Error borrando reserva:", err);
      }
    }
  };

  // -----------------------
  // Ordenar reservas
  // -----------------------
  const reservasOrdenadas = [...reservas].sort(
    (a, b) => parseDate(a.fechaCheckin) - parseDate(b.fechaCheckin)
  );

  // -----------------------
  // Resumen de alertas
  // -----------------------
  const resumen = reservas.reduce(
    (acc, r) => {
      const alert = getAlert(r);
      if (alert.includes("Hoy llega")) acc.checkins++;
      if (alert.includes("Enviar información") || alert.includes("Seguimiento")) acc.seguimientos++;
      if (alert.includes("Check-out pendiente")) acc.checkouts++;
      return acc;
    },
    { checkins: 0, seguimientos: 0, checkouts: 0 }
  );

  // -----------------------
  // Guardar manual localStorage
  // -----------------------
  const guardarLocal = () => {
    localStorage.setItem("reservas", JSON.stringify(reservas));
    alert("Reservas guardadas localmente ✅");
  };

const importarExcel = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:4004/api/importar-excel", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.ok) {
      alert("✅ Reservas importadas desde Excel");
      // recargar reservas
      const res2 = await fetch("http://localhost:4004/api/reservas");
      const reservasNuevas = await res2.json();
      setReservas(reservasNuevas);
      localStorage.setItem("reservas", JSON.stringify(reservasNuevas));
    } else {
      alert("❌ Error importando: " + data.msg);
    }
  } catch (err) {
    console.error("Error importando Excel:", err);
    alert("Error subiendo archivo");
  }
};

const reservasPorMes = reservasOrdenadas.reduce((acc, r) => {
  const fecha = parseDate(r.fechaCheckin);
  if (!fecha) return acc;
  const mes = fecha.toLocaleString("es-ES", { month: "long", year: "numeric" });
  if (!acc[mes]) acc[mes] = [];
  acc[mes].push(r);
  return acc;
}, {});



return (
  <div className="p-6 space-y-8">
    {/* Resumen de tareas */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-5 rounded-2xl shadow bg-white hover:shadow-lg transition">
        <h3 className="font-bold text-gray-600">Check-ins hoy</h3>
        <p className="text-3xl font-extrabold text-blue-600">{resumen.checkins}</p>
      </div>
      <div className="p-5 rounded-2xl shadow bg-white hover:shadow-lg transition">
        <h3 className="font-bold text-gray-600">Seguimientos</h3>
        <p className="text-3xl font-extrabold text-yellow-600">{resumen.seguimientos}</p>
      </div>
      <div className="p-5 rounded-2xl shadow bg-white hover:shadow-lg transition">
        <h3 className="font-bold text-gray-600">Check-outs pendientes</h3>
        <p className="text-3xl font-extrabold text-red-600">{resumen.checkouts}</p>
      </div>
    </div>

    {/* Botones */}
    <div className="flex flex-wrap gap-3">
      <button
        onClick={agregarReserva}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md transition"
      >
        ➕ Nueva Reserva
      </button>

      <button
        onClick={guardarLocal}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-md transition"
      >
        💾 Guardar Local
      </button>

      <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition">
        📂 Importar Excel
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={importarExcel}
          className="hidden"
        />
      </label>
    </div>

    {/* Tablas agrupadas por mes */}
    {Object.entries(reservasPorMes).map(([mes, reservasMes]) => (
      <div key={mes} className="mb-12">
        {/* Encabezado de mes */}
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-3 rounded-lg shadow mb-4">
          {mes.toUpperCase()}
        </h2>

        <div className="overflow-x-auto rounded-2xl shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
              <tr>
                {campos.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-semibold border-b">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold border-b">Alertas</th>
                <th className="px-4 py-3 font-semibold border-b text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasMes.map((r, i) => (
                <tr
                  key={r.id || i}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  {campos.map((c) => (
                    <td key={c.key} className="px-3 py-2 border-b">
                      {c.type === "check" ? (
                        <input
                          type="checkbox"
                          checked={!!r[c.key]}
                          onChange={(e) => {
                            const valor = e.target.checked;
                            const copia = [...reservas];
                            const idx = reservas.findIndex((res) => res.id === r.id);
                            copia[idx][c.key] = valor;
                            setReservas(copia);
                            editarReserva(idx, c.key, valor);
                          }}
                          className="w-5 h-5 accent-blue-600 cursor-pointer"
                        />
                      ) : (
                        <input
                          type={c.type}
                          value={r[c.key] ?? ""}
                          onChange={(e) => {
                            const valor = e.target.value;
                            const copia = [...reservas];
                            const idx = reservas.findIndex((res) => res.id === r.id);
                            copia[idx][c.key] = valor;
                            setReservas(copia);
                          }}
                          onBlur={(e) =>
                            editarReserva(
                              reservas.findIndex((res) => res.id === r.id),
                              c.key,
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      )}
                    </td>
                  ))}

                  <td className="px-3 py-2 border-b font-bold text-red-600">
                    {getAlert(r)}
                  </td>
                  <td className="px-3 py-2 border-b text-center">
                    <button
                      onClick={() =>
                        borrarReserva(reservas.findIndex((res) => res.id === r.id))
                      }
                      className="text-red-500 hover:text-red-700 transition"
                      title="Eliminar"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ))}

    {tokenFCM && (
      <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
        ✅ Token FCM listo para recibir notificaciones.
      </div>
    )}
  </div>
);
}