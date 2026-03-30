"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { Activity } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Şifresiz biri girmeye çalışırsa login'e at
      if (!session && pathname !== "/login") {
        router.push("/login");
      } 
      // Şifreli biri login ekranına gitmeye çalışırsa ana sayfaya at
      else if (session && pathname === "/login") {
        router.push("/");
      }
      setLoading(false);
    };
    checkUser();

    // Sistemde oturum değişirse (çıkış yapılırsa) anında algıla
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && pathname !== "/login") router.push("/login");
      if (session && pathname === "/login") router.push("/");
    });

    return () => authListener.subscription.unsubscribe();
  }, [pathname, router]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500"><Activity className="animate-spin" size={64} /></div>;

  return <>{children}</>;
}