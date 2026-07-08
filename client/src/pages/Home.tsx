import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Rocket, Search, PenTool, Layout, 
  MessageSquare, Code, Star, Users, 
  Globe, CheckCircle2, TrendingUp,
  Target, Eye, Store, Home as HomeIcon, Car, Plane, Camera,
  ShoppingBag, Heart, Building, Laptop, Shirt, Briefcase,
  GraduationCap, Stethoscope, Dumbbell, Utensils,
} from "lucide-react";
import { SiGoogle, SiTrustpilot, SiFiverr, SiUpwork } from "react-icons/si";
import { Linkedin } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { NeonButton } from "@/components/NeonButton";
import { ContactForm } from "@/components/ContactForm";
import { PortfolioSection } from "@/components/PortfolioSection";
import type { Service } from "@shared/schema";

const SERVICE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket, PenTool, Layout, Code, TrendingUp, Target, Eye, Search,
  Store, HomeIcon, Car, Plane, Camera, ShoppingBag, Heart, Building,
  Laptop, Shirt, Briefcase, GraduationCap, Stethoscope, Dumbbell, Utensils,
  MessageSquare, Globe, Star, Users, CheckCircle2,
};

export default function Home() {
  const whatsappUrl = "https://wa.me/923289789178?text=Hello%20Mindy%20Dev%2C%20I%20am%20interested%20in%20your%20digital%20services";
  const whatsappProjectUrl = "https://wa.me/923289789178?text=Hello%20Mindy%20Dev%2C%20I%20want%20to%20start%20a%20project";

  const { data: servicesData = [] } = useQuery<Service[]>({ queryKey: ["/api/services"] });

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navigation />

      <main>
        {/* 1. HERO SECTION */}
        <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex items-center min-h-[90vh]">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn} className="inline-block mb-4 px-4 py-1.5 rounded-full glass-card border border-[#20eca2]/30 text-[#20eca2] text-sm font-medium tracking-wide">
                Pakistan's 1st Digital Agency Working with Guarantees & Economical Prices
              </motion.div>
              
              <motion.h1 
                variants={fadeIn}
                className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold mb-6 leading-tight text-white"
              >
                Grow Your Brand <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20eca2] to-[#10b981] neon-text">Digitally</span> With Mindy Dev
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="text-lg md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                We help businesses grow online with powerful marketing strategies, creative design, and modern websites.
              </motion.p>
              
              <motion.div 
                variants={fadeIn}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <NeonButton size="lg" className="w-full">
                    Get Started
                  </NeonButton>
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <NeonButton variant="glass" size="lg" className="w-full flex items-center gap-2">
                    <MessageSquare size={20} />
                    Chat on WhatsApp
                  </NeonButton>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2. TRUST SECTION */}
        <section className="py-12 border-y border-white/10 bg-white/5 backdrop-blur-md relative z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-4 flex flex-col items-center justify-center"
              >
                <Star className="w-10 h-10 text-[#20eca2] mb-3 drop-shadow-[0_0_8px_rgba(32,236,162,0.8)]" />
                <h3 className="text-4xl font-display font-bold text-white mb-1">5.0</h3>
                <p className="text-white/70 font-medium tracking-wide uppercase text-sm">Star Rating</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-4 flex flex-col items-center justify-center"
              >
                <Users className="w-10 h-10 text-[#20eca2] mb-3 drop-shadow-[0_0_8px_rgba(32,236,162,0.8)]" />
                <h3 className="text-4xl font-display font-bold text-white mb-1">1000+</h3>
                <p className="text-white/70 font-medium tracking-wide uppercase text-sm">Customers Worldwide</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-4 flex flex-col items-center justify-center"
              >
                <Globe className="w-10 h-10 text-[#20eca2] mb-3 drop-shadow-[0_0_8px_rgba(32,236,162,0.8)]" />
                <h3 className="text-3xl font-display font-bold text-white mb-1 leading-tight">Global</h3>
                <p className="text-white/70 font-medium tracking-wide uppercase text-sm">Clients From Around The World</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TRUST BADGES SECTION */}
        <section className="py-10 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-white/40 text-sm uppercase tracking-widest font-medium mb-8"
            >
              Trusted & Reviewed On
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-6"
            >
              {/* Google */}
              <div className="glass-card flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10">
                <SiGoogle className="w-5 h-5 text-white/80" />
                <div>
                  <div className="text-white font-semibold text-sm leading-tight">Google</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#20eca2] text-[#20eca2]" />
                    ))}
                    <span className="text-[#20eca2] text-xs font-bold ml-1">5.0</span>
                  </div>
                </div>
              </div>

              {/* Trustpilot */}
              <div className="glass-card flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10">
                <SiTrustpilot className="w-5 h-5 text-[#00b67a]" />
                <div>
                  <div className="text-white font-semibold text-sm leading-tight">Trustpilot</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#00b67a] text-[#00b67a]" />
                    ))}
                    <span className="text-[#00b67a] text-xs font-bold ml-1">5.0</span>
                  </div>
                </div>
              </div>

              {/* Fiverr */}
              <div className="glass-card flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10">
                <SiFiverr className="w-5 h-5 text-[#1dbf73]" />
                <div>
                  <div className="text-white font-semibold text-sm leading-tight">Fiverr</div>
                  <div className="text-white/50 text-xs mt-0.5">Top Rated Seller</div>
                </div>
              </div>

              {/* Upwork */}
              <div className="glass-card flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10">
                <SiUpwork className="w-5 h-5 text-[#6fda44]" />
                <div>
                  <div className="text-white font-semibold text-sm leading-tight">Upwork</div>
                  <div className="text-white/50 text-xs mt-0.5">Top Rated Agency</div>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="glass-card flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10">
                <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                <div>
                  <div className="text-white font-semibold text-sm leading-tight">LinkedIn</div>
                  <div className="text-white/50 text-xs mt-0.5">Verified Agency</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. SERVICES SECTION */}
        <section id="services" className="py-24 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Our Digital <span className="text-[#20eca2]">Services</span></h2>
              <p className="text-lg text-white/70">Comprehensive solutions designed to elevate your brand and drive measurable growth across all digital touchpoints.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesData.map((service, i) => {
                const Icon = SERVICE_ICON_MAP[service.iconName] ?? Rocket;
                if (service.isHot) {
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative overflow-hidden rounded-2xl p-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#20eca2] via-[#1f58f1] to-[#20eca2] opacity-50 animate-pulse"></div>
                      <div className="relative h-full bg-[#1f58f1] p-8 rounded-[14px] flex flex-col items-start shadow-xl">
                        <div className="absolute top-4 right-4 bg-[#20eca2] text-[#1f58f1] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-bounce">
                          Hot Selling
                        </div>
                        <div className="w-16 h-16 rounded-xl bg-[#20eca2]/20 flex items-center justify-center mb-6 border border-[#20eca2]/50">
                          <Icon className="w-8 h-8 text-[#20eca2]" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-3">{service.title}</h3>
                        <p className="text-white/70 leading-relaxed mb-6">{service.description}</p>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-auto">
                          <span className="text-[#20eca2] font-semibold flex items-center gap-2 hover:underline">
                            Learn More <Rocket className="w-4 h-4" />
                          </span>
                        </a>
                      </div>
                    </motion.div>
                  );
                }
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col items-start text-left"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                      <Icon className="w-8 h-8 text-[#20eca2]" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-white/60 leading-relaxed">{service.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. WEB DEV HIGHLIGHT */}
        <section className="py-24 relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#20eca2]/5 to-transparent"></div>
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-block mb-4 px-4 py-1 rounded-full bg-[#20eca2]/10 border border-[#20eca2]/30 text-[#20eca2] font-semibold text-sm">
                  Premium Quality
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                  High-Converting <span className="text-[#20eca2]">Websites</span> for Global Brands
                </h2>
                <p className="text-xl text-white/80 mb-8 leading-relaxed">
                  We build modern, fast and high-converting websites for brands, salons, gyms, restaurants and businesses worldwide.
                </p>
                
                <ul className="space-y-4 mb-10">
                  {[
                    "Modern UI/UX Design",
                    "Mobile Responsive",
                    "WhatsApp Integration",
                    "SEO Friendly",
                    "Fast Loading Speed"
                  ].map((feature, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-lg text-white"
                    >
                      <CheckCircle2 className="w-6 h-6 text-[#20eca2]" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                
                <a href={whatsappProjectUrl} target="_blank" rel="noopener noreferrer">
                  <NeonButton size="lg">Start Your Web Project</NeonButton>
                </a>
              </motion.div>
              
              <motion.div 
                className="lg:w-1/2 relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {/* Abstract abstract representation of a website UI */}
                <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#20eca2]/20 to-transparent rounded-3xl transform rotate-3 blur-sm"></div>
                  <div className="absolute inset-0 glass-card rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
                    {/* Browser Header */}
                    <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    {/* Body */}
                    <div className="flex-1 p-6 flex flex-col gap-6 relative">
                      <div className="w-3/4 h-8 rounded-lg bg-white/10 animate-pulse"></div>
                      <div className="space-y-3">
                        <div className="w-full h-4 rounded bg-white/5"></div>
                        <div className="w-5/6 h-4 rounded bg-white/5"></div>
                        <div className="w-4/6 h-4 rounded bg-white/5"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="h-24 rounded-xl bg-gradient-to-br from-[#20eca2]/40 to-[#1f58f1]/40 border border-white/10"></div>
                        <div className="h-24 rounded-xl bg-white/5 border border-white/10"></div>
                      </div>
                      {/* Floating glowing element */}
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#20eca2] rounded-full blur-[50px] opacity-40"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO SECTION */}
        <PortfolioSection />

        {/* 5. ABOUT SECTION */}
        <section id="about" className="py-24 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-16 text-center border-t-4 border-t-[#20eca2]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">About <span className="text-[#20eca2]">Mindy Dev</span></h2>
              <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed text-justify md:text-center">
                <p>
                  Mindy Dev is a modern digital agency based in Pakistan providing powerful digital solutions to businesses worldwide. Our mission is to help brands grow online through smart marketing strategies, creative design, and high-performance websites.
                </p>
                <p>
                  We believe every business deserves a strong digital presence. That is why we provide professional services with <strong className="text-white">guaranteed quality</strong> and <strong className="text-white">economical pricing</strong>.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. SOLUTIONS SECTION */}
        <section id="solutions" className="py-24 relative z-10 bg-[#1545cc]/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">We Solve Your Digital Problems</h2>
              <p className="text-xl text-white/80">We provide complete solutions for businesses struggling with online growth, branding, marketing, and digital presence.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Branding", icon: <Star className="w-10 h-10" /> },
                { title: "Online Growth", icon: <TrendingUp className="w-10 h-10" /> },
                { title: "Marketing Strategy", icon: <Target className="w-10 h-10" /> },
                { title: "Business Visibility", icon: <Eye className="w-10 h-10" /> },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="flex flex-col items-center justify-center p-10 glass-card rounded-3xl hover:-translate-y-2 transition-transform duration-300 border-b-2 border-b-transparent hover:border-b-[#20eca2]"
                >
                  <div className="text-[#20eca2] mb-6 drop-shadow-[0_0_10px_rgba(32,236,162,0.5)]">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold text-white text-center">{item.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CALL TO ACTION & CONTACT */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left CTA */}
              <motion.div 
                className="relative rounded-3xl p-10 md:p-16 overflow-hidden glass-card border-[#20eca2]/30"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-[#20eca2] opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#20eca2] rounded-full filter blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight relative z-10">
                  Ready To Grow Your <span className="text-[#20eca2] neon-text">Business?</span>
                </h2>
                <p className="text-xl text-white/80 mb-10 relative z-10 max-w-md">
                  Take the first step towards digital dominance. Our experts are ready to build your success story.
                </p>
                <div className="relative z-10">
                  <a href={whatsappProjectUrl} target="_blank" rel="noopener noreferrer">
                    <NeonButton size="lg" className="w-full sm:w-auto text-lg py-6 shadow-[0_0_30px_rgba(32,236,162,0.5)] hover:shadow-[0_0_50px_rgba(32,236,162,0.7)]">
                      Start Your Project on WhatsApp
                    </NeonButton>
                  </a>
                </div>
              </motion.div>

              {/* Right Contact Form */}
              <motion.div 
                className="glass-card p-8 md:p-10 rounded-3xl"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-display font-bold text-white mb-2">Or Drop a Message</h3>
                <p className="text-white/60 mb-8">Prefer email? Send us your inquiry below.</p>
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. FOOTER */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl relative z-10 pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#20eca2] to-[#10b981] flex items-center justify-center shadow-[0_0_10px_rgba(32,236,162,0.4)]">
                  <span className="text-[#1f58f1] font-display font-bold text-lg">M</span>
                </div>
                <span className="font-display font-bold text-2xl tracking-tight text-white">
                  Mindy<span className="text-[#20eca2]">Dev</span>
                </span>
              </div>
              <p className="text-white/60 mb-6 max-w-sm">
                Pakistan's 1st Digital Agency Working with Guarantees & Economical Prices.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 font-display">Quick Links</h4>
              <ul className="space-y-3">
                {["Home", "Services", "About", "Solutions"].map((link) => (
                  <li key={link}>
                    <button 
                      onClick={() => {
                        const element = document.getElementById(link.toLowerCase());
                        if(element) element.scrollIntoView({behavior:'smooth'});
                      }}
                      className="text-white/60 hover:text-[#20eca2] transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 font-display">Contact Us</h4>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center gap-3 text-white/60 hover:text-[#20eca2] transition-colors mb-4 group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#20eca2]/10 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span>Chat on WhatsApp</span>
              </a>
              <p className="text-white/40 text-sm">
                Available 24/7 for your business needs.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
            <p>&copy; {new Date().getFullYear()} Mindy Dev. All rights reserved.</p>
            <p>Pakistan Digital Agency</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
