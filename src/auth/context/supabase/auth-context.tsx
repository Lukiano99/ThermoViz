"use client";

import { createContext } from "react";

import { type SupabaseContextType } from "../../types";

// ----------------------------------------------------------------------

export const AuthContext = createContext({} as SupabaseContextType);
