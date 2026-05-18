import { UploadDetail } from "@/components/upload-detail";
import Header from "@/components/Header";

type UploadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UploadDetailPage({ params }: UploadDetailPageProps) {
  const resolvedParams = await params;
  return (
    <>
      <Header />
      <UploadDetail id={resolvedParams.id} />
    </>
  );
}