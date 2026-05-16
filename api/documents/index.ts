import { getDocumentsPayload } from "../_lib/domain";
import { json, methodNotAllowed } from "../_lib/http";
import { createSupabaseServerClient, getSupabaseRuntimeConfig } from "../_lib/supabase";
import { scenarios, type ProjectMode } from "../../src/data/content";

function mapDocumentRow(row: {
  label: string;
  status: string;
  source: string;
  owner_label: string | null;
  rag_status: "indexed" | "ready" | "missing";
  chunk_count: number | null;
  updated_at: string | null;
  summary: string | null;
  next_action: string | null;
  notes: unknown;
}) {
  return {
    label: row.label,
    status: row.status,
    tone: row.status === "Disponible" ? ("mint" as const) : ("dark" as const),
    source: row.source,
    owner: row.owner_label || "Utilisateur",
    ragStatus: row.rag_status,
    chunkCount: row.chunk_count || 0,
    lastUpdated: row.updated_at || "N/A",
    summary: row.summary || "",
    nextAction: row.next_action || "",
    notes: Array.isArray(row.notes) ? row.notes.filter((note): note is string => typeof note === "string") : [],
  };
}

export const config = {
  runtime: "nodejs",
};

export default async function handler(request: Request) {
  if (request.method === "GET") {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") === "seller" ? "seller" : "buyer";

    if (!getSupabaseRuntimeConfig().isConfigured) {
      return json({
        ok: true,
        data: getDocumentsPayload(mode),
      });
    }

    try {
      const supabase = createSupabaseServerClient();
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id")
        .eq("mode", mode)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (projectError) {
        throw projectError;
      }

      if (!project) {
        return json({
          ok: true,
          data: getDocumentsPayload(mode),
        });
      }

      const { data: rows, error: rowsError } = await supabase
        .from("documents")
        .select("label, status, source, owner_label, rag_status, chunk_count, updated_at, summary, next_action, notes")
        .eq("project_id", project.id)
        .order("updated_at", { ascending: false });

      if (rowsError) {
        throw rowsError;
      }

      const items = (rows || []).map(mapDocumentRow);

      return json({
        ok: true,
        data: {
          mode,
          projectId: project.id,
          summary: {
            available: items.filter((row) => row.status === "Disponible").length,
            pending: items.filter((row) => row.status !== "Disponible").length,
            ragReady: items.filter((row) => row.ragStatus !== "missing").length,
          },
          items,
        },
      });
    } catch (error) {
      return json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Erreur lors de la lecture des documents depuis Supabase.",
        },
        { status: 500 },
      );
    }
  }

  if (request.method === "POST") {
    const body = (await request.json()) as {
      mode?: ProjectMode;
      projectId?: string | null;
      label?: string;
      source?: string;
      owner?: string;
      summary?: string;
      nextAction?: string;
      notes?: string[];
      storagePath?: string;
    };
    const mode = body.mode === "seller" ? "seller" : "buyer";

    if (!body.label || !body.source) {
      return json({ error: "label et source sont requis." }, { status: 400 });
    }

    if (!getSupabaseRuntimeConfig().isConfigured) {
      const base = getDocumentsPayload(mode);
      const mockItem = {
        label: body.label,
        status: "Disponible",
        tone: "mint" as const,
        source: body.source,
        owner: body.owner || "Utilisateur",
        ragStatus: "ready" as const,
        chunkCount: 0,
        lastUpdated: "Maintenant",
        summary: body.summary || "Document ajoute localement en mode prototype.",
        nextAction: body.nextAction || "Indexer le document pour l'IA.",
        notes: body.notes || ["Ajout local non persistant"],
      };

      return json({
        ok: true,
        data: {
          ...base,
          items: [mockItem, ...base.items],
          summary: {
            available: base.summary.available + 1,
            pending: base.summary.pending,
            ragReady: base.summary.ragReady + 1,
          },
        },
      });
    }

    try {
      const supabase = createSupabaseServerClient();
      let projectId = body.projectId || null;

      if (!projectId) {
        const { data: project } = await supabase
          .from("projects")
          .select("id")
          .eq("mode", mode)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        projectId = project?.id || null;
      }

      if (!projectId) {
        const { data: createdProject, error: createProjectError } = await supabase
          .from("projects")
          .insert({
            mode,
            title: mode === "buyer" ? "Projet acheteur CoachImmoIA" : "Projet vendeur CoachImmoIA",
            status: "active",
            checklist: scenarios[mode].checklist,
          })
          .select("id")
          .single();

        if (createProjectError) {
          throw createProjectError;
        }

        projectId = createdProject.id;
      }

      const { error: insertError } = await supabase.from("documents").insert({
        project_id: projectId,
        label: body.label,
        source: body.source,
        owner_label: body.owner || "Utilisateur",
        status: "Disponible",
        rag_status: "ready",
        chunk_count: 0,
        storage_path: body.storagePath || null,
        summary: body.summary || "Document ajoute depuis l'interface.",
        next_action: body.nextAction || "Indexer ce document pour l'assistant.",
        notes: body.notes || [],
      });

      if (insertError) {
        throw insertError;
      }

      const { data: refreshRows, error: refreshError } = await supabase
        .from("documents")
        .select("label, status, source, owner_label, rag_status, chunk_count, updated_at, summary, next_action, notes")
        .eq("project_id", projectId)
        .order("updated_at", { ascending: false });

      if (refreshError) {
        throw refreshError;
      }

      const items = (refreshRows || []).map(mapDocumentRow);

      return json({
        ok: true,
        data: {
          mode,
          projectId,
          summary: {
            available: items.filter((row) => row.status === "Disponible").length,
            pending: items.filter((row) => row.status !== "Disponible").length,
            ragReady: items.filter((row) => row.ragStatus !== "missing").length,
          },
          items,
        },
      });
    } catch (error) {
      return json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Erreur lors de la creation du document dans Supabase.",
        },
        { status: 500 },
      );
    }
  }

  return methodNotAllowed(["GET", "POST"]);
}
