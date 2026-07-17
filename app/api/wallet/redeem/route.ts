import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { code } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find gift code
    const { data: giftCode, error: giftError } = await supabase
      .from('gift_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_used', false)
      .single()

    if (giftError || !giftCode) {
      return NextResponse.json({ error: 'Invalid or used gift code' }, { status: 400 })
    }

    // Mark as used
    const { error: updateError } = await supabase
      .from('gift_codes')
      .update({ is_used: true, used_by: user.id, used_at: new Date() })
      .eq('id', giftCode.id)

    if (updateError) throw updateError

    // Add transaction
    const { error: txError } = await supabase.from('wallet_transactions').insert({
      user_id: user.id,
      amount: giftCode.amount,
      type: 'gift_code',
      reference_code: code,
      status: 'completed',
    })

    if (txError) throw txError

    return NextResponse.json({ success: true, amount: giftCode.amount })
  } catch (error) {
    console.error('Error redeeming gift:', error)
    return NextResponse.json({ error: 'Failed to redeem gift' }, { status: 500 })
  }
}
