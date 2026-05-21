import { getProjectsPayload } from "../_lib/domain.js";
import { json, methodNotAllowed } from "../_lib/http.js";
import { createSupabaseServerClient, getSupabaseRuntimeConfig } from "../_lib/supabase.js";
import { projectSteps, scenarios, type ProjectMode } from "../../src/data/content.js";
import { projectStepMeta } from "../../src/features/platform/data/workspace.js";

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
        data: getProjectsPayload(mode),
      });
    }

    try {
      const supabase = createSupabaseServerClient();
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id, title")
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
          data: getProjectsPayload(mode),
        });
      }

      const { data: steps, error: stepsError } = await supabase
        .from("project_steps")
        .select("title, detail, status, owner_label, deadline_label, checkpoint, blocker, sort_order")
        .eq("project_id", project.id)
        .order("sort_order", { ascending: true });

      if (stepsError) {
        throw stepsError;
      }

      return json({
        ok: true,
        data: {
          mode,
          projectId: project.id,
          projectTitle: project.title,
          scenario: {
            projectStatus: scenarios[mode].projectStatus,
            projectNote: scenarios[mode].projectNote,
            checklist: scenarios[mode].checklist,
            projectDocuments: scenarios[mode].projectDocuments,
          },
          steps:
            steps?.map((step) => ({
              title: step.title,
              detail: step.detail,
              status: step.status,
              meta: {
                owner: step.owner_label || "",
                deadline: step.deadline_label || "",
                checkpoint: step.checkpoint || "",
                blocker: step.blocker || "",
              },
            })) || [],
        },
      });
    } catch (error) {
      return json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Erreur lors de la lecture du projet depuis Supabase.",
        },
        { status: 500 },
      );
    }
  }

  if (request.method === "POST") {
    const body = (await request.json()) as { mode?: ProjectMode; title?: string };
    const mode = body.mode === "seller" ? "seller" : "buyer";
    const title =
      body.title?.trim() || (mode === "buyer" ? "Projet acheteur CoachImmoIA" : "Projet vendeur CoachImmoIA");

    if (!getSupabaseRuntimeConfig().isConfigured) {
      const payload = getProjectsPayload(mode);

      return json({
        ok: true,
        data: {
          ...payload,
          projectId: `mock-${mode}-${Date.now()}`,
          projectTitle: title,
        },
      });
    }

    try {
      const supabase = createSupabaseServerClient();
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          mode,
          title,
          status: "active",
          checklist: scenarios[mode].checklist,
        })
        .select("id, title")
        .single();

      if (projectError) {
        throw projectError;
      }

      const stepRows = projectSteps[mode].map((step, index) => ({
        project_id: project.id,
        title: step.title,
        detail: step.detail,
        status: step.status,
        owner_label: projectStepMeta[mode][index]?.owner,
        deadline_label: projectStepMeta[mode][index]?.deadline,
        checkpoint: projectStepMeta[mode][index]?.checkpoint,
        blocker: projectStepMeta[mode][index]?.blocker,
        sort_order: index,
      }));

      const { error: stepsError } = await supabase.from("project_steps").insert(stepRows);

      if (stepsError) {
        throw stepsError;
      }

      return json({
        ok: true,
        data: {
          mode,
          projectId: project.id,
          projectTitle: project.title,
          scenario: {
            projectStatus: scenarios[mode].projectStatus,
            projectNote: scenarios[mode].projectNote,
            checklist: scenarios[mode].checklist,
            projectDocuments: scenarios[mode].projectDocuments,
          },
          steps: projectSteps[mode].map((step, index) => ({
            ...step,
            meta: projectStepMeta[mode][index],
          })),
        },
      });
    } catch (error) {
      return json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Erreur lors de la creation du projet dans Supabase.",
        },
        { status: 500 },
      );
    }
  }

  return methodNotAllowed(["GET", "POST"]);
}
