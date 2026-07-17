'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Home, LogOut, Settings, Package, History, Wallet, Users, Zap } from 'lucide-react'

export default function HomePage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }
    getSession()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    window.location.href = '/auth/login'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">RAIZ3Y</h1>
          </div>
          
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button variant="ghost" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  المنتجات
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  السلة
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  حسابي
                </Button>
              </Link>
              <button onClick={handleSignOut}>
                <Button variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  خروج
                </Button>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  دخول
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  تسجيل جديد
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">مرحباً بك في متجر رايز</h2>
          <p className="text-lg text-muted-foreground mb-8">المتجر الإلكتروني الموثوق للتسوق الآمن والسريع</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {session ? (
              <>
                <Link href="/products">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Package className="w-5 h-5 mr-2" />
                    استكشف المنتجات
                  </Button>
                </Link>
                <Link href="/account">
                  <Button size="lg" variant="outline">
                    <Settings className="w-5 h-5 mr-2" />
                    حسابي الشخصي
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    ابدأ التسوق الآن
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline">
                    تسجيل الدخول
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {session && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12 text-foreground">خدماتنا الرئيسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/products" className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Package className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">المنتجات</h4>
                <p className="text-muted-foreground">تصفح مجموعتنا الكاملة من المنتجات الجودة</p>
              </Link>

              <Link href="/wallet" className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Wallet className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">المحفظة</h4>
                <p className="text-muted-foreground">اشحن محفظتك وادفع بسهولة وأمان</p>
              </Link>

              <Link href="/orders" className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <History className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">سجل الطلبات</h4>
                <p className="text-muted-foreground">تابع جميع طلباتك والحالة الحالية لها</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="bg-card py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <p className="text-muted-foreground">منتج متاح</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <p className="text-muted-foreground">عميل سعيد</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99%</div>
              <p className="text-muted-foreground">رضا العملاء</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">دعم متاح</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 متجر رايز RAIZ3Y STORE. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
