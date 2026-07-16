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

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('wallet_balance')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    const { data: transactions, error: txError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (txError) throw txError

    return NextResponse.json({
      balance: profile?.wallet_balance || 0,
      transactions: transactions || [],
    })
  } catch (error) {
    console.error('Error fetching wallet:', error)
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 })
  }
}
