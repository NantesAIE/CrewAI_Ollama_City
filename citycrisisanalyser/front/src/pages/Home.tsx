import React, { useRef, useState, useEffect } from 'react';
import DarkVeil from '../components/bits/DarkVeil';
import LeftPanel from '../components/LeftPanel';
import MiddlePanel from '../components/MiddlePanel';
import RightPanel from '../components/RightPanel';
import GlassSurface from '../components/bits/GlassSurface';
import { drawAgentLinesAndBars } from '../services/helpers';
import SplitText from '../components/bits/SplitText';
import { fetchAnalysis } from '../services/api';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [agentResponses, setAgentResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agentStates, setAgentStates] = useState<('idle' | 'loading' | 'done')[]>(['idle', 'idle', 'idle', 'idle']);
  const [barStates, setBarStates] = useState<('idle' | 'loading' | 'done')[]>(['idle', 'idle', 'idle', 'idle']);

  const svgRef = useRef<SVGSVGElement>(null);
  const agentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainSectionRef = useRef<HTMLDivElement>(null);
  const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

  // Animation des barres SVG
  useEffect(() => {
    drawAgentLinesAndBars(svgRef.current, agentRefs.current);
    const handleResize = () => drawAgentLinesAndBars(svgRef.current, agentRefs.current);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation des agents
  const animateAgents = async () => {
    // Animation séquentielle des barres
    setBarStates(['loading', 'idle', 'idle', 'idle']);
    await new Promise(res => setTimeout(res, 400));
    setBarStates(['done', 'loading', 'idle', 'idle']);
    await new Promise(res => setTimeout(res, 400));
    setBarStates(['done', 'done', 'loading', 'idle']);
    await new Promise(res => setTimeout(res, 400));
    setBarStates(['done', 'done', 'done', 'loading']);
    await new Promise(res => setTimeout(res, 400));
    setBarStates(['done', 'done', 'done', 'done']);
  };

  // Sélection image
  const handleImageSelect = (file: File, url: string) => {
    setSelectedImage(url);
    setCurrentFile(file);
    setAgentResponses({});
    setAgentStates(['idle', 'idle', 'idle', 'idle']);
  };

  // Suppression image
  const handleImageRemove = () => {
    setSelectedImage(null);
    setCurrentFile(null);
    setAgentResponses({});
    setAgentStates(['idle', 'idle', 'idle', 'idle']);
  };

  // Lancer l'analyse
  const handleRunAnalysis = async () => {
    if (!currentFile) return;
    setIsLoading(true);
    setAgentStates(['loading', 'loading', 'loading', 'loading']);

    try {
      // Utilise la fonction du service
      let data;
      try {
        data = await fetchAnalysis(currentFile);
      } catch (err: any) {
        // Si 404, surcharge avec un JSON de test
        if (err?.response?.status === 404 || err?.message?.includes('404')) {
          data = {
            vision_analysis: [{ output: "Détection d'une inondation urbaine." }],
            situation_interpreter: [{ output: "Situation critique, intervention urgente requise." }],
            protocol_mapper: [{ output: "Déployer les équipes de secours, installer des barrières anti-inondation." }],
            intervention_planner: [{ output: "Prioriser l'évacuation des habitants et la sécurisation des zones à risque." }]
          };
        } else {
          throw err;
        }
      }

      await animateAgents();

      setAgentResponses({
        vision: data.vision_analysis?.[0]?.output || '',
        situation: data.situation_interpreter?.[0]?.output || '',
        protocol: data.protocol_mapper?.[0]?.output || '',
        intervention: data.intervention_planner?.[0]?.output || '',
      });
      setAgentStates(['done', 'done', 'done', 'done']);
    } catch (e) {
      setAgentResponses({
        vision: 'Erreur lors de l\'analyse.',
        situation: '',
        protocol: '',
        intervention: '',
      });
      setAgentStates(['idle', 'idle', 'idle', 'idle']);
    }
    setIsLoading(false);
  };

  const handleScrollToMain = () => {
    mainSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen m-0 font-sans bg-[#F4F6FB] overflow-x-hidden relative">
      {/* Fond visuel */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DarkVeil speed={1.3} />
      </div>
      {/* NAVBAR FIXE EN HAUT */}
      <div className="fixed top-0 left-0 w-full z-20 flex justify-center pointer-events-none">
        <GlassSurface
          backgroundOpacity={0.1}
          saturation={1}
          displace={0.5}
          distortionScale={-10}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          brightness={50}
          opacity={0.93}
          mixBlendMode="screen" 
          width="100%"
          height="70px"
          className="rounded-none backdrop-blur-md md:rounded-[2rem] mx-0 md:mx-2 mt-0 md:mt-2 pointer-events-auto"
        >
          <nav className="flex justify-between items-center h-[70px] px-2 sm:px-4 md:px-8 w-full">
            <div className="flex items-center gap-0">
              <span className="text-2xl mr-2">
                <img className="w-24 sm:w-28 md:w-32" src="/logo-Cap.svg" />
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-6 ml-auto">
              <a href="#" className="text-white/90 hover:text-[#90caf9] font-medium text-base sm:text-lg transition">CrewAI</a>
              <a href="#" className="text-white/90 hover:text-[#90caf9] font-medium text-base sm:text-lg transition">Docs</a>
            </div>
          </nav>
        </GlassSurface>
      </div>
      {/* SECTION INTRO PLEIN ÉCRAN */}
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
      {/* SECTION ÉQUIPE D'AGENTS IA */}
      <section className="w-full py-8 md:py-14 bg-transparent">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 text-center drop-shadow">
            Découvrez l'équipe d'agents IA
          </h2>
          <p className="text-white/80 text-base sm:text-lg md:text-xl text-center mb-8 drop-shadow">
            Nos agents spécialisés collaborent pour analyser chaque situation de crise urbaine, de la vision à la planification d’intervention.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Vision Analyst */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-200">
              <div className="bg-[#1976D2] text-white font-bold rounded-lg w-12 h-12 flex items-center justify-center text-lg mb-3 shadow-md">
                VA
              </div>
              <div className="text-white font-semibold text-lg mb-1 text-center">Vision Analyst</div>
              <div className="text-white/80 text-sm text-center mb-1">Détection visuelle</div>
              <div className="text-white/60 text-xs text-center">Analyse l’image et détecte les éléments clés de la scène.</div>
            </div>
            {/* Situation Interpreter */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-200">
              <div className="bg-[#43A047] text-white font-bold rounded-lg w-12 h-12 flex items-center justify-center text-lg mb-3 shadow-md">
                SI
              </div>
              <div className="text-white font-semibold text-lg mb-1 text-center">Situation Interpreter</div>
              <div className="text-white/80 text-sm text-center mb-1">Interprétation</div>
              <div className="text-white/60 text-xs text-center">Interprète la situation à partir des éléments détectés.</div>
            </div>
            {/* Protocol Mapper */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-200">
              <div className="bg-[#6f0dd2] text-white font-bold rounded-lg w-12 h-12 flex items-center justify-center text-lg mb-3 shadow-md">
                PM
              </div>
              <div className="text-white font-semibold text-lg mb-1 text-center">Protocol Mapper</div>
              <div className="text-white/80 text-sm text-center mb-1">Protocole</div>
              <div className="text-white/60 text-xs text-center">Propose les protocoles d’intervention adaptés.</div>
            </div>
            {/* Intervention Planner */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-200">
              <div className="bg-[#ff9800] text-white font-bold rounded-lg w-12 h-12 flex items-center justify-center text-lg mb-3 shadow-md">
                IP
              </div>
              <div className="text-white font-semibold text-lg mb-1 text-center">Intervention Planner</div>
              <div className="text-white/80 text-sm text-center mb-1">Planification</div>
              <div className="text-white/60 text-xs text-center">Planifie les actions concrètes à mener sur le terrain.</div>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION PRINCIPALE */}
      <section ref={mainSectionRef} className="flex flex-col min-h-screen pt-[80px] md:pt-[90px]">
        <main className="relative z-10 flex flex-col md:flex-row h-full gap-4 md:gap-2 p-2 sm:p-4 box-border font-sans w-full">
          <div className="flex-1 min-w-0 flex flex-col">
            <LeftPanel
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              selectedImage={selectedImage}
              isImageSelected={!!currentFile}
              isLoading={isLoading}
              onRunAnalysis={handleRunAnalysis}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <MiddlePanel
              svgRef={svgRef}
              agentRefs={agentRefs}
              agentStates={agentStates}
              barStates={barStates}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <RightPanel responses={agentResponses} />
          </div>
        </main>
      </section>
    </div>
  );
}
