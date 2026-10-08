import { useState } from "react";
import { ArrowDownRight, X } from "lucide-react";
import type { DemoSlug } from "./DemoApp";
import type { Language } from "./demo-i18n";
import { DemoStory } from "./DemoStory";
import { t } from "./demo-i18n";

export function DemoCaseStudy({ slug, language }: { slug: DemoSlug; language: Language }) {
  const [open, setOpen] = useState(false);

  return <section className="demo-case-study" aria-label={t(language, "Historia del proyecto", "Project story")}>
    <div className="demo-case-study-prompt">
      <div><span>LEONARD SOLUTIONS / CASE STUDY</span><h2>{t(language, "Cómo se construyó", "How it was built")}</h2><p>{t(language, "El problema, la decisión técnica y el resultado detrás de esta experiencia.", "The problem, technical decision and outcome behind this experience.")}</p></div>
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X size={17} /> : <ArrowDownRight size={17} />}{open ? t(language, "Cerrar historia", "Close story") : t(language, "Ver historia", "View story")}</button>
    </div>
    {open && <DemoStory slug={slug} language={language} />}
  </section>;
}
