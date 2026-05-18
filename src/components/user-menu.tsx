"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.session?.user?.email ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setEmail(session?.user?.email ?? null);
    });

    const subscription = data?.subscription;

    return () => {
      mounted = false;
      try {
        subscription?.unsubscribe();
      } catch (e) {}
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!email) {
    return (
      <a href="/login" className="text-slate-700 hover:underline">
        Iniciar sesión
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-700">{email}</span>
      <button onClick={signOut} className="btn-secondary">
        Cerrar sesión
      </button>
    </div>
  );
}

export default UserMenu;
