import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Boxes, Check, PackageCheck, ShoppingBag } from "lucide-react";
import { DemoFooter, DemoHeader, Metric, Panel, SandboxHeading } from "./DemoApp";
import { t } from "./demo-i18n";
import type { Language } from "./demo-i18n";
import { DemoCaseStudy } from "./DemoCaseStudy";
import { useDemoSession } from "./demo-session";

type Product = { id: string; name: string; nameEn: string; sku: string; price: number };
type Transfer = { id: string; product: string; from: string; to: string; quantity: number; status: "en tránsito" | "recibida" };
type Sale = { id: string; branch: string; product: string; quantity: number; total: number };
type Stock = Record<string, Record<string, number>>;

const branches = ["Centro", "Norte", "Sur", "Este", "Oeste", "Terminal"];
const products: Product[] = [
  { id: "P-01", name: "Kit de cuidado", nameEn: "Care kit", sku: "CAR-001", price: 24 },
  { id: "P-02", name: "Crema reparadora", nameEn: "Repair cream", sku: "CRE-002", price: 18 },
  { id: "P-03", name: "Aceite esencial", nameEn: "Essential oil", sku: "ACE-003", price: 32 },
  { id: "P-04", name: "Set profesional", nameEn: "Professional set", sku: "SET-004", price: 58 },
];
const initialStock = (): Stock => ({
  Centro: { "P-01": 18, "P-02": 12, "P-03": 9, "P-04": 5 },
  Norte: { "P-01": 11, "P-02": 8, "P-03": 7, "P-04": 3 },
  Sur: { "P-01": 6, "P-02": 4, "P-03": 12, "P-04": 2 },
  Este: { "P-01": 14, "P-02": 10, "P-03": 3, "P-04": 4 },
  Oeste: { "P-01": 9, "P-02": 6, "P-03": 5, "P-04": 2 },
  Terminal: { "P-01": 8, "P-02": 7, "P-03": 4, "P-04": 1 },
});

export function SgiaDemo({ language, onLanguageChange, preview = false }: { language: Language; onLanguageChange: (language: Language) => void; preview?: boolean }) {
  const currency = (value: number) => new Intl.NumberFormat(language === "es" ? "es-ES" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  const [stock, setStock] = useDemoSession("sgia-stock", initialStock);
  const [branch, setBranch] = useDemoSession("sgia-branch", () => "Centro");
  const [transfers, setTransfers] = useDemoSession<Transfer[]>("sgia-transfers", () => []);
  const [sales, setSales] = useDemoSession<Sale[]>("sgia-sales", () => []);
  const [transferProduct, setTransferProduct] = useState("P-01");
  const [target, setTarget] = useState("Norte");
  const [transferQuantity, setTransferQuantity] = useState("2");
  const [saleProduct, setSaleProduct] = useState("P-02");
  const [saleQuantity, setSaleQuantity] = useState("1");
  const [transferView, setTransferView] = useState<"todas" | "recibidas" | "enviadas">("todas");
  const [message, setMessage] = useState("");
  const localStock = stock[branch];
  const totalUnits = Object.values(stock).reduce((sum, location) => sum + Object.values(location).reduce((count, quantity) => count + quantity, 0), 0);
  const transitUnits = transfers.filter((transfer) => transfer.status === "en tránsito").reduce((sum, transfer) => sum + transfer.quantity, 0);
  const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const initialUnits = Object.values(initialStock()).reduce((sum, location) => sum + Object.values(location).reduce((count, quantity) => count + quantity, 0), 0);
  const soldUnits = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const visibleTransfers = transfers.filter((item) => transferView === "todas" || (transferView === "recibidas" ? item.to === branch : item.from === branch));

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 5000);
    return () => window.clearTimeout(timer);
  }, [message]);

  function reset() {
    setStock(initialStock()); setBranch("Centro"); setTransfers([]); setSales([]); setTransferProduct("P-01"); setTarget("Norte"); setTransferQuantity("2"); setSaleProduct("P-02"); setSaleQuantity("1"); setTransferView("todas"); setMessage(t(language, "Datos de demostración restaurados.", "Demo data restored."));
  }

  function transfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(transferQuantity);
    if (!Number.isInteger(quantity) || quantity < 1 || target === branch || quantity > localStock[transferProduct]) {
      setMessage(t(language, "La transferencia necesita una sucursal distinta y stock disponible suficiente.", "The transfer needs a different branch and enough available stock.")); return;
    }
    const id = `TR-${String(transfers.length + 1).padStart(3, "0")}`;
    setStock((current) => ({ ...current, [branch]: { ...current[branch], [transferProduct]: current[branch][transferProduct] - quantity } }));
    setTransfers((current) => [{ id, product: transferProduct, from: branch, to: target, quantity, status: "en tránsito" }, ...current]);
    setMessage(t(language, `${id} enviada: ${quantity} unidades salen de ${branch}. El destino debe confirmar la recepción.`, `${id} dispatched: ${quantity} units leave ${branch}. The recipient must confirm delivery.`));
  }

  function receive(id: string) {
    const item = transfers.find((entry) => entry.id === id);
    if (!item || item.status === "recibida" || item.to !== branch) return;
    setStock((current) => ({ ...current, [item.to]: { ...current[item.to], [item.product]: current[item.to][item.product] + item.quantity } }));
    setTransfers((current) => current.map((entry) => entry.id === id ? { ...entry, status: "recibida" } : entry));
    setMessage(t(language, `${id} recibida en ${item.to}. El inventario del destino se actualizó una sola vez.`, `${id} received at ${item.to}. Destination inventory was updated once.`));
  }

  function sell(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(saleQuantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > localStock[saleProduct]) {
      setMessage(t(language, "La venta requiere una cantidad entera disponible en esta sucursal.", "A sale requires a whole number of units available at this branch.")); return;
    }
    const product = products.find((item) => item.id === saleProduct)!;
    const id = `V-${String(sales.length + 1).padStart(3, "0")}`;
    setStock((current) => ({ ...current, [branch]: { ...current[branch], [saleProduct]: current[branch][saleProduct] - quantity } }));
    setSales((current) => [{ id, branch, product: saleProduct, quantity, total: quantity * product.price }, ...current]);
    setMessage(t(language, `${id} registrada en ${branch}: ${quantity} × ${product.name}. Stock y caja actualizados.`, `${id} recorded at ${branch}: ${quantity} × ${product.nameEn}. Stock and sales updated.`));
  }

  return <div className="demo-page demo-sgia">
    <DemoHeader active="sgia" onReset={reset} language={language} onLanguageChange={onLanguageChange} preview={preview} />
    <main className="demo-main">
      <div className="sgia-product-shell">
      <aside className="sgia-product-sidebar"><div className="sgia-product-logo"><span>S</span><strong>S.G.I.A.<small>{t(language, "Gestión integral", "Integrated management")}</small></strong></div><div className="sgia-sidebar-group">{t(language, "OPERACIONES", "OPERATIONS")}</div><nav aria-label={t(language, "Navegación de producto", "Product navigation")}><a href="#sandbox"><Boxes size={17} />{t(language, "Resumen", "Overview")}</a><a href="#sgia-inventory"><PackageCheck size={17} />{t(language, "Inventario", "Inventory")}</a><a href="#sgia-transfers"><ArrowRight size={17} />{t(language, "Transferencias", "Transfers")}</a><a href="#sgia-sales"><ShoppingBag size={17} />{t(language, "Punto de venta", "Point of sale")}</a></nav><div className="sgia-sidebar-foot">{t(language, "Sesión de sucursal", "Branch session")}<strong>{branch}</strong><small>{t(language, "Datos de prueba", "Demo data")}</small></div></aside>
      <div className="sgia-product-workspace"><div className="sgia-product-topbar"><span>{t(language, "Operaciones", "Operations")} / <strong>{branch}</strong></span><label>{t(language, "Sucursal activa", "Active branch")}<select value={branch} onChange={(event) => { const next = event.target.value; setBranch(next); if (target === next) setTarget(branch); }}>{branches.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div>
      <SandboxHeading language={language} title={t(language, "Resumen de sucursal", "Branch overview")} description={t(language, "Envía desde Centro, cambia a Norte, recibe y registra una venta. El balance permanece visible.", "Dispatch from Centro, switch to Norte, receive and record a sale. The balance stays visible.")} />
      <div className="demo-scenario-bar"><span>{t(language, "PRUEBA EL RECORRIDO", "TRY THE FLOW")}</span><p>{t(language, "Envía 2 kits de Centro a Norte, abre Norte, confirma y vende 1 unidad.", "Send 2 kits from Centro to Norte, open Norte, confirm receipt and sell 1 unit.")}</p><button type="button" onClick={() => { setBranch("Centro"); setTarget("Norte"); setTransferProduct("P-01"); setTransferQuantity("2"); setSaleProduct("P-01"); setSaleQuantity("1"); }}>{t(language, "Preparar escenario", "Prepare scenario")}</button></div>
      <div className="sgia-reconciliation"><span>{t(language, "BALANCE DE INVENTARIO", "INVENTORY BALANCE")}</span><strong>{totalUnits} + {transitUnits} + {soldUnits} = {initialUnits}</strong><b>{initialUnits === totalUnits + transitUnits + soldUnits ? t(language, "Cuadrado", "Balanced") : t(language, "Revisar", "Check")}</b></div>
      <div className="demo-metrics demo-metrics-four">
        <Metric label={t(language, "SUCURSALES", "BRANCHES")} value="06" />
        <Metric label={t(language, "UNIDADES DISPONIBLES", "AVAILABLE UNITS")} value={String(totalUnits)} />
        <Metric label={t(language, "EN TRÁNSITO", "IN TRANSIT")} value={String(transitUnits).padStart(2, "0")} />
        <Metric label={t(language, "VENTAS SIMULADAS", "SIMULATED SALES")} value={currency(revenue)} detail={`${sales.length} ${t(language, "operaciones", "sales")}`} className="demo-metric-emphasis" />
      </div>
      <div className="demo-branch-strip"><div><span>{t(language, "UBICACIÓN ACTIVA", "ACTIVE LOCATION")}</span><strong>{branch}</strong></div><div className="demo-branch-buttons">{branches.map((item, index) => <button type="button" className={branch === item ? "active" : ""} key={item} onClick={() => { setBranch(item); if (target === item) setTarget(branch); }}><small>0{index + 1}</small>{item}</button>)}</div></div>
      <div id="sgia-inventory" className="demo-dashboard demo-sgia-layout">
        <Panel kicker={t(language, "01 / INVENTARIO", "01 / INVENTORY")} title={`Stock · ${branch}`} className="demo-inventory-panel">
          <div className="demo-table-wrap"><table className="demo-table"><thead><tr><th>{t(language, "PRODUCTO", "PRODUCT")}</th><th>SKU</th><th>{t(language, "PRECIO", "PRICE")}</th><th>{t(language, "DISPONIBLE", "AVAILABLE")}</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><span className="demo-product-dot" />{t(language, product.name, product.nameEn)}</td><td className="demo-muted">{product.sku}</td><td>{currency(product.price)}</td><td><span className={`demo-stock ${localStock[product.id] <= 3 ? "low" : ""}`}>{String(localStock[product.id]).padStart(2, "0")} {t(language, "uds", "units")}</span></td></tr>)}</tbody></table></div>
          <div className="demo-panel-bottom"><PackageCheck size={15} /> {t(language, "Stock actualizado al vender, enviar y recibir", "Stock updates on sale, dispatch and receipt")}</div>
        </Panel>
        <div className="demo-side-stack">
          <Panel kicker={t(language, "02 / LOGÍSTICA", "02 / LOGISTICS")} title={t(language, "Enviar mercancía", "Dispatch goods")}>
            <form className="demo-form" onSubmit={transfer}><label>{t(language, "Producto", "Product")}<select value={transferProduct} onChange={(event) => setTransferProduct(event.target.value)}>{products.map((item) => <option key={item.id} value={item.id}>{t(language, item.name, item.nameEn)}</option>)}</select></label><div className="demo-field-row"><label>{t(language, "Destino", "Destination")}<select value={target} onChange={(event) => setTarget(event.target.value)}>{branches.filter((item) => item !== branch).map((item) => <option key={item}>{item}</option>)}</select></label><label>{t(language, "Unidades", "Units")}<input type="number" min="1" step="1" value={transferQuantity} onChange={(event) => setTransferQuantity(event.target.value)} /></label></div><button className="demo-action" type="submit"><ArrowRight size={16} /> {t(language, "Crear transferencia", "Create transfer")}</button></form>
          </Panel>
          <div id="sgia-sales"><Panel kicker={t(language, "03 / CAJA", "03 / SALES")} title={t(language, "Registrar venta", "Record sale")}>
            <form className="demo-form" onSubmit={sell}><div className="demo-field-row"><label>{t(language, "Producto", "Product")}<select value={saleProduct} onChange={(event) => setSaleProduct(event.target.value)}>{products.map((item) => <option key={item.id} value={item.id}>{t(language, item.name, item.nameEn)}</option>)}</select></label><label>{t(language, "Unidades", "Units")}<input type="number" min="1" step="1" value={saleQuantity} onChange={(event) => setSaleQuantity(event.target.value)} /></label></div><button className="demo-action secondary" type="submit"><ShoppingBag size={16} /> {t(language, "Registrar venta", "Record sale")}</button></form>
          </Panel></div>
        </div>
      </div>
      <div id="sgia-transfers" className="demo-bottom-grid">
        <Panel kicker={t(language, "04 / TRAZABILIDAD", "04 / TRACEABILITY")} title={t(language, "Transferencias", "Transfers")}><div className="sgia-transfer-tabs" role="group" aria-label={t(language, "Filtrar transferencias", "Filter transfers")}>{(["todas", "recibidas", "enviadas"] as const).map((view) => <button type="button" key={view} className={transferView === view ? "active" : ""} onClick={() => setTransferView(view)}>{view === "todas" ? t(language, "Todas", "All") : view === "recibidas" ? t(language, "Recibidas", "Received") : t(language, "Enviadas", "Sent")}</button>)}</div><div className="demo-transfer-list">{visibleTransfers.length === 0 && <p className="demo-empty">{t(language, "Crea una transferencia para ver el ciclo envío → recepción.", "Create a transfer to see dispatch → receipt.")}</p>}{visibleTransfers.map((item) => <div className="demo-transfer" key={item.id}><div><strong>{item.id}</strong><span>{t(language, products.find((product) => product.id === item.product)?.name || "", products.find((product) => product.id === item.product)?.nameEn || "")} · {item.quantity} {t(language, "uds", "units")}</span><small>{item.from} <ArrowRight size={12} /> {item.to}</small></div><div><span className={`demo-status ${item.status === "recibida" ? "asignada" : "pendiente"}`}>{t(language, item.status, item.status === "recibida" ? "received" : "in transit")}</span>{item.status === "en tránsito" && (branch === item.to ? <button type="button" onClick={() => receive(item.id)}><Check size={14} /> {t(language, "Confirmar recepción", "Confirm receipt")}</button> : <button type="button" onClick={() => setBranch(item.to)}>{t(language, `Ir a ${item.to}`, `Open ${item.to}`)}</button>)}</div></div>)}{transferView === "todas" && sales.map((sale) => <div className="demo-transfer" key={sale.id}><div><strong>{sale.id}</strong><span>{t(language, products.find((product) => product.id === sale.product)?.name || "", products.find((product) => product.id === sale.product)?.nameEn || "")} · {sale.quantity} {t(language, "uds", "units")}</span><small>{sale.branch} · {currency(sale.total)}</small></div><span className="demo-status asignada">{t(language, "venta", "sale")}</span></div>)}</div></Panel>
        <div className="demo-insight"><span>{t(language, "DECISIÓN DE INGENIERÍA / 02", "ENGINEERING DECISION / 02")}</span><h2>{t(language, "El stock tiene ubicación y estado.", "Stock has location and state.")}</h2><p>{t(language, "Enviar descuenta el origen y deja las unidades en tránsito. Solo al confirmar la recepción aparecen en destino.", "Dispatch deducts stock at the origin and puts units in transit. They appear at the destination only after receipt is confirmed.")}</p><div className="demo-insight-line"><ArrowRight size={18} /> {t(language, "ENVÍA Y RECIBE MERCANCÍA", "DISPATCH AND RECEIVE GOODS")}</div></div>
      </div>
      </div></div>
      {!preview && <DemoCaseStudy slug="sgia" language={language} />}
      {message && <div className="demo-toast" role="status">{message}</div>}
    </main>
    <DemoFooter active="sgia" language={language} />
  </div>;
}
