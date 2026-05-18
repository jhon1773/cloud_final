import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { buildFaqSuggestions } from "@/lib/faq-generator";
import { getBucketName, getSupabaseAdmin } from "@/lib/supabase-admin";
import type { UploadRecord } from "@/lib/types";

export const runtime = "nodejs";

const allowedExtensions = new Set(["csv", "json", "txt"]);

function extFromName(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("uploads")
    .select(
      "id, file_name, uploaded_at, file_type, file_size, responsible, status, observations, storage_path, preview_snippet, faq_suggestions",
    )
    .order("uploaded_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "No se pudo consultar el historial", detail: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ items: (data ?? []) as UploadRecord[] });
}

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const bucketName = getBucketName();
  const formData = await request.formData();
  const file = formData.get("file");
  const responsible = String(formData.get("responsible") ?? "").trim();
  const status = String(formData.get("status") ?? "cargado").trim() || "cargado";
  const observations = String(formData.get("observations") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Debes seleccionar un archivo para cargar." },
      { status: 400 },
    );
  }

  if (!responsible) {
    return NextResponse.json(
      { error: "Debes indicar responsable o grupo." },
      { status: 400 },
    );
  }

  const ext = extFromName(file.name);
  if (!allowedExtensions.has(ext)) {
    return NextResponse.json(
      { error: "Formato no permitido. Usa CSV, JSON o TXT." },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const objectKey = `uploads/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${file.name}`;

  const uploadResult = await supabaseAdmin.storage.from(bucketName).upload(objectKey, bytes, {
    contentType: file.type || "text/plain",
    upsert: false,
  });

  if (uploadResult.error) {
    return NextResponse.json(
      {
        error: "No se pudo guardar el archivo en cloud storage.",
        detail: uploadResult.error.message,
      },
      { status: 500 },
    );
  }

  const contentText = bytes.toString("utf8");
  const faqSuggestions = buildFaqSuggestions(contentText);
  const previewSnippet = contentText.replace(/\s+/g, " ").trim().slice(0, 900);

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("uploads")
    .insert({
      file_name: file.name,
      uploaded_at: new Date().toISOString(),
      file_type: ext,
      file_size: file.size,
      responsible,
      status,
      observations: observations || null,
      storage_path: objectKey,
      preview_snippet: previewSnippet,
      faq_suggestions: faqSuggestions,
    })
    .select(
      "id, file_name, uploaded_at, file_type, file_size, responsible, status, observations, storage_path, preview_snippet, faq_suggestions",
    )
    .single();

  if (insertError || !inserted) {
    return NextResponse.json(
      {
        error: "El archivo se subio a storage, pero fallo el registro de metadatos.",
        detail: insertError?.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Archivo cargado correctamente.",
    item: inserted as UploadRecord,
  });
}
