"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Box, Edit2, AlertTriangle, Save, Search, X, Layers, Barcode } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function StokDeposu() {
  const [malzemeler, setMalzemeler] = useState<any[]>([]);
  const [arama, setArama] = useState("");
  
  // YENİ: Ekleme Formu için Seri No State'i
  const [seriNo, setSeriNo] = useState("");
  const [isim, setIsim] = useState("");
  const [kategori, setKategori] = useState("ŞASE GRUBU");
  const [miktar, setMiktar] = useState("");
  const [birim, setBirim] = useState("Adet");

  // YENİ: Düzenleme Modalı için Seri No State'i
  const [duzenlenenItem, setDuzenlenenItem] = useState<any | null>(null);
  const [dSeriNo, setDSeriNo] = useState("");
  const [dIsim, setDIsim] = useState("");
  const [dKategori, setDKategori] = useState("");
  const [dMiktar, setDMiktar] = useState("");
  const [dBirim, setDBirim] = useState("");

  const kategoriler = ["ŞASE GRUBU", "KLAVUZ GRUBU", "KANCA GRUBU", "MOTORLU ŞARYO GRUBU", "ELEKTRİK ŞALT GRUBU", "UZAKTAN KUMANDA", "EL ALETLERİ VE MAKİNELER", "PAKETLEME"];

  const smoothSpring: any = { type: "spring", stiffness: 400, damping: 25, mass: 0.5 };

  const fetchMalzemeler = async () => {
    let { data } = await supabase.from("malzemeler").select("*").order("created_at", { ascending: false });
    if (data) setMalzemeler(data);
  };

  useEffect(() => { fetchMalzemeler(); }, []);

  const yeniMalzemeEkle = async (e: any) => {
    e.preventDefault();
    if (!isim || !miktar) return;
    
    // YENİ: seri_no alanı formdan alınıp veritabanına gönderiliyor
    const { data } = await supabase.from("malzemeler").insert([{ 
      seri_no: seriNo.toUpperCase(),
      isim: isim.toUpperCase(), 
      kategori, 
      miktar: Number(miktar), 
      birim 
    }]).select();
    
    if (data) { 
      setMalzemeler([data[0], ...malzemeler]); 
      setIsim(""); setMiktar(""); setSeriNo(""); // Formu temizlerken seri no'yu da sıfırla
    }
  };

  const duzenlemeModaliniAc = (item: any) => {
    // Tıklanan öğenin verilerini formda göster
    setDSeriNo(item.seri_no || "");
    setDIsim(item.isim); setDKategori(item.kategori); setDMiktar(item.miktar.toString()); setDBirim(item.birim);
    setDuzenlenenItem(item);
  };

  const guncellemeyiKaydet = async (e: any) => {
    e.preventDefault();
    if (!duzenlenenItem) return;
    
    // YENİ: Güncelleme sırasında seri no da kaydediliyor
    const { data } = await supabase.from("malzemeler").update({ 
      seri_no: dSeriNo.toUpperCase(),
      isim: dIsim.toUpperCase(), 
      kategori: dKategori, 
      miktar: Number(dMiktar), 
      birim: dBirim 
    }).eq("id", duzenlenenItem.id).select();

    if (data) { 
      setMalzemeler(malzemeler.map(m => m.id === duzenlenenItem.id ? data[0] : m)); 
      setDuzenlenenItem(null); 
    }
  };

  const malzemeSil = async (id: string, e: any) => {
    e.stopPropagation();
    const { error } = await supabase.from("malzemeler").delete().eq("id", id);
    if (error) {
      alert("HATA: Bu materyal aktif bir üretim reçetesinde (projede) kullanıldığı için silinemez! Önce projeden çıkarmalısınız.");
    } else {
      setMalzemeler(malzemeler.filter((m) => m.id !== id));
    }
  };

  const filtrelenmisMalzemeler = malzemeler.filter(m => m.isim.toLowerCase().includes(arama.toLowerCase()) || m.kategori.toLowerCase().includes(arama.toLowerCase()) || (m.seri_no && m.seri_no.toLowerCase().includes(arama.toLowerCase())));

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-400 font-sans p-4 md:p-8 overflow-hidden relative flex flex-col items-center">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] max-w-[1200px] max-h-[1200px] bg-[radial-gradient(circle,rgba(34,211,238,0.06)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />

      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between mb-8 relative z-10 px-4 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/">
            <motion.div whileHover={{ x: -8, scale: 1.05 }} transition={smoothSpring} className="cursor-pointer bg-slate-900/50 p-4 rounded-full border border-cyan-500/30 text-cyan-400 flex items-center shadow-[0_0_20px_rgba(34,211,238,0.15)]">
              <ArrowLeft size={24} />
            </motion.div>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.2em] flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <Layers size={32} className="text-cyan-400" /> STOK AĞI
          </h1>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50" size={20} />
          <input 
            type="text" placeholder="MATERYAL VEYA BARKOD ARA..." value={arama} onChange={(e) => setArama(e.target.value)}
            className="w-full bg-slate-900/80 border-2 border-cyan-500/30 rounded-full py-3 pl-12 pr-4 text-cyan-100 placeholder-cyan-600/50 focus:border-cyan-400 outline-none transition-all focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] font-bold tracking-widest"
          />
        </div>
      </div>

      <motion.form 
        onSubmit={yeniMalzemeEkle} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={smoothSpring}
        className="w-full max-w-7xl bg-slate-900/60 backdrop-blur-2xl p-4 md:p-6 rounded-[2rem] border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.1)] mb-10 relative z-10 flex flex-col md:flex-row gap-4 mx-4"
      >
        {/* YENİ: SERİ NO GİRİŞ ALANI */}
        <input type="text" placeholder="SERİ NO / KOD" value={seriNo} onChange={(e) => setSeriNo(e.target.value)} className="w-full md:w-40 bg-slate-950/50 border border-cyan-800 rounded-xl p-4 text-cyan-100 focus:border-cyan-400 outline-none uppercase font-bold tracking-wide" />
        
        <input type="text" placeholder="MATERYAL ADI" value={isim} onChange={(e) => setIsim(e.target.value)} className="flex-1 bg-slate-950/50 border border-cyan-800 rounded-xl p-4 text-cyan-100 focus:border-cyan-400 outline-none uppercase font-bold tracking-wide" />
        
        <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full md:w-48 bg-slate-950/50 border border-cyan-800 rounded-xl p-4 text-cyan-100 outline-none appearance-none font-medium">
          {kategoriler.map(kat => <option key={kat} value={kat}>{kat}</option>)}
        </select>
        
        <div className="flex gap-2 w-full md:w-64">
          <input type="number" placeholder="MİKTAR" value={miktar} onChange={(e) => setMiktar(e.target.value)} className="w-2/3 bg-slate-950/50 border border-cyan-800 rounded-xl p-4 text-cyan-100 focus:border-cyan-400 outline-none font-bold text-center" />
          <select value={birim} onChange={(e) => setBirim(e.target.value)} className="w-1/3 bg-slate-950/50 border border-cyan-800 rounded-xl p-4 text-cyan-100 outline-none appearance-none">
            <option value="Adet">Adet</option><option value="Metre">Mt</option><option value="Litre">Lt</option>
          </select>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={smoothSpring} type="submit" className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 md:shrink-0">
          <Plus size={24} /> EKLE
        </motion.button>
      </motion.form>

      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 relative z-0 px-4 pb-32 overflow-y-auto h-[55vh] custom-scrollbar place-items-center">
        <AnimatePresence>
          {filtrelenmisMalzemeler.map((item, index) => {
            const kritikMi = item.miktar < 10;
            return (
              <motion.div
                key={item.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }} exit={{ opacity: 0, scale: 0.5 }}
                transition={{ opacity: { duration: 0.4 }, scale: smoothSpring, y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: index * 0.1 } }}
                className="w-full h-[220px] relative group"
              >
                <motion.div
                  layoutId={`stok-kutu-${item.id}`}
                  whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
                  onClick={() => duzenlemeModaliniAc(item)}
                  className={`w-full h-full rounded-3xl flex flex-col items-center justify-center cursor-pointer p-6 text-center overflow-hidden transition-colors border-2 ${
                    kritikMi 
                      ? "bg-gradient-to-b from-red-950/80 to-slate-950 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.6)]" 
                      : "bg-gradient-to-b from-slate-800 to-slate-950 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:border-cyan-400"
                  }`}
                >
                  {/* BARKOD ROZETİ */}
                  <div className="absolute top-4 left-4 bg-slate-950/80 border border-cyan-500/30 px-3 py-1 rounded-lg text-xs font-mono text-cyan-400 flex items-center gap-2 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] z-10">
                    <Barcode size={14} /> {item.seri_no || "KOD YOK"}
                  </div>

                  {kritikMi && <div className="absolute inset-0 bg-red-500/10 animate-pulse rounded-3xl" />}
                  {kritikMi ? <AlertTriangle size={36} className="text-red-500 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse" /> : <Box size={36} className="text-cyan-500/50 mb-2 group-hover:text-cyan-400 transition-colors" />}
                  
                  <div className={`text-4xl font-black drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] mb-1 ${kritikMi ? 'text-red-400' : 'text-cyan-300'}`}>
                    {item.miktar} <span className="text-base font-normal text-cyan-600">{item.birim}</span>
                  </div>
                  
                  <h3 className="text-sm font-bold tracking-widest text-cyan-100 break-words leading-tight px-2">{item.isim}</h3>
                  <p className="text-[10px] text-cyan-500/60 mt-2 tracking-widest uppercase">{item.kategori}</p>
                </motion.div>

                <motion.button 
                  whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={(e) => malzemeSil(item.id, e)}
                  className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 text-red-400 hover:text-white transition-all bg-slate-950 border-2 border-red-500/50 hover:bg-red-600 hover:border-red-600 p-3 rounded-full z-10 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                >
                  <Trash2 size={18} />
                </motion.button>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {duzenlenenItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-slate-950/80 backdrop-blur-lg">
            <div className="absolute inset-0" onClick={() => setDuzenlenenItem(null)} />

            <motion.div
              layoutId={`stok-kutu-${duzenlenenItem.id}`}
              className={`w-full max-w-2xl bg-slate-900 border-2 rounded-[3rem] shadow-[0_0_100px_rgba(34,211,238,0.3)] relative flex flex-col p-8 md:p-12 overflow-hidden ${duzenlenenItem.miktar < 10 ? 'border-red-500/60 shadow-[0_0_100px_rgba(239,68,68,0.3)]' : 'border-cyan-400/50'}`}
            >
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} transition={smoothSpring} onClick={() => setDuzenlenenItem(null)} className="absolute top-6 right-6 bg-slate-800/80 text-cyan-500 hover:bg-red-500 hover:text-white border border-cyan-500/30 p-3 rounded-full z-20">
                <X size={24} />
              </motion.button>

              <h2 className="text-2xl md:text-3xl font-black text-cyan-400 tracking-widest mb-2 flex items-center gap-3"><Edit2 /> MATERYAL GÜNCELLE</h2>
              <p className="text-cyan-600 mb-8 tracking-widest text-sm border-b border-cyan-500/20 pb-4">STOK VERİLERİNİ DÜZENLE</p>

              <form onSubmit={guncellemeyiKaydet} className="flex flex-col gap-6 relative z-10">
                
                {/* YENİ: DÜZENLEME MODALINDA SERİ NO VE İSİM YAN YANA */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <label className="text-xs text-cyan-500 tracking-widest mb-1 block">SERİ NO / BARKOD</label>
                    <input type="text" value={dSeriNo} onChange={(e) => setDSeriNo(e.target.value)} className="w-full bg-slate-950/80 border border-cyan-800 rounded-2xl p-4 text-cyan-100 focus:border-cyan-400 outline-none uppercase font-bold text-lg" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-cyan-500 tracking-widest mb-1 block">MATERYAL ADI</label>
                    <input type="text" value={dIsim} onChange={(e) => setDIsim(e.target.value)} className="w-full bg-slate-950/80 border border-cyan-800 rounded-2xl p-4 text-cyan-100 focus:border-cyan-400 outline-none uppercase font-bold text-lg" />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-cyan-500 tracking-widest mb-1 block">KATEGORİ</label>
                  <select value={dKategori} onChange={(e) => setDKategori(e.target.value)} className="w-full bg-slate-950/80 border border-cyan-800 rounded-2xl p-4 text-cyan-100 focus:border-cyan-400 outline-none appearance-none font-medium">
                    {kategoriler.map(kat => <option key={kat} value={kat}>{kat}</option>)}
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-cyan-500 tracking-widest mb-1 block">MİKTAR</label>
                    <input type="number" value={dMiktar} onChange={(e) => setDMiktar(e.target.value)} className="w-full bg-slate-950/80 border border-cyan-800 rounded-2xl p-4 text-cyan-100 focus:border-cyan-400 outline-none font-black text-2xl text-center" />
                  </div>
                  <div className="w-1/3">
                    <label className="text-xs text-cyan-500 tracking-widest mb-1 block">BİRİM</label>
                    <select value={dBirim} onChange={(e) => setDBirim(e.target.value)} className="w-full bg-slate-950/80 border border-cyan-800 rounded-2xl p-4 text-cyan-100 focus:border-cyan-400 outline-none appearance-none text-center">
                      <option value="Adet">Adet</option><option value="Metre">Mt</option><option value="Litre">Lt</option>
                    </select>
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.02, boxShadow: "0px 0px 30px rgba(34,211,238,0.4)" }} whileTap={{ scale: 0.98 }} transition={smoothSpring} type="submit" className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3">
                  <Save size={24} /> DEĞİŞİKLİKLERİ KAYDET
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}