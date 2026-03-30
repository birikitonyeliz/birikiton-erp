"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Activity, Plus, Wrench, CheckCircle2, Trash2, Edit2, Check, X, Box, Settings, Search } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function Projeler() {
  const [projeler, setProjeler] = useState<any[]>([]);
  const [arama, setArama] = useState("");
  const [projeAdi, setProjeAdi] = useState("");
  const [stok, setStok] = useState<any[]>([]);
  
  const [seciliProje, setSeciliProje] = useState<any | null>(null);
  
  const [seciliMalzeme, setSeciliMalzeme] = useState("");
  const [kullanilanMiktar, setKullanilanMiktar] = useState("");
  const [projeIcerigi, setProjeIcerigi] = useState<any[]>([]);
  const [duzenlenenPMId, setDuzenlenenPMId] = useState<string | null>(null);
  const [yeniPMMiktar, setYeniPMMiktar] = useState("");

  const fetchData = async () => {
    const { data: pData } = await supabase.from("projeler").select("*").order("created_at", { ascending: false });
    if (pData) setProjeler(pData);
    const { data: sData } = await supabase.from("malzemeler").select("*").order("isim", { ascending: true });
    if (sData) setStok(sData);
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (seciliProje) projeIceriginiGetir(seciliProje.id);
  }, [seciliProje]);

  const projeIceriginiGetir = async (projeId: string) => {
    const { data } = await supabase.from("proje_malzemeleri").select(`id, kullanilan_miktar, malzemeler(isim, birim)`).eq("proje_id", projeId).order("created_at", { ascending: false });
    if (data) setProjeIcerigi(data);
  };

  const projeOlustur = async (e: any) => {
    e.preventDefault();
    if (!projeAdi) return;
    const { data } = await supabase.from("projeler").insert([{ proje_adi: projeAdi.toUpperCase() }]).select();
    if (data) { setProjeler([data[0], ...projeler]); setProjeAdi(""); }
  };

  const projeyeMalzemeEkle = async (e: any) => {
    e.preventDefault();
    if (!seciliProje || !seciliMalzeme || !kullanilanMiktar) return;
    const { error } = await supabase.from("proje_malzemeleri").insert([{ proje_id: seciliProje.id, malzeme_id: seciliMalzeme, kullanilan_miktar: Number(kullanilanMiktar) }]);
    if (!error) {
      setSeciliMalzeme(""); setKullanilanMiktar("");
      fetchData(); projeIceriginiGetir(seciliProje.id);
    }
  };

  const projedenMalzemeCikar = async (pmId: string) => {
    const { error } = await supabase.from("proje_malzemeleri").delete().eq("id", pmId);
    if (!error) { fetchData(); projeIceriginiGetir(seciliProje.id); }
  };

  const projeMiktarGuncelle = async (pmId: string) => {
    if (!yeniPMMiktar) return;
    const { error } = await supabase.from("proje_malzemeleri").update({ kullanilan_miktar: Number(yeniPMMiktar) }).eq("id", pmId);
    if (!error) { setDuzenlenenPMId(null); setYeniPMMiktar(""); fetchData(); projeIceriginiGetir(seciliProje.id); }
  };

  const projeSil = async (id: string, e: any) => {
    e.stopPropagation(); 
    
    const onay = window.confirm("DİKKAT: Bu projeyi silerseniz, içinde kullanılan tüm malzemeler ana stoğa geri iade edilecektir. Emin misiniz?");
    if (!onay) return;

    const { error } = await supabase.from("projeler").delete().eq("id", id);
    if (!error) {
      setProjeler(projeler.filter(p => p.id !== id));
      if (seciliProje?.id === id) setSeciliProje(null);
      fetchData(); 
    } else {
      alert("Proje silinirken hata oluştu.");
    }
  };

  const filtrelenmisProjeler = projeler.filter(p => p.proje_adi.toLowerCase().includes(arama.toLowerCase()));

  const smoothSpring: any = { type: "spring", stiffness: 400, damping: 25, mass: 0.5 };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-400 font-sans p-4 md:p-8 overflow-hidden relative flex flex-col items-center">
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] max-w-[1200px] max-h-[1200px] bg-[radial-gradient(circle,rgba(34,211,238,0.06)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />
      
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between mb-8 relative z-10 px-4 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/">
            <motion.div whileHover={{ x: -8, scale: 1.05 }} transition={smoothSpring} className="cursor-pointer bg-slate-900/50 p-4 rounded-full border border-cyan-500/30 text-cyan-400 flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
              <ArrowLeft size={24} />
            </motion.div>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.2em] flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <Settings size={36} className="text-cyan-400 animate-spin-slow" /> ÜRETİM AĞI
          </h1>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50" size={20} />
          <input 
            type="text" placeholder="PROJE ARA..." value={arama} onChange={(e) => setArama(e.target.value)}
            className="w-full bg-slate-900/80 border-2 border-cyan-500/30 rounded-full py-3 pl-12 pr-4 text-cyan-100 placeholder-cyan-600/50 focus:border-cyan-400 outline-none transition-all focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] font-bold tracking-widest"
          />
        </div>
      </div>

      <motion.form 
        onSubmit={projeOlustur} 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={smoothSpring}
        className="w-full max-w-3xl flex gap-2 md:gap-4 mb-12 relative z-10 bg-slate-900/60 backdrop-blur-2xl p-3 md:p-4 rounded-[3rem] border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.1)] mx-4"
      >
        <div className="flex-1 relative flex items-center">
          <Activity className="absolute left-6 text-cyan-500/50" size={24} />
          <input 
            type="text" placeholder="YENİ ÜRETİM EMRİ (ÖRN: 5 TON VİNÇ)" 
            value={projeAdi} onChange={(e) => setProjeAdi(e.target.value)} 
            className="w-full bg-transparent border-none py-3 pl-16 pr-4 text-cyan-100 placeholder-cyan-600/50 text-base md:text-lg font-bold outline-none uppercase tracking-wider" 
          />
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(34,211,238,0.6)" }} whileTap={{ scale: 0.95 }} transition={smoothSpring}
          type="submit" 
          className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black px-6 md:px-10 py-3 md:py-4 rounded-full flex items-center gap-2 md:gap-3 shrink-0"
        >
          <Plus size={24} /> <span className="hidden md:inline">BAŞLAT</span>
        </motion.button>
      </motion.form>

      <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 relative z-0 px-4 md:px-10 pb-32 overflow-y-auto h-[65vh] custom-scrollbar place-items-center">
        <AnimatePresence>
          {filtrelenmisProjeler.map((proje, index) => (
            <motion.div
              key={proje.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ opacity: { duration: 0.4 }, scale: smoothSpring, y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: index * 0.15 } }}
              // parent div'e "group" eklendi, böylece buton hover'ı bu alan üzerinden tetiklenecek
              className="flex justify-center items-center w-full aspect-square max-w-[240px] relative group"
            >
              <motion.div
                layoutId={`proje-kutu-${proje.id}`}
                whileHover={{ scale: 1.08, boxShadow: "0px 0px 40px rgba(34,211,238,0.7)" }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSeciliProje(proje)}
                // overflow-hidden burada kalıyor ama silme butonu dışarı alındı
                className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-950 border-[3px] border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] flex flex-col items-center justify-center cursor-pointer p-6 text-center overflow-hidden"
              >
                <div className="absolute inset-0 rounded-full border border-cyan-400/20 group-hover:scale-110 transition-transform duration-500" />
                <Activity size={42} className="text-cyan-400 mb-3 opacity-50 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all duration-300" />
                <h3 className="text-sm md:text-base font-black tracking-widest text-cyan-100 break-words leading-tight">{proje.proje_adi}</h3>
              </motion.div>

              {/* SİLME BUTONU: Kırpılmamak için kapsülün DİŞINA, sağ üst köşeye alındı! */}
              <motion.button 
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={(e) => projeSil(proje.id, e)}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-white transition-all bg-slate-950 border-2 border-red-500/50 hover:bg-red-600 hover:border-red-600 p-3 rounded-full z-10 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              >
                <Trash2 size={20} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtrelenmisProjeler.length === 0 && <div className="col-span-full text-center p-8 text-cyan-600/50 italic tracking-widest">ARADIĞINIZ PROJE BULUNAMADI...</div>}
      </div>

      <AnimatePresence>
        {seciliProje && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-slate-950/80 backdrop-blur-lg"
          >
            <div className="absolute inset-0" onClick={() => setSeciliProje(null)} />

            <motion.div
              layoutId={`proje-kutu-${seciliProje.id}`}
              className="w-full max-w-6xl h-[85vh] bg-slate-900 border-2 border-cyan-400/50 rounded-[2rem] md:rounded-[3rem] shadow-[0_0_100px_rgba(34,211,238,0.3)] relative flex flex-col md:flex-row overflow-hidden"
            >
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} transition={smoothSpring}
                onClick={() => setSeciliProje(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 bg-slate-800/80 text-cyan-500 hover:bg-red-500 hover:text-white hover:border-red-500 border border-cyan-500/30 p-3 rounded-full z-20"
              >
                <X size={24} />
              </motion.button>

              <div className="w-full md:w-2/5 bg-slate-950/60 p-6 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-cyan-500/20">
                <h2 className="text-2xl md:text-4xl font-black text-cyan-400 tracking-widest mb-2 leading-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">{seciliProje.proje_adi}</h2>
                <p className="text-cyan-600 mb-8 md:mb-10 tracking-widest text-xs md:text-sm border-b border-cyan-500/20 pb-4 md:pb-6">ÜRETİM REÇETESİ GİRİŞİ</p>

                <form onSubmit={projeyeMalzemeEkle} className="flex flex-col gap-4 md:gap-6">
                  <div className="relative">
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50" size={20} />
                    <select value={seciliMalzeme} onChange={(e) => setSeciliMalzeme(e.target.value)} className="w-full bg-slate-900 border border-cyan-800 focus:border-cyan-400 rounded-2xl py-4 pl-12 pr-4 text-cyan-100 outline-none appearance-none font-medium tracking-wide">
                      <option value="">-- STOKTAN MATERYAL SEÇ --</option>
                      {stok.map(item => <option key={item.id} value={item.id}>{item.isim} (Stok: {item.miktar} {item.birim})</option>)}
                    </select>
                  </div>
                  
                  <div className="relative">
                    <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50" size={20} />
                    <input type="number" placeholder="KULLANILAN MİKTAR" value={kullanilanMiktar} onChange={(e) => setKullanilanMiktar(e.target.value)} className="w-full bg-slate-900 border border-cyan-800 focus:border-cyan-400 rounded-2xl py-4 pl-12 pr-4 text-cyan-100 outline-none font-bold text-lg" />
                  </div>

                  <motion.button whileHover={{ scale: 1.03, boxShadow: "0px 0px 30px rgba(34,211,238,0.4)" }} whileTap={{ scale: 0.97 }} transition={smoothSpring} type="submit" className="mt-2 md:mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-base md:text-lg py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3">
                    <Plus size={24} /> MATERYALİ İŞLE
                  </motion.button>
                </form>
              </div>

              <div className="w-full md:w-3/5 p-6 md:p-12 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col h-full">
                <h3 className="text-lg md:text-xl font-bold text-cyan-500 tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-3">
                  <Activity size={24} /> KULLANILAN MATERYALLER LİSTESİ
                </h3>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
                  <AnimatePresence>
                    {projeIcerigi.map((item) => (
                      <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, x: 20 }} transition={smoothSpring} className="flex flex-col sm:flex-row justify-between sm:items-center bg-slate-800/40 p-4 md:p-5 rounded-2xl border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-slate-800/60 group gap-4 sm:gap-0">
                        <div className="flex items-center gap-3 md:gap-4 text-cyan-50 font-medium text-sm md:text-lg tracking-wide">
                          <div className="bg-cyan-500/20 p-2 rounded-full text-cyan-400 shrink-0"><CheckCircle2 size={18} /></div>
                          {item.malzemeler.isim}
                        </div>
                        
                        {duzenlenenPMId === item.id ? (
                          <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-cyan-400/50 shrink-0 self-end sm:self-auto">
                            <input type="number" value={yeniPMMiktar} onChange={(e) => setYeniPMMiktar(e.target.value)} className="w-16 md:w-20 bg-transparent text-cyan-100 text-center font-bold text-lg md:text-xl outline-none" autoFocus />
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => projeMiktarGuncelle(item.id)} className="bg-green-500/20 text-green-400 p-2 rounded-lg hover:bg-green-500 hover:text-white"><Check size={18} /></motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setDuzenlenenPMId(null)} className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500 hover:text-white"><X size={18} /></motion.button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 md:gap-8 self-end sm:self-auto shrink-0">
                            <div className="text-cyan-300 font-black text-xl md:text-2xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                              {item.kullanilan_miktar} <span className="text-xs md:text-sm font-normal text-cyan-600">{item.malzemeler.birim}</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setDuzenlenenPMId(item.id); setYeniPMMiktar(item.kullanilan_miktar.toString()); }} className="bg-cyan-900/50 text-cyan-400 p-2 md:p-3 rounded-xl hover:bg-cyan-500 hover:text-slate-900"><Edit2 size={18} /></motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => projedenMalzemeCikar(item.id)} className="bg-red-900/30 text-red-400 p-2 md:p-3 rounded-xl hover:bg-red-500 hover:text-white"><Trash2 size={18} /></motion.button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {projeIcerigi.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 mt-10 md:mt-20">
                      <Box size={60} className="text-cyan-500 mb-4 md:mb-6" />
                      <p className="text-lg md:text-2xl font-black tracking-widest text-cyan-500 text-center">HENÜZ MATERYAL GİRİLMEDİ</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}