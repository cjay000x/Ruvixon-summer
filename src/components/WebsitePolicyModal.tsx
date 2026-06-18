import React from "react";
import { motion } from "motion/react";
import { X, Shield, Lock, Eye, Compass } from "lucide-react";

interface WebsitePolicyModalProps {
  onClose: () => void;
}

export default function WebsitePolicyModal({ onClose }: WebsitePolicyModalProps) {
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
          id="btn-close-website-modal"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-20 hover:bg-stone-100 text-stone-900 p-1.5 bg-white border border-sand-200 rounded-full transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header Section */}
        <div className="p-4 sm:p-5 bg-stone-50 border-b border-sand-150">
          <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.25em] font-extrabold text-stone-400">
            <Shield className="w-3 h-3 text-stone-800" />
            <span>Maison Website & Salon Privé Policy</span>
          </div>
          <h2 className="font-serif text-lg tracking-wide text-stone-950 font-normal italic mt-1">
            Maison Terms & Digital Creeds
          </h2>
          <p className="text-[10px] text-stone-500 max-w-sm mt-0.5 leading-normal">
            Governing our online database, customer registrations, and digital salon directories.
          </p>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 max-h-[46vh] overflow-y-auto space-y-4">
          <div className="space-y-3.5 text-left text-xs font-sans text-stone-750">
            {/* Section 1 */}
            <div className="p-3 bg-stone-50 border border-sand-150 space-y-1">
              <h4 className="text-[9px] uppercase font-bold tracking-widest text-stone-900 flex items-center gap-1">
                <Lock className="w-3 h-3 text-stone-900 shrink-0" />
                <span>Security & Client Coordinate Cleansing</span>
              </h4>
              <p className="text-[10px] text-stone-500 leading-relaxed font-sans font-normal">
                Credentials registered inside our Salon Privé directory undergo advanced server encryption. The Maison respects your privacy; physical addresses or coordinate histories are held strictly secure and never sold or shared with external third-party services.
              </p>
            </div>

            {/* Section 2 */}
            <div className="p-3 bg-stone-50 border border-sand-150 space-y-1">
              <h4 className="text-[9px] uppercase font-bold tracking-widest text-stone-900 flex items-center gap-1">
                <Compass className="w-3 h-3 text-stone-900 shrink-0" />
                <span>Waitlist Reservation Conditions</span>
              </h4>
              <p className="text-[10px] text-stone-500 leading-relaxed font-sans font-normal">
                Securing a "Queue Reservation Spot" on this platform does not constitute an instant commercial transaction. It places the client in an elite queue mapping, notifying registered VIP accounts of specific fabric allocation availability prior to global drops.
              </p>
            </div>

            {/* Section 3 */}
            <div className="p-3 bg-stone-50 border border-sand-150 space-y-1">
              <h4 className="text-[9px] uppercase font-bold tracking-widest text-stone-900 flex items-center gap-1">
                <Eye className="w-3 h-3 text-stone-900 shrink-0" />
                <span>Anti-Counterfeiting & Fair Usage</span>
              </h4>
              <p className="text-[10px] text-stone-500 leading-relaxed font-sans font-normal">
                Maison Ruvixon reserves absolute copyright of all catalog patterns, structural coordinate geometries, brand visuals, and digital files. Any mechanical extraction or counterfeiting attempts of our workwear blueprints will trigger legal review actions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-sand-200 flex items-center justify-end">
          <button
            id="btn-website-dismiss"
            onClick={onClose}
            className="bg-black hover:bg-stone-900 text-white font-bold text-[9px] uppercase tracking-widest py-2.5 px-5 rounded-md cursor-pointer transition-colors"
          >
            Acknowledge Digital Creed
          </button>
        </div>
      </motion.div>
    </div>
  );
}
