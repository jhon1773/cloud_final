"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        router.push("/login");
      } else {
        setChecked(true);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      }
    });

    const subscription = data?.subscription;

    return () => {
      mounted = false;
      try {
        subscription?.unsubscribe();
      } catch (e) {
        // ignore
      }
    };
  }, [router]);

  if (!checked) return <p>Verificando sesión...</p>;
  return <>{children}</>;
}

export default AuthGate;
