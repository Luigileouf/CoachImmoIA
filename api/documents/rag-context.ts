import { documentWorkspaceData } from "../../src/features/platform/data/workspace";
import { json, methodNotAllowed } from "../_lib/http";
import { createSupabaseServerClient, getSupabaseRuntimeConfig } from "../_lib/supabase";
import type { ProjectMode } from "../../src/data/content";

const FRENCH_STOP_WORDS = new Set([
  "alors",
  "au",
  "aucun",
  "aussi",
  "avec",
  "avoir",
  "ce",
  "ces",
  "comme",
  "comment",
  "dans",
  "des",
  "dit",
  "dossier",
  "elle",
  "est",
  "etre",
  "il",
  "je",
  "la",
  "le",
  "les",
  "leur",
  "mais",
  "mes",
  "mon",
  "nous",
  "ou",
  "par",
  "pas",
  "plus",
  "pour",
  "que",
  "quel",
  "quelle",
  "quels",
  "quelles",
  "sur",
  "ses",
  "son",
  "tes",
  "ton",
  "une",
  "vos",
  "votre",
]);

function normalizeForSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeQuery(query: string) {
  return normalizeForSearch(query)
    .split(" ")
    .filter((token) => token.length >= 3 && !FRENCH_STOP_WORDS.has(token));
}

function scoreTextAgainstQuery(text: string, queryTokens: string[]) {
  if (queryTokens.length === 0) {
    return 0;
  }

  const normalizedText = normalizeForSearch(text);
  let score = 0;

  for (const token of queryTokens) {
    if (normalizedText.includes(token)) {
      score += token.length >= 8 ? 3 : 2;
    }
  }

  return score;
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
    query?: string;
    labels?: string[];
  };
  const mode = body.mode === "seller" ? "seller" : "buyer";
  const query = body.query?.trim();
  const queryTokens = tokenizeQuery(query || "");

  if (!query) {
    return json({ error: "query est requis." }, { status: 400 });
  }

  if (!getSupabaseRuntimeConfig().isConfigured) {
    const matches = documentWorkspaceData[mode]
      .filter((item) => {
        const haystack = `${item.label} ${item.summary} ${item.notes.join(" ")}`;
        const labelMatch = !body.labels?.length || body.labels.includes(item.label);
        return labelMatch && scoreTextAgainstQuery(haystack, queryTokens) > 0;
      })
      .sort((left, right) => {
        const leftScore = scoreTextAgainstQuery(
          `${left.label} ${left.summary} ${left.notes.join(" ")}`,
          queryTokens,
        );
        const rightScore = scoreTextAgainstQuery(
          `${right.label} ${right.summary} ${right.notes.join(" ")}`,
          queryTokens,
        );

        return rightScore - leftScore;
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

    const { data: selectedDocuments, error: documentsError } =
      body.labels && body.labels.length > 0 ? await docsQuery.in("label", body.labels) : await docsQuery;

    if (documentsError) {
      throw documentsError;
    }

    const selectedDocumentIds = selectedDocuments?.map((document) => document.id) || [];

    let documents = selectedDocuments || [];
    let documentIds = selectedDocumentIds;

    if (documentIds.length === 0 && body.labels?.length) {
      const { data: fallbackDocuments, error: fallbackDocumentsError } = await supabase
        .from("documents")
        .select("id, label, source, summary")
        .eq("project_id", project.id);

      if (fallbackDocumentsError) {
        throw fallbackDocumentsError;
      }

      documents = fallbackDocuments || [];
      documentIds = documents.map((document) => document.id);
    }

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
      .limit(200);

    if (chunksError) {
      throw chunksError;
    }

    const rankedChunks = (chunks || [])
      .map((chunk) => {
        const parent = documents.find((document) => document.id === chunk.document_id);
        const score = scoreTextAgainstQuery(
          `${parent?.label || ""} ${parent?.summary || ""} ${chunk.content}`,
          queryTokens,
        );

        return {
          chunk,
          parent,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 6);

    const sources = rankedChunks.map(({ chunk, parent }) => {
      const excerpt =
        chunk.content.length > 420 ? `${chunk.content.slice(0, 420).trim()}...` : chunk.content;

      return {
        label: parent?.label || "Document",
        source: parent?.source || "Projet",
        summary: parent?.summary || "",
        excerpt,
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
