import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  GraduationCap, Stethoscope, Dumbbell, Utensils, Briefcase,
  Store, Home, Car, Plane, Camera, Code, ShoppingBag,
  Heart, Star, Globe, Building, Laptop, Shirt,
  ExternalLink, MessageSquare,
} from "lucide-react";
import type { PortfolioProject } from "@shared/schema";

const WHATSAPP_SIMILAR =
  "https://wa.me/923289789178?text=Hi%2C%20I%20want%20a%20website%20like%20your%20portfolio";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  GraduationCap, Stethoscope, Dumbbell, Utensils, Briefcase,
  Store, Home, Car, Plane, Camera, Code, ShoppingBag,
  Heart, Star, Globe, Building, Laptop, Shirt,
};

const ALL_CATEGORIES = [
  "All", "Education", "Medical", "Fitness", "Food", "Business",
  "Fashion", "Real Estate", "Technology", "Travel", "Other",
];

function PortfolioCard({ project, index }: { project: PortfolioProject; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const Icon = ICON_MAP[project.iconName] ?? Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered
          ? `0 0 0 2px #20eca2, 0 20px 60px rgba(32,236,162,0.25), 0 8px 30px rgba(0,0,0,0.4)`
          : `0 8px 30px rgba(0,0,0,0.3)`,
        transform: hovered ? "translateY(-10px) scale(1.01)" : "translateY(0px) scale(1)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
      className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col group cursor-pointer"
    >
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-20">
        <span
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: `${project.color}22`,
            color: project.color,
            border: `1px solid ${project.color}44`,
          }}
        >
          {project.category}
        </span>
      </div>

      {/* Website Preview */}
      <div className="relative w-full overflow-hidden" style={{ height: "220px" }}>
        {!loaded && (
          <div className="absolute inset-0 flex flex-col gap-3 p-4 bg-white/5">
            <div className="h-5 w-3/4 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-white/5 animate-pulse" />
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="h-16 rounded-xl bg-white/10 animate-pulse" />
              <div className="h-16 rounded-xl bg-white/5 animate-pulse" />
            </div>
          </div>
        )}

        <iframe
          src={project.url}
          title={project.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="w-full border-0 pointer-events-none"
          style={{
            height: "600px",
            transform: "scale(0.367)",
            transformOrigin: "top left",
            width: "272%",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0f1728] to-transparent z-10" />

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-20 flex items-center justify-center gap-3"
              style={{ background: "rgba(15,23,40,0.85)", backdropFilter: "blur(4px)" }}
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-[#0f1728] transition-all duration-200"
                style={{ background: "#20eca2", boxShadow: "0 0 20px rgba(32,236,162,0.5)" }}
              >
                <ExternalLink className="w-4 h-4" />
                View Live
              </a>
              <a
                href={WHATSAPP_SIMILAR}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white border border-white/30 bg-white/10 transition-all duration-200"
                style={{ backdropFilter: "blur(6px)" }}
              >
                <MessageSquare className="w-4 h-4" />
                Get Similar
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <motion.div
          animate={hovered ? { y: -3, scale: 1.08 } : { y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
          style={{ background: `${project.color}18`, border: `1px solid ${project.color}33` }}
        >
          <Icon className="w-6 h-6" style={{ color: project.color }} />
        </motion.div>

        <h3 className="text-xl font-display font-bold text-white leading-snug">
          {project.title}
        </h3>
        <p className="text-white/55 text-sm leading-relaxed">{project.description}</p>

        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/8">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#20eca2] text-sm font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Live
          </a>
          <a
            href={WHATSAPP_SIMILAR}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 text-sm font-medium flex items-center gap-1.5 hover:text-white/80 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Get Similar
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: projects = [], isLoading } = useQuery<PortfolioProject[]>({
    queryKey: ["/api/portfolio"],
  });

  const usedCategories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const categories = ALL_CATEGORIES.filter((c) => usedCategories.includes(c));

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-28 relative z-10">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#20eca2] opacity-[0.03] blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#20eca2]/10 border border-[#20eca2]/30 text-[#20eca2] text-sm font-semibold tracking-wide">
            Real Work. Real Results.
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-5 leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20eca2] to-[#10b981]">Portfolio</span>
          </h2>
          <p className="text-lg md:text-xl text-white/65 leading-relaxed">
            We design high-converting websites for businesses worldwide — see our live projects below.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none"
              style={
                activeFilter === cat
                  ? { background: "#20eca2", color: "#0f1728", boxShadow: "0 0 20px rgba(32,236,162,0.45)" }
                  : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }
              }
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((project, i) => (
                <PortfolioCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* CTA Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 text-center"
        >
          <div
            className="inline-flex flex-col items-center gap-6 px-10 py-10 rounded-3xl border border-[#20eca2]/20 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(32,236,162,0.07) 0%, rgba(31,88,241,0.1) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#20eca2] rounded-full blur-[80px] opacity-10 pointer-events-none" />
            <p className="text-white/60 text-sm font-medium uppercase tracking-widest relative z-10">
              Ready to go live?
            </p>
            <h3 className="text-3xl md:text-4xl font-display font-extrabold text-white relative z-10">
              Want a website like these?
            </h3>
            <a
              href={WHATSAPP_SIMILAR}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center gap-3 px-8 py-4 rounded-2xl text-[#0f1728] font-bold text-lg transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #20eca2 0%, #10b981 100%)",
                boxShadow: "0 0 30px rgba(32,236,162,0.5), 0 8px 30px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 50px rgba(32,236,162,0.75), 0 8px 30px rgba(0,0,0,0.3)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 30px rgba(32,236,162,0.5), 0 8px 30px rgba(0,0,0,0.3)";
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              <MessageSquare className="w-5 h-5" />
              Get Your Website Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
