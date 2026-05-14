"use client";

import { useEffect, useState } from "react";
import type { ProjectMetrics } from "@/lib/types";

export function MetricsSummary() {
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch("/api/metricas", { cache: "no-store" });
        const payload = (await response.json()) as {
          metrics?: ProjectMetrics;
          error?: string;
        };

        if (!response.ok || !payload.metrics) {
          throw new Error(payload.error ?? "No se pudo consultar metricas");
        }

        if (!cancelled) {
          setMetrics(payload.metrics);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Error inesperado cargando metricas",
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
    return <p>Cargando metricas...</p>;
  }

  if (error) {
    return <p className="text-red-700">{error}</p>;
  }

  if (!metrics) {
    return <p>No hay datos para mostrar.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article className="card">
        <p className="text-sm text-slate-500">Total de cargas</p>
        <p className="text-3xl font-bold">{metrics.totalUploads}</p>
      </article>
      <article className="card">
        <p className="text-sm text-slate-500">Estado de cargas</p>
        <p className="text-sm">Cargado: {metrics.uploadsByStatus.cargado}</p>
        <p className="text-sm">Pendiente: {metrics.uploadsByStatus.pendiente}</p>
        <p className="text-sm">Procesado: {metrics.uploadsByStatus.procesado}</p>
        <p className="text-sm">Error: {metrics.uploadsByStatus.error}</p>
      </article>
      <article className="card">
        <p className="text-sm text-slate-500">FAQs sugeridas</p>
        <p className="text-sm">Total: {metrics.totalFaqs}</p>
        <p className="text-sm">Aprobadas: {metrics.approvedFaqs}</p>
        <p className="text-sm">Rechazadas: {metrics.rejectedFaqs}</p>
        <p className="text-sm">Pendientes: {metrics.pendingFaqs}</p>
      </article>
      <article className="card">
        <p className="text-sm text-slate-500">Tasa de aprobacion FAQ</p>
        <p className="text-3xl font-bold">{metrics.approvedRate}%</p>
      </article>
    </div>
  );
}
