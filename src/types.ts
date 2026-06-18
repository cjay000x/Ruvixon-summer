export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  details: string[];
  materials: string;
  isWaitlist: boolean;
  statusText: string;
}

export interface User {
  name: string;
  email: string;
  points: number;
  tier: string;
  registeredAt: string;
  orders: any[];
  wishlist: string[]; // List of product IDs
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type?: "success" | "info" | "warning" | "error" | "ambient";
  duration?: number;
}

