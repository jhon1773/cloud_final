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

      const { data: rol } = await supabase
        .from("user_roles")
        .select("rol")
        .eq("user_id", user.id)
        .single();

      if (!rol || rol.rol !== "admin") { router.push("/inicio"); return; }

      setAcceso(true);

      const { data: logsData } = await supabase
        .from("auth_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      const { data: uploadsData } = await supabase
        .from("uploads")
        .select("*")
        .order("uploaded_at", { ascending: false });

      setLogs(logsData ?? []);
      setUploads(uploadsData ?? []);
      setLoading(false);
    }
    verificarAdmin();
  }, [router]);

  if (!acceso) return null;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500 text-lg">Cargando panel...</p>
    </div>
  );

  const totalExitosos = logs.filter(l => l.success).length;
  const totalFallidos = logs.filter(l => !l.success).length;

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">Panel de administración</h1>
          <p className="text-slate-500 mt-1">Monitoreo de seguridad y archivos del sistema.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
            <p className="text-3xl font-bold text-teal-600">{logs.length}</p>
            <p className="text-sm text-slate-500 mt-1">Total logs</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
            <p className="text-3xl font-bold text-green-500">{totalExitosos}</p>
            <p className="text-sm text-slate-500 mt-1">Accesos exitosos</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
            <p className="text-3xl font-bold text-red-500">{totalFallidos}</p>
            <p className="text-sm text-slate-500 mt-1">Intentos fallidos</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
            <p className="text-3xl font-bold text-slate-700">{uploads.length}</p>
            <p className="text-sm text-slate-500 mt-1">Archivos cargados</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Logs de seguridad</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <th className="px-4 py-3 rounded-l-lg">Email</th>
                  <th className="px-4 py-3">Acción</th>
                  <th className="px-4 py-3">Resultado</th>
                  <th className="px-4 py-3 rounded-r-lg">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-700">{log.email}</td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${log.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {log.success ? "Exitoso" : "Fallido"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Archivos cargados</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <th className="px-4 py-3 rounded-l-lg">Archivo</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Responsable</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 rounded-r-lg">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uploads.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-medium text-slate-700">{u.file_name}</td>
                    <td className="px-4 py-3">
                      <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded-md text-xs font-medium uppercase">
                        {u.file_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.responsible}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(u.uploaded_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}