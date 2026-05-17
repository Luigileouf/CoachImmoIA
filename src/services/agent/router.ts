import { runBuyerAgent } from "./buyer-agent";
import { runDossierAgent } from "./dossier-agent";
import { runSellerAgent } from "./seller-agent";
import type { DossierAgentRequest, DossierAgentResult } from "./types";

export async function runCoachImmoAgent(
  request: DossierAgentRequest,
): Promise<DossierAgentResult> {
  if (request.mode === "buyer") {
    return runBuyerAgent(request);
  }

  if (request.mode === "seller") {
    return runSellerAgent(request);
  }

  return runDossierAgent(request);
}
