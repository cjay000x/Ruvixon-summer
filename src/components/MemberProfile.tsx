import React, { useState, useEffect } from "react";
import { User, Product } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  User as UserIcon,
  Lock,
  Mail,
  Tag,
  Compass,
  Sparkles,
  Check,
  LogOut,
  ArrowRight,
  Activity,
  ShieldCheck,
  Heart,
  Loader,
  ShoppingBag,
  Sliders,
  Settings,
  Scissors,
  Truck,
  FileText,
  Award
} from "lucide-react";

interface MemberProfileProps {
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
  products: Product[];
  onRemoveFromWishlist?: (productId: string) => void;
  onPointsUpdated?: (newPoints: number) => void;
}

export default function MemberProfile({
  currentUser,
  onLoginSuccess,
  onLogout,
  products,
  onRemoveFromWishlist,
  onPointsUpdated,
}: MemberProfileProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard configuration tabs
  const [dashboardTab, setDashboardTab] = useState<"registry" | "orders" | "profile" | "loyalty">("registry");

  // Profile Edit fields
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editSuccessMsg, setEditSuccessMsg] = useState("");
  const [editErrorMsg, setEditErrorMsg] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Gamification interactions state
  const [completedQuiz, setCompletedQuiz] = useState(false);
  const [followedInstagram, setFollowedInstagram] = useState(false);
  const [referredFriend, setReferredFriend] = useState(false);
  const [showPointsToast, setShowPointsToast] = useState<string | null>(null);
  const [orderProgressOverrides, setOrderProgressOverrides] = useState<Record<string, number>>({});
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || "");
      setEditEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const displayWishlist = products.filter((p) => currentUser?.wishlist?.includes(p.id));

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);

    const url = isRegister ? "/api/accounts/register" : "/api/accounts/login";
    const payload = isRegister ? { name, email, password } : { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onLoginSuccess(data.user);
      // Clear inputs
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEarnPoints = (actionName: string, pointsAmount: number) => {
    if (!currentUser) return;

    let pointsAwarded = 0;
    if (actionName === "quiz" && !completedQuiz) {
      setCompletedQuiz(true);
      pointsAwarded = pointsAmount;
    } else if (actionName === "instagram" && !followedInstagram) {
      setFollowedInstagram(true);
      pointsAwarded = pointsAmount;
    } else if (actionName === "refer" && !referredFriend) {
      setReferredFriend(true);
      pointsAwarded = pointsAmount;
    }

    if (pointsAwarded > 0) {
      const updatedTotal = currentUser.points + pointsAwarded;
      if (onPointsUpdated) {
        onPointsUpdated(updatedTotal);
      }
      setShowPointsToast(`+${pointsAwarded} Atelier Points!`);
      setTimeout(() => setShowPointsToast(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-10 bg-white border border-sand-200 rounded-none shadow-xs relative overflow-hidden">
      {/* Points Toast Notification */}
      <AnimatePresence>
        {showPointsToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black border border-stone-800 text-white px-6 py-3 rounded-none z-50 flex items-center gap-2 shadow-2xl"
          >
            <Sparkles className="w-4 h-4 animate-spin text-stone-300" />
            <span className="font-display text-xs tracking-widest font-semibold">{showPointsToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!currentUser ? (
        /* Sign-In / Registration Portal */
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[400px]">
          {/* Brand Aesthetics Side Panel */}
          <div className="space-y-6 md:border-r border-sand-200 md:pr-8 py-4">
            <div className="inline-flex items-center gap-1.5 bg-stone-100 border border-stone-200 text-stone-900 px-3.5 py-1.5 rounded-none text-[10px] tracking-[0.2em] uppercase font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Couture Registry</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-stone-900 font-normal leading-tight italic">
              Maison Ruvixon <br />
              <span className="font-sans not-italic font-bold text-stone-500 text-lg uppercase tracking-widest">Salon Privé Portal</span>
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Enter the private world of Maison Ruvixon. By creating an elite customer registry profile, you unlock members-only privileges for the upcoming Summer SS '26 launch:
            </p>
            <ul className="space-y-3.5 pt-2">
              <li className="flex items-start gap-2.5 text-xs text-stone-600">
                <div className="p-1 bg-stone-100 rounded-none text-stone-900 mt-0.5">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span>
                  <strong>Complimentary Welcoming Suite:</strong> Instantly receive <strong>150 complimentary Atelier Points</strong> upon profile authentication.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-stone-600">
                <div className="p-1 bg-stone-100 rounded-none text-stone-900 mt-0.5">
                  <Compass className="w-3 h-3" />
                </div>
                <span>
                  <strong>Priority Waitlist Reservations:</strong> Fast-track pre-order selections for Cocoa Grid coordinates.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-stone-600">
                <div className="p-1 bg-stone-100 rounded-none text-stone-900 mt-0.5">
                  <Activity className="w-3 h-3" />
                </div>
                <span>
                  <strong>Atelier Concierge Access:</strong> Enjoy persistent communication logs with our AI Stylist Assistant.
                </span>
              </li>
            </ul>
          </div>

          {/* Form Side */}
          <div className="py-4">
            <div className="flex border-b border-sand-200 mb-6">
              <button
                id="tab-login"
                onClick={() => {
                  setIsRegister(false);
                  setAuthError("");
                }}
                className={`flex-1 pb-3 text-center font-display text-xs tracking-widest uppercase font-semibold transition-all cursor-pointer ${
                  !isRegister
                    ? "border-b-2 border-black text-stone-950"
                    : "text-stone-400 hover:text-stone-950"
                }`}
              >
                Sign In
              </button>
              <button
                id="tab-register"
                onClick={() => {
                  setIsRegister(true);
                  setAuthError("");
                }}
                className={`flex-1 pb-3 text-center font-display text-xs tracking-widest uppercase font-semibold transition-all cursor-pointer ${
                  isRegister
                    ? "border-b-2 border-black text-stone-950"
                    : "text-stone-400 hover:text-stone-950"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthentication} className="space-y-4">
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-stone-800">Your Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      id="input-register-name"
                      type="text"
                      required
                      placeholder="e.g. Christian Dior"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-sand-200 focus:border-black px-10 py-2.5 text-xs outline-none text-stone-900 transition-all font-sans"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-stone-800">Client Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    id="input-auth-email"
                    type="email"
                    required
                    placeholder="e.g. realruvixon@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-sand-200 focus:border-black px-10 py-2.5 text-xs outline-none text-stone-900 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-stone-800">Private Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    id="input-auth-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-sand-200 focus:border-black px-10 py-2.5 text-xs outline-none text-stone-900 transition-all font-sans"
                  />
                </div>
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200/40 text-red-700 p-3 rounded-none text-xs leading-relaxed">
                  {authError}
                </div>
              )}

              <button
                id="btn-auth-submit"
                type="submit"
                disabled={isLoading}
                className="w-full bg-black hover:bg-stone-900 text-white rounded-none py-3.5 text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    <span>Engraving Registry...</span>
                  </span>
                ) : (
                  <>
                    <span>{isRegister ? "Join Salon Privé" : "Authenticate Access"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Authenticated Member Dashboard */
        <div className="space-y-8">
          {/* Header Layout */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-sand-200">
            <div>
              <p className="text-[10px] tracking-[0.2em] font-bold uppercase text-stone-400">Maison Membership</p>
              <h2 className="font-serif text-2xl tracking-wide text-stone-900 font-normal italic">
                Welcome Back, <span className="font-serif italic font-normal">{currentUser.name}</span>
              </h2>
            </div>
            <button
              id="btn-logout"
              onClick={onLogout}
              className="inline-flex items-center justify-center gap-2 text-xs border border-sand-200 hover:border-black bg-stone-50 hover:bg-stone-100 px-4 py-2 rounded-none text-stone-800 transition-all cursor-pointer font-sans"
            >
              <LogOut className="w-4 h-4 text-stone-950" />
              <span className="font-display text-[10px] uppercase tracking-[0.2em] font-semibold">Exit Salon</span>
            </button>
          </div>

          {/* Member Card / Elite Stats Section */}
          <div className="grid md:grid-cols-5 gap-6">
            {/* The Luxury Corporate Card */}
            <div className="md:col-span-2 bg-[#1C1C1C] text-white p-6 rounded-none flex flex-col justify-between h-52 shadow-2xl relative overflow-hidden border border-stone-800">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-serif text-lg tracking-[0.2em] font-light text-white">RUVIXON</h4>
                  <p className="text-[9px] tracking-[0.15em] text-stone-400 uppercase">Salon Privé Card</p>
                </div>
                <div className="p-1 border border-stone-700">
                  <Sparkles className="w-4 h-4 text-stone-300" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.15em] uppercase text-stone-500">Registry Member</p>
                <p className="font-sans text-sm tracking-widest font-semibold">{currentUser.name}</p>
                <p className="font-mono text-[9px] text-stone-600">ID: RVX-{currentUser.registeredAt ? currentUser.registeredAt.slice(0,4) : "2026"}-{(currentUser.email.charCodeAt(0) + (currentUser.email.charCodeAt(1) || 0)).toString(16).toUpperCase()}</p>
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-stone-800">
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-stone-500">Status</p>
                  <p className="font-serif text-xs italic text-stone-300 font-semibold">{currentUser.tier}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase tracking-widest text-stone-500">Atelier Points</p>
                  <p className="font-mono text-sm font-bold text-white">{currentUser.points} pts</p>
                </div>
              </div>
            </div>

            {/* Dashboard Status Tiers Overview */}
            <div className="md:col-span-3 bg-stone-50 border border-sand-200 p-6 rounded-none flex flex-col justify-between gap-4">
              <div>
                <h4 className="font-display text-[11px] uppercase tracking-widest font-bold text-stone-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-stone-900" />
                  <span>Your Couture Tier Level</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed font-sans">
                  Unlock bespoke client benefits at Maison Ruvixon as you expand your Atelier points program:
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-550 font-mono">
                  <span>Current: {currentUser.tier}</span>
                  <span>{currentUser.points} / 500 Pts to Gold</span>
                </div>
                <div className="w-full bg-sand-200 h-1 rounded-none overflow-hidden">
                  <div
                    className="bg-black h-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (currentUser.points / 550) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Tiers Detail */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-sand-200">
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-stone-900">Salon Privé</p>
                  <p className="text-[9px] text-stone-400">150+ Pts (Active)</p>
                </div>
                <div className="space-y-0.5 border-x border-sand-200">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-stone-400">Atelier Gold</p>
                  <p className="text-[9px] text-stone-400">500+ Pts</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-stone-400">Couture Circle</p>
                  <p className="text-[9px] text-stone-400">1000+ Pts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Interactive Customer Dashboard Tab Switcher */}
          <div className="border-b border-sand-200 flex gap-4 overflow-x-auto pb-px">
            <button
              id="tab-registry"
              onClick={() => {
                setDashboardTab("registry");
                setEditSuccessMsg("");
                setEditErrorMsg("");
              }}
              className={`pb-3 text-xs tracking-widest uppercase font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
                dashboardTab === "registry"
                  ? "border-black text-stone-950"
                  : "border-transparent text-stone-400 hover:text-stone-900"
              }`}
            >
              Couture Registry ({displayWishlist.length})
            </button>
            <button
              id="tab-orders"
              onClick={() => {
                setDashboardTab("orders");
                setEditSuccessMsg("");
                setEditErrorMsg("");
              }}
              className={`pb-3 text-xs tracking-widest uppercase font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
                dashboardTab === "orders"
                  ? "border-black text-stone-950"
                  : "border-transparent text-stone-400 hover:text-stone-900"
              }`}
            >
              Past Commissions ({currentUser.orders?.length || 0})
            </button>
            <button
              id="tab-profile"
              onClick={() => {
                setDashboardTab("profile");
                setEditSuccessMsg("");
                setEditErrorMsg("");
              }}
              className={`pb-3 text-xs tracking-widest uppercase font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
                dashboardTab === "profile"
                  ? "border-black text-stone-950"
                  : "border-transparent text-stone-400 hover:text-stone-900"
              }`}
            >
              Profile Settings
            </button>
            <button
              id="tab-loyalty"
              onClick={() => {
                setDashboardTab("loyalty");
                setEditSuccessMsg("");
                setEditErrorMsg("");
              }}
              className={`pb-3 text-xs tracking-widest uppercase font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
                dashboardTab === "loyalty"
                  ? "border-black text-stone-950"
                  : "border-transparent text-stone-400 hover:text-stone-900"
              }`}
            >
              Loyalty Program
            </button>
          </div>

          {/* Tab contents renders */}
          <div className="pt-2">
            {/* Wishlist / Registry Tab */}
            {dashboardTab === "registry" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-[11px] uppercase tracking-widest font-bold text-stone-900">
                    Your Saved Atelier Concept Pieces
                  </h4>
                  <span className="text-[10px] text-stone-500 italic">Select individual concept specimens to request queue reservation</span>
                </div>

                {displayWishlist.length === 0 ? (
                  <div className="border border-dashed border-sand-200 rounded-none p-10 text-center bg-sand-50/50">
                    <p className="font-serif italic text-sm text-stone-400">
                      Your couture registry is empty. Navigate our luxury masterworks above to bookmark and request a reservation spot.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {displayWishlist.map((prod) => {
                      const isOrdered = currentUser.orders?.some((o: any) => o.item?.id === prod.id);
                      return (
                        <div
                          key={prod.id}
                          className="flex flex-col sm:flex-row bg-white border border-sand-200 rounded-none overflow-hidden shadow-xs relative group"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-full sm:w-32 h-40 sm:h-auto object-cover shrink-0"
                          />
                          <div className="p-5 flex flex-col justify-between w-full space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-start gap-2">
                                <h5 className="font-serif text-[13px] font-normal tracking-wide text-stone-950 italic">
                                  {prod.name}
                                </h5>
                                <span className="text-[8px] tracking-widest uppercase bg-stone-100 text-stone-900 px-2 py-0.5 rounded-none font-bold font-mono shrink-0">
                                  {isOrdered ? "Pre-Ordered" : "Reservation Open"}
                                </span>
                              </div>
                              <p className="font-serif text-[10px] text-stone-400 italic">
                                {prod.materials}
                              </p>
                              <p className="text-[11px] text-stone-500 font-sans line-clamp-2">
                                {prod.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-sand-200">
                              <div className="flex flex-col">
                                <span className="text-[8px] text-stone-400 uppercase tracking-widest font-mono">ESTIMATION</span>
                                <span className="font-mono text-xs font-semibold text-stone-900">
                                  ${prod.price.toLocaleString()}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  id={`btn-order-wish-${prod.id}`}
                                  disabled={isOrdered}
                                  onClick={async () => {
                                    setEditErrorMsg("");
                                    setIsLoading(true);
                                    try {
                                      const response = await fetch("/api/accounts/place-order", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ email: currentUser.email, item: prod }),
                                      });
                                      const data = await response.json();
                                      if (!response.ok) throw new Error(data.error);

                                      onLoginSuccess(data.user);
                                      setShowPointsToast("+100 Atelier Points Added!");
                                    } catch (err: any) {
                                      setEditErrorMsg(err.message || "Could not complete waitlist reservation.");
                                    } finally {
                                      setIsLoading(false);
                                    }
                                  }}
                                  className={`px-3 py-2 text-[9px] uppercase tracking-widest font-semibold rounded-none transition-all cursor-pointer ${
                                    isOrdered
                                      ? "bg-stone-100 text-stone-400 cursor-default"
                                      : "bg-black text-white hover:bg-stone-900"
                                  }`}
                                >
                                  {isLoading ? "Aligning..." : isOrdered ? "Queue Reserved" : "Reserve Queue spot"}
                                </button>
                                {onRemoveFromWishlist && (
                                  <button
                                    id={`btn-remove-registry-${prod.id}`}
                                    onClick={() => onRemoveFromWishlist(prod.id)}
                                    className="text-[9px] text-stone-400 hover:text-red-700 uppercase tracking-widest font-sans font-medium cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Past Commissions Tab */}
            {dashboardTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                  <div>
                    <h4 className="font-display text-[11.5px] uppercase tracking-widest font-extrabold text-stone-900">
                      Private Atelier Commission Ledger
                    </h4>
                    <span className="text-[9px] text-stone-400 font-sans tracking-wide">
                      Real-time cryptographic synchronization with secure Parisian workshops
                    </span>
                  </div>
                  <span className="text-[9.5px] text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-1 font-mono tracking-wider uppercase font-bold flex items-center gap-1.5 rounded-sm shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Verified Queue
                  </span>
                </div>

                {!currentUser.orders || currentUser.orders.length === 0 ? (
                  <div className="border border-dashed border-sand-200 rounded-none p-12 text-center bg-sand-50/50 space-y-4">
                    <div className="text-stone-305 mx-auto w-fit p-3 bg-white border border-sand-200 rounded-full">
                      <Scissors className="w-5 h-5 text-stone-400" />
                    </div>
                    <p className="font-serif italic text-sm text-stone-400 max-w-sm mx-auto leading-relaxed">
                      "No past reservations registered yet. Secure a custom waitlist selection in the curated catalog to activate diagnostic tracking."
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {currentUser.orders.map((ord: any) => {
                      const seed = ord.id.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                      
                      // Calculate active step index. By default, it's 1 (Atelier Production) or 2 (Quality Control) or 3 (Dispatched)
                      const baseStepVal = (seed % 3) + 1; // 1, 2, or 3
                      const activeStepIdx = orderProgressOverrides[ord.id] !== undefined 
                        ? orderProgressOverrides[ord.id] 
                        : baseStepVal;

                      const isExpanded = !!expandedOrders[ord.id];

                      // Precise steps required by customer request: 'Atelier Production', 'Quality Control', 'Dispatched'
                      const steps = [
                        {
                          name: "Couture Registry",
                          status: "System Serialization",
                          desc: "Priority slot secured. Cryptographic signature mapped on Paris mainframe.",
                          artisan: "Broker Agent Marc-A.",
                          metrics: "Registry Block ID: R-081B",
                          location: "Paris HQ",
                          stepNum: 1
                        },
                        {
                          name: "Atelier Production",
                          status: "Active Fabrication",
                          desc: "Laser template pattern cutting, triple-lock seam tailoring, and pocket assembly.",
                          artisan: "Senior Tailor Albert de L.",
                          metrics: "18,400 Premium Lockstitches",
                          location: "Lyon Sewing Room No. 3",
                          stepNum: 2
                        },
                        {
                          name: "Quality Control",
                          status: "Laboratory Audit",
                          desc: "Spectrophotometer grain test, seam stress audit, and solid-brass button engraving.",
                          artisan: "Lead Auditor Clara S.",
                          metrics: "0.02% Thread Defect Tolerance",
                          location: "Pre-dispatch Test Lab",
                          stepNum: 3
                        },
                        {
                          name: "Dispatched",
                          status: "VIP Hub Handover",
                          desc: "Hermetically sealed client dustbox assigned to priority CDG DHL air carrier.",
                          artisan: "Cargo Liaison Maxence T.",
                          metrics: "CDG Flight Slot Confirmed",
                          location: "Charles de Gaulle Escort Hub",
                          stepNum: 4
                        }
                      ];

                      // Identify active badge string
                      const currentStepObj = steps[Math.min(activeStepIdx, steps.length - 1)];
                      let badgeStyle = "bg-stone-50 text-stone-650 border-stone-200";
                      if (activeStepIdx === 1) {
                        badgeStyle = "bg-amber-50/70 text-amber-800 border-amber-200/50";
                      } else if (activeStepIdx === 2) {
                        badgeStyle = "bg-purple-50/70 text-purple-800 border-purple-200/50";
                      } else if (activeStepIdx >= 3) {
                        badgeStyle = "bg-[#EEFBF4] text-emerald-800 border-emerald-200/40";
                      }

                      return (
                        <div
                          key={ord.id}
                          className="bg-white border border-sand-200 hover:border-stone-400 p-6 rounded-none transition-all duration-350 shadow-2xs relative text-left"
                        >
                          {/* Inner elegant grid pattern header decoration */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />

                          {/* Order Header Coordinates */}
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-sand-100">
                            <div className="space-y-1">
                              <span className="text-[8px] text-stone-400 font-mono tracking-widest block uppercase font-bold">
                                Atelier Commission ID
                              </span>
                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-stone-900" />
                                <h5 className="font-mono text-xs font-extrabold text-stone-950 tracking-wide">
                                  {ord.id}
                                </h5>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[8px] text-stone-400 font-mono tracking-widest block uppercase font-bold">
                                Auth Date
                              </span>
                              <span className="text-[10px] text-stone-605 font-medium block">
                                {new Date(ord.orderDate).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[8px] text-stone-400 font-mono tracking-widest block uppercase font-extrabold">
                                Active Atelier Phase
                              </span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 font-mono flex items-center gap-1.5 w-fit ${badgeStyle}`}>
                                <span className={`w-1 h-1 rounded-full ${activeStepIdx >= 3 ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
                                {currentStepObj.name}
                              </span>
                            </div>

                            <button
                              id={`btn-expand-${ord.id}`}
                              onClick={() => setExpandedOrders(prev => ({ ...prev, [ord.id]: !prev[ord.id] }))}
                              className="text-[9.5px] uppercase tracking-widest font-extrabold text-stone-900 border border-stone-200 hover:border-black px-3.5 py-1.5 bg-stone-50 hover:bg-stone-100 cursor-pointer transition-all ml-auto lg:ml-0 rounded-sm select-none"
                            >
                              {isExpanded ? "Collapse Logs" : "Inspect Craft Logs"}
                            </button>
                          </div>

                          {/* Garment Row Details */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-5 pb-4 items-center">
                            <div className="md:col-span-7 flex items-center gap-4">
                              <img
                                src={ord.item?.image}
                                alt={ord.item?.name}
                                referrerPolicy="no-referrer"
                                className="w-14 h-16 object-cover border border-sand-200 rounded-sm shrink-0 shadow-2xs"
                              />
                              <div className="space-y-1">
                                <h6 className="font-serif italic text-sm font-bold text-stone-950">
                                  {ord.item?.name}
                                </h6>
                                <p className="text-[10px] text-stone-400 font-mono tracking-tight leading-none">
                                  Fiber Base: <strong className="text-stone-700 font-semibold">{ord.item?.materials || "Organic Long-staple Flax"}</strong>
                                </p>
                              </div>
                            </div>

                            <div className="md:col-span-5 flex justify-between md:justify-end items-center gap-6 w-full text-right">
                              <div className="space-y-0.5">
                                <span className="text-[8px] text-stone-400 font-mono block uppercase tracking-wider font-bold">Estimated Cost</span>
                                <span className="text-xs font-mono font-extrabold text-stone-950 block">
                                  ${ord.item?.price?.toLocaleString()} USD
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[8px] text-stone-400 font-mono block uppercase tracking-wider font-bold">Mainframe Report</span>
                                <span className="text-[10.5px] uppercase tracking-wide text-amber-700 font-bold font-mono">
                                  {currentStepObj.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* THE PREMIUM PROGRESS STEPPER (VISUAL STATUS TIMELINE) */}
                          <div className="mt-4 pt-4 border-t border-sand-100 pb-2">
                            <div className="relative select-none">
                              {/* Connector horizontal line with dynamic completion mask */}
                              <div className="absolute top-[16px] left-[12.5%] right-[12.5%] h-[2px] bg-stone-100 z-0">
                                <motion.div
                                  className="h-full bg-stone-950"
                                  initial={{ width: 0 }}
                                  animate={{ 
                                    width: activeStepIdx === 1 ? "33%" : activeStepIdx === 2 ? "66%" : activeStepIdx >= 3 ? "100%" : "0%"
                                  }}
                                  transition={{ duration: 0.65, ease: "easeOut" }}
                                />
                              </div>

                              <div className="flex justify-between relative z-10">
                                {steps.map((st, sIdx) => {
                                  const isStepCompleted = activeStepIdx > sIdx;
                                  const isStepActive = activeStepIdx === sIdx;
                                  
                                  let nodeStyle = "bg-white border-stone-200 text-stone-400";
                                  if (isStepCompleted) {
                                    nodeStyle = "bg-stone-950 text-white border-stone-950";
                                  } else if (isStepActive) {
                                    nodeStyle = "bg-amber-500 text-stone-950 border-amber-600 font-extrabold ring-4 ring-amber-400/20";
                                  }

                                  return (
                                    <div key={st.stepNum} className="flex flex-col items-center w-1/4 text-center">
                                      <div
                                        className={`w-8.5 h-8.5 rounded-full border flex items-center justify-center text-[10.5px] font-mono transition-all duration-350 cursor-pointer ${nodeStyle}`}
                                        title={st.name}
                                      >
                                        {isStepCompleted ? (
                                          <Check className="w-4 h-4 stroke-[3.5] text-white" />
                                        ) : (
                                          <span>0{st.stepNum}</span>
                                        )}
                                      </div>
                                      
                                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-stone-950 mt-2 font-display block h-3 overflow-hidden text-ellipsis truncate w-11/12">
                                        {st.name}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* INTERACTIVE EXPANDABLE CRAFT DETAIL CARD LOGS */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                                className="overflow-hidden mt-2 pt-2"
                              >
                                <div className="bg-stone-50 p-4 border border-sand-200 space-y-4 rounded-sm mt-3 text-left">
                                  <div className="flex items-center gap-1.5 border-b border-sand-200/60 pb-2">
                                    <Award className="w-3.5 h-3.5 text-stone-900" />
                                    <span className="text-[9px] uppercase tracking-wider text-stone-900 font-extrabold">Active Stage Fabrication Dossier: {currentStepObj.name}</span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                                    <div className="space-y-1 p-3 bg-white border border-sand-150">
                                      <span className="text-[8px] font-mono tracking-widest uppercase font-bold text-stone-400 block">Assigned Artisan</span>
                                      <span className="text-[11px] text-stone-900 font-semibold">{currentStepObj.artisan || "Awaiting Assignment"}</span>
                                    </div>
                                    <div className="space-y-1 p-3 bg-white border border-sand-150">
                                      <span className="text-[8px] font-mono tracking-widest uppercase font-bold text-stone-400 block">Inspection Locality</span>
                                      <span className="text-[11px] text-stone-900 font-semibold">{currentStepObj.location || "Central Queue Hub"}</span>
                                    </div>
                                    <div className="space-y-1 p-3 bg-white border border-sand-150">
                                      <span className="text-[8px] font-mono tracking-widest uppercase font-bold text-stone-400 block">Craft Telemetry Metric</span>
                                      <span className="text-[11px] text-amber-700 font-mono font-bold block">{currentStepObj.metrics || "Awaiting Measurement"}</span>
                                    </div>
                                  </div>

                                  <div className="space-y-1 pt-1.5">
                                    <span className="text-[8px] font-mono tracking-widest uppercase font-bold text-stone-400 block">Workshop Operations Narrative</span>
                                    <p className="text-[11px] text-stone-500 leading-relaxed font-sans italic">
                                      "{currentStepObj.desc}"
                                    </p>
                                  </div>

                                  {/* TELEMETRY DIAGNOSTIC MICRO-SCAN SEQUENCE UTILITY */}
                                  <div className="pt-3 border-t border-sand-200/65 mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="space-y-0.5">
                                      <span className="text-[8px] uppercase tracking-widest font-bold text-stone-400 block">Interactive Diagnostics Router</span>
                                      <p className="text-[10px] text-stone-400 leading-none">
                                        Initiate an immediate telemetry validation ping across active Lyon looms.
                                      </p>
                                    </div>

                                    <button
                                      id={`btn-diagnose-${ord.id}`}
                                      disabled={activeStepIdx >= 3}
                                      onClick={() => {
                                        // Advancing progress simulation beautifully with visual feedback
                                        const nextStepId = Math.min(activeStepIdx + 1, 3);
                                        setOrderProgressOverrides(prev => ({
                                          ...prev,
                                          [ord.id]: nextStepId
                                        }));
                                        
                                        // Increment Loyalty points by 20 for interacting!
                                        if (onPointsUpdated && currentUser) {
                                          onPointsUpdated(currentUser.points + 20);
                                        }
                                      }}
                                      className="bg-stone-950 hover:bg-stone-900 disabled:opacity-40 text-white text-[9px] uppercase tracking-widest font-bold px-4 py-2.5 transition-all w-full sm:w-auto text-center shrink-0 rounded-sm cursor-pointer"
                                    >
                                      {activeStepIdx >= 3 ? "All Audits Confirmed" : "Trigger Atelier Diagnostic Ping (+20 Points)"}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Couture Profile Details Tab */}
            {dashboardTab === "profile" && (
              <div className="space-y-6 max-w-xl text-left">
                <div>
                  <h4 className="font-display text-[11px] uppercase tracking-widest font-bold text-stone-900">
                    Couture Profile Details
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 font-sans">
                    Refine your personal Salon Privé client coordinates. Any changes will immediately synchronize securely across our servers.
                  </p>
                </div>

                {editSuccessMsg && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-none text-xs leading-relaxed font-sans">
                    {editSuccessMsg}
                  </div>
                )}
                {editErrorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-none text-xs leading-relaxed font-sans">
                    {editErrorMsg}
                  </div>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setEditSuccessMsg("");
                    setEditErrorMsg("");
                    setIsUpdatingProfile(true);

                    try {
                      const response = await fetch("/api/accounts/update-profile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          originalEmail: currentUser.email,
                          name: editName,
                          email: editEmail,
                          password: editPassword || undefined,
                        }),
                      });

                      const data = await response.json();
                      if (!response.ok) {
                        throw new Error(data.error || "Update failed.");
                      }

                      onLoginSuccess(data.user);
                      setEditSuccessMsg("Complimentary profile database coordinates updated successfully.");
                      setEditPassword("");
                    } catch (err: any) {
                      setEditErrorMsg(err.message || "An unexpected error occurred during update.");
                    } finally {
                      setIsUpdatingProfile(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-stone-800 font-bold block">
                      Full Client Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="edit-profile-name"
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-transparent border-b border-sand-200 focus:border-black px-10 py-2.5 text-xs outline-none text-stone-900 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-stone-800 font-bold block">
                      Client Email Address <span className="text-stone-300 italic font-normal">(e.g. realruvixon@gmail.com)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="edit-profile-email"
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-transparent border-b border-sand-200 focus:border-black px-10 py-2.5 text-xs outline-none text-stone-900 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-stone-800 font-bold block">
                      New Security Password <span className="text-stone-400 font-normal italic">(leave blank to preserve current)</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="edit-profile-password"
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-sand-200 focus:border-black px-10 py-2.5 text-xs outline-none text-stone-900 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <button
                    id="btn-save-profile"
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="bg-black hover:bg-stone-900 text-white rounded-none py-3 px-6 text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer pt-3"
                  >
                    {isUpdatingProfile ? (
                      <span className="flex items-center gap-2">
                        <Loader className="w-3.5 h-3.5 animate-spin" />
                        <span>Synchronizing Details...</span>
                      </span>
                    ) : (
                      <>
                        <span>Securely Save Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Loyalty / Earn Points Tab */}
            {dashboardTab === "loyalty" && (
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="font-display text-xs tracking-widest uppercase font-bold text-stone-900">Earn Private Maison Points</h3>
                  <p className="text-[11px] text-stone-500 mt-1">Increase your client loyalty ranking to fast-track catalog physical reservation privileges when the drop launches.</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 font-sans">
                  {/* Action 1 */}
                  <div className="bg-white border border-sand-200 p-4 rounded-none flex flex-col justify-between gap-3 text-left">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="bg-stone-100 text-stone-900 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-none font-mono">
                          +50 Pts
                        </span>
                        {followedInstagram && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <h5 className="text-xs font-bold text-stone-900 mt-2">Connect Instagram</h5>
                      <p className="text-[10px] text-stone-500 mt-1">Register @officialruvixon profile.</p>
                    </div>
                    <button
                      id="btn-earn-instagram"
                      disabled={followedInstagram}
                      onClick={() => handleEarnPoints("instagram", 50)}
                      className={`w-full py-2 rounded-none text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                        followedInstagram
                          ? "bg-stone-100 text-stone-400 cursor-default"
                          : "bg-black text-white hover:bg-stone-900"
                      }`}
                    >
                      {followedInstagram ? "Claimed" : "Verify @officialruvixon"}
                    </button>
                  </div>

                  {/* Action 2 */}
                  <div className="bg-white border border-sand-200 p-4 rounded-none flex flex-col justify-between gap-3 text-left">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="bg-stone-100 text-stone-900 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-none font-mono">
                          +100 Pts
                        </span>
                        {completedQuiz && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <h5 className="text-xs font-bold text-stone-900 mt-2">Atelier Sizing Survey</h5>
                      <p className="text-[10px] text-stone-500 mt-1">Select your preferred fit and styling disciplines.</p>
                    </div>
                    <button
                      id="btn-earn-quiz"
                      disabled={completedQuiz}
                      onClick={() => handleEarnPoints("quiz", 100)}
                      className={`w-full py-2 rounded-none text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                        completedQuiz
                          ? "bg-stone-100 text-stone-400 cursor-default"
                          : "bg-black text-white hover:bg-stone-900"
                      }`}
                    >
                      {completedQuiz ? "Claimed" : "Initiate Fit Survey"}
                    </button>
                  </div>

                  {/* Action 3 */}
                  <div className="bg-white border border-sand-200 p-4 rounded-none flex flex-col justify-between gap-3 text-left">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="bg-stone-100 text-stone-900 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-none font-mono">
                          +150 Pts
                        </span>
                        {referredFriend && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <h5 className="text-xs font-bold text-stone-900 mt-2">Refer a VIP Client</h5>
                      <p className="text-[10px] text-stone-500 mt-1">Introduce a friend to our private database access.</p>
                    </div>
                    <button
                      id="btn-earn-refer"
                      disabled={referredFriend}
                      onClick={() => handleEarnPoints("refer", 150)}
                      className={`w-full py-2 rounded-none text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                        referredFriend
                          ? "bg-stone-100 text-stone-400 cursor-default"
                          : "bg-black text-white hover:bg-stone-900"
                      }`}
                    >
                      {referredFriend ? "Claimed" : "Dispatch VIP Invite Link"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
