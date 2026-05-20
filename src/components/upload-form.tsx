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
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-lg font-bold text-white">1) Cargar conversaciones históricas</h2>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400" htmlFor="file">
          Archivo de conversaciones (CSV, JSON o TXT)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".csv,.json,.txt"
          required
          className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-500 transition"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400" htmlFor="responsible">
            Responsable o grupo
          </label>
          <input
            id="responsible"
            name="responsible"
            type="text"
            placeholder="Ej. Equipo CX Everwood"
            required
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-600 transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400" htmlFor="status">
            Estado inicial
          </label>
          <select
            id="status"
            name="status"
            defaultValue="cargado"
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          >
            <option value="cargado">Cargado</option>
            <option value="pendiente">Pendiente</option>
            <option value="procesado">Procesado</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400" htmlFor="observations">
          Observaciones
        </label>
        <textarea
          id="observations"
          name="observations"
          rows={3}
          placeholder="Notas de la carga, canal, periodo, etc."
          className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-600 transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm transition"
      >
        {isLoading ? "Subiendo..." : "Subir a cloud"}
      </button>

      {feedback && (
        <p className="text-xs text-center px-4 py-3 rounded-xl border text-slate-400 bg-slate-800 border-slate-700">
          {feedback}
        </p>
      )}
    </form>
  );
}