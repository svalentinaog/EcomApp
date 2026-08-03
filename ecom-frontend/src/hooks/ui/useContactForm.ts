import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { api } from "@/services/api";

interface ContactFormValues {
  name: string;
  email: string;
  phone?: string;
  message: string;
  acceptTerms: boolean;
}

export function useContactForm() {
  const { t } = useTranslation("contact");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({ mode: "onBlur" });
  // mode: "onBlur" hace lo mismo que armamos a mano para el login/registro
  // (no valida hasta que el campo pierde el foco, y de ahí en adelante
  // revalida en cada tecla) — react-hook-form ya lo trae integrado.

  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await api.post("/contact", data);
      return response.data;
    },
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };

  return {
    t,
    register,
    handleSubmit,
    errors,
    onSubmit,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage: (mutation.error as any)?.response?.data?.message as string | undefined,
  };
}