import { useState } from "react";
import { ArrowRight, Check, CircleAlert, LockKeyhole, Ticket, Webhook } from "lucide-react";
import { DemoFooter, DemoHeader, DemoIntro, Metric, Panel } from "./DemoApp";

type TicketStatus = "libre" | "reservada" | "vendida";
type Audit = { id: number; type: string; detail: string };
type Reservation = { tickets: number[]; eventId: string };

const soldSeed = [3, 7, 12, 18, 21, 29, 34, 43, 48, 53, 61, 64, 72, 79, 86, 94, 108, 113, 127, 135, 142, 154, 168, 173, 187, 196];
const initialTickets = (): Record<number, TicketStatus> => Object.fromEntries(Array.from({ length: 200 }, (_, index) => [index + 1, soldSeed.includes(index + 1) ? "vendida" : "libre"]));
const formatTicket = (value: number) => String(value).padStart(3, "0");
const bundlePrice = (quantity: number) => quantity * 12 - Math.max(quantity - 1, 0) * 2;

export function RaffleDemo() {
  const [tickets, setTickets] = useState(initialTickets);
  const [selected, setSelected] = useState<number[]>([]);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [processed, setProcessed] = useState<string[]>([]);
  const [lastEvent, setLastEvent] = useState("");
  const [events, setEvents] = useState<Audit[]>([
    { id: 1, type: "WEBHOOK", detail: "evt_demo_038 · pago confirmado, entradas asignadas" },
    { id: 2, type: "RESERVA", detail: "Las entradas 187 y 196 fueron asignadas sin conflicto" },
  ]);
  const [mode, setMode] = useState<"participante" | "admin">("participante");
  const [message, setMessage] = useState("");
  const sold = Object.values(tickets).filter((status) => status === "vendida").length;
  const reserved = Object.values(tickets).filter((status) => status === "reservada").length;
  const available = 200 - sold - reserved;

  function reset() {
    setTickets(initialTickets()); setSelected([]); setReservation(null); setProcessed([]); setLastEvent("");
    setEvents([{ id: 1, type: "WEBHOOK", detail: "evt_demo_038 · pago confirmado, entradas asignadas" }, { id: 2, type: "RESERVA", detail: "Las entradas 187 y 196 fueron asignadas sin conflicto" }]);
    setMode("participante"); setMessage("Datos de demostración restaurados.");
  }

  function toggleTicket(number: number) {
    if (tickets[number] !== "libre" || reservation) return;
    if (selected.includes(number)) setSelected((items) => items.filter((item) => item !== number));
    else if (selected.length < 4) setSelected((items) => [...items, number].sort((a, b) => a - b));
    else setMessage("Puedes seleccionar hasta cuatro entradas por operación.");
  }

  function reserve() {
    if (!selected.length || reservation) return;
    if (selected.some((number) => tickets[number] !== "libre")) { setMessage("Alguna entrada dejó de estar disponible. Elige otra."); return; }
    const eventId = `evt_demo_${String(39 + processed.length).padStart(3, "0")}`;
    setTickets((current) => ({ ...current, ...Object.fromEntries(selected.map((number) => [number, "reservada"])) }));
    setReservation({ tickets: selected, eventId });
    setEvents((current) => [{ id: Date.now(), type: "RESERVA", detail: `${selected.map(formatTicket).join(", ")} bloqueadas para la compra simulada` }, ...current]);
    setSelected([]); setMessage("Reserva creada. Confirma el pago simulado o libera las entradas.");
  }

  function cancel() {
    if (!reservation) return;
    const numbers = reservation.tickets;
    setTickets((current) => ({ ...current, ...Object.fromEntries(numbers.map((number) => [number, "libre"])) }));
    setEvents((current) => [{ id: Date.now(), type: "LIBERACIÓN", detail: `${numbers.map(formatTicket).join(", ")} vuelven a estar disponibles` }, ...current]);
    setReservation(null); setMessage("Reserva cancelada. Las entradas vuelven al inventario.");
  }

  function confirm() {
    if (!reservation) return;
    const { tickets: numbers, eventId } = reservation;
    if (processed.includes(eventId)) { setMessage("Evento ya procesado. No se duplicó la compra."); return; }
    setTickets((current) => ({ ...current, ...Object.fromEntries(numbers.map((number) => [number, "vendida"])) }));
    setProcessed((current) => [...current, eventId]); setLastEvent(eventId);
    setEvents((current) => [{ id: Date.now(), type: "WEBHOOK", detail: `${eventId} · ${numbers.length} entradas asignadas; confirmación simulada` }, ...current]);
    setReservation(null); setMessage("Pago simulado confirmado. Las entradas están asignadas; no se realizó ningún cobro ni se envió correo.");
  }

  function replay() {
    if (!lastEvent) return;
    if (processed.includes(lastEvent)) {
      setEvents((current) => [{ id: Date.now(), type: "IDEMPOTENCIA", detail: `${lastEvent} repetido · sin cambios en entradas ni ventas` }, ...current]);
      setMessage(`${lastEvent} ya se había procesado: el webhook repetido no asignó entradas otra vez.`);
    }
  }

  return <div className="demo-page demo-raffle">
    <DemoHeader active="tattoo-raffle" onReset={reset} />
    <main className="demo-main">
      <DemoIntro index="03" eyebrow="PAYMENTS & RESERVATIONS" title="Tattoo Raffle" description="Una campaña de 200 participaciones donde cada número debe tener un solo dueño. Selecciona entradas, reserva y reproduce una confirmación de pago sin realizar cargos." accent="#ff9c80" />
      <div className="demo-flow"><span><Ticket size={17} /> SELECCIÓN</span><i /><span>RESERVA ATÓMICA</span><i /><span>CHECKOUT SIMULADO</span><i /><span>WEBHOOK IDEMPOTENTE</span></div>
      <div className="demo-metrics demo-metrics-four"><Metric label="PARTICIPACIONES" value="200" detail="Numeradas del 001 al 200" /><Metric label="DISPONIBLES" value={String(available).padStart(3, "0")} detail="Listas para reservar" /><Metric label="RESERVADAS" value={String(reserved).padStart(2, "0")} detail="Pendientes de confirmar" /><Metric label="ASIGNADAS" value={String(sold).padStart(3, "0")} detail="Incluye datos de ejemplo" className="demo-metric-emphasis" /></div>
      <div className="demo-mode-switch" role="group" aria-label="Vista de la demo"><button className={mode === "participante" ? "active" : ""} type="button" onClick={() => setMode("participante")}>01 / Participante</button><button className={mode === "admin" ? "active" : ""} type="button" onClick={() => setMode("admin")}>02 / Panel administrativo</button><span>SIMULACIÓN / SIN PAGO REAL</span></div>
      {mode === "participante" ? <div className="demo-dashboard demo-raffle-layout">
        <Panel kicker="01 / INVENTARIO" title="Elige tus números" className="demo-ticket-panel"><div className="demo-ticket-legend"><span><i className="free" /> Disponible</span><span><i className="selected" /> Seleccionada</span><span><i className="reserved" /> Reservada</span><span><i className="sold" /> Asignada</span></div><div className="demo-ticket-grid" aria-label="Participaciones 001 a 200">{Array.from({ length: 200 }, (_, index) => index + 1).map((number) => <button type="button" key={number} className={`${tickets[number]} ${selected.includes(number) ? "chosen" : ""}`} disabled={tickets[number] !== "libre" || Boolean(reservation)} aria-label={`Entrada ${formatTicket(number)}, ${selected.includes(number) ? "seleccionada" : tickets[number]}`} aria-pressed={selected.includes(number)} onClick={() => toggleTicket(number)}>{formatTicket(number)}</button>)}</div><div className="demo-panel-bottom"><LockKeyhole size={14} /> Cada entrada solo puede pertenecer a una reserva</div></Panel>
        <Panel kicker="02 / CHECKOUT" title="Tu selección" className="demo-checkout-panel"><div className="demo-checkout-icon"><Ticket size={34} strokeWidth={1.5} /></div>{reservation ? <><p className="demo-checkout-label">RESERVA ACTIVA</p><div className="demo-picked">{reservation.tickets.map((number) => <span key={number}>{formatTicket(number)}</span>)}</div><div className="demo-checkout-total"><span>Total simulado</span><strong>${bundlePrice(reservation.tickets.length)}</strong></div><button className="demo-action" type="button" onClick={confirm}><Check size={16} /> Confirmar pago simulado</button><button className="demo-text-button" type="button" onClick={cancel}>Liberar reserva</button></> : <><p className="demo-checkout-label">HASTA 4 ENTRADAS</p><div className="demo-picked">{selected.length ? selected.map((number) => <span key={number}>{formatTicket(number)}</span>) : <em>Selecciona números disponibles</em>}</div><div className="demo-checkout-total"><span>Total simulado</span><strong>${bundlePrice(selected.length)}</strong></div><button className="demo-action" type="button" disabled={!selected.length} onClick={reserve}><LockKeyhole size={16} /> Reservar entradas</button></>}<p className="demo-form-hint"><CircleAlert size={14} /> Esta pantalla no pide tarjeta, no cobra y no envía correos.</p></Panel>
      </div> : <div className="demo-dashboard demo-raffle-admin"><Panel kicker="03 / CONTROL" title="Estado de campaña"><div className="demo-admin-bars"><div><span>Asignadas</span><strong>{sold} / 200</strong><i><b style={{ width: `${sold / 2}%` }} /></i></div><div><span>Reservadas</span><strong>{reserved} / 200</strong><i><b style={{ width: `${Math.max(reserved / 2, reserved ? 2 : 0)}%` }} /></i></div><div><span>Disponibles</span><strong>{available} / 200</strong><i><b style={{ width: `${available / 2}%` }} /></i></div></div><div className="demo-admin-note"><Webhook size={19} /><p>Después de confirmar una compra simulada, reproduce el mismo evento de webhook. El contador debe mantenerse igual.</p></div><button className="demo-action secondary" disabled={!lastEvent} type="button" onClick={replay}><Webhook size={16} /> Repetir último webhook</button></Panel><Panel kicker="04 / EVENTOS" title="Registro de operaciones"><ol className="demo-raffle-events">{events.slice(0, 8).map((event) => <li key={event.id}><span>{event.type}</span><p>{event.detail}</p></li>)}</ol></Panel></div>}
      <div className="demo-bottom-grid"><div className="demo-insight"><span>DECISIÓN DE INGENIERÍA / 03</span><h2>Un número, un dueño.</h2><p>La reserva aparta entradas antes del pago. La confirmación las asigna; un webhook repetido se reconoce por su identificador y no modifica el resultado.</p><div className="demo-insight-line"><ArrowRight size={18} /> RESERVA Y REPITE EL EVENTO</div></div><div className="demo-process-card"><span>FLUJO DE UNA ENTRADA</span><div><b>01</b><p>Disponible</p></div><div><b>02</b><p>Reservada</p></div><div><b>03</b><p>Asignada</p></div><small>La cancelación devuelve la entrada al estado disponible.</small></div></div>
      {message && <div className="demo-toast" role="status">{message}</div>}
    </main><DemoFooter active="tattoo-raffle" />
  </div>;
}
