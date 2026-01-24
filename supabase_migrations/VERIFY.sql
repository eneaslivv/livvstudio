-- ============================================
-- VERIFICACIÓN DEL SETUP - Ejecutar DESPUÉS de las 3 migraciones
-- ============================================

-- 1. Verificar extensiones instaladas
SELECT * FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto');
-- Deberías ver 2 filas

-- 2. Listar todas las tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
-- Deberías ver 14 tablas

-- 3. Verificar triggers
SELECT 
  trigger_name,
  event_object_table as table_name
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
-- Deberías ver 9 triggers (uno por tabla con updated_at)

-- 4. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
-- Deberías ver ~35 policies

-- 5. Verificar que RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
-- Todas deberían tener rowsecurity = true

-- 6. Contar índices creados
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename;
-- Deberías ver 14 índices personalizados

-- 7. Verificar estructura de profiles
\d profiles
-- O en Supabase UI: Table Editor → profiles

-- 8. Test: Crear un proyecto de prueba (OPCIONAL)
-- Solo si ya creaste tu usuario admin
-- INSERT INTO projects (title, description, status, progress)
-- VALUES ('Test Project', 'Sample project for testing', 'active', 25);

-- 9. Verificar que se puede leer (debería funcionar para admins)
-- SELECT * FROM projects LIMIT 1;

-- ============================================
-- DIAGNÓSTICO DE PROBLEMAS COMUNES
-- ============================================

-- Si RLS bloquea todo, verifica tu rol:
SELECT 
  p.email,
  p.role,
  auth.uid() as current_user_id
FROM profiles p
WHERE p.id = auth.uid();

-- Si no ves tu usuario:
SELECT * FROM auth.users LIMIT 5;

-- Si hay problemas con policies, listar las que fallan:
SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects';

-- ============================================
-- LIMPIEZA (SOLO SI NECESITAS REINICIAR)
-- ============================================
-- CUIDADO: Esto borra TODAS las tablas y datos

-- DROP TABLE IF EXISTS sales_leads CASCADE;
-- DROP TABLE IF EXISTS expenses CASCADE;
-- DROP TABLE IF EXISTS invoices CASCADE;
-- DROP TABLE IF EXISTS activity_log CASCADE;
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS documents CASCADE;
-- DROP TABLE IF EXISTS project_credentials CASCADE;
-- DROP TABLE IF EXISTS clients CASCADE;
-- DROP TABLE IF EXISTS ideas CASCADE;
-- DROP TABLE IF EXISTS milestones CASCADE;
-- DROP TABLE IF EXISTS quick_hits CASCADE;
-- DROP TABLE IF EXISTS tasks CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Luego re-ejecuta las 3 migraciones desde el principio
