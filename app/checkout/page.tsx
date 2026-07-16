'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [receiverAccount, setReceiverAccount] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!receiverAccount) {
      alert('الرجاء إدخال حساب المستقبل')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          receiverAccount,
          notes,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        window.location.href = `/orders/${order.id}`
      } else {
        alert('حدث خطأ في إتمام الطلب')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('حدث خطأ في إتمام الطلب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/cart">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              عودة
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">الدفع</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Payment Method */}
          <div>
            <label className="block text-lg font-semibold mb-4">طريقة الدفع</label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="ml-3"
                />
                <span className="text-foreground">المحفظة</span>
              </label>
              <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="ml-3"
                />
                <span className="text-foreground">تحويل بنكي</span>
              </label>
            </div>
          </div>

          {/* Receiver Account */}
          <div>
            <label className="block text-sm font-semibold mb-2">حساب المستقبل</label>
            <input
              type="text"
              placeholder="أدخل رقم الحساب أو البريد الإلكتروني"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2">ملاحظات (اختياري)</label>
            <textarea
              placeholder="أضف أي ملاحظات للطلب"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading ? 'جاري المعالجة...' : 'إتمام الطلب'}
            </Button>
            <Link href="/cart" className="flex-1">
              <Button variant="outline" className="w-full">
                إلغاء
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
