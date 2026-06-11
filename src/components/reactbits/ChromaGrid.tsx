"use client";

import React from "react";
import BorderGlow from "./BorderGlow";

interface TemplateItem {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
}

interface ChromaGridProps {
  items: TemplateItem[];
  onSelect: (item: TemplateItem) => void;
  className?: string;
}

export default function ChromaGrid({
  items,
  onSelect,
  className = "",
}: ChromaGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {items.map((item) => (
        <BorderGlow
          key={item.id}
          glowColor="from-pink-500 via-primary to-purple-600"
          duration={3}
          className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 h-full"
        >
          <div
            onClick={() => onSelect(item)}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Template Card Image Placeholder */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900 flex items-center justify-center border-b border-border">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center p-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                    <span className="text-primary font-bold">{item.name[0]}</span>
                  </div>
                  <span className="text-muted text-xs uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              )}
              {/* Overlay hover effect */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-primary hover:bg-hover text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                  Use Template
                </span>
              </div>
            </div>

            {/* Template Card Details */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-heading font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                  {item.name}
                </h4>
                <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 rounded-full px-2 py-0.5 font-medium uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <p className="text-muted text-sm line-clamp-2 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </BorderGlow>
      ))}
    </div>
  );
}
