"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MAX_INTENTOS = 5;
const TIEMPO_BLOQUEO = 60 * 1000;

function sanitizar(texto: string): string {
  return texto.replace(/[<>"'`;]/g, "").trim();
}

function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [intentos, setIntentos] = useState(0);
  const [bloqueadoHasta, setBloqueadoHasta] = useState<number | null>(null);
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

    if (bloqueadoHasta && Date.now() < bloqueadoHasta) {
      const segundos = Math.ceil((bloqueadoHasta - Date.now()) / 1000);
      setMessage(`Demasiados intentos. Espera ${segundos} segundos.`);
      return;
    }

    const emailLimpio = sanitizar(email);
    const passwordLimpia = sanitizar(password);

    if (!validarEmail(emailLimpio)) {
      setMessage("El formato del email no es válido.");
      return;
    }

    if (!validarPassword(passwordLimpia)) {
      setMessage("La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await supabase.auth.signInWithPassword({ email: emailLimpio, password: passwordLimpia });
      if (res.error) {
        const nuevosIntentos = intentos + 1;
        setIntentos(nuevosIntentos);
        await registrarLog(emailLimpio, "login_fallido", false);
        if (nuevosIntentos >= MAX_INTENTOS) {
          setBloqueadoHasta(Date.now() + TIEMPO_BLOQUEO);
          setIntentos(0);
          setMessage("Cuenta bloqueada temporalmente por demasiados intentos fallidos.");
        } else {
          setMessage(`Credenciales incorrectas. Intento ${nuevosIntentos} de ${MAX_INTENTOS}.`);
        }
      } else {
        setIntentos(0);
        setBloqueadoHasta(null);
        await registrarLog(emailLimpio, "login_exitoso", true);
        setMessage("Autenticado correctamente.");
        router.push("/inicio");
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
          <Link href="/login" className="border border-teal-700 text-teal-300 font-medium px-5 py-2 rounded-xl text-sm">
            Iniciar sesión
          </Link>
          <Link href="/register" className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-5 py-2 rounded-xl text-sm transition">
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
              <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Acceso seguro</p>
              <h2 className="text-5xl font-bold leading-tight tracking-tight">
                Bienvenido<br />de <span className="text-teal-400">nuevo</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                Gestiona conversaciones históricas, genera FAQs y mantén tus datos seguros en la nube.
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
                <h3 className="text-2xl font-bold text-white">Inicia sesión</h3>
                <p className="text-slate-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
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
                </div>
                {intentos > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <p className="text-xs text-slate-500">Intentos fallidos</p>
                      <p className="text-xs text-slate-500">{intentos} / {MAX_INTENTOS}</p>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${intentos >= MAX_INTENTOS - 1 ? "bg-red-500" : "bg-teal-500"}`}
                        style={{ width: `${Math.round((intentos / MAX_INTENTOS) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-10 py-3.5 rounded-xl text-sm transition"
                >
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-slate-600 text-xs">o</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
                <Link
                  href="/register"
                  className="block w-full text-center border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-10 py-3.5 rounded-xl text-sm transition"
                >
                  ¿No tienes cuenta? Crear una
                </Link>
              </form>

              {/* Fuera del form para que el click no dispare el submit */}
              <Link
                href="/forgot-password"
                className="block text-center text-xs text-teal-500 hover:text-teal-400 transition"
              >
                ¿Olvidaste tu contraseña?
              </Link>

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