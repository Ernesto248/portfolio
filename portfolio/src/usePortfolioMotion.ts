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
                ".hero-visual",
                { scale: 0.8, rotationY: -18, autoAlpha: 0, duration: 1.45, ease: "expo.out" },
                "-=0.85",
              )
              .from(
                ".hero-links > *",
                { y: 22, autoAlpha: 0, duration: 0.65, stagger: 0.11 },
                "-=0.48",
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

          const ambient = [gsap.to(".hero-orbit-one", {
            rotation: "+=360",
            duration: 34,
            ease: "none",
            repeat: -1,
            paused: true,
          }), gsap.to(".hero-orbit-two", {
            rotation: "-=360",
            duration: 27,
            ease: "none",
            repeat: -1,
            paused: true,
          }), gsap.to(".hero-halo-outer", {
            scale: 1.18,
            opacity: 0.58,
            duration: 4.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            paused: true,
          }), gsap.to(".hero-core", {
            y: -10,
            duration: 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            paused: true,
          })];
          ScrollTrigger.create({
            trigger: ".hero",
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => ambient.forEach((tween) => self.isActive ? tween.play() : tween.pause()),
          });

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
              .to(".hero-visual", { yPercent: 13, rotationY: -11, scale: 1.13 }, 0)
              .to(".hero-grid-plane", { yPercent: -13, autoAlpha: 0.13 }, 0);

          } else {
            gsap.to(".hero-visual", {
              yPercent: 12,
              scale: 1.1,
              ease: "none",
              scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
            });
          }

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

              if (desktop) {
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

              gsap.fromTo(visual,
                { y: 46, rotationX: 12, rotationY: -7, scale: 0.91, autoAlpha: 0.72 },
                {
                  y: -20,
                  rotationX: -4,
                  rotationY: 4,
                  scale: 1.02,
                  autoAlpha: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: project,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.65,
                  },
                },
              );
              gsap.from(details, {
                y: 22,
                autoAlpha: 0,
                scale: 0.92,
                duration: 0.7,
                stagger: 0.055,
                ease: "power3.out",
                scrollTrigger: { trigger: project, start: revealStart, once: true },
              });
              gsap.from(content.children, {
                y: travel,
                autoAlpha: 0,
                duration: 0.65,
                stagger: 0.075,
                ease: "power3.out",
                scrollTrigger: { trigger: content, start: "top 90%", once: true },
              });
            });

          gsap.timeline({
            scrollTrigger: {
              trigger: ".contact-prelude",
              start: "top top",
              end: "bottom bottom",
              scrub: desktop ? 0.8 : 0.5,
            },
            defaults: { ease: "none" },
          })
            .fromTo(
              ".contact-prelude-title",
              { yPercent: 18, scale: 0.88, autoAlpha: 0.72 },
              { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.22 },
            )
            .fromTo(
              ".contact-prelude-rule",
              { scaleX: 0 },
              { scaleX: 1, duration: 0.22 },
              0,
            )
            .to({}, { duration: 0.56 })
            .to(".contact-prelude-title", {
              yPercent: -8,
              scale: 1.05,
              autoAlpha: 0.8,
              duration: 0.22,
            });

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
              ".contact-copy p, .contact-email",
              { y: 26, autoAlpha: 0, duration: 0.72, stagger: 0.14 },
              "-=0.55",
            )
            .from(
              ".contact-form",
              { y: 36, autoAlpha: 0, duration: 0.9 },
              "-=0.6",
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
