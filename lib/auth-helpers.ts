import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function validateAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { 
      authenticated: false, 
      user: null,
      response: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return { authenticated: true, user, response: null }
}
