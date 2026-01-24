-- EJECUTÁ ESTO EN SUPABASE Y PEGAME EL RESULTADO COMPLETO

-- 1. Listar todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Ver columnas de quick_hits
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quick_hits'
ORDER BY ordinal_position;

-- 3. Ver columnas de ideas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'ideas'
ORDER BY ordinal_position;

-- 4. Ver columnas de tasks
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'tasks'
ORDER BY ordinal_position;

-- 5. Ver columnas de projects
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'projects'
ORDER BY ordinal_position;

-- 6. Ver columnas de profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 7. Ver todas las políticas existentes
SELECT tablename, policyname
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
