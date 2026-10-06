import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./career-about.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Language = "es" | "en";
interface Lesson { title: string; detail: string; practice: string; }

const lessons: Record<Language, Lesson[]> = {
  es: [
    {
      title: "Definir antes de implementar.",
      detail: "La Ingeniería Informática me enseñó a descomponer problemas: identificar entidades, reglas y casos límite antes de elegir un framework.",
      practice: "MODELADO · ALGORITMOS · REQUISITOS",
    },
    {
      title: "Conectar todas las capas.",
      detail: "Una interfaz útil necesita estado coherente, contratos de API y persistencia clara. Aprendí a diseñar flujos completos con TypeScript, React y PostgreSQL.",
      practice: "REACT · TYPESCRIPT · POSTGRESQL",
    },
    {
      title: "Proteger las invariantes.",
      detail: "Cuando hay datos reales, una operación duplicada o un permiso incorrecto rompe el flujo. Ahora diseño validación, transacciones e idempotencia en los puntos críticos.",
      practice: "VALIDACIÓN · TRANSACCIONES · AUTORIZACIÓN",
    },
    {
      title: "Operar después del deploy.",
      detail: "Poner una aplicación en producción me enseñó a seguir los fallos, ajustar automatizaciones y mantener el sistema mientras cambian las necesidades del negocio.",
      practice: "DESPLIEGUE · AUTOMATIZACIÓN · MANTENIMIENTO",
    },
  ],
  en: [
    {
      title: "Define before implementing.",
      detail: "Computer Engineering taught me to break problems down: identify entities, rules and edge cases before choosing a framework.",
      practice: "MODELING · ALGORITHMS · REQUIREMENTS",
    },
    {
      title: "Connect every layer.",
      detail: "A useful interface needs coherent state, API contracts and clear persistence. I learned to design complete flows with TypeScript, React and PostgreSQL.",
      practice: "REACT · TYPESCRIPT · POSTGRESQL",
    },
    {
      title: "Protect invariants.",
      detail: "With real data, a duplicate operation or incorrect permission breaks the flow. I now design validation, transactions and idempotency into critical paths.",
      practice: "VALIDATION · TRANSACTIONS · AUTHORIZATION",
    },
    {
      title: "Operate after deployment.",
      detail: "Shipping an application to production taught me to trace failures, refine automation and maintain the system as business needs change.",
      practice: "DEPLOYMENT · AUTOMATION · MAINTENANCE",
    },
  ],
};

const systemLayers = [
  { number: "01", name: "MODEL", code: "requirements → constraints" },
  { number: "02", name: "INTERFACE", code: "state → API contract" },
  { number: "03", name: "DATA", code: "schema → invariant" },
  { number: "04", name: "OPERATIONS", code: "deploy → observe" },
];

function LearningSequence({ language }: { language: Language }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const stage = stageRef.current;
    const nodes = nodeRefs.current.filter((node): node is HTMLDivElement => Boolean(node));
    const marks = rootRef.current?.querySelectorAll<HTMLElement>(".learning-node-mark");
    if (!stage || nodes.length !== systemLayers.length) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const offsets = [
        { x: -105, y: -45, rotation: -13 },
        { x: 95, y: -20, rotation: 9 },
        { x: -75, y: 26, rotation: -8 },
        { x: 115, y: 52, rotation: 12 },
      ];
      nodes.forEach((node, index) => {
        gsap.set(node, { ...offsets[index], scale: 0.84, opacity: 0.68 });
      });
      gsap.set(spineRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(statusRef.current, { autoAlpha: 0, y: 20 });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(marks ?? [], { autoAlpha: 0, scale: 0.4 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * (window.innerWidth <= 700 ? 3.1 : 3.6))}`,
          pin: true,
          scrub: window.innerWidth <= 700 ? 0.45 : 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(lessons.es.length - 1, Math.floor(self.progress * lessons.es.length));
            setActive((previous) => previous === next ? previous : next);
          },
        },
      });
      timeline
        .to(haloRef.current, { rotation: 54, scale: 1.16, duration: 4 }, 0)
        .to(progressRef.current, { scaleX: 1, duration: 4 }, 0)
        .to(nodes, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.3, stagger: 0.09 }, 0.35)
        .to(spineRef.current, { scaleY: 1, duration: 0.7 }, 1.55)
        .to(marks ?? [], { autoAlpha: 1, scale: 1, duration: 0.55, stagger: 0.08 }, 2.15)
        .to(rigRef.current, { rotationY: -11, rotationX: 7, scale: 1.04, duration: 0.9 }, 2.9)
        .to(statusRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, 3.24);

      triggerRef.current = timeline.scrollTrigger ?? null;
      return () => { triggerRef.current = null; };
    });
    return () => media.revert();
  }, { scope: rootRef });

  const select = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const fraction = (index + 0.5) / lessons.es.length;
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * fraction, behavior: "smooth" });
  };

  const current = lessons[language][active];

  return (
    <div ref={rootRef} className="learning-sequence">
      <div ref={stageRef} className="learning-stage">
        <div className="learning-stage-grid" aria-hidden="true" />
        <div className="shell learning-layout">
          <div className="learning-story" aria-live="polite" aria-atomic="true">
            <span className="learning-overline">
              {language === "es" ? "APRENDIZAJE" : "LESSON"} / {String(active + 1).padStart(2, "0")}
            </span>
            <div key={`${language}-${active}`} className="learning-story-copy">
              <h3>{current.title}</h3>
              <p>{current.detail}</p>
              <span className="learning-practice">{current.practice}</span>
            </div>
          </div>
          <div className="learning-visual" aria-hidden="true">
            <div ref={haloRef} className="learning-halo" />
            <span className="learning-coordinate learning-coordinate-top">ARCHITECTURE / 04 LAYERS</span>
            <div className="learning-rig-wrap">
              <div ref={rigRef} className="learning-rig">
                <div ref={spineRef} className="learning-spine" />
                {systemLayers.map((layer, index) => (
                  <div key={layer.number} ref={(node) => { nodeRefs.current[index] = node; }} className="learning-node">
                    <span className="learning-node-number">{layer.number}</span>
                    <div className="learning-node-copy"><strong>{layer.name}</strong><small>{layer.code}</small></div>
                    <span className="learning-node-mark">↗</span>
                  </div>
                ))}
                <div ref={statusRef} className="learning-status"><span className="learning-status-light" /> SYSTEM / OPERATIONAL</div>
              </div>
            </div>
            <span className="learning-coordinate learning-coordinate-bottom">DESIGN / BUILD / OPERATE_</span>
          </div>
          <div className="learning-controls">
            <nav className="learning-index" aria-label={language === "es" ? "Aprendizajes" : "Lessons"}>
              {lessons[language].map((lesson, index) => (
                <button key={index} type="button" onClick={() => select(index)} aria-current={active === index ? "step" : undefined} aria-label={`${String(index + 1).padStart(2, "0")}: ${lesson.title}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span><span className="learning-index-title">{lesson.title}</span>
                </button>
              ))}
            </nav>
            <div className="learning-progress" aria-hidden="true">
              <span>{language === "es" ? "DESLIZA PARA CONTINUAR" : "SCROLL TO CONTINUE"}</span>
              <span className="learning-progress-track"><span ref={progressRef} /></span>
              <span>{String(active + 1).padStart(2, "0")} / 04</span>
            </div>
          </div>
        </div>
      </div>
      <div className="learning-static shell">
        {lessons[language].map((lesson, index) => (
          <article key={index}>
            <span>{String(index + 1).padStart(2, "0")} / 04</span>
            <h3>{lesson.title}</h3><p>{lesson.detail}</p><strong>{lesson.practice}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CareerAbout({ language }: { language: Language }) {
  return (
    <section className="career-about" id="about" aria-labelledby="about-title">
      <div className="career-about-heading shell">
        <p className="career-about-kicker">02 / ABOUT ME</p>
        <div className="career-about-heading-grid">
          <h2 id="about-title"><span data-copy="es">Del código al criterio.</span><span data-copy="en">From code to judgment.</span></h2>
          <p><span data-copy="es">Cuatro aprendizajes que cambiaron cómo modelo problemas, conecto capas, protejo datos y opero software real.</span><span data-copy="en">Four lessons that changed how I model problems, connect layers, protect data and operate real software.</span></p>
        </div>
      </div>
      <LearningSequence language={language} />
      <div className="career-about-outro">
        <div className="shell career-about-outro-inner">
          <a href="https://github.com/Ernesto248" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/ernesto-leonard-escariz-747685252/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href="#work"><span data-copy="es">Ver proyectos ↓</span><span data-copy="en">See projects ↓</span></a>
        </div>
      </div>
    </section>
  );
}
