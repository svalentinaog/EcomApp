export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validationRules = {
  name: {
    required: "Name is required",
    minLength: {
      value: 2,
      message: "Name must contain at least 2 characters",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: EMAIL_REGEX,
      message: "Enter a valid email address",
    },
  },
  phone: {
    required: false,
    minLength: {
      value: 7,
      message: "Phone number is too short",
    },
  },
  message: {
    required: "Message is required",
    minLength: {
      value: 10,
      message: "Message must contain at least 10 characters",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must contain at least 8 characters",
    },
  },
  confirmPassword: {
    required: "Please confirm your password",
  },
  birthDate: {
    required: "Birth date is required",
  },
};

export function validateAge(birthDate: string): string {
  if (!birthDate) return "";

  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }

  return age >= 18 ? "" : "Debes ser mayor de 18 años para registrarte.";
}

export function validateProfileForm(formData: {
  fullName: string;
  email: string;
  birthDate: string;
}) {
  const errors: string[] = [];

  if (!formData.fullName.trim()) {
    errors.push("El nombre completo es obligatorio.");
  }

  if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.push("El correo electrónico no es válido.");
  }

  if (!formData.birthDate) {
    errors.push("La fecha de nacimiento es obligatoria.");
  }

  return errors;
}

export function resolveImageUrl(imagePath?: string | null) {
  if (!imagePath) return "/images/product-image.jpg";

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `http://localhost:8000/storage/${imagePath.replace(/^\/+/, "")}`;
}
