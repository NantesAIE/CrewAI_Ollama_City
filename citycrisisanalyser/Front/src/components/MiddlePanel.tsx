import React, { useEffect, useRef, useState } from 'react';
import '../styles/MiddlePanel.css';

const agentLabels = [
  'Vision analyst',
  'Situation interpreter',
  'Protocol mapper',
  'Intervention planner',
];

interface MiddlePanelProps {
  agentRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  agentStates: ('idle' | 'loading' | 'done')[];
  barStates: ('idle' | 'loading' | 'done')[];
}

export default function MiddlePanel({ agentRefs, agentStates, barStates }: MiddlePanelProps) {
  const NAVBAR_HEIGHT = 90;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialisation des refs et vérification de leur disponibilité
  useEffect(() => {
    const checkRefs = setInterval(() => {
      if (agentRefs.current.every(ref => ref !== null)) {
        setIsReady(true);
        clearInterval(checkRefs);
      }
    }, 100);

    return () => clearInterval(checkRefs);
  }, [agentRefs.current]);

  function getCenters() {
    return agentRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const parentRect = svgRef.current?.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - (parentRect?.left ?? 0),
        y: rect.top + rect.height / 2 - (parentRect?.top ?? 0),
      };
    });
  }

  const centers = getCenters();

  return (
    <section
      className="flex-1 min-w-0 flex flex-col items-center justify-center rounded-[16px] p-2 sm:p-4 md:p-6 w-full bg-transparent relative overflow-hidden"
      style={{
        minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        maxHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* SVG pour les barres */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ left: 0, top: 0 }}
        >
          <defs>
            <linearGradient id="bar-green" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#43A047" />
              <stop offset="100%" stopColor="#39ff14" />
            </linearGradient>
          </defs>
          {/* Affichage des barres dès que les refs sont prêtes */}
          {isReady && centers.slice(1).map((agent, i) => {
            const orchestrator = centers[0];
            const x1 = orchestrator.x;
            const y1 = orchestrator.y;
            const x2 = agent.x;
            const y2 = agent.y;

            return (
              <g key={`bar-${i}`}>
                {/* Barre blanche */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#fff"
                  strokeWidth={3}
                  opacity={0.7}
                  strokeLinecap="round"
                />
                {/* Barre verte si done */}
                {barStates[i] === 'done' && (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#bar-green)"
                    strokeWidth={3}
                    opacity={0.95}
                    strokeLinecap="round"
                    style={{ transition: 'stroke 0.4s' }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Glow CSS avec animation fluide */}
        {isReady && centers.slice(1).map((agent, i) => {
          if (barStates[i] !== 'loading') return null;
          const orchestrator = centers[0];
          const dx = agent.x - orchestrator.x;
          const dy = agent.y - orchestrator.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          const x1 = orchestrator.x;
          const y1 = orchestrator.y;

          return (
            <div
              key={`glow-${i}`}
              className="glow-bar"
              style={{
                width: `${length}px`,
                left: `${x1}px`,
                top: `${y1}px`,
                transform: `rotate(${angle}rad)`,
                transformOrigin: '0 0',
              }}
            />
          );
        })}

        {/* Cercles des agents */}
        <div className="relative flex flex-row items-center justify-center w-full h-full z-10 gap-8 md:gap-16">
          <div className="flex flex-col items-center justify-center w-1/2">
            <div
              ref={el => { agentRefs.current[0] = el; }}
              className="agent-circle"
            >
              <span className="drop-shadow-lg select-none">Orchestrateur</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-1/2 gap-4 sm:gap-6 md:gap-[2.5rem]">
            {agentLabels.map((label, i) => (
              <div
                key={label}
                ref={el => { agentRefs.current[i + 1] = el; }}
                className="agent-circle"
              >
                <span className="drop-shadow-lg select-none">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
