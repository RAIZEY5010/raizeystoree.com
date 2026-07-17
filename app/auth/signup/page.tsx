'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12z" />
    </svg>
  )
}

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels = [
    { label: 'ضعيفة', color: 'bg-destructive', width: 'w-1/4' },
    { label: 'متوسطة', color: 'bg-yellow-500', width: 'w-2/4' },
    { label: 'جيدة', color: 'bg-yellow-500', width: 'w-3/4' },
    { label: 'قوية', color: 'bg-green-600', width: 'w-full' },
  ]
  if (password.length === 0) return null
  return levels[Math.min(score, 3)]
}

export default function Page() {
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const strength = getPasswordStrength(password)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      })
      if (error) throw error
      setStep('otp')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الحساب')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      })
      if (error) throw error
      router.push('/')
      router.refresh()
    } catch (error: unknown) {
      setError('رمز التحقق غير صحيح، حاول مرة أخرى')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    const supabase = createClient()
    setError(null)
    setInfo(null)
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email })
      if (error) throw error
      setInfo('تم إرسال رمز جديد إلى بريدك الإلكتروني')
    } catch {
      setError('تعذر إرسال الرمز، حاول لاحقاً')
    }
  }

  const handleSocialSignUp = async (provider: 'google' | 'facebook') => {
    const supabase = createClient()
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch {
      setError('تعذر التسجيل، حاول مرة أخرى')
    }
  }

  return (
    <div
      className="flex min-h-svh w-full items-center justify-center p-6 bg-background"
      dir="rtl"
    >
      <div className="w-full max-w-sm">
        <Card className="bg-white border-border">
          <CardHeader className="text-center">
            <h1 className="text-xl font-bold mb-1">
              <span className="text-primary">RAIZEY</span>{' '}
              <span className="text-foreground">STORE</span>
            </h1>
            {step === 'form' ? (
              <>
                <CardTitle className="text-2xl text-foreground">إنشاء حساب جديد</CardTitle>
                <CardDescription>أنشئ حسابك للبدء بالتسوق والشحن</CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl text-foreground">تفعيل الحساب</CardTitle>
                <CardDescription>
                  أدخل رمز التحقق المكون من 6 أرقام المرسل إلى
                  <br />
                  <span dir="ltr" className="font-medium text-foreground">{email}</span>
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {step === 'form' ? (
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">اسم المستخدم الكامل</Label>
                    <Input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {strength && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {strength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'جارٍ الإنشاء...' : 'إنشاء حساب'}
                  </Button>
                </div>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-muted-foreground">أو سجل عبر</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handleSocialSignUp('google')}
                  >
                    <GoogleIcon />
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handleSocialSignUp('facebook')}
                  >
                    <FacebookIcon />
                    Facebook
                  </Button>
                </div>

                <div className="mt-5 text-center text-sm text-muted-foreground">
                  لديك حساب بالفعل؟{' '}
                  <Link href="/auth/login" className="text-primary font-medium hover:underline">
                    تسجيل الدخول
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="otp">رمز التحقق</Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      dir="ltr"
                      placeholder="000000"
                      className="text-center text-lg tracking-[0.5em]"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}
                  {info && (
                    <p className="text-sm text-green-700 bg-green-600/10 rounded-lg px-3 py-2">
                      {info}
                    </p>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? 'جارٍ التفعيل...' : 'تفعيل الحساب'}
                  </Button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-primary hover:underline"
                  >
                    إعادة إرسال الرمز
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
