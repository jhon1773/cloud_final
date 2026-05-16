"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.error) {
        setMessage(res.error.message);
      } else {
        setMessage("Autenticado correctamente.");
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage(String(err) ?? "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 card max-w-md">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="input" />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="input" />
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" disabled={loading} type="submit">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </form>
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </div>
  );
}
