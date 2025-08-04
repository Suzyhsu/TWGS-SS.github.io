import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Registration endpoint
app.post('/make-server-08513f05/register', async (c) => {
  try {
    const body = await c.req.json()
    const { programId, userData } = body

    if (!programId || !userData) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Validate required user data
    const { name, email, phone, company, experience } = userData
    if (!name || !email || !phone) {
      return c.json({ error: 'Name, email, and phone are required' }, 400)
    }

    // Generate unique registration ID
    const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Store registration data
    const registrationData = {
      id: registrationId,
      programId,
      userData: {
        name,
        email,
        phone,
        company: company || '',
        experience: experience || 'beginner'
      },
      registeredAt: new Date().toISOString(),
      status: 'pending'
    }

    await kv.set(`registration:${registrationId}`, JSON.stringify(registrationData))
    
    // Also store by email for lookup
    await kv.set(`registration_by_email:${email}`, registrationId)

    console.log(`Registration created: ${registrationId} for program: ${programId}`)
    
    return c.json({ 
      success: true, 
      registrationId,
      message: 'Registration successful! You will receive a confirmation email soon.' 
    })
  } catch (error) {
    console.log(`Registration error: ${error}`)
    return c.json({ error: 'Internal server error during registration' }, 500)
  }
})

// Get user registrations
app.get('/make-server-08513f05/registrations/:email', async (c) => {
  try {
    const email = c.req.param('email')
    
    const registrationId = await kv.get(`registration_by_email:${email}`)
    if (!registrationId) {
      return c.json({ registrations: [] })
    }

    const registrationData = await kv.get(`registration:${registrationId}`)
    if (!registrationData) {
      return c.json({ registrations: [] })
    }

    return c.json({ 
      registrations: [JSON.parse(registrationData)] 
    })
  } catch (error) {
    console.log(`Get registrations error: ${error}`)
    return c.json({ error: 'Error fetching registrations' }, 500)
  }
})

// Get all registrations (admin endpoint)
app.get('/make-server-08513f05/admin/registrations', async (c) => {
  try {
    const registrationKeys = await kv.getByPrefix('registration:')
    const registrations = registrationKeys
      .filter(item => item.key.startsWith('registration:reg_'))
      .map(item => JSON.parse(item.value))
      .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())

    return c.json({ registrations })
  } catch (error) {
    console.log(`Get all registrations error: ${error}`)
    return c.json({ error: 'Error fetching all registrations' }, 500)
  }
})

// Get program statistics
app.get('/make-server-08513f05/admin/stats', async (c) => {
  try {
    const registrationKeys = await kv.getByPrefix('registration:')
    const registrations = registrationKeys
      .filter(item => item.key.startsWith('registration:reg_'))
      .map(item => JSON.parse(item.value))

    const stats = {
      totalRegistrations: registrations.length,
      byProgram: {},
      byExperience: {},
      recentRegistrations: registrations
        .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
        .slice(0, 5)
    }

    // Count by program
    registrations.forEach(reg => {
      stats.byProgram[reg.programId] = (stats.byProgram[reg.programId] || 0) + 1
    })

    // Count by experience level
    registrations.forEach(reg => {
      const exp = reg.userData.experience || 'beginner'
      stats.byExperience[exp] = (stats.byExperience[exp] || 0) + 1
    })

    return c.json(stats)
  } catch (error) {
    console.log(`Get stats error: ${error}`)
    return c.json({ error: 'Error fetching statistics' }, 500)
  }
})

Deno.serve(app.fetch)