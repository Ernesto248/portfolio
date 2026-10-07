export type Language = "es" | "en";

export const t = (language: Language, es: string, en: string) => language === "es" ? es : en;
