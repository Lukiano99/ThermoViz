import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { SUPABASE_API } from "@/config-global";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(`${SUPABASE_API.url}`, `${SUPABASE_API.key}`, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          cookieStore.set({ name, value: "", ...options });
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
