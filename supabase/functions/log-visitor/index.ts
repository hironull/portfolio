import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get IP address from headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown'

    const userAgent = req.headers.get('user-agent') || 'unknown'
    const referrer = req.headers.get('referer') || 'direct'

    console.log('Logging visitor:', { ip, userAgent, referrer })

    // Fetch detailed IP geolocation data
    let geoData = {
      country: null,
      city: null,
      region: null,
      zip_code: null,
      isp: null,
      timezone: null,
      latitude: null,
      longitude: null,
    }

    if (ip !== 'unknown') {
      try {
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`)
        if (geoResponse.ok) {
          const data = await geoResponse.json()
          geoData = {
            country: data.country_name || null,
            city: data.city || null,
            region: data.region || null,
            zip_code: data.postal || null,
            isp: data.org || null,
            timezone: data.timezone || null,
            latitude: data.latitude || null,
            longitude: data.longitude || null,
          }
          console.log('Geo data fetched:', geoData)
        }
      } catch (geoError) {
        console.error('Error fetching geo data:', geoError)
      }
    }

    // Insert visitor log with geo data
    const { error } = await supabase
      .from('visitor_logs')
      .insert({
        ip_address: ip,
        user_agent: userAgent,
        referrer: referrer,
        country: geoData.country,
        city: geoData.city,
        region: geoData.region,
        zip_code: geoData.zip_code,
        isp: geoData.isp,
        timezone: geoData.timezone,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
      })

    if (error) {
      console.error('Error logging visitor:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
