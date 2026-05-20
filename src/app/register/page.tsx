"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

function sanitizar(texto: string): string {
  return texto.replace(/[<>"'`;]/g, "").trim();
}

function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function registrarLog(emailVal: string, accion: string, exito: boolean) {
    await supabase.from("auth_logs").insert({
      email: emailVal,
      action: accion,
      success: exito,
      ip: "cliente",
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const emailLimpio = sanitizar(email);
    const passwordLimpia = sanitizar(password);
    const confirmarLimpia = sanitizar(confirmar);

    if (!validarEmail(emailLimpio)) {
      setMessage("El formato del email no es válido.");
      return;
    }

    if (!validarPassword(passwordLimpia)) {
      setMessage("La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.");
      return;
    }

    if (passwordLimpia !== confirmarLimpia) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await supabase.auth.signUp({ email: emailLimpio, password: passwordLimpia });
      if (res.error) {
        await registrarLog(emailLimpio, "registro_fallido", false);
        setMessage(res.error.message);
      } else {
        await registrarLog(emailLimpio, "registro_exitoso", true);
        setMessage("Cuenta creada. Revisa tu correo para confirmar.");
        router.push("/login");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage(String(err) ?? "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">

      {/* Header */}
      <header className="flex justify-between items-center px-20 py-7 border-b border-slate-800">
        <Link href="/">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Proyecto Integrador</p>
          <h1 className="text-white text-2xl font-bold mt-0.5">Everwood Cloud</h1>
        </Link>
        <div className="flex gap-3">
          <Link href="/login" className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-5 py-2 rounded-xl text-sm transition">
            Iniciar sesión
          </Link>
          <Link href="/register" className="border border-teal-700 text-teal-300 font-medium px-5 py-2 rounded-xl text-sm">
            Crear cuenta
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-20 py-16">
        <div className="w-full max-w-5xl flex gap-20 items-center">

          {/* Panel izquierdo */}
          <div className="hidden md:flex flex-col gap-8 w-1/2">
            <div className="space-y-4">
              <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Registro</p>
              <h2 className="text-5xl font-bold leading-tight tracking-tight">
                Crea tu<br />cuenta <span className="text-teal-400">gratis</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                Crea tu cuenta y empieza a gestionar conversaciones históricas en la nube de forma segura.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 max-w-sm">
              {[
                { title: "CSV, JSON y TXT", desc: "Sube cualquier formato de conversación" },
                { title: "Almacenamiento cloud", desc: "Datos seguros en Supabase Storage" },
                { title: "FAQs automáticas", desc: "Genera preguntas desde el contenido" },
                { title: "Seguridad avanzada", desc: "Logs, rate limiting y sanitización" },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-slate-900 border border-slate-800 hover:border-teal-700 rounded-2xl px-5 py-4 flex items-start gap-3 transition">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-white text-sm font-semibold">{title}</p>
                    <p className="text-slate-500 text-xs leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel derecho — formulario */}
          <div className="w-full md:w-1/2">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 space-y-7">
              <div>
                <h3 className="text-2xl font-bold text-white">Crear cuenta</h3>
                <p className="text-slate-500 text-sm mt-1">Completa los datos para registrarte</p>
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
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Contraseña</label>
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
                  className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-10 py-3.5 rounded-xl text-sm transition"
                >
                  {loading ? "Creando cuenta..." : "Registrarse"}
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-slate-600 text-xs">o</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
                <Link
                  href="/login"
                  className="block w-full text-center border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-10 py-3.5 rounded-xl text-sm transition"
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </Link>
              </form>
              {message && (
                <p className="text-xs text-center px-4 py-3 rounded-xl border text-slate-400 bg-slate-800 border-slate-700">
                  {message}
                </p>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-600 text-xs border-t border-slate-800">
        © 2026 Everwood Cloud — Proyecto Integrador
      </footer>

    </div>
  );
}