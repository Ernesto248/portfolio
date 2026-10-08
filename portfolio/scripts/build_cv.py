from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfdoc import PDFString
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


BASE = Path(__file__).resolve().parents[1]
OUTPUT_DIR = BASE / "public" / "cv"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

pdfmetrics.registerFont(TTFont("Verdana", r"C:\Windows\Fonts\verdana.ttf"))
pdfmetrics.registerFont(TTFont("Verdana-Bold", r"C:\Windows\Fonts\verdanab.ttf"))
pdfmetrics.registerFontFamily(
    "Verdana", normal="Verdana", bold="Verdana-Bold", italic="Verdana", boldItalic="Verdana-Bold"
)

BLACK = colors.HexColor("#111111")
BLUE = colors.HexColor("#078AF0")
BODY = colors.HexColor("#3F464D")
MUTED = colors.HexColor("#687078")
LINE = colors.HexColor("#CDD2D6")
PALE = colors.HexColor("#F5F8FA")


def pstyle(name, **kwargs):
    defaults = {
        "fontName": "Verdana",
        "fontSize": 8.0,
        "leading": 10.1,
        "textColor": BODY,
        "spaceAfter": 0,
        "spaceBefore": 0,
        "allowWidows": 0,
        "allowOrphans": 0,
    }
    defaults.update(kwargs)
    return ParagraphStyle(name, **defaults)


NAME = pstyle("Name", fontName="Verdana-Bold", fontSize=23.5, leading=25.5, textColor=BLACK)
TAGLINE = pstyle("Tagline", fontName="Verdana-Bold", fontSize=11.8, leading=14.0, textColor=BLUE)
CONTACT = pstyle("Contact", fontSize=7.9, leading=10.0, textColor=BODY)
SECTION = pstyle("Section", fontName="Verdana-Bold", fontSize=10.1, leading=11.5, textColor=BLACK)
BODY_STYLE = pstyle("Body", fontSize=8.25, leading=10.55)
COMPACT = pstyle("Compact", fontSize=7.85, leading=9.8)
ROLE = pstyle("Role", fontName="Verdana-Bold", fontSize=9.6, leading=11.2, textColor=BLACK)
DATE = pstyle("Date", fontSize=7.5, leading=9.2, textColor=MUTED, alignment=TA_RIGHT)
COMPANY = pstyle("Company", fontName="Verdana-Bold", fontSize=8.15, leading=10.1, textColor=BLUE)
SUBMETA = pstyle("SubMeta", fontSize=7.55, leading=9.3, textColor=MUTED)
BULLET = pstyle(
    "Bullet",
    fontSize=7.85,
    leading=10.0,
    leftIndent=9,
    firstLineIndent=-7,
    spaceBefore=0.7,
)
PROJECT_TITLE = pstyle(
    "ProjectTitle", fontName="Verdana-Bold", fontSize=8.85, leading=10.5, textColor=BLACK
)
PROJECT_DATE = pstyle("ProjectDate", fontSize=7.2, leading=8.9, textColor=MUTED, alignment=TA_RIGHT)
PROJECT_BODY = pstyle("ProjectBody", fontSize=7.75, leading=9.85)
PROJECT_LINK = pstyle("ProjectLink", fontSize=7.35, leading=8.8, textColor=BLUE)
SKILL_LABEL = pstyle("SkillLabel", fontName="Verdana-Bold", fontSize=7.25, leading=9.0, textColor=BLUE)
SKILL_VALUE = pstyle("SkillValue", fontSize=7.65, leading=9.3, textColor=BODY)


def section_heading(text):
    return KeepTogether(
        [
            Paragraph(text, SECTION),
            Spacer(1, 0.45 * mm),
            HRFlowable(width="100%", thickness=1.25, color=BLACK, spaceBefore=0, spaceAfter=1.2 * mm),
        ]
    )


def heading_row(title, date, project=False):
    left = PROJECT_TITLE if project else ROLE
    right = PROJECT_DATE if project else DATE
    widths = [115 * mm, 62 * mm] if project else [123 * mm, 54 * mm]
    table = Table(
        [[Paragraph(title, left), Paragraph(date, right)]],
        colWidths=widths,
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return table


def project_block(project):
    items = [
        heading_row(project["title"], project["date"], project=True),
        Spacer(1, 0.55 * mm),
        Paragraph(project["description"], PROJECT_BODY),
        Paragraph(f'- {project["achievement"]}', BULLET),
    ]
    if project.get("link_url"):
        items.append(
            Paragraph(
                f'<link href="{project["link_url"]}" color="#078AF0">{project["link_text"]}</link>',
                PROJECT_LINK,
            )
        )
    return KeepTogether(items)


DATA = {
    "es": {
        "output": "Ernesto-Leonard-Escariz-CV-2026.pdf",
        "lang": "es-ES",
        "subject": "Desarrollador Full-Stack especializado en TypeScript y sistemas web end-to-end",
        "tagline": "Desarrollador Full-Stack | TypeScript y sistemas web end-to-end",
        "location": "Valencia, España",
        "profile_heading": "PERFIL",
        "profile": (
            "Desarrollador Full-Stack especializado en sistemas web end-to-end con TypeScript, Next.js y PostgreSQL. "
            "Convierto operaciones complejas en flujos fiables, trazables y fáciles de usar, desde el modelado de datos "
            "y las APIs hasta la automatización y el despliegue. Priorizo experiencia de usuario, rendimiento, integridad "
            "de datos y entregas validadas. Autorizado para trabajar en España y la UE."
        ),
        "education_heading": "FORMACIÓN E IDIOMAS",
        "education": (
            "<b>Ingeniería Informática</b> - Universidad de Camagüey (2021 - 2025)"
            " &nbsp;&nbsp;|&nbsp;&nbsp; <b>Español:</b> nativo"
            " &nbsp;&nbsp;|&nbsp;&nbsp; <b>Inglés:</b> B2 (MCER, autoevaluado)"
        ),
        "skills_heading": "HABILIDADES",
        "skill_rows": [
            ("FRONTEND", "TypeScript, Next.js, React, Tailwind CSS, GSAP"),
            ("DATOS Y BACKEND", "PostgreSQL, Neon, Supabase, Prisma, Zod"),
            ("INTEGRACIONES Y CLOUD", "<b>n8n</b>, Stripe, Resend, DigitalOcean Spaces, Vercel"),
            ("IA Y CALIDAD", "<b>OpenAI</b> Codex, Git, GitHub, Vitest, testing automatizado"),
        ],
        "experience_heading": "EXPERIENCIA",
        "role": "Desarrollador Full-Stack",
        "date": "may 2025 - actualidad",
        "company": "Profesional independiente / Clientes privados",
        "submeta": "Valencia, España (remoto)",
        "bullets": [
            "Desarrollo sistemas end-to-end con TypeScript, Next.js y PostgreSQL, integrando APIs, automatizaciones con la plataforma <b>n8n</b>, pagos, correo transaccional y despliegues en Vercel.",
            "Protegí la integridad de más de 2.800 transacciones financieras verificadas mediante procesamiento idempotente, operaciones atómicas, reversos compensatorios y registros de auditoría.",
            "Diseñé autorización granular para administradores, jefes regionales, jefes de sucursal y vendedores, además de flujos multi-sucursal y reglas complejas para divisas, comisiones, saldos y conciliación.",
            "Trabajé directamente con clientes para sustituir flujos basados en Excel en seis sucursales, reduciendo el cuadre diario de aproximadamente una hora a un proceso casi automático.",
        ],
        "projects_heading": "PROYECTOS SELECCIONADOS",
        "projects": [
            {
                "title": "Plataforma de operaciones financieras",
                "date": "may 2026 - ago 2026 | En producción",
                "description": "Centraliza transacciones, saldos, deudas, divisas, gastos y conciliación. Diseñé ingestión idempotente contra relecturas de la plataforma <b>n8n</b>, reversos auditables para corregir errores humanos y valoración FIFO para conocer el coste exacto del saldo disponible.",
                "achievement": "Más de 2.800 transacciones verificadas procesadas en producción.",
                "link_text": "leonardsolutions.dev/demos/transactions",
                "link_url": "https://leonardsolutions.dev/demos/transactions",
            },
            {
                "title": "Sistema de Gestión Empresarial (S.G.I.A.)",
                "date": "oct 2025 - ene 2026 | Producción",
                "description": "ERP que sustituyó Excel y centralizó la operación de seis sucursales, con permisos granulares y reglas para inventario, ventas, proveedores, divisas y comisiones.",
                "achievement": "Redujo un cuadre diario de aproximadamente una hora a un proceso casi automático.",
                "link_text": "leonardsolutions.dev/demos/sgia",
                "link_url": "https://leonardsolutions.dev/demos/sgia",
            },
            {
                "title": "Tattoo Raffle - pagos y reservas",
                "date": "ago 2025 - sep 2025 | Campaña completada",
                "description": "Aplicación real con Stripe Checkout, correo transaccional y panel administrativo. Implementé reservas atómicas contra condiciones de carrera y procesamiento tolerante a reintentos mediante webhooks firmados, idempotencia y registro de eventos.",
                "achievement": "Procesó una campaña de 200 participaciones sin duplicar reservas.",
                "link_text": "leonardsolutions.dev/demos/tattoo-raffle",
                "link_url": "https://leonardsolutions.dev/demos/tattoo-raffle",
            },
        ],
    },
    "en": {
        "output": "Ernesto-Leonard-Escariz-CV-2026-EN.pdf",
        "lang": "en-GB",
        "subject": "Full-Stack Developer specializing in TypeScript and end-to-end web systems",
        "tagline": "Full-Stack Developer | TypeScript and end-to-end web systems",
        "location": "Valencia, Spain",
        "profile_heading": "SUMMARY",
        "profile": (
            "Full-Stack Developer specializing in end-to-end web systems with TypeScript, Next.js, and PostgreSQL. "
            "I turn complex operations into reliable, traceable, and user-friendly workflows, from data modeling and APIs "
            "to automation and deployment. I prioritize user experience, performance, data integrity, and validated "
            "releases. Authorized to work in Spain and the EU."
        ),
        "education_heading": "EDUCATION AND LANGUAGES",
        "education": (
            "<b>Computer Engineering</b> - University of Camagüey (2021 - 2025)"
            " &nbsp;&nbsp;|&nbsp;&nbsp; <b>Spanish:</b> native"
            " &nbsp;&nbsp;|&nbsp;&nbsp; <b>English:</b> B2 (CEFR, self-assessed)"
        ),
        "skills_heading": "SKILLS",
        "skill_rows": [
            ("FRONTEND", "TypeScript, Next.js, React, Tailwind CSS, GSAP"),
            ("DATA AND BACKEND", "PostgreSQL, Neon, Supabase, Prisma, Zod"),
            ("INTEGRATIONS AND CLOUD", "<b>n8n</b>, Stripe, Resend, DigitalOcean Spaces, Vercel"),
            ("AI AND QUALITY", "<b>OpenAI</b> Codex, Git, GitHub, Vitest, automated testing"),
        ],
        "experience_heading": "EXPERIENCE",
        "role": "Full-Stack Developer",
        "date": "May 2025 - Present",
        "company": "Independent Professional / Private clients",
        "submeta": "Valencia, Spain (remote)",
        "bullets": [
            "Build end-to-end systems with TypeScript, Next.js, and PostgreSQL, integrating APIs, automation with the <b>n8n</b> platform, payments, transactional email, and deployments on Vercel.",
            "Protected the integrity of more than 2,800 verified financial transactions by implementing idempotent processing, atomic operations, compensating reversals, and audit logs.",
            "Designed granular authorization for administrators, regional managers, branch managers, and sales staff, along with multi-branch workflows and complex rules for currencies, commissions, balances, and reconciliation.",
            "Worked directly with clients to replace Excel-based workflows across six branches, reducing daily reconciliation from approximately one hour to a near-automated process.",
        ],
        "projects_heading": "SELECTED PROJECTS",
        "projects": [
            {
                "title": "Financial Operations Platform",
                "date": "May 2026 - Aug 2026 | In production",
                "description": "Centralizes transactions, balances, debts, currencies, expenses, and reconciliation. Designed idempotent ingestion against repeated reads from the <b>n8n</b> platform, auditable reversals to correct human errors, and FIFO valuation to determine the exact cost of the available balance.",
                "achievement": "Processed more than 2,800 verified transactions in production.",
                "link_text": "leonardsolutions.dev/demos/transactions",
                "link_url": "https://leonardsolutions.dev/demos/transactions",
            },
            {
                "title": "Business Management System (S.G.I.A.)",
                "date": "Oct 2025 - Jan 2026 | Production",
                "description": "ERP that replaced Excel and centralized operations across six branches, with granular permissions and rules for inventory, sales, suppliers, foreign currencies, and commissions.",
                "achievement": "Reduced daily reconciliation from approximately one hour to a near-automated process.",
                "link_text": "leonardsolutions.dev/demos/sgia",
                "link_url": "https://leonardsolutions.dev/demos/sgia",
            },
            {
                "title": "Tattoo Raffle - payments and reservations",
                "date": "Aug 2025 - Sep 2025 | Completed campaign",
                "description": "Live application with Stripe Checkout, transactional email, and an administrative dashboard. Implemented atomic reservations against race conditions and retry-safe processing through signed webhooks, idempotency, and event logging.",
                "achievement": "Processed a 200-entry raffle campaign without duplicate reservations.",
                "link_text": "leonardsolutions.dev/demos/tattoo-raffle",
                "link_url": "https://leonardsolutions.dev/demos/tattoo-raffle",
            },
        ],
    },
}


def build_cv(data):
    output = OUTPUT_DIR / data["output"]
    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=10 * mm,
        bottomMargin=9 * mm,
        title="CV - Ernesto Leonard Escariz",
        author="Ernesto Leonard Escariz",
        subject=data["subject"],
    )

    story = [
        Paragraph("ERNESTO LEONARD ESCARIZ", NAME),
        Spacer(1, 0.8 * mm),
        Paragraph(data["tagline"], TAGLINE),
        Spacer(1, 1.15 * mm),
        Paragraph(
            '<link href="tel:+34635792307" color="#3F464D">+34 635 792 307</link>'
            ' &nbsp;&nbsp;|&nbsp;&nbsp; <link href="mailto:ernestoleonard8@gmail.com" color="#3F464D">ernestoleonard8@gmail.com</link>'
            f' &nbsp;&nbsp;|&nbsp;&nbsp; {data["location"]}',
            CONTACT,
        ),
        Paragraph(
            '<link href="https://leonardsolutions.dev/" color="#078AF0">leonardsolutions.dev</link>'
            ' &nbsp;&nbsp;|&nbsp;&nbsp; <link href="https://www.linkedin.com/in/ernesto-leonard-escariz-747685252" color="#078AF0">linkedin.com/in/ernesto-leonard-escariz-747685252</link>'
            ' &nbsp;&nbsp;|&nbsp;&nbsp; <link href="https://github.com/Ernesto248" color="#078AF0">github.com/Ernesto248</link>',
            CONTACT,
        ),
        Spacer(1, 2.3 * mm),
        section_heading(data["profile_heading"]),
        Paragraph(data["profile"], BODY_STYLE),
        Spacer(1, 1.8 * mm),
        section_heading(data["education_heading"]),
        Paragraph(data["education"], COMPACT),
        Spacer(1, 1.8 * mm),
        section_heading(data["skills_heading"]),
    ]

    skills = Table(
        [
            [Paragraph(label, SKILL_LABEL), Paragraph(value, SKILL_VALUE)]
            for label, value in data["skill_rows"]
        ],
        colWidths=[43 * mm, 134 * mm],
        hAlign="LEFT",
    )
    skills.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("LINEBELOW", (0, 0), (-1, -2), 0.35, LINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 1.55),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.55),
            ]
        )
    )
    story.extend(
        [
            skills,
            Spacer(1, 2.0 * mm),
            section_heading(data["experience_heading"]),
            heading_row(data["role"], data["date"]),
            Spacer(1, 0.35 * mm),
            Paragraph(data["company"], COMPANY),
            Paragraph(data["submeta"], SUBMETA),
            Spacer(1, 0.35 * mm),
        ]
    )
    for bullet in data["bullets"]:
        story.append(Paragraph(f"- {bullet}", BULLET))

    story.extend(
        [
            Spacer(1, 1.9 * mm),
            section_heading(data["projects_heading"]),
        ]
    )
    for index, item in enumerate(data["projects"]):
        if index:
            story.append(Spacer(1, 1.4 * mm))
        story.append(project_block(item))

    def configure_page(canvas, _doc):
        canvas._doc.Catalog.Lang = PDFString(data["lang"])

    doc.build(story, onFirstPage=configure_page, onLaterPages=configure_page)
    print(output)


for cv_data in DATA.values():
    build_cv(cv_data)
