import React from "react";
import SplitText from '../components/bits/SplitText';

export default function IntroSection({ handleScrollToMain }: { handleScrollToMain: () => void }) {

    const handleAnimationComplete = () => {
        console.log('All letters have animated!');
    }

  return (
    <section className="w-full min-h-screen flex flex-col gap-5 items-center justify-center pt-[80px] md:pt-[90px] relative z-10 px-2 sm:px-4">
        <SplitText
          text="City Crisis Analyser"
          className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-white"
          delay={20}
          duration={1}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
        />
        <SplitText
          text="Analysez automatiquement des situations de crise urbaine à partir d’images. 
            L'équipe IA détecte, interprète et propose des protocoles d’intervention adaptés pour aider les équipes de secours et les décideurs."
          className="text-base sm:text-lg md:text-2xl text-white/90 text-center max-w-xs sm:max-w-xl md:max-w-2xl drop-shadow"
          delay={20}
          duration={1}
          ease="power3.out"
          splitType="lines"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
        />
        {/* BOUTON SCROLL */}
        <button
          onClick={handleScrollToMain}
          className="mt-8 sm:mt-10 px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-[#1976D2] to-[#6f0dd2] text-white text-base sm:text-lg font-semibold shadow-xl flex items-center gap-2 sm:gap-3 transition-all duration-200 hover:scale-105 hover:from-[#1565C0] hover:to-[#953cef] focus:outline-none border-none backdrop-blur-md"
          style={{
            boxShadow: '0 8px 32px 0 rgba(80,80,255,0.18), 0 1.5px 8px 0 rgba(67,160,71,0.10)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span>Découvrir l’outil</span>
          <span className="animate-bounce">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      </section>
    );
}