import type { AgentActionHandler, AgentActionName } from "../types";

export class AgentActionRegistry {
  private readonly actions = new Map<AgentActionName, AgentActionHandler>();

  register(name: AgentActionName, handler: AgentActionHandler) {
    this.actions.set(name, handler);
    return this;
  }

  get(name: AgentActionName) {
    const handler = this.actions.get(name);

    if (!handler) {
      throw new Error(`Action GAME introuvable : ${name}`);
    }

    return handler;
  }
}
