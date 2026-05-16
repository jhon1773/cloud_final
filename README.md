# Everwood Cloud - Proyecto Integrador

Plataforma cloud para gestionar conversaciones historicas y generar sugerencias de FAQs para Everwood.

## Funcionalidades implementadas

- Carga de archivo de conversaciones en formatos CSV, JSON y TXT.
- Validacion basica de archivo y campos requeridos.
- Guardado de archivos en cloud storage (Supabase Storage).
- Registro de metadatos por carga en base de datos cloud (Supabase Postgres).
- Historial de cargas en tabla interactiva.
- Vista de detalle de cada carga.
- Generacion automatica de FAQs sugeridas desde el contenido cargado.
- Validacion de FAQs (aprobar/rechazar) desde la interfaz.

## Stack

- Next.js 16 + TypeScript (App Router)
- Supabase Storage + Supabase Database
- Despliegue recomendado: Vercel

## Configuracion local

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo de entorno:

```bash
cp .env.example .env.local
```

3. Completar variables en `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` (tu URL de Supabase)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon key — usado por el cliente para auth)
- `SUPABASE_SERVICE_ROLE_KEY` (service role — solo en servidor, para Storage/DB admin)
- `SUPABASE_BUCKET` (opcional, por defecto `everwood-conversations`)

Nota: **No** publiques `SUPABASE_SERVICE_ROLE_KEY` en el cliente; mantenla en variables de entorno del servidor o en Vercel.

4. Crear tabla y bucket en Supabase ejecutando el script [supabase/schema.sql](supabase/schema.sql).

5. Ejecutar proyecto:

```bash
npm run dev
```

Aplicacion disponible en `http://localhost:3000`.

## Flujo cloud

1. El usuario sube un archivo de conversaciones y diligencia metadatos.
2. La API valida formato y campos.
3. El archivo se almacena en Supabase Storage.
4. Se registran metadatos + FAQs sugeridas en la tabla `uploads`.
5. La interfaz muestra historial y detalle por carga.
6. El usuario valida FAQs sugeridas (aprobada/rechazada).

## Endpoints API

- `POST /api/uploads`: carga archivo y crea registro.
- `GET /api/uploads`: lista historial.
- `GET /api/uploads/:id`: detalle de carga.
- `PATCH /api/uploads/:id`: actualiza estado de FAQ sugerida.

### Autenticación

- La app incluye un flujo de login (email/password) usando Supabase Auth.
- Para habilitarlo, en la consola de Supabase: `Authentication -> Settings` activa `Email` (o el proveedor que uses) y permite signups si quieres.
- Asegúrate de agregar `NEXT_PUBLIC_SUPABASE_ANON_KEY` en Vercel/entorno para que la UI pueda iniciar sesión.

### Comandos útiles

```bash
# desarrollo
npm run dev

# lint
npm run lint

# build para producción
npm run build
```

## Despliegue en Vercel

1. Subir repositorio a GitHub.
2. Importar el repo en Vercel.
3. Configurar variables de entorno en Vercel:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
	- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
	- `SUPABASE_BUCKET`
4. Ejecutar deploy.
5. Verificar flujo completo desde URL publica.

## Evidencias sugeridas para entrega

- URL de despliegue (Vercel o similar).
- URL del repositorio.
- Capturas de:
	- Carga exitosa.
	- Historial con metadatos.
	- Detalle con FAQs sugeridas y validacion.
- Explicacion corta del flujo cloud (Storage + DB + UI).
