import type { ReactNode } from "react";
import type { ActionCard, ProjectMode } from "../../../types/product";
import type { AssistantMessage, AssistantProvider } from "../../../lib/assistant";
import { listingFeeds } from "../../../data/content";

export function LogoMark() {
  return (
    <svg aria-hidden="true" className="logo-mark" viewBox="0 0 32 32">
      <rect x="4" y="6" width="9" height="15" rx="4" transform="rotate(-45 4 6)" />
      <rect x="16" y="5" width="9" height="15" rx="4" transform="rotate(45 16 5)" />
      <path d="M10 16.5 16 11l6 5.5v5a2 2 0 0 1-2 2h-2.7v-4.8h-2.6v4.8H12a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function BellIcon() {
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

export function ArrowIcon() {
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

export function SparkleIcon() {
  return (
    <svg aria-hidden="true" className="mini-icon" viewBox="0 0 24 24">
      <path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z" />
      <path d="M18.5 2 19.4 4.6 22 5.5l-2.6.9-.9 2.6-.9-2.6L15 5.5l2.6-.9Z" />
    </svg>
  );
}

export function HomeGlyph() {
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

export function KeyGlyph() {
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

export function ChartGlyph() {
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

export function GridIcon() {
  return (
    <svg aria-hidden="true" className="nav-icon-svg" viewBox="0 0 24 24">
      <rect x="5" y="5" width="5" height="5" rx="1.6" />
      <rect x="14" y="5" width="5" height="5" rx="1.6" />
      <rect x="5" y="14" width="5" height="5" rx="1.6" />
      <rect x="14" y="14" width="5" height="5" rx="1.6" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg aria-hidden="true" className="nav-icon-svg" viewBox="0 0 24 24">
      <path d="M5 6.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H11l-4.5 3v-3H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg aria-hidden="true" className="nav-icon-svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.7 12.5 2.1 2.1 4.5-4.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg aria-hidden="true" className="nav-icon-svg" viewBox="0 0 24 24">
      <circle cx="12" cy="8.3" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function DocumentIcon() {
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

export function SocialIcon() {
  return (
    <svg aria-hidden="true" className="nav-icon-svg" viewBox="0 0 24 24">
      <path d="M7.5 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M16.8 11.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
      <path
        d="M3.8 18.8a4.7 4.7 0 0 1 7.4-3.8M13.3 18.8a3.8 3.8 0 0 1 6.2-2.9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function highlightText(text: string, highlight: string) {
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

export function ModeTabs({
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

export function AppTopBar({ subtitle }: { subtitle: string }) {
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

export function AssistantVisual() {
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

export function EmptyStateVisual({
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

export function SceneArtwork({ scene }: Pick<ActionCard, "scene">) {
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

export function HomeActionCard({
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

export function ListingCard({
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

export function AssistantThreadBubble({
  message,
  onCompare,
}: {
  message: AssistantMessage;
  onCompare?: (message: AssistantMessage, provider: AssistantProvider) => void;
}) {
  const alternativeProvider = message.provider === "mistral" ? "google" : "mistral";
  const providerLabel = message.provider === "google" ? "Gemma" : message.provider === "mistral" ? "Mistral" : null;
  const contentLines = message.content.split("\n").filter((line) => line.trim());

  const renderLine = (line: string, index: number) => {
    const cleanLine = line
      .replace(/^#{1,6}\s+/, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .trim();

    if (!cleanLine || cleanLine === "---") {
      return null;
    }

    if (/^#{1,6}\s+/.test(line)) {
      return <strong className="message-bubble__heading" key={`${cleanLine}-${index}`}>{cleanLine}</strong>;
    }

    if (/^[-✅❌]\s*/.test(cleanLine)) {
      return <span className="message-bubble__list-item" key={`${cleanLine}-${index}`}>{cleanLine.replace(/^[-✅❌]\s*/, "")}</span>;
    }

    return <p key={`${cleanLine}-${index}`}>{cleanLine}</p>;
  };

  return (
    <div className={message.role === "assistant" ? "message-bubble is-assistant" : "message-bubble is-user"}>
      {providerLabel ? <span className="message-bubble__provider">{providerLabel}</span> : null}
      <div className="message-bubble__content">{contentLines.map(renderLine)}</div>
      {message.role === "assistant" && message.sourcePrompt && message.provider && onCompare ? (
        <button
          className="message-bubble__compare"
          onClick={() => onCompare(message, alternativeProvider)}
          type="button"
        >
          Tester avec {alternativeProvider === "google" ? "Gemma" : "Mistral"}
        </button>
      ) : null}
    </div>
  );
}

export function VariantSwitcher({
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

export type NavItem = {
  key: string;
  label: string;
  icon: ReactNode;
};
