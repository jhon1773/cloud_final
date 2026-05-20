import Link from "next/link";

export default function BienvenidaPage() {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">

      <header className="flex justify-between items-center px-20 py-7 border-b border-slate-800">
        <div>
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Proyecto Integrador</p>
          <h1 className="text-white text-2xl font-bold mt-0.5">Everwood Cloud</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-5 py-2 rounded-xl text-sm transition">
            Iniciar sesión
          </Link>
          <Link href="/register" className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-5 py-2 rounded-xl text-sm transition">
            Crear cuenta
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-20 space-y-10">
        <div className="space-y-5 max-w-3xl">
          <p className="text-teal-400 text-sm font-bold uppercase tracking-widest">Plataforma Cloud</p>
          <h2 className="text-7xl font-bold leading-tight tracking-tight">
            Everwood <span className="text-teal-400">Cloud</span>
          </h2>
          <p className="text-slate-400 text-xl leading-relaxed max-w-xl mx-auto">
            Gestiona conversaciones históricas, genera FAQs accionables y mantén tus datos seguros en la nube.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/register" className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-10 py-4 rounded-xl text-sm transition">
            Comenzar gratis
          </Link>
          <Link href="/login" className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-10 py-4 rounded-xl text-sm transition">
            Ya tengo cuenta
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-4 w-full max-w-5xl">
          {[
            { title: "CSV, JSON y TXT", desc: "Sube cualquier formato de conversación" },
            { title: "Almacenamiento cloud", desc: "Datos seguros en Supabase Storage" },
            { title: "FAQs automáticas", desc: "Genera preguntas desde el contenido" },
            { title: "Seguridad avanzada", desc: "Logs, rate limiting y sanitización" },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-slate-900 border border-slate-800 hover:border-teal-700 rounded-2xl p-6 flex flex-col items-start gap-3 text-left transition">
              <p className="text-white text-sm font-semibold">{title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-slate-600 text-xs border-t border-slate-800">
        © 2026 Everwood Cloud — Proyecto Integrador
      </footer>

    </div>
  );
}