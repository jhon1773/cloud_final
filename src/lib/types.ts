export type UploadStatus = "cargado" | "pendiente" | "procesado" | "error";

export interface FaqSuggestion {
  id: string;
  question: string;
  answer: string;
  count: number;
  status: "pendiente" | "aprobada" | "rechazada";
}

export interface UploadRecord {
  id: string;
  file_name: string;
  uploaded_at: string;
  file_type: string;
  file_size: number;
  responsible: string;
  status: UploadStatus;
  observations: string | null;
  storage_path: string;
  preview_snippet: string;
  faq_suggestions: FaqSuggestion[];
}

export interface ProjectMetrics {
  totalUploads: number;
  uploadsByStatus: Record<UploadStatus, number>;
  totalFaqs: number;
  approvedFaqs: number;
  rejectedFaqs: number;
  pendingFaqs: number;
  approvedRate: number;
}
