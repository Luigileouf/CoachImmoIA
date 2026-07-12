import { useState, type ReactNode } from "react";
import {
  listingFeeds,
  profileSections,
  projectSteps,
  securityMessage,
  socialHighlights,
  socialStats,
  type AppScreen,
  type ProjectMode,
} from "../../../data/content";
import { getAssistantRuntime, type AssistantMessage, type AssistantProvider } from "../../../lib/assistant";
import { ProviderSelector } from "../../shared/components/provider-selector";
import type { DocumentFilter, ScenarioData } from "../../app/types";
import {
  listingWorkspaceMeta,
  projectStepMeta,
} from "../data/workspace";
import {
  AppTopBar,
  AssistantThreadBubble,
  AssistantVisual,
  ChatIcon,
  CheckIcon,
  DocumentIcon,
  GridIcon,
  HomeGlyph,
  ListingCard,
  LogoMark,
  ModeTabs,
  SceneArtwork,
  SocialIcon,
  UserIcon,
} from "../../shared/components/primitives";
import type {
  DocumentsResponse,
  ProjectsResponse,
  RagContextResponse,
  SocialResponse,
} from "../../../services/api";

function PlatformSidebar({
  activeScreen,
  mode,
  onModeChange,
  onNavigate,
}: {
  activeScreen: AppScreen;
  mode: ProjectMode;
  onModeChange: (mode: ProjectMode) => void;
  onNavigate: (screen: AppScreen) => void;
}) {
  const navItems: Array<{ key: AppScreen; label: string; icon: ReactNode }> = [
    { key: "home", label: "Dashboard", icon: <HomeGlyph /> },
    { key: "listings", label: "Biens", icon: <GridIcon /> },
    { key: "assistant", label: "Assistant IA", icon: <ChatIcon /> },
    { key: "projects", label: "Projet", icon: <CheckIcon /> },
    { key: "documents", label: "Documents", icon: <DocumentIcon /> },
    { key: "social", label: "Communauté", icon: <SocialIcon /> },
    { key: "profile", label: "Profil", icon: <UserIcon /> },
  ];

  return (
    <aside className="platform-sidebar">
      <div className="platform-sidebar__brand">
        <LogoMark />
        <div>
          <strong>CoachImmoIA</strong>
          <span>{mode === "buyer" ? "Plateforme acheteur" : "Plateforme vendeur"}</span>
        </div>
      </div>

      <div className="platform-sidebar__mode">
        <button
          className={mode === "buyer" ? "platform-mode-chip is-active" : "platform-mode-chip"}
          onClick={() => onModeChange("buyer")}
          type="button"
        >
          Acheteur
        </button>
        <button
          className={mode === "seller" ? "platform-mode-chip is-active" : "platform-mode-chip"}
          onClick={() => onModeChange("seller")}
          type="button"
        >
          Vendeur
        </button>
      </div>

      <nav className="platform-sidebar__nav" aria-label="Navigation plateforme">
        {navItems.map((item) => (
          <button
            className={activeScreen === item.key ? "platform-sidebar__item is-active" : "platform-sidebar__item"}
            key={item.key}
            onClick={() => onNavigate(item.key)}
            type="button"
          >
            <span className="platform-sidebar__icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <article className="platform-coach-card">
        <span className="platform-coach-card__eyebrow">Coach humain</span>
        <strong>Escalade rapide sur offre, prix ou document sensible.</strong>
        <p>Le contexte du dossier est transmis avec vos points d'arbitrage.</p>
      </article>
    </aside>
  );
}

function DashboardScreen({
  assistantProvider,
  activeAction,
  mode,
  scenario,
  projectsData,
  socialData,
  error,
  onActionChange,
  onNavigate,
  onPrimaryAction,
}: {
  assistantProvider: AssistantProvider;
  activeAction: "buyer" | "seller" | "estimate";
  mode: ProjectMode;
  scenario: ScenarioData;
  projectsData: ProjectsResponse | null;
  socialData: SocialResponse | null;
  error: string | null;
  onActionChange: (id: "buyer" | "seller" | "estimate") => void;
  onNavigate: (screen: AppScreen) => void;
  onPrimaryAction: () => void;
}) {
  const activeRuntime = getAssistantRuntime(assistantProvider);
  const roadmap = projectsData?.steps.length ? projectsData.steps : projectSteps[mode].map((step, index) => ({
    ...step,
    meta: projectStepMeta[mode][index],
  }));
  const trustSignals = socialData?.highlight.trustSignals || socialHighlights[mode].trustSignals;

  return (
    <section className="platform-screen platform-screen--dashboard">
      <AppTopBar subtitle={mode === "buyer" ? "Parcours acheteur" : "Parcours vendeur"} />

      <article className="platform-hero-card">
        <div className="hero-shell">
          <div className="hero-shell__copy">
            <p className="eyebrow">{scenario.greeting}</p>
            <h1>
              {scenario.title} <span>{scenario.accent}</span>
            </h1>
            <p className="body-copy">{projectsData?.scenario.projectNote || scenario.projectNote}</p>
          </div>

          <AssistantVisual />
        </div>

        <ModeTabs
          activeAction={activeAction}
          includeEstimate
          mode={mode}
          onActionChange={onActionChange}
          onChange={() => undefined}
        />

        <div className="platform-inline-actions">
          <button className="platform-primary-button" onClick={onPrimaryAction} type="button">
            {scenario.cta}
          </button>
          <button className="platform-ghost-button" onClick={() => onNavigate("assistant")} type="button">
            Poser une question
          </button>
        </div>

        {error ? <div className="feedback-banner is-error">{error}</div> : null}
      </article>

      <article className="platform-focus-strip">
        <div>
          <span className="platform-section-label">Focus du jour</span>
          <strong>
            {mode === "buyer"
              ? "Préparer la visite de demain et cadrer les questions de copropriété."
              : "Vérifier les pièces de copropriété avant de figer la stratégie de mise en vente."}
          </strong>
        </div>
        <div className="platform-inline-actions">
          <button className="platform-primary-button" onClick={() => onNavigate("assistant")} type="button">
            Générer la check-list IA
          </button>
          <button className="platform-ghost-button" onClick={() => onNavigate("documents")} type="button">
            Ouvrir documents
          </button>
        </div>
      </article>

      <div className="platform-kpi-grid">
        {scenario.stats.map((stat) => (
          <article className="platform-kpi-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="platform-grid platform-grid--dashboard">
        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Roadmap dossier</h3>
            <button className="platform-text-button" onClick={() => onNavigate("projects")} type="button">
              Ouvrir
            </button>
          </div>

          <div className="platform-timeline">
            {roadmap.map((step) => (
              <div className={`platform-timeline__row is-${step.status}`} key={step.title}>
                <span className="platform-timeline__dot" />
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Priorités du moment</h3>
            <button className="platform-text-button" onClick={() => onNavigate("documents")} type="button">
              Documents
            </button>
          </div>

          <div className="platform-priority-list">
            {(projectsData?.scenario.checklist || scenario.checklist).map((item) => (
              <div className="platform-priority-item" key={item}>
                <span className="platform-priority-item__dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Coach et IA</h3>
            <span className="platform-badge">
              {activeRuntime.provider === "google" ? "Gemma actif" : "Mistral actif"}
            </span>
          </div>
          <p className="platform-summary-copy">{scenario.coachHint}</p>
          <div className="platform-mini-metrics">
            <div className="platform-mini-metric">
              <span>Statut coach</span>
              <strong>Disponible</strong>
            </div>
            <div className="platform-mini-metric">
              <span>Projet</span>
              <strong>{projectsData?.projectTitle || "À initialiser"}</strong>
            </div>
          </div>
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Communauté utile</h3>
            <span className="platform-badge">Pairs vérifiés</span>
          </div>
          <p className="platform-summary-copy">
            {socialData?.highlight.summary ||
              (mode === "buyer"
                ? "Comparez vos questions de visite, d'offre ou de financement avec des retours vécus et modérés."
                : "Cadrez vos doutes sur le prix, le dossier vendeur et les offres avec des retours terrain plus structures.")}
          </p>
          <div className="platform-chip-row">
            {trustSignals.map((signal) => (
              <span className="platform-chip" key={signal}>
                {signal}
              </span>
            ))}
          </div>
          <div className="platform-inline-actions">
            <button className="platform-primary-button" onClick={() => onNavigate("social")} type="button">
              Ouvrir la communauté
            </button>
            <button className="platform-ghost-button" onClick={() => onNavigate("assistant")} type="button">
              Passer par l&apos;IA
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function ListingsWorkspaceScreen({
  mode,
  scenario,
  selectedIndex,
  onModeChange,
  onSelectListing,
}: {
  mode: ProjectMode;
  scenario: ScenarioData;
  selectedIndex: number;
  onModeChange: (mode: ProjectMode) => void;
  onSelectListing: (index: number) => void;
}) {
  const activeListing = listingFeeds[mode][selectedIndex] ?? listingFeeds[mode][0];
  const activeMeta = listingWorkspaceMeta[mode][selectedIndex] ?? listingWorkspaceMeta[mode][0];

  return (
    <section className="platform-screen platform-screen--listings">
      <AppTopBar subtitle={mode === "buyer" ? "Biens à prioriser" : "Comparables vendeur"} />

      <header className="screen-intro">
        <p className="eyebrow">Biens</p>
        <h1>{scenario.listingsTitle}</h1>
        <p className="body-copy">{scenario.listingsSubtitle}</p>
      </header>

      <div className="platform-toolbar-row">
        <ModeTabs mode={mode} onChange={onModeChange} />
        <div className="platform-chip-row">
          {scenario.listingFilters.map((filter) => (
            <span className="platform-chip" key={filter}>
              {filter}
            </span>
          ))}
        </div>
      </div>

      <div className="platform-grid platform-grid--listings">
        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>{scenario.listingsTitle}</h3>
            <span className="platform-badge">{listingFeeds[mode].length} options</span>
          </div>
          <div className="platform-listing-stack">
            {listingFeeds[mode].map((item, index) => (
              <button
                className={selectedIndex === index ? "platform-listing-picker is-active" : "platform-listing-picker"}
                key={`${item.title}-${item.location}`}
                onClick={() => onSelectListing(index)}
                type="button"
              >
                <ListingCard compact item={item} />
              </button>
            ))}
          </div>
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Détail du bien</h3>
            <span className="platform-badge">{activeListing.badge}</span>
          </div>

          <div className="platform-listing-detail">
            <SceneArtwork scene={activeListing.scene} />
            <div>
              <h4>{activeListing.title}</h4>
              <p>{activeListing.location}</p>
              <strong>{activeListing.price}</strong>
            </div>
          </div>

          <p className="platform-summary-copy">{activeListing.detail}</p>

          <div className="platform-mini-metrics">
            <div className="platform-mini-metric">
              <span>Décision</span>
              <strong>{activeMeta.tempo}</strong>
            </div>
            <div className="platform-mini-metric">
              <span>Signal coach</span>
              <strong>{activeMeta.coachSignal}</strong>
            </div>
            <div className="platform-mini-metric">
              <span>Score</span>
              <strong>{activeMeta.score}</strong>
            </div>
            <div className="platform-mini-metric">
              <span>Prochaine étape</span>
              <strong>{activeMeta.nextAction}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function AssistantWorkspaceScreen({
  assistantProvider,
  mode,
  scenario,
  draft,
  error,
  isLoading,
  messages,
  assistantSources,
  onDraftChange,
  onAssistantProviderChange,
  onCompareResponse,
  onPromptClick,
  onSubmit,
}: {
  assistantProvider: AssistantProvider;
  mode: ProjectMode;
  scenario: ScenarioData;
  draft: string;
  error: string | null;
  isLoading: boolean;
  messages: AssistantMessage[];
  assistantSources: RagContextResponse["sources"];
  onDraftChange: (value: string) => void;
  onAssistantProviderChange: (provider: AssistantProvider) => void;
  onCompareResponse: (message: AssistantMessage, provider: AssistantProvider) => void;
  onPromptClick: (prompt: string) => void;
  onSubmit: () => void;
}) {
  const hasMessages = messages.length > 0;

  return (
    <section className="platform-screen platform-screen--assistant">
      <AppTopBar subtitle={`Assistant · parcours ${mode === "buyer" ? "acheteur" : "vendeur"}`} />

      <header className="screen-intro platform-assistant-intro">
        <p className="eyebrow">Assistant immobilier</p>
        <h1>Que souhaitez-vous préparer&nbsp;?</h1>
      </header>

      <div className="platform-toolbar-row">
        <ProviderSelector
          disabled={isLoading}
          onChange={onAssistantProviderChange}
          provider={assistantProvider}
        />
      </div>

      <div className="platform-grid platform-grid--assistant">
        <article className="platform-surface platform-chat-surface">
          <div className="platform-surface__header">
            <h3>Conversation active</h3>
            <span className="platform-badge">{hasMessages ? `${messages.length} messages` : "Nouvelle conversation"}</span>
          </div>

          <div className={hasMessages ? "chat-thread" : "chat-thread is-empty"}>
            {!hasMessages ? (
              <div className="assistant-empty-state">
                <strong>Posez une question concrète pour commencer.</strong>
                <span>Vous pourrez ensuite tester exactement la même demande avec l’autre modèle.</span>
              </div>
            ) : null}
            {messages.map((message, index) => (
              <AssistantThreadBubble
                key={`${message.content}-${index}`}
                message={message}
                onCompare={onCompareResponse}
              />
            ))}

            {isLoading ? (
              <div className="message-bubble is-assistant">
                {assistantProvider === "google" ? "Gemma" : "Mistral"} prépare sa réponse…
              </div>
            ) : null}
          </div>

          <div className={hasMessages ? "platform-chip-row assistant-suggestions is-compact" : "platform-chip-row assistant-suggestions"}>
            {scenario.assistantPrompts.map((prompt) => (
              <button className="platform-chip platform-chip--button" key={prompt} onClick={() => onPromptClick(prompt)} type="button">
                {prompt}
              </button>
            ))}
          </div>

          {error ? <div className="feedback-banner is-error">{error}</div> : null}

          <div className="composer-card">
            <label className="composer-card__label" htmlFor="platform-assistant-message">
              Message à envoyer
            </label>
            <textarea
              className="platform-composer__input"
              id="platform-assistant-message"
              onChange={(event) => onDraftChange(event.target.value)}
              placeholder="Posez une question sur votre projet immobilier..."
              rows={3}
              value={draft}
            />
            <button className="platform-primary-button" disabled={isLoading || !draft.trim()} onClick={onSubmit} type="button">
              {isLoading ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Documents utilisés</h3>
            <span className="platform-badge">{assistantSources.length}</span>
          </div>
          <p className="platform-summary-copy">Les réponses peuvent s’appuyer sur les documents de votre projet.</p>

          <div className="platform-context-list">
            <div>
              <span className="platform-context-list__label">Projet</span>
              <p>{scenario.projectStatus}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Documents disponibles</span>
              <p>{scenario.projectDocuments.slice(0, 3).join(" · ")}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Besoin d’aide</span>
              <p>{scenario.coachHint}</p>
            </div>
          </div>

          <div className="platform-source-stack">
            {assistantSources.length > 0 ? (
              assistantSources.map((item) => (
                <article className="platform-source-card" key={`${item.label}-${item.excerpt}`}>
                  <span className="platform-context-list__label">{item.source}</span>
                  <strong>{item.label}</strong>
                  <p>{item.summary || item.excerpt}</p>
                </article>
              ))
            ) : (
              <article className="platform-source-card">
                <span className="platform-context-list__label">Aucun document utilisé</span>
                <strong>Réponse basée sur votre question</strong>
                <p>
                  Ajoutez ou sélectionnez un document si vous souhaitez une réponse liée à votre dossier.
                </p>
              </article>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function ProjectsWorkspaceScreen({
  mode,
  scenario,
  projectsData,
  selectedStepIndex,
  error,
  projectBusy,
  onCreateProject,
  onNavigate,
  onSelectStep,
}: {
  mode: ProjectMode;
  scenario: ScenarioData;
  projectsData: ProjectsResponse | null;
  selectedStepIndex: number;
  error: string | null;
  projectBusy: boolean;
  onCreateProject: () => void;
  onNavigate: (screen: AppScreen) => void;
  onSelectStep: (index: number) => void;
}) {
  const steps = projectsData?.steps.length
    ? projectsData.steps
    : projectSteps[mode].map((step, index) => ({
        ...step,
        meta: projectStepMeta[mode][index],
      }));
  const activeStep = steps[selectedStepIndex] ?? steps[0];
  const activeMeta = activeStep?.meta || projectStepMeta[mode][selectedStepIndex] || projectStepMeta[mode][0];

  return (
    <section className="platform-screen platform-screen--projects">
      <AppTopBar subtitle={mode === "buyer" ? "Projet acheteur" : "Projet vendeur"} />

      <header className="screen-intro">
        <p className="eyebrow">Projet</p>
        <h1>{mode === "buyer" ? "Mon projet acheteur" : "Ma feuille de route vendeur"}</h1>
        <p className="body-copy">{projectsData?.scenario.projectStatus || scenario.projectStatus}</p>
      </header>

      <div className="platform-grid platform-grid--projects">
        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Roadmap du dossier</h3>
            <span className="platform-badge">{projectsData?.scenario.projectStatus || scenario.projectStatus}</span>
          </div>

          <div className="platform-timeline">
            {steps.map((step, index) => (
              <button
                className={
                  selectedStepIndex === index
                    ? `platform-timeline__row is-${step.status} is-selected`
                    : `platform-timeline__row is-${step.status}`
                }
                key={step.title}
                onClick={() => onSelectStep(index)}
                type="button"
              >
                <span className="platform-timeline__dot" />
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.detail}</p>
                </div>
              </button>
            ))}
          </div>
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Focus d'étape</h3>
            <span className="platform-badge">Prioritaire</span>
          </div>
          <div className="platform-context-list">
            <div>
              <span className="platform-context-list__label">Étape active</span>
              <p>{activeStep?.title}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Owner</span>
              <p>{activeMeta?.owner}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Deadline</span>
              <p>{activeMeta?.deadline}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Checkpoint</span>
              <p>{activeMeta?.checkpoint}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Blocage</span>
              <p>{activeMeta?.blocker}</p>
            </div>
          </div>
        </article>

        <article className="platform-surface is-dark">
          <div className="platform-surface__header">
            <h3>Risque principal</h3>
            <span className="platform-badge is-contrast">Coach recommande</span>
          </div>
          {error ? <div className="feedback-banner is-error">{error}</div> : null}
          <p className="platform-summary-copy">
            {mode === "buyer"
              ? "Le bien cible reste prometteur, mais la copropriété et le calendrier bancaire doivent être vérifiés avant l'arbitrage de l'offre."
              : "Le prix et les documents de copropriété demandent encore un arbitrage avant une diffusion large."}
          </p>
          <div className="platform-priority-list platform-priority-list--contrast">
            {(projectsData?.scenario.checklist || scenario.checklist).map((item) => (
              <div className="platform-priority-item" key={item}>
                <span className="platform-priority-item__dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="platform-inline-actions">
            {!projectsData?.projectId ? (
              <button className="platform-primary-button platform-primary-button--light" disabled={projectBusy} onClick={onCreateProject} type="button">
                {projectBusy ? "Création..." : "Créer le projet"}
              </button>
            ) : null}
            <button className="platform-ghost-button platform-ghost-button--dark" onClick={() => onNavigate("social")} type="button">
              Ouvrir la communauté
            </button>
            <button className="platform-ghost-button platform-ghost-button--dark" type="button">
              Ajouter un contexte
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function DocumentsScreen({
  mode,
  documentsData,
  selectedDocumentIndex,
  documentFilter,
  documentContextSelection,
  error,
  documentBusy,
  onCreateDocument,
  onDocumentFilterChange,
  onIndexDocument,
  onNavigate,
  onSelectDocument,
  onToggleDocumentContext,
}: {
  mode: ProjectMode;
  documentsData: DocumentsResponse | null;
  selectedDocumentIndex: number;
  documentFilter: DocumentFilter;
  documentContextSelection: string[];
  error: string | null;
  documentBusy: boolean;
  onCreateDocument: (payload: { label: string; summary: string; source: string; file?: File | null }) => void;
  onDocumentFilterChange: (filter: DocumentFilter) => void;
  onIndexDocument: (label: string) => void;
  onNavigate: (screen: AppScreen) => void;
  onSelectDocument: (index: number) => void;
  onToggleDocumentContext: (label: string) => void;
}) {
  const [labelDraft, setLabelDraft] = useState("");
  const [summaryDraft, setSummaryDraft] = useState("");
  const [fileDraft, setFileDraft] = useState<File | null>(null);

  const rows = documentsData?.items || [];
  const filteredRows = rows.filter((row) => {
    if (documentFilter === "action") return row.status !== "Disponible";
    if (documentFilter === "rag") return row.ragStatus !== "missing";
    return true;
  });
  const activeDocument = filteredRows[selectedDocumentIndex] ?? filteredRows[0] ?? rows[0];

  return (
    <section className="platform-screen platform-screen--documents">
      <article className="platform-inline-panel">
        <span className="platform-section-label">Vision documentaire</span>
        <strong>
          {mode === "buyer"
            ? "Les pièces critiques du financement et de la visite sont centralisées pour accélérer le dossier."
            : "Les documents vendeur sont classés par statut pour préparer la diffusion et le futur RAG."}
        </strong>
      </article>

      {error ? <div className="feedback-banner is-error">{error}</div> : null}

      <div className="platform-toolbar-row">
        <div className="platform-chip-row">
          {[
            { label: "Tous", value: "all" },
            { label: "Action requise", value: "action" },
            { label: "RAG prêt", value: "rag" },
          ].map((filter) => (
            <button
              className={documentFilter === filter.value ? "platform-chip platform-chip--button is-active" : "platform-chip platform-chip--button"}
              key={filter.value}
              onClick={() => onDocumentFilterChange(filter.value as DocumentFilter)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
        <span className="platform-chip">Contexte IA : {documentContextSelection.length} pièces</span>
      </div>

      <div className="platform-kpi-grid platform-kpi-grid--documents">
        <article className="platform-kpi-card">
          <span>Disponibles</span>
          <strong>{documentsData?.summary.available || 0}</strong>
        </article>
        <article className="platform-kpi-card">
          <span>En attente</span>
          <strong>{documentsData?.summary.pending || 0}</strong>
        </article>
        <article className="platform-kpi-card">
          <span>Indexation future</span>
          <strong>{documentsData?.summary.ragReady || 0} pretes</strong>
        </article>
      </div>

      <div className="platform-grid platform-grid--documents-workspace">
        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Table documentaire</h3>
            <span className="platform-badge">Projet {mode === "buyer" ? "acheteur" : "vendeur"}</span>
          </div>

          <div className="platform-document-table">
            <div className="platform-document-table__head">
              <span>Document</span>
              <span>Statut</span>
              <span>Source</span>
              <span>Action</span>
            </div>

            {filteredRows.map((row, index) => (
              <button
                className={activeDocument?.label === row.label ? "platform-document-table__row is-active" : "platform-document-table__row"}
                key={row.label}
                onClick={() => onSelectDocument(index)}
                type="button"
              >
                <strong>{row.label}</strong>
                <span className={row.tone === "mint" ? "status-badge is-mint" : "status-badge is-dark"}>{row.status}</span>
                <span className="platform-document-table__source">{row.source}</span>
                <span className="platform-text-button">
                  {row.status === "Disponible" ? "Voir" : "Relancer"}
                </span>
              </button>
            ))}
          </div>

          <article className="platform-inline-panel">
            <span className="platform-section-label">Ajouter un document</span>
            <strong>Chargez un fichier ou référencez une nouvelle pièce pour la suite du RAG.</strong>
            <p className="platform-summary-copy">
              Les PDF textuels sont maintenant analysés automatiquement pour alimenter le contexte IA.
              Si un fichier ne contient pas de texte exploitable, un avertissement s'affichera ici.
            </p>
            <div className="platform-composer">
              <input
                className="platform-composer__input"
                onChange={(event) => setLabelDraft(event.target.value)}
                placeholder="Nom du document"
                value={labelDraft}
              />
              <textarea
                className="platform-composer__input"
                onChange={(event) => setSummaryDraft(event.target.value)}
                placeholder="Résumé ou objectif de ce document"
                rows={3}
                value={summaryDraft}
              />
              <input onChange={(event) => setFileDraft(event.target.files?.[0] || null)} type="file" />
              <button
                className="platform-primary-button"
                disabled={documentBusy || !labelDraft.trim()}
                onClick={() => {
                  onCreateDocument({
                    label: labelDraft,
                    summary: summaryDraft,
                    source: fileDraft ? "Upload utilisateur" : "Saisie manuelle",
                    file: fileDraft,
                  });
                  setLabelDraft("");
                  setSummaryDraft("");
                  setFileDraft(null);
                }}
                type="button"
              >
                {documentBusy ? "Ajout..." : "Ajouter le document"}
              </button>
            </div>
          </article>
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Détail du document</h3>
            <span className="platform-badge">RAG {activeDocument?.ragStatus || "missing"}</span>
          </div>

          {activeDocument ? (
            <>
              <div className="platform-context-list">
                <div>
                  <span className="platform-context-list__label">Document</span>
                  <p>{activeDocument.label}</p>
                </div>
                <div>
                  <span className="platform-context-list__label">Responsable</span>
                  <p>{activeDocument.owner}</p>
                </div>
                <div>
                  <span className="platform-context-list__label">Dernière mise à jour</span>
                  <p>{activeDocument.lastUpdated}</p>
                </div>
                <div>
                  <span className="platform-context-list__label">Résumé</span>
                  <p>{activeDocument.summary}</p>
                </div>
                <div>
                  <span className="platform-context-list__label">Prochaine action</span>
                  <p>{activeDocument.nextAction}</p>
                </div>
              </div>

              <div className="platform-mini-metrics">
                <div className="platform-mini-metric">
                  <span>Extraits</span>
                  <strong>{activeDocument.chunkCount}</strong>
                </div>
                <div className="platform-mini-metric">
                  <span>RAG status</span>
                  <strong>{activeDocument.ragStatus}</strong>
                </div>
              </div>

              <div className="platform-priority-list">
                {activeDocument.notes.map((note) => (
                  <div className="platform-priority-item" key={note}>
                    <span className="platform-priority-item__dot" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>

              <div className="platform-inline-actions">
                <button className="platform-primary-button" onClick={() => onToggleDocumentContext(activeDocument.label)} type="button">
                  {documentContextSelection.includes(activeDocument.label) ? "Retirer du contexte IA" : "Ajouter au contexte IA"}
                </button>
                <button className="platform-ghost-button" disabled={documentBusy} onClick={() => onIndexDocument(activeDocument.label)} type="button">
                  {documentBusy ? "Indexation..." : "Indexer pour l'IA"}
                </button>
                <button className="platform-ghost-button" onClick={() => onNavigate("social")} type="button">
                  Demander aux pairs
                </button>
              </div>
            </>
          ) : (
            <p className="platform-summary-copy">Ajoutez un document pour commencer à construire le contexte du dossier.</p>
          )}
        </article>
      </div>
    </section>
  );
}

function SocialWorkspaceScreen({
  mode,
  socialData,
  selectedCircleIndex,
  selectedThreadIndex,
  socialBusy,
  onCreateSocialThread,
  onModeChange,
  onSelectCircle,
  onSelectThread,
  onNavigate,
}: {
  mode: ProjectMode;
  socialData: SocialResponse | null;
  selectedCircleIndex: number;
  selectedThreadIndex: number;
  socialBusy: boolean;
  onCreateSocialThread: (payload: { circleId: string; title: string; body: string }) => void;
  onModeChange: (mode: ProjectMode) => void;
  onSelectCircle: (index: number) => void;
  onSelectThread: (index: number) => void;
  onNavigate: (screen: AppScreen) => void;
}) {
  const [threadTitle, setThreadTitle] = useState("");
  const [threadBody, setThreadBody] = useState("");
  const circles = socialData?.circles || [];
  const highlight = socialData?.highlight || socialHighlights[mode];
  const activeCircle = circles[selectedCircleIndex] ?? circles[0];
  const threads = activeCircle?.threads || [];
  const activeThread = threads[selectedThreadIndex] ?? threads[0];

  return (
    <section className="platform-screen platform-screen--social">
      <article className="platform-hero-card">
        <div className="platform-hero-card__copy">
          <p className="platform-section-label">{highlight.eyebrow}</p>
          <h2>{highlight.title}</h2>
          <p>{highlight.summary}</p>
        </div>

        <div className="platform-hero-card__actions">
          <button className="platform-primary-button" type="button">
            {highlight.cta}
          </button>
          <button className="platform-ghost-button" onClick={() => onNavigate("assistant")} type="button">
            {highlight.secondaryCta}
          </button>
        </div>
      </article>

      <div className="platform-toolbar-row">
        <ModeTabs mode={mode} onChange={onModeChange} />
        <div className="platform-chip-row">
          {highlight.trustSignals.map((signal) => (
            <span className="platform-chip" key={signal}>
              {signal}
            </span>
          ))}
        </div>
      </div>

      <div className="platform-kpi-grid">
        {(socialData?.stats || socialStats[mode]).map((stat) => (
          <article className="platform-kpi-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="platform-grid platform-grid--social">
        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Cercles recommandes</h3>
            <span className="platform-badge">{circles.length} groupes</span>
          </div>

          <div className="platform-social-list">
            {circles.map((circle, index) => (
              <button
                className={selectedCircleIndex === index ? "platform-social-row is-active" : "platform-social-row"}
                key={circle.id}
                onClick={() => onSelectCircle(index)}
                type="button"
              >
                <div>
                  <strong>{circle.title}</strong>
                  <p>{circle.audience}</p>
                </div>
                <span>{circle.members}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="platform-surface">
          {activeCircle ? (
            <>
              <div className="platform-surface__header">
                <h3>{activeCircle.title}</h3>
                <span className="platform-badge">{activeCircle.trust}</span>
              </div>

              <p className="platform-summary-copy">{activeCircle.description}</p>

              <div className="platform-mini-metrics">
                <div className="platform-mini-metric">
                  <span>Membres</span>
                  <strong>{activeCircle.members}</strong>
                </div>
                <div className="platform-mini-metric">
                  <span>Activite</span>
                  <strong>{activeCircle.activity}</strong>
                </div>
              </div>

              <article className="platform-inline-panel">
                <span className="platform-section-label">Pourquoi y aller</span>
                <strong>{activeCircle.prompt}</strong>
              </article>

              <div className="platform-chip-row">
                {activeCircle.tags.map((tag) => (
                  <span className="platform-chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="platform-composer">
                <input
                  className="platform-composer__input"
                  onChange={(event) => setThreadTitle(event.target.value)}
                  placeholder="Titre de votre discussion"
                  value={threadTitle}
                />
                <textarea
                  className="platform-composer__input"
                  onChange={(event) => setThreadBody(event.target.value)}
                  placeholder="Expliquez votre doute ou votre situation"
                  rows={3}
                  value={threadBody}
                />
                <button
                  className="platform-primary-button"
                  disabled={socialBusy || !threadTitle.trim() || !threadBody.trim()}
                  onClick={() => {
                    onCreateSocialThread({
                      circleId: activeCircle.id,
                      title: threadTitle,
                      body: threadBody,
                    });
                    setThreadTitle("");
                    setThreadBody("");
                  }}
                  type="button"
                >
                  {socialBusy ? "Publication..." : "Publier un fil"}
                </button>
              </div>
            </>
          ) : (
            <p className="platform-summary-copy">Aucun cercle chargé pour le moment.</p>
          )}
        </article>
      </div>

      <div className="platform-grid platform-grid--social-thread">
        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Fils de discussion</h3>
            <span className="platform-badge">{threads.length} utiles</span>
          </div>

          <div className="platform-thread-stack">
            {threads.map((thread, index) => (
              <button
                className={selectedThreadIndex === index ? "platform-thread-card is-active" : "platform-thread-card"}
                key={thread.id}
                onClick={() => onSelectThread(index)}
                type="button"
              >
                <div className="platform-chip-row">
                  <span className="platform-chip">{thread.trust}</span>
                  <span className="platform-chip">{thread.replies}</span>
                </div>
                <strong>{thread.title}</strong>
                <p>{thread.excerpt}</p>
                <span className="platform-thread-meta">{thread.lastActivity}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="platform-surface is-dark">
          {activeThread ? (
            <>
              <div className="platform-surface__header">
                <h3>Fil actif</h3>
                <span className="platform-badge is-contrast">{activeThread.trust}</span>
              </div>

              <div className="platform-context-list">
                <div>
                  <span className="platform-context-list__label">Auteur</span>
                  <p>
                    {activeThread.author} · {activeThread.role}
                  </p>
                </div>
                <div>
                  <span className="platform-context-list__label">Question</span>
                  <p>{activeThread.title}</p>
                </div>
                <div>
                  <span className="platform-context-list__label">Synthèse IA</span>
                  <p>{activeThread.aiSummary}</p>
                </div>
              </div>

              <div className="platform-priority-list platform-priority-list--contrast">
                <div className="platform-priority-item">
                  <span className="platform-priority-item__dot" />
                  <span>{activeThread.projectLink}</span>
                </div>
                <div className="platform-priority-item">
                  <span className="platform-priority-item__dot" />
                  <span>Transmettre au coach si le sujet touche au prix, au financement ou à un risque juridique.</span>
                </div>
              </div>

              <div className="platform-inline-actions">
                <button className="platform-primary-button platform-primary-button--light" type="button">
                  {activeThread.actionLabel}
                </button>
                <button className="platform-ghost-button platform-ghost-button--dark" onClick={() => onNavigate("assistant")} type="button">
                  Reprendre dans l&apos;IA
                </button>
              </div>
            </>
          ) : (
            <p className="platform-summary-copy">Publiez un premier fil pour activer cet espace.</p>
          )}
        </article>
      </div>
    </section>
  );
}

function ProfileWorkspaceScreen({
  authConfigured,
  authLoading,
  authError,
  authNotice,
  sessionEmail,
  onSignIn,
  onSignOut,
  onSignUp,
}: {
  authConfigured: boolean;
  authLoading: boolean;
  authError: string | null;
  authNotice: string | null;
  sessionEmail: string | null;
  onSignIn: (email: string, password: string) => void;
  onSignOut: () => void;
  onSignUp: (email: string, password: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="platform-screen platform-screen--profile">
      <article className="platform-inline-panel">
        <span className="platform-section-label">Accompagnement</span>
        <strong>Le profil concentre la confiance, les preferences IA et les regles d&apos;escalade coach.</strong>
      </article>

      <div className="platform-grid platform-grid--profile">
        <article className="platform-surface">
          <div className="platform-profile-head">
            <div className="profile-hero__avatar">LM</div>
            <div>
              <h3>{sessionEmail || "Loïc Métivier"}</h3>
              <p>{sessionEmail ? "Session Supabase active" : "Accompagnement hybride IA + coach humain"}</p>
            </div>
          </div>

          <div className="platform-context-list">
            {profileSections[0].items.map((item) => (
              <div key={item.label}>
                <span className="platform-context-list__label">{item.label}</span>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="platform-surface is-dark">
          <div className="platform-surface__header">
            <h3>Sécurité et confiance</h3>
            <span className="platform-badge is-contrast">Mistral API active</span>
          </div>
          <p className="platform-summary-copy">{securityMessage}</p>
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Authentification</h3>
            <span className="platform-badge">{authConfigured ? "Supabase prêt" : "Variables requises"}</span>
          </div>
          {!authConfigured ? (
            <p className="platform-summary-copy">
              Configurez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` pour activer la connexion utilisateur.
            </p>
          ) : sessionEmail ? (
            <div className="platform-inline-actions">
              <span className="platform-chip">{sessionEmail}</span>
              <button className="platform-primary-button" disabled={authLoading} onClick={onSignOut} type="button">
                {authLoading ? "Déconnexion..." : "Se déconnecter"}
              </button>
            </div>
          ) : (
            <div className="platform-composer">
              <input
                className="platform-composer__input"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                value={email}
              />
              <input
                className="platform-composer__input"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mot de passe"
                type="password"
                value={password}
              />
              <div className="platform-inline-actions">
                <button
                  className="platform-primary-button"
                  disabled={authLoading || !email.trim() || !password.trim()}
                  onClick={() => onSignIn(email, password)}
                  type="button"
                >
                  {authLoading ? "Connexion..." : "Se connecter"}
                </button>
                <button
                  className="platform-ghost-button"
                  disabled={authLoading || !email.trim() || !password.trim()}
                  onClick={() => onSignUp(email, password)}
                  type="button"
                >
                  Créer un compte
                </button>
              </div>
              {authError ? <div className="feedback-banner is-error">{authError}</div> : null}
              {authNotice ? <div className="feedback-banner is-success">{authNotice}</div> : null}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

type WebPlatformShellProps = {
  activeScreen: AppScreen;
  activeAction: "buyer" | "seller" | "estimate";
  assistantProvider: AssistantProvider;
  mode: ProjectMode;
  scenario: ScenarioData;
  selectedListingIndex: number;
  selectedProjectStepIndex: number;
  selectedDocumentIndex: number;
  selectedSocialCircleIndex: number;
  selectedSocialThreadIndex: number;
  documentFilter: DocumentFilter;
  documentContextSelection: string[];
  draft: string;
  error: string | null;
  isLoading: boolean;
  messages: AssistantMessage[];
  projectsData: ProjectsResponse | null;
  documentsData: DocumentsResponse | null;
  socialData: SocialResponse | null;
  assistantSources: RagContextResponse["sources"];
  authConfigured: boolean;
  authLoading: boolean;
  authError: string | null;
  authNotice: string | null;
  sessionEmail: string | null;
  projectBusy: boolean;
  documentBusy: boolean;
  socialBusy: boolean;
  onCreateDocument: (payload: { label: string; summary: string; source: string; file?: File | null }) => void;
  onCreateProject: () => void;
  onCreateSocialThread: (payload: { circleId: string; title: string; body: string }) => void;
  onActionChange: (id: "buyer" | "seller" | "estimate") => void;
  onAssistantProviderChange: (provider: AssistantProvider) => void;
  onCompareResponse: (message: AssistantMessage, provider: AssistantProvider) => void;
  onDraftChange: (value: string) => void;
  onDocumentFilterChange: (filter: DocumentFilter) => void;
  onIndexDocument: (label: string) => void;
  onSelectDocument: (index: number) => void;
  onModeChange: (mode: ProjectMode) => void;
  onNavigate: (screen: AppScreen) => void;
  onPromptClick: (prompt: string) => void;
  onSelectSocialCircle: (index: number) => void;
  onSelectSocialThread: (index: number) => void;
  onSelectProjectStep: (index: number) => void;
  onSelectListing: (index: number) => void;
  onSignIn: (email: string, password: string) => void;
  onSignOut: () => void;
  onSignUp: (email: string, password: string) => void;
  onToggleDocumentContext: (label: string) => void;
  onSubmit: () => void;
  onPrimaryAction: () => void;
};

export function WebPlatformShell({
  activeScreen,
  activeAction,
  assistantProvider,
  mode,
  scenario,
  selectedListingIndex,
  selectedProjectStepIndex,
  selectedDocumentIndex,
  selectedSocialCircleIndex,
  selectedSocialThreadIndex,
  documentFilter,
  documentContextSelection,
  draft,
  error,
  isLoading,
  messages,
  projectsData,
  documentsData,
  socialData,
  assistantSources,
  authConfigured,
  authLoading,
  authError,
  authNotice,
  sessionEmail,
  projectBusy,
  documentBusy,
  socialBusy,
  onCreateDocument,
  onCreateProject,
  onCreateSocialThread,
  onActionChange,
  onAssistantProviderChange,
  onCompareResponse,
  onDraftChange,
  onDocumentFilterChange,
  onIndexDocument,
  onSelectDocument,
  onModeChange,
  onNavigate,
  onPromptClick,
  onSelectSocialCircle,
  onSelectSocialThread,
  onSelectProjectStep,
  onSelectListing,
  onSignIn,
  onSignOut,
  onSignUp,
  onToggleDocumentContext,
  onSubmit,
  onPrimaryAction,
}: WebPlatformShellProps) {
  return (
    <section className="web-shell" aria-label="Plateforme web CoachImmoIA">
      <PlatformSidebar activeScreen={activeScreen} mode={mode} onModeChange={onModeChange} onNavigate={onNavigate} />

      <div className="web-shell__main">
        <div className="web-shell__content">
          {activeScreen === "home" ? (
            <DashboardScreen
              activeAction={activeAction}
              assistantProvider={assistantProvider}
              error={error}
              mode={mode}
              onActionChange={onActionChange}
              onNavigate={onNavigate}
              onPrimaryAction={onPrimaryAction}
              projectsData={projectsData}
              scenario={scenario}
              socialData={socialData}
            />
          ) : null}
          {activeScreen === "listings" ? (
            <ListingsWorkspaceScreen
              mode={mode}
              onModeChange={onModeChange}
              onSelectListing={onSelectListing}
              scenario={scenario}
              selectedIndex={selectedListingIndex}
            />
          ) : null}
          {activeScreen === "assistant" ? (
            <AssistantWorkspaceScreen
              assistantSources={assistantSources}
              assistantProvider={assistantProvider}
              draft={draft}
              error={error}
              isLoading={isLoading}
              messages={messages}
              mode={mode}
              onDraftChange={onDraftChange}
              onAssistantProviderChange={onAssistantProviderChange}
              onCompareResponse={onCompareResponse}
              onPromptClick={onPromptClick}
              onSubmit={onSubmit}
              scenario={scenario}
            />
          ) : null}
          {activeScreen === "projects" ? (
            <ProjectsWorkspaceScreen
              error={error}
              mode={mode}
              onCreateProject={onCreateProject}
              onNavigate={onNavigate}
              onSelectStep={onSelectProjectStep}
              projectBusy={projectBusy}
              projectsData={projectsData}
              scenario={scenario}
              selectedStepIndex={selectedProjectStepIndex}
            />
          ) : null}
          {activeScreen === "documents" ? (
            <DocumentsScreen
              error={error}
              documentBusy={documentBusy}
              documentContextSelection={documentContextSelection}
              documentFilter={documentFilter}
              documentsData={documentsData}
              mode={mode}
              onCreateDocument={onCreateDocument}
              onDocumentFilterChange={onDocumentFilterChange}
              onIndexDocument={onIndexDocument}
              onNavigate={onNavigate}
              onSelectDocument={onSelectDocument}
              onToggleDocumentContext={onToggleDocumentContext}
              selectedDocumentIndex={selectedDocumentIndex}
            />
          ) : null}
          {activeScreen === "social" ? (
            <SocialWorkspaceScreen
              mode={mode}
              onCreateSocialThread={onCreateSocialThread}
              onModeChange={onModeChange}
              onNavigate={onNavigate}
              onSelectCircle={onSelectSocialCircle}
              onSelectThread={onSelectSocialThread}
              selectedCircleIndex={selectedSocialCircleIndex}
              selectedThreadIndex={selectedSocialThreadIndex}
              socialBusy={socialBusy}
              socialData={socialData}
            />
          ) : null}
          {activeScreen === "profile" ? (
            <ProfileWorkspaceScreen
              authConfigured={authConfigured}
              authError={authError}
              authNotice={authNotice}
              authLoading={authLoading}
              onSignIn={onSignIn}
              onSignOut={onSignOut}
              onSignUp={onSignUp}
              sessionEmail={sessionEmail}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
