"use client";
import { motion } from "framer-motion";
import { Activity, Box, ClipboardList } from "lucide-react";
import Link from "next/link";


export default function Home() {
  // 300Hz hissi verecek ultra akıcı yay (spring) ayarları
  const springTransition: any = {
      type: "spring",
      stiffness: 500,
      damping: 25,
      mass: 0.8,
    };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-400 font-sans overflow-hidden relative flex flex-col items-center pt-20">
      
      {/* Sürekli dönen ve nefes alan arka plan neonları */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Ana Başlık - Çok hızlı ve yaylı geliş */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="text-center z-10"
      >
        <h1 className="text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
          BİRİKİTON PROJE SİSTEMİ
        </h1>
        <p className="mt-2 text-cyan-600/80 tracking-widest text-sm font-light">STOK VE ÜRETİM AĞI AKTİF</p>
      </motion.div>

      {/* Menü Kartları - Havada süzülme ve anında tepki */}
      <div className="flex gap-8 mt-16 z-10">
      
      <Link href="/projeler">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0, y: [0, -10, 0] }} // Durduğu yerde havada süzülme
          transition={{ 
            opacity: { duration: 0.4 },
            x: springTransition,
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" } // Süzülme döngüsü
          }}
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 40px rgba(34, 211, 238, 0.6)", y: -15 }}
          whileTap={{ scale: 0.9 }}
          className="w-64 h-64 bg-slate-900/40 backdrop-blur-xl border border-cyan-500/40 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-slate-800/60"
        >
          <Activity size={56} className="mb-4 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <h2 className="text-xl font-bold tracking-widest">PROJELER</h2>
          <p className="text-xs text-cyan-500/80 mt-2 tracking-wider">AKTİF ÜRETİMLER</p>
        </motion.div>
      </Link>

      <Link href="/stok">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0, y: [0, -10, 0] }} // Durduğu yerde havada süzülme
          transition={{ 
            opacity: { duration: 0.4 },
            x: springTransition,
            y: { repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.3 } // Süzülme döngüsü (farklı zamanlama)
          }}
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 40px rgba(34, 211, 238, 0.6)", y: -15 }}
          whileTap={{ scale: 0.9 }}
          className="w-64 h-64 bg-slate-900/40 backdrop-blur-xl border border-cyan-500/40 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-slate-800/60"
        >
          <Box size={56} className="mb-4 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <h2 className="text-xl font-bold tracking-widest">STOK DEPOSU</h2>
          <p className="text-xs text-cyan-500/80 mt-2 tracking-wider">MALZEME ENVANTERİ</p>
        </motion.div>
      </Link>
      <Link href="/sablonlar">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
          transition={{ opacity: { duration: 0.4 }, x: springTransition, y: { repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.6 } }}
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 40px rgba(16, 185, 129, 0.6)", y: -15 }}
          whileTap={{ scale: 0.9 }}
          className="w-64 h-64 bg-slate-900/40 backdrop-blur-xl border border-emerald-500/40 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-slate-800/60"
        >
          {/* Import'lara import { ClipboardList } from "lucide-react"; eklemeyi unutma! */}
          <ClipboardList size={56} className="mb-4 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          <h2 className="text-xl font-bold tracking-widest text-emerald-400">ŞABLONLAR</h2>
          <p className="text-xs text-emerald-500/80 mt-2 tracking-wider">HAZIR VİNÇ REÇETELERİ</p>
        </motion.div>
      </Link>
      </div>
    </div>
  );
}