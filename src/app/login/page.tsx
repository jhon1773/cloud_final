"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-slate-800">Iniciar sesión</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">Contraseña</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition" disabled={loading} type="submit">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          <button type="button" className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg transition" onClick={() => router.push("/register")}>
            Crear cuenta
          </button>
        </form>
        {message ? <p className="text-sm text-center text-slate-600">{message}</p> : null}
      </div>
    </div>
  );
}