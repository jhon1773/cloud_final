"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

function validarPassword(p: string) {
  return p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p);
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validarPassword(password)) {
      setMessage("Mínimo 8 caracteres, una mayúscula y un número.");
      return;
    }
    if (password !== confirmar) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setMessage(error.message);
    else {
      setMessage("Contraseña actualizada correctamente.");
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div className="min-h-screen w-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">
      <header className="flex justify-between items-center px-20 py-7 border-b border-slate-800">
        <Link href="/">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Proyecto Integrador</p>
          <h1 className="text-white text-2xl font-bold mt-0.5">Everwood Cloud</h1>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-20 py-16">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 space-y-7">
            <div>
              <h3 className="text-2xl font-bold text-white">Nueva contraseña</h3>
              <p className="text-slate-500 text-sm mt-1">Elige una contraseña segura para tu cuenta</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nueva contraseña</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  placeholder="••••••••"
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-600 transition"
                />
                <p className="text-xs text-slate-600">Mínimo 8 caracteres, una mayúscula y un número.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Confirmar contraseña</label>
                <input
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  type="password"
                  required
                  placeholder="••••••••"
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-600 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm transition"
              >
                {loading ? "Guardando..." : "Guardar contraseña"}
              </button>
            </form>
            {message && (
              <p className="text-xs text-center px-4 py-3 rounded-xl border text-slate-400 bg-slate-800 border-slate-700">
                {message}
              </p>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-slate-600 text-xs border-t border-slate-800">
        © 2026 Everwood Cloud — Proyecto Integrador
      </footer>
    </div>
  );
}