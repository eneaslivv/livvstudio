# Production Deployment Checklist

## Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set in Vercel/Production.
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set.
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` is added for analytics.

## Database & Security
- [ ] Run migration `012_secure_rls_policies.sql` to restrict database access.
  - You can run this via Supabase SQL Editor.
- [ ] Verify Row Level Security (RLS) is enabled on all tables.
- [ ] Disable "Enable Email Confirmations" in Supabase Auth settings if creating users manually, or ensure SMTP provider is configured.

## Authentication
- [ ] Ensure `site_url` and `redirect_urls` in Supabase Auth settings match your production domain.
  - Example: `https://your-domain.com`
  - Callback: `https://your-domain.com/auth/callback` (if using OAuth)
- [ ] Create your initial Admin user in Supabase Authentication tab.
- [ ] Create a corresponding entry in `profiles` table with `role: 'admin'` for that user ID.

## Build & Performance
- [ ] Run `npm run build` locally to ensure no type errors.
- [ ] Check console logs for any `force-dynamic` warnings.

## Post-Deploy
- [ ] Log in as Admin and verify redirect to `/admin/dashboard`.
- [ ] Test creating a Task, Idea, and Client in production to verify RLS write access.
- [ ] Check Google Analytics Realtime view to confirm tracking.

## Edge Functions
- [ ] Deploy `invite-client` function:
  ```bash
  supabase functions deploy invite-client
  supabase secrets set RESEND_API_KEY=re_... --project-ref your-project-id
  # SUPABASE_URL and SERVICE_ROLE_KEY are usually auto-injected, but check dashboard
  ```
- [ ] Verify `invite-client` invocation by adding a new Client with "Send Invitation" checked.
