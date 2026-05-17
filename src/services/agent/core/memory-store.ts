import type { AgentActionName, DossierAgentMemory } from "../types";

export class DossierMemoryStore {
  constructor(private state: DossierAgentMemory) {}

  snapshot() {
    return this.state;
  }

  merge(updates: Partial<DossierAgentMemory>) {
    this.state = {
      ...this.state,
      ...updates,
    };

    return this.state;
  }

  recordStep(step: AgentActionName) {
    this.state = {
      ...this.state,
      steps: [...this.state.steps, step],
    };

    return this.state;
  }
}
