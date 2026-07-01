import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Scale, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { WORKSPACES } from "@/data/workspaces";

const renderIcon = (name: string) => {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <Scale className="w-5 h-5" />;
  return <Icon className="w-5 h-5" />;
};

// Categorization map (slug → category key)
const CATEGORY_MAP: Record<string, string> = {
  civil: "core", criminal: "criminal", family: "family", commerce: "business",
  labor: "business", "real-estate": "property", tax: "business", banking: "business",
  insurance: "business", traffic: "criminal", consumer: "business", ip: "specialized",
  cyber: "criminal", media: "specialized", administrative: "admin", military: "criminal",
  medical: "specialized", environment: "specialized", land: "property",
  construction: "property", inheritance: "family", endowment: "family",
  immigration: "international", international: "international", arbitration: "international",
  execution: "admin", notary: "property", registry: "property", transport: "specialized",
  energy: "specialized", mining: "specialized", agriculture: "specialized",
  competition: "business", "capital-market": "business", crypto: "business",
  "data-privacy": "specialized", sports: "specialized", education: "specialized",
  "human-rights": "international", general: "admin",
};

const CATEGORIES: { key: string; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "core", label: "بنیادی" },
  { key: "family", label: "خانواده و ارث" },
  { key: "business", label: "کسب‌وکار و مالی" },
  { key: "property", label: "املاک و ثبت" },
  { key: "criminal", label: "کیفری و امنیت" },
  { key: "specialized", label: "تخصصی" },
  { key: "international", label: "بین‌الملل" },
  { key: "admin", label: "اداری و عمومی" },
];

export function WorkspaceGrid() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim();
    return WORKSPACES.filter((w) => {
      const inCat = category === "all" || CATEGORY_MAP[w.slug] === category;
      if (!inCat) return false;
      if (!q) return true;
      return w.name_fa.includes(q) || w.description.includes(q) || w.slug.includes(q);
    });
  }, [search, category]);

  return (
    <main className="container max-w-6xl mx-auto py-8 md:py-12 px-4">
      <div className="mb-6 text-center md:text-right">
        <div
          className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-3"
          style={{ backgroundColor: "var(--gold-pale)", color: "var(--navy)" }}
        >
          ۴۰ حوزهٔ تخصصی حقوق ایران
        </div>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--navy)" }}>
          حوزهٔ حقوقی خود را انتخاب کنید
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl md:mx-0 mx-auto">
          پاسخ‌ها بر اساس قوانین همان حوزه ارائه می‌شود. برای نتیجهٔ دقیق‌تر، حوزهٔ مرتبط را انتخاب و در صورت نیاز مدارک را بارگذاری کنید.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در حوزه‌ها… (مثلاً مهریه، چک، اجاره)"
          className="w-full border rounded-xl py-3 pr-10 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 font-vazir"
          style={{ backgroundColor: "var(--parchment)", borderColor: "var(--border)" }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            aria-label="پاک کردن"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => {
          const active = category === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className="text-xs font-bold rounded-full px-3 py-1.5 border transition-all"
              style={{
                backgroundColor: active ? "var(--navy)" : "var(--parchment)",
                color: active ? "var(--gold)" : "var(--navy)",
                borderColor: active ? "var(--navy)" : "var(--border)",
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground mb-3">
        {filtered.length} حوزه نمایش داده می‌شود
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((w) => (
          <Link
            key={w.slug}
            to="/workspace/$slug"
            params={{ slug: w.slug }}
            className="group relative bg-card border rounded-xl p-4 hover:shadow-gold hover:-translate-y-0.5 transition-all duration-200 text-right overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="absolute inset-y-0 right-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: "var(--gold)" }}
            />
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                style={{ backgroundColor: "var(--gold-pale)", color: "var(--navy)" }}
              >
                {renderIcon(w.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm leading-snug" style={{ color: "var(--navy)" }}>
                  {w.name_fa}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {w.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-2">حوزه‌ای با این عبارت یافت نشد.</p>
          <button
            onClick={() => { setSearch(""); setCategory("all"); }}
            className="text-sm font-bold underline"
            style={{ color: "var(--gold)" }}
          >
            پاک کردن فیلترها
          </button>
        </div>
      )}
    </main>
  );
}
