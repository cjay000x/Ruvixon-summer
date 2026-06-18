import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data files directory
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SIGNUPS_FILE = path.join(DATA_DIR, "signups.json");
const ACCOUNTS_FILE = path.join(DATA_DIR, "accounts.json");

// Local db helpers
function readJSONFile(filePath: string, defaultData: any) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultData;
}

function writeJSONFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Lazy Gemini Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required in secrets");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes

// Store Email Signups
app.post("/api/signups", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const signups = readJSONFile(SIGNUPS_FILE, []);
  if (signups.some((s: any) => s.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: "This email is already registered on our early access list." });
  }

  const newSignup = {
    email: email.toLowerCase(),
    registeredAt: new Date().toISOString(),
  };

  signups.push(newSignup);
  writeJSONFile(SIGNUPS_FILE, signups);

  res.json({ success: true, message: "Successfully joined the private launch list." });
});

// Fetch all early access signups (for exporting later)
app.get("/api/signups", (req, res) => {
  const signups = readJSONFile(SIGNUPS_FILE, []);
  res.json({ count: signups.length, signups });
});

// Register User Account
app.post("/api/accounts/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required registration details." });
  }

  const accounts = readJSONFile(ACCOUNTS_FILE, []);
  if (accounts.some((acc: any) => acc.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: "An account with this email already exists." });
  }

  const newAccount = {
    name,
    email: email.toLowerCase(),
    password, // Stored as a simple mockup representation
    points: 150, // 150 points for signing up
    tier: "Salon Privé Member",
    registeredAt: new Date().toISOString(),
    orders: [],
    wishlist: []
  };

  accounts.push(newAccount);
  writeJSONFile(ACCOUNTS_FILE, accounts);

  res.json({
    success: true,
    user: {
      name: newAccount.name,
      email: newAccount.email,
      points: newAccount.points,
      tier: newAccount.tier,
      registeredAt: newAccount.registeredAt,
      orders: newAccount.orders,
      wishlist: newAccount.wishlist
    },
  });
});

// Login User Account
app.post("/api/accounts/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter both email and password." });
  }

  const accounts = readJSONFile(ACCOUNTS_FILE, []);
  const user = accounts.find((acc: any) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials. Please try again." });
  }

  res.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      points: user.points,
      tier: user.tier || "Salon Privé Member",
      registeredAt: user.registeredAt,
      orders: user.orders || [],
      wishlist: user.wishlist || []
    },
  });
});

// Profile Lookup Synchronization
app.get("/api/accounts/profile", (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email query coordinates required." });
  }

  const accounts = readJSONFile(ACCOUNTS_FILE, []);
  const user = accounts.find((acc: any) => acc.email.toLowerCase() === (email as string).toLowerCase());

  if (!user) {
    return res.status(404).json({ error: "Maison registry profile not found." });
  }

  res.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      points: user.points || 150,
      tier: user.tier || "Salon Privé Member",
      registeredAt: user.registeredAt,
      orders: user.orders || [],
      wishlist: user.wishlist || []
    }
  });
});

// Update User Profile (Name, Email, Password)
app.post("/api/accounts/update-profile", (req, res) => {
  const { originalEmail, name, email, password, points, tier } = req.body;
  if (!originalEmail || !name || !email) {
    return res.status(400).json({ error: "Name and email are required to update profile." });
  }

  const accounts = readJSONFile(ACCOUNTS_FILE, []);
  const userIdx = accounts.findIndex((acc: any) => acc.email.toLowerCase() === originalEmail.toLowerCase());

  if (userIdx === -1) {
    return res.status(404).json({ error: "Client account not found." });
  }

  // If changing email, verify it's not already in use by someone else
  if (originalEmail.toLowerCase() !== email.toLowerCase()) {
    if (accounts.some((acc: any) => acc.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: "An account with the new email address already exists." });
    }
  }

  // Update details
  accounts[userIdx].name = name;
  accounts[userIdx].email = email.toLowerCase();
  if (password) {
    accounts[userIdx].password = password;
  }
  if (points !== undefined) {
    accounts[userIdx].points = points;
  }
  if (tier !== undefined) {
    accounts[userIdx].tier = tier;
  }

  writeJSONFile(ACCOUNTS_FILE, accounts);

  res.json({
    success: true,
    user: {
      name: accounts[userIdx].name,
      email: accounts[userIdx].email,
      points: accounts[userIdx].points,
      tier: accounts[userIdx].tier || "Salon Privé Member",
      registeredAt: accounts[userIdx].registeredAt,
      orders: accounts[userIdx].orders || [],
      wishlist: accounts[userIdx].wishlist || []
    }
  });
});

// Update Wishlist
app.post("/api/accounts/update-wishlist", (req, res) => {
  const { email, wishlist } = req.body;
  if (!email || !Array.isArray(wishlist)) {
    return res.status(400).json({ error: "Malformed wishlist update request." });
  }

  const accounts = readJSONFile(ACCOUNTS_FILE, []);
  const userIdx = accounts.findIndex((acc: any) => acc.email.toLowerCase() === email.toLowerCase());

  if (userIdx === -1) {
    return res.status(404).json({ error: "Account not found." });
  }

  accounts[userIdx].wishlist = wishlist;
  writeJSONFile(ACCOUNTS_FILE, accounts);

  res.json({ success: true, wishlist: accounts[userIdx].wishlist });
});

// Place simulated waitlist order
app.post("/api/accounts/place-order", (req, res) => {
  const { email, item } = req.body;
  if (!email || !item) {
    return res.status(400).json({ error: "Missing order email coordinates or item properties." });
  }

  const accounts = readJSONFile(ACCOUNTS_FILE, []);
  const userIdx = accounts.findIndex((acc: any) => acc.email.toLowerCase() === email.toLowerCase());

  if (userIdx === -1) {
    return res.status(404).json({ error: "Account not found." });
  }

  const user = accounts[userIdx];
  if (!user.orders) user.orders = [];

  const orderId = `RVX-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder = {
    id: orderId,
    item: {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      materials: item.materials,
    },
    orderDate: new Date().toISOString(),
    status: "Priority Waitlist Active",
    trackingStep: "Serialized Queue Alignment", // Steps can be: Pattern Cut, Sizing Allocation, Queue Alignment
  };

  user.orders.unshift(newOrder); // Add to beginning of past orders
  
  // Award 100 points for placing a registry waitlist order!
  user.points = (user.points || 150) + 100;
  user.tier = user.points >= 500 ? (user.points >= 1000 ? "Haute Couture Circle" : "Atelier Gold Member") : "Salon Privé Member";

  writeJSONFile(ACCOUNTS_FILE, accounts);

  res.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      points: user.points,
      tier: user.tier || "Salon Privé Member",
      registeredAt: user.registeredAt,
      orders: user.orders,
      wishlist: user.wishlist || []
    },
    order: newOrder,
  });
});

// AI Customer Assistant Chat
function getLocalStylistFallback(messagesArray: any[]): string {
  const lastUserMessage = [...messagesArray]
    .reverse()
    .find(msg => msg.role === "user")?.content || "";
    
  const q = lastUserMessage.toLowerCase();
  
  if (q.includes("buy") || q.includes("purchase") || q.includes("drop") || q.includes("release") || q.includes("launch") || q.includes("soon") || q.includes("reserve") || q.includes("waitlist") || q.includes("order") || q.includes("shop")) {
    return "Gracious greetings. Our Summer SS '26 preview collection is currently marked strictly 'Coming Soon'. These masterwork pieces are exclusive prototype creations. However, you are cordially invited to establish your member account or click 'Reserve' on any garment to secure your priority position on our waitlist. This aligns your coordinates for early access invitations when the collection goes live.";
  }
  
  if (q.includes("fabric") || q.includes("material") || q.includes("cocoa") || q.includes("indigo") || q.includes("linen") || q.includes("denim") || q.includes("grid") || q.includes("shirt") || q.includes("cotton") || q.includes("short")) {
    return "Maison Ruvixon emphasizes sculptural geometry and heavyweight organic textiles. Our premier coordinates—such as 'The Cocoa Grid Atelier Coordinates' ($2,450) and 'The Indigo West Utility Set' ($2,800)—showcase heavy-flax linen grids and heavy organic cotton denim. Each piece features structural lines, precise triple-needle stitching, and custom brass hardware engraved with our signature 'R' emblem.";
  }
  
  if (q.includes("loyalty") || q.includes("points") || q.includes("member") || q.includes("account") || q.includes("privé") || q.includes("prive") || q.includes("join") || q.includes("tier")) {
    return "By creating custom Maison member credentials, you are registered directly into our Salon Privé directory and automatically awarded 150 early-access Atelier Loyalty Points. These points grant priority queue alignment and enable private, virtual sizing consultations with our personal stylists.";
  }
  
  if (q.includes("size") || q.includes("fit") || q.includes("measure") || q.includes("ruler") || q.includes("sizing")) {
    return "For detailed measurements, you are invited to explore our premium 'Size & Fit' dossier, accessible directly via our standard navigation bar. Maison Ruvixon silhouettes are tailored with a robust, relaxed fit, offering majestic drape and sophisticated comfort that flow beautifully on the body.";
  }
  
  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("welcome") || q.includes("concierge") || q.includes("guid") || q.includes("advisor")) {
    return "Welcome to Maison Ruvixon, where architectural tailorship meets minimalist luxury. As your personal Salon Concierge, it is my privilege to host you. May I assist you in registering for early access, curating your lookbook wishlist, or inspecting our artisan raw linen coordinates?";
  }

  return "Gracious greetings. Thank you for your inquiry to the Maison. Our digital salon concierge is currently conducting private client curations. I would be absolutely delighted to assist you with inquiries regarding our raw premium textures, waitlist reservations, or custom sizing standardizations. Please let me know how I can perfectly elevate your styling experience today.";
}

app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Malformed messages payload." });
    }

    // Map client message format to Gemini content parts
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const systemInstruction = `You are the elite "Maison Ruvixon Salon Concierge" & highly sophisticated fashion stylist. 
Ruvixon (pronounced roo-vee-xon) is an ultra-exclusive, luxury haute couture and ready-to-wear fashion house, mirroring the architectural precision, minimalist opulence, and prestige of Dior, Chanel, or Saint Laurent.

Essential Brand Details to convey seamlessly inside your conversations:
- Brand Name: Ruvixon
- Brand Instagram: officialruvixon
- Brand Support Email: realruvixon@gmail.com
- Summer SS '26 (Spring/Summer 2026) Collection Concept: Highly structured minimalist workwear & elegant coordinates emphasizing clean lines, high-contrast structural designs, and raw luxury materials. "The Summer collection is about to drop soon."
- Launch Status: We haven't dropped anything yet. Products shown in the catalog are exclusive prototype masterworks. Clients can enroll in our "Private Launch Registry" directly on the website to receive priority emails and invitations when the collection goes live.
- Highlighted Outfits (available for digital lookbook preview and priority waitlist):
  1. "The Cocoa Grid Atelier Coordinates" ($2,450 waitlist estimation): A short-sleeve button-up utility shirt in structured cocoa-brown grid plaid fabric, boasting dual utility chest patch pockets. Styled with a subtle embroidered sun emblem on one pocket, and paired with matching grid wide-leg shorts with a refined off-white cream drawstring tie.
  2. "The Indigo West Utility Set" ($2,800 waitlist estimation): The signature boxy cocoa-brown grid utility short-sleeve button-up shirt matched with heavy-weight wide-leg washed dark-brown denim shorts with metal hardware detailing.
- Loyalty & Accounts: Visitors can register for custom "Maison Ruvixon Member Accounts". Signing up immediately grants 150 "Atelier Loyalty Points" (Maison Ruvixon points can be redeemed for private virtual couture fit consultations or priority launch queue access), and assigns the "Salon Privé" client status.

Communication Philosophy:
- Sound incredibly refined, sophisticated, eloquent, and professional. You do not talk in slang or write long-winded lists of standard bot bullets. Frame your messages as a cordial fashion director or personal salon manager hosting a VIP client.
- When clients ask about purchasing, graciously explain that SS '26 hasn't dropped yet and is marked "Coming Soon," but they can pre-reserve them or join the early registry.
- Maintain exquisite, respectful vocabulary. Refer to products as "masterworks," "curated coordinates," "atelier pieces," or "creations." Provide bespoke recommendations for events they mention (e.g. travel, dinner, yacht, runway previews).
- Keep responses compact yet luxurious. Always offer to assist with adding to their personal digital registry list or setting up their Member Profile.`;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Falling back to rule-based Maison stylist responder.");
      const content = getLocalStylistFallback(messages);
      return res.json({ content });
    }

    try {
      const ai = getGeminiAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      if (response && response.text) {
        return res.json({ content: response.text });
      }
    } catch (err: any) {
      console.warn("Primary Gemini model (gemini-3.5-flash) failed, attempting fallback to gemini-3.1-flash-lite...", err?.message || err);
      
      try {
        const ai = getGeminiAI();
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: contents,
          config: {
            systemInstruction,
            temperature: 0.75,
          }
        });

        if (fallbackResponse && fallbackResponse.text) {
          console.log("Successfully resolved response using fallback model (gemini-3.1-flash-lite).");
          return res.json({ content: fallbackResponse.text });
        }
      } catch (fallbackError: any) {
        console.error("Secondary Gemini model (gemini-3.1-flash-lite) also failed:", fallbackError?.message || fallbackError);
      }
    }

    // Absolutely fallback to elegant rules-based response if all Gemini endpoints fail
    console.log("Both Gemini models failed or timed out. Serving elegant client-facing rule-based concierge responder.");
    const content = getLocalStylistFallback(messages);
    return res.json({ content });

  } catch (err: any) {
    console.error("General chat endpoint exception caught:", err);
    try {
      const { messages } = req.body;
      const content = getLocalStylistFallback(messages || []);
      return res.json({ content });
    } catch (innerErr) {
      res.status(500).json({ error: "The Salon Concierge is briefly unavailable. Please try again soon." });
    }
  }
});

// Vite Middleware integration for dev/prod environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched and listening on http://localhost:${PORT}`);
  });
}

startServer();
