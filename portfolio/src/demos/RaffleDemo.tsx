import { useEffect, useState } from "react";
import { ArrowRight, Check, CircleAlert, LockKeyhole, Ticket, Webhook } from "lucide-react";
import { DemoFooter, DemoHeader, Metric, Panel, SandboxHeading } from "./DemoApp";
import { t } from "./demo-i18n";
import type { Language } from "./demo-i18n";
import { DemoStory } from "./DemoStory";
import { useDemoSession } from "./demo-session";

type TicketStatus = "libre" | "reservada" | "vendida";
type Audit = { id: number; type: string; detail: string; detailEn?: string };
type Reservation = { tickets: number[]; eventId: string };

const soldSeed = [3, 7, 12, 18, 21, 29, 34, 43, 48, 53, 61, 64, 72, 79, 86, 94, 108, 113, 127, 135, 142, 154, 168, 173, 187, 196];
const initialTickets = (): Record<number, TicketStatus> => Object.fromEntries(Array.from({ length: 200 }, (_, index) => [index + 1, soldSeed.includes(index + 1) ? "vendida" : "libre"]));
const formatTicket = (value: number) => String(value).padStart(3, "0");
const packagePrices = [0, 50, 100, 130, 180, 220, 260, 300, 340, 380, 420];
const bundlePrice = (quantity: number) => packagePrices[quantity] ?? 0;

const initialEvents = (): Audit[] => ([
    { id: 1, type: "WEBHOOK", detail: "evt_demo_038 · pago confirmado, entradas asignadas", detailEn: "evt_demo_038 · payment confirmed, tickets assigned" },
    { id: 2, type: "RESERVA", detail: "Las entradas 187 y 196 fueron asignadas sin conflicto", detailEn: "Tickets 187 and 196 were assigned without conflict" },
  ]);

export function RaffleDemo({ language, onLanguageChange, preview = false }: { language: Language; onLanguageChange: (language: Language) => void; preview?: boolean }) {
  const [tickets, setTickets] = useDemoSession("raffle-tickets", initialTickets);
  const [selected, setSelected] = useDemoSession<number[]>("raffle-selected", () => []);
  const [reservation, setReservation] = useDemoSession<Reservation | null>("raffle-reservation", () => null);
  const [processed, setProcessed] = useDemoSession<string[]>("raffle-processed", () => []);
  const [lastEvent, setLastEvent] = useDemoSession("raffle-last-event", () => "");
  const [events, setEvents] = useDemoSession("raffle-events", initialEvents);
  const [mode, setMode] = useDemoSession<"participante" | "admin">("raffle-mode", () => "participante");
  const [range, setRange] = useState(0);
  const [ticketSearch, setTicketSearch] = useState("");
  const [message, setMessage] = useState("");
  const sold = Object.values(tickets).filter((status) => status === "vendida").length;
  const reserved = Object.values(tickets).filter((status) => status === "reservada").length;
  const available = 200 - sold - reserved;
  const visibleNumbers = ticketSearch.trim() ? Array.from({ length: 200 }, (_, index) => index + 1).filter((number) => formatTicket(number).includes(ticketSearch.trim())) : Array.from({ length: 50 }, (_, index) => range * 50 + index + 1);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 5000);
    return () => window.clearTimeout(timer);
  }, [message]);

  function reset() {
    setTickets(initialTickets()); setSelected([]); setReservation(null); setProcessed([]); setLastEvent("");
    setEvents(initialEvents()); setRange(0); setTicketSearch("");
    setMode("participante"); setMessage(t(language, "Datos de demostración restaurados.", "Demo data restored."));
  }

  function toggleTicket(number: number) {
    if (tickets[number] !== "libre" || reservation) return;
    if (selected.includes(number)) setSelected((items) => items.filter((item) => item !== number));
    else if (selected.length < 10) setSelected((items) => [...items, number].sort((a, b) => a - b));
    else setMessage(t(language, "Puedes seleccionar hasta diez entradas por operación.", "You can select up to ten tickets per checkout."));
  }

  function choosePackage(quantity: number) {
    if (reservation || available < quantity) return;
    const numbers = Object.entries(tickets).filter(([, status]) => status === "libre").slice(0, quantity).map(([number]) => Number(number));
    setSelected(numbers);
    setTicketSearch("");
    setRange(Math.floor((numbers[0] - 1) / 50));
    setMessage(t(language, `Paquete de ${quantity} entradas preparado. Puedes cambiar los números antes de reservar.`, `${quantity}-ticket package prepared. You can change the numbers before reserving.`));
  }

  function reserve() {
    if (!selected.length || reservation) return;
    if (selected.some((number) => tickets[number] !== "libre")) { setMessage(t(language, "Alguna entrada dejó de estar disponible. Elige otra.", "A ticket is no longer available. Choose another.")); return; }
    const eventId = `evt_demo_${String(39 + processed.length).padStart(3, "0")}`;
    setTickets((current) => ({ ...current, ...Object.fromEntries(selected.map((number) => [number, "reservada"])) }));
    setReservation({ tickets: selected, eventId });
    setEvents((current) => [{ id: Date.now(), type: "RESERVA", detail: `${selected.map(formatTicket).join(", ")} bloqueadas para la compra simulada`, detailEn: `${selected.map(formatTicket).join(", ")} held for simulated checkout` }, ...current]);
    setSelected([]); setMessage(t(language, "Reserva creada. Confirma el pago simulado o libera las entradas.", "Reservation created. Confirm the simulated payment or release the tickets."));
  }

  function cancel() {
    if (!reservation) return;
    const numbers = reservation.tickets;
    setTickets((current) => ({ ...current, ...Object.fromEntries(numbers.map((number) => [number, "libre"])) }));
    setEvents((current) => [{ id: Date.now(), type: "LIBERACIÓN", detail: `${numbers.map(formatTicket).join(", ")} vuelven a estar disponibles`, detailEn: `${numbers.map(formatTicket).join(", ")} are available again` }, ...current]);
    setReservation(null); setMessage(t(language, "Reserva cancelada. Las entradas vuelven al inventario.", "Reservation cancelled. Tickets are available again."));
  }

  function confirm() {
    if (!reservation) return;
    const { tickets: numbers, eventId } = reservation;
    if (processed.includes(eventId)) { setMessage(t(language, "Evento ya procesado. No se duplicó la compra.", "Event already processed. No purchase was duplicated.")); return; }
    setTickets((current) => ({ ...current, ...Object.fromEntries(numbers.map((number) => [number, "vendida"])) }));
    setProcessed((current) => [...current, eventId]); setLastEvent(eventId);
    setEvents((current) => [{ id: Date.now(), type: "WEBHOOK", detail: `${eventId} · ${numbers.length} entradas asignadas; confirmación simulada`, detailEn: `${eventId} · ${numbers.length} tickets assigned; simulated confirmation` }, ...current]);
    setReservation(null); setMessage(t(language, "Pago simulado confirmado. Las entradas están asignadas; no se realizó ningún cobro ni se envió correo.", "Simulated payment confirmed. Tickets are assigned; no charge or email was sent."));
  }

  function replay() {
    if (!lastEvent) return;
    if (processed.includes(lastEvent)) {
      setEvents((current) => [{ id: Date.now(), type: "IDEMPOTENCIA", detail: `${lastEvent} repetido · sin cambios en entradas ni ventas`, detailEn: `${lastEvent} replayed · no change to tickets or sales` }, ...current]);
      setMessage(t(language, `${lastEvent} ya se había procesado: el webhook repetido no asignó entradas otra vez.`, `${lastEvent} was already processed: replaying the webhook did not assign tickets again.`));
    }
  }

  return <div className="demo-page demo-raffle">
    <DemoHeader active="tattoo-raffle" onReset={reset} language={language} onLanguageChange={onLanguageChange} preview={preview} />
    <main className="demo-main">
      {!preview && <DemoStory slug="tattoo-raffle" language={language} />}
      <SandboxHeading language={language} title={t(language, "Elige. Reserva. Comprueba.", "Choose. Reserve. Verify.")} description={t(language, "Prueba la campaña como participante y revisa cada evento en la vista de control.", "Try the campaign as a participant and inspect each event in the control view.")} />
      <div className="demo-flow"><span><Ticket size={17} /> {t(language, "SELECCIÓN", "SELECTION")}</span><i /><span>{t(language, "RESERVA SIMULADA", "SIMULATED RESERVATION")}</span><i /><span>{t(language, "CHECKOUT SIMULADO", "SIMULATED CHECKOUT")}</span><i /><span>{t(language, "EVENTO REPETIBLE", "REPLAYABLE EVENT")}</span></div>
      <div className="demo-metrics demo-metrics-four"><Metric label={t(language, "PARTICIPACIONES", "ENTRIES")} value="200" detail="001—200" /><Metric label={t(language, "DISPONIBLES", "AVAILABLE")} value={String(available).padStart(3, "0")} /><Metric label={t(language, "RESERVADAS", "RESERVED")} value={String(reserved).padStart(2, "0")} /><Metric label={t(language, "ASIGNADAS", "ASSIGNED")} value={String(sold).padStart(3, "0")} className="demo-metric-emphasis" /></div>
      <div className="demo-scenario-bar"><span>{t(language, "PRUEBA EL RECORRIDO", "TRY THE FLOW")}</span><p>{t(language, "Elige hasta 10 números, reserva, confirma y repite el evento desde Control.", "Choose up to 10 numbers, reserve, confirm and replay the event from Control.")}</p><button type="button" onClick={() => { setMode("participante"); setRange(1); setTicketSearch("080"); }}>{t(language, "Buscar 080", "Find 080")}</button></div>
      <div className="demo-mode-switch" role="group" aria-label={t(language, "Vista de la demo", "Demo view")}><button className={mode === "participante" ? "active" : ""} type="button" onClick={() => setMode("participante")}>01 / {t(language, "Participante", "Participant")}</button><button className={mode === "admin" ? "active" : ""} type="button" onClick={() => setMode("admin")}>02 / {t(language, "Control", "Control")}</button><span>{t(language, "SIMULACIÓN / SIN PAGO REAL", "SIMULATION / NO REAL PAYMENT")}</span></div>
      {mode === "participante" && <div className="demo-package-strip" aria-label={t(language, "Paquetes de entradas", "Ticket packages")}><span>{t(language, "PAQUETES", "PACKAGES")}</span>{[1,3,5,10].map((quantity) => <button key={quantity} type="button" disabled={Boolean(reservation) || available < quantity} onClick={() => choosePackage(quantity)}><strong>{quantity} {t(language, quantity === 1 ? "entrada" : "entradas", quantity === 1 ? "ticket" : "tickets")}</strong><b>${bundlePrice(quantity)}</b></button>)}</div>}
      {mode === "participante" ? <div className="demo-dashboard demo-raffle-layout">
        <Panel kicker={t(language, "01 / PARTICIPACIONES", "01 / ENTRIES")} title={t(language, "Elige tus números", "Choose your numbers")} className="demo-ticket-panel">
          <div className="demo-ticket-controls"><div className="demo-ticket-ranges" role="group" aria-label={t(language, "Rangos de números", "Number ranges")}>{[0,1,2,3].map((item) => <button key={item} type="button" className={range === item && !ticketSearch ? "active" : ""} onClick={() => { setRange(item); setTicketSearch(""); }}>{formatTicket(item * 50 + 1)}–{formatTicket((item + 1) * 50)}</button>)}</div><label>{t(language, "Buscar número", "Find number")}<input type="search" inputMode="numeric" pattern="[0-9]*" placeholder="080" value={ticketSearch} onChange={(event) => setTicketSearch(event.target.value.replace(/\D/g, "").slice(0, 3))} /></label></div>
          <div className="demo-ticket-legend"><span><i className="free" /> {t(language, "Disponible", "Available")}</span><span><i className="selected" /> {t(language, "Seleccionada", "Selected")}</span><span><i className="reserved" /> {t(language, "Reservada", "Reserved")}</span><span><i className="sold" /> {t(language, "Asignada", "Assigned")}</span></div>
          <div className="demo-ticket-grid" aria-label={t(language, "Participaciones", "Entries")}>{visibleNumbers.map((number) => <button type="button" key={number} className={`${tickets[number]} ${selected.includes(number) ? "chosen" : ""}`} disabled={tickets[number] !== "libre" || Boolean(reservation)} aria-label={`${t(language, "Entrada", "Ticket")} ${formatTicket(number)}, ${selected.includes(number) ? t(language, "seleccionada", "selected") : t(language, tickets[number], tickets[number] === "libre" ? "available" : tickets[number] === "reservada" ? "reserved" : "assigned")}`} aria-pressed={selected.includes(number)} onClick={() => toggleTicket(number)}>{formatTicket(number)}</button>)}</div>
          <div className="demo-panel-bottom"><LockKeyhole size={14} /> {t(language, "Cada entrada solo puede pertenecer a una reserva", "Each ticket can belong to only one reservation")}</div>
        </Panel>
        <Panel kicker="02 / CHECKOUT" title={t(language, "Tu selección", "Your selection")} className="demo-checkout-panel"><div className="demo-checkout-icon"><Ticket size={34} strokeWidth={1.5} /></div>{reservation ? <><p className="demo-checkout-label">{t(language, "RESERVA ACTIVA", "ACTIVE RESERVATION")}</p><div className="demo-picked">{reservation.tickets.map((number) => <span key={number}>{formatTicket(number)}</span>)}</div><div className="demo-checkout-total"><span>{t(language, "Total simulado", "Simulated total")}</span><strong>${bundlePrice(reservation.tickets.length)}</strong></div><button className="demo-action" type="button" onClick={confirm}><Check size={16} /> {t(language, "Confirmar pago simulado", "Confirm simulated payment")}</button><button className="demo-text-button" type="button" onClick={cancel}>{t(language, "Liberar reserva", "Release reservation")}</button></> : <><p className="demo-checkout-label">{t(language, "HASTA 10 ENTRADAS", "UP TO 10 TICKETS")}</p><div className="demo-picked">{selected.length ? selected.map((number) => <span key={number}>{formatTicket(number)}</span>) : <em>{t(language, "Selecciona números disponibles", "Choose available numbers")}</em>}</div><div className="demo-checkout-total"><span>{t(language, "Total simulado", "Simulated total")}</span><strong>${bundlePrice(selected.length)}</strong></div><button className="demo-action" type="button" disabled={!selected.length} onClick={reserve}><LockKeyhole size={16} /> {t(language, "Reservar entradas", "Reserve tickets")}</button></>}<p className="demo-form-hint"><CircleAlert size={14} /> {t(language, "Esta pantalla no pide tarjeta, no cobra y no envía correos.", "No card details, charges or emails are involved.")}</p></Panel>
      </div> : <div className="demo-dashboard demo-raffle-admin"><Panel kicker="03 / CONTROL" title={t(language, "Estado de campaña", "Campaign status")}><div className="demo-admin-bars"><div><span>{t(language, "Asignadas", "Assigned")}</span><strong>{sold} / 200</strong><i><b style={{ width: `${sold / 2}%` }} /></i></div><div><span>{t(language, "Reservadas", "Reserved")}</span><strong>{reserved} / 200</strong><i><b style={{ width: `${Math.max(reserved / 2, reserved ? 2 : 0)}%` }} /></i></div><div><span>{t(language, "Disponibles", "Available")}</span><strong>{available} / 200</strong><i><b style={{ width: `${available / 2}%` }} /></i></div></div><div className="demo-admin-note"><Webhook size={19} /><p>{t(language, "Después de confirmar una compra simulada, reproduce el mismo evento. El contador debe mantenerse igual.", "After confirming a simulated purchase, replay the same event. The count should stay the same.")}</p></div><button className="demo-action secondary" disabled={!lastEvent} type="button" onClick={replay}><Webhook size={16} /> {t(language, "Repetir último evento", "Replay last event")}</button></Panel><Panel kicker="04 / EVENTS" title={t(language, "Registro de operaciones", "Event history")}><ol className="demo-raffle-events">{events.slice(0, 8).map((event) => <li key={event.id}><span>{t(language, event.type, event.type === "RESERVA" ? "RESERVATION" : event.type === "LIBERACIÓN" ? "RELEASE" : event.type === "IDEMPOTENCIA" ? "IDEMPOTENCY" : event.type)}</span><p>{language === "en" ? event.detailEn || event.detail : event.detail}</p></li>)}</ol></Panel></div>}
      {mode === "participante" && (selected.length > 0 || reservation) && <div className="demo-mobile-checkout"><div><span>{reservation ? t(language, "RESERVA ACTIVA", "ACTIVE RESERVATION") : `${selected.length} ${t(language, "SELECCIONADAS", "SELECTED")}`}</span><strong>{(reservation ? reservation.tickets : selected).map(formatTicket).join(" · ")} <b>${bundlePrice((reservation ? reservation.tickets : selected).length)}</b></strong></div><button type="button" onClick={reservation ? confirm : reserve}>{reservation ? t(language, "Confirmar", "Confirm") : t(language, "Reservar", "Reserve")}</button></div>}
      <div className="demo-bottom-grid"><div className="demo-insight"><span>{t(language, "DECISIÓN DE INGENIERÍA / 03", "ENGINEERING DECISION / 03")}</span><h2>{t(language, "Un número, un dueño.", "One number, one owner.")}</h2><p>{t(language, "Esta demo ilustra estados de reserva locales. En el producto real, el bloqueo concurrente ocurría en la base de datos; el webhook idempotente impedía asignaciones repetidas.", "This demo illustrates local reservation states. In the real product, concurrent locking happened in the database; an idempotent webhook prevented repeated assignments.")}</p><div className="demo-insight-line"><ArrowRight size={18} /> {t(language, "RESERVA Y REPITE EL EVENTO", "RESERVE AND REPLAY THE EVENT")}</div></div><div className="demo-process-card"><span>{t(language, "FLUJO DE UNA ENTRADA", "TICKET LIFECYCLE")}</span><div><b>01</b><p>{t(language, "Disponible", "Available")}</p></div><div><b>02</b><p>{t(language, "Reservada", "Reserved")}</p></div><div><b>03</b><p>{t(language, "Asignada", "Assigned")}</p></div><small>{t(language, "Cancelar devuelve la entrada al inventario.", "Cancelling returns the ticket to inventory.")}</small></div></div>
      {message && <div className="demo-toast" role="status">{message}</div>}
    </main><DemoFooter active="tattoo-raffle" language={language} />
  </div>;
}
