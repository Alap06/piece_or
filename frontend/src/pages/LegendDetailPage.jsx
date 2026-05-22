import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useLanguage } from "../contexts/LanguageContext";
import Loader from "../components/Loader";
import { legendsAPI } from "../api";




const LegendDetailPage = () => {
  const { slug } = useParams();
  const { lang, dir } = useLanguage();

  const [legend, setLegend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegend = async () => {
      try {
        const { data } = await legendsAPI.getBySlug(slug);
        setLegend(data.legend);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLegend();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32">
        <Loader />
      </div>
    );
  }

  if (!legend) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Légende introuvable
      </div>
    );
  }

  const name = legend.name?.[lang] || legend.name?.fr || "";
  const signification =
    legend.longSignification?.[lang] || legend.longSignification?.fr || "";
  const symbol = legend.symbol || "✦";

  return (
    <main
      className="min-h-screen bg-black text-white overflow-hidden"
      dir={dir}
    >
      {/* ── BACKGROUND RADIAL GLOW ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)]" />
        {/* subtle grain */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      {/* ── TOP BAR ── */}
      <div className="border-b border-[#D4AF37]/10 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            to={-1}
            className="inline-flex items-center gap-3 text-[#d7d2c7] hover:text-[#D4AF37] transition group"
          >
            {dir === "rtl" ? (
              <FiArrowRight className="group-hover:-translate-x-1 transition" />
            ) : (
              <FiArrowLeft className="group-hover:-translate-x-1 transition" />
            )}
            <span className="uppercase tracking-[3px] text-xs">Retour</span>
          </Link>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">

        {/* Decorative top line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="w-px h-20 bg-gradient-to-b from-transparent to-[#D4AF37]/60 mx-auto mb-16"
        />

        {/* SYMBOL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-flex items-center justify-center mb-14"
        >
          {/* Outer pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.05, 0.18] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-52 h-52 rounded-full border border-[#D4AF37]/30"
          />
          {/* Middle ring */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.08, 0.25] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute w-36 h-36 rounded-full border border-[#D4AF37]/40"
          />
          {/* Inner circle */}
          <div className="relative w-24 h-24 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/[0.06] backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.15)]">
            <span className="text-[#D4AF37] text-4xl leading-none select-none">
              {symbol}
            </span>
          </div>
        </motion.div>

        {/* LABEL */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="uppercase tracking-[0.5em] text-[#D4AF37] text-xs mb-6"
        >
          Légende Interactive
        </motion.p>

        {/* NOM */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="text-6xl md:text-7xl font-serif text-[#F5E6C8] leading-none mb-10"
        >
          {name}
        </motion.h1>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="w-32 h-[1px] bg-[#D4AF37]/50 mx-auto"
        />
      </section>

      {/* ── SIGNIFICATION CARD ── */}
      <section className="max-w-3xl mx-auto px-6 pb-40">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="
            relative
            rounded-[40px]
            border border-[#D4AF37]/20
            bg-white/[0.03]
            backdrop-blur-2xl
            p-14
            shadow-[0_0_80px_rgba(0,0,0,0.5)]
            overflow-hidden
          "
        >
          {/* Card inner glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-40 bg-[#D4AF37]/[0.07] rounded-full blur-3xl pointer-events-none" />

          {/* Section label */}
          <p className="uppercase tracking-[0.4em] text-[#D4AF37] text-xs mb-8 text-center">
            Signification
          </p>

          {/* Divider */}
          <div className="w-16 h-[1px] bg-[#D4AF37]/30 mx-auto mb-10" />

          {/* Text */}
          <p className="text-[#E8E0D0] text-lg leading-[2.1] text-center font-light">
            {signification}
          </p>

          {/* Bottom ornament */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
            <span className="text-[#D4AF37]/50 text-lg select-none">✦</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
          </div>
        </motion.div>
      </section>

      {/* ── BOTTOM FADE ── */}
      <div className="fixed bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </main>
  );
};

export default LegendDetailPage;