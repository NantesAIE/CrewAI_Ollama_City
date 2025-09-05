import React from 'react';

export default function PresentationSection() {
  return (
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
              <div className="text-white/60 text-xs text-center">Propose les protocoles d’intervention adaptés grâce a un PDF en entrée.</div>
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
  );
}