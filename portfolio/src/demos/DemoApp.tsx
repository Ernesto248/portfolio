import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import { FinanceDemo } from "./FinanceDemo";
import { SgiaDemo } from "./SgiaDemo";
import { RaffleDemo } from "./RaffleDemo";
import "./demo.css";

const demoRoutes = [
  { slug: "transactions", label: "Transactions", index: "01", eyebrow: "FINANCIAL OPERATIONS" },
  { slug: "sgia", label: "S.G.I.A.", index: "02", eyebrow: "BUSINESS OPERATIONS" },
  { slug: "tattoo-raffle", label: "Tattoo Raffle", index: "03", eyebrow: "PAYMENTS & RESERVATIONS" },
] as const;

export type DemoSlug = (typeof demoRoutes)[number]["slug"];

export function DemoHeader({ active, onReset }: { active: DemoSlug; onReset: () => void }) {
  return (
    <header className="demo-header">
      <div className="demo-header-inner">
        <a className="demo-brand" href="/#work" aria-label="Volver a Leonard Solutions">
          LEONARD<span>/</span>SOLUTIONS <small>LAB</small>
        </a>
        <nav className="demo-nav" aria-label="Demos">
          {demoRoutes.map((route) => (
            <a key={route.slug} className={route.slug === active ? "active" : ""} href={`/demos/${route.slug}`} aria-current={route.slug === active ? "page" : undefined}>
              <span>{route.index}</span> {route.label}
            </a>
          ))}
        </nav>
        <button className="demo-reset" type="button" onClick={onReset}>
          <RotateCcw size={15} aria-hidden="true" /> Reiniciar
        </button>
      </div>
    </header>
  );
}

export function DemoIntro({ index, eyebrow, title, description, accent }: { index: string; eyebrow: string; title: string; description: string; accent: string }) {
  return (
    <div className="demo-intro" style={{ "--demo-accent": accent } as React.CSSProperties}>
      <div className="demo-intro-left">
        <p className="demo-overline"><span className="demo-live-dot" /> DEMO INTERACTIVA <span className="demo-overline-separator">/</span> {index} — {eyebrow}</p>
        <h1>{title}<span className="demo-title-dot">.</span></h1>
        <p>{description}</p>
      </div>
      <div className="demo-intro-right">
        <span>ENTORNO DE PRUEBAS</span>
        <strong>Datos ficticios</strong>
        <p>Esta demo reproduce el flujo y las reglas principales. No conecta con sistemas de clientes, pagos reales ni datos privados.</p>
      </div>
    </div>
  );
}

export function Metric({ label, value, detail, className = "" }: { label: string; value: string; detail?: string; className?: string }) {
  return <div className={`demo-metric ${className}`}><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>;
}

export function Panel({ kicker, title, children, className = "" }: { kicker: string; title: string; children: React.ReactNode; className?: string }) {
  return <section className={`demo-panel ${className}`}><div className="demo-panel-head"><span>{kicker}</span><h2>{title}</h2></div>{children}</section>;
}

export function DemoFooter({ active }: { active: DemoSlug }) {
  const current = demoRoutes.findIndex((route) => route.slug === active);
  const next = demoRoutes[(current + 1) % demoRoutes.length];
  return <footer className="demo-footer"><a href="/#work"><ArrowLeft size={16} /> Volver a proyectos</a><span>LEONARD SOLUTIONS / PRODUCT LAB</span><a href={`/demos/${next.slug}`}>Siguiente demo: {next.label} <ArrowUpRight size={16} /></a></footer>;
}

export function DemoApp() {
  const slug = window.location.pathname.replace(/\/$/, "").split("/")[2];
  useEffect(() => {
    const route = demoRoutes.find((item) => item.slug === slug);
    document.title = route ? `${route.label} — Demo | Leonard Solutions` : "Demos | Leonard Solutions";
    document.documentElement.lang = "es";
    document.querySelector('meta[name="description"]')?.setAttribute("content", route ? `Demo interactiva de ${route.label} por Leonard Solutions. Datos ficticios y flujos simulados.` : "Demos interactivas de Leonard Solutions.");
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.body.classList.add("demo-body");
    return () => document.body.classList.remove("demo-body");
  }, [slug]);

  if (slug === "transactions") return <FinanceDemo />;
  if (slug === "sgia") return <SgiaDemo />;
  if (slug === "tattoo-raffle") return <RaffleDemo />;
  return <main className="demo-unknown"><a href="/#work">← Volver al portafolio</a><h1>Esta demo no existe.</h1></main>;
}
