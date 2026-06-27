import { Users, Badge, AlertCircle } from "lucide-react";

export interface DetectedRole {
  role: string;
  confidence: number; // 0-100
  description: string;
}

interface Props {
  roles: DetectedRole[];
  delay?: number;
}

type RoleColor = "gold" | "navy" | "blue" | "purple" | "orange" | "green";

function getRoleColor(role: string): RoleColor {
  const roleColors: Record<string, RoleColor> = {
    "وکیل": "gold",
    "متهم": "navy",
    "شاهد": "blue",
    "دادرس": "purple",
    "صاحب‌ادعا": "orange",
    "خوانده": "navy",
    "مدعی": "orange",
    "ادعاگر": "orange",
    "دفاع‌کننده": "gold",
    "مهر‌رسان": "blue",
    "کارشناس": "green",
  };
  return roleColors[role] || "blue";
}

function getColorCode(color: RoleColor): { bg: string; border: string; text: string; badge: string } {
  const colors: Record<RoleColor, { bg: string; border: string; text: string; badge: string }> = {
    gold: {
      bg: "var(--gold-pale)",
      border: "var(--gold)",
      text: "var(--navy)",
      badge: "var(--gold)",
    },
    navy: {
      bg: "var(--secondary)",
      border: "var(--navy)",
      text: "var(--navy)",
      badge: "var(--navy)",
    },
    blue: {
      bg: "oklch(0.95 0.05 250)",
      border: "oklch(0.65 0.18 250)",
      text: "var(--navy)",
      badge: "oklch(0.65 0.18 250)",
    },
    purple: {
      bg: "oklch(0.95 0.05 290)",
      border: "oklch(0.65 0.18 290)",
      text: "var(--navy)",
      badge: "oklch(0.65 0.18 290)",
    },
    orange: {
      bg: "oklch(0.95 0.05 40)",
      border: "oklch(0.65 0.18 40)",
      text: "var(--navy)",
      badge: "oklch(0.65 0.18 40)",
    },
    green: {
      bg: "oklch(0.95 0.05 150)",
      border: "oklch(0.65 0.18 150)",
      text: "var(--navy)",
      badge: "oklch(0.65 0.18 150)",
    },
  };
  return colors[color];
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 90) return "بسیار بالا";
  if (confidence >= 75) return "بالا";
  if (confidence >= 60) return "متوسط";
  return "پایین";
}

export function RoleDetector({ roles, delay = 0 }: Props) {
  if (!roles || roles.length === 0) {
    return (
      <div
        className="rounded-xl border p-5 shadow-legal animate-in fade-in"
        style={{
          backgroundColor: "var(--secondary)",
          borderColor: "var(--border)",
          borderInlineEndWidth: "4px",
          borderInlineEndColor: "var(--navy)",
          animationDelay: `${delay}ms`,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--navy)", color: "var(--gold)" }}>
            <Users className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-base" style={{ color: "var(--navy)" }}>نقش‌های حقوقی شناسایی‌شده</h3>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          هیچ نقش حقوقی تشخیص داده نشد.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-5 shadow-legal animate-in fade-in"
      style={{
        backgroundColor: "var(--secondary)",
        borderColor: "var(--border)",
        borderInlineEndWidth: "4px",
        borderInlineEndColor: "var(--navy)",
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--navy)", color: "var(--gold)" }}>
          <Users className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-base" style={{ color: "var(--navy)" }}>نقش‌های حقوقی شناسایی‌شده</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {roles.map((item, idx) => {
          const color = getRoleColor(item.role);
          const colorCode = getColorCode(color);
          const confidenceLabel = getConfidenceLabel(item.confidence);

          return (
            <div
              key={idx}
              className="rounded-lg border p-3 transition-all hover:shadow-md"
              style={{
                backgroundColor: colorCode.bg,
                borderColor: colorCode.border,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <Badge className="w-4 h-4 flex-shrink-0" style={{ color: colorCode.badge }} />
                  <span className="font-bold text-sm" style={{ color: colorCode.text }}>
                    {item.role}
                  </span>
                </div>
                <div
                  className="px-2 py-1 rounded text-xs font-semibold flex-shrink-0"
                  style={{
                    backgroundColor: colorCode.badge,
                    color: "#fff",
                  }}
                >
                  {item.confidence}%
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                اعتماد: <span style={{ color: colorCode.text, fontWeight: "bold" }}>{confidenceLabel}</span>
              </p>

              {item.description && (
                <p className="text-xs leading-relaxed" style={{ color: colorCode.text }}>
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        نقش‌های شناسایی‌شده بر اساس متن و مدارک آپلود‌شده است.
      </p>
    </div>
  );
}
