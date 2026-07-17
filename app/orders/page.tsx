'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading orders:', error)
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'processing':
        return 'text-blue-600'
      case 'pending':
        return 'text-yellow-600'
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'قيد الانتظار',
      processing: 'قيد المعالجة',
      completed: 'مكتملة',
      cancelled: 'ملغاة',
    }
    return labels[status] || status
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
          <h1 className="text-2xl font-bold text-foreground">سجل الطلبات</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg mb-6">لا توجد طلبات حتى الآن</p>
            <Link href="/products">
              <Button>ابدأ التسوق</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">رقم الطلب</p>
                      <p className="font-mono text-sm text-foreground">{order.id.slice(0, 8)}</p>
                    </div>
                    <div className={`font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">التاريخ</p>
                      <p className="text-foreground font-semibold">
                        {new Date(order.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">المبلغ</p>
                      <p className="text-primary font-bold">{order.total_amount} ر.س</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">عدد المنتجات</p>
                      <p className="text-foreground font-semibold">
                        {order.order_items?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">طريقة الدفع</p>
                      <p className="text-foreground font-semibold">
                        {order.payment_method || 'محفظة'}
                      </p>
                    </div>
                  </div>

                  <Button variant="ghost" className="ml-auto">
                    عرض التفاصيل
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
