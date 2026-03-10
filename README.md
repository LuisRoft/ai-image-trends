<p align="center">
  <img src="public/favicon.svg" alt="VizAI" width="80" />
</p>

# VizAI

<p align="center">
  <strong>Biblioteca de prompts y generador de imágenes con IA</strong>
</p>

<p align="center">
  <a href="https://vizai.luisroftl.me">Ver en vivo</a> · 
  <a href="https://github.com/LuisRoft/ai-image-trends">Código</a>
</p>

Explora prompts curados y genera imágenes al instante con Gemini. La app incluye 10 créditos por ciclo y también permite usar una API key propia para seguir generando sin límites del proyecto.

---

### Inicio rápido

```bash
git clone https://github.com/LuisRoft/ai-image-trends.git
cd ai-image-trends
pnpm install
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de [Convex](https://convex.dev) y [Clerk](https://clerk.com), luego:

```bash
npx convex dev
pnpm dev
```

Variables relevantes:

- `GOOGLE_GENERATIVE_AI_API_KEY`: API key del servidor para el modo créditos.
- `CONVEX_DEPLOY_KEY`: deploy/admin key para que Next llame funciones internas de Convex.
- `ENCRYPTION_SECRET`: secreto usado por Convex para encriptar y desencriptar la API key personal del usuario.

En la app puedes generar con créditos de la app. Cuando agotas los 10, se recargan 24 horas después del último crédito consumido. Si prefieres, puedes ir a **Configuración** y añadir tu API key de [Google AI Studio](https://aistudio.google.com/apikey).

### Stack

Next.js 15 · React 19 · Tailwind · Convex · Clerk · Gemini AI

---

<p align="center">
  <a href="https://luisroftl.vercel.app">LuisRoftl</a> · 
  <a href="https://github.com/LuisRoft">GitHub</a> · 
  <a href="https://x.com/luisroftl">X</a>
</p>
