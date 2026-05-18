import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { FaqSuggestion, ProjectMetrics, UploadStatus } from "@/lib/types";

export const runtime = "nodejs";

const emptyStatusCount: Record<UploadStatus, number> = {
  cargado: 0,
  pendiente: 0,
  procesado: 0,
  error: 0,
};

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("uploads")
    .select("status, faq_suggestions");

  if (error) {
    return NextResponse.json(
      { error: "No se pudieron calcular las metricas.", detail: error.message },
      { status: 500 },
    );
  }

  const rows = (data ?? []) as Array<{
    status: UploadStatus;
    faq_suggestions: FaqSuggestion[] | null;
  }>;

  const uploadsByStatus = { ...emptyStatusCount };
  let totalFaqs = 0;
  let approvedFaqs = 0;
  let rejectedFaqs = 0;

  for (const row of rows) {
    uploadsByStatus[row.status] = (uploadsByStatus[row.status] ?? 0) + 1;

    for (const faq of row.faq_suggestions ?? []) {
      totalFaqs += 1;
      if (faq.status === "aprobada") {
        approvedFaqs += 1;
      }
      if (faq.status === "rechazada") {
        rejectedFaqs += 1;
      }
    }
  }

  const pendingFaqs = Math.max(totalFaqs - approvedFaqs - rejectedFaqs, 0);
  const approvedRate = totalFaqs ? Number(((approvedFaqs / totalFaqs) * 100).toFixed(1)) : 0;

  const metrics: ProjectMetrics = {
    totalUploads: rows.length,
    uploadsByStatus,
    totalFaqs,
    approvedFaqs,
    rejectedFaqs,
    pendingFaqs,
    approvedRate,
  };

  return NextResponse.json({ metrics });
}
