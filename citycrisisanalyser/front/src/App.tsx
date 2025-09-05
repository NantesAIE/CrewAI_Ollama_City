import React, { useState, useEffect, useRef } from 'react';
import LeftPanel from './components/LeftPanel';
import MiddlePanel from './components/MiddlePanel';
import RightPanel from './components/RightPanel';
import { drawAgentLinesAndBars } from './services/helpers';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [agentResponses, setAgentResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const agentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainSectionRef = useRef<HTMLDivElement>(null);
  const [barStates, setBarStates] = useState<('idle' | 'loading' | 'done')[]>(['idle', 'idle', 'idle', 'idle']);
  const [agentStates, setAgentStates] = useState<('idle' | 'loading' | 'done')[]>(['idle', 'idle', 'idle', 'idle']);
  
  


  useEffect(() => {
    drawAgentLinesAndBars(svgRef.current, agentRefs.current);
    window.addEventListener('resize', () => drawAgentLinesAndBars(svgRef.current, agentRefs.current));
    return () => window.removeEventListener('resize', () => drawAgentLinesAndBars(svgRef.current, agentRefs.current));
  }, []);

  const handleImageSelect = (file: File, url: string) => {
    setSelectedImage(url);
    setCurrentFile(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setCurrentFile(null);
  };

  const handleRunAnalysis = async () => {
    if (!currentFile) return;
    setIsLoading(true);
    // Logique d'appel API ou simulation ici
    setIsLoading(false);
  };

  return (
    <div className="h-screen m-0 font-sans bg-[#F4F6FB] overflow-hidden">
      <main className="flex flex-col h-screen gap-2 p-2 box-border font-sans md:flex-row">
        
        <LeftPanel
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
          selectedImage={selectedImage}
          isImageSelected={!!currentFile}
          isLoading={isLoading}
          onRunAnalysis={handleRunAnalysis}
        />
        <MiddlePanel
            agentRefs={agentRefs}
            agentStates={agentStates}
            barStates={barStates}
        />
        <RightPanel responses={agentResponses} selectedImage={selectedImage}/>
      </main>
    </div>
  );
}
