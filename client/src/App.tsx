import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CursorEffect } from "@/components/CursorEffect";
import { SiWhatsapp } from "react-icons/si";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import GetFreeWebsite from "@/pages/GetFreeWebsite";

const WHATSAPP_URL =
  "https://wa.me/923289789178?text=Hello%20Mindy%20Dev%2C%20I%20am%20interested%20in%20your%20digital%20services";

function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="button-whatsapp-floating"
      className="fixed bottom-6 right-6 z-[999] flex items-center gap-2 group"
      style={{ filter: "drop-shadow(0 0 16px rgba(37,211,102,0.6))" }}
    >
      <span className="hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 bg-[#111] text-white text-sm font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap pointer-events-none"
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
        Chat with us
      </span>
      <div className="relative w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #25d366 0%, #128c5e 100%)", animation: "whatsapp-pulse 2s infinite" }}>
        <SiWhatsapp className="w-7 h-7 text-white" />
      </div>
      <style>{`
        @keyframes whatsapp-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.55); }
          70%  { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
      `}</style>
    </a>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/get-free-website" component={GetFreeWebsite} />
      <Route path="/mindydev-admin-x7k2" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CursorEffect />
        <WhatsAppButton />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
