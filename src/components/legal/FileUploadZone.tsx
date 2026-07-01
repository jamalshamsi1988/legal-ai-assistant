import { useRef, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";

export interface UploadedFile {
  file: File;
  preview?: string;
  type: "image" | "pdf";
}

const MAX_BYTES = 50 * 1024 * 1024; // 50MB per file
const MAX_TOTAL_BYTES = 300 * 1024 * 1024; // 300MB total
const ACCEPT = "image/png,image/jpeg,image/webp,image/heic,image/heif,application/pdf";

interface Props {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

export function FileUploadZone({ files, onFilesChange, disabled, maxFiles = 30 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    setErr("");
    const incoming: UploadedFile[] = [];
    let currentTotal = files.reduce((s, x) => s + x.file.size, 0);

    for (const f of Array.from(list)) {
      const type: "image" | "pdf" = f.type.startsWith("image/") ? "image" : "pdf";

      if (files.length + incoming.length >= maxFiles) {
        setErr(`حداکثر ${maxFiles} فایل قابل آپلود است.`);
        break;
      }

      if (f.size > MAX_BYTES) {
        setErr(`فایل «${f.name}» بزرگتر از ۵۰ مگابایت است.`);
        continue;
      }

      if (currentTotal + f.size > MAX_TOTAL_BYTES) {
        setErr("مجموع حجم فایل‌ها نباید از ۳۰۰ مگابایت بیشتر شود.");
        break;
      }

      if (type !== "pdf" && !f.type.startsWith("image/")) continue;

      currentTotal += f.size;
      incoming.push({
        file: f,
        type,
        preview: type === "image" ? URL.createObjectURL(f) : undefined,
      });
    }
    if (incoming.length) onFilesChange([...files, ...incoming]);
  };

  const removeAt = (i: number) => {
    const f = files[i];
    if (f.preview) URL.revokeObjectURL(f.preview);
    onFilesChange(files.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          drag ? "border-gold bg-gold-pale" : "border-border"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gold"}`}
        style={{
          backgroundColor: drag ? "var(--gold-pale)" : "var(--parchment)",
          borderColor: drag ? "var(--gold)" : "var(--border)",
        }}
      >
        <Upload className="w-5 h-5 mx-auto mb-1.5" style={{ color: "var(--navy)" }} />
        <p className="text-xs" style={{ color: "var(--navy)" }}>
          مدارک خود را اینجا رها کنید یا کلیک کنید
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          PDF یا تصویر — حداکثر ۲۰ مگابایت هر فایل
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
        />
      </div>

      {err && <p className="text-xs text-destructive mt-2">{err}</p>}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-3 bg-card border border-border rounded-lg p-2 text-xs"
            >
              {f.type === "image" && f.preview ? (
                <img src={f.preview} alt="" className="w-10 h-10 object-cover rounded" />
              ) : (
                <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: "var(--gold-pale)" }}>
                  {f.type === "pdf" ? <FileText className="w-5 h-5" style={{ color: "var(--navy)" }} /> : <ImageIcon className="w-5 h-5" style={{ color: "var(--navy)" }} />}
                </div>
              )}
              <span className="flex-1 truncate" style={{ color: "var(--navy)" }}>{f.file.name}</span>
              <span className="text-muted-foreground">{(f.file.size / 1024).toFixed(0)} KB</span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                disabled={disabled}
                className="text-destructive hover:opacity-70 p-1"
                aria-label="حذف فایل"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
