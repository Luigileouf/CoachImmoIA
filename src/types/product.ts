export type ProjectMode = "buyer" | "seller";

export type AppScreen =
  | "home"
  | "listings"
  | "assistant"
  | "projects"
  | "documents"
  | "social"
  | "profile";

export type ActionCard = {
  id: "buyer" | "seller" | "estimate";
  title: string;
  description: string;
  icon: "home" | "key" | "chart";
  scene: "house" | "living" | "building";
};

export type Metric = {
  label: string;
  value: string;
};

export type ListingItem = {
  title: string;
  location: string;
  price: string;
  badge: string;
  detail: string;
  scene: ActionCard["scene"];
};

export type AssistantConversationMessage = {
  from: "assistant" | "user";
  text: string;
};

export type ProjectStep = {
  title: string;
  detail: string;
  status: "done" | "active" | "next";
};

export type ProfileSection = {
  title: string;
  items: Array<{
    label: string;
    value: string;
  }>;
};

export type SocialCircle = {
  id: string;
  title: string;
  audience: string;
  description: string;
  members: string;
  activity: string;
  trust: string;
  prompt: string;
  tags: string[];
};

export type SocialThread = {
  id: string;
  circleId: string;
  title: string;
  author: string;
  role: string;
  trust: string;
  excerpt: string;
  replies: string;
  lastActivity: string;
  aiSummary: string;
  projectLink: string;
  actionLabel: string;
};

export type SocialHighlight = {
  eyebrow: string;
  title: string;
  summary: string;
  cta: string;
  secondaryCta: string;
  trustSignals: string[];
};

export type Scenario = {
  greeting: string;
  title: string;
  accent: string;
  intro: string;
  introHighlight: string;
  cta: string;
  projectStatus: string;
  projectNote: string;
  checklist: string[];
  coachHint: string;
  assistantIntro: string;
  assistantPrompts: string[];
  listingsTitle: string;
  listingsSubtitle: string;
  listingFilters: string[];
  stats: Metric[];
  projectDocuments: string[];
};
