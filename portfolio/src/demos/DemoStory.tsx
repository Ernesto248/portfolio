import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { DemoSlug } from "./DemoApp";
import type { Language } from "./demo-i18n";
import "./demo-story.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Scene = { marker: string; title: string; body: string };
type Story = { category: string; title: string; subtitle: string; scenes: Scene[]; enter: string };

const stories: Record<DemoSlug, Record<Language, Story>> = {
  transactions: {
    es: {
      category: "01 / OPERACIONES FINANCIERAS",
      title: "Cada movimiento deja una huella.",
      subtitle: "Del mensaje bancario disperso a un registro que se puede seguir y explicar.",
      scenes: [
        { marker: "EL PROBLEMA", title: "Los datos llegaban por separado.", body: "Bancos, confirmaciones y agentes necesitaban una sola vista. Sin una clave única, una notificación repetida podía alterar el saldo." },
        { marker: "LA DECISIÓN", title: "Validar antes de asignar.", body: "La pareja banco + código identifica cada entrada. Si vuelve a llegar, el sistema la rechaza y conserva el intento en la pista de auditoría." },
        { marker: "EL RESULTADO", title: "Un libro que explica el cambio.", body: "La asignación conecta el movimiento con un agente y actualiza su deuda. El historial permite reconstruir qué ocurrió." },
      ],
      enter: "Abrir mesa de operaciones",
    },
    en: {
      category: "01 / FINANCIAL OPERATIONS",
      title: "Every movement leaves a trace.",
      subtitle: "From scattered bank messages to a record you can follow and explain.",
      scenes: [
        { marker: "THE PROBLEM", title: "Information arrived separately.", body: "Banks, confirmations and agents needed one view. Without a unique key, a repeated notification could change the balance." },
        { marker: "THE DECISION", title: "Validate before assigning.", body: "Bank + confirmation code identifies each entry. A repeat is rejected and the attempt remains in the audit trail." },
        { marker: "THE OUTCOME", title: "A ledger that explains the change.", body: "Assignment connects a transaction to an agent and updates their debt. The history shows what happened." },
      ],
      enter: "Open operations desk",
    },
  },
  sgia: {
    es: {
      category: "02 / OPERACIONES MULTISUCURSAL",
      title: "El inventario tiene ubicación.",
      subtitle: "Seis sucursales, un recorrido visible para cada unidad.",
      scenes: [
        { marker: "EL PROBLEMA", title: "Seis tiendas, seis versiones del stock.", body: "Una hoja de cálculo no mostraba con claridad qué estaba disponible, enviado o pendiente de recepción." },
        { marker: "LA DECISIÓN", title: "El tránsito es un estado real.", body: "Enviar descuenta el origen. La mercancía no aparece en destino hasta que esa sucursal confirma su llegada." },
        { marker: "EL RESULTADO", title: "Una operación que cuadra.", body: "Ventas, transferencias e inventario se conectan en el mismo flujo, con movimientos que se pueden revisar." },
      ],
      enter: "Entrar al sistema",
    },
    en: {
      category: "02 / MULTI-BRANCH OPERATIONS",
      title: "Inventory has a location.",
      subtitle: "Six branches and a visible journey for every unit.",
      scenes: [
        { marker: "THE PROBLEM", title: "Six stores, six versions of stock.", body: "A spreadsheet could not clearly show what was available, shipped or waiting to be received." },
        { marker: "THE DECISION", title: "In transit is a real state.", body: "Dispatch deducts stock at the origin. Units do not appear at the destination until that branch confirms receipt." },
        { marker: "THE OUTCOME", title: "Operations that reconcile.", body: "Sales, transfers and inventory share one flow, with movements you can review." },
      ],
      enter: "Enter the system",
    },
  },
  "tattoo-raffle": {
    es: {
      category: "03 / RESERVAS Y PAGOS",
      title: "Un número. Un dueño.",
      subtitle: "Una experiencia de compra simple sobre una regla que no admite duplicados.",
      scenes: [
        { marker: "EL PROBLEMA", title: "La misma entrada no puede venderse dos veces.", body: "Doscientas participaciones estuvieron disponibles durante una campaña real. Cada selección necesitaba una reserva clara." },
        { marker: "LA DECISIÓN", title: "Reservar antes de confirmar.", body: "La entrada pasa de disponible a reservada y, después de la confirmación, a asignada. Cancelar devuelve el número al inventario." },
        { marker: "EL RESULTADO", title: "Un evento repetido no cambia el resultado.", body: "La confirmación se procesa una sola vez. Puedes repetirla en la demo y observar que las entradas asignadas no se duplican." },
      ],
      enter: "Elegir mis números",
    },
    en: {
      category: "03 / RESERVATIONS & PAYMENTS",
      title: "One number. One owner.",
      subtitle: "A simple purchase experience built on a rule that cannot allow duplicates.",
      scenes: [
        { marker: "THE PROBLEM", title: "One ticket cannot be sold twice.", body: "Two hundred entries were available during a real campaign. Every selection needed a clear reservation." },
        { marker: "THE DECISION", title: "Reserve before confirming.", body: "A ticket moves from available to reserved, then assigned after confirmation. Cancellation returns it to inventory." },
        { marker: "THE OUTCOME", title: "A repeated event changes nothing.", body: "Confirmation is processed once. Replay it in the demo and see that assigned tickets are not duplicated." },
      ],
      enter: "Choose my numbers",
    },
  },
};

function StoryVisual({ slug, active, language }: { slug: DemoSlug; active: number; language: Language }) {
  if (slug === "transactions") return (
    <div className="story-visual-inner story-visual-finance">
      <span className="story-visual-top">EVENT STREAM / 001—003</span>
      <div className="story-finance-inputs">
        <span>North Bank <b>NB-84219</b></span><span>Harbor Bank <b>HB-56308</b></span><span>North Bank <b>NB-84219</b></span>
      </div>
      <div className="story-finance-core"><small>{language === "es" ? "CLAVE DE CONTROL" : "CONTROL KEY"}</small><strong>BANK + CODE</strong><span>{active === 0 ? "03 INPUTS" : active === 1 ? "01 DUPLICATE BLOCKED" : "01 AUDITABLE LEDGER"}</span></div>
      <div className="story-finance-output"><span className={active >= 1 ? "lit" : ""}>409 / DUPLICATE</span><span className={active === 2 ? "lit" : ""}>TX-1042 → AGENT NORTH</span></div>
      <span className="story-visual-bottom">VALIDATE → RECORD → ASSIGN_</span>
    </div>
  );
  if (slug === "sgia") return (
    <div className="story-visual-inner story-visual-sgia">
      <span className="story-visual-top">DISTRIBUTION / 06 BRANCHES</span>
      <div className="story-branch-map"><div className="story-map-core">S.G.I.A.<small>ONE SOURCE OF TRUTH</small></div>{["CENTRO", "NORTE", "SUR", "ESTE", "OESTE", "TERMINAL"].map((branch, index) => <span key={branch} className={"story-branch story-branch-" + index + (active > 0 && index < 2 ? " lit" : "")}>{branch}</span>)}</div>
      <div className="story-sgia-status"><span>ORIGIN −02</span><b>{active === 0 ? "AVAILABLE" : active === 1 ? "IN TRANSIT →" : "RECEIVED ✓"}</b><span>DESTINATION +02</span></div>
      <span className="story-visual-bottom">SEND → RECEIVE → RECONCILE_</span>
    </div>
  );
  return (
    <div className="story-visual-inner story-visual-raffle">
      <span className="story-visual-top">CAMPAIGN / 200 ENTRIES</span>
      <div className="story-ticket-stack"><span>078</span><span>079</span><strong>080<small>{active === 0 ? "AVAILABLE" : active === 1 ? "RESERVED" : "ASSIGNED"}</small></strong><span>081</span><span>082</span></div>
      <div className="story-raffle-flow"><span className="lit">01 SELECT</span><i /><span className={active >= 1 ? "lit" : ""}>02 RESERVE</span><i /><span className={active === 2 ? "lit" : ""}>03 CONFIRM</span></div>
      <span className="story-visual-bottom">ONE TICKET / ONE OWNER_</span>
    </div>
  );
}

export function DemoStory({ slug, language }: { slug: DemoSlug; language: Language }) {
  const rootRef = useRef<HTMLElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const story = stories[slug][language];

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const scenes = gsap.utils.toArray<HTMLElement>(".demo-story-scene");
      scenes.forEach((scene, index) => {
        ScrollTrigger.create({
          trigger: scene,
          start: "top 68%",
          end: "bottom 32%",
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        });
        gsap.fromTo(scene, { autoAlpha: 0.55, y: 28 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: scene, start: "top 85%", end: "top 45%", scrub: 0.5 },
        });
      });
      gsap.fromTo(portalRef.current, { rotationX: 12, scale: 0.87, y: 55 }, {
        rotationX: 0, scale: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: portalRef.current, start: "top bottom", end: "top 35%", scrub: 0.6 },
      });
    });
    return () => media.revert();
  }, { scope: rootRef });

  return (
    <section ref={rootRef} id="story" className={"demo-story demo-story-" + slug} aria-label={language === "es" ? "Historia del proyecto" : "Project story"}>
      <div className="demo-story-heading">
        <p>{story.category} <span> / LEONARD SOLUTIONS</span></p>
        <h1>{story.title}</h1>
        <div className="demo-story-heading-bottom"><p>{story.subtitle}</p><a href="#sandbox">{language === "es" ? "Saltar introducción ↓" : "Skip introduction ↓"}</a></div>
      </div>
      <div className="demo-story-body">
        <div className="demo-story-sticky"><div className="demo-story-device" data-phase={active}><StoryVisual slug={slug} active={active} language={language} /></div><span className="demo-story-counter">0{active + 1} / 03</span></div>
        <div className="demo-story-scenes">{story.scenes.map((scene, index) => <article className="demo-story-scene" key={scene.marker}><span>0{index + 1} / {scene.marker}</span><h2>{scene.title}</h2><p>{scene.body}</p></article>)}</div>
      </div>
      <div ref={portalRef} className="demo-story-portal"><span>{language === "es" ? "TU TURNO / ENTORNO DE PRUEBA" : "YOUR TURN / TEST ENVIRONMENT"}</span><h2>{language === "es" ? "Ahora hazlo tú." : "Now try it yourself."}</h2><p>{language === "es" ? "Datos ficticios, acciones reales dentro de esta sesión. Sin pagos, correos ni conexión a sistemas de clientes." : "Fictional data, working interactions in this session. No payments, email or connection to client systems."}</p><a href="#sandbox">{story.enter} <b>↘</b></a></div>
    </section>
  );
}
