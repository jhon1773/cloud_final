import { MetricsSummary } from "@/components/metrics-summary";

export default function MetricasPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Resumen de metricas</h1>
      <p className="text-slate-700">
        Monitorea el avance del proyecto con indicadores de cargas y validacion de FAQs.
      </p>
      <MetricsSummary />
    </div>
  );
}
