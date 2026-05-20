"use client";

import { useEffect, useState } from "react";
import type { ProjectMetrics } from "@/lib/types";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const COLORS_STATUS = ["#0d9488", "#3b82f6", "#eab308", "#ef4444"];
const COLORS_FAQS = ["#0d9488", "#ef4444", "#eab308"];

export function MetricsSummary() {
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const response = await fetch("/api/metricas", { cache: "no-store" });
        const payload = (await response.json()) as { metrics?: ProjectMetrics; error?: string };
        if (!response.ok || !payload.metrics) throw new Error(payload.error ?? "No se pudo consultar metricas");
        if (!cancelled) setMetrics(payload.metrics);
      } catch (requestError) {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Error inesperado");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="text-slate-500">Cargando metricas...</p>;
  if (error) return <p className="text-red-700">{error}</p>;
  if (!metrics) return <p>No hay datos para mostrar.</p>;

  const statusData = [
    { name: "Cargado", value: metrics.uploadsByStatus.cargado },
    { name: "Procesado", value: metrics.uploadsByStatus.procesado },
    { name: "Pendiente", value: metrics.uploadsByStatus.pendiente },
    { name: "Error", value: metrics.uploadsByStatus.error },
  ];

  const faqData = [
    { name: "Aprobadas", value: metrics.approvedFaqs },
    { name: "Rechazadas", value: metrics.rejectedFaqs },
    { name: "Pendientes", value: metrics.pendingFaqs },
  ];

  const barData = [
    { name: "Cargas", total: metrics.totalUploads },
    { name: "FAQs", total: metrics.totalFaqs },
    { name: "Aprobadas", total: metrics.approvedFaqs },
    { name: "Rechazadas", total: metrics.rejectedFaqs },
  ];

  return (
    <div className="space-y-6">

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide">Total de cargas</p>
          <p className="text-4xl font-bold text-teal-600">{metrics.totalUploads}</p>
          <p className="text-xs text-slate-400">archivos subidos</p>
        </article>
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide">Tasa de aprobación</p>
          <p className="text-4xl font-bold text-teal-600">{metrics.approvedRate}%</p>
          <p className="text-xs text-slate-400">FAQs aprobadas</p>
        </article>
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide">FAQs sugeridas</p>
          <p className="text-4xl font-bold text-slate-700">{metrics.totalFaqs}</p>
          <p className="text-xs text-slate-400">{metrics.approvedFaqs} aprobadas · {metrics.rejectedFaqs} rechazadas</p>
        </article>
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide">Pendientes</p>
          <p className="text-4xl font-bold text-yellow-500">{metrics.pendingFaqs}</p>
          <p className="text-xs text-slate-400">FAQs por revisar</p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <p className="text-sm font-semibold text-slate-600 mb-4">Estado de cargas</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS_STATUS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <p className="text-sm font-semibold text-slate-600 mb-4">Estado de FAQs</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={faqData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {faqData.map((_, index) => (
                  <Cell key={index} fill={COLORS_FAQS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <p className="text-sm font-semibold text-slate-600 mb-4">Resumen general</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#0d9488" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}