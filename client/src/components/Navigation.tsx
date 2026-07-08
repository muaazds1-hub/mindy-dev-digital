import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Services", id: "services" },
    { name: "Portfolio", id: "portfolio" },
    { name: "About", id: "about" },
    { name: "Solutions", id: "solutions" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "py-4 glass-card border-b-0 shadow-lg" : "py-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="cursor-pointer flex items-center" onClick={() => scrollTo("home")}>
              <img
                src="/mindy-dev-logo.png"
                alt="Mindy Dev"
                style={{
                  width: "140px",
                  height: "auto",
                  filter: "drop-shadow(0 0 12px rgba(32,236,162,0.5))",
                }}
              />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.id)}
                  className="text-white/80 hover:text-[#20eca2] font-medium transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Link href="/get-free-website">
                <button
                  data-testid="button-get-free-website"
                  className="relative px-5 py-2.5 rounded-xl font-bold text-sm overflow-hidden group"
                  style={{
                    background: "linear-gradient(135deg, #20eca2 0%, #10b981 100%)",
                    color: "#0f1728",
                    boxShadow: "0 0 20px rgba(32,236,162,0.4)",
                  }}
                >
                  <span className="relative z-10">Get Free Website</span>
                </button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-white p-2 z-[60] relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 w-full flex flex-col items-center py-8 gap-6 z-50"
              style={{
                background: "rgba(15, 23, 40, 0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(32,236,162,0.15)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.id)}
                  className="text-white text-xl font-display hover:text-[#20eca2] transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <Link href="/get-free-website" onClick={() => setMobileMenuOpen(false)}>
                <button
                  className="mt-2 px-8 py-3 rounded-xl font-bold text-sm"
                  style={{
                    background: "linear-gradient(135deg, #20eca2, #10b981)",
                    color: "#0f1728",
                    boxShadow: "0 0 20px rgba(32,236,162,0.4)",
                  }}
                >
                  Get Free Website
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Full-screen blurred backdrop for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{
              background: "rgba(10, 15, 30, 0.6)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
