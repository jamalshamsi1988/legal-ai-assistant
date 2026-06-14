// Generates a printable HTML page in a new window and opens the browser print dialog.
// Uses the same Vazirmatn font + RTL direction as the app. The user saves as PDF
// from the print dialog (best approach for Persian text fidelity).

interface PdfData {
  summary: string;
  legalBasis: string[];
  analysis: string;
  nextSteps: string[];
  draft: string | null;
  workspaceName?: string;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export function generateLegalPdf(data: PdfData) {
  const date = new Date().toLocaleDateString("fa-IR");
  const html = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8" />
<title>تحلیل حقوقی — دستیار حقوقی</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Vazirmatn', sans-serif; color: #0f172a; line-height: 1.85; padding: 32px; max-width: 800px; margin: 0 auto; }
  h1 { color: #1e3a5f; border-bottom: 3px solid #d4a017; padding-bottom: 8px; }
  h2 { color: #1e3a5f; margin-top: 28px; border-right: 4px solid #d4a017; padding-right: 12px; }
  .meta { color: #64748b; font-size: 13px; margin-bottom: 24px; }
  ul, ol { padding-right: 24px; }
  li { margin: 6px 0; }
  .draft { background: #f8f5e8; border: 1px solid #d4a017; padding: 20px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; }
  .note { color: #64748b; font-size: 12px; margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  @media print {
    body { padding: 0; }
    h2 { break-after: avoid; }
  }
  .actions { margin: 16px 0; }
  .actions button { background: #d4a017; color: #1e3a5f; border: 0; padding: 10px 20px; font: 600 14px Vazirmatn; border-radius: 6px; cursor: pointer; }
  @media print { .actions { display: none; } }
</style>
</head>
<body>
  <div class="actions">
    <button onclick="window.print()">چاپ / ذخیره PDF</button>
  </div>
  <h1>تحلیل حقوقی</h1>
  <div class="meta">${data.workspaceName ? `حوزه: ${escapeHtml(data.workspaceName)} • ` : ""}تاریخ: ${date}</div>

  <h2>خلاصه پرونده</h2>
  <p>${escapeHtml(data.summary)}</p>

  ${data.legalBasis.length ? `<h2>مبانی قانونی</h2><ul>${data.legalBasis.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>` : ""}

  <h2>تحلیل حقوقی</h2>
  <p style="white-space: pre-wrap;">${escapeHtml(data.analysis)}</p>

  ${data.nextSteps.length ? `<h2>اقدامات پیشنهادی</h2><ol>${data.nextSteps.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ol>` : ""}

  ${data.draft ? `<h2>پیش‌نویس لایحه</h2><div class="draft">${escapeHtml(data.draft)}</div>` : ""}

  <p class="note">این تحلیل توسط هوش مصنوعی تولید شده و جنبه آموزشی دارد. پیش از هر اقدام رسمی با وکیل مشورت کنید.</p>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 600));</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    alert("لطفاً پاپ‌آپ مرورگر را برای این سایت فعال کنید.");
    return;
  }
  win.document.write(html);
  win.document.close();
}
