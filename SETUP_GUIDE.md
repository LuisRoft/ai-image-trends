# Guía de Configuración de API Key

## Para Usuarios

### ¿Cómo usar la generación de imágenes?

Para generar imágenes con IA, necesitas configurar tu propia API key de Google Gemini. Esto te permite usar el generador manteniendo el control total de tus costos.

### Pasos para configurar tu API Key:

1. **Obtén tu API Key de Google Gemini:**

   - Ve a [Google AI Studio](https://aistudio.google.com/apikey)
   - Inicia sesión con tu cuenta de Google
   - Haz clic en "Get API Key" o "Create API Key"
   - Copia la API key generada

2. **Configura tu API Key en la aplicación:**

   - Inicia sesión en la aplicación
   - Haz clic en el botón "Configuración" en la barra superior
   - Pega tu API key en el campo correspondiente
   - Haz clic en "Guardar API Key"

3. **¡Listo! Ya puedes generar imágenes:**
   - Navega a cualquier prompt de la biblioteca
   - Edita el prompt según tus necesidades
   - Sube imágenes si el prompt lo requiere
   - Haz clic en "Generar Imagen"

### Información importante:

- ✅ Tu API key se almacena de forma **encriptada y segura**
- 🔒 Solo **tú** tienes acceso a tu API key
- 💰 Los costos de uso de la API corren por tu cuenta
- 📊 Consulta los [precios de Google AI](https://ai.google.dev/pricing)
- 🔄 Puedes actualizar o eliminar tu API key en cualquier momento

### Solución de problemas:

**"API Key no configurada"**

- Ve a Configuración y agrega tu API key de Gemini

**"Tu API key es inválida"**

- Verifica que copiaste la API key completa
- Genera una nueva API key en Google AI Studio
- Actualiza la API key en tu configuración

**Error al generar imagen**

- Verifica que tu API key tenga créditos disponibles
- Revisa los límites de uso en tu cuenta de Google AI

---

## Para Desarrolladores

### Cambios implementados:

1. **Schema de Convex** (`convex/schema.ts`):

   - Agregada tabla `userApiKeys` para almacenar API keys encriptadas por usuario

2. **Funciones Convex** (`convex/userApiKeys.ts`):

   - `saveApiKey`: Guardar/actualizar API key del usuario
   - `getApiKey`: Obtener versión enmascarada de la API key
   - `getActualApiKey`: Obtener API key real (para uso en backend)
   - `deleteApiKey`: Eliminar API key del usuario
   - Encriptación **AES-256** usando crypto-js (simple y seguro)

3. **API Route** (`app/api/generate-image/route.ts`):

   - Autenticación con Clerk
   - Obtiene API key del usuario desde Convex
   - Valida que el usuario tenga API key configurada
   - Manejo de errores específicos (sin API key, API key inválida)

4. **Componente de Configuración** (`components/api-key-settings.tsx`):

   - Formulario para agregar/actualizar API key
   - Mostrar API key enmascarada
   - Eliminar API key
   - Instrucciones para obtener API key de Google

5. **Generador de Imágenes** (`components/image-generator.tsx`):

   - Verifica si el usuario tiene API key configurada
   - Muestra alertas si falta o es inválida la API key
   - Botón de acceso rápido a configuración

6. **Página de Configuración** (`app/settings/page.tsx`):

   - Página dedicada para gestionar API keys

7. **Header actualizado** (`components/header-dev.tsx`):
   - Botón de configuración para usuarios autenticados
   - Integración con UserButton de Clerk

### Variables de entorno requeridas:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_deployment

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Opcional: Clave de encriptación (cambia esto en producción)
ENCRYPTION_SECRET=your-secure-encryption-key-change-in-production
```

### Migración de datos:

Si ya tenías una API key en `.env.local`, ya no la necesitas. Cada usuario ahora debe configurar su propia API key a través de la UI.

### Seguridad:

⚠️ **Importante para producción:**

- ✅ **Encriptación AES-256 implementada** - Usando crypto-js (simple y seguro)
- ✅ **Misma seguridad que soluciones empresariales** - Pero más fácil de mantener
- 🔑 Configura `ENCRYPTION_SECRET` con un valor fuerte y seguro (32+ caracteres)
- 🔐 Genera la clave con: `openssl rand -base64 32`
- ⚠️ **NUNCA cambies** `ENCRYPTION_SECRET` en producción (invalidaría todas las API keys)
- 📊 Considera agregar rate limiting a la API
- 📝 Implementa logging de uso para detectar abusos

### Testing:

1. Inicia sesión con una cuenta de prueba
2. Ve a `/settings`
3. Agrega una API key de prueba
4. Intenta generar una imagen
5. Verifica que la API key se use correctamente
6. Prueba eliminar y actualizar la API key
