import Button from "@/components/atoms/CommonButton";
import InlineAlert from "@/components/molecules/common/InlineAlert";
import { useContactForm } from "@/hooks/ui/useContactForm";
import { NAME_REGEX, EMAIL_REGEX, PHONE_REGEX, LIMITS } from "@/utils/validation";

export default function ContactForm() {
  const {
    t,
    register,
    handleSubmit,
    errors,
    onSubmit,
    isSubmitting,
    isSuccess,
    isError,
    errorMessage,
  } = useContactForm();

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
      {isSuccess && (
        <div style={{ marginBottom: "1rem" }}>
          <InlineAlert variant="success" message="Tu mensaje fue enviado correctamente." />
        </div>
      )}

      {isError && (
        <div style={{ marginBottom: "1rem" }}>
          <InlineAlert
            variant="danger"
            message={errorMessage || "Ocurrió un error al enviar tu mensaje."}
          />
        </div>
      )}

      <div className="contact-form__field">
        <input
          className={`contact-form__input ${errors.name ? "contact-form__input--error" : ""}`}
          placeholder={t("form.placeholder.name")}
          maxLength={LIMITS.NAME_MAX}
          {...register("name", {
            required: "El nombre es obligatorio.",
            minLength: { value: LIMITS.NAME_MIN, message: `Debe tener al menos ${LIMITS.NAME_MIN} caracteres.` },
            pattern: { value: NAME_REGEX, message: "Solo letras, espacios, guiones y apóstrofes." },
          })}
        />
        {errors.name && <span className="contact-form__error">{errors.name.message}</span>}
      </div>

      <div className="contact-form__row">
        <div className="contact-form__field">
          <input
            type="email"
            className={`contact-form__input ${errors.email ? "contact-form__input--error" : ""}`}
            placeholder={t("form.placeholder.email")}
            maxLength={LIMITS.EMAIL_MAX}
            {...register("email", {
              required: "El correo es obligatorio.",
              pattern: { value: EMAIL_REGEX, message: "El formato del correo no es válido." },
            })}
          />
          {errors.email && <span className="contact-form__error">{errors.email.message}</span>}
        </div>

        <div className="contact-form__field">
          <input
            type="tel"
            className={`contact-form__input ${errors.phone ? "contact-form__input--error" : ""}`}
            placeholder={t("form.placeholder.phone")}
            {...register("phone", {
              pattern: { value: PHONE_REGEX, message: "Ej: 3001234567" },
            })}
          />
          {errors.phone && <span className="contact-form__error">{errors.phone.message}</span>}
        </div>
      </div>

      <div className="contact-form__field">
        <textarea
          className={`contact-form__input contact-form__input--textarea ${
            errors.message ? "contact-form__input--error" : ""
          }`}
          placeholder={t("form.placeholder.message")}
          rows={5}
          maxLength={LIMITS.MESSAGE_MAX}
          {...register("message", {
            required: "El mensaje es obligatorio.",
            minLength: { value: LIMITS.MESSAGE_MIN, message: `Debe tener al menos ${LIMITS.MESSAGE_MIN} caracteres.` },
          })}
        />
        {errors.message && <span className="contact-form__error">{errors.message.message}</span>}
      </div>

      <div className="contact-form__consent">
        <div className="contact-form__checkbox-wrapper">
          <input
            type="checkbox"
            id="consent"
            className="contact-form__checkbox"
            {...register("acceptTerms", { required: "Debes aceptar la política de privacidad." })}
          />
          <span className="contact-form__custom-check"></span>
        </div>
        <label htmlFor="consent" className="contact-form__label">
          {t("form.terms_and_conditions")}
        </label>
      </div>
      {errors.acceptTerms && <span className="contact-form__error">{errors.acceptTerms.message}</span>}

      <div className="contact-form__footer">
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : t("form.submit")}
        </Button>
      </div>
    </form>
  );
}