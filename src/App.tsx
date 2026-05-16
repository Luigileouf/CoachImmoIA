import { useEffect, useState } from "react";
import {
  assistantConversations,
  scenarios,
  type ActionCard,
  type AppScreen,
  type ProjectMode,
} from "./data/content";
import {
  sendAssistantMessage,
  type AssistantMessage,
} from "./lib/assistant";
import {
  createDocument,
  createProject,
  createSocialThread,
  fetchDocuments,
  fetchProjects,
  fetchRagContext,
  fetchSocial,
  indexDocument,
  type DocumentsResponse,
  type ProjectsResponse,
  type RagContextResponse,
  type SocialResponse,
} from "./services/api";
import {
  getCurrentSession,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  subscribeToAuthChanges,
} from "./services/auth/client";
import { uploadProjectDocument } from "./services/supabase/storage";
import {
  defaultScreenVariants,
  type AssistantThread,
  type DocumentFilter,
  type ScreenVariantState,
} from "./features/app/types";
import { MobilePreviewShell } from "./features/mobile/components/mobile-screens";
import { WebPlatformShell } from "./features/platform/components/web-shell";

type ModeRecord<T> = Record<ProjectMode, T>;

function App() {
  const [mode, setMode] = useState<ProjectMode>("buyer");
  const [activeAction, setActiveAction] = useState<ActionCard["id"]>("buyer");
  const [activeScreen, setActiveScreen] = useState<AppScreen>("home");
  const [selectedListingIndex, setSelectedListingIndex] = useState(0);
  const [selectedProjectStepIndex, setSelectedProjectStepIndex] = useState(0);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);
  const [selectedSocialCircleIndex, setSelectedSocialCircleIndex] = useState(0);
  const [selectedSocialThreadIndex, setSelectedSocialThreadIndex] = useState(0);
  const [documentFilter, setDocumentFilter] = useState<DocumentFilter>("all");
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
  const [screenVariants, setScreenVariants] = useState<ScreenVariantState>(defaultScreenVariants);
  const [projectsData, setProjectsData] = useState<ModeRecord<ProjectsResponse | null>>({
    buyer: null,
    seller: null,
  });
  const [documentsData, setDocumentsData] = useState<ModeRecord<DocumentsResponse | null>>({
    buyer: null,
    seller: null,
  });
  const [socialData, setSocialData] = useState<ModeRecord<SocialResponse | null>>({
    buyer: null,
    seller: null,
  });
  const [assistantSources, setAssistantSources] = useState<ModeRecord<RagContextResponse["sources"]>>({
    buyer: [],
    seller: [],
  });
  const [projectBusy, setProjectBusy] = useState(false);
  const [documentBusy, setDocumentBusy] = useState(false);
  const [socialBusy, setSocialBusy] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const authConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  );
  const scenario = scenarios[mode];

  const resetModeScopedState = (nextMode: ProjectMode) => {
    setSelectedListingIndex(0);
    setSelectedProjectStepIndex(0);
    setSelectedDocumentIndex(0);
    setSelectedSocialCircleIndex(0);
    setSelectedSocialThreadIndex(0);
    setDocumentFilter("all");
    setAssistantDraft(scenarios[nextMode].assistantPrompts[0]);
    setAssistantError(null);
  };

  const refreshModeData = async (targetMode: ProjectMode) => {
    try {
      const [projectsResult, documentsResult, socialResult] = await Promise.all([
        fetchProjects(targetMode),
        fetchDocuments(targetMode),
        fetchSocial(targetMode),
      ]);

      setProjectsData((current) => ({
        ...current,
        [targetMode]: projectsResult.data,
      }));
      setDocumentsData((current) => ({
        ...current,
        [targetMode]: documentsResult.data,
      }));
      setSocialData((current) => ({
        ...current,
        [targetMode]: socialResult.data,
      }));
    } catch (error) {
      console.error("Erreur de rafraichissement des donnees", error);
    }
  };

  useEffect(() => {
    void refreshModeData(mode);
  }, [mode]);

  useEffect(() => {
    if (!authConfigured) {
      return;
    }

    let unsubscribe: () => void = () => {};

    const bootstrapAuth = async () => {
      try {
        const session = await getCurrentSession();
        setSessionEmail(session?.user.email || null);
      } catch (error) {
        console.error("Erreur auth initiale", error);
      }

      unsubscribe = subscribeToAuthChanges((session) => {
        setSessionEmail(session?.user.email || null);
      });
    };

    void bootstrapAuth();

    return () => {
      unsubscribe();
    };
  }, [authConfigured]);

  const handleModeChange = (nextMode: ProjectMode) => {
    setMode(nextMode);
    resetModeScopedState(nextMode);

    if (activeAction !== "estimate") {
      setActiveAction(nextMode);
    }
  };

  const handleActionChange = (id: ActionCard["id"]) => {
    setAssistantError(null);
    setActiveAction(id);

    if (id === "buyer") {
      setMode("buyer");
      resetModeScopedState("buyer");
      return;
    }

    if (id === "seller") {
      setMode("seller");
      resetModeScopedState("seller");
      return;
    }

    setMode("seller");
    resetModeScopedState("seller");
    setAssistantDraft("J'aimerais estimer mon bien avant de choisir une strategie de vente.");
  };

  const handlePrimaryAction = () => {
    if (activeAction === "estimate") {
      setActiveScreen("assistant");
      return;
    }

    setActiveScreen("projects");
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

  const handleDocumentFilterChange = (nextFilter: DocumentFilter) => {
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

  const handleSocialCircleSelect = (index: number) => {
    setSelectedSocialCircleIndex(index);
    setSelectedSocialThreadIndex(0);
  };

  const handleCreateProject = async () => {
    setProjectBusy(true);
    try {
      const response = await createProject({
        mode,
        title: mode === "buyer" ? "Projet acheteur CoachImmoIA" : "Projet vendeur CoachImmoIA",
      });

      setProjectsData((current) => ({
        ...current,
        [mode]: response.data,
      }));
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : "Creation du projet impossible.");
    } finally {
      setProjectBusy(false);
    }
  };

  const handleCreateDocument = async ({
    label,
    summary,
    source,
    file,
  }: {
    label: string;
    summary: string;
    source: string;
    file?: File | null;
  }) => {
    setDocumentBusy(true);
    try {
      const storagePath =
        file && authConfigured ? await uploadProjectDocument(file) : undefined;
      const response = await createDocument({
        mode,
        projectId: projectsData[mode]?.projectId || null,
        label,
        source,
        summary,
        storagePath,
      });

      setDocumentsData((current) => ({
        ...current,
        [mode]: response.data,
      }));
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : "Ajout du document impossible.");
    } finally {
      setDocumentBusy(false);
    }
  };

  const handleIndexDocument = async (label: string) => {
    setDocumentBusy(true);
    try {
      const document = documentsData[mode]?.items.find((item) => item.label === label);
      const chunks = [document?.summary, ...(document?.notes || [])].filter(Boolean) as string[];

      const response = await indexDocument({
        mode,
        projectId: documentsData[mode]?.projectId || projectsData[mode]?.projectId || null,
        label,
        chunks: chunks.length > 0 ? chunks : [`Document ${label} indexe depuis CoachImmoIA.`],
        summary: document?.summary,
      });

      setDocumentsData((current) => ({
        ...current,
        [mode]: response.data,
      }));
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : "Indexation impossible.");
    } finally {
      setDocumentBusy(false);
    }
  };

  const handleCreateSocialThread = async ({
    circleId,
    title,
    body,
  }: {
    circleId: string;
    title: string;
    body: string;
  }) => {
    setSocialBusy(true);
    try {
      const response = await createSocialThread({
        mode,
        circleId,
        title,
        body,
        author: sessionEmail || "Vous",
      });

      setSocialData((current) => ({
        ...current,
        [mode]: response.data,
      }));
      setSelectedSocialThreadIndex(0);
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : "Publication impossible.");
    } finally {
      setSocialBusy(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const session = await signInWithPassword(email, password);
      setSessionEmail(session?.user.email || null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Connexion impossible.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const session = await signUpWithPassword(email, password);
      setSessionEmail(session?.user.email || email);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Creation de compte impossible.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signOut();
      setSessionEmail(null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Deconnexion impossible.");
    } finally {
      setAuthLoading(false);
    }
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
      const rag = await fetchRagContext({
        mode,
        query: content,
        labels: documentContextSelection[mode],
      });

      setAssistantSources((current) => ({
        ...current,
        [mode]: rag.data.sources,
      }));

      const response = await sendAssistantMessage({
        mode,
        messages: nextThread,
        contextSnippets: rag.data.sources.map(
          (source) => `${source.label} (${source.source}) : ${source.summary || source.excerpt}`,
        ),
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

  return (
    <main className="app-stage">
      <div className="app-glow app-glow--left" />
      <div className="app-glow app-glow--right" />

      <div className="app-stage__layout">
        <WebPlatformShell
          activeScreen={activeScreen}
          assistantSources={assistantSources[mode]}
          authConfigured={authConfigured}
          authError={authError}
          authLoading={authLoading}
          documentBusy={documentBusy}
          documentContextSelection={documentContextSelection[mode]}
          documentFilter={documentFilter}
          documentsData={documentsData[mode]}
          draft={assistantDraft}
          error={assistantError}
          isLoading={assistantLoading}
          messages={assistantThreads[mode]}
          mode={mode}
          onCreateDocument={handleCreateDocument}
          onCreateProject={handleCreateProject}
          onCreateSocialThread={handleCreateSocialThread}
          onDraftChange={setAssistantDraft}
          onDocumentFilterChange={handleDocumentFilterChange}
          onIndexDocument={handleIndexDocument}
          onModeChange={handleModeChange}
          onNavigate={setActiveScreen}
          onPromptClick={setAssistantDraft}
          onSelectDocument={setSelectedDocumentIndex}
          onSelectSocialCircle={handleSocialCircleSelect}
          onSelectSocialThread={setSelectedSocialThreadIndex}
          onSelectProjectStep={setSelectedProjectStepIndex}
          onSelectListing={setSelectedListingIndex}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          onSignUp={handleSignUp}
          onToggleDocumentContext={handleToggleDocumentContext}
          onSubmit={handleAssistantSubmit}
          projectBusy={projectBusy}
          projectsData={projectsData[mode]}
          scenario={scenario}
          selectedDocumentIndex={selectedDocumentIndex}
          selectedListingIndex={selectedListingIndex}
          selectedProjectStepIndex={selectedProjectStepIndex}
          selectedSocialCircleIndex={selectedSocialCircleIndex}
          selectedSocialThreadIndex={selectedSocialThreadIndex}
          sessionEmail={sessionEmail}
          socialBusy={socialBusy}
          socialData={socialData[mode]}
        />

        <MobilePreviewShell
          activeAction={activeAction}
          activeScreen={activeScreen}
          draft={assistantDraft}
          error={assistantError}
          isLoading={assistantLoading}
          messages={assistantThreads[mode]}
          mode={mode}
          onActionChange={handleActionChange}
          onDraftChange={setAssistantDraft}
          onModeChange={handleModeChange}
          onNavigate={setActiveScreen}
          onPrimaryAction={handlePrimaryAction}
          onPromptClick={setAssistantDraft}
          onSelectSocialCircle={handleSocialCircleSelect}
          onSelectSocialThread={setSelectedSocialThreadIndex}
          onSubmit={handleAssistantSubmit}
          onVariantChange={handleVariantChange}
          scenario={scenario}
          screenVariants={screenVariants}
          selectedSocialCircleIndex={selectedSocialCircleIndex}
          selectedSocialThreadIndex={selectedSocialThreadIndex}
        />
      </div>
    </main>
  );
}

export default App;
