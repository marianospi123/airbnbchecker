import React, { useEffect, useState } from "react";
import { getMeta, getReservas, updateReserva, createReserva } from "../api";
import "../ReservasAdmin.css";

export default function ReservasAdmin() {
  const [meta, setMeta] = useState({ apartamentos: [], meses: [], anos: [] });
  const [filters, setFilters] = useState({ apartamento: "", mes: "", ano: "" });
  const [loading, setLoading] = useState(false);
  const [reservas, setReservas] = useState([]);

  // ---- Editar ----
  const [editing, setEditing] = useState(null);
  const [editFields, setEditFields] = useState({
    "Check-in": "",
    "Check-out": "",
    "# huespedes": "",
    "Total Pagado": "",
    "Limpieza": "",
  });

  // ---- Crear ----
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newFields, setNewFields] = useState({
    Apartamento: "",
    Plataforma: "Directa",
    Huesped: "",
    "# Reserva": "",
    "Check-in": "",
    "Check-out": "",
    "# huespedes": "",
    "Total Pagado": "",
    Limpieza: "",
    Estado: "Confirmada",
    Notas: "",
  });

  useEffect(() => {
    (async () => {
      const m = await getMeta();
      setMeta(m);

      // defaults filtros
      setFilters((f) => ({
        ...f,
        apartamento: m.apartamentos?.[0] || "",
        mes: m.meses?.[0] || "",
        ano: m.anos?.[0] || "",
      }));

      // default para crear
      setNewFields((p) => ({
        ...p,
        Apartamento: m.apartamentos?.[0] || "",
      }));
    })().catch(console.error);
  }, []);

  async function onBuscar() {
    setLoading(true);
    try {
      const list = await getReservas(filters);
      setReservas(list);
    } catch (e) {
      alert("❌ " + (e?.message || "Error buscando"));
    } finally {
      setLoading(false);
    }
  }

  function normalizeDate(v) {
    if (!v) return "";
    const s = String(v).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
      const dd = m[1].padStart(2, "0");
      const mm = m[2].padStart(2, "0");
      return `${m[3]}-${mm}-${dd}`;
    }
    return s;
  }

  function openEdit(res) {
    setEditing(res);
    setEditFields({
      "Check-in": normalizeDate(res["Check-in"]),
      "Check-out": normalizeDate(res["Check-out"]),
      "# huespedes": res["# huespedes"] ?? "",
      "Total Pagado": res["Total Pagado"] ?? "",
      "Limpieza": res["Limpieza"] ?? "",
    });
  }

  async function onGuardar() {
    if (!editing?.ID_UNICO) {
      alert("Esta reserva no tiene ID_UNICO. Revisa el maestro.");
      return;
    }

    const payload = {};
    Object.keys(editFields).forEach((k) => {
      if (editFields[k] !== "" && editFields[k] !== null) payload[k] = editFields[k];
    });

    try {
      await updateReserva(editing.ID_UNICO, payload);
      alert("✅ Reserva actualizada");
      setEditing(null);
      await onBuscar();
    } catch (e) {
      alert("❌ " + (e?.message || "Error guardando"));
    }
  }

  function openCreate() {
    // reset (manteniendo apartamento default si existe)
    setNewFields((p) => ({
      Apartamento: meta.apartamentos?.[0] || p.Apartamento || "",
      Plataforma: "Directa",
      Huesped: "",
      "# Reserva": "",
      "Check-in": "",
      "Check-out": "",
      "# huespedes": "",
      "Total Pagado": "",
      Limpieza: "",
      Estado: "Confirmada",
      Notas: "",
    }));
    setShowCreate(true);
  }
  async function onCrearReserva() {
  if (!newFields.Apartamento) return alert("Falta Apartamento");
  if (!String(newFields.Huesped || "").trim()) return alert("Falta Huésped");
  if (!newFields["Check-in"]) return alert("Falta Check-in");
  if (!newFields["Check-out"]) return alert("Falta Check-out");

  // ✅ Validar fechas
  const ci = new Date(newFields["Check-in"]);
  const co = new Date(newFields["Check-out"]);
  if (isNaN(ci) || isNaN(co)) return alert("Fechas inválidas");
  if (co <= ci) return alert("Check-out debe ser mayor que Check-in");

  // ✅ Calcular noches (diferencia en días)
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const nights = Math.round((co - ci) / MS_PER_DAY);
  if (!nights || nights <= 0) return alert("Noches inválidas");

  // ✅ Mes / Año (ENE–DIC) desde Check-in
  const mesesMap = {
    "01": "ENE",
    "02": "FEB",
    "03": "MAR",
    "04": "ABR",
    "05": "MAY",
    "06": "JUN",
    "07": "JUL",
    "08": "AGO",
    "09": "SEP",
    "10": "OCT",
    "11": "NOV",
    "12": "DIC",
  };

  const yyyy = String(ci.getFullYear());
  const mm = String(ci.getMonth() + 1).padStart(2, "0");
  const mesTxt = mesesMap[mm] || "";

  const payload = {
    ...newFields,
    "Check-in": newFields["Check-in"],   // deja como string yyyy-mm-dd
    "Check-out": newFields["Check-out"], // deja como string yyyy-mm-dd
    "Año": yyyy,
    Mes: mesTxt,
    "# noches": nights,
  };

  setCreating(true);
  try {
    await createReserva(payload);
    alert("✅ Reserva creada");
    setShowCreate(false);
    await onBuscar();
  } catch (e) {
    alert("❌ " + (e?.message || "Error creando"));
  } finally {
    setCreating(false);
  }
}


function formatDateOnly(v) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d)) {
    // si ya viene como string tipo "2025-12-20"
    const s = String(v).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    return s;
  }
  // devuelve yyyy-mm-dd sin hora
  return d.toISOString().slice(0, 10);
}

return (
  <div className="rx-wrap">
    <div className="rx-card">
      <div className="rx-header">
        <div className="rx-title">
          <h2>Reservas - Admin</h2>
          <p>Filtra, edita y crea reservas en el maestro.</p>
        </div>

        <div className="rx-actions">
          <button className="rx-btn rx-btn--blue" onClick={onBuscar} disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
          <button className="rx-btn rx-btn--primary" onClick={openCreate} disabled={loading}>
            + Nueva reserva
          </button>
        </div>
      </div>

      <div className="rx-toolbar">
        <div className="rx-field">
          <div className="rx-label">Apartamento</div>
          <select
            className="rx-select"
            value={filters.apartamento}
            onChange={(e) => setFilters({ ...filters, apartamento: e.target.value })}
            disabled={!meta.apartamentos.length}
          >
            <option value="">Selecciona...</option>
            {meta.apartamentos.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="rx-field">
          <div className="rx-label">Mes</div>
          <select
            className="rx-select"
            value={filters.mes}
            onChange={(e) => setFilters({ ...filters, mes: e.target.value })}
            disabled={!meta.meses.length}
          >
            <option value="">Mes</option>
            {meta.meses.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="rx-field">
          <div className="rx-label">Año</div>
          <select
            className="rx-select"
            value={filters.ano}
            onChange={(e) => setFilters({ ...filters, ano: e.target.value })}
            disabled={!meta.anos.length}
          >
            <option value="">Año</option>
            {meta.anos.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rx-tableWrap">
        <table className="rx-table">
          <thead>
            <tr>
              <th>Huésped</th>
              <th># Reserva</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th># noches</th>
              <th># huéspedes</th>
              <th>Total</th>
              <th>Limpieza</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {reservas.map((r) => (
              <tr key={r.ID_UNICO || `${r["# Reserva"]}-${r.Huesped}`}>
                <td>{r.Huesped}</td>
                <td>{r["# Reserva"]}</td>
                <td>{formatDateOnly(r["Check-in"])}</td>
                <td>{formatDateOnly(r["Check-out"])}</td>
                <td>{r["# noches"]}</td>
                <td>{r["# huespedes"]}</td>
                <td>{r["Total Pagado"]}</td>
                <td>{r["Limpieza"]}</td>
                <td>
                  <button className="rx-btn" onClick={() => openEdit(r)}>Editar</button>
                </td>
              </tr>
            ))}

            {!reservas.length && (
              <tr>
                <td colSpan="9" className="rx-empty">
                  No hay reservas para ese filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* MODAL EDITAR */}
    {editing && (
      <div className="rx-modalOverlay">
        <div className="rx-modal">
          <div className="rx-modalHeader">
            <h3>Editar reserva</h3>
            <div className="rx-muted">
              {editing.Apartamento} — {editing.Huesped} — #{editing["# Reserva"]}
              <div style={{ marginTop: 4, fontSize: 12 }}>ID_UNICO: {editing.ID_UNICO}</div>
            </div>
          </div>

          <div className="rx-modalBody">
            <div className="rx-grid">
              <label className="rx-field">
                <div className="rx-label">Check-in</div>
                <input
                  className="rx-input"
                  type="date"
                  value={editFields["Check-in"]}
                  onChange={(e) => setEditFields({ ...editFields, "Check-in": e.target.value })}
                />
              </label>

              <label className="rx-field">
                <div className="rx-label">Check-out</div>
                <input
                  className="rx-input"
                  type="date"
                  value={editFields["Check-out"]}
                  onChange={(e) => setEditFields({ ...editFields, "Check-out": e.target.value })}
                />
              </label>

              <label className="rx-field">
                <div className="rx-label"># huéspedes</div>
                <input
                  className="rx-input"
                  value={editFields["# huespedes"]}
                  onChange={(e) => setEditFields({ ...editFields, "# huespedes": e.target.value })}
                  placeholder="Ej: 2 adultos"
                />
              </label>

              <label className="rx-field">
                <div className="rx-label">Total pagado</div>
                <input
                  className="rx-input"
                  value={editFields["Total Pagado"]}
                  onChange={(e) => setEditFields({ ...editFields, "Total Pagado": e.target.value })}
                />
              </label>

              <label className="rx-field">
                <div className="rx-label">Limpieza</div>
                <input
                  className="rx-input"
                  value={editFields["Limpieza"]}
                  onChange={(e) => setEditFields({ ...editFields, "Limpieza": e.target.value })}
                />
              </label>
            </div>
          </div>

          <div className="rx-modalFooter">
            <button className="rx-btn" onClick={() => setEditing(null)}>Cancelar</button>
            <button className="rx-btn rx-btn--primary" onClick={onGuardar}>Guardar</button>
          </div>
        </div>
      </div>
    )}

    {/* MODAL CREAR */}
    {showCreate && (
      <div className="rx-modalOverlay">
        <div className="rx-modal">
          <div className="rx-modalHeader">
            <h3>Nueva reserva</h3>
            <div className="rx-muted">Registra una reserva manual (Directa/Airbnb/Estei/Booking).</div>
          </div>

          <div className="rx-modalBody">
            <div className="rx-grid">
              <label className="rx-field">
                <div className="rx-label">Apartamento</div>
                <select
                  className="rx-select"
                  value={newFields.Apartamento}
                  onChange={(e) => setNewFields({ ...newFields, Apartamento: e.target.value })}
                >
                  <option value="">Selecciona...</option>
                  {meta.apartamentos.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </label>

              <label className="rx-field">
                <div className="rx-label">Plataforma</div>
                <select
                  className="rx-select"
                  value={newFields.Plataforma}
                  onChange={(e) => setNewFields({ ...newFields, Plataforma: e.target.value })}
                >
                  {["Directa", "Airbnb", "Estei", "Booking", "Otro"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>

              <label className="rx-field">
                <div className="rx-label">Huésped</div>
                <input
                  className="rx-input"
                  value={newFields.Huesped}
                  onChange={(e) => setNewFields({ ...newFields, Huesped: e.target.value })}
                  placeholder="Nombre completo"
                />
              </label>

              <label className="rx-field">
                <div className="rx-label"># Reserva (opcional)</div>
                <input
                  className="rx-input"
                  value={newFields["# Reserva"]}
                  onChange={(e) => setNewFields({ ...newFields, ["# Reserva"]: e.target.value })}
                  placeholder="Ej: AB1234"
                />
              </label>

              <label className="rx-field">
                <div className="rx-label">Check-in</div>
                <input
                  className="rx-input"
                  type="date"
                  value={newFields["Check-in"]}
                  onChange={(e) => setNewFields({ ...newFields, "Check-in": e.target.value })}
                />
              </label>

              <label className="rx-field">
                <div className="rx-label">Check-out</div>
                <input
                  className="rx-input"
                  type="date"
                  value={newFields["Check-out"]}
                  onChange={(e) => setNewFields({ ...newFields, "Check-out": e.target.value })}
                />
              </label>

              <label className="rx-field">
                <div className="rx-label"># huéspedes</div>
                <input
                  className="rx-input"
                  value={newFields["# huespedes"]}
                  onChange={(e) => setNewFields({ ...newFields, "# huespedes": e.target.value })}
                  placeholder="Ej: 2 adultos"
                />
              </label>

              <label className="rx-field">
                <div className="rx-label">Total pagado</div>
                <input
                  className="rx-input"
                  value={newFields["Total Pagado"]}
                  onChange={(e) => setNewFields({ ...newFields, "Total Pagado": e.target.value })}
                  placeholder="Ej: 250"
                />
              </label>

              <label className="rx-field">
                <div className="rx-label">Limpieza</div>
                <input
                  className="rx-input"
                  value={newFields.Limpieza}
                  onChange={(e) => setNewFields({ ...newFields, Limpieza: e.target.value })}
                  placeholder="Ej: 25"
                />
              </label>

              <label className="rx-field">
                <div className="rx-label">Estado</div>
                <select
                  className="rx-select"
                  value={newFields.Estado}
                  onChange={(e) => setNewFields({ ...newFields, Estado: e.target.value })}
                >
                  {["Confirmada", "Pendiente", "Cancelada"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="rx-field" style={{ gridColumn: "1 / -1" }}>
                <div className="rx-label">Notas (opcional)</div>
                <textarea
                  className="rx-textarea"
                  rows={3}
                  value={newFields.Notas}
                  onChange={(e) => setNewFields({ ...newFields, Notas: e.target.value })}
                />
              </label>
            </div>
          </div>

          <div className="rx-modalFooter">
            <button className="rx-btn" onClick={() => setShowCreate(false)} disabled={creating}>
              Cancelar
            </button>
            <button className="rx-btn rx-btn--primary" onClick={onCrearReserva} disabled={creating}>
              {creating ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}