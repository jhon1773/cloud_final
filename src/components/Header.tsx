"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">Proyecto Integrador</p>
        <h1 className="site-title">Everwood Cloud</h1>
      </div>
      <nav className="nav-links">
        <Link href="/inicio">Inicio</Link>
        <Link href="/historial">Historial</Link>
        <Link href="/metricas">Metricas</Link>
        <Link href="/admin">Admin</Link>
        <button onClick={cerrarSesion}>
            Cerrar sesión
        </button>
      </nav>
    </header>
  );
}