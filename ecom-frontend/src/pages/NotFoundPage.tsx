import { useNavigate, useParams } from "react-router-dom";
import Container from "@/layouts/Container";
import CommonButton from "@/components/atoms/CommonButton";

import { image404 } from "@/assets";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { lang = "es" } = useParams<{ lang: string }>();

  const handleGoHome = () => {
    navigate(`/${lang}`);
  };

  return (
    <Container>
      <section className="not-found">
        <div className="not-found__content">
          <span className="not-found__code">404</span>
          <h1 className="not-found__title">¡Ups! Página no encontrada</h1>
          <p className="not-found__text">
            El enlace que intentaste abrir no existe o ya no está disponible. Explora nuestro catálogo desde el inicio.
          </p>
          <div className="not-found__action">
            <CommonButton variant="primary" onClick={handleGoHome}>
              Ir a la Página de Inicio
            </CommonButton>
          </div>
        </div>

        <div className="not-found__image">
          <img src={image404} alt="Página no encontrada 404" />
        </div>
      </section>
    </Container>
  );
}