# Ernesto Leonard — portfolio

Portfolio bilingüe hecho con React, Vite, Tailwind, shadcn/ui y GSAP. Vercel despliega esta carpeta (`portfolio`) como directorio raíz.

## Desarrollo

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

`pnpm build` comprueba el frontend y la función de contacto antes de generar los archivos estáticos. El servidor de Vite sirve el frontend; la ruta `/api/contact` se ejecuta como Vercel Function en una vista previa o despliegue de Vercel.

## Demos interactivas

Las demos son aplicaciones de muestra dentro del mismo despliegue, cada una con URL directa bajo `leonardsolutions.dev`:

| Ruta | Flujo que se puede probar |
| --- | --- |
| `/demos/transactions` | Ingesta de movimientos, rechazo de duplicados por banco y confirmación, asignación y auditoría. |
| `/demos/sgia` | Stock por sucursal, transferencia con recepción y venta que descuenta inventario. |
| `/demos/tattoo-raffle` | Selección y reserva de entradas, confirmación simulada y repetición idempotente de webhook. |

Todos los datos de las demos son ficticios y viven en la sesión del navegador. No consultan las bases de datos originales ni ejecutan pagos o correos. El botón **Reiniciar** recupera el estado de ejemplo. `vercel.json` permite abrir las rutas directamente en producción.

## Formulario de contacto

La función `api/contact.ts` envía mensajes de texto a la dirección fija del portfolio mediante Resend. El navegador nunca recibe la clave API. Configura estas variables en el proyecto `portfolio` de Vercel para **Production** y **Preview**:

| Variable | Valor |
| --- | --- |
| `RESEND_API_KEY` | Clave secreta creada por la integración de Resend |
| `RESEND_FROM_EMAIL` | `Portfolio <contact@leonardsolutions.dev>` |

Antes de activar el envío, verifica `leonardsolutions.dev` en Resend y confirma sus registros DNS. El formulario mantiene un enlace `mailto:` como alternativa si el servicio no está disponible. El endpoint valida el origen, longitud, correo y tiempo de envío, e incluye un campo trampa contra bots básicos.

Las habilidades y datos profesionales públicos deben cotejarse con el perfil maestro del proyecto privado Job Leads antes de actualizar el contenido.
