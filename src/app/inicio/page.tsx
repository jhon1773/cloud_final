import Link from "next/link";
import { UploadForm } from "@/components/upload-form";

export default function Home() {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">

      {/* Header */}
      <header className="flex justify-between items-center px-20 py-7 border-b border-slate-800">
        <div>
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Proyecto Integrador</p>
          <h1 className="text-white text-2xl font-bold mt-0.5">Everwood Cloud</h1>
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/inicio" className="text-slate-400 hover:text-white text-sm font-medium transition">Inicio</Link>
          <Link href="/historial" className="text-slate-400 hover:text-white text-sm font-medium transition">Historial</Link>
          <Link href="/metricas" className="text-slate-400 hover:text-white text-sm font-medium transition">Métricas</Link>
          <Link href="/admin" className="text-slate-400 hover:text-white text-sm font-medium transition">Admin</Link>
          <Link href="/login" className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-5 py-2 rounded-xl text-sm transition">
            Cerrar sesión
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col px-20 py-16 gap-10 max-w-5xl mx-auto w-full">

        {/* Hero */}
        <section className="space-y-5">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Plataforma cloud para conversaciones</p>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">
            Gestiona cargas históricas<br />y convierte conversaciones<br />en <span className="text-teal-400">FAQs accionables</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            Sube archivos CSV, JSON o TXT de WhatsApp u otros canales, guarda metadatos en cloud,
            consulta el historial y valida sugerencias de preguntas frecuentes para mejorar tus agentes conversacionales.
          </p>
          <div className="flex gap-4 pt-2">
            <Link href="/historial" className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-6 py-3 rounded-xl text-sm transition">
              Ver historial de cargas
            </Link>
            <Link href="/metricas" className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-6 py-3 rounded-xl text-sm transition">
              Ver resumen de métricas
            </Link>
          </div>
        </section>

        {/* Upload form */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-10">
          <UploadForm />
        </section>

        {/* Flujo */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-10 space-y-5">
          <h3 className="text-lg font-bold text-white">Flujo cloud implementado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { n: "1", text: "Validación de tipo de archivo y campos obligatorios." },
              { n: "2", text: "Almacenamiento del archivo en Supabase Storage." },
              { n: "3", text: "Registro de metadatos y sugerencias de FAQs en Supabase Database." },
              { n: "4", text: "Consulta de historial y validación de FAQs desde la interfaz web." },
            ].map(({ n, text }) => (
              <div key={n} className="flex items-start gap-4 bg-slate-800 border border-slate-700 hover:border-teal-700 rounded-2xl px-5 py-4 transition">
                <span className="text-teal-400 font-bold text-sm shrink-0">{n}</span>
                <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-600 text-xs border-t border-slate-800">
        © 2026 Everwood Cloud — Proyecto Integrador
      </footer>

    </div>
  );
}