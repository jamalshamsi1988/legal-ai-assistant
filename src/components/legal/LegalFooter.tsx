import { ShieldAlert } from "lucide-react";

export function LegalFooter() {
  return (
    <footer className="mt-12 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--navy)" }}>
      <div className="container max-w-6xl mx-auto px-4 py-8 text-center">
        <div
          className="inline-flex items-start gap-2 rounded-lg px-4 py-3 text-xs leading-relaxed text-right max-w-3xl"
          style={{ backgroundColor: "var(--navy-dark)", color: "var(--primary-foreground)" }}
        >
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
          <p>
            <strong style={{ color: "var(--gold)" }}>سلب مسئولیت قانونی: </strong>
            خروجی این سامانه توسط هوش مصنوعی تولید می‌شود و صرفاً جنبه اطلاع‌رسانی و آموزشی دارد. این تحلیل
            جایگزین مشاوره با وکیل دادگستری یا کارشناس رسمی نیست. پیش از هر اقدام حقوقی، با وکیل صلاحیت‌دار
            مشورت کنید.
          </p>
        </div>
        <p className="mt-4 text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} دستیار حقوقی هوشمند — مبتنی بر قوانین جمهوری اسلامی ایران
        </p>
      </div>
    </footer>
  );
}
