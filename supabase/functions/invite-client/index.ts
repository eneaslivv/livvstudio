import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { email, name, role } = await req.json()

        // 1. Generate Access Key
        const accessKey = Math.random().toString(36).slice(-10).toUpperCase();

        // 2. Create User in Supabase Auth
        const { data: user, error: createError } = await supabase.auth.admin.createUser({
            email: email,
            password: accessKey,
            email_confirm: true,
            user_metadata: { name, role }
        })

        if (createError) {
            // If user already exists, maybe just reset password? For now, throw error.
            throw createError
        }

        // 3. Send Email via Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Livv Portal <portal@livvv.com>', // Ensure domain is verified
                to: [email],
                subject: 'Your Access to Livv Client Portal',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
               <h1 style="font-size: 24px; font-weight: 800; letter-spacing: -1px;">LIVV STUDIO</h1>
            </div>
            
            <p>Hello ${name},</p>
            <p>A secure client portal has been initialized for you. You can access your project dashboard, documents, and messaging using the credentials below.</p>
            
            <div style="background: #f4f4f5; padding: 20px; border-radius: 12px; margin: 30px 0; border: 1px solid #e4e4e7;">
              <p style="margin: 5px 0; font-size: 12px; text-transform: uppercase; color: #71717a; font-weight: 700;">Client Login</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              
              <div style="margin-top: 15px;">
                 <p style="margin: 5px 0; font-size: 12px; text-transform: uppercase; color: #71717a; font-weight: 700;">Access Key</p>
                 <code style="display: block; background: #fff; padding: 10px; border-radius: 6px; border: 1px solid #e4e4e7; font-size: 16px; font-weight: bold; letter-spacing: 2px;">${accessKey}</code>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="https://livvv-new-landing.vercel.app/portal/login" style="display: inline-block; background: #18181b; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 14px;">Enter Client Portal</a>
            </div>
            
            <p style="margin-top: 40px; font-size: 12px; color: #71717a; text-align: center;">
              If you didn't expect this invitation, please ignore this email.
            </p>
          </div>
        `,
            }),
        })

        if (!res.ok) {
            const data = await res.json()
            throw new Error(`Resend Error: ${JSON.stringify(data)}`)
        }

        return new Response(JSON.stringify({ success: true, userId: user.user.id }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
