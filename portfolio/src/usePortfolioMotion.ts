import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function usePortfolioMotion(scope: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const motion = gsap.matchMedia();

      motion.add(
        {
          allowMotion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 901px)",
          compact: "(max-width: 900px)",
        },
        (context) => {
          if (!context.conditions?.allowMotion) return;

          const desktop = Boolean(context.conditions.desktop);
          const travel = desktop ? 46 : 26;
          const revealStart = desktop ? "top 82%" : "top 90%";

          if (window.scrollY < 80) {
            gsap
              .timeline({ defaults: { ease: "power3.out" } })
              .from(".site-header", {
                yPercent: -100,
                autoAlpha: 0,
                duration: 0.75,
              })
              .from(
                ".hero .eyebrow",
                { y: 22, autoAlpha: 0, duration: 0.55 },
                "-=0.18",
              )
              .from(
                ".hero h1",
                { y: 62, autoAlpha: 0, duration: 1.05 },
                "-=0.22",
              )
              .from(
                ".hero-intro",
                { y: 26, autoAlpha: 0, duration: 0.75 },
                "-=0.56",
              )
              .from(
                ".hero-links > *",
                { y: 22, autoAlpha: 0, duration: 0.65, stagger: 0.11 },
                "-=0.48",
              )
              .from(
                ".hero-proof",
                {
                  x: desktop ? 90 : 24,
                  y: 35,
                  rotation: desktop ? 7 : 0,
                  scale: 0.92,
                  autoAlpha: 0,
                  duration: 1.1,
                  ease: "expo.out",
                },
                "-=0.95",
              )
              .from(
                ".proof-topline, .proof-label, .proof-number, .proof-description, .proof-rule, .proof-footer",
                { y: 15, autoAlpha: 0, duration: 0.55, stagger: 0.075 },
                "-=0.7",
              )
              .from(
                ".hero-bottom",
                { y: 16, autoAlpha: 0, duration: 0.55 },
                "-=0.7",
              )
              .from(
                ".scroll-line",
                { scaleX: 0, transformOrigin: "left center", duration: 0.8 },
                "-=0.55",
              );
          }

          gsap.to(".hero-atmosphere", {
            yPercent: 38,
            xPercent: desktop ? 12 : 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          if (desktop) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: ".hero",
                  start: "top top",
                  end: "bottom top",
                  scrub: 1.2,
                },
                defaults: { ease: "none" },
              })
              .to(".hero-copy", { yPercent: -18, rotationX: 7, scale: 0.94 }, 0)
              .to(".hero-proof", { yPercent: 20, rotationY: -14, rotationX: 7, scale: 0.86 }, 0)
              .to(".hero-depth-ring-one", { rotation: 35, scale: 1.7, autoAlpha: 0.12 }, 0)
              .to(".hero-depth-ring-two", { rotation: -48, scale: 1.5 }, 0)
              .to(".hero-depth-ring-three", { rotation: 72, scale: 1.3 }, 0);

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: ".interlude-stage",
                  start: "top top",
                  end: "+=75%",
                  scrub: 1,
                  pin: true,
                  anticipatePin: 1,
                },
                defaults: { ease: "none" },
              })
              .fromTo(
                ".interlude-orbit",
                { scale: 0.45, rotation: -30, opacity: 0.18 },
                { scale: 1.3, rotation: 35, opacity: 0.85, duration: 1 },
                0,
              )
              .fromTo(
                ".interlude-content p",
                { scale: 0.64, rotationX: 38, yPercent: 36, opacity: 0.2 },
                { scale: 1, rotationX: 0, yPercent: 0, opacity: 1, duration: 0.72 },
                0,
              )
              .to(".interlude-content p", { scale: 1.18, yPercent: -12, opacity: 0.38, duration: 0.28 }, 0.72)
              .fromTo(
                ".interlude-bottom",
                { y: 35, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.45 },
                0.4,
              );

            gsap.to(".work-rail-fill", {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".project-finance",
                start: "top center",
                endTrigger: ".project-raffle",
                end: "bottom center",
                scrub: true,
              },
            });
          } else {
            gsap.from(".interlude-content > *", {
              y: 30,
              autoAlpha: 0,
              stagger: 0.1,
              duration: 0.8,
              scrollTrigger: { trigger: ".interlude", start: "top 85%", once: true },
            });
            gsap.to(".hero-depth-ring", {
              yPercent: 25,
              rotation: 25,
              stagger: 0.08,
              ease: "none",
              scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
            });
          }

          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".section-heading",
                start: revealStart,
                once: true,
              },
              defaults: { ease: "power3.out" },
            })
            .from(".section-heading .section-kicker", {
              y: 18,
              autoAlpha: 0,
              duration: 0.6,
            })
            .from(
              ".section-heading h2",
              { y: travel, autoAlpha: 0, duration: 0.9 },
              "-=0.3",
            )
            .from(
              ".section-aside",
              { y: 22, autoAlpha: 0, duration: 0.7 },
              "-=0.55",
            );

          scope.current
            ?.querySelectorAll<HTMLElement>(".project")
            .forEach((project, index) => {
              const visual =
                project.querySelector<HTMLElement>(".project-visual");
              const content =
                project.querySelector<HTMLElement>(".project-content");
              if (!visual || !content) return;

              const details = visual.querySelectorAll(
                ".finance-flow > div, .finance-flow > b, .erp-core, .erp-branches span, .erp-caption, .ticket-grid span, .raffle-count",
              );

              if (desktop) {
                const current = scope.current?.querySelector<HTMLElement>(".work-rail-current");
                const setChapter = () => {
                  if (current) current.textContent = String(index + 1).padStart(2, "0");
                };
                ScrollTrigger.create({
                  trigger: project,
                  start: "top center",
                  end: "bottom center",
                  onEnter: setChapter,
                  onEnterBack: setChapter,
                });

                gsap.timeline({
                  scrollTrigger: {
                    trigger: project,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                  },
                  defaults: { ease: "none" },
                })
                  .fromTo(
                    visual,
                    { x: -72, y: 75, rotationY: -24, rotationX: 11, scale: 0.8, autoAlpha: 0.35 },
                    { x: 0, y: 0, rotationY: 0, rotationX: 0, scale: 1, autoAlpha: 1, duration: 0.35 },
                    0,
                  )
                  .fromTo(
                    details,
                    { z: -80, y: 32, autoAlpha: 0 },
                    { z: 0, y: 0, autoAlpha: 1, duration: 0.25, stagger: 0.025 },
                    0.12,
                  )
                  .fromTo(
                    content.children,
                    { x: 48, y: 30, autoAlpha: 0 },
                    { x: 0, y: 0, autoAlpha: 1, duration: 0.24, stagger: 0.025 },
                    0.16,
                  )
                  .to(
                    visual,
                    { x: -32, y: -20, rotationY: 12, rotationX: -7, scale: 0.9, autoAlpha: 0.65, duration: 0.27 },
                    0.76,
                  );
                return;
              }

              const scene = gsap.timeline({
                scrollTrigger: {
                  trigger: project,
                  start: revealStart,
                  once: true,
                },
                defaults: { ease: "power3.out" },
              });

              scene
                .fromTo(
                  visual,
                  { clipPath: "inset(0 100% 0 0)", x: desktop ? -24 : 0 },
                  {
                    clipPath: "inset(0 0% 0 0)",
                    x: 0,
                    duration: 1.15,
                    ease: "expo.inOut",
                  },
                )
                .from(
                  details,
                  {
                    y: desktop ? 30 : 18,
                    autoAlpha: 0,
                    scale: 0.94,
                    duration: 0.65,
                    stagger: 0.055,
                  },
                  "-=0.62",
                )
                .from(
                  content.children,
                  { y: travel, autoAlpha: 0, duration: 0.75, stagger: 0.095 },
                  "-=0.92",
                );

              gsap.to(visual, {
                y: -10,
                ease: "none",
                scrollTrigger: {
                  trigger: project,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.1,
                },
              });
            });

          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".about-section",
                start: revealStart,
                once: true,
              },
              defaults: { ease: "power3.out" },
            })
            .from(".about-section .section-kicker", {
              y: 18,
              autoAlpha: 0,
              duration: 0.55,
            })
            .from(
              ".about-grid h2",
              { y: travel, autoAlpha: 0, duration: 0.9 },
              "-=0.25",
            )
            .from(
              ".about-copy > *",
              { y: 26, autoAlpha: 0, duration: 0.7, stagger: 0.12 },
              "-=0.55",
            )
            .from(
              ".capabilities span",
              { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.065 },
              "-=0.28",
            );

          if (desktop) {
            gsap.timeline({
              scrollTrigger: { trigger: ".about-section", start: "top bottom", end: "bottom top", scrub: 1 },
              defaults: { ease: "none" },
            })
              .fromTo(".about-depth > span", { xPercent: -10, rotationY: -12 }, { xPercent: 14, rotationY: 9 }, 0)
              .fromTo(".about-depth i", { scale: 0.55, rotation: -30 }, { scale: 1.5, rotation: 36, stagger: 0.08 }, 0)
              .fromTo(".about-grid > div:first-child", { y: 75 }, { y: -55 }, 0)
              .fromTo(".about-copy", { y: -45 }, { y: 75 }, 0)
              .fromTo(".capabilities span", { rotationX: -22, y: 25 }, { rotationX: 11, y: -20, stagger: 0.015 }, 0);

            gsap.fromTo(".contact-curtain", { scaleY: 1 }, {
              scaleY: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".contact-section",
                start: "top 85%",
                end: "top 19%",
                scrub: 0.8,
              },
            });
          }

          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".contact-section",
                start: revealStart,
                once: true,
              },
              defaults: { ease: "power3.out" },
            })
            .from(".contact-section .section-kicker", {
              y: 18,
              autoAlpha: 0,
              duration: 0.55,
            })
            .from(
              ".contact-grid h2",
              { y: travel, autoAlpha: 0, duration: 0.95 },
              "-=0.22",
            )
            .from(
              ".contact-grid p, .contact-email",
              { y: 26, autoAlpha: 0, duration: 0.72, stagger: 0.14 },
              "-=0.55",
            )
            .from(
              ".contact-glow",
              { scale: 0.62, autoAlpha: 0, duration: 1.25, ease: "power2.out" },
              "-=1.1",
            );

          gsap.from(".footer-inner > *", {
            y: 15,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".site-footer",
              start: "top 95%",
              once: true,
            },
          });
        },
      );
      return () => motion.revert();
    },
    { scope },
  );
}
