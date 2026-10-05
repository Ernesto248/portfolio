import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolioMotion } from "./usePortfolioMotion";

type Language = "es" | "en";

const descriptions: Record<Language, string> = {
  es: "Ernesto Leonard Escariz, desarrollador full stack. Aplicaciones web, automatización y sistemas de negocio en producción.",
  en: "Ernesto Leonard Escariz, full stack developer. Web applications, automation and production business systems.",
};

function initialLanguage(): Language {
  const query = new URLSearchParams(window.location.search).get("lang");
  if (query === "es" || query === "en") return query;
  try {
    return localStorage.getItem("portfolio-language") === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

function Header({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (value: Language) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner shell flex items-center justify-between">
        <a
          className="brand"
          href="#top"
          aria-label="Ernesto Leonard Escariz, inicio"
        >
          E<span className="brand-dot">.</span>L
        </a>
        <nav
          className="main-nav"
          aria-label="Navegación principal"
          data-aria-es="Navegación principal"
          data-aria-en="Main navigation"
        >
          <a href="#work">
            <span data-copy="es">Proyectos</span>
            <span data-copy="en">Work</span>
          </a>
          <a href="#about">
            <span data-copy="es">Sobre mí</span>
            <span data-copy="en">About</span>
          </a>
          <a href="#contact">
            <span data-copy="es">Contacto</span>
            <span data-copy="en">Contact</span>
          </a>
        </nav>
        <div className="header-actions">
          <div className="mobile-menu">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={language === "es" ? "Abrir menú" : "Open menu"}
                >
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[min(85vw,340px)] bg-[#f6f7f4] p-8 text-[#111b2b]"
              >
                <SheetTitle className="sr-only">
                  {language === "es" ? "Navegación" : "Navigation"}
                </SheetTitle>
                <nav
                  aria-label={
                    language === "es" ? "Navegación móvil" : "Mobile navigation"
                  }
                  className="mt-16 flex flex-col gap-7 text-xl font-bold"
                >
                  <a href="#work" onClick={() => setMenuOpen(false)}>
                    {language === "es" ? "Proyectos" : "Work"}
                  </a>
                  <a href="#about" onClick={() => setMenuOpen(false)}>
                    {language === "es" ? "Sobre mí" : "About"}
                  </a>
                  <a href="#contact" onClick={() => setMenuOpen(false)}>
                    {language === "es" ? "Contacto" : "Contact"}
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="language-switch" aria-label="Idioma / Language">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-none px-1"
              data-set-language="es"
              aria-pressed={language === "es"}
              onClick={() => setLanguage("es")}
            >
              ES
            </Button>
            <span aria-hidden="true">/</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-none px-1"
              data-set-language="en"
              aria-pressed={language === "en"}
              onClick={() => setLanguage("en")}
            >
              EN
            </Button>
          </div>
          <Button asChild className="rounded-none h-auto">
            <a
              className="header-contact"
              href="mailto:ernestoleonard8@gmail.com"
            >
              <span data-copy="es">Hablemos</span>
              <span data-copy="en">Let's talk</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-atmosphere" aria-hidden="true"></div>
      <div className="hero-depth" aria-hidden="true">
        <span className="hero-depth-ring hero-depth-ring-one"></span>
        <span className="hero-depth-ring hero-depth-ring-two"></span>
        <span className="hero-depth-ring hero-depth-ring-three"></span>
      </div>
      <div className="shell mx-auto w-[min(calc(100%-36px),1240px)] sm:w-[min(calc(100%-64px),1240px)] hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-mark" aria-hidden="true"></span>
            <span data-copy="es">
              Desarrollador full stack · Valencia, España
            </span>
            <span data-copy="en">Full stack developer · Valencia, Spain</span>
          </p>
          <h1 id="hero-title">
            <span data-copy="es">
              Construyo software que <em>organiza</em> lo complejo.
            </span>
            <span data-copy="en">
              I build software that <em>makes sense</em> of complexity.
            </span>
          </h1>
          <p className="hero-intro">
            <span data-copy="es">
              Soy Ernesto Leonard Escariz. Desarrollo aplicaciones web de
              principio a fin: interfaces claras, datos fiables y procesos que
              funcionan en el día a día.
            </span>
            <span data-copy="en">
              I'm Ernesto Leonard Escariz. I build web applications end to end:
              clear interfaces, reliable data and workflows that hold up in
              daily use.
            </span>
          </p>
          <div className="hero-links">
            <a className="button button-primary" href="#work">
              <span data-copy="es">Ver proyectos</span>
              <span data-copy="en">Explore my work</span>
              <span aria-hidden="true">↘</span>
            </a>
            <a
              className="text-link"
              href="https://github.com/Ernesto248"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <aside
          className="hero-proof"
          aria-label="Trayectoria"
          data-aria-es="Trayectoria"
          data-aria-en="Experience"
        >
          <div className="proof-topline">
            <span>01 / 03</span>
            <span>2025 — 2026</span>
          </div>
          <p className="proof-label">
            <span data-copy="es">Experiencia en producción</span>
            <span data-copy="en">Production experience</span>
          </p>
          <div className="proof-number">07</div>
          <p className="proof-description">
            <span data-copy="es">
              aplicaciones web pagadas entregadas de extremo a extremo; cinco
              seguían en uso en octubre de 2026.
            </span>
            <span data-copy="en">
              paid web applications delivered end to end; five remained in use
              in October 2026.
            </span>
          </p>
          <div className="proof-rule"></div>
          <div className="proof-footer">
            <span>React / Next.js</span>
            <span>TypeScript / PostgreSQL</span>
          </div>
        </aside>
      </div>
      <div className="hero-bottom shell">
        <span data-copy="es">Trabajo seleccionado</span>
        <span data-copy="en">Selected work</span>
        <span className="scroll-line" aria-hidden="true"></span>
        <span>2025 — 2026</span>
      </div>
    </section>
  );
}

function Interlude() {
  return (
    <section
      className="interlude"
      aria-label="Proyectos seleccionados"
      data-aria-es="Proyectos seleccionados"
      data-aria-en="Selected projects"
    >
      <div className="interlude-stage">
        <div className="interlude-orbit" aria-hidden="true"></div>
        <div className="interlude-content shell mx-auto w-[min(calc(100%-36px),1240px)] sm:w-[min(calc(100%-64px),1240px)]">
          <span className="interlude-kicker">01 — 03 / CASE STUDIES</span>
          <p>
            <span data-copy="es">Del problema al producto.</span>
            <span data-copy="en">From problem to product.</span>
          </p>
          <span className="interlude-bottom">
            <span data-copy="es">Desliza para explorar tres sistemas reales</span>
            <span data-copy="en">Scroll to explore three real systems</span>
            <span aria-hidden="true">↓</span>
          </span>
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section
      className="work-section shell mx-auto w-[min(calc(100%-36px),1240px)] sm:w-[min(calc(100%-64px),1240px)]"
      id="work"
      aria-labelledby="work-title"
    >
      <div className="section-heading flex justify-between">
        <div>
          <p className="section-kicker">01 / WORK</p>
          <h2 id="work-title">
            <span data-copy="es">Proyectos con impacto real.</span>
            <span data-copy="en">Work with real impact.</span>
          </h2>
        </div>
        <p className="section-aside">
          <span data-copy="es">
            Tres casos de proyectos reales. El código de clientes sigue privado;
            aquí muestro mi contribución y resultados.
          </span>
          <span data-copy="en">
            Three case studies from real projects. Client code remains private;
            here I show my contribution and outcomes.
          </span>
        </p>
      </div>

      <div className="work-rail" aria-hidden="true">
        <span className="work-rail-label">CASE STUDIES / <span className="work-rail-current">01</span> — 03</span>
        <span className="work-rail-track"><span className="work-rail-fill"></span></span>
        <span className="work-rail-arrow">↓</span>
      </div>

      <article
        className="project grid project-finance"
        aria-labelledby="project-finance-title"
      >
        <div
          className="project-visual visual-finance"
          aria-label="Flujo de transacciones, libro financiero y conciliación"
          data-aria-es="Flujo de transacciones, libro financiero y conciliación"
          data-aria-en="Transaction intake, financial ledger and reconciliation flow"
        >
          <div className="visual-top">
            <span>01 / FINANCE SYSTEMS</span>
            <span className="visual-spark">✳</span>
          </div>
          <div className="finance-flow">
            <div>
              <small>INPUT</small>
              <strong>
                <span data-copy="es">Transacciones</span>
                <span data-copy="en">Transactions</span>
              </strong>
              <span>
                <span data-copy="es">2.806 registros</span>
                <span data-copy="en">2,806 records</span>
              </span>
            </div>
            <b aria-hidden="true">→</b>
            <div>
              <small>CONTROL</small>
              <strong>
                <span data-copy="es">Libro auditable</span>
                <span data-copy="en">Auditable ledger</span>
              </strong>
              <span>
                <span data-copy="es">Eventos y saldos</span>
                <span data-copy="en">Events and balances</span>
              </span>
            </div>
            <b aria-hidden="true">→</b>
            <div>
              <small>OUTPUT</small>
              <strong>
                <span data-copy="es">Conciliación</span>
                <span data-copy="en">Reconciliation</span>
              </strong>
              <span>
                <span data-copy="es">3 despliegues</span>
                <span data-copy="en">3 deployments</span>
              </span>
            </div>
          </div>
          <div className="visual-bottom">
            <span>DATA INTEGRITY</span>
            <span>NEON · N8N</span>
          </div>
        </div>
        <div className="project-content flex flex-col">
          <div className="project-index">
            <span>01</span>
            <span data-copy="es">Automatización financiera</span>
            <span data-copy="en">Financial automation</span>
          </div>
          <h3 id="project-finance-title">Transactions</h3>
          <p className="project-lead">
            <span data-copy="es">
              Tres sistemas que centralizan transacciones, saldos, deudas,
              gastos y conciliación para negocios que operaban con procesos
              fragmentados.
            </span>
            <span data-copy="en">
              Three systems centralizing transactions, balances, debts, expenses
              and reconciliation for businesses with fragmented operations.
            </span>
          </p>
          <div className="project-stat">
            <strong>
              <span data-copy="es">2.806</span>
              <span data-copy="en">2,806</span>
            </strong>
            <span data-copy="es">
              transacciones procesadas en 25 días entre tres despliegues.
            </span>
            <span data-copy="en">
              transactions processed in 25 days across three deployments.
            </span>
          </div>
          <p className="project-detail">
            <span data-copy="es">
              Diseñé el flujo de ingesta idempotente, el libro financiero con
              historial auditable y la lógica de valoración FIFO. Next.js y
              PostgreSQL sostienen la aplicación; n8n automatiza la entrada de
              datos.
            </span>
            <span data-copy="en">
              I designed idempotent ingestion, an auditable financial ledger and
              FIFO valuation. Next.js and PostgreSQL power the app; n8n
              automates data intake.
            </span>
          </p>
          <div className="project-meta">
            <Badge variant="outline" className="rounded-full">
              Next.js
            </Badge>
            <Badge variant="outline" className="rounded-full">
              TypeScript
            </Badge>
            <Badge variant="outline" className="rounded-full">
              PostgreSQL
            </Badge>
            <Badge variant="outline" className="rounded-full">
              n8n
            </Badge>
          </div>
          <a
            className="project-link"
            href="https://github.com/Ernesto248/undertaker-transactions"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span data-copy="es">Ver versión pública del código</span>
            <span data-copy="en">View public code variant</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>

      <article
        className="project grid project-erp"
        aria-labelledby="project-erp-title"
      >
        <div
          className="project-visual visual-erp"
          aria-label="Diagrama de seis sucursales conectadas a un sistema de gestión"
          data-aria-es="Diagrama de seis sucursales conectadas a un sistema de gestión"
          data-aria-en="Diagram of six branches connected to one management system"
        >
          <div className="visual-top">
            <span>02 / BUSINESS OPERATIONS</span>
            <span className="visual-spark">✳</span>
          </div>
          <div className="erp-diagram">
            <div className="erp-core">
              <span>S.G.I.A.</span>
              <strong>
                <span data-copy="es">Una fuente de verdad</span>
                <span data-copy="en">One source of truth</span>
              </strong>
            </div>
            <div className="erp-branches">
              <span>01</span>
              <span>02</span>
              <span>03</span>
              <span>04</span>
              <span>05</span>
              <span>06</span>
            </div>
            <div className="erp-caption">
              <span data-copy="es">INVENTARIO</span>
              <span data-copy="en">INVENTORY</span>
              <i></i>
              <span data-copy="es">VENTAS</span>
              <span data-copy="en">SALES</span>
              <i></i>
              <span data-copy="es">CAJA</span>
              <span data-copy="en">CASH</span>
            </div>
          </div>
          <div className="visual-bottom">
            <span>6 BRANCHES</span>
            <span>1 SYSTEM</span>
          </div>
        </div>
        <div className="project-content flex flex-col">
          <div className="project-index">
            <span>02</span>
            <span data-copy="es">Sistema de gestión</span>
            <span data-copy="en">Business management</span>
          </div>
          <h3 id="project-erp-title">S.G.I.A.</h3>
          <p className="project-lead">
            <span data-copy="es">
              Un ERP para sustituir hojas de cálculo y conectar inventario,
              ventas, proveedores, caja y comisiones de seis sucursales.
            </span>
            <span data-copy="en">
              An ERP replacing spreadsheets and connecting inventory, sales,
              suppliers, cash and commissions across six branches.
            </span>
          </p>
          <div className="project-stat">
            <strong>~60 min</strong>
            <span data-copy="es">
              de cuadre diario reducidos a un proceso casi automático.
            </span>
            <span data-copy="en">
              of daily reconciliation reduced to a near-automatic process.
            </span>
          </div>
          <p className="project-detail">
            <span data-copy="es">
              Desarrollé la aplicación de extremo a extremo con permisos por
              rol, operaciones por sucursal y flujos de inventario y ventas. Un
              equipo de cinco a seis personas la utilizó en su trabajo diario.
            </span>
            <span data-copy="en">
              I built the app end to end with role-based access, branch
              operations, inventory and sales workflows. A team of five to six
              people used it in their daily work.
            </span>
          </p>
          <div className="project-meta">
            <Badge variant="outline" className="rounded-full">
              Next.js
            </Badge>
            <Badge variant="outline" className="rounded-full">
              TypeScript
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Supabase
            </Badge>
            <Badge variant="outline" className="rounded-full">
              PostgreSQL
            </Badge>
          </div>
          <p className="private-note">
            <span data-copy="es">
              Código del cliente privado · Demo independiente en preparación
            </span>
            <span data-copy="en">
              Private client code · Standalone demo in preparation
            </span>
          </p>
        </div>
      </article>

      <article
        className="project grid project-raffle"
        aria-labelledby="project-raffle-title"
      >
        <div
          className="project-visual visual-raffle"
          aria-label="Representación de entradas numeradas de una campaña"
          data-aria-es="Representación de entradas numeradas de una campaña"
          data-aria-en="Illustration of numbered campaign entries"
        >
          <div className="visual-top">
            <span>03 / PAYMENTS & RESERVATIONS</span>
            <span className="visual-spark">✳</span>
          </div>
          <div className="ticket-grid">
            <span>001</span>
            <span>002</span>
            <span>003</span>
            <span>004</span>
            <span>005</span>
            <span>006</span>
            <span>007</span>
            <span>008</span>
            <span>009</span>
            <span>010</span>
            <span>011</span>
            <span>012</span>
          </div>
          <div className="raffle-count">
            <strong>200</strong>
            <span data-copy="es">participaciones</span>
            <span data-copy="en">entries</span>
          </div>
          <div className="visual-bottom">
            <span>ATOMIC RESERVATIONS</span>
            <span>STRIPE</span>
          </div>
        </div>
        <div className="project-content flex flex-col">
          <div className="project-index">
            <span>03</span>
            <span data-copy="es">Pagos y reservas</span>
            <span data-copy="en">Payments and reservations</span>
          </div>
          <h3 id="project-raffle-title">Tattoo Raffle</h3>
          <p className="project-lead">
            <span data-copy="es">
              Una plataforma para una campaña real de 200 participaciones, con
              compra de entradas, asignación segura y gestión administrativa.
            </span>
            <span data-copy="en">
              A platform for a real 200-entry campaign, with ticket purchases,
              safe assignment and administration.
            </span>
          </p>
          <div className="project-stat">
            <strong>200</strong>
            <span data-copy="es">
              participaciones gestionadas durante una campaña de una semana.
            </span>
            <span data-copy="en">
              entries handled during a one-week campaign.
            </span>
          </div>
          <p className="project-detail">
            <span data-copy="es">
              Integré Stripe Checkout, reservas atómicas para evitar duplicados,
              webhooks idempotentes, correos transaccionales y un panel de
              control. La campaña concluyó sin incidencias operativas
              reportadas.
            </span>
            <span data-copy="en">
              I integrated Stripe Checkout, atomic reservations to prevent
              duplicates, idempotent webhooks, transactional emails and an admin
              dashboard. The campaign ended with no reported operational
              incidents.
            </span>
          </p>
          <div className="project-meta">
            <Badge variant="outline" className="rounded-full">
              Next.js
            </Badge>
            <Badge variant="outline" className="rounded-full">
              TypeScript
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Stripe
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Supabase
            </Badge>
          </div>
          <p className="private-note">
            <span data-copy="es">
              Código del cliente privado · Demo independiente en preparación
            </span>
            <span data-copy="en">
              Private client code · Standalone demo in preparation
            </span>
          </p>
        </div>
      </article>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-depth" aria-hidden="true">
        <span>BUILD / CONNECT / SHIP</span>
        <i></i><i></i><i></i>
      </div>
      <div className="shell mx-auto w-[min(calc(100%-36px),1240px)] sm:w-[min(calc(100%-64px),1240px)] about-grid">
        <div>
          <p className="section-kicker">02 / PROFILE</p>
          <h2 id="about-title">
            <span data-copy="es">
              Entre la interfaz y la lógica de negocio.
            </span>
            <span data-copy="en">Between interface and business logic.</span>
          </h2>
        </div>
        <div className="about-copy">
          <p>
            <span data-copy="es">
              Soy ingeniero informático y desarrollador full stack. Me gusta
              convertir procesos difíciles de seguir en herramientas claras,
              verificables y útiles para quienes las usan cada día.
            </span>
            <span data-copy="en">
              I'm a computer engineering graduate and full stack developer. I
              turn hard-to-follow processes into clear, verifiable tools for the
              people who use them every day.
            </span>
          </p>
          <p>
            <span data-copy="es">
              He trabajado de forma independiente con clientes privados,
              asumiendo desarrollo, despliegue y mantenimiento. Mi trabajo
              combina React y Next.js con APIs, bases de datos y automatización.
            </span>
            <span data-copy="en">
              I've worked independently with private clients, owning
              development, deployment and maintenance. My work combines React
              and Next.js with APIs, databases and automation.
            </span>
          </p>
          <div className="about-links">
            <a
              href="https://www.linkedin.com/in/ernesto-leonard-escariz-747685252/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/Ernesto248"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
      <div className="shell mx-auto w-[min(calc(100%-36px),1240px)] sm:w-[min(calc(100%-64px),1240px)] capabilities">
        <span>TypeScript</span>
        <span>React</span>
        <span>Next.js</span>
        <span>Node.js</span>
        <span>Java</span>
        <span>Spring Boot</span>
        <span>PostgreSQL</span>
        <span>Supabase</span>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      className="contact-section shell mx-auto w-[min(calc(100%-36px),1240px)] sm:w-[min(calc(100%-64px),1240px)]"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-curtain" aria-hidden="true"><span>LET'S BUILD SOMETHING</span></div>
      <div className="contact-glow" aria-hidden="true"></div>
      <p className="section-kicker">03 / CONTACT</p>
      <div className="contact-grid grid">
        <h2 id="contact-title">
          <span data-copy="es">¿Construimos algo que importe?</span>
          <span data-copy="en">Let's build something that matters.</span>
        </h2>
        <div>
          <p>
            <span data-copy="es">
              Abierto a oportunidades de desarrollo full stack y a conversar
              sobre productos, sistemas y datos.
            </span>
            <span data-copy="en">
              Open to full stack opportunities and conversations about products,
              systems and data.
            </span>
          </p>
          <a className="contact-email" href="mailto:ernestoleonard8@gmail.com">
            ernestoleonard8@gmail.com <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell mx-auto w-[min(calc(100%-36px),1240px)] sm:w-[min(calc(100%-64px),1240px)] footer-inner">
        <span>
          © <span id="year">{new Date().getFullYear()}</span> Ernesto Leonard
          Escariz
        </span>
        <span>
          <span data-copy="es">
            Diseñado para contar el trabajo detrás del código.
          </span>
          <span data-copy="en">Made to show the work behind the code.</span>
        </span>
        <a href="#top">
          <span data-copy="es">Volver arriba ↑</span>
          <span data-copy="en">Back to top ↑</span>
        </a>
      </div>
    </footer>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const page = useRef<HTMLDivElement>(null);
  usePortfolioMotion(page);

  useEffect(() => {
    document.documentElement.lang = language;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", descriptions[language]);
    page.current
      ?.querySelectorAll<HTMLElement>("[data-aria-es]")
      .forEach((element) => {
        element.setAttribute(
          "aria-label",
          element.dataset[language === "en" ? "ariaEn" : "ariaEs"] ?? "",
        );
      });
    try {
      localStorage.setItem("portfolio-language", language);
    } catch {
      /* Storage can be unavailable. */
    }
    const url = new URL(window.location.href);
    if (language === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    window.history.replaceState(null, "", url);
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [language]);

  return (
    <div ref={page}>
      <a className="skip-link" href="#main">
        <span data-copy="es">Saltar al contenido</span>
        <span data-copy="en">Skip to content</span>
      </a>
      <Header language={language} setLanguage={setLanguage} />
      <main id="main">
        <Hero />
        <Interlude />
        <Work />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
