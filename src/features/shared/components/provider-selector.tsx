import type { AssistantProvider } from "../../../lib/assistant";

export function ProviderSelector({
  disabled = false,
  provider,
  onChange,
}: {
  disabled?: boolean;
  provider: AssistantProvider;
  onChange: (provider: AssistantProvider) => void;
}) {
  return (
    <div className="provider-selector" role="group" aria-label="Modèle IA à utiliser">
      <span className="provider-selector__label">Tester avec</span>
      {(["mistral", "google"] as const).map((option) => (
        <button
          aria-pressed={provider === option}
          className={provider === option ? "provider-selector__button is-active" : "provider-selector__button"}
          disabled={disabled}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {option === "mistral" ? "Mistral" : "Gemma"}
        </button>
      ))}
    </div>
  );
}
