import LegalContentSection from "@/components/sections/legalDocument/LegalContentSection";
import type { LegalDocument } from "@/types/LegalDocument";

interface LegalDocumentTemplateProps {
  data: LegalDocument;
}

export default function LegalDocumentTemplate({
  data,
}: LegalDocumentTemplateProps) {
  return (
    <>
      <LegalContentSection data={data} />
    </>
  );
}
