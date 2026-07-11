import Button from "@/components/atoms/CommonButton";
import { useContactForm } from "@/hooks/useContactForm";

export default function ContactForm() {
  const { t, register, handleSubmit, errors, onSubmit } = useContactForm();

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="contact-form__field">
        <input
          className={`contact-form__input ${
            errors.name ? "contact-form__input--error" : ""
          }`}
          placeholder={t("form.placeholder.name")}
          {...register("name", { required: true })}
        />
      </div>

      <div className="contact-form__row">
        <input
          type="email"
          className="contact-form__input"
          placeholder={t("form.placeholder.email")}
          {...register("email", { required: true })}
        />
        <input
          type="tel"
          className="contact-form__input"
          placeholder={t("form.placeholder.phone")}
          {...register("phone")}
        />
      </div>

      <textarea
        className="contact-form__input contact-form__input--textarea"
        placeholder={t("form.placeholder.message")}
        rows={5}
        {...register("message", { required: true })}
      />

      <div className="contact-form__consent">
        <div className="contact-form__checkbox-wrapper">
          <input
            type="checkbox"
            id="consent"
            className="contact-form__checkbox"
            {...register("acceptTerms", { required: true })}
          />
          <span className="contact-form__custom-check"></span>
        </div>
        <label htmlFor="consent" className="contact-form__label">
          {t("form.terms_and_conditions")}
        </label>
      </div>

      <div className="contact-form__footer">
        <Button variant="primary" type="submit">
          {t("form.submit")}
        </Button>
      </div>
    </form>
  );
}
