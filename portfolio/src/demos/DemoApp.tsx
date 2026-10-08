import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import { FinanceDemo } from "./FinanceDemo";
import { SgiaDemo } from "./SgiaDemo";
import { RaffleDemo } from "./RaffleDemo";
import { t } from "./demo-i18n";
import type { Language } from "./demo-i18n";
import "./demo.css";
import "./demo-v2.css";
import "./product-fidelity.css";

const demoRoutes = [
  { slug: "transactions", label: "Transactions", index: "01", eyebrow: "FINANCIAL OPERATIONS" },
  { slug: "sgia", label: "S.G.I.A.", index: "02", eyebrow: "BUSINESS OPERATIONS" },
  { slug: "tattoo-raffle", label: "Tattoo Raffle", index: "03", eyebrow: "PAYMENTS & RESERVATIONS" },
] as const;

const sourceUrls: Record<(typeof demoRoutes)[number]["slug"], string> = {
  transactions: "https://github.com/Ernesto248/undertaker-transactions",
  sgia: "https://github.com/Ernesto248/sgia-showcase",
  "tattoo-raffle": "https://github.com/Ernesto248/tattoo-raffle-showcase",
};

export type DemoSlug = (typeof demoRoutes)[number]["slug"];
const initialLanguage = (): Language => new URLSearchParams(window.location.search).get("lang") === "en" || (new URLSearchParams(window.location.search).get("lang") !== "es" && localStorage.getItem("portfolio-language") === "en") ? "en" : "es";

export function DemoHeader({ active, onReset, language, onLanguageChange, preview = false }: { active: DemoSlug; onReset: () => void; language: Language; onLanguageChange: (language: Language) => void; preview?: boolean }) {
  return (
    <header className="demo-header">
      <div className="demo-header-inner">
        <a className="demo-brand" href="/#work" aria-label="Volver a Leonard Solutions">
          LEONARD<span>/</span>SOLUTIONS <small>LAB</small>
        </a>
        {!preview && <nav className="demo-nav" aria-label="Demos">
          {demoRoutes.map((route) => (
            <a key={route.slug} className={route.slug === active ? "active" : ""} href={`/demos/${route.slug}`} aria-current={route.slug === active ? "page" : undefined}>
              <span>{route.index}</span> {route.label}
            </a>
          ))}
        </nav>}
        <div className="demo-language" role="group" aria-label="Language / Idioma"><button type="button" aria-pressed={language === "es"} onClick={() => onLanguageChange("es")}>ES</button><button type="button" aria-pressed={language === "en"} onClick={() => onLanguageChange("en")}>EN</button></div>
        <button className="demo-reset" type="button" onClick={onReset}>
          <RotateCcw size={15} aria-hidden="true" /> {t(language, "Reiniciar", "Reset")}
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
        <h1>{title.endsWith(".") ? title.slice(0, -1) : title}<span className="demo-title-dot">.</span></h1>
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

export function Panel({ kicker, title, children, className = "", id }: { kicker: string; title: string; children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`demo-panel ${className}`}><div className="demo-panel-head"><span>{kicker}</span><h2>{title}</h2></div>{children}</section>;
}

export function SandboxHeading({ language, title, description }: { language: Language; title: string; description: string }) {
  return <div id="sandbox" className="demo-sandbox-heading"><div><span>{t(language, "ENTORNO INTERACTIVO / DATOS FICTICIOS", "INTERACTIVE SANDBOX / FICTIONAL DATA")}</span><h2>{title}</h2></div><p>{description}</p></div>;
}

export function DemoFooter({ active, language }: { active: DemoSlug; language: Language }) {
  const current = demoRoutes.findIndex((route) => route.slug === active);
  const next = demoRoutes[(current + 1) % demoRoutes.length];
  return <footer className="demo-footer"><a href="/#work"><ArrowLeft size={16} /> {t(language, "Volver a proyectos", "Back to projects")}</a><a href={sourceUrls[active]} target="_blank" rel="noopener noreferrer">{t(language, "Código de esta demo", "Source for this demo")} <ArrowUpRight size={16} /></a><a href={`/demos/${next.slug}${language === "en" ? "?lang=en" : ""}`}>{t(language, "Siguiente demo", "Next demo")}: {next.label} <ArrowUpRight size={16} /></a></footer>;
}

export function DemoApp() {
  const slug = window.location.pathname.replace(/\/$/, "").split("/")[2];
  const preview = new URLSearchParams(window.location.search).get("preview") === "1";
  const [language, setLanguage] = useState<Language>(initialLanguage);
  useEffect(() => {
    const route = demoRoutes.find((item) => item.slug === slug);
    document.title = route ? `${route.label} — Demo | Leonard Solutions` : "Demos | Leonard Solutions";
    document.documentElement.lang = language;
    localStorage.setItem("portfolio-language", language);
    document.querySelector('meta[name="description"]')?.setAttribute("content", route ? t(language, `Demo interactiva de ${route.label} por Leonard Solutions. Datos ficticios y flujos simulados.`, `Interactive ${route.label} demo by Leonard Solutions. Fictional data and simulated workflows.`) : "Demos interactivas de Leonard Solutions.");
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.body.classList.add("demo-body");
    return () => document.body.classList.remove("demo-body");
  }, [slug, language]);

  const common = { language, onLanguageChange: setLanguage, preview };
  if (slug === "transactions") return <FinanceDemo {...common} />;
  if (slug === "sgia") return <SgiaDemo {...common} />;
  if (slug === "tattoo-raffle") return <RaffleDemo {...common} />;
  return <main className="demo-unknown"><a href="/#work">← Volver al portafolio</a><h1>Esta demo no existe.</h1></main>;
}
