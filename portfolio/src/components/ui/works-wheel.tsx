import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import "./works-wheel.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type WorksWheelArt = "portrait" | "studio" | "operations" | "finance" | "launch";

export interface WorksWheelItem {
  title: string;
  chapter: string;
  description: string;
  proof: string;
  art: WorksWheelArt;
}

interface WorksWheelProps {
  items: WorksWheelItem[];
  label: string;
  intro: string;
  hint: string;
  className?: string;
}

const STEP = 40;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const rad = (degrees: number) => (degrees * Math.PI) / 180;

function Artwork({ art }: { art: WorksWheelArt }) {
  if (art === "portrait") {
    return <img className="works-wheel-image works-wheel-portrait" src="/me.png" alt="" draggable={false} />;
  }
  if (art === "studio") {
    return (
      <div className="works-wheel-art works-wheel-art-studio">
        <span className="works-wheel-art-label">STIGMATA / STUDIO</span>
        <div className="works-wheel-studio-frame" aria-hidden="true">
          <span>PORTFOLIO / CONTACT</span>
          <b>STIGMATA</b>
          <i>VISUAL STORIES, BUILT TO LAST.</i>
        </div>
      </div>
    );
  }
  if (art === "operations") {
    return (
      <div className="works-wheel-art works-wheel-art-operations">
        <span className="works-wheel-art-label">S.G.I.A. / OPERATIONS</span>
        <div className="works-wheel-ops-grid">
          <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span>
        </div>
        <strong>6 <small>BRANCHES</small></strong>
      </div>
    );
  }
  if (art === "finance") {
    return (
      <div className="works-wheel-art works-wheel-art-finance">
        <span className="works-wheel-art-label">TRANSACTIONS / LEDGER</span>
        <div className="works-wheel-ledger">
          <span>TXN-2841 <b>+ 240.00</b></span>
          <span>TXN-2842 <b>− 48.90</b></span>
          <span>TXN-2843 <b>+ 96.50</b></span>
        </div>
        <strong>2.806 <small>REGISTROS</small></strong>
      </div>
    );
  }
  return (
    <div className="works-wheel-art works-wheel-art-launch">
      <span className="works-wheel-art-label">TATTOO RAFFLE / LIVE</span>
      <div className="works-wheel-ticket"><span>CAMPAIGN</span><strong>200</strong><span>ENTRIES</span></div>
      <span className="works-wheel-launch-dot" aria-hidden="true" />
    </div>
  );
}

/** The ring-to-drum geometry is adapted from the supplied 21st.dev Works Wheel. */
export function WorksWheel({ items, label, intro, hint, className }: WorksWheelProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const ringLabelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(-1);
  const count = items.length;

  useGSAP(() => {
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene || !count) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let cardW = 0;
      let cardH = 0;
      let ringR = 0;
      let drumR = 0;
      let bow = 0;
      let ringScale = 1;
      let compact = false;
      const cursor = { value: 0 };

      const draw = (turn: number) => {
        if (!cardW) return;
        const morph = clamp(turn, 0, 1);
        const position = Math.max(0, turn - 1);
        if (wheelRef.current) wheelRef.current.style.transform = `translateZ(${-morph * drumR}px)`;
        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          const distance = index - position;
          const drumAngle = distance * STEP;
          const bend = -bow * (1 - Math.cos(rad(drumAngle)));
          card.style.transform =
            `translateX(${morph * bend}px)` +
            ` rotateZ(${(1 - morph) * distance * (360 / count)}deg)` +
            ` translateY(${-(1 - morph) * ringR}px)` +
            ` rotateX(${morph * drumAngle}deg)` +
            ` translateZ(${morph * drumR}px)`;
          card.style.opacity = morph > 0.5 && Math.abs(distance) > 1.65
            ? "0"
            : compact && morph > 0.6
              ? String(clamp(1 - Math.abs(distance) * 0.62, 0.15, 1))
              : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(distance) * 2));
          const face = card.firstElementChild as HTMLElement | null;
          if (face) face.style.transform = `scale(${ringScale + (1 - ringScale) * morph})`;
        });
        if (ringLabelRef.current) ringLabelRef.current.style.opacity = String(1 - morph);
        const next = turn < 0.58 ? -1 : clamp(Math.round(position), 0, count - 1);
        setActive((previous) => previous === next ? previous : next);
      };

      const measure = () => {
        const width = scene.clientWidth;
        const height = scene.clientHeight;
        compact = window.innerWidth <= 700;
        cardW = compact
          ? Math.min(width * 0.68, height * 0.45 * 1.45)
          : Math.min(width * 0.37, height * 0.39 * 1.45);
        cardH = cardW / 1.45;
        ringR = cardH * (compact ? 0.68 : 1.18);
        drumR = cardH * (compact ? 1.6 : 2.22);
        bow = cardH * (compact ? 1.3 : 1.82);
        ringScale = clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.2, 1);
        scene.style.setProperty("--wheel-card-w", `${cardW}px`);
        scene.style.setProperty("--wheel-card-h", `${cardH}px`);
        scene.style.perspective = `${cardH * 2.7}px`;
        draw(cursor.value);
      };

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(scene);
      const tween = gsap.to(cursor, {
        value: count,
        ease: "none",
        onUpdate: () => draw(cursor.value),
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * count * (window.innerWidth <= 700 ? 0.72 : 0.85))}`,
          scrub: window.innerWidth <= 700 ? 0.5 : 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      triggerRef.current = tween.scrollTrigger ?? null;

      return () => {
        observer.disconnect();
        triggerRef.current = null;
        cardRefs.current.forEach((card) => card?.removeAttribute("style"));
        scene.removeAttribute("style");
        wheelRef.current?.removeAttribute("style");
        ringLabelRef.current?.removeAttribute("style");
      };
    });
    return () => media.revert();
  }, { scope: rootRef, dependencies: [count], revertOnUpdate: true });

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [items]);

  const select = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const fraction = (index + 1) / count;
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * fraction, behavior: "smooth" });
  };

  const current = active < 0 ? null : items[active];

  return (
    <section ref={rootRef} className={cn("works-wheel-section", className)} aria-label={label}>
      <div ref={stageRef} className="works-wheel-stage">
        <div className="works-wheel-grid" aria-hidden="true" />
        <div className="works-wheel-glow" aria-hidden="true" />
        <div className="works-wheel-inner shell">
          <div className="works-wheel-story" aria-live="polite" aria-atomic="true">
            <span className="works-wheel-overline">{current?.chapter ?? label}</span>
            <div key={active} className="works-wheel-story-copy">
              <h3>{current?.title ?? intro}</h3>
              <p>{current?.description ?? hint}</p>
              {current && <span className="works-wheel-proof">{current.proof}</span>}
            </div>
          </div>
          <div ref={sceneRef} className="works-wheel-scene" aria-hidden="true">
            <div ref={wheelRef} className="works-wheel-rotor">
              {items.map((item, index) => (
                <div
                  key={item.art}
                  ref={(node) => { cardRefs.current[index] = node; }}
                  className="works-wheel-card"
                >
                  <div className="works-wheel-face">
                    <Artwork art={item.art} />
                    <div className="works-wheel-card-caption">
                      <span>{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
                      <strong>{item.title}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div ref={ringLabelRef} className="works-wheel-ring-label">{label}</div>
          </div>
          <nav className="works-wheel-index" aria-label={label}>
            {items.map((item, index) => (
              <button
                key={item.art}
                type="button"
                onClick={() => select(index)}
                aria-current={active === index ? "step" : undefined}
                aria-label={`${String(index + 1).padStart(2, "0")}: ${item.title}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="works-wheel-index-title">{item.title}</span>
              </button>
            ))}
          </nav>
          <div className="works-wheel-scroll-note" aria-hidden="true">
            <span>{hint}</span><span className="works-wheel-scroll-track"><span style={{ width: `${((active + 1) / count) * 100}%` }} /></span>
            <span>{String(Math.max(0, active + 1)).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
      <div className="works-wheel-static shell">
        {items.map((item, index) => (
          <article key={item.art} className="works-wheel-static-item">
            <div className="works-wheel-static-art"><Artwork art={item.art} /></div>
            <div><span>{String(index + 1).padStart(2, "0")} / {item.chapter}</span><h3>{item.title}</h3><p>{item.description}</p><strong>{item.proof}</strong></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WorksWheel;
