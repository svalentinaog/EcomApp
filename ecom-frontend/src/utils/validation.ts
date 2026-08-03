// ---------- Patrones base ----------
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NAME_REGEX = /^[\p{L}\s\-']+$/u;

// Debe coincidir con StrongPassword.php: 8-64 caracteres, 1 mayúscula,
// 1 número, 1 carácter especial, charset restringido.
const PASSWORD_SPECIAL_CHARS = "!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?~`";
export const PASSWORD_REGEX = new RegExp(
  `^(?=.*[A-Z])(?=.*[0-9])(?=.*[${PASSWORD_SPECIAL_CHARS}])[A-Za-z0-9${PASSWORD_SPECIAL_CHARS}]{8,64}$`
);

// ---------- Límites (deben coincidir con los FormRequest del backend) ----------
export const LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MAX: 255,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 64,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 2000,
};

export const PHONE_REGEX = /^(\+?57)?3\d{9}$/;

// ---------- Validadores de un solo campo (reutilizables onChange y onSubmit) ----------
export function validateName(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "El nombre es obligatorio.";
  if (trimmed.length < LIMITS.NAME_MIN) return `El nombre debe tener al menos ${LIMITS.NAME_MIN} caracteres.`;
  if (trimmed.length > LIMITS.NAME_MAX) return `El nombre no puede superar los ${LIMITS.NAME_MAX} caracteres.`;
  if (!NAME_REGEX.test(trimmed)) return "El nombre solo puede contener letras, espacios, guiones y apóstrofes.";
  return "";
}

export function validateEmail(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "El correo es obligatorio.";
  if (trimmed.length > LIMITS.EMAIL_MAX) return `El correo no puede superar los ${LIMITS.EMAIL_MAX} caracteres.`;
  if (!EMAIL_REGEX.test(trimmed)) return "El formato del correo no es válido.";
  return "";
}

// requireStrength=false -> login: solo exige que no esté vacío
export function validatePassword(value: string, requireStrength: boolean): string {
  if (!value) return "La contraseña es obligatoria.";
  if (!requireStrength) return "";
  if (value.length < LIMITS.PASSWORD_MIN) return `La contraseña debe tener al menos ${LIMITS.PASSWORD_MIN} caracteres.`;
  if (value.length > LIMITS.PASSWORD_MAX) return `La contraseña no puede superar los ${LIMITS.PASSWORD_MAX} caracteres.`;
  if (!PASSWORD_REGEX.test(value)) {
    return "Debe incluir al menos una mayúscula, un número y un carácter especial.";
  }
  return "";
}

export function validatePasswordConfirmation(password: string, confirmation: string): string {
  if (!confirmation) return "Debes confirmar la contraseña.";
  if (password !== confirmation) return "Las contraseñas no coinciden.";
  return "";
}

export function validateAge(birthDate: string): string {
  if (!birthDate) return "La fecha de nacimiento es obligatoria.";
  const birth = new Date(birthDate);
  const minDate = new Date("1900-01-01");
  const today = new Date();

  if (birth < minDate) {
    return "La fecha de nacimiento no es válida (debe ser posterior a 1900).";
  }

  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= 18 ? "" : "Debes tener al menos 18 años para registrarte.";
}

// ---------- Formulario de perfil ----------
export function validateProfileForm(data: { fullName: string; email: string; birthDate: string }): string[] {
  const errors: string[] = [];

  const nameError = validateName(data.fullName);
  if (nameError) errors.push(nameError);

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  if (data.birthDate) {
    const ageError = validateAge(data.birthDate);
    if (ageError) errors.push(ageError);
  }

  return errors;
}