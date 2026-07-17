import { createClient } from '@/lib/supabase/server'

export async function getUserWallet() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_profiles')
    .select('wallet_balance')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function getWalletTransactions() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function chargeWallet(amount: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

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
  return data
}

export async function redeemGiftCode(code: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Find gift code
  const { data: giftCode, error: giftError } = await supabase
    .from('gift_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_used', false)
    .single()

  if (giftError) throw new Error('رمز الهدية غير صحيح أو مستخدم بالفعل')

  // Mark as used
  const { error: updateError } = await supabase
    .from('gift_codes')
    .update({ is_used: true, used_by: user.id, used_at: new Date() })
    .eq('id', giftCode.id)

  if (updateError) throw updateError

  // Add transaction
  await supabase.from('wallet_transactions').insert({
    user_id: user.id,
    amount: giftCode.amount,
    type: 'gift_code',
    reference_code: code,
    status: 'completed',
  })

  // Update wallet balance
  const { error: walletError } = await supabase.rpc('add_wallet_balance', {
    p_user_id: user.id,
    p_amount: giftCode.amount,
  })

  if (walletError && walletError.code !== 'PGRST204') throw walletError

  return giftCode.amount
}
