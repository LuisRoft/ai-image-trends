# VizAI - Biblioteca de Prompts y Generador de Imágenes AI

Explora y edita los prompts más populares del momento para transformar tus fotos en estilos únicos (anime, cartoon, realista y más). Genera imágenes al instante o guarda tus favoritos. Powered by Google Gemini AI.

## 🌟 Características

- 📚 **Biblioteca de Prompts**: Explora prompts curados para diferentes estilos de imagen
- 🎨 **Generación de Imágenes AI**: Genera imágenes usando Google Gemini 2.5 Flash Image Preview
- 🔐 **API Keys Personales**: Cada usuario usa su propia API key (sin costos para el propietario)
- ✏️ **Editor de Prompts**: Personaliza y edita prompts antes de generar
- 🖼️ **Soporte Multi-imagen**: Sube múltiples imágenes de referencia
- 💾 **Descarga Directa**: Descarga las imágenes generadas instantáneamente
- 🔒 **Autenticación Segura**: Powered by Clerk
- 📊 **Base de Datos en Tiempo Real**: Convex para almacenamiento y sincronización

## 🚀 Inicio Rápido

### Para Usuarios

1. **Regístrate o Inicia Sesión**
2. **Configura tu API Key de Gemini**:
   - Ve a [Google AI Studio](https://aistudio.google.com/apikey)
   - Obtén tu API key gratuita
   - En la app, ve a "Configuración" y pega tu API key
3. **Explora los Prompts** disponibles en la biblioteca
4. **Genera Imágenes** personalizadas con AI

### Para Desarrolladores

#### Prerrequisitos

- Node.js 18+
- pnpm (recomendado) o npm
- Cuenta de [Convex](https://convex.dev)
- Cuenta de [Clerk](https://clerk.com)

#### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/LuisRoft/ai-image-trends.git
cd ai-image-trends

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales

# Iniciar Convex
npx convex dev

# En otra terminal, iniciar Next.js
pnpm dev
```

#### Variables de Entorno

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=tu_convex_url
CONVEX_DEPLOYMENT=tu_deployment

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clerk_key
CLERK_SECRET_KEY=tu_clerk_secret

# Opcional: Encriptación (cambia en producción)
ENCRYPTION_SECRET=tu-clave-segura-de-encriptacion
```

## 🏗️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router + Turbopack)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Autenticación**: Clerk
- **Base de Datos**: Convex
- **IA**: Google Gemini AI (2.5 Flash Image Preview)
- **Deployment**: Vercel (recomendado)

## 📁 Estructura del Proyecto

```
ai-image-trends/
├── app/
│   ├── api/
│   │   └── generate-image/     # Endpoint de generación de imágenes
│   ├── generator/              # Página de generación
│   ├── settings/               # Configuración de usuario
│   └── page.tsx                # Página principal
├── components/
│   ├── api-key-settings.tsx    # Gestión de API keys
│   ├── image-generator.tsx     # Componente generador
│   ├── grid-prompts.tsx        # Grid de prompts
│   └── ui/                     # Componentes shadcn
├── convex/
│   ├── prompts.ts              # Queries de prompts
│   ├── userApiKeys.ts          # Gestión de API keys
│   └── schema.ts               # Schema de la DB
└── lib/
    └── utils.ts                # Utilidades
```

## 🔐 Seguridad

- Las API keys se almacenan **encriptadas con AES-256** en Convex
- Encriptación simple y robusta usando crypto-js
- Autenticación obligatoria para generación de imágenes
- Cada usuario usa su propia API key (sin compartir costos)
- Solo el propietario puede acceder a su API key
- Seguridad de nivel empresarial con código mantenible

## 📝 Licencia

Este proyecto es open source. Ver [LICENSE](./LICENSE) para más detalles.

## 👨‍💻 Autor

Creado por [LuisRoftl](https://luisroftl.vercel.app)

- Twitter: [@luisroftl](https://x.com/luisroftl)
- GitHub: [@LuisRoft](https://github.com/LuisRoft)
- LinkedIn: [luisvelasco27](https://www.linkedin.com/in/luisvelasco27/)

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## ⭐ Soporte

Si este proyecto te fue útil, considera darle una ⭐ en GitHub!

---

**Powered by Google Gemini AI** 🚀
