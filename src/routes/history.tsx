import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { History, Trash2, ChevronLeft, FileText } from "lucide-react";
import { LegalHeader } from "@/components/legal/LegalHeader";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { LegalResult } from "@/components/legal/LegalResult";
import {
  loadHistory,
  removeHistoryEntry,
  clearHistory,
  type HistoryEntry,
} from "@/lib/history";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "تاریخچه مشاوره‌ها | دستیار حقوقی هوشمند" },
      { name: "description", content: "تاریخچه سوالات و تحلیل‌های حقوقی شما — روی همین دستگاه ذخیره می‌شود." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: HistoryPage,
});

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleString("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return new Date(ts).toISOString();
  }
}

function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const remove = (id: string) => {
    removeHistoryEntry(id);
    setEntries(loadHistory());
    if (openId === id) setOpenId(null);
  };

  const wipe = () => {
    if (!confirm("همه تاریخچه پاک شود؟ این عمل غیرقابل بازگشت است.")) return;
    clearHistory();
    setEntries([]);
    setOpenId(null);
  };

  const active = entries.find((e) => e.id === openId);

  return (
    <div className="min-h-screen flex flex-col">
      <LegalHeader />
      <main className="container max-w-3xl mx-auto py-8 px-4 flex-1 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: "var(--navy)" }}>
            <History className="w-5 h-5" style={{ color: "var(--gold)" }} />
            تاریخچه مشاوره‌ها
          </h2>
          {entries.length > 0 && (
            <button
              onClick={wipe}
              className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 border hover:opacity-80"
              style={{ color: "var(--destructive)", borderColor: "var(--border)" }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              پاک کردن همه
            </button>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          تاریخچه فقط روی همین مرورگر و دستگاه شما ذخیره می‌شود و به سرور ارسال نمی‌شود. حداکثر ۱۰۰ مورد اخیر نگه‌داری می‌گردد.
        </p>

        {entries.length === 0 && (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <FileText className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--gold)" }} />
            <p className="text-sm" style={{ color: "var(--navy)" }}>هنوز مشاوره‌ای ثبت نشده است.</p>
            <Link
              to="/"
              className="inline-block mt-4 text-xs rounded-lg px-4 py-2 gradient-gold font-bold"
              style={{ color: "var(--navy)" }}
            >
              شروع یک مشاوره جدید
            </Link>
          </div>
        )}

        {active && (
          <div className="mb-6 bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 flex items-center justify-between" style={{ backgroundColor: "var(--navy)" }}>
              <div className="text-primary-foreground">
                <p className="text-xs opacity-70">{formatDate(active.createdAt)}{active.workspaceName ? ` — ${active.workspaceName}` : ""}</p>
                <p className="font-bold text-sm mt-1 line-clamp-2">{active.question}</p>
              </div>
              <button
                onClick={() => setOpenId(null)}
                className="text-xs rounded-lg px-3 py-1.5 border"
                style={{ color: "var(--gold)", borderColor: "var(--gold)" }}
              >
                بستن
              </button>
            </div>
            <div className="p-4">
              <LegalResult {...active.result} workspaceName={active.workspaceName} />
            </div>
          </div>
        )}

        <ul className="space-y-3">
          {entries.map((e) => (
            <li
              key={e.id}
              className="bg-card rounded-xl border border-border p-4 flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mb-1">
                  <span>{formatDate(e.createdAt)}</span>
                  {e.workspaceName && (
                    <span className="rounded px-2 py-0.5" style={{ backgroundColor: "var(--gold-pale)", color: "var(--navy)" }}>
                      {e.workspaceName}
                    </span>
                  )}
                  {e.detailed && (
                    <span className="rounded px-2 py-0.5" style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}>
                      لایحه مفصل
                    </span>
                  )}
                </div>
                <p className="text-sm line-clamp-2" style={{ color: "var(--navy)" }}>{e.question}</p>
                {e.result.summary && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{e.result.summary}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setOpenId(e.id === openId ? null : e.id)}
                  className="flex items-center gap-1 text-xs rounded-lg px-2.5 py-1.5 border hover:opacity-80"
                  style={{ color: "var(--navy)", borderColor: "var(--border)" }}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  {e.id === openId ? "بستن" : "نمایش"}
                </button>
                <button
                  onClick={() => remove(e.id)}
                  className="flex items-center gap-1 text-xs rounded-lg px-2.5 py-1.5 border hover:opacity-80"
                  style={{ color: "var(--destructive)", borderColor: "var(--border)" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <LegalFooter />
    </div>
  );
}
