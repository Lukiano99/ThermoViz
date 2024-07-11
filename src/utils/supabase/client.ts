import { createBrowserClient } from "@supabase/ssr";

import { SUPABASE_API } from "@/config-global";

export const supabase = createBrowserClient(
  `${SUPABASE_API.url}`,
  `${SUPABASE_API.key}`,
);
