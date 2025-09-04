import React from 'react';

export default function Navbar() {
  return (
      <div className="fixed top-0 left-0 w-full z-20 flex justify-center pointer-events-none">
        
          <nav className="flex justify-between items-center h-[70px] px-2 sm:px-4 md:px-8 w-full pointer-events-auto shadow-lg bg-white/10 backdrop-blur-md rounded-2xl">
            <div className="flex items-center gap-0">
              <span className="text-2xl mr-2">
                <img className="w-24 sm:w-28 md:w-32" src="/logo-Cap.svg" />
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-6 ml-auto">
              <a href="https://letsdemo.capgemini.com/" className="text-white/90 hover:text-[#90caf9] font-sm transition">Démonstrateur AIE</a>
            </div>
          </nav>
      </div>
  );
}