import { AgentActionRegistry } from "./action-registry";
import { DossierMemoryStore } from "./memory-store";
import { chooseNextAction } from "./agent-language";
import type {
  AgentGoalDefinition,
  DossierAgentEnvironment,
  DossierAgentMemory,
  DossierAgentResult,
} from "../types";

type RunGameAgentParams = {
  goal: AgentGoalDefinition;
  environment: DossierAgentEnvironment;
  initialMemory: DossierAgentMemory;
  registry: AgentActionRegistry;
  maxIterations?: number;
};

export async function runGameAgent({
  goal,
  environment,
  initialMemory,
  registry,
  maxIterations = 4,
}: RunGameAgentParams): Promise<DossierAgentResult> {
  const memory = new DossierMemoryStore(initialMemory);

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    if (memory.snapshot().response) {
      break;
    }

    const actionName = chooseNextAction(memory.snapshot());
    memory.recordStep(actionName);

    const action = registry.get(actionName);
    const result = await action({
      goal,
      memory: memory.snapshot(),
      environment,
    });

    if (result.updates) {
      memory.merge(result.updates);
    }

    if (result.stop || memory.snapshot().response) {
      break;
    }
  }

  const finalState = memory.snapshot();

  if (!finalState.response) {
    throw new Error(
      "L'agent n'a pas produit de reponse exploitable. Verifiez les objectifs, les actions ou la memoire GAME.",
    );
  }

  return {
    reply: finalState.response,
    model: finalState.modelUsed,
    sources: finalState.sources,
    steps: finalState.steps,
  };
}
