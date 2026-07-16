import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create transaction
    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: user.id,
        amount: amount,
        type: 'charge',
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error charging wallet:', error)
    return NextResponse.json({ error: 'Failed to charge wallet' }, { status: 500 })
  }
}
