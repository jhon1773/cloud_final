"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { UploadRecord } from "@/lib/types";

export function UploadsTable() {
  const [items, setItems] = useState<UploadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch("/api/uploads", { cache: "no-store" });
        const payload = (await response.json()) as {
          items?: UploadRecord[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "No se pudo consultar el historial");
        }

        if (!cancelled) {
          setItems(payload.items ?? []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Error inesperado al cargar historial",
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
  }, []);

  if (loading) {
    return <p className="text-slate-400 text-sm">Cargando historial...</p>;
  }

  if (error) {
    return (
      <p className="text-xs text-center px-4 py-3 rounded-xl border text-red-400 bg-red-950 border-red-900">
        {error}
      </p>
    );
  }

  if (!items.length) {
    return (
      <p className="text-slate-500 text-sm text-center py-6">
        No hay cargas registradas todavía.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Archivo</th>
            <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Fecha</th>
            <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Tipo</th>
            <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Tamaño</th>
            <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Responsable</th>
            <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Estado</th>
            <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800 transition">
              <td className="px-3 py-4 text-white font-medium">{item.file_name}</td>
              <td className="px-3 py-4 text-slate-400">
                {new Date(item.uploaded_at).toLocaleString("es-CO")}
              </td>
              <td className="px-3 py-4 text-slate-400 uppercase">{item.file_type}</td>
              <td className="px-3 py-4 text-slate-400">{(item.file_size / 1024).toFixed(1)} KB</td>
              <td className="px-3 py-4 text-slate-400">{item.responsible}</td>
              <td className="px-3 py-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  item.status === "procesado"
                    ? "bg-teal-900 text-teal-300 border border-teal-700"
                    : item.status === "error"
                    ? "bg-red-950 text-red-400 border border-red-900"
                    : item.status === "pendiente"
                    ? "bg-amber-950 text-amber-400 border border-amber-900"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-3 py-4">
                <Link
                  href={`/cargas/${item.id}`}
                  className="text-teal-500 hover:text-teal-400 text-xs font-semibold transition"
                >
                  Ver detalle →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}