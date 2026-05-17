import { sellerGoal } from "./goals/seller-goals";
import { runScopedAgent } from "./dossier-agent";
import type { DossierAgentRequest, DossierAgentResult } from "./types";

export async function runSellerAgent(request: DossierAgentRequest): Promise<DossierAgentResult> {
  return runScopedAgent(sellerGoal, request);
}
