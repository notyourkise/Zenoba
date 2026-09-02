import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/navigation/app-header";
import { CosmicBackground } from "@/components/effects/cosmic-background";
import { FourPillarsEcosystem } from "@/components/marketing/four-pillars-ecosystem";
import { ItInfrastructureJourney } from "@/components/marketing/it-infrastructure-journey";
import { LiveSimulatorShowcase } from "@/components/marketing/live-simulator-showcase";
import { InteractiveFaq } from "@/components/marketing/interactive-faq";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Button } from "@/components/ui/button";
import { SlidingButtonLabel } from "@/components/ui/sliding-button-label";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-black dark:text-white selection:bg-blue-500 selection:text-white">
      {/* AppHeader Navigation */}
      <AppHeader user={user} />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH EXPANSIVE CELESTIAL CANVAS & ACTION BUTTON           */}
      {/* ========================================================================= */}
      <main className="relative min-h-[115vh] sm:min-h-[120vh] lg:min-h-[125vh] flex flex-col items-center justify-center px-8 sm:px-16 lg:px-24 pt-24 pb-44 sm:pb-56 overflow-hidden">
        {/* Cosmic Celestial Elements (Stars, Planet, Black Hole, White Hole, Galaxy - Dark Mode only) */}
        <CosmicBackground />

        {/* Uniform Clean Square Blueprint Grid across Hero (White Theme Only) */}
        <div
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,white_85%,transparent_100%)] dark:hidden"
          aria-hidden="true"
        />

        {/* Content Container (Short Concise Title & Jelajahi Action Button) */}
        <div className="relative z-30 w-full max-w-4xl mx-auto px-6 sm:px-12 text-center flex flex-col items-center justify-center">
          {/* Concise Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-black dark:text-white max-w-3xl mx-auto leading-tight mb-8">
            Kuasai IT Infrastructure Lewat{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Praktik Interaktif
            </span>
          </h1>

          {/* Action Button 'Jelajahi' to navigate to next section */}
          <div className="flex items-center justify-center">
            <Button
              asChild
              className="group h-10 min-w-[110px] sm:min-w-[120px] px-6 py-2 rounded-full bg-white hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-100 text-black dark:text-black border border-gray-300 dark:border-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <a
                href="#jelajahi"
                className="inline-flex items-center justify-center text-center"
              >
                <SlidingButtonLabel
                  text="Jelajahi"
                  className="text-sm font-semibold text-black dark:text-black tracking-wide"
                  containerClassName="h-5"
                />
              </a>
            </Button>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 2. NEXT SECTION: 4 PILAR PEMBELAJARAN (PLANET BUMI KNOWLEDGE CORE)       */}
      {/* ========================================================================= */}
      <FourPillarsEcosystem />

      <ItInfrastructureJourney />

      {/* ========================================================================= */}
      {/* 4. LIVE INTERACTIVE SIMULATOR SHOWCASE (TERMINAL, SUBNET, PACKET FLOW)    */}
      {/* ========================================================================= */}
      <LiveSimulatorShowcase />

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE FAQ (TANYA JAWAB UMUM & KURIKULUM)                         */}
      {/* ========================================================================= */}
      <InteractiveFaq />

      {/* ========================================================================= */}
      {/* 6. FINAL CTA & MARKETING FOOTER                                           */}
      {/* ========================================================================= */}
      <MarketingFooter />
    </div>
  );
}
