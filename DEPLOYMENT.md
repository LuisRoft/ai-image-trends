# 🚀 Deployment Guide

## Antes de Desplegar

### 1. Actualiza el Schema de Convex

```bash
# Asegúrate de que Convex esté corriendo
npx convex dev

# El schema se actualizará automáticamente
# Verifica que la tabla 'userApiKeys' se haya creado
```

### 2. Configura Variables de Entorno en Producción

En tu plataforma de deployment (Vercel, etc.), agrega:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=tu_convex_url_de_produccion
CONVEX_DEPLOYMENT=produccion

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clerk_key_de_produccion
CLERK_SECRET_KEY=tu_clerk_secret_de_produccion

# CRÍTICO: Genera una clave fuerte para producción
ENCRYPTION_SECRET=genera-esto-con-openssl-rand-base64-32
```

### 3. Genera una Clave de Encriptación Segura

```bash
# macOS/Linux
openssl rand -base64 32

# Copia el resultado y úsalo como ENCRYPTION_SECRET
```

### 4. Elimina la Variable API_KEY

**IMPORTANTE**: Si tenías una variable `API_KEY` en tu `.env`, **elimínala** completamente. Ya no se necesita porque cada usuario usa su propia API key.

## Deploy en Vercel

### Configuración Automática

```bash
# Instala Vercel CLI (si no lo tienes)
npm i -g vercel

# Deploy
vercel

# Para producción
vercel --prod
```

### Configuración Manual

1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en el dashboard
3. ✅ Asegúrate de que `ENCRYPTION_SECRET` esté configurado
4. Deploy automático con cada push a `main`

## Deploy Convex en Producción

```bash
# Deploy tu backend de Convex
npx convex deploy

# Copia la URL de producción
# Actualízala en NEXT_PUBLIC_CONVEX_URL
```

## Verificación Post-Deploy

### Checklist Esencial

- [ ] ✅ La app carga correctamente
- [ ] ✅ El sistema de autenticación funciona (Clerk)
- [ ] ✅ Los usuarios pueden registrarse/iniciar sesión
- [ ] ✅ La página de configuración (`/settings`) es accesible
- [ ] ✅ Los usuarios pueden guardar su API key
- [ ] ✅ La generación de imágenes funciona con API key de usuario
- [ ] ✅ Los errores se manejan correctamente (sin API key, API key inválida)
- [ ] ✅ Las API keys se almacenan encriptadas en Convex

### Testing en Producción

1. **Crear cuenta de prueba**

   - Regístrate con un email de prueba
   - Verifica que Clerk funcione

2. **Configurar API Key**

   - Ve a `/settings`
   - Agrega una API key de prueba de Google Gemini
   - Verifica que se guarde correctamente

3. **Generar una imagen**

   - Selecciona un prompt
   - Sube una imagen (si es necesario)
   - Genera una imagen
   - Verifica que se descargue correctamente

4. **Probar casos de error**
   - Intenta generar sin API key
   - Usa una API key inválida
   - Verifica que los mensajes de error sean claros

## Monitoreo

### Convex Dashboard

- Ve al dashboard de Convex
- Monitorea el uso de la base de datos
- Revisa logs de errores

### Vercel Analytics

- Activa Vercel Analytics
- Monitorea el rendimiento
- Revisa errores de runtime

## Seguridad Adicional (Recomendado)

### ✅ Encriptación AES-256 Ya Implementada

La aplicación ya usa **AES-256** con crypto-js:

- ✅ **Encriptación robusta**: Mismo estándar AES-256 usado por empresas
- ✅ **Simple y mantenible**: Código limpio y fácil de entender
- ✅ **Automático**: Maneja IV, padding y codificación por ti
- ✅ **Probado en batalla**: Usado por miles de aplicaciones

### Características de Seguridad Implementadas

```typescript
// Ya implementado en convex/userApiKeys.ts con crypto-js
import CryptoJS from "crypto-js";

// Encriptar
CryptoJS.AES.encrypt(apiKey, secretKey).toString();

// Desencriptar
CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
```

### Recomendaciones Adicionales

### Rate Limiting

Considera agregar rate limiting para prevenir abuso:

```typescript
// En app/api/generate-image/route.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});
```

## Troubleshooting

### Error: "API Key not configured"

- Verifica que la tabla `userApiKeys` exista en Convex
- Verifica que el usuario esté autenticado
- Revisa los logs de Convex

### Error: "Invalid API Key"

- Verifica que `ENCRYPTION_SECRET` sea el mismo en todas las instancias
- Verifica que la API key del usuario sea válida en Google AI Studio

### Error: "Unauthorized"

- Verifica la configuración de Clerk
- Verifica las variables `CLERK_SECRET_KEY` y `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

## Rollback

Si necesitas revertir los cambios:

```bash
git revert HEAD
git push origin main
```

O en Vercel, usa "Redeploy" a un deployment anterior.

## Soporte

Si encuentras problemas:

1. Revisa los logs en Vercel
2. Revisa los logs en Convex Dashboard
3. Verifica las variables de entorno
4. Abre un issue en GitHub

---

¡Listo para producción! 🎉
