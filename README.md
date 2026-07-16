# RAIZ3Y STORE - متجر رايز الإلكتروني

متجر إلكتروني كامل بنظام متقدم للمنتجات والطلبات والمحفظة والإحالات.

## الحالة الحالية للمشروع

### ✅ تم إنجازه:

1. **قاعدة البيانات (Supabase)**
   - ✅ جميع الجداول الأساسية: `user_profiles`, `products`, `categories`, `cart_items`, `orders`, `order_items`, `wallet_transactions`, `gift_codes`, `referrals`, `notifications`, `admin_logs`
   - ✅ Row Level Security (RLS) لجميع الجداول لحماية البيانات
   - ✅ Triggers تلقائية لإنشاء الملفات الشخصية عند التسجيل وتوليد أكواد الإحالة

2. **نظام المصادقة**
   - ✅ تسجيل جديد وتسجيل دخول عبر Supabase Auth
   - ✅ middleware.ts لحماية المسارات
   - ✅ نظام جلسات آمن

3. **الصفحات الرئيسية**
   - ✅ الصفحة الرئيسية (Home)
   - ✅ صفحة المنتجات (Products)
   - ✅ صفحة السلة (Cart) مع إمكانية الإضافة والحذف والتعديل
   - ✅ صفحة الدفع والطلبات (Checkout/Orders)
   - ✅ صفحة المحفظة (Wallet) مع شحن وكود الهدية
   - ✅ صفحة الحساب الشخصي (Account)
   - ✅ لوحة التحكم الإدارية (Admin Dashboard)

4. **API Routes**
   - ✅ GET/POST `/api/cart` - إدارة السلة
   - ✅ POST `/api/checkout` - إتمام الطلب
   - ✅ GET `/api/orders` - سجل الطلبات
   - ✅ GET `/api/wallet` - المحفظة والمعاملات
   - ✅ POST `/api/wallet/charge` - شحن المحفظة
   - ✅ POST `/api/wallet/redeem` - استبدال أكواد الهدية
   - ✅ GET `/api/profile` - بيانات المستخدم
   - ✅ GET `/api/admin/check` - التحقق من صلاحيات الإدارة

5. **التصميم والتنسيق**
   - ✅ ألوان RAIZ3Y (برتقالي #FF7A00 و أسود #1A1A1A)
   - ✅ دعم RTL العربي الكامل
   - ✅ واجهة Dark Mode محسّنة
   - ✅ مكونات shadcn/ui وTailwind CSS
   - ✅ Lucide Icons بدلاً من الـ Emojis

6. **أمان البيانات**
   - ✅ RLS Policies لكل جدول
   - ✅ تشفير كلمات المرور عبر Supabase
   - ✅ حماية المسارات بـ Middleware
   - ✅ Validation على جميع API routes

### ⏳ تحت التطوير (يمكن المتابعة مباشرة):

1. **صفحات الإدارة المتقدمة** (`/admin/*`)
   - إدارة المنتجات والفئات
   - إدارة الطلبات والحالات
   - إدارة المستخدمين والأدوار
   - إحصائيات وتقارير المبيعات
   - إدارة رموز الهدايا

2. **صفحات إضافية للمستخدم**
   - صفحة الإحالات (Referrals) والإحصائيات
   - صفحة الإشعارات (Notifications)
   - صفحة الإعدادات (Settings)
   - صفحة تفاصيل الطلب الفردي

3. **الميزات الإضافية**
   - نظام البحث والتصفية المتقدم
   - نظام التقييمات والتعليقات
   - نظام التنبيهات والإشعارات في الوقت الفعلي
   - تحسين الأداء والـ Caching

4. **الاختبار والتحسينات**
   - اختبارات Unit و Integration
   - تحسين SEO
   - تحسين الأداء (Performance)
   - تطبيق Progressive Web App (PWA)

## البنية الهندسية

```
├── app/
│   ├── auth/              # صفحات المصادقة
│   ├── products/          # صفحة المنتجات
│   ├── cart/              # صفحة السلة
│   ├── checkout/          # صفحة الدفع
│   ├── orders/            # سجل الطلبات
│   ├── wallet/            # المحفظة
│   ├── account/           # الحساب الشخصي
│   ├── admin/             # لوحة التحكم
│   ├── api/               # API Routes
│   ├── layout.tsx         # الـ Layout الرئيسي
│   ├── page.tsx           # الصفحة الرئيسية
│   └── globals.css        # الأنماط العامة
├── lib/
│   ├── supabase/          # عملاء Supabase
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── proxy.ts
│   └── services/          # خدمات قاعدة البيانات
│       ├── products.ts
│       ├── orders.ts
│       ├── cart.ts
│       └── wallet.ts
├── middleware.ts          # Middleware للمسارات المحمية
├── data/
│   └── RAIZ3Y_STORE_Spec-3be119.docx  # مواصفات المشروع الأصلية
└── README.md             # هذا الملف
```

## المتطلبات

- Node.js 18+
- pnpm (أو npm/yarn)
- حساب Supabase
- حساب Vercel (للنشر)

## التثبيت والتشغيل المحلي

```bash
# 1. استنساخ المستودع
git clone https://github.com/RAIZEY5010/raizeystoree.com.git
cd raizeystoree.com

# 2. تثبيت المتعلقات
pnpm install

# 3. إعداد متغيرات البيئة
# انسخ محتوى .env.example إلى .env.local وأضف مفاتيح Supabase الخاصة بك
cp .env.example .env.local

# 4. تشغيل خادم التطوير
pnpm dev

# الموقع يعمل على: http://localhost:3000
```

## متغيرات البيئة

يجب إضافة هذه المتغيرات في `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

## النشر على Vercel

```bash
# الخطوات:
# 1. اربط المستودع بحسابك على Vercel
# 2. أضف متغيرات البيئة في إعدادات Vercel
# 3. Vercel سينشر تلقائياً عند كل push إلى main

# أو من خلال CLI:
# npm install -g vercel
# vercel
```

## الخطوات التالية (للمطورين الآخرين)

1. **إضافة صفحات إدارة متقدمة**
   - انظر `app/admin/page.tsx` كنقطة انطلاق
   - استخدم نفس نمط API Routes الموجود

2. **إضافة ميزات جديدة**
   - اتبع نفس بنية الملفات
   - استخدم Supabase Client من `lib/supabase/client.ts` للعملاء
   - استخدم `lib/supabase/server.ts` للخوادم

3. **إضافة منتجات إلى قاعدة البيانات**
   - استخدم Supabase Dashboard أو أكتب script
   - يجب أن تتضمن: الاسم، الوصف، السعر، الصورة، الفئة

4. **اختبار الميزات**
   - استخدم حساب اختبار على Supabase
   - تحقق من RLS Policies قبل النشر

## قاعدة البيانات

### الجداول الرئيسية:

| الجدول | الوصف |
|--------|-------|
| `user_profiles` | بيانات المستخدمين الموسعة |
| `categories` | فئات المنتجات |
| `products` | المنتجات مع الأسعار والصور |
| `cart_items` | عناصر السلة |
| `orders` | الطلبات |
| `order_items` | تفاصيل الطلبات |
| `wallet_transactions` | معاملات المحفظة |
| `gift_codes` | أكواز الهدايا |
| `referrals` | برنامج الإحالات |
| `notifications` | الإشعارات |
| `admin_logs` | سجلات الإدارة |

## الترخيص

MIT - انظر LICENSE.md

## الدعم

لأي أسئلة أو مشاكل، يرجى فتح issue في المستودع.

---

**تم إنشاؤه بـ:** Next.js 16 + Supabase + Vercel  
**آخر تحديث:** يناير 2025
