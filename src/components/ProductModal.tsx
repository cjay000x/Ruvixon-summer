import React, { useState } from "react";
import { Product, User } from "../types";
import { motion } from "motion/react";
import { X, Heart, ShieldCheck, HelpCircle, Calendar, Sparkles, Check, Ruler } from "lucide-react";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  isInRegistry: boolean;
  onToggleRegistry: () => void;
  onOpenSizeGuide?: () => void;
  currentUser?: User | null;
  onPlaceOrder?: (product: Product) => Promise<any>;
}

export default function ProductModal({
  product,
  onClose,
  isInRegistry,
  onToggleRegistry,
  onOpenSizeGuide,
  currentUser,
  onPlaceOrder,
}: ProductModalProps) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [authNeededWarning, setAuthNeededWarning] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleWaitlistRegistration = () => {
    if (!isInRegistry) {
      onToggleRegistry();
    }
    setShowSuccessToast(true);
    setAuthNeededWarning(false);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const handleAcquireClick = async () => {
    if (!currentUser) {
      setAuthNeededWarning(true);
      return;
    }

    setAuthNeededWarning(false);
    setPlacingOrder(true);
    try {
      if (onPlaceOrder) {
        const result = await onPlaceOrder(product);
        if (result && result.success) {
          setOrderDetails(result.order);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-3xl bg-white border border-sand-200 rounded-sm overflow-hidden shadow-2xl relative z-10 grid md:grid-cols-2 max-h-[90vh] md:max-h-[80vh]"
      >
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 bg-white/80 hover:bg-white text-stone-900 p-2 rounded-none cursor-pointer shadow border border-sand-200 hover:scale-105 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Panel */}
        <div className="relative h-64 md:h-full bg-sand-100">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-none text-[9px] uppercase tracking-[0.15em] font-bold shadow-lg">
            <Sparkles className="w-3 h-3 text-stone-300" />
            <span>Prototype Model</span>
          </div>
        </div>

        {/* Product Details Panel */}
        <div className="p-6 md:p-8 overflow-y-auto flex flex-col justify-between h-[450px] md:h-full">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] tracking-[0.2em] font-semibold text-stone-400 uppercase font-sans">
                Atelier Series SS '26
              </p>
              <h3 className="font-serif text-xl tracking-wide font-normal text-stone-950 mt-1 leading-tight italic">
                {product.name}
              </h3>
              <p className="font-serif italic text-xs text-stone-400 mt-0.5">
                Fabric Formulation: {product.materials}
              </p>
            </div>

            <div className="flex items-baseline gap-2 pb-3 border-b border-sand-100 font-sans">
              <span className="font-mono text-sm text-stone-400 line-through">
                Est. ${(product.price * 1.2).toLocaleString()}
              </span>
              <span className="font-mono text-lg font-bold text-stone-900">
                Waitlist Est: ${product.price.toLocaleString()}
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-stone-900">Curatorial Narrative</h4>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">
                {product.description}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-stone-900">Couture Specifications</h4>
              <ul className="text-xs text-stone-500 space-y-1 pl-4 list-disc font-sans">
                {product.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
              {onOpenSizeGuide && (
                <button
                  id="btn-open-size-guide-modal"
                  onClick={onOpenSizeGuide}
                  className="mt-2 text-[10px] uppercase tracking-widest font-bold text-stone-850 hover:text-stone-500 border-b border-stone-850 hover:border-stone-500 pb-0.5 transition-all flex items-center gap-1 cursor-pointer font-sans"
                >
                  <Ruler className="w-3 h-3 text-stone-900" />
                  <span>Size & Fitting Standard Guide</span>
                </button>
              )}
            </div>

            {orderDetails ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-stone-900 border border-gold-500/30 p-4.5 rounded-xl text-left space-y-3.5 mt-3 shadow-xl"
              >
                <div className="flex items-center gap-2 text-gold-400">
                  <Sparkles className="w-4.5 h-4.5" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Commission Registered Successfully</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-stone-300 font-sans leading-normal">
                    This signature creation has been secured under your account. A dedicated handcraft slot is allocated to your commission tag on our mainframe.
                  </p>
                  <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-850 flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[8px] uppercase text-stone-500 tracking-wider font-mono block">COMMISSION ID</span>
                      <span className="font-mono text-xs font-bold text-amber-200">{orderDetails.id}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(orderDetails.id);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2500);
                      }}
                      className="bg-stone-900 border border-stone-800 text-amber-200 hover:bg-stone-800 text-[8.5px] uppercase tracking-widest font-bold px-2.5 py-1 rounded transition-colors cursor-pointer select-none"
                    >
                      {copiedCode ? "✓ Copied" : "Copy Code"}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] italic text-stone-400 font-serif">
                  Paste this ID in the "Size & Fit & TRACK" portal to follow your garment's craft metrics.
                </p>
              </motion.div>
            ) : (
              <div className="bg-sand-50 p-3.5 rounded-xl flex items-start gap-2.5 border border-sand-200">
                <Calendar className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-900">Estimated Delivery</p>
                  <p className="text-[11px] text-stone-500 leading-normal font-sans">
                    "Summer collection is about to drop soon." Early waitlisted items are estimated to ship in Autumn 2026.
                  </p>
                </div>
              </div>
            )}

            {authNeededWarning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-amber-50 border border-amber-200 p-4.5 rounded-xl text-left space-y-2 mt-3"
              >
                <div className="flex items-center gap-2 text-stone-950 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] uppercase tracking-widest font-sans">Authentication Coordinates Required</span>
                </div>
                <p className="text-[10.5px] text-stone-600 font-sans leading-relaxed">
                  Please establish or access your complimentary <strong>Salon Privé account</strong> inside the <strong>"Maison" menu</strong> to securely log in, earn points, and initiate bespoke dispatch tracking operations.
                </p>
              </motion.div>
            )}

            {showSuccessToast && !orderDetails && (
              <div className="bg-emerald-50 border border-emerald-200/50 p-3 rounded-none flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-800 font-sans leading-normal">
                  Private waitlist position serialized! Authenticate with your Salon Privé account or leave your email in the Collection form to lock in your priority drop queue.
                </p>
              </div>
            )}
          </div>

          {!orderDetails && (
            <div className="pt-6 flex flex-col gap-3.5 border-t border-sand-150 mt-4">
              <div className="grid grid-cols-4 gap-2">
                {/* Toggle Registry Button */}
                <button
                  id={`btn-modal-registry-${product.id}`}
                  onClick={onToggleRegistry}
                  className={`col-span-1 border rounded-lg flex items-center justify-center p-2.5 transition-all cursor-pointer ${
                    isInRegistry
                      ? "border-amber-600 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "border-sand-200 hover:border-black text-stone-400 hover:text-stone-900 bg-white"
                  }`}
                  title={isInRegistry ? "Remove from Registry" : "Add to Registry"}
                >
                  <Heart className={`w-5 h-5 ${isInRegistry ? "fill-amber-600 text-amber-600" : ""}`} />
                </button>

                {/* Waitlist Enlist Button */}
                <button
                  id={`btn-modal-waitlist-${product.id}`}
                  onClick={handleWaitlistRegistration}
                  className="col-span-3 bg-white hover:bg-stone-50 text-stone-900 border border-sand-300 py-3 rounded-lg text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-stone-500" />
                  <span>{isInRegistry ? "Waitlist Registered" : "Request Priority Waitlist"}</span>
                </button>
              </div>

              {/* Directly Acquire & Dispatch simulated order */}
              <button
                id={`btn-modal-acquire-${product.id}`}
                onClick={handleAcquireClick}
                disabled={placingOrder}
                className="w-full bg-stone-950 hover:bg-stone-900 text-white py-3 px-4 rounded-lg text-xs uppercase tracking-[0.16em] font-extrabold transition-all outline-none flex items-center justify-center gap-2 cursor-pointer shadow-md border border-stone-950 disabled:opacity-40"
              >
                {placingOrder ? (
                  <span>Serializing Slots...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-gold-300" />
                    <span>Secure Piece & Initiate Dispatch</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
