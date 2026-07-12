import type { AppScreen, ProjectMode } from "../../types/product";
import { getSupabaseBrowserClient } from "./browser";

export type CoachRequestPayload = {
  contactEmail: string;
  message: string;
  screen: AppScreen;
  mode: ProjectMode;
  urgency: "advice" | "soon" | "urgent";
};

export async function createCoachRequest(payload: CoachRequestPayload) {
  const supabase = getSupabaseBrowserClient();
  const { data: userData } = await supabase.auth.getUser();
  const requestRow = {
    contact_email: payload.contactEmail.trim().toLowerCase(),
    message: payload.message.trim(),
    mode: payload.mode,
    screen: payload.screen,
    urgency: payload.urgency,
    user_id: userData.user?.id || null,
  };
  const { error } = await supabase.from("coach_requests").insert(requestRow as never);

  if (error) {
    throw error;
  }
}
