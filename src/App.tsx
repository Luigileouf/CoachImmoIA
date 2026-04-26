import { useState } from "react";
import {
  actionCards,
  assistantConversations,
  listingFeeds,
  profileSections,
  projectSteps,
  scenarios,
  securityMessage,
  type ActionCard,
  type AppScreen,
  type ProjectMode,
} from "./data/content";
import {
  getAssistantRuntime,
  sendAssistantMessage,
  type AssistantMessage,
} from "./lib/assistant";

type ScenarioData = (typeof scenarios)[ProjectMode];
type AssistantThread = Record<ProjectMode, AssistantMessage[]>;

function LogoMark() {
  return (
    <svg aria-hidden="true" className="logo-mark" viewBox="0 0 40 40">
      <rect x="3" y="10" width="18" height="22" rx="8" transform="rotate(-45 3 10)" />
      <rect x="17" y="8" width="18" height="22" rx="8" transform="rotate(45 17 8)" />
      <path d="M12 20.5 20 13l8 7.5v6.5a2 2 0 0 1-2 2h-3.5v-6h-5v6H14a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" className="icon icon--bell" viewBox="0 0 24 24">
      <path
        d="M12 4.5a4 4 0 0 0-4 4v2.3c0 .8-.2 1.6-.6 2.3L6 15.5h12l-1.4-2.4c-.4-.7-.6-1.5-.6-2.3V8.5a4 4 0 0 0-4-4Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M10 18a2.2 2.2 0 0 0 4 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="arrow-icon" viewBox="0 0 24 24">
      <path
        d="m9 6 6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg aria-hidden="true" className="sparkle-icon" viewBox="0 0 24 24">
      <path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z" />
      <path d="M18.5 2 19.4 4.6 22 5.5l-2.6.9-.9 2.6-.9-2.6L15 5.5l2.6-.9Z" />
    </svg>
  );
}

function highlightText(text: string, highlight: string) {
  if (!text.includes(highlight)) {
    return text;
  }

  const parts = text.split(highlight);

  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? <strong>{highlight}</strong> : null}
    </span>
  ));
}

function IconForCard({ icon }: Pick<ActionCard, "icon">) {
  if (icon === "home") {
    return (
      <svg aria-hidden="true" className="feature-icon" viewBox="0 0 24 24">
        <path
          d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (icon === "key") {
    return (
      <svg aria-hidden="true" className="feature-icon" viewBox="0 0 24 24">
        <circle
          cx="8"
          cy="12"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 12h8m-3 0v3m-3-3v2"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="feature-icon" viewBox="0 0 24 24">
      <path
        d="M5 19V9m7 10V5m7 14v-8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M3.5 21h17"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SceneArtwork({ scene }: Pick<ActionCard, "scene">) {
  return (
    <div className={`scene scene--${scene}`}>
      <div className="scene__glow" />
      <div className="scene__shape scene__shape--one" />
      <div className="scene__shape scene__shape--two" />
      <div className="scene__shape scene__shape--three" />
    </div>
  );
}

function HomeActionCard({
  card,
  isActive,
  onSelect,
}: {
  card: ActionCard;
  isActive: boolean;
  onSelect: (id: ActionCard["id"]) => void;
}) {
  return (
    <button
      className={isActive ? "action-card is-active" : "action-card"}
      onClick={() => onSelect(card.id)}
      type="button"
    >
      <div className="action-card__content">
        <div className="action-card__icon-wrap">
          <IconForCard icon={card.icon} />
        </div>
        <div className="action-card__copy">
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
      </div>

      <div className="action-card__visual">
        <div className="action-card__arrow">
          <ArrowIcon />
        </div>
        <SceneArtwork scene={card.scene} />
      </div>
    </button>
  );
}

function ModeSwitch({
  mode,
  onChange,
}: {
  mode: ProjectMode;
  onChange: (mode: ProjectMode) => void;
}) {
  return (
    <div className="mode-switch-inline" role="tablist" aria-label="Type de projet">
      <button
        className={mode === "buyer" ? "mode-chip is-active" : "mode-chip"}
        onClick={() => onChange("buyer")}
        type="button"
      >
        Acheteur
      </button>
      <button
        className={mode === "seller" ? "mode-chip is-active" : "mode-chip"}
        onClick={() => onChange("seller")}
        type="button"
      >
        Vendeur
      </button>
    </div>
  );
}

function AssistantOrbit() {
  return (
    <div className="assistant-orbit" aria-hidden="true">
      <div className="assistant-orbit__halo assistant-orbit__halo--outer" />
      <div className="assistant-orbit__halo assistant-orbit__halo--mid" />
      <div className="assistant-orbit__halo assistant-orbit__halo--inner" />
      <div className="assistant-bot">
        <div className="assistant-bot__visor">
          <span />
          <span />
        </div>
      </div>
      <div className="spark spark--one" />
      <div className="spark spark--two" />
      <div className="spark spark--three" />
    </div>
  );
}

function HomeScreen({
  mode,
  scenario,
  onModeChange,
  onAction,
  onPrimaryAction,
}: {
  mode: ProjectMode;
  scenario: ScenarioData;
  onModeChange: (mode: ProjectMode) => void;
  onAction: (id: ActionCard["id"]) => void;
  onPrimaryAction: () => void;
}) {
  return (
    <>
      <section className="hero-block">
        <div className="hero-copy">
          <h1>
            {scenario.greeting}
            <br />
            {scenario.title} <span>{scenario.accent}</span>
          </h1>
          <p>{highlightText(scenario.intro, scenario.introHighlight)}</p>
        </div>

        <AssistantOrbit />
      </section>

      <section className="actions-section">
        <div className="section-heading">
          <div>
            <p className="section-label">Que souhaitez-vous faire ?</p>
            <p className="section-copy">Choisissez une entree produit pour avancer tout de suite.</p>
          </div>
          <ModeSwitch mode={mode} onChange={onModeChange} />
        </div>

        <div className="action-list">
          {actionCards.map((card) => (
            <HomeActionCard
              card={card}
              isActive={card.id === mode}
              key={card.id}
              onSelect={onAction}
            />
          ))}
        </div>
      </section>

      <button className="primary-cta" onClick={onPrimaryAction} type="button">
        <span>{scenario.cta}</span>
        <SparkleIcon />
      </button>

      <section className="trust-card">
        <div className="trust-card__icon">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path
              d="M12 3.5 19 6v5.2c0 4.4-2.9 8.5-7 9.8-4.1-1.3-7-5.4-7-9.8V6z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="m8.8 12.2 2.2 2.1 4.4-4.7"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </div>
        <p>{securityMessage}</p>
      </section>

      <section className="stats-grid">
        {scenario.stats.map((stat) => (
          <article className="metric-card" key={stat.label}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="project-card">
        <div className="project-card__top">
          <div>
            <p className="project-card__eyebrow">Projet en cours</p>
            <h2>{scenario.projectStatus}</h2>
          </div>
          <span className="project-card__badge">{mode === "buyer" ? "Acheteur" : "Vendeur"}</span>
        </div>

        <p className="project-card__note">{scenario.projectNote}</p>

        <ul className="project-card__list">
          {scenario.checklist.map((item) => (
            <li key={item}>
              <span className="project-card__bullet" />
              {item}
            </li>
          ))}
        </ul>

        <div className="coach-hint">
          <SparkleIcon />
          <p>{scenario.coachHint}</p>
        </div>
      </section>
    </>
  );
}

function ListingsScreen({
  mode,
  scenario,
  onModeChange,
}: {
  mode: ProjectMode;
  scenario: ScenarioData;
  onModeChange: (mode: ProjectMode) => void;
}) {
  return (
    <section className="screen-stack">
      <div className="screen-header">
        <p className="screen-eyebrow">Biens</p>
        <h1>{scenario.listingsTitle}</h1>
        <p>{scenario.listingsSubtitle}</p>
      </div>

      <ModeSwitch mode={mode} onChange={onModeChange} />

      <div className="filter-row">
        {scenario.listingFilters.map((filter) => (
          <span className="filter-chip" key={filter}>
            {filter}
          </span>
        ))}
      </div>

      <div className="listing-stack">
        {listingFeeds[mode].map((item) => (
          <article className="listing-card" key={`${item.title}-${item.location}`}>
            <div className="listing-card__copy">
              <div className="listing-card__meta">
                <span className="listing-card__badge">{item.badge}</span>
                <button className="ghost-icon" type="button" aria-label={`Voir ${item.title}`}>
                  <ArrowIcon />
                </button>
              </div>
              <h2>{item.title}</h2>
              <p className="listing-card__location">{item.location}</p>
              <strong className="listing-card__price">{item.price}</strong>
              <p className="listing-card__detail">{item.detail}</p>
            </div>

            <SceneArtwork scene={item.scene} />
          </article>
        ))}
      </div>
    </section>
  );
}

function AssistantScreen({
  mode,
  scenario,
  draft,
  error,
  isLoading,
  messages,
  onDraftChange,
  onModeChange,
  onPromptClick,
  onSubmit,
}: {
  mode: ProjectMode;
  scenario: ScenarioData;
  draft: string;
  error: string | null;
  isLoading: boolean;
  messages: AssistantMessage[];
  onDraftChange: (value: string) => void;
  onModeChange: (mode: ProjectMode) => void;
  onPromptClick: (prompt: string) => void;
  onSubmit: () => void;
}) {
  const runtime = getAssistantRuntime();

  return (
    <section className="screen-stack">
      <div className="screen-header">
        <p className="screen-eyebrow">Assistant IA</p>
        <h1>Une conversation qui fait avancer le projet</h1>
        <p>{scenario.assistantIntro}</p>
      </div>

      <ModeSwitch mode={mode} onChange={onModeChange} />

      <div className="assistant-runtime">
        <span className="assistant-runtime__badge">Modele actif</span>
        <strong>{runtime.label}</strong>
      </div>

      <div className="chat-card">
        {messages.map((message, index) => (
          <div
            className={message.role === "assistant" ? "chat-bubble is-assistant" : "chat-bubble is-user"}
            key={`${message.content}-${index}`}
          >
            {message.content}
          </div>
        ))}

        {isLoading ? <div className="chat-bubble is-assistant is-loading">CoachImmoIA reflechit...</div> : null}
      </div>

      <div className="prompt-row">
        {scenario.assistantPrompts.map((prompt) => (
          <button className="prompt-pill" key={prompt} onClick={() => onPromptClick(prompt)} type="button">
            {prompt}
          </button>
        ))}
      </div>

      {error ? <div className="assistant-error">{error}</div> : null}

      <div className="assistant-composer">
        <div>
          <p className="assistant-composer__label">Message a envoyer</p>
          <textarea
            className="assistant-input"
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder="Posez une question sur votre projet immobilier..."
            rows={4}
            value={draft}
          />
        </div>
        <button className="send-button" disabled={isLoading || !draft.trim()} onClick={onSubmit} type="button">
          {isLoading ? "Envoi..." : "Envoyer"}
        </button>
      </div>
    </section>
  );
}

function ProjectsScreen({
  mode,
  scenario,
  onModeChange,
}: {
  mode: ProjectMode;
  scenario: ScenarioData;
  onModeChange: (mode: ProjectMode) => void;
}) {
  return (
    <section className="screen-stack">
      <div className="screen-header">
        <p className="screen-eyebrow">Projets</p>
        <h1>{scenario.projectStatus}</h1>
        <p>{scenario.projectNote}</p>
      </div>

      <ModeSwitch mode={mode} onChange={onModeChange} />

      <div className="stats-grid">
        {scenario.stats.map((stat) => (
          <article className="metric-card" key={stat.label}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="timeline-card">
        {projectSteps[mode].map((step) => (
          <div className={`timeline-step is-${step.status}`} key={step.title}>
            <span className="timeline-step__dot" />
            <div>
              <h2>{step.title}</h2>
              <p>{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="docs-card">
        <div className="docs-card__header">
          <h2>Documents a piloter</h2>
          <span>{scenario.projectDocuments.length} elements</span>
        </div>
        <ul className="docs-card__list">
          {scenario.projectDocuments.map((document) => (
            <li key={document}>
              <span className="docs-card__dot" />
              {document}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProfileScreen() {
  return (
    <section className="screen-stack">
      <div className="screen-header">
        <p className="screen-eyebrow">Profil</p>
        <h1>Compte, preferences et confiance</h1>
        <p>Retrouvez vos parametres personnels, le cadre de partage et vos habitudes de suivi.</p>
      </div>

      <article className="profile-hero">
        <div className="profile-avatar">LM</div>
        <div>
          <h2>Loic Metivier</h2>
          <p>Compte verifie, suivi actif avec copilote immobilier IA</p>
        </div>
      </article>

      {profileSections.map((section) => (
        <article className="profile-card" key={section.title}>
          <div className="profile-card__header">
            <h2>{section.title}</h2>
          </div>
          <div className="profile-card__rows">
            {section.items.map((item) => (
              <div className="profile-row" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>
      ))}

      <section className="trust-card">
        <div className="trust-card__icon">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path
              d="M12 3.5 19 6v5.2c0 4.4-2.9 8.5-7 9.8-4.1-1.3-7-5.4-7-9.8V6z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="m8.8 12.2 2.2 2.1 4.4-4.7"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </div>
        <p>{securityMessage}</p>
      </section>
    </section>
  );
}

function App() {
  const [mode, setMode] = useState<ProjectMode>("buyer");
  const [activeScreen, setActiveScreen] = useState<AppScreen>("home");
  const [assistantDraft, setAssistantDraft] = useState(scenarios.buyer.assistantPrompts[0]);
  const [assistantThreads, setAssistantThreads] = useState<AssistantThread>(() => ({
    buyer: assistantConversations.buyer.map((message) => ({
      role: message.from,
      content: message.text,
    })),
    seller: assistantConversations.seller.map((message) => ({
      role: message.from,
      content: message.text,
    })),
  }));
  const [assistantError, setAssistantError] = useState<string | null>(null);
  const [assistantLoading, setAssistantLoading] = useState(false);

  const scenario = scenarios[mode];

  const handleModeChange = (nextMode: ProjectMode) => {
    setMode(nextMode);
    setAssistantDraft(scenarios[nextMode].assistantPrompts[0]);
    setAssistantError(null);
  };

  const handleAction = (id: ActionCard["id"]) => {
    if (id === "buyer") {
      setMode("buyer");
      setAssistantDraft(scenarios.buyer.assistantPrompts[0]);
      setActiveScreen("listings");
      return;
    }

    if (id === "seller") {
      setMode("seller");
      setAssistantDraft(scenarios.seller.assistantPrompts[0]);
      setActiveScreen("projects");
      return;
    }

    setMode("seller");
    setAssistantDraft("J'aimerais estimer mon bien avant de choisir une strategie de vente.");
    setAssistantError(null);
    setActiveScreen("assistant");
  };

  const handleAssistantSubmit = async () => {
    const content = assistantDraft.trim();

    if (!content || assistantLoading) {
      return;
    }

    const userMessage: AssistantMessage = {
      role: "user",
      content,
    };

    const nextThread = [...assistantThreads[mode], userMessage];

    setAssistantError(null);
    setAssistantLoading(true);
    setAssistantDraft("");
    setAssistantThreads((current) => ({
      ...current,
      [mode]: nextThread,
    }));

    try {
      const response = await sendAssistantMessage({
        mode,
        messages: nextThread,
      });

      setAssistantThreads((current) => ({
        ...current,
        [mode]: [
          ...current[mode],
          {
            role: "assistant",
            content: response.content,
          },
        ],
      }));
    } catch (error) {
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "Connexion au modele impossible pour le moment.";

      setAssistantError(
        `${fallbackMessage} Verifiez la cle API Mistral et le modele configure, puis reessayez.`,
      );
      setAssistantDraft(content);
      setAssistantThreads((current) => ({
        ...current,
        [mode]: current[mode].filter((_, index) => index !== current[mode].length - 1),
      }));
    } finally {
      setAssistantLoading(false);
    }
  };

  const renderScreen = () => {
    if (activeScreen === "home") {
      return (
        <HomeScreen
          mode={mode}
          onAction={handleAction}
          onModeChange={handleModeChange}
          onPrimaryAction={() => setActiveScreen("projects")}
          scenario={scenario}
        />
      );
    }

    if (activeScreen === "listings") {
      return <ListingsScreen mode={mode} onModeChange={handleModeChange} scenario={scenario} />;
    }

    if (activeScreen === "assistant") {
      return (
        <AssistantScreen
          draft={assistantDraft}
          error={assistantError}
          isLoading={assistantLoading}
          messages={assistantThreads[mode]}
          mode={mode}
          onDraftChange={setAssistantDraft}
          onModeChange={handleModeChange}
          onPromptClick={setAssistantDraft}
          onSubmit={handleAssistantSubmit}
          scenario={scenario}
        />
      );
    }

    if (activeScreen === "projects") {
      return <ProjectsScreen mode={mode} onModeChange={handleModeChange} scenario={scenario} />;
    }

    return <ProfileScreen />;
  };

  return (
    <main className="stage">
      <div className="ambient ambient--left" />
      <div className="ambient ambient--right" />
      <div className="pedestal" />

      <section className="phone-frame" aria-label="Application CoachImmoIA">
        <div className="phone-shell">
          <div className="phone-speaker" />

          <div className="phone-screen">
            <header className="status-bar" aria-hidden="true">
              <span>9:41</span>
              <div className="status-icons">
                <span className="signal-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className="wifi-icon" />
                <span className="battery-icon" />
              </div>
            </header>

            <div className="app-topbar">
              <div className="brand">
                <LogoMark />
                <span>
                  CoachImmo<span>IA</span>
                </span>
              </div>

              <button className="icon-button" type="button" aria-label="Notifications">
                <BellIcon />
                <span className="icon-button__dot" />
              </button>
            </div>

            <div className="screen-scroll">{renderScreen()}</div>

            <nav className="bottom-nav" aria-label="Navigation principale">
              <button
                className={activeScreen === "home" ? "bottom-nav__item is-active" : "bottom-nav__item"}
                onClick={() => setActiveScreen("home")}
                type="button"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
                <span>Accueil</span>
              </button>

              <button
                className={activeScreen === "listings" ? "bottom-nav__item is-active" : "bottom-nav__item"}
                onClick={() => setActiveScreen("listings")}
                type="button"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="m20 20-3.5-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
                <span>Biens</span>
              </button>

              <button
                className={
                  activeScreen === "assistant"
                    ? "bottom-nav__item bottom-nav__item--center is-active"
                    : "bottom-nav__item bottom-nav__item--center"
                }
                onClick={() => setActiveScreen("assistant")}
                type="button"
              >
                <SparkleIcon />
                <span>Assistant IA</span>
              </button>

              <button
                className={activeScreen === "projects" ? "bottom-nav__item is-active" : "bottom-nav__item"}
                onClick={() => setActiveScreen("projects")}
                type="button"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M6 4.5V3m12 1.5V3M5 8h14M6 5.5h12A1.5 1.5 0 0 1 19.5 7v11A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V7A1.5 1.5 0 0 1 6 5.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
                <span>Projets</span>
              </button>

              <button
                className={activeScreen === "profile" ? "bottom-nav__item is-active" : "bottom-nav__item"}
                onClick={() => setActiveScreen("profile")}
                type="button"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="8.5"
                    r="3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M5.5 20a6.5 6.5 0 0 1 13 0"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
                <span>Profil</span>
              </button>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
