import { createClient } from '@/lib/supabase/server'

export async function getUserOrders() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function createOrder(
  items: Array<{ productId: string; quantity: number }>,
  totalAmount: number,
  paymentMethod: string,
  receiverAccount: string,
  notes?: string
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      receiver_account: receiverAccount,
      notes: notes || null,
      status: 'pending',
    })
    .select()
    .single()

  if (orderError) throw orderError

  const orderItemsData = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: 0, // Will be fetched from product
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData)
  if (itemsError) throw itemsError

  // Clear cart
  await supabase.from('cart_items').delete().eq('user_id', user.id)

  return order
}
