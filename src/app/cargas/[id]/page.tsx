import { UploadDetail } from "@/components/upload-detail";
import AuthGate from "@/components/auth-gate";

type UploadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UploadDetailPage({ params }: UploadDetailPageProps) {
  const resolvedParams = await params;
  return (
    <AuthGate>
      <UploadDetail id={resolvedParams.id} />
    </AuthGate>
  );
}
