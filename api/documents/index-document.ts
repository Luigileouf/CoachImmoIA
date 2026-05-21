import { getDocumentsPayload } from "../_lib/domain.js";
import { json, methodNotAllowed } from "../_lib/http.js";
import { createSupabaseServerClient, getSupabaseRuntimeConfig } from "../_lib/supabase.js";
import type { ProjectMode } from "../../src/data/content.js";

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
  if (request.method !== "POST") {
    return methodNotAllowed(["POST"]);
  }

  const body = (await request.json()) as {
    mode?: ProjectMode;
    projectId?: string | null;
    label?: string;
    chunks?: string[];
    summary?: string;
  };
  const mode = body.mode === "seller" ? "seller" : "buyer";

  if (!body.label || !body.chunks || body.chunks.length === 0) {
    return json({ error: "label et chunks sont requis." }, { status: 400 });
  }

  if (!getSupabaseRuntimeConfig().isConfigured) {
    return json({
      ok: true,
      data: getDocumentsPayload(mode),
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
      return json({ error: "Aucun projet disponible pour indexer ce document." }, { status: 400 });
    }

    const { data: documentRow, error: documentError } = await supabase
      .from("documents")
      .select("id")
      .eq("project_id", projectId)
      .eq("label", body.label)
      .limit(1)
      .maybeSingle();

    if (documentError) {
      throw documentError;
    }

    if (!documentRow) {
      return json({ error: "Document introuvable." }, { status: 404 });
    }

    await supabase.from("document_chunks").delete().eq("document_id", documentRow.id);

    const { error: chunkError } = await supabase.from("document_chunks").insert(
      body.chunks.map((chunk, index) => ({
        document_id: documentRow.id,
        chunk_index: index,
        content: chunk,
      })),
    );

    if (chunkError) {
      throw chunkError;
    }

    const { error: updateError } = await supabase
      .from("documents")
      .update({
        rag_status: "indexed",
        chunk_count: body.chunks.length,
        summary: body.summary || null,
      })
      .eq("id", documentRow.id);

    if (updateError) {
      throw updateError;
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
            : "Erreur lors de l'indexation du document.",
      },
      { status: 500 },
    );
  }
}
