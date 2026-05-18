"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-slate-800">Crear cuenta</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">Contraseña</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <p className="text-xs text-slate-400">Mínimo 8 caracteres, una mayúscula y un número.</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">Confirmar contraseña</label>
            <input value={confirmar} onChange={(e) => setConfirmar(e.target.value)} type="password" required className="border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition" disabled={loading} type="submit">
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
          <button type="button" className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg transition" onClick={() => router.push("/login")}>
            Ya tengo cuenta
          </button>
        </form>
        {message ? <p className="text-sm text-center text-slate-600">{message}</p> : null}
      </div>
    </div>
  );
}