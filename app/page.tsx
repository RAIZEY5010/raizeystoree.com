'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  ShoppingCart, 
  Home, 
  LogOut, 
  Settings, 
  Menu,
  Search,
  Bell,
  MessageCircle,
  Wallet,
  Gift,
  UserCircle,
  Clock,
  AlertCircle,
  ChevronLeft
} from 'lucide-react'

export default function HomePage() {
  const [session, setSession] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(2)
  const [cartCount, setCartCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      if (session) {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setUser(data)
      }
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
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Right: Menu Button */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-raiz-dim rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>

          {/* Center: Logo */}
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary">RAIZEY</span>
            <span className="text-foreground">STORE</span>
          </h1>

          {/* Left: Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-raiz-dim rounded-lg transition-colors">
              <Search className="w-5 h-5 text-foreground" />
            </button>
            
            <div className="relative">
              <button className="p-2 hover:bg-raiz-dim rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-foreground" />
              </button>
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>

            <div className="relative">
              <Link href="/cart">
                <button className="p-2 hover:bg-raiz-dim rounded-lg transition-colors">
                  <ShoppingCart className="w-5 h-5 text-foreground" />
                </button>
              </Link>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Side Drawer */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg z-40 overflow-y-auto">
            <div className="p-6 border-b border-border">
              <button 
                onClick={() => setSidebarOpen(false)}
                className="mb-4"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              
              {session && user ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <UserCircle className="w-10 h-10 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{user.full_name || 'المستخدم'}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="bg-raiz-dim p-4 rounded-lg mb-4">
                    <p className="text-xs text-muted-foreground mb-1">رصيد المحفظة</p>
                    <p className="text-2xl font-bold text-primary">{user.wallet_balance || 0} SDG</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-2">
              {session && user ? (
                <>
                  <Link href="/">
                    <button className="w-full text-right px-4 py-2 rounded-lg hover:bg-raiz-dim text-foreground transition-colors flex items-center gap-3">
                      <Home className="w-5 h-5" />
                      <span>الرئيسية</span>
                    </button>
                  </Link>
                  
                  <Link href="/cart">
                    <button className="w-full text-right px-4 py-2 rounded-lg hover:bg-raiz-dim text-foreground transition-colors flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5" />
                      <span>السلة</span>
                    </button>
                  </Link>

                  <Link href="/wallet">
                    <button className="w-full text-right px-4 py-2 rounded-lg hover:bg-raiz-dim text-foreground transition-colors flex items-center gap-3">
                      <Wallet className="w-5 h-5" />
                      <span>شحن الرصيد</span>
                    </button>
                  </Link>

                  <Link href="/orders">
                    <button className="w-full text-right px-4 py-2 rounded-lg hover:bg-raiz-dim text-foreground transition-colors flex items-center gap-3">
                      <Clock className="w-5 h-5" />
                      <span>سجل طلباتي</span>
                    </button>
                  </Link>

                  <Link href="/account">
                    <button className="w-full text-right px-4 py-2 rounded-lg hover:bg-raiz-dim text-foreground transition-colors flex items-center gap-3">
                      <Gift className="w-5 h-5" />
                      <span>الإحالات والأرباح</span>
                    </button>
                  </Link>

                  <Link href="/account">
                    <button className="w-full text-right px-4 py-2 rounded-lg hover:bg-raiz-dim text-foreground transition-colors flex items-center gap-3">
                      <Bell className="w-5 h-5" />
                      <span>الإشعارات</span>
                    </button>
                  </Link>

                  <Link href="/account">
                    <button className="w-full text-right px-4 py-2 rounded-lg hover:bg-raiz-dim text-foreground transition-colors flex items-center gap-3">
                      <Settings className="w-5 h-5" />
                      <span>إعدادات الحساب</span>
                    </button>
                  </Link>

                  <Link href="/admin">
                    <button className="w-full text-right px-4 py-2 rounded-lg hover:bg-raiz-dim text-foreground transition-colors flex items-center gap-3">
                      <AlertCircle className="w-5 h-5" />
                      <span>لوحة التحكم</span>
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <button className="w-full px-4 py-2 rounded-lg bg-primary text-white transition-colors hover:bg-primary/90">
                      تسجيل الدخول
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="w-full px-4 py-2 rounded-lg border border-primary text-primary transition-colors hover:bg-primary/5">
                      إنشاء حساب جديد
                    </button>
                  </Link>
                </>
              )}
            </nav>

            {/* Sign Out Button */}
            {session && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-white">
                <button 
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>خروج</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Promotional Banner */}
        <section className="mb-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">عرض خاص هذا الأسبوع</h2>
              <p className="text-white/90">احصل على خصم 20% على كل الشحنات</p>
            </div>
            <Button className="bg-white text-primary hover:bg-white/90">
              تسوق الآن
            </Button>
          </div>
        </section>

        {/* Game Categories */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">تصنيفات الألعاب</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'PUBG Mobile', icon: '🎮' },
              { name: 'Free Fire', icon: '🔥' },
              { name: 'BISS', icon: '⚽' },
              { name: 'Call of Duty', icon: '🎯' }
            ].map((game) => (
              <div key={game.name} className="bg-raiz-dim rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-3">{game.icon}</div>
                <p className="font-semibold text-foreground">{game.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Digital Cards Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">البطاقات الرقمية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-raiz-dim rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
              <p className="font-semibold text-foreground mb-2">بطاقات الألعاب</p>
              <p className="text-muted-foreground text-sm mb-4">شحن فوري وآمن لحسابك</p>
              <Button variant="outline" className="w-full">استكشف المزيد</Button>
            </div>
            <div className="bg-raiz-dim rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
              <p className="font-semibold text-foreground mb-2">البطاقات الهدية</p>
              <p className="text-muted-foreground text-sm mb-4">أرسل هدية لأصدقائك</p>
              <Button variant="outline" className="w-full">استكشف المزيد</Button>
            </div>
            <div className="bg-raiz-dim rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
              <p className="font-semibold text-foreground mb-2">البطاقات المسحوبة</p>
              <p className="text-muted-foreground text-sm mb-4">خصومات وعروض خاصة</p>
              <Button variant="outline" className="w-full">استكشف المزيد</Button>
            </div>
          </div>
        </section>

        {/* Subscriptions Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">الاشتراكات</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary text-white rounded-lg p-4 mb-4 text-center">
                <p className="font-bold text-lg">Netflix</p>
              </div>
              <p className="text-muted-foreground text-sm mb-4">اشتراك شهري غير محدود</p>
              <p className="text-2xl font-bold text-primary mb-4">99 SDG</p>
              <Button className="w-full bg-primary">اشترك الآن</Button>
            </div>
            <div className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary text-white rounded-lg p-4 mb-4 text-center">
                <p className="font-bold text-lg">Spotify</p>
              </div>
              <p className="text-muted-foreground text-sm mb-4">موسيقى وبودكاست غير محدود</p>
              <p className="text-2xl font-bold text-primary mb-4">79 SDG</p>
              <Button className="w-full bg-primary">اشترك الآن</Button>
            </div>
            <div className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary text-white rounded-lg p-4 mb-4 text-center">
                <p className="font-bold text-lg">YouTube Premium</p>
              </div>
              <p className="text-muted-foreground text-sm mb-4">بدون إعلانات وتحميل</p>
              <p className="text-2xl font-bold text-primary mb-4">59 SDG</p>
              <Button className="w-full bg-primary">اشترك الآن</Button>
            </div>
          </div>
        </section>
      </main>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/249" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-20"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 متجر رايز RAIZ3Y STORE. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
