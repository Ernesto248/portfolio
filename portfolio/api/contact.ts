import { Resend } from "resend";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

const inbox = "ernestoleonard8@gmail.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: object, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      const response = json({ error: "Method not allowed" }, 405);
      response.headers.set("Allow", "POST");
      return response;
    }

    const origin = request.headers.get("origin");
    try {
      if (!origin || new URL(origin).host !== new URL(request.url).host) {
        return json({ error: "Forbidden" }, 403);
      }
    } catch {
      return json({ error: "Forbidden" }, 403);
    }

    if (!request.headers.get("content-type")?.startsWith("application/json")) {
      return json({ error: "JSON required" }, 415);
    }

    let body: ContactBody;
    try {
      const raw = await request.text();
      if (raw.length > 6000) return json({ error: "Invalid message" }, 400);
      body = JSON.parse(raw) as ContactBody;
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return json({ error: "Invalid message" }, 400);
      }
    } catch {
      return json({ error: "Invalid message" }, 400);
    }

    // An invisible field catches basic form spam without a visitor challenge.
    if (body.website) return json({ ok: true }, 200);

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const elapsed = Date.now() - Number(body.startedAt);

    if (
      !name || name.length > 100 || [...name].some((character) => character.charCodeAt(0) < 32) ||
      email.length > 254 || !emailPattern.test(email) ||
      message.length < 10 || message.length > 4000 ||
      !Number.isFinite(elapsed) || elapsed < 2500 || elapsed > 86_400_000
    ) {
      return json({ error: "Invalid message" }, 400);
    }

    const key = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!key || !from) return json({ error: "Contact unavailable" }, 503);

    try {
      const resend = new Resend(key);
      const { error } = await resend.emails.send({
        from,
        to: [inbox],
        replyTo: email,
        subject: "Nuevo mensaje desde leonardsolutions.dev",
        text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
      });

      if (error) {
        console.error("Resend contact error", { name: error.name, message: error.message });
        return json({ error: "Delivery failed" }, 502);
      }
      return json({ ok: true }, 200);
    } catch (error) {
      console.error("Resend contact exception", error instanceof Error ? { name: error.name, message: error.message } : { name: "UnknownError" });
      return json({ error: "Delivery failed" }, 502);
    }
  },
};
