import { getSocialPayload } from "../_lib/domain";
import { json, methodNotAllowed } from "../_lib/http";
import { createSupabaseServerClient, getSupabaseRuntimeConfig } from "../_lib/supabase";
import {
  socialCircles as socialCircleSeeds,
  socialHighlights,
  socialStats,
  type ProjectMode,
} from "../../src/data/content";

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
        data: getSocialPayload(mode),
      });
    }

    try {
      const supabase = createSupabaseServerClient();
      let { data: circles, error: circlesError } = await supabase
        .from("social_circles")
        .select("id, title, audience, description, members_label, activity_label, trust_label, prompt, tags")
        .eq("mode", mode)
        .order("created_at", { ascending: true });

      if (circlesError) {
        throw circlesError;
      }

      if (!circles || circles.length === 0) {
        const { error: seedError } = await supabase.from("social_circles").insert(
          socialCircleSeeds[mode].map((circle) => ({
            mode,
            title: circle.title,
            audience: circle.audience,
            description: circle.description,
            members_label: circle.members,
            activity_label: circle.activity,
            trust_label: circle.trust,
            prompt: circle.prompt,
            tags: circle.tags,
          })),
        );

        if (seedError) {
          throw seedError;
        }

        const seedResult = await supabase
          .from("social_circles")
          .select("id, title, audience, description, members_label, activity_label, trust_label, prompt, tags")
          .eq("mode", mode)
          .order("created_at", { ascending: true });

        circles = seedResult.data || [];
      }

      const circleIds = circles.map((circle) => circle.id);
      const { data: threads, error: threadsError } = await supabase
        .from("social_threads")
        .select("id, circle_id, title, author_label, role_label, trust_label, excerpt, replies_label, last_activity_label, ai_summary, project_link, action_label")
        .in("circle_id", circleIds.length > 0 ? circleIds : ["00000000-0000-0000-0000-000000000000"])
        .order("created_at", { ascending: false });

      if (threadsError) {
        throw threadsError;
      }

      return json({
        ok: true,
        data: {
          mode,
          highlight: socialHighlights[mode],
          stats: socialStats[mode],
          circles: circles.map((circle) => ({
            id: circle.id,
            title: circle.title,
            audience: circle.audience || "",
            description: circle.description,
            members: circle.members_label || "0 membres",
            activity: circle.activity_label || "0 activite",
            trust: circle.trust_label || "Moderation",
            prompt: circle.prompt || "",
            tags: Array.isArray(circle.tags) ? circle.tags.filter((tag): tag is string => typeof tag === "string") : [],
            threads:
              threads
                ?.filter((thread) => thread.circle_id === circle.id)
                .map((thread) => ({
                  id: thread.id,
                  circleId: thread.circle_id,
                  title: thread.title,
                  author: thread.author_label,
                  role: thread.role_label || "",
                  trust: thread.trust_label || "",
                  excerpt: thread.excerpt,
                  replies: thread.replies_label || "0 reponse",
                  lastActivity: thread.last_activity_label || "Maintenant",
                  aiSummary: thread.ai_summary || "",
                  projectLink: thread.project_link || "",
                  actionLabel: thread.action_label || "Ouvrir",
                })) || [],
          })),
        },
      });
    } catch (error) {
      return json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Erreur lors de la lecture de la communaute depuis Supabase.",
        },
        { status: 500 },
      );
    }
  }

  if (request.method === "POST") {
    const body = (await request.json()) as {
      mode?: ProjectMode;
      circleId?: string;
      title?: string;
      body?: string;
      author?: string;
    };
    const mode = body.mode === "seller" ? "seller" : "buyer";

    if (!body.circleId || !body.title || !body.body) {
      return json({ error: "circleId, title et body sont requis." }, { status: 400 });
    }

    if (!getSupabaseRuntimeConfig().isConfigured) {
      const payload = getSocialPayload(mode);
      const targetCircle = payload.circles.find((circle) => circle.id === body.circleId) || payload.circles[0];

      return json({
        ok: true,
        data: {
          ...payload,
          circles: payload.circles.map((circle) =>
            circle.id !== targetCircle.id
              ? circle
              : {
                  ...circle,
                  threads: [
                    {
                      id: `mock-thread-${Date.now()}`,
                      circleId: targetCircle.id,
                      title: body.title,
                      author: body.author || "Vous",
                      role: "Membre",
                      trust: "Nouveau fil",
                      excerpt: body.body,
                      replies: "0 reponse",
                      lastActivity: "Maintenant",
                      aiSummary: "Thread cree en mode prototype.",
                      projectLink: "A rattacher au projet",
                      actionLabel: "Ouvrir",
                    },
                    ...circle.threads,
                  ],
                },
          ),
        },
      });
    }

    try {
      const supabase = createSupabaseServerClient();
      const { error: insertError } = await supabase.from("social_threads").insert({
        circle_id: body.circleId,
        title: body.title,
        author_label: body.author || "Vous",
        role_label: "Membre CoachImmoIA",
        trust_label: "Nouveau fil",
        excerpt: body.body,
        replies_label: "0 reponse",
        last_activity_label: "Maintenant",
        ai_summary: "Fil cree par l'utilisateur depuis la plateforme.",
        project_link: mode === "buyer" ? "Lier au projet acheteur" : "Lier au projet vendeur",
        action_label: "Ouvrir le fil",
      });

      if (insertError) {
        throw insertError;
      }

      const syntheticRequest = new Request(`${new URL(request.url).origin}/api/social?mode=${mode}`, {
        method: "GET",
      });

      return await handler(syntheticRequest);
    } catch (error) {
      return json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Erreur lors de la creation du fil social.",
        },
        { status: 500 },
      );
    }
  }

  return methodNotAllowed(["GET", "POST"]);
}
