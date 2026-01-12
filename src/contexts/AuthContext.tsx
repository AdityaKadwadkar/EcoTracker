import { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

type SoulLogUser = {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
};

type AuthContextValue = {
  user: SoulLogUser | null;
  loading: boolean;
  signInWithGoogle: (returnTo?: string) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SoulLogUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ⚡ Listen for login/logout automatically
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name ?? null,
          avatarUrl: session.user.user_metadata.avatar_url ?? null,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ⚡ Load current session on page load
  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name ?? null,
          avatarUrl: session.user.user_metadata.avatar_url ?? null,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    load();
  }, []);

  // ⭐ Google Sign-In
  const signInWithGoogle = async (returnTo?: string) => {
    try {
      const origin = window.location.origin;
      const redirectUrl =
        returnTo && returnTo.startsWith("/")
          ? `${origin}${returnTo}`
          : `${origin}/login`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error("Google OAuth error:", error);
        alert("Failed to sign in with Google: " + error.message);
      }
    } catch (err) {
      console.error("Unexpected Google sign-in error:", err);
      alert("Unexpected error. Check console.");
    }
  };

  // ⭐ Logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out error:", error);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithGoogle,
      signOut,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
