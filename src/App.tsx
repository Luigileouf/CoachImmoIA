import { useState, type ReactNode } from "react";
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
type HomeVariant = "default" | "empty";
type ListingsVariant = "default" | "empty";
type AssistantVariant = "default" | "empty" | "loading";
type ProjectsVariant = "default" | "empty" | "risk" | "sent";
type ScreenVariantState = {
  home: HomeVariant;
  listings: ListingsVariant;
  assistant: AssistantVariant;
  projects: ProjectsVariant;
};

type DocumentStatus = {
  label: string;
  status: string;
  tone: "mint" | "dark";
};

const sellerDocumentStatuses: DocumentStatus[] = [
  { label: "Titre de propriete", status: "Disponible", tone: "mint" },
  { label: "Taxe fonciere", status: "Disponible", tone: "mint" },
  { label: "Diagnostics", status: "A completer", tone: "dark" },
  { label: "PV d'AG et carnet d'entretien", status: "A demander", tone: "dark" },
];

const defaultVariants: ScreenVariantState = {
  home: "default",
  listings: "default",
  assistant: "default",
  projects: "default",
};

function LogoMark() {
  return (
    <svg aria-hidden="true" className="logo-mark" viewBox="0 0 32 32">
      <rect x="4" y="6" width="9" height="15" rx="4" transform="rotate(-45 4 6)" />
      <rect x="16" y="5" width="9" height="15" rx="4" transform="rotate(45 16 5)" />
      <path d="M10 16.5 16 11l6 5.5v5a2 2 0 0 1-2 2h-2.7v-4.8h-2.6v4.8H12a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" className="mini-icon" viewBox="0 0 24 24">
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
    <svg aria-hidden="true" className="mini-icon" viewBox="0 0 24 24">
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
    <svg aria-hidden="true" className="mini-icon" viewBox="0 0 24 24">
      <path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z" />
      <path d="M18.5 2 19.4 4.6 22 5.5l-2.6.9-.9 2.6-.9-2.6L15 5.5l2.6-.9Z" />
    </svg>
  );
}

function HomeGlyph() {
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

function KeyGlyph() {
  return (
    <svg aria-hidden="true" className="feature-icon" viewBox="0 0 24 24">
      <circle cx="8" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
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

function ChartGlyph() {
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

function GridIcon() {
  return (
    <svg aria-hidden="true" className="nav-icon-svg" viewBox="0 0 24 24">
      <rect x="5" y="5" width="5" height="5" rx="1.6" />
      <rect x="14" y="5" width="5" height="5" rx="1.6" />
      <rect x="5" y="14" width="5" height="5" rx="1.6" />
      <rect x="14" y="14" width="5" height="5" rx="1.6" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" className="nav-icon-svg" viewBox="0 0 24 24">
      <path d="M5 6.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H11l-4.5 3v-3H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="nav-icon-svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.7 12.5 2.1 2.1 4.5-4.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" className="nav-icon-svg" viewBox="0 0 24 24">
      <circle cx="12" cy="8.3" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" fill="none" stroke="currentColor" strokeWidth="1.8" />
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

function ModeTabs({
  mode,
  onChange,
  includeEstimate = false,
  activeAction,
  onActionChange,
}: {
  mode: ProjectMode;
  onChange: (mode: ProjectMode) => void;
  includeEstimate?: boolean;
  activeAction?: ActionCard["id"];
  onActionChange?: (id: ActionCard["id"]) => void;
}) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="Type de parcours">
      <button
        className={mode === "buyer" ? "mode-tab is-active" : "mode-tab"}
        onClick={() => {
          onChange("buyer");
          onActionChange?.("buyer");
        }}
        type="button"
      >
        Acheteur
      </button>
      <button
        className={mode === "seller" ? "mode-tab is-active" : "mode-tab"}
        onClick={() => {
          onChange("seller");
          onActionChange?.("seller");
        }}
        type="button"
      >
        Vendeur
      </button>
      {includeEstimate ? (
        <button
          className={activeAction === "estimate" ? "mode-tab is-active" : "mode-tab"}
          onClick={() => {
            onChange("seller");
            onActionChange?.("estimate");
          }}
          type="button"
        >
          Estimer
        </button>
      ) : null}
    </div>
  );
}

function AppTopBar({ subtitle }: { subtitle: string }) {
  return (
    <div className="app-topbar">
      <div className="app-brand">
        <LogoMark />
        <div>
          <strong>CoachImmoIA</strong>
          <span>{subtitle}</span>
        </div>
      </div>

      <button className="round-button" type="button" aria-label="Notifications">
        <BellIcon />
        <span className="round-button__dot" />
      </button>
    </div>
  );
}

function AssistantVisual() {
  return (
    <div className="assistant-visual" aria-hidden="true">
      <div className="assistant-visual__aura assistant-visual__aura--mint" />
      <div className="assistant-visual__aura assistant-visual__aura--peach" />
      <div className="assistant-visual__robot">
        <div className="assistant-visual__helmet">
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function EmptyStateVisual({
  tone = "mint",
}: {
  tone?: "mint" | "sand" | "sage";
}) {
  return (
    <div className={`empty-visual empty-visual--${tone}`} aria-hidden="true">
      <div className="empty-visual__halo" />
      <div className="empty-visual__bubble" />
      <div className="empty-visual__ground" />
      <div className="empty-visual__house" />
      <div className="empty-visual__roof empty-visual__roof--left" />
      <div className="empty-visual__roof empty-visual__roof--right" />
    </div>
  );
}

function SceneArtwork({ scene }: Pick<ActionCard, "scene">) {
  return (
    <div className={`scene-card scene-card--${scene}`}>
      <div className="scene-card__blob scene-card__blob--one" />
      <div className="scene-card__blob scene-card__blob--two" />
      <div className="scene-card__ground" />
      <div className="scene-card__house" />
      <div className="scene-card__roof scene-card__roof--left" />
      <div className="scene-card__roof scene-card__roof--right" />
    </div>
  );
}

function ActionIcon({ icon }: Pick<ActionCard, "icon">) {
  if (icon === "home") return <HomeGlyph />;
  if (icon === "key") return <KeyGlyph />;
  return <ChartGlyph />;
}

function HomeActionCard({
  card,
  active,
  onClick,
}: {
  card: ActionCard;
  active: boolean;
  onClick: (id: ActionCard["id"]) => void;
}) {
  return (
    <button className={active ? "choice-card is-active" : "choice-card"} onClick={() => onClick(card.id)} type="button">
      <div className="choice-card__copy">
        <div className="choice-card__icon">
          <ActionIcon icon={card.icon} />
        </div>
        <div>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
      </div>

      <div className="choice-card__visual">
        <SceneArtwork scene={card.scene} />
        <span className="choice-card__orbit">
          <ArrowIcon />
        </span>
      </div>
    </button>
  );
}

function ListingCard({
  item,
  compact = false,
}: {
  item: (typeof listingFeeds)[ProjectMode][number];
  compact?: boolean;
}) {
  return (
    <article className={compact ? "listing-card is-compact" : "listing-card"}>
      <SceneArtwork scene={item.scene} />

      <div className="listing-card__content">
        <div className="listing-card__meta">
          <span className="pill-badge">{item.badge}</span>
          <button className="round-button round-button--small" type="button" aria-label={`Voir ${item.title}`}>
            <ArrowIcon />
          </button>
        </div>

        <h2>{item.title}</h2>
        <p className="listing-card__location">{item.location}</p>
        <strong>{item.price}</strong>
        <p className="listing-card__detail">{item.detail}</p>
      </div>
    </article>
  );
}

function AssistantThreadBubble({ message }: { message: AssistantMessage }) {
  return (
    <div className={message.role === "assistant" ? "message-bubble is-assistant" : "message-bubble is-user"}>
      {message.content}
    </div>
  );
}

function VariantSwitcher({
  active,
  options,
  onChange,
}: {
  active: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  if (options.length <= 1) {
    return null;
  }

  return (
    <div className="variant-switcher" role="toolbar" aria-label="Variantes de prototype">
      {options.map((option) => (
        <button
          className={active === option.value ? "variant-switcher__item is-active" : "variant-switcher__item"}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function HomeScreen({
  mode,
  activeAction,
  variant,
  scenario,
  onModeChange,
  onActionChange,
  onPrimaryAction,
}: {
  mode: ProjectMode;
  activeAction: ActionCard["id"];
  variant: HomeVariant;
  scenario: ScenarioData;
  onModeChange: (mode: ProjectMode) => void;
  onActionChange: (id: ActionCard["id"]) => void;
  onPrimaryAction: () => void;
}) {
  if (variant === "empty") {
    return (
      <section className="screen-flow">
        <div className="hero-shell">
          <div className="hero-shell__copy">
            <p className="eyebrow">{scenario.greeting}</p>
            <h1>demarrons votre projet</h1>
            <p className="body-copy">
              Vous n&apos;avez pas encore initialise de parcours. En trois minutes, on vous pose une base
              claire.
            </p>
          </div>

          <EmptyStateVisual tone="mint" />
        </div>

        <ModeTabs activeAction={activeAction} mode={mode} onActionChange={onActionChange} onChange={onModeChange} />

        <article className="dark-card">
          <h2>Commencer mon projet</h2>
          <p>
            Renseignez votre budget, votre zone et votre horizon pour generer une premiere feuille de
            route.
          </p>
        </article>

        <article className="sheet-card">
          <h2>Explorer sans engagement</h2>
          <p>
            Parcourez des exemples de biens, de questions et de comparables avant de creer votre projet.
          </p>
        </article>
      </section>
    );
  }

  return (
    <section className="screen-flow">
      <div className="hero-shell">
        <div className="hero-shell__copy">
          <p className="eyebrow">{scenario.greeting}</p>
          <h1>
            {scenario.title} <span>{scenario.accent}</span>
          </h1>
          <p className="body-copy">{highlightText(scenario.intro, scenario.introHighlight)}</p>
        </div>

        <AssistantVisual />
      </div>

      <ModeTabs
        activeAction={activeAction}
        includeEstimate
        mode={mode}
        onActionChange={onActionChange}
        onChange={onModeChange}
      />

      <div className="card-stack">
        {actionCards.map((card) => (
          <HomeActionCard
            active={card.id === activeAction}
            card={card}
            key={card.id}
            onClick={onActionChange}
          />
        ))}
      </div>

      <button className="hero-cta" onClick={onPrimaryAction} type="button">
        <span>{scenario.cta}</span>
        <SparkleIcon />
      </button>
    </section>
  );
}

function ListingsScreen({
  mode,
  scenario,
  variant,
  onModeChange,
}: {
  mode: ProjectMode;
  scenario: ScenarioData;
  variant: ListingsVariant;
  onModeChange: (mode: ProjectMode) => void;
}) {
  if (variant === "empty") {
    return (
      <section className="screen-flow">
        <header className="screen-intro">
          <p className="eyebrow">Biens</p>
          <h1>Aucun bien prioritaire pour le moment</h1>
          <p className="body-copy">
            Ajoutez un secteur ou affinez votre budget pour faire remonter une premiere selection utile.
          </p>
        </header>

        <EmptyStateVisual tone="sand" />

        <div className="chip-row">
          <span className="filter-chip">Ajouter un secteur</span>
          <span className="filter-chip">Ajuster budget</span>
        </div>

        <article className="sheet-card">
          <h2>Creer ma premiere selection</h2>
          <p>
            Le produit peut faire remonter des biens a visiter ou a challenger selon vos criteres.
          </p>
        </article>
      </section>
    );
  }

  return (
    <section className="screen-flow">
      <header className="screen-intro">
        <p className="eyebrow">Biens</p>
        <h1>{scenario.listingsTitle}</h1>
        <p className="body-copy">{scenario.listingsSubtitle}</p>
      </header>

      <ModeTabs mode={mode} onChange={onModeChange} />

      <div className="chip-row">
        {scenario.listingFilters.map((filter) => (
          <span className="filter-chip" key={filter}>
            {filter}
          </span>
        ))}
      </div>

      <div className="card-stack">
        {listingFeeds[mode].map((item) => (
          <ListingCard item={item} key={`${item.title}-${item.location}`} />
        ))}
      </div>
    </section>
  );
}

function AssistantScreen({
  mode,
  scenario,
  variant,
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
  variant: AssistantVariant;
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
  const showLoadingPreview = variant === "loading";

  if (variant === "empty") {
    return (
      <section className="screen-flow">
        <header className="screen-intro">
          <p className="eyebrow">Assistant IA</p>
          <h1>Posez votre premiere question</h1>
          <p className="body-copy">
            L&apos;assistant peut vous aider sur une visite, une offre, un document ou une strategie de prix.
          </p>
        </header>

        <EmptyStateVisual tone="sage" />

        <div className="chip-row">
          {scenario.assistantPrompts.map((prompt) => (
            <button className="filter-chip filter-chip--button" key={prompt} onClick={() => onPromptClick(prompt)} type="button">
              {prompt}
            </button>
          ))}
        </div>

        <article className="dark-card">
          <h2>Exemple de demande</h2>
          <p>Quelle liste envoyer au syndic pour recuperer rapidement mes pieces copropriete ?</p>
        </article>
      </section>
    );
  }

  return (
    <section className="screen-flow">
      <header className="screen-intro">
        <p className="eyebrow">Assistant IA</p>
        <h1>Une conversation qui fait avancer le projet</h1>
        <p className="body-copy">{scenario.assistantIntro}</p>
      </header>

      <ModeTabs mode={mode} onChange={onModeChange} />

      <article className="assistant-hero-card">
        <div>
          <p className="assistant-hero-card__label">Modele actif</p>
          <strong>{runtime.label}</strong>
          <span>Reponses courtes, structurees et actionnables</span>
        </div>
        <div className="assistant-hero-card__tag">Reponse claire</div>
      </article>

      <div className="chat-thread">
        {messages.map((message, index) => (
          <AssistantThreadBubble key={`${message.content}-${index}`} message={message} />
        ))}

        {isLoading || showLoadingPreview ? (
          <div className="message-bubble is-assistant">CoachImmoIA reflechit...</div>
        ) : null}
      </div>

      <div className="chip-row">
        {scenario.assistantPrompts.map((prompt) => (
          <button className="filter-chip filter-chip--button" key={prompt} onClick={() => onPromptClick(prompt)} type="button">
            {prompt}
          </button>
        ))}
      </div>

      {error ? <div className="feedback-banner is-error">{error}</div> : null}

      <article className="summary-card">
        <h2>Prochaines actions</h2>
        <p>
          1. Preparer vos questions de visite
          <br />
          2. Relever les points de risque
          <br />
          3. Securiser le timing du financement
        </p>
      </article>

      <div className="composer-card">
        <label className="composer-card__label" htmlFor="assistant-message">
          Message a envoyer
        </label>
        <textarea
          className="composer-input"
          id="assistant-message"
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Posez une question sur votre projet immobilier..."
          rows={4}
          value={draft}
        />

        <button className="primary-button" disabled={isLoading || !draft.trim()} onClick={onSubmit} type="button">
          {isLoading || showLoadingPreview ? "Envoi..." : "Envoyer"}
        </button>
      </div>
    </section>
  );
}

function BuyerProjectScreen({
  scenario,
  variant,
}: {
  scenario: ScenarioData;
  variant: ProjectsVariant;
}) {
  if (variant === "empty") {
    return (
      <>
        <header className="screen-intro">
          <p className="eyebrow">Projet</p>
          <h1>Votre feuille de route n&apos;existe pas encore</h1>
          <p className="body-copy">
            Sans projet initialise, vous pouvez explorer, mais vous ne profiterez pas des priorites et du
            contexte IA.
          </p>
        </header>

        <article className="dark-card">
          <h2>Construire ma feuille de route</h2>
          <p>On vous pose quelques questions puis on genere les prochaines etapes utiles.</p>
        </article>

        <article className="sheet-card">
          <h2>Ce que vous debloquez</h2>
          <p>
            • timeline projet
            <br />
            • checklist documents
            <br />
            • prompts IA contextuels
            <br />• relais coach au bon moment
          </p>
        </article>
      </>
    );
  }

  if (variant === "risk") {
    return (
      <>
        <header className="screen-intro">
          <p className="eyebrow">Preparation offre</p>
          <h1>Alerte avant offre</h1>
          <p className="body-copy">
            Le dossier est presque pret, mais deux inconnues peuvent fragiliser votre offre : travaux et
            timing banque.
          </p>
        </header>

        <article className="dark-card">
          <h2>Moment critique</h2>
          <p>
            Prix affiche 648 kEUR. Le bien reste interessant, mais la strategie d&apos;offre doit etre
            securisee.
          </p>
        </article>

        <article className="feedback-banner is-error">
          • travaux non chiffres
          <br />
          • copropriete encore floue
          <br />• calendrier de financement serre
        </article>

        <article className="sheet-card">
          <h2>Action recommandee</h2>
          <p>Faire relire la strategie par un coach humain avant envoi de l&apos;offre.</p>
        </article>
      </>
    );
  }

  if (variant === "sent") {
    return (
      <>
        <header className="screen-intro">
          <p className="eyebrow">Coach humain</p>
          <h1>Votre demande a bien ete transmise</h1>
          <p className="body-copy">
            Le coach recevra votre contexte, votre question et les points a arbitrer. Retour estime sous
            24h.
          </p>
        </header>

        <EmptyStateVisual tone="sage" />

        <article className="dark-card">
          <h2>En attendant</h2>
          <p>Vous pouvez continuer avec l&apos;IA, ajouter des precisions ou preparer vos documents.</p>
        </article>

        <article className="sheet-card">
          <h2>Statut</h2>
          <p>Demande recue · contexte transmis · priorite strategique</p>
        </article>
      </>
    );
  }

  return (
    <>
      <header className="screen-intro">
        <p className="eyebrow">Projet acheteur</p>
        <h1>{scenario.projectStatus}</h1>
        <p className="body-copy">{scenario.projectNote}</p>
      </header>

      <article className="sheet-card">
        <h2>Feuille de route</h2>
        <div className="timeline-list">
          {projectSteps.buyer.map((step) => (
            <div className={`timeline-row is-${step.status}`} key={step.title}>
              <span className="timeline-row__dot" />
              <div>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="dark-card">
        <h2>Documents a preparer</h2>
        <p className="dark-card__note">
          {scenario.projectDocuments.map((document) => `- ${document}`).join("\n")}
        </p>
        <div className="coach-tile">
          <span>Coach humain</span>
        </div>
      </article>
    </>
  );
}

function SellerProjectScreen({
  scenario,
  variant,
}: {
  scenario: ScenarioData;
  variant: ProjectsVariant;
}) {
  if (variant === "empty") {
    return (
      <>
        <header className="screen-intro">
          <p className="eyebrow">Projet vendeur</p>
          <h1>Votre vente n&apos;est pas encore structuree</h1>
          <p className="body-copy">
            Creez le projet pour suivre les documents, cadrer le prix et arbitrer la mise en vente.
          </p>
        </header>

        <article className="dark-card">
          <h2>Initialiser le projet vendeur</h2>
          <p>On vous aide a poser le cadre, les pieces manquantes et la premiere strategie.</p>
        </article>

        <article className="sheet-card">
          <h2>Vous debloquerez</h2>
          <p>
            • dossier vendeur lisible
            <br />
            • estimation mieux contextualisee
            <br />• relais coach sur le prix et les offres
          </p>
        </article>
      </>
    );
  }

  return (
    <>
      <header className="screen-intro">
        <p className="eyebrow">Projet vendeur</p>
        <h1>Votre vente se structure</h1>
        <p className="body-copy">{scenario.projectNote}</p>
      </header>

      <div className="stats-pair">
        {scenario.stats.map((stat, index) => (
          <article className={index === 0 ? "stat-card is-dark" : "stat-card"} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <article className="sheet-card">
        <h2>Documents prioritaires</h2>
        <div className="document-status-list">
          {sellerDocumentStatuses.map((document) => (
            <div className="document-status-row" key={document.label}>
              <div>
                <strong>{document.label}</strong>
              </div>
              <span className={document.tone === "mint" ? "status-badge is-mint" : "status-badge is-dark"}>
                {document.status}
              </span>
            </div>
          ))}
        </div>
      </article>

      <article className="mint-card">
        <h2>Prochaine action</h2>
        <p>Generer un message syndic clair pour recuperer rapidement les pieces copro manquantes.</p>
      </article>
    </>
  );
}

function ProjectsScreen({
  mode,
  scenario,
  variant,
  onModeChange,
}: {
  mode: ProjectMode;
  scenario: ScenarioData;
  variant: ProjectsVariant;
  onModeChange: (mode: ProjectMode) => void;
}) {
  return (
    <section className="screen-flow">
      <ModeTabs mode={mode} onChange={onModeChange} />
      {mode === "buyer" ? (
        <BuyerProjectScreen scenario={scenario} variant={variant} />
      ) : (
        <SellerProjectScreen scenario={scenario} variant={variant} />
      )}
    </section>
  );
}

function ProfileScreen() {
  return (
    <section className="screen-flow">
      <header className="screen-intro">
        <p className="eyebrow">Profil</p>
        <h1>Compte, confiance et preferences</h1>
        <p className="body-copy">Retrouvez vos reglages projet, vos habitudes de suivi et le cadre de partage.</p>
      </header>

      <article className="profile-hero">
        <div className="profile-hero__avatar">LM</div>
        <div>
          <h2>Loic Metivier</h2>
          <p>Projet acheteur · Coaching assiste par IA</p>
        </div>
      </article>

      {profileSections.map((section) => (
        <article className="sheet-card" key={section.title}>
          <h2>{section.title}</h2>
          <div className="profile-list">
            {section.items.map((item) => (
              <div className="profile-list__row" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>
      ))}

      <article className="mint-card">
        <h2>Cadrage securite</h2>
        <p>{securityMessage}</p>
      </article>
    </section>
  );
}

function BottomNav({
  activeScreen,
  onNavigate,
}: {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}) {
  const navItems: Array<{
    key: AppScreen;
    label: string;
    icon: ReactNode;
  }> = [
    { key: "home", label: "Accueil", icon: <HomeGlyph /> },
    { key: "listings", label: "Biens", icon: <GridIcon /> },
    { key: "assistant", label: "IA", icon: <ChatIcon /> },
    { key: "projects", label: "Projet", icon: <CheckIcon /> },
    { key: "profile", label: "Profil", icon: <UserIcon /> },
  ];

  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {navItems.map((item) => (
        <button
          className={activeScreen === item.key ? "bottom-nav__item is-active" : "bottom-nav__item"}
          key={item.key}
          onClick={() => onNavigate(item.key)}
          type="button"
        >
          <span className="bottom-nav__icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function PrototypeToolbar({
  activeScreen,
  variants,
  onChange,
}: {
  activeScreen: AppScreen;
  variants: ScreenVariantState;
  onChange: <T extends keyof ScreenVariantState>(screen: T, variant: ScreenVariantState[T]) => void;
}) {
  if (activeScreen === "profile") {
    return null;
  }

  if (activeScreen === "home") {
    return (
      <VariantSwitcher
        active={variants.home}
        onChange={(value) => onChange("home", value as HomeVariant)}
        options={[
          { label: "Default", value: "default" },
          { label: "Empty", value: "empty" },
        ]}
      />
    );
  }

  if (activeScreen === "listings") {
    return (
      <VariantSwitcher
        active={variants.listings}
        onChange={(value) => onChange("listings", value as ListingsVariant)}
        options={[
          { label: "Default", value: "default" },
          { label: "Empty", value: "empty" },
        ]}
      />
    );
  }

  if (activeScreen === "assistant") {
    return (
      <VariantSwitcher
        active={variants.assistant}
        onChange={(value) => onChange("assistant", value as AssistantVariant)}
        options={[
          { label: "Default", value: "default" },
          { label: "Empty", value: "empty" },
          { label: "Loading", value: "loading" },
        ]}
      />
    );
  }

  return (
    <VariantSwitcher
      active={variants.projects}
      onChange={(value) => onChange("projects", value as ProjectsVariant)}
      options={[
        { label: "Default", value: "default" },
        { label: "Empty", value: "empty" },
        { label: "Risk", value: "risk" },
        { label: "Sent", value: "sent" },
      ]}
    />
  );
}

function DesktopShowcase({
  activeScreen,
  mode,
  scenario,
}: {
  activeScreen: AppScreen;
  mode: ProjectMode;
  scenario: ScenarioData;
}) {
  const isBuyer = mode === "buyer";
  const activeLabel =
    activeScreen === "home"
      ? "Vue d'ensemble"
      : activeScreen === "listings"
        ? "Selection de biens"
        : activeScreen === "assistant"
          ? "Assistant IA"
          : activeScreen === "projects"
            ? "Suivi projet"
            : "Profil et securite";

  const screenCopy: Record<AppScreen, { title: string; body: string; items: string[] }> = {
    home: {
      title: isBuyer ? "Un cockpit clair pour lancer le projet acheteur." : "Une base rassurante pour cadrer la vente.",
      body: scenario.projectNote,
      items: scenario.checklist,
    },
    listings: {
      title: isBuyer ? "Prioriser les biens sans se disperser." : "Comparer le marche avec les bons reperes.",
      body: scenario.listingsSubtitle,
      items: scenario.listingFilters,
    },
    assistant: {
      title: "Une conversation guidee par le contexte du projet.",
      body: scenario.assistantIntro,
      items: scenario.assistantPrompts,
    },
    projects: {
      title: isBuyer ? "Transformer l'intention en plan d'action." : "Structurer le dossier avant la mise en vente.",
      body: scenario.projectStatus,
      items: projectSteps[mode].map((step) => step.title),
    },
    profile: {
      title: "Donner de la confiance et de la clarte au produit.",
      body: securityMessage,
      items: profileSections[0]?.items.map((item) => `${item.label} : ${item.value}`) ?? [],
    },
  };

  const current = screenCopy[activeScreen];

  return (
    <aside className="desktop-panel" aria-label="Presentation contextuelle">
      <div className="desktop-panel__hero">
        <p className="desktop-panel__eyebrow">Experience produit responsive</p>
        <h2>{scenario.greeting} un parcours immobilier qui s'adapte au desktop.</h2>
        <p>{current.body}</p>
      </div>

      <div className="desktop-panel__status">
        <span className="desktop-panel__badge">{isBuyer ? "Parcours acheteur" : "Parcours vendeur"}</span>
        <strong>{activeLabel}</strong>
      </div>

      <div className="desktop-panel__grid">
        <article className="desktop-card desktop-card--feature">
          <div className="desktop-card__icon">
            <SparkleIcon />
          </div>
          <div className="desktop-card__copy">
            <span>Focus ecran</span>
            <h3>{current.title}</h3>
          </div>
        </article>

        <article className="desktop-card">
          <span className="desktop-card__label">Statistiques clefs</span>
          <div className="desktop-metrics">
            {scenario.stats.map((metric) => (
              <div key={metric.label} className="desktop-metric">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="desktop-card">
          <span className="desktop-card__label">Elements a mettre en avant</span>
          <ul className="desktop-list">
            {current.items.slice(0, 3).map((item) => (
              <li key={item}>
                <span className="desktop-list__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </aside>
  );
}

function App() {
  const [mode, setMode] = useState<ProjectMode>("buyer");
  const [activeAction, setActiveAction] = useState<ActionCard["id"]>("buyer");
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
  const [screenVariants, setScreenVariants] = useState<ScreenVariantState>(defaultVariants);

  const scenario = scenarios[mode];

  const handleModeChange = (nextMode: ProjectMode) => {
    setMode(nextMode);
    setAssistantDraft(scenarios[nextMode].assistantPrompts[0]);
    setAssistantError(null);

    if (activeAction !== "estimate") {
      setActiveAction(nextMode);
    }
  };

  const handleActionChange = (id: ActionCard["id"]) => {
    setAssistantError(null);
    setActiveAction(id);

    if (id === "buyer") {
      setMode("buyer");
      setAssistantDraft(scenarios.buyer.assistantPrompts[0]);
      return;
    }

    if (id === "seller") {
      setMode("seller");
      setAssistantDraft(scenarios.seller.assistantPrompts[0]);
      return;
    }

    setMode("seller");
    setAssistantDraft("J'aimerais estimer mon bien avant de choisir une strategie de vente.");
  };

  const handlePrimaryAction = () => {
    if (activeAction === "buyer") {
      setActiveScreen("projects");
      return;
    }

    if (activeAction === "seller") {
      setActiveScreen("projects");
      return;
    }

    setActiveScreen("assistant");
  };

  const handleVariantChange = <T extends keyof ScreenVariantState>(
    screen: T,
    variant: ScreenVariantState[T],
  ) => {
    setScreenVariants((current) => ({
      ...current,
      [screen]: variant,
    }));
  };

  const handleAssistantSubmit = async () => {
    const content = assistantDraft.trim();

    if (!content || assistantLoading) {
      return;
    }

    const previousThread = assistantThreads[mode];
    const userMessage: AssistantMessage = {
      role: "user",
      content,
    };
    const nextThread = [...previousThread, userMessage];

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
        error instanceof Error ? error.message : "Connexion au modele impossible pour le moment.";

      setAssistantError(
        `${fallbackMessage} Verifiez la cle API Mistral et le modele configure, puis reessayez.`,
      );
      setAssistantDraft(content);
      setAssistantThreads((current) => ({
        ...current,
        [mode]: previousThread,
      }));
    } finally {
      setAssistantLoading(false);
    }
  };

  const renderScreen = () => {
    if (activeScreen === "home") {
      return (
        <HomeScreen
          activeAction={activeAction}
          mode={mode}
          onActionChange={handleActionChange}
          onModeChange={handleModeChange}
          onPrimaryAction={handlePrimaryAction}
          scenario={scenario}
          variant={screenVariants.home}
        />
      );
    }

    if (activeScreen === "listings") {
      return (
        <ListingsScreen
          mode={mode}
          onModeChange={handleModeChange}
          scenario={scenario}
          variant={screenVariants.listings}
        />
      );
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
          variant={screenVariants.assistant}
        />
      );
    }

    if (activeScreen === "projects") {
      return (
        <ProjectsScreen
          mode={mode}
          onModeChange={handleModeChange}
          scenario={scenario}
          variant={screenVariants.projects}
        />
      );
    }

    return <ProfileScreen />;
  };

  return (
    <main className="app-stage">
      <div className="app-glow app-glow--left" />
      <div className="app-glow app-glow--right" />

      <div className="app-stage__layout">
        <section className="device-shell" aria-label="Application CoachImmoIA">
          <div className="device-shell__chrome" />
          <div className="device-shell__speaker" />

          <div className="device-screen">
            <header className="status-bar" aria-hidden="true">
              <span>9:41</span>
              <div className="status-bar__icons">
                <span className="status-bar__signal">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className="status-bar__wifi" />
                <span className="status-bar__battery" />
              </div>
            </header>

            <AppTopBar subtitle={mode === "buyer" ? "Parcours acheteur" : "Parcours vendeur"} />

            <div className="screen-scroll">
              <PrototypeToolbar activeScreen={activeScreen} onChange={handleVariantChange} variants={screenVariants} />
              {renderScreen()}
            </div>

            <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
          </div>
        </section>

        <DesktopShowcase activeScreen={activeScreen} mode={mode} scenario={scenario} />
      </div>
    </main>
  );
}

export default App;
