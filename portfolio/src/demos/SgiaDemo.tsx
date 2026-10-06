import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Boxes, Check, PackageCheck, ShoppingBag } from "lucide-react";
import { DemoFooter, DemoHeader, DemoIntro, Metric, Panel } from "./DemoApp";

type Product = { id: string; name: string; sku: string; price: number };
type Transfer = { id: string; product: string; from: string; to: string; quantity: number; status: "en tránsito" | "recibida" };
type Sale = { id: string; branch: string; product: string; quantity: number; total: number };
type Stock = Record<string, Record<string, number>>;

const branches = ["Centro", "Norte", "Sur", "Este", "Oeste", "Terminal"];
const products: Product[] = [
  { id: "P-01", name: "Kit de cuidado", sku: "CAR-001", price: 24 },
  { id: "P-02", name: "Crema reparadora", sku: "CRE-002", price: 18 },
  { id: "P-03", name: "Aceite esencial", sku: "ACE-003", price: 32 },
  { id: "P-04", name: "Set profesional", sku: "SET-004", price: 58 },
];
const initialStock = (): Stock => ({
  Centro: { "P-01": 18, "P-02": 12, "P-03": 9, "P-04": 5 },
  Norte: { "P-01": 11, "P-02": 8, "P-03": 7, "P-04": 3 },
  Sur: { "P-01": 6, "P-02": 4, "P-03": 12, "P-04": 2 },
  Este: { "P-01": 14, "P-02": 10, "P-03": 3, "P-04": 4 },
  Oeste: { "P-01": 9, "P-02": 6, "P-03": 5, "P-04": 2 },
  Terminal: { "P-01": 8, "P-02": 7, "P-03": 4, "P-04": 1 },
});
const currency = (value: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export function SgiaDemo() {
  const [stock, setStock] = useState(initialStock);
  const [branch, setBranch] = useState("Centro");
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [transferProduct, setTransferProduct] = useState("P-01");
  const [target, setTarget] = useState("Norte");
  const [transferQuantity, setTransferQuantity] = useState("2");
  const [saleProduct, setSaleProduct] = useState("P-02");
  const [saleQuantity, setSaleQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const localStock = stock[branch];
  const totalUnits = Object.values(stock).reduce((sum, location) => sum + Object.values(location).reduce((count, quantity) => count + quantity, 0), 0);
  const transitUnits = transfers.filter((transfer) => transfer.status === "en tránsito").reduce((sum, transfer) => sum + transfer.quantity, 0);
  const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 5000);
    return () => window.clearTimeout(timer);
  }, [message]);

  function reset() {
    setStock(initialStock()); setBranch("Centro"); setTransfers([]); setSales([]); setTransferProduct("P-01"); setTarget("Norte"); setTransferQuantity("2"); setSaleProduct("P-02"); setSaleQuantity("1"); setMessage("Datos de demostración restaurados.");
  }

  function transfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(transferQuantity);
    if (!Number.isInteger(quantity) || quantity < 1 || target === branch || quantity > localStock[transferProduct]) {
      setMessage("La transferencia necesita una sucursal distinta y stock disponible suficiente."); return;
    }
    const id = `TR-${String(transfers.length + 1).padStart(3, "0")}`;
    setStock((current) => ({ ...current, [branch]: { ...current[branch], [transferProduct]: current[branch][transferProduct] - quantity } }));
    setTransfers((current) => [{ id, product: transferProduct, from: branch, to: target, quantity, status: "en tránsito" }, ...current]);
    setMessage(`${id} enviada: ${quantity} unidades salen de ${branch}. El destino debe confirmar la recepción.`);
  }

  function receive(id: string) {
    const item = transfers.find((entry) => entry.id === id);
    if (!item || item.status === "recibida") return;
    setStock((current) => ({ ...current, [item.to]: { ...current[item.to], [item.product]: current[item.to][item.product] + item.quantity } }));
    setTransfers((current) => current.map((entry) => entry.id === id ? { ...entry, status: "recibida" } : entry));
    setMessage(`${id} recibida en ${item.to}. El inventario del destino se actualizó una sola vez.`);
  }

  function sell(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(saleQuantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > localStock[saleProduct]) {
      setMessage("La venta requiere una cantidad entera disponible en esta sucursal."); return;
    }
    const product = products.find((item) => item.id === saleProduct)!;
    const id = `V-${String(sales.length + 1).padStart(3, "0")}`;
    setStock((current) => ({ ...current, [branch]: { ...current[branch], [saleProduct]: current[branch][saleProduct] - quantity } }));
    setSales((current) => [{ id, branch, product: saleProduct, quantity, total: quantity * product.price }, ...current]);
    setMessage(`${id} registrada en ${branch}: ${quantity} × ${product.name}. Stock y caja actualizados.`);
  }

  return <div className="demo-page demo-sgia">
    <DemoHeader active="sgia" onReset={reset} />
    <main className="demo-main">
      <DemoIntro index="02" eyebrow="BUSINESS OPERATIONS" title="S.G.I.A." description="Seis sucursales, un inventario compartido. Mueve stock entre ubicaciones, confirma su llegada y registra una venta desde la misma vista." accent="#7ce9cf" />
      <div className="demo-flow"><span><Boxes size={17} /> CATÁLOGO</span><i /><span>6 SUCURSALES</span><i /><span>TRANSFERENCIAS</span><i /><span>PUNTO DE VENTA</span></div>
      <div className="demo-metrics demo-metrics-four">
        <Metric label="SUCURSALES CONECTADAS" value="06" detail="Una vista de operación" />
        <Metric label="UNIDADES DISPONIBLES" value={String(totalUnits)} detail="En todas las ubicaciones" />
        <Metric label="EN TRÁNSITO" value={String(transitUnits).padStart(2, "0")} detail="Esperando recepción" />
        <Metric label="VENTAS SIMULADAS" value={currency(revenue)} detail={`${sales.length} ${sales.length === 1 ? "operación registrada" : "operaciones registradas"}`} className="demo-metric-emphasis" />
      </div>
      <div className="demo-branch-strip"><div><span>UBICACIÓN ACTIVA</span><strong>{branch}</strong></div><div className="demo-branch-buttons">{branches.map((item, index) => <button type="button" className={branch === item ? "active" : ""} key={item} onClick={() => { setBranch(item); if (target === item) setTarget(branch); }}><small>0{index + 1}</small>{item}</button>)}</div></div>
      <div className="demo-dashboard demo-sgia-layout">
        <Panel kicker="01 / INVENTARIO" title={`Stock · ${branch}`} className="demo-inventory-panel">
          <div className="demo-table-wrap"><table className="demo-table"><thead><tr><th>PRODUCTO</th><th>SKU</th><th>PRECIO</th><th>DISPONIBLE</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><span className="demo-product-dot" />{product.name}</td><td className="demo-muted">{product.sku}</td><td>{currency(product.price)}</td><td><span className={`demo-stock ${localStock[product.id] <= 3 ? "low" : ""}`}>{String(localStock[product.id]).padStart(2, "0")} uds</span></td></tr>)}</tbody></table></div>
          <div className="demo-panel-bottom"><PackageCheck size={15} /> Stock actualizado al vender, enviar y recibir</div>
        </Panel>
        <div className="demo-side-stack">
          <Panel kicker="02 / LOGÍSTICA" title="Enviar mercancía">
            <form className="demo-form" onSubmit={transfer}><label>Producto<select value={transferProduct} onChange={(event) => setTransferProduct(event.target.value)}>{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><div className="demo-field-row"><label>Destino<select value={target} onChange={(event) => setTarget(event.target.value)}>{branches.filter((item) => item !== branch).map((item) => <option key={item}>{item}</option>)}</select></label><label>Unidades<input type="number" min="1" step="1" value={transferQuantity} onChange={(event) => setTransferQuantity(event.target.value)} /></label></div><button className="demo-action" type="submit"><ArrowRight size={16} /> Crear transferencia</button></form>
          </Panel>
          <Panel kicker="03 / CAJA" title="Registrar venta">
            <form className="demo-form" onSubmit={sell}><div className="demo-field-row"><label>Producto<select value={saleProduct} onChange={(event) => setSaleProduct(event.target.value)}>{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Unidades<input type="number" min="1" step="1" value={saleQuantity} onChange={(event) => setSaleQuantity(event.target.value)} /></label></div><button className="demo-action secondary" type="submit"><ShoppingBag size={16} /> Registrar venta</button></form>
          </Panel>
        </div>
      </div>
      <div className="demo-bottom-grid">
        <Panel kicker="04 / TRAZABILIDAD" title="Movimientos entre sucursales"><div className="demo-transfer-list">{transfers.length === 0 && <p className="demo-empty">Crea una transferencia para ver el ciclo envío → recepción.</p>}{transfers.map((item) => <div className="demo-transfer" key={item.id}><div><strong>{item.id}</strong><span>{products.find((product) => product.id === item.product)?.name} · {item.quantity} uds</span><small>{item.from} <ArrowRight size={12} /> {item.to}</small></div><div><span className={`demo-status ${item.status === "recibida" ? "asignada" : "pendiente"}`}>{item.status}</span>{item.status === "en tránsito" && <button type="button" onClick={() => receive(item.id)}><Check size={14} /> Confirmar recepción</button>}</div></div>)}</div></Panel>
        <div className="demo-insight"><span>DECISIÓN DE INGENIERÍA / 02</span><h2>El stock tiene ubicación y estado.</h2><p>Enviar una transferencia descuenta el origen y deja las unidades en tránsito. Solo al confirmar la recepción aparecen en la sucursal de destino.</p><div className="demo-insight-line"><ArrowRight size={18} /> ENVÍA Y RECIBE MERCANCÍA</div></div>
      </div>
      {message && <div className="demo-toast" role="status">{message}</div>}
    </main>
    <DemoFooter active="sgia" />
  </div>;
}
