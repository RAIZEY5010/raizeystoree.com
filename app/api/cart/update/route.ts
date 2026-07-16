import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { itemId, quantity } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .eq('user_id', user.id)
      .select()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}
