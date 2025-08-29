import React from 'react';

const agentLabels = [
  'Vision analyst',
  'Situation interpreter',
  'Protocol mapper',
  'Intervention planner',
];

interface MiddlePanelProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  agentRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  agentStates: ('idle' | 'loading' | 'done')[];
  barStates: ('idle' | 'loading' | 'done')[];
}

export default function MiddlePanel({ svgRef, agentRefs, agentStates, barStates }: MiddlePanelProps) {
  return (
    <section className="flex-1 min-w-0 flex flex-col items-center justify-center gap-4 sm:gap-6 rounded-[16px] shadow-xl p-2 sm:p-4 md:p-6 w-full bg-transparent relative">
      {/* SVG en fond */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      {/* Layout responsive */}
      <div className="relative flex flex-col md:flex-row items-center justify-center w-full h-full z-10">
        {/* Orchestrateur */}
        <div
          ref={el => { agentRefs.current[0] = el; }}
          className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-[110px] md:h-[110px] bg-white/10 backdrop-blur-lg rounded-full flex justify-center items-center text-center font-bold text-white shadow-2xl text-xs sm:text-base md:text-[1.1rem] z-[1] transition-all duration-300
            hover:scale-105 hover:shadow-[0_0_32px_0_rgba(144,202,249,0.25)] mx-auto md:mx-0"
          style={{
            boxShadow: '0 4px 32px 0 rgba(80,80,255,0.18), 0 0 0 8px rgba(144,202,249,0.07)',
            background: 'linear-gradient(135deg,rgba(144,202,249,0.18),rgba(111,13,210,0.10))',
          }}
        >
          <span className="drop-shadow-lg select-none">Orchestrateur</span>
        </div>
        {/* Agents */}
        <div className="flex flex-col md:flex-col gap-4 sm:gap-6 md:gap-[2.5rem] justify-center items-center md:ml-8 mt-6 md:mt-0 w-full">
          {agentLabels.map((label, i) => (
            <div
              key={label}
              ref={el => { agentRefs.current[i + 1] = el; }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-[110px] md:h-[110px] bg-white/10 backdrop-blur-lg rounded-full flex justify-center items-center text-center font-bold text-white shadow-2xl text-xs sm:text-base md:text-[1.1rem] z-[1] transition-all duration-300
                hover:scale-105 hover:shadow-[0_0_32px_0_rgba(144,202,249,0.25)]"
              style={{
                boxShadow: '0 4px 32px 0 rgba(80,80,255,0.18), 0 0 0 8px rgba(144,202,249,0.07)',
                background: 'linear-gradient(135deg,rgba(144,202,249,0.18),rgba(111,13,210,0.10))',
              }}
            >
              <span className="drop-shadow-lg select-none">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
