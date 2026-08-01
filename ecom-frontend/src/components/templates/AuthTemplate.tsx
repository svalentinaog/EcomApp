import HeroSection from "@/components/sections/auth/HeroSection";

interface AuthTemplateProps {
  mode?: "login" | "register" | "forgot-password" | "reset-password";
}

export default function AuthTemplate({ mode = "login" }: AuthTemplateProps) {
  return (
    <>
      <HeroSection mode={mode} />
    </>
  );
}
