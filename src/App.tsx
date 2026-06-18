import React, { useState, useEffect } from "react";
import { Product, User, Message, Toast } from "./types";
import ToastContainer from "./components/Toast";
import AIChatConcierge from "./components/AIChatConcierge";
import MemberProfile from "./components/MemberProfile";
import ProductModal from "./components/ProductModal";
import InstagramFeed from "./components/InstagramFeed";
import SizeFittingsModal from "./components/SizeFittingsModal";
import DeliveryPolicyModal from "./components/DeliveryPolicyModal";
import WebsitePolicyModal from "./components/WebsitePolicyModal";
import OrderTrackingModal from "./components/OrderTrackingModal";
import { motion, AnimatePresence } from "motion/react";
import { Compass, ShoppingBag, Eye, Heart, Mail, Sparkles, Instagram, ExternalLink, ShieldCheck, Check, Loader, Lock, Users, Database, HelpCircle, Ruler, Search, X, Package, Plus } from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState<"curations" | "salon-prive" | "narrative">("curations");
  const [products, setProducts] = useState<Product[]>([
    {
      id: "prod-cocoa-grid",
      name: "The Cocoa Grid Atelier Coordinates",
      price: 2450,
      image: "/src/assets/images/coord_set_grid_1781803885337.jpg",
      description: "A meticulously structured coordinates masterpiece reflecting high-contrast spatial architecture. Fabricated in a heavy-weight custom-woven cocoa organic linen boasting pronounced grid lines, this two-piece set reimagines relaxed executive uniforming. The crop short-sleeve button-up is designed with wide boxy shoulders, oversized lapels, and dual geometric flap chest pockets, finished with a hand-stitched sun motif. The matched wide-leg coordinates feature deep trouser side pockets and contrast cream thick-weave cotton drawstring ties. A tactile-first masterpiece.",
      materials: "100% Raw Cocoa Linen Grid Formulary",
      details: [
        "Heavyweight 380 GSM organic linen weave formulation",
        "Durable high-contrast grid structural geometry",
        "Signature hand-embroidered Ruvixon solar emblem on pocket",
        "Deep boxy cargo utility patch pockets with top flap",
        "Coordinating wide-leg alignment shorts with contrast thick draws",
        "Handmade metal hardware caps engraved with R logo"
      ],
      isWaitlist: true,
      statusText: "PRE-ORDER RESERVATION ACTIVE"
    },
    {
      id: "prod-indigo-west",
      name: "The Indigo West Utility Set",
      price: 2800,
      image: "/src/assets/images/brown_coordinates_set_1781808087123.jpg",
      description: "A profound dialogue of industrial durability and refined atelier tailoring. This high-end coordinate pairs our artisan Cocoa Grid boxy structural short-sleeve utility shirt with wide-leg, extreme heavy-weight washed dark brown indigo denim shorts. Tailored with triple-needle gold reinforcing saddle stitchwork, clean copper-rivet structural detailing, and custom branded back-waist adjustments, it structures an elegant modern oversized silhouette. Perfect for runway preview salons.",
      materials: "Cocoa Grid Flax & Heavy Wash Indigo Denim",
      details: [
        "Rigid 14.5oz heavy washed dark cocoa cotton denim",
        "Boxy crop-shirt utility alignment matching Cocoa Grid weave",
        "Solid brass metal rivets and reinforced structural seams",
        "Branded oversized pocket panels and solid metal D-ring element",
        "Adjustable copper-button custom waist tabs",
        "Triple-needle premium gold saddle thread finish"
      ],
      isWaitlist: true,
      statusText: "PROTOTYPE REGISTER INTEREST"
    }
  ]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showDeliveryPolicy, setShowDeliveryPolicy] = useState(false);
  const [showWebsitePolicy, setShowWebsitePolicy] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupStatus, setSignupStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [signupMessage, setSignupMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notice, setNotice] = useState<{ title: string; message: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    message: string,
    type: "success" | "info" | "warning" | "error" | "ambient" = "info",
    title?: string,
    duration: number = 4000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredProducts = products.filter((prod) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      prod.name.toLowerCase().includes(q) ||
      prod.materials.toLowerCase().includes(q) ||
      prod.description.toLowerCase().includes(q) ||
      prod.details.some(detail => detail.toLowerCase().includes(q))
    );
  });

  // Secret Admin Portal state
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminSignups, setAdminSignups] = useState<any[]>([]);
  const [adminError, setAdminError] = useState("");

  // Local storage cache for user persistence and server-side synchronization
  useEffect(() => {
    const cachedUser = localStorage.getItem("ruvixon_logged_user");
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setCurrentUser(parsed);

        // Fetch fresh state coordinates from the server database
        if (parsed && parsed.email) {
          fetch(`/api/accounts/profile?email=${encodeURIComponent(parsed.email)}`)
            .then((res) => {
              if (res.ok) return res.json();
              throw new Error("Database sync reference failure.");
            })
            .then((data) => {
              if (data && data.success && data.user) {
                setCurrentUser(data.user);
                localStorage.setItem("ruvixon_logged_user", JSON.stringify(data.user));
              }
            })
            .catch((err) => {
              console.warn("Maison synchronization offline; defaulting to luxury client cached state:", err);
            });
        }
      } catch (e) {
        localStorage.removeItem("ruvixon_logged_user");
      }
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("ruvixon_logged_user", JSON.stringify(user));
    addToast(`Bienvenue, ${user.name}. Your complimentary Salon Privé session coordinates are now active.`, "ambient", "Salon Privé Active", 4500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("ruvixon_logged_user");
    addToast("You have gracefully logged out. Your private session variables have been cleared.", "info", "Maison Session Terminated", 4000);
  };

  // Toggle priority registry waitlist on a product
  const handleToggleRegistry = async (productId: string) => {
    if (!currentUser) {
      setNotice({
        title: "Membership Required",
        message: "Please register or authenticate your complimentary Salon Privé account under 'Maison' to serialize premium couture items into your private digital registry."
      });
      setActiveSection("salon-prive");
      return;
    }

    const product = products.find((p) => p.id === productId);
    const prodName = product ? product.name : "Garment";

    const isInWishlist = currentUser.wishlist.includes(productId);
    let updatedWishlist: string[];

    if (isInWishlist) {
      updatedWishlist = currentUser.wishlist.filter((id) => id !== productId);
      addToast(`De-serialized "${prodName}" from your private digital queue.`, "info", "Registry De-queued", 4200);
    } else {
      updatedWishlist = [...currentUser.wishlist, productId];
      addToast(`Successfully serialized "${prodName}" into your private digital registry.`, "success", "Registry Block Verified", 5000);
    }

    const updatedUser = {
      ...currentUser,
      wishlist: updatedWishlist,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem("ruvixon_logged_user", JSON.stringify(updatedUser));

    // Synchronize to Node server database
    try {
      await fetch("/api/accounts/update-wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email, wishlist: updatedWishlist }),
      });
    } catch (e) {
      console.warn("Backend registry sync pending internet coordinates.", e);
    }
  };

  // Secure customized order reservation & launch dispatch sequence
  const handlePlaceOrder = async (product: any) => {
    if (!currentUser) return null;
    try {
      const response = await fetch("/api/accounts/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email, item: product }),
      });
      const data = await response.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem("ruvixon_logged_user", JSON.stringify(data.user));
        addToast(`Bespoke commission for "${product.name}" successfully reserved! Unique Ticket ID: ${data.orderId || "RVX-SECURE"} registered.`, "success", "Atelier Order Authorized", 5500);
        return data;
      }
    } catch (e) {
      console.error("Atelier error during order placement sequence:", e);
      addToast("Failed to lock in the atelier order sequence. Connection coordinates offline.", "error", "Atelier Error", 4500);
    }
    return null;
  };

  // Upgradable loyalty points in Client profile
  const handlePointsUpdated = async (newPoints: number) => {
    if (!currentUser) return;
    const origPoints = currentUser.points || 0;
    const diff = newPoints - origPoints;
    const updatedTier = newPoints >= 500 ? (newPoints >= 1000 ? "Haute Couture Circle" : "Atelier Gold Member") : "Salon Privé Member";
    const updatedUser = {
      ...currentUser,
      points: newPoints,
      tier: updatedTier
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("ruvixon_logged_user", JSON.stringify(updatedUser));

    if (diff > 0) {
      addToast(`Awarded +${diff} Atelier loyalty points. Current standing: ${updatedTier}`, "ambient", "Maison Badge Upgrade", 4850);
    } else if (diff < 0) {
      addToast(`Adjusted digital loyalty balance. Current standing: ${updatedTier}`, "info", "Maison Record Synced", 4000);
    }

    // Sync with database on backend server
    try {
      await fetch("/api/accounts/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          originalEmail: currentUser.email, 
          name: currentUser.name, 
          email: currentUser.email, 
          points: newPoints, 
          tier: updatedTier 
        }),
      });
    } catch (e) {
      console.warn("Points sync pending connection.", e);
    }
  };

  // Submit Newsletter signup to the Express server
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupEmail.includes("@")) {
      setSignupStatus("error");
      setSignupMessage("Please enter a valid luxury email coordinate.");
      addToast("Please enter a valid email address.", "error", "Invalid Credentials", 3500);
      return;
    }

    setSignupStatus("loading");
    try {
      const response = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registry error.");
      }

      setSignupStatus("success");
      setSignupEmail("");
      setSignupMessage("Your address has been successfully serialized into the Maison Ruvixon Private Launch Registry.");
      addToast("Your coordinates are registered. Welcome to early access.", "success", "Early Access Secured", 5000);
    } catch (err: any) {
      setSignupStatus("error");
      setSignupMessage(err.message || "An unexpected reservation discrepancy occurred. Please try again.");
      addToast(err.message || "Newsletter coordination failed.", "error", "Registration Fault", 4000);
    }
  };

  // Admin Panel authorization & download retrieval
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "ruvixonadmin" || adminPassword === "realruvixon") {
      setIsAdminAuthenticated(true);
      setAdminError("");
      try {
        const response = await fetch("/api/signups");
        const data = await response.json();
        setAdminSignups(data.signups || []);
      } catch (err) {
        setAdminError("Unable to synchronized direct local registry database files.");
      }
    } else {
      setAdminError("Incorrect elite authorization password credentials.");
    }
  };

  const copySignupsCSV = () => {
    if (adminSignups.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Email,RegisteredAt\n" + 
      adminSignups.map(s => `"${s.email}","${s.registeredAt}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ruvixon_early_registry_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-sand-50 selection:bg-stone-200 selection:text-black flex flex-col justify-between">
      {/* Global Brand Header / Bar - Luxury Double Row Layout */}
      <header className="border-b border-sand-200 bg-white sticky top-0 z-30 flex flex-col items-center justify-center shrink-0 w-full pt-4 pb-3 px-4 sm:px-12 gap-3.5">
        {/* Top Segment: Brand Title & Secondary Controls */}
        <div className="w-full flex items-center justify-between border-b border-stone-50 md:border-none pb-2 md:pb-0 relative">
          {/* Est. Brand Identifier (Hidden on small screens) */}
          <div className="hidden lg:block text-[9px] uppercase tracking-[0.3em] text-stone-400 font-semibold select-none">
            Maison d'Art &bull; Summer SS '26
          </div>

          {/* Centered Luxury Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 mx-auto sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 select-none">
            <img
              src="/src/assets/images/ruvixon_logo_1781803865828.jpg"
              alt="RUVIXON Monogram Badge"
              referrerPolicy="no-referrer"
              className="w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-full border border-stone-200 object-cover shadow-2xs"
            />
            <div className="text-xl sm:text-2xl md:text-3.5xl font-serif tracking-[0.35em] font-light text-stone-900 select-none">
              RUVIXON
            </div>
          </div>

          {/* Right Align Actions / Account Portal */}
          <div className="flex items-center gap-4 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-stone-800 ml-auto select-none">
            {currentUser ? (
              <button
                onClick={() => setActiveSection("salon-prive")}
                className="hover:opacity-60 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold">{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveSection("salon-prive")}
                className="hover:opacity-60 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                <span>Account</span>
              </button>
            )}
            <button
              onClick={() => setActiveSection("salon-prive")}
              className="hover:opacity-60 cursor-pointer hidden sm:block font-sans"
            >
              Wishlist ({currentUser?.wishlist.length || 0})
            </button>
            <div className="py-1 px-3 bg-black text-white text-[8px] sm:text-[9px] font-bold tracking-widest uppercase shrink-0">
              Early Access
            </div>
          </div>
        </div>

        {/* Bottom Segment: Main Navigation Menu (Pristine Spacing, No Clipping, Flex Wrap-Safe) */}
        <div className="w-full border-t border-sand-100/60 pt-3 pb-1 select-none">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-7 md:gap-x-9 lg:gap-x-11 text-[9px] sm:text-[10.5px] uppercase tracking-[0.22em] font-semibold text-stone-700">
            <motion.button
              id="nav-lookbook"
              onClick={() => setActiveSection("curations")}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
              className={`relative hover:text-stone-950 transition-all cursor-pointer pb-1.5 tracking-widest ${
                activeSection === "curations" ? "text-stone-950 font-extrabold" : "opacity-50"
              }`}
            >
              <span>Collections</span>
              {activeSection === "curations" && (
                <motion.div
                  layoutId="activeNavTabBorder"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-stone-950"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>

            <motion.button
              id="nav-membership"
              onClick={() => setActiveSection("salon-prive")}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35, ease: "easeOut" }}
              className={`relative hover:text-stone-950 transition-all cursor-pointer pb-1.5 tracking-widest ${
                activeSection === "salon-prive" ? "text-stone-950 font-extrabold" : "opacity-50"
              }`}
            >
              <span>Maison</span>
              {activeSection === "salon-prive" && (
                <motion.div
                  layoutId="activeNavTabBorder"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-stone-950"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>

            <motion.button
              id="nav-narrative"
              onClick={() => setActiveSection("narrative")}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.19, duration: 0.35, ease: "easeOut" }}
              className={`relative hover:text-stone-950 transition-all cursor-pointer pb-1.5 tracking-widest ${
                activeSection === "narrative" ? "text-stone-950 font-extrabold" : "opacity-50"
              }`}
            >
              <span>Heritage</span>
              {activeSection === "narrative" && (
                <motion.div
                  layoutId="activeNavTabBorder"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-stone-950"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>

            {/* Subtle Divider between content and utility features */}
            <span className="hidden sm:inline-block w-[1.5px] h-3.5 bg-stone-200/80 self-center" />

            <motion.button
              id="nav-size-guide"
              onClick={() => setShowSizeGuide(true)}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.35, ease: "easeOut" }}
              className="relative hover:text-stone-950 hover:opacity-100 transition-all cursor-pointer opacity-50 flex items-center gap-1.5 pb-1.5"
              title="Open Sizing & Fitting Standard dossier"
            >
              <Ruler className="w-3.5 h-3.5 text-stone-900 shrink-0" />
              <span>Size & Fit</span>
            </motion.button>

            <motion.button
              id="nav-track-order"
              onClick={() => setShowOrderTracking(true)}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.33, duration: 0.35, ease: "easeOut" }}
              className="relative hover:text-stone-950 hover:opacity-100 transition-all cursor-pointer opacity-50 flex items-center gap-1.5 pb-1.5"
              title="Track order status & coordinates"
            >
              <Package className="w-3.5 h-3.5 text-stone-900 shrink-0" />
              <span>Track Order</span>
            </motion.button>
          </nav>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeSection === "curations" && (
            <motion.div
              key="curations"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col lg:flex-row w-full bg-white h-auto"
            >
              {/* Left Panel: Brand & Story (Beautifully sticky on large monitors, natural on mobile) */}
              <div className="w-full lg:w-[380px] lg:border-r border-sand-200 p-8 sm:p-10 flex flex-col justify-between bg-[#FBFBFB] shrink-0 lg:sticky lg:top-[116px] lg:h-[calc(100vh-116px)] overflow-y-auto">
                <div className="space-y-6">
                  {/* Brand Monogram Medallion */}
                  <div className="flex items-center gap-3 pb-5 border-b border-sand-100">
                    <img
                      src="/src/assets/images/ruvixon_logo_1781803865828.jpg"
                      alt="Ruvixon Monogram Emblem"
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full border border-stone-200 object-cover shadow-sm"
                    />
                    <div>
                      <div className="text-[11px] font-bold tracking-[0.2em] text-stone-900">RUVIXON COUTURE</div>
                      <div className="text-[8px] tracking-[0.15em] text-stone-400 uppercase">Authenticated Paris Studio</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-4 mt-2">The New Chapter</div>
                    <h1 className="text-3xl sm:text-4xl font-serif leading-[1.15] mb-5 italic text-stone-900">
                      Summer <br/>Collection <br/>SS '26
                    </h1>
                    <p className="text-xs sm:text-sm leading-relaxed text-stone-500 max-w-[320px]">
                      RUVIXON embodies the intersection of architectural precision and fluid movement. Born in the heart of modern minimalism, we redefine contemporary elegance for the global citizen today.
                    </p>
                    <button
                      id="btn-sidebar-size-guide"
                      onClick={() => setShowSizeGuide(true)}
                      className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-all cursor-pointer font-sans"
                    >
                      <Ruler className="w-3.5 h-3.5 text-stone-900" />
                      <span>Sizing & Fittings Dossier</span>
                    </button>
                  </div>
                  
                  <div className="bg-white border border-sand-200 p-6 rounded-none shadow-xs">
                    <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-stone-900">Request Access</h3>
                    <p className="text-[11px] text-stone-400 mb-4 leading-normal">
                      Join the inner circle for 24-hour priority access before the drop occurs.
                    </p>
                    <AnimatePresence mode="wait">
                      {signupStatus === "success" ? (
                        <motion.div
                          key="signup-success-panel"
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="bg-emerald-50/50 border border-emerald-100/45 rounded-none p-5 text-center flex flex-col items-center justify-center space-y-3 my-1"
                        >
                          {/* Animated Checkmark Circle */}
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                            className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10 text-white"
                          >
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          </motion.div>
                          <div className="space-y-1">
                            <h4 className="text-[11px] uppercase tracking-widest font-bold text-emerald-950 font-sans">
                              Access Authenticated
                            </h4>
                            <p className="text-[10px] text-emerald-800/80 leading-relaxed font-sans max-w-xs mx-auto">
                              {signupMessage}
                            </p>
                          </div>
                          
                          <button
                            id="btn-waitlist-reset"
                            type="button"
                            onClick={() => setSignupStatus("idle")}
                            className="text-[8px] uppercase tracking-widest text-emerald-950/60 hover:text-stone-950 font-bold underline cursor-pointer transition-all mt-1"
                          >
                            Register another coordinate
                          </button>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="signup-form-panel"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onSubmit={handleNewsletterSubmit}
                          className="flex flex-col gap-3"
                        >
                          <input
                            id="input-waitlist-email-left"
                            type="email"
                            required
                            placeholder="EMAIL ADDRESS"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className="border-b border-sand-200 py-2.5 text-[10px] focus:outline-none focus:border-black bg-transparent text-stone-900 font-mono tracking-widest"
                          />
                          <button
                            id="btn-waitlist-submit-left"
                            type="submit"
                            disabled={signupStatus === "loading"}
                            className="bg-black text-white hover:bg-stone-900 py-3 text-[10px] uppercase tracking-[0.3em] font-medium transition-all cursor-pointer rounded-none"
                          >
                            {signupStatus === "loading" ? "Processing..." : "Notify Me"}
                          </button>
                          {signupStatus === "error" && (
                            <motion.p
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-600 text-[11px] font-sans font-medium mt-2 bg-red-50/50 p-2 border border-red-200/20"
                            >
                              {signupMessage}
                            </motion.p>
                          )}
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-3 pt-8 border-t border-sand-200 mt-8">
                  <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] text-stone-400">
                    <span>INSTAGRAM</span>
                    <a href="https://instagram.com/officialruvixon" target="_blank" rel="noreferrer" className="text-stone-900 font-bold hover:underline">@OFFICIALRUVIXON</a>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] text-stone-400">
                    <span>INQUIRIES</span>
                    <a href="mailto:realruvixon@gmail.com" className="text-stone-900 hover:underline font-bold">REALRUVIXON@GMAIL.COM</a>
                  </div>
                </div>
              </div>

              {/* Right Panel: Product Preview Grid (Flows natively on page scroll) */}
              <div className="flex-1 p-8 sm:p-12 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-sand-100 pb-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-stone-800">
                    Preview Release <span className="text-stone-300 ml-2">/ {filteredProducts.length} Styles</span>
                  </div>
                  
                  {/* Elegant Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-stone-400">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search collection coordinates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-[11px] bg-stone-50/50 border border-sand-200 focus:border-stone-450 focus:bg-white pl-8 pr-8 py-1.5 transition-all text-stone-900 placeholder-stone-400 font-sans tracking-wide rounded-md outline-hidden shadow-xs"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-stone-400 hover:text-stone-900 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-stone-50/50 border border-dashed border-sand-200 rounded-xl">
                    <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">No coordinates matched</p>
                    <p className="text-[11px] text-stone-500 max-w-xs mx-auto mb-4 leading-relaxed font-sans">
                      We found no alignments matching "{searchQuery}". Try searching for categories like "Cocoa", "Denim", or "Grid".
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="bg-black hover:bg-stone-950 text-white font-bold text-[9px] uppercase tracking-widest py-2.5 px-6 rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-12">
                    {filteredProducts.map((prod) => {
                      const isRegistered = currentUser?.wishlist?.includes(prod.id) || false;
                      return (
                        <div
                          key={prod.id}
                          onClick={() => setSelectedProduct(prod)}
                          className="group bg-white flex flex-col justify-between border border-sand-200/50 rounded-2xl p-4 hover:shadow-[0_20px_48px_rgba(43,34,22,0.06)] hover:border-stone-400/80 transition-all duration-500 cursor-pointer select-none"
                        >
                          {/* Aspect Wrapper */}
                          <div className="aspect-[3/4] bg-[#FDFDFD] flex items-center justify-center relative overflow-hidden rounded-xl">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-700 ease-out"
                            />
                            
                            {/* Subtle dark backdrop on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-[#1C1917]/10 transition-all duration-500 pointer-events-none" />

                            {/* Center Luxury Indicator (Desktop hover experience) */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                              <span className="text-[9.5px] uppercase tracking-[0.3em] font-bold bg-white/95 text-stone-900 py-3.5 px-6.5 shadow-xl border border-sand-200 rounded-lg backdrop-blur-xs">
                                View Specification
                              </span>
                            </div>

                            {/* Saved badge on top-right corner if already waitlisted */}
                            {isRegistered && (
                              <div className="absolute top-4 right-4 z-10">
                                <motion.span
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="text-[8.5px] uppercase tracking-[0.22em] bg-stone-950 border border-stone-850 text-gold-300 px-2.5 py-1 rounded-sm font-bold shadow-md"
                                >
                                  Saved
                                </motion.span>
                              </div>
                            )}
                          </div>

                          {/* Text copy below aspect */}
                          <div className="mt-4.5 flex flex-col gap-2.5 px-0.5 pb-0.5">
                            <div className="flex justify-between items-baseline gap-2">
                              <span className="text-[12.5px] uppercase tracking-wider font-semibold text-stone-900 group-hover:text-gold-600 transition-colors duration-300 font-sans">
                                {prod.name}
                              </span>
                              <span className="text-[11.5px] text-stone-500 font-mono font-medium">
                                Est. ${prod.price.toLocaleString()}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center gap-2 pt-2 border-t border-sand-100/60 text-[9.5px] uppercase tracking-widest text-stone-400 font-semibold font-display">
                              <span>{prod.materials}</span>
                              <span className="text-[9px] text-gold-600 font-bold group-hover:underline transition-all">
                                Discover Details →
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === "salon-prive" && (
            <motion.div
              key="salon-prive"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="px-6 sm:px-12 py-8"
            >
              <MemberProfile
                currentUser={currentUser}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                products={products}
                onRemoveFromWishlist={handleToggleRegistry}
                onPointsUpdated={handlePointsUpdated}
              />
            </motion.div>
          )}

          {activeSection === "narrative" && (
            <motion.div
              key="narrative"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="max-w-4xl mx-auto px-6 py-16 space-y-16 text-left selection:bg-stone-900 selection:text-white"
            >
              {/* Editorial Page Title */}
              <div className="space-y-4 border-b border-sand-200 pb-10">
                <span className="text-[9px] uppercase tracking-[0.4em] font-extrabold text-stone-400 block">
                  Archive Dossier No. 01 / Heritage
                </span>
                <h1 className="font-display text-4xl sm:text-5xl tracking-widest font-light text-stone-900 leading-tight uppercase">
                  Esthétique <br />
                  <span className="font-serif italic font-normal text-stone-550 capitalize">Structurelle</span>
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-stone-500 max-w-md font-sans leading-relaxed">
                    A critical catalog charting the architectural rulesets, loom metrics, and mathematical alignment governing Maison Ruvixon's workwear coordinates.
                  </p>
                  <span className="hidden sm:block text-[9.5px] font-mono tracking-widest text-[#B39254] font-bold uppercase shrink-0">
                    &bull; Paris No. 4 Studio Archive
                  </span>
                </div>
              </div>

              {/* Asymmetrical Big Quote Panel */}
              <div className="relative pl-8 md:pl-12 border-l border-stone-250 py-3 my-8 select-none">
                <span className="absolute left-[-24px] top-[-10px] font-serif text-7xl text-stone-200 pointer-events-none italic">"</span>
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-stone-900 leading-relaxed font-light">
                  We do not decorate garments; we build spatial architectures. A Ruvixon coordinate is a monolithic structure optimized for the human form in motion.
                </p>
                <cite className="block text-[9.5px] font-mono tracking-widest uppercase font-extrabold text-stone-400 mt-4 not-italic">
                  &mdash; Chief Pattern Architect, Lyon Lab SS '26
                </cite>
              </div>

              {/* INTERACTIVE TEXTILE BLUEPRINT EXHIBIT (MIND-BLOWING SCIENTIFIC VECTOR VIEW) */}
              <div className="space-y-6">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Interactive Diagnostic</span>
                  <h3 className="font-serif italic font-bold text-lg text-stone-950">Atelier Pattern Drafting Model (Interactive Specimen)</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Click the blueprint tabs below to inspect our actual drafting contours, triple-seam calculations, and hardware spacing schematics.
                  </p>
                </div>

                {/* Interactive Blueprint Canvas Card */}
                <div className="bg-stone-950 text-white p-6 border border-stone-850 rounded-2xl relative overflow-hidden flex flex-col md:flex-row gap-6">
                  {/* Backdrop grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  
                  {/* Left Column: Asymmetrical Vector Drafting Sheet */}
                  <div className="w-full md:w-1/2 aspect-square bg-[#0D0D0E] border border-stone-850 rounded-xl flex items-center justify-center p-6 relative z-10 select-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-stone-700 stroke-[0.5] font-sans">
                      {/* Concentration circle blueprint */}
                      <circle cx="50" cy="50" r="45" className="stroke-stone-800/60 fill-none" />
                      <circle cx="50" cy="50" r="28" className="stroke-stone-800/80 stroke-dashed fill-none" />
                      <circle cx="50" cy="50" r="12" className="stroke-[#B39254]/40 fill-none" />
                      
                      {/* Geometric grid lines */}
                      <line x1="5" y1="50" x2="95" y2="50" className="stroke-stone-800/50" />
                      <line x1="50" y1="5" x2="50" y2="95" className="stroke-stone-800/50" />
                      <line x1="15" y1="15" x2="85" y2="85" className="stroke-stone-800/30 font-light" />
                      <line x1="15" y1="85" x2="85" y2="15" className="stroke-stone-800/30 font-light" />
                      
                      {/* Structural jacket outline draft (Aesthetic Vector Art) */}
                      <path d="M25,25 L75,25 L70,80 L30,80 Z" className="stroke-[#B39254] stroke-[1] fill-none" />
                      <path d="M25,25 L15,45 L25,50 L30,80" className="stroke-stone-500 fill-none" />
                      <path d="M75,25 L85,45 L75,50 L70,80" className="stroke-stone-500 fill-none" />
                      
                      {/* Collar V lines */}
                      <path d="M40,25 L50,42 L60,25" className="stroke-white stroke-[1] fill-none" />
                      
                      {/* Triple cuffs */}
                      <line x1="15" y1="43" x2="25" y2="48" className="stroke-stone-600" />
                      <line x1="13" y1="45" x2="23" y2="50" className="stroke-[#B39254]" />
                      <line x1="85" y1="43" x2="75" y2="48" className="stroke-stone-600" />
                      <line x1="87" y1="45" x2="77" y2="50" className="stroke-[#B39254]" />

                      {/* Technical Labels */}
                      <text x="52" y="15" className="fill-stone-500 text-[3.5px] font-mono select-none">Y-Y AXIS CONTOUR: 0.02</text>
                      <text x="52" y="90" className="fill-stone-500 text-[3.5px] font-mono select-none">SHOULDER DRAUGHT: FLAT</text>
                      <text x="8" y="48" className="fill-[#B39254] text-[3.5px] font-mono select-none">TRIPLE-NEEDLE cuffs</text>
                      <text x="32" y="75" className="fill-[#B39254] text-[3px] font-mono select-none">HEAVY 450GSM TENSION</text>
                    </svg>

                    <div className="absolute top-2 left-3 font-mono text-[7px] text-stone-500">
                      BLUEPRINT SPECTRA No. 4
                    </div>
                    <div className="absolute bottom-2 right-3 font-mono text-[7.5px] text-[#B39254] animate-pulse">
                      &bull; MATRIX ONLINE
                    </div>
                  </div>

                  {/* Right Column: Spec Sheet & Editorial Copy */}
                  <div className="w-full md:w-1/2 flex flex-col justify-between py-1 relative z-10 text-left">
                    <div className="space-y-4">
                      <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-md text-[8.5px] tracking-widest uppercase font-bold text-[#B39254] w-fit">
                        <span>AEROS HARDWARE SPECIFICATION</span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-serif italic font-bold text-lg text-white">The Geometry-Over-Decoration Axiom</h4>
                        <p className="text-[11.5px] leading-relaxed text-stone-300 font-sans">
                          A Ruvixon garment is characterized by symmetrical, reinforced geometric blocks. Sourced directly from long-staple organic flax and high-density Japanese shuttle looms, our raw materials must withstand rigid tension matrices before the first laser cut is approved.
                        </p>
                      </div>

                      <div className="space-y-2 text-stone-400 font-mono text-[10px] pt-2">
                        <div className="flex justify-between border-b border-stone-850 pb-1">
                          <span>Aeros Brass Fasteners:</span>
                          <strong className="text-white">Custom Pure Copper Stamped</strong>
                        </div>
                        <div className="flex justify-between border-b border-stone-850 pb-1">
                          <span>Seams Stitching:</span>
                          <strong className="text-white">18,400 Lockstitches / 3x Reinforced</strong>
                        </div>
                        <div className="flex justify-between border-b border-stone-850 pb-1">
                          <span>Tensile Coefficient:</span>
                          <strong className="text-white">96.8 N/m (Silt Standard)</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-850 text-[10px] text-stone-500 font-mono flex justify-between">
                      <span>CRAFT SYSTEM ENG-42</span>
                      <span className="text-[#B39254]">MAISON SECURED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ASYMMETRICAL CHRONOLOGICAL STORY ARCHIVE TIMELINE */}
              <div className="space-y-10 pt-6">
                <div className="space-y-2 mb-10">
                  <span className="text-[8px] uppercase tracking-widest text-[#B39254] font-bold block">Temporal Lineage</span>
                  <h3 className="font-serif italic font-bold text-2xl text-stone-950">Maison Milestones & Textile Archives</h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans max-w-xl">
                    Follow the chronological lineage of our masterworks, from the first loom blueprints drawn on paper to the active digital registry coordinates today.
                  </p>
                </div>

                <div className="relative border-l border-stone-200 pl-6 md:pl-10 space-y-12">
                  
                  {/* Milestone 1 */}
                  <div className="relative text-left">
                    {/* Circle timeline bullet */}
                    <div className="absolute left-[-31px] md:left-[-45px] top-[4px] w-2.5 h-2.5 rounded-full bg-stone-950 ring-4 ring-white" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-3">
                        <span className="font-mono text-xs font-bold text-amber-800 tracking-wider">JUNE 2026</span>
                        <h4 className="font-serif italic font-bold text-md text-stone-900 leading-tight">SS '26 Coordinate launch</h4>
                      </div>
                      <div className="md:col-span-9 space-y-2">
                        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-sans">
                          <span className="float-left text-3xl font-serif text-stone-950 mr-2 leading-none font-bold">L</span>
                          aunching our premier digital waitlist coordinates. Combining structural cocoa-brown organic flax Coordinates and heavy industrial triple-stitch indigo denim. Configured securely on modern full-stack mainframe databases with instant status telemetry scanners.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Milestone 2 */}
                  <div className="relative text-left">
                    <div className="absolute left-[-31px] md:left-[-45px] top-[4px] w-2.5 h-2.5 rounded-full bg-stone-400 ring-4 ring-white" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-3">
                        <span className="font-mono text-xs font-bold text-stone-500 tracking-wider">AUTUMN 2026</span>
                        <h4 className="font-serif italic font-bold text-md text-stone-900 leading-tight">The Obsidian Collection</h4>
                      </div>
                      <div className="md:col-span-9 space-y-2">
                        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-sans">
                          <span className="float-left text-3xl font-serif text-stone-950 mr-2 leading-none font-bold">O</span>
                          ur second masterwork series: high-density twill coordinates in midnight charcoal shades. Hand-engraved gunmetal alloy hardware stamps are compressed directly in our Paris No. 4 Aeros Hardware lines, providing clients with unparalleled heirloom longevity.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Milestone 3 */}
                  <div className="relative text-left">
                    <div className="absolute left-[-31px] md:left-[-45px] top-[4px] w-2.5 h-2.5 rounded-full bg-stone-300 ring-4 ring-white animate-pulse" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-3">
                        <span className="font-mono text-xs font-bold text-stone-400 tracking-wider">SPRING 2027</span>
                        <h4 className="font-serif italic font-bold text-md text-stone-900 leading-tight">The Fluid Satin Drape</h4>
                      </div>
                      <div className="md:col-span-9 space-y-2">
                        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-sans">
                          <span className="float-left text-3xl font-serif text-stone-950 mr-2 leading-none font-bold">F</span>
                          using raw structured outer cotton shells with delicate inner satin linings. The structural drafting blueprints are already modeled on Lyons high-resolution digital systems, presently awaiting pilot fabric shearings and fiber calibrations.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Direct Inquiries Row */}
              <div className="border-t border-sand-200 pt-10 space-y-6">
                <div>
                  <h4 className="font-serif italic font-bold text-lg text-stone-950">Atelier Inquiries & Consulates</h4>
                  <p className="text-xs text-stone-500 leading-relaxed mt-1">
                    To maintain uncompromised sensory standards, Maison Ruvixon routes correspondence exclusively through dedicated channels of authentication.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-sand-200 p-5 rounded-none space-y-1.5 hover:shadow-xs hover:border-stone-900 transition-all duration-300">
                    <span className="text-[8px] uppercase tracking-widest text-[#B39254] font-bold block">Secure Email Coordinates</span>
                    <a
                      href="mailto:realruvixon@gmail.com"
                      className="text-xs text-stone-950 hover:text-stone-600 font-extrabold font-mono block underline"
                    >
                      realruvixon@gmail.com
                    </a>
                  </div>
                  <div className="bg-white border border-sand-200 p-5 rounded-none space-y-1.5 hover:shadow-xs hover:border-stone-900 transition-all duration-300">
                    <span className="text-[8px] uppercase tracking-widest text-[#B39254] font-bold block">Social Instigation Desk</span>
                    <a
                      href="https://instagram.com/officialruvixon"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-stone-950 hover:text-stone-600 font-extrabold font-mono block underline"
                    >
                      @officialruvixon
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Aesthetic Instagram Feed */}
      <InstagramFeed />

      {/* Embedded Active Stylist Concierge */}
      <AIChatConcierge onAddToRegistry={handleToggleRegistry} />

      {/* Elegant Footer Details */}
      <footer className="border-t border-sand-200 bg-[#FAFAF9] py-16 px-6 sm:px-12 md:px-16 text-xs text-stone-600 space-y-12 select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          
          {/* Brand/Roots Column */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <img
                src="/src/assets/images/ruvixon_logo_1781803865828.jpg"
                alt="RUVIXON Badge"
                className="w-6 h-6 rounded-full border border-stone-200 object-cover"
              />
              <span className="font-serif text-sm tracking-[0.25em] font-extrabold text-stone-900">RUVIXON</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500 max-w-sm mx-auto md:mx-0">
              Maison d'Art & Couture. Crafted for selective eyes, formulated with uncompromising atelier devotion. Sired on the streets of Paris, configured globally.
            </p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 font-display">
              © 2026 MAISON RUVIXON. All rights reserved.
            </p>
          </div>

          {/* Client Assistance Documents Column */}
          <div className="space-y-4 text-center">
            <h4 className="font-display text-[9.5px] uppercase tracking-[0.3em] font-bold text-stone-900">Atelier Dossier Guides</h4>
            <div className="flex flex-col gap-2.5 items-center">
              <button
                id="btn-footer-track"
                onClick={() => setShowOrderTracking(true)}
                className="hover:text-gold-600 transition-all cursor-pointer text-[10px] font-semibold tracking-wide uppercase px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-sand-200 rounded-md w-48 text-center"
              >
                Track Order
              </button>
              <button
                id="btn-footer-delivery"
                onClick={() => setShowDeliveryPolicy(true)}
                className="hover:text-gold-600 transition-all cursor-pointer text-[10px] font-semibold tracking-wide uppercase px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-sand-200 rounded-md w-48 text-center"
              >
                Delivery Policy
              </button>
              <button
                id="btn-footer-website"
                onClick={() => setShowWebsitePolicy(true)}
                className="hover:text-gold-600 transition-all cursor-pointer text-[10px] font-semibold tracking-wide uppercase px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-sand-200 rounded-md w-48 text-center"
              >
                Website Policy
              </button>
            </div>
          </div>

          {/* Digital Coordinates & Channels */}
          <div className="space-y-4 text-center md:text-right flex flex-col items-center md:items-end">
            <h4 className="font-display text-[9.5px] uppercase tracking-[0.3em] font-bold text-stone-900">Private Channels</h4>
            <div className="space-y-2 text-[11px] font-sans">
              <div className="flex items-center gap-2 justify-center md:justify-end">
                <span className="text-[9px] uppercase tracking-wider text-stone-400">Atelier Direct:</span>
                <a href="mailto:realruvixon@gmail.com" className="hover:text-gold-600 transition-colors font-medium underline">
                  realruvixon@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-end">
                <span className="text-[9px] uppercase tracking-wider text-stone-400">Instagram:</span>
                <a href="https://instagram.com/officialruvixon" target="_blank" rel="noreferrer" className="hover:text-gold-600 transition-colors font-medium underline">
                  @officialruvixon
                </a>
              </div>
            </div>

            <div className="pt-3">
              <button
                id="btn-admin-console-toggle"
                onClick={() => setShowAdminPortal(!showAdminPortal)}
                className="hover:text-white transition-all cursor-pointer text-[9.5px] tracking-widest uppercase font-bold text-gold-600 border border-gold-500/20 bg-gold-500/5 px-3 py-1.5 rounded-lg hover:bg-gold-500 hover:text-stone-950 flex items-center gap-1.5 select-none"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Atelier Admin Consoles</span>
              </button>
            </div>
          </div>

        </div>

        {/* Big elegant branding at bottom */}
        <div className="text-center pt-8 border-t border-sand-100 flex flex-col items-center justify-center">
          <span className="text-stone-200 text-4xl sm:text-7xl md:text-9xl font-serif tracking-[0.28em] font-light uppercase select-none opacity-50">
            RUVIXON
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-semibold mt-2">
            Haute Couture Atelier &bull; Autumn-Winter Collection Paris
          </span>
        </div>

        {/* Local Signups Database Exporter Console (Secret Portal) */}
        {showAdminPortal && (
          <div className="max-w-xl mx-auto mt-6 bg-stone-900 border border-gold-500/20 rounded-2xl p-6 text-left shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between text-gold-200 border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gold-500" />
                <h4 className="font-display text-xs tracking-widest uppercase font-bold">Atelier Registry Storage Log</h4>
              </div>
              <span className="text-[8px] bg-red-800 text-white px-2 py-0.5 rounded uppercase tracking-widest font-mono">
                SECURE CONSOLE
              </span>
            </div>

            {!isAdminAuthenticated ? (
              <form onSubmit={handleAdminAuth} className="space-y-3">
                <p className="text-[10px] text-zinc-400">
                  Please authenticate database password credentials to query local registries. <span className="text-gold-500/80 font-bold italic">(Dev Password hint: ruvixonadmin)</span>
                </p>
                <div className="flex gap-2">
                  <input
                    id="input-admin-password"
                    type="password"
                    placeholder="Enter security coordinates..."
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="flex-1 bg-stone-950 border border-stone-800 focus:border-gold-500 rounded-xl px-4 py-2 text-xs outline-none text-zinc-200 font-sans"
                  />
                  <button
                    id="btn-admin-authenticate"
                    type="submit"
                    className="bg-gold-500 hover:bg-gold-600 text-stone-950 text-[10px] font-bold uppercase tracking-widest px-4 rounded-xl transition-all cursor-pointer"
                  >
                    Authenticate
                  </button>
                </div>
                {adminError && <p className="text-red-400 text-[10px] font-sans font-medium">{adminError}</p>}
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] text-zinc-300">
                  <span>Count: <strong className="text-gold-500">{adminSignups.length} Registered VIP Emails</strong></span>
                  <button
                    id="btn-admin-export-csv"
                    onClick={copySignupsCSV}
                    className="bg-gold-500 hover:bg-gold-600 text-stone-950 text-[9px] uppercase tracking-widest font-extrabold px-3 py-1.5 rounded transition-all flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <Database className="w-3 h-3" />
                    <span>Download CSV Registry</span>
                  </button>
                </div>

                <div className="border border-stone-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full font-mono text-[10px] text-zinc-400">
                    <thead className="bg-stone-950 text-gold-500 border-b border-stone-800">
                      <tr>
                        <th className="px-4 py-2 text-left">VIP Email Coordinate</th>
                        <th className="px-4 py-2 text-left">Serialization Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-850">
                      {adminSignups.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="px-4 py-4 text-center text-zinc-500 italic">No registrations logged in.</td>
                        </tr>
                      ) : (
                        adminSignups.map((signup, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="px-4 py-2.5 truncate max-w-sm">{signup.email}</td>
                            <td className="px-4 py-2.5 text-zinc-500">{new Date(signup.registeredAt).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </footer>

      {/* Elegant Product Modal Backdrop Overlay Container */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            isInRegistry={currentUser?.wishlist?.includes(selectedProduct.id) || false}
            onToggleRegistry={() => handleToggleRegistry(selectedProduct.id)}
            onOpenSizeGuide={() => setShowSizeGuide(true)}
            currentUser={currentUser}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
      </AnimatePresence>

      {/* Sizing & Fittings Modal Overlay */}
      <AnimatePresence>
        {showSizeGuide && (
          <SizeFittingsModal onClose={() => setShowSizeGuide(false)} />
        )}
      </AnimatePresence>

      {/* Delivery Policy Modal */}
      <AnimatePresence>
        {showDeliveryPolicy && (
          <DeliveryPolicyModal onClose={() => setShowDeliveryPolicy(false)} />
        )}
      </AnimatePresence>

      {/* Website Policy Modal */}
      <AnimatePresence>
        {showWebsitePolicy && (
          <WebsitePolicyModal onClose={() => setShowWebsitePolicy(false)} />
        )}
      </AnimatePresence>

      {/* Order Tracking Modal */}
      <AnimatePresence>
        {showOrderTracking && (
          <OrderTrackingModal onClose={() => setShowOrderTracking(false)} currentUser={currentUser} />
        )}
      </AnimatePresence>

      {/* Elegantly Crafted Notice Toast Dialog */}
      <AnimatePresence>
        {notice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FAF9F6] border border-stone-200/85 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-[0_24px_64px_rgba(40,30,20,0.12)] space-y-5"
            >
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-amber-50/80 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-sm tracking-[0.2em] text-stone-900 uppercase font-bold">
                  {notice.title}
                </h3>
                <p className="text-[11.5px] text-stone-500 leading-relaxed font-sans">
                  {notice.message}
                </p>
              </div>
              <button
                id="btn-close-notice"
                onClick={() => setNotice(null)}
                className="w-full bg-stone-900 text-white rounded-xl py-3 text-[10px] uppercase tracking-[0.25em] font-semibold hover:bg-stone-800 transition-colors cursor-pointer select-none"
              >
                Continue to Atelier
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
