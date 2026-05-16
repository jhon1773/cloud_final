import { UploadsTable } from "@/components/uploads-table";
import AuthGate from "@/components/auth-gate";

export default function HistorialPage() {
  return (
    <AuthGate>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Historial de cargas</h1>
        <p className="text-slate-700">
          Revisa todas las cargas de conversaciones de Everwood y abre el detalle de cada registro.
        </p>
        <UploadsTable />
      </div>
    </AuthGate>
  );
}
