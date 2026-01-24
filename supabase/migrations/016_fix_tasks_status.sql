    -- Fix: Reload Supabase Schema Cache for Tasks Table
    -- Run this in Supabase SQL Editor to force schema refresh

    -- Verify the status column exists
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'tasks' 
            AND column_name = 'status'
        ) THEN
            ALTER TABLE public.tasks ADD COLUMN status TEXT DEFAULT 'pending';
            RAISE NOTICE 'Added status column to tasks table';
        ELSE
            RAISE NOTICE 'Status column already exists in tasks table';
        END IF;
    END $$;

    -- Force schema cache reload by notifying PostgREST
    NOTIFY pgrst, 'reload schema';

    -- Verify the column now exists
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'tasks';
