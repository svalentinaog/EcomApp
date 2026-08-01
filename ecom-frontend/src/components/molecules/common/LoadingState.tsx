import loadingIcon from "@/assets/icons/loading-icon.png";
import Container from "@/layouts/Container";
import { useTranslation } from "react-i18next"; 

interface LoadingStateProps {
  className?: string;
}

export default function LoadingState ({
  className = "w-16 h-16 animate-spin opacity-60",
}: LoadingStateProps) {
  const { t } = useTranslation();

  return (
    <Container>
        <div className="loading">
            <img src={loadingIcon} alt={t("loading")} className={className} />
        </div>
    </Container>
  );
}