# 🚀 Guía de Setup - Base de Datos Supabase

## ⚡ EJECUCIÓN RÁPIDA (5 minutos)

### Paso 1: Abrir Supabase SQL Editor
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Click en "SQL Editor" en el menú lateral
3. Click en "New Query"

### Paso 2: Ejecutar Migraciones en Orden

**IMPORTANTE**: Ejecuta cada script EN ORDEN, uno por uno.

#### 📄 Migración 1: Base Schema
```bash
Archivo: supabase_migrations/001_base_schema.sql
```
- Copia TODO el contenido
- Pégalo en el SQL Editor
- Click en "Run" (esquina inferior derecha)
- **Espera confirmación**: Deberías ver "Success. No rows returned"

#### 📄 Migración 2: Triggers
```bash
Archivo: supabase_migrations/002_triggers.sql
```
- Repite el proceso anterior
- Espera confirmación

#### 📄 Migración 3: RLS Policies
```bash
Archivo: supabase_migrations/003_rls_policies.sql
```
- Repite el proceso anterior
- Espera confirmación

---

## ✅ Paso 3: Verificación

Ejecuta este query en el SQL Editor para confirmar que todo se creó:

```sql
-- Ver todas las tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Deberías ver 14 tablas**:
- profiles
- projects
- tasks
- quick_hits
- milestones
- ideas
- clients
- project_credentials
- documents
- messages
- activity_log
- invoices
- expenses
- sales_leads

---

## 👤 Paso 4: Crear tu Usuario Admin

### Opción A: Desde Supabase Auth UI (RECOMENDADO)
1. Ve a Authentication → Users
2. Click "Invite User"
3. Ingresa tu email (el que usarás para login con Google)
4. Luego ejecuta este SQL:

```sql
-- Reemplaza 'tu-email@gmail.com' con tu email real
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'tu-email@gmail.com';
```

### Opción B: Crear manualmente
```sql
-- Primero crea el usuario en Auth (desde UI)
-- Luego obtén su UUID y ejecuta:
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  'PEGA-AQUI-EL-UUID-DEL-USUARIO',
  'tu-email@gmail.com',
  'Tu Nombre',
  'admin'
);
```

---

## 🔐 Paso 5: Configurar Google OAuth

1. Ve a Authentication → Providers
2. Habilita "Google"
3. Sigue las instrucciones para obtener:
   - Client ID
   - Client Secret
4. Agrega redirect URL: `https://TU-PROYECTO.supabase.co/auth/v1/callback`

---

## 📦 Paso 6: Crear Storage Bucket (Opcional - Para Vault)

1. Ve a Storage en Supabase
2. Click "New Bucket"
3. Nombre: `project-files`
4. Public: **NO** (dejarlo privado)
5. Click "Create Bucket"

### Configurar Policies del Bucket:
```sql
-- Ejecutar en SQL Editor
-- Admins pueden subir archivos
INSERT INTO storage.policies (name, bucket_id, definition, check)
VALUES (
  'Admins can upload files',
  'project-files',
  '(bucket_id = ''project-files''::text)',
  '(EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ''admin''::text))))'
);

-- Admins pueden ver archivos
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Admins can view files',
  'project-files',
  '((bucket_id = ''project-files''::text) AND (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ''admin''::text)))))'
);
```

---

## 🔧 Paso 7: Variables de Entorno

Crea/actualiza tu archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**Encuentra estos valores en**: Settings → API

---

## 🧪 Paso 8: Prueba

1. Reinicia tu servidor de desarrollo:
```bash
npm run dev
```

2. Intenta hacer login en `/admin/login`
3. Deberías ser redirigido a Google OAuth
4. Después del login, deberías ver el dashboard admin

---

## ❌ Troubleshooting

### Error: "relation profiles already exists"
- Normal si ya existía la tabla
- El script usa `IF NOT EXISTS`, debería pasar sin errores

### Error: "permission denied for schema public"
- Tu usuario no tiene permisos de admin en Supabase
- Ve a Settings → Database → Database password → Reset
- Intenta de nuevo

### Error: "function uuid_generate_v4() does not exist"
- La extensión no se instaló correctamente
- Ejecuta manualmente:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### No puedo hacer login
1. Verifica que Google OAuth esté habilitado
2. Verifica que tu email esté en la tabla `profiles`
3. Verifica que el rol sea 'admin'

---

## 📊 Queries Útiles

### Ver tu perfil:
```sql
SELECT * FROM profiles WHERE email = 'tu-email@gmail.com';
```

### Contar registros por tabla:
```sql
SELECT 
  'projects' as table_name, COUNT(*) as count FROM projects
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'ideas', COUNT(*) FROM ideas
ORDER BY table_name;
```

### Ver todos los admins:
```sql
SELECT email, full_name, created_at 
FROM profiles 
WHERE role = 'admin';
```

---

## ✅ Checklist Final

- [ ] 3 migraciones ejecutadas sin errores
- [ ] 14 tablas verificadas en la BD
- [ ] Usuario admin creado
- [ ] Google OAuth configurado
- [ ] Variables de entorno actualizadas
- [ ] Servidor reiniciado
- [ ] Login exitoso en `/admin/login`
- [ ] Dashboard muestra datos

**¡Todo listo!** 🎉

---

## 📞 Siguiente Paso

Una vez que todo funcione, volvé al análisis del sistema para:
- Inspeccionar módulos restantes
- Configurar KPIs en tiempo real
- Implementar AI Planner
- Conectar Vault con Storage

¿Necesitás ayuda con algún paso? Avisame.
