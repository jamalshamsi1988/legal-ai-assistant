import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Scale } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { WORKSPACES } from "@/data/workspaces";

const renderIcon = (name: string) => {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <Scale className="w-6 h-6" />;
  return <Icon className="w-6 h-6" />;
};

export function WorkspaceGrid() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return WORKSPACES;
    return WORKSPACES.filter(
      (w) => w.name_fa.includes(q) || w.description.includes(q) || w.slug.includes(q),
    );
  }, [search]);

  return (
    <main className="container max-w-6xl mx-auto py-10 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "var(--navy)" }}>
          حوزه حقوقی خود را انتخاب کنید
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          ۴۰ حوزه تخصصی — تحلیل بر اساس قوانین همان حوزه انجام می‌شود.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در حوزه‌ها..."
          className="w-full bg-parchment border border-border rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-vazir"
          style={{ backgroundColor: "var(--parchment)" }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((w) => (
          <Link
            key={w.slug}
            to="/workspace/$slug"
            params={{ slug: w.slug }}
            className="group bg-card border border-border rounded-xl p-4 hover:shadow-gold transition-all duration-200 text-right"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
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
        <p className="text-center text-muted-foreground py-12">حوزه‌ای یافت نشد.</p>
      )}
    </main>
  );
}
