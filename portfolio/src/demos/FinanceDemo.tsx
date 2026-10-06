import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowDownRight, ArrowRight, Check, CircleAlert, DatabaseZap, Plus } from "lucide-react";
import { DemoFooter, DemoHeader, DemoIntro, Metric, Panel } from "./DemoApp";

type Transaction = { id: string; bank: string; code: string; sender: string; amount: number; status: "pendiente" | "asignada"; agent?: string };
type AuditEvent = { id: number; kind: string; detail: string; time: string };

const seedTransactions = (): Transaction[] => [
  { id: "TX-1042", bank: "North Bank", code: "NB-84219", sender: "Cliente A", amount: 480, status: "pendiente" },
  { id: "TX-1041", bank: "Harbor Bank", code: "HB-56308", sender: "Cliente B", amount: 275, status: "asignada", agent: "Agente Norte" },
  { id: "TX-1040", bank: "North Bank", code: "NB-84188", sender: "Cliente C", amount: 750, status: "pendiente" },
  { id: "TX-1039", bank: "Crest Bank", code: "CB-12904", sender: "Cliente D", amount: 190, status: "asignada", agent: "Agente Centro" },
  { id: "TX-1038", bank: "Harbor Bank", code: "HB-56277", sender: "Cliente E", amount: 620, status: "pendiente" },
];

const seedAudit = (): AuditEvent[] => [
  { id: 1, kind: "INGESTA", detail: "TX-1042 validada y añadida al registro", time: "09:42" },
  { id: 2, kind: "ASIGNACIÓN", detail: "TX-1041 asignada a Agente Norte", time: "09:37" },
  { id: 3, kind: "CONTROL", detail: "Código NB-84188 verificado como único", time: "09:31" },
];

const money = (value: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const now = () => new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date());

export function FinanceDemo() {
  const [transactions, setTransactions] = useState(seedTransactions);
  const [audit, setAudit] = useState(seedAudit);
  const [selected, setSelected] = useState("TX-1042");
  const [filter, setFilter] = useState<"todas" | "pendiente" | "asignada">("todas");
  const [bank, setBank] = useState("North Bank");
  const [code, setCode] = useState("");
  const [sender, setSender] = useState("");
  const [amount, setAmount] = useState("");
  const [agent, setAgent] = useState("Agente Norte");
  const [message, setMessage] = useState("");
  const chosen = transactions.find((tx) => tx.id === selected);
  const filtered = useMemo(() => transactions.filter((tx) => filter === "todas" || tx.status === filter), [transactions, filter]);
  const pending = transactions.filter((tx) => tx.status === "pendiente");
  const assigned = transactions.filter((tx) => tx.status === "asignada");
  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const debt = assigned.reduce((sum, tx) => sum + tx.amount, 0);

  function reset() {
    setTransactions(seedTransactions()); setAudit(seedAudit()); setSelected("TX-1042"); setFilter("todas");
    setBank("North Bank"); setCode(""); setSender(""); setAmount(""); setAgent("Agente Norte"); setMessage("Datos de demostración restaurados.");
  }

  function ingest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    const value = Number(amount);
    if (!normalized || !sender.trim() || !Number.isFinite(value) || value <= 0) {
      setMessage("Completa el remitente, un código de confirmación y un importe válido."); return;
    }
    if (transactions.some((tx) => tx.bank === bank && tx.code.toUpperCase() === normalized)) {
      setMessage(`Duplicado bloqueado: ${bank} / ${normalized} ya existe. No se creó ningún movimiento.`);
      setAudit((items) => [{ id: Date.now(), kind: "DUPLICADO", detail: `${bank} / ${normalized} rechazado`, time: now() }, ...items]);
      return;
    }
    const id = `TX-${1043 + transactions.length - 5}`;
    const record: Transaction = { id, bank, code: normalized, sender: sender.trim(), amount: value, status: "pendiente" };
    setTransactions((items) => [record, ...items]);
    setAudit((items) => [{ id: Date.now(), kind: "INGESTA", detail: `${id} validada por ${money(value)}`, time: now() }, ...items]);
    setSelected(id); setFilter("todas"); setCode(""); setSender(""); setAmount("");
    setMessage(`${id} creada. Ahora puedes asignarla a un agente.`);
  }

  function assign() {
    if (!chosen || chosen.status !== "pendiente") return;
    setTransactions((items) => items.map((tx) => tx.id === chosen.id ? { ...tx, status: "asignada", agent } : tx));
    setAudit((items) => [{ id: Date.now(), kind: "ASIGNACIÓN", detail: `${chosen.id} → ${agent}; deuda +${money(chosen.amount)}`, time: now() }, ...items]);
    setMessage(`${chosen.id} asignada. El saldo del agente se actualizó en el libro.`);
  }

  return <div className="demo-page demo-finance">
    <DemoHeader active="transactions" onReset={reset} />
    <main className="demo-main">
      <DemoIntro index="01" eyebrow="FINANCIAL OPERATIONS" title="Transactions" description="Una mesa de operaciones para seguir el dinero desde la ingesta hasta la asignación. Prueba un código duplicado y observa cómo el registro protege el saldo." accent="#b9fb60" />
      <div className="demo-flow"><span><DatabaseZap size={16} /> INGESTA</span><i /><span>VALIDACIÓN</span><i /><span>LIBRO AUDITABLE</span><i /><span>ASIGNACIÓN</span></div>
      <div className="demo-metrics demo-metrics-four">
        <Metric label="VOLUMEN REGISTRADO" value={money(total)} detail={`${transactions.length} movimientos ficticios`} />
        <Metric label="PENDIENTES" value={String(pending.length).padStart(2, "0")} detail="Por asignar" />
        <Metric label="DEUDA ASIGNADA" value={money(debt)} detail="Suma trazable por agente" />
        <Metric label="INTEGRIDAD" value="100%" detail="Banco + código único" className="demo-metric-emphasis" />
      </div>
      <div className="demo-dashboard demo-finance-layout">
        <Panel kicker="01 / REGISTRO" title="Movimientos" className="demo-transactions-panel">
          <div className="demo-filter-row" aria-label="Filtrar movimientos">
            {(["todas", "pendiente", "asignada"] as const).map((item) => <button type="button" key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "todas" ? "Todas" : item === "pendiente" ? "Pendientes" : "Asignadas"}<span>{item === "todas" ? transactions.length : item === "pendiente" ? pending.length : assigned.length}</span></button>)}
          </div>
          <div className="demo-table-wrap"><table className="demo-table"><thead><tr><th>REFERENCIA</th><th>REMITENTE / BANCO</th><th>IMPORTE</th><th>ESTADO</th></tr></thead><tbody>
            {filtered.map((tx) => <tr key={tx.id} className={selected === tx.id ? "selected" : ""} onClick={() => setSelected(tx.id)}><td><button type="button" className="demo-row-button" onClick={() => setSelected(tx.id)}>{tx.id}</button><small>{tx.code}</small></td><td>{tx.sender}<small>{tx.bank}</small></td><td className="demo-number">{money(tx.amount)}</td><td><span className={`demo-status ${tx.status}`}>{tx.status}</span></td></tr>)}
          </tbody></table></div>
          <div className="demo-panel-bottom">Selecciona una fila para ver su trazabilidad <ArrowRight size={15} /></div>
        </Panel>
        <div className="demo-side-stack">
          <Panel kicker="02 / ENTRADA" title="Simular ingesta">
            <form className="demo-form" onSubmit={ingest}>
              <div className="demo-field-row"><label>Banco<select value={bank} onChange={(event) => setBank(event.target.value)}><option>North Bank</option><option>Harbor Bank</option><option>Crest Bank</option></select></label><label>Importe USD<input type="number" min="1" step="0.01" placeholder="480" value={amount} onChange={(event) => setAmount(event.target.value)} /></label></div>
              <label>Remitente ficticio<input placeholder="Cliente F" value={sender} onChange={(event) => setSender(event.target.value)} maxLength={40} /></label>
              <label>Código de confirmación<input placeholder="NB-84219" value={code} onChange={(event) => setCode(event.target.value)} maxLength={24} /></label>
              <button className="demo-action" type="submit"><Plus size={16} /> Ingresar transacción</button>
              <p className="demo-form-hint"><CircleAlert size={14} /> Prueba <b>NB-84219</b> con North Bank para ver el bloqueo idempotente.</p>
            </form>
          </Panel>
          <Panel kicker="03 / DETALLE" title={chosen ? chosen.id : "Selecciona un movimiento"}>
            {chosen && <div className="demo-detail"><div><span>ORIGEN</span><strong>{chosen.bank} / {chosen.code}</strong></div><div><span>IMPORTE</span><strong>{money(chosen.amount)}</strong></div><div><span>ESTADO</span><strong>{chosen.status === "asignada" ? `Asignada a ${chosen.agent}` : "Pendiente de asignación"}</strong></div>
              {chosen.status === "pendiente" && <div className="demo-assign"><label>Asignar a<select value={agent} onChange={(event) => setAgent(event.target.value)}><option>Agente Norte</option><option>Agente Centro</option><option>Agente Sur</option></select></label><button type="button" className="demo-action secondary" onClick={assign}><Check size={16} /> Confirmar asignación</button></div>}
            </div>}
          </Panel>
        </div>
      </div>
      <div className="demo-bottom-grid">
        <Panel kicker="04 / EVENTOS" title="Pista de auditoría"><ol className="demo-event-list">{audit.slice(0, 5).map((event) => <li key={event.id}><time>{event.time}</time><div><span>{event.kind}</span><p>{event.detail}</p></div></li>)}</ol></Panel>
        <div className="demo-insight"><span>DECISIÓN DE INGENIERÍA / 01</span><h2>Una operación, una sola vez.</h2><p>La combinación de banco y confirmación identifica cada entrada. Asignar un movimiento cambia el saldo y deja un evento legible; repetir una entrada no lo duplica.</p><div className="demo-insight-line"><ArrowDownRight size={18} /> PRUEBA EL CASO DUPLICADO</div></div>
      </div>
      {message && <div className="demo-toast" role="status">{message}</div>}
    </main>
    <DemoFooter active="transactions" />
  </div>;
}
