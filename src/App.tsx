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

type DocumentWorkspaceItem = DocumentStatus & {
  source: string;
  owner: string;
  ragStatus: "indexed" | "ready" | "missing";
  chunkCount: number;
  lastUpdated: string;
  summary: string;
  nextAction: string;
  notes: string[];
};

type ListingWorkspaceMeta = {
  score: string;
  tempo: string;
  coachSignal: string;
  nextAction: string;
  strengths: string[];
  risks: string[];
  prepDocs: string[];
};

type ProjectStepMeta = {
  owner: string;
  deadline: string;
  checkpoint: string;
  blocker: string;
};

const sellerDocumentStatuses: DocumentStatus[] = [
  { label: "Titre de propriete", status: "Disponible", tone: "mint" },
  { label: "Taxe fonciere", status: "Disponible", tone: "mint" },
  { label: "Diagnostics", status: "A completer", tone: "dark" },
  { label: "PV d'AG et carnet d'entretien", status: "A demander", tone: "dark" },
];

const documentWorkspaceData: Record<ProjectMode, DocumentWorkspaceItem[]> = {
  buyer: [
    {
      label: "Piece d'identite",
      status: "Disponible",
      tone: "mint",
      source: "Client",
      owner: "Utilisateur",
      ragStatus: "indexed",
      chunkCount: 6,
      lastUpdated: "Aujourd'hui · 09:20",
      summary: "Utilise pour securiser le dossier banque et l'offre.",
      nextAction: "Conserver dans le contexte du dossier.",
      notes: ["Version lisible", "Partage autorise avec le coach"],
    },
    {
      label: "Simulation bancaire",
      status: "Disponible",
      tone: "mint",
      source: "Banque",
      owner: "Conseiller",
      ragStatus: "indexed",
      chunkCount: 12,
      lastUpdated: "Hier · 18:10",
      summary: "Base de reference pour cadrer budget et capacite d'emprunt.",
      nextAction: "Mettre a jour si le taux change.",
      notes: ["Budget cadre 620 kEUR", "Taux a reverifier sous 15 jours"],
    },
    {
      label: "Plan de financement",
      status: "A preparer",
      tone: "dark",
      source: "Assistant IA",
      owner: "Utilisateur",
      ragStatus: "ready",
      chunkCount: 0,
      lastUpdated: "En attente",
      summary: "Document de synthese pour harmoniser banque, apport et conditions suspensives.",
      nextAction: "Generer une premiere version avec l'assistant.",
      notes: ["Futur support RAG", "A transmettre avant offre"],
    },
    {
      label: "Questions de visite",
      status: "A preparer",
      tone: "dark",
      source: "Assistant IA",
      owner: "CoachImmoIA",
      ragStatus: "missing",
      chunkCount: 0,
      lastUpdated: "A creer",
      summary: "Check-list exploitable pendant la visite pour limiter les angles morts.",
      nextAction: "Generer les questions copropriete et travaux.",
      notes: ["Priorite forte", "A synchroniser avec le coach si offre rapide"],
    },
  ],
  seller: [
    {
      label: "Titre de propriete",
      status: "Disponible",
      tone: "mint",
      source: "Client",
      owner: "Utilisateur",
      ragStatus: "indexed",
      chunkCount: 9,
      lastUpdated: "Aujourd'hui · 08:45",
      summary: "Piece socle pour ouvrir le dossier vendeur et rassurer l'accompagnement.",
      nextAction: "Confirmer la version la plus recente.",
      notes: ["Document indexe", "Reference juridique de base"],
    },
    {
      label: "Taxe fonciere",
      status: "Disponible",
      tone: "mint",
      source: "Client",
      owner: "Utilisateur",
      ragStatus: "ready",
      chunkCount: 4,
      lastUpdated: "Hier · 17:30",
      summary: "Piece de reference pour la presentation vendeur et les questions acheteurs.",
      nextAction: "Lier au resume du dossier.",
      notes: ["Pas encore indexee", "Bonne piece pour le contexte IA"],
    },
    {
      label: "Diagnostics",
      status: "A completer",
      tone: "dark",
      source: "Diagnostiqueur",
      owner: "Prestataire",
      ragStatus: "missing",
      chunkCount: 0,
      lastUpdated: "Relance requise",
      summary: "Bloc critique pour la mise en vente et la reduction des frictions acheteur.",
      nextAction: "Relancer le diagnostiqueur et programmer la mise a jour.",
      notes: ["Bloquant avant diffusion large", "A escalader si pas de retour sous 48h"],
    },
    {
      label: "PV d'AG et carnet d'entretien",
      status: "A demander",
      tone: "dark",
      source: "Syndic",
      owner: "Syndic",
      ragStatus: "missing",
      chunkCount: 0,
      lastUpdated: "Demande non envoyee",
      summary: "Documents de copropriete essentiels pour les comparaisons, les objections et le futur RAG.",
      nextAction: "Generer un email syndic et suivre la reponse.",
      notes: ["Support RAG prioritaire", "Cle pour l'analyse des risques"],
    },
  ],
};

const listingWorkspaceMeta: Record<ProjectMode, ListingWorkspaceMeta[]> = {
  buyer: [
    {
      score: "91/100",
      tempo: "Visite cette semaine",
      coachSignal: "Verte",
      nextAction: "Generer la checklist copropriete avant visite.",
      strengths: ["Bon fit budget / surface", "Copropriete saine", "Exterieur utile"],
      risks: ["Charges a challenger", "Travaux en parties communes a confirmer"],
      prepDocs: ["Questions de visite", "Simulation bancaire", "Plan de financement"],
    },
    {
      score: "74/100",
      tempo: "A challenger",
      coachSignal: "Orange",
      nextAction: "Comparer au bien de Saint Ambroise avant arbitrage.",
      strengths: ["Surface genereuse", "Bon potentiel de valorisation"],
      risks: ["DPE a verifier", "Environnement plus bruyant"],
      prepDocs: ["Comparatif de biens", "Questions travaux", "Grille de notation"],
    },
    {
      score: "79/100",
      tempo: "Sous surveillance",
      coachSignal: "Orange",
      nextAction: "Valider les charges et la luminosite reelle.",
      strengths: ["Etage eleve", "Bonne optimisation de plan"],
      risks: ["Charges a confirmer", "Visite necessaire en fin de journee"],
      prepDocs: ["Questions de visite", "Comparatif quartier", "Plan de financement"],
    },
  ],
  seller: [
    {
      score: "Comparable A",
      tempo: "Reference forte",
      coachSignal: "Verte",
      nextAction: "Integrer cette reference dans le cadrage prix.",
      strengths: ["Delai de vente rapide", "Presentation tres proche du bien cible"],
      risks: ["Marche potentiellement plus tendu au moment de diffusion"],
      prepDocs: ["Arguments prix", "Comparables", "Strategie de diffusion"],
    },
    {
      score: "Comparable B",
      tempo: "Signal utile",
      coachSignal: "Orange",
      nextAction: "Comparer la marge de nego reellement observee.",
      strengths: ["Reference de secteur utile", "Dossier vendeur tres propre"],
      risks: ["Contexte de marche un peu different"],
      prepDocs: ["Comparatif prix", "Questions coach", "Pieces vendeur"],
    },
    {
      score: "Comparable C",
      tempo: "A contextualiser",
      coachSignal: "Orange",
      nextAction: "Verifier la proximite de standing avec votre bien.",
      strengths: ["Bonne reference surface", "Diffusion bien documentee"],
      risks: ["Canal de vente direct", "Conditions de nego differentes"],
      prepDocs: ["Tableau comparables", "Strategie vendeur", "Dossier copropriete"],
    },
  ],
};

const projectStepMeta: Record<ProjectMode, ProjectStepMeta[]> = {
  buyer: [
    {
      owner: "Utilisateur + banque",
      deadline: "Valide",
      checkpoint: "Simulation confirmee et marge de securite posee.",
      blocker: "Aucun blocker critique.",
    },
    {
      owner: "Utilisateur + Assistant IA",
      deadline: "Cette semaine",
      checkpoint: "Comparer les 3 meilleurs biens sans bruit contextuel.",
      blocker: "Questions copropriete encore incomplètes.",
    },
    {
      owner: "Coach + utilisateur",
      deadline: "Avant offre",
      checkpoint: "Rassembler les points sensibles avant positionnement prix.",
      blocker: "Travaux et timing banque a clarifier.",
    },
  ],
  seller: [
    {
      owner: "Utilisateur",
      deadline: "En cours",
      checkpoint: "Documents critiques identifies et statuts traces.",
      blocker: "Pieces copropriete non encore centralisees.",
    },
    {
      owner: "Coach + utilisateur",
      deadline: "Cette semaine",
      checkpoint: "Comparer 3 references solides avec un angle marche.",
      blocker: "Prix cible encore a arbitrer.",
    },
    {
      owner: "Coach humain",
      deadline: "Avant diffusion",
      checkpoint: "Choisir le canal de vente et la mise en scene documentaire.",
      blocker: "Diagnostics et pieces syndic manquants.",
    },
  ],
};

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

function DocumentIcon() {
  return (
    <svg aria-hidden="true" className="nav-icon-svg" viewBox="0 0 24 24">
      <path
        d="M8 4.5h6.8L19 8.7V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 7 19V6A1.5 1.5 0 0 1 8.5 4.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M14.5 4.8V9h4.2" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M10 12h6M10 15.5h6M10 19h4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
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
  if (activeScreen === "profile" || activeScreen === "documents") {
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

function PlatformHeader({
  mode,
  activeScreen,
  onModeChange,
}: {
  mode: ProjectMode;
  activeScreen: AppScreen;
  onModeChange: (mode: ProjectMode) => void;
}) {
  const titles: Record<AppScreen, { title: string; subtitle: string }> = {
    home: {
      title: "Dashboard",
      subtitle: "Vue d'ensemble du dossier, des urgences et des prochaines actions.",
    },
    listings: {
      title: "Biens",
      subtitle: "Selection, qualification et comparaison des biens ou comparables.",
    },
    assistant: {
      title: "Assistant IA",
      subtitle: "Workspace conversationnel avec contexte, prompts et sources utiles.",
    },
    projects: {
      title: "Projet",
      subtitle: "Roadmap, dependances et points de vigilance du dossier actif.",
    },
    documents: {
      title: "Documents",
      subtitle: "Pilotage documentaire et preparation du futur socle RAG.",
    },
    profile: {
      title: "Profil",
      subtitle: "Compte, preferences d'accompagnement et cadrage securite.",
    },
  };

  return (
    <header className="platform-header">
      <div>
        <p className="platform-header__eyebrow">Plateforme web</p>
        <h1>{titles[activeScreen].title}</h1>
        <p>{titles[activeScreen].subtitle}</p>
      </div>

      <div className="platform-header__actions">
        <div className="platform-search">Rechercher un dossier, un bien, un document...</div>
        <ModeTabs mode={mode} onChange={onModeChange} />
        <button className="platform-ghost-button" type="button">
          Notifications
        </button>
        <button className="platform-primary-button" type="button">
          Contacter coach
        </button>
      </div>
    </header>
  );
}

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
  mode,
  scenario,
  onNavigate,
}: {
  mode: ProjectMode;
  scenario: ScenarioData;
  onNavigate: (screen: AppScreen) => void;
}) {
  return (
    <section className="platform-screen platform-screen--dashboard">
      <article className="platform-hero-card">
        <div className="platform-hero-card__copy">
          <p className="platform-section-label">{scenario.greeting}</p>
          <h2>
            {mode === "buyer"
              ? "Pilotez votre projet acheteur sans dispersion."
              : "Cadrez votre vente avec une vue claire sur les priorites."}
          </h2>
          <p>{scenario.projectNote}</p>
        </div>

        <div className="platform-hero-card__actions">
          <button className="platform-primary-button" onClick={() => onNavigate("assistant")} type="button">
            Ouvrir l&apos;assistant
          </button>
          <button className="platform-ghost-button" onClick={() => onNavigate("projects")} type="button">
            Voir le projet
          </button>
        </div>
      </article>

      <article className="platform-focus-strip">
        <div>
          <span className="platform-section-label">Focus du jour</span>
          <strong>
            {mode === "buyer"
              ? "Preparer la visite de demain et cadrer les questions de copropriete."
              : "Verifier les pieces copropriete avant de figer la strategie de mise en vente."}
          </strong>
        </div>
        <div className="platform-inline-actions">
          <button className="platform-primary-button" onClick={() => onNavigate("assistant")} type="button">
            Generer checklist IA
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
            {projectSteps[mode].map((step) => (
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
            <h3>Priorites du moment</h3>
            <button className="platform-text-button" onClick={() => onNavigate("documents")} type="button">
              Documents
            </button>
          </div>

          <div className="platform-priority-list">
            {scenario.checklist.map((item) => (
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
            <span className="platform-badge">Mistral actif</span>
          </div>
          <p className="platform-summary-copy">{scenario.coachHint}</p>
          <div className="platform-mini-metrics">
            <div className="platform-mini-metric">
              <span>Statut coach</span>
              <strong>Disponible</strong>
            </div>
            <div className="platform-mini-metric">
              <span>Prochaine aide</span>
              <strong>Checklist visite</strong>
            </div>
          </div>
          <div className="platform-inline-actions">
            <button className="platform-primary-button" onClick={() => onNavigate("assistant")} type="button">
              Generer checklist
            </button>
            <button className="platform-ghost-button" type="button">
              Demander arbitrage
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
                className={selectedIndex === index ? "platform-listing-row is-active" : "platform-listing-row"}
                key={`${item.title}-${item.location}`}
                onClick={() => onSelectListing(index)}
                type="button"
              >
                <SceneArtwork scene={item.scene} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.location}</p>
                </div>
                <span>{item.price}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Detail du bien</h3>
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
              <span>Decision</span>
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
              <span>Next step</span>
              <strong>{activeMeta.nextAction}</strong>
            </div>
          </div>

          <div className="platform-detail-columns">
            <div className="platform-priority-list">
              {activeMeta.strengths.map((item) => (
                <div className="platform-priority-item" key={item}>
                  <span className="platform-priority-item__dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="platform-warning-list">
              {activeMeta.risks.map((item) => (
                <div className="platform-warning-item" key={item}>
                  <span className="platform-warning-item__dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <article className="platform-inline-panel">
            <span className="platform-section-label">Pieces a preparer</span>
            <strong>{activeMeta.prepDocs.join(" · ")}</strong>
          </article>

          <div className="platform-inline-actions">
            <button className="platform-primary-button" type="button">
              Ouvrir dans le projet
            </button>
            <button className="platform-ghost-button" type="button">
              Preparer la visite
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function AssistantWorkspaceScreen({
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
    <section className="platform-screen platform-screen--assistant">
      <div className="platform-toolbar-row">
        <ModeTabs mode={mode} onChange={onModeChange} />
        <span className="platform-chip">Modele actif : {runtime.label}</span>
      </div>

      <div className="platform-grid platform-grid--assistant">
        <article className="platform-surface platform-chat-surface">
          <div className="platform-surface__header">
            <h3>Conversation active</h3>
            <span className="platform-badge">Reponses actionnables</span>
          </div>

          <article className="platform-inline-panel">
            <span className="platform-section-label">Objectif courant</span>
            <strong>
              {mode === "buyer"
                ? "Structurer la visite et les questions avant engagement."
                : "Organiser les relances documentaires et le cadrage prix."}
            </strong>
          </article>

          <div className="platform-chat-thread">
            {messages.map((message, index) => (
              <div
                className={message.role === "assistant" ? "platform-chat-bubble is-assistant" : "platform-chat-bubble is-user"}
                key={`${message.content}-${index}`}
              >
                {message.content}
              </div>
            ))}

            {isLoading ? <div className="platform-chat-bubble is-assistant">CoachImmoIA reflechit...</div> : null}
          </div>

          <div className="platform-chip-row">
            {scenario.assistantPrompts.map((prompt) => (
              <button className="platform-chip platform-chip--button" key={prompt} onClick={() => onPromptClick(prompt)} type="button">
                {prompt}
              </button>
            ))}
          </div>

          {error ? <div className="feedback-banner is-error">{error}</div> : null}

          <div className="platform-composer">
            <textarea
              className="platform-composer__input"
              onChange={(event) => onDraftChange(event.target.value)}
              placeholder="Posez une question sur votre projet immobilier..."
              rows={4}
              value={draft}
            />
            <button className="platform-primary-button" disabled={isLoading || !draft.trim()} onClick={onSubmit} type="button">
              {isLoading ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Contexte dossier</h3>
            <span className="platform-badge">RAG ready</span>
          </div>
          <p className="platform-summary-copy">{scenario.assistantIntro}</p>

          <div className="platform-context-list">
            <div>
              <span className="platform-context-list__label">Resume</span>
              <p>{scenario.projectStatus}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Sources liees</span>
              <p>{scenario.projectDocuments.slice(0, 3).join(" · ")}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Escalade</span>
              <p>{scenario.coachHint}</p>
            </div>
          </div>

          <div className="platform-source-stack">
            {scenario.projectDocuments.slice(0, 3).map((item) => (
              <article className="platform-source-card" key={item}>
                <span className="platform-context-list__label">Source reliee</span>
                <strong>{item}</strong>
                <p>Disponible pour contextualiser les prochaines reponses et actions.</p>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function ProjectsWorkspaceScreen({
  mode,
  scenario,
  selectedStepIndex,
  onSelectStep,
}: {
  mode: ProjectMode;
  scenario: ScenarioData;
  selectedStepIndex: number;
  onSelectStep: (index: number) => void;
}) {
  const activeStep = projectSteps[mode][selectedStepIndex] ?? projectSteps[mode][0];
  const activeMeta = projectStepMeta[mode][selectedStepIndex] ?? projectStepMeta[mode][0];

  return (
    <section className="platform-screen platform-screen--projects">
      <div className="platform-grid platform-grid--projects">
        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Roadmap du dossier</h3>
            <span className="platform-badge">{scenario.projectStatus}</span>
          </div>

          <div className="platform-timeline">
            {projectSteps[mode].map((step, index) => (
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
            <h3>Focus d'etape</h3>
            <span className="platform-badge">Prioritaire</span>
          </div>
          <div className="platform-context-list">
            <div>
              <span className="platform-context-list__label">Etape active</span>
              <p>{activeStep.title}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Owner</span>
              <p>{activeMeta.owner}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Deadline</span>
              <p>{activeMeta.deadline}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Checkpoint</span>
              <p>{activeMeta.checkpoint}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Blocker</span>
              <p>{activeMeta.blocker}</p>
            </div>
          </div>
        </article>

        <article className="platform-surface is-dark">
          <div className="platform-surface__header">
            <h3>Risque principal</h3>
            <span className="platform-badge is-contrast">Coach recommande</span>
          </div>
          <p className="platform-summary-copy">
            {mode === "buyer"
              ? "Le bien cible reste prometteur, mais la copropriete et le timing banque doivent etre verifies avant arbitrage d'offre."
              : "Le prix et les documents de copropriete demandent encore un arbitrage avant diffusion large."}
          </p>
          <div className="platform-priority-list platform-priority-list--contrast">
            {scenario.checklist.map((item) => (
              <div className="platform-priority-item" key={item}>
                <span className="platform-priority-item__dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="platform-inline-actions">
            <button className="platform-primary-button platform-primary-button--light" type="button">
              Escalader au coach
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
  selectedDocumentIndex,
  documentFilter,
  documentContextSelection,
  onDocumentFilterChange,
  onSelectDocument,
  onToggleDocumentContext,
}: {
  mode: ProjectMode;
  selectedDocumentIndex: number;
  documentFilter: "all" | "action" | "rag";
  documentContextSelection: string[];
  onDocumentFilterChange: (filter: "all" | "action" | "rag") => void;
  onSelectDocument: (index: number) => void;
  onToggleDocumentContext: (label: string) => void;
}) {
  const rows = documentWorkspaceData[mode];
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
            ? "Les pieces critiques du financement et de la visite sont centralisees pour accelerer le dossier."
            : "Les documents vendeur sont classes par statut pour preparer la diffusion et le futur RAG."}
        </strong>
      </article>

      <div className="platform-toolbar-row">
        <div className="platform-chip-row">
          {[
            { label: "Tous", value: "all" },
            { label: "Action requise", value: "action" },
            { label: "RAG pret", value: "rag" },
          ].map((filter) => (
            <button
              className={documentFilter === filter.value ? "platform-chip platform-chip--button is-active" : "platform-chip platform-chip--button"}
              key={filter.value}
              onClick={() => onDocumentFilterChange(filter.value as "all" | "action" | "rag")}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
        <span className="platform-chip">Contexte IA : {documentContextSelection.length} pieces</span>
      </div>

      <div className="platform-kpi-grid platform-kpi-grid--documents">
        <article className="platform-kpi-card">
          <span>Disponibles</span>
          <strong>{rows.filter((row) => row.status === "Disponible").length}</strong>
        </article>
        <article className="platform-kpi-card">
          <span>En attente</span>
          <strong>{rows.filter((row) => row.status !== "Disponible").length}</strong>
        </article>
        <article className="platform-kpi-card">
          <span>Indexation future</span>
          <strong>{rows.filter((row) => row.ragStatus !== "missing").length} pretes</strong>
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
                className={activeDocument.label === row.label ? "platform-document-table__row is-active" : "platform-document-table__row"}
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
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Detail document</h3>
            <span className="platform-badge">RAG {activeDocument.ragStatus}</span>
          </div>

          <div className="platform-context-list">
            <div>
              <span className="platform-context-list__label">Document</span>
              <p>{activeDocument.label}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Owner</span>
              <p>{activeDocument.owner}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Last updated</span>
              <p>{activeDocument.lastUpdated}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Summary</span>
              <p>{activeDocument.summary}</p>
            </div>
            <div>
              <span className="platform-context-list__label">Next action</span>
              <p>{activeDocument.nextAction}</p>
            </div>
          </div>

          <div className="platform-mini-metrics">
            <div className="platform-mini-metric">
              <span>Chunks</span>
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
            <button className="platform-ghost-button" type="button">
              {activeDocument.status === "Disponible" ? "Voir l'extrait" : "Generer relance"}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function ProfileWorkspaceScreen() {
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
              <h3>Loic Metivier</h3>
              <p>Accompagnement hybride IA + coach humain</p>
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
            <h3>Securite et confiance</h3>
            <span className="platform-badge is-contrast">Mistral API active</span>
          </div>
          <p className="platform-summary-copy">{securityMessage}</p>
        </article>

        <article className="platform-surface">
          <div className="platform-surface__header">
            <h3>Parametres clefs</h3>
            <span className="platform-badge">Coach disponible</span>
          </div>
          <div className="platform-context-list">
            {profileSections.slice(1).flatMap((section) => section.items).map((item) => (
              <div key={item.label}>
                <span className="platform-context-list__label">{item.label}</span>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function WebPlatformShell({
  activeScreen,
  mode,
  scenario,
  selectedListingIndex,
  selectedProjectStepIndex,
  selectedDocumentIndex,
  documentFilter,
  documentContextSelection,
  draft,
  error,
  isLoading,
  messages,
  onDraftChange,
  onDocumentFilterChange,
  onSelectDocument,
  onModeChange,
  onNavigate,
  onPromptClick,
  onSelectProjectStep,
  onSelectListing,
  onToggleDocumentContext,
  onSubmit,
}: {
  activeScreen: AppScreen;
  mode: ProjectMode;
  scenario: ScenarioData;
  selectedListingIndex: number;
  selectedProjectStepIndex: number;
  selectedDocumentIndex: number;
  documentFilter: "all" | "action" | "rag";
  documentContextSelection: string[];
  draft: string;
  error: string | null;
  isLoading: boolean;
  messages: AssistantMessage[];
  onDraftChange: (value: string) => void;
  onDocumentFilterChange: (filter: "all" | "action" | "rag") => void;
  onSelectDocument: (index: number) => void;
  onModeChange: (mode: ProjectMode) => void;
  onNavigate: (screen: AppScreen) => void;
  onPromptClick: (prompt: string) => void;
  onSelectProjectStep: (index: number) => void;
  onSelectListing: (index: number) => void;
  onToggleDocumentContext: (label: string) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="web-shell" aria-label="Plateforme web CoachImmoIA">
      <PlatformSidebar activeScreen={activeScreen} mode={mode} onModeChange={onModeChange} onNavigate={onNavigate} />

      <div className="web-shell__main">
        <PlatformHeader activeScreen={activeScreen} mode={mode} onModeChange={onModeChange} />

        <div className="web-shell__content">
          {activeScreen === "home" ? <DashboardScreen mode={mode} onNavigate={onNavigate} scenario={scenario} /> : null}
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
              draft={draft}
              error={error}
              isLoading={isLoading}
              messages={messages}
              mode={mode}
              onDraftChange={onDraftChange}
              onModeChange={onModeChange}
              onPromptClick={onPromptClick}
              onSubmit={onSubmit}
              scenario={scenario}
            />
          ) : null}
          {activeScreen === "projects" ? (
            <ProjectsWorkspaceScreen
              mode={mode}
              onSelectStep={onSelectProjectStep}
              scenario={scenario}
              selectedStepIndex={selectedProjectStepIndex}
            />
          ) : null}
          {activeScreen === "documents" ? (
            <DocumentsScreen
              documentContextSelection={documentContextSelection}
              documentFilter={documentFilter}
              mode={mode}
              onDocumentFilterChange={onDocumentFilterChange}
              onSelectDocument={onSelectDocument}
              onToggleDocumentContext={onToggleDocumentContext}
              selectedDocumentIndex={selectedDocumentIndex}
            />
          ) : null}
          {activeScreen === "profile" ? <ProfileWorkspaceScreen /> : null}
        </div>
      </div>
    </section>
  );
}

function App() {
  const [mode, setMode] = useState<ProjectMode>("buyer");
  const [activeAction, setActiveAction] = useState<ActionCard["id"]>("buyer");
  const [activeScreen, setActiveScreen] = useState<AppScreen>("home");
  const [selectedListingIndex, setSelectedListingIndex] = useState(0);
  const [selectedProjectStepIndex, setSelectedProjectStepIndex] = useState(0);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);
  const [documentFilter, setDocumentFilter] = useState<"all" | "action" | "rag">("all");
  const [documentContextSelection, setDocumentContextSelection] = useState<Record<ProjectMode, string[]>>({
    buyer: ["Piece d'identite", "Simulation bancaire"],
    seller: ["Titre de propriete"],
  });
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
    setSelectedListingIndex(0);
    setSelectedProjectStepIndex(0);
    setSelectedDocumentIndex(0);
    setDocumentFilter("all");
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
      setSelectedListingIndex(0);
      setSelectedProjectStepIndex(0);
      setSelectedDocumentIndex(0);
      setDocumentFilter("all");
      setAssistantDraft(scenarios.buyer.assistantPrompts[0]);
      return;
    }

    if (id === "seller") {
      setMode("seller");
      setSelectedListingIndex(0);
      setSelectedProjectStepIndex(0);
      setSelectedDocumentIndex(0);
      setDocumentFilter("all");
      setAssistantDraft(scenarios.seller.assistantPrompts[0]);
      return;
    }

    setMode("seller");
    setSelectedListingIndex(0);
    setSelectedProjectStepIndex(0);
    setSelectedDocumentIndex(0);
    setDocumentFilter("all");
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

  const handleDocumentFilterChange = (nextFilter: "all" | "action" | "rag") => {
    setDocumentFilter(nextFilter);
    setSelectedDocumentIndex(0);
  };

  const handleToggleDocumentContext = (label: string) => {
    setDocumentContextSelection((current) => {
      const currentSelection = current[mode];
      const nextSelection = currentSelection.includes(label)
        ? currentSelection.filter((item) => item !== label)
        : [...currentSelection, label];

      return {
        ...current,
        [mode]: nextSelection,
      };
    });
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

    if (activeScreen === "documents") {
      return (
        <DocumentsScreen
          documentContextSelection={documentContextSelection[mode]}
          documentFilter={documentFilter}
          mode={mode}
          onDocumentFilterChange={handleDocumentFilterChange}
          onSelectDocument={setSelectedDocumentIndex}
          onToggleDocumentContext={handleToggleDocumentContext}
          selectedDocumentIndex={selectedDocumentIndex}
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
        <WebPlatformShell
          activeScreen={activeScreen}
          documentContextSelection={documentContextSelection[mode]}
          documentFilter={documentFilter}
          draft={assistantDraft}
          error={assistantError}
          isLoading={assistantLoading}
          messages={assistantThreads[mode]}
          mode={mode}
          onDraftChange={setAssistantDraft}
          onDocumentFilterChange={handleDocumentFilterChange}
          onModeChange={handleModeChange}
          onNavigate={setActiveScreen}
          onPromptClick={setAssistantDraft}
          onSelectDocument={setSelectedDocumentIndex}
          onSelectProjectStep={setSelectedProjectStepIndex}
          onSelectListing={setSelectedListingIndex}
          onToggleDocumentContext={handleToggleDocumentContext}
          onSubmit={handleAssistantSubmit}
          scenario={scenario}
          selectedDocumentIndex={selectedDocumentIndex}
          selectedListingIndex={selectedListingIndex}
          selectedProjectStepIndex={selectedProjectStepIndex}
        />

        <aside className="mobile-preview" aria-label="Apercu mobile">
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
                <PrototypeToolbar activeScreen={activeScreen} onChange={handleVariantChange} variants={screenVariants} />
                {renderScreen()}
              </div>

              <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default App;
