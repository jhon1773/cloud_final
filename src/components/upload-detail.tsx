"use client";

import { useEffect, useState } from "react";
import type { FaqSuggestion, UploadRecord } from "@/lib/types";

type UploadDetailProps = {
  id: string;
};

export function UploadDetail({ id }: UploadDetailProps) {
  const [item, setItem] = useState<UploadRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch(`/api/uploads/${id}`, { cache: "no-store" });
        const payload = (await response.json()) as {
          item?: UploadRecord;
          error?: string;
        };

        if (!response.ok || !payload.item) {
          throw new Error(payload.error ?? "No se pudo cargar el detalle");
        }

        if (!cancelled) {
          setItem(payload.item);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Error inesperado al consultar detalle",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function updateFaqStatus(faq: FaqSuggestion, status: "aprobada" | "rechazada") {
    const response = await fetch(`/api/uploads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ faqId: faq.id, status }),
    });

    const payload = (await response.json()) as {
      item?: UploadRecord;
      error?: string;
    };

    if (!response.ok || !payload.item) {
      setError(payload.error ?? "No se pudo actualizar el estado de la FAQ");
      return;
    }

    setItem(payload.item);
  }

  if (loading) {
    return <p>Cargando detalle...</p>;
  }

  if (error) {
    return <p className="text-red-700">{error}</p>;
  }

  if (!item) {
    return <p>No se encontro informacion de esta carga.</p>;
  }

  return (
    <div className="space-y-6">
      <section className="card space-y-2">
        <h1 className="text-2xl font-bold">Detalle de carga</h1>
        <p>
          <strong>Archivo:</strong> {item.file_name}
        </p>
        <p>
          <strong>Fecha:</strong> {new Date(item.uploaded_at).toLocaleString("es-CO")}
        </p>
        <p>
          <strong>Tipo:</strong> {item.file_type.toUpperCase()}
        </p>
        <p>
          <strong>Tamano:</strong> {(item.file_size / 1024).toFixed(1)} KB
        </p>
        <p>
          <strong>Responsable:</strong> {item.responsible}
        </p>
        <p>
          <strong>Estado:</strong> <span className="capitalize">{item.status}</span>
        </p>
        <p>
          <strong>Observaciones:</strong> {item.observations || "Sin observaciones"}
        </p>
      </section>

      <section className="card space-y-4">
        <h2 className="text-xl font-semibold">FAQs sugeridas</h2>
        {!item.faq_suggestions?.length ? (
          <p>No se detectaron preguntas frecuentes en este archivo.</p>
        ) : (
          <ul className="space-y-3">
            {item.faq_suggestions.map((faq) => (
              <li key={faq.id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium">{faq.question}</p>
                <p className="text-sm text-slate-700">{faq.answer}</p>
                <p className="mt-1 text-xs text-slate-500">Repeticiones: {faq.count}</p>
                <p className="mt-1 text-xs text-slate-500 capitalize">
                  Estado actual: {faq.status}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateFaqStatus(faq, "aprobada")}
                    className="btn-secondary"
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFaqStatus(faq, "rechazada")}
                    className="btn-secondary"
                  >
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
