import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { motion } from "framer-motion";

import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { useLanguage } from "../contexts/LanguageContext";

import { piecesAPI, legendsAPI } from "../api";

import Loader from "../components/Loader";

const PieceDetailPage = () => {

  const { id } = useParams();

  const { lang, dir } = useLanguage();

  const [piece, setPiece] = useState(null);

  const [legends, setLegends] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {

    const fetchPiece = async () => {

      try {

        const [pieceRes, legendsRes] = await Promise.all([
          piecesAPI.getById(id),
          legendsAPI.getByPiece(id).catch(() => ({ data: { legends: [] } }))
        ]);

        setPiece(pieceRes.data.piece);
        setLegends(legendsRes.data.legends || []);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchPiece();

    window.scrollTo(0, 0);

  }, [id]);

  if (loading) {

    return (

      <div className="min-h-screen bg-black pt-32">

        <Loader />

      </div>

    );

  }

  if (!piece) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        Pièce introuvable

      </div>

    );

  }

  const images =
    piece.images?.length > 0
      ? piece.images
      : [{ url: piece.thumbnailUrl || "/logo.png" }];

  const nextImage = () => {

    setSelectedImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );

  };

  const prevImage = () => {

    setSelectedImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );

  };

  const historicalData =
    piece.historicalData?.length > 0
      ? piece.historicalData
      : [

          {
            label: "Nom du bijou",
            value: "Mnégech Wejh",
          },

          {
            label: "Origine du nom",
            value:
              "Arabe tunisien : Mnégech = gravé/décoré ; Wejh = visage/front",
          },

          {
            label: "Traduction littérale",
            value: "Bijou décoré du front",
          },

          {
            label: "Fonction principale",
            value:
              "Bijou porté sur le front lors des cérémonies et mariages",
          },

          {
            label: "Région d’origine",
            value: "Mahdia, Tunisie",
          },

          {
            label: "Époque d’apparition",
            value:
              "Ancienne tradition artisanale tunisienne",
          },

          {
            label: "Matériaux utilisés",
            value:
              "Or, argent, perles et pierres semi-précieuses",
          },

          {
            label: "Structure",
            value:
              "Chaînes métalliques gravées et ornements suspendus",
          },

          {
            label: "Utilisation traditionnelle",
            value:
              "Porté par les femmes lors des mariages et célébrations",
          },

          {
            label: "Signification symbolique",
            value:
              "Symbole de féminité, noblesse et élégance",
          },

          {
            label: "Porté par",
            value:
              "Femmes lors des cérémonies traditionnelles",
          },

          {
            label: "Rôle culturel",
            value:
              "Élément fort du patrimoine culturel de Mahdia",
          },

          {
            label: "Évolution moderne",
            value:
              "Réinterprété dans les collections contemporaines",
          },

          {
            label: "Statut actuel",
            value:
              "Bijou patrimonial encore valorisé dans les cérémonies",
          },

        ];

  const legendsToDisplay =
    legends?.length > 0
      ? legends.map((leg, i) => ({
          number: (i + 1).toString().padStart(2, "0"),
          title: leg.name?.[lang] || leg.name?.fr || "Légende",
          description: leg.shortDescription?.[lang] || leg.shortDescription?.fr || "",
          slug: leg.slug,
        }))
      : [];

  return (

    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* BACKGROUND */}

      <div className="fixed inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)]" />

      {/* TOP BAR */}

      <div className="border-b border-[#D4AF37]/10 bg-black/90 backdrop-blur-xl sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6 py-6">

          <Link
            to="/pieces"
            className="inline-flex items-center gap-3 text-[#d7d2c7] hover:text-[#D4AF37] transition group"
          >

            {dir === "rtl" ? (

              <FiArrowRight className="group-hover:-translate-x-1 transition" />

            ) : (

              <FiArrowLeft className="group-hover:-translate-x-1 transition" />

            )}

            <span className="uppercase tracking-[3px] text-xs">

              Retour

            </span>

          </Link>

        </div>

      </div>

      {/* HERO */}

      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-20 items-start">

        {/* LEFT IMAGE */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          {/* MAIN IMAGE */}

          <div className="relative group mb-6">

            <div className="absolute -inset-3 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />

            <div className="relative rounded-[40px] overflow-hidden border border-[#D4AF37]/20 shadow-[0_0_60px_rgba(0,0,0,0.7)]">

              <img
                src={images[selectedImage]?.url}
                alt={piece.name?.[lang]}
                className="w-full h-[700px] object-cover"
              />

              {/* LEFT ARROW */}

              {images.length > 1 && (

                <button
                  onClick={prevImage}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    w-14
                    h-14
                    rounded-full
                    bg-black/70
                    backdrop-blur-xl
                    border
                    border-[#D4AF37]/30
                    flex
                    items-center
                    justify-center
                    text-white
                    hover:bg-[#D4AF37]
                    hover:text-black
                    transition
                    z-20
                  "
                >

                  <FiChevronLeft size={28} />

                </button>

              )}

              {/* RIGHT ARROW */}

              {images.length > 1 && (

                <button
                  onClick={nextImage}
                  className="
                    absolute
                    right-5
                    top-1/2
                    -translate-y-1/2
                    w-14
                    h-14
                    rounded-full
                    bg-black/70
                    backdrop-blur-xl
                    border
                    border-[#D4AF37]/30
                    flex
                    items-center
                    justify-center
                    text-white
                    hover:bg-[#D4AF37]
                    hover:text-black
                    transition
                    z-20
                  "
                >

                  <FiChevronRight size={28} />

                </button>

              )}

            </div>

          </div>

          {/* THUMBNAILS */}

          {images.length > 1 && (

            <div className="grid grid-cols-4 gap-4">

              {images.map((img, index) => (

                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`
                    overflow-hidden
                    rounded-2xl
                    border
                    transition
                    ${
                      selectedImage === index
                        ? "border-[#D4AF37]"
                        : "border-[#D4AF37]/20"
                    }
                  `}
                >

                  <img
                    src={img.url}
                    alt="gallery"
                    className="w-full h-28 object-cover hover:scale-105 transition duration-500"
                  />

                </button>

              ))}

            </div>

          )}

        </motion.div>

        {/* RIGHT CONTENT */}

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          <p className="uppercase tracking-[0.5em] text-[#D4AF37] text-sm mb-6">

            {piece.period?.[lang] ||
              piece.period?.fr ||
              "Bijou traditionnel"}

          </p>

          <h1 className="text-6xl md:text-7xl font-serif text-[#F5E6C8] mb-10 leading-none">

            {piece.name?.[lang] || piece.name?.fr}

          </h1>

          <div className="w-32 h-[1px] bg-[#D4AF37]/40 mb-10" />

          <p className="text-[#d7d2c7] text-lg leading-[2] max-w-xl">

            {piece.description?.[lang] ||
              piece.description?.fr}

          </p>

        </motion.div>

      </section>

      {/* HISTORICAL SHEET */}

      <section className="max-w-7xl mx-auto px-6 pb-32">

        <div className="text-center mb-20">

          <p className="uppercase tracking-[0.4em] text-[#D4AF37] text-sm mb-5">

            Archive Patrimoniale

          </p>

          <h2 className="text-5xl font-serif text-[#F5E6C8]">

            Fiche Historique

          </h2>

          <div className="w-32 h-[1px] bg-[#D4AF37] mx-auto mt-8" />

        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {historicalData.map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="
                rounded-[32px]
                border
                border-[#D4AF37]/15
                bg-white/[0.03]
                backdrop-blur-2xl
                p-10
                hover:border-[#D4AF37]/40
                transition
              "
            >

              <h3 className="text-[#D4AF37] text-2xl font-serif mb-5">

                {typeof item.label === 'object' ? (item.label?.[lang] || item.label?.fr) : item.label}

              </h3>

              <div className="w-16 h-[1px] bg-[#D4AF37]/30 mb-6" />

              <p className="text-[#E8E0D0] leading-[2] text-[15px]">

                {typeof item.value === 'object' ? (item.value?.[lang] || item.value?.fr) : item.value}

              </p>

            </motion.div>

          ))}

        </div>

      </section>

      {/* TECHNICAL IMAGE */}

      <section className="max-w-7xl mx-auto px-6 pb-36">

        <div className="text-center mb-20">

          <p className="uppercase tracking-[0.4em] text-[#D4AF37] text-sm mb-5">

            Technical Illustration

          </p>

          <h2 className="text-5xl font-serif text-[#F5E6C8] mb-8">

            Fiche Technique

          </h2>

          <div className="w-32 h-[1px] bg-[#D4AF37] mx-auto" />

        </div>

        <div className="relative rounded-[40px] overflow-hidden border border-[#D4AF37]/20 bg-[#111] p-5 shadow-[0_0_60px_rgba(0,0,0,0.7)]">

          <img
            src={piece.technicalImage || images[0]?.url}
            alt="Technique"
            className="w-full rounded-[30px]"
          />

        </div>

      </section>

      {/* INTERACTIVE LEGEND */}

      <section className="max-w-7xl mx-auto px-6 pb-36">

        <div className="text-center mb-20">

          <p className="uppercase tracking-[0.4em] text-[#D4AF37] text-sm mb-5">

            Interactive Anatomy

          </p>

          <h2 className="text-5xl font-serif text-[#F5E6C8]">

            Légende Interactive

          </h2>

          <div className="w-32 h-[1px] bg-[#D4AF37] mx-auto mt-8" />

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {legendsToDisplay.map((legend, index) => (

            <Link
              to={`/legend/${legend.slug}`}
              key={index}
              className="
                rounded-[30px]
                border
                border-[#D4AF37]/15
                bg-white/[0.03]
                p-8
                hover:border-[#D4AF37]/40
                hover:bg-[#D4AF37]/5
                transition
                block
              "
            >

              <div className="w-14 h-14 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-6">

                {legend.number}

              </div>

              <h3 className="text-2xl font-serif text-[#F5E6C8] mb-4">

                {legend.title}

              </h3>

              <p className="text-[#d7d2c7] leading-[1.9]">

                {legend.description}

              </p>

            </Link>

          ))}

        </div>

      </section>

    </main>

  );

};

export default PieceDetailPage;