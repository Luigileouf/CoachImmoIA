import { buyerGoal } from "./goals/buyer-goals";
import { runScopedAgent } from "./dossier-agent";
import type { DossierAgentRequest, DossierAgentResult } from "./types";

export async function runBuyerAgent(request: DossierAgentRequest): Promise<DossierAgentResult> {
  return runScopedAgent(buyerGoal, request);
}
