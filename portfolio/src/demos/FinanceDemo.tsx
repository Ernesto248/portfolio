import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowDownRight, ArrowRight, Check, CircleAlert, DatabaseZap, Plus } from "lucide-react";
import { DemoFooter, DemoHeader, Metric, Panel, SandboxHeading } from "./DemoApp";
import { t } from "./demo-i18n";
import type { Language } from "./demo-i18n";
import { DemoStory } from "./DemoStory";
import { useDemoSession } from "./demo-session";

type Transaction = { id: string; bank: string; code: string; sender: string; amount: number; status: "pendiente" | "asignada"; agent?: string };
type AuditEvent = { id: number; kind: string; detail: string; detailEn?: string; time: string };

const seedTransactions = (): Transaction[] => [
  { id: "TX-1042", bank: "North Bank", code: "NB-84219", sender: "Cliente A", amount: 480, status: "pendiente" },
  { id: "TX-1041", bank: "Harbor Bank", code: "HB-56308", sender: "Cliente B", amount: 275, status: "asignada", agent: "Agente Norte" },
  { id: "TX-1040", bank: "North Bank", code: "NB-84188", sender: "Cliente C", amount: 750, status: "pendiente" },
  { id: "TX-1039", bank: "Crest Bank", code: "CB-12904", sender: "Cliente D", amount: 190, status: "asignada", agent: "Agente Centro" },
  { id: "TX-1038", bank: "Harbor Bank", code: "HB-56277", sender: "Cliente E", amount: 620, status: "pendiente" },
];

const seedAudit = (): AuditEvent[] => [
  { id: 1, kind: "INGESTA", detail: "TX-1042 validada y añadida al registro", detailEn: "TX-1042 validated and added to the ledger", time: "09:42" },
  { id: 2, kind: "ASIGNACIÓN", detail: "TX-1041 asignada a Agente Norte", detailEn: "TX-1041 assigned to Agente Norte", time: "09:37" },
  { id: 3, kind: "CONTROL", detail: "Código NB-84188 verificado como único", detailEn: "Code NB-84188 verified as unique", time: "09:31" },
];

const now = () => new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date());

export function FinanceDemo({ language, onLanguageChange, preview = false }: { language: Language; onLanguageChange: (language: Language) => void; preview?: boolean }) {
  const money = (value: number) => new Intl.NumberFormat(language === "es" ? "es-ES" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  const [transactions, setTransactions] = useDemoSession("finance-transactions", seedTransactions);
  const [audit, setAudit] = useDemoSession("finance-audit", seedAudit);
  const [selected, setSelected] = useDemoSession("finance-selected", () => "TX-1042");
  const [snapshot, setSnapshot] = useDemoSession<{ before: number; after: number; label: string } | null>("finance-snapshot", () => null);
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

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 5000);
    return () => window.clearTimeout(timer);
  }, [message]);

  function reset() {
    setTransactions(seedTransactions()); setAudit(seedAudit()); setSelected("TX-1042"); setFilter("todas");
    setBank("North Bank"); setCode(""); setSender(""); setAmount(""); setAgent("Agente Norte"); setSnapshot(null); setMessage(t(language, "Datos de demostración restaurados.", "Demo data restored."));
  }

  function ingest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    const value = Number(amount);
    if (!normalized || !sender.trim() || !Number.isFinite(value) || value <= 0) {
      setMessage(t(language, "Completa el remitente, un código de confirmación y un importe válido.", "Enter a sender, confirmation code and valid amount.")); return;
    }
    if (transactions.some((tx) => tx.bank === bank && tx.code.toUpperCase() === normalized)) {
      setSnapshot({ before: transactions.length, after: transactions.length, label: "DUPLICATE" });
      setMessage(t(language, `Duplicado bloqueado: ${bank} / ${normalized} ya existe. No se creó ningún movimiento.`, `Duplicate blocked: ${bank} / ${normalized} already exists. No transaction was created.`));
      setAudit((items) => [{ id: Date.now(), kind: "DUPLICADO", detail: `${bank} / ${normalized} rechazado`, detailEn: `${bank} / ${normalized} rejected`, time: now() }, ...items]);
      return;
    }
    const id = `TX-${1043 + transactions.length - 5}`;
    const record: Transaction = { id, bank, code: normalized, sender: sender.trim(), amount: value, status: "pendiente" };
    setTransactions((items) => [record, ...items]);
    setAudit((items) => [{ id: Date.now(), kind: "INGESTA", detail: `${id} validada por ${money(value)}`, detailEn: `${id} validated for ${money(value)}`, time: now() }, ...items]);
    setSelected(id); setFilter("todas"); setCode(""); setSender(""); setAmount("");
    setSnapshot({ before: transactions.length, after: transactions.length + 1, label: "INGEST" });
    setMessage(t(language, `${id} creada. Ahora puedes asignarla a un agente.`, `${id} created. Now assign it to an agent.`));
  }

  function assign() {
    if (!chosen || chosen.status !== "pendiente") return;
    setTransactions((items) => items.map((tx) => tx.id === chosen.id ? { ...tx, status: "asignada", agent } : tx));
    setAudit((items) => [{ id: Date.now(), kind: "ASIGNACIÓN", detail: `${chosen.id} → ${agent}; deuda +${money(chosen.amount)}`, detailEn: `${chosen.id} → ${agent}; balance +${money(chosen.amount)}`, time: now() }, ...items]);
    setSnapshot({ before: debt, after: debt + chosen.amount, label: "ASSIGN" });
    setMessage(t(language, `${chosen.id} asignada. El saldo del agente se actualizó en el libro.`, `${chosen.id} assigned. The agent's balance was updated in the ledger.`));
  }

  return <div className="demo-page demo-finance">
    <DemoHeader active="transactions" onReset={reset} language={language} onLanguageChange={onLanguageChange} preview={preview} />
    <main className="demo-main">
      {!preview && <DemoStory slug="transactions" language={language} />}
      <SandboxHeading language={language} title={t(language, "Del aviso al libro.", "From alert to ledger.")} description={t(language, "Registra una entrada, repite su código y asígnala. Compara el estado antes y después de cada acción.", "Create an entry, repeat its code and assign it. Compare state before and after each action.")} />
      <div className="demo-flow"><span><DatabaseZap size={16} /> {t(language, "INGESTA", "INGEST")}</span><i /><span>{t(language, "VALIDACIÓN", "VALIDATION")}</span><i /><span>{t(language, "LIBRO AUDITABLE", "AUDITABLE LEDGER")}</span><i /><span>{t(language, "ASIGNACIÓN", "ASSIGNMENT")}</span></div>
      <div className="demo-finance-stream"><span>{t(language, "AVISOS DISPERSOS", "SCATTERED ALERTS")}</span><div><i>North Bank / NB-84219 / $480</i><i>Harbor Bank / HB-56308 / $275</i><i>North Bank / NB-84219 / <b>{t(language, "REPETIDO", "REPEAT")}</b></i></div><strong>↘</strong><p>{t(language, "Un registro validado con clave banco + código", "One validated record keyed by bank + code")}</p></div>
      <div className="demo-scenario-bar"><span>{t(language, "TRES CASOS", "THREE CASES")}</span><p>{t(language, "Carga una entrada nueva, intenta duplicar NB-84219 y asigna TX-1042.", "Create a new entry, try duplicating NB-84219 and assign TX-1042.")}</p><button type="button" onClick={() => { setBank("North Bank"); setCode("NB-84219"); setSender("Cliente demo"); setAmount("480"); }}>{t(language, "Preparar duplicado", "Prepare duplicate")}</button><button type="button" onClick={() => { setBank("Crest Bank"); setCode("CB-13001"); setSender("Cliente F"); setAmount("320"); }}>{t(language, "Preparar nueva", "Prepare new entry")}</button></div>
      <div className="demo-metrics demo-metrics-four">
        <Metric label={t(language, "VOLUMEN REGISTRADO", "RECORDED VOLUME")} value={money(total)} detail={`${transactions.length} ${t(language, "movimientos ficticios", "fictional entries")}`} />
        <Metric label={t(language, "PENDIENTES", "PENDING")} value={String(pending.length).padStart(2, "0")} />
        <Metric label={t(language, "DEUDA ASIGNADA", "ASSIGNED BALANCE")} value={money(debt)} />
        <Metric label={t(language, "CLAVE ÚNICA", "UNIQUE KEY")} value="BANK+CODE" className="demo-metric-emphasis" />
      </div>
      <div className="demo-dashboard demo-finance-layout">
        <Panel kicker={t(language, "01 / REGISTRO", "01 / LEDGER")} title={t(language, "Movimientos", "Transactions")} className="demo-transactions-panel">
          <div className="demo-filter-row" aria-label="Filtrar movimientos">
            {(["todas", "pendiente", "asignada"] as const).map((item) => <button type="button" key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "todas" ? t(language, "Todas", "All") : item === "pendiente" ? t(language, "Pendientes", "Pending") : t(language, "Asignadas", "Assigned")}<span>{item === "todas" ? transactions.length : item === "pendiente" ? pending.length : assigned.length}</span></button>)}
          </div>
          <div className="demo-table-wrap"><table className="demo-table"><thead><tr><th>{t(language, "REFERENCIA", "REFERENCE")}</th><th>{t(language, "REMITENTE / BANCO", "SENDER / BANK")}</th><th>{t(language, "IMPORTE", "AMOUNT")}</th><th>{t(language, "ESTADO", "STATUS")}</th></tr></thead><tbody>
            {filtered.map((tx) => <tr key={tx.id} className={selected === tx.id ? "selected" : ""}><td><button type="button" className="demo-row-button" onClick={() => setSelected(tx.id)}>{tx.id}</button><small>{tx.code}</small></td><td>{tx.sender}<small>{tx.bank}</small></td><td className="demo-number">{money(tx.amount)}</td><td><span className={`demo-status ${tx.status}`}>{t(language, tx.status, tx.status === "pendiente" ? "pending" : "assigned")}</span></td></tr>)}
          </tbody></table></div>
          <div className="demo-panel-bottom">{t(language, "Selecciona una referencia para ver su trazabilidad", "Select a reference to inspect its trace")} <ArrowRight size={15} /></div>
        </Panel>
        <div className="demo-side-stack">
          <Panel kicker={t(language, "02 / ENTRADA", "02 / INPUT")} title={t(language, "Simular ingesta", "Simulate ingestion")}>
            <form className="demo-form" onSubmit={ingest}>
              <div className="demo-field-row"><label>{t(language, "Banco", "Bank")}<select value={bank} onChange={(event) => setBank(event.target.value)}><option>North Bank</option><option>Harbor Bank</option><option>Crest Bank</option></select></label><label>{t(language, "Importe USD", "Amount USD")}<input type="number" min="1" step="0.01" placeholder="480" value={amount} onChange={(event) => setAmount(event.target.value)} /></label></div>
              <label>{t(language, "Remitente ficticio", "Fictional sender")}<input placeholder="Cliente F" value={sender} onChange={(event) => setSender(event.target.value)} maxLength={40} /></label>
              <label>{t(language, "Código de confirmación", "Confirmation code")}<input placeholder="NB-84219" value={code} onChange={(event) => setCode(event.target.value)} maxLength={24} /></label>
              <button className="demo-action" type="submit"><Plus size={16} /> {t(language, "Ingresar transacción", "Create transaction")}</button>
              <p className="demo-form-hint"><CircleAlert size={14} /> {t(language, "Prueba NB-84219 con North Bank para ver el bloqueo.", "Try NB-84219 with North Bank to see the duplicate block.")}</p>
            </form>
          </Panel>
          <Panel kicker={t(language, "03 / DETALLE", "03 / DETAIL")} title={chosen ? chosen.id : t(language, "Selecciona un movimiento", "Select a transaction")}>
            {chosen && <div className="demo-detail"><div><span>{t(language, "ORIGEN", "SOURCE")}</span><strong>{chosen.bank} / {chosen.code}</strong></div><div><span>{t(language, "IMPORTE", "AMOUNT")}</span><strong>{money(chosen.amount)}</strong></div><div><span>{t(language, "ESTADO", "STATUS")}</span><strong>{chosen.status === "asignada" ? t(language, `Asignada a ${chosen.agent}`, `Assigned to ${chosen.agent}`) : t(language, "Pendiente de asignación", "Waiting for assignment")}</strong></div>
              {chosen.status === "pendiente" && <div className="demo-assign"><label>{t(language, "Asignar a", "Assign to")}<select value={agent} onChange={(event) => setAgent(event.target.value)}><option>Agente Norte</option><option>Agente Centro</option><option>Agente Sur</option></select></label><button type="button" className="demo-action secondary" onClick={assign}><Check size={16} /> {t(language, "Confirmar asignación", "Confirm assignment")}</button></div>}
            </div>}
          </Panel>
        </div>
      </div>
      <div className="demo-ledger-compare" aria-live="polite"><div><span>{t(language, "ANTES", "BEFORE")}</span><strong>{snapshot ? snapshot.label === "ASSIGN" ? money(snapshot.before) : `${snapshot.before} ${t(language, "entradas", "entries")}` : `${seedTransactions().length} ${t(language, "entradas", "entries")}`}</strong></div><div className="demo-compare-arrow">→</div><div><span>{t(language, "DESPUÉS", "AFTER")}</span><strong>{snapshot ? snapshot.label === "ASSIGN" ? money(snapshot.after) : `${snapshot.after} ${t(language, "entradas", "entries")}` : `${transactions.length} ${t(language, "entradas", "entries")}`}</strong></div><p>{snapshot ? snapshot.label === "DUPLICATE" ? t(language, "Duplicado rechazado: el registro no cambió.", "Duplicate rejected: the ledger did not change.") : snapshot.label === "ASSIGN" ? t(language, "La deuda asignada aumenta exactamente por el importe del movimiento.", "Assigned balance increases by exactly the transaction amount.") : t(language, "La nueva entrada se añadió una sola vez.", "The new entry was added once.") : t(language, "Ejecuta uno de los casos para comparar el estado.", "Run a case to compare state.")}</p></div>
      <div className="demo-bottom-grid">
        <Panel kicker={t(language, "04 / EVENTOS", "04 / EVENTS")} title={t(language, "Pista de auditoría", "Audit trail")}><ol className="demo-event-list">{audit.slice(0, 5).map((event) => <li key={event.id}><time>{event.time}</time><div><span>{t(language, event.kind, event.kind === "INGESTA" ? "INGEST" : event.kind === "ASIGNACIÓN" ? "ASSIGNMENT" : event.kind === "DUPLICADO" ? "DUPLICATE" : "CHECK")}</span><p>{language === "en" ? event.detailEn || event.detail : event.detail}</p></div></li>)}</ol></Panel>
        <div className="demo-insight"><span>{t(language, "DECISIÓN DE INGENIERÍA / 01", "ENGINEERING DECISION / 01")}</span><h2>{t(language, "Una operación, una sola vez.", "One operation, one record.")}</h2><p>{t(language, "Banco y confirmación identifican cada entrada. Asignar cambia el saldo y deja un evento; repetir la entrada no la duplica.", "Bank and confirmation identify every entry. Assignment changes the balance and leaves an event; repeating the entry does not duplicate it.")}</p><div className="demo-insight-line"><ArrowDownRight size={18} /> {t(language, "PRUEBA EL CASO DUPLICADO", "TRY THE DUPLICATE CASE")}</div></div>
      </div>
      {message && <div className="demo-toast" role="status">{message}</div>}
    </main>
    <DemoFooter active="transactions" language={language} />
  </div>;
}
