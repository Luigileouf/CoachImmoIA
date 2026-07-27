const INTERNAL_DRAFT_PATTERNS = [
  /\b(system prompt|developer instruction|internal instruction)\b/i,
  /\b(chain of thought|reasoning process|analysis:)\b/i,
  /\b(draft response|final answer:)\b/i,
  /\bI (?:need|should|will) (?:answer|respond|generate|analyze)\b/i,
];

export function validateAssistantOutput(content: string | undefined, finishReason?: string) {
  const normalizedContent = content?.trim() || "";
  const exposesInternalDraft = INTERNAL_DRAFT_PATTERNS.some((pattern) =>
    pattern.test(normalizedContent),
  );
  const incomplete = finishReason === "MAX_TOKENS" || finishReason === "length";

  if (!normalizedContent) {
    return {
      content: "",
      error: "Le modèle n’a pas retourné de réponse exploitable.",
      incomplete,
    };
  }

  if (exposesInternalDraft) {
    return {
      content: "",
      error: "La réponse générée n’a pas passé le contrôle de qualité. Réessayez.",
      incomplete: false,
    };
  }

  return {
    content: normalizedContent,
    error: null,
    incomplete,
  };
}
