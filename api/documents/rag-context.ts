import { documentWorkspaceData } from "../../src/features/platform/data/workspace";
import { json, methodNotAllowed } from "../_lib/http";
import { createSupabaseServerClient, getSupabaseRuntimeConfig } from "../_lib/supabase";
import type { ProjectMode } from "../../src/data/content";

export const config = {
  runtime: "nodejs",
};

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return methodNotAllowed(["POST"]);
  }

  const body = (await request.json()) as {
    mode?: ProjectMode;
    query?: string;
    labels?: string[];
  };
  const mode = body.mode === "seller" ? "seller" : "buyer";
  const query = body.query?.trim();

  if (!query) {
    return json({ error: "query est requis." }, { status: 400 });
  }

  if (!getSupabaseRuntimeConfig().isConfigured) {
    const matches = documentWorkspaceData[mode]
      .filter((item) => {
        const haystack = `${item.label} ${item.summary} ${item.notes.join(" ")}`.toLowerCase();
        const labelMatch = !body.labels?.length || body.labels.includes(item.label);
        return labelMatch && haystack.includes(query.toLowerCase());
      })
      .slice(0, 4)
      .map((item) => ({
        label: item.label,
        source: item.source,
        summary: item.summary,
        excerpt: item.notes[0] || item.nextAction,
      }));

    return json({
      ok: true,
      data: {
        query,
        sources: matches,
      },
    });
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("mode", mode)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!project) {
      return json({
        ok: true,
        data: { query, sources: [] },
      });
    }

    const docsQuery = supabase
      .from("documents")
      .select("id, label, source, summary")
      .eq("project_id", project.id);

    const docsScoped =
      body.labels && body.labels.length > 0 ? docsQuery.in("label", body.labels) : docsQuery;

    const { data: documents, error: documentsError } = await docsScoped;

    if (documentsError) {
      throw documentsError;
    }

    const documentIds = documents?.map((document) => document.id) || [];

    if (documentIds.length === 0) {
      return json({
        ok: true,
        data: { query, sources: [] },
      });
    }

    const { data: chunks, error: chunksError } = await supabase
      .from("document_chunks")
      .select("document_id, content")
      .in("document_id", documentIds)
      .ilike("content", `%${query}%`)
      .limit(6);

    if (chunksError) {
      throw chunksError;
    }

    const sources = (chunks || []).map((chunk) => {
      const parent = documents?.find((document) => document.id === chunk.document_id);

      return {
        label: parent?.label || "Document",
        source: parent?.source || "Projet",
        summary: parent?.summary || "",
        excerpt: chunk.content,
      };
    });

    return json({
      ok: true,
      data: {
        query,
        sources,
      },
    });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la recuperation du contexte RAG.",
      },
      { status: 500 },
    );
  }
}
