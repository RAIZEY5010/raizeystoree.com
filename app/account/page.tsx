'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Copy, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadAccount()
  }, [])

  const loadAccount = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (currentUser) {
        setUser(currentUser)

        // Fetch profile
        const response = await fetch('/api/profile')
        const profileData = await response.json()
        setProfile(profileData)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading account:', error)
      setLoading(false)
    }
  }

  const handleCopyReferral = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code)
      alert('تم نسخ رمز الإحالة')
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
          <h1 className="text-2xl font-bold text-foreground">حسابي</h1>
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
            {/* Profile Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">بيانات الحساب</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">البريد الإلكتروني</label>
                  <p className="text-foreground font-semibold">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">الاسم الكامل</label>
                  <p className="text-foreground font-semibold">{profile?.full_name || 'لم يتم التعيين'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">رقم الهاتف</label>
                  <p className="text-foreground font-semibold">{profile?.phone || 'لم يتم التعيين'}</p>
                </div>
              </div>
            </div>

            {/* Referral Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">برنامج الإحالة</h2>
              <p className="text-muted-foreground mb-4">
                شارك رمز الإحالة الخاص بك واحصل على مكافآت عند تسجيل أصدقائك
              </p>
              {profile?.referral_code && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    readOnly
                    value={profile.referral_code}
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none"
                  />
                  <Button variant="outline" onClick={handleCopyReferral}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Link href="/referrals">
                  <Button className="w-full" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    الإحالات
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/orders">
                <Button className="w-full" variant="outline">
                  سجل الطلبات
                </Button>
              </Link>
              <Link href="/wallet">
                <Button className="w-full" variant="outline">
                  المحفظة
                </Button>
              </Link>
              <Link href="/settings">
                <Button className="w-full" variant="outline">
                  الإعدادات
                </Button>
              </Link>
              <Link href="/notifications">
                <Button className="w-full" variant="outline">
                  الإشعارات
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
