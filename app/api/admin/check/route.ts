import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) throw error

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Not admin' }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error checking admin:', error)
    return NextResponse.json({ error: 'Failed to check admin' }, { status: 500 })
  }
}
