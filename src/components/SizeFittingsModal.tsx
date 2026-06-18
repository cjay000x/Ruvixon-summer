import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sliders, Ruler, HelpCircle, CornerDownRight, Check, Sparkles } from "lucide-react";

interface SizeFittingsModalProps {
  onClose: () => void;
}

type CategoryTab = "tops" | "bottoms" | "standards";
type Unit = "inch" | "cm";

interface SizingData {
  size: string;
  chest: number; // inches values
  waist: number;
  shoulders: number;
  sleeves: number;
  hip: number;
  inseam: number;
  length: number;
}

export default function SizeFittingsModal({ onClose }: SizeFittingsModalProps) {
  const [activeTab, setActiveTab] = useState<CategoryTab>("tops");
  const [unit, setUnit] = useState<Unit>("inch");
  const [highlightedSize, setHighlightedSize] = useState<string | null>("M");

  const topsSizes: SizingData[] = [
    { size: "XS", chest: 34, waist: 28, shoulders: 16.5, sleeves: 31.5, hip: 34, inseam: 30, length: 26.5 },
    { size: "S", chest: 37, waist: 31, shoulders: 17.5, sleeves: 32.5, hip: 37, inseam: 30.5, length: 27.5 },
    { size: "M", chest: 40, waist: 34, shoulders: 18.5, sleeves: 33.5, hip: 40, inseam: 31, length: 28.5 },
    { size: "L", chest: 43, waist: 37, shoulders: 19.5, sleeves: 34.5, hip: 43, inseam: 31.5, length: 29.5 },
    { size: "XL", chest: 46, waist: 40, shoulders: 20.5, sleeves: 35.5, hip: 46, inseam: 32, length: 30.5 },
  ];

  const bottomsSizes: SizingData[] = [
    { size: "XS", chest: 0, waist: 27, shoulders: 0, sleeves: 0, hip: 35, inseam: 29.5, length: 39 },
    { size: "S", chest: 0, waist: 30, shoulders: 0, sleeves: 0, hip: 38, inseam: 30, length: 40 },
    { size: "M", chest: 0, waist: 33, shoulders: 0, sleeves: 0, hip: 41, inseam: 30.5, length: 41 },
    { size: "L", chest: 0, waist: 36, shoulders: 0, sleeves: 0, hip: 44, inseam: 31, length: 42 },
    { size: "XL", chest: 0, waist: 39, shoulders: 0, sleeves: 0, hip: 47, inseam: 31.5, length: 43 },
  ];

  const formatVal = (inchesVal: number, currentUnit: Unit) => {
    if (currentUnit === "inch") {
      return `${inchesVal}"`;
    }
    const cmVal = Math.round(inchesVal * 2.54 * 10) / 10;
    return `${cmVal} cm`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs"
      />

      {/* Sizing Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 320 }}
        className="w-full max-w-md bg-white border border-sand-200 rounded-xl overflow-hidden shadow-2xl relative z-10 font-sans text-stone-900 mx-4"
      >
        {/* Close Button */}
        <button
          id="btn-close-sizing-modal"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-20 hover:bg-stone-100 text-stone-900 p-1.5 bg-white border border-sand-200 rounded-full transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header Title Section */}
        <div className="p-4 sm:p-5 bg-stone-50 border-b border-sand-150">
          <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.25em] font-extrabold text-stone-400">
            <Ruler className="w-3 h-3 text-stone-800" />
            <span>Sizing & Fittings</span>
          </div>
          <h2 className="font-serif text-lg tracking-wide text-stone-950 font-normal italic mt-1">
            Atelier Size Dossier
          </h2>
          <p className="text-[10px] text-stone-500 max-w-sm mt-0.5 leading-normal font-sans">
            Garments are structured around an architectural fit formula to ensure a perfect drape.
          </p>
        </div>

        {/* Tab Selection + Units Bar (Super Sleek & Compact) */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-sand-200 bg-white flex flex-col gap-2 justify-between">
          <div className="flex gap-3 border-b border-sand-100 pb-1.5">
            <button
              id="tab-size-tops"
              onClick={() => setActiveTab("tops")}
              className={`text-[10px] uppercase tracking-wider font-semibold pb-0.5 border-b-2 transition-all cursor-pointer ${
                activeTab === "tops"
                  ? "border-black text-stone-950 font-bold"
                  : "border-transparent text-stone-400 hover:text-stone-900"
              }`}
            >
              Tops
            </button>
            <button
              id="tab-size-bottoms"
              onClick={() => setActiveTab("bottoms")}
              className={`text-[10px] uppercase tracking-wider font-semibold pb-0.5 border-b-2 transition-all cursor-pointer ${
                activeTab === "bottoms"
                  ? "border-black text-stone-950 font-bold"
                  : "border-transparent text-stone-400 hover:text-stone-900"
              }`}
            >
              Bottoms
            </button>
            <button
              id="tab-size-standards"
              onClick={() => setActiveTab("standards")}
              className={`text-[10px] uppercase tracking-wider font-semibold pb-0.5 border-b-2 transition-all cursor-pointer ${
                activeTab === "standards"
                  ? "border-black text-stone-950 font-bold"
                  : "border-transparent text-stone-400 hover:text-stone-900"
              }`}
            >
              Standards
            </button>
          </div>

          {/* Unit Toggle Buttons */}
          {activeTab !== "standards" && (
            <div className="flex items-center gap-1 border border-sand-200 bg-stone-50 p-0.5 rounded-md self-end">
              <button
                id="btn-unit-inch"
                onClick={() => setUnit("inch")}
                className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold rounded-sm transition-all cursor-pointer ${
                  unit === "inch" ? "bg-black text-white" : "text-stone-400 hover:text-stone-950"
                }`}
              >
                Inches
              </button>
              <button
                id="btn-unit-cm"
                onClick={() => setUnit("cm")}
                className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold rounded-sm transition-all cursor-pointer ${
                  unit === "cm" ? "bg-black text-white" : "text-stone-400 hover:text-stone-950"
                }`}
              >
                cm
              </button>
            </div>
          )}
        </div>

        {/* Modal Dynamic Content Container - Very Compact */}
        <div className="p-4 sm:p-5 max-h-[38vh] overflow-y-auto">
          {activeTab === "tops" && (
            <div className="space-y-4 text-left">
              {/* Responsive Size Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-[11px]">
                  <thead>
                    <tr className="border-b border-sand-200 text-stone-400 uppercase text-[8px] tracking-widest">
                      <th className="pb-1.5">Size</th>
                      <th className="pb-1.5">Chest</th>
                      <th className="pb-1.5">Shoulder</th>
                      <th className="pb-1.5">Sleeve</th>
                      <th className="pb-1.5">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topsSizes.map((row) => (
                      <tr
                        key={row.size}
                        onClick={() => setHighlightedSize(row.size)}
                        className={`border-b border-sand-100 cursor-pointer transition-colors ${
                          highlightedSize === row.size ? "bg-sand-50/70 font-semibold" : "hover:bg-stone-50"
                        }`}
                      >
                        <td className="py-1.5 font-bold text-stone-950 tracking-wider flex items-center gap-1">
                          {row.size}
                          {highlightedSize === row.size && <span className="w-1 h-1 rounded-full bg-emerald-600 inline-block" />}
                        </td>
                        <td className="py-1.5 font-mono text-stone-600">{formatVal(row.chest, unit)}</td>
                        <td className="py-1.5 font-mono text-stone-600">{formatVal(row.shoulders, unit)}</td>
                        <td className="py-1.5 font-mono text-stone-600">{formatVal(row.sleeves, unit)}</td>
                        <td className="py-1.5 font-mono text-stone-600">{formatVal(row.length, unit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fit Description */}
              <div className="bg-stone-50/70 border border-sand-200 p-3 space-y-1">
                <h4 className="text-[9px] uppercase font-bold tracking-widest text-stone-900 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  <span>Selected Specs: Size {highlightedSize}</span>
                </h4>
                <p className="text-[10px] text-stone-500 leading-normal">
                  Ideal alignment for chest dimensions between{" "}
                  {topsSizes.find((t) => t.size === highlightedSize) ? (
                    <span className="font-mono text-stone-900 font-semibold">
                      {formatVal(topsSizes.find((t) => t.size === highlightedSize)!.chest - 1, unit)} and{" "}
                      {formatVal(topsSizes.find((t) => t.size === highlightedSize)!.chest + 2, unit)}
                    </span>
                  ) : (
                    "standard measures"
                  )}
                  . Drape is relaxed and architectural.
                </p>
              </div>
            </div>
          )}

          {activeTab === "bottoms" && (
            <div className="space-y-4 text-left">
              {/* Responsive Size Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-[11px]">
                  <thead>
                    <tr className="border-b border-sand-200 text-stone-400 uppercase text-[8px] tracking-widest">
                      <th className="pb-1.5">Size</th>
                      <th className="pb-1.5">Waist</th>
                      <th className="pb-1.5">Hip</th>
                      <th className="pb-1.5">Inseam</th>
                      <th className="pb-1.5">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bottomsSizes.map((row) => (
                      <tr
                        key={row.size}
                        onClick={() => setHighlightedSize(row.size)}
                        className={`border-b border-sand-100 cursor-pointer transition-colors ${
                          highlightedSize === row.size ? "bg-sand-50/70 font-semibold" : "hover:bg-stone-50"
                        }`}
                      >
                        <td className="py-1.5 font-bold text-stone-950 tracking-wider flex items-center gap-1">
                          {row.size}
                          {highlightedSize === row.size && <span className="w-1 h-1 rounded-full bg-emerald-600 inline-block" />}
                        </td>
                        <td className="py-1.5 font-mono text-stone-600">{formatVal(row.waist, unit)}</td>
                        <td className="py-1.5 font-mono text-stone-600">{formatVal(row.hip, unit)}</td>
                        <td className="py-1.5 font-mono text-stone-600">{formatVal(row.inseam, unit)}</td>
                        <td className="py-1.5 font-mono text-stone-600">{formatVal(row.length, unit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottoms Fit Details */}
              <div className="bg-stone-50/70 border border-sand-200 p-3 space-y-1">
                <h4 className="text-[9px] uppercase font-bold tracking-widest text-stone-900 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  <span>Highlighted Size: {highlightedSize}</span>
                </h4>
                <p className="text-[10px] text-stone-500 leading-normal">
                  Fits true to modern tailoring. Designed with a clean, fluid mid-to-high rise configurations for pristine stacking on boots.
                </p>
              </div>
            </div>
          )}

          {activeTab === "standards" && (
            <div className="space-y-4 text-left">
              <div>
                <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-stone-900 flex items-center gap-1">
                  <CornerDownRight className="w-3.5 h-3.5 text-stone-900" />
                  <span>SS '26 Tailoring Creed</span>
                </h4>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-1 pl-3 border-l border-sand-200 font-sans">
                  Crafted from hand-selected 100% Organic flax linens and raw heavy denims.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="bg-stone-50/50 p-2.5 border border-sand-150">
                  <h5 className="text-[10px] font-bold text-stone-950">Zero-Stretch Fiber</h5>
                  <p className="text-[10px] text-stone-500 leading-normal">
                    Preserves structural integrity for decades without spandex. Drapes beautifully with time.
                  </p>
                </div>

                <div className="bg-stone-50/50 p-2.5 border border-sand-150">
                  <h5 className="text-[10px] font-bold text-stone-950">Steamed / Pre-shrunk</h5>
                  <p className="text-[10px] text-stone-500 leading-normal">
                    Fabrics undergo pre-cutting sanforization. Expect less than 1% variance when dry-cleaned or hand-washed cold.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions - Compact */}
        <div className="p-4 bg-stone-50 border-t border-sand-200 flex items-center justify-end">
          <button
            id="btn-sizing-dismiss"
            onClick={onClose}
            className="bg-black hover:bg-stone-900 text-white font-bold text-[9px] uppercase tracking-widest py-2 px-5 rounded-md cursor-pointer"
          >
            Acknowledge alignment
          </button>
        </div>
      </motion.div>
    </div>
  );
}
