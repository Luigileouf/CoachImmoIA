import type { ReactNode } from "react";
import {
  actionCards,
  listingFeeds,
  profileSections,
  projectSteps,
  securityMessage,
  socialCircles,
  socialHighlights,
  socialThreads,
  type ActionCard,
  type AppScreen,
  type ProjectMode,
} from "../../../data/content";
import { getAssistantRuntime, type AssistantMessage, type AssistantProvider } from "../../../lib/assistant";
import { ProviderSelector } from "../../shared/components/provider-selector";
import type {
  AssistantVariant,
  HomeVariant,
  ListingsVariant,
  ProjectsVariant,
  ScenarioData,
  ScreenVariantState,
} from "../../app/types";
import { sellerDocumentStatuses } from "../../platform/data/workspace";
import {
  AppTopBar,
  AssistantThreadBubble,
  AssistantVisual,
  ChatIcon,
  CheckIcon,
  EmptyStateVisual,
  GridIcon,
  HomeActionCard,
  HomeGlyph,
  ListingCard,
  ModeTabs,
  SocialIcon,
  SparkleIcon,
  UserIcon,
  VariantSwitcher,
} from "../../shared/components/primitives";

export function HomeScreen({
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
              Vous n&apos;avez pas encore initialisé de parcours. En trois minutes, on vous pose une base
              claire.
            </p>
          </div>

          <EmptyStateVisual tone="mint" />
        </div>

        <ModeTabs activeAction={activeAction} mode={mode} onActionChange={onActionChange} onChange={onModeChange} />

        <article className="dark-card">
          <h2>Commencer mon projet</h2>
          <p>
            Renseignez votre budget, votre zone et votre horizon pour générer une première feuille de
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
          <p className="body-copy">{scenario.intro}</p>
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

export function ListingsScreen({
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
            Ajoutez un secteur ou affinez votre budget pour faire remonter une première sélection utile.
          </p>
        </header>

        <EmptyStateVisual tone="sand" />

        <div className="chip-row">
          <span className="filter-chip">Ajouter un secteur</span>
          <span className="filter-chip">Ajuster budget</span>
        </div>

        <article className="sheet-card">
          <h2>Créer ma première sélection</h2>
          <p>
            Le produit peut faire remonter des biens à visiter ou à challenger selon vos critères.
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

export function AssistantScreen({
  assistantProvider,
  mode,
  scenario,
  variant,
  draft,
  error,
  isLoading,
  messages,
  onDraftChange,
  onAssistantProviderChange,
  onModeChange,
  onPromptClick,
  onSubmit,
}: {
  assistantProvider: AssistantProvider;
  mode: ProjectMode;
  scenario: ScenarioData;
  variant: AssistantVariant;
  draft: string;
  error: string | null;
  isLoading: boolean;
  messages: AssistantMessage[];
  onDraftChange: (value: string) => void;
  onAssistantProviderChange: (provider: AssistantProvider) => void;
  onModeChange: (mode: ProjectMode) => void;
  onPromptClick: (prompt: string) => void;
  onSubmit: () => void;
}) {
  const runtime = getAssistantRuntime(assistantProvider);
  const showLoadingPreview = variant === "loading";

  if (variant === "empty") {
    return (
      <section className="screen-flow">
        <header className="screen-intro">
          <p className="eyebrow">Assistant IA</p>
          <h1>Posez votre première question</h1>
          <p className="body-copy">
            L&apos;assistant peut vous aider sur une visite, une offre, un document ou une stratégie de prix.
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
          <p>Quelle liste envoyer au syndic pour récupérer rapidement mes pièces de copropriété ?</p>
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

      <ProviderSelector
        disabled={isLoading || showLoadingPreview}
        onChange={onAssistantProviderChange}
        provider={assistantProvider}
      />

      <article className="assistant-hero-card">
        <div>
          <p className="assistant-hero-card__label">Modèle actif</p>
          <strong>{runtime.label}</strong>
          <span>Réponses courtes, structurées et actionnables</span>
        </div>
        <div className="assistant-hero-card__tag">Réponse claire</div>
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
          1. Préparer vos questions de visite
          <br />
          2. Relever les points de risque
          <br />
          3. Sécuriser le calendrier du financement
        </p>
      </article>

      <div className="composer-card">
        <label className="composer-card__label" htmlFor="assistant-message">
          Message à envoyer
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
            Sans projet initialisé, vous pouvez explorer, mais vous ne profiterez pas des priorités et du
            contexte IA.
          </p>
        </header>

        <article className="dark-card">
          <h2>Construire ma feuille de route</h2>
          <p>On vous pose quelques questions puis on génère les prochaines étapes utiles.</p>
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
          <p className="eyebrow">Préparation de l'offre</p>
          <h1>Alerte avant offre</h1>
          <p className="body-copy">
            Le dossier est presque prêt, mais deux inconnues peuvent fragiliser votre offre : travaux et
            timing banque.
          </p>
        </header>

        <article className="dark-card">
          <h2>Moment critique</h2>
          <p>
            Prix affiché : 648 kEUR. Le bien reste intéressant, mais la stratégie d&apos;offre doit être
            securisee.
          </p>
        </article>

        <article className="feedback-banner is-error">
          • travaux non chiffres
          <br />
          • copropriété encore floue
          <br />• calendrier de financement serre
        </article>

        <article className="sheet-card">
          <h2>Action recommandée</h2>
          <p>Faire relire la stratégie par un coach humain avant l&apos;envoi de l&apos;offre.</p>
        </article>
      </>
    );
  }

  if (variant === "sent") {
    return (
      <>
        <header className="screen-intro">
          <p className="eyebrow">Coach humain</p>
          <h1>Votre demande a bien été transmise</h1>
          <p className="body-copy">
            Le coach recevra votre contexte, votre question et les points à arbitrer. Retour estimé sous
            24h.
          </p>
        </header>

        <EmptyStateVisual tone="sage" />

        <article className="dark-card">
          <h2>En attendant</h2>
          <p>Vous pouvez continuer avec l&apos;IA, ajouter des précisions ou préparer vos documents.</p>
        </article>

        <article className="sheet-card">
          <h2>Statut</h2>
          <p>Demande reçue · contexte transmis · priorité stratégique</p>
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
        <h2>Documents à préparer</h2>
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
          <p>On vous aide à poser le cadre, les pièces manquantes et la première stratégie.</p>
        </article>

        <article className="sheet-card">
          <h2>Vous debloquerez</h2>
          <p>
            • dossier vendeur lisible
            <br />
            • estimation mieux contextualisée
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
        <p>Générer un message clair au syndic pour récupérer rapidement les pièces de copropriété manquantes.</p>
      </article>
    </>
  );
}

export function ProjectsScreen({
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

export function ProfileScreen() {
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
          <h2>Loïc Métivier</h2>
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
        <h2>Cadrage sécurité</h2>
        <p>{securityMessage}</p>
      </article>
    </section>
  );
}

export function SocialScreen({
  mode,
  selectedCircleIndex,
  selectedThreadIndex,
  onModeChange,
  onSelectCircle,
  onSelectThread,
}: {
  mode: ProjectMode;
  selectedCircleIndex: number;
  selectedThreadIndex: number;
  onModeChange: (mode: ProjectMode) => void;
  onSelectCircle: (index: number) => void;
  onSelectThread: (index: number) => void;
}) {
  const circles = socialCircles[mode];
  const activeCircle = circles[selectedCircleIndex] ?? circles[0];
  const threads = socialThreads[mode].filter((thread) => thread.circleId === activeCircle.id);
  const activeThread = threads[selectedThreadIndex] ?? threads[0] ?? socialThreads[mode][0];

  return (
    <section className="screen-flow">
      <header className="screen-intro">
        <p className="eyebrow">Communauté</p>
        <h1>Echanger sans bruit inutile</h1>
        <p className="body-copy">{socialHighlights[mode].summary}</p>
      </header>

      <ModeTabs mode={mode} onChange={onModeChange} />

      <article className="dark-card">
        <h2>{socialHighlights[mode].title}</h2>
        <p>{socialHighlights[mode].trustSignals.join(" · ")}</p>
      </article>

      <article className="sheet-card">
        <h2>Cercles actifs</h2>
        <div className="social-pill-list">
          {circles.map((circle, index) => (
            <button
              className={selectedCircleIndex === index ? "social-pill is-active" : "social-pill"}
              key={circle.id}
              onClick={() => onSelectCircle(index)}
              type="button"
            >
              {circle.title}
            </button>
          ))}
        </div>
        <p className="social-support-copy">{activeCircle.prompt}</p>
      </article>

      <article className="summary-card social-thread-card">
        <div className="chip-row">
          <span className="pill-badge">{activeThread.trust}</span>
          <span className="pill-badge">{activeThread.replies}</span>
        </div>
        <h2>{activeThread.title}</h2>
        <p>{activeThread.excerpt}</p>
        <div className="social-pill-list">
          {threads.map((thread, index) => (
            <button
              className={selectedThreadIndex === index ? "social-pill is-active" : "social-pill"}
              key={thread.id}
              onClick={() => onSelectThread(index)}
              type="button"
            >
              {thread.author}
            </button>
          ))}
        </div>
      </article>

      <article className="mint-card">
        <h2>Synthèse IA</h2>
        <p>{activeThread.aiSummary}</p>
      </article>
    </section>
  );
}

export function BottomNav({
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
    { key: "social", label: "Social", icon: <SocialIcon /> },
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

export function PrototypeToolbar({
  activeScreen,
  variants,
  onChange,
}: {
  activeScreen: AppScreen;
  variants: ScreenVariantState;
  onChange: <T extends keyof ScreenVariantState>(screen: T, variant: ScreenVariantState[T]) => void;
}) {
  if (activeScreen === "profile" || activeScreen === "documents" || activeScreen === "social") {
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

type MobilePreviewShellProps = {
  activeScreen: AppScreen;
  activeAction: ActionCard["id"];
  assistantProvider: AssistantProvider;
  mode: ProjectMode;
  scenario: ScenarioData;
  screenVariants: ScreenVariantState;
  draft: string;
  error: string | null;
  isLoading: boolean;
  messages: AssistantMessage[];
  selectedSocialCircleIndex: number;
  selectedSocialThreadIndex: number;
  onActionChange: (id: ActionCard["id"]) => void;
  onAssistantProviderChange: (provider: AssistantProvider) => void;
  onDraftChange: (value: string) => void;
  onModeChange: (mode: ProjectMode) => void;
  onNavigate: (screen: AppScreen) => void;
  onPrimaryAction: () => void;
  onPromptClick: (prompt: string) => void;
  onSelectSocialCircle: (index: number) => void;
  onSelectSocialThread: (index: number) => void;
  onSubmit: () => void;
  onVariantChange: <T extends keyof ScreenVariantState>(screen: T, variant: ScreenVariantState[T]) => void;
};

export function MobilePreviewShell({
  activeScreen,
  activeAction,
  assistantProvider,
  mode,
  scenario,
  screenVariants,
  draft,
  error,
  isLoading,
  messages,
  selectedSocialCircleIndex,
  selectedSocialThreadIndex,
  onActionChange,
  onAssistantProviderChange,
  onDraftChange,
  onModeChange,
  onNavigate,
  onPrimaryAction,
  onPromptClick,
  onSelectSocialCircle,
  onSelectSocialThread,
  onSubmit,
  onVariantChange,
}: MobilePreviewShellProps) {
  const renderScreen = () => {
    if (activeScreen === "home") {
      return (
        <HomeScreen
          activeAction={activeAction}
          mode={mode}
          onActionChange={onActionChange}
          onModeChange={onModeChange}
          onPrimaryAction={onPrimaryAction}
          scenario={scenario}
          variant={screenVariants.home}
        />
      );
    }

    if (activeScreen === "listings") {
      return (
        <ListingsScreen
          mode={mode}
          onModeChange={onModeChange}
          scenario={scenario}
          variant={screenVariants.listings}
        />
      );
    }

    if (activeScreen === "assistant") {
      return (
        <AssistantScreen
          assistantProvider={assistantProvider}
          draft={draft}
          error={error}
          isLoading={isLoading}
          messages={messages}
          mode={mode}
          onDraftChange={onDraftChange}
          onAssistantProviderChange={onAssistantProviderChange}
          onModeChange={onModeChange}
          onPromptClick={onPromptClick}
          onSubmit={onSubmit}
          scenario={scenario}
          variant={screenVariants.assistant}
        />
      );
    }

    if (activeScreen === "projects") {
      return (
        <ProjectsScreen
          mode={mode}
          onModeChange={onModeChange}
          scenario={scenario}
          variant={screenVariants.projects}
        />
      );
    }

    if (activeScreen === "social") {
      return (
        <SocialScreen
          mode={mode}
          onModeChange={onModeChange}
          onSelectCircle={onSelectSocialCircle}
          onSelectThread={onSelectSocialThread}
          selectedCircleIndex={selectedSocialCircleIndex}
          selectedThreadIndex={selectedSocialThreadIndex}
        />
      );
    }

    return <ProfileScreen />;
  };

  return (
    <aside className="mobile-preview" aria-label="Aperçu mobile">
      <section className="device-shell" aria-label="Application mobile CoachImmoIA">
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
            <PrototypeToolbar activeScreen={activeScreen} onChange={onVariantChange} variants={screenVariants} />
            {renderScreen()}
          </div>

          <BottomNav activeScreen={activeScreen} onNavigate={onNavigate} />
        </div>
      </section>
    </aside>
  );
}
