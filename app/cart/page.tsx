'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowLeft, ShoppingCart } from 'lucide-react'

export default function CartPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()
      setItems(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading cart:', error)
      setLoading(false)
    }
  }

  const handleRemove = async (itemId: string) => {
    try {
      await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })
      loadCart()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) return
    try {
      await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      })
      loadCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const totalPrice = items.reduce((sum, item) => sum + item.products.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              عودة
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">السلة</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg mb-6">السلة فارغة</p>
            <Link href="/products">
              <Button size="lg">متابعة التسوق</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                    {item.products.image_url && (
                      <div className="w-24 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.products.name}
                      </h3>
                      <p className="text-primary text-lg font-bold mb-3">
                        {item.products.price} ر.س
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 border border-border rounded hover:bg-muted"
                        >
                          -
                        </button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 border border-border rounded hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20">
              <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-foreground">
                  <span>عدد المنتجات:</span>
                  <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>الإجمالي:</span>
                  <span>{totalPrice} ر.س</span>
                </div>
              </div>
              <Link href="/checkout" className="w-full">
                <Button className="w-full mb-2">
                  متابعة للدفع
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full">
                  متابعة التسوق
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
