import { UploadDetail } from "@/components/upload-detail";
import Header from "@/components/Header";

type UploadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UploadDetailPage({ params }: UploadDetailPageProps) {
  const resolvedParams = await params;
  return (
    <div className="min-h-screen w-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">
      <Header />
      <main className="flex-1 flex flex-col px-20 py-16 gap-8 max-w-5xl mx-auto w-full">
        <UploadDetail id={resolvedParams.id} />
      </main>
      <footer className="text-center py-6 text-slate-600 text-xs border-t border-slate-800">
        © 2026 Everwood Cloud — Proyecto Integrador
      </footer>
    </div>
  );
}