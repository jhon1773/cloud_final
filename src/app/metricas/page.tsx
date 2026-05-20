import { MetricsSummary } from "@/components/metrics-summary";
import Header from "@/components/Header";

export default function MetricasPage() {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">
      <Header />
      <main className="flex-1 flex flex-col px-20 py-16 gap-8 max-w-5xl mx-auto w-full">
        <div className="space-y-3">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Indicadores</p>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">
            Resumen de <span className="text-teal-400">métricas</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            Monitorea el avance del proyecto con indicadores de cargas y validación de FAQs.
          </p>
        </div>
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-10">
          <MetricsSummary />
        </section>
      </main>
      <footer className="text-center py-6 text-slate-600 text-xs border-t border-slate-800">
        © 2026 Everwood Cloud — Proyecto Integrador
      </footer>
    </div>
  );
}