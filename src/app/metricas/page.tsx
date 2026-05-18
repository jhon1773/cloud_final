import { MetricsSummary } from "@/components/metrics-summary";
import Header from "@/components/Header";

export default function MetricasPage() {
  return (
    <>
      <Header />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Resumen de metricas</h1>
        <p className="text-slate-700">
          Monitorea el avance del proyecto con indicadores de cargas y validacion de FAQs.
        </p>
        <MetricsSummary />
      </div>
    </>
  );
}