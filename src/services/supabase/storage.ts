import { getSupabaseBrowserClient } from "./browser";

export async function uploadProjectDocument(file: File) {
  const supabase = getSupabaseBrowserClient();
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
  const filePath = `uploads/${fileName}`;

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
