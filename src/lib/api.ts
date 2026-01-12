const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const API = {
  energy: `${supabaseUrl}/functions/v1/mind-feedback`,
  water: `${supabaseUrl}/functions/v1/body-feedback`,
  waste: `${supabaseUrl}/functions/v1/soul-feedback`,
};
