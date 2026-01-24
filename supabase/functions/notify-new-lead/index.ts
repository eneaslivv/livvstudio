import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
    try {
        const { name, email, message, created_at } = await req.json()

        // Send email via Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Livv Contact Form <no-reply@livvv.com>',
                to: ['eneas@livvv.com'], // Replace with your email
                subject: `🎯 New Lead: ${name}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #C4A35A; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date(created_at).toLocaleString()}</p>
            </div>
            <div style="background: #fff; padding: 20px; border-left: 4px solid #C4A35A; margin: 20px 0;">
              <p style="margin: 0;"><strong>Message:</strong></p>
              <p style="margin: 10px 0; line-height: 1.6;">${message}</p>
            </div>
            <p style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              View this lead in your <a href="https://livvv.com/admin/crm" style="color: #C4A35A;">CRM Dashboard</a>
            </p>
          </div>
        `,
            }),
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(JSON.stringify(data))
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
