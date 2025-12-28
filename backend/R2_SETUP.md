# Configuración de Cloudflare R2 para Almacenamiento de Imágenes

## ¿Por qué Cloudflare R2?

Con un volumen estimado de:
- **100 autos/semana** × **70 fotos/auto** = **7,000 fotos/semana**
- **~28,000 fotos/mes**

R2 es la mejor opción porque:
- ✅ **Escalable**: Maneja millones de objetos sin problemas
- ✅ **Económico**: $0.015 por GB almacenado, $0.36 por millón de operaciones
- ✅ **CDN integrado**: Acceso rápido global
- ✅ **Lifecycle policies**: Eliminación automática después de 30 días
- ✅ **S3 compatible**: Fácil migración y herramientas conocidas

## Pasos para Configurar R2

### 1. Crear Bucket en Cloudflare R2

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona tu cuenta
3. Ve a **R2** en el menú lateral
4. Haz clic en **Create bucket**
5. Nombre del bucket: `autoventas-images` (o el que prefieras)
6. Selecciona la ubicación más cercana a tus usuarios

### 2. Obtener Credenciales de API

1. En R2, ve a **Manage R2 API Tokens**
2. Haz clic en **Create API Token**
3. Permisos: **Object Read & Write**
4. Copia:
   - **Access Key ID**
   - **Secret Access Key**

### 3. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env` del backend:

```env
# Cloudflare R2 Configuration
# Puedes usar cualquiera de estos formatos (el código soporta ambos):
R2_ACCOUNT_ID=fcf151aec64668c48e80630f6fb7c6c8
R2_BUCKET_NAME=subastas
R2_ENDPOINT=https://fcf151aec64668c48e80630f6fb7c6c8.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=370acce39ad8087423ee74edf4821037
R2_SECRET_ACCESS_KEY=2aabc7f8b551ba87d3cf52c3a7222f64df9cf2f4bd69294e9128c3111a7a1a3e
R2_PUBLIC_URL=https://pub-fcf151aec64668c48e80630f6fb7c6c8.r2.dev

# O también puedes usar el formato NUXT_PUBLIC_R2_* (el código detecta ambos):
# NUXT_PUBLIC_R2_ACCOUNT_ID=fcf151aec64668c48e80630f6fb7c6c8
# NUXT_PUBLIC_R2_BUCKET=subastas
# NUXT_PUBLIC_R2_ENDPOINT=https://fcf151aec64668c48e80630f6fb7c6c8.r2.cloudflarestorage.com
# NUXT_PUBLIC_R2_ACCESS_KEY_ID=370acce39ad8087423ee74edf4821037
# NUXT_PUBLIC_R2_SECRET_ACCESS_KEY=2aabc7f8b551ba87d3cf52c3a7222f64df9cf2f4bd69294e9128c3111a7a1a3e
```

**Nota**: Solo necesitas cambiar el nombre del bucket de `repuestos` a `subastas`. Las credenciales y el endpoint son los mismos.

### 4. Configurar Dominio Público (Opcional pero Recomendado)

Para usar un dominio personalizado:

1. En R2, ve a tu bucket
2. Haz clic en **Settings** → **Public Access**
3. Configura un dominio personalizado (ej: `images.tudominio.com`)
4. Actualiza `R2_PUBLIC_URL` en `.env` con tu dominio

### 5. Configurar Lifecycle Policy (Eliminación Automática)

Para eliminar imágenes automáticamente después de 30 días:

1. En R2, ve a tu bucket
2. Haz clic en **Settings** → **Lifecycle Rules**
3. Crea una nueva regla:
   - **Rule name**: `delete-old-images`
   - **Object prefix**: `autos/` y `peritajes/`
   - **Delete objects after**: `30 days`

O usando la API:

```bash
# Ejemplo de configuración de lifecycle (ejecutar desde Cloudflare Workers o API)
```

### 6. Verificar Configuración

Una vez configurado, reinicia el backend:

```bash
cd backend
npm run dev
```

Las imágenes se subirán automáticamente a R2 cuando:
- Un admin o vendedor crea un auto
- Un perito crea/actualiza un peritaje

## Fallback a Almacenamiento Local

Si R2 no está configurado, el sistema automáticamente usará almacenamiento local en `backend/uploads/`. Esto es útil para desarrollo.

## Estructura en R2

```
autoventas-images/
├── autos/
│   ├── 1234567890-123456789-auto-abc123.webp
│   ├── 1234567891-123456790-auto-def456.webp
│   └── ...
└── peritajes/
    ├── 1234567892-123456791-peritaje-xyz789.webp
    └── ...
```

## Costos Estimados

Con 28,000 fotos/mes:
- **Tamaño promedio por foto**: ~500KB (después de WebP)
- **Almacenamiento mensual**: ~14 GB
- **Costo almacenamiento**: $0.21/mes
- **Operaciones (uploads)**: ~28,000 = $0.01/mes
- **Total estimado**: **~$0.22/mes** 🎉

## Eliminación Manual (si es necesario)

Si necesitas eliminar imágenes manualmente, puedes usar:

```javascript
const { deleteFromR2 } = require('./middleware/r2Upload');

// Eliminar una imagen
await deleteFromR2('autos/1234567890-123456789-auto-abc123.webp');
```

## Troubleshooting

### Error: "Access Denied"
- Verifica que las credenciales estén correctas
- Verifica que el bucket existe
- Verifica los permisos del API token

### Error: "Endpoint not found"
- Verifica que `R2_ENDPOINT` tenga el formato correcto
- Debe ser: `https://<account-id>.r2.cloudflarestorage.com`

### Las imágenes no se suben
- Verifica los logs del backend
- Verifica que las variables de entorno estén cargadas
- Si R2 no está configurado, usará almacenamiento local automáticamente

