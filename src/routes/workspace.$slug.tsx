import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { LegalHeader } from "@/components/legal/LegalHeader";
import { LegalAssistant } from "@/components/legal/LegalAssistant";
import { getWorkspace } from "@/data/workspaces";

export const Route = createFileRoute("/workspace/$slug")({
  loader: ({ params }) => {
    const ws = getWorkspace(params.slug);
    if (!ws) throw notFound();
    return { workspace: ws };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.workspace.name_fa ?? "حوزه"} — دستیار حقوقی` },
      { name: "description", content: loaderData?.workspace.description ?? "" },
    ],
  }),
  component: WorkspacePage,
  notFoundComponent: () => (
    <div className="min-h-screen gradient-section">
      <LegalHeader />
      <main className="container max-w-3xl mx-auto py-12 px-4 text-center">
        <p className="font-bold mb-4" style={{ color: "var(--navy)" }}>این حوزه یافت نشد.</p>
        <Link to="/" className="underline" style={{ color: "var(--gold)" }}>بازگشت به فهرست</Link>
      </main>
    </div>
  ),
});

function WorkspacePage() {
  const { workspace } = Route.useLoaderData();
  return (
    <div className="min-h-screen gradient-section">
      <LegalHeader />
      <div className="container max-w-3xl mx-auto pt-6 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs hover:opacity-80"
          style={{ color: "var(--navy)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          بازگشت به فهرست حوزه‌ها
        </Link>
        <div className="mt-3">
          <h2 className="text-xl font-bold" style={{ color: "var(--navy)" }}>{workspace.name_fa}</h2>
          <p className="text-xs text-muted-foreground mt-1">{workspace.description}</p>
        </div>
      </div>
      <LegalAssistant workspaceSlug={workspace.slug} workspaceName={workspace.name_fa} />
    </div>
  );
}
