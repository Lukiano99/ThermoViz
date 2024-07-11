"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { AuthError } from "@supabase/supabase-js";
import { paths } from "src/routes/paths";

import { SUPABASE_API } from "@/config-global";
import { supabase } from "@/utils/supabase/client";

import type { ActionMapType, AuthStateType, AuthUserType } from "../../types";

import { AuthContext } from "./auth-context";

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  LOGOUT = "LOGOUT",
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
        console.error(error);
        throw error;
      }

      if (session?.user) {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...session?.user,
              session: {
                access_token: session.access_token,
                expires_at: session.expires_at,
                expires_in: session.expires_in,
                refresh_token: session.refresh_token,
                token_type: session.token_type,
              },
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      dispatch({
        type: Types.LOGIN,
        payload: {
          user: null,
        },
      });
      console.error(error);
      throw error;
    } else {
      dispatch({
        type: Types.LOGIN,
        payload: {
          user: {
            ...data.user,
            session: {
              access_token: data.session.access_token,
              expires_at: data.session.expires_at,
              expires_in: data.session.expires_in,
              refresh_token: data.session.refresh_token,
              token_type: data.session.token_type,
            },
          },
        },
      });
    }
  }, []);

  // REGISTER
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
    ) => {
      console.log({ url: SUPABASE_API.url, key: SUPABASE_API.key });

      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${paths.dashboard.root}`,
          data: {
            display_name: `${firstName} ${lastName}`,
          },
        },
      });

      if (data.user?.identities?.length === 0) {
        throw new AuthError("User already exists", 404, "email_exists");
      }

      if (error) {
        console.error(error);
        throw error;
      }
    },
    [],
  );

  // LOGOUT
  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      throw error;
    }

    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${paths.auth.newPassword}`,
    });

    if (error) {
      console.error(error);
      throw error;
    }
  }, []);

  // NEW PASSWORD
  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error(error);
      throw error;
    }
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: {
        ...state.user,
        role: "admin",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        displayName: `${state.user?.user_metadata.display_name}`,
      },
      method: "supabase",
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      //
      login,
      register,
      logout,
      forgotPassword,
      updatePassword,
    }),
    [
      forgotPassword,
      login,
      logout,
      updatePassword,
      register,
      state.user,
      status,
    ],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
