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

Explora prompts curados y genera imágenes al instante con Gemini. Cada usuario usa su propia API key — sin costos para el proyecto. Construido y desplegado en producción.

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

En la app: **Configuración** → añade tu API key de [Google AI Studio](https://aistudio.google.com/apikey).

### Stack

Next.js 15 · React 19 · Tailwind · Convex · Clerk · Gemini AI

---

<p align="center">
  <a href="https://luisroftl.vercel.app">LuisRoftl</a> · 
  <a href="https://github.com/LuisRoft">GitHub</a> · 
  <a href="https://x.com/luisroftl">X</a>
</p>
