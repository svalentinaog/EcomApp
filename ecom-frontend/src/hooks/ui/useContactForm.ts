import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  acceptTerms: boolean;
}

export function useContactForm() {
  const { t } = useTranslation("contact");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>();

  const onSubmit = (data: ContactFormValues) => {
    console.log("Form Data:", data);
  };

  return {
    t,
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
}
