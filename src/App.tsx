import { useEffect, useState } from "react";
import {
  scenarios,
  type ActionCard,
  type AppScreen,
  type ProjectMode,
} from "./data/content";
import {
  getAssistantRuntime,
  type AssistantProvider,
  type AssistantMessage,
} from "./lib/assistant";
import {
  createDocument,
  createProject,
  createSocialThread,
  fetchDocuments,
  fetchProjects,
  fetchSocial,
  indexDocument,
  type DocumentsResponse,
  type ProjectsResponse,
  type RagContextResponse,
  type SocialResponse,
} from "./services/api";
import { runCoachImmoAgent } from "./services/agent";
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
} from "./features/app/types";
import { MobilePreviewShell } from "./features/mobile/components/mobile-screens";
import { WebPlatformShell } from "./features/platform/components/web-shell";

type ModeRecord<T> = Record<ProjectMode, T>;

function App() {
  const [assistantProvider, setAssistantProvider] = useState<AssistantProvider>(() => {
    const storedProvider = window.localStorage.getItem("coachimmoia:assistant-provider");
    return storedProvider === "mistral" || storedProvider === "google"
      ? storedProvider
      : getAssistantRuntime().provider;
  });
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
    buyer: ["Pièce d'identité", "Simulation bancaire"],
    seller: ["Titre de propriété"],
  });
  const [assistantDraft, setAssistantDraft] = useState("");
  const [assistantThreads, setAssistantThreads] = useState<AssistantThread>({
    buyer: [],
    seller: [],
  });
  const [assistantError, setAssistantError] = useState<string | null>(null);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const screenVariants = defaultScreenVariants;
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
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const authConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  );
  const scenario = scenarios[mode];

  const resetModeScopedState = () => {
    setSelectedListingIndex(0);
    setSelectedProjectStepIndex(0);
    setSelectedDocumentIndex(0);
    setSelectedSocialCircleIndex(0);
    setSelectedSocialThreadIndex(0);
    setDocumentFilter("all");
    setAssistantDraft("");
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
      console.error("Erreur de rafraîchissement des données", error);
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
    resetModeScopedState();

    if (activeAction !== "estimate") {
      setActiveAction(nextMode);
    }
  };

  const handleActionChange = (id: ActionCard["id"]) => {
    setAssistantError(null);
    setActiveAction(id);

    if (id === "buyer") {
      setMode("buyer");
      resetModeScopedState();
      return;
    }

    if (id === "seller") {
      setMode("seller");
      resetModeScopedState();
      return;
    }

    setMode("seller");
    resetModeScopedState();
    setAssistantDraft("J'aimerais estimer mon bien avant de choisir une stratégie de vente.");
  };

  const handlePrimaryAction = () => {
    if (activeAction === "estimate") {
      setActiveScreen("assistant");
      return;
    }

    setActiveScreen("projects");
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
    setAssistantError(null);
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
      setSelectedProjectStepIndex(0);
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
    setAssistantError(null);
    setDocumentBusy(true);
    try {
      let extractionWarning: string | null = null;
      let extractedPdf:
        | {
            summary: string;
            chunks: string[];
            notes: string[];
          }
        | null = null;

      if (file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
        try {
          const { extractPdfKnowledge } = await import("./services/documents/pdf");
          const extraction = await extractPdfKnowledge(file);
          extractedPdf = {
            summary: extraction.summary,
            chunks: extraction.chunks,
            notes: extraction.notes,
          };
        } catch (error) {
          extractionWarning =
            error instanceof Error ? error.message : "Extraction PDF impossible pour ce document.";
        }
      }

      const storagePath =
        file && authConfigured && sessionEmail ? await uploadProjectDocument(file) : undefined;
      const createdDocumentResponse = await createDocument({
        mode,
        projectId: projectsData[mode]?.projectId || null,
        label,
        source,
        summary: summary.trim() || extractedPdf?.summary || "",
        notes: extractedPdf?.notes,
        nextAction: extractedPdf
          ? "Vérifier les extraits indexés et poser une question à l'assistant."
          : undefined,
        storagePath,
      });

      const finalResponse =
        extractedPdf && extractedPdf.chunks.length > 0
          ? await indexDocument({
              mode,
              projectId: createdDocumentResponse.data.projectId || projectsData[mode]?.projectId || null,
              label,
              chunks: extractedPdf.chunks,
              summary: summary.trim() || extractedPdf.summary,
            })
          : createdDocumentResponse;

      setDocumentsData((current) => ({
        ...current,
        [mode]: finalResponse.data,
      }));
      setDocumentContextSelection((current) => ({
        ...current,
        [mode]: current[mode].includes(label) ? current[mode] : [...current[mode], label],
      }));

      if (extractionWarning) {
        setAssistantError(
          `Document ajoute, mais ${extractionWarning}`,
        );
      }
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : "Ajout du document impossible.");
    } finally {
      setDocumentBusy(false);
    }
  };

  const handleIndexDocument = async (label: string) => {
    setAssistantError(null);
    setDocumentBusy(true);
    try {
      const document = documentsData[mode]?.items.find((item) => item.label === label);
      const chunks = [document?.summary, ...(document?.notes || [])].filter(Boolean) as string[];

      const response = await indexDocument({
        mode,
        projectId: documentsData[mode]?.projectId || projectsData[mode]?.projectId || null,
        label,
        chunks: chunks.length > 0 ? chunks : [`Document ${label} indexé depuis CoachImmoIA.`],
        summary: document?.summary,
      });

      setDocumentsData((current) => ({
        ...current,
        [mode]: response.data,
      }));
      setDocumentContextSelection((current) => ({
        ...current,
        [mode]: current[mode].includes(label) ? current[mode] : [...current[mode], label],
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
    setAssistantError(null);
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
    setAuthNotice(null);
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
    setAuthNotice(null);
    try {
      const { session, user } = await signUpWithPassword(email, password);

      if (session) {
        setSessionEmail(session.user.email || email);
      } else if (user) {
        setAuthNotice("Compte créé. Consultez votre e-mail pour confirmer votre inscription.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Création de compte impossible.";
      setAuthError(
        message === "Failed to fetch"
          ? "Le service d’authentification est momentanément inaccessible. Réessayez dans quelques instants."
          : message.toLowerCase().includes("email rate limit")
            ? "Compte non créé : la limite d’e-mails a été atteinte et aucun message ne vous a été envoyé. Réessayez plus tard."
          : message,
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    setAuthError(null);
    setAuthNotice(null);
    try {
      await signOut();
      setSessionEmail(null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Déconnexion impossible.");
    } finally {
      setAuthLoading(false);
    }
  };

  const submitAssistantMessage = async (content: string, provider: AssistantProvider) => {
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
      const agentResult = await runCoachImmoAgent({
        mode,
        provider,
        query: content,
        messages: nextThread,
        contextLabels: documentContextSelection[mode],
      });

      setAssistantSources((current) => ({
        ...current,
        [mode]: agentResult.sources,
      }));

      setAssistantThreads((current) => ({
        ...current,
        [mode]: [
          ...current[mode],
          {
            role: "assistant",
            content: agentResult.reply,
            provider,
            model: agentResult.model || getAssistantRuntime(provider).model,
            sourcePrompt: content,
          },
        ],
      }));
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? error.message : "Connexion au modèle impossible pour le moment.";

      setAssistantError(fallbackMessage);
      setAssistantDraft(content);
      setAssistantThreads((current) => ({
        ...current,
        [mode]: previousThread,
      }));
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleAssistantSubmit = async () => {
    await submitAssistantMessage(assistantDraft.trim(), assistantProvider);
  };

  const handleAssistantProviderChange = (provider: AssistantProvider) => {
    setAssistantProvider(provider);
    setAssistantError(null);
    window.localStorage.setItem("coachimmoia:assistant-provider", provider);
  };

  const handleCompareResponse = (message: AssistantMessage, provider: AssistantProvider) => {
    if (!message.sourcePrompt || assistantLoading) {
      return;
    }

    handleAssistantProviderChange(provider);
    void submitAssistantMessage(message.sourcePrompt, provider);
  };

  return (
    <main className="app-stage">
      <div className="app-glow app-glow--left" />
      <div className="app-glow app-glow--right" />

      <div className="app-stage__layout">
        <WebPlatformShell
          activeAction={activeAction}
          activeScreen={activeScreen}
          assistantSources={assistantSources[mode]}
          assistantProvider={assistantProvider}
          authConfigured={authConfigured}
          authError={authError}
          authNotice={authNotice}
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
          onActionChange={handleActionChange}
          onAssistantProviderChange={handleAssistantProviderChange}
          onCompareResponse={handleCompareResponse}
          onCreateDocument={handleCreateDocument}
          onCreateProject={handleCreateProject}
          onCreateSocialThread={handleCreateSocialThread}
          onDraftChange={setAssistantDraft}
          onDocumentFilterChange={handleDocumentFilterChange}
          onIndexDocument={handleIndexDocument}
          onModeChange={handleModeChange}
          onNavigate={setActiveScreen}
          onPrimaryAction={handlePrimaryAction}
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
          assistantProvider={assistantProvider}
          authConfigured={authConfigured}
          authError={authError}
          authLoading={authLoading}
          authNotice={authNotice}
          draft={assistantDraft}
          error={assistantError}
          isLoading={assistantLoading}
          messages={assistantThreads[mode]}
          mode={mode}
          onActionChange={handleActionChange}
          onAssistantProviderChange={handleAssistantProviderChange}
          onCompareResponse={handleCompareResponse}
          onDraftChange={setAssistantDraft}
          onModeChange={handleModeChange}
          onNavigate={setActiveScreen}
          onPrimaryAction={handlePrimaryAction}
          onPromptClick={setAssistantDraft}
          onSelectSocialCircle={handleSocialCircleSelect}
          onSelectSocialThread={setSelectedSocialThreadIndex}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          onSignUp={handleSignUp}
          onSubmit={handleAssistantSubmit}
          scenario={scenario}
          screenVariants={screenVariants}
          selectedSocialCircleIndex={selectedSocialCircleIndex}
          selectedSocialThreadIndex={selectedSocialThreadIndex}
          sessionEmail={sessionEmail}
        />
      </div>
    </main>
  );
}

export default App;
