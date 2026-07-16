import { createClient } from '@/lib/supabase/server'

export async function getCartItems() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', user.id)

  if (error) throw error
  return data
}

export async function addToCart(productId: string, quantity: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

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
  return data
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId)

  if (error) throw error
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .select()

  if (error) throw error
  return data
}

export async function clearCart() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id)

  if (error) throw error
}
