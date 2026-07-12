import type { AgentActionHandler } from "../types";

export const respondWithModelAction: AgentActionHandler = async ({
  goal,
  memory,
  environment,
}) => {
  const goalDirective = [
    `Cadre agent actif : ${goal.name}.`,
    "Objectifs prioritaires :",
    ...goal.objectives.map((objective) => `- ${objective}`),
    "Consignes d'execution :",
    ...goal.instructions.map((instruction) => `- ${instruction}`),
  ].join("\n");

  const response = await environment.sendModelReply({
    mode: memory.mode,
    provider: memory.provider,
    messages: [
      {
        role: "system",
        content: goalDirective,
      },
      ...memory.messages,
    ],
    contextSnippets: memory.sources.map(
      (source) => `${source.label} (${source.source}) : ${source.summary || source.excerpt}`,
    ),
  });

  return {
    updates: {
      response: response.content,
      modelUsed: response.model,
    },
    stop: true,
  };
};
