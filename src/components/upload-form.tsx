"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type UploadResult = {
  item: { id: string };
  message?: string;
  error?: string;
};

export function UploadForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!formData.get("file")) {
      setFeedback("Selecciona un archivo para continuar.");
      return;
    }

    setIsLoading(true);
    setFeedback("Cargando archivo y registrando metadatos...");

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as UploadResult;

      if (!response.ok || !payload.item?.id) {
        setFeedback(payload.error ?? "No se pudo completar la carga.");
        return;
      }

      form.reset();
      setFeedback(payload.message ?? "Archivo cargado con exito.");
      router.push(`/cargas/${payload.item.id}`);
      router.refresh();
    } catch {
      setFeedback("Fallo de red o del servidor al cargar el archivo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="text-xl font-semibold">1) Cargar conversaciones historicas</h2>

      <div className="field">
        <label htmlFor="file">Archivo de conversaciones (CSV, JSON o TXT)</label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".csv,.json,.txt"
          required
          className="input"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="field">
          <label htmlFor="responsible">Responsable o grupo</label>
          <input
            id="responsible"
            name="responsible"
            type="text"
            placeholder="Ej. Equipo CX Everwood"
            required
            className="input"
          />
        </div>

        <div className="field">
          <label htmlFor="status">Estado inicial</label>
          <select id="status" name="status" defaultValue="cargado" className="input">
            <option value="cargado">Cargado</option>
            <option value="pendiente">Pendiente</option>
            <option value="procesado">Procesado</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="observations">Observaciones</label>
        <textarea
          id="observations"
          name="observations"
          rows={3}
          placeholder="Notas de la carga, canal, periodo, etc."
          className="input"
        />
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? "Subiendo..." : "Subir a cloud"}
      </button>

      {feedback ? <p className="text-sm text-slate-700">{feedback}</p> : null}
    </form>
  );
}
