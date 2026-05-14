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
    return <p>Cargando historial...</p>;
  }

  if (error) {
    return <p className="text-red-700">{error}</p>;
  }

  if (!items.length) {
    return <p>No hay cargas registradas todavia.</p>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600">
            <th className="px-2 py-2">Archivo</th>
            <th className="px-2 py-2">Fecha</th>
            <th className="px-2 py-2">Tipo</th>
            <th className="px-2 py-2">Tamano</th>
            <th className="px-2 py-2">Responsable</th>
            <th className="px-2 py-2">Estado</th>
            <th className="px-2 py-2">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100">
              <td className="px-2 py-3">{item.file_name}</td>
              <td className="px-2 py-3">
                {new Date(item.uploaded_at).toLocaleString("es-CO")}
              </td>
              <td className="px-2 py-3 uppercase">{item.file_type}</td>
              <td className="px-2 py-3">{(item.file_size / 1024).toFixed(1)} KB</td>
              <td className="px-2 py-3">{item.responsible}</td>
              <td className="px-2 py-3 capitalize">{item.status}</td>
              <td className="px-2 py-3">
                <Link href={`/cargas/${item.id}`} className="text-cyan-700 hover:underline">
                  Ver detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
