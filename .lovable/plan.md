
# پورت «Legal Aide Persian» به پروژه فعلی (بدون احراز هویت)

ریپازیتوری GitHub با استک قدیمی (Vite + react-router-dom + Supabase Edge Functions) ساخته شده، اما پروژه فعلی Lovable روی **TanStack Start + Tailwind v4** است. کد را عیناً کپی نمی‌کنیم؛ ساختار را به استک فعلی پورت می‌کنیم و طبق درخواست شما **تمام لایه‌های Auth/Admin/RBAC/Workspaces خصوصی/Audit حذف می‌شود** و هر بازدیدکننده‌ای بدون لاگین به‌صورت رایگان از تحلیل حقوقی استفاده می‌کند.

## دامنه این فاز (Phase 1 — MVP عمومی)

### چیزی که ساخته می‌شود
1. **Design system فارسی/RTL** در `src/styles.css`: پالت Navy/Gold، فونت Vazirmatn، direction RTL، توکن‌های `--navy/--gold/--parchment` به‌صورت `oklch` (Tailwind v4).
2. **صفحه اصلی `/`** — هدر Navy/Gold + گرید انتخاب «حوزه حقوقی» (۴۰ workspace به‌صورت ثابت در فایل `src/data/workspaces.ts` — بدون دیتابیس).
3. **صفحه `/workspace/$slug`** — فرم سوال + آپلود فایل (تصویر/PDF) + دکمه «تحلیل» و «تحلیل ویژه (۲۰۰۰–۳۰۰۰ کلمه)».
4. **Server Function `analyzeLegalQuestion`** در `src/lib/legal-ai.functions.ts` که مستقیماً به **Lovable AI Gateway** (`google/gemini-2.5-flash` برای پاسخ، `gemini-embedding-001` فقط بعداً برای RAG) وصل می‌شود. شامل:
   - Guardrail / Compliance Filter (خطوط قرمز فارسی)
   - Chain-of-Thought system prompt
   - حالت `detailed` برای لایحه مفصل
   - خروجی JSON ساختاریافته
5. **نمایش نتیجه** با کارت‌های «خلاصه / مبانی قانونی / تحلیل / اقدامات / پیش‌نویس لایحه» + دکمه **دانلود PDF** (با pdf-lib + فونت Vazirmatn).
6. **حذف کامل** هر چیز مربوط به `Auth`, `ProtectedRoute`, `useAuth`, `AdminCorpus`, `AdminAudit`, `AdminRelations`. هیچ روتی پشت لاگین نیست.

### چیزی که در این فاز ساخته **نمی‌شود** (به فاز بعد موکول)
- پایگاه دانش برداری (Vector DB / pgvector) و RAG واقعی روی متن قوانین
- گراف روابط حقوقی (Legal Relations Graph)
- ذخیره تاریخچه چت / آپلودها در دیتابیس
- پنل مدیریت دانش (Corpus admin) — چون auth حذف شده، پنلی هم وجود ندارد

> دلیل: کاربر تأیید کرد «هر کسی رایگان استفاده کند». نگه‌داشتن RAG/Graph بدون auth، هزینه پردازشی و امنیتی بالایی روی Lovable AI Gateway می‌گذارد. اول MVP عمومی، سپس RAG.

## معماری فنی

```text
Browser (RTL fa-IR)
   │
   ├── /                       → src/routes/index.tsx              (Workspace grid)
   ├── /workspace/$slug        → src/routes/workspace.$slug.tsx    (Legal assistant)
   │
   ▼
createServerFn  ───────────►  src/lib/legal-ai.functions.ts
                                    │
                                    ├── checkCompliance(text)         [محلی]
                                    ├── buildSystemPrompt(detailed)   [محلی]
                                    └── fetch ai.gateway.lovable.dev  [LOVABLE_API_KEY]
```

- `LOVABLE_API_KEY` از طریق Lovable AI Gateway به‌صورت خودکار تأمین می‌شود.
- فایل‌ها در مرورگر به base64 تبدیل و به مدل multimodal Gemini ارسال می‌شوند.
- هیچ نوشتنی در دیتابیس وجود ندارد ⇒ نیازی به Lovable Cloud / RLS / migrations نیست.

## فایل‌هایی که ساخته/تغییر می‌کنند

| مسیر | کار |
|---|---|
| `src/styles.css` | پالت Navy/Gold، فونت Vazirmatn، RTL، توکن‌های oklch |
| `src/data/workspaces.ts` | فهرست ثابت ۴۰ حوزه حقوقی (slug, name_fa, description, icon) |
| `src/components/LegalHeader.tsx` | هدر Navy با gradient طلایی — بدون دکمه‌های لاگین/ادمین |
| `src/components/WorkspaceGrid.tsx` | گرید + جستجو در حوزه‌ها |
| `src/components/LegalAssistant.tsx` | فرم سوال + آپلود + دو دکمه تحلیل |
| `src/components/FileUploadZone.tsx` | drag-drop تصویر/PDF با preview |
| `src/components/LegalResult.tsx` | کارت‌های نتیجه + دانلود PDF |
| `src/lib/legal-ai.functions.ts` | `createServerFn` تحلیل حقوقی |
| `src/lib/generatePdf.ts` | تولید PDF فارسی |
| `src/routes/index.tsx` | جایگزینی placeholder با WorkspaceGrid |
| `src/routes/workspace.$slug.tsx` | روت داینامیک workspace |
| `src/routes/__root.tsx` | metadata فارسی (title, description, lang="fa", dir="rtl") |

## نکات تأیید قبل از کدنویسی

1. **حوزه‌های ۴۰گانه**: لیست ثابت داخل کد (Phase 1) یا به دیتابیس انتقال یابد؟ پیش‌فرض: ثابت در کد.
2. **آپلود فایل بدون auth**: حجم به ازای هر درخواست محدود به ~۱۰ مگابایت می‌شود تا سوءاستفاده نشود.
3. **بدون Rate Limit**: اگر دسترسی واقعاً برای «هر کسی» باز است، اپ در معرض abuse رایگان روی AI Gateway قرار می‌گیرد. در Phase 1 بدون محدودیت پیش می‌رویم؛ اگر هزینه‌ها بالا رفت، در فاز بعد یک rate-limit ساده مبتنی بر IP اضافه می‌کنیم.

با تأیید این پلن، Phase 1 را به‌صورت کامل پیاده می‌کنم.
