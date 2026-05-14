import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { FaqSuggestion, UploadRecord } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabaseAdmin = getSupabaseAdmin() as any;
  const params = await context.params;
  const { data, error } = await supabaseAdmin
    .from("uploads")
    .select(
      "id, file_name, uploaded_at, file_type, file_size, responsible, status, observations, storage_path, faq_suggestions",
    )
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "No se encontro la carga solicitada.", detail: error?.message },
      { status: 404 },
    );
  }

  return NextResponse.json({ item: data as UploadRecord });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabaseAdmin = getSupabaseAdmin() as any;
  const params = await context.params;
  const payload = (await request.json()) as {
    faqId?: string;
    status?: "aprobada" | "rechazada" | "pendiente";
  };

  if (!payload.faqId || !payload.status) {
    return NextResponse.json(
      { error: "Faltan datos para actualizar la FAQ." },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("uploads")
    .select("faq_suggestions")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "No fue posible encontrar la carga para actualizar FAQ." },
      { status: 404 },
    );
  }

  const row = data as { faq_suggestions: FaqSuggestion[] | null };
  const current = (row.faq_suggestions ?? []).map((item) =>
    item.id === payload.faqId ? { ...item, status: payload.status! } : item,
  );

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("uploads")
    .update({ faq_suggestions: current })
    .eq("id", params.id)
    .select(
      "id, file_name, uploaded_at, file_type, file_size, responsible, status, observations, storage_path, faq_suggestions",
    )
    .single();

  if (updateError || !updated) {
    return NextResponse.json(
      { error: "No se pudo actualizar el estado de la FAQ." },
      { status: 500 },
    );
  }

  return NextResponse.json({ item: updated as UploadRecord });
}
