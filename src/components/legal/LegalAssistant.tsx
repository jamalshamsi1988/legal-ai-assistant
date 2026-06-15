import { useState } from "react";
import { Send, Loader2, RotateCcw, HelpCircle, FileText, MessageCirclePlus } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { analyzeLegalQuestion, type LegalAnalysis } from "@/lib/legal-ai.functions";
import { FileUploadZone, type UploadedFile } from "./FileUploadZone";
import { LegalResult } from "./LegalResult";

type HistoryTurn = { role: "user" | "assistant"; content: string };

const EXAMPLES = [
  "صاحب‌خانه‌ام بدون اطلاع قبلی قرارداد اجاره را فسخ کرده و مهلت تخلیه داده. آیا این کار قانونی است؟",
  "کارفرمایم بدون دلیل موجه اخراجم کرده و حقوق معوقه پرداخت نکرده. چه اقدامی کنم؟",
  "در تصادف رانندگی طرف مقابل مقصر بود اما از پرداخت خسارت امتناع می‌کند.",
];

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const res = r.result as string;
      resolve(res.split(",")[1]);
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });

interface Props {
  workspaceSlug?: string;
  workspaceName?: string;
}

export function LegalAssistant({ workspaceSlug, workspaceName }: Props) {
  const analyze = useServerFn(analyzeLegalQuestion);
  const [question, setQuestion] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LegalAnalysis | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryTurn[]>([]);
  const [followUp, setFollowUp] = useState("");

  const submit = async (detailed: boolean) => {
    if (question.trim().length < 15) {
      setError("لطفاً سوال خود را به طور کامل (حداقل ۱۵ کاراکتر) بنویسید.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const filesPayload = await Promise.all(
        files.map(async (uf) => ({
          mimeType: uf.file.type,
          name: uf.file.name,
          data: await fileToBase64(uf.file),
        })),
      );
      const data = await analyze({
        data: {
          question,
          detailed,
          workspaceSlug,
          workspaceName,
          files: filesPayload.length ? filesPayload : undefined,
        },
      });
      setResult(data);
      setHistory([
        { role: "user", content: question },
        { role: "assistant", content: JSON.stringify(data) },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "خطا در تحلیل سوال";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const submitFollowUp = async () => {
    if (followUp.trim().length < 10) {
      setError("سوال پیگیری باید حداقل ۱۰ کاراکتر باشد.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await analyze({
        data: {
          question: followUp,
          workspaceSlug,
          workspaceName,
          history,
        },
      });
      setResult(data);
      setHistory((h) => [
        ...h,
        { role: "user", content: followUp },
        { role: "assistant", content: JSON.stringify(data) },
      ]);
      setFollowUp("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "خطا در تحلیل سوال";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setQuestion("");
    files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
    setFiles([]);
    setResult(null);
    setError("");
    setHistory([]);
    setFollowUp("");
  };


  return (
    <main className="container max-w-3xl mx-auto py-8 px-4">
      <div className="bg-card rounded-2xl shadow-legal-lg border border-border overflow-hidden">
        <div className="p-4 md:p-5" style={{ backgroundColor: "var(--navy)" }}>
          <h2 className="text-primary-foreground font-bold text-base flex items-center gap-2">
            <HelpCircle className="w-5 h-5" style={{ color: "var(--gold)" }} />
            سوال حقوقی خود را مطرح کنید
          </h2>
          <p className="text-primary-foreground/60 text-xs mt-1">
            هرچه کامل‌تر توضیح دهید، تحلیل دقیق‌تر خواهد بود. می‌توانید مدارک را نیز ضمیمه کنید.
          </p>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          {!result && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">نمونه سوالات:</p>
              <div className="flex flex-col gap-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuestion(ex); setError(""); }}
                    className="text-right text-xs rounded-lg px-3 py-2 leading-relaxed border transition-colors"
                    style={{ color: "var(--navy)", backgroundColor: "var(--gold-pale)", borderColor: "var(--gold)" }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <textarea
              value={question}
              onChange={(e) => { setQuestion(e.target.value); if (error) setError(""); }}
              placeholder="سوال حقوقی خود را اینجا بنویسید..."
              className="w-full min-h-[160px] border rounded-xl p-4 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all font-vazir"
              style={{ backgroundColor: "var(--parchment)", borderColor: "var(--border)" }}
              disabled={loading}
            />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-muted-foreground">{question.length} کاراکتر</span>
              {error && <span className="text-xs text-destructive">{error}</span>}
            </div>
          </div>

          <FileUploadZone files={files} onFilesChange={setFiles} disabled={loading} />

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={() => submit(false)}
                disabled={loading || !question.trim()}
                className="flex-1 flex items-center justify-center gap-2 gradient-gold font-bold rounded-xl px-5 py-3 shadow-gold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                style={{ color: "var(--navy)" }}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> در حال تحلیل...</> : <><Send className="w-4 h-4" /> تحلیل حقوقی{files.length > 0 ? ` (${files.length} فایل)` : ""}</>}
              </button>
              {(result || question || files.length > 0) && (
                <button
                  onClick={reset}
                  className="flex items-center gap-2 border rounded-xl px-4 py-3 text-sm transition-colors"
                  style={{ backgroundColor: "var(--secondary)", color: "var(--navy)", borderColor: "var(--border)" }}
                >
                  <RotateCcw className="w-4 h-4" />
                  پاک کردن
                </button>
              )}
            </div>
            <button
              onClick={() => submit(true)}
              disabled={loading || !question.trim()}
              className="w-full flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-3 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm border-2"
              style={{ backgroundColor: "var(--navy)", color: "var(--primary-foreground)", borderColor: "var(--gold)" }}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> در حال تحلیل ویژه...</> : <><FileText className="w-4 h-4" style={{ color: "var(--gold)" }} /> تحلیل ویژه — لایحه مفصل (۲۰۰۰–۳۰۰۰ کلمه)</>}
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
              <div className="h-4 bg-muted rounded w-40 mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="h-3 bg-muted rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {result && !loading && <LegalResult {...result} workspaceName={workspaceName} />}

      {result && !loading && (
        <div className="mt-6 bg-card rounded-2xl shadow-legal border border-border overflow-hidden">
          <div className="p-3" style={{ backgroundColor: "var(--gold-pale)" }}>
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--navy)" }}>
              <MessageCirclePlus className="w-4 h-4" style={{ color: "var(--gold)" }} />
              سوال پیگیری در همین زمینه
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              برای دریافت توضیح بیشتر یا طرح ابهام، سوال بعدی خود را بپرسید. تاریخچه فقط در همین جلسه نگه‌داری می‌شود.
            </p>
          </div>
          <div className="p-4 space-y-3">
            <textarea
              value={followUp}
              onChange={(e) => { setFollowUp(e.target.value); if (error) setError(""); }}
              placeholder="مثلاً: اگر طرف مقابل پاسخ نداد چه کنم؟"
              className="w-full min-h-[90px] border rounded-xl p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 font-vazir"
              style={{ backgroundColor: "var(--parchment)", borderColor: "var(--border)" }}
              disabled={loading}
            />
            <button
              onClick={submitFollowUp}
              disabled={loading || !followUp.trim()}
              className="w-full flex items-center justify-center gap-2 gradient-gold font-bold rounded-xl px-5 py-2.5 shadow-gold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              style={{ color: "var(--navy)" }}
            >
              <Send className="w-4 h-4" />
              ارسال سوال پیگیری
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
