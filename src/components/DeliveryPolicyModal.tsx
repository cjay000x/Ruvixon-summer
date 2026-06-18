import React from "react";
import { motion } from "motion/react";
import { X, Truck, ShieldCheck, Globe, Star } from "lucide-react";

interface DeliveryPolicyModalProps {
  onClose: () => void;
}

export default function DeliveryPolicyModal({ onClose }: DeliveryPolicyModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs"
      />

      {/* Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 320 }}
        className="w-full max-w-md bg-white border border-sand-200 rounded-xl overflow-hidden shadow-2xl relative z-10 font-sans text-stone-900 mx-4"
      >
        {/* Close Button */}
        <button
          id="btn-close-delivery-modal"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-20 hover:bg-stone-100 text-stone-900 p-1.5 bg-white border border-sand-200 rounded-full transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header Section */}
        <div className="p-4 sm:p-5 bg-stone-50 border-b border-sand-150">
          <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.25em] font-extrabold text-stone-400">
            <Truck className="w-3 h-3 text-stone-800" />
            <span>Maison Delivery & Shipping Status</span>
          </div>
          <h2 className="font-serif text-lg tracking-wide text-stone-950 font-normal italic mt-1">
            Dispatch & Transit Standard
          </h2>
          <p className="text-[10px] text-stone-500 max-w-sm mt-0.5 leading-normal">
            Bespoke logistics managed directly by our custom Parisian atelier coordination desk.
          </p>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 max-h-[46vh] overflow-y-auto space-y-4">
          <div className="space-y-3.5 text-left text-xs font-sans text-stone-750">
            {/* Section 1 */}
            <div className="p-3 bg-stone-50 border border-sand-150 space-y-1">
              <h4 className="text-[9px] uppercase font-bold tracking-widest text-stone-900 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Atelier Dispatch Timeline</span>
              </h4>
              <p className="text-[10px] text-stone-500 leading-relaxed font-sans">
                Each collection piece undergoes intricate, hand-finished assembly. For pre-order commissions of our Summer SS '26 collections, garments are dispatched within <strong>3 to 5 business days</strong> of their serialized production block release.
              </p>
            </div>

            {/* Section 2 */}
            <div className="p-3 bg-stone-50 border border-sand-150 space-y-1">
              <h4 className="text-[9px] uppercase font-bold tracking-widest text-stone-900 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-stone-900 shrink-0" />
                <span>Secure Transit & Courier Escort</span>
              </h4>
              <p className="text-[10px] text-stone-500 leading-relaxed font-sans">
                To guarantee absolute security, orders are encapsulated in temperature-sealed packaging and courier-escorted via premium carriers (DHL Express Jet VIP or FedEx Priority Global). Generous insurance and adult hand-signature validation are required upon arrival.
              </p>
            </div>

            {/* Section 3 */}
            <div className="p-3 bg-stone-50 border border-sand-150 space-y-1">
              <h4 className="text-[9px] uppercase font-bold tracking-widest text-stone-900 flex items-center gap-1">
                <Globe className="w-3 h-3 text-stone-900 shrink-0" />
                <span>Customs Compliance & Global Duties</span>
              </h4>
              <p className="text-[10px] text-stone-500 leading-relaxed font-sans">
                International shipments are processed through pre-cleared logistics alignments. All import taxes, customs, and duty fees are entirely pre-calculated and covered by the Maison to ensure a seamless client luxury coordinate receipt.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-sand-200 flex items-center justify-end">
          <button
            id="btn-delivery-dismiss"
            onClick={onClose}
            className="bg-black hover:bg-stone-900 text-white font-bold text-[9px] uppercase tracking-widest py-2.5 px-5 rounded-md cursor-pointer transition-colors"
          >
            Affirm Logistics Standard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
