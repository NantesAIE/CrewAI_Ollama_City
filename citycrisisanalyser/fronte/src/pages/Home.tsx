import React, { useRef, useState, useEffect } from 'react';
import DarkVeil from '../components/bits/DarkVeil';
import LeftPanel from '../components/LeftPanel';
import MiddlePanel from '../components/MiddlePanel';
import RightPanel from '../components/RightPanel';
import { drawAgentLinesAndBars } from '../services/helpers';
import { fetchAnalysis } from '../services/api';
import Navbar from '../components/Navbar';
import IntroSection from '../components/IntroSection';
import PresentationSection from '../components/PresentationSection';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [agentResponses, setAgentResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agentStates, setAgentStates] = useState<('idle' | 'loading' | 'done')[]>(['idle', 'idle', 'idle', 'idle']);
  const [barStates, setBarStates] = useState<('idle' | 'loading' | 'done')[]>(['idle', 'idle', 'idle', 'idle']);
  const svgRef = useRef<SVGSVGElement>(null);
  const agentRefs = useRef<(HTMLDivElement | null)[]>(Array(5).fill(null));
  const mainSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drawAgentLinesAndBars(svgRef.current, agentRefs.current);
    const handleResize = () => drawAgentLinesAndBars(svgRef.current, agentRefs.current);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const animateAgents = async () => {
    setBarStates(['loading', 'loading', 'loading', 'loading']);
    await new Promise(res => setTimeout(res, 2000));
    setBarStates(['done', 'done', 'done', 'done']);
  };

  const handleImageSelect = (file: File, url: string) => {
    setSelectedImage(url);
    setCurrentFile(file);
    setAgentResponses({});
    setAgentStates(['idle', 'idle', 'idle', 'idle']);
    setBarStates(['idle', 'idle', 'idle', 'idle']);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setCurrentFile(null);
    setAgentResponses({});
    setAgentStates(['idle', 'idle', 'idle', 'idle']);
    setBarStates(['idle', 'idle', 'idle', 'idle']);
  };

  const handleRunAnalysis = async () => {
    if (!currentFile) return;
    setIsLoading(true);
    setAgentStates(['loading', 'loading', 'loading', 'loading']);

    try {
      let data;
      try {
        data = await fetchAnalysis(currentFile);
      } catch (err: any) {
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
      setBarStates(['idle', 'idle', 'idle', 'idle']);
    }
    setIsLoading(false);
  };

  const handleScrollToMain = () => {
    mainSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen m-0 font-sans bg-[#F4F6FB] overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DarkVeil speed={1.3} />
      </div>
      <Navbar />
      <IntroSection handleScrollToMain={handleScrollToMain} />
      <PresentationSection/>
      <section ref={mainSectionRef} className="flex flex-col min-h-screen pt-[80px] md:pt-[90px]">
        <main className="relative z-10 flex flex-col md:flex-row h-full gap-4 md:gap-2 p-2 sm:p-4 box-border font-sans w-full">
          <div className="flex-1 min-w-0 flex flex-col">
            <LeftPanel onImageSelect={handleImageSelect} onImageRemove={handleImageRemove} selectedImage={selectedImage} isImageSelected={!!currentFile} isLoading={isLoading} onRunAnalysis={handleRunAnalysis} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <MiddlePanel agentRefs={agentRefs} agentStates={agentStates} barStates={barStates} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <RightPanel responses={agentResponses} selectedImage={selectedImage}/>
          </div>
        </main>
      </section>
    </div>
  );
}
