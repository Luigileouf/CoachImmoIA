import { useState } from "react";
import type { AppScreen, ProjectMode } from "../../../types/product";
import { createCoachRequest } from "../../../services/supabase/coach";
import { ChatIcon } from "./primitives";

const screenLabels: Record<AppScreen, string> = {
  assistant: "Assistant IA",
  documents: "Documents",
  home: "Accueil",
  listings: "Biens",
  profile: "Compte",
  projects: "Projet",
  social: "Communauté",
};

export function CoachContact({
  activeScreen,
  authConfigured,
  mode,
  sessionEmail,
}: {
  activeScreen: AppScreen;
  authConfigured: boolean;
  mode: ProjectMode;
  sessionEmail: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState(sessionEmail || "");
  const [message, setMessage] = useState("");
  const [urgency, setUrgency] = useState<"advice" | "soon" | "urgent">("advice");
  const [consent, setConsent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const openPanel = () => {
    setContactEmail((current) => current || sessionEmail || "");
    setError(null);
    setIsOpen(true);
  };

  const closePanel = () => {
    if (!isSending) {
      setIsOpen(false);
      setSent(false);
    }
  };

  const submitRequest = async () => {
    if (!authConfigured) {
      setError("Le service de mise en relation est momentanément indisponible.");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      await createCoachRequest({
        contactEmail,
        message,
        mode,
        screen: activeScreen,
        urgency,
      });
      setSent(true);
      setMessage("");
      setConsent(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "La demande n’a pas pu être transmise.");
    } finally {
      setIsSending(false);
    }
  };

  const canSubmit =
    consent &&
    contactEmail.includes("@") &&
    message.trim().length >= 10 &&
    !isSending;

  return (
    <>
      <button className="coach-access-button" onClick={openPanel} type="button">
        <span className="coach-access-button__icon"><ChatIcon /></span>
        <span>Coach humain</span>
      </button>

      {isOpen ? (
        <div className="coach-contact-overlay" role="presentation">
          <section aria-labelledby="coach-contact-title" aria-modal="true" className="coach-contact-panel" role="dialog">
            <div className="coach-contact-panel__header">
              <div>
                <span className="platform-section-label">Relais humain</span>
                <h2 id="coach-contact-title">Parler à un coach</h2>
              </div>
              <button aria-label="Fermer" className="coach-contact-panel__close" onClick={closePanel} type="button">×</button>
            </div>

            {sent ? (
              <div className="coach-contact-success">
                <strong>Demande transmise</strong>
                <p>Un coach pourra reprendre le contexte « {screenLabels[activeScreen]} » et te répondre à cette adresse.</p>
                <button className="platform-primary-button" onClick={closePanel} type="button">Continuer mon parcours</button>
              </div>
            ) : (
              <div className="coach-contact-form">
                <p>Explique ce que tu veux décider. Le coach recevra l’étape actuelle de ton parcours.</p>

                <label>
                  <span>Adresse de réponse</span>
                  <input
                    autoComplete="email"
                    inputMode="email"
                    onChange={(event) => setContactEmail(event.target.value)}
                    placeholder="ton@email.fr"
                    type="email"
                    value={contactEmail}
                  />
                </label>

                <label>
                  <span>Délai souhaité</span>
                  <select onChange={(event) => setUrgency(event.target.value as typeof urgency)} value={urgency}>
                    <option value="advice">J’ai besoin d’un avis</option>
                    <option value="soon">Décision dans les 48 h</option>
                    <option value="urgent">Urgent aujourd’hui</option>
                  </select>
                </label>

                <label>
                  <span>Ta question</span>
                  <textarea
                    maxLength={2000}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Exemple : je souhaite faire relire mon offre avant de l’envoyer."
                    rows={5}
                    value={message}
                  />
                </label>

                <label className="coach-contact-consent">
                  <input checked={consent} onChange={(event) => setConsent(event.target.checked)} type="checkbox" />
                  <span>J’accepte de transmettre ce message et le contexte de l’écran « {screenLabels[activeScreen]} » au coach.</span>
                </label>

                {error ? <div className="feedback-banner is-error">{error}</div> : null}

                <button className="platform-primary-button" disabled={!canSubmit} onClick={submitRequest} type="button">
                  {isSending ? "Transmission..." : "Envoyer au coach"}
                </button>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
