const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export type CredentialsValidation = {
  emailError: string | null;
  passwordError: string | null;
  isValid: boolean;
};

export function validateCredentials(email: string, password: string): CredentialsValidation {
  const normalizedEmail = email.trim();
  const emailError = !normalizedEmail
    ? "Saisissez votre adresse e-mail."
    : !EMAIL_PATTERN.test(normalizedEmail)
      ? "Saisissez une adresse e-mail valide."
      : null;
  const passwordError = !password
    ? "Saisissez votre mot de passe."
    : password.length < MIN_PASSWORD_LENGTH
      ? `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`
      : null;

  return {
    emailError,
    passwordError,
    isValid: !emailError && !passwordError,
  };
}

export function localizeAuthError(error: unknown, fallback = "Connexion impossible.") {
  const message = error instanceof Error ? error.message : fallback;
  const normalized = message.toLowerCase();

  if (normalized.includes("failed to fetch") || normalized.includes("network")) {
    return "Connexion impossible. Vérifiez votre accès Internet puis réessayez.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Adresse e-mail ou mot de passe incorrect.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Confirmez votre adresse e-mail avant de vous connecter.";
  }

  if (normalized.includes("email rate limit")) {
    return "La limite d’envoi d’e-mails est atteinte. Réessayez plus tard.";
  }

  return message || fallback;
}
