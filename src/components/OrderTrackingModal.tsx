import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Search,
  Package,
  Scissors,
  CheckCircle2,
  Clock,
  Compass,
  AlertCircle,
  Truck,
  RotateCw,
  Sparkles,
  Award,
  Globe,
  Fingerprint,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Check
} from "lucide-react";
import { User } from "../types";

interface OrderTrackingModalProps {
  onClose: () => void;
  currentUser: User | null;
}

interface TrackingStep {
  title: string;
  description: string;
  status: "completed" | "active" | "pending";
  timestamp?: string;
  // Redesigned: deep premium metadata accessible via interactive clicks
  artisan?: string;
  metrics?: string;
  location?: string;
  notes?: string;
}

interface SimulatedOrder {
  id: string;
  itemName: string;
  materials: string;
  orderDate: string;
  currentStepName: string;
  price: number;
  weightClass?: string;
  tailorTeam?: string;
  steps: TrackingStep[];
}

export default function OrderTrackingModal({ onClose, currentUser }: OrderTrackingModalProps) {
  const [activeTab, setActiveTab] = useState<"atelier" | "dispatch">("atelier");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeOrder, setActiveOrder] = useState<SimulatedOrder | null>(null);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(4); // Default to active step
  const [expandedAtelierItem, setExpandedAtelierItem] = useState<string | null>("prod-cocoa-grid");

  // Preloaded elite historical specimens for simulation
  const sampleOrders: Record<string, SimulatedOrder> = {
    "RVX-GRID-2026": {
      id: "RVX-GRID-2026",
      itemName: "The Cocoa Grid Atelier Coordinates",
      materials: "100% Cocoa Organic Linen Grid",
      orderDate: "June 14, 2026 - 10:15 AM",
      currentStepName: "Maison Hardware & Engraving",
      price: 2450,
      weightClass: "450 GSM Heavy Linen Structural Drape",
      tailorTeam: "Atelier No. 4 (Rive Gauche Tailors)",
      steps: [
        { 
          title: "Atelier Serialization Registry", 
          description: "VIP queue reservation authorized. Commission ID registered and cryptographic signature established on Paris mainframe.", 
          status: "completed", 
          timestamp: "June 14, 2026 - 10:30 AM",
          artisan: "System Coordinator Marc-A.",
          metrics: "Registry Block Verified - ID 08A",
          location: "Prisme Headquarters, Paris Route",
          notes: "Priority early-access spot reserved for elite tier invitation."
        },
        { 
          title: "Fabric Core Selection", 
          description: "450 GSM organic dense flax weave hand-inspected under high magnifying light.", 
          status: "completed", 
          timestamp: "June 14, 2026 - 04:12 PM",
          artisan: "Master Weaver Michel R.",
          metrics: "Loom Selection Checked - 100% Raw Flax",
          location: "Textile Archive Suite, Lyon No. 2",
          notes: "Ensured flawless square alignment of the high-contrast cocoa grids."
        },
        { 
          title: "Architectural Pattern Cutting", 
          description: "Laying out geometrical lines. Material sheared using specialized ultra-fine laser cutters.", 
          status: "completed", 
          timestamp: "June 15, 2026 - 09:00 AM",
          artisan: "Lead Pattern Cutter Jean-Yves C.",
          metrics: "Laser Path Alignment: +/- 0.02mm Deviation",
          location: "Starlight Drafting Laboratory",
          notes: "Pristine boxy crop orientation cut matching wide-leg pocket drapes."
        },
        { 
          title: "Triple-Needle Stitchwork", 
          description: "Heavy cuffs, reinforced double-join hems and pocket parameters stitched by artisan hands.", 
          status: "completed", 
          timestamp: "June 16, 2026 - 02:45 PM",
          artisan: "Senior Tailor Albert de L.",
          metrics: "18,400 Precision Reinforced Lockstitches",
          location: "Couture Sewing Block No. 3",
          notes: "Utilized premium structural off-white cream heavy thread lines."
        },
        { 
          title: "Maison Hardware & Engraving", 
          description: "Fastening custom solid brass button arrays and stamping the R logo details.", 
          status: "active", 
          timestamp: "In active workflow lines",
          artisan: "Engraving Specialist Henri G.",
          metrics: "Solid Brass Rivets - 12 Stamped Selections",
          location: "Aeros Hardware Workshop",
          notes: "Fastening adjustable waist side tabs and engraving premium hardware."
        },
        { 
          title: "DHL Jet VIP Courier Escort", 
          description: "Sealing in bespoke dust bag and custom hardboard cases. Global dispatch with sign-on-delivery tracking.", 
          status: "pending",
          artisan: "Logistics Escort Lead Lucas M.",
          metrics: "Pre-cleared DHL Priority Global Air cargo",
          location: "Roissy Charles de Gaulle Terminal",
          notes: "Delivery pre-clearance scheduled. Hand-verified Signature required."
        }
      ]
    },
    "RVX-DENIM-781": {
      id: "RVX-DENIM-781",
      itemName: "The Indigo West Utility Set",
      materials: "Heavy Washed Indigo Cotton Denim",
      orderDate: "June 08, 2026 - 03:22 PM",
      currentStepName: "Signed for & Dispatched",
      price: 2800,
      weightClass: "14.5oz Pre-washed Rigid Denim",
      tailorTeam: "Atelier No. 1 (Denim Lab Supervisor)",
      steps: [
        { 
          title: "Atelier Serialization Registry", 
          description: "VIP queue reservation authorized. Commission ID registered and cryptographic signature established on Paris mainframe.", 
          status: "completed", 
          timestamp: "June 08, 2026 - 03:45 PM",
          artisan: "System Coordinator Marc-A.",
          metrics: "Registry Block Verified - ID 01B",
          location: "Prisme Headquarters, Paris Route",
          notes: "Exclusive prototype allocation secured.",
        },
        { 
          title: "Fabric Core Selection", 
          description: "Rigid heavy-weight 100% organic cotton denim rolls collected in atelier.", 
          status: "completed", 
          timestamp: "June 08, 2026 - 06:10 PM",
          artisan: "Weft Selector Pierre V.",
          metrics: "Warp Density Ratio: 98.4%",
          location: "Deep Archive Loom Vault",
          notes: "Ensured intense indigo wash consistency and gold pairing thread.",
        },
         { 
          title: "Architectural Pattern Cutting", 
          description: "Structural panels carved accurately with double-inseam spacing.", 
          status: "completed", 
          timestamp: "June 09, 2026 - 11:30 AM",
          artisan: "Senior Cutter Clara S.",
          metrics: "Cut Geometry Index: Triple Saddle Outline",
          location: "Starlight Drafting Laboratory",
          notes: "Ensures slouchy tailored boxy drape sits nicely at shoulders.",
        },
         { 
          title: "Triple-Needle Stitchwork", 
          description: "Full structural joint stitching, flat lock hems, & pocket setup.", 
          status: "completed", 
          timestamp: "June 11, 2026 - 04:20 PM",
          artisan: "Senior Tailor Albert de L.",
          metrics: "24,800 Premium Gold Thread Lockstitches",
          location: "Couture Sewing Block No. 3",
          notes: "Triple needle flat-felled side joints hand aligned.",
        },
        { 
          title: "Maison Hardware & Engraving", 
          description: "Securing custom copper studs & R-engraved waistband details.", 
          status: "completed", 
          timestamp: "June 12, 2026 - 01:15 PM",
          artisan: "Engraving Specialist Henri G.",
          metrics: "Pure Copper Hardware Arrays Mounted",
          location: "Aeros Hardware Workshop",
          notes: "Belt loop locks pressed perfectly.",
        },
        { 
          title: "DHL Jet VIP Courier Escort", 
          description: "Sealed in dust protection. Delivered from Lyon, transit checked, and signed by client.", 
          status: "completed", 
          timestamp: "June 15, 2026 - 10:44 AM",
          artisan: "VIP Cargo Hand-Courier Maxence T.",
          metrics: "Sealed Case Signature Complete - Paris CDG Flight",
          location: "Delivered to Client (Paris, FR)",
          notes: "Signed and handed to verified Salon Privé member on-site.",
        }
      ]
    }
  };

  // Active creations inside our luxury workshop
  const ATELIER_CREATIONS = [
    {
      id: "prod-cocoa-grid",
      name: "The Cocoa Grid Atelier Coordinates",
      materials: "100% Cocoa Organic Linen Grid",
      progress: 92,
      statusText: "Final Fits & Hardware Plating",
      etaDrop: "Autumn 2026 Collection Drop",
      narrative: "Our master tailors are presently hand-stitching final reinforcement parameters around the cream drawstrings. Custom-stamped pure brass rivets are compressed precisely.",
      phases: [
        { name: "Fiber Sourcing", desc: "Premium organic cocoa long-staple flax selected.", done: true },
        { name: "Structural Shearing", desc: "Laser-aligned high-contrast pattern alignment.", done: true },
        { name: "缝制 Core Tailoring", desc: "Triple-needle structural joint seams closed.", done: true },
        { name: "Hardware Embossing", desc: "Clamping custom solid brass button arrays.", active: true },
        { name: "Digital Drop Release", desc: "Launching into luxury registry catalog.", pending: true }
      ]
    },
    {
      id: "prod-indigo-west",
      name: "The Indigo West Utility Set",
      materials: "Cocoa Grid Flax & Heavy Indigo Denim",
      progress: 58,
      statusText: "Double-Join Denim Reinforcement",
      etaDrop: "Autumn 2026 Collection Drop",
      narrative: "Pattern plates are locked. Artisans are currently applying dense gold contrast saddle stitches and stamping the double waistband buttons.",
      phases: [
        { name: "Fiber Sourcing", desc: "14.5oz heavy unwashed indigo raw cotton selected.", done: true },
        { name: "Structural Shearing", desc: "Drafting boxy crop orientation outlines.", done: true },
        { name: "缝制 Core Tailoring", desc: "Sewing custom triple-needle flat-locks.", active: true },
        { name: "Hardware Embossing", desc: "Applying signature copper studs.", pending: true },
        { name: "Digital Drop Release", desc: "Launching into luxury registry catalog.", pending: true }
      ]
    },
    {
      id: "prod-midnight-drape",
      name: "The Midnight Drape Blouson",
      materials: "Paris Corded Twill & Obsidian Satin",
      progress: 15,
      statusText: "Material Harvest & Fiber Pairing",
      etaDrop: "Design Laboratory Phase (Spring '27)",
      narrative: "Our head textile selector is harvesting premium French twill textiles, pairing them under specific lighting with liquid obsidian satin swatches.",
      phases: [
        { name: "Fiber Sourcing", desc: "Collecting high-density Parisian twill bolts.", active: true },
        { name: "Structural Shearing", desc: "Formforming fluid satin drapes.", pending: true },
        { name: "缝制 Core Tailoring", desc: "Stitching delicate inside satin borders.", pending: true },
        { name: "Hardware Embossing", desc: "Installing oxidized gunmetal pulls.", pending: true },
        { name: "Digital Drop Release", desc: "Launching into luxury registry catalog.", pending: true }
      ]
    }
  ];

  const handleLookup = (id: string) => {
    setError("");
    setLoading(true);
    const upperId = id.trim().toUpperCase();

    // Reset step focus
    setSelectedStepIndex(null);

    setTimeout(() => {
      // 1. Search sample orders
      if (sampleOrders[upperId]) {
        setActiveOrder(sampleOrders[upperId]);
        // Focus the active step specifically
        const activeIdx = sampleOrders[upperId].steps.findIndex(s => s.status === "active");
        setSelectedStepIndex(activeIdx !== -1 ? activeIdx : sampleOrders[upperId].steps.length - 1);
        setLoading(false);
        return;
      }

      // 2. Search logged-in user's orders (e.g. freshly generated at checkout)
      if (currentUser && currentUser.orders) {
        const matchingOrder = currentUser.orders.find(
          (o: any) => o.id.toUpperCase() === upperId || o.id.toUpperCase().includes(upperId)
        );

        if (matchingOrder) {
          const dateStr = matchingOrder.orderDate
            ? new Date(matchingOrder.orderDate).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
            : "Authorized Live";

          const dynamicSteps: TrackingStep[] = [
            {
              title: "Atelier Serialization Registry",
              description: "VIP queue reservation secured. Commission registered and cryptographic signature established on Paris mainframe.",
              status: "completed",
              timestamp: dateStr,
              artisan: "Mainframe Automation Node B",
              metrics: "Secure Socket Registered - 128 bit",
              location: "Prisme Headquarters, Paris Route",
              notes: "Synchronized directly with your Member Profile email account."
            },
            {
              title: "Material Sourcing & Allocation",
              description: "Selecting premium high-density coordinates fibre rolls matching your order specification.",
              status: "completed",
              timestamp: "Completed - June 18, 2026",
              artisan: "Weaver Michel R.",
              metrics: "Loom Selection - 100% Organic Flawless Check",
              location: "Deep Archive Loom Vault",
              notes: "Yarn alignment checked for high structural drape retention."
            },
            {
              title: "Structural Pattern Cutting",
              description: "Specialized ultra-fine laser guidelines cut precise panels at the drafting laboratory.",
              status: "active",
              timestamp: "In active workflow lines",
              artisan: "Cutter Jean-Yves C.",
              metrics: "Laser Path Alignment: Perfect",
              location: "Starlight Drafting Laboratory",
              notes: "Drafting crop contour coordinates. Inseams balanced perfectly."
            },
            {
              title: "Triple-Needle Stitchwork",
              description: "Double reinforcing joints stitched by hand-operating tailors on site.",
              status: "pending",
              artisan: "Tailor Albert de L.",
              metrics: "16,000+ stitches scheduled",
              location: "Couture Sewing Block No. 3",
              notes: "Will use luxury heavy-gauge off-white linen thread."
            },
            {
              title: "Maison Hardware & Engraving",
              description: "Mounting custom copper rivets and R logo hardware details.",
              status: "pending",
              artisan: "Engraving Specialist Henri G.",
              metrics: "Solid brass rivets selected",
              location: "Aeros Hardware Workshop",
              notes: "Waist tabs adjustment settings will be hand-tested."
            },
            {
              title: "DHL Jet VIP Courier Escort",
              description: "Protective boutique cases. Verified hand-delivered air freight transit with client signature verification.",
              status: "pending",
              artisan: "CDG Terminal Dispatch",
              metrics: "Air Cargo Slot Reserved",
              location: "Roissy CDG Airport Warehouse",
              notes: "Final dispatch checks will occur upon atelier sign-off."
            }
          ];

          setActiveOrder({
            id: matchingOrder.id,
            itemName: matchingOrder.item?.name || "Bespoke Specimen Coordinates",
            materials: matchingOrder.item?.materials || "Luxury Organic Loom Select",
            orderDate: dateStr,
            currentStepName: matchingOrder.status || "Atelier Verification Active",
            price: matchingOrder.item?.price || 2450,
            weightClass: "450 GSM Heavy Flaxon",
            tailorTeam: "Atelier No. 2 (Couture Division)",
            steps: dynamicSteps
          });

          setSelectedStepIndex(2); // Focus pattern cutting (active)
          setLoading(false);
          return;
        }
      }

      // 3. Dynamic simulator fallback for novel alphanumeric tracking numbers
      if (upperId.length >= 4) {
        const seedValue = upperId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const randPrice = 1800 + (seedValue % 12) * 150;
        const currentActiveStep = (seedValue % 3) + 1; // index 1, 2, or 3

        const simulatedSteps: TrackingStep[] = [
          {
            title: "Atelier Serialization Registry",
            description: "VIP queue reservation secured. Aligned correctly in private database queue.",
            status: "completed",
            timestamp: "Authenticated Securely",
            artisan: "System Coordinator Marc-A.",
            metrics: "Queue Block verified on mainframe",
            location: "Prisme Headquarters, Paris Route",
            notes: "Commission assigned secure slot hash."
          },
          {
            title: "Material Sourcing & Allocation",
            description: "Collecting organic fibers from French mills.",
            status: "completed",
            timestamp: "Completed",
            artisan: "Weft Selector Pierre V.",
            metrics: "Loom Certified 100% Cotton Weave",
            location: "Deep Archive Loom Vault",
            notes: "Strict testing of textile strength and weave uniformity."
          },
          {
            title: "Structural Pattern Cutting",
            description: "Shearing heavy-weave structural outlines.",
            status: currentActiveStep >= 2 ? "completed" : "active",
            timestamp: currentActiveStep >= 2 ? "Completed" : "In process",
            artisan: "Cutter Jean-Yves C.",
            metrics: "Cut coordinates calculated based on standard sizing",
            location: "Starlight Drafting Laboratory",
            notes: "Precise drafting metrics for high-end structure alignment."
          },
          {
            title: "Triple-Needle Stitchwork",
            description: "Reinforcing seams and tailoring shoulder parameters.",
            status: currentActiveStep === 3 ? "completed" : currentActiveStep === 2 ? "active" : "pending",
            timestamp: currentActiveStep >= 2 ? "In active workflow lines" : undefined,
            artisan: "Couture Team No. 2",
            metrics: "Aesthetic heavy stitch alignment check",
            location: "Couture Sewing Block No. 3",
            notes: "Double-join seam parameters enforced."
          },
          {
            title: "Maison Hardware & Engraving",
            description: "Embossing logo details and metal fastener settings.",
            status: "pending",
            artisan: "Artisan Hardwarer Henri G.",
            metrics: "Secure brass tabs selected",
            location: "Aeros Hardware Workshop",
            notes: "Pending core body stitch completions."
          },
          {
            title: "DHL Jet VIP Courier Escort",
            description: "Secured cargo transit under signature handover protocols.",
            status: "pending",
            artisan: "Escort Hub Courier",
            metrics: "Sealed Case Shipping Box No. 1",
            location: "Paris CDG airport warehouse",
            notes: "Signature validation mandatory on delivery."
          }
        ];

        setActiveOrder({
          id: upperId,
          itemName: seedValue % 2 === 0 ? "Bespoke Structural Over-Tunic" : "Paris Masterwork Coordinate Crop",
          materials: seedValue % 2 === 0 ? "100% Corded French Twill Grid" : "Washed Natural Raw Linen Flax",
          orderDate: "Simulated Live Coordinates",
          currentStepName: "Active Handcrafting Stage",
          price: randPrice,
          weightClass: "450 GSM Mid-Heavy Linen",
          tailorTeam: "Atelier No. 3 (Modernist Division)",
          steps: simulatedSteps
        });

        setSelectedStepIndex(currentActiveStep);
        setLoading(false);
        return;
      }

      setError("Please input a valid Alphanumeric Code (e.g. RVX-GRID-2026 or a check-out order ID).");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/85 backdrop-blur-xs select-none"
      />

      {/* Modernist Premium Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 35 }}
        transition={{ type: "spring", damping: 28, stiffness: 330 }}
        className="w-full max-w-4xl bg-[#FAF9F6] border border-stone-200 rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(30,25,20,0.18)] relative z-10 font-sans text-stone-900 mx-4 flex flex-col h-[85vh]"
      >
        {/* Luxury top accent lines */}
        <div className="h-1 w-full bg-gradient-to-r from-stone-250 via-amber-200 to-stone-400 shrink-0" />

        {/* Close Button */}
        <button
          id="btn-close-tracking-modal"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 hover:bg-stone-100 text-stone-950 p-2 bg-white/90 border border-stone-200/55 rounded-full transition-all cursor-pointer shadow-sm select-none"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Section */}
        <div className="p-6 bg-[#FAF9F6] border-b border-stone-200/60 shrink-0 relative">
          <div className="absolute right-16 top-6 hidden md:flex items-center gap-2 select-none">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-stone-400 uppercase font-bold">Mainframe Synced Live</span>
          </div>

          <div className="flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.22em] font-extrabold text-amber-700 select-none">
            <Fingerprint className="w-4 h-4 text-stone-950" />
            <span>Maison Coordinates Central Control</span>
          </div>
          <h2 className="font-serif text-2xl tracking-tight text-stone-950 mt-1.5 font-bold italic">
            Atelier Progress & Order Tracker
          </h2>

          {/* Tab Selector Button Grid */}
          <div className="flex bg-stone-200/50 p-1 rounded-xl mt-4 max-w-sm select-none">
            <button
              onClick={() => {
                setActiveTab("atelier");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-[9.5px] uppercase tracking-wider font-extrabold rounded-lg transition-all cursor-pointer ${
                activeTab === "atelier"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-950 hover:bg-stone-200/30"
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Fabrication & Drops</span>
            </button>
            <button
              onClick={() => setActiveTab("dispatch")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-[9.5px] uppercase tracking-wider font-extrabold rounded-lg transition-all cursor-pointer ${
                activeTab === "dispatch"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-950 hover:bg-stone-200/30"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Courier Dispatch</span>
            </button>
          </div>
        </div>

        {/* Scrollable Core Workspace */}
        <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col md:flex-row gap-6">
          {activeTab === "atelier" ? (
            // ================== TAB 1: WORKSHOP FABRICATION BAR PROGRESS ==================
            <div className="w-full flex flex-col lg:flex-row gap-6">
              
              {/* Left Column: Interactive Garment Selection */}
              <div className="flex-1 space-y-4">
                <div className="bg-stone-50 p-4 border border-sand-200 rounded-xl space-y-1.5 select-none text-left">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[8.5px] uppercase tracking-wider text-stone-900 font-extrabold">Atelier Laboratory Pipeline report</span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
                    Every Ruvixon garment passes through a strict sequential multi-stage inspection. Click on any model below to synchronize progress bars and view microwork metrics.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {ATELIER_CREATIONS.map((creation) => {
                    const isExpanded = expandedAtelierItem === creation.id;
                    return (
                      <div
                        key={creation.id}
                        onClick={() => setExpandedAtelierItem(creation.id)}
                        className={`text-left rounded-xl border border-stone-200/65 transition-all cursor-pointer ${
                          isExpanded
                            ? "bg-[#FAF9F6] border-stone-900/60 shadow-lg p-5 space-y-4"
                            : "bg-white hover:bg-stone-50/50 p-4 flex justify-between items-center"
                        }`}
                      >
                        {isExpanded ? (
                          // Full Detail layout for selected garment
                          <div className="space-y-4">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <span className="text-[8.5px] font-mono uppercase bg-stone-900 border border-stone-850 text-gold-300 px-2 py-0.5 rounded-sm tracking-wider font-bold">
                                  {creation.statusText}
                                </span>
                                <h4 className="font-serif italic font-bold text-base text-stone-950 mt-1">{creation.name}</h4>
                                <p className="text-[9.5px] text-stone-400 font-mono tracking-wider">{creation.materials}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-mono font-extrabold text-stone-950 block">{creation.progress}% COMPLETE</span>
                                <span className="text-[9.5px] tracking-wider text-amber-700 font-extrabold block mt-1 uppercase">{creation.etaDrop}</span>
                              </div>
                            </div>

                            {/* Beautiful Graphic percentage bar */}
                            <div className="relative pt-1">
                              <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-stone-200/80 border border-stone-100">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${creation.progress}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="shadow-inner flex flex-col text-center whitespace-nowrap justify-center bg-stone-950"
                                />
                              </div>
                            </div>

                            <p className="text-[11px] text-stone-500 leading-relaxed pl-3 border-l-2 border-stone-950 font-sans italic opacity-90">
                              "{creation.narrative}"
                            </p>

                            {/* Stage Indicators */}
                            <div className="pt-2">
                              <span className="text-[8px] uppercase tracking-wider text-stone-400 font-bold block mb-2.5">STAGE SEQUENCER</span>
                              <div className="grid grid-cols-5 gap-1.5">
                                {creation.phases.map((ph, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-2 rounded-lg border text-left flex flex-col justify-between ${
                                      ph.done
                                        ? "bg-stone-950 text-white border-stone-950"
                                        : ph.active
                                        ? "bg-amber-500 border-amber-600 text-stone-950 animate-pulse font-bold"
                                        : "bg-white text-stone-300 border-stone-200"
                                    }`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="text-[7.5px] font-mono font-bold block">0{idx + 1}</span>
                                      {ph.done && <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[4]" />}
                                    </div>
                                    <p className="text-[9px] font-bold tracking-tight -mb-0.5 mt-0.5 truncate">{ph.name}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Compact collapsed line
                          <>
                            <div className="space-y-0.5">
                              <h4 className="font-serif italic font-bold text-[13.5px] text-stone-900">{creation.name}</h4>
                              <span className="text-[9.5px] uppercase tracking-wider text-stone-400 font-bold">
                                Current stage: <strong className="text-stone-700 font-semibold">{creation.statusText}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="text-xs font-mono font-extrabold text-stone-900 block">{creation.progress}%</span>
                                <span className="text-[8px] tracking-tight uppercase text-amber-500 font-bold block">Active Seam</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-stone-400" />
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Visual Atelier Schematic Preview */}
              <div className="w-full lg:w-[280px] bg-stone-950 text-white rounded-2xl p-5 border border-stone-850 flex flex-col justify-between relative overflow-hidden select-none shrink-0 text-left">
                {/* Subtle digital scanning grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_12px] opacity-60 pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-1 bg-stone-900 border border-stone-850 px-2.5 py-1 rounded-md text-[8px] tracking-widest uppercase font-bold text-gold-300 w-fit">
                    <Globe className="w-3 h-3 text-gold-400 animate-spin" />
                    <span>Hangar 4 Scanner View</span>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="text-[10px] uppercase font-mono tracking-widest text-[#B39254] font-bold">ATELIER STAGE MATRIX</h5>
                    <p className="text-xs text-stone-300 leading-normal font-sans">
                      Our Paris workshops operate under strict humidity, lighting and ambient controls to preserve the organic flax and Indigo core wash properties.
                    </p>
                  </div>

                  {/* Interactive mock radial radar chart */}
                  <div className="w-full h-36 bg-stone-900/40 rounded-xl border border-stone-800/80 flex items-center justify-center relative overflow-hidden my-2">
                    {/* Circle concentric lines */}
                    <div className="w-28 h-28 border border-stone-800/50 rounded-full flex items-center justify-center">
                      <div className="w-20 h-20 border border-dashed border-stone-800 rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 border border-stone-800/60 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-amber-400/20 border border-amber-300 rounded-full animate-ping" />
                          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full absolute" />
                        </div>
                      </div>
                    </div>
                    {/* Diagonal sweep line */}
                    <div className="absolute top-1/2 left-1/2 w-32 h-0.5 bg-gradient-to-r from-amber-400/20 to-transparent transform origin-left -translate-y-1/2 animate-[spin_4s_linear_infinite]" />
                    <span className="absolute bottom-2 left-3 font-mono text-[8px] text-stone-500">ZOOM: REGISTRY OUTLINE AA</span>
                    <span className="absolute top-2 right-3 font-mono text-[8px] text-amber-500/80 animate-pulse">&bull; WORKSPACE LIVELINK</span>
                  </div>

                  <div className="space-y-2 text-[10px] font-mono text-stone-400">
                    <div className="flex justify-between">
                      <span>Room Temperature:</span>
                      <strong className="text-white">21.8 °C</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Raw Loom Tension:</span>
                      <strong className="text-white">96.8 N/m</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Thread Feed Speed:</span>
                      <strong className="text-white">120 spm</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex justify-between items-center text-[9px] font-mono text-stone-500 relative z-10">
                  <span>FACILITY No. 4</span>
                  <span className="text-stone-300">PARIS, FR</span>
                </div>
              </div>
            </div>
          ) : (
            // ================== TAB 2: COURIER DISPATCH MAP & DETAILED INPUT DRAWERS ==================
            <div className="w-full flex flex-col gap-5">
              
              {/* Form Lookup Search Interface */}
              <div className="bg-stone-50 p-5 rounded-xl border border-stone-200/60 space-y-4 text-left">
                <span className="text-[8px] uppercase tracking-wider text-amber-700 font-extrabold block">CLIENT COURIER SECURITY PORTAL</span>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      handleLookup(searchQuery);
                    }
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      id="input-tracking-id"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Input Commission Ticket Number (e.g. RVX-GRID-2026)"
                      className="w-full bg-[#FAF9F6] border border-stone-200 focus:border-stone-900 rounded-lg px-9 py-3 text-xs outline-none text-stone-950 transition-all font-sans font-semibold placeholder-stone-400"
                    />
                  </div>
                  <button
                    id="btn-trigger-tracking-lookup"
                    type="submit"
                    disabled={loading || !searchQuery.trim()}
                    className="bg-stone-950 hover:bg-stone-900 text-white text-[9.5px] uppercase tracking-wider font-extrabold px-5 py-3 rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
                  >
                    {loading ? (
                      <RotateCw className="w-4.5 h-4.5 animate-spin text-white" />
                    ) : (
                      <span>Trace coordinates</span>
                    )}
                  </button>
                </form>

                {error && (
                  <p className="text-red-700 text-[10.5px] pl-1 font-semibold flex items-center gap-1 font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{error}</span>
                  </p>
                )}

                {/* Preloaded Demo Shortcuts */}
                <div className="space-y-2 select-none pt-1">
                  <span className="text-[8px] uppercase tracking-wider text-stone-400 font-bold block">SELECT SAMPLE TICKETS OR COMPLETED CARGO CORES</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      id="btn-track-spec-grid"
                      onClick={() => {
                        setSearchQuery("RVX-GRID-2026");
                        handleLookup("RVX-GRID-2026");
                      }}
                      className="text-[9px] uppercase bg-white border border-stone-200 hover:border-black text-stone-850 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      Waitlisted: RVX-GRID-2026 (The Cocoa Coordinates)
                    </button>
                    <button
                      id="btn-track-spec-denim"
                      onClick={() => {
                        setSearchQuery("RVX-DENIM-781");
                        handleLookup("RVX-DENIM-781");
                      }}
                      className="text-[9px] uppercase bg-white border border-stone-200 hover:border-black text-stone-850 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      Dispatched: RVX-DENIM-781 (Indigo West Utility)
                    </button>

                    {/* Show user's live checkout commissions dynamically if they exist */}
                    {currentUser && currentUser.orders && currentUser.orders.length > 0 && (
                      <div className="w-full pt-1.5 border-t border-stone-200/60 mt-1">
                        <span className="text-[8px] uppercase tracking-wider text-emerald-800 font-bold block mb-1.5">SECURED ATELIER COMMISSIONS LINKED TO YOUR PRIVATE MEMBERSHIP</span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentUser.orders.map((or: any, oIdxKey: number) => (
                            <button
                              key={oIdxKey}
                              onClick={() => {
                                setSearchQuery(or.id);
                                handleLookup(or.id);
                              }}
                              className="text-[9px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 cursor-pointer max-w-sm truncate"
                            >
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-mono">{or.id}</span>
                              <span className="opacity-75">({or.item?.name})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Core Active Order Rendering Interface */}
              <AnimatePresence mode="wait">
                {activeOrder ? (
                  <motion.div
                    key={activeOrder.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5"
                  >
                    {/* Left 8-columns: Interactive Transit Map & Steps timeline */}
                    <div className="lg:col-span-7 space-y-4 text-left">
                      
                      {/* Interactive Transit map indicator strip */}
                      <div className="bg-stone-550 bg-stone-900 text-white p-4.5 rounded-xl border border-stone-850 space-y-3.5 select-none relative overflow-hidden">
                        <div className="absolute right-4 top-4 text-stone-500 pointer-events-none">
                          <Globe className="w-14 h-14 opacity-10" />
                        </div>
                        
                        <div className="space-y-0.5">
                          <span className="text-[7.5px] text-amber-400 font-mono tracking-widest font-bold uppercase">SECURED TRANSPARENCY SHIPMENT LINE</span>
                          <h4 className="font-serif italic text-md text-stone-100">{activeOrder.itemName}</h4>
                        </div>

                        {/* Connected station vector dots map */}
                        <div className="pt-2">
                          <div className="flex justify-between items-center relative">
                            {/* Horizontal connecting vector line */}
                            <div className="absolute left-2.5 right-2.5 top-[9px] h-[1.5px] bg-stone-850 z-0" />
                            
                            {activeOrder.steps.map((st, sIdx) => {
                              const isCompleted = st.status === "completed";
                              const isActive = st.status === "active";
                              let dotCol = "bg-stone-800 border-stone-700";
                              if (isCompleted) dotCol = "bg-gold-400 border-gold-300";
                              if (isActive) dotCol = "bg-amber-500 border-amber-400 animate-pulse";

                              return (
                                <div key={sIdx} className="flex flex-col items-center z-10 relative">
                                  <div
                                    title={st.title}
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7.5px] font-mono font-bold font-sans cursor-pointer transition-all ${dotCol}`}
                                  >
                                    {isCompleted ? <Check className="w-2.5 h-2.5 text-stone-950 stroke-[3]" /> : (sIdx + 1)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex justify-between text-[7px] text-stone-400 font-sans tracking-tight uppercase pt-2 select-none">
                            <span>Mainframe Auth</span>
                            <span>Maison Loom</span>
                            <span>Pattern Cutting</span>
                            <span>Couture joining</span>
                            <span>Hardware Engrave</span>
                            <span>Secure Parcel</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Timeline steps list */}
                      <div className="space-y-3">
                        <span className="text-[8px] uppercase tracking-wider text-stone-400 font-bold block mb-1">INTERACTIVE STEPS (CLICK FOR CRAFT METRICS)</span>
                        <div className="space-y-2.5 pl-2">
                          {activeOrder.steps.map((st, idx) => {
                            const isCompleted = st.status === "completed";
                            const isActive = st.status === "active";
                            const isSelected = selectedStepIndex === idx;

                            return (
                              <div
                                key={idx}
                                onClick={() => setSelectedStepIndex(idx)}
                                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none text-left flex gap-3.5 items-start ${
                                  isSelected
                                    ? "bg-stone-900 border-stone-850 text-white shadow-md relative"
                                    : isActive
                                    ? "bg-amber-100/50 border-amber-300 hover:border-amber-400 text-stone-900"
                                    : "bg-stone-50/70 border-stone-200/70 hover:border-stone-300 text-stone-800"
                                }`}
                              >
                                {/* Bullet indicator */}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 text-[10px] font-mono font-bold ${
                                  isCompleted
                                    ? "bg-stone-950 text-white border-stone-950"
                                    : isActive
                                    ? "bg-amber-500 text-stone-950 border-amber-600 animate-pulse"
                                    : "bg-white text-stone-400 border-stone-200"
                                }`}>
                                  {isCompleted ? <Check className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-emerald-500"} stroke-[4]`} /> : (idx + 1)}
                                </div>

                                <div className="space-y-0.5 flex-1 min-w-0">
                                  <div className="flex justify-between items-center gap-2">
                                    <h5 className={`text-[11.5px] font-bold tracking-wide uppercase font-sans ${
                                      isSelected ? "text-gold-200" : "text-stone-950"
                                    }`}>
                                      {st.title}
                                    </h5>
                                    {st.timestamp && (
                                      <span className={`text-[8.5px] font-mono truncate px-1.5 py-0.5 rounded ${
                                        isSelected ? "bg-stone-850 text-stone-400" : "bg-stone-200/50 text-stone-500"
                                      }`}>
                                        {st.timestamp}
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-[10px] leading-relaxed font-sans ${
                                    isSelected ? "text-stone-300" : "text-stone-500"
                                  }`}>
                                    {st.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right 5-columns: Interactive Craft Details Drawer (Synchronized on Click!) */}
                    <div className="lg:col-span-5 text-left h-fit lg:sticky lg:top-0">
                      <span className="text-[8px] uppercase tracking-wider text-stone-400 font-bold block mb-1">CRAFT DOSSIER & METRICS</span>
                      
                      {selectedStepIndex !== null ? (
                        <div className="bg-stone-900 border border-stone-850 p-5 rounded-2xl text-white space-y-4 shadow-xl">
                          <div className="flex items-center gap-1.5 border-b border-stone-800 pb-2 bg-stone-950 p-2.5 rounded-lg">
                            <Scissors className="w-4 h-4 text-gold-400" />
                            <span className="text-[9px] uppercase tracking-widest text-[#B39254] font-mono font-bold">
                              {activeOrder.steps[selectedStepIndex].title}
                            </span>
                          </div>

                          <div className="space-y-3.5">
                            <div className="space-y-1">
                              <span className="text-[8px] uppercase text-stone-500 tracking-wider block font-mono">Artisan Supervisor</span>
                              <p className="text-xs text-white font-serif italic flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-stone-400" />
                                <span>{activeOrder.steps[selectedStepIndex].artisan || "Maison Master Tailor"}</span>
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[8px] uppercase text-stone-500 tracking-wider block font-mono">Stitch Check & Metrics</span>
                              <p className="text-xs text-stone-200 font-mono tracking-tight font-bold">
                                {activeOrder.steps[selectedStepIndex].metrics || "Signature standards met."}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[8px] uppercase text-stone-500 tracking-wider block font-mono">Workspace Coordinates</span>
                              <p className="text-xs text-stone-300 font-mono flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                                <span>{activeOrder.steps[selectedStepIndex].location || "Paris Headquarters"}</span>
                              </p>
                            </div>

                            <div className="space-y-1 bg-stone-950 p-3 rounded-lg border border-stone-850">
                              <span className="text-[8px] uppercase text-stone-500 tracking-wider block font-mono mb-0.5">Supervisor Notes</span>
                              <p className="text-[10px] text-stone-400 leading-normal italic font-sans pl-1.5 border-l border-amber-300">
                                {activeOrder.steps[selectedStepIndex].notes || "All fibers, stitches, and hardware coordinates checked under microscope log. Integrity certified."}
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-[8.5px] font-mono text-stone-500">
                            <span>TICKET: {activeOrder.id}</span>
                            <span>PAGE CLS08</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center text-stone-400 italic text-[11px] leading-relaxed font-sans select-none">
                          <Compass className="w-7 h-7 text-stone-300 mx-auto mb-2 animate-bounce" />
                          Click on any step of the tracking list to instantly extract thread patterns, sewing logs, and geo-coordinates in our Paris archive.
                        </div>
                      )}

                      {/* Brief Specimen Specs */}
                      <div className="bg-[#FAF9F6] p-4.5 rounded-xl border border-stone-200 mt-4 space-y-3.5 select-none font-sans">
                        <div className="flex items-center gap-1.5 text-[8.5px] font-extrabold text-stone-900 uppercase">
                          <Package className="w-4 h-4 text-stone-900" />
                          <span>Garment Blueprint Specimen</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-stone-500">Textile Type:</span>
                            <span className="font-semibold text-stone-900">{activeOrder.weightClass || "Luxury Loom Selections"}</span>
                          </div>
                          <div className="flex justify-between border-t border-stone-200/50 pt-1.5">
                            <span className="text-stone-500">Atelier Assignment:</span>
                            <span className="font-semibold text-stone-900">{activeOrder.tailorTeam || "French Tailors Unit"}</span>
                          </div>
                          <div className="flex justify-between border-t border-stone-200/50 pt-1.5">
                            <span className="text-stone-500">Waitlist Estimation:</span>
                            <span className="font-mono font-semibold text-stone-900">${activeOrder.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="py-20 text-center text-stone-400 font-sans p-6 border border-dashed border-stone-200 rounded-xl bg-stone-50/50 space-y-3 select-none">
                    <Clock className="w-8 h-8 text-stone-300 mx-auto animate-pulse" />
                    <p className="text-xs italic max-w-sm mx-auto leading-relaxed text-stone-500">
                      Enter your unique **Alphanumeric Ticket Code** above (e.g. `RVX-GRID-2026`) or secure a coordinate piece inside the product sheet waitlist to generate.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-550 bg-stone-50 border-t border-stone-200/70 flex items-center justify-between gap-4 shrink-0 font-sans select-none">
          <div className="flex items-center gap-1.5 text-[8.5px] uppercase tracking-wider text-stone-400 font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Maison Coordinates Central Synchronised Hub</span>
          </div>
          <button
            id="btn-tracking-dismiss"
            onClick={onClose}
            className="bg-stone-950 hover:bg-stone-900 text-white font-extrabold text-[9px] uppercase tracking-[0.2em] py-2.5 px-5 rounded-lg cursor-pointer transition-colors"
          >
            Acknowledge Progress
          </button>
        </div>
      </motion.div>
    </div>
  );
}
