import { Scale, BookOpen, FileText, ChevronLeft, AlertCircle, Download, ShieldAlert } from "lucide-react";
import { generateLegalPdf } from "@/lib/generatePdf";
import type { LegalAnalysis } from "@/lib/legal-ai.functions";

interface Props extends LegalAnalysis {
  workspaceName?: string;
}

type Accent = "gold" | "navy" | "green" | "red";

function SectionCard({
  icon, title, children, accent = "gold", delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: Accent;
  delay?: number;
}) {
  const bg: Record<Accent, string> = {
    gold: "var(--gold-pale)",
    navy: "var(--secondary)",
    green: "oklch(0.95 0.05 150)",
    red: "oklch(0.95 0.05 25)",
  };
  const iconBg: Record<Accent, string> = {
    gold: "var(--gold)",
    navy: "var(--navy)",
    green: "oklch(0.65 0.18 150)",
    red: "var(--destructive)",
  };
  const iconColor: Record<Accent, string> = {
    gold: "var(--navy)",
    navy: "var(--gold)",
    green: "#fff",
    red: "#fff",
  };
  return (
    <div
      className="rounded-xl border p-5 shadow-legal animate-in fade-in"
      style={{
        backgroundColor: bg[accent],
        borderColor: "var(--border)",
        borderInlineEndWidth: "4px",
        borderInlineEndColor: iconBg[accent],
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg[accent], color: iconColor[accent] }}>
          {icon}
        </div>
        <h3 className="font-bold text-base" style={{ color: "var(--navy)" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function LegalResult(props: Props) {
  const { summary, legalBasis, analysis, nextSteps, draft, blocked, block_reason, workspaceName } = props;

  if (blocked) {
    return (
      <div className="mt-6 rounded-xl border border-destructive p-4 flex items-start gap-3" style={{ backgroundColor: "oklch(0.95 0.05 25)" }}>
        <ShieldAlert className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="text-sm text-destructive">
          <p className="font-bold mb-1">پاسخ مسدود شد</p>
          <p>این درخواست با خطوط قرمز قانونی تطبیق داشت{block_reason ? ` (${block_reason})` : ""} و قابل پاسخ‌گویی نیست.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-end">
        <button
          onClick={() => generateLegalPdf({ summary, legalBasis, analysis, nextSteps, draft, workspaceName })}
          className="flex items-center gap-2 gradient-gold font-bold rounded-xl px-5 py-2.5 shadow-gold hover:opacity-90 transition-all text-sm"
          style={{ color: "var(--navy)" }}
        >
          <Download className="w-4 h-4" />
          دانلود / چاپ PDF
        </button>
      </div>

      <SectionCard icon={<Scale className="w-4 h-4" />} title="خلاصه پرونده" accent="navy" delay={0}>
        <p className="text-foreground leading-relaxed text-sm">{summary || "—"}</p>
      </SectionCard>

      {legalBasis.length > 0 && (
        <SectionCard icon={<BookOpen className="w-4 h-4" />} title="مبانی قانونی مرتبط" accent="gold" delay={100}>
          <ul className="space-y-2">
            {legalBasis.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <ChevronLeft className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard icon={<Scale className="w-4 h-4" />} title="تحلیل حقوقی" accent="navy" delay={200}>
        <p className="leading-relaxed text-sm whitespace-pre-line">{analysis}</p>
      </SectionCard>

      {nextSteps.length > 0 && (
        <SectionCard icon={<AlertCircle className="w-4 h-4" />} title="اقدامات پیشنهادی" accent="green" delay={300}>
          <ol className="space-y-2 list-none">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold" style={{ backgroundColor: "oklch(0.65 0.18 150)" }}>
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

      {draft && (
        <SectionCard icon={<FileText className="w-4 h-4" />} title="پیش‌نویس لایحه رسمی" accent="red" delay={400}>
          <div className="rounded-lg p-4 border" style={{ backgroundColor: "var(--parchment)", borderColor: "var(--border)" }}>
            <pre className="text-sm whitespace-pre-wrap leading-relaxed font-vazir">{draft}</pre>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            این پیش‌نویس جنبه آموزشی دارد. پیش از ارائه به دادگاه با وکیل مشورت کنید.
          </p>
        </SectionCard>
      )}
    </div>
  );
}
