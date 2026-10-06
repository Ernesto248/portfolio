import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";
import "./career-about.css";

type Language = "es" | "en";

const chapters: Record<Language, WorksWheelItem[]> = {
  es: [
    {
      chapter: "01 / 2021—2025",
      title: "La base.",
      description: "Estudié Ingeniería Informática en la Universidad de Camagüey. Ahí empecé a unir interfaz, lógica y datos para construir productos completos.",
      proof: "INGENIERÍA INFORMÁTICA · UNIVERSIDAD DE CAMAGÜEY",
      art: "portrait",
    },
    {
      chapter: "02 / 2025",
      title: "El primer cliente.",
      description: "Con Stigmata Tattoo llevé una web real a producción: portfolio, ubicación, contacto y gestión de contenido visual. Sigue en uso desde junio de 2025.",
      proof: "STIGMATA TATTOO · EN PRODUCCIÓN",
      art: "studio",
    },
    {
      chapter: "03 / 2025",
      title: "Cobrar sin fricción.",
      description: "Tattoo Raffle reunió pagos con Stripe, reservas atómicas y correos transaccionales para una campaña real de 200 participaciones.",
      proof: "200 PARTICIPACIONES · CAMPAÑA REAL",
      art: "launch",
    },
    {
      chapter: "04 / 2025—2026",
      title: "Software para operar.",
      description: "S.G.I.A. sustituyó hojas de cálculo y conectó inventario, ventas y caja de seis sucursales. Lo usaron a diario entre cinco y seis personas.",
      proof: "6 SUCURSALES · 3.185 VENTAS",
      art: "operations",
    },
    {
      chapter: "05 / 2026",
      title: "Cada dato cuenta.",
      description: "Con Transactions desarrollé tres sistemas financieros para clientes: transacciones, saldos y conciliación con PostgreSQL, Neon y automatizaciones de n8n.",
      proof: "2.806 TRANSACCIONES · 25 DÍAS",
      art: "finance",
    },
  ],
  en: [
    {
      chapter: "01 / 2021—2025",
      title: "The foundation.",
      description: "I studied Computer Engineering at the University of Camagüey, where I began connecting interfaces, application logic and data to build complete products.",
      proof: "COMPUTER ENGINEERING · UNIVERSITY OF CAMAGÜEY",
      art: "portrait",
    },
    {
      chapter: "02 / 2025",
      title: "My first client.",
      description: "I shipped Stigmata Tattoo to production: a portfolio, location, contact form and visual content management. It has been in use since June 2025.",
      proof: "STIGMATA TATTOO · IN PRODUCTION",
      art: "studio",
    },
    {
      chapter: "03 / 2025",
      title: "Payments that work.",
      description: "Tattoo Raffle combined Stripe payments, atomic reservations and transactional email for a real 200-entry campaign.",
      proof: "200 ENTRIES · LIVE CAMPAIGN",
      art: "launch",
    },
    {
      chapter: "04 / 2025—2026",
      title: "Software for daily work.",
      description: "S.G.I.A. replaced spreadsheets and connected inventory, sales and cash across six branches. Five to six people used it in their daily work.",
      proof: "6 BRANCHES · 3,185 SALES",
      art: "operations",
    },
    {
      chapter: "05 / 2026",
      title: "Every record matters.",
      description: "With Transactions, I built three financial systems for clients: transactions, balances and reconciliation powered by PostgreSQL, Neon and n8n automation.",
      proof: "2,806 TRANSACTIONS · 25 DAYS",
      art: "finance",
    },
  ],
};

export function CareerAbout({ language }: { language: Language }) {
  return (
    <section className="career-about" id="about" aria-labelledby="about-title">
      <div className="career-about-heading shell">
        <p className="career-about-kicker">02 / ABOUT ME</p>
        <div className="career-about-heading-grid">
          <h2 id="about-title">
            <span data-copy="es">La historia detrás del trabajo.</span>
            <span data-copy="en">The story behind the work.</span>
          </h2>
          <p>
            <span data-copy="es">De la universidad a productos usados cada día por clientes. Cinco momentos que explican cómo trabajo.</span>
            <span data-copy="en">From university to products clients use every day. Five moments that show how I work.</span>
          </p>
        </div>
      </div>
      <WorksWheel
        items={chapters[language]}
        label={language === "es" ? "MI RECORRIDO" : "MY JOURNEY"}
        intro={language === "es" ? "De la idea al sistema." : "From idea to system."}
        hint={language === "es" ? "Desliza para recorrer" : "Scroll to explore"}
      />
      <div className="career-about-outro">
        <div className="shell career-about-outro-inner">
          <a href="https://github.com/Ernesto248" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/ernesto-leonard-escariz-747685252/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href="#work">
            <span data-copy="es">Ver proyectos ↓</span>
            <span data-copy="en">See projects ↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
