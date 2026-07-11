import Container from "@/layouts/Container";
import comingSoon from "@/assets/icons/coming-soon.png";
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  title?: string;
  description?: string;
  iconSrc?: string;
  minHeight?: number;
};

export default function ComingSoon({
  title,
  description,
  iconSrc = comingSoon,
  minHeight = 600,
}: Props) {
  const { t } = useTranslation("common");
  const style: CSSProperties = { minHeight };
  const icon = iconSrc;
  const displayTitle = title ?? t("comingSoon.title");
  const displayDescription = description ?? t("comingSoon.description");

  return (
    <section className="coming-soon" style={style}>
      <Container>
        <div className="coming-soon-card">
          <img src={icon} alt="coming-soon" className="coming-soon-icon" />
          <h2>{displayTitle}</h2>
          <p>{displayDescription}</p>
        </div>
      </Container>
    </section>
  );
}
