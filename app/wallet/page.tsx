'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wallet, ArrowLeft, Plus } from 'lucide-react'

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCharge, setShowCharge] = useState(false)
  const [chargeAmount, setChargeAmount] = useState('')
  const [giftCode, setGiftCode] = useState('')

  useEffect(() => {
    loadWallet()
  }, [])

  const loadWallet = async () => {
    try {
      const response = await fetch('/api/wallet')
      const data = await response.json()
      setBalance(data.balance || 0)
      setTransactions(data.transactions || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading wallet:', error)
      setLoading(false)
    }
  }

  const handleCharge = async () => {
    if (!chargeAmount || parseFloat(chargeAmount) <= 0) return
    try {
      const response = await fetch('/api/wallet/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(chargeAmount) }),
      })
      if (response.ok) {
        setChargeAmount('')
        setShowCharge(false)
        loadWallet()
        alert('تمت إضافة المبلغ إلى المحفظة بنجاح')
      }
    } catch (error) {
      console.error('Error charging wallet:', error)
    }
  }

  const handleRedeemGift = async () => {
    if (!giftCode) return
    try {
      const response = await fetch('/api/wallet/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: giftCode }),
      })
      if (response.ok) {
        setGiftCode('')
        loadWallet()
        alert('تم استبدال رمز الهدية بنجاح')
      } else {
        alert('رمز الهدية غير صحيح أو مستخدم بالفعل')
      }
    } catch (error) {
      console.error('Error redeeming gift:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              عودة
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">المحفظة</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-8 text-center">
              <Wallet className="w-8 h-8 mx-auto mb-4 opacity-80" />
              <p className="text-sm opacity-90 mb-2">رصيدك الحالي</p>
              <p className="text-5xl font-bold">{balance}</p>
              <p className="text-sm opacity-90 mt-2">ر.س</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setShowCharge(!showCharge)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                شحن المحفظة
              </Button>
              <div className="bg-card border border-border p-4 rounded-lg">
                <label className="block text-sm font-semibold mb-2">استبدل رمز هدية</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="أدخل رمز الهدية"
                    value={giftCode}
                    onChange={(e) => setGiftCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button onClick={handleRedeemGift} variant="outline">
                    استبدل
                  </Button>
                </div>
              </div>
            </div>

            {/* Charge Form */}
            {showCharge && (
              <div className="bg-card border border-border rounded-lg p-6">
                <label className="block text-sm font-semibold mb-2">أدخل المبلغ المراد شحنه (ر.س)</label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button onClick={handleCharge} className="bg-primary hover:bg-primary/90">
                    إضافة
                  </Button>
                </div>
              </div>
            )}

            {/* Transactions */}
            <div>
              <h2 className="text-xl font-bold mb-4">السجل</h2>
              {transactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">لا توجد معاملات</p>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-card border border-border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {tx.type === 'charge' ? 'شحن محفظة' : 'رمز هدية'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">+{tx.amount} ر.س</p>
                        <p className="text-sm text-muted-foreground">
                          {tx.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
