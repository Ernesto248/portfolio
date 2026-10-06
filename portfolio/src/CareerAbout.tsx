import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";
import "./career-about.css";

type Language = "es" | "en";

const chapters: Record<Language, WorksWheelItem[]> = {
  es: [
    {
      chapter: "01 / ORIGEN",
      title: "Una base para construir.",
      description: "Soy ingeniero informático. La formación me dio la base para entender cómo encajan la interfaz, la lógica y los datos.",
      proof: "FORMACIÓN · INGENIERÍA INFORMÁTICA",
      art: "portrait",
    },
    {
      chapter: "02 / PROYECTOS PROPIOS",
      title: "Aprender haciendo.",
      description: "Proyectos como Dev Type me dieron espacio para experimentar con interacción, estado y experiencia de usuario.",
      proof: "DEV TYPE · PROYECTO PROPIO",
      art: "interface",
    },
    {
      chapter: "03 / CLIENTES",
      title: "Software para operar.",
      description: "Desarrollé S.G.I.A., un sistema de gestión que conectó inventario, ventas y caja en seis sucursales.",
      proof: "6 SUCURSALES · USO DIARIO",
      art: "operations",
    },
    {
      chapter: "04 / DATOS",
      title: "Cada dato cuenta.",
      description: "En Transactions diseñé ingesta idempotente, un libro auditable y automatizaciones para conciliar operaciones reales.",
      proof: "2.806 TRANSACCIONES · 25 DÍAS",
      art: "finance",
    },
    {
      chapter: "05 / ENTREGA",
      title: "Lanzar y mantener.",
      description: "Tattoo Raffle reunió pagos, reservas seguras y administración en una campaña real de 200 participaciones.",
      proof: "200 PARTICIPACIONES · CAMPAÑA REAL",
      art: "launch",
    },
  ],
  en: [
    {
      chapter: "01 / FOUNDATION",
      title: "A foundation to build on.",
      description: "I'm a computer engineering graduate. That foundation helped me connect interfaces, application logic and data.",
      proof: "EDUCATION · COMPUTER ENGINEERING",
      art: "portrait",
    },
    {
      chapter: "02 / PERSONAL PROJECTS",
      title: "Learning by building.",
      description: "Projects like Dev Type gave me room to explore interaction, state and user experience.",
      proof: "DEV TYPE · PERSONAL PROJECT",
      art: "interface",
    },
    {
      chapter: "03 / CLIENT WORK",
      title: "Software for daily work.",
      description: "I built S.G.I.A., a management system connecting inventory, sales and cash across six branches.",
      proof: "6 BRANCHES · DAILY USE",
      art: "operations",
    },
    {
      chapter: "04 / DATA",
      title: "Every record matters.",
      description: "For Transactions I designed idempotent ingestion, an auditable ledger and automation for real reconciliation workflows.",
      proof: "2,806 TRANSACTIONS · 25 DAYS",
      art: "finance",
    },
    {
      chapter: "05 / DELIVERY",
      title: "Ship and maintain.",
      description: "Tattoo Raffle combined payments, safe reservations and administration for a real 200-entry campaign.",
      proof: "200 ENTRIES · LIVE CAMPAIGN",
      art: "launch",
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
            <span data-copy="es">Un recorrido breve, hecho de proyectos que salieron de la pantalla para resolver problemas reales.</span>
            <span data-copy="en">A short journey through projects that moved beyond the screen to solve real problems.</span>
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
