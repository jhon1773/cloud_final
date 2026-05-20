"use client";

import { useEffect, useState } from "react";
import type { FaqSuggestion, UploadRecord } from "@/lib/types";

type UploadDetailProps = { id: string };

export function UploadDetail({ id }: UploadDetailProps) {
  const [item, setItem] = useState<UploadRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [faqDrafts, setFaqDrafts] = useState<Record<string, { question: string; answer: string }>>({});

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const response = await fetch(`/api/uploads/${id}`, { cache: "no-store" });
        const payload = (await response.json()) as { item?: UploadRecord; error?: string };
        if (!response.ok || !payload.item) throw new Error(payload.error ?? "No se pudo cargar el detalle");
        if (!cancelled) {
          setItem(payload.item);
          const initialDrafts = (payload.item.faq_suggestions ?? []).reduce<Record<string, { question: string; answer: string }>>((acc, faq) => {
            acc[faq.id] = { question: faq.question, answer: faq.answer };
            return acc;
          }, {});
          setFaqDrafts(initialDrafts);
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Error inesperado");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [id]);

  async function updateFaqStatus(faq: FaqSuggestion, status: "aprobada" | "rechazada") {
    const response = await fetch(`/api/uploads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ faqId: faq.id, status }),
    });
    const payload = (await response.json()) as { item?: UploadRecord; error?: string };
    if (!response.ok || !payload.item) { setError(payload.error ?? "No se pudo actualizar"); return; }
    setItem(payload.item);
  }

  async function saveFaqEdits(faq: FaqSuggestion) {
    const draft = faqDrafts[faq.id];
    if (!draft) return;
    const response = await fetch(`/api/uploads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ faqId: faq.id, question: draft.question, answer: draft.answer }),
    });
    const payload = (await response.json()) as { item?: UploadRecord; error?: string };
    if (!response.ok || !payload.item) { setError(payload.error ?? "No se pudo editar"); return; }
    setItem(payload.item);
  }

  function updateFaqDraft(faqId: string, field: "question" | "answer", value: string) {
    setFaqDrafts((current) => ({
      ...current,
      [faqId]: {
        question: field === "question" ? value : (current[faqId]?.question ?? ""),
        answer: field === "answer" ? value : (current[faqId]?.answer ?? ""),
      },
    }));
  }

  if (loading) return <p className="text-slate-400 text-sm">Cargando detalle...</p>;
  if (error) return <p className="text-xs px-4 py-3 rounded-xl border text-red-400 bg-red-950 border-red-900">{error}</p>;
  if (!item) return <p className="text-slate-500 text-sm">No se encontró información de esta carga.</p>;

  const statusColors: Record<string, string> = {
    procesado: "bg-teal-900 text-teal-300 border-teal-700",
    error: "bg-red-950 text-red-400 border-red-900",
    pendiente: "bg-amber-950 text-amber-400 border-amber-900",
    cargado: "bg-slate-800 text-slate-400 border-slate-700",
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Carga</p>
        <h2 className="text-5xl font-bold leading-tight tracking-tight">
          Detalle de <span className="text-teal-400">archivo</span>
        </h2>
      </div>

      {/* Metadatos */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-white">Información del archivo</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Archivo", value: item.file_name },
            { label: "Fecha", value: new Date(item.uploaded_at).toLocaleString("es-CO") },
            { label: "Tipo", value: item.file_type.toUpperCase() },
            { label: "Tamaño", value: `${(item.file_size / 1024).toFixed(1)} KB` },
            { label: "Responsable", value: item.responsible },
            { label: "Observaciones", value: item.observations || "Sin observaciones" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
              <p className="text-white text-sm">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-1">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Estado</p>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[item.status] ?? statusColors.cargado}`}>
            {item.status}
          </span>
        </div>
      </section>

      {/* Vista previa */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-white">Vista previa de conversaciones</h3>
        {item.preview_snippet ? (
          <pre className="whitespace-pre-wrap rounded-xl bg-slate-800 border border-slate-700 p-4 text-sm text-slate-300 font-mono">
            {item.preview_snippet}
          </pre>
        ) : (
          <p className="text-slate-500 text-sm">No hay vista previa disponible para este archivo.</p>
        )}
      </section>

      {/* FAQs */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">
        <h3 className="text-lg font-bold text-white">FAQs sugeridas</h3>
        {!item.faq_suggestions?.length ? (
          <p className="text-slate-500 text-sm">No se detectaron preguntas frecuentes en este archivo.</p>
        ) : (
          <ul className="space-y-4">
            {item.faq_suggestions.map((faq) => (
              <li key={faq.id} className="bg-slate-800 border border-slate-700 hover:border-teal-700 rounded-2xl p-5 space-y-3 transition">
                <input
                  value={faqDrafts[faq.id]?.question ?? faq.question}
                  onChange={(e) => updateFaqDraft(faq.id, "question", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
                <textarea
                  value={faqDrafts[faq.id]?.answer ?? faq.answer}
                  onChange={(e) => updateFaqDraft(faq.id, "answer", e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-xs text-slate-500">
                    <span>Repeticiones: {faq.count}</span>
                    <span>·</span>
                    <span className={`font-semibold ${faq.status === "aprobada" ? "text-teal-400" : faq.status === "rechazada" ? "text-red-400" : "text-slate-400"}`}>
                      {faq.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveFaqEdits(faq)}
                      className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFaqStatus(faq, "aprobada")}
                      className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      Aprobar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFaqStatus(faq, "rechazada")}
                      className="bg-red-900 hover:bg-red-800 text-red-300 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}