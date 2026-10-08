import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./career-about.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Language = "es" | "en";
interface Milestone { year: string; label: string; title: string; detail: string; tag: string; }

const milestones: Record<Language, Milestone[]> = {
  es: [
    { year: "2021", label: "El comienzo", title: "El punto de partida.", detail: "Comencé la carrera de Ingeniería Informática en Camagüey. Ahí empezó mi camino para entender cómo resolver problemas con software.", tag: "INGENIERÍA INFORMÁTICA · CAMAGÜEY" },
    { year: "2023", label: "Exploración web", title: "Aprender construyendo.", detail: "Empecé a estudiar tecnologías de desarrollo web y a practicar con proyectos propios. Cada proyecto me ayudó a convertir conceptos nuevos en algo que funcionaba.", tag: "DESARROLLO WEB · PROYECTOS PROPIOS" },
    { year: "2024", label: "Primera app en producción", title: "Del proyecto al producto.", detail: "Desarrollé mi tesis con Next.js. Fue mi primera aplicación full stack puesta en producción y el momento en que tuve que pensar en el sistema completo.", tag: "TESIS · NEXT.JS · FULL STACK" },
    { year: "2025", label: "Graduación y clientes", title: "Software para otros.", detail: "Me gradué y, más tarde, llegó mi primer trabajo remunerado como freelancer. Empecé a aplicar lo aprendido a necesidades reales de un cliente.", tag: "GRADUACIÓN · PRIMER TRABAJO FREELANCE" },
    { year: "HOY", label: "En evolución", title: "Seguir ampliando el mapa.", detail: "Sigo aprendiendo y trabajando como freelancer. Cada nuevo encargo me enfrenta a problemas distintos y amplía mis conocimientos técnicos.", tag: "APRENDIZAJE CONTINUO · FREELANCE" },
  ],
  en: [
    { year: "2021", label: "The beginning", title: "Where it started.", detail: "I began studying Computer Engineering in Camagüey. That was the start of my journey toward solving problems through software.", tag: "COMPUTER ENGINEERING · CAMAGÜEY" },
    { year: "2023", label: "Exploring the web", title: "Learning by building.", detail: "I started learning web development technologies and practicing through my own projects. Each one turned new concepts into something that worked.", tag: "WEB DEVELOPMENT · PERSONAL PROJECTS" },
    { year: "2024", label: "First production app", title: "From project to product.", detail: "I built my thesis with Next.js. It became my first full stack application in production and pushed me to think about the entire system.", tag: "THESIS · NEXT.JS · FULL STACK" },
    { year: "2025", label: "Graduation and clients", title: "Building for others.", detail: "I graduated and later landed my first paid freelance job. I began applying what I had learned to a client's real needs.", tag: "GRADUATION · FIRST PAID FREELANCE JOB" },
    { year: "NOW", label: "Still evolving", title: "Keep expanding the map.", detail: "I continue learning and working as a freelancer. Each new assignment brings different problems and broadens my technical knowledge.", tag: "CONTINUOUS LEARNING · FREELANCE" },
  ],
};

function CareerTimeline({ language }: { language: Language }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const events = milestones[language];

  useGSAP(() => {
    if (!stageRef.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * (window.innerWidth <= 700 ? 3.3 : 3.2)),
          pin: true,
          scrub: window.innerWidth <= 700 ? 0.22 : 0.38,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(milestones.es.length - 1, Math.floor(self.progress * milestones.es.length));
            setActive((previous) => previous === next ? previous : next);
          },
        },
      });
      timeline
        .to(lineRef.current, { scaleY: 1, duration: 5 }, 0)
        .to(progressRef.current, { scaleX: 1, duration: 5 }, 0)
        .fromTo(glowRef.current, { yPercent: -16, xPercent: -8, scale: 0.82 }, { yPercent: 16, xPercent: 8, scale: 1.18, duration: 5 }, 0);
      triggerRef.current = timeline.scrollTrigger ?? null;
      return () => { triggerRef.current = null; };
    });
    return () => media.revert();
  }, { scope: rootRef });

  const select = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const fraction = (index + 0.5) / milestones.es.length;
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * fraction, behavior: "smooth" });
  };

  return (
    <div ref={rootRef} className="career-timeline">
      <div ref={stageRef} className="career-timeline-stage">
        <div className="career-timeline-grid" aria-hidden="true" />
        <div ref={glowRef} className="career-timeline-glow" aria-hidden="true" />
        <div className="shell career-timeline-layout">
          <div className="career-timeline-story" aria-live="polite" aria-atomic="true">
            <span className="career-timeline-overline">{language === "es" ? "MI RECORRIDO" : "MY JOURNEY"} / {String(active + 1).padStart(2, "0")}</span>
            <span key={"year-" + language + "-" + active} className="career-timeline-year">{events[active].year}</span>
            <div key={"copy-" + language + "-" + active} className="career-timeline-copy">
              <h3>{events[active].title}</h3>
              <p>{events[active].detail}</p>
              <span className="career-timeline-tag">{events[active].tag}</span>
            </div>
          </div>
          <div className="career-timeline-map">
            <span className="career-timeline-map-label">{language === "es" ? "CRONOLOGÍA / 05 HITOS" : "TIMELINE / 05 MILESTONES"}</span>
            <nav className="career-timeline-events" aria-label={language === "es" ? "Etapas de mi carrera" : "Career milestones"}>
              <span className="career-timeline-rail" aria-hidden="true"><span ref={lineRef} /></span>
              {events.map((event, index) => (
                <button
                  key={event.year}
                  type="button"
                  className={index === active ? "is-active" : index < active ? "is-past" : ""}
                  onClick={() => select(index)}
                  aria-current={index === active ? "step" : undefined}
                  aria-label={event.year + ": " + event.label}
                >
                  <span className="career-timeline-dot" aria-hidden="true" />
                  <span className="career-timeline-event-year">{event.year}</span>
                  <span className="career-timeline-event-label">{event.label}</span>
                  <span className="career-timeline-event-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </nav>
            <span className="career-timeline-map-footer">{language === "es" ? "DE CAMAGÜEY A LO QUE SIGUE_" : "FROM CAMAGÜEY TO WHAT'S NEXT_"}</span>
          </div>
          <div className="career-timeline-progress" aria-hidden="true">
            <span>{language === "es" ? "DESLIZA PARA CONTINUAR" : "SCROLL TO CONTINUE"}</span>
            <span className="career-timeline-progress-track"><span ref={progressRef} /></span>
            <span>{String(active + 1).padStart(2, "0")} / 05</span>
          </div>
        </div>
      </div>
      <div className="career-timeline-static shell">
        {events.map((event) => (
          <article key={event.year}>
            <span>{event.year} / {event.label}</span>
            <h3>{event.title}</h3>
            <p>{event.detail}</p>
            <strong>{event.tag}</strong>
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
          <h2 id="about-title"><span data-copy="es">Cómo llegué hasta aquí.</span><span data-copy="en">How I got here.</span></h2>
          <p><span data-copy="es">De estudiar Ingeniería Informática en Camagüey a crear aplicaciones reales. Esta es la trayectoria detrás de mi trabajo.</span><span data-copy="en">From studying Computer Engineering in Camagüey to building real applications. This is the path behind my work.</span></p>
        </div>
      </div>
      <CareerTimeline language={language} />
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
