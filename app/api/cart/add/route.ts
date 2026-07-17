import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { productId, quantity } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('cart_items')
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
          quantity: quantity,
        },
        { onConflict: 'user_id,product_id' }
      )
      .select()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}
