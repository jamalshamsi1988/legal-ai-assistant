import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const RED_LINES: { pattern: RegExp; label: string }[] = [
  { pattern: /(ساخت|آموزش|نحوه[‌ ]?ساخت|دستور[‌ ]?ساخت).{0,30}(بمب|مواد منفجره|سلاح|گاز سمی|سم کشنده)/i, label: "ساخت سلاح/مواد منفجره" },
  { pattern: /(تولید|پخت|سنتز|آموزش[‌ ]?تولید).{0,30}(شیشه|متامفتامین|هروئین|کوکائین|تریاک)/i, label: "تولید مواد مخدر" },
  { pattern: /(کودک[‌ ]?آزار|محتوای جنسی.{0,15}کودک|csam)/i, label: "محتوای کودک‌آزاری" },
  { pattern: /(چگونه|آموزش|راه).{0,20}(قتل|ترور|کشتن).{0,30}(کسی|شخص|فرد|انسان)/i, label: "آموزش قتل/ترور" },
];

function checkCompliance(text: string): { blocked: boolean; reason?: string } {
  for (const { pattern, label } of RED_LINES) {
    if (pattern.test(text)) return { blocked: true, reason: label };
  }
  return { blocked: false };
}

const BASE_SYSTEM = `شما یک دستیار حقوقی حرفه‌ای متخصص در حقوق ایران هستید.

کاربر می‌تواند علاوه بر سوال، تصاویر یا اسناد PDF (قراردادها، احکام، نامه‌های رسمی) ارسال کند. این اسناد را با دقت بررسی و در تحلیل خود لحاظ کنید.

پاسخ خود را دقیقاً به فرمت JSON معتبر زیر بدهید، بدون هیچ متن اضافه، بدون markdown و بدون code block:

{
  "summary": "خلاصه پرونده در ۲-۳ جمله",
  "legalBasis": ["ماده قانونی ۱ با شرح مختصر", "ماده قانونی ۲ با شرح مختصر"],
  "analysis": "تحلیل حقوقی دقیق و مستند در چند پاراگراف",
  "nextSteps": ["اقدام ۱", "اقدام ۲", "اقدام ۳"],
  "draft": "پیش‌نویس لایحه رسمی قابل ارائه به دادگاه یا null اگر مناسب نیست"
}

قوانین:
- متن باید رسمی، دقیق و بدون حدس غیرحقوقی باشد.
- از استناد غیرواقعی خودداری کن. فقط مواد قانونی واقعی ایران را ذکر کن.
- اگر اطلاعات ناقص است، در summary بنویس و در nextSteps سوالات تکمیلی بپرس.
- خروجی فقط JSON معتبر باشد.

روش استدلال (در ذهن انجام بده، فقط نتیجه را در JSON بیاور):
۱. شناسایی مسئله حقوقی محوری و طرفین.
۲. استخراج مواد قانونی مرتبط از قوانین مدون ایران.
۳. بررسی تعارضات احتمالی (تعارض مواد، نسخ، تخصیص).
۴. اعمال قاعده بر فاکت‌ها و نتیجه‌گیری.
۵. تعیین اقدام عملی بعدی و در صورت نیاز پیش‌نویس لایحه.`;

const DETAILED_EXTRA = `

دستورالعمل ویژه:
- بخش draft باید یک لایحه/شکایت‌نامه کامل و رسمی با ۲۰۰۰ تا ۳۰۰۰ کلمه باشد.
- شامل: مقدمه، شرح وقایع، استدلالات مفصل با استناد به مواد قانونی، خواسته‌ها، نتیجه‌گیری.
- از قالب رسمی لوایح دادگاه‌های ایران («ریاست محترم دادگاه...، احتراماً...») استفاده کن.
- بخش analysis نیز حداقل ۵۰۰ کلمه باشد.`;

const FileInput = z.object({
  mimeType: z.string(),
  name: z.string(),
  data: z.string(), // base64
});

const HistoryTurn = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(20000),
});

const AnalyzeInput = z.object({
  question: z.string().min(10).max(8000),
  detailed: z.boolean().optional(),
  workspaceSlug: z.string().optional(),
  workspaceName: z.string().optional(),
  files: z.array(FileInput).max(10).optional(),
  history: z.array(HistoryTurn).max(20).optional(),
});

export interface LegalAnalysis {
  summary: string;
  legalBasis: string[];
  analysis: string;
  nextSteps: string[];
  draft: string | null;
  blocked?: boolean;
  block_reason?: string;
}

function safeJsonParse(text: string): Partial<LegalAnalysis> {
  // try direct
  try { return JSON.parse(text); } catch {}
  // try extracting first {...}
  const m = text.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]); } catch {}
  }
  return { analysis: text };
}

export const analyzeLegalQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data }): Promise<LegalAnalysis> => {
    const compliance = checkCompliance(data.question);
    if (compliance.blocked) {
      return {
        summary: "این درخواست با خطوط قرمز قانونی تطبیق داشت و قابل پاسخ‌گویی نیست.",
        legalBasis: [],
        analysis: "",
        nextSteps: [],
        draft: null,
        blocked: true,
        block_reason: compliance.reason,
      };
    }

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("کلید Lovable AI تنظیم نشده است (LOVABLE_API_KEY).");
    }

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-2.5-flash");

    const system = BASE_SYSTEM
      + (data.workspaceName ? `\n\nحوزه تخصصی این مشاوره: «${data.workspaceName}». پاسخ را با تمرکز بر این حوزه تنظیم کن.` : "")
      + (data.detailed ? DETAILED_EXTRA : "");

    const userParts: Array<
      | { type: "text"; text: string }
      | { type: "image"; image: string }
      | { type: "file"; data: string; mediaType: string; filename?: string }
    > = [{ type: "text", text: data.question }];

    for (const f of data.files ?? []) {
      if (f.mimeType.startsWith("image/")) {
        userParts.push({ type: "image", image: `data:${f.mimeType};base64,${f.data}` });
      } else {
        userParts.push({ type: "file", data: f.data, mediaType: f.mimeType, filename: f.name });
      }
    }

    let text = "";
    try {
      const res = await generateText({
        model,
        system,
        messages: [{ role: "user", content: userParts as never }],
        maxOutputTokens: data.detailed ? 8000 : 4000,
      });
      text = res.text ?? "";
    } catch (e: unknown) {
      const err = e as { statusCode?: number; message?: string };
      if (err.statusCode === 429) {
        throw new Error("تعداد درخواست‌ها زیاد است. کمی صبر کنید و دوباره تلاش کنید.");
      }
      if (err.statusCode === 402) {
        throw new Error("اعتبار Lovable AI تمام شده است. لطفاً از طریق تنظیمات Workspace اعتبار اضافه کنید.");
      }
      throw new Error(err.message || "خطا در ارتباط با مدل هوش مصنوعی");
    }

    const parsed = safeJsonParse(text);
    return {
      summary: parsed.summary ?? "",
      legalBasis: Array.isArray(parsed.legalBasis) ? parsed.legalBasis : [],
      analysis: parsed.analysis ?? text,
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
      draft: typeof parsed.draft === "string" ? parsed.draft : null,
    };
  });
