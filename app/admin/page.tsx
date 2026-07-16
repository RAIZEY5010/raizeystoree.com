'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BarChart3, Package, ShoppingCart, Users, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const response = await fetch('/api/admin/check')
        if (response.ok) {
          setIsAdmin(true)
        } else {
          window.location.href = '/'
        }
      } else {
        window.location.href = '/auth/login'
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">لوحة التحكم الإدارية</h1>
          <Button
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
            variant="outline"
          >
            <LogOut className="w-4 h-4 mr-2" />
            خروج
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/products" className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <Package className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">المنتجات</h3>
            <p className="text-sm text-muted-foreground mt-2">إدارة المنتجات والفئات</p>
          </Link>

          <Link href="/admin/orders" className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <ShoppingCart className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">الطلبات</h3>
            <p className="text-sm text-muted-foreground mt-2">إدارة وتتبع الطلبات</p>
          </Link>

          <Link href="/admin/users" className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <Users className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">المستخدمون</h3>
            <p className="text-sm text-muted-foreground mt-2">إدارة حسابات المستخدمين</p>
          </Link>

          <Link href="/admin/analytics" className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <BarChart3 className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">الإحصائيات</h3>
            <p className="text-sm text-muted-foreground mt-2">عرض تقارير المبيعات</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
