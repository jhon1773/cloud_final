import Link from "next/link";
import { UploadForm } from "@/components/upload-form";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="hero card">
        <p className="eyebrow">Plataforma cloud para conversaciones</p>
        <h2 className="text-3xl font-bold leading-tight md:text-4xl">
          Gestiona cargas historicas de Everwood y convierte conversaciones en FAQs accionables.
        </h2>
        <p className="max-w-3xl text-slate-700">
          Sube archivos CSV, JSON o TXT de WhatsApp u otros canales, guarda metadatos en cloud,
          consulta el historial y valida sugerencias de preguntas frecuentes para mejorar tus
          agentes conversacionales.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/historial" className="btn-secondary">
            Ver historial de cargas
          </Link>
        </div>
      </section>

      <UploadForm />

      <section className="card">
        <h3 className="text-xl font-semibold">Flujo cloud implementado</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
          <li>Validacion de tipo de archivo y campos obligatorios.</li>
          <li>Almacenamiento del archivo en Supabase Storage.</li>
          <li>Registro de metadatos y sugerencias de FAQs en Supabase Database.</li>
          <li>Consulta de historial y validacion de FAQs desde la interfaz web.</li>
        </ol>
      </section>
    </div>
  );
}
