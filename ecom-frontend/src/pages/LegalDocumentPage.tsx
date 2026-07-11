import legalDocs from "../data/legalDocs.json";
import { useParams, Navigate } from "react-router-dom";
import LegalDocumentTemplate from "@/components/templates/LegalDocumentTemplate";
import type { LegalDocument } from "@/types/LegalDocument";

export default function LegalDocumentPage() {
  const { slug } = useParams<{ slug: string }>();

  const document = legalDocs.documents.find(
    (doc) => doc.slug === slug
  ) as LegalDocument;

  if (!document) {
    return <Navigate to="/" replace />;
  }

  return <LegalDocumentTemplate data={document} />;
}
