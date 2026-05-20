"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) setMessage(error.message);
    else setMessage("Revisa tu correo, te enviamos el link de recuperación.");
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
              <h3 className="text-2xl font-bold text-white">Recuperar contraseña</h3>
              <p className="text-slate-500 text-sm mt-1">Te enviaremos un link a tu correo</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-600 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm transition"
              >
                {loading ? "Enviando..." : "Enviar link"}
              </button>
              <Link href="/login" className="block w-full text-center border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium py-3.5 rounded-xl text-sm transition">
                Volver al login
              </Link>
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