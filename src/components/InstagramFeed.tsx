import React from "react";
import { Instagram, Heart, MessageCircle, ExternalLink, Sparkles } from "lucide-react";

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
}

export default function InstagramFeed() {
  const posts: InstagramPost[] = [
    {
      id: "ig-1",
      imageUrl: "/src/assets/images/brown_coordinates_set_1781808087123.jpg",
      caption: "Structural alignment. SS '26 cocoa-brown coordinates captured in the light of the morning workshop. #MaisonRuvixon #CoutureAlignment #MinimalistWorkwear",
      likes: 1845,
      comments: 32,
      date: "2 hours ago",
    },
    {
      id: "ig-2",
      imageUrl: "/src/assets/images/atelier_flax_stitch_1781808595115.jpg",
      caption: "Constructing silhouette. Our raw heavy flax is sourced from ethical mills and stitched using legacy triple-needle techniques for extreme durability. #LegacyTailoring #ArtisanCraft #OrganicLinen",
      likes: 2401,
      comments: 54,
      date: "1 day ago",
    },
    {
      id: "ig-3",
      imageUrl: "/src/assets/images/coord_set_denim_1781803903594.jpg",
      caption: "Couture isn't decorated; it is built. Architectural geometry defining the upcoming Summer SS '26 preview lookbook. Priority registry now active. #SalonPrive #SummerSS26 #AtelierVibe",
      likes: 3122,
      comments: 78,
      date: "3 days ago",
    },
    {
      id: "ig-4",
      imageUrl: "/src/assets/images/textural_contrast_cocoa_denim_1781808607523.jpg",
      caption: "Textural contrast. Pairing cocoa flax and structured heavyweight indigo. Material alignment for the modern wardrobe. #MaisonRuvixon #IndustrialAesthetic",
      likes: 1980,
      comments: 29,
      date: "4 days ago",
    },
    {
      id: "ig-5",
      imageUrl: "/src/assets/images/cocoa_linen_grid_pattern_1781808621636.jpg",
      caption: "Masterwork raw Linen texture. 100% Cocoa Organic Linen Grid Formulary closeup. Experience luxury you can feel. #TextileScience #RawLuxury #AtelierDesign",
      likes: 1650,
      comments: 21,
      date: "6 days ago",
    },
    {
      id: "ig-6",
      imageUrl: "/src/assets/images/ruvixon_engraved_hardware_1781808634483.jpg",
      caption: "The Private Launch Registry is officially active. Secure your queue position for priority collection dropping in Autumn 2026. #MaisonRuvixon #LockedInQueue #SalonPrive",
      likes: 2795,
      comments: 63,
      date: "1 week ago",
    },
  ];

  return (
    <div className="border-t border-sand-200 bg-stone-50 py-16 px-6 sm:px-12" id="instagram-section">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] font-extrabold text-stone-400">
              <Instagram className="w-3.5 h-3.5 text-stone-900" />
              <span>@officialruvixon Social Feed</span>
            </div>
            <h3 className="font-serif text-2xl tracking-wide text-stone-950 font-normal italic">
              L’Esthétique Maison
            </h3>
            <p className="text-xs text-stone-500 max-w-xl font-sans">
              Follow our official signature feed <span className="font-semibold text-stone-900">@officialruvixon</span> to lock into our daily atelier journals, architectural layout designs, and luxury lookbook updates.
            </p>
          </div>

          <a
            href="https://instagram.com/officialruvixon"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-black hover:bg-stone-900 text-white text-[11px] uppercase tracking-widest font-semibold px-5 py-3 transition-all cursor-pointer font-sans h-fit w-fit"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow officialruvixon</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* Visual Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/officialruvixon"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square bg-stone-200 overflow-hidden border border-sand-200 transition-all cursor-pointer block"
              id={`instagram-post-${post.id}`}
            >
              {/* Post Image */}
              <img
                src={post.imageUrl}
                alt={post.caption}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-750 group-hover:scale-105 brightness-[0.98] group-hover:brightness-95"
              />

              {/* Hover Overlay Details */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 z-10 text-white">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-stone-300" />
                    <span className="text-[8px] uppercase tracking-widest font-mono text-stone-300">Ruvixon Journal</span>
                  </div>
                  <p className="text-[10px] leading-relaxed line-clamp-4 text-stone-200 font-sans italic">
                    "{post.caption}"
                  </p>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-2 font-mono">
                  <div className="flex items-center justify-between text-[10px] text-stone-300">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-white text-white" />
                      {post.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                      {post.comments}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[8px] uppercase tracking-widest text-stone-500">
                    <span>@officialruvixon</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
