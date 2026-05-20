"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function AdminPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceso, setAcceso] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function verificarAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: rol } = await supabase.from("user_roles").select("rol").eq("user_id", user.id).single();
      if (!rol || rol.rol !== "admin") { router.push("/inicio"); return; }
      setAcceso(true);
      const { data: logsData } = await supabase.from("auth_logs").select("*").order("created_at", { ascending: false }).limit(50);
      const { data: uploadsData } = await supabase.from("uploads").select("*").order("uploaded_at", { ascending: false });
      setLogs(logsData ?? []);
      setUploads(uploadsData ?? []);
      setLoading(false);
    }
    verificarAdmin();
  }, [router]);

  if (!acceso) return null;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <p className="text-slate-500 text-sm">Cargando panel...</p>
    </div>
  );

  const totalExitosos = logs.filter(l => l.success).length;
  const totalFallidos = logs.filter(l => !l.success).length;

  return (
    <div className="min-h-screen w-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">
      <Header />
      <main className="flex-1 flex flex-col px-20 py-16 gap-8 max-w-6xl mx-auto w-full">

        <div className="space-y-3">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Administración</p>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">
            Panel de <span className="text-teal-400">control</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">Monitoreo de seguridad y archivos del sistema.</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total logs", value: logs.length, color: "text-teal-400" },
            { label: "Accesos exitosos", value: totalExitosos, color: "text-green-400" },
            { label: "Intentos fallidos", value: totalFallidos, color: "text-red-400" },
            { label: "Archivos cargados", value: uploads.length, color: "text-white" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 hover:border-teal-700 rounded-2xl p-6 text-center transition">
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-slate-500 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Logs de seguridad */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">
          <h3 className="text-lg font-bold text-white">Logs de seguridad</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Email</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Acción</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Resultado</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800 transition">
                    <td className="px-3 py-3 text-slate-300">{log.email}</td>
                    <td className="px-3 py-3">
                      <span className="bg-slate-800 border border-slate-700 text-slate-400 px-2 py-1 rounded-lg text-xs font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${log.success ? "bg-teal-900 text-teal-300 border-teal-700" : "bg-red-950 text-red-400 border-red-900"}`}>
                        {log.success ? "Exitoso" : "Fallido"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-500 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Archivos cargados */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">
          <h3 className="text-lg font-bold text-white">Archivos cargados</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Archivo</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Tipo</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Responsable</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Estado</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800 hover:bg-slate-800 transition">
                    <td className="px-3 py-3 text-white font-medium">{u.file_name}</td>
                    <td className="px-3 py-3">
                      <span className="bg-teal-900 text-teal-300 border border-teal-700 px-2 py-1 rounded-lg text-xs font-medium uppercase">
                        {u.file_type}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-400">{u.responsible}</td>
                    <td className="px-3 py-3">
                      <span className="bg-slate-800 border border-slate-700 text-slate-400 px-2 py-1 rounded-full text-xs font-semibold">
                        {u.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-500 text-xs">{new Date(u.uploaded_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
      <footer className="text-center py-6 text-slate-600 text-xs border-t border-slate-800">
        © 2026 Everwood Cloud — Proyecto Integrador
      </footer>
    </div>
  );
}