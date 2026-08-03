import AuthForm from "@/components/sections/auth/AuthForm";

interface AuthTemplateProps {
  mode?: "login" | "register" | "forgot-password" | "reset-password";
}

export default function AuthTemplate({ mode = "login" }: AuthTemplateProps) {
  return (
    <>
      <AuthForm mode={mode} />
    </>
  );
}
