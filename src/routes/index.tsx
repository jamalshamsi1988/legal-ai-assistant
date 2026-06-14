import { createFileRoute } from "@tanstack/react-router";
import { LegalHeader } from "@/components/legal/LegalHeader";
import { WorkspaceGrid } from "@/components/legal/WorkspaceGrid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دستیار حقوقی هوشمند — مشاوره حقوقی رایگان بر اساس قوانین ایران" },
      { name: "description", content: "تحلیل حقوقی فوری در ۴۰ حوزه تخصصی حقوق ایران. رایگان، بدون نیاز به ثبت‌نام، با استناد به قوانین مدون." },
      { property: "og:title", content: "دستیار حقوقی هوشمند" },
      { property: "og:description", content: "مشاوره حقوقی رایگان با هوش مصنوعی — تحلیل بر اساس قوانین ایران" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen gradient-section">
      <LegalHeader />
      <WorkspaceGrid />
    </div>
  );
}
