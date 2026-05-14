import { UploadDetail } from "@/components/upload-detail";

type UploadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UploadDetailPage({ params }: UploadDetailPageProps) {
  const resolvedParams = await params;
  return <UploadDetail id={resolvedParams.id} />;
}
