import { UploadsTable } from "@/components/uploads-table";
import Link from "next/link";

export default function HistorialPage() {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">

      {/* Header */}
      <header className="flex justify-between items-center px-20 py-7 border-b border-slate-800">
        <Link href="/">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Proyecto Integrador</p>
          <h1 className="text-white text-2xl font-bold mt-0.5">Everwood Cloud</h1>
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href="/inicio" className="text-slate-400 hover:text-white text-sm font-medium transition">Inicio</Link>
          <Link href="/historial" className="text-white text-sm font-medium">Historial</Link>
          <Link href="/metricas" className="text-slate-400 hover:text-white text-sm font-medium transition">Métricas</Link>
          <Link href="/admin" className="text-slate-400 hover:text-white text-sm font-medium transition">Admin</Link>
          <Link href="/login" className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-5 py-2 rounded-xl text-sm transition">
            Cerrar sesión
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col px-20 py-16 gap-8 max-w-5xl mx-auto w-full">

        <div className="space-y-3">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Registros</p>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">
            Historial de <span className="text-teal-400">cargas</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            Revisa todas las cargas de conversaciones de Everwood y abre el detalle de cada registro.
          </p>
        </div>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-10">
          <UploadsTable />
        </section>

      </main>

      <footer className="text-center py-6 text-slate-600 text-xs border-t border-slate-800">
        © 2026 Everwood Cloud — Proyecto Integrador
      </footer>

    </div>
  );
}