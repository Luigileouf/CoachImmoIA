import { getSupabaseBrowserClient } from "./browser";

export async function uploadProjectDocument(file: File) {
  const supabase = getSupabaseBrowserClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw userError || new Error("Connectez-vous avant d’envoyer un document.");
  }

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
  const filePath = `${userData.user.id}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("project-documents")
    .upload(filePath, file, {
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return data.path;
}
