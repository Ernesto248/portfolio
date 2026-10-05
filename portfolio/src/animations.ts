import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// A single media context owns every animation, including the scroll triggers.
// It restores the unanimated page when reduced motion is enabled or a breakpoint changes.
const motion = gsap.matchMedia()

motion.add(
  {
    allowMotion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 901px)',
    compact: '(max-width: 900px)',
  },
  (context) => {
    if (!context.conditions?.allowMotion) return

    const desktop = Boolean(context.conditions.desktop)
    const travel = desktop ? 46 : 26
    const revealStart = desktop ? 'top 82%' : 'top 90%'

    if (window.scrollY < 80) {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.site-header', { yPercent: -100, autoAlpha: 0, duration: 0.75 })
        .from('.hero .eyebrow', { y: 22, autoAlpha: 0, duration: 0.55 }, '-=0.18')
        .from('.hero h1', { y: 62, autoAlpha: 0, duration: 1.05 }, '-=0.22')
        .from('.hero-intro', { y: 26, autoAlpha: 0, duration: 0.75 }, '-=0.56')
        .from('.hero-links > *', { y: 22, autoAlpha: 0, duration: 0.65, stagger: 0.11 }, '-=0.48')
        .from('.hero-proof', { x: desktop ? 90 : 24, y: 35, rotation: desktop ? 7 : 0, scale: 0.92, autoAlpha: 0, duration: 1.1, ease: 'expo.out' }, '-=0.95')
        .from('.proof-topline, .proof-label, .proof-number, .proof-description, .proof-rule, .proof-footer', { y: 15, autoAlpha: 0, duration: 0.55, stagger: 0.075 }, '-=0.7')
        .from('.hero-bottom', { y: 16, autoAlpha: 0, duration: 0.55 }, '-=0.7')
        .from('.scroll-line', { scaleX: 0, transformOrigin: 'left center', duration: 0.8 }, '-=0.55')
    }

    gsap.to('.hero-atmosphere', {
      yPercent: 38,
      xPercent: desktop ? 12 : 0,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    })

    gsap.timeline({
      scrollTrigger: { trigger: '.section-heading', start: revealStart, once: true },
      defaults: { ease: 'power3.out' },
    })
      .from('.section-heading .section-kicker', { y: 18, autoAlpha: 0, duration: 0.6 })
      .from('.section-heading h2', { y: travel, autoAlpha: 0, duration: 0.9 }, '-=0.3')
      .from('.section-aside', { y: 22, autoAlpha: 0, duration: 0.7 }, '-=0.55')

    document.querySelectorAll<HTMLElement>('.project').forEach((project) => {
      const visual = project.querySelector<HTMLElement>('.project-visual')
      const content = project.querySelector<HTMLElement>('.project-content')
      if (!visual || !content) return

      const details = visual.querySelectorAll(
        '.finance-flow > div, .finance-flow > b, .erp-core, .erp-branches span, .erp-caption, .ticket-grid span, .raffle-count',
      )

      const scene = gsap.timeline({
        scrollTrigger: { trigger: project, start: revealStart, once: true },
        defaults: { ease: 'power3.out' },
      })

      scene
        .fromTo(visual, { clipPath: 'inset(0 100% 0 0)', x: desktop ? -24 : 0 }, { clipPath: 'inset(0 0% 0 0)', x: 0, duration: 1.15, ease: 'expo.inOut' })
        .from(details, { y: desktop ? 30 : 18, autoAlpha: 0, scale: 0.94, duration: 0.65, stagger: 0.055 }, '-=0.62')
        .from(content.children, { y: travel, autoAlpha: 0, duration: 0.75, stagger: 0.095 }, '-=0.92')

      gsap.to(visual, {
        y: desktop ? -24 : -10,
        ease: 'none',
        scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
      })
    })

    gsap.timeline({
      scrollTrigger: { trigger: '.about-section', start: revealStart, once: true },
      defaults: { ease: 'power3.out' },
    })
      .from('.about-section .section-kicker', { y: 18, autoAlpha: 0, duration: 0.55 })
      .from('.about-grid h2', { y: travel, autoAlpha: 0, duration: 0.9 }, '-=0.25')
      .from('.about-copy > *', { y: 26, autoAlpha: 0, duration: 0.7, stagger: 0.12 }, '-=0.55')
      .from('.capabilities span', { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.065 }, '-=0.28')

    gsap.timeline({
      scrollTrigger: { trigger: '.contact-section', start: revealStart, once: true },
      defaults: { ease: 'power3.out' },
    })
      .from('.contact-section .section-kicker', { y: 18, autoAlpha: 0, duration: 0.55 })
      .from('.contact-grid h2', { y: travel, autoAlpha: 0, duration: 0.95 }, '-=0.22')
      .from('.contact-grid p, .contact-email', { y: 26, autoAlpha: 0, duration: 0.72, stagger: 0.14 }, '-=0.55')
      .from('.contact-glow', { scale: 0.62, autoAlpha: 0, duration: 1.25, ease: 'power2.out' }, '-=1.1')

    gsap.from('.footer-inner > *', {
      y: 15,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.site-footer', start: 'top 95%', once: true },
    })

    // The language switch changes text length, so refresh scroll positions afterwards.
    const buttons = document.querySelectorAll<HTMLButtonElement>('[data-set-language]')
    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh())
    buttons.forEach((button) => button.addEventListener('click', refresh))
    return () => buttons.forEach((button) => button.removeEventListener('click', refresh))
  },
)
