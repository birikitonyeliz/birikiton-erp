"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Key, Activity, ShieldAlert } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("ERİŞİM REDDEDİLDİ: YETKİSİZ PERSONEL!");
    setLoading(false);
  };

  const smoothSpring: any = { type: "spring", stiffness: 400, damping: 25, mass: 0.5 };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={smoothSpring} className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border-2 border-cyan-500/30 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(34,211,238,0.15)] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-slate-950 p-4 rounded-full border border-cyan-500/50 mb-4 shadow-[0_0_20px_rgba(34,211,238,0.3)]"><Lock size={40} className="text-cyan-400" /></div>
          <h1 className="text-2xl font-black text-cyan-400 tracking-[0.2em] text-center">BİRİKİTON A.Ş.</h1>
          <p className="text-cyan-600 tracking-widest text-xs mt-2">SİSTEM GÜVENLİK PROTOKOLÜ</p>
        </div>

        {error && <div className="bg-red-950/50 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-bold tracking-widest"><ShieldAlert size={20} /> {error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50" size={20} />
            <input type="email" placeholder="PERSONEL E-POSTA" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950/50 border-2 border-cyan-900 focus:border-cyan-400 rounded-xl py-4 pl-12 pr-4 text-cyan-100 outline-none transition-all font-bold tracking-widest" required />
          </div>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50" size={20} />
            <input type="password" placeholder="GÜVENLİK ŞİFRESİ" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950/50 border-2 border-cyan-900 focus:border-cyan-400 rounded-xl py-4 pl-12 pr-4 text-cyan-100 outline-none transition-all font-bold tracking-widest" required />
          </div>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(34,211,238,0.4)" }} whileTap={{ scale: 0.95 }} type="submit" disabled={loading} className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 tracking-widest">
            {loading ? <Activity className="animate-spin" size={24} /> : "SİSTEME GİRİŞ YAP"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}