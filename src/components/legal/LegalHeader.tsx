import { Link } from "@tanstack/react-router";
import { Scale, Gavel, BookOpen, Shield, History } from "lucide-react";
import legalHero from "@/assets/legal-hero.jpg";

export function LegalHeader() {
  return (
    <header className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${legalHero})` }}
        aria-hidden
      />
      <div className="absolute inset-0 gradient-hero opacity-95" aria-hidden />
      <div className="relative container max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
        <div className="absolute top-3 left-3">
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 border backdrop-blur-sm"
            style={{ color: "var(--gold)", borderColor: "var(--gold)", backgroundColor: "rgba(0,0,0,0.15)" }}
          >
            <History className="w-3.5 h-3.5" />
            تاریخچه
          </Link>
        </div>
        <Link to="/" className="inline-flex items-center justify-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center shadow-gold">
            <Scale className="w-7 h-7" style={{ color: "var(--navy)" }} />
          </div>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
          دستیار حقوقی هوشمند
        </h1>
        <p className="mt-3 text-sm md:text-base text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
          تحلیل حقوقی فوری بر اساس قوانین ایران — رایگان، بدون نیاز به ثبت‌نام
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-primary-foreground/70">
          <span className="flex items-center gap-1.5"><Gavel className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} /> ۴۰ حوزه تخصصی</span>
          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} /> استناد به قوانین مدون</span>
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} /> محرمانه و ایمن</span>
        </div>
      </div>
    </header>
  );
}
